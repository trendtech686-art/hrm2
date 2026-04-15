/**
 * Hook tối ưu cho public tracking page
 * Lấy dữ liệu thông qua server-side public API (no auth required)
 */

import { useEffect, useMemo, useState } from 'react';
import type { PublicWarrantyResponse } from '../public-warranty-api';
import { logError } from '@/lib/logger'

type TrackingError = 'MISSING_TRACKING_CODE' | 'NOT_FOUND' | 'UNKNOWN' | null;

interface TrackingState {
  data: PublicWarrantyResponse | null;
  loading: boolean;
  error: TrackingError;
}

/**
 * Fetch warranty tracking data from server-side public API
 * No authentication required
 */
async function fetchPublicWarrantyTracking(trackingCode: string): Promise<PublicWarrantyResponse | null> {
  const res = await fetch(`/api/public/warranty-tracking?code=${encodeURIComponent(trackingCode)}`);
  if (res.status === 404) return null;
  if (res.status === 403) return null;
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return data as PublicWarrantyResponse;
}

export function usePublicTracking(trackingCode: string | undefined) {
  const [state, setState] = useState<TrackingState>({
    data: null,
    loading: Boolean(trackingCode),
    error: trackingCode ? null : 'MISSING_TRACKING_CODE',
  });

  useEffect(() => {
    if (!trackingCode) {
      setState({ data: null, loading: false, error: 'MISSING_TRACKING_CODE' });
      return;
    }

    let cancelled = false;
    setState(prev => ({ ...prev, loading: true, error: null }));

    fetchPublicWarrantyTracking(trackingCode)
      .then(response => {
        if (cancelled) return;
        if (!response) {
          setState({ data: null, loading: false, error: 'NOT_FOUND' });
          return;
        }
        setState({ data: response, loading: false, error: null });
      })
      .catch(error => {
        logError('[usePublicTracking] Failed to fetch data', error);
        if (!cancelled) {
          setState({ data: null, loading: false, error: 'UNKNOWN' });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [trackingCode]);

  return useMemo(() => ({
    ticket: state.data?.ticket ?? null,
    comments: state.data?.comments ?? [],
    payments: state.data?.payments ?? [],
    receipts: state.data?.receipts ?? [],
    orders: state.data?.orders ?? [],
    hotline: state.data?.hotline ?? '',
    settings: state.data?.settings ?? null,
    loading: state.loading,
    error: state.error,
  }), [state]);
}
