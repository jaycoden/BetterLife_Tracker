'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import WaterTracker from './components/WaterTracker';
import DogCareTracker from './components/DogCareTracker';
import SmokeFreeTracker from './components/SmokeFreeTracker';

export default function TrackersPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Habit Trackers</h1>
            <p className="mt-1 text-gray-600">Monitor your daily habits and streaks</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <SmokeFreeTracker />
          <WaterTracker />
          <DogCareTracker />
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Trackers</h3>
          <div className="text-center py-12">
            <p className="text-gray-500">No custom trackers yet</p>
            <p className="text-sm text-gray-400 mt-2">Create trackers for any habit you want to build</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
