/**
 * Products API - Isolated API functions
 * 
 * ⚠️ IMPORTANT: This file should ONLY contain:
 * - Fetch functions
 * - Type imports from ../types
 * - NO store imports
 * - NO cross-feature imports
 */

import type { Product } from '../types';

const API_BASE = '/api/products';

export interface ProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  brandId?: string;
  status?: string;
  type?: string;
  inStock?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateProductInput {
  id?: string;  // Business ID (auto-generated if not provided)
  name: string;
  sku?: string;
  barcode?: string;
  categoryId?: string;
  brandId?: string;
  sellingPrice: number;
  costPrice?: number;
  description?: string;
  images?: string[];
  // Optional fields 
  type?: string;
  productTypeSystemId?: string;
  unit?: string;
  prices?: Record<string, number>;
  pkgxId?: number | undefined;
  status?: string;
  inventoryByBranch?: Record<string, number>;
  committedByBranch?: Record<string, number>;
  inTransitByBranch?: Record<string, number>;
  isDeleted?: boolean;
  updatedAt?: string;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  systemId: string;
  // Legacy field for backward compatibility
  stockQuantity?: number;
}

/**
 * Fetch paginated products list
 */
export async function fetchProducts(params: ProductsParams = {}): Promise<PaginatedResponse<Product>> {
  const { page = 1, limit = 50, ...rest } = params;
  
  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  
  // Add optional params
  Object.entries(rest).forEach(([key, value]) => {
    if (value != null && value !== '') {
      searchParams.set(key, String(value));
    }
  });
  
  const res = await fetch(`${API_BASE}?${searchParams}`, {
    credentials: 'include',
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Fetch single product by ID
 */
export async function fetchProduct(id: string): Promise<Product> {
  const res = await fetch(`${API_BASE}/${id}`, {
    credentials: 'include',
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch product ${id}: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Create new product
 */
export async function createProduct(data: CreateProductInput): Promise<Product> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Failed to create product: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Update existing product
 */
export async function updateProduct({ systemId, ...data }: UpdateProductInput): Promise<Product> {
  const res = await fetch(`${API_BASE}/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Failed to update product: ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Delete product (soft delete)
 */
export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `Failed to delete product: ${res.statusText}`);
  }
}

/**
 * Search products for autocomplete
 */
export async function searchProducts(query: string, limit = 20): Promise<Product[]> {
  const res = await fetch(`${API_BASE}?search=${encodeURIComponent(query)}&limit=${limit}`, {
    credentials: 'include',
  });
  
  if (!res.ok) {
    throw new Error(`Failed to search products: ${res.statusText}`);
  }
  
  const json = await res.json();
  return json.data || [];
}

/**
 * Fetch product inventory by branch
 */
export async function fetchProductInventory(productId: string): Promise<Record<string, number>> {
  const res = await fetch(`${API_BASE}/${productId}/inventory`, {
    credentials: 'include',
  });
  
  if (!res.ok) {
    throw new Error(`Failed to fetch product inventory: ${res.statusText}`);
  }
  
  return res.json();
}
