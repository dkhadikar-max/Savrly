import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { offers } from '@/data';
import { restaurants } from '@/data';
import { Star, Clock } from 'lucide-react';
import { useApp } from '@/store/AppContext';

export function DealsScreen() {
  const { navigate } = useApp();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const dealRestaurants = restaurants.filter((r) => r.offer);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="sticky top-0 z-40 bg-white px-4 py-4 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Deals</h1>
        <p className="text-sm text-gray-500 mt-0.5">Promo codes and special offers</p>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Promo Codes */}
        <div className="p-4">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Promo Codes</h2>
          <div className="flex flex-col gap-3">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="rounded-2xl p-4 text-white relative overflow-hidden"
                style={{ backgroundColor: offer.color }}
              >
                <div className="relative z-10">
                  <p className="text-lg font-bold">{offer.title}</p>
                  <p className="text-sm text-white/80">{offer.subtitle}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="bg-white/20 rounded-full px-3 py-1.5">
                      <span className="text-xs font-mono font-semibold">{offer.code}</span>
                    </div>
                    <button
                      onClick={() => handleCopy(offer.code, offer.id)}
                      className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1.5 active:bg-white/30"
                    >
                      {copiedId === offer.id ? (
                        <>
                          <Check size={12} />
                          <span className="text-xs font-medium">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span className="text-xs font-medium">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div className="absolute right-0 top-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
                <div className="absolute right-12 bottom-0 w-16 h-16 bg-white/10 rounded-full translate-y-8" />
              </div>
            ))}
          </div>
        </div>

        {/* Restaurant Offers */}
        <div className="px-4 pb-6">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Restaurant Offers</h2>
          <div className="flex flex-col gap-3">
            {dealRestaurants.map((r) => (
              <button
                key={r.id}
                className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3 text-left active:scale-[0.98] transition-transform"
                onClick={() => navigate('restaurantDetail', { restaurantId: r.id })}
              >
                <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden">
                  <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
                  {r.offer && (
                    <div className="absolute top-1 left-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      {r.offer}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900">{r.name}</h3>
                  <p className="text-xs text-gray-500">{r.cuisine}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-0.5">
                      <Star size={11} className="text-green-600" fill="#16A34A" />
                      <span className="text-xs text-green-700 font-medium">{r.rating}</span>
                    </div>
                    <span className="text-gray-300">&middot;</span>
                    <div className="flex items-center gap-0.5">
                      <Clock size={11} className="text-gray-400" />
                      <span className="text-xs text-gray-500">{r.deliveryTime}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
