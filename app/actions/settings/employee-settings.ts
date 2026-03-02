'use server';

import prisma from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';
import { revalidatePath } from '@/lib/revalidation';
import { generateIdWithPrefix } from '@/lib/id-generator';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

// Types
export interface WorkShift {
  systemId: string;
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  breakMinutes?: number;
  description?: string;
  applicableDepartmentSystemIds: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface LeaveType {
  systemId: string;
  id: string;
  name: string;
  numberOfDays: number;
  isPaid: boolean;
  requiresAttachment: boolean;
  applicableGender: 'All' | 'Male' | 'Female';
  applicableDepartmentSystemIds: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SalaryComponent {
  systemId: string;
  id: string;
  name: string;
  description?: string;
  category: 'earning' | 'deduction' | 'contribution';
  type: 'fixed' | 'formula';
  amount?: number;
  formula?: string;
  taxable: boolean;
  partOfSocialInsurance: boolean;
  isActive: boolean;
  sortOrder: number;
  applicableDepartmentSystemIds: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface InsuranceRates {
  socialInsurance: { employeeRate: number; employerRate: number };
  healthInsurance: { employeeRate: number; employerRate: number };
  unemploymentInsurance: { employeeRate: number; employerRate: number };
  insuranceSalaryCap: number;
  baseSalaryReference: number;
}

export interface EmployeeSettings {
  workShifts: WorkShift[];
  leaveTypes: LeaveType[];
  salaryComponents: SalaryComponent[];
  insuranceRates: InsuranceRates;
}

const SETTINGS_TYPE = 'employee-settings';

// ==================== MAIN SETTINGS ====================

export async function getEmployeeSettings(): Promise<ActionResult<EmployeeSettings | null>> {
  try {
    const settings = await prisma.settingsData.findFirst({
      where: { type: SETTINGS_TYPE },
    });

    if (!settings) {
      return { success: true, data: null };
    }

    return { success: true, data: settings.metadata as unknown as EmployeeSettings };
  } catch (error) {
    console.error('Failed to get employee settings:', error);
    return { success: false, error: 'Không thể tải cài đặt nhân viên' };
  }
}

export async function saveEmployeeSettings(
  data: EmployeeSettings
): Promise<ActionResult<EmployeeSettings>> {
  try {
    const existing = await prisma.settingsData.findFirst({
      where: { type: SETTINGS_TYPE },
    });

    if (existing) {
      await prisma.settingsData.update({
        where: { systemId: existing.systemId },
        data: { metadata: data as unknown as Prisma.InputJsonValue },
      });
    } else {
      const settingsId = await generateIdWithPrefix('SETT', prisma);
      await prisma.settingsData.create({
        data: {
          systemId: settingsId,
          id: settingsId,
          type: SETTINGS_TYPE,
          name: 'Employee Settings',
          metadata: data as unknown as Prisma.InputJsonValue,
        },
      });
    }

    revalidatePath('/settings/employees');
    return { success: true, data };
  } catch (error) {
    console.error('Failed to save employee settings:', error);
    return { success: false, error: 'Không thể lưu cài đặt nhân viên' };
  }
}

// ==================== WORK SHIFTS ====================

export async function getWorkShifts(): Promise<ActionResult<WorkShift[]>> {
  try {
    const result = await getEmployeeSettings();
    if (!result.success) return { success: false, error: result.error };
    return { success: true, data: result.data?.workShifts || [] };
  } catch (error) {
    console.error('Failed to get work shifts:', error);
    return { success: false, error: 'Không thể tải ca làm việc' };
  }
}

export async function createWorkShift(
  data: Omit<WorkShift, 'systemId' | 'id' | 'createdAt' | 'updatedAt'>
): Promise<ActionResult<WorkShift>> {
  try {
    const result = await getEmployeeSettings();
    if (!result.success) return { success: false, error: result.error };

    const settings = result.data || {
      workShifts: [],
      leaveTypes: [],
      salaryComponents: [],
      insuranceRates: getDefaultInsuranceRates(),
    };

    const now = new Date().toISOString();
    const shiftSystemId = await generateIdWithPrefix('WS', prisma);
    const newShift: WorkShift = {
      ...data,
      systemId: shiftSystemId,
      id: `CA${String(settings.workShifts.length + 1).padStart(4, '0')}`,
      createdAt: now,
      updatedAt: now,
    };

    settings.workShifts.push(newShift);
    await saveEmployeeSettings(settings);

    revalidatePath('/settings/employees');
    return { success: true, data: newShift };
  } catch (error) {
    console.error('Failed to create work shift:', error);
    return { success: false, error: 'Không thể tạo ca làm việc' };
  }
}

export async function updateWorkShift(
  systemId: string,
  data: Partial<WorkShift>
): Promise<ActionResult<WorkShift>> {
  try {
    const result = await getEmployeeSettings();
    if (!result.success) return { success: false, error: result.error };
    if (!result.data) return { success: false, error: 'Không tìm thấy cài đặt' };

    const settings = result.data;
    const index = settings.workShifts.findIndex((s) => s.systemId === systemId);
    if (index === -1) return { success: false, error: 'Không tìm thấy ca làm việc' };

    const updated: WorkShift = {
      ...settings.workShifts[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    settings.workShifts[index] = updated;

    await saveEmployeeSettings(settings);
    revalidatePath('/settings/employees');
    return { success: true, data: updated };
  } catch (error) {
    console.error('Failed to update work shift:', error);
    return { success: false, error: 'Không thể cập nhật ca làm việc' };
  }
}

export async function deleteWorkShift(systemId: string): Promise<ActionResult<void>> {
  try {
    const result = await getEmployeeSettings();
    if (!result.success) return { success: false, error: result.error };
    if (!result.data) return { success: false, error: 'Không tìm thấy cài đặt' };

    const settings = result.data;
    settings.workShifts = settings.workShifts.filter((s) => s.systemId !== systemId);

    await saveEmployeeSettings(settings);
    revalidatePath('/settings/employees');
    return { success: true, data: undefined };
  } catch (error) {
    console.error('Failed to delete work shift:', error);
    return { success: false, error: 'Không thể xóa ca làm việc' };
  }
}

// ==================== LEAVE TYPES ====================

export async function getLeaveTypes(): Promise<ActionResult<LeaveType[]>> {
  try {
    const result = await getEmployeeSettings();
    if (!result.success) return { success: false, error: result.error };
    return { success: true, data: result.data?.leaveTypes || [] };
  } catch (error) {
    console.error('Failed to get leave types:', error);
    return { success: false, error: 'Không thể tải loại nghỉ phép' };
  }
}

export async function createLeaveType(
  data: Omit<LeaveType, 'systemId' | 'id' | 'createdAt' | 'updatedAt'>
): Promise<ActionResult<LeaveType>> {
  try {
    const result = await getEmployeeSettings();
    if (!result.success) return { success: false, error: result.error };

    const settings = result.data || {
      workShifts: [],
      leaveTypes: [],
      salaryComponents: [],
      insuranceRates: getDefaultInsuranceRates(),
    };

    const now = new Date().toISOString();
    const leaveTypeSystemId = await generateIdWithPrefix('LT', prisma);
    const newType: LeaveType = {
      ...data,
      systemId: leaveTypeSystemId,
      id: `NP${String(settings.leaveTypes.length + 1).padStart(4, '0')}`,
      createdAt: now,
      updatedAt: now,
    };

    settings.leaveTypes.push(newType);
    await saveEmployeeSettings(settings);

    revalidatePath('/settings/employees');
    return { success: true, data: newType };
  } catch (error) {
    console.error('Failed to create leave type:', error);
    return { success: false, error: 'Không thể tạo loại nghỉ phép' };
  }
}

export async function updateLeaveType(
  systemId: string,
  data: Partial<LeaveType>
): Promise<ActionResult<LeaveType>> {
  try {
    const result = await getEmployeeSettings();
    if (!result.success) return { success: false, error: result.error };
    if (!result.data) return { success: false, error: 'Không tìm thấy cài đặt' };

    const settings = result.data;
    const index = settings.leaveTypes.findIndex((t) => t.systemId === systemId);
    if (index === -1) return { success: false, error: 'Không tìm thấy loại nghỉ phép' };

    const updated: LeaveType = {
      ...settings.leaveTypes[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    settings.leaveTypes[index] = updated;

    await saveEmployeeSettings(settings);
    revalidatePath('/settings/employees');
    return { success: true, data: updated };
  } catch (error) {
    console.error('Failed to update leave type:', error);
    return { success: false, error: 'Không thể cập nhật loại nghỉ phép' };
  }
}

export async function deleteLeaveType(systemId: string): Promise<ActionResult<void>> {
  try {
    const result = await getEmployeeSettings();
    if (!result.success) return { success: false, error: result.error };
    if (!result.data) return { success: false, error: 'Không tìm thấy cài đặt' };

    const settings = result.data;
    settings.leaveTypes = settings.leaveTypes.filter((t) => t.systemId !== systemId);

    await saveEmployeeSettings(settings);
    revalidatePath('/settings/employees');
    return { success: true, data: undefined };
  } catch (error) {
    console.error('Failed to delete leave type:', error);
    return { success: false, error: 'Không thể xóa loại nghỉ phép' };
  }
}

// ==================== SALARY COMPONENTS ====================

export async function getSalaryComponents(): Promise<ActionResult<SalaryComponent[]>> {
  try {
    const result = await getEmployeeSettings();
    if (!result.success) return { success: false, error: result.error };
    return { success: true, data: result.data?.salaryComponents || [] };
  } catch (error) {
    console.error('Failed to get salary components:', error);
    return { success: false, error: 'Không thể tải thành phần lương' };
  }
}

export async function createSalaryComponent(
  data: Omit<SalaryComponent, 'systemId' | 'id' | 'createdAt' | 'updatedAt'>
): Promise<ActionResult<SalaryComponent>> {
  try {
    const result = await getEmployeeSettings();
    if (!result.success) return { success: false, error: result.error };

    const settings = result.data || {
      workShifts: [],
      leaveTypes: [],
      salaryComponents: [],
      insuranceRates: getDefaultInsuranceRates(),
    };

    const now = new Date().toISOString();
    const componentSystemId = await generateIdWithPrefix('SC', prisma);
    const newComponent: SalaryComponent = {
      ...data,
      systemId: componentSystemId,
      id: `TPL${String(settings.salaryComponents.length + 1).padStart(4, '0')}`,
      createdAt: now,
      updatedAt: now,
    };

    settings.salaryComponents.push(newComponent);
    await saveEmployeeSettings(settings);

    revalidatePath('/settings/employees');
    return { success: true, data: newComponent };
  } catch (error) {
    console.error('Failed to create salary component:', error);
    return { success: false, error: 'Không thể tạo thành phần lương' };
  }
}

export async function updateSalaryComponent(
  systemId: string,
  data: Partial<SalaryComponent>
): Promise<ActionResult<SalaryComponent>> {
  try {
    const result = await getEmployeeSettings();
    if (!result.success) return { success: false, error: result.error };
    if (!result.data) return { success: false, error: 'Không tìm thấy cài đặt' };

    const settings = result.data;
    const index = settings.salaryComponents.findIndex((c) => c.systemId === systemId);
    if (index === -1) return { success: false, error: 'Không tìm thấy thành phần lương' };

    const updated: SalaryComponent = {
      ...settings.salaryComponents[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    settings.salaryComponents[index] = updated;

    await saveEmployeeSettings(settings);
    revalidatePath('/settings/employees');
    return { success: true, data: updated };
  } catch (error) {
    console.error('Failed to update salary component:', error);
    return { success: false, error: 'Không thể cập nhật thành phần lương' };
  }
}

export async function deleteSalaryComponent(systemId: string): Promise<ActionResult<void>> {
  try {
    const result = await getEmployeeSettings();
    if (!result.success) return { success: false, error: result.error };
    if (!result.data) return { success: false, error: 'Không tìm thấy cài đặt' };

    const settings = result.data;
    settings.salaryComponents = settings.salaryComponents.filter(
      (c) => c.systemId !== systemId
    );

    await saveEmployeeSettings(settings);
    revalidatePath('/settings/employees');
    return { success: true, data: undefined };
  } catch (error) {
    console.error('Failed to delete salary component:', error);
    return { success: false, error: 'Không thể xóa thành phần lương' };
  }
}

// ==================== INSURANCE RATES ====================

export async function getInsuranceRates(): Promise<ActionResult<InsuranceRates>> {
  try {
    const result = await getEmployeeSettings();
    if (!result.success) return { success: false, error: result.error };
    return {
      success: true,
      data: result.data?.insuranceRates || getDefaultInsuranceRates(),
    };
  } catch (error) {
    console.error('Failed to get insurance rates:', error);
    return { success: false, error: 'Không thể tải tỷ lệ bảo hiểm' };
  }
}

export async function updateInsuranceRates(
  data: InsuranceRates
): Promise<ActionResult<InsuranceRates>> {
  try {
    const result = await getEmployeeSettings();
    if (!result.success) return { success: false, error: result.error };

    const settings = result.data || {
      workShifts: [],
      leaveTypes: [],
      salaryComponents: [],
      insuranceRates: getDefaultInsuranceRates(),
    };

    settings.insuranceRates = data;
    await saveEmployeeSettings(settings);

    revalidatePath('/settings/employees');
    return { success: true, data };
  } catch (error) {
    console.error('Failed to update insurance rates:', error);
    return { success: false, error: 'Không thể cập nhật tỷ lệ bảo hiểm' };
  }
}

// ==================== HELPERS ====================

function getDefaultInsuranceRates(): InsuranceRates {
  return {
    socialInsurance: { employeeRate: 8, employerRate: 17.5 },
    healthInsurance: { employeeRate: 1.5, employerRate: 3 },
    unemploymentInsurance: { employeeRate: 1, employerRate: 1 },
    insuranceSalaryCap: 36000000,
    baseSalaryReference: 1800000,
  };
}
