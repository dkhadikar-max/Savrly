import { useState, useCallback, Component } from 'react';
import type { ReactNode } from 'react';
import { AppProvider, useApp } from '@/store/AppContext';
import { HomeScreen } from '@/screens/HomeScreen';
import { SearchScreen } from '@/screens/SearchScreen';
import { DealsScreen } from '@/screens/DealsScreen';
import { EatlistScreen } from '@/screens/EatlistScreen';
import { OrdersScreen } from '@/screens/OrdersScreen';
import { ProfileScreen } from '@/screens/ProfileScreen';
import { RestaurantDetailScreen } from '@/screens/RestaurantDetailScreen';
import { DeliveryTrackingScreen } from '@/screens/DeliveryTrackingScreen';
import { InterventionScreen } from '@/screens/InterventionScreen';
import { DashboardScreen } from '@/screens/DashboardScreen';
import { BottomNav } from '@/components/BottomNav';
import { CartSheet } from '@/components/CartSheet';
import { ProductSheet } from '@/components/ProductSheet';
import { CheckoutSheet } from '@/components/CheckoutSheet';
import { LocationSheet } from '@/components/LocationSheet';
import { SplashScreen } from '@/components/SplashScreen';
import { OnboardingScreen } from '@/screens/OnboardingScreen';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full bg-white px-8 text-center">
          <p className="text-sm font-semibold text-gray-900 mb-1">Something went wrong</p>
          <p className="text-xs text-gray-500 mb-6">Please restart the app</p>
          <button
            className="px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded-full"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function ScreenRouter() {
  const { state } = useApp();

  switch (state.screen) {
    case 'home':
      return <HomeScreen />;
    case 'search':
      return <SearchScreen />;
    case 'deals':
      return <DealsScreen />;
    case 'eatlist':
      return <EatlistScreen />;
    case 'orders':
      return <OrdersScreen />;
    case 'profile':
      return <ProfileScreen />;
    case 'restaurantDetail':
      return <RestaurantDetailScreen />;
    case 'deliveryTracking':
      return <DeliveryTrackingScreen />;
    case 'intervention':
      return <InterventionScreen />;
    case 'dashboard':
      return <DashboardScreen />;
    default:
      return <HomeScreen />;
  }
}

function AppShell() {
  const { state } = useApp();

  const tabRoots = ['home', 'deals', 'eatlist', 'orders', 'profile'];
  const showNav = tabRoots.includes(state.screen);

  return (
    <div className="w-full max-w-[430px] h-[100dvh] md:h-[850px] bg-white rounded-none overflow-hidden shadow-2xl relative isolate flex flex-col">
      <main className="flex-1 overflow-y-auto no-scrollbar overscroll-y-auto scroll-smooth">
        <ScreenRouter />
      </main>

      {!state.onboardingDone && <OnboardingScreen />}
      <LocationSheet />
      <CartSheet />
      <ProductSheet />
      <CheckoutSheet />

      {showNav && <BottomNav />}
    </div>
  );
}

function App() {
  const [splashDone, setSplashDone] = useState(false);
  const handleSplashDone = useCallback(() => setSplashDone(true), []);

  return (
    <ErrorBoundary>
      <AppProvider>
        <div className="relative h-screen w-full bg-neutral-900 flex justify-center items-center p-0 md:p-4">
          {!splashDone && <SplashScreen onDone={handleSplashDone} />}
          <AppShell />
        </div>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
