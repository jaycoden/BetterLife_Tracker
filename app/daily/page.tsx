'use client';

import Link from 'next/link';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DailyHabits from './components/DailyHabits';
import EnergyCheckin from './components/EnergyCheckin';
import SelfExpressionTracker from './components/SelfExpressionTracker';

export default function DailyPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Daily Check-in</h1>
          <p className="mt-1 text-gray-600">Check in with yourself and track habits</p>
        </div>

        <EnergyCheckin />

        <SelfExpressionTracker />

        <DailyHabits />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Link
            href="/daily/morning"
            className="group rounded-xl border-2 border-gray-200 bg-gradient-to-br from-yellow-50 to-orange-50 p-8 transition-all hover:shadow-lg hover:border-yellow-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="text-5xl">☀️</div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Morning Routine</h2>
                <p className="text-gray-600">Start your day right</p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-yellow-600">✓</span>
                Set daily intentions
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-600">✓</span>
                Express gratitude
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-600">✓</span>
                Track sleep quality
              </li>
            </ul>
          </Link>

          <Link
            href="/daily/evening"
            className="group rounded-xl border-2 border-gray-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-8 transition-all hover:shadow-lg hover:border-indigo-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="text-5xl">🌙</div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Evening Review</h2>
                <p className="text-gray-600">Reflect on your day</p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-indigo-600">✓</span>
                Review accomplishments
              </li>
              <li className="flex items-center gap-2">
                <span className="text-indigo-600">✓</span>
                Note lessons learned
              </li>
              <li className="flex items-center gap-2">
                <span className="text-indigo-600">✓</span>
                Plan for tomorrow
              </li>
            </ul>
          </Link>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Check-ins</h3>
          <div className="text-center py-12">
            <p className="text-gray-500">No check-ins yet</p>
            <p className="text-sm text-gray-400 mt-2">Complete your first morning or evening routine</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
