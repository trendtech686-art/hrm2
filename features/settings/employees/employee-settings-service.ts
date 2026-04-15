/**
 * Employee Settings Service
 * 
 * Service layer for accessing employee settings from Prisma database.
 * This is used by non-React files (services, lib functions) that cannot use hooks.
 * 
 * For React components, use the hooks from './hooks/use-employee-settings' instead.
 */

import type { EmployeeSettings, WorkShift, LeaveType, SalaryComponent } from '@/lib/types/prisma-extended';
import { fetchEmployeeSettings } from './api/employee-settings-api';
import { logError } from '@/lib/logger'

// Default settings (fallback when API fails or no data in DB)
export const DEFAULT_EMPLOYEE_SETTINGS: EmployeeSettings = {
  workStartTime: '08:30',
  workEndTime: '18:00',
  lunchBreakDuration: 90,
  lunchBreakStart: '12:00',
  lunchBreakEnd: '13:30',
  workingDays: [1, 2, 3, 4, 5, 6],
  workShifts: [],
  otHourlyRate: 25000,
  otRateWeekend: 1.5,
  otRateHoliday: 3,
  allowedLateMinutes: 5,
  latePenaltyTiers: [
    { fromMinutes: 5, toMinutes: 10, amount: 10000 },
    { fromMinutes: 10, toMinutes: 30, amount: 20000 },
    { fromMinutes: 30, toMinutes: 60, amount: 50000 },
    { fromMinutes: 60, toMinutes: null, amount: 100000 },
  ],
  earlyLeavePenaltyTiers: [
    { fromMinutes: 5, toMinutes: 10, amount: 10000 },
    { fromMinutes: 10, toMinutes: 30, amount: 20000 },
    { fromMinutes: 30, toMinutes: 60, amount: 50000 },
    { fromMinutes: 60, toMinutes: null, amount: 100000 },
  ],
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
  payday: 5,
  payrollLockDate: 5,
  insuranceRates: {
    socialInsurance: { employeeRate: 8, employerRate: 17.5 },
    healthInsurance: { employeeRate: 1.5, employerRate: 3 },
    unemploymentInsurance: { employeeRate: 1, employerRate: 1 },
    insuranceSalaryCap: 46800000,
    baseSalaryReference: 2340000,
  },
  taxSettings: {
    personalDeduction: 11000000,
    dependentDeduction: 4400000,
    taxBrackets: [
      { fromAmount: 0, toAmount: 5000000, rate: 5 },
      { fromAmount: 5000000, toAmount: 10000000, rate: 10 },
      { fromAmount: 10000000, toAmount: 18000000, rate: 15 },
      { fromAmount: 18000000, toAmount: 32000000, rate: 20 },
      { fromAmount: 32000000, toAmount: 52000000, rate: 25 },
      { fromAmount: 52000000, toAmount: 80000000, rate: 30 },
      { fromAmount: 80000000, toAmount: null, rate: 35 },
    ],
  },
  minimumWage: {
    region1: 4960000,
    region2: 4410000,
    region3: 3860000,
    region4: 3450000,
  },
  standardWorkDays: 26,
  mealAllowancePerDay: 30000,
};

// In-memory cache for settings
let settingsCache: EmployeeSettings | null = null;
let cacheTimestamp: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get employee settings from API with caching
 * Use this for non-React files (services, lib functions)
 */
export async function getEmployeeSettings(): Promise<EmployeeSettings> {
  const now = Date.now();
  
  // Return cached data if still valid
  if (settingsCache && (now - cacheTimestamp) < CACHE_TTL) {
    return settingsCache;
  }
  
  try {
    const data = await fetchEmployeeSettings();
    if (data) {
      settingsCache = data;
      cacheTimestamp = now;
      return data;
    }
    return DEFAULT_EMPLOYEE_SETTINGS;
  } catch (error) {
    logError('[EmployeeSettingsService] Failed to fetch settings', error);
    // Return cached data even if expired, or default settings
    return settingsCache ?? DEFAULT_EMPLOYEE_SETTINGS;
  }
}

/**
 * Get settings synchronously (returns cached or default)
 * WARNING: May return stale data. Use getEmployeeSettings() when possible.
 */
export function getEmployeeSettingsSync(): EmployeeSettings {
  return settingsCache ?? DEFAULT_EMPLOYEE_SETTINGS;
}

/**
 * Invalidate the cache (call after saving settings)
 */
export function invalidateSettingsCache(): void {
  settingsCache = null;
  cacheTimestamp = 0;
}

/**
 * Update cache with new settings
 */
export function updateSettingsCache(settings: EmployeeSettings): void {
  settingsCache = settings;
  cacheTimestamp = Date.now();
}

// ========================================
// Helper functions for specific settings
// ========================================

export async function getWorkShifts(): Promise<WorkShift[]> {
  const settings = await getEmployeeSettings();
  return settings.workShifts ?? [];
}

export async function getLeaveTypes(): Promise<LeaveType[]> {
  const settings = await getEmployeeSettings();
  return settings.leaveTypes ?? [];
}

export async function getSalaryComponents(): Promise<SalaryComponent[]> {
  const settings = await getEmployeeSettings();
  return settings.salaryComponents ?? [];
}

export async function getWorkingDays(): Promise<number[]> {
  const settings = await getEmployeeSettings();
  return settings.workingDays ?? [1, 2, 3, 4, 5, 6];
}

export async function getStandardWorkDays(): Promise<number> {
  const settings = await getEmployeeSettings();
  return settings.standardWorkDays ?? 26;
}

export async function getOTRates(): Promise<{
  otHourlyRate: number;
  otRateWeekend: number;
  otRateHoliday: number;
}> {
  const settings = await getEmployeeSettings();
  return {
    otHourlyRate: settings.otHourlyRate ?? 25000,
    otRateWeekend: settings.otRateWeekend ?? 1.5,
    otRateHoliday: settings.otRateHoliday ?? 3,
  };
}

export async function getMealAllowancePerDay(): Promise<number> {
  const settings = await getEmployeeSettings();
  return settings.mealAllowancePerDay ?? 30000;
}

export async function getPenaltyTiers(): Promise<{
  latePenaltyTiers: EmployeeSettings['latePenaltyTiers'];
  earlyLeavePenaltyTiers: EmployeeSettings['earlyLeavePenaltyTiers'];
}> {
  const settings = await getEmployeeSettings();
  return {
    latePenaltyTiers: settings.latePenaltyTiers ?? [],
    earlyLeavePenaltyTiers: settings.earlyLeavePenaltyTiers ?? [],
  };
}

export async function getLeaveSettings(): Promise<{
  baseAnnualLeaveDays: number;
  annualLeaveSeniorityBonus: EmployeeSettings['annualLeaveSeniorityBonus'];
  allowRollover: boolean;
  rolloverExpirationDate: string;
}> {
  const settings = await getEmployeeSettings();
  return {
    baseAnnualLeaveDays: settings.baseAnnualLeaveDays ?? 12,
    annualLeaveSeniorityBonus: settings.annualLeaveSeniorityBonus ?? { years: 5, additionalDays: 1 },
    allowRollover: settings.allowRollover ?? false,
    rolloverExpirationDate: settings.rolloverExpirationDate ?? '03-31',
  };
}

export async function getPayrollSettings(): Promise<{
  payday: number;
  payrollLockDate: number;
  payrollCycle: EmployeeSettings['payrollCycle'];
}> {
  const settings = await getEmployeeSettings();
  return {
    payday: settings.payday ?? 5,
    payrollLockDate: settings.payrollLockDate ?? 5,
    payrollCycle: settings.payrollCycle ?? 'monthly',
  };
}
