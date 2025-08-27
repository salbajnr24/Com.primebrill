import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, addDoc, query, where, orderBy } from "firebase/firestore";
import { Order } from "@shared/schema";
import { CreateOrderRequest } from "@shared/types/order";

export async function createOrder(orderData: CreateOrderRequest): Promise<Order> {
  try {
    const orderDoc = {
      userId: orderData.userId,
      status: "pending",
      total: orderData.total,
      shippingAddress: orderData.shippingAddress,
      createdAt: new Date(),
    };

    const docRef = await addDoc(collection(db, "orders"), orderDoc);
    
    // Create order items
    for (const item of orderData.items) {
      await addDoc(collection(db, "orderItems"), {
        orderId: docRef.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      });
    }
    
    const newOrder = await getOrder(docRef.id);
    if (!newOrder) {
      throw new Error("Failed to create order");
    }
    
    return newOrder;
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Failed to create order");
  }
}

export async function getOrder(id: string): Promise<Order | null> {
  try {
    const docRef = doc(db, "orders", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Order;
    }
    return null;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw new Error("Failed to fetch order");
  }
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw new Error("Failed to fetch orders");
  }
}

export async function getAllOrders(): Promise<Order[]> {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, orderBy("createdAt", "desc"));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw new Error("Failed to fetch orders");
  }
}
