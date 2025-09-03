
import React, { useState, useMemo, useCallback } from 'react';
import type { Product, CartItem, ChatMessage } from './types';
import { SAMPLE_PRODUCTS } from './constants';
import { getAIRecommendations } from './services/geminiService';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import Chat from './components/Chat';
import Cart from './components/Cart';

export default function App(): React.ReactElement {
  const [products] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'bot', text: "Hi! I'm your personal shopping assistant. Tell me what you're looking for and your budget, and I'll find the perfect items for you." },
  ]);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const addToCart = useCallback((product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.variantId === product.variantId);
      if (existingItem) {
        return prevCart.map(item =>
          item.variantId === product.variantId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((variantId: string) => {
    setCart(prevCart => prevCart.filter(item => item.variantId !== variantId));
  }, []);

  const handleCheckout = useCallback(() => {
    if (cart.length === 0) return;
    // In a real application, this would redirect to a Shopify checkout URL.
    // For this demo, we'll just show an alert.
    const checkoutUrl = "https://example.com/checkout-not-configured";
    alert("Redirecting to checkout...");
    window.open(checkoutUrl, "_blank");
  }, [cart]);

  const handleSend = useCallback(async (message: string, budget?: number) => {
    setChatHistory(prev => [...prev, { role: 'user', text: message }]);
    setIsAiLoading(true);
    setError(null);
    setRecommendedProducts([]);

    try {
      const result = await getAIRecommendations(message, budget, products);
      setChatHistory(prev => [...prev, { role: 'bot', text: result.reasoning }]);
      
      const recommendedIds = new Set(result.recommendations.map(p => p.id));
      const newRecommendations = products.filter(p => recommendedIds.has(p.id));
      setRecommendedProducts(newRecommendations);

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(`Sorry, I encountered an error. ${errorMessage}`);
      setChatHistory(prev => [...prev, { role: 'bot', text: `Sorry, something went wrong. Please try again.` }]);
    } finally {
      setIsAiLoading(false);
    }
  }, [products]);

  const displayedProducts = useMemo(() => 
    recommendedProducts.length > 0 ? recommendedProducts : products, 
    [recommendedProducts, products]
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-white mb-4">
              {recommendedProducts.length > 0 ? "Personalized Recommendations" : "Product Catalog"}
            </h2>
            {error && <div className="bg-red-900/50 border border-red-700 text-red-200 p-3 rounded-lg mb-4">{error}</div>}
            <ProductGrid products={displayedProducts} onAddToCart={addToCart} />
          </div>
          <div className="flex flex-col gap-6 xl:gap-8">
            <Chat history={chatHistory} onSend={handleSend} isLoading={isAiLoading} />
            <Cart items={cart} onRemove={removeFromCart} onCheckout={handleCheckout} />
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-gray-500">
        Powered by Gemini API and React
      </footer>
    </div>
  );
}
