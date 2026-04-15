/**
 * Categories API functions
 * 
 * ⚠️ Direct import: import { fetchCategories } from '@/features/categories/api/categories-api'
 */

import type { CategoryModel as Category } from '@/generated/prisma/models/Category';

const BASE_URL = '/api/categories';

export interface CategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
  parentId?: string | null;
  includeDeleted?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  all?: boolean;
}

export interface CategoriesResponse {
  data: Category[];
  total: number;
  page: number;
  pageSize: number;
}

export async function fetchCategories(params: CategoriesParams = {}): Promise<CategoriesResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  if (params.parentId !== undefined) searchParams.set('parentId', params.parentId || '');
  if (params.includeDeleted) searchParams.set('includeDeleted', 'true');
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
  if (params.all) searchParams.set('all', 'true');
  
  const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Không thể tải danh sách danh mục: ${response.statusText}`);
  }
  
  const result = await response.json();
  
  // Handle both paginated and all response formats
  if (params.all) {
    return {
      data: result.data || [],
      total: result.data?.length || 0,
      page: 1,
      pageSize: result.data?.length || 0,
    };
  }
  
  return result;
}

export async function fetchCategory(systemId: string): Promise<Category> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error(`Không thể tải danh mục: ${response.statusText}`);
  }
  
  return response.json();
}

export async function createCategory(data: Omit<Category, 'systemId' | 'createdAt' | 'updatedAt'>): Promise<Category> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Không thể tạo danh mục');
  }
  
  return response.json();
}

export async function updateCategory(systemId: string, data: Partial<Category>): Promise<Category> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Không thể cập nhật danh mục');
  }
  
  return response.json();
}

export async function deleteCategory(systemId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Không thể xóa danh mục: ${response.statusText}`);
  }
}

/**
 * Fetch deleted categories (trash)
 */
export async function fetchDeletedCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/deleted`, {
    credentials: 'include',
  });
  
  if (!res.ok) {
    throw new Error(`Không thể tải danh mục đã xóa: ${res.statusText}`);
  }
  
  const json = await res.json();
  return json.data || json;
}

/**
 * Restore deleted category
 */
export async function restoreCategory(systemId: string): Promise<Category> {
  const res = await fetch(`${BASE_URL}/${systemId}/restore`, {
    method: 'POST',
    credentials: 'include',
  });
  
  const json = await res.json();
  
  if (!res.ok) {
    throw new Error(json.error || json.message || `Không thể khôi phục danh mục: ${res.statusText}`);
  }
  
  return json.data || json;
}

/**
 * Permanently delete category
 */
export async function permanentDeleteCategory(systemId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${systemId}/permanent`, {
    method: 'DELETE',
    credentials: 'include',
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || `Không thể xóa vĩnh viễn danh mục: ${res.statusText}`);
  }
}

export async function fetchCategoryTree(): Promise<Category[]> {
  const response = await fetch(`${BASE_URL}/tree`);
  
  if (!response.ok) {
    throw new Error(`Không thể tải cây danh mục: ${response.statusText}`);
  }
  
  return response.json();
}

export type { Category };

// Bulk Operations
// ═══════════════════════════════════════════════════════════════

async function bulkAction(action: string, systemIds: string[]): Promise<{ updatedCount: number }> {
  const res = await fetch(`${BASE_URL}/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ action, systemIds }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || 'Thao tác hàng loạt thất bại');
  }
  return res.json();
}

export function bulkDeleteCategories(systemIds: string[]) {
  return bulkAction('delete', systemIds);
}

export function bulkActivateCategories(systemIds: string[]) {
  return bulkAction('activate', systemIds);
}

export function bulkDeactivateCategories(systemIds: string[]) {
  return bulkAction('deactivate', systemIds);
}
