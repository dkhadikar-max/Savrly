import { useState, useRef, useEffect } from 'react';
import { Search, X, Clock, TrendingUp, ArrowLeft, Star } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { restaurants, popularSearches, trendingSearches } from '@/data';

export function SearchScreen() {
  const { navigate, goBack } = useApp();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([
    'Pizza',
    'Burger near me',
    'Healthy bowls',
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  const allItems = restaurants.flatMap((r) =>
    r.menuItems.map((item) => ({
      ...item,
      restaurantName: r.name,
      restaurantImage: r.image,
      restaurantId: r.id,
      restaurantRating: r.rating,
    }))
  );

  const filteredRestaurants = query
    ? restaurants.filter(
        (r) =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.cuisine.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredItems = query
    ? allItems.filter(
        (i) =>
          i.name.toLowerCase().includes(query.toLowerCase()) ||
          i.description.toLowerCase().includes(query.toLowerCase()) ||
          i.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSearch = (term: string) => {
    setQuery(term);
    if (term && !recentSearches.includes(term)) {
      setRecentSearches((prev) => [term, ...prev].slice(0, 8));
    }
  };

  const clearRecent = (term: string) => {
    setRecentSearches((prev) => prev.filter((s) => s !== term));
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Search Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="active:opacity-60">
            <ArrowLeft size={22} className="text-gray-900" />
          </button>
          <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2 gap-2">
            <Search size={18} className="text-gray-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search restaurants, dishes, cuisines..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
            {query && (
              <button onClick={() => setQuery('')}>
                <X size={16} className="text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {!query ? (
          <div className="p-4">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">Recent</h3>
                  <button
                    onClick={() => setRecentSearches([])}
                    className="text-xs text-red-500 font-medium"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-col">
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      className="flex items-center gap-3 py-3 text-left active:bg-gray-50 rounded-lg px-1"
                      onClick={() => handleSearch(term)}
                    >
                      <Clock size={16} className="text-gray-400 shrink-0" />
                      <span className="flex-1 text-sm text-gray-700">{term}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          clearRecent(term);
                        }}
                      >
                        <X size={14} className="text-gray-300" />
                      </button>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Searches */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Popular Searches</h3>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSearch(term)}
                    className="px-3 py-2 bg-gray-100 rounded-full text-xs font-medium text-gray-700 active:bg-gray-200 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Trending */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-1.5">
                <TrendingUp size={14} className="text-green-500" />
                Trending Now
              </h3>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSearch(term)}
                    className="px-3 py-2 bg-orange-50 rounded-full text-xs font-medium text-orange-700 active:bg-orange-100 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4">
            {/* Search Results */}
            {filteredRestaurants.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">
                  Restaurants ({filteredRestaurants.length})
                </h3>
                {filteredRestaurants.map((r) => (
                  <button
                    key={r.id}
                    className="flex items-center gap-3 w-full text-left py-3 active:bg-gray-50 rounded-lg px-1"
                    onClick={() => navigate('restaurantDetail', { restaurantId: r.id })}
                  >
                    <img
                      src={r.image}
                      alt={r.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{r.name}</p>
                      <p className="text-xs text-gray-500">{r.cuisine}</p>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <Star size={12} className="text-yellow-500" fill="#EAB308" />
                      <span className="text-xs font-medium">{r.rating}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {filteredItems.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">
                  Dishes ({filteredItems.length})
                </h3>
                {filteredItems.map((item) => (
                  <button
                    key={item.id}
                    className="flex items-center gap-3 w-full text-left py-3 active:bg-gray-50 rounded-lg px-1"
                    onClick={() =>
                      navigate('restaurantDetail', { restaurantId: item.restaurantId })
                    }
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500 truncate">{item.restaurantName}</p>
                      <p className="text-xs font-semibold text-gray-900">${item.price.toFixed(2)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {filteredRestaurants.length === 0 && filteredItems.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <Search size={48} className="text-gray-200 mb-4" />
                <p className="text-sm font-medium text-gray-400">No results found</p>
                <p className="text-xs text-gray-300 mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
