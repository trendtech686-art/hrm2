import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { asSystemId, type SystemId } from '@/lib/id-types';
import { getCurrentUserSystemId } from '../../contexts/auth-context.tsx';
import { useEmployeeSettingsStore } from '../settings/employees/employee-settings-store.ts';
import type { SalaryComponent, WorkShift } from '../settings/employees/types.ts';

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

type PersistedEmployeeCompState = Pick<EmployeeCompState, 'profiles'>;

const STORAGE_KEY = 'hrm-employee-comp-store';

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
  persist(
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
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState) => {
        if (!persistedState || typeof persistedState !== 'object') {
          return { profiles: {} } as PersistedEmployeeCompState;
        }
        const storedProfiles = (persistedState as PersistedEmployeeCompState).profiles ?? {};
        const sanitizedEntries = Object.entries(storedProfiles).reduce<Record<SystemId, EmployeePayrollProfile>>(
          (acc, [employeeSystemId, profile]) => {
            if (!employeeSystemId || !profile?.employeeSystemId) {
              return acc;
            }
            const normalizedEmployeeId = asSystemId(employeeSystemId);
            const normalizedProfile: EmployeePayrollProfile = {
              ...profile,
              employeeSystemId: asSystemId(profile.employeeSystemId as unknown as string),
              workShiftSystemId: getValidShiftId(profile.workShiftSystemId),
              salaryComponentSystemIds: sanitizeComponentIds(profile.salaryComponentSystemIds),
              createdBy: profile.createdBy ? asSystemId(profile.createdBy as unknown as string) : undefined,
              updatedBy: profile.updatedBy ? asSystemId(profile.updatedBy as unknown as string) : undefined,
            };
            acc[normalizedEmployeeId] = normalizedProfile;
            return acc;
          },
          {}
        );
        return { profiles: sanitizedEntries } as PersistedEmployeeCompState;
      },
    }
  )
);
