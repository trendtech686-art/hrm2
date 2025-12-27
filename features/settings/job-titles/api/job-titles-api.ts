/**
 * Job Titles API functions
 * 
 * ⚠️ Direct import: import { fetchJobTitles } from '@/features/settings/job-titles/api/job-titles-api'
 */

import type { JobTitle } from '@/lib/types/prisma-extended';

const BASE_URL = '/api/job-titles';

export interface JobTitlesParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface JobTitlesResponse {
  data: JobTitle[];
  total: number;
  page: number;
  pageSize: number;
}

export async function fetchJobTitles(params: JobTitlesParams = {}): Promise<JobTitlesResponse> {
  const searchParams = new URLSearchParams();
  
  if (params.page) searchParams.set('page', String(params.page));
  if (params.limit) searchParams.set('limit', String(params.limit));
  if (params.search) searchParams.set('search', params.search);
  if (params.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params.sortOrder) searchParams.set('sortOrder', params.sortOrder);
  
  const url = searchParams.toString() ? `${BASE_URL}?${searchParams}` : BASE_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch job titles: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchJobTitle(systemId: string): Promise<JobTitle> {
  const response = await fetch(`${BASE_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch job title: ${response.statusText}`);
  }
  
  return response.json();
}

export async function createJobTitle(data: Omit<JobTitle, 'systemId' | 'createdAt' | 'updatedAt'>): Promise<JobTitle> {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to create job title');
  }
  
  return response.json();
}

export async function updateJobTitle(systemId: string, data: Partial<JobTitle>): Promise<JobTitle> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to update job title');
  }
  
  return response.json();
}

export async function deleteJobTitle(systemId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${systemId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete job title: ${response.statusText}`);
  }
}

export type { JobTitle };
