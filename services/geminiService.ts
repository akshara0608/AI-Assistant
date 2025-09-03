
import { GoogleGenAI, Type } from "@google/genai";
import type { Product, GeminiResponse } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const recommendationSchema = {
  type: Type.OBJECT,
  properties: {
    recommendations: {
      type: Type.ARRAY,
      description: "An array of 3 to 5 recommended product objects. Do not recommend products that don't match the user's request.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: {
            type: Type.STRING,
            description: "The unique Shopify product ID, e.g., 'gid://shopify/Product/1001'. Must be one of the IDs from the candidate products list.",
          },
        },
        required: ["id"],
      },
    },
    reasoning: {
      type: Type.STRING,
      description: "A short, friendly, and conversational explanation for the recommendations. Explain why these specific products were chosen based on the user's request. Keep it concise (2-3 sentences).",
    },
  },
  required: ["recommendations", "reasoning"],
};

export async function getAIRecommendations(message: string, budget: number | undefined, candidates: Product[]): Promise<GeminiResponse> {
  if (!process.env.API_KEY) {
    // Fallback logic if API key is not configured
    const sortedCandidates = [...candidates].sort((a, b) => {
        const aDiff = budget !== undefined ? Math.abs(a.price - budget) : 0;
        const bDiff = budget !== undefined ? Math.abs(b.price - budget) : 0;
        return aDiff - bDiff;
    }).slice(0, 3);

    return {
      recommendations: sortedCandidates.map(p => ({ id: p.id })),
      reasoning: "Gemini API key not configured. Showing the top 3 products closest to your budget.",
    };
  }
  
  const model = "gemini-2.5-flash";
  const systemInstruction = "You are a friendly and helpful AI Shopping Assistant for an e-commerce store. Your goal is to help users find the best products based on their needs and budget. Analyze the user's request and the list of available products to provide a curated list of recommendations. Always adhere to the JSON schema for your response.";

  const candidateProducts = candidates.map(p => ({
    id: p.id,
    title: p.title,
    description: p.description,
    price: p.price,
  }));
  
  const prompt = `
    User message: "${message}"
    User's budget (INR): ${budget ?? 'Not specified'}
    
    Available products (JSON):
    ${JSON.stringify(candidateProducts)}

    Based on the user's message and budget, please select 3-5 of the most relevant products from the list.
    Provide your response in the specified JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: recommendationSchema,
        temperature: 0.5,
        topP: 0.9,
      },
    });

    const jsonText = response.text.trim();
    const parsedResponse: GeminiResponse = JSON.parse(jsonText);
    
    if (!parsedResponse.recommendations || !parsedResponse.reasoning) {
        throw new Error("Invalid response format from AI.");
    }

    return parsedResponse;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get recommendations from the AI assistant.");
  }
}
