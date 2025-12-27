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
  
  const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchCategory(systemId: string): Promise<Category> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch category: ${response.statusText}`);
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
    throw new Error(error.message || 'Failed to create category');
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
    throw new Error(error.message || 'Failed to update category');
  }
  
  return response.json();
}

export async function deleteCategory(systemId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete category: ${response.statusText}`);
  }
}

export async function fetchCategoryTree(): Promise<Category[]> {
  const response = await fetch(`${BASE_URL}/tree`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch category tree: ${response.statusText}`);
  }
  
  return response.json();
}

export type { Category };
