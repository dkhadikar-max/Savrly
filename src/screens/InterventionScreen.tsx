import { useState } from 'react';
import { Clock, DollarSign, Flame, TrendingUp, Award, ChevronRight, RotateCcw, Search } from 'lucide-react';
import { useApp } from '@/store/AppContext';

export function InterventionScreen() {
  const { state, navigate, dispatch } = useApp();
  const [step, setStep] = useState<'waited' | 'question' | 'stats' | 'exit'>('waited');
  const [, setAnsweredNo] = useState(false);

  const handleFadeToQuestion = () => {
    setStep('question');
  };

  const handleYes = () => {
    setStep('exit');
  };

  const handleNo = () => {
    setAnsweredNo(true);
    setStep('stats');
    // Update stats
    dispatch({
      type: 'UPDATE_STATS',
      stats: {
        cravingsResisted: state.userStats.cravingsResisted + 1,
        currentStreak: state.userStats.currentStreak + 1,
        moneySaved: state.userStats.moneySaved + 28.5,
        totalDelays: state.userStats.totalDelays + 1,
      },
    });
  };

  const handleReturnHome = () => {
    navigate('home');
  };

  const handleReturnDashboard = () => {
    navigate('dashboard');
  };

  if (step === 'waited') {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-black text-white animate-in fade-in duration-1000">
        <div className="text-center px-8">
          <p className="text-white/60 text-sm mb-4">Simulation complete.</p>
          <h1 className="text-4xl font-bold tracking-tight">
            You waited<br />it out.
          </h1>
          <button
            onClick={handleFadeToQuestion}
            className="mt-12 px-8 py-3 border border-white/30 rounded-full text-sm active:bg-white/10 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (step === 'question') {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white animate-in fade-in duration-700">
        <div className="text-center px-8">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock size={32} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Still hungry?</h2>
          <p className="text-sm text-gray-500 mb-10 max-w-[260px] mx-auto">
            You went through the entire ordering process. Take a moment to check in with yourself.
          </p>
          <div className="flex flex-col gap-3 w-full max-w-[280px] mx-auto">
            <button
              onClick={handleNo}
              className="w-full h-14 bg-gray-900 text-white rounded-full text-sm font-semibold active:scale-[0.97] transition-transform"
            >
              No, the craving has passed
            </button>
            <button
              onClick={handleYes}
              className="w-full h-14 border-2 border-gray-200 text-gray-700 rounded-full text-sm font-medium active:bg-gray-50 transition-colors"
            >
              I still want to order elsewhere
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'exit') {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white animate-in fade-in duration-700">
        <div className="text-center px-8">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <RotateCcw size={32} className="text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">That's okay</h2>
          <p className="text-sm text-gray-500 mb-8 max-w-[280px] mx-auto leading-relaxed">
            You took a moment to check in \u2014 that awareness counts. Browse other restaurants whenever you're ready.
          </p>
          <div className="flex flex-col gap-3 w-full max-w-[280px] mx-auto">
            <button
              onClick={() => { dispatch({ type: 'CLEAR_CART' }); navigate('search'); }}
              className="w-full h-14 bg-gray-900 text-white rounded-full text-sm font-semibold flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
            >
              <Search size={16} />
              Browse Restaurants
            </button>
            <button
              onClick={handleReturnHome}
              className="w-full h-12 border-2 border-gray-200 text-gray-600 rounded-full text-sm font-medium active:bg-gray-50 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'stats') {
    return (
      <div className="flex flex-col h-full bg-white animate-in fade-in duration-700">
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* Header */}
          <div className="bg-gray-900 text-white px-6 py-10 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign size={28} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold">Craving Resisted!</h2>
            <p className="text-white/60 text-sm mt-2">
              You waited {state.userStats.totalDelays + 1} times. Here is your impact:
            </p>
          </div>

          {/* Stats Grid */}
          <div className="px-4 py-6">
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                icon={DollarSign}
                label="Money Saved"
                value={`$${state.userStats.moneySaved.toFixed(2)}`}
                color="green"
              />
              <StatCard
                icon={Flame}
                label="Current Streak"
                value={`${state.userStats.currentStreak + 1} days`}
                color="orange"
              />
              <StatCard
                icon={TrendingUp}
                label="Cravings Resisted"
                value={`${state.userStats.cravingsResisted + 1}`}
                color="blue"
              />
              <StatCard
                icon={Clock}
                label="Time Delayed"
                value={`${state.userStats.totalDelays + 1}x`}
                color="purple"
              />
            </div>

            {/* Weekly Progress */}
            <div className="mt-6 bg-gray-50 rounded-2xl p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">This Week</h3>
              <div className="flex items-end justify-between gap-2 h-20">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                  const isActive = i < 6;
                  return (
                    <div key={day} className="flex flex-col items-center gap-1 flex-1">
                      <div
                        className={`w-full rounded-lg ${
                          isActive ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                        style={{ height: `${isActive ? 60 - i * 5 : 20}%` }}
                      />
                      <span className="text-[10px] text-gray-500">{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Achievements */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Achievements</h3>
              <div className="flex flex-col gap-2">
                {state.userStats.achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className={`flex items-center gap-3 p-3 rounded-xl ${
                      ach.unlocked ? 'bg-green-50' : 'bg-gray-50'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        ach.unlocked ? 'bg-green-100' : 'bg-gray-200'
                      }`}
                    >
                      <Award
                        size={18}
                        className={ach.unlocked ? 'text-green-600' : 'text-gray-400'}
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
                    {ach.unlocked && (
                      <div className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                        UNLOCKED
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Reflection */}
            <div className="mt-6 bg-orange-50 rounded-2xl p-4 mb-6">
              <h3 className="text-sm font-semibold text-orange-800 mb-2">Reflection</h3>
              <p className="text-xs text-orange-700 leading-relaxed">
                Most cravings last only 15-20 minutes. By going through this simulation, 
                you gave yourself time to decide mindfully. That awareness is your superpower.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="shrink-0 p-4 border-t border-gray-100 bg-white flex gap-3">
          <button
            onClick={handleReturnHome}
            className="flex-1 h-12 border-2 border-gray-200 text-gray-700 rounded-full text-sm font-medium active:bg-gray-50 transition-colors"
          >
            Home
          </button>
          <button
            onClick={handleReturnDashboard}
            className="flex-1 h-12 bg-gray-900 text-white rounded-full text-sm font-semibold flex items-center justify-center gap-1 active:scale-[0.97] transition-transform"
          >
            Dashboard
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return null;
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof DollarSign;
  label: string;
  value: string;
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
      <p className="text-lg font-bold text-gray-900">{value}</p>
    </div>
  );
}
