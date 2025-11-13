'use client';

import { CheckCircle2, Calendar, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { ExtractedHabit } from '@/types/habit';

interface SummaryModalProps {
  habits: ExtractedHabit[];
  onConfirm: () => void;
  onBack: () => void;
}

export default function SummaryModal({ habits, onConfirm, onBack }: SummaryModalProps) {
  const frequencyEmojis: Record<string, string> = {
    daily: '📅',
    weekly: '📆',
    custom: '⚙️',
  };

  const timeEmojis: Record<string, string> = {
    morning: '🌅',
    afternoon: '☀️',
    evening: '🌙',
    anytime: '⏰',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Your Habit Plan</h2>
          </div>
          <p className="text-purple-100 text-sm">
            Review your personalized habits before we get started
          </p>
        </div>

        {/* Summary Stats */}
        <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-purple-100">
          <div className="flex items-center justify-around">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{habits.length}</div>
              <div className="text-xs text-gray-600 mt-1">Habits</div>
            </div>
            <div className="w-px h-12 bg-purple-200"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {habits.filter((h) => h.frequency === 'daily').length}
              </div>
              <div className="text-xs text-gray-600 mt-1">Daily</div>
            </div>
            <div className="w-px h-12 bg-purple-200"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {habits.filter((h) => h.frequency === 'weekly').length}
              </div>
              <div className="text-xs text-gray-600 mt-1">Weekly</div>
            </div>
          </div>
        </div>

        {/* Habits List */}
        <div className="px-6 py-4 max-h-[400px] overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Your Habits
          </h3>
          <div className="space-y-3">
            {habits.map((habit, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-none mt-1">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">{habit.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {frequencyEmojis[habit.frequency]} {habit.frequency}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {timeEmojis[habit.timeOfDay]} {habit.timeOfDay}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors touch-manipulation"
          >
            Back to Chat
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all touch-manipulation flex items-center justify-center gap-2"
          >
            Start Tracking
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Motivational Message */}
        <div className="px-6 py-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-center">
          <p className="text-sm text-gray-600">
            🎉 You're all set! Let's build these habits together.
          </p>
        </div>
      </div>
    </div>
  );
}
