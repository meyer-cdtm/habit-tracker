'use client';

import { CheckCircle2, Calendar, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { ExtractedHabit } from '@/types/habit';

interface SummaryModalProps {
  habits: ExtractedHabit[];
  onConfirm: () => void;
  onBack: () => void;
}

export default function SummaryModal({ habits, onConfirm, onBack }: SummaryModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[var(--card-bg)] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in border border-[var(--border)]">
        {/* Header */}
        <div className="bg-indigo-600 px-6 py-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white">Review Your Habits</h2>
          </div>
          <p className="text-indigo-100 text-sm">
            Confirm your personalized habit plan before starting
          </p>
        </div>

        {/* Summary Stats */}
        <div className="px-6 py-4 bg-[var(--background)] border-b border-[var(--border)]">
          <div className="flex items-center justify-around">
            <div className="text-center">
              <div className="text-3xl font-bold text-[var(--foreground)]">{habits.length}</div>
              <div className="text-xs text-gray-500 mt-1">Total Habits</div>
            </div>
            <div className="w-px h-12 bg-[var(--border)]"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">
                {habits.filter((h) => h.frequency === 'daily').length}
              </div>
              <div className="text-xs text-gray-500 mt-1">Daily</div>
            </div>
            <div className="w-px h-12 bg-[var(--border)]"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {habits.filter((h) => h.frequency === 'weekly').length}
              </div>
              <div className="text-xs text-gray-500 mt-1">Weekly</div>
            </div>
          </div>
        </div>

        {/* Habits List */}
        <div className="px-6 py-5 max-h-[400px] overflow-y-auto">
          <h3 className="text-sm font-medium text-gray-500 mb-4">
            Habit Summary
          </h3>
          <div className="space-y-3">
            {habits.map((habit, index) => (
              <div
                key={index}
                className="bg-[var(--background)] rounded-lg p-4 border border-[var(--border)] hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-none mt-0.5">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-[var(--foreground)] mb-2">{habit.name}</h4>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-400">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {habit.frequency}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-400">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {habit.timeOfDay}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-[var(--background)] border-t border-[var(--border)] flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 px-6 py-3 bg-[var(--card-bg)] border border-[var(--border)] text-[var(--foreground)] font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors touch-manipulation"
          >
            Back
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all touch-manipulation flex items-center justify-center gap-2"
          >
            Start Tracking
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
