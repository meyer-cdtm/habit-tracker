import { ExtractedHabit, Frequency, TimeOfDay } from '@/types/habit';

export function extractHabitsFromMessage(message: string): ExtractedHabit[] {
  const habits: ExtractedHabit[] = [];

  // Pattern: [HABIT: name | FREQUENCY: frequency | TIME: timeOfDay]
  const habitPattern = /\[HABIT:\s*([^\|]+)\s*\|\s*FREQUENCY:\s*(\w+)\s*\|\s*TIME:\s*(\w+)\s*\]/gi;

  let match;
  while ((match = habitPattern.exec(message)) !== null) {
    const name = match[1].trim();
    const frequency = match[2].trim().toLowerCase() as Frequency;
    const timeOfDay = match[3].trim().toLowerCase() as TimeOfDay;

    // Validate the extracted values
    const validFrequencies: Frequency[] = ['daily', 'weekly', 'custom'];
    const validTimes: TimeOfDay[] = ['morning', 'afternoon', 'evening', 'anytime'];

    if (
      validFrequencies.includes(frequency) &&
      validTimes.includes(timeOfDay) &&
      name.length > 0
    ) {
      habits.push({ name, frequency, timeOfDay });
    }
  }

  return habits;
}
