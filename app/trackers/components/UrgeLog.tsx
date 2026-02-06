'use client';

import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage/localStorage';

type UrgeIntensity = 1 | 2 | 3 | 4 | 5;

interface UrgeEntry {
  id: string;
  timestamp: string;
  intensity: UrgeIntensity;
  trigger?: string;
  replacement?: string;
  notes?: string;
}

export default function UrgeLog() {
  const [urges, setUrges] = useState<UrgeEntry[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [intensity, setIntensity] = useState<UrgeIntensity>(3);
  const [trigger, setTrigger] = useState('');
  const [replacement, setReplacement] = useState('');
  const [notes, setNotes] = useState('');

  const commonTriggers = [
    'Stress',
    'Boredom',
    'Social situation',
    'After meal',
    'Driving',
    'Alcohol',
    'Anxiety',
    'Saw someone vaping',
    'Break at work',
    'Other',
  ];

  const commonReplacements = [
    'Deep breathing',
    'Went for walk',
    'Drank water',
    'Chewed gum',
    'Called someone',
    'Distracted myself',
    'Exercise',
    'Ate snack',
    'Journaled',
    'Did nothing (rode it out)',
  ];

  useEffect(() => {
    loadUrges();
  }, []);

  const loadUrges = () => {
    const saved = storage.get('lifeos_urge_log') || [];
    // Sort by timestamp descending (newest first)
    const sorted = saved.sort((a: UrgeEntry, b: UrgeEntry) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    setUrges(sorted);
  };

  const logUrge = () => {
    const entry: UrgeEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      intensity,
      trigger: trigger.trim() || undefined,
      replacement: replacement.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    const allUrges = storage.get('lifeos_urge_log') || [];
    allUrges.push(entry);
    storage.set('lifeos_urge_log', allUrges);

    // Reset form
    setIntensity(3);
    setTrigger('');
    setReplacement('');
    setNotes('');
    setShowModal(false);

    loadUrges();
  };

  const deleteUrge = (id: string) => {
    const allUrges = storage.get('lifeos_urge_log') || [];
    const filtered = allUrges.filter((u: UrgeEntry) => u.id !== id);
    storage.set('lifeos_urge_log', filtered);
    loadUrges();
  };

  const getIntensityColor = (intensity: UrgeIntensity) => {
    switch (intensity) {
      case 1:
        return 'bg-green-100 text-green-700 border-green-300';
      case 2:
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 3:
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 4:
        return 'bg-red-100 text-red-700 border-red-300';
      case 5:
        return 'bg-purple-100 text-purple-700 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getIntensityLabel = (intensity: UrgeIntensity) => {
    switch (intensity) {
      case 1:
        return 'Mild';
      case 2:
        return 'Low-Medium';
      case 3:
        return 'Medium';
      case 4:
        return 'Strong';
      case 5:
        return 'Extreme';
      default:
        return 'Unknown';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Calculate today's urge count
  const today = new Date().toISOString().split('T')[0];
  const todayUrges = urges.filter(u => u.timestamp.split('T')[0] === today);

  return (
    <>
      <div className="rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">📊</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Urge Log</h2>
              <p className="text-sm text-gray-600">
                {todayUrges.length} urge{todayUrges.length !== 1 ? 's' : ''} today · {urges.length} total logged
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="rounded-lg bg-amber-600 px-4 py-2 text-white font-semibold hover:bg-amber-700 transition-colors"
          >
            Log Urge
          </button>
        </div>

        {urges.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500 mb-2">No urges logged yet</p>
            <p className="text-sm text-gray-400">Track your urges to understand patterns</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {urges.slice(0, 10).map((urge) => (
              <div
                key={urge.id}
                className="bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-amber-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-full border-2 font-bold text-sm ${getIntensityColor(urge.intensity)}`}>
                      {getIntensityLabel(urge.intensity)}
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      {formatTimestamp(urge.timestamp)}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteUrge(urge.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Delete"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-2 text-sm">
                  {urge.trigger && (
                    <div>
                      <span className="font-semibold text-gray-700">Trigger:</span>{' '}
                      <span className="text-gray-600">{urge.trigger}</span>
                    </div>
                  )}
                  {urge.replacement && (
                    <div>
                      <span className="font-semibold text-gray-700">What I did:</span>{' '}
                      <span className="text-gray-600">{urge.replacement}</span>
                    </div>
                  )}
                  {urge.notes && (
                    <div>
                      <span className="font-semibold text-gray-700">Notes:</span>{' '}
                      <span className="text-gray-600">{urge.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {urges.length > 10 && (
          <p className="text-center text-sm text-gray-500 mt-4">
            Showing 10 most recent urges (out of {urges.length} total)
          </p>
        )}
      </div>

      {/* Log Urge Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Log an Urge</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Intensity */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Intensity <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setIntensity(level as UrgeIntensity)}
                      className={`flex-1 p-3 rounded-xl border-2 transition-all font-bold ${
                        intensity === level
                          ? `${getIntensityColor(level as UrgeIntensity)} scale-110 shadow-lg`
                          : 'border-gray-300 bg-white hover:border-gray-400'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">1 = Mild, 5 = Extreme</p>
              </div>

              {/* Trigger */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  What triggered it? (optional)
                </label>
                <input
                  type="text"
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                  placeholder="Type or select below"
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:border-amber-500 focus:outline-none mb-2"
                />
                <div className="flex flex-wrap gap-2">
                  {commonTriggers.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTrigger(t)}
                      className={`px-3 py-1 rounded-full border-2 text-sm transition-all ${
                        trigger === t
                          ? 'border-amber-500 bg-amber-100 text-amber-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Replacement Behavior */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  What did you do instead? (optional)
                </label>
                <input
                  type="text"
                  value={replacement}
                  onChange={(e) => setReplacement(e.target.value)}
                  placeholder="Type or select below"
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:border-amber-500 focus:outline-none mb-2"
                />
                <div className="flex flex-wrap gap-2">
                  {commonReplacements.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setReplacement(r)}
                      className={`px-3 py-1 rounded-full border-2 text-sm transition-all ${
                        replacement === r
                          ? 'border-amber-500 bg-amber-100 text-amber-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Additional notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How are you feeling? Any other context?"
                  maxLength={200}
                  rows={3}
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:border-amber-500 focus:outline-none resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">Max 200 characters</p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg border-2 border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={logUrge}
                  className="flex-1 rounded-lg bg-amber-600 px-6 py-3 text-white font-bold hover:bg-amber-700 transition-colors"
                >
                  Save Urge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
