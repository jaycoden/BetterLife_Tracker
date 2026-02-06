'use client';

import { useState, useEffect } from 'react';
import { getTrackers, setTrackers } from '@/lib/storage/localStorage';
import { getTodayString, formatDate } from '@/lib/utils/date';

// Three states: 'clean' (fully clean), 'cigarette' (occasional cig), 'vape' (relapse)
type DayState = 'clean' | 'cigarette' | 'vape';

export default function SmokeFreeTracker() {
  const [quitVapeDate, setQuitVapeDate] = useState<string | null>(null);
  const [isSettingDate, setIsSettingDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [dayStatuses, setDayStatuses] = useState<Record<string, DayState>>({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showDayModal, setShowDayModal] = useState(false);
  const [selectedDayForEdit, setSelectedDayForEdit] = useState<string | null>(null);

  useEffect(() => {
    loadTrackerData();
  }, []);

  const loadTrackerData = () => {
    const trackers = getTrackers();

    // Migration: convert old boolean system to new 3-state system
    if (trackers.smokeFree?.dayStatuses) {
      const oldStatuses = trackers.smokeFree.dayStatuses;
      const newStatuses: Record<string, DayState> = {};

      for (const [date, value] of Object.entries(oldStatuses)) {
        if (typeof value === 'boolean') {
          newStatuses[date] = value ? 'clean' : 'vape';
        } else {
          newStatuses[date] = value as DayState;
        }
      }

      setDayStatuses(newStatuses);

      // Save migrated data
      if (!trackers.smokeFree.quitVapeDate && trackers.smokeFree.quitDate) {
        trackers.smokeFree.quitVapeDate = trackers.smokeFree.quitDate;
      }
      trackers.smokeFree.dayStatuses = newStatuses;
      setTrackers(trackers);
    }

    if (trackers.smokeFree?.quitVapeDate) {
      setQuitVapeDate(trackers.smokeFree.quitVapeDate);
    }
  };

  const saveQuitDate = () => {
    const trackers = getTrackers();
    if (!trackers.smokeFree) {
      trackers.smokeFree = {};
    }
    trackers.smokeFree.quitVapeDate = selectedDate;

    // Initialize all days from quit date to today as clean
    const statuses: Record<string, DayState> = {};
    const start = new Date(selectedDate);
    const today = new Date();
    for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      statuses[dateStr] = 'clean'; // Default all to clean
    }
    trackers.smokeFree.dayStatuses = statuses;

    setTrackers(trackers);
    setQuitVapeDate(selectedDate);
    setDayStatuses(statuses);
    setIsSettingDate(false);
  };

  const setDayStatus = (dateStr: string, status: DayState) => {
    const trackers = getTrackers();
    if (!trackers.smokeFree) return;

    const newStatuses = { ...dayStatuses, [dateStr]: status };
    trackers.smokeFree.dayStatuses = newStatuses;
    setTrackers(trackers);
    setDayStatuses(newStatuses);
    setShowDayModal(false);
    setSelectedDayForEdit(null);
  };

  const openDayModal = (dateStr: string) => {
    setSelectedDayForEdit(dateStr);
    setShowDayModal(true);
  };

  // Calculate vape-free streak (cigarettes don't break it)
  const calculateVapeFreeStreak = () => {
    if (!quitVapeDate) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;

    for (let d = new Date(today); d >= new Date(quitVapeDate); d.setDate(d.getDate() - 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const status = dayStatuses[dateStr] || 'clean';

      if (status === 'vape') {
        break; // Vape breaks the streak
      }
      streak++;
    }

    return streak;
  };

  // Calculate fully clean streak (cigarettes DO break it)
  const calculateFullyCleanStreak = () => {
    if (!quitVapeDate) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;

    for (let d = new Date(today); d >= new Date(quitVapeDate); d.setDate(d.getDate() - 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const status = dayStatuses[dateStr] || 'clean';

      if (status !== 'clean') {
        break; // Any non-clean day breaks it
      }
      streak++;
    }

    return streak;
  };

  const calculateMoneySaved = () => {
    if (!quitVapeDate) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let moneySaved = 0;

    for (let d = new Date(quitVapeDate); d <= today; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const status = dayStatuses[dateStr] || 'clean';

      if (status === 'clean') {
        moneySaved += 8;
      } else if (status === 'cigarette') {
        moneySaved += 6; // $8 saved - $2 spent
      } else if (status === 'vape') {
        moneySaved += 0; // $8 lost
      }
    }

    return Math.floor(moneySaved);
  };

  const calculateLifeRegained = () => {
    const vapeFreeStreak = calculateVapeFreeStreak();
    const cigarettesPerDay = 10;
    const cigarettesAvoided = vapeFreeStreak * cigarettesPerDay;
    const minutesPerCigarette = 11;
    const totalMinutes = cigarettesAvoided * minutesPerCigarette;
    const hours = Math.floor(totalMinutes / 60);
    return hours;
  };

  const calculateYearTotals = () => {
    if (!quitVapeDate) return { cleanDays: 0, cigaretteDays: 0, vapeDays: 0, totalDays: 0 };

    const now = new Date();
    const currentYear = now.getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const quitDateObj = new Date(quitVapeDate);

    const startDate = quitDateObj > startOfYear ? quitDateObj : startOfYear;

    let cleanDays = 0;
    let cigaretteDays = 0;
    let vapeDays = 0;

    for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const status = dayStatuses[dateStr] || 'clean';

      if (status === 'clean') cleanDays++;
      else if (status === 'cigarette') cigaretteDays++;
      else if (status === 'vape') vapeDays++;
    }

    const totalDays = cleanDays + cigaretteDays + vapeDays;

    return { cleanDays, cigaretteDays, vapeDays, totalDays };
  };

  const getMilestoneProgress = () => {
    const days = calculateVapeFreeStreak();
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
    if (!quitVapeDate) return [];

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const quitDateObj = new Date(quitVapeDate);
      const todayObj = new Date();
      todayObj.setHours(0, 0, 0, 0);

      if (date >= quitDateObj && date <= todayObj) {
        const status = dayStatuses[dateStr] || 'clean';
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

  const vapeFreeStreak = calculateVapeFreeStreak();
  const fullyCleanStreak = calculateFullyCleanStreak();
  const moneySaved = calculateMoneySaved();
  const hoursRegained = calculateLifeRegained();
  const { nextMilestone, allMilestones } = getMilestoneProgress();
  const calendarDays = getCalendarDays();
  const { cleanDays, cigaretteDays, vapeDays, totalDays } = calculateYearTotals();

  return (
    <div className="rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="text-5xl">🚭</div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Vape-Free Journey</h3>
            <p className="text-sm text-gray-600">Click calendar days to set your status</p>
          </div>
        </div>
        {quitVapeDate && (
          <button
            onClick={() => setIsSettingDate(true)}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Change Quit Date
          </button>
        )}
      </div>

      {!quitVapeDate || isSettingDate ? (
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">When did you quit vaping?</h4>
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
              {quitVapeDate ? 'Update Date' : 'Start Tracking'}
            </button>
            {isSettingDate && quitVapeDate && (
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
          {/* Dual Streak Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border-4 border-green-500">
              <p className="text-6xl font-bold text-green-600 mb-2">{vapeFreeStreak}</p>
              <p className="text-sm font-bold text-gray-900">Vape-Free</p>
              <p className="text-xs text-gray-500 mt-1">Primary streak</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border-2 border-emerald-200">
              <p className="text-5xl font-bold text-emerald-600 mb-2">{fullyCleanStreak}</p>
              <p className="text-sm font-medium text-gray-700">Fully Clean</p>
              <p className="text-xs text-gray-500 mt-1">No vape or cigs</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center shadow-sm border-2 border-blue-200">
              <p className="text-5xl font-bold text-blue-600 mb-2">${moneySaved}</p>
              <p className="text-sm font-medium text-gray-700">Money Saved</p>
              <p className="text-xs text-gray-500 mt-1">Total saved</p>
            </div>
          </div>

          {/* Year Overview */}
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-xl p-6 shadow-lg border-2 border-indigo-300">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <span className="text-2xl">📊</span>
                {new Date().getFullYear()} Year Overview
              </h4>
              <span className="text-sm font-medium text-gray-600">{totalDays} days tracked</span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white rounded-lg p-4 text-center shadow-sm border-2 border-green-400">
                <p className="text-3xl font-bold text-green-600 mb-1">{cleanDays}</p>
                <p className="text-xs font-bold text-gray-900">Fully Clean</p>
                <p className="text-xs text-gray-500 mt-1">{totalDays > 0 ? Math.round((cleanDays / totalDays) * 100) : 0}%</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm border-2 border-yellow-400">
                <p className="text-3xl font-bold text-yellow-600 mb-1">{cigaretteDays}</p>
                <p className="text-xs font-bold text-gray-900">Cigarette</p>
                <p className="text-xs text-gray-500 mt-1">{totalDays > 0 ? Math.round((cigaretteDays / totalDays) * 100) : 0}%</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm border-2 border-red-400">
                <p className="text-3xl font-bold text-red-600 mb-1">{vapeDays}</p>
                <p className="text-xs font-bold text-gray-900">Vaped</p>
                <p className="text-xs text-gray-500 mt-1">{totalDays > 0 ? Math.round((vapeDays / totalDays) * 100) : 0}%</p>
              </div>
            </div>

            {/* Visual bar */}
            <div className="w-full bg-white rounded-full h-8 overflow-hidden shadow-inner border-2 border-gray-200">
              <div className="flex h-full">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold transition-all duration-500"
                  style={{ width: `${totalDays > 0 ? (cleanDays / totalDays) * 100 : 0}%` }}
                >
                  {totalDays > 0 && cleanDays > 0 && `${Math.round((cleanDays / totalDays) * 100)}%`}
                </div>
                <div
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold transition-all duration-500"
                  style={{ width: `${totalDays > 0 ? (cigaretteDays / totalDays) * 100 : 0}%` }}
                >
                  {totalDays > 0 && cigaretteDays > 0 && `${Math.round((cigaretteDays / totalDays) * 100)}%`}
                </div>
                <div
                  className="bg-gradient-to-r from-red-500 to-rose-500 flex items-center justify-center text-white text-xs font-bold transition-all duration-500"
                  style={{ width: `${totalDays > 0 ? (vapeDays / totalDays) * 100 : 0}%` }}
                >
                  {totalDays > 0 && vapeDays > 0 && `${Math.round((vapeDays / totalDays) * 100)}%`}
                </div>
              </div>
            </div>

            {vapeFreeStreak > 0 && (
              <div className="mt-4 text-center">
                <p className="text-sm font-bold text-green-700">
                  💪 {vapeFreeStreak} days vape-free! Keep going!
                </p>
              </div>
            )}
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
                    onClick={() => openDayModal(day.dateStr)}
                    className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center transition-all hover:scale-105 ${
                      isToday
                        ? 'border-blue-500 ring-2 ring-blue-300'
                        : day.status === 'clean'
                        ? 'border-green-500 bg-green-50'
                        : day.status === 'cigarette'
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-red-500 bg-red-50'
                    }`}
                  >
                    <span className="text-xs font-medium text-gray-700 mb-1">
                      {day.date.getDate()}
                    </span>
                    <span className="text-2xl">
                      {day.status === 'clean' ? '✓' : day.status === 'cigarette' ? '🚬' : '💨'}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded border-2 border-green-500 bg-green-50 flex items-center justify-center text-sm">✓</div>
                <span className="text-gray-600">Fully clean</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded border-2 border-yellow-500 bg-yellow-50 flex items-center justify-center text-sm">🚬</div>
                <span className="text-gray-600">Cigarette</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded border-2 border-red-500 bg-red-50 flex items-center justify-center text-sm">💨</div>
                <span className="text-gray-600">Vaped</span>
              </div>
            </div>
          </div>

          {/* Milestones */}
          {nextMilestone && vapeFreeStreak < 365 && (
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
                    {nextMilestone.days - vapeFreeStreak}
                  </span>
                  <span className="text-xs text-gray-500">days to go</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 h-4 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min((vapeFreeStreak / nextMilestone.days) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          )}

          {vapeFreeStreak >= 7 && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-xl p-6 text-center">
              <p className="text-2xl font-bold text-gray-900 mb-2">
                🎊 You're doing great! 🎊
              </p>
              <p className="text-gray-700">
                Every vape-free day is progress. Be kind to yourself.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Day Status Modal */}
      {showDayModal && selectedDayForEdit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowDayModal(false)}>
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Set status for {new Date(selectedDayForEdit).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => setDayStatus(selectedDayForEdit, 'clean')}
                className="w-full p-4 rounded-lg border-2 border-green-500 bg-green-50 hover:bg-green-100 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">✓</span>
                  <div>
                    <p className="font-bold text-gray-900">Fully Clean</p>
                    <p className="text-xs text-gray-600">No vaping, no cigarettes</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => setDayStatus(selectedDayForEdit, 'cigarette')}
                className="w-full p-4 rounded-lg border-2 border-yellow-500 bg-yellow-50 hover:bg-yellow-100 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🚬</span>
                  <div>
                    <p className="font-bold text-gray-900">Cigarette Only</p>
                    <p className="text-xs text-gray-600">Had a cigarette, but no vaping</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => setDayStatus(selectedDayForEdit, 'vape')}
                className="w-full p-4 rounded-lg border-2 border-red-500 bg-red-50 hover:bg-red-100 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">💨</span>
                  <div>
                    <p className="font-bold text-gray-900">Vaped</p>
                    <p className="text-xs text-gray-600">Used a vape today</p>
                  </div>
                </div>
              </button>
            </div>
            <button
              onClick={() => setShowDayModal(false)}
              className="w-full mt-4 p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
