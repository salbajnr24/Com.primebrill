import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  writeBatch,
  runTransaction
} from "firebase/firestore";
import { db } from "../config.js";

/**
 * Create a new order with order items
 */
export async function createOrder(orderData) {
  try {
    return await runTransaction(db, async (transaction) => {
      // Create the main order document
      const orderRef = doc(collection(db, "orders"));
      const orderDoc = {
        userId: orderData.userId,
        status: "pending",
        total: parseFloat(orderData.total).toFixed(2),
        shippingAddress: orderData.shippingAddress,
        createdAt: new Date(),
        items: orderData.items || []
      };

      transaction.set(orderRef, orderDoc);

      // Create order items subcollection if items exist
      if (orderData.items && orderData.items.length > 0) {
        for (const item of orderData.items) {
          const orderItemRef = doc(collection(db, "orders", orderRef.id, "items"));
          const orderItemDoc = {
            productId: item.productId,
            quantity: parseInt(item.quantity),
            price: parseFloat(item.price).toFixed(2),
            total: (parseFloat(item.price) * parseInt(item.quantity)).toFixed(2),
            createdAt: new Date()
          };
          transaction.set(orderItemRef, orderItemDoc);

          // Update product stock
          const productRef = doc(db, "products", item.productId);
          const productSnap = await transaction.get(productRef);
          
          if (productSnap.exists()) {
            const currentStock = productSnap.data().stock || 0;
            const newStock = Math.max(0, currentStock - parseInt(item.quantity));
            transaction.update(productRef, { 
              stock: newStock,
              updatedAt: new Date()
            });
          }
        }
      }

      return {
        id: orderRef.id,
        ...orderDoc
      };
    });
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error(`Failed to create order: ${error.message}`);
  }
}

/**
 * Get order by ID with items
 */
export async function getOrder(orderId) {
  try {
    const orderRef = doc(db, "orders", orderId);
    const orderSnap = await getDoc(orderRef);
    
    if (!orderSnap.exists()) {
      return null;
    }

    // Get order items
    const itemsRef = collection(db, "orders", orderId, "items");
    const itemsSnap = await getDocs(itemsRef);
    const items = itemsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
    }));

    return {
      id: orderSnap.id,
      ...orderSnap.data(),
      createdAt: orderSnap.data().createdAt?.toDate?.() || orderSnap.data().createdAt,
      items
    };
  } catch (error) {
    console.error("Error fetching order:", error);
    throw new Error(`Failed to fetch order: ${error.message}`);
  }
}

/**
 * Get orders for a specific user
 */
export async function getUserOrders(userId, limitCount = 50) {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const orders = await Promise.all(
      querySnapshot.docs.map(async (orderDoc) => {
        // Get items for each order
        const itemsRef = collection(db, "orders", orderDoc.id, "items");
        const itemsSnap = await getDocs(itemsRef);
        const items = itemsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
        }));

        return {
          id: orderDoc.id,
          ...orderDoc.data(),
          createdAt: orderDoc.data().createdAt?.toDate?.() || orderDoc.data().createdAt,
          items
        };
      })
    );

    return orders;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw new Error(`Failed to fetch user orders: ${error.message}`);
  }
}

/**
 * Get all orders (admin function)
 */
export async function getAllOrders(limitCount = 100) {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
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
    console.error("Error fetching all orders:", error);
    throw new Error(`Failed to fetch all orders: ${error.message}`);
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId, newStatus) {
  try {
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid status: ${newStatus}. Valid statuses are: ${validStatuses.join(', ')}`);
    }

    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status: newStatus,
      updatedAt: new Date(),
      [`${newStatus}At`]: new Date() // Add timestamp for status change
    });

    return await getOrder(orderId);
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new Error(`Failed to update order status: ${error.message}`);
  }
}

/**
 * Cancel an order
 */
export async function cancelOrder(orderId, reason = "") {
  try {
    return await runTransaction(db, async (transaction) => {
      const orderRef = doc(db, "orders", orderId);
      const orderSnap = await transaction.get(orderRef);
      
      if (!orderSnap.exists()) {
        throw new Error("Order not found");
      }

      const orderData = orderSnap.data();
      
      // Only allow cancellation if order is pending or processing
      if (!['pending', 'processing'].includes(orderData.status)) {
        throw new Error(`Cannot cancel order with status: ${orderData.status}`);
      }

      // Update order status
      transaction.update(orderRef, {
        status: 'cancelled',
        cancelledAt: new Date(),
        cancellationReason: reason,
        updatedAt: new Date()
      });

      // Restore product stock if order was already processing
      if (orderData.status === 'processing' && orderData.items) {
        for (const item of orderData.items) {
          const productRef = doc(db, "products", item.productId);
          const productSnap = await transaction.get(productRef);
          
          if (productSnap.exists()) {
            const currentStock = productSnap.data().stock || 0;
            const newStock = currentStock + parseInt(item.quantity);
            transaction.update(productRef, { 
              stock: newStock,
              updatedAt: new Date()
            });
          }
        }
      }

      return {
        id: orderId,
        ...orderData,
        status: 'cancelled',
        cancelledAt: new Date(),
        cancellationReason: reason
      };
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    throw new Error(`Failed to cancel order: ${error.message}`);
  }
}

/**
 * Get order statistics (admin function)
 */
export async function getOrderStatistics() {
  try {
    const ordersRef = collection(db, "orders");
    const allOrdersSnap = await getDocs(ordersRef);
    
    const stats = {
      totalOrders: 0,
      totalRevenue: 0,
      ordersByStatus: {
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
      }
    };

    allOrdersSnap.docs.forEach(doc => {
      const order = doc.data();
      stats.totalOrders++;
      
      if (order.status !== 'cancelled') {
        stats.totalRevenue += parseFloat(order.total || 0);
      }
      
      if (stats.ordersByStatus.hasOwnProperty(order.status)) {
        stats.ordersByStatus[order.status]++;
      }
    });

    return stats;
  } catch (error) {
    console.error("Error fetching order statistics:", error);
    throw new Error(`Failed to fetch order statistics: ${error.message}`);
  }
}

/**
 * Get recent orders (admin dashboard)
 */
export async function getRecentOrders(limitCount = 10) {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
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
    console.error("Error fetching recent orders:", error);
    throw new Error(`Failed to fetch recent orders: ${error.message}`);
  }
}
