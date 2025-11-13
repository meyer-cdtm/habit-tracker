'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Phone } from 'lucide-react';
import { Message, ExtractedHabit } from '@/types/habit';
import { extractHabitsFromMessage } from '@/utils/habitParser';
import HabitPreview from './HabitPreview';
import StepIndicator from './StepIndicator';
import VoiceOnboarding from './VoiceOnboarding';
import SummaryModal from './SummaryModal';

interface OnboardingProps {
  onComplete: (habits: ExtractedHabit[]) => void;
}

const ONBOARDING_STEPS = [
  { id: 1, label: 'Goals', emoji: '🎯' },
  { id: 2, label: 'Habits', emoji: '✨' },
  { id: 3, label: 'Details', emoji: '📋' },
  { id: 4, label: 'Review', emoji: '✅' },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [showVoiceUI, setShowVoiceUI] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hey there! I'm excited to help you build better habits. What areas of your life would you like to improve? Maybe health, productivity, relationships, or something else?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [extractedHabits, setExtractedHabits] = useState<ExtractedHabit[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-advance steps based on conversation progress
  useEffect(() => {
    const messageCount = messages.length;
    if (extractedHabits.length > 0) {
      setCurrentStep(4); // Review step
    } else if (messageCount >= 5) {
      setCurrentStep(3); // Details step
    } else if (messageCount >= 3) {
      setCurrentStep(2); // Habits step
    } else {
      setCurrentStep(1); // Goals step
    }
  }, [messages.length, extractedHabits.length]);

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

  const handleShowSummary = () => {
    if (extractedHabits.length > 0) {
      setShowSummary(true);
    }
  };

  const handleConfirmHabits = () => {
    onComplete(extractedHabits);
  };

  const handleBackToChat = () => {
    setShowSummary(false);
  };

  // If voice UI is active, show the VoiceOnboarding component
  if (showVoiceUI) {
    return (
      <VoiceOnboarding
        onComplete={onComplete}
        onBackToChat={() => setShowVoiceUI(false)}
      />
    );
  }

  // Otherwise, show the chat UI
  return (
    <>
      {showSummary && (
        <SummaryModal
          habits={extractedHabits}
          onConfirm={handleConfirmHabits}
          onBack={handleBackToChat}
        />
      )}
      <div className="flex flex-col h-screen max-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="flex-none bg-white/80 backdrop-blur-sm border-b border-purple-100 px-4 py-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-full p-2">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Habit Coach</h1>
              <p className="text-xs text-gray-500">Let's discover your habits together</p>
            </div>
          </div>

          {/* Switch to Voice Button */}
          <button
            onClick={() => setShowVoiceUI(true)}
            className="p-2 rounded-full transition-all touch-manipulation bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg"
            disabled={isLoading}
          >
            <Phone className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <StepIndicator steps={ONBOARDING_STEPS} currentStep={currentStep} />
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm transition-all ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                  : 'bg-white text-gray-800 border border-gray-100'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content.replace(/\[HABIT:.*?\]/g, '').trim()}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
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
        <div className="flex-none px-4 pb-2 animate-slide-up">
          <HabitPreview habits={extractedHabits} onComplete={handleShowSummary} />
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
            className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm disabled:opacity-50 transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex-none bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full p-3 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all touch-manipulation"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Voice Mode Hint */}
        {messages.length === 1 && (
          <div className="mt-2 text-center">
            <p className="text-xs text-gray-500">
              Tip: Tap the <Phone className="w-3 h-3 inline" /> icon to use voice mode
            </p>
          </div>
        )}
      </form>
      </div>
    </>
  );
}
