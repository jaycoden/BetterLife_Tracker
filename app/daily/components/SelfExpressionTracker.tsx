'use client';

import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage/localStorage';
import { getTodayString, getDaysAgo } from '@/lib/utils/date';

type ExpressionType = 'creative' | 'emotional' | 'physical' | 'intellectual' | 'social' | 'spiritual';

interface DailyExpression {
  date: string;
  expressed: boolean;
  types: ExpressionType[];
  note?: string;
}

export default function SelfExpressionTracker() {
  const [todayEntry, setTodayEntry] = useState<DailyExpression | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [expressed, setExpressed] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<ExpressionType[]>([]);
  const [note, setNote] = useState('');
  const [weekStreak, setWeekStreak] = useState(0);

  const expressionTypes = [
    { value: 'creative' as ExpressionType, label: 'Creative', emoji: '🎨', description: 'Art, music, writing, crafts' },
    { value: 'emotional' as ExpressionType, label: 'Emotional', emoji: '💭', description: 'Journaling, crying, laughing' },
    { value: 'physical' as ExpressionType, label: 'Physical', emoji: '💃', description: 'Dance, movement, sports' },
    { value: 'intellectual' as ExpressionType, label: 'Intellectual', emoji: '🧠', description: 'Deep conversations, learning' },
    { value: 'social' as ExpressionType, label: 'Social', emoji: '🗣️', description: 'Authentic connection' },
    { value: 'spiritual' as ExpressionType, label: 'Spiritual', emoji: '🕉️', description: 'Meditation, nature, ritual' },
  ];

  useEffect(() => {
    loadTodayEntry();
    calculateWeekStreak();
  }, []);

  const loadTodayEntry = () => {
    const today = getTodayString();
    const allEntries = storage.get('lifeos_self_expression') || [];
    const existing = allEntries.find((e: DailyExpression) => e.date === today);

    if (existing) {
      setTodayEntry(existing);
      setExpressed(existing.expressed);
      setSelectedTypes(existing.types);
      setNote(existing.note || '');
    } else {
      setIsEditing(true);
    }
  };

  const calculateWeekStreak = () => {
    const allEntries = storage.get('lifeos_self_expression') || [];
    let streak = 0;

    for (let i = 0; i < 7; i++) {
      const date = getDaysAgo(i);
      const entry = allEntries.find((e: DailyExpression) => e.date === date);
      if (entry && entry.expressed) {
        streak++;
      }
    }

    setWeekStreak(streak);
  };

  const saveEntry = () => {
    const today = getTodayString();
    const entry: DailyExpression = {
      date: today,
      expressed,
      types: selectedTypes,
      note: note.trim() || undefined,
    };

    const allEntries = storage.get('lifeos_self_expression') || [];
    const filtered = allEntries.filter((e: DailyExpression) => e.date !== today);
    filtered.push(entry);

    storage.set('lifeos_self_expression', filtered);
    setTodayEntry(entry);
    setIsEditing(false);
    calculateWeekStreak();
  };

  const toggleType = (type: ExpressionType) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  if (!isEditing && todayEntry) {
    return (
      <div className="rounded-xl border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">✨</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Self-Expression</h2>
              <p className="text-sm text-gray-600">
                {weekStreak}/7 days this week
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-pink-600 hover:text-pink-700 font-medium underline"
          >
            Edit
          </button>
        </div>

        {todayEntry.expressed ? (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-4 border-2 border-green-300">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎉</span>
                <div>
                  <p className="font-bold text-green-800 text-lg">You expressed yourself today!</p>
                  <p className="text-sm text-green-700">That's beautiful - keep honoring your authentic self</p>
                </div>
              </div>
            </div>

            {todayEntry.types.length > 0 && (
              <div className="bg-white rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">How you expressed yourself:</p>
                <div className="flex flex-wrap gap-2">
                  {todayEntry.types.map(type => {
                    const typeData = expressionTypes.find(t => t.value === type);
                    return (
                      <div
                        key={type}
                        className="px-3 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-medium flex items-center gap-2"
                      >
                        <span>{typeData?.emoji}</span>
                        <span>{typeData?.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {todayEntry.note && (
              <div className="bg-white rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Note:</p>
                <p className="text-gray-700">{todayEntry.note}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gradient-to-r from-gray-100 to-slate-100 rounded-xl p-4 border-2 border-gray-300">
            <div className="flex items-center gap-3">
              <span className="text-3xl">😶</span>
              <div>
                <p className="font-bold text-gray-800 text-lg">No self-expression today</p>
                <p className="text-sm text-gray-700">That's okay - not every day needs to be expressive</p>
              </div>
            </div>
          </div>
        )}

        {weekStreak >= 5 && (
          <div className="mt-4 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-xl p-4 border-2 border-yellow-300">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔥</span>
              <p className="text-sm font-semibold text-yellow-800">
                {weekStreak} days of self-expression this week! You're really honoring yourself.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50 p-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">✨</span>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Self-Expression</h2>
          <p className="text-sm text-gray-600">Did you express yourself authentically today?</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Yes/No Toggle */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Did you express yourself today? <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setExpressed(true)}
              className={`p-4 rounded-xl border-2 transition-all ${
                expressed
                  ? 'border-green-500 bg-gradient-to-r from-green-100 to-emerald-100 shadow-lg scale-105'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            >
              <div className="text-3xl mb-2">✨</div>
              <div className={`font-semibold ${expressed ? 'text-green-800' : 'text-gray-900'}`}>
                Yes, I did
              </div>
            </button>
            <button
              type="button"
              onClick={() => {
                setExpressed(false);
                setSelectedTypes([]);
              }}
              className={`p-4 rounded-xl border-2 transition-all ${
                !expressed
                  ? 'border-gray-500 bg-gradient-to-r from-gray-100 to-slate-100 shadow-lg scale-105'
                  : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            >
              <div className="text-3xl mb-2">😶</div>
              <div className={`font-semibold ${!expressed ? 'text-gray-800' : 'text-gray-900'}`}>
                Not today
              </div>
            </button>
          </div>
        </div>

        {/* Expression Types (only if expressed) */}
        {expressed && (
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              How did you express yourself? (optional)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {expressionTypes.map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => toggleType(type.value)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    selectedTypes.includes(type.value)
                      ? 'border-pink-500 bg-gradient-to-br from-pink-100 to-rose-100 shadow-lg'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-2xl">{type.emoji}</span>
                    <div>
                      <div className={`font-semibold text-sm ${selectedTypes.includes(type.value) ? 'text-pink-800' : 'text-gray-900'}`}>
                        {type.label}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">{type.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Optional Note */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Note (optional)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="How did it feel? What did you do?"
            maxLength={100}
            className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 focus:border-pink-500 focus:outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">Max 100 characters</p>
        </div>

        {/* Save Button */}
        <button
          onClick={saveEntry}
          className="w-full rounded-lg bg-pink-600 px-6 py-4 text-white font-bold hover:bg-pink-700 transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  );
}
