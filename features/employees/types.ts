/**
 * Re-export all Employee types from centralized prisma-extended.ts
 * This file exists for backwards compatibility during migration
 */
export {
  type Employee,
  type EmployeeRole,
  type EmployeeAddress,
  type TwoLevelAddress,
  type ThreeLevelAddress,
  type AddressInputLevel,
  isTwoLevelAddress,
  isThreeLevelAddress,
  createEmptyAddress,
} from '@/lib/types/prisma-extended';

import type { SystemId } from '@/lib/id-types';
import type { SalaryComponent, WorkShift } from '../settings/employees/types';

export type PayrollBankAccount = {
  accountNumber?: string | undefined;
  bankName?: string | undefined;
  bankBranch?: string | undefined;
  accountHolder?: string | undefined;
};

export type EmployeePayrollProfile = {
  employeeSystemId: SystemId;
  workShiftSystemId?: WorkShift['systemId'] | undefined;
  salaryComponentSystemIds: SalaryComponent['systemId'][];
  payrollBankAccount?: PayrollBankAccount | undefined;
  paymentMethod: 'bank_transfer' | 'cash';
  createdAt: string;
  createdBy?: SystemId | undefined;
  updatedAt: string;
  updatedBy?: SystemId | undefined;
};

export type ResolvedPayrollProfile = EmployeePayrollProfile & {
  usesDefaultComponents: boolean;
};

export type EmployeePayrollProfileInput = {
  workShiftSystemId?: WorkShift['systemId'] | undefined;
  salaryComponentSystemIds?: SalaryComponent['systemId'][] | undefined;
  payrollBankAccount?: PayrollBankAccount | undefined;
  paymentMethod?: EmployeePayrollProfile['paymentMethod'] | undefined;
};
