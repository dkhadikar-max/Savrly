import { useState, useRef, useEffect } from 'react';
import { Search, SlidersHorizontal, ChevronDown, Star, Clock, MapPin, ChevronRight, Flame, TrendingUp, Zap } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { restaurants, categories, offers } from '@/data';
import { Pizza, Beef, Cherry, Leaf, CakeSlice, Coffee, IceCreamCone, Sunrise, Moon, Zap as ZapIcon, Wheat, Fish, Salad } from 'lucide-react';

const iconMap: Record<string, typeof Pizza> = {
  pizza: Pizza,
  beef: Beef,
  rice: Salad,
  cherry: Cherry,
  leaf: Leaf,
  cake: CakeSlice,
  coffee: Coffee,
  'ice-cream': IceCreamCone,
  sunrise: Sunrise,
  moon: Moon,
  zap: ZapIcon,
  wheat: Wheat,
  fish: Fish,
};

export function HomeScreen() {
  const { navigate, dispatch } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 50);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Sticky Header */}
      <div
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white'
        }`}
      >
        {/* Delivery Address */}
        <button className="flex items-center gap-1 px-4 pt-3 pb-1 active:opacity-70">
          <MapPin size={16} className="text-red-500" strokeWidth={2} />
          <span className="text-sm font-medium text-gray-900">Deliver to</span>
          <ChevronDown size={14} className="text-gray-500" />
          <span className="text-xs text-gray-500 ml-0.5 truncate max-w-[200px]">
            742 Evergreen Terrace
          </span>
        </button>

        {/* Search Bar */}
        <div className="flex items-center gap-2 px-4 py-2">
          <button
            onClick={() => navigate('search')}
            className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2.5 text-left active:bg-gray-200 transition-colors"
          >
            <Search size={18} className="text-gray-400" />
            <span className="text-sm text-gray-400">Search restaurants, dishes...</span>
          </button>
          <button className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full active:bg-gray-200 transition-colors">
            <SlidersHorizontal size={18} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar">
        {/* Hero Banner */}
        <div className="px-4 pt-2 pb-3">
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden">
            <img
              src="/images/hero-banner.jpg"
              alt="Promo"
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white/80 text-xs font-medium">Limited time offer</p>
              <p className="text-white text-lg font-bold">50% OFF Your First Order</p>
              <p className="text-white/90 text-xs">Up to $15 off \u00b7 Code: WELCOME50</p>
            </div>
          </div>
        </div>

        {/* Category Chips */}
        <div className="px-4 pb-4">
          <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1">
            {categories.map((cat) => {
              const Icon = iconMap[cat.icon] || Pizza;
              return (
                <button
                  key={cat.id}
                  className="flex flex-col items-center gap-1.5 min-w-[64px] snap-start active:scale-95 transition-transform select-none"
                  onClick={() => {
                    dispatch({ type: 'SET_SEARCH', query: cat.name });
                    navigate('search');
                  }}
                >
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                    <Icon size={22} className="text-gray-700" strokeWidth={1.5} />
                  </div>
                  <span className="text-[11px] font-medium text-gray-700">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Offers Section */}
        <div className="px-4 pb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Offers For You</h2>
          <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="min-w-[260px] snap-start rounded-xl p-4 text-white select-none"
                style={{ backgroundColor: offer.color }}
              >
                <p className="text-lg font-bold">{offer.title}</p>
                <p className="text-xs text-white/80">{offer.subtitle}</p>
                <div className="mt-2 inline-flex items-center gap-1 bg-white/20 rounded-full px-3 py-1">
                  <span className="text-xs font-mono">{offer.code}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Section */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-1.5">
              <Flame size={18} className="text-orange-500" />
              Featured
            </h2>
            <button className="text-xs font-medium text-gray-500 flex items-center active:opacity-70">
              See all <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {restaurants.filter((r) => r.popular).map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        </div>

        {/* Fastest Near You */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-1.5">
              <Zap size={18} className="text-yellow-500" />
              Fastest Near You
            </h2>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1">
            {restaurants
              .filter((r) => parseInt(r.deliveryTime) <= 25)
              .map((r) => (
                <div key={r.id} className="min-w-[280px] snap-start">
                  <RestaurantCardWide restaurant={r} />
                </div>
              ))}
          </div>
        </div>

        {/* Trending Now */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-1.5">
              <TrendingUp size={18} className="text-green-500" />
              Trending Now
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {restaurants.slice(0, 4).map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        </div>

        {/* All Restaurants */}
        <div className="px-4 pb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">All Restaurants</h2>
          <div className="flex flex-col gap-3">
            {restaurants.map((r) => (
              <RestaurantCardWide key={r.id} restaurant={r} />
            ))}
          </div>
        </div>

        {/* Spacer for nav */}
        <div className="h-4" />
      </div>
    </div>
  );
}

function RestaurantCard({ restaurant }: { restaurant: import('@/types').Restaurant }) {
  const { navigate } = useApp();

  return (
    <button
      className="text-left active:scale-[0.96] transition-transform duration-150 select-none"
      onClick={() => navigate('restaurantDetail', { restaurantId: restaurant.id })}
    >
      <div className="relative rounded-2xl overflow-hidden bg-gray-100">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full aspect-[4/3] object-cover"
          loading="lazy"
        />
        {restaurant.offer && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {restaurant.offer}
          </div>
        )}
        <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-white/90 backdrop-blur-sm rounded-full px-1.5 py-0.5">
          <Star size={10} className="text-yellow-500" fill="#EAB308" />
          <span className="text-[10px] font-bold">{restaurant.rating}</span>
        </div>
      </div>
      <div className="mt-1.5 px-0.5">
        <p className="text-sm font-semibold text-gray-900 truncate">{restaurant.name}</p>
        <p className="text-xs text-gray-500">{restaurant.cuisine}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <div className="flex items-center gap-0.5">
            <Clock size={10} className="text-gray-400" />
            <span className="text-[11px] text-gray-500">{restaurant.deliveryTime}</span>
          </div>
          <span className="text-[11px] text-gray-400">\u00b7</span>
          <span className="text-[11px] text-gray-500">
            {restaurant.deliveryFee === 0 ? 'Free delivery' : `$${restaurant.deliveryFee.toFixed(2)}`}
          </span>
        </div>
      </div>
    </button>
  );
}

function RestaurantCardWide({ restaurant }: { restaurant: import('@/types').Restaurant }) {
  const { navigate } = useApp();

  return (
    <button
      className="text-left w-full active:scale-[0.98] transition-transform duration-150 select-none"
      onClick={() => navigate('restaurantDetail', { restaurantId: restaurant.id })}
    >
      <div className="flex gap-3 bg-gray-50 rounded-2xl p-3">
        <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-gray-200">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {restaurant.offer && (
            <div className="absolute top-1 left-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
              {restaurant.offer}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 py-0.5">
          <div className="flex items-start justify-between">
            <h3 className="text-sm font-semibold text-gray-900 truncate pr-2">{restaurant.name}</h3>
            <div className="flex items-center gap-0.5 shrink-0 bg-green-50 rounded-full px-1.5 py-0.5">
              <Star size={10} className="text-green-600" fill="#16A34A" />
              <span className="text-[10px] font-bold text-green-700">{restaurant.rating}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{restaurant.cuisine}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="flex items-center gap-0.5">
              <Clock size={11} className="text-gray-400" />
              <span className="text-xs text-gray-600">{restaurant.deliveryTime}</span>
            </div>
            <span className="text-xs text-gray-300">\u00b7</span>
            <span className="text-xs text-gray-600">{restaurant.distance}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {restaurant.deliveryFee === 0
              ? 'Free delivery'
              : `$${restaurant.deliveryFee.toFixed(2)} delivery`}
          </p>
        </div>
      </div>
    </button>
  );
}
