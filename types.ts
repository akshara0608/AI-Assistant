
export interface Product {
  id: string;
  variantId: string;
  title: string;
  description: string;
  image: string;
  price: number;
  currency: 'INR';
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}

export interface GeminiRecommendation {
  id: string;
  title: string;
  reason: string;
}

export interface GeminiResponse {
  recommendations: { id: string }[];
  reasoning: string;
}
