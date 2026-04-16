'use server'

/**
 * Server Actions for Brands Management (Thương hiệu)
 */

import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { requireActionPermission } from '@/lib/api-utils'
import type { ActionResult } from '@/types/action-result'
import { createBrandSchema, updateBrandSchema } from '@/features/brands/validation'
import { logError } from '@/lib/logger'
import { getSessionUserName } from '@/lib/get-user-name'

// Types
type Brand = NonNullable<Awaited<ReturnType<typeof prisma.brand.findFirst>>>

export type CreateBrandInput = {
  name: string
  description?: string
  website?: string
  logo?: string
  logoUrl?: string
  thumbnail?: string
  seoTitle?: string
  metaDescription?: string
  seoKeywords?: string
  shortDescription?: string
  longDescription?: string
  websiteSeo?: Record<string, unknown>
  isActive?: boolean
  sortOrder?: number
}

export type UpdateBrandInput = {
  systemId: string
  name?: string
  description?: string
  website?: string
  logo?: string
  logoUrl?: string
  thumbnail?: string
  seoTitle?: string
  metaDescription?: string
  seoKeywords?: string
  shortDescription?: string
  longDescription?: string
  websiteSeo?: Record<string, unknown>
  isActive?: boolean
  sortOrder?: number
}

// ====================================
// ACTIONS
// ====================================

export async function createBrandAction(
  input: CreateBrandInput
): Promise<ActionResult<Brand>> {
  const authResult = await requireActionPermission('create_products')
  if (!authResult.success) return authResult
  const { session } = authResult

  const validated = createBrandSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const systemId = await generateIdWithPrefix('BR', prisma)

    const brand = await prisma.brand.create({
      data: {
        systemId,
        id: systemId,
        name: input.name,
        description: input.description,
        website: input.website,
        logo: input.logo,
        logoUrl: input.logoUrl,
        thumbnail: input.thumbnail,
        seoTitle: input.seoTitle,
        metaDescription: input.metaDescription,
        seoKeywords: input.seoKeywords,
        shortDescription: input.shortDescription,
        longDescription: input.longDescription,
        websiteSeo: input.websiteSeo as Prisma.InputJsonValue,
        isActive: input.isActive ?? true,
        sortOrder: input.sortOrder ?? 0,
      },
    })

    revalidatePath('/brands')

    const logUserName = getSessionUserName(session)
    prisma.activityLog.create({
      data: {
        entityType: 'brand',
        entityId: systemId,
        action: `Tạo thương hiệu: ${input.name}`,
        actionType: 'create',
        metadata: { userName: logUserName },
        createdBy: logUserName,
      }
    }).catch(e => logError('[ActivityLog] brand create failed', e))

    return { success: true, data: brand }
  } catch (error) {
    logError('Error creating brand', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tạo thương hiệu',
    }
  }
}

export async function updateBrandAction(
  input: UpdateBrandInput
): Promise<ActionResult<Brand>> {
  const authResult = await requireActionPermission('edit_products')
  if (!authResult.success) return authResult
  const { session } = authResult

  const validated = updateBrandSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const { systemId, ...data } = input

    const existing = await prisma.brand.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy thương hiệu' }
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.name !== undefined) updateData.name = data.name
    if (data.description !== undefined) updateData.description = data.description
    if (data.website !== undefined) updateData.website = data.website
    if (data.logo !== undefined) updateData.logo = data.logo
    if (data.logoUrl !== undefined) updateData.logoUrl = data.logoUrl
    if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail
    if (data.seoTitle !== undefined) updateData.seoTitle = data.seoTitle
    if (data.metaDescription !== undefined) updateData.metaDescription = data.metaDescription
    if (data.seoKeywords !== undefined) updateData.seoKeywords = data.seoKeywords
    if (data.shortDescription !== undefined) updateData.shortDescription = data.shortDescription
    if (data.longDescription !== undefined) updateData.longDescription = data.longDescription
    if (data.websiteSeo !== undefined) updateData.websiteSeo = data.websiteSeo as Prisma.InputJsonValue
    if (data.isActive !== undefined) updateData.isActive = data.isActive
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder

    const brand = await prisma.brand.update({
      where: { systemId },
      data: updateData,
    })

    revalidatePath('/brands')
    revalidatePath(`/brands/${systemId}`)

    const logUserName = getSessionUserName(session)
    prisma.activityLog.create({
      data: {
        entityType: 'brand',
        entityId: systemId,
        action: `Cập nhật thương hiệu: ${existing.name}`,
        actionType: 'update',
        metadata: { userName: logUserName },
        createdBy: logUserName,
      }
    }).catch(e => logError('[ActivityLog] brand update failed', e))

    return { success: true, data: brand }
  } catch (error) {
    logError('Error updating brand', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật thương hiệu',
    }
  }
}

export async function deleteBrandAction(
  systemId: string
): Promise<ActionResult<Brand>> {
  const authResult = await requireActionPermission('delete_products')
  if (!authResult.success) return authResult
  const { session } = authResult

  try {
    const brand = await prisma.brand.update({
      where: { systemId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    revalidatePath('/brands')

    const logUserName = getSessionUserName(session)
    prisma.activityLog.create({
      data: {
        entityType: 'brand',
        entityId: systemId,
        action: `Xóa thương hiệu: ${brand.name}`,
        actionType: 'delete',
        metadata: { userName: logUserName },
        createdBy: logUserName,
      }
    }).catch(e => logError('[ActivityLog] brand delete failed', e))

    return { success: true, data: brand }
  } catch (error) {
    logError('Error deleting brand', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xóa thương hiệu',
    }
  }
}

export async function restoreBrandAction(
  systemId: string
): Promise<ActionResult<Brand>> {
  const authResult = await requireActionPermission('edit_products')
  if (!authResult.success) return authResult
  const { session } = authResult

  try {
    const brand = await prisma.brand.update({
      where: { systemId },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    })

    revalidatePath('/brands')

    const logUserName = getSessionUserName(session)
    prisma.activityLog.create({
      data: {
        entityType: 'brand',
        entityId: systemId,
        action: `Khôi phục thương hiệu: ${brand.name}`,
        actionType: 'update',
        metadata: { userName: logUserName },
        createdBy: logUserName,
      }
    }).catch(e => logError('[ActivityLog] brand restore failed', e))

    return { success: true, data: brand }
  } catch (error) {
    logError('Error restoring brand', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể khôi phục thương hiệu',
    }
  }
}

