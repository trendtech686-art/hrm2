import type { LeaveRequest } from './types.ts';
import type { LeaveType } from '../settings/employees/types.ts';
import { useEmployeeStore } from '../employees/store.ts';
import { useEmployeeSettingsStore } from '../settings/employees/employee-settings-store.ts';
import { getCurrentDate } from '../../lib/date-utils.ts';

const clampNonNegative = (value: number) => (Number.isFinite(value) && value > 0 ? value : 0);

const resolveDelta = (leave: LeaveRequest) => {
  const days = Number(leave.numberOfDays) || 0;
  return days > 0 ? days : 0;
};

type LeaveTypeMetadata = {
  isPaid: boolean;
  countsTowardsAnnual: boolean;
};

const isAnnualLeaveType = (leaveType?: LeaveType | null) => {
  if (!leaveType) return false;
  const normalizedName = leaveType.name?.toLowerCase() ?? '';
  const annualKeywords = ['phép năm', 'phep nam', 'annual'];
  return annualKeywords.some((keyword) => normalizedName.includes(keyword));
};

const resolveLeaveTypeMetadata = (leave: LeaveRequest): LeaveTypeMetadata => {
  const settings = useEmployeeSettingsStore.getState().settings;
  const matchedType = settings.leaveTypes.find((type) => {
    if (leave.leaveTypeSystemId && type.systemId === leave.leaveTypeSystemId) return true;
    if (leave.leaveTypeId && type.id === leave.leaveTypeId) return true;
    return false;
  });

  const isPaid = typeof leave.leaveTypeIsPaid === 'boolean'
    ? leave.leaveTypeIsPaid
    : matchedType?.isPaid ?? true;

  const countsTowardsAnnual = matchedType
    ? isAnnualLeaveType(matchedType)
    : isPaid;

  return {
    isPaid,
    countsTowardsAnnual,
  } satisfies LeaveTypeMetadata;
};

const getServiceYears = (hireDate?: string) => {
  if (!hireDate) return 0;
  const parsed = new Date(hireDate);
  if (Number.isNaN(parsed.getTime())) return 0;
  const today = getCurrentDate();
  let years = today.getFullYear() - parsed.getFullYear();
  const hasNotReachedAnniversary =
    today.getMonth() < parsed.getMonth() ||
    (today.getMonth() === parsed.getMonth() && today.getDate() < parsed.getDate());
  if (hasNotReachedAnniversary) {
    years -= 1;
  }
  return Math.max(years, 0);
};

const computeAnnualQuota = (employeeHireDate?: string) => {
  const { baseAnnualLeaveDays, annualLeaveSeniorityBonus } = useEmployeeSettingsStore.getState().settings;
  const base = baseAnnualLeaveDays ?? 0;
  if (!annualLeaveSeniorityBonus) {
    return clampNonNegative(base);
  }
  const years = getServiceYears(employeeHireDate);
  const bonusInterval = annualLeaveSeniorityBonus.years || 0;
  const bonusValue = annualLeaveSeniorityBonus.additionalDays || 0;
  const bonusMultiplier = bonusInterval > 0 ? Math.floor(years / bonusInterval) : 0;
  const bonus = bonusMultiplier * bonusValue;
  return clampNonNegative(base + bonus);
};

const adjustLeaveUsage = (leave: LeaveRequest, delta: number) => {
  if (!delta) return;
  const employeeStore = useEmployeeStore.getState();
  const employee = employeeStore.findById(leave.employeeSystemId);
  if (!employee) return;

  const { isPaid, countsTowardsAnnual } = resolveLeaveTypeMetadata(leave);
  const totalDelta = delta;
  const paidDelta = isPaid ? delta : 0;
  const unpaidDelta = isPaid ? 0 : delta;
  const annualDelta = countsTowardsAnnual ? delta : 0;

  const nextLeaveTaken = clampNonNegative((employee.leaveTaken ?? 0) + totalDelta);
  const nextPaid = clampNonNegative((employee.paidLeaveTaken ?? 0) + paidDelta);
  const nextUnpaid = clampNonNegative((employee.unpaidLeaveTaken ?? 0) + unpaidDelta);
  const nextAnnual = clampNonNegative((employee.annualLeaveTaken ?? 0) + annualDelta);
  const quota = computeAnnualQuota(employee.hireDate);
  const nextBalance = clampNonNegative(quota - nextAnnual);

  const hasChanges =
    nextLeaveTaken !== (employee.leaveTaken ?? 0) ||
    nextPaid !== (employee.paidLeaveTaken ?? 0) ||
    nextUnpaid !== (employee.unpaidLeaveTaken ?? 0) ||
    nextAnnual !== (employee.annualLeaveTaken ?? 0) ||
    nextBalance !== (employee.annualLeaveBalance ?? quota);

  if (!hasChanges) return;

  employeeStore.update(leave.employeeSystemId, {
    ...employee,
    leaveTaken: nextLeaveTaken,
    paidLeaveTaken: nextPaid,
    unpaidLeaveTaken: nextUnpaid,
    annualLeaveTaken: nextAnnual,
    annualLeaveBalance: nextBalance,
  });
};

export const leaveQuotaSync = {
  apply(leave: LeaveRequest) {
    const delta = resolveDelta(leave);
    if (!delta) return;
    adjustLeaveUsage(leave, delta);
  },
  clear(leave: LeaveRequest) {
    const delta = resolveDelta(leave);
    if (!delta) return;
    adjustLeaveUsage(leave, -delta);
  },
};
