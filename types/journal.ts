export type Mood = 'great' | 'good' | 'okay' | 'down' | 'terrible';

export interface JournalEntry {
  id: string;
  userId: string;
  date: string; // ISO date string
  content: string;
  voiceTranscript?: string;
  mood?: Mood;
  tags: string[];
  aiAnalysis?: AIAnalysis;
  createdAt: string;
  updatedAt: string;
}

export interface AIAnalysis {
  summary?: string;
  themes: string[];
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
  keyTopics: string[];
  suggestions?: string[];
  patterns?: string[];
  analyzedAt: string;
}

export interface JournalFilters {
  startDate?: string;
  endDate?: string;
  mood?: Mood;
  tags?: string[];
  searchQuery?: string;
}
