export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl?: string;
  category: string;
  stock: number;
  isActive: boolean;
  createdAt: Date;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  sortBy?: 'name' | 'price-low' | 'price-high' | 'newest';
  minPrice?: number;
  maxPrice?: number;
}

export interface CreateProductInput {
  name: string;
  description: string;
  price: string;
  imageUrl?: string;
  category: string;
  stock: number;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  isActive?: boolean;
}