'use server'

/**
 * Server Actions for Tax Management (Thuế)
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix } from '@/lib/id-generator'

// Types
type Tax = NonNullable<Awaited<ReturnType<typeof prisma.tax.findFirst>>>

export type ActionResult<T = unknown> = {
  success: boolean
  data?: T
  error?: string
}

export type CreateTaxInput = {
  name: string
  rate: number
  description?: string
  isDefaultSale?: boolean
  isDefaultPurchase?: boolean
  isActive?: boolean
  createdBy?: string
}

export type UpdateTaxInput = {
  systemId: string
  name?: string
  rate?: number
  description?: string
  isDefaultSale?: boolean
  isDefaultPurchase?: boolean
  isActive?: boolean
  updatedBy?: string
}

// ====================================
// ACTIONS
// ====================================

export async function createTaxAction(
  input: CreateTaxInput
): Promise<ActionResult<Tax>> {
  try {
    const systemId = await generateIdWithPrefix('TAX', prisma)

    if (input.isDefaultSale) {
      await prisma.tax.updateMany({
        where: { isDefaultSale: true },
        data: { isDefaultSale: false },
      })
    }

    if (input.isDefaultPurchase) {
      await prisma.tax.updateMany({
        where: { isDefaultPurchase: true },
        data: { isDefaultPurchase: false },
      })
    }

    const tax = await prisma.tax.create({
      data: {
        systemId,
        id: systemId,
        name: input.name,
        rate: input.rate,
        description: input.description,
        isDefaultSale: input.isDefaultSale ?? false,
        isDefaultPurchase: input.isDefaultPurchase ?? false,
        isActive: input.isActive ?? true,
        createdBy: input.createdBy,
      },
    })

    revalidatePath('/settings/taxes')
    return { success: true, data: tax }
  } catch (error) {
    console.error('Error creating tax:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create tax',
    }
  }
}

export async function updateTaxAction(
  input: UpdateTaxInput
): Promise<ActionResult<Tax>> {
  try {
    const { systemId, ...data } = input

    if (data.isDefaultSale) {
      await prisma.tax.updateMany({
        where: { isDefaultSale: true, systemId: { not: systemId } },
        data: { isDefaultSale: false },
      })
    }

    if (data.isDefaultPurchase) {
      await prisma.tax.updateMany({
        where: { isDefaultPurchase: true, systemId: { not: systemId } },
        data: { isDefaultPurchase: false },
      })
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.name !== undefined) updateData.name = data.name
    if (data.rate !== undefined) updateData.rate = data.rate
    if (data.description !== undefined) updateData.description = data.description
    if (data.isDefaultSale !== undefined) updateData.isDefaultSale = data.isDefaultSale
    if (data.isDefaultPurchase !== undefined) updateData.isDefaultPurchase = data.isDefaultPurchase
    if (data.isActive !== undefined) updateData.isActive = data.isActive
    if (data.updatedBy !== undefined) updateData.updatedBy = data.updatedBy

    const tax = await prisma.tax.update({
      where: { systemId },
      data: updateData,
    })

    revalidatePath('/settings/taxes')
    return { success: true, data: tax }
  } catch (error) {
    console.error('Error updating tax:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update tax',
    }
  }
}

export async function deleteTaxAction(
  systemId: string
): Promise<ActionResult<Tax>> {
  try {
    const existing = await prisma.tax.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Tax not found' }
    }

    if (existing.isDefaultSale || existing.isDefaultPurchase) {
      return { success: false, error: 'Cannot delete default tax' }
    }

    const tax = await prisma.tax.update({
      where: { systemId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    revalidatePath('/settings/taxes')
    return { success: true, data: tax }
  } catch (error) {
    console.error('Error deleting tax:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete tax',
    }
  }
}

export async function restoreTaxAction(
  systemId: string
): Promise<ActionResult<Tax>> {
  try {
    const tax = await prisma.tax.update({
      where: { systemId },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    })

    revalidatePath('/settings/taxes')
    return { success: true, data: tax }
  } catch (error) {
    console.error('Error restoring tax:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to restore tax',
    }
  }
}

export async function getTaxAction(
  systemId: string
): Promise<ActionResult<Tax>> {
  try {
    const tax = await prisma.tax.findUnique({
      where: { systemId },
    })

    if (!tax) {
      return { success: false, error: 'Tax not found' }
    }

    return { success: true, data: tax }
  } catch (error) {
    console.error('Error getting tax:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get tax',
    }
  }
}
