export interface FirestoreUser {
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
  photoURL?: string;
}

export interface FirestoreProduct {
  name: string;
  description: string;
  price: string;
  imageUrl?: string;
  category: string;
  stock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface FirestoreOrder {
  userId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: string;
  shippingAddress: string;
  items: FirestoreOrderItem[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface FirestoreOrderItem {
  productId: string;
  quantity: number;
  price: string;
}

export interface FirestoreCart {
  userId: string;
  items: FirestoreCartItem[];
  updatedAt: Date;
}

export interface FirestoreCartItem {
  productId: string;
  quantity: number;
  addedAt: Date;
}