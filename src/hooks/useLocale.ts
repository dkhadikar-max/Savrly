import { useApp } from '@/store/AppContext';
import { DEFAULT_LOCALE, formatPrice as fp, formatDistance as fd } from '@/lib/locale';
import type { LocaleConfig } from '@/lib/locale';

export function useLocale() {
  const { state } = useApp();
  const locale: LocaleConfig = state.locale ?? DEFAULT_LOCALE;
  return {
    locale,
    formatPrice: (usd: number) => fp(usd, locale),
    formatDistance: (dist: string) => fd(dist, locale),
  };
}
