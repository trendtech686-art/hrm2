/**
 * useAllReconciliationItems - Fetches all pending COD reconciliation items
 * Uses dedicated /api/reconciliation endpoint instead of loading ALL orders
 * Auto-pagination: fetches all pages automatically
 */

import { useQuery } from '@tanstack/react-query';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { reconciliationKeys } from './use-reconciliation';

export interface ReconciliationItemFromAPI {
  systemId: string;
  id: string;
  orderId: string;
  orderSystemId: string;
  customerName: string;
  trackingCode: string;
  carrier: string;
  service: string;
  codAmount: number;
  shippingFeeToPartner: number;
  payer: string;
  reconciliationStatus: string;
  deliveryStatus: string;
  deliveredDate: string;
  status: string;
  printStatus: string;
  requestDate: string;
  confirmDate: string;
  requestingEmployeeName: string;
  confirmingEmployeeName: string;
  createdAt: string;
}

interface ReconciliationListResponse {
  data: ReconciliationItemFromAPI[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

async function fetchReconciliationItems(
  params: { page?: number; limit?: number; search?: string } = {}
): Promise<ReconciliationListResponse> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);

  const url = searchParams.toString()
    ? `/api/reconciliation?${searchParams}`
    : '/api/reconciliation';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch reconciliation items');
  return res.json();
}

export function useAllReconciliationItems() {
  const query = useQuery({
    queryKey: [...reconciliationKeys.all, 'all-items'],
    queryFn: () =>
      fetchAllPages<ReconciliationItemFromAPI>((p) => fetchReconciliationItems(p)),
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
  return {
    data: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
