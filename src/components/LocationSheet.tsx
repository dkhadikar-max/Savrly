import { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { useApp } from '@/store/AppContext';

export function LocationSheet() {
  const { state, dispatch } = useApp();
  const [loading, setLoading] = useState(false);

  if (state.locationPermission !== 'idle') return null;

  const handleAllow = () => {
    if (!navigator.geolocation) {
      dispatch({ type: 'SET_LOCATION', permission: 'denied' });
      return;
    }
    setLoading(true);
    dispatch({ type: 'SET_LOCATION', permission: 'requesting' });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        dispatch({
          type: 'SET_LOCATION',
          permission: 'granted',
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        dispatch({ type: 'SET_LOCATION', permission: 'denied' });
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  const handleManual = () => {
    dispatch({ type: 'SET_LOCATION', permission: 'denied' });
  };

  return (
    <div className="absolute inset-0 z-[80] isolate">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        <div className="px-6 pt-2 pb-8">
          <div className="flex items-center justify-center mb-5">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <MapPin size={28} className="text-gray-700" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-900 text-center">Find food near you</h2>
          <p className="text-sm text-gray-500 text-center mt-2 leading-relaxed">
            Allow location access to see nearby restaurants and get accurate delivery times.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={handleAllow}
              disabled={loading}
              className="w-full bg-gray-900 text-white rounded-full py-4 text-sm font-semibold flex items-center justify-center gap-2 active:scale-[0.97] transition-transform disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Navigation size={16} />
                  Use my current location
                </>
              )}
            </button>

            <button
              onClick={handleManual}
              className="w-full py-3 text-sm font-medium text-gray-500 active:text-gray-900 transition-colors"
            >
              Set address manually
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
