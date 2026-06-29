import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { AppState, CartItem, ScreenName, TabName } from '@/types';
import { initialUserStats, addresses, pastOrders } from '@/data';
import { getLocaleFromTimezone } from '@/lib/locale';
import type { LocaleConfig } from '@/lib/locale';

const tabRoots: Record<TabName, ScreenName> = {
  home: 'home',
  deals: 'deals',
  eatlist: 'eatlist',
  orders: 'orders',
  profile: 'profile',
};

const initialState: AppState = {
  screen: 'home',
  prevScreen: null,
  activeTab: 'home',
  selectedRestaurantId: null,
  selectedMenuItemId: null,
  cart: [],
  favorites: [],
  orders: pastOrders,
  addresses: addresses,
  userStats: initialUserStats,
  searchQuery: '',
  showProductSheet: false,
  showCartSheet: false,
  showCheckoutSheet: false,
  deliveryStep: 0,
  showIntervention: false,
  scrollY: 0,
  locationPermission: 'idle',
  userLocation: null,
  locale: getLocaleFromTimezone(),
};

type Action =
  | { type: 'NAVIGATE'; screen: ScreenName; restaurantId?: string; menuItemId?: string }
  | { type: 'GO_BACK' }
  | { type: 'SET_TAB'; tab: TabName }
  | { type: 'ADD_TO_CART'; item: CartItem }
  | { type: 'REMOVE_FROM_CART'; index: number }
  | { type: 'UPDATE_CART_QUANTITY'; index: number; delta: number }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_FAVORITE'; restaurantId: string }
  | { type: 'SET_SEARCH'; query: string }
  | { type: 'TOGGLE_PRODUCT_SHEET'; show: boolean; menuItemId?: string }
  | { type: 'TOGGLE_CART_SHEET'; show: boolean }
  | { type: 'TOGGLE_CHECKOUT_SHEET'; show: boolean }
  | { type: 'SET_DELIVERY_STEP'; step: number }
  | { type: 'SHOW_INTERVENTION'; show: boolean }
  | { type: 'ADD_ORDER'; order: import('@/types').Order }
  | { type: 'UPDATE_STATS'; stats: Partial<import('@/types').UserStats> }
  | { type: 'SET_SCROLL_Y'; y: number }
  | { type: 'SET_LOCATION'; permission: AppState['locationPermission']; lat?: number; lng?: number }
  | { type: 'SET_LOCALE'; locale: LocaleConfig };

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'NAVIGATE':
      return {
        ...state,
        prevScreen: state.screen,
        screen: action.screen,
        selectedRestaurantId: action.restaurantId ?? state.selectedRestaurantId,
        selectedMenuItemId: action.menuItemId ?? state.selectedMenuItemId,
      };
    case 'GO_BACK':
      return {
        ...state,
        screen: state.prevScreen ?? tabRoots[state.activeTab as TabName] ?? 'home',
        prevScreen: null,
      };
    case 'SET_TAB': {
      const screen = tabRoots[action.tab];
      return {
        ...state,
        screen,
        activeTab: action.tab,
        prevScreen: null,
      };
    }
    case 'ADD_TO_CART': {
      const existingIndex = state.cart.findIndex(
        (c) =>
          c.menuItem.id === action.item.menuItem.id &&
          JSON.stringify(c.selectedOptions) === JSON.stringify(action.item.selectedOptions)
      );
      if (existingIndex >= 0) {
        const newCart = [...state.cart];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity + action.item.quantity,
        };
        return { ...state, cart: newCart };
      }
      return { ...state, cart: [...state.cart, action.item] };
    }
    case 'REMOVE_FROM_CART': {
      const newCart = [...state.cart];
      newCart.splice(action.index, 1);
      return { ...state, cart: newCart };
    }
    case 'UPDATE_CART_QUANTITY': {
      const newCart = [...state.cart];
      const item = newCart[action.index];
      const newQuantity = item.quantity + action.delta;
      if (newQuantity <= 0) {
        newCart.splice(action.index, 1);
      } else {
        newCart[action.index] = { ...item, quantity: newQuantity };
      }
      return { ...state, cart: newCart };
    }
    case 'CLEAR_CART':
      return { ...state, cart: [] };
    case 'TOGGLE_FAVORITE': {
      const favs = state.favorites.includes(action.restaurantId)
        ? state.favorites.filter((id) => id !== action.restaurantId)
        : [...state.favorites, action.restaurantId];
      return { ...state, favorites: favs };
    }
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.query };
    case 'TOGGLE_PRODUCT_SHEET':
      return {
        ...state,
        showProductSheet: action.show,
        selectedMenuItemId: action.menuItemId ?? state.selectedMenuItemId,
      };
    case 'TOGGLE_CART_SHEET':
      return { ...state, showCartSheet: action.show };
    case 'TOGGLE_CHECKOUT_SHEET':
      return { ...state, showCheckoutSheet: action.show };
    case 'SET_DELIVERY_STEP':
      return { ...state, deliveryStep: action.step };
    case 'SHOW_INTERVENTION':
      return { ...state, showIntervention: action.show };
    case 'ADD_ORDER':
      return { ...state, orders: [action.order, ...state.orders] };
    case 'UPDATE_STATS':
      return { ...state, userStats: { ...state.userStats, ...action.stats } };
    case 'SET_SCROLL_Y':
      return { ...state, scrollY: action.y };
    case 'SET_LOCATION':
      return {
        ...state,
        locationPermission: action.permission,
        userLocation:
          action.lat !== undefined && action.lng !== undefined
            ? { lat: action.lat, lng: action.lng }
            : state.userLocation,
      };
    case 'SET_LOCALE':
      return { ...state, locale: action.locale };
    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  navigate: (screen: ScreenName, opts?: { restaurantId?: string; menuItemId?: string }) => void;
  goBack: () => void;
  setTab: (tab: TabName) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const navigate = useCallback(
    (screen: ScreenName, opts?: { restaurantId?: string; menuItemId?: string }) => {
      dispatch({ type: 'NAVIGATE', screen, ...opts });
    },
    []
  );

  const goBack = useCallback(() => {
    dispatch({ type: 'GO_BACK' });
  }, []);

  const setTab = useCallback((tab: TabName) => {
    dispatch({ type: 'SET_TAB', tab });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, navigate, goBack, setTab }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
