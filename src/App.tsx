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
    <div className="h-screen w-full bg-neutral-900 flex justify-center items-center p-0 md:p-4">
      <div className="w-full max-w-[430px] h-[100dvh] md:h-[850px] bg-white rounded-none overflow-hidden shadow-2xl relative isolate flex flex-col">
        <main className="flex-1 overflow-y-auto no-scrollbar overscroll-y-auto scroll-smooth">
          <ScreenRouter />
        </main>

        <LocationSheet />
        <CartSheet />
        <ProductSheet />
        <CheckoutSheet />

        {showNav && <BottomNav />}
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

export default App;
