'use client';

import { useState, useEffect } from 'react';
import { getTrackers, setTrackers } from '@/lib/storage/localStorage';
import { getTodayString } from '@/lib/utils/date';

export default function WaterTracker() {
  const [bottlesConsumed, setBottlesConsumed] = useState(0);
  const dailyGoal = 8; // 8 bottles per day

  useEffect(() => {
    const trackers = getTrackers();
    const today = getTodayString();
    const todayWater = trackers.water?.[today] || 0;
    setBottlesConsumed(todayWater);
  }, []);

  const addBottle = () => {
    const newCount = bottlesConsumed + 1;
    setBottlesConsumed(newCount);
    saveWaterData(newCount);
  };

  const removeBottle = () => {
    if (bottlesConsumed > 0) {
      const newCount = bottlesConsumed - 1;
      setBottlesConsumed(newCount);
      saveWaterData(newCount);
    }
  };

  const saveWaterData = (count: number) => {
    const trackers = getTrackers();
    const today = getTodayString();

    if (!trackers.water) {
      trackers.water = {};
    }

    trackers.water[today] = count;
    setTrackers(trackers);
  };

  const percentage = Math.min((bottlesConsumed / dailyGoal) * 100, 100);

  return (
    <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">💧</div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Water Intake</h3>
            <p className="text-sm text-gray-600">Daily goal: {dailyGoal} bottles</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-gray-700">
              {bottlesConsumed} / {dailyGoal}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-blue-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={removeBottle}
            disabled={bottlesConsumed === 0}
            className="w-12 h-12 rounded-full bg-white border-2 border-gray-300 text-gray-700 font-bold text-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            -
          </button>
          <div className="text-center">
            <p className="text-4xl font-bold text-blue-600">{bottlesConsumed}</p>
            <p className="text-sm text-gray-600">bottles</p>
          </div>
          <button
            onClick={addBottle}
            className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-xl hover:bg-blue-700 transition-colors"
          >
            +
          </button>
        </div>

        {bottlesConsumed >= dailyGoal && (
          <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded-lg text-center">
            <p className="text-green-800 font-medium">🎉 Goal reached! Great job staying hydrated!</p>
          </div>
        )}
      </div>
    </div>
  );
}
