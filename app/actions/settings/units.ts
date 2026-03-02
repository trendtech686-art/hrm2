'use server'

/**
 * Server Actions for Unit Management (Đơn vị tính)
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix } from '@/lib/id-generator'

// Types
type Unit = NonNullable<Awaited<ReturnType<typeof prisma.unit.findFirst>>>

export type ActionResult<T = unknown> = {
  success: boolean
  data?: T
  error?: string
}

export type CreateUnitInput = {
  name: string
  description?: string
  isDefault?: boolean
  isActive?: boolean
  createdBy?: string
}

export type UpdateUnitInput = {
  systemId: string
  name?: string
  description?: string
  isDefault?: boolean
  isActive?: boolean
  updatedBy?: string
}

// ====================================
// ACTIONS
// ====================================

export async function createUnitAction(
  input: CreateUnitInput
): Promise<ActionResult<Unit>> {
  try {
    const systemId = await generateIdWithPrefix('DVT', prisma)

    if (input.isDefault) {
      await prisma.unit.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      })
    }

    const unit = await prisma.unit.create({
      data: {
        systemId,
        id: systemId,
        name: input.name,
        description: input.description,
        isDefault: input.isDefault ?? false,
        isActive: input.isActive ?? true,
        createdBy: input.createdBy,
      },
    })

    revalidatePath('/settings/units')
    return { success: true, data: unit }
  } catch (error) {
    console.error('Error creating unit:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create unit',
    }
  }
}

export async function updateUnitAction(
  input: UpdateUnitInput
): Promise<ActionResult<Unit>> {
  try {
    const { systemId, ...data } = input

    if (data.isDefault) {
      await prisma.unit.updateMany({
        where: { isDefault: true, systemId: { not: systemId } },
        data: { isDefault: false },
      })
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.name !== undefined) updateData.name = data.name
    if (data.description !== undefined) updateData.description = data.description
    if (data.isDefault !== undefined) updateData.isDefault = data.isDefault
    if (data.isActive !== undefined) updateData.isActive = data.isActive
    if (data.updatedBy !== undefined) updateData.updatedBy = data.updatedBy

    const unit = await prisma.unit.update({
      where: { systemId },
      data: updateData,
    })

    revalidatePath('/settings/units')
    return { success: true, data: unit }
  } catch (error) {
    console.error('Error updating unit:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update unit',
    }
  }
}

export async function deleteUnitAction(
  systemId: string
): Promise<ActionResult<Unit>> {
  try {
    const existing = await prisma.unit.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Unit not found' }
    }

    if (existing.isDefault) {
      return { success: false, error: 'Cannot delete default unit' }
    }

    const unit = await prisma.unit.delete({
      where: { systemId },
    })

    revalidatePath('/settings/units')
    return { success: true, data: unit }
  } catch (error) {
    console.error('Error deleting unit:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete unit',
    }
  }
}

export async function getUnitAction(
  systemId: string
): Promise<ActionResult<Unit>> {
  try {
    const unit = await prisma.unit.findUnique({
      where: { systemId },
    })

    if (!unit) {
      return { success: false, error: 'Unit not found' }
    }

    return { success: true, data: unit }
  } catch (error) {
    console.error('Error getting unit:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get unit',
    }
  }
}

export async function setDefaultUnitAction(
  systemId: string
): Promise<ActionResult<Unit>> {
  try {
    await prisma.unit.updateMany({
      where: { isDefault: true },
      data: { isDefault: false },
    })

    const unit = await prisma.unit.update({
      where: { systemId },
      data: { isDefault: true },
    })

    revalidatePath('/settings/units')
    return { success: true, data: unit }
  } catch (error) {
    console.error('Error setting default unit:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to set default unit',
    }
  }
}
