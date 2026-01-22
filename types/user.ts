export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: string;
  updatedAt: string;

  // Preferences
  timezone?: string;
  weekStartsOn?: 'sunday' | 'monday';
  theme?: 'light' | 'dark' | 'auto';

  // Onboarding
  onboardingCompleted: boolean;

  // Settings
  notifications: {
    dailyReminders: boolean;
    weeklyReviews: boolean;
    goalMilestones: boolean;
    email: boolean;
  };

  // Smoke-free specific
  smokeFree?: {
    quitDate: string;
    cigarettesPerDay?: number;
    costPerPack?: number;
    cigarettesPerPack?: number;
  };
}

export interface UserSettings {
  userId: string;
  morningReminderTime?: string; // HH:mm format
  eveningReminderTime?: string;
  weeklyReviewDay?: 'sunday' | 'monday' | 'friday' | 'saturday';
  aiInsightsEnabled: boolean;
  dataBackupEnabled: boolean;
}
