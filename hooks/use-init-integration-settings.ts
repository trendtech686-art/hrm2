/**
 * Hook to initialize integration settings from database
 * Should be called once after user authentication
 */

'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { loadPkgxSettingsFromDatabase } from '@/features/settings/pkgx/store';
import { loadTrendtechSettingsFromDatabase } from '@/features/settings/trendtech/store';
import { loadAppearanceFromDatabase } from '@/features/settings/appearance/store';

export function useInitIntegrationSettings() {
  const { user } = useAuth();
  const isInitialized = useRef(false);

  useEffect(() => {
    // Only init once when user is authenticated
    if (user?.systemId && !isInitialized.current) {
      isInitialized.current = true;
      
      // Load all settings from database in parallel
      Promise.all([
        loadPkgxSettingsFromDatabase(),
        loadTrendtechSettingsFromDatabase(),
        loadAppearanceFromDatabase(),
      ]).catch((error) => {
        console.error('[Settings] Error loading integration settings:', error);
      });
    }
  }, [user?.systemId]);
}
