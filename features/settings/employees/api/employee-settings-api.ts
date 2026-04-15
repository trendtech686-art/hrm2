/**
 * Employee Settings API Layer
 */

import type { EmployeeSettings, LeaveType, SalaryComponent } from '@/lib/types/prisma-extended';

const BASE_URL = '/api/settings/employees';

// ========================================
// Main Employee Settings (all-in-one JSON)
// ========================================
export async function fetchEmployeeSettings(): Promise<EmployeeSettings | null> {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Failed to fetch employee settings');
  const json = await res.json();
  return json.data ?? null;
}

export async function saveEmployeeSettings(data: EmployeeSettings): Promise<EmployeeSettings> {
  const res = await fetch(BASE_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Failed to save employee settings');
  }
  const json = await res.json();
  return json.data;
}

// NOTE: Work Shifts and Insurance Rates are embedded in main settings JSON blob.
// They are managed via useEmployeeSettings() / saveEmployeeSettings(), not separate APIs.

// Leave Types
export async function fetchLeaveTypes(): Promise<LeaveType[]> {
  const res = await fetch(`${BASE_URL}/leave-types`);
  if (!res.ok) throw new Error('Failed to fetch');
  const json = await res.json();
  return json;
}

export async function createLeaveType(data: Partial<LeaveType>): Promise<LeaveType> {
  const res = await fetch(`${BASE_URL}/leave-types`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
}

export async function updateLeaveType(systemId: string, data: Partial<LeaveType>): Promise<LeaveType> {
  const res = await fetch(`${BASE_URL}/leave-types/${systemId}`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}

export async function deleteLeaveType(systemId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/leave-types/${systemId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
}

// Salary Components
export async function fetchSalaryComponents(): Promise<SalaryComponent[]> {
  const res = await fetch(`${BASE_URL}/salary-components`);
  if (!res.ok) throw new Error('Failed to fetch');
  const json = await res.json();
  return json;
}

export async function createSalaryComponent(data: Partial<SalaryComponent>): Promise<SalaryComponent> {
  const res = await fetch(`${BASE_URL}/salary-components`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create');
  const json = await res.json();
  return json;
}

export async function updateSalaryComponent(systemId: string, data: Partial<SalaryComponent>): Promise<SalaryComponent> {
  const res = await fetch(`${BASE_URL}/salary-components/${systemId}`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update');
  const json = await res.json();
  return json;
}

export async function deleteSalaryComponent(systemId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/salary-components/${systemId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
}
