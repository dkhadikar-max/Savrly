import { useEffect, useRef } from 'react';
import { useApp } from '@/store/AppContext';
import type { Restaurant } from '@/types';
import { getMenuForRestaurant } from '@/lib/menuTemplates';
import { restaurants as staticRestaurants } from '@/data';

const CUISINE_IMAGE: Record<string, string> = {
  biryani: '/images/rest-biryani.jpg',
  mughlai: '/images/rest-biryani.jpg',
  pizza: '/images/rest-pizza.jpg',
  italian: '/images/rest-pizza.jpg',
  burger: '/images/rest-burger.jpg',
  fast_food: '/images/rest-fastfood.jpg',
  american: '/images/rest-fastfood.jpg',
  chinese: '/images/rest-chinese.jpg',
  asian: '/images/rest-chinese.jpg',
  momos: '/images/rest-chinese.jpg',
  south_indian: '/images/rest-southindian.jpg',
  regional: '/images/rest-southindian.jpg',
  kerala: '/images/rest-southindian.jpg',
  coffee: '/images/rest-coffee.jpg',
  cafe: '/images/rest-coffee.jpg',
  bakery: '/images/rest-coffee.jpg',
  dessert: '/images/rest-dessert.jpg',
  sweet: '/images/rest-dessert.jpg',
  ice_cream: '/images/rest-icecream.jpg',
  seafood: '/images/rest-sushi.jpg',
  sushi: '/images/rest-sushi.jpg',
  japanese: '/images/rest-sushi.jpg',
};

function getImage(cuisineTag: string): string {
  const key = cuisineTag.toLowerCase().split(';')[0].trim().replace(/\s+/g, '_');
  return CUISINE_IMAGE[key] ?? '/images/rest-fastfood.jpg';
}

function hash32(n: number): number {
  return ((n * 2654435761) >>> 0);
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

interface OSMElement {
  id: number;
  lat: number;
  lon: number;
  tags?: {
    name?: string;
    cuisine?: string;
    opening_hours?: string;
  };
}

export function useRestaurantDiscovery(): { loading: boolean } {
  const { state, dispatch } = useApp();
  const lastFetchRef = useRef<{ lat: number; lng: number } | null>(null);

  const lat = state.userLocation?.lat;
  const lng = state.userLocation?.lng;

  useEffect(() => {
    if (lat == null || lng == null) return;

    // Skip re-fetch if already have results and haven't moved >500m
    if (lastFetchRef.current && state.discoveredRestaurants) {
      const moved = haversineKm(lastFetchRef.current.lat, lastFetchRef.current.lng, lat, lng);
      if (moved < 0.5) return;
    }

    lastFetchRef.current = { lat, lng };
    dispatch({ type: 'SET_RESTAURANTS_LOADING', loading: true });

    const query = `[out:json][timeout:15];node[amenity=restaurant](around:2000,${lat},${lng});out 20;`;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    const countryCode = state.locale?.countryCode;
    const userCity = state.userCity;

    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error('Overpass request failed');
        return r.json() as Promise<{ elements: OSMElement[] }>;
      })
      .then((data) => {
        const elements = (data.elements ?? []).filter((el) => el.tags?.name);

        const discovered: Restaurant[] = elements.map((el) => {
          const name = el.tags?.name ?? 'Local Restaurant';
          const cuisineTag = el.tags?.cuisine ?? 'default';

          const distKm = haversineKm(lat, lng, el.lat, el.lon);
          const distMi = distKm / 1.609;

          const h1 = hash32(el.id);
          const h2 = hash32(el.id + 1);
          const rating = parseFloat((4.0 + (h1 % 10) / 10).toFixed(1));
          const reviewCount = 80 + (h2 % 3920);

          const baseMin = 15 + Math.round(distKm * 4);
          const deliveryTime = `${baseMin}–${baseMin + 10} min`;
          const deliveryFee = distKm < 1 ? 0 : parseFloat((distKm * 0.2).toFixed(2));

          const menu = getMenuForRestaurant(name, cuisineTag, staticRestaurants);
          const menuItems = menu.menuItems.map((item, i) => ({
            ...item,
            id: `osm-${el.id}-${i}`,
          }));

          const firstTag = cuisineTag.split(';')[0].trim();
          const cuisineDisplay = firstTag
            .replace(/_/g, ' ')
            .replace(/(^|\s)\w/g, (c) => c.toUpperCase());

          return {
            id: `osm-${el.id}`,
            name,
            cuisine: cuisineDisplay || 'Restaurant',
            rating,
            reviewCount,
            deliveryTime,
            deliveryFee,
            distance: `${distMi.toFixed(1)} mi`,
            image: getImage(cuisineTag),
            menuCategories: menu.menuCategories,
            menuItems,
            country: countryCode,
            city: userCity ?? undefined,
          };
        });

        dispatch({ type: 'SET_DISCOVERED_RESTAURANTS', restaurants: discovered });
      })
      .catch(() => {
        // Silent fallback — static data remains visible
      })
      .finally(() => {
        dispatch({ type: 'SET_RESTAURANTS_LOADING', loading: false });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng]);

  return { loading: state.restaurantsLoading };
}
