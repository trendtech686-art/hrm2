'use server'

/**
 * Server Actions for Wiki Management (Bài viết Wiki)
 * 
 * These are server-side functions that can be called directly from Client Components.
 * They use Prisma transactions for atomic operations.
 */

import { prisma } from '@/lib/prisma'
import { requireActionPermission } from '@/lib/api-utils'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix } from '@/lib/id-generator'
import type { ActionResult } from '@/types/action-result'
import { createWikiSchema, updateWikiSchema } from '@/features/wiki/validation'
import { logError } from '@/lib/logger'

// ====================================
// TYPES
// ====================================

export type CreateWikiInput = {
  title: string
  content: string
  category: string
  tags?: string[]
  authorId?: string
}

export type UpdateWikiInput = {
  systemId: string
  title?: string
  content?: string
  category?: string
  tags?: string[]
  authorId?: string
}

export type DeleteWikiInput = {
  systemId: string
}

// ====================================
// CREATE WIKI
// ====================================

export async function createWikiAction(
  input: CreateWikiInput
): Promise<ActionResult> {
  const authResult = await requireActionPermission('create_wiki')
  if (!authResult.success) return authResult

  const validated = createWikiSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  const { title, content, category } = input

  if (!title) {
    return { success: false, error: 'Vui lòng nhập tiêu đề' }
  }

  if (!content) {
    return { success: false, error: 'Vui lòng nhập nội dung' }
  }

  if (!category) {
    return { success: false, error: 'Vui lòng chọn danh mục' }
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const now = new Date()
      const systemId = await generateIdWithPrefix('WIKI', tx)

      const wiki = await tx.wiki.create({
        data: {
          systemId,
          id: systemId,
          title,
          content,
          category,
          tags: input.tags || [],
          authorId: input.authorId || null,
          createdAt: now,
          updatedAt: now,
        },
      })

      return wiki
    })

    revalidatePath('/wiki')

    return { success: true, data: result }
  } catch (error) {
    logError('createWikiAction error', error)
    return { success: false, error: 'Không thể tạo bài viết' }
  }
}

// ====================================
// UPDATE WIKI
// ====================================

export async function updateWikiAction(
  input: UpdateWikiInput
): Promise<ActionResult> {
  const authResult = await requireActionPermission('edit_wiki')
  if (!authResult.success) return authResult

  const validated = updateWikiSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  const { systemId, ...updateData } = input

  if (!systemId) {
    return { success: false, error: 'Thiếu systemId' }
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.wiki.findUnique({
        where: { systemId },
      })

      if (!existing) {
        throw new Error('Không tìm thấy bài viết')
      }

      const data: Record<string, unknown> = {
        updatedAt: new Date(),
      }

      if (updateData.title !== undefined) data.title = updateData.title
      if (updateData.content !== undefined) data.content = updateData.content
      if (updateData.category !== undefined) data.category = updateData.category
      if (updateData.tags !== undefined) data.tags = updateData.tags
      if (updateData.authorId !== undefined) data.authorId = updateData.authorId

      const wiki = await tx.wiki.update({
        where: { systemId },
        data,
      })

      return wiki
    })

    revalidatePath('/wiki')
    revalidatePath(`/wiki/${systemId}`)

    return { success: true, data: result }
  } catch (error) {
    logError('updateWikiAction error', error)
    const message = error instanceof Error ? error.message : 'Không thể cập nhật bài viết'
    return { success: false, error: message }
  }
}

// ====================================
// DELETE WIKI
// ====================================

export async function deleteWikiAction(
  input: DeleteWikiInput
): Promise<ActionResult> {
  const authResult = await requireActionPermission('delete_wiki')
  if (!authResult.success) return authResult

  const { systemId } = input

  if (!systemId) {
    return { success: false, error: 'Thiếu systemId' }
  }

  try {
    await prisma.wiki.delete({
      where: { systemId },
    })

    revalidatePath('/wiki')

    return { success: true }
  } catch (error) {
    logError('deleteWikiAction error', error)
    const message = error instanceof Error ? error.message : 'Không thể xóa bài viết'
    return { success: false, error: message }
  }
}
