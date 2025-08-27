import { 
  collection, 
  addDoc, 
  runTransaction,
  doc 
} from "firebase/firestore";
import { db } from "../config";
import { CreateOrderInput, Order } from "@shared/types/Order";

export async function placeOrder(orderData: CreateOrderInput): Promise<Order> {
  try {
    return await runTransaction(db, async (transaction) => {
      // Create the main order document
      const orderRef = doc(collection(db, "orders"));
      const orderDoc = {
        userId: orderData.userId,
        status: "pending" as const,
        total: orderData.total,
        shippingAddress: orderData.shippingAddress,
        createdAt: new Date(),
        items: orderData.items,
      };

      transaction.set(orderRef, orderDoc);

      // Update product stock for each item
      for (const item of orderData.items) {
        const productRef = doc(db, "products", item.productId);
        const productSnap = await transaction.get(productRef);
        
        if (productSnap.exists()) {
          const currentStock = productSnap.data().stock || 0;
          const newStock = Math.max(0, currentStock - item.quantity);
          transaction.update(productRef, { 
            stock: newStock,
            updatedAt: new Date()
          });
        }
      }

      return {
        id: orderRef.id,
        ...orderDoc,
        items: orderData.items.map(item => ({
          id: `${orderRef.id}-${item.productId}`,
          productId: item.productId,
          productName: '', // Would be populated from product data
          quantity: item.quantity,
          price: item.price,
          total: (parseFloat(item.price) * item.quantity).toFixed(2),
        })),
      } as Order;
    });
  } catch (error) {
    console.error("Error placing order:", error);
    throw new Error("Failed to place order");
  }
}