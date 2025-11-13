export type Frequency = 'daily' | 'weekly' | 'custom';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'anytime';

export interface Habit {
  id: string;
  name: string;
  frequency: Frequency;
  timeOfDay: TimeOfDay;
  createdAt: string;
  streak: number;
  completions: Record<string, boolean>; // date string -> completed
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ExtractedHabit {
  name: string;
  frequency: Frequency;
  timeOfDay: TimeOfDay;
}
