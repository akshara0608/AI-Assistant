
import React, { useRef, useEffect, useState } from 'react';
import type { ChatMessage } from '../types';
import { SendIcon, SparklesIcon } from './Icons';

interface ChatProps {
  history: ChatMessage[];
  onSend: (message: string, budget?: number) => void;
  isLoading: boolean;
}

const Chat: React.FC<ChatProps> = ({ history, onSend, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('');
  const [budget, setBudget] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [history, isLoading]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    const budgetValue = budget ? Number(budget.replace(/[^0-9]/g, '')) : undefined;
    onSend(message, budgetValue);
    setMessage('');
  };

  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 flex flex-col h-[32rem]">
      <div className="p-4 border-b border-gray-700/50 flex items-center space-x-2">
        <SparklesIcon className="w-6 h-6 text-indigo-400" />
        <h3 className="font-bold text-white text-lg">Shopping Assistant</h3>
      </div>
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {history.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${
                msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-lg' : 'bg-gray-700 text-gray-200 rounded-bl-lg'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="max-w-xs md:max-w-md px-4 py-2 rounded-2xl bg-gray-700 text-gray-200 rounded-bl-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700/50 flex items-start space-x-2">
        <div className="flex-grow">
          <input
            type="text"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='e.g., "running shoes under ₹3000"'
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          />
          <input
            type="text"
            name="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="Budget (optional)"
            className="w-full mt-2 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !message.trim()}
          className="bg-indigo-600 text-white p-2.5 rounded-lg hover:bg-indigo-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default Chat;
