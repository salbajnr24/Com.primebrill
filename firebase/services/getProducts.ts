import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit 
} from "firebase/firestore";
import { db } from "../config";
import { Product } from "@shared/types/Product";

export async function getProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(db, "products");
    const q = query(
      productsRef, 
      where("isActive", "==", true),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Product[];
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Failed to fetch products");
  }
}

export async function getFeaturedProducts(limitCount: number = 8): Promise<Product[]> {
  try {
    const productsRef = collection(db, "products");
    const q = query(
      productsRef,
      where("isActive", "==", true),
      where("stock", ">", 0),
      orderBy("stock", "desc"),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Product[];
  } catch (error) {
    console.error("Error fetching featured products:", error);
    throw new Error("Failed to fetch featured products");
  }
}