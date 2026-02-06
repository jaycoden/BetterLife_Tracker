'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
        <div className="flex items-center justify-center p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50">
          <p className="text-sm font-bold text-gray-700">Jayden's Personal Space</p>
        </div>
      </div>
    </div>
  );
}
