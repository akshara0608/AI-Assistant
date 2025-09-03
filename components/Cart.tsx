
import React from 'react';
import type { CartItem } from '../types';
import { ShoppingCartIcon, TrashIcon } from './Icons';

interface CartProps {
  items: CartItem[];
  onRemove: (variantId: string) => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ items, onRemove, onCheckout }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const formattedTotal = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(total);

  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 flex flex-col">
      <div className="p-4 border-b border-gray-700/50 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShoppingCartIcon className="w-6 h-6 text-indigo-400" />
          <h3 className="font-bold text-white text-lg">Your Cart</h3>
        </div>
        <span className="text-sm font-medium bg-indigo-900/50 text-indigo-300 px-2 py-1 rounded-full">{items.length} items</span>
      </div>
      <div className="flex-grow p-4 overflow-y-auto space-y-3 min-h-[6rem]">
        {items.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">Your cart is empty.</p>
        ) : (
          items.map(item => (
            <div key={item.variantId} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={item.image} alt={item.title} className="w-12 h-12 rounded-md object-cover" />
                <div>
                  <p className="text-sm font-semibold text-white truncate max-w-[120px]">{item.title}</p>
                  <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                 <p className="text-sm font-medium text-white">₹{item.price * item.quantity}</p>
                 <button onClick={() => onRemove(item.variantId)} className="text-gray-500 hover:text-red-400">
                    <TrashIcon className="w-4 h-4" />
                 </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="p-4 border-t border-gray-700/50">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-300 font-medium">Total</span>
          <span className="text-xl font-bold text-indigo-400">{formattedTotal}</span>
        </div>
        <button
          onClick={onCheckout}
          disabled={items.length === 0}
          className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          Proceed to Checkout
        </button>
        <p className="text-xs text-gray-500 text-center mt-2">Checkout is a simulation.</p>
      </div>
    </div>
  );
};

export default Cart;
