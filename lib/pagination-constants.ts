/**
 * Hằng số phân trang dùng chung client + API routes (không import next/server).
 * Đồng bộ `parsePagination`, `fetchAllPages`, và query string `limit`.
 */
export const API_MAX_PAGE_LIMIT = 10_000

/** Batch mặc định khi gom nhiều trang (fetchAllPages). */
export const FETCH_ALL_DEFAULT_PAGE_SIZE = 500
