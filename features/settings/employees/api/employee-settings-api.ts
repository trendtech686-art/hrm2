/**
 * Employee Settings API Layer
 */

import type { WorkShift, LeaveType, SalaryComponent, InsuranceRates, TaxBracket } from '@/lib/types/prisma-extended';

const BASE_URL = '/api/settings/employees';

// Work Shifts
export async function fetchWorkShifts(): Promise<WorkShift[]> {
  const res = await fetch(`${BASE_URL}/work-shifts`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function createWorkShift(data: Partial<WorkShift>): Promise<WorkShift> {
  const res = await fetch(`${BASE_URL}/work-shifts`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
}

export async function updateWorkShift(systemId: string, data: Partial<WorkShift>): Promise<WorkShift> {
  const res = await fetch(`${BASE_URL}/work-shifts/${systemId}`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}

export async function deleteWorkShift(systemId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/work-shifts/${systemId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
}

// Leave Types
export async function fetchLeaveTypes(): Promise<LeaveType[]> {
  const res = await fetch(`${BASE_URL}/leave-types`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
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
  return res.json();
}

export async function createSalaryComponent(data: Partial<SalaryComponent>): Promise<SalaryComponent> {
  const res = await fetch(`${BASE_URL}/salary-components`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create');
  return res.json();
}

export async function updateSalaryComponent(systemId: string, data: Partial<SalaryComponent>): Promise<SalaryComponent> {
  const res = await fetch(`${BASE_URL}/salary-components/${systemId}`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}

export async function deleteSalaryComponent(systemId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/salary-components/${systemId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
}

// Insurance Settings
export async function fetchInsuranceRates(): Promise<InsuranceRates> {
  const res = await fetch(`${BASE_URL}/insurance-rates`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export async function updateInsuranceRates(data: InsuranceRates): Promise<InsuranceRates> {
  const res = await fetch(`${BASE_URL}/insurance-rates`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update');
  return res.json();
}
