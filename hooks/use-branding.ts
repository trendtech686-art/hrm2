/**
 * Hook to fetch and cache branding information (logo, favicon)
 */

import * as React from 'react';
import { logError } from '@/lib/logger'

interface BrandingInfo {
  logoUrl: string | null;
  faviconUrl: string | null;
}

// Cache branding globally so it doesn't refetch on every component mount
// ✅ Exported for lazy access in print handlers (avoids eager hook call)
export let brandingCache: BrandingInfo | null = null;
let brandingPromise: Promise<BrandingInfo> | null = null;
const listeners = new Set<() => void>();

/** Invalidate branding cache — call after logo/favicon upload/delete */
export function invalidateBrandingCache() {
  brandingCache = null;
  brandingPromise = null;
  // Trigger refetch for all active useBranding() hooks
  listeners.forEach(fn => fn());
}

export async function fetchBranding(): Promise<BrandingInfo> {
  try {
    // Use relative URL - Next.js serves API routes from same origin
    const response = await fetch('/api/branding');
    if (!response.ok) {
      throw new Error('Failed to fetch branding');
    }
    const data = await response.json();
    return {
      logoUrl: data.logoUrl || null,
      faviconUrl: data.faviconUrl || null,
    };
  } catch (error) {
    logError('[useBranding] Error fetching branding', error);
    return { logoUrl: null, faviconUrl: null };
  }
}

export function useBranding(): BrandingInfo & { isLoading: boolean } {
  const [branding, setBranding] = React.useState<BrandingInfo>(
    brandingCache || { logoUrl: null, faviconUrl: null }
  );
  const [isLoading, setIsLoading] = React.useState(!brandingCache);
  const [version, setVersion] = React.useState(0);

  // Subscribe to cache invalidation
  React.useEffect(() => {
    const listener = () => setVersion(v => v + 1);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  React.useEffect(() => {
    if (brandingCache) {
      setBranding(brandingCache);
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    if (!brandingPromise) {
      brandingPromise = fetchBranding();
    }

    brandingPromise
      .then((data) => {
        brandingCache = data;
        if (!cancelled) {
          setBranding(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [version]);

  return { ...branding, isLoading };
}

/**
 * Get full logo URL for printing
 */
export function getFullLogoUrl(logoUrl: string | null): string | null {
  if (!logoUrl) return null;
  // If already absolute URL, return as-is
  if (logoUrl.startsWith('http://') || logoUrl.startsWith('https://')) {
    return logoUrl;
  }
  // Otherwise, prepend base URL (use relative URL for same-origin)
  return logoUrl;
}
