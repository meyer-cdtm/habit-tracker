'use client';

import { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, isToday, parseISO } from 'date-fns';
import { CheckCircle2, Circle, Trophy, Flame, Calendar as CalendarIcon, Settings } from 'lucide-react';
import { Habit } from '@/types/habit';

interface HabitTrackerProps {
  habits: Habit[];
  onToggleHabit: (habitId: string, date: string) => void;
  onReset: () => void;
}

export default function HabitTracker({ habits, onToggleHabit, onReset }: HabitTrackerProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState<Date[]>([]);

  useEffect(() => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday
    const dates = Array.from({ length: 7 }, (_, i) => addDays(start, i));
    setWeekDates(dates);
  }, [selectedDate]);

  const totalHabits = habits.length;
  const todayString = format(new Date(), 'yyyy-MM-dd');
  const completedToday = habits.filter((h) => h.completions[todayString]).length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  const maxStreak = Math.max(...habits.map((h) => h.streak), 0);

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header with Stats */}
      <div className="flex-none bg-white/80 backdrop-blur-sm border-b border-purple-100 px-4 py-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold text-gray-900">My Habits</h1>
          <button
            onClick={onReset}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 touch-manipulation"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-3 text-white">
            <div className="flex items-center gap-1 mb-1">
              <Trophy className="w-4 h-4" />
              <span className="text-xs font-medium">Today</span>
            </div>
            <p className="text-2xl font-bold">{completionRate}%</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3 text-white">
            <div className="flex items-center gap-1 mb-1">
              <Flame className="w-4 h-4" />
              <span className="text-xs font-medium">Streak</span>
            </div>
            <p className="text-2xl font-bold">{maxStreak}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-3 text-white">
            <div className="flex items-center gap-1 mb-1">
              <CalendarIcon className="w-4 h-4" />
              <span className="text-xs font-medium">Total</span>
            </div>
            <p className="text-2xl font-bold">{totalHabits}</p>
          </div>
        </div>
      </div>

      {/* Week View */}
      <div className="flex-none bg-white/60 backdrop-blur-sm border-b border-purple-100 px-4 py-3">
        <div className="flex justify-between items-center">
          {weekDates.map((date) => {
            const dateString = format(date, 'yyyy-MM-dd');
            const completed = habits.filter((h) => h.completions[dateString]).length;
            const isCurrentDay = isToday(date);

            return (
              <div
                key={dateString}
                className={`flex flex-col items-center gap-1 ${
                  isCurrentDay ? 'scale-110' : ''
                }`}
              >
                <span className="text-xs font-medium text-gray-500">
                  {format(date, 'EEE')}
                </span>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    isCurrentDay
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md'
                      : completed === totalHabits && totalHabits > 0
                      ? 'bg-green-100 text-green-700'
                      : completed > 0
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {format(date, 'd')}
                </div>
                {completed > 0 && (
                  <span className="text-xs text-gray-500">
                    {completed}/{totalHabits}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Habits List */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {habits.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No habits yet</p>
              <p className="text-sm">Start a new onboarding to add habits</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 pb-4">
            {habits.map((habit) => {
              const isCompleted = habit.completions[todayString];

              return (
                <button
                  key={habit.id}
                  onClick={() => onToggleHabit(habit.id, todayString)}
                  className={`w-full bg-white rounded-2xl p-4 shadow-sm border transition-all touch-manipulation ${
                    isCompleted
                      ? 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50'
                      : 'border-gray-200 hover:border-purple-200 active:scale-98'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-none">
                      {isCompleted ? (
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                      ) : (
                        <Circle className="w-8 h-8 text-gray-300" />
                      )}
                    </div>

                    <div className="flex-1 text-left">
                      <h3
                        className={`font-semibold mb-1 ${
                          isCompleted ? 'text-green-900 line-through' : 'text-gray-900'
                        }`}
                      >
                        {habit.name}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          📅 {habit.frequency}
                        </span>
                        <span className="flex items-center gap-1">
                          {habit.timeOfDay === 'morning' && '🌅'}
                          {habit.timeOfDay === 'afternoon' && '☀️'}
                          {habit.timeOfDay === 'evening' && '🌙'}
                          {habit.timeOfDay === 'anytime' && '⏰'}
                          {habit.timeOfDay}
                        </span>
                        {habit.streak > 0 && (
                          <span className="flex items-center gap-1 font-semibold text-orange-600">
                            🔥 {habit.streak}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
