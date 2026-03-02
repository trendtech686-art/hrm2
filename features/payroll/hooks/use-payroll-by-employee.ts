/**
 * Hook: usePayrollByEmployee
 * 
 * Server-side filtered hook for employee payroll history.
 * Replaces Zustand store's client-side filtering pattern:
 *   ❌ payrollPayslips.filter(slip => slip.employeeSystemId === id)
 *   ✅ GET /api/payroll/employee-history?employeeId=X
 * 
 * Used in: Employee detail page (payroll history tab)
 */

import { useQuery } from '@tanstack/react-query';
import { payslipKeys } from './use-payroll';

// ============== Types ==============

export interface EmployeePayrollHistoryItem {
  systemId: string;
  batchSystemId: string;
  batchId: string;
  monthKey: string;
  payrollDate: string;
  status: 'draft' | 'reviewed' | 'locked' | 'cancelled';
  // Financial
  baseSalary: number;
  otPay: number;
  allowances: number;
  bonus: number;
  grossSalary: number;
  socialInsurance: number;
  healthInsurance: number;
  unemploymentIns: number;
  tax: number;
  otherDeductions: number;
  totalDeductions: number;
  netSalary: number;
  // Work data
  workDays: number;
  otHours: number;
  leaveDays: number;
  // Metadata
  notes: string | null;
  employeeName: string;
  employeeCode: string;
}

// ============== API ==============

async function fetchEmployeePayrollHistory(
  employeeId: string
): Promise<EmployeePayrollHistoryItem[]> {
  const response = await fetch(
    `/api/payroll/employee-history?employeeId=${encodeURIComponent(employeeId)}`,
    { credentials: 'include' }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch employee payroll history');
  }

  const json = await response.json();
  // apiSuccess() returns data directly, or wrapped in { data } for paginated
  const data: EmployeePayrollHistoryItem[] = json.data ?? json;
  return data;
}

// ============== Hook ==============

/**
 * Fetch payroll history for a specific employee (server-side filtered).
 * Returns payslip items with batch info, sorted by date descending.
 * 
 * @example
 * ```tsx
 * const { data: payrollHistory, isLoading } = usePayrollByEmployee(employee.systemId);
 * // Returns: [{ systemId, grossSalary, netSalary, monthKey, status, ... }, ...]
 * ```
 */
export function usePayrollByEmployee(employeeId: string | undefined) {
  return useQuery({
    queryKey: [...payslipKeys.all, 'employee-history', employeeId],
    queryFn: () => fetchEmployeePayrollHistory(employeeId!),
    enabled: !!employeeId,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
