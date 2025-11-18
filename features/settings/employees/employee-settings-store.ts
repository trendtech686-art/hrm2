import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { EmployeeSettings } from './types.ts';

const defaultSettings: EmployeeSettings = {
  workStartTime: '08:30',
  workEndTime: '17:30',
  lunchBreakDuration: 60,
  workingDays: [1, 2, 3, 4, 5],
  workShifts: [],
  otRateWeekday: 1.5,
  otRateWeekend: 2,
  otRateHoliday: 3,
  allowedLateMinutes: 15,
  latePolicyAction: 'log_violation',
  leaveTypes: [],
  baseAnnualLeaveDays: 12,
  annualLeaveSeniorityBonus: {
    years: 5,
    additionalDays: 1,
  },
  allowRollover: false,
  rolloverExpirationDate: '03-31',
  salaryComponents: [],
  payrollCycle: 'monthly',
  payrollStartDate: 1,
  payrollEndDate: 31,
  payday: 5,
  payrollLockDate: 5,
};

type EmployeeSettingsState = {
  settings: EmployeeSettings;
  setSettings: (settings: EmployeeSettings) => void;
};

export const useEmployeeSettingsStore = create<EmployeeSettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      setSettings: (settings) => set({ settings }),
    }),
    {
      name: 'hrm-employee-settings-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
