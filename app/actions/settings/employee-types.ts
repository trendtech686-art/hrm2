'use server'

/**
 * Server Actions for Employee Type Settings Management (Loại nhân viên)
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix } from '@/lib/id-generator'

// Types
type EmployeeTypeSetting = NonNullable<Awaited<ReturnType<typeof prisma.employeeTypeSetting.findFirst>>>

export type ActionResult<T = unknown> = {
  success: boolean
  data?: T
  error?: string
}

export type CreateEmployeeTypeInput = {
  name: string
  description?: string
  color?: string
  isDefault?: boolean
  sortOrder?: number
  createdBy?: string
}

export type UpdateEmployeeTypeInput = {
  systemId: string
  name?: string
  description?: string
  color?: string
  isDefault?: boolean
  sortOrder?: number
  updatedBy?: string
}

// ====================================
// ACTIONS
// ====================================

export async function createEmployeeTypeAction(
  input: CreateEmployeeTypeInput
): Promise<ActionResult<EmployeeTypeSetting>> {
  try {
    const systemId = await generateIdWithPrefix('LNV', prisma)

    // If setting as default, unset other defaults
    if (input.isDefault) {
      await prisma.employeeTypeSetting.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      })
    }

    const employeeType = await prisma.employeeTypeSetting.create({
      data: {
        systemId,
        id: systemId,
        name: input.name,
        description: input.description,
        color: input.color,
        isDefault: input.isDefault ?? false,
        sortOrder: input.sortOrder ?? 0,
        createdBy: input.createdBy,
      },
    })

    revalidatePath('/settings/employee-types')
    return { success: true, data: employeeType }
  } catch (error) {
    console.error('Error creating employee type:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create employee type',
    }
  }
}

export async function updateEmployeeTypeAction(
  input: UpdateEmployeeTypeInput
): Promise<ActionResult<EmployeeTypeSetting>> {
  try {
    const { systemId, ...data } = input

    const existing = await prisma.employeeTypeSetting.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Employee type not found' }
    }

    // If setting as default, unset other defaults
    if (data.isDefault) {
      await prisma.employeeTypeSetting.updateMany({
        where: { isDefault: true, systemId: { not: systemId } },
        data: { isDefault: false },
      })
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.name !== undefined) updateData.name = data.name
    if (data.description !== undefined) updateData.description = data.description
    if (data.color !== undefined) updateData.color = data.color
    if (data.isDefault !== undefined) updateData.isDefault = data.isDefault
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder
    if (data.updatedBy !== undefined) updateData.updatedBy = data.updatedBy

    const employeeType = await prisma.employeeTypeSetting.update({
      where: { systemId },
      data: updateData,
    })

    revalidatePath('/settings/employee-types')
    return { success: true, data: employeeType }
  } catch (error) {
    console.error('Error updating employee type:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update employee type',
    }
  }
}

export async function deleteEmployeeTypeAction(
  systemId: string
): Promise<ActionResult<EmployeeTypeSetting>> {
  try {
    const existing = await prisma.employeeTypeSetting.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Employee type not found' }
    }

    if (existing.isDefault) {
      return { success: false, error: 'Cannot delete default employee type' }
    }

    const employeeType = await prisma.employeeTypeSetting.update({
      where: { systemId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    revalidatePath('/settings/employee-types')
    return { success: true, data: employeeType }
  } catch (error) {
    console.error('Error deleting employee type:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete employee type',
    }
  }
}

export async function restoreEmployeeTypeAction(
  systemId: string
): Promise<ActionResult<EmployeeTypeSetting>> {
  try {
    const employeeType = await prisma.employeeTypeSetting.update({
      where: { systemId },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    })

    revalidatePath('/settings/employee-types')
    return { success: true, data: employeeType }
  } catch (error) {
    console.error('Error restoring employee type:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to restore employee type',
    }
  }
}

export async function getEmployeeTypeAction(
  systemId: string
): Promise<ActionResult<EmployeeTypeSetting>> {
  try {
    const employeeType = await prisma.employeeTypeSetting.findUnique({
      where: { systemId },
    })

    if (!employeeType) {
      return { success: false, error: 'Employee type not found' }
    }

    return { success: true, data: employeeType }
  } catch (error) {
    console.error('Error getting employee type:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get employee type',
    }
  }
}

export async function setDefaultEmployeeTypeAction(
  systemId: string
): Promise<ActionResult<EmployeeTypeSetting>> {
  try {
    // Unset current default
    await prisma.employeeTypeSetting.updateMany({
      where: { isDefault: true },
      data: { isDefault: false },
    })

    // Set new default
    const employeeType = await prisma.employeeTypeSetting.update({
      where: { systemId },
      data: { isDefault: true },
    })

    revalidatePath('/settings/employee-types')
    return { success: true, data: employeeType }
  } catch (error) {
    console.error('Error setting default employee type:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to set default employee type',
    }
  }
}
