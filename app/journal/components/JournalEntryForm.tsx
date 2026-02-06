'use client';

import { useState } from 'react';
import { getJournalEntries, setJournalEntries } from '@/lib/storage/localStorage';
import { getTodayString } from '@/lib/utils/date';

interface JournalEntryFormProps {
  onSave: () => void;
}

export default function JournalEntryForm({ onSave }: JournalEntryFormProps) {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<string>('');
  const [tags, setTags] = useState('');
  const [entryDate, setEntryDate] = useState(getTodayString());
  const [isSaving, setIsSaving] = useState(false);

  const moods = [
    { value: 'great', emoji: '😄', label: 'Great' },
    { value: 'good', emoji: '🙂', label: 'Good' },
    { value: 'okay', emoji: '😐', label: 'Okay' },
    { value: 'down', emoji: '😔', label: 'Down' },
    { value: 'terrible', emoji: '😢', label: 'Terrible' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const entries = getJournalEntries();
    // Convert the selected date to ISO string at midnight local time
    const selectedDate = new Date(entryDate + 'T00:00:00');
    const newEntry = {
      id: Date.now().toString(),
      userId: '',
      date: selectedDate.toISOString(),
      content,
      mood,
      tags: tags.split(',').map(t => t.trim()).filter(t => t),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    entries.unshift(newEntry);
    setJournalEntries(entries);

    setContent('');
    setMood('');
    setTags('');
    setEntryDate(getTodayString());
    setIsSaving(false);
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">New Journal Entry</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="entryDate" className="block text-sm font-medium text-gray-700 mb-2">
            Entry Date
          </label>
          <input
            id="entryDate"
            type="date"
            value={entryDate}
            max={getTodayString()}
            onChange={(e) => setEntryDate(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">Set the date for this journal entry</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How are you feeling?
          </label>
          <div className="flex gap-2">
            {moods.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMood(m.value)}
                className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                  mood === m.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-1">{m.emoji}</div>
                <div className="text-xs font-medium text-gray-700">{m.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            What's on your mind?
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={8}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Write your thoughts, feelings, or reflections..."
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
            Tags (optional)
          </label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="work, personal, gratitude (comma separated)"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSaving || !content.trim()}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? 'Saving...' : 'Save Entry'}
          </button>
        </div>
      </div>
    </form>
  );
}
