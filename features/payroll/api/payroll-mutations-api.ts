/**
 * Payroll Mutations API
 * Extended API endpoints for complex payroll operations
 */

import type { PayrollBatch, Payslip, PayrollComponentEntry, PayrollTotals } from '@/lib/payroll-types';

// ============== Extended Batch Operations ==============

export interface CreateBatchWithPayslipsInput {
  title: string;
  templateSystemId?: string;
  month: number;
  year: number;
  payrollDate: string;
  referenceAttendanceMonthKeys?: string[];
  notes?: string;
  generatedPayslips: Array<{
    employeeSystemId: string;
    employeeId: string;
    departmentSystemId?: string;
    periodMonthKey: string;
    components: PayrollComponentEntry[];
    totals: PayrollTotals;
    attendanceSnapshotSystemId?: string;
    deductedPenaltySystemIds?: string[];
  }>;
}

export interface CreateBatchWithPayslipsResponse {
  batch: PayrollBatch;
  payslips: Payslip[];
  message: string;
}

/**
 * Create batch with results - Single server operation that:
 * 1. Creates batch
 * 2. Creates all payslips
 * 3. Updates penalties as deducted
 * 4. Creates audit log entries
 */
export async function createBatchWithPayslips(
  data: CreateBatchWithPayslipsInput
): Promise<CreateBatchWithPayslipsResponse> {
  const response = await fetch('/api/payroll/batch-with-results', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to create payroll batch with results');
  }

  return response.json();
}

// ============== Status Updates ==============

export interface UpdateBatchStatusInput {
  status: 'draft' | 'reviewed' | 'locked' | 'cancelled';
  note?: string;
}

/**
 * Update batch status with state machine validation
 * Server validates transitions and locks attendance months if needed
 */
export async function updateBatchStatus(
  systemId: string,
  data: UpdateBatchStatusInput
): Promise<PayrollBatch> {
  const response = await fetch(`/api/payroll/${systemId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to update batch status');
  }

  return response.json();
}

// ============== Payslip Updates ==============

export interface UpdatePayslipInput {
  components?: PayrollComponentEntry[];
  totals?: PayrollTotals;
}

/**
 * Update payslip with audit logging
 */
export async function updatePayslipWithAudit(
  systemId: string,
  data: UpdatePayslipInput
): Promise<{ payslip: Payslip; batch: PayrollBatch }> {
  const response = await fetch(`/api/payroll/payslips/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to update payslip');
  }

  return response.json();
}

/**
 * Remove payslip from batch
 */
export async function removePayslipFromBatch(
  payslipSystemId: string
): Promise<{ success: boolean; batch: PayrollBatch }> {
  const response = await fetch(`/api/payroll/payslips/${payslipSystemId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to remove payslip');
  }

  return response.json();
}

// ============== Cancel Operations ==============

export interface CancelBatchInput {
  reason?: string;
}

/**
 * Cancel batch - Rollbacks payments and penalties
 */
export async function cancelBatch(
  systemId: string,
  data: CancelBatchInput = {}
): Promise<{
  batch: PayrollBatch;
  cancelledPayments: string[];
  rolledBackPenalties: string[];
}> {
  const response = await fetch(`/api/payroll/${systemId}/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to cancel batch');
  }

  return response.json();
}

// ============== Template Operations ==============

/**
 * Ensure default template exists
 */
export async function ensureDefaultTemplate(): Promise<{ systemId: string; name: string }> {
  const response = await fetch('/api/payroll/templates/ensure-default', {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to ensure default template');
  }

  return response.json();
}

/**
 * Set template as default
 */
export async function setDefaultTemplate(systemId: string): Promise<void> {
  const response = await fetch(`/api/payroll/templates/${systemId}/set-default`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Failed to set default template');
  }
}
