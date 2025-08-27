import React from 'react';
import { Product } from '@shared/types/Product';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      {product.imageUrl && (
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-48 object-cover rounded mb-4"
        />
      )}
      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
      <p className="text-gray-600 mb-2">{product.description}</p>
      <div className="flex justify-between items-center">
        <span className="text-xl font-bold text-blue-600">
          ${product.price}
        </span>
        {onAddToCart && (
          <button
            onClick={() => onAddToCart(product)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}