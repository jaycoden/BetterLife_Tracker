export type GoalCategory =
  | 'work'
  | 'personal'
  | 'health'
  | 'relationships'
  | 'learning'
  | 'financial'
  | 'other';

export type GoalTimeframe = 'short-term' | 'long-term';

export type GoalStatus = 'active' | 'paused' | 'completed' | 'archived';

export interface Milestone {
  id: string;
  title: string;
  targetValue: number;
  completed: boolean;
  completedAt?: string;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: GoalCategory;
  timeframe: GoalTimeframe;
  status: GoalStatus;
  progress: number; // 0-100
  milestones: Milestone[];
  startDate: string;
  targetDate?: string;
  priority: 1 | 2 | 3 | 4 | 5;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

export interface GoalProgress {
  goalId: string;
  date: string;
  progress: number;
  notes?: string;
}
