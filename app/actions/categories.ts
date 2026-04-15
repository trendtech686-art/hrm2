'use server'

/**
 * Server Actions for Categories Management (Danh mục)
 */

import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { requireActionPermission } from '@/lib/api-utils'
import type { ActionResult } from '@/types/action-result'
import { createCategorySchema, updateCategorySchema } from '@/features/categories/validation'
import { logError } from '@/lib/logger'
import { getSessionUserName } from '@/lib/get-user-name'

// Types
type Category = NonNullable<Awaited<ReturnType<typeof prisma.category.findFirst>>>

export type CreateCategoryInput = {
  name: string
  slug?: string
  parentId?: string
  seoTitle?: string
  metaDescription?: string
  seoKeywords?: string
  shortDescription?: string
  longDescription?: string
  ogImage?: string
  websiteSeo?: Record<string, unknown>
  path?: string
  level?: number
  color?: string
  icon?: string
  imageUrl?: string
  thumbnail?: string
  description?: string
  sortOrder?: number
  isActive?: boolean
}

export type UpdateCategoryInput = {
  systemId: string
  name?: string
  slug?: string
  parentId?: string | null
  seoTitle?: string
  metaDescription?: string
  seoKeywords?: string
  shortDescription?: string
  longDescription?: string
  ogImage?: string
  websiteSeo?: Record<string, unknown>
  path?: string
  level?: number
  color?: string
  icon?: string
  imageUrl?: string
  thumbnail?: string
  description?: string
  sortOrder?: number
  isActive?: boolean
}

// ====================================
// ACTIONS
// ====================================

export async function createCategoryAction(
  input: CreateCategoryInput
): Promise<ActionResult<Category>> {
  const authResult = await requireActionPermission('create_products')
  if (!authResult.success) return authResult
  const { session } = authResult

  const validated = createCategorySchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const systemId = await generateIdWithPrefix('CAT', prisma)

    // Calculate level and path if parent exists
    let level = 0
    let path = input.name

    if (input.parentId) {
      const parent = await prisma.category.findUnique({
        where: { systemId: input.parentId },
      })
      if (parent) {
        level = (parent.level ?? 0) + 1
        path = parent.path ? `${parent.path} > ${input.name}` : input.name
      }
    }

    const category = await prisma.category.create({
      data: {
        systemId,
        id: systemId,
        name: input.name,
        slug: input.slug,
        parentId: input.parentId,
        seoTitle: input.seoTitle,
        metaDescription: input.metaDescription,
        seoKeywords: input.seoKeywords,
        shortDescription: input.shortDescription,
        longDescription: input.longDescription,
        ogImage: input.ogImage,
        websiteSeo: input.websiteSeo as Prisma.InputJsonValue,
        path: input.path ?? path,
        level: input.level ?? level,
        color: input.color,
        icon: input.icon,
        imageUrl: input.imageUrl,
        thumbnail: input.thumbnail,
        description: input.description,
        sortOrder: input.sortOrder ?? 0,
        isActive: input.isActive ?? true,
      },
    })

    revalidatePath('/categories')

    const logUserName = getSessionUserName(session)
    prisma.activityLog.create({
      data: {
        entityType: 'category',
        entityId: systemId,
        action: `Tạo danh mục: ${input.name}`,
        actionType: 'create',
        metadata: { userName: logUserName },
        createdBy: logUserName,
      }
    }).catch(e => logError('[ActivityLog] category create failed', e))

    return { success: true, data: category }
  } catch (error) {
    logError('Error creating category', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tạo danh mục',
    }
  }
}

export async function updateCategoryAction(
  input: UpdateCategoryInput
): Promise<ActionResult<Category>> {
  const authResult = await requireActionPermission('edit_products')
  if (!authResult.success) return authResult
  const { session } = authResult

  const validated = updateCategorySchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const { systemId, ...data } = input

    const existing = await prisma.category.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy danh mục' }
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.name !== undefined) updateData.name = data.name
    if (data.slug !== undefined) updateData.slug = data.slug
    if (data.parentId !== undefined) updateData.parentId = data.parentId
    if (data.seoTitle !== undefined) updateData.seoTitle = data.seoTitle
    if (data.metaDescription !== undefined) updateData.metaDescription = data.metaDescription
    if (data.seoKeywords !== undefined) updateData.seoKeywords = data.seoKeywords
    if (data.shortDescription !== undefined) updateData.shortDescription = data.shortDescription
    if (data.longDescription !== undefined) updateData.longDescription = data.longDescription
    if (data.ogImage !== undefined) updateData.ogImage = data.ogImage
    if (data.websiteSeo !== undefined) updateData.websiteSeo = data.websiteSeo as Prisma.InputJsonValue
    if (data.path !== undefined) updateData.path = data.path
    if (data.level !== undefined) updateData.level = data.level
    if (data.color !== undefined) updateData.color = data.color
    if (data.icon !== undefined) updateData.icon = data.icon
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl
    if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail
    if (data.description !== undefined) updateData.description = data.description
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder
    if (data.isActive !== undefined) updateData.isActive = data.isActive

    const category = await prisma.category.update({
      where: { systemId },
      data: updateData,
    })

    revalidatePath('/categories')
    revalidatePath(`/categories/${systemId}`)

    const logUserName = getSessionUserName(session)
    prisma.activityLog.create({
      data: {
        entityType: 'category',
        entityId: systemId,
        action: `Cập nhật danh mục: ${existing.name}`,
        actionType: 'update',
        metadata: { userName: logUserName },
        createdBy: logUserName,
      }
    }).catch(e => logError('[ActivityLog] category update failed', e))

    return { success: true, data: category }
  } catch (error) {
    logError('Error updating category', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật danh mục',
    }
  }
}

export async function deleteCategoryAction(
  systemId: string
): Promise<ActionResult<Category>> {
  const authResult = await requireActionPermission('delete_products')
  if (!authResult.success) return authResult
  const { session } = authResult
  try {
    const category = await prisma.category.update({
      where: { systemId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    revalidatePath('/categories')

    const logUserName = getSessionUserName(session)
    prisma.activityLog.create({
      data: {
        entityType: 'category',
        entityId: systemId,
        action: `Xóa danh mục: ${category.name}`,
        actionType: 'delete',
        metadata: { userName: logUserName },
        createdBy: logUserName,
      }
    }).catch(e => logError('[ActivityLog] category delete failed', e))

    return { success: true, data: category }
  } catch (error) {
    logError('Error deleting category', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xóa danh mục',
    }
  }
}

export async function restoreCategoryAction(
  systemId: string
): Promise<ActionResult<Category>> {
  const authResult = await requireActionPermission('edit_products')
  if (!authResult.success) return authResult
  const { session } = authResult
  try {
    const category = await prisma.category.update({
      where: { systemId },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    })

    revalidatePath('/categories')

    const logUserName = getSessionUserName(session)
    prisma.activityLog.create({
      data: {
        entityType: 'category',
        entityId: systemId,
        action: `Khôi phục danh mục: ${category.name}`,
        actionType: 'update',
        metadata: { userName: logUserName },
        createdBy: logUserName,
      }
    }).catch(e => logError('[ActivityLog] category restore failed', e))

    return { success: true, data: category }
  } catch (error) {
    logError('Error restoring category', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể khôi phục danh mục',
    }
  }
}

