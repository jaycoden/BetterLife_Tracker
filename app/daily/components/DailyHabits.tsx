'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTrackers, setTrackers } from '@/lib/storage/localStorage';
import { getTodayString } from '@/lib/utils/date';

interface Habit {
  id: string;
  name: string;
  icon: string;
  completed: boolean;
}

interface HabitTemplate {
  id: string;
  name: string;
  icon: string;
}

const DEFAULT_HABITS: HabitTemplate[] = [
  { id: 'journal', name: 'Write Journal Entry', icon: '📝' },
  { id: 'water', name: 'Drink 8 glasses of water', icon: '💧' },
  { id: 'exercise', name: 'Exercise for 30 minutes', icon: '💪' },
  { id: 'read', name: 'Read for 20 minutes', icon: '📚' },
  { id: 'meditate', name: 'Meditate or breathe deeply', icon: '🧘' },
  { id: 'sleep', name: '7-8 hours of sleep', icon: '😴' },
  { id: 'healthy-meal', name: 'Eat a healthy meal', icon: '🥗' },
];

const EMOJI_OPTIONS = ['📝', '💧', '💪', '📚', '🧘', '😴', '🥗', '🎯', '🏃', '🎨', '🎵', '🍎', '☕', '🌱', '✨', '🔥', '⭐', '🎪', '🎭', '🎬'];

export default function DailyHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitTemplates, setHabitTemplates] = useState<HabitTemplate[]>([]);
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('⭐');

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = () => {
    const trackers = getTrackers();
    const today = getTodayString();

    if (!trackers.habitTemplates) {
      trackers.habitTemplates = DEFAULT_HABITS;
      setTrackers(trackers);
    }

    const templates = trackers.habitTemplates || DEFAULT_HABITS;
    setHabitTemplates(templates);

    if (!trackers.dailyHabits) {
      trackers.dailyHabits = {};
    }

    const todayHabits = trackers.dailyHabits[today] || templates.map((h: HabitTemplate) => ({
      ...h,
      completed: false,
    }));

    setHabits(todayHabits);
  };

  const toggleHabit = (id: string) => {
    const updatedHabits = habits.map(habit =>
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    );

    setHabits(updatedHabits);

    const trackers = getTrackers();
    const today = getTodayString();

    if (!trackers.dailyHabits) {
      trackers.dailyHabits = {};
    }

    trackers.dailyHabits[today] = updatedHabits;
    setTrackers(trackers);
  };

  const addHabit = () => {
    if (!newHabitName.trim()) return;

    const newTemplate: HabitTemplate = {
      id: Date.now().toString(),
      name: newHabitName.trim(),
      icon: selectedIcon,
    };

    const trackers = getTrackers();
    const updatedTemplates = [...habitTemplates, newTemplate];
    trackers.habitTemplates = updatedTemplates;
    setTrackers(trackers);
    setHabitTemplates(updatedTemplates);

    const newHabit: Habit = {
      ...newTemplate,
      completed: false,
    };

    const updatedHabits = [...habits, newHabit];
    const today = getTodayString();
    if (!trackers.dailyHabits) {
      trackers.dailyHabits = {};
    }
    trackers.dailyHabits[today] = updatedHabits;
    setTrackers(trackers);
    setHabits(updatedHabits);

    setNewHabitName('');
    setSelectedIcon('⭐');
    setIsAddingHabit(false);
  };

  const deleteHabit = (id: string) => {
    if (id === 'journal') {
      return;
    }

    const trackers = getTrackers();
    const updatedTemplates = habitTemplates.filter(h => h.id !== id);
    trackers.habitTemplates = updatedTemplates;
    setTrackers(trackers);
    setHabitTemplates(updatedTemplates);

    const updatedHabits = habits.filter(h => h.id !== id);
    const today = getTodayString();
    if (!trackers.dailyHabits) {
      trackers.dailyHabits = {};
    }
    trackers.dailyHabits[today] = updatedHabits;
    setTrackers(trackers);
    setHabits(updatedHabits);
  };

  const completedCount = habits.filter(h => h.completed).length;
  const totalCount = habits.length;
  const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Today's Habits</h3>
          <button
            onClick={() => setIsAddingHabit(!isAddingHabit)}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
          >
            {isAddingHabit ? 'Cancel' : '+ Add Habit'}
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium text-gray-700">
            {completedCount} / {totalCount}
          </span>
        </div>
      </div>

      {isAddingHabit && (
        <div className="mb-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <input
            type="text"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            placeholder="Enter habit name..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <div className="mb-3">
            <p className="text-xs text-gray-600 mb-2">Select an icon:</p>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setSelectedIcon(emoji)}
                  className={`text-2xl p-2 rounded-lg transition-all ${
                    selectedIcon === emoji
                      ? 'bg-blue-200 ring-2 ring-blue-500'
                      : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={addHabit}
            disabled={!newHabitName.trim()}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Add Habit
          </button>
        </div>
      )}

      <div className="space-y-3">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="group relative"
          >
            <button
              onClick={() => toggleHabit(habit.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                habit.completed
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl">{habit.icon}</span>
              <span
                className={`flex-1 text-left font-medium ${
                  habit.completed ? 'text-gray-600 line-through' : 'text-gray-900'
                }`}
              >
                {habit.name}
              </span>
              {habit.id === 'journal' && (
                <Link
                  href="/journal"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-blue-600 font-medium hover:text-blue-700 px-2 py-1 bg-blue-100 rounded hover:bg-blue-200 transition-colors"
                >
                  Go →
                </Link>
              )}
              {habit.completed && (
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
            {habit.id !== 'journal' && (
              <button
                onClick={() => deleteHabit(habit.id)}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-all text-sm font-bold"
                title="Delete habit"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      {completedCount === totalCount && totalCount > 0 && (
        <div className="mt-4 p-3 bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-400 rounded-lg text-center">
          <p className="text-green-800 font-semibold">🎉 Perfect day! All habits completed!</p>
        </div>
      )}
    </div>
  );
}
