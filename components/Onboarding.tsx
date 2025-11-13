'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Message, ExtractedHabit } from '@/types/habit';
import { extractHabitsFromMessage } from '@/utils/habitParser';
import HabitPreview from './HabitPreview';

interface OnboardingProps {
  onComplete: (habits: ExtractedHabit[]) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hey there! I'm excited to help you build better habits. What areas of your life would you like to improve? Maybe health, productivity, relationships, or something else?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [extractedHabits, setExtractedHabits] = useState<ExtractedHabit[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Extract habits from the assistant's message
      const newHabits = extractHabitsFromMessage(data.message);
      if (newHabits.length > 0) {
        setExtractedHabits((prev) => [...prev, ...newHabits]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm having trouble connecting right now. Please check that your OpenAI API key is set up correctly.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    if (extractedHabits.length > 0) {
      onComplete(extractedHabits);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="flex-none bg-white/80 backdrop-blur-sm border-b border-purple-100 px-4 py-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-2">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Habit Coach</h1>
            <p className="text-xs text-gray-500">Let's discover your habits together</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                  : 'bg-white text-gray-800 shadow-sm border border-gray-100'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content.replace(/\[HABIT:.*?\]/g, '').trim()}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Habit Preview - Fixed above input */}
      {extractedHabits.length > 0 && (
        <div className="flex-none px-4 pb-2">
          <HabitPreview habits={extractedHabits} onComplete={handleComplete} />
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="flex-none bg-white/80 backdrop-blur-sm border-t border-purple-100 p-4"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex-none bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full p-3 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow touch-manipulation"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}
