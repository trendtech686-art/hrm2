import { create } from 'zustand';
import { asSystemId, type SystemId } from '@/lib/id-types';
import { getCurrentUserSystemId } from '../../contexts/auth-context';
import { useEmployeeSettingsStore } from '../settings/employees/employee-settings-store';
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

type EmployeeCompState = {
  profiles: Record<SystemId, EmployeePayrollProfile>;
  assignComponents: (employeeSystemId: SystemId, payload: EmployeePayrollProfileInput) => void;
  removeProfile: (employeeSystemId: SystemId) => void;
  getPayrollProfile: (employeeSystemId: SystemId) => ResolvedPayrollProfile;
};

const getDefaultComponentIds = (): SystemId[] =>
  useEmployeeSettingsStore.getState().getSalaryComponents().map((component) => component.systemId);

const getValidShiftId = (shiftId?: string | SystemId): SystemId | undefined => {
  if (!shiftId) return undefined;
  const normalized = asSystemId(shiftId as string);
  const shiftExists = useEmployeeSettingsStore
    .getState()
    .settings.workShifts.some((shift) => shift.systemId === normalized);
  return shiftExists ? normalized : undefined;
};

const sanitizeComponentIds = (componentIds?: Array<string | SystemId>): SystemId[] => {
  const available = new Set(getDefaultComponentIds());
  if (!componentIds?.length) {
    return Array.from(available);
  }
  return componentIds
    .map((id) => asSystemId(id as string))
    .filter((id) => available.has(id));
};

const buildDefaultProfile = (employeeSystemId: SystemId): ResolvedPayrollProfile => ({
  employeeSystemId,
  workShiftSystemId: undefined,
  salaryComponentSystemIds: getDefaultComponentIds(),
  payrollBankAccount: undefined,
  paymentMethod: 'bank_transfer',
  createdAt: '',
  updatedAt: '',
  usesDefaultComponents: true,
});

export const useEmployeeCompStore = create<EmployeeCompState>()(
    (set, get) => ({
      profiles: {},
      assignComponents: (employeeSystemId, payload) => {
        const now = new Date().toISOString();
        const currentUser = getCurrentUserSystemId();
        const existing = get().profiles[employeeSystemId];
        const salaryComponentSystemIds = sanitizeComponentIds(
          payload.salaryComponentSystemIds ?? existing?.salaryComponentSystemIds
        );

        set(({ profiles }) => ({
          profiles: {
            ...profiles,
            [employeeSystemId]: {
              employeeSystemId,
              workShiftSystemId: getValidShiftId(
                payload.workShiftSystemId ?? existing?.workShiftSystemId
              ),
              salaryComponentSystemIds,
              payrollBankAccount: payload.payrollBankAccount ?? existing?.payrollBankAccount,
              paymentMethod: payload.paymentMethod ?? existing?.paymentMethod ?? 'bank_transfer',
              createdAt: existing?.createdAt ?? now,
              createdBy: existing?.createdBy ?? currentUser,
              updatedAt: now,
              updatedBy: currentUser,
            },
          },
        }));
      },
      removeProfile: (employeeSystemId) => {
        set(({ profiles }) => {
          const nextProfiles = { ...profiles };
          delete nextProfiles[employeeSystemId];
          return { profiles: nextProfiles };
        });
      },
      getPayrollProfile: (employeeSystemId) => {
        const profile = get().profiles[employeeSystemId];
        if (!profile) {
          return buildDefaultProfile(employeeSystemId);
        }
        return {
          ...profile,
          usesDefaultComponents: false,
        };
      },
    })
);
