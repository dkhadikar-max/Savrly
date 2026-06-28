export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular?: boolean;
  customizable?: boolean;
  options?: MenuOption[];
  calories?: number;
}

export interface MenuOption {
  id: string;
  name: string;
  choices: OptionChoice[];
}

export interface OptionChoice {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  selectedOptions: SelectedOption[];
}

export interface SelectedOption {
  optionId: string;
  choiceId: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  distance: string;
  image: string;
  offer?: string;
  popular?: boolean;
  menuCategories: string[];
  menuItems: MenuItem[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Address {
  id: string;
  label: string;
  address: string;
}

export interface Order {
  id: string;
  restaurantName: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'delivered' | 'cancelled' | 'preparing';
}

export interface UserStats {
  moneySaved: number;
  currentStreak: number;
  longestStreak: number;
  cravingsResisted: number;
  ordersCancelled: number;
  totalDelays: number;
  weeklyProgress: number[];
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  date?: string;
}

export interface AppState {
  screen: string;
  prevScreen: string | null;
  activeTab: string;
  selectedRestaurantId: string | null;
  selectedMenuItemId: string | null;
  cart: CartItem[];
  favorites: string[];
  orders: Order[];
  addresses: Address[];
  userStats: UserStats;
  searchQuery: string;
  showProductSheet: boolean;
  showCartSheet: boolean;
  showCheckoutSheet: boolean;
  deliveryStep: number;
  showIntervention: boolean;
  scrollY: number;
}

export type ScreenName =
  | 'home'
  | 'search'
  | 'deals'
  | 'eatlist'
  | 'orders'
  | 'profile'
  | 'restaurantDetail'
  | 'deliveryTracking'
  | 'intervention'
  | 'dashboard';

export type TabName = 'home' | 'deals' | 'eatlist' | 'orders' | 'profile';
