export interface OrderWithItems {
  id: string;
  userId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: string;
  shippingAddress: string;
  createdAt: Date;
  items: OrderItemWithProduct[];
}

export interface OrderItemWithProduct {
  id: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  price: string;
  total: string;
}

export interface CreateOrderRequest {
  userId: string;
  total: string;
  shippingAddress: string;
  items: {
    productId: string;
    quantity: number;
    price: string;
  }[];
}
