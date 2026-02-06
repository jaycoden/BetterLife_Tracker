'use client';

import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage/localStorage';
import { getDashboardInsights, type PatternInsight, type EnergyCheckIn } from '@/lib/analytics/patterns';

export default function DashboardInsights() {
  const [insights, setInsights] = useState<PatternInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = () => {
    setIsLoading(true);

    // Load energy check-ins
    const checkins: EnergyCheckIn[] = storage.get('lifeos_energy_checkins') || [];

    // Load vape tracker data
    const trackers = storage.get('lifeos_trackers') || {};
    const dayStatuses = trackers.smokeFree?.dayStatuses || {};
    const quitDate = trackers.smokeFree?.quitVapeDate || trackers.smokeFree?.quitDate || new Date().toISOString().split('T')[0];

    // Load self-expression data
    const expressions = storage.get('lifeos_self_expression') || [];

    // Get top 3 insights
    const topInsights = getDashboardInsights({
      checkins,
      dayStatuses,
      quitDate,
      expressions,
    });

    setInsights(topInsights);
    setIsLoading(false);
  };

  const getInsightIcon = (type: PatternInsight['type']) => {
    switch (type) {
      case 'celebration':
        return '🎉';
      case 'warning':
        return '⚠️';
      case 'correlation':
        return '🔗';
      case 'streak':
        return '🔥';
      case 'observation':
        return '👁️';
      default:
        return '💡';
    }
  };

  const getInsightColor = (priority: PatternInsight['priority']) => {
    switch (priority) {
      case 'high':
        return 'from-red-50 to-orange-50 border-red-200';
      case 'medium':
        return 'from-yellow-50 to-amber-50 border-yellow-200';
      case 'low':
        return 'from-green-50 to-emerald-50 border-green-200';
      default:
        return 'from-gray-50 to-slate-50 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🧠</span>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Pattern Insights</h3>
            <p className="text-xs text-gray-600">Analyzing your week...</p>
          </div>
        </div>
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">🧠</span>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Pattern Insights</h3>
            <p className="text-xs text-gray-600">Your personal AI analyst</p>
          </div>
        </div>
        <div className="text-center py-8 bg-white rounded-xl">
          <p className="text-sm text-gray-500 mb-1">Not enough data yet</p>
          <p className="text-xs text-gray-400">Complete daily check-ins to see patterns</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🧠</span>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Pattern Insights</h3>
            <p className="text-xs text-gray-600">Top {insights.length} this week</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {insights.map((insight, idx) => (
          <div
            key={idx}
            className={`bg-gradient-to-br ${getInsightColor(insight.priority)} rounded-xl p-4 border-2 shadow-sm`}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{getInsightIcon(insight.type)}</span>
              <div className="flex-1">
                <h4 className="text-base font-bold text-gray-900 mb-1">{insight.title}</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <a
        href="/weekly"
        className="mt-4 block text-center text-sm text-purple-600 hover:text-purple-700 font-medium underline"
      >
        View all insights in Weekly Review →
      </a>
    </div>
  );
}
