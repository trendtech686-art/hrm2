'use client';

import * as React from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

/**
 * Custom hook to get and set search params with React Router-like API
 * 
 * Usage:
 * const [searchParams, setSearchParams] = useSearchParamsWithSetter();
 * setSearchParams(new URLSearchParams({ page: '2' }));
 * setSearchParams(prev => { prev.set('page', '2'); return prev; });
 */
export function useSearchParamsWithSetter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const setSearchParams = React.useCallback((
    updater: URLSearchParams | ((prev: URLSearchParams) => URLSearchParams)
  ) => {
    const currentParams = new URLSearchParams(searchParams?.toString() || '');
    const newParams = typeof updater === 'function' ? updater(currentParams) : updater;
    const search = newParams.toString();
    router.push(search ? `${pathname}?${search}` : pathname);
  }, [searchParams, router, pathname]);
  
  return [searchParams, setSearchParams] as const;
}
