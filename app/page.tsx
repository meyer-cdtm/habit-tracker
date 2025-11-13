'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Onboarding from '@/components/Onboarding';
import HabitTracker from '@/components/HabitTracker';
import { Habit, ExtractedHabit } from '@/types/habit';
import { saveHabits, loadHabits, clearHabits } from '@/utils/storage';

export default function Home() {
  const [isOnboarding, setIsOnboarding] = useState(true);
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    const storedHabits = loadHabits();
    if (storedHabits.length > 0) {
      setHabits(storedHabits);
      setIsOnboarding(false);
    }
  }, []);

  const handleOnboardingComplete = (extractedHabits: ExtractedHabit[]) => {
    const newHabits: Habit[] = extractedHabits.map((habit) => ({
      id: crypto.randomUUID(),
      name: habit.name,
      frequency: habit.frequency,
      timeOfDay: habit.timeOfDay,
      createdAt: new Date().toISOString(),
      streak: 0,
      completions: {},
    }));

    setHabits(newHabits);
    saveHabits(newHabits);
    setIsOnboarding(false);
  };

  const calculateStreak = (habit: Habit, upToDate: string): number => {
    let streak = 0;
    let currentDate = new Date(upToDate);

    // Count backwards from the current date
    while (true) {
      const dateString = format(currentDate, 'yyyy-MM-dd');
      if (habit.completions[dateString]) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const handleToggleHabit = (habitId: string, date: string) => {
    setHabits((prev) => {
      const updated = prev.map((habit) => {
        if (habit.id === habitId) {
          const newCompletions = { ...habit.completions };
          newCompletions[date] = !newCompletions[date];

          // Recalculate streak
          const newStreak = calculateStreak(
            { ...habit, completions: newCompletions },
            date
          );

          return {
            ...habit,
            completions: newCompletions,
            streak: newStreak,
          };
        }
        return habit;
      });

      saveHabits(updated);
      return updated;
    });
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset and start over? This will delete all your habits and progress.')) {
      clearHabits();
      setHabits([]);
      setIsOnboarding(true);
    }
  };

  if (isOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <HabitTracker
      habits={habits}
      onToggleHabit={handleToggleHabit}
      onReset={handleReset}
    />
  );
}
