'use server';

import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from '@/lib/revalidation';
import type { SystemId } from '@/lib/id-types';
import { generateIdWithPrefix } from '@/lib/id-generator';

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export interface EmployeePayrollProfile {
  systemId: string;
  employeeSystemId: SystemId;
  salaryType: 'hourly' | 'daily' | 'monthly';
  baseSalary: number;
  bankName?: string | null;
  bankAccount?: string | null;
  bankAccountName?: string | null;
  taxCode?: string | null;
  socialInsuranceNumber?: string | null;
  healthInsuranceNumber?: string | null;
  allowances?: Record<string, number>;
  deductions?: Record<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmployeePayrollProfileInput {
  salaryType: 'hourly' | 'daily' | 'monthly';
  baseSalary: number;
  bankName?: string;
  bankAccount?: string;
  bankAccountName?: string;
  taxCode?: string;
  socialInsuranceNumber?: string;
  healthInsuranceNumber?: string;
  allowances?: Record<string, number>;
  deductions?: Record<string, number>;
}

const PROFILE_TYPE = 'employee-payroll-profile';

/**
 * Fetch all payroll profiles
 */
export async function getPayrollProfiles(): Promise<ActionResult<EmployeePayrollProfile[]>> {
  try {
    const profiles = await prisma.settingsData.findMany({
      where: { type: PROFILE_TYPE },
    });

    const data: EmployeePayrollProfile[] = profiles.map((p) => ({
      systemId: p.systemId,
      employeeSystemId: p.name as SystemId, // We store employeeSystemId in name field
      ...(p.metadata as Record<string, unknown>),
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    })) as EmployeePayrollProfile[];

    return { success: true, data };
  } catch (error) {
    console.error('Failed to fetch payroll profiles:', error);
    return { success: false, error: 'Không thể tải hồ sơ lương' };
  }
}

/**
 * Fetch payroll profile for a specific employee
 */
export async function getPayrollProfile(
  employeeSystemId: SystemId
): Promise<ActionResult<EmployeePayrollProfile | null>> {
  try {
    const profile = await prisma.settingsData.findFirst({
      where: {
        type: PROFILE_TYPE,
        name: employeeSystemId, // We store employeeSystemId in name field
      },
    });

    if (!profile) {
      return { success: true, data: null };
    }

    const data: EmployeePayrollProfile = {
      systemId: profile.systemId,
      employeeSystemId: profile.name as SystemId,
      ...(profile.metadata as Record<string, unknown>),
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    } as EmployeePayrollProfile;

    return { success: true, data };
  } catch (error) {
    console.error('Failed to fetch payroll profile:', error);
    return { success: false, error: 'Không thể tải hồ sơ lương' };
  }
}

/**
 * Create or update payroll profile
 */
export async function upsertPayrollProfile(
  employeeSystemId: SystemId,
  input: EmployeePayrollProfileInput
): Promise<ActionResult<EmployeePayrollProfile>> {
  try {
    const existing = await prisma.settingsData.findFirst({
      where: {
        type: PROFILE_TYPE,
        name: employeeSystemId,
      },
    });

    let profile;
    const profileSystemId = await generateIdWithPrefix('PPR', prisma);
    if (existing) {
      profile = await prisma.settingsData.update({
        where: { systemId: existing.systemId },
        data: {
          metadata: input as unknown as Prisma.InputJsonValue,
        },
      });
    } else {
      profile = await prisma.settingsData.create({
        data: {
          systemId: profileSystemId,
          id: profileSystemId,
          type: PROFILE_TYPE,
          name: employeeSystemId,
          metadata: input as unknown as Prisma.InputJsonValue,
        },
      });
    }

    const data: EmployeePayrollProfile = {
      systemId: profile.systemId,
      employeeSystemId: profile.name as SystemId,
      ...(profile.metadata as Record<string, unknown>),
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    } as EmployeePayrollProfile;

    revalidatePath('/employees');
    revalidatePath(`/employees/${employeeSystemId}`);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to upsert payroll profile:', error);
    return { success: false, error: 'Không thể lưu hồ sơ lương' };
  }
}

/**
 * Update payroll profile (partial update)
 */
export async function updatePayrollProfile(
  employeeSystemId: SystemId,
  input: Partial<EmployeePayrollProfileInput>
): Promise<ActionResult<EmployeePayrollProfile>> {
  try {
    const existing = await prisma.settingsData.findFirst({
      where: {
        type: PROFILE_TYPE,
        name: employeeSystemId,
      },
    });

    if (!existing) {
      return { success: false, error: 'Không tìm thấy hồ sơ lương' };
    }

    const currentData = existing.metadata as Record<string, unknown>;
    const updatedData = { ...currentData, ...input };

    const profile = await prisma.settingsData.update({
      where: { systemId: existing.systemId },
      data: {
        metadata: updatedData as unknown as Prisma.InputJsonValue,
      },
    });

    const data: EmployeePayrollProfile = {
      systemId: profile.systemId,
      employeeSystemId: profile.name as SystemId,
      ...(profile.metadata as Record<string, unknown>),
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    } as EmployeePayrollProfile;

    revalidatePath('/employees');
    revalidatePath(`/employees/${employeeSystemId}`);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to update payroll profile:', error);
    return { success: false, error: 'Không thể cập nhật hồ sơ lương' };
  }
}

/**
 * Delete payroll profile
 */
export async function deletePayrollProfile(
  employeeSystemId: SystemId
): Promise<ActionResult<void>> {
  try {
    const existing = await prisma.settingsData.findFirst({
      where: {
        type: PROFILE_TYPE,
        name: employeeSystemId,
      },
    });

    if (existing) {
      await prisma.settingsData.delete({
        where: { systemId: existing.systemId },
      });
    }

    revalidatePath('/employees');
    revalidatePath(`/employees/${employeeSystemId}`);
    return { success: true, data: undefined };
  } catch (error) {
    console.error('Failed to delete payroll profile:', error);
    return { success: false, error: 'Không thể xóa hồ sơ lương' };
  }
}
