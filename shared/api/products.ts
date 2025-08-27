import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy } from "firebase/firestore";
import { Product, InsertProduct } from "@shared/schema";
import { ProductFilters } from "@shared/types/product";

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  try {
    const productsRef = collection(db, "products");
    let q = query(productsRef, where("isActive", "==", true));

    if (filters.category) {
      q = query(q, where("category", "==", filters.category));
    }

    const snapshot = await getDocs(q);
    let products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      products = products.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-low':
          products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
          break;
        case 'price-high':
          products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
          break;
        case 'newest':
          products.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          });
          break;
        default:
          products.sort((a, b) => a.name.localeCompare(b.name));
      }
    }

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    return null;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw new Error("Failed to fetch product");
  }
}

export async function createProduct(productData: InsertProduct): Promise<Product> {
  try {
    const docRef = await addDoc(collection(db, "products"), {
      ...productData,
      isActive: true,
      createdAt: new Date(),
    });
    
    const newProduct = await getProduct(docRef.id);
    if (!newProduct) {
      throw new Error("Failed to create product");
    }
    
    return newProduct;
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }
}

export async function updateProduct(id: string, productData: Partial<InsertProduct>): Promise<void> {
  try {
    const docRef = doc(db, "products", id);
    await updateDoc(docRef, productData);
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product");
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    const docRef = doc(db, "products", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("Failed to delete product");
  }
}
