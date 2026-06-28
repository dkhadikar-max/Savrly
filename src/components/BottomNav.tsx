import { Home, Tag, Heart, Receipt, User } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import type { TabName } from '@/types';

const tabs: { key: TabName; label: string; icon: typeof Home }[] = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'deals', label: 'Deals', icon: Tag },
  { key: 'eatlist', label: 'Eatlist', icon: Heart },
  { key: 'orders', label: 'Orders', icon: Receipt },
  { key: 'profile', label: 'Profile', icon: User },
];

export function BottomNav() {
  const { state, setTab } = useApp();

  return (
    <nav className="shrink-0 h-16 bg-white border-t border-gray-100 flex items-center justify-around z-50 select-none">
      {tabs.map((t) => {
        const isActive = state.activeTab === t.key;
        const Icon = t.icon;
        return (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="flex flex-col items-center justify-center gap-0.5 w-16 h-full transition-all duration-200 active:scale-95"
          >
            <Icon
              size={22}
              strokeWidth={isActive ? 2.5 : 1.5}
              className={isActive ? 'text-black' : 'text-gray-400'}
            />
            <span
              className={`text-[10px] ${
                isActive ? 'font-bold text-black' : 'font-normal text-gray-400'
              }`}
            >
              {t.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
