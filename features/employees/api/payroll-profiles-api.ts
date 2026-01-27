/**
 * API functions for employee payroll profiles
 */

import type { SystemId } from '@/lib/id-types';
import { asSystemId } from '@/lib/id-types';
import type { EmployeePayrollProfile, EmployeePayrollProfileInput } from '../employee-comp-store';

const API_BASE = '/api/employee-payroll-profiles';

/**
 * Fetch all payroll profiles
 */
export async function fetchPayrollProfiles(): Promise<EmployeePayrollProfile[]> {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    throw new Error('Failed to fetch payroll profiles');
  }
  const data = await response.json();
  return (data.data || []).map((profile: EmployeePayrollProfile) => ({
    ...profile,
    employeeSystemId: asSystemId(profile.employeeSystemId),
  }));
}

/**
 * Fetch payroll profile for a specific employee
 */
export async function fetchPayrollProfile(
  employeeSystemId: SystemId
): Promise<EmployeePayrollProfile | null> {
  const response = await fetch(`${API_BASE}?employeeSystemId=${employeeSystemId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch payroll profile');
  }
  const data = await response.json();
  const profiles = data.data || [];
  return profiles[0] || null;
}

/**
 * Create or update payroll profile
 */
export async function upsertPayrollProfile(
  employeeSystemId: SystemId,
  input: EmployeePayrollProfileInput
): Promise<EmployeePayrollProfile> {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      employeeSystemId,
      ...input,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create/update payroll profile');
  }

  const data = await response.json();
  return {
    ...data.data,
    employeeSystemId: asSystemId(data.data.employeeSystemId),
  };
}

/**
 * Update payroll profile (partial update)
 */
export async function updatePayrollProfile(
  employeeSystemId: SystemId,
  input: Partial<EmployeePayrollProfileInput>
): Promise<EmployeePayrollProfile> {
  const response = await fetch(`${API_BASE}/${employeeSystemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error('Failed to update payroll profile');
  }

  const data = await response.json();
  return {
    ...data.data,
    employeeSystemId: asSystemId(data.data.employeeSystemId),
  };
}

/**
 * Delete payroll profile
 */
export async function deletePayrollProfile(employeeSystemId: SystemId): Promise<void> {
  const response = await fetch(`${API_BASE}/${employeeSystemId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete payroll profile');
  }
}
