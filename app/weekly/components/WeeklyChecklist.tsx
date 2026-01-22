'use client';

import { useState, useEffect } from 'react';
import { getTrackers, setTrackers } from '@/lib/storage/localStorage';
import { getTodayString, getWeekRange, formatDate } from '@/lib/utils/date';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  completedDate?: string;
}

export default function WeeklyChecklist() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [newItemText, setNewItemText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const defaultItems = [
    'Comb dog',
    'Give dog a bath',
    'Clean bathroom',
    'Grocery shopping',
    'Laundry',
    'Review weekly goals',
  ];

  useEffect(() => {
    loadChecklist();
  }, []);

  const loadChecklist = () => {
    const trackers = getTrackers();
    const weekRange = getWeekRange();
    const weekKey = formatDate(weekRange.start, 'yyyy-MM-dd');

    if (!trackers.weeklyChecklist) {
      trackers.weeklyChecklist = {};
    }

    // Check if we need to reset for new week
    const currentWeekData = trackers.weeklyChecklist[weekKey];
    if (!currentWeekData) {
      // New week - initialize with default items
      const newItems = defaultItems.map((text, index) => ({
        id: `${Date.now()}-${index}`,
        text,
        completed: false,
      }));
      trackers.weeklyChecklist[weekKey] = newItems;
      setTrackers(trackers);
      setItems(newItems);
    } else {
      setItems(currentWeekData);
    }
  };

  const saveChecklist = (updatedItems: ChecklistItem[]) => {
    const trackers = getTrackers();
    const weekRange = getWeekRange();
    const weekKey = formatDate(weekRange.start, 'yyyy-MM-dd');

    if (!trackers.weeklyChecklist) {
      trackers.weeklyChecklist = {};
    }

    trackers.weeklyChecklist[weekKey] = updatedItems;
    setTrackers(trackers);
    setItems(updatedItems);
  };

  const toggleItem = (id: string) => {
    const updatedItems = items.map(item =>
      item.id === id
        ? {
            ...item,
            completed: !item.completed,
            completedDate: !item.completed ? getTodayString() : undefined,
          }
        : item
    );
    saveChecklist(updatedItems);
  };

  const addItem = () => {
    if (!newItemText.trim()) return;

    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: newItemText.trim(),
      completed: false,
    };

    const updatedItems = [...items, newItem];
    saveChecklist(updatedItems);
    setNewItemText('');
    setIsAdding(false);
  };

  const deleteItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    saveChecklist(updatedItems);
  };

  const completedCount = items.filter(item => item.completed).length;
  const totalCount = items.length;
  const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const weekRange = getWeekRange();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900">Weekly Checklist</h2>
          <span className="text-sm text-gray-600">
            {formatDate(weekRange.start, 'MMM d')} - {formatDate(weekRange.end, 'MMM d')}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium text-gray-700">
            {completedCount} / {totalCount}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 group"
          >
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleItem(item.id)}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span
              className={`flex-1 ${
                item.completed ? 'text-gray-400 line-through' : 'text-gray-900'
              }`}
            >
              {item.text}
            </span>
            {item.completed && item.completedDate && (
              <span className="text-xs text-gray-500">
                {formatDate(new Date(item.completedDate), 'MMM d')}
              </span>
            )}
            <button
              onClick={() => deleteItem(item.id)}
              className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {isAdding ? (
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
            placeholder="New checklist item..."
            autoFocus
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addItem}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            Add
          </button>
          <button
            onClick={() => {
              setIsAdding(false);
              setNewItemText('');
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="mt-4 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors"
        >
          + Add Item
        </button>
      )}

      {completedCount === totalCount && totalCount > 0 && (
        <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg text-center">
          <p className="text-green-800 font-medium">🎉 All done for this week!</p>
        </div>
      )}
    </div>
  );
}
