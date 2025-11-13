'use client';

import { useState, useEffect, useRef } from 'react';
import { format, startOfWeek, addDays, isToday, parseISO } from 'date-fns';
import { CheckCircle2, Circle, Trophy, Flame, Calendar as CalendarIcon, Settings, RotateCcw, Trash2 } from 'lucide-react';
import { Habit } from '@/types/habit';

interface HabitTrackerProps {
  habits: Habit[];
  onToggleHabit: (habitId: string, date: string) => void;
  onStartNewOnboarding: () => void;
  onClearAllData: () => void;
}

export default function HabitTracker({ habits, onToggleHabit, onStartNewOnboarding, onClearAllData }: HabitTrackerProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClearData = () => {
    if (confirm('Are you sure you want to delete all your habits and progress? This cannot be undone.')) {
      onClearAllData();
      setShowMenu(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-[var(--background)]">
      {/* Modern Header */}
      <div className="flex-none bg-[var(--card-bg)] border-b border-[var(--border)] px-6 py-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--foreground)]">Dashboard</h1>
            <p className="text-sm text-gray-500">Track your habits and build consistency</p>
          </div>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors touch-manipulation"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[var(--card-bg)] rounded-lg shadow-xl border border-[var(--border)] py-2 z-50 animate-fade-in">
                <button
                  onClick={() => {
                    onStartNewOnboarding();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-3 touch-manipulation"
                >
                  <RotateCcw className="w-5 h-5 text-indigo-600" />
                  <div>
                    <div className="text-sm font-medium text-[var(--foreground)]">Add More Habits</div>
                    <div className="text-xs text-gray-500">Start new onboarding</div>
                  </div>
                </button>

                <div className="h-px bg-[var(--border)] my-1"></div>

                <button
                  onClick={handleClearData}
                  className="w-full px-4 py-3 text-left hover:bg-red-50 dark:hover:bg-red-950 transition-colors flex items-center gap-3 touch-manipulation"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                  <div>
                    <div className="text-sm font-medium text-[var(--foreground)]">Clear All Data</div>
                    <div className="text-xs text-gray-500">Delete all habits & progress</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards - Modern B2B Style */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[var(--background)] border border-[var(--border)] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Rate</span>
              <Trophy className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-3xl font-bold text-[var(--foreground)]">{completionRate}%</p>
            <p className="text-xs text-gray-500 mt-1">Today's progress</p>
          </div>

          <div className="bg-[var(--background)] border border-[var(--border)] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Streak</span>
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-3xl font-bold text-[var(--foreground)]">{maxStreak}</p>
            <p className="text-xs text-gray-500 mt-1">Days in a row</p>
          </div>

          <div className="bg-[var(--background)] border border-[var(--border)] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Habits</span>
              <CalendarIcon className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-[var(--foreground)]">{totalHabits}</p>
            <p className="text-xs text-gray-500 mt-1">Total tracked</p>
          </div>
        </div>
      </div>

      {/* Week View - Clean Design */}
      <div className="flex-none bg-[var(--card-bg)] border-b border-[var(--border)] px-6 py-4">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          {weekDates.map((date) => {
            const dateString = format(date, 'yyyy-MM-dd');
            const completed = habits.filter((h) => h.completions[dateString]).length;
            const isCurrentDay = isToday(date);

            return (
              <div
                key={dateString}
                className="flex flex-col items-center gap-2"
              >
                <span className="text-xs font-medium text-gray-500 uppercase">
                  {format(date, 'EEE')}
                </span>
                <div
                  className={`w-11 h-11 rounded-lg flex items-center justify-center text-sm font-semibold transition-all ${
                    isCurrentDay
                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-300 ring-offset-2'
                      : completed === totalHabits && totalHabits > 0
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : completed > 0
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300'
                      : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600'
                  }`}
                >
                  {format(date, 'd')}
                </div>
                {completed > 0 && !isCurrentDay && (
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
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {habits.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-semibold text-[var(--foreground)] mb-2">No habits yet</p>
              <p className="text-sm text-gray-500">Start onboarding to create your first habit</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 pb-4 max-w-4xl mx-auto">
            {habits.map((habit) => {
              const isCompleted = habit.completions[todayString];

              return (
                <button
                  key={habit.id}
                  onClick={() => onToggleHabit(habit.id, todayString)}
                  className={`w-full bg-[var(--card-bg)] rounded-lg p-4 border transition-all touch-manipulation hover:shadow-md ${
                    isCompleted
                      ? 'border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950'
                      : 'border-[var(--border)] hover:border-indigo-200 dark:hover:border-indigo-800'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-none">
                      {isCompleted ? (
                        <CheckCircle2 className="w-7 h-7 text-green-600" />
                      ) : (
                        <Circle className="w-7 h-7 text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1 text-left">
                      <h3
                        className={`font-medium mb-1 ${
                          isCompleted ? 'text-green-900 dark:text-green-300 line-through' : 'text-[var(--foreground)]'
                        }`}
                      >
                        {habit.name}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                          {habit.frequency}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">
                          {habit.timeOfDay}
                        </span>
                        {habit.streak > 0 && (
                          <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded font-medium">
                            {habit.streak} day streak
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
