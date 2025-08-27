export interface ProductFilters {
  search?: string;
  category?: string;
  sortBy?: 'name' | 'price-low' | 'price-high' | 'newest';
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductWithInventory {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl?: string;
  category: string;
  stock: number;
  isActive: boolean;
  inventoryLevel: 'high' | 'medium' | 'low' | 'out';
}
