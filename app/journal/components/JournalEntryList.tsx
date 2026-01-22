'use client';

import { formatDate } from '@/lib/utils/date';

interface JournalEntry {
  id: string;
  date: string;
  content: string;
  mood?: string;
  tags?: string[];
}

interface JournalEntryListProps {
  entries: JournalEntry[];
}

const moodEmojis: Record<string, string> = {
  great: '😄',
  good: '🙂',
  okay: '😐',
  down: '😔',
  terrible: '😢',
};

export default function JournalEntryList({ entries }: JournalEntryListProps) {
  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No journal entries yet</h3>
        <p className="text-gray-500">Start writing to track your journey and gain insights</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <div key={entry.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 transition-colors">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              {entry.mood && (
                <span className="text-2xl">{moodEmojis[entry.mood]}</span>
              )}
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(new Date(entry.date), 'EEEE, MMMM d, yyyy')}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(new Date(entry.date), 'h:mm a')}
                </p>
              </div>
            </div>
          </div>

          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>
          </div>

          {entry.tags && entry.tags.length > 0 && (
            <div className="flex gap-2 mt-4 flex-wrap">
              {entry.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
