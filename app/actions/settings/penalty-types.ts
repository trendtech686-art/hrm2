'use server'

/**
 * Server Actions for Penalty Type Settings Management (Loại phạt)
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix } from '@/lib/id-generator'

// Types
type PenaltyTypeSetting = NonNullable<Awaited<ReturnType<typeof prisma.penaltyTypeSetting.findFirst>>>

export type ActionResult<T = unknown> = {
  success: boolean
  data?: T
  error?: string
}

export type CreatePenaltyTypeInput = {
  name: string
  description?: string
  defaultAmount?: number
  category?: 'complaint' | 'attendance' | 'performance' | 'other'
  isActive?: boolean
  sortOrder?: number
  createdBy?: string
}

export type UpdatePenaltyTypeInput = {
  systemId: string
  name?: string
  description?: string
  defaultAmount?: number
  category?: string
  isActive?: boolean
  sortOrder?: number
  updatedBy?: string
}

// ====================================
// ACTIONS
// ====================================

export async function createPenaltyTypeAction(
  input: CreatePenaltyTypeInput
): Promise<ActionResult<PenaltyTypeSetting>> {
  try {
    const systemId = await generateIdWithPrefix('LP', prisma)

    const penaltyType = await prisma.penaltyTypeSetting.create({
      data: {
        systemId,
        id: systemId,
        name: input.name,
        description: input.description,
        defaultAmount: input.defaultAmount ?? 0,
        category: input.category ?? 'other',
        isActive: input.isActive ?? true,
        sortOrder: input.sortOrder ?? 0,
        createdBy: input.createdBy,
      },
    })

    revalidatePath('/settings/penalty-types')
    return { success: true, data: penaltyType }
  } catch (error) {
    console.error('Error creating penalty type:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create penalty type',
    }
  }
}

export async function updatePenaltyTypeAction(
  input: UpdatePenaltyTypeInput
): Promise<ActionResult<PenaltyTypeSetting>> {
  try {
    const { systemId, ...data } = input

    const updateData: Record<string, unknown> = {}
    
    if (data.name !== undefined) updateData.name = data.name
    if (data.description !== undefined) updateData.description = data.description
    if (data.defaultAmount !== undefined) updateData.defaultAmount = data.defaultAmount
    if (data.category !== undefined) updateData.category = data.category
    if (data.isActive !== undefined) updateData.isActive = data.isActive
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder
    if (data.updatedBy !== undefined) updateData.updatedBy = data.updatedBy

    const penaltyType = await prisma.penaltyTypeSetting.update({
      where: { systemId },
      data: updateData,
    })

    revalidatePath('/settings/penalty-types')
    return { success: true, data: penaltyType }
  } catch (error) {
    console.error('Error updating penalty type:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update penalty type',
    }
  }
}

export async function deletePenaltyTypeAction(
  systemId: string
): Promise<ActionResult<PenaltyTypeSetting>> {
  try {
    const penaltyType = await prisma.penaltyTypeSetting.update({
      where: { systemId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    revalidatePath('/settings/penalty-types')
    return { success: true, data: penaltyType }
  } catch (error) {
    console.error('Error deleting penalty type:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete penalty type',
    }
  }
}

export async function restorePenaltyTypeAction(
  systemId: string
): Promise<ActionResult<PenaltyTypeSetting>> {
  try {
    const penaltyType = await prisma.penaltyTypeSetting.update({
      where: { systemId },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    })

    revalidatePath('/settings/penalty-types')
    return { success: true, data: penaltyType }
  } catch (error) {
    console.error('Error restoring penalty type:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to restore penalty type',
    }
  }
}

export async function getPenaltyTypeAction(
  systemId: string
): Promise<ActionResult<PenaltyTypeSetting>> {
  try {
    const penaltyType = await prisma.penaltyTypeSetting.findUnique({
      where: { systemId },
    })

    if (!penaltyType) {
      return { success: false, error: 'Penalty type not found' }
    }

    return { success: true, data: penaltyType }
  } catch (error) {
    console.error('Error getting penalty type:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get penalty type',
    }
  }
}
