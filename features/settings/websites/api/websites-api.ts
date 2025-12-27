/**
 * Websites Settings API Layer
 */

import type { WebsiteDefinition } from '@/lib/types/prisma-extended';

const BASE_URL = '/api/settings/websites';

export async function fetchWebsites(): Promise<WebsiteDefinition[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function fetchWebsiteByCode(code: string): Promise<WebsiteDefinition> {
  const res = await fetch(`${BASE_URL}/${code}`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function createWebsite(data: Partial<WebsiteDefinition>): Promise<WebsiteDefinition> {
  const res = await fetch(BASE_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
}

export async function updateWebsite(code: string, data: Partial<WebsiteDefinition>): Promise<WebsiteDefinition> {
  const res = await fetch(`${BASE_URL}/${code}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}

export async function deleteWebsite(code: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${code}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
}

export async function fetchActiveWebsites(): Promise<WebsiteDefinition[]> {
  const websites = await fetchWebsites();
  return websites.filter(w => w.isActive);
}
