import { useState } from 'react';
import { ChevronRight, Check } from 'lucide-react';
import { useApp } from '@/store/AppContext';

type Step = 'welcome' | 'goal' | 'login';

const GOAL_PRESETS = [
  { level: 1, emoji: '🌱', label: 'Just Starting', description: 'Resist 1–2 impulse orders per month' },
  { level: 2, emoji: '🔥', label: 'Getting Serious', description: 'Cut your delivery spend by 30%' },
  { level: 3, emoji: '💪', label: 'Committed', description: 'Save half your usual order spend' },
  { level: 4, emoji: '🎯', label: 'Maximum Mode', description: 'Order only when truly needed' },
];

export function OnboardingScreen() {
  const { dispatch } = useApp();
  const [step, setStep] = useState<Step>('welcome');
  const [goalLevel, setGoalLevel] = useState<number>(2);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signingIn, setSigningIn] = useState(false);

  const finish = () => {
    dispatch({ type: 'UPDATE_STATS', stats: { savingsGoalLevel: goalLevel } });
    dispatch({ type: 'SET_ONBOARDING_DONE' });
  };

  const handleSignIn = () => {
    if (!email || !password) return;
    setSigningIn(true);
    setTimeout(finish, 1200);
  };

  if (step === 'welcome') {
    return (
      <div className="absolute inset-0 z-[75] bg-white flex flex-col px-6 pt-12 pb-8">
        <div className="flex-1 flex flex-col items-center justify-center gap-8">
          <img
            src="/images/savrly-logo.png"
            alt="Savrly"
            className="w-24 h-24 object-contain rounded-3xl"
          />
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Welcome to Savrly</h1>
            <p className="text-gray-500 mt-2 text-base">Save smart. Live better.</p>
          </div>
          <div className="w-full flex flex-col gap-3">
            {[
              { emoji: '🧠', title: 'Mindful ordering', body: 'Pause before you impulse-order' },
              { emoji: '💰', title: 'Track your savings', body: 'See how much you save each month' },
              { emoji: '🏆', title: 'Build streaks', body: 'Earn achievements as you resist cravings' },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-3 bg-gray-50 rounded-2xl px-4 py-3">
                <span className="text-xl">{f.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{f.title}</p>
                  <p className="text-xs text-gray-500">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={() => setStep('goal')}
          className="w-full bg-gray-900 text-white rounded-full py-4 text-sm font-semibold flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
        >
          Get Started <ChevronRight size={16} />
        </button>
      </div>
    );
  }

  if (step === 'goal') {
    return (
      <div className="absolute inset-0 z-[75] bg-white flex flex-col px-6 pt-12 pb-8">
        <div className="mb-8">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Step 1 of 2</p>
          <h2 className="text-2xl font-bold text-gray-900">Set your goal</h2>
          <p className="text-gray-500 text-sm mt-1">How committed are you to mindful eating?</p>
        </div>

        <div className="flex flex-col gap-3 flex-1">
          {GOAL_PRESETS.map((g) => (
            <button
              key={g.level}
              onClick={() => setGoalLevel(g.level)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-colors active:scale-[0.98] ${
                goalLevel === g.level
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-100 bg-white'
              }`}
            >
              <span className="text-2xl">{g.emoji}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{g.label}</p>
                <p className="text-xs text-gray-500">{g.description}</p>
              </div>
              {goalLevel === g.level && (
                <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
                  <Check size={12} className="text-white" />
                </div>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={() => setStep('login')}
          className="mt-6 w-full bg-gray-900 text-white rounded-full py-4 text-sm font-semibold active:scale-[0.97] transition-transform"
        >
          Continue
        </button>
      </div>
    );
  }

  // login step
  return (
    <div className="absolute inset-0 z-[75] bg-white flex flex-col px-6 pt-12 pb-8">
      <div className="mb-8">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">Step 2 of 2</p>
        <h2 className="text-2xl font-bold text-gray-900">Sign in</h2>
        <p className="text-gray-500 text-sm mt-1">Save your progress across devices</p>
      </div>

      <div className="flex flex-col gap-3 flex-1">
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-gray-50 rounded-2xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-900"
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-gray-50 rounded-2xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-gray-900"
          autoComplete="current-password"
        />

        <button
          onClick={handleSignIn}
          disabled={signingIn || !email || !password}
          className="mt-2 w-full bg-gray-900 text-white rounded-full py-4 text-sm font-semibold flex items-center justify-center gap-2 active:scale-[0.97] transition-transform disabled:opacity-60"
        >
          {signingIn ? (
            <img src="/images/savrly_logo_spinner.gif" alt="" className="w-6 h-6 object-contain" />
          ) : (
            'Sign In'
          )}
        </button>

        <div className="flex items-center gap-3 my-1">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <button
          onClick={finish}
          className="w-full bg-gray-50 text-gray-700 rounded-full py-4 text-sm font-semibold active:bg-gray-100 transition-colors"
        >
          Continue as guest
        </button>
      </div>

      <p className="text-center text-xs text-gray-400 mt-4">
        By continuing you agree to Savrly's Terms &amp; Privacy Policy
      </p>
    </div>
  );
}
