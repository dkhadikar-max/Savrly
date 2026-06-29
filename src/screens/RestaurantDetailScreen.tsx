import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Heart, Star, Clock, MapPin, ChevronRight, ShoppingBag } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { restaurants } from '@/data';
import { useLocale } from '@/hooks/useLocale';

export function RestaurantDetailScreen() {
  const { state, goBack, dispatch } = useApp();
  const [activeCategory, setActiveCategory] = useState(0);
  const [, setHeaderCollapsed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const restaurant = restaurants.find((r) => r.id === state.selectedRestaurantId);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setHeaderCollapsed(el.scrollTop > 180);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  if (!restaurant) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">Restaurant not found</p>
      </div>
    );
  }

  const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = state.cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const { formatPrice, formatDistance } = useLocale();

  const isFav = state.favorites.includes(restaurant.id);

  return (
    <div className="flex flex-col h-full relative">
      {/* Scrollable Content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar">
        {/* Hero Image */}
        <div className="relative h-[250px] w-full">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Floating Buttons */}
          <button
            onClick={goBack}
            className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform"
          >
            <ArrowLeft size={20} className="text-gray-900" />
          </button>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_FAVORITE', restaurantId: restaurant.id })}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform"
          >
            <Heart
              size={20}
              className={isFav ? 'text-red-500' : 'text-gray-600'}
              fill={isFav ? '#EF4444' : 'none'}
            />
          </button>

          {/* Offer Badge */}
          {restaurant.offer && (
            <div className="absolute bottom-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              {restaurant.offer}
            </div>
          )}
        </div>

        {/* Restaurant Info */}
        <div className="px-4 pt-4 pb-2">
          <h1 className="text-2xl font-bold text-gray-900">{restaurant.name}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{restaurant.cuisine}</p>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1">
              <Star size={14} className="text-green-600" fill="#16A34A" />
              <span className="text-sm font-semibold text-green-700">{restaurant.rating}</span>
              <span className="text-xs text-gray-400">({restaurant.reviewCount})</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} className="text-gray-400" />
              <span className="text-sm text-gray-600">{restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={14} className="text-gray-400" />
              <span className="text-sm text-gray-600">{formatDistance(restaurant.distance)}</span>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-600">
              {restaurant.deliveryFee === 0
                ? 'Free delivery'
                : `${formatPrice(restaurant.deliveryFee)} delivery fee`}
            </span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-2">
          <div className="flex gap-4 overflow-x-auto no-scrollbar">
            {restaurant.menuCategories.map((cat, i) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(i)}
                className={`shrink-0 text-sm font-medium py-2 border-b-2 transition-colors select-none ${
                  activeCategory === i
                    ? 'text-gray-900 border-gray-900'
                    : 'text-gray-400 border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="px-4 py-4">
          {restaurant.menuCategories.map((cat, catIdx) => (
            <div key={cat} className={catIdx === activeCategory ? '' : 'hidden'}>
              <h2 className="text-lg font-bold text-gray-900 mb-3">{cat}</h2>
              <div className="flex flex-col gap-1">
                {restaurant.menuItems
                  .filter((item) => item.category === cat)
                  .map((item) => (
                    <button
                      key={item.id}
                      className="flex items-start gap-3 py-3 text-left w-full active:bg-gray-50 rounded-xl px-1 transition-colors"
                      onClick={() =>
                        dispatch({
                          type: 'TOGGLE_PRODUCT_SHEET',
                          show: true,
                          menuItemId: item.id,
                        })
                      }
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-900">{item.name}</h3>
                            {item.popular && (
                              <span className="inline-block mt-0.5 text-[10px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                                POPULAR
                              </span>
                            )}
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {item.description}
                            </p>
                            <p className="text-sm font-semibold text-gray-900 mt-2">
                              {formatPrice(item.price)}
                            </p>
                          </div>
                          <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>

        {/* Spacer for FAB */}
        <div className="h-24" />
      </div>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <div className="absolute bottom-6 left-4 right-4 z-30">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_CART_SHEET', show: true })}
            className="w-full h-14 bg-gray-900 text-white rounded-full flex items-center justify-between px-6 shadow-xl active:scale-[0.97] transition-transform"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} />
              <span className="text-sm font-semibold">
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">{formatPrice(cartTotal)}</span>
              <ChevronRight size={16} />
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
