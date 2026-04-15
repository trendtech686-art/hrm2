/**
 * Hook to initialize integration settings from database
 * Should be called once after user authentication
 * 
 * @deprecated This hook is deprecated. Integration settings are now loaded
 * via React Query hooks when components mount. No need for manual initialization.
 *
 * React Query hooks:
 * - usePkgxSettings() from @/features/settings/pkgx/hooks/use-pkgx-settings
 * - useTrendtechSettings() from @/features/settings/trendtech/hooks/use-trendtech-settings
 */

'use client';

import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/auth-context';

export function useInitIntegrationSettings() {
  const { user } = useAuth();
  const isInitialized = useRef(false);

  useEffect(() => {
    // This hook is now a no-op. Settings are loaded via React Query when needed.
    if (user?.systemId && !isInitialized.current) {
      isInitialized.current = true;
    }
  }, [user?.systemId]);
}
