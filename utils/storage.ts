import { Habit } from '@/types/habit';

const STORAGE_KEY = 'habit-tracker-habits';

export function saveHabits(habits: Habit[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
  }
}

export function loadHabits(): Habit[] {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Error parsing stored habits:', error);
        return [];
      }
    }
  }
  return [];
}

export function clearHabits(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}
