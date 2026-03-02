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
 * Fetch ALL pages of a paginated API endpoint.
 *
 * @param fetchPage - Function that fetches a single page. Must accept `{ page, limit }`.
 * @param pageSize  - Batch size per request (default 200). This is NOT a data cap.
 * @returns Flat array of all records across all pages.
 */
export async function fetchAllPages<T>(
  fetchPage: (params: { page: number; limit: number }) => Promise<PaginatedResult<T>>,
  pageSize = 200,
): Promise<T[]> {
  const firstPage = await fetchPage({ page: 1, limit: pageSize });
  const allRecords = [...firstPage.data];

  // Discover total pages from whichever format the API returns
  const totalPages =
    firstPage.pagination?.totalPages ??
    (firstPage.pagination?.total != null
      ? Math.ceil(firstPage.pagination.total / pageSize)
      : firstPage.total != null
        ? Math.ceil(firstPage.total / pageSize)
        : 1);

  if (totalPages > 1) {
    const remaining = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, i) =>
        fetchPage({ page: i + 2, limit: pageSize }),
      ),
    );
    for (const result of remaining) {
      allRecords.push(...result.data);
    }
  }

  return allRecords;
}
