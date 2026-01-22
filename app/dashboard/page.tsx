'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useLocalAuth';
import { storage } from '@/lib/storage/localStorage';
import { getTodayString } from '@/lib/utils/date';

const MOTIVATIONAL_QUOTES = [
  { quote: "Every day is a chance to be better than yesterday.", author: "Unknown" },
  { quote: "Small daily improvements lead to staggering long-term results.", author: "Robin Sharma" },
  { quote: "You are stronger than you think. Keep going!", author: "Unknown" },
  { quote: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { quote: "Progress, not perfection, is what we should be asking of ourselves.", author: "Julia Cameron" },
  { quote: "One day or day one. You decide.", author: "Unknown" },
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "Your limitation—it's only your imagination.", author: "Unknown" },
  { quote: "Great things never come from comfort zones.", author: "Unknown" },
  { quote: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { quote: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { quote: "You don't have to be perfect to be amazing.", author: "Unknown" },
  { quote: "Fall seven times, stand up eight.", author: "Japanese Proverb" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [dailyQuote, setDailyQuote] = useState(MOTIVATIONAL_QUOTES[0]);
  const [stats, setStats] = useState({
    smokeFreeDays: 0,
    activeGoals: 0,
    journalEntries: 0,
    habitsCompletedToday: 0,
    totalHabits: 0,
  });

  useEffect(() => {
    // Get daily quote (same quote for the whole day)
    const today = new Date().toDateString();
    const savedQuoteDate = storage.get('quote_date');
    const savedQuoteIndex = storage.get('quote_index');

    if (savedQuoteDate !== today || savedQuoteIndex === null) {
      const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
      storage.set('quote_date', today);
      storage.set('quote_index', randomIndex);
      setDailyQuote(MOTIVATIONAL_QUOTES[randomIndex]);
    } else {
      setDailyQuote(MOTIVATIONAL_QUOTES[savedQuoteIndex]);
    }

    // Load stats
    loadStats();
  }, []);

  const loadStats = () => {
    // Smoke-free days
    const trackers = storage.get('lifeos_trackers') || {};
    let smokeFreeDays = 0;
    if (trackers.smokeFree?.quitDate && trackers.smokeFree?.dayStatuses) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let streak = 0;

      for (let d = new Date(today); d >= new Date(trackers.smokeFree.quitDate); d.setDate(d.getDate() - 1)) {
        const dateStr = d.toISOString().split('T')[0];
        if (trackers.smokeFree.dayStatuses[dateStr] === true || trackers.smokeFree.dayStatuses[dateStr] === undefined) {
          streak++;
        } else {
          break;
        }
      }
      smokeFreeDays = streak;
    }

    // Active goals
    const goals = storage.get('lifeos_goals') || [];
    const activeGoals = goals.filter((g: any) => g.progress < g.target).length;

    // Journal entries
    const journalEntries = (storage.get('lifeos_journal') || []).length;

    // Habits completed today
    const today = getTodayString();
    const todayHabits = trackers.dailyHabits?.[today] || [];
    const habitsCompletedToday = todayHabits.filter((h: any) => h.completed).length;
    const totalHabits = todayHabits.length;

    setStats({
      smokeFreeDays,
      activeGoals,
      journalEntries,
      habitsCompletedToday,
      totalHabits,
    });
  };

  const quickStats = [
    {
      title: 'Smoke-Free Streak',
      value: stats.smokeFreeDays > 0 ? `${stats.smokeFreeDays}` : '0',
      subtitle: stats.smokeFreeDays > 0 ? 'days strong!' : 'Get started',
      icon: '🚭',
      color: 'bg-gradient-to-br from-green-50 to-emerald-50 text-green-700 border-green-300',
      href: '/trackers',
    },
    {
      title: 'Active Goals',
      value: `${stats.activeGoals}`,
      subtitle: 'in progress',
      icon: '🎯',
      color: 'bg-gradient-to-br from-blue-50 to-cyan-50 text-blue-700 border-blue-300',
      href: '/goals',
    },
    {
      title: 'Today\'s Habits',
      value: `${stats.habitsCompletedToday}/${stats.totalHabits}`,
      subtitle: stats.totalHabits > 0 ? `${Math.round((stats.habitsCompletedToday / stats.totalHabits) * 100)}% done` : 'none set',
      icon: '✓',
      color: 'bg-gradient-to-br from-purple-50 to-pink-50 text-purple-700 border-purple-300',
      href: '/daily',
    },
    {
      title: 'Journal Entries',
      value: `${stats.journalEntries}`,
      subtitle: 'total entries',
      icon: '📝',
      color: 'bg-gradient-to-br from-orange-50 to-yellow-50 text-orange-700 border-orange-300',
      href: '/journal',
    },
  ];

  const quickActions = [
    { title: 'Daily Check-in', href: '/daily', icon: '☀️', color: 'bg-gradient-to-r from-yellow-500 to-orange-500' },
    { title: 'Add Journal Entry', href: '/journal', icon: '📝', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { title: 'Track Progress', href: '/trackers', icon: '📈', color: 'bg-gradient-to-r from-blue-500 to-cyan-500' },
    { title: 'Review Goals', href: '/goals', icon: '🎯', color: 'bg-gradient-to-r from-indigo-500 to-purple-500' },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '☀️ Good morning';
    if (hour < 18) return '🌤️ Good afternoon';
    return '🌙 Good evening';
  };

  const habitsPercentage = stats.totalHabits > 0 ? (stats.habitsCompletedToday / stats.totalHabits) * 100 : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            {getGreeting()}, {user?.displayName?.split(' ')[0] || 'there'}!
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Daily Quote */}
        <div className="rounded-3xl border border-purple-200/50 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent"></div>
          <div className="relative flex items-start gap-6">
            <div className="text-6xl drop-shadow-sm">✨</div>
            <div className="flex-1">
              <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 italic leading-relaxed">
                "{dailyQuote.quote}"
              </p>
              <p className="text-sm font-semibold text-gray-600">
                — {dailyQuote.author}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {quickStats.map((stat) => (
            <Link
              key={stat.title}
              href={stat.href}
              className={`rounded-2xl border border-white/50 p-6 transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-1 backdrop-blur-sm ${stat.color}`}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold tracking-wide opacity-90">{stat.title}</p>
                <div className="text-4xl drop-shadow-sm">{stat.icon}</div>
              </div>
              <p className="text-5xl font-extrabold mb-2 tracking-tight">{stat.value}</p>
              <p className="text-sm font-medium opacity-75">{stat.subtitle}</p>
            </Link>
          ))}
        </div>

        {/* Progress Overview */}
        {stats.totalHabits > 0 && (
          <div className="rounded-2xl border border-purple-200/50 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-8 shadow-xl backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">Today's Progress</h3>
                  <p className="text-sm font-medium text-gray-600 mt-1">
                    {stats.habitsCompletedToday} of {stats.totalHabits} habits completed
                  </p>
                </div>
                <div className="text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {Math.round(habitsPercentage)}%
                </div>
              </div>
              <div className="w-full bg-white/60 rounded-full h-5 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 h-5 rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${habitsPercentage}%` }}
                ></div>
              </div>
              {habitsPercentage === 100 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-400 rounded-xl text-center shadow-lg">
                  <p className="text-green-800 font-bold text-lg">🎉 Perfect day! All habits completed!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6 tracking-tight">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className={`${action.color} rounded-2xl p-8 text-white transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-1 relative overflow-hidden group`}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex flex-col items-center gap-4 text-center">
                  <span className="text-6xl drop-shadow-lg group-hover:scale-110 transition-transform">{action.icon}</span>
                  <span className="font-bold text-lg tracking-wide">{action.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Motivational Section */}
        {stats.smokeFreeDays > 0 && (
          <div className="rounded-xl border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
            <div className="flex items-start gap-4">
              <div className="text-5xl">🎊</div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {stats.smokeFreeDays} Days Smoke-Free!
                </h3>
                <p className="text-gray-700 mb-2">
                  You've saved approximately <span className="font-bold text-green-700">${stats.smokeFreeDays * 8}</span> and gained back precious time!
                </p>
                <p className="text-sm text-gray-600">
                  Keep up the incredible work. Every day smoke-free is a victory! 💪
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Getting Started Guide */}
        {stats.smokeFreeDays === 0 && stats.activeGoals === 0 && stats.totalHabits === 0 && (
          <div className="rounded-xl border-2 border-indigo-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
            <div className="flex items-start gap-4">
              <div className="text-5xl">🚀</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Welcome to Your Life OS!</h3>
                <p className="text-gray-700 mb-4">
                  Your personal command center for building better habits, achieving goals, and tracking your journey to a better you.
                </p>
                <div className="space-y-3">
                  <Link
                    href="/trackers"
                    className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-all border border-gray-200"
                  >
                    <span className="text-2xl">🚭</span>
                    <div>
                      <p className="font-semibold text-gray-900">Set Your Quit Date</p>
                      <p className="text-sm text-gray-600">Start tracking your smoke-free journey with a visual calendar</p>
                    </div>
                  </Link>
                  <Link
                    href="/daily"
                    className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-all border border-gray-200"
                  >
                    <span className="text-2xl">✓</span>
                    <div>
                      <p className="font-semibold text-gray-900">Create Daily Habits</p>
                      <p className="text-sm text-gray-600">Build custom habits with icons and track completion</p>
                    </div>
                  </Link>
                  <Link
                    href="/goals"
                    className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-all border border-gray-200"
                  >
                    <span className="text-2xl">🎯</span>
                    <div>
                      <p className="font-semibold text-gray-900">Set Your First Goal</p>
                      <p className="text-sm text-gray-600">Create goals with visual progress tracking</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
