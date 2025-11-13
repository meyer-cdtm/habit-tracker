'use client';

import { CheckCircle2, Clock, Calendar } from 'lucide-react';
import { ExtractedHabit } from '@/types/habit';

interface HabitPreviewProps {
  habits: ExtractedHabit[];
  onComplete: () => void;
}

export default function HabitPreview({ habits, onComplete }: HabitPreviewProps) {
  return (
    <div className="bg-[var(--card-bg)] rounded-lg shadow-lg border border-[var(--border)] overflow-hidden">
      <div className="bg-indigo-600 px-4 py-3">
        <h3 className="text-white font-medium text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Discovered Habits ({habits.length})
        </h3>
      </div>

      <div className="p-4 max-h-48 overflow-y-auto">
        <div className="space-y-2">
          {habits.map((habit, index) => (
            <div
              key={index}
              className="bg-[var(--background)] rounded-lg p-3 border border-[var(--border)]"
            >
              <p className="font-medium text-[var(--foreground)] text-sm mb-2">{habit.name}</p>
              <div className="flex items-center gap-2 text-xs">
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
          ))}
        </div>
      </div>

      <div className="px-4 py-3 bg-[var(--background)] border-t border-[var(--border)]">
        <button
          onClick={onComplete}
          className="w-full bg-indigo-600 text-white font-medium py-3 rounded-lg hover:bg-indigo-700 transition-colors touch-manipulation text-sm"
        >
          Review & Confirm
        </button>
      </div>
    </div>
  );
}
