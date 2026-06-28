import {
  MapPin,
  CreditCard,
  Heart,
  Receipt,
  Settings,
  ChevronRight,
  Bell,
  HelpCircle,
  LogOut,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '@/store/AppContext';

export function ProfileScreen() {
  const { navigate } = useApp();

  const menuSections = [
    {
      items: [
        { icon: MapPin, label: 'Saved Addresses', screen: '' },
        { icon: CreditCard, label: 'Payment Methods', screen: '' },
        { icon: Heart, label: 'Eatlist', screen: 'eatlist' as const },
        { icon: Receipt, label: 'Order History', screen: 'orders' as const },
      ],
    },
    {
      items: [
        { icon: Bell, label: 'Notifications', screen: '' },
        { icon: Settings, label: 'Settings', screen: '' },
        { icon: HelpCircle, label: 'Help & Support', screen: '' },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="sticky top-0 z-40 bg-white px-4 py-4 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* User Info */}
        <div className="px-4 py-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-900 flex items-center justify-center text-white text-xl font-bold">
            J
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">John Doe</h2>
            <p className="text-sm text-gray-500">john.doe@email.com</p>
            <p className="text-xs text-gray-400">+1 (555) 123-4567</p>
          </div>
        </div>

        {/* Dashboard Card */}
        <div className="px-4 pb-4">
          <button
            onClick={() => navigate('dashboard')}
            className="w-full bg-gray-900 text-white rounded-2xl p-4 text-left active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <p className="text-sm font-semibold">Your Progress</p>
                  <p className="text-xs text-white/60">View stats, streaks, and achievements</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-white/40" />
            </div>
          </button>
        </div>

        {/* Menu Sections */}
        {menuSections.map((section, i) => (
          <div key={i} className="px-4 pb-4">
            <div className="bg-gray-50 rounded-2xl overflow-hidden">
              {section.items.map((item, j) => (
                <button
                  key={j}
                  className={`flex items-center gap-3 w-full text-left px-4 py-3.5 active:bg-gray-100 transition-colors ${
                    j < section.items.length - 1 ? 'border-b border-gray-200' : ''
                  }`}
                  onClick={() => {
                    if (item.screen) {
                      if (item.screen === 'eatlist' || item.screen === 'orders') {
                        navigate(item.screen);
                      }
                    }
                  }}
                >
                  <item.icon size={20} className="text-gray-500" strokeWidth={1.5} />
                  <span className="flex-1 text-sm font-medium text-gray-900">{item.label}</span>
                  <ChevronRight size={16} className="text-gray-300" />
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Logout */}
        <div className="px-4 pb-8">
          <button className="flex items-center justify-center gap-2 w-full py-3 text-red-500 text-sm font-medium active:bg-red-50 rounded-2xl transition-colors">
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
