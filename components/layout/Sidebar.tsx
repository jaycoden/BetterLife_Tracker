'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useLocalAuth';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Daily Check-in', href: '/daily', icon: '☀️' },
  { name: 'Journal', href: '/journal', icon: '📝' },
  { name: 'Goals', href: '/goals', icon: '🎯' },
  { name: 'Trackers', href: '/trackers', icon: '📈' },
  { name: 'Weekly Review', href: '/weekly', icon: '📅' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleSignOut = () => {
    logout();
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-gradient-to-b from-gray-50 to-white border-r border-gray-200/50 shadow-xl">
      <div className="flex h-16 items-center px-6 border-b border-gray-200/50 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
        <h1 className="text-xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">Jayden's Life OS</h1>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200
                ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg scale-105'
                    : 'text-gray-700 hover:bg-gray-100 hover:scale-102 hover:shadow-md'
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200/50 p-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-white shadow-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold shadow-lg">
            {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'J'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">
              {user?.displayName || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-3 text-sm font-bold text-gray-700 hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
