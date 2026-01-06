/**
 * Categories API Client
 * Provides functions to interact with /api/categories endpoint
 */

import type { Category } from '@/generated/prisma/client';

export interface CategoriesParams {
  page?: number;
  limit?: number;
  search?: string;
  all?: boolean;
  tree?: boolean;
}

export interface CategoriesResponse {
  data: Category[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CategoryCreateInput {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  thumbnail?: string;
  parentId?: string;
  sortOrder?: number;
}

export interface CategoryUpdateInput {
  name?: string;
  description?: string;
  imageUrl?: string;
  thumbnail?: string;
  parentId?: string | null;
  sortOrder?: number;
  isActive?: boolean;
}

const API_BASE = '/api/categories';

export async function fetchCategories(params: CategoriesParams = {}): Promise<CategoriesResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  if (params.all) searchParams.set('all', 'true');
  if (params.tree) searchParams.set('tree', 'true');

  const url = searchParams.toString() ? `${API_BASE}?${searchParams}` : API_BASE;
  const response = await fetch(url, { credentials: 'include' });
  
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  
  return response.json();
}

export async function fetchCategory(systemId: string): Promise<Category> {
  const response = await fetch(`${API_BASE}/${systemId}`, { credentials: 'include' });
  
  if (!response.ok) {
    throw new Error('Failed to fetch category');
  }
  
  return response.json();
}

export async function createCategory(data: CategoryCreateInput): Promise<Category> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to create category');
  }
  
  return response.json();
}

export async function updateCategory(systemId: string, data: CategoryUpdateInput): Promise<Category> {
  const response = await fetch(`${API_BASE}/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to update category');
  }
  
  return response.json();
}

export async function deleteCategory(systemId: string): Promise<void> {
  const response = await fetch(`${API_BASE}/${systemId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete category');
  }
}
