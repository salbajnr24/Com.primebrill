import { Product } from '@shared/types/Product';

export async function getProducts(): Promise<Product[]> {
  // This would connect to Firebase Firestore
  // For now, return empty array
  return [];
}

export async function getProduct(id: string): Promise<Product | null> {
  // This would fetch a single product from Firebase
  return null;
}

export async function createProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
  // This would create a product in Firebase
  throw new Error('Not implemented');
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  // This would update a product in Firebase
  throw new Error('Not implemented');
}

export async function deleteProduct(id: string): Promise<void> {
  // This would delete a product from Firebase
  throw new Error('Not implemented');
}