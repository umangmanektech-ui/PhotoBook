'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

/** Maps old tab-name strings → real URL paths */
const TAB_TO_PATH: Record<string, string> = {
  home: '/',
  explore: '/explore',
  saved: '/saved',
  bookings: '/bookings',
  profile: '/profile',
  studio: '/studio',
  'studio-bookings': '/studio/bookings',
  'studio-portfolio': '/studio/portfolio',
  'studio-packages': '/studio/packages',
  'studio-profile': '/studio/settings',
  'studio-calendar': '/studio/calendar',
  auth: '/auth',
  login: '/auth',
  register: '/auth/register',
};

/**
 * Drop-in replacement for the old onNavigate(tab, param?) prop pattern.
 * Works with both old tab-name strings AND new path-like strings.
 */
export function useNavigate() {
  const router = useRouter();

  return useCallback(
    (tab: string, param?: string) => {
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Photographer detail — either old 'detail' | 'photographer-detail' style
      if (tab === 'detail' || tab === 'photographer-detail') {
        const id = param || 'user-photographer-arjun';
        router.push(`/photographer/${id}`);
        return;
      }

      // Explore with optional category passed as param
      if (tab === 'explore') {
        const path = param ? `/explore?category=${encodeURIComponent(param)}` : '/explore';
        router.push(path);
        return;
      }

      // Auth with optional role param
      if (tab === 'auth' || tab === 'login') {
        const path = param ? `/auth?role=${param}` : '/auth';
        router.push(path);
        return;
      }

      if (tab === 'register') {
        const path = param ? `/auth/register?role=${param}` : '/auth/register';
        router.push(path);
        return;
      }

      const path = TAB_TO_PATH[tab] ?? `/${tab}`;
      router.push(path);
    },
    [router],
  );
}
