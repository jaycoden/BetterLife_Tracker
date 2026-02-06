'use client';

import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage/localStorage';
import { generateWeeklySummary, type PatternInsight, type EnergyCheckIn } from '@/lib/analytics/patterns';

export default function WeeklyInsights() {
  const [insights, setInsights] = useState<PatternInsight[]>([]);
  const [stats, setStats] = useState<any>(null);
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

    // Generate insights
    const summary = generateWeeklySummary({
      checkins,
      dayStatuses,
      quitDate,
      expressions,
    });

    setInsights(summary.insights);
    setStats(summary.stats);
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
      <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">🧠</span>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Weekly Pattern Insights</h2>
            <p className="text-sm text-gray-600">Analyzing your data...</p>
          </div>
        </div>
        <div className="text-center py-12">
          <p className="text-gray-500">Loading insights...</p>
        </div>
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-4xl">🧠</span>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Weekly Pattern Insights</h2>
            <p className="text-sm text-gray-600">Deterministic analysis, no AI</p>
          </div>
        </div>
        <div className="text-center py-12 bg-white rounded-xl">
          <p className="text-gray-500 mb-2">Not enough data yet</p>
          <p className="text-sm text-gray-400">Complete at least 3 daily check-ins to see patterns</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">🧠</span>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Weekly Pattern Insights</h2>
          <p className="text-sm text-gray-600">
            {insights.length} pattern{insights.length !== 1 ? 's' : ''} detected this week
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 text-center border-2 border-blue-200">
            <p className="text-3xl font-bold text-blue-600">{stats.avgEnergy.toFixed(1)}</p>
            <p className="text-xs text-gray-600 mt-1">Avg Energy</p>
            <p className="text-xs text-gray-400">(out of 3)</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border-2 border-purple-200">
            <p className="text-2xl font-bold text-purple-600 capitalize">{stats.dominantNSState}</p>
            <p className="text-xs text-gray-600 mt-1">Nervous System</p>
            <p className="text-xs text-gray-400">(most common)</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border-2 border-green-200">
            <p className="text-3xl font-bold text-green-600">{stats.cleanDays}/7</p>
            <p className="text-xs text-gray-600 mt-1">Clean Days</p>
            <p className="text-xs text-gray-400">(this week)</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border-2 border-orange-200">
            <p className="text-3xl font-bold text-orange-600">{stats.vapeDays}</p>
            <p className="text-xs text-gray-600 mt-1">Vape Days</p>
            <p className="text-xs text-gray-400">(this week)</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center border-2 border-pink-200">
            <p className="text-3xl font-bold text-pink-600">{stats.expressionDays || 0}/7</p>
            <p className="text-xs text-gray-600 mt-1">Self-Expression</p>
            <p className="text-xs text-gray-400">(days expressed)</p>
          </div>
        </div>
      )}

      {/* Top Contributing Factors */}
      {stats && stats.topFactors.length > 0 && (
        <div className="bg-white rounded-xl p-4 mb-6 border-2 border-indigo-200">
          <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">
            Top Contributing Factors
          </h3>
          <div className="flex flex-wrap gap-2">
            {stats.topFactors.map(([factor, count]: [string, number]) => (
              <div
                key={factor}
                className="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium flex items-center gap-2"
              >
                <span>{factor}</span>
                <span className="text-indigo-500">×{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insight Cards */}
      <div className="space-y-4">
        {insights.map((insight, idx) => (
          <div
            key={idx}
            className={`bg-gradient-to-br ${getInsightColor(insight.priority)} rounded-xl p-6 border-2 shadow-sm`}
          >
            <div className="flex items-start gap-4">
              <span className="text-4xl">{getInsightIcon(insight.type)}</span>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{insight.title}</h3>
                <p className="text-gray-700 leading-relaxed">{insight.description}</p>
                {insight.priority === 'high' && (
                  <div className="mt-3 px-3 py-1 bg-white/70 rounded-full inline-block">
                    <p className="text-xs font-semibold text-gray-700">High priority - worth attention</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Refresh Button */}
      <button
        onClick={loadInsights}
        className="mt-6 w-full rounded-lg bg-purple-600 px-6 py-3 text-white font-semibold hover:bg-purple-700 transition-colors"
      >
        Refresh Insights
      </button>
    </div>
  );
}
