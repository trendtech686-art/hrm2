import { prisma } from '@/lib/prisma'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { createCommentSchema, updateCommentSchema } from './validation'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'
import { createBulkNotifications } from '@/lib/notifications'

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

    // ✅ PERFORMANCE: Fetch comments + draft in parallel (saves separate user-preferences calls)
    const draftKey = `comment-draft-${entityType}-${entityId}`
    const userId = session.user?.id

    const [comments, draftPref] = await Promise.all([
      prisma.comment.findMany({
        where: {
          entityType,
          entityId,
        },
        orderBy: { createdAt: 'desc' },
      }),
      userId
        ? prisma.userPreference.findFirst({
            where: {
              userId,
              key: draftKey,
              category: 'drafts',
            },
            select: { value: true },
          })
        : null,
    ])

    // Draft value is stored as JSON, extract the string
    const draft = draftPref?.value ?? null

    return apiSuccess({ comments, draft })
  } catch (error) {
    logError('Error fetching comments', error)
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

    createActivityLog({
      entityType: 'comment',
      entityId: comment.systemId,
      action: 'created',
      actionType: 'create',
      metadata: { entityType: body.entityType, entityId: body.entityId },
      createdBy: body.createdByName || body.author || session.user?.employee?.fullName || session.user?.email || 'System',
    })

    // Notify previous commenters on the same entity (excluding the author)
    const previousCommenters = await prisma.comment.findMany({
      where: {
        entityType: body.entityType,
        entityId: body.entityId,
        systemId: { not: comment.systemId },
        createdBy: { not: null },
      },
      select: { createdBy: true },
      distinct: ['createdBy'],
    })

    const recipientIds = previousCommenters
      .map(c => c.createdBy!)
      .filter(id => id !== body.createdBy)

    if (recipientIds.length > 0) {
      const senderName = body.createdByName || body.author || session.user?.employee?.fullName || 'Ai đó'
      createBulkNotifications({
        type: 'comment',
        title: 'Bình luận mới',
        message: `${senderName} đã bình luận trên ${body.entityType} bạn đang theo dõi`,
        link: `/${body.entityType}s/${body.entityId}`,
        recipientIds,
        senderId: body.createdBy || session.user?.employeeId,
        senderName,
        settingsKey: 'comment:created',
      }).catch(e => logError('[Comment] notification failed', e))
    }

    return apiSuccess(comment, 201)
  } catch (error) {
    logError('Error creating comment', error)
    return apiError('Failed to create comment', 500)
  }
}

// PUT /api/comments?systemId=xxx - Update comment
export async function PUT(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const { searchParams } = new URL(request.url)
  const systemId = searchParams.get('systemId')
  if (!systemId) {
    return apiError('systemId là bắt buộc', 400)
  }

  const validation = await validateBody(request, updateCommentSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const comment = await prisma.comment.update({
      where: { systemId },
      data: {
        ...(body.content !== undefined && { content: body.content }),
        ...(body.attachments !== undefined && { attachments: body.attachments }),
        updatedBy: session.user?.id,
      },
    })

    createActivityLog({
      entityType: 'comment',
      entityId: systemId,
      action: 'updated',
      actionType: 'update',
      createdBy: session.user?.employee?.fullName || session.user?.email || 'System',
    })

    return apiSuccess(comment)
  } catch (error) {
    logError('Error updating comment', error)
    return apiError('Failed to update comment', 500)
  }
}

// DELETE /api/comments - Delete comment (by systemId query param)
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

    createActivityLog({
      entityType: 'comment',
      entityId: systemId,
      action: 'deleted',
      actionType: 'delete',
      createdBy: session.user?.employee?.fullName || session.user?.email || 'System',
    })

    return apiSuccess({ success: true })
  } catch (error) {
    logError('Error deleting comment', error)
    return apiError('Failed to delete comment', 500)
  }
}