'use client';

import { useState, useEffect } from 'react';
import { getTrackers, setTrackers } from '@/lib/storage/localStorage';
import { getTodayString, formatDate } from '@/lib/utils/date';

interface DayStatus {
  date: string;
  smokeFree: boolean;
}

export default function SmokeFreeTracker() {
  const [quitDate, setQuitDate] = useState<string | null>(null);
  const [isSettingDate, setIsSettingDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [dayStatuses, setDayStatuses] = useState<Record<string, boolean>>({});
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    loadTrackerData();
  }, []);

  const loadTrackerData = () => {
    const trackers = getTrackers();
    if (trackers.smokeFree?.quitDate) {
      setQuitDate(trackers.smokeFree.quitDate);
    }
    if (trackers.smokeFree?.dayStatuses) {
      setDayStatuses(trackers.smokeFree.dayStatuses);
    }
  };

  const saveQuitDate = () => {
    const trackers = getTrackers();
    if (!trackers.smokeFree) {
      trackers.smokeFree = {};
    }
    trackers.smokeFree.quitDate = selectedDate;

    // Initialize all days from quit date to today as smoke-free
    const statuses: Record<string, boolean> = {};
    const start = new Date(selectedDate);
    const today = new Date();
    for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      statuses[dateStr] = true; // Default all to smoke-free
    }
    trackers.smokeFree.dayStatuses = statuses;

    setTrackers(trackers);
    setQuitDate(selectedDate);
    setDayStatuses(statuses);
    setIsSettingDate(false);
  };

  const toggleDayStatus = (dateStr: string) => {
    const trackers = getTrackers();
    if (!trackers.smokeFree) return;

    const newStatuses = { ...dayStatuses, [dateStr]: !dayStatuses[dateStr] };
    trackers.smokeFree.dayStatuses = newStatuses;
    setTrackers(trackers);
    setDayStatuses(newStatuses);
  };

  const calculateStreak = () => {
    if (!quitDate) return 0;

    // Start from today and go backwards
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;

    for (let d = new Date(today); d >= new Date(quitDate); d.setDate(d.getDate() - 1)) {
      const dateStr = d.toISOString().split('T')[0];
      if (dayStatuses[dateStr] === true) {
        streak++;
      } else if (dayStatuses[dateStr] === false) {
        break; // Streak broken
      } else {
        // If no data, assume smoke-free (default)
        streak++;
      }
    }

    return streak;
  };

  const calculateMoneySaved = () => {
    const streak = calculateStreak();
    // $40 every 5 days = $8 per day
    const dailyCost = 8;
    return Math.floor(streak * dailyCost);
  };

  const calculateLifeRegained = () => {
    const streak = calculateStreak();
    const cigarettesPerDay = 10; // Based on $40/5 days, rough estimate
    const cigarettesAvoided = streak * cigarettesPerDay;
    const minutesPerCigarette = 11;
    const totalMinutes = cigarettesAvoided * minutesPerCigarette;
    const hours = Math.floor(totalMinutes / 60);
    return hours;
  };

  const getMilestoneProgress = () => {
    const days = calculateStreak();
    const milestones = [
      { days: 1, label: '24 Hours', description: 'Carbon monoxide leaves your body', icon: '💨' },
      { days: 3, label: '3 Days', description: 'Breathing becomes easier', icon: '🫁' },
      { days: 7, label: '1 Week', description: 'Sense of taste improving', icon: '👅' },
      { days: 30, label: '1 Month', description: 'Lung function improving', icon: '💪' },
      { days: 90, label: '3 Months', description: 'Circulation improving', icon: '❤️' },
      { days: 180, label: '6 Months', description: 'Coughing decreases significantly', icon: '🌟' },
      { days: 365, label: '1 Year', description: 'Heart disease risk cut in half!', icon: '🎉' },
    ];

    const nextMilestone = milestones.find(m => m.days > days) || milestones[milestones.length - 1];

    return { nextMilestone, allMilestones: milestones };
  };

  const getCalendarDays = () => {
    if (!quitDate) return [];

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days in month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const quitDateObj = new Date(quitDate);
      const todayObj = new Date();
      todayObj.setHours(0, 0, 0, 0);

      // Only show days between quit date and today
      if (date >= quitDateObj && date <= todayObj) {
        const status = dayStatuses[dateStr] !== undefined ? dayStatuses[dateStr] : true;
        days.push({ date, dateStr, status });
      } else {
        days.push(null);
      }
    }

    return days;
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    const today = new Date();
    const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
    if (next <= today) {
      setCurrentMonth(next);
    }
  };

  const streak = calculateStreak();
  const moneySaved = calculateMoneySaved();
  const hoursRegained = calculateLifeRegained();
  const { nextMilestone, allMilestones } = getMilestoneProgress();
  const calendarDays = getCalendarDays();

  return (
    <div className="rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6 col-span-2">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="text-5xl">🚭</div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Smoke-Free Journey</h3>
            <p className="text-sm text-gray-600">Click calendar days to mark if you smoked</p>
          </div>
        </div>
        {quitDate && (
          <button
            onClick={() => setIsSettingDate(true)}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Change Quit Date
          </button>
        )}
      </div>

      {!quitDate || isSettingDate ? (
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">When did you quit smoking?</h4>
          <input
            type="date"
            value={selectedDate}
            max={getTodayString()}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-lg mb-4 focus:border-green-500 focus:outline-none"
          />
          <div className="flex gap-3">
            <button
              onClick={saveQuitDate}
              className="flex-1 rounded-lg bg-green-600 px-6 py-3 text-white font-semibold hover:bg-green-700 transition-colors"
            >
              {quitDate ? 'Update Date' : 'Start Tracking'}
            </button>
            {isSettingDate && quitDate && (
              <button
                onClick={() => setIsSettingDate(false)}
                className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border-4 border-green-500">
              <p className="text-6xl font-bold text-green-600 mb-2">{streak}</p>
              <p className="text-sm font-bold text-gray-900">Day Streak</p>
              <p className="text-xs text-gray-500 mt-1">Current smoke-free streak</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border-2 border-blue-200">
              <p className="text-5xl font-bold text-blue-600 mb-2">${moneySaved}</p>
              <p className="text-sm font-medium text-gray-700">Money Saved</p>
              <p className="text-xs text-gray-500 mt-1">$8/day × {streak} days</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border-2 border-purple-200">
              <p className="text-5xl font-bold text-purple-600 mb-2">{hoursRegained}</p>
              <p className="text-sm font-medium text-gray-700">Hours Regained</p>
              <p className="text-xs text-gray-500 mt-1">Life expectancy gained</p>
            </div>
          </div>

          {/* Calendar View */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-900 text-lg">Daily Tracker</h4>
              <div className="flex items-center gap-3">
                <button
                  onClick={previousMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ←
                </button>
                <span className="font-semibold text-gray-700 min-w-[120px] text-center">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <button
                  onClick={nextMonth}
                  disabled={currentMonth.getMonth() === new Date().getMonth() && currentMonth.getFullYear() === new Date().getFullYear()}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, index) => {
                if (!day) {
                  return <div key={`empty-${index}`} className="aspect-square"></div>;
                }

                const isToday = day.dateStr === getTodayString();

                return (
                  <button
                    key={day.dateStr}
                    onClick={() => toggleDayStatus(day.dateStr)}
                    className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center transition-all hover:scale-105 ${
                      isToday
                        ? 'border-blue-500 ring-2 ring-blue-300'
                        : day.status
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                    }`}
                    title={day.status ? 'Smoke-free day! Click to mark as smoked' : 'Smoked this day. Click to mark as smoke-free'}
                  >
                    <span className="text-xs font-medium text-gray-700 mb-1">
                      {day.date.getDate()}
                    </span>
                    <span className="text-2xl">
                      {day.status ? '✓' : '✗'}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded border-2 border-green-500 bg-green-50 flex items-center justify-center text-sm">✓</div>
                <span className="text-gray-600">Smoke-free</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded border-2 border-red-500 bg-red-50 flex items-center justify-center text-sm">✗</div>
                <span className="text-gray-600">Smoked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded border-2 border-blue-500 ring-2 ring-blue-300 flex items-center justify-center text-sm">•</div>
                <span className="text-gray-600">Today</span>
              </div>
            </div>
          </div>

          {/* Progress to Next Milestone */}
          {nextMilestone && streak < 365 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-bold text-gray-900 flex items-center gap-2">
                    <span className="text-2xl">{nextMilestone.icon}</span>
                    Next: {nextMilestone.label}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">{nextMilestone.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-blue-600 block">
                    {nextMilestone.days - streak}
                  </span>
                  <span className="text-xs text-gray-500">days to go</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min((streak / nextMilestone.days) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* Milestones Achieved */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h4 className="font-bold text-gray-900 mb-4 text-lg">Health Milestones</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {allMilestones.map((milestone) => {
                const achieved = streak >= milestone.days;
                return (
                  <div
                    key={milestone.days}
                    className={`flex items-center gap-3 p-4 rounded-lg transition-all ${
                      achieved
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 shadow-md'
                        : 'bg-gray-50 border-2 border-gray-200'
                    }`}
                  >
                    <div className={`text-3xl ${achieved ? '' : 'opacity-30 grayscale'}`}>
                      {milestone.icon}
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold ${achieved ? 'text-green-900' : 'text-gray-600'}`}>
                        {milestone.label}
                      </p>
                      <p className={`text-xs ${achieved ? 'text-green-700' : 'text-gray-500'}`}>
                        {milestone.description}
                      </p>
                    </div>
                    {achieved && (
                      <span className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-full font-bold shadow-sm">
                        ✓ DONE
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {streak >= 7 && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-xl p-6 text-center">
              <p className="text-2xl font-bold text-gray-900 mb-2">
                🎊 You're doing amazing! Keep it up! 🎊
              </p>
              <p className="text-gray-700">
                Every day smoke-free is a victory. You're stronger than you think!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
