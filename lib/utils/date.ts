import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays, subDays, isToday, isYesterday, differenceInDays, parseISO } from 'date-fns';

export const formatDate = (date: Date | string, formatString: string = 'MMM d, yyyy'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString);
};

export const getWeekRange = (date: Date = new Date()) => {
  return {
    start: startOfWeek(date, { weekStartsOn: 1 }), // Monday
    end: endOfWeek(date, { weekStartsOn: 1 }),
  };
};

export const getMonthRange = (date: Date = new Date()) => {
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  };
};

export const getTodayString = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};

export const getYesterdayString = (): string => {
  return format(subDays(new Date(), 1), 'yyyy-MM-dd');
};

export const getDaysAgo = (days: number): string => {
  return format(subDays(new Date(), days), 'yyyy-MM-dd');
};

export const getRelativeTimeString = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;

  if (isToday(dateObj)) {
    return 'Today';
  }

  if (isYesterday(dateObj)) {
    return 'Yesterday';
  }

  const daysDiff = differenceInDays(new Date(), dateObj);

  if (daysDiff < 7) {
    return `${daysDiff} days ago`;
  }

  return formatDate(dateObj);
};

export const calculateStreak = (entries: Record<string, any>): number => {
  const today = getTodayString();
  let currentDate = today;
  let streak = 0;

  while (entries[currentDate]?.completed) {
    streak++;
    currentDate = format(subDays(parseISO(currentDate), 1), 'yyyy-MM-dd');
  }

  return streak;
};

export const getDateRange = (startDate: string, endDate: string): string[] => {
  const dates: string[] = [];
  let currentDate = parseISO(startDate);
  const end = parseISO(endDate);

  while (currentDate <= end) {
    dates.push(format(currentDate, 'yyyy-MM-dd'));
    currentDate = addDays(currentDate, 1);
  }

  return dates;
};
