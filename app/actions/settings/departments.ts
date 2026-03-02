'use server'

/**
 * Server Actions for Department Management (Phòng ban)
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix } from '@/lib/id-generator'

// Types
type Department = NonNullable<Awaited<ReturnType<typeof prisma.department.findFirst>>>

export type ActionResult<T = unknown> = {
  success: boolean
  data?: T
  error?: string
}

export type CreateDepartmentInput = {
  name: string
  description?: string
  managerId?: string
  parentId?: string
  createdBy?: string
}

export type UpdateDepartmentInput = {
  systemId: string
  name?: string
  description?: string
  managerId?: string
  parentId?: string
  updatedBy?: string
}

// ====================================
// ACTIONS
// ====================================

export async function createDepartmentAction(
  input: CreateDepartmentInput
): Promise<ActionResult<Department>> {
  try {
    const systemId = await generateIdWithPrefix('PB', prisma)

    const department = await prisma.department.create({
      data: {
        systemId,
        id: systemId,
        name: input.name,
        description: input.description,
        managerId: input.managerId,
        parentId: input.parentId,
        createdBy: input.createdBy,
      },
    })

    revalidatePath('/settings/departments')
    return { success: true, data: department }
  } catch (error) {
    console.error('Error creating department:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create department',
    }
  }
}

export async function updateDepartmentAction(
  input: UpdateDepartmentInput
): Promise<ActionResult<Department>> {
  try {
    const { systemId, ...data } = input

    const existing = await prisma.department.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Department not found' }
    }

    // Prevent circular reference
    if (data.parentId === systemId) {
      return { success: false, error: 'Department cannot be its own parent' }
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.name !== undefined) updateData.name = data.name
    if (data.description !== undefined) updateData.description = data.description
    if (data.managerId !== undefined) updateData.managerId = data.managerId
    if (data.parentId !== undefined) updateData.parentId = data.parentId
    if (data.updatedBy !== undefined) updateData.updatedBy = data.updatedBy

    const department = await prisma.department.update({
      where: { systemId },
      data: updateData,
    })

    revalidatePath('/settings/departments')
    return { success: true, data: department }
  } catch (error) {
    console.error('Error updating department:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update department',
    }
  }
}

export async function deleteDepartmentAction(
  systemId: string
): Promise<ActionResult<Department>> {
  try {
    const existing = await prisma.department.findUnique({
      where: { systemId },
      include: { children: true, employees: true },
    })

    if (!existing) {
      return { success: false, error: 'Department not found' }
    }

    if (existing.children.length > 0) {
      return { success: false, error: 'Cannot delete department with sub-departments' }
    }

    if (existing.employees.length > 0) {
      return { success: false, error: 'Cannot delete department with employees' }
    }

    const department = await prisma.department.update({
      where: { systemId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    revalidatePath('/settings/departments')
    return { success: true, data: department }
  } catch (error) {
    console.error('Error deleting department:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete department',
    }
  }
}

export async function restoreDepartmentAction(
  systemId: string
): Promise<ActionResult<Department>> {
  try {
    const department = await prisma.department.update({
      where: { systemId },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    })

    revalidatePath('/settings/departments')
    return { success: true, data: department }
  } catch (error) {
    console.error('Error restoring department:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to restore department',
    }
  }
}

export async function getDepartmentAction(
  systemId: string
): Promise<ActionResult<Department>> {
  try {
    const department = await prisma.department.findUnique({
      where: { systemId },
      include: {
        parent: true,
        children: true,
        employees: { take: 10 },
        _count: { select: { employees: true, children: true } },
      },
    })

    if (!department) {
      return { success: false, error: 'Department not found' }
    }

    return { success: true, data: department }
  } catch (error) {
    console.error('Error getting department:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get department',
    }
  }
}
