export interface MorningRoutine {
  id: string;
  userId: string;
  date: string; // ISO date string
  wakeUpTime?: string;
  morningMood?: 'energized' | 'tired' | 'neutral' | 'anxious' | 'excited';
  sleepQuality?: 1 | 2 | 3 | 4 | 5;
  hoursSlept?: number;
  intentions: string[];
  gratitude: string[];
  completedAt?: string;
}

export interface EveningReview {
  id: string;
  userId: string;
  date: string; // ISO date string
  accomplishments: string[];
  challenges: string[];
  lessonsLearned: string[];
  tomorrowPriorities: string[];
  eveningMood?: 'fulfilled' | 'tired' | 'stressed' | 'happy' | 'neutral';
  dayRating?: 1 | 2 | 3 | 4 | 5;
  completedAt?: string;
}

export interface DailyCheckIn {
  id: string;
  userId: string;
  date: string;
  morning?: MorningRoutine;
  evening?: EveningReview;
}
