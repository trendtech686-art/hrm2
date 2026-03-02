/**
 * useAllCashbookData - Auto-pagination hook for cashbook data
 * Fetches ALL transactions for given filters using batch pagination
 * Use this when you need the complete dataset (reports, exports)
 */

import { useQuery } from '@tanstack/react-query';
import { fetchCashbook, type CashbookParams, type CashbookResponse } from '../api/cashbook-summary-api';
import { cashbookDataKeys } from './use-cashbook-data';

const BATCH_SIZE = 200;

/**
 * Fetches all pages of cashbook data and merges transactions.
 * The cashbook API applies the same skip/take to both receipts and payments,
 * so we need Math.max(totalReceipts, totalPayments) to calculate total pages.
 * Summary data is server-side aggregated and consistent across all pages.
 */
async function fetchAllCashbookPages(params: CashbookParams): Promise<CashbookResponse> {
  // Fetch first page to discover totals
  const firstPage = await fetchCashbook({ ...params, page: 1, limit: BATCH_SIZE });
  const { totalReceipts, totalPayments } = firstPage.pagination;

  // Calculate total pages needed (API paginates receipts + payments separately with same offset)
  const maxTotal = Math.max(totalReceipts, totalPayments);
  const totalPages = Math.ceil(maxTotal / BATCH_SIZE);

  if (totalPages <= 1) return firstPage;

  // Fetch remaining pages in parallel
  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, i) =>
      fetchCashbook({ ...params, page: i + 2, limit: BATCH_SIZE })
    )
  );

  // Merge all transactions, deduplicate by systemId
  const seen = new Set<string>();
  const allTransactions = [firstPage, ...remainingPages]
    .flatMap(r => r.transactions)
    .filter(t => {
      if (seen.has(t.systemId)) return false;
      seen.add(t.systemId);
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Summary is the same across all pages (server-side aggregated for the full date range)
  return {
    transactions: allTransactions,
    summary: firstPage.summary,
    pagination: {
      ...firstPage.pagination,
      page: 1,
      limit: allTransactions.length,
    },
  };
}

export function useAllCashbookData(params: CashbookParams & { enabled?: boolean } = {}) {
  const { enabled = true, ...queryParams } = params;

  return useQuery({
    queryKey: [...cashbookDataKeys.all, 'all', queryParams],
    queryFn: () => fetchAllCashbookPages(queryParams),
    staleTime: 30_000,
    gcTime: 5 * 60 * 1000,
    enabled,
  });
}
