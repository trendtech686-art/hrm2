/**
 * Wiki API Layer
 * Handles all wiki article-related API calls
 */

import type { WikiArticle } from '@/lib/types/prisma-extended';

export interface WikiFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  tag?: string;
  author?: string;
}

export interface WikiResponse {
  data: WikiArticle[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface WikiCreateInput {
  systemId?: string;
  id?: string;
  title: string;
  content: string;
  category: string;
  tags?: string[];
  author?: string;
}

export interface WikiUpdateInput extends Partial<WikiCreateInput> {}

const BASE_URL = '/api/wiki';

/**
 * Fetch wiki articles with filters
 */
export async function fetchWikiArticles(
  filters: WikiFilters = {}
): Promise<WikiResponse> {
  const params = new URLSearchParams();
  
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.search) params.set('search', filters.search);
  if (filters.category) params.set('category', filters.category);
  if (filters.tag) params.set('tag', filters.tag);
  if (filters.author) params.set('author', filters.author);

  const url = params.toString() ? `${BASE_URL}?${params}` : BASE_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch wiki articles');
  }
  
  return response.json();
}

/**
 * Fetch single wiki article by ID
 */
export async function fetchWikiById(
  systemId: string
): Promise<WikiArticle> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch wiki article');
  }
  
  return response.json();
}

/**
 * Create new wiki article
 */
export async function createWiki(
  data: WikiCreateInput
): Promise<WikiArticle> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to create wiki article');
  }
  
  return response.json();
}

/**
 * Update wiki article
 */
export async function updateWiki(
  systemId: string,
  data: WikiUpdateInput
): Promise<WikiArticle> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to update wiki article');
  }
  
  return response.json();
}

/**
 * Delete wiki article
 */
export async function deleteWiki(systemId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete wiki article');
  }
}

/**
 * Get all categories
 */
export async function fetchWikiCategories(): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/categories`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch wiki categories');
  }
  
  const data = await response.json();
  return data.categories || [];
}

/**
 * Get all tags
 */
export async function fetchWikiTags(): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/tags`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch wiki tags');
  }
  
  const data = await response.json();
  return data.tags || [];
}

/**
 * Search wiki articles
 */
export async function searchWiki(
  query: string
): Promise<WikiArticle[]> {
  const response = await fetchWikiArticles({ search: query, limit: 20 });
  return response.data;
}
