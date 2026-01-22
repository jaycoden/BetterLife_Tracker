'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import WeeklyChecklist from './components/WeeklyChecklist';

export default function WeeklyPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Weekly Review</h1>
            <p className="mt-1 text-gray-600">Track weekly tasks and reflect</p>
          </div>
        </div>

        <WeeklyChecklist />

        <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">📅</span>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Week of {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              </h2>
              <p className="text-gray-600">Your weekly progress summary</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Week Highlights</h3>
            <div className="text-center py-12">
              <p className="text-gray-500">No data for this week yet</p>
              <p className="text-sm text-gray-400 mt-2">Complete daily check-ins to see your weekly highlights</p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Goal Progress</h3>
            <div className="text-center py-12">
              <p className="text-gray-500">No active goals</p>
              <p className="text-sm text-gray-400 mt-2">Create goals to track weekly progress</p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Habit Streaks</h3>
            <div className="text-center py-12">
              <p className="text-gray-500">No habit data</p>
              <p className="text-sm text-gray-400 mt-2">Track habits to see your streaks</p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Work Summary</h3>
            <div className="text-center py-12">
              <p className="text-gray-500">No work logged</p>
              <p className="text-sm text-gray-400 mt-2">Track time and tasks to see your work summary</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
