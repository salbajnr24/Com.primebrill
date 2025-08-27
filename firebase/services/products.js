import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  startAfter
} from "firebase/firestore";
import { db } from "../config.js";

/**
 * Get all products with optional filtering and pagination
 */
export async function getProducts(filters = {}) {
  try {
    const productsRef = collection(db, "products");
    let q = query(productsRef, where("isActive", "==", true));

    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      q = query(q, where("category", "==", filters.category));
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-low':
          q = query(q, orderBy("price", "asc"));
          break;
        case 'price-high':
          q = query(q, orderBy("price", "desc"));
          break;
        case 'newest':
          q = query(q, orderBy("createdAt", "desc"));
          break;
        default:
          q = query(q, orderBy("name", "asc"));
      }
    } else {
      q = query(q, orderBy("name", "asc"));
    }

    // Apply pagination
    if (filters.limit) {
      q = query(q, limit(filters.limit));
    }

    if (filters.startAfter) {
      q = query(q, startAfter(filters.startAfter));
    }

    const querySnapshot = await getDocs(q);
    let products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
    }));

    // Apply search filter (client-side for better UX)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      products = products.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category.toLowerCase().includes(searchLower)
      );
    }

    return {
      products,
      lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
      hasMore: querySnapshot.docs.length === (filters.limit || 20)
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error(`Failed to fetch products: ${error.message}`);
  }
}

/**
 * Get a single product by ID
 */
export async function getProduct(productId) {
  try {
    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);
    
    if (!productSnap.exists()) {
      return null;
    }

    return {
      id: productSnap.id,
      ...productSnap.data(),
      createdAt: productSnap.data().createdAt?.toDate?.() || productSnap.data().createdAt
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error(`Failed to fetch product: ${error.message}`);
  }
}

/**
 * Create a new product
 */
export async function createProduct(productData) {
  try {
    const docRef = await addDoc(collection(db, "products"), {
      ...productData,
      isActive: true,
      createdAt: new Date(),
      stock: parseInt(productData.stock) || 0,
      price: parseFloat(productData.price).toFixed(2)
    });

    return await getProduct(docRef.id);
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error(`Failed to create product: ${error.message}`);
  }
}

/**
 * Update an existing product
 */
export async function updateProduct(productId, updateData) {
  try {
    const productRef = doc(db, "products", productId);
    
    // Clean update data
    const cleanData = { ...updateData };
    if (cleanData.stock !== undefined) {
      cleanData.stock = parseInt(cleanData.stock) || 0;
    }
    if (cleanData.price !== undefined) {
      cleanData.price = parseFloat(cleanData.price).toFixed(2);
    }

    await updateDoc(productRef, {
      ...cleanData,
      updatedAt: new Date()
    });

    return await getProduct(productId);
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error(`Failed to update product: ${error.message}`);
  }
}

/**
 * Delete a product (soft delete by setting isActive to false)
 */
export async function deleteProduct(productId) {
  try {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, {
      isActive: false,
      deletedAt: new Date()
    });

    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error(`Failed to delete product: ${error.message}`);
  }
}

/**
 * Get products by category
 */
export async function getProductsByCategory(category, limitCount = 20) {
  try {
    const productsRef = collection(db, "products");
    const q = query(
      productsRef,
      where("category", "==", category),
      where("isActive", "==", true),
      orderBy("name", "asc"),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
    }));
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw new Error(`Failed to fetch products by category: ${error.message}`);
  }
}

/**
 * Get featured/popular products
 */
export async function getFeaturedProducts(limitCount = 8) {
  try {
    const productsRef = collection(db, "products");
    const q = query(
      productsRef,
      where("isActive", "==", true),
      where("stock", ">", 0),
      orderBy("stock", "desc"),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
    }));
  } catch (error) {
    console.error("Error fetching featured products:", error);
    throw new Error(`Failed to fetch featured products: ${error.message}`);
  }
}

/**
 * Update product stock
 */
export async function updateProductStock(productId, newStock) {
  try {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, {
      stock: parseInt(newStock) || 0,
      updatedAt: new Date()
    });

    return await getProduct(productId);
  } catch (error) {
    console.error("Error updating product stock:", error);
    throw new Error(`Failed to update product stock: ${error.message}`);
  }
}
