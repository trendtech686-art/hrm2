'use server'

/**
 * Server Actions for Branch Management (Chi nhánh)
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix } from '@/lib/id-generator'

// Types
type Branch = NonNullable<Awaited<ReturnType<typeof prisma.branch.findFirst>>>

export type ActionResult<T = unknown> = {
  success: boolean
  data?: T
  error?: string
}

export type CreateBranchInput = {
  name: string
  address?: string
  phone?: string
  province?: string
  provinceId?: string
  district?: string
  districtId?: number
  ward?: string
  wardCode?: string
  addressLevel?: string
  managerId?: string
  isDefault?: boolean
  thumbnail?: string
  website?: string
  createdBy?: string
}

export type UpdateBranchInput = {
  systemId: string
  name?: string
  address?: string
  phone?: string
  province?: string
  provinceId?: string
  district?: string
  districtId?: number
  ward?: string
  wardCode?: string
  addressLevel?: string
  managerId?: string
  isDefault?: boolean
  thumbnail?: string
  website?: string
  updatedBy?: string
}

// ====================================
// ACTIONS
// ====================================

export async function createBranchAction(
  input: CreateBranchInput
): Promise<ActionResult<Branch>> {
  try {
    const systemId = await generateIdWithPrefix('CN', prisma)

    // If setting as default, unset other defaults
    if (input.isDefault) {
      await prisma.branch.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      })
    }

    const branch = await prisma.branch.create({
      data: {
        systemId,
        id: systemId,
        name: input.name,
        address: input.address,
        phone: input.phone,
        province: input.province,
        provinceId: input.provinceId,
        district: input.district,
        districtId: input.districtId,
        ward: input.ward,
        wardCode: input.wardCode,
        addressLevel: input.addressLevel,
        managerId: input.managerId,
        isDefault: input.isDefault ?? false,
        thumbnail: input.thumbnail,
        website: input.website,
        createdBy: input.createdBy,
      },
    })

    revalidatePath('/settings/branches')
    return { success: true, data: branch }
  } catch (error) {
    console.error('Error creating branch:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create branch',
    }
  }
}

export async function updateBranchAction(
  input: UpdateBranchInput
): Promise<ActionResult<Branch>> {
  try {
    const { systemId, ...data } = input

    const existing = await prisma.branch.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Branch not found' }
    }

    // If setting as default, unset other defaults
    if (data.isDefault) {
      await prisma.branch.updateMany({
        where: { isDefault: true, systemId: { not: systemId } },
        data: { isDefault: false },
      })
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.name !== undefined) updateData.name = data.name
    if (data.address !== undefined) updateData.address = data.address
    if (data.phone !== undefined) updateData.phone = data.phone
    if (data.province !== undefined) updateData.province = data.province
    if (data.provinceId !== undefined) updateData.provinceId = data.provinceId
    if (data.district !== undefined) updateData.district = data.district
    if (data.districtId !== undefined) updateData.districtId = data.districtId
    if (data.ward !== undefined) updateData.ward = data.ward
    if (data.wardCode !== undefined) updateData.wardCode = data.wardCode
    if (data.addressLevel !== undefined) updateData.addressLevel = data.addressLevel
    if (data.managerId !== undefined) updateData.managerId = data.managerId
    if (data.isDefault !== undefined) updateData.isDefault = data.isDefault
    if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail
    if (data.website !== undefined) updateData.website = data.website
    if (data.updatedBy !== undefined) updateData.updatedBy = data.updatedBy

    const branch = await prisma.branch.update({
      where: { systemId },
      data: updateData,
    })

    revalidatePath('/settings/branches')
    revalidatePath(`/settings/branches/${systemId}`)
    return { success: true, data: branch }
  } catch (error) {
    console.error('Error updating branch:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update branch',
    }
  }
}

export async function deleteBranchAction(
  systemId: string,
  _deletedBy?: string
): Promise<ActionResult<Branch>> {
  try {
    const existing = await prisma.branch.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Branch not found' }
    }

    if (existing.isDefault) {
      return { success: false, error: 'Cannot delete default branch' }
    }

    // Soft delete
    const branch = await prisma.branch.update({
      where: { systemId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    revalidatePath('/settings/branches')
    return { success: true, data: branch }
  } catch (error) {
    console.error('Error deleting branch:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete branch',
    }
  }
}

export async function restoreBranchAction(
  systemId: string
): Promise<ActionResult<Branch>> {
  try {
    const existing = await prisma.branch.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Branch not found' }
    }

    const branch = await prisma.branch.update({
      where: { systemId },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    })

    revalidatePath('/settings/branches')
    return { success: true, data: branch }
  } catch (error) {
    console.error('Error restoring branch:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to restore branch',
    }
  }
}

export async function getBranchAction(
  systemId: string
): Promise<ActionResult<Branch>> {
  try {
    const branch = await prisma.branch.findUnique({
      where: { systemId },
      include: {
        employees: { take: 10 },
        _count: {
          select: {
            employees: true,
            orders: true,
            productInventory: true,
          },
        },
      },
    })

    if (!branch) {
      return { success: false, error: 'Branch not found' }
    }

    return { success: true, data: branch }
  } catch (error) {
    console.error('Error getting branch:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get branch',
    }
  }
}

export async function setDefaultBranchAction(
  systemId: string
): Promise<ActionResult<Branch>> {
  try {
    const existing = await prisma.branch.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Branch not found' }
    }

    // Unset current default
    await prisma.branch.updateMany({
      where: { isDefault: true },
      data: { isDefault: false },
    })

    // Set new default
    const branch = await prisma.branch.update({
      where: { systemId },
      data: { isDefault: true },
    })

    revalidatePath('/settings/branches')
    return { success: true, data: branch }
  } catch (error) {
    console.error('Error setting default branch:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to set default branch',
    }
  }
}
