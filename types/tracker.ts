export type GoalType = 'daily' | 'weekly' | 'monthly';

export interface TrackerEntry {
  date: string; // ISO date string
  completed: boolean;
  value?: number;
  notes?: string;
}

export interface SmokeFreeTracker {
  startDate: string; // ISO date string
  currentDay: number;
  dailyEntries: Record<string, TrackerEntry>;
  milestones: number[]; // [7, 30, 60, 90, 180, 365]
  moneySavedPerDay?: number;
}

export interface ExerciseEntry extends TrackerEntry {
  type?: string; // "gym", "run", "yoga", etc.
  duration?: number; // minutes
}

export interface ExerciseTracker {
  weeklyGoal: number;
  entries: Record<string, ExerciseEntry>;
}

export interface CustomHabit {
  id: string;
  name: string;
  goalType: GoalType;
  target: number;
  color?: string;
  icon?: string;
  entries: Record<string, TrackerEntry>;
  createdAt: string;
  archived?: boolean;
}

export interface TrackerStats {
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
  completionRate: number; // percentage
}
