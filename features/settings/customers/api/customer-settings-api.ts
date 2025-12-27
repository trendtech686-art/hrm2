/**
 * Customer Settings API Layer
 * Handles customer types, groups, sources, payment terms, credit ratings, lifecycle stages
 */

import type {
  CustomerType,
  CustomerGroup,
  CustomerSource,
  PaymentTerm,
  CreditRating,
  LifecycleStage,
  CustomerSlaSetting,
} from '@/lib/types/prisma-extended';

const BASE_URL = '/api/settings/customers';

// ============== Customer Types ==============
export async function fetchCustomerTypes(): Promise<CustomerType[]> {
  const res = await fetch(`${BASE_URL}/types`);
  if (!res.ok) throw new Error('Failed to fetch customer types');
  return res.json();
}

export async function createCustomerType(data: Partial<CustomerType>): Promise<CustomerType> {
  const res = await fetch(`${BASE_URL}/types`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
}

export async function updateCustomerType(systemId: string, data: Partial<CustomerType>): Promise<CustomerType> {
  const res = await fetch(`${BASE_URL}/types/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}

export async function deleteCustomerType(systemId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/types/${systemId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
}

// ============== Customer Groups ==============
export async function fetchCustomerGroups(): Promise<CustomerGroup[]> {
  const res = await fetch(`${BASE_URL}/groups`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function createCustomerGroup(data: Partial<CustomerGroup>): Promise<CustomerGroup> {
  const res = await fetch(`${BASE_URL}/groups`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
}

export async function updateCustomerGroup(systemId: string, data: Partial<CustomerGroup>): Promise<CustomerGroup> {
  const res = await fetch(`${BASE_URL}/groups/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}

export async function deleteCustomerGroup(systemId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/groups/${systemId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
}

// ============== Customer Sources ==============
export async function fetchCustomerSources(): Promise<CustomerSource[]> {
  const res = await fetch(`${BASE_URL}/sources`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function createCustomerSource(data: Partial<CustomerSource>): Promise<CustomerSource> {
  const res = await fetch(`${BASE_URL}/sources`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
}

export async function updateCustomerSource(systemId: string, data: Partial<CustomerSource>): Promise<CustomerSource> {
  const res = await fetch(`${BASE_URL}/sources/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}

export async function deleteCustomerSource(systemId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/sources/${systemId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
}

// ============== Payment Terms ==============
export async function fetchPaymentTerms(): Promise<PaymentTerm[]> {
  const res = await fetch(`${BASE_URL}/payment-terms`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function createPaymentTerm(data: Partial<PaymentTerm>): Promise<PaymentTerm> {
  const res = await fetch(`${BASE_URL}/payment-terms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
}

export async function updatePaymentTerm(systemId: string, data: Partial<PaymentTerm>): Promise<PaymentTerm> {
  const res = await fetch(`${BASE_URL}/payment-terms/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}

export async function deletePaymentTerm(systemId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/payment-terms/${systemId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
}

// ============== Credit Ratings ==============
export async function fetchCreditRatings(): Promise<CreditRating[]> {
  const res = await fetch(`${BASE_URL}/credit-ratings`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function createCreditRating(data: Partial<CreditRating>): Promise<CreditRating> {
  const res = await fetch(`${BASE_URL}/credit-ratings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
}

export async function updateCreditRating(systemId: string, data: Partial<CreditRating>): Promise<CreditRating> {
  const res = await fetch(`${BASE_URL}/credit-ratings/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}

export async function deleteCreditRating(systemId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/credit-ratings/${systemId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
}

// ============== Lifecycle Stages ==============
export async function fetchLifecycleStages(): Promise<LifecycleStage[]> {
  const res = await fetch(`${BASE_URL}/lifecycle-stages`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function createLifecycleStage(data: Partial<LifecycleStage>): Promise<LifecycleStage> {
  const res = await fetch(`${BASE_URL}/lifecycle-stages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
}

export async function updateLifecycleStage(systemId: string, data: Partial<LifecycleStage>): Promise<LifecycleStage> {
  const res = await fetch(`${BASE_URL}/lifecycle-stages/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}

export async function deleteLifecycleStage(systemId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/lifecycle-stages/${systemId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
}

// ============== SLA Settings ==============
export async function fetchCustomerSlaSettings(): Promise<CustomerSlaSetting[]> {
  const res = await fetch(`${BASE_URL}/sla-settings`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function updateCustomerSlaSetting(systemId: string, data: Partial<CustomerSlaSetting>): Promise<CustomerSlaSetting> {
  const res = await fetch(`${BASE_URL}/sla-settings/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}
