import { TrackerEntry } from '@/types';
import { getDateRange } from './date';

export const calculateCompletionRate = (
  entries: Record<string, TrackerEntry>,
  startDate: string,
  endDate: string
): number => {
  const dateRange = getDateRange(startDate, endDate);
  const totalDays = dateRange.length;
  const completedDays = dateRange.filter((date) => entries[date]?.completed).length;

  return totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;
};

export const calculateLongestStreak = (entries: Record<string, TrackerEntry>): number => {
  const sortedDates = Object.keys(entries)
    .filter((date) => entries[date]?.completed)
    .sort();

  if (sortedDates.length === 0) return 0;

  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1]);
    const currDate = new Date(sortedDates[i]);
    const dayDiff = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

    if (dayDiff === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return longestStreak;
};

export const calculateSmokeFreeStats = (
  quitDate: string,
  cigarettesPerDay: number = 20,
  costPerPack: number = 10,
  cigarettesPerPack: number = 20
) => {
  const daysSince = Math.floor(
    (new Date().getTime() - new Date(quitDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  const cigarettesAvoided = daysSince * cigarettesPerDay;
  const packsAvoided = cigarettesAvoided / cigarettesPerPack;
  const moneySaved = packsAvoided * costPerPack;

  const lifeRegained = Math.floor((cigarettesAvoided * 11) / (60 * 24)); // ~11 min per cigarette

  return {
    daysSince,
    cigarettesAvoided,
    moneySaved: Math.round(moneySaved * 100) / 100,
    lifeRegainedDays: lifeRegained,
  };
};

export const calculateGoalProgress = (
  completedMilestones: number,
  totalMilestones: number
): number => {
  if (totalMilestones === 0) return 0;
  return Math.round((completedMilestones / totalMilestones) * 100);
};

export const calculateWeeklyWorkHours = (
  timeEntries: Array<{ duration?: number; billable: boolean }>
) => {
  const totalMinutes = timeEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
  const billableMinutes = timeEntries
    .filter((entry) => entry.billable)
    .reduce((sum, entry) => sum + (entry.duration || 0), 0);

  return {
    totalHours: Math.round((totalMinutes / 60) * 10) / 10,
    billableHours: Math.round((billableMinutes / 60) * 10) / 10,
  };
};
