'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';

export default function InsightsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Insights</h1>
            <p className="mt-1 text-gray-600">Discover patterns and get personalized recommendations</p>
          </div>
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition-colors">
            Generate New Insights
          </button>
        </div>

        <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
          <div className="flex items-center gap-4">
            <span className="text-5xl">🧠</span>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Powered by Claude AI</h2>
              <p className="text-gray-600">Get intelligent insights from your journal, goals, and habits</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Insights</h3>
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No insights yet</h4>
              <p className="text-gray-500 mb-6">
                Start journaling and tracking habits to receive AI-powered insights
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="rounded-lg bg-purple-600 px-6 py-3 text-white font-medium hover:bg-purple-700 transition-colors">
                  Write Journal Entry
                </button>
                <button className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                  Set Up Trackers
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What AI Insights Can Do</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <h4 className="font-medium text-gray-900">Pattern Recognition</h4>
                  <p className="text-sm text-gray-600">Identify trends in your mood, productivity, and habits</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h4 className="font-medium text-gray-900">Personalized Suggestions</h4>
                  <p className="text-sm text-gray-600">Get recommendations tailored to your goals and challenges</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">📈</span>
                <div>
                  <h4 className="font-medium text-gray-900">Progress Analysis</h4>
                  <p className="text-sm text-gray-600">Understand your growth and areas for improvement</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎯</span>
                <div>
                  <h4 className="font-medium text-gray-900">Goal Optimization</h4>
                  <p className="text-sm text-gray-600">Receive strategies to achieve your objectives faster</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
