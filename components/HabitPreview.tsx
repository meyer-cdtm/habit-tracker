'use client';

import { CheckCircle2, Clock, Calendar } from 'lucide-react';
import { ExtractedHabit } from '@/types/habit';

interface HabitPreviewProps {
  habits: ExtractedHabit[];
  onComplete: () => void;
}

export default function HabitPreview({ habits, onComplete }: HabitPreviewProps) {
  const frequencyIcons: Record<string, string> = {
    daily: '📅',
    weekly: '📆',
    custom: '⚙️',
  };

  const timeIcons: Record<string, string> = {
    morning: '🌅',
    afternoon: '☀️',
    evening: '🌙',
    anytime: '⏰',
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 px-4 py-3">
        <h3 className="text-white font-semibold text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          Your Habits ({habits.length})
        </h3>
      </div>

      <div className="p-3 max-h-48 overflow-y-auto">
        <div className="space-y-2">
          {habits.map((habit, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-3 border border-purple-100"
            >
              <p className="font-medium text-gray-900 text-sm mb-2">{habit.name}</p>
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {frequencyIcons[habit.frequency]} {habit.frequency}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {timeIcons[habit.timeOfDay]} {habit.timeOfDay}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <button
          onClick={onComplete}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-shadow touch-manipulation text-sm"
        >
          Start Tracking These Habits
        </button>
      </div>
    </div>
  );
}
