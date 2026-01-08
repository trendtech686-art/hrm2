import { prisma } from '@/lib/prisma'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { createCommentSchema } from './validation'

// GET /api/comments?entityType=xxx&entityId=xxx
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const entityType = searchParams.get('entityType')
    const entityId = searchParams.get('entityId')

    if (!entityType || !entityId) {
      return apiError('entityType và entityId là bắt buộc', 400)
    }

    const comments = await prisma.comment.findMany({
      where: {
        entityType,
        entityId,
      },
      orderBy: { createdAt: 'desc' },
    })

    return apiSuccess(comments)
  } catch (error) {
    console.error('Error fetching comments:', error)
    return apiError('Failed to fetch comments', 500)
  }
}

// POST /api/comments - Create new comment
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, createCommentSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const comment = await prisma.comment.create({
      data: {
        entityType: body.entityType,
        entityId: body.entityId,
        content: body.content,
        attachments: body.attachments || [],
        createdBy: body.createdBy,
        createdByName: body.createdByName || body.author,
      },
    })

    return apiSuccess(comment, 201)
  } catch (error) {
    console.error('Error creating comment:', error)
    return apiError('Failed to create comment', 500)
  }
}

// DELETE /api/comments - Delete comment (by systemId in body)
export async function DELETE(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const systemId = searchParams.get('systemId')

    if (!systemId) {
      return apiError('systemId là bắt buộc', 400)
    }

    await prisma.comment.delete({
      where: { systemId },
    })

    return apiSuccess({ success: true })
  } catch (error) {
    console.error('Error deleting comment:', error)
    return apiError('Failed to delete comment', 500)
  }
}