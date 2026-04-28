import { prisma } from '@/lib/prisma'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { updateWikiSchema } from './validation'
import { logError } from '@/lib/logger'
import { getUserNameFromDb } from '@/lib/get-user-name'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/wiki/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    // Try to find by systemId first, then by slug
    let wiki = await prisma.wiki.findUnique({
      where: { systemId },
      select: {
        systemId: true,
        id: true,
        title: true,
        slug: true,
        content: true,
        category: true,
        tags: true,
        isPublished: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: { systemId: true, fullName: true },
        },
      },
    })

    if (!wiki) {
      wiki = await prisma.wiki.findUnique({
        where: { slug: systemId },
        select: {
          systemId: true,
          id: true,
          title: true,
          slug: true,
          content: true,
          category: true,
          tags: true,
          isPublished: true,
          isDeleted: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: { systemId: true, fullName: true },
          },
        },
      })
    }

    if (!wiki) {
      return apiError('Bài viết không tồn tại', 404)
    }

    return apiSuccess(wiki)
  } catch (error) {
    logError('Error fetching wiki', error)
    return apiError('Failed to fetch wiki', 500)
  }
}

// PUT /api/wiki/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, updateWikiSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const { systemId } = await params

    const wiki = await prisma.wiki.update({
      where: { systemId },
      data: {
        title: body.title,
        slug: body.slug,
        content: body.content,
        category: body.categoryId || body.category,
        tags: body.tags,
        isPublished: body.isPublished,
      },
    })

    return apiSuccess(wiki)
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiError('Bài viết không tồn tại', 404)
    }
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return apiError('Slug đã tồn tại', 400)
    }
    logError('Error updating wiki', error)
    return apiError('Failed to update wiki', 500)
  }
}

// DELETE /api/wiki/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    await prisma.wiki.update({
      where: { systemId },
      data: { isDeleted: true },
    })

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'wiki',
          entityId: systemId,
          action: 'deleted',
          actionType: 'delete',
          note: `Xóa bài viết wiki`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] wiki delete failed', e))
    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiError('Bài viết không tồn tại', 404)
    }
    logError('Error deleting wiki', error)
    return apiError('Failed to delete wiki', 500)
  }
}
