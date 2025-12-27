/**
 * Inventory Settings API Layer
 */

import type { ProductType, ProductCategory, Brand } from '@/lib/types/prisma-extended';

const BASE_URL = '/api/settings/inventory';

// Product Types
export async function fetchProductTypes(): Promise<ProductType[]> {
  const res = await fetch(`${BASE_URL}/product-types`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function createProductType(data: Partial<ProductType>): Promise<ProductType> {
  const res = await fetch(`${BASE_URL}/product-types`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
}

export async function updateProductType(systemId: string, data: Partial<ProductType>): Promise<ProductType> {
  const res = await fetch(`${BASE_URL}/product-types/${systemId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}

export async function deleteProductType(systemId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/product-types/${systemId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
}

// Product Categories
export async function fetchProductCategories(): Promise<ProductCategory[]> {
  const res = await fetch('/api/categories?all=true');
  if (!res.ok) throw new Error('Failed to fetch');
  const json = await res.json();
  return json.data || json;
}

export async function createProductCategory(data: Partial<ProductCategory>): Promise<ProductCategory> {
  const res = await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
}

export async function updateProductCategory(systemId: string, data: Partial<ProductCategory>): Promise<ProductCategory> {
  const res = await fetch(`/api/categories/${systemId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}

export async function deleteProductCategory(systemId: string): Promise<void> {
  const res = await fetch(`/api/categories/${systemId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
}

// Brands
export async function fetchBrands(): Promise<Brand[]> {
  const res = await fetch('/api/brands?all=true');
  if (!res.ok) throw new Error('Failed to fetch');
  const json = await res.json();
  return json.data || json;
}

export async function createBrand(data: Partial<Brand>): Promise<Brand> {
  const res = await fetch('/api/brands', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
}

export async function updateBrand(systemId: string, data: Partial<Brand>): Promise<Brand> {
  const res = await fetch(`/api/brands/${systemId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}

export async function deleteBrand(systemId: string): Promise<void> {
  const res = await fetch(`/api/brands/${systemId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
}

// Importers
export async function fetchImporters(): Promise<any[]> {
  const res = await fetch(`${BASE_URL}/importers`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function createImporter(data: any): Promise<any> {
  const res = await fetch(`${BASE_URL}/importers`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
}

export async function updateImporter(systemId: string, data: any): Promise<any> {
  const res = await fetch(`${BASE_URL}/importers/${systemId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}

export async function deleteImporter(systemId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/importers/${systemId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
}
