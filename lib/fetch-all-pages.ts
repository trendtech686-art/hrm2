/**
 * Auto-pagination utility
 *
 * Compliant with MODULE-QUALITY-CRITERIA §1.3:
 *   "TUYỆT ĐỐI KHÔNG HARDCODE LIMIT"
 *
 * Pattern: fetch page 1 → discover totalPages → fetch remaining pages in parallel.
 * PAGE_SIZE is a batch size, NOT a cap.
 *
 * @example
 * ```ts
 * // In a useAll* hook:
 * const query = useQuery({
 *   queryKey: [...keys.all, 'all'],
 *   queryFn: () => fetchAllPages((p) => fetchProducts(p)),
 * });
 *
 * // In a fetchAll* API function:
 * export async function fetchAllTaxes(): Promise<Tax[]> {
 *   return fetchAllPages((p) => fetchTaxes(p));
 * }
 * ```
 */

interface PaginatedResult<T> {
  data: T[];
  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  // Some APIs use 'total' at top level (e.g. stock-transfers)
  total?: number;
  pageSize?: number;
}

/**
 * Fetch ALL records from a paginated API endpoint in a single request.
 *
 * Uses limit=0 convention to tell the server to return all records.
 * Falls back to multi-page fetching if the API doesn't support limit=0.
 *
 * @param fetchPage - Function that fetches a single page. Must accept `{ page, limit }`.
 * @returns Flat array of all records.
 */
export async function fetchAllPages<T>(
  fetchPage: (params: { page: number; limit: number }) => Promise<PaginatedResult<T>>,
  _pageSize?: number,
): Promise<T[]> {
  // Use limit=100000 to request all records in a single API call
  // Note: limit=0 is not used because many client-side API functions use
  // `if (filters.limit)` which is falsy for 0, causing the param to be omitted.
  // The server-side parsePagination also treats limit=0 as 100000 internally.
  const result = await fetchPage({ page: 1, limit: 100000 });
  const allRecords = [...result.data];

  // If the API returned paginated results despite limit=0, fetch remaining pages
  const totalPages =
    result.pagination?.totalPages ??
    (result.pagination?.total != null && result.pagination?.limit
      ? Math.ceil(result.pagination.total / result.pagination.limit)
      : 1);

  if (totalPages > 1 && result.pagination?.limit && result.pagination.limit < (result.pagination?.total ?? 0)) {
    const batchSize = result.pagination.limit;
    const remaining = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, i) =>
        fetchPage({ page: i + 2, limit: batchSize }),
      ),
    );
    for (const r of remaining) {
      allRecords.push(...r.data);
    }
  }

  return allRecords;
}
