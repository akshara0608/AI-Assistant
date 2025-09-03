
import React from 'react';
import { ShoppingBagIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <ShoppingBagIcon className="h-8 w-8 text-indigo-400" />
            <span className="text-xl font-bold text-white tracking-tight">
              AI Shopping Assistant
            </span>
          </div>
          <div className="text-xs sm:text-sm text-gray-400">
            Powered by <span className="font-semibold text-indigo-300">Gemini</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
