'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { storage } from '@/lib/storage/localStorage';

interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'short-term' | 'long-term';
  progress: number;
  target: number;
  startDate: string;
  targetDate: string;
  createdAt: string;
}

const CATEGORIES = ['Health', 'Career', 'Personal', 'Financial', 'Relationships', 'Learning', 'Other'];
const CATEGORY_COLORS: Record<string, string> = {
  Health: 'from-green-400 to-emerald-500',
  Career: 'from-blue-400 to-indigo-500',
  Personal: 'from-purple-400 to-pink-500',
  Financial: 'from-yellow-400 to-orange-500',
  Relationships: 'from-red-400 to-rose-500',
  Learning: 'from-cyan-400 to-blue-500',
  Other: 'from-gray-400 to-slate-500',
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [filter, setFilter] = useState<'all' | 'short-term' | 'long-term'>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Personal',
    type: 'short-term' as 'short-term' | 'long-term',
    target: 100,
    targetDate: '',
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = () => {
    const savedGoals = storage.get('lifeos_goals') || [];
    setGoals(savedGoals);
  };

  const saveGoals = (updatedGoals: Goal[]) => {
    storage.set('lifeos_goals', updatedGoals);
    setGoals(updatedGoals);
  };

  const createGoal = () => {
    if (!formData.title.trim()) return;

    const newGoal: Goal = {
      id: Date.now().toString(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      type: formData.type,
      progress: 0,
      target: formData.target,
      startDate: new Date().toISOString(),
      targetDate: formData.targetDate,
      createdAt: new Date().toISOString(),
    };

    saveGoals([...goals, newGoal]);
    resetForm();
    setIsCreating(false);
  };

  const updateGoal = () => {
    if (!editingGoal || !formData.title.trim()) return;

    const updatedGoals = goals.map(goal =>
      goal.id === editingGoal.id
        ? {
            ...goal,
            title: formData.title.trim(),
            description: formData.description.trim(),
            category: formData.category,
            type: formData.type,
            target: formData.target,
            targetDate: formData.targetDate,
          }
        : goal
    );

    saveGoals(updatedGoals);
    setEditingGoal(null);
    resetForm();
  };

  const deleteGoal = (id: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      saveGoals(goals.filter(goal => goal.id !== id));
    }
  };

  const updateProgress = (id: string, newProgress: number) => {
    const updatedGoals = goals.map(goal =>
      goal.id === id ? { ...goal, progress: Math.min(Math.max(0, newProgress), goal.target) } : goal
    );
    saveGoals(updatedGoals);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Personal',
      type: 'short-term',
      target: 100,
      targetDate: '',
    });
  };

  const startEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description,
      category: goal.category,
      type: goal.type,
      target: goal.target,
      targetDate: goal.targetDate,
    });
    setIsCreating(true);
  };

  const cancelEdit = () => {
    setEditingGoal(null);
    resetForm();
    setIsCreating(false);
  };

  const filteredGoals = goals.filter(goal => {
    if (filter === 'all') return true;
    return goal.type === filter;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Goals</h1>
            <p className="mt-1 text-gray-600">Track progress toward your aspirations</p>
          </div>
          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
            >
              + New Goal
            </button>
          )}
        </div>

        {isCreating && (
          <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingGoal ? 'Edit Goal' : 'Create New Goal'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Goal Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Run a 5K race"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Add details about your goal..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'short-term' | 'long-term' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="short-term">Short-term</option>
                    <option value="long-term">Long-term</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target (units)</label>
                  <input
                    type="number"
                    value={formData.target}
                    onChange={(e) => setFormData({ ...formData, target: parseInt(e.target.value) || 100 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                  <input
                    type="date"
                    value={formData.targetDate}
                    onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={editingGoal ? updateGoal : createGoal}
                  disabled={!formData.title.trim()}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {editingGoal ? 'Update Goal' : 'Create Goal'}
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 border-b border-gray-200 pb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Goals ({goals.length})
          </button>
          <button
            onClick={() => setFilter('short-term')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              filter === 'short-term'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Short-term ({goals.filter(g => g.type === 'short-term').length})
          </button>
          <button
            onClick={() => setFilter('long-term')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              filter === 'long-term'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Long-term ({goals.filter(g => g.type === 'long-term').length})
          </button>
        </div>

        {filteredGoals.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No goals yet</h3>
              <p className="text-gray-500 mb-6">Create your first goal to start making progress</p>
              <button
                onClick={() => setIsCreating(true)}
                className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-white font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
              >
                Create Your First Goal
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {filteredGoals.map((goal) => {
              const percentage = (goal.progress / goal.target) * 100;
              const isComplete = goal.progress >= goal.target;

              return (
                <div
                  key={goal.id}
                  className={`rounded-xl border-2 p-6 transition-all ${
                    isComplete
                      ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50'
                      : 'border-gray-200 bg-white hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${CATEGORY_COLORS[goal.category]} text-white`}>
                          {goal.category}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                          {goal.type === 'short-term' ? '⚡ Short-term' : '🎯 Long-term'}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{goal.title}</h3>
                      {goal.description && (
                        <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(goal)}
                        className="text-blue-600 hover:text-blue-700 p-1"
                        title="Edit goal"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                        title="Delete goal"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm font-bold text-gray-900">
                          {goal.progress} / {goal.target} ({Math.round(percentage)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                          className={`h-4 rounded-full transition-all duration-500 ${
                            isComplete
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                              : 'bg-gradient-to-r from-blue-500 to-purple-500'
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {goal.targetDate && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Target: {new Date(goal.targetDate).toLocaleDateString()}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => updateProgress(goal.id, goal.progress - 1)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg font-medium transition-colors"
                      >
                        - 1
                      </button>
                      <button
                        onClick={() => updateProgress(goal.id, goal.progress + 1)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-medium transition-colors"
                      >
                        + 1
                      </button>
                      <button
                        onClick={() => updateProgress(goal.id, goal.progress + 5)}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg font-medium transition-colors"
                      >
                        + 5
                      </button>
                    </div>

                    {isComplete && (
                      <div className="p-3 bg-green-100 border-2 border-green-400 rounded-lg text-center">
                        <p className="text-green-800 font-semibold">🎉 Goal Completed!</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
