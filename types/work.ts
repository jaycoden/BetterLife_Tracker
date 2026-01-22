export type ProjectStatus = 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in-progress' | 'blocked' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  projectId?: string;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  client?: string;
  startDate: string;
  targetDate?: string;
  completedAt?: string;
  color?: string;
  tasks: Task[];
  progress: number; // 0-100
  totalEstimatedHours?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TimeEntry {
  id: string;
  userId: string;
  projectId?: string;
  taskId?: string;
  description: string;
  startTime: string;
  endTime?: string;
  duration?: number; // minutes
  billable: boolean;
  date: string;
  createdAt: string;
}

export interface WorkWeek {
  weekStart: string; // ISO date
  weekEnd: string;
  totalHours: number;
  billableHours: number;
  projectBreakdown: Record<string, number>;
  completedTasks: number;
}
