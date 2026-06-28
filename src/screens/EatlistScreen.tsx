import { Heart, Star, Clock } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { restaurants } from '@/data';

export function EatlistScreen() {
  const { state, navigate, dispatch } = useApp();
  const favRestaurants = restaurants.filter((r) => state.favorites.includes(r.id));

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="sticky top-0 z-40 bg-white px-4 py-4 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Eatlist</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {favRestaurants.length} saved {favRestaurants.length === 1 ? 'restaurant' : 'restaurants'}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {favRestaurants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Heart size={28} className="text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-400">No favorites yet</p>
            <p className="text-xs text-gray-300 mt-1">Tap the heart on any restaurant to save it</p>
          </div>
        ) : (
          <div className="p-4 flex flex-col gap-3">
            {favRestaurants.map((r) => (
              <div key={r.id} className="relative">
                <button
                  className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3 text-left w-full active:scale-[0.98] transition-transform"
                  onClick={() => navigate('restaurantDetail', { restaurantId: r.id })}
                >
                  <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden">
                    <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900">{r.name}</h3>
                    <p className="text-xs text-gray-500">{r.cuisine}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-0.5">
                        <Star size={11} className="text-green-600" fill="#16A34A" />
                        <span className="text-xs text-green-700 font-medium">{r.rating}</span>
                      </div>
                      <span className="text-gray-300">\u00b7</span>
                      <div className="flex items-center gap-0.5">
                        <Clock size={11} className="text-gray-400" />
                        <span className="text-xs text-gray-500">{r.deliveryTime}</span>
                      </div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => dispatch({ type: 'TOGGLE_FAVORITE', restaurantId: r.id })}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm active:scale-90"
                >
                  <Heart size={16} className="text-red-500" fill="#EF4444" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
