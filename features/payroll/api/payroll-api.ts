/**
 * Payroll API Layer
 * Handles all payroll-related API calls (batches, payslips, templates)
 */

import type { PayrollBatch, Payslip } from '@/lib/payroll-types';

// ============== Types ==============

export interface PayrollFilters {
  page?: number;
  limit?: number;
  month?: number;
  year?: number;
  status?: string;
  employeeId?: string;
}

export interface PayrollResponse {
  data: PayrollBatch[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PayrollCreateInput {
  title: string;
  month: number;
  year: number;
  payrollDate?: string;
  notes?: string;
  templateSystemId?: string;
}

export interface PayrollUpdateInput extends Partial<PayrollCreateInput> {
  status?: string;
}

export interface PayslipFilters {
  page?: number;
  limit?: number;
  batchId?: string;
  employeeId?: string;
}

export interface PayslipResponse {
  data: Payslip[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PayslipCreateInput {
  batchId: string;
  employeeId: string;
  baseSalary: number;
  allowances?: Record<string, number>;
  deductions?: Record<string, number>;
  notes?: string;
}

export interface PayslipUpdateInput extends Partial<PayslipCreateInput> {}

export interface PayrollTemplateFilters {
  page?: number;
  limit?: number;
  isActive?: boolean;
}

export interface PayrollTemplate {
  systemId: string;
  id: string;
  name: string;
  description?: string;
  code?: string;
  componentSystemIds: string[];
  components?: Record<string, any>;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============== Batch API ==============

const BATCH_URL = '/api/payroll';

/**
 * Fetch payroll batches with filters
 */
export async function fetchPayrolls(
  filters: PayrollFilters = {}
): Promise<PayrollResponse> {
  const params = new URLSearchParams();
  
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.month) params.set('month', String(filters.month));
  if (filters.year) params.set('year', String(filters.year));
  if (filters.status) params.set('status', filters.status);
  if (filters.employeeId) params.set('employeeId', filters.employeeId);

  const url = params.toString() ? `${BATCH_URL}?${params}` : BATCH_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch payroll batches');
  }
  
  return response.json();
}

/**
 * Fetch single payroll batch by ID
 */
export async function fetchPayrollById(
  systemId: string
): Promise<PayrollBatch> {
  const response = await fetch(`${BATCH_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch payroll batch');
  }
  
  return response.json();
}

/**
 * Create new payroll batch
 */
export async function createPayroll(
  data: PayrollCreateInput
): Promise<PayrollBatch> {
  const response = await fetch(BATCH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to create payroll batch');
  }
  
  return response.json();
}

/**
 * Update payroll batch
 */
export async function updatePayroll(
  systemId: string,
  data: PayrollUpdateInput
): Promise<PayrollBatch> {
  const response = await fetch(`${BATCH_URL}/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to update payroll batch');
  }
  
  return response.json();
}

/**
 * Lock payroll batch (finalize)
 */
export async function lockPayroll(systemId: string): Promise<PayrollBatch> {
  return updatePayroll(systemId, { status: 'locked' });
}

/**
 * Cancel payroll batch
 */
export async function cancelPayroll(systemId: string): Promise<PayrollBatch> {
  return updatePayroll(systemId, { status: 'cancelled' });
}

/**
 * Delete payroll batch
 */
export async function deletePayroll(systemId: string): Promise<void> {
  const response = await fetch(`${BATCH_URL}/${systemId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete payroll batch');
  }
}

// ============== Payslip API ==============

const PAYSLIP_URL = '/api/payroll/payslips';

/**
 * Fetch payslips with filters
 */
export async function fetchPayslips(
  filters: PayslipFilters = {}
): Promise<PayslipResponse> {
  const params = new URLSearchParams();
  
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.batchId) params.set('batchId', filters.batchId);
  if (filters.employeeId) params.set('employeeId', filters.employeeId);

  const url = params.toString() ? `${PAYSLIP_URL}?${params}` : PAYSLIP_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch payslips');
  }
  
  return response.json();
}

/**
 * Fetch single payslip by ID
 */
export async function fetchPayslipById(
  systemId: string
): Promise<Payslip> {
  const response = await fetch(`${PAYSLIP_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch payslip');
  }
  
  return response.json();
}

/**
 * Create payslip
 */
export async function createPayslip(
  data: PayslipCreateInput
): Promise<Payslip> {
  const response = await fetch(PAYSLIP_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to create payslip');
  }
  
  return response.json();
}

/**
 * Update payslip
 */
export async function updatePayslip(
  systemId: string,
  data: PayslipUpdateInput
): Promise<Payslip> {
  const response = await fetch(`${PAYSLIP_URL}/${systemId}`, {
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
 * Delete payslip
 */
export async function deletePayslip(systemId: string): Promise<void> {
  const response = await fetch(`${PAYSLIP_URL}/${systemId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete payslip');
  }
}

// ============== Template API ==============

const TEMPLATE_URL = '/api/payroll/templates';

/**
 * Fetch payroll templates
 */
export async function fetchPayrollTemplates(
  filters: PayrollTemplateFilters = {}
): Promise<{ data: PayrollTemplate[] }> {
  const params = new URLSearchParams();
  
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.isActive !== undefined) params.set('isActive', String(filters.isActive));

  const url = params.toString() ? `${TEMPLATE_URL}?${params}` : TEMPLATE_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch payroll templates');
  }
  
  return response.json();
}

/**
 * Fetch single template by ID
 */
export async function fetchPayrollTemplateById(
  systemId: string
): Promise<PayrollTemplate> {
  const response = await fetch(`${TEMPLATE_URL}/${systemId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch payroll template');
  }
  
  return response.json();
}

/**
 * Create payroll template
 */
export async function createPayrollTemplate(
  data: Omit<PayrollTemplate, 'systemId' | 'createdAt' | 'updatedAt'>
): Promise<PayrollTemplate> {
  const response = await fetch(TEMPLATE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to create payroll template');
  }
  
  return response.json();
}

/**
 * Update payroll template
 */
export async function updatePayrollTemplate(
  systemId: string,
  data: Partial<PayrollTemplate>
): Promise<PayrollTemplate> {
  const response = await fetch(`${TEMPLATE_URL}/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to update payroll template');
  }
  
  return response.json();
}

/**
 * Delete payroll template
 */
export async function deletePayrollTemplate(systemId: string): Promise<void> {
  const response = await fetch(`${TEMPLATE_URL}/${systemId}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete payroll template');
  }
}
