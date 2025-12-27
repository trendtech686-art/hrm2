/**
 * Print Templates API Layer
 */

import type { PrintTemplate, TemplateType, PaperSize } from '@/lib/types/prisma-extended';

const BASE_URL = '/api/settings/print-templates';

export async function fetchPrintTemplates(type?: TemplateType): Promise<PrintTemplate[]> {
  const url = type ? `${BASE_URL}?type=${type}` : BASE_URL;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function fetchPrintTemplateById(id: string): Promise<PrintTemplate> {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function createPrintTemplate(data: Partial<PrintTemplate>): Promise<PrintTemplate> {
  const res = await fetch(BASE_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
}

export async function updatePrintTemplate(id: string, data: Partial<PrintTemplate>): Promise<PrintTemplate> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}

export async function deletePrintTemplate(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
}

export async function duplicatePrintTemplate(id: string): Promise<PrintTemplate> {
  const res = await fetch(`${BASE_URL}/${id}/duplicate`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to duplicate');
  return res.json();
}

export async function resetPrintTemplate(id: string): Promise<PrintTemplate> {
  const res = await fetch(`${BASE_URL}/${id}/reset`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to reset');
  return res.json();
}
