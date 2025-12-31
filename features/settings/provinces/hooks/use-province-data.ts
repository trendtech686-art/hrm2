/**
 * Hook to ensure province data is loaded before using it.
 * Use this in components that need ward/district data.
 */

'use client';

import { useEffect } from 'react';
import { useProvinceStore } from '../store';

/**
 * Hook that triggers lazy loading of province/ward/district data.
 * Returns loading state and whether data is ready.
 * 
 * @example
 * ```tsx
 * function AddressForm() {
 *   const { isLoading, isReady } = useProvinceData();
 *   
 *   if (isLoading) return <Skeleton />;
 *   
 *   // Now wards and districts are available
 *   const wards = useProvinceStore(s => s.wards);
 * }
 * ```
 */
export function useProvinceData() {
  const { isLoading, isLoaded, loadData } = useProvinceStore();
  
  useEffect(() => {
    if (!isLoaded && !isLoading) {
      loadData();
    }
  }, [isLoaded, isLoading, loadData]);
  
  return {
    isLoading,
    isReady: isLoaded,
  };
}

/**
 * Pre-load province data without blocking render.
 * Call this early (e.g., in layout) to start loading in background.
 */
export function preloadProvinceData() {
  const { isLoaded, loadData } = useProvinceStore.getState();
  if (!isLoaded) {
    loadData();
  }
}
