'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import JournalEntryForm from './components/JournalEntryForm';
import JournalEntryList from './components/JournalEntryList';
import { getJournalEntries } from '@/lib/storage/localStorage';

export default function JournalPage() {
  const [showForm, setShowForm] = useState(false);
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = () => {
    const storedEntries = getJournalEntries();
    setEntries(storedEntries);
  };

  const handleSave = () => {
    loadEntries();
    setShowForm(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Journal</h1>
            <p className="mt-1 text-gray-600">Capture your thoughts and reflections</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition-colors"
            >
              + New Entry
            </button>
          )}
        </div>

        {showForm && (
          <div className="mb-6">
            <JournalEntryForm onSave={handleSave} />
            <button
              onClick={() => setShowForm(false)}
              className="mt-3 text-sm text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
          </div>
        )}

        <JournalEntryList entries={entries} />
      </div>
    </DashboardLayout>
  );
}
