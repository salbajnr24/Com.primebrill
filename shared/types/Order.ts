export interface Order {
  id: string;
  userId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: string;
  shippingAddress: string;
  items: OrderItem[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  price: string;
  total: string;
}

export interface CreateOrderInput {
  userId: string;
  total: string;
  shippingAddress: string;
  items: {
    productId: string;
    quantity: number;
    price: string;
  }[];
}

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}