import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { EmployeeSettings, LeaveType, SalaryComponent, WorkShift } from './types.ts';
import { getCurrentUserSystemId } from '../../../contexts/auth-context.tsx';
import { generateSystemId, getMaxBusinessIdCounter, getMaxSystemIdCounter, findNextAvailableBusinessId } from '../../../lib/id-utils.ts';
import { getPrefix, type EntityType } from '../../../lib/smart-prefix.ts';
import { getEntityConfig } from '../../../lib/id-config.ts';
import { asBusinessId, asSystemId, type BusinessId, type SystemId } from '@/lib/id-types';

const SETTINGS_ENTITY_MAP = {
  workShifts: 'work-shifts',
  leaveTypes: 'leave-types',
  salaryComponents: 'salary-components',
} as const;

type SettingsEntityKey = keyof typeof SETTINGS_ENTITY_MAP;
type SettingsEntityType = (typeof SETTINGS_ENTITY_MAP)[SettingsEntityKey];

type CounterState = {
  systemId: number;
  businessId: number;
};

type SettingsCounters = Record<SettingsEntityType, CounterState>;

const defaultSettings: EmployeeSettings = {
  workStartTime: '08:30',
  workEndTime: '17:30',
  lunchBreakDuration: 60,
  workingDays: [1, 2, 3, 4, 5],
  workShifts: [
    {
      systemId: asSystemId('WSHIFT000001'),
      id: asBusinessId('CA000001'),
      name: 'Ca hành chính',
      startTime: '08:30',
      endTime: '17:30',
      applicableDepartmentSystemIds: [],
    },
    {
      systemId: asSystemId('WSHIFT000002'),
      id: asBusinessId('CA000002'),
      name: 'Ca tối',
      startTime: '14:00',
      endTime: '22:00',
      applicableDepartmentSystemIds: [],
    },
  ],
  otRateWeekday: 1.5,
  otRateWeekend: 2,
  otRateHoliday: 3,
  allowedLateMinutes: 15,
  latePolicyAction: 'log_violation',
  leaveTypes: [
    {
      systemId: asSystemId('LEAVETYPE000001'),
      id: asBusinessId('LP000001'),
      name: 'Nghỉ phép năm',
      numberOfDays: 12,
      isPaid: true,
      requiresAttachment: false,
      applicableGender: 'All',
      applicableDepartmentSystemIds: [],
    },
    {
      systemId: asSystemId('LEAVETYPE000002'),
      id: asBusinessId('LP000002'),
      name: 'Nghỉ bệnh',
      numberOfDays: 7,
      isPaid: true,
      requiresAttachment: true,
      applicableGender: 'All',
      applicableDepartmentSystemIds: [],
    },
  ],
  baseAnnualLeaveDays: 12,
  annualLeaveSeniorityBonus: {
    years: 5,
    additionalDays: 1,
  },
  allowRollover: false,
  rolloverExpirationDate: '03-31',
  salaryComponents: [
    {
      systemId: asSystemId('SALCOMP000001'),
      id: asBusinessId('SC000001'),
      name: 'Lương cơ bản',
      type: 'fixed',
      amount: 7000000,
      taxable: true,
      partOfSocialInsurance: true,
      applicableDepartmentSystemIds: [],
    },
    {
      systemId: asSystemId('SALCOMP000002'),
      id: asBusinessId('SC000002'),
      name: 'Phụ cấp ăn trưa',
      type: 'fixed',
      amount: 900000,
      taxable: false,
      partOfSocialInsurance: false,
      applicableDepartmentSystemIds: [],
    },
    {
      systemId: asSystemId('SALCOMP000003'),
      id: asBusinessId('SC000003'),
      name: 'Thưởng hiệu suất',
      type: 'formula',
      formula: '[LUONG_CO_BAN] * 0.2',
      taxable: true,
      partOfSocialInsurance: false,
      applicableDepartmentSystemIds: [],
    },
  ],
  payrollCycle: 'monthly',
  payrollStartDate: 1,
  payrollEndDate: 31,
  payday: 5,
  payrollLockDate: 5,
};

type EmployeeSettingsState = {
  settings: EmployeeSettings;
  counters: SettingsCounters;
  setSettings: (settings: EmployeeSettings) => void;
  getShiftBySystemId: (systemId: SystemId) => WorkShift | undefined;
  getLeaveTypes: () => LeaveType[];
  getSalaryComponents: () => SalaryComponent[];
  getDefaultPayrollWindow: () => {
    cycle: EmployeeSettings['payrollCycle'];
    startDate: number;
    endDate: number;
    payday: number;
    lockDate: number;
  };
};

const cloneSettings = (payload?: EmployeeSettings): EmployeeSettings => ({
  ...defaultSettings,
  ...payload,
  annualLeaveSeniorityBonus: {
    ...defaultSettings.annualLeaveSeniorityBonus,
    ...(payload?.annualLeaveSeniorityBonus ?? {}),
  },
  workShifts: (payload?.workShifts ?? defaultSettings.workShifts).map((shift) => ({ ...shift })),
  leaveTypes: (payload?.leaveTypes ?? defaultSettings.leaveTypes).map((type) => ({ ...type })),
  salaryComponents: (payload?.salaryComponents ?? defaultSettings.salaryComponents).map((component) => ({ ...component })),
});

const computeCounter = <T extends { systemId?: SystemId; id?: BusinessId }>(
  items: T[],
  entityType: EntityType
): CounterState => {
  const config = getEntityConfig(entityType);
  const systemItems = items
    .filter((item): item is T & { systemId: SystemId } => Boolean(item.systemId))
    .map(({ systemId }) => ({ systemId }));
  const businessItems = items
    .filter((item): item is T & { id: BusinessId } => Boolean(item.id))
    .map(({ id }) => ({ id }));
  return {
    systemId: getMaxSystemIdCounter(systemItems, config.systemIdPrefix),
    businessId: getMaxBusinessIdCounter(businessItems, getPrefix(entityType)),
  };
};

const buildCounters = (settings: EmployeeSettings): SettingsCounters => ({
  'work-shifts': computeCounter(settings.workShifts, 'work-shifts'),
  'leave-types': computeCounter(settings.leaveTypes, 'leave-types'),
  'salary-components': computeCounter(settings.salaryComponents, 'salary-components'),
});

type BaseSettingsEntity = {
  systemId?: SystemId;
  id?: BusinessId;
  createdAt?: string;
  createdBy?: SystemId;
  updatedAt?: string;
  updatedBy?: SystemId;
  applicableDepartmentSystemIds?: SystemId[];
};

const normalizeCollection = <T extends BaseSettingsEntity>(
  items: T[],
  entityType: SettingsEntityType,
  counters: SettingsCounters,
  currentUser?: SystemId
): { records: T[]; counters: SettingsCounters } => {
  let systemCounter = counters[entityType]?.systemId ?? 0;
  let businessCounter = counters[entityType]?.businessId ?? 0;
  const prefix = getPrefix(entityType);
  const config = getEntityConfig(entityType);
  const allKnownIds = new Set<string>(
    items
      .map((item) => item.id?.toUpperCase())
      .filter((id): id is string => Boolean(id))
  );
  const usedIds = new Set<string>();
  const now = new Date().toISOString();

  const records = items.map((item) => {
    let systemId = item.systemId;
    const hasValidSystemId = Boolean(systemId && systemId.startsWith(config.systemIdPrefix));
    const isNew = !hasValidSystemId;
    if (!hasValidSystemId) {
      systemCounter += 1;
      systemId = asSystemId(generateSystemId(entityType, systemCounter));
    }

    let businessIdString = item.id ? String(item.id).toUpperCase() : undefined;
    const hasValidBusinessId = Boolean(businessIdString && businessIdString.startsWith(prefix));
    if (!hasValidBusinessId || (businessIdString && usedIds.has(businessIdString))) {
      const { nextId, updatedCounter } = findNextAvailableBusinessId(prefix, Array.from(allKnownIds), businessCounter);
      businessIdString = nextId;
      businessCounter = updatedCounter;
    }
    if (!businessIdString) {
      businessCounter += 1;
      businessIdString = `${prefix}${String(businessCounter).padStart(config.digitCount, '0')}`;
    }

    allKnownIds.add(businessIdString);
    usedIds.add(businessIdString);

    const resolvedSystemId = systemId ?? asSystemId(generateSystemId(entityType, systemCounter));
    const resolvedBusinessId = asBusinessId(businessIdString);

    const createdAt = item.createdAt ?? now;
    const createdBy = item.createdBy ?? (isNew && currentUser ? currentUser : item.createdBy);

    return {
      ...item,
      systemId: resolvedSystemId,
      id: resolvedBusinessId,
      applicableDepartmentSystemIds: item.applicableDepartmentSystemIds ?? [],
      createdAt,
      createdBy,
      updatedAt: now,
      updatedBy: currentUser ?? item.updatedBy,
    } as T;
  });

  return {
    records,
    counters: {
      ...counters,
      [entityType]: {
        systemId: systemCounter,
        businessId: businessCounter,
      },
    },
  };
};

const normalizeSettings = (
  incoming: EmployeeSettings,
  counters: SettingsCounters,
  currentUser?: SystemId
): { settings: EmployeeSettings; counters: SettingsCounters } => {
  let nextCounters = { ...counters };
  const normalizedShifts = normalizeCollection(incoming.workShifts, 'work-shifts', nextCounters, currentUser);
  nextCounters = normalizedShifts.counters;
  const normalizedLeaves = normalizeCollection(incoming.leaveTypes, 'leave-types', nextCounters, currentUser);
  nextCounters = normalizedLeaves.counters;
  const normalizedComponents = normalizeCollection(incoming.salaryComponents, 'salary-components', nextCounters, currentUser);

  return {
    settings: {
      ...incoming,
      workShifts: normalizedShifts.records,
      leaveTypes: normalizedLeaves.records,
      salaryComponents: normalizedComponents.records,
    },
    counters: normalizedComponents.counters,
  };
};

const buildInitialState = () => {
  const cloned = cloneSettings(defaultSettings);
  const counters = buildCounters(cloned);
  return normalizeSettings(cloned, counters);
};

const initialState = buildInitialState();

export const useEmployeeSettingsStore = create<EmployeeSettingsState>()(
  persist(
    (set, get) => ({
      settings: initialState.settings,
      counters: initialState.counters,
      setSettings: (payload) => {
        const cloned = cloneSettings(payload);
        const currentUser = getCurrentUserSystemId();
        const normalized = normalizeSettings(
          cloned,
          get().counters,
          currentUser ? asSystemId(currentUser) : undefined
        );
        set(normalized);
      },
      getShiftBySystemId: (systemId) => get().settings.workShifts.find((shift) => shift.systemId === systemId),
      getLeaveTypes: () => get().settings.leaveTypes,
      getSalaryComponents: () => get().settings.salaryComponents,
      getDefaultPayrollWindow: () => {
        const current = get().settings;
        return {
          cycle: current.payrollCycle,
          startDate: current.payrollStartDate,
          endDate: current.payrollEndDate,
          payday: current.payday,
          lockDate: current.payrollLockDate,
        };
      },
    }),
    {
      name: 'hrm-employee-settings-storage',
      storage: createJSONStorage(() => localStorage),
      version: 2,
      migrate: (persistedState) => {
        if (!persistedState || !(persistedState as Partial<EmployeeSettingsState>).settings) {
          return initialState;
        }
        const persistedSettings = (persistedState as Partial<EmployeeSettingsState>).settings;
        const cloned = cloneSettings(persistedSettings);
        const counters = buildCounters(cloned);
        return normalizeSettings(cloned, counters);
      },
    }
  )
);
