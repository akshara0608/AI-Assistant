
import React from 'react';
import type { Product } from '../types';
import { PlusCircleIcon } from './Icons';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(product.price);

  return (
    <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700/50 flex flex-col group transition-all duration-300 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-900/30">
      <div className="aspect-w-16 aspect-h-9 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-white truncate">{product.title}</h3>
        <p className="text-sm text-gray-400 mt-1 flex-grow">{product.description}</p>
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-semibold text-indigo-400">{formattedPrice}</span>
          <button
            onClick={() => onAddToCart(product)}
            className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-500 transition-colors duration-200 disabled:bg-gray-500"
          >
            <PlusCircleIcon className="w-5 h-5"/>
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
