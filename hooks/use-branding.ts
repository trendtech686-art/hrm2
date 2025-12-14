/**
 * Hook to fetch and cache branding information (logo, favicon)
 */

import * as React from 'react';

const serverUrl = (import.meta as any).env?.VITE_SERVER_URL || 'http://localhost:3001';

interface BrandingInfo {
  logoUrl: string | null;
  faviconUrl: string | null;
}

// Cache branding globally so it doesn't refetch on every component mount
let brandingCache: BrandingInfo | null = null;
let brandingPromise: Promise<BrandingInfo> | null = null;

async function fetchBranding(): Promise<BrandingInfo> {
  try {
    const response = await fetch(`${serverUrl}/api/branding`);
    if (!response.ok) {
      throw new Error('Failed to fetch branding');
    }
    const data = await response.json();
    return {
      logoUrl: data.logoUrl || null,
      faviconUrl: data.faviconUrl || null,
    };
  } catch (error) {
    console.error('[useBranding] Error fetching branding:', error);
    return { logoUrl: null, faviconUrl: null };
  }
}

export function useBranding(): BrandingInfo & { isLoading: boolean } {
  const [branding, setBranding] = React.useState<BrandingInfo>(
    brandingCache || { logoUrl: null, faviconUrl: null }
  );
  const [isLoading, setIsLoading] = React.useState(!brandingCache);

  React.useEffect(() => {
    if (brandingCache) {
      setBranding(brandingCache);
      setIsLoading(false);
      return;
    }

    if (!brandingPromise) {
      brandingPromise = fetchBranding();
    }

    brandingPromise.then((data) => {
      brandingCache = data;
      setBranding(data);
      setIsLoading(false);
    });
  }, []);

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
  // Otherwise, prepend serverUrl
  return `${serverUrl}${logoUrl}`;
}
