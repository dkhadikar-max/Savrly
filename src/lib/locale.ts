export interface LocaleConfig {
  countryCode: string;
  currencySymbol: string;
  currencyCode: string;
  rate: number;      // 1 USD → N local units
  ppp: number;       // purchasing power parity vs US (keeps prices realistic)
  distanceUnit: 'km' | 'mi';
}

type LocaleEntry = Omit<LocaleConfig, 'countryCode'>;

const LOCALES: Record<string, LocaleEntry> = {
  US: { currencySymbol: '$',    currencyCode: 'USD', rate: 1,      ppp: 1.00, distanceUnit: 'mi' },
  IN: { currencySymbol: '₹',   currencyCode: 'INR', rate: 83.5,   ppp: 0.18, distanceUnit: 'km' },
  GB: { currencySymbol: '£',   currencyCode: 'GBP', rate: 0.79,   ppp: 0.85, distanceUnit: 'mi' },
  AU: { currencySymbol: 'A$',  currencyCode: 'AUD', rate: 1.53,   ppp: 0.80, distanceUnit: 'km' },
  CA: { currencySymbol: 'CA$', currencyCode: 'CAD', rate: 1.36,   ppp: 0.82, distanceUnit: 'km' },
  AE: { currencySymbol: 'AED', currencyCode: 'AED', rate: 3.67,   ppp: 0.85, distanceUnit: 'km' },
  SG: { currencySymbol: 'S$',  currencyCode: 'SGD', rate: 1.34,   ppp: 0.75, distanceUnit: 'km' },
  JP: { currencySymbol: '¥',   currencyCode: 'JPY', rate: 149,    ppp: 0.65, distanceUnit: 'km' },
  NZ: { currencySymbol: 'NZ$', currencyCode: 'NZD', rate: 1.64,   ppp: 0.76, distanceUnit: 'km' },
  ZA: { currencySymbol: 'R',   currencyCode: 'ZAR', rate: 18.5,   ppp: 0.30, distanceUnit: 'km' },
  NG: { currencySymbol: '₦',   currencyCode: 'NGN', rate: 1550,   ppp: 0.12, distanceUnit: 'km' },
  PK: { currencySymbol: '₨',   currencyCode: 'PKR', rate: 278,    ppp: 0.13, distanceUnit: 'km' },
  BD: { currencySymbol: '৳',   currencyCode: 'BDT', rate: 110,    ppp: 0.14, distanceUnit: 'km' },
  MX: { currencySymbol: 'MX$', currencyCode: 'MXN', rate: 17.2,   ppp: 0.38, distanceUnit: 'km' },
  BR: { currencySymbol: 'R$',  currencyCode: 'BRL', rate: 4.97,   ppp: 0.42, distanceUnit: 'km' },
  CN: { currencySymbol: '¥',   currencyCode: 'CNY', rate: 7.24,   ppp: 0.45, distanceUnit: 'km' },
  KR: { currencySymbol: '₩',   currencyCode: 'KRW', rate: 1330,   ppp: 0.68, distanceUnit: 'km' },
  ID: { currencySymbol: 'Rp',  currencyCode: 'IDR', rate: 15800,  ppp: 0.14, distanceUnit: 'km' },
  PH: { currencySymbol: '₱',   currencyCode: 'PHP', rate: 56,     ppp: 0.22, distanceUnit: 'km' },
  TH: { currencySymbol: '฿',   currencyCode: 'THB', rate: 35,     ppp: 0.35, distanceUnit: 'km' },
};

const EUR_ENTRY: LocaleEntry = { currencySymbol: '€', currencyCode: 'EUR', rate: 0.92, ppp: 0.78, distanceUnit: 'km' };
const EU_COUNTRIES = new Set(['AT','BE','CY','EE','FI','FR','DE','GR','IE','IT','LT','LU','LV','MT','NL','PT','SI','SK','ES']);

export const DEFAULT_LOCALE: LocaleConfig = { countryCode: 'US', ...LOCALES.US };

export function getLocale(countryCode: string): LocaleConfig {
  if (LOCALES[countryCode]) return { countryCode, ...LOCALES[countryCode] };
  if (EU_COUNTRIES.has(countryCode)) return { countryCode, ...EUR_ENTRY };
  return { ...DEFAULT_LOCALE, countryCode };
}

const TZ_COUNTRY: Record<string, string> = {
  'Asia/Kolkata': 'IN', 'Asia/Calcutta': 'IN',
  'America/New_York': 'US', 'America/Chicago': 'US', 'America/Los_Angeles': 'US',
  'America/Denver': 'US', 'America/Phoenix': 'US', 'Pacific/Honolulu': 'US',
  'America/Anchorage': 'US',
  'Europe/London': 'GB',
  'Europe/Paris': 'FR', 'Europe/Berlin': 'DE', 'Europe/Madrid': 'ES',
  'Europe/Rome': 'IT', 'Europe/Amsterdam': 'NL', 'Europe/Brussels': 'BE',
  'Asia/Tokyo': 'JP',
  'Australia/Sydney': 'AU', 'Australia/Melbourne': 'AU', 'Australia/Perth': 'AU',
  'America/Toronto': 'CA', 'America/Vancouver': 'CA', 'America/Edmonton': 'CA',
  'Asia/Singapore': 'SG',
  'Asia/Dubai': 'AE', 'Asia/Abu_Dhabi': 'AE',
  'Pacific/Auckland': 'NZ',
  'Africa/Johannesburg': 'ZA',
  'Africa/Lagos': 'NG',
  'Asia/Karachi': 'PK',
  'Asia/Dhaka': 'BD',
  'America/Mexico_City': 'MX',
  'America/Sao_Paulo': 'BR',
  'Asia/Shanghai': 'CN', 'Asia/Hong_Kong': 'CN',
  'Asia/Seoul': 'KR',
  'Asia/Jakarta': 'ID',
  'Asia/Manila': 'PH',
  'Asia/Bangkok': 'TH',
};

export function getLocaleFromTimezone(): LocaleConfig {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (TZ_COUNTRY[tz]) return getLocale(TZ_COUNTRY[tz]);
    // Fallback: derive country from browser language tag (e.g. "en-IN" → "IN")
    const langs: string[] = Array.from(
      navigator.languages?.length ? navigator.languages : [navigator.language ?? '']
    );
    for (const lang of langs) {
      const parts = lang.split('-');
      const region = parts[parts.length - 1].toUpperCase();
      if (LOCALES[region] || EU_COUNTRIES.has(region)) return getLocale(region);
    }
    return DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

// No-decimal currencies
const WHOLE_UNIT_CURRENCIES = new Set(['JPY', 'KRW', 'IDR', 'INR', 'NGN', 'PKR', 'BDT']);

export function formatPrice(usdAmount: number, locale: LocaleConfig): string {
  const raw = usdAmount * locale.rate * locale.ppp;
  if (WHOLE_UNIT_CURRENCIES.has(locale.currencyCode)) {
    const rounded = Math.round(raw / 5) * 5;
    return `${locale.currencySymbol}${rounded.toLocaleString()}`;
  }
  return `${locale.currencySymbol}${raw.toFixed(2)}`;
}

export function formatDistance(milesStr: string, locale: LocaleConfig): string {
  const miles = parseFloat(milesStr);
  if (isNaN(miles)) return milesStr;
  if (locale.distanceUnit === 'km') {
    return `${(miles * 1.609).toFixed(1)} km`;
  }
  return milesStr;
}

// Hyperlocal cuisine relevance — higher score = show first in country
const CUISINE_PRIORITY: Record<string, string[]> = {
  IN: ['biryani', 'south indian', 'mughlai', 'north indian', 'indian', 'momos', 'street food', 'chinese', 'fast food', 'desserts', 'coffee'],
  JP: ['japanese', 'sushi', 'asian', 'chinese', 'healthy'],
  GB: ['indian', 'chinese', 'italian', 'american', 'desserts', 'coffee'],
  AU: ['healthy', 'sushi', 'asian', 'italian', 'coffee', 'american'],
  CA: ['healthy', 'american', 'asian', 'italian', 'coffee'],
  SG: ['chinese', 'asian', 'sushi', 'indian', 'american'],
  AE: ['indian', 'chinese', 'american', 'fast food', 'coffee'],
  KR: ['chinese', 'asian', 'sushi', 'fast food'],
  TH: ['asian', 'chinese', 'sushi', 'healthy'],
  ID: ['asian', 'chinese', 'fast food', 'american'],
  PH: ['fast food', 'asian', 'chinese', 'american'],
};

export function getCuisineRelevance(cuisine: string, countryCode: string): number {
  const priority = CUISINE_PRIORITY[countryCode];
  if (!priority) return 0;
  const c = cuisine.toLowerCase();
  const idx = priority.findIndex((w) => c.includes(w));
  return idx === -1 ? 0 : priority.length - idx;
}
