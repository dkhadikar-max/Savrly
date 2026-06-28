import {
  ArrowLeft,
  DollarSign,
  Flame,
  Award,
  BarChart3,
  Target,
  Calendar,
  Zap,
} from 'lucide-react';
import { useApp } from '@/store/AppContext';

export function DashboardScreen() {
  const { state, goBack } = useApp();
  const stats = state.userStats;

  const weeklyData = stats.weeklyProgress;
  const streakPercentage = (stats.currentStreak / stats.longestStreak) * 100;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="active:opacity-60">
            <ArrowLeft size={22} className="text-gray-900" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Your Dashboard</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Summary Cards */}
        <div className="px-4 pt-4 pb-2">
          <div className="grid grid-cols-2 gap-3">
            <SummaryCard
              icon={DollarSign}
              label="Money Saved"
              value={`$${stats.moneySaved.toFixed(2)}`}
              subtitle="Since you started"
              color="green"
            />
            <SummaryCard
              icon={Flame}
              label="Current Streak"
              value={`${stats.currentStreak} days`}
              subtitle={`Best: ${stats.longestStreak} days`}
              color="orange"
            />
          </div>
        </div>

        {/* Main Stats */}
        <div className="px-4 py-2">
          <div className="bg-gray-900 text-white rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 size={18} />
              <h2 className="text-sm font-semibold">Your Progress</h2>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{stats.cravingsResisted}</p>
                <p className="text-[10px] text-white/50 mt-0.5">Cravings Resisted</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{stats.ordersCancelled}</p>
                <p className="text-[10px] text-white/50 mt-0.5">Orders Cancelled</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{stats.totalDelays}</p>
                <p className="text-[10px] text-white/50 mt-0.5">Times Delayed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Streak Progress */}
        <div className="px-4 py-3">
          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                <Target size={16} className="text-red-500" />
                Streak Progress
              </h3>
              <span className="text-xs font-medium text-gray-500">
                {stats.currentStreak} / {stats.longestStreak} days
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(streakPercentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {streakPercentage >= 100
                ? "You've matched your best streak! Keep going!"
                : `${stats.longestStreak - stats.currentStreak} more days to beat your record`}
            </p>
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="px-4 py-3">
          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
              <Calendar size={16} className="text-blue-500" />
              Weekly Activity
            </h3>
            <div className="flex items-end justify-between gap-2 h-24">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                const isActive = weeklyData[i] === 1;
                return (
                  <div key={day} className="flex flex-col items-center gap-1.5 flex-1">
                    <div className="relative w-full flex items-end justify-center" style={{ height: '70px' }}>
                      <div
                        className={`w-full max-w-[32px] rounded-lg transition-all duration-500 ${
                          isActive ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                        style={{ height: isActive ? '100%' : '30%' }}
                      >
                        {isActive && (
                          <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                            <Zap size={12} className="text-green-500" />
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-500">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Monthly Overview */}
        <div className="px-4 py-3">
          <div className="bg-gray-50 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Monthly Overview</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-3">
                <p className="text-xs text-gray-500">Success Rate</p>
                <p className="text-xl font-bold text-gray-900">
                  {Math.round((stats.cravingsResisted / (stats.cravingsResisted + stats.ordersCancelled || 1)) * 100)}%
                </p>
                <p className="text-[10px] text-green-600 mt-0.5">+5% vs last month</p>
              </div>
              <div className="bg-white rounded-xl p-3">
                <p className="text-xs text-gray-500">Avg. Delay Time</p>
                <p className="text-xl font-bold text-gray-900">18 min</p>
                <p className="text-[10px] text-green-600 mt-0.5">-3 min vs last month</p>
              </div>
              <div className="bg-white rounded-xl p-3">
                <p className="text-xs text-gray-500">This Month Saved</p>
                <p className="text-xl font-bold text-green-600">$86.50</p>
                <p className="text-[10px] text-gray-400 mt-0.5">8 cravings resisted</p>
              </div>
              <div className="bg-white rounded-xl p-3">
                <p className="text-xs text-gray-500">Active Days</p>
                <p className="text-xl font-bold text-gray-900">23</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Out of 30 days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="px-4 py-3 pb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
            <Award size={16} className="text-yellow-500" />
            Achievements
          </h3>
          <div className="flex flex-col gap-2">
            {stats.achievements.map((ach) => (
              <div
                key={ach.id}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  ach.unlocked ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    ach.unlocked ? 'bg-yellow-100' : 'bg-gray-200'
                  }`}
                >
                  <Award
                    size={18}
                    className={ach.unlocked ? 'text-yellow-600' : 'text-gray-400'}
                  />
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      ach.unlocked ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  >
                    {ach.title}
                  </p>
                  <p className="text-xs text-gray-500">{ach.description}</p>
                </div>
                {ach.unlocked ? (
                  <div className="text-[10px] font-bold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full">
                    {ach.date}
                  </div>
                ) : (
                  <div className="text-[10px] font-medium text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">
                    Locked
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  subtitle,
  color,
}: {
  icon: typeof DollarSign;
  label: string;
  value: string;
  subtitle: string;
  color: string;
}) {
  const colorMap: Record<string, { bg: string; text: string }> = {
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
  };
  const c = colorMap[color] ?? colorMap.green;

  return (
    <div className="bg-gray-50 rounded-2xl p-4">
      <div className={`w-10 h-10 ${c.bg} rounded-full flex items-center justify-center mb-3`}>
        <Icon size={18} className={c.text} />
      </div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      <p className="text-[10px] text-gray-400 mt-0.5">{subtitle}</p>
    </div>
  );
}
