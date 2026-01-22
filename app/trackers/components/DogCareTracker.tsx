'use client';

import { useState, useEffect } from 'react';
import { getTrackers, setTrackers } from '@/lib/storage/localStorage';
import { getTodayString, getRelativeTimeString } from '@/lib/utils/date';

export default function DogCareTracker() {
  const [lastBrushed, setLastBrushed] = useState<string | null>(null);

  useEffect(() => {
    const trackers = getTrackers();
    if (trackers.dogCare) {
      setLastBrushed(trackers.dogCare.lastBrushed || null);
    }
  }, []);

  const markBrushed = () => {
    const today = getTodayString();
    setLastBrushed(today);
    saveDogCare({ lastBrushed: today });
  };

  const saveDogCare = (updates: { lastBrushed?: string }) => {
    const trackers = getTrackers();

    if (!trackers.dogCare) {
      trackers.dogCare = {};
    }

    trackers.dogCare = {
      ...trackers.dogCare,
      ...updates,
    };

    setTrackers(trackers);
  };

  const daysSinceBrushed = lastBrushed
    ? Math.floor((new Date().getTime() - new Date(lastBrushed).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-4xl">🐕</div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Dog Brushing</h3>
          <p className="text-sm text-gray-600">Weekly goal</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-3xl">🪮</div>
          {lastBrushed && daysSinceBrushed !== null && daysSinceBrushed > 7 && (
            <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
              ⚠️ Overdue
            </span>
          )}
        </div>

        {lastBrushed ? (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">Last brushed:</p>
            <p className="text-lg font-semibold text-gray-900">
              {getRelativeTimeString(new Date(lastBrushed))}
            </p>
          </div>
        ) : (
          <p className="text-gray-500 mb-4">Not brushed yet this week</p>
        )}

        <button
          onClick={markBrushed}
          className="w-full rounded-lg bg-amber-600 px-4 py-3 text-white font-medium hover:bg-amber-700 transition-colors"
        >
          Mark as Brushed Today
        </button>
      </div>
    </div>
  );
}
