/**
 * Hook tối ưu cho public tracking page
 * Lấy dữ liệu thông qua public warranty API để tránh expose toàn bộ stores
 */

import { useEffect, useMemo, useState } from 'react';
import { fetchPublicWarrantyTicket, type PublicWarrantyResponse } from '../public-warranty-api';

type TrackingError = 'MISSING_TRACKING_CODE' | 'NOT_FOUND' | 'UNKNOWN' | null;

interface TrackingState {
  data: PublicWarrantyResponse | null;
  loading: boolean;
  error: TrackingError;
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

    fetchPublicWarrantyTicket(trackingCode)
      .then(response => {
        if (cancelled) return;
        if (!response) {
          setState({ data: null, loading: false, error: 'NOT_FOUND' });
          return;
        }
        setState({ data: response, loading: false, error: null });
      })
      .catch(error => {
        console.error('[usePublicTracking] Failed to fetch data', error);
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
    payments: state.data?.payments ?? [],
    receipts: state.data?.receipts ?? [],
    orders: state.data?.orders ?? [],
    hotline: state.data?.hotline ?? '1900-xxxx',
    loading: state.loading,
    error: state.error,
  }), [state]);
}
