/**
 * Auto-pagination utility
 *
 * Không dùng `limit=100000` (anti-pattern Next.js / API): luôn phân trang với batch
 * cố định ≤ `API_MAX_PAGE_LIMIT` (`@/lib/pagination-constants`), khớp `parsePagination`.
 *
 * @example
 * ```ts
 * const query = useQuery({
 *   queryKey: [...keys.all, 'all'],
 *   queryFn: () => fetchAllPages((p) => fetchProducts(p)),
 * });
 * ```
 */

import {
  API_MAX_PAGE_LIMIT,
  FETCH_ALL_DEFAULT_PAGE_SIZE,
} from '@/lib/pagination-constants';

/** @deprecated dùng `API_MAX_PAGE_LIMIT` từ `@/lib/pagination-constants` */
export const MAX_API_PAGE_SIZE = API_MAX_PAGE_LIMIT;

export { FETCH_ALL_DEFAULT_PAGE_SIZE } from '@/lib/pagination-constants';

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

const PAGE_FETCH_CONCURRENCY = 5;

async function fetchPageBatches<T>(
  fetchPage: (params: { page: number; limit: number }) => Promise<PaginatedResult<T>>,
  pageNumbers: number[],
  limitPerPage: number,
): Promise<T[]> {
  const out: T[] = [];
  for (let i = 0; i < pageNumbers.length; i += PAGE_FETCH_CONCURRENCY) {
    const chunk = pageNumbers.slice(i, i + PAGE_FETCH_CONCURRENCY);
    const results = await Promise.all(
      chunk.map((page) => fetchPage({ page, limit: limitPerPage })),
    );
    for (const r of results) {
      out.push(...r.data);
    }
  }
  return out;
}

/**
 * Lấy toàn bộ bản ghi từ API phân trang: page 1 → đọc total/totalPages → gọi các trang còn lại theo batch.
 *
 * @param pageSize - Batch size (mặc định FETCH_ALL_DEFAULT_PAGE_SIZE), tối đa API_MAX_PAGE_LIMIT.
 */
export async function fetchAllPages<T>(
  fetchPage: (params: { page: number; limit: number }) => Promise<PaginatedResult<T>>,
  pageSize: number = FETCH_ALL_DEFAULT_PAGE_SIZE,
): Promise<T[]> {
  const limit = Math.min(Math.max(1, pageSize), API_MAX_PAGE_LIMIT);
  const first = await fetchPage({ page: 1, limit });
  const allRecords = [...first.data];

  const totalFromPagination = first.pagination?.total;
  const total = totalFromPagination ?? first.total;
  const perPage = first.pagination?.limit ?? limit;

  const totalPages =
    first.pagination?.totalPages ??
    (total != null && perPage > 0 ? Math.ceil(total / perPage) : 1);

  if (totalPages <= 1) {
    return allRecords;
  }

  const restPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
  const rest = await fetchPageBatches(fetchPage, restPages, perPage);
  allRecords.push(...rest);

  return allRecords;
}
