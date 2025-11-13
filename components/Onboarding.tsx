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
      <div className="flex flex-col h-screen max-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="flex-none bg-[var(--card-bg)] border-b border-[var(--border)] px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 rounded-lg p-2.5">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-[var(--foreground)]">Setup Your Habits</h1>
              <p className="text-sm text-gray-500">AI-powered habit discovery</p>
            </div>
          </div>

          {/* Switch to Voice Button */}
          <button
            onClick={() => setShowVoiceUI(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-medium"
            disabled={isLoading}
          >
            <Phone className="w-4 h-4" />
            <span>Voice Mode</span>
          </button>
        </div>

        {/* Step Indicator */}
        <StepIndicator steps={ONBOARDING_STEPS} currentStep={currentStep} />
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3 max-w-4xl mx-auto w-full">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`max-w-[80%] rounded-xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[var(--card-bg)] text-[var(--foreground)] border border-[var(--border)]'
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
            <div className="bg-[var(--card-bg)] rounded-xl px-4 py-3 border border-[var(--border)]">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
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
        className="flex-none bg-[var(--card-bg)] border-t border-[var(--border)] p-4"
      >
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm disabled:opacity-50 transition-all text-[var(--foreground)]"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex-none bg-indigo-600 text-white rounded-lg px-4 py-3 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 transition-all touch-manipulation"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </form>
      </div>
    </>
  );
}
