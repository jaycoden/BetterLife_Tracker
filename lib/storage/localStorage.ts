// Local Storage utilities for offline-first functionality

export const storage = {
  get: (key: string) => {
    if (typeof window === 'undefined') return null;
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },

  set: (key: string, value: any) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  },

  remove: (key: string) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },

  clear: () => {
    if (typeof window === 'undefined') return;
    localStorage.clear();
  },
};

// User data
export const getUser = () => storage.get('lifeos_user');
export const setUser = (user: any) => storage.set('lifeos_user', user);
export const clearUser = () => storage.remove('lifeos_user');

// Journal entries
export const getJournalEntries = () => storage.get('lifeos_journal') || [];
export const setJournalEntries = (entries: any[]) => storage.set('lifeos_journal', entries);

// Goals
export const getGoals = () => storage.get('lifeos_goals') || [];
export const setGoals = (goals: any[]) => storage.set('lifeos_goals', goals);

// Trackers
export const getTrackers = () => storage.get('lifeos_trackers') || {};
export const setTrackers = (trackers: any) => storage.set('lifeos_trackers', trackers);

// Daily check-ins
export const getDailyCheckIns = () => storage.get('lifeos_daily') || {};
export const setDailyCheckIns = (checkIns: any) => storage.set('lifeos_daily', checkIns);

// Work data
export const getWorkData = () => storage.get('lifeos_work') || { projects: [], tasks: [], timeEntries: [] };
export const setWorkData = (workData: any) => storage.set('lifeos_work', workData);
