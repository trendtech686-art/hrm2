import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

// Helper: compute path + level
async function computePathAndLevel(name: string, parentId?: string | null) {
  if (!parentId) {
    return { path: name, level: 0 }
  }

  const parent = await prisma.category.findUnique({
    where: { systemId: parentId },
    select: { path: true, level: true, name: true },
  })

  if (!parent) {
    return { path: name, level: 0 }
  }

  const parentPath = parent.path || parent.name
  const parentLevel = parent.level ?? 0
  return {
    path: `${parentPath} > ${name}`,
    level: parentLevel + 1,
  }
}

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/categories/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const category = await prisma.category.findUnique({
      where: { systemId },
      include: {
        parent: true,
        children: {
          where: { isDeleted: false },
          orderBy: { sortOrder: 'asc' },
        },
        productCategories: {
          take: 10,
          include: {
            product: {
              select: {
                systemId: true,
                id: true,
                name: true,
                imageUrl: true,
              },
            },
          },
        },
        _count: { select: { productCategories: true, children: true } },
      },
    })

    if (!category) {
      return apiNotFound('Danh mục')
    }

    return apiSuccess(category)
  } catch (error) {
    console.error('Error fetching category:', error)
    return apiError('Failed to fetch category', 500)
  }
}

// PUT /api/categories/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params
    const body = await request.json()

    const existing = await prisma.category.findUnique({
      where: { systemId },
      select: {
        name: true,
        parentId: true,
        slug: true,
        seoTitle: true,
        metaDescription: true,
        seoKeywords: true,
        shortDescription: true,
        longDescription: true,
        ogImage: true,
        websiteSeo: true,
        isActive: true,
      },
    })

    if (!existing) {
      return apiNotFound('Danh mục')
    }

    const name = body.name ?? existing.name
    const parentId = body.parentId === undefined ? existing.parentId : (body.parentId || null)
    const { path, level } = await computePathAndLevel(name, parentId)

    const category = await prisma.category.update({
      where: { systemId },
      data: {
        name,
        description: body.description,
        imageUrl: body.thumbnail || body.imageUrl,
        thumbnail: body.thumbnail || body.imageUrl,
        parentId,
        sortOrder: body.sortOrder,
        slug: body.slug ?? existing.slug,
        seoTitle: body.seoTitle ?? existing.seoTitle,
        metaDescription: body.metaDescription ?? existing.metaDescription,
        seoKeywords: body.seoKeywords ?? existing.seoKeywords,
        shortDescription: body.shortDescription ?? existing.shortDescription,
        longDescription: body.longDescription ?? existing.longDescription,
        ogImage: body.ogImage ?? existing.ogImage,
        websiteSeo: body.websiteSeo ?? existing.websiteSeo,
        isActive: body.isActive ?? existing.isActive,
        path,
        level,
      },
      include: {
        parent: true,
      },
    })

    return apiSuccess(category)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Danh mục')
    }
    console.error('Error updating category:', error)
    return apiError('Failed to update category', 500)
  }
}

// PATCH /api/categories/[systemId] - Same as PUT for partial updates
export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params
    const body = await request.json()

    const existing = await prisma.category.findUnique({ where: { systemId } })
    if (!existing) {
      return apiNotFound('Danh mục')
    }

    const name = body.name ?? existing.name
    const parentId = body.parentId === undefined ? existing.parentId : (body.parentId || null)
    const { path, level } = await computePathAndLevel(name, parentId)

    const category = await prisma.category.update({
      where: { systemId },
      data: {
        name,
        description: body.description ?? existing.description,
        imageUrl: body.thumbnail || body.imageUrl || existing.imageUrl,
        thumbnail: body.thumbnail || existing.thumbnail || body.imageUrl,
        parentId,
        sortOrder: body.sortOrder ?? existing.sortOrder,
        slug: body.slug ?? existing.slug,
        seoTitle: body.seoTitle ?? existing.seoTitle,
        metaDescription: body.metaDescription ?? existing.metaDescription,
        seoKeywords: body.seoKeywords ?? existing.seoKeywords,
        shortDescription: body.shortDescription ?? existing.shortDescription,
        longDescription: body.longDescription ?? existing.longDescription,
        ogImage: body.ogImage ?? existing.ogImage,
        websiteSeo: body.websiteSeo ?? existing.websiteSeo,
        isActive: body.isActive ?? existing.isActive,
        path,
        level,
      },
      include: {
        parent: true,
      },
    })

    return apiSuccess(category)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Danh mục')
    }
    console.error('Error updating category:', error)
    return apiError('Failed to update category', 500)
  }
}

// DELETE /api/categories/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    // Use transaction to ensure consistency
    await prisma.$transaction(async (tx) => {
      // 1. Update children to become orphans (remove parent reference)
      await tx.category.updateMany({
        where: { parentId: systemId, isDeleted: false },
        data: { parentId: null, level: 0 },
      })

      // 2. Delete PKGX mapping for this category
      await tx.pkgxCategoryMapping.deleteMany({
        where: { hrmCategoryId: systemId },
      })

      // 3. Soft delete the category
      await tx.category.update({
        where: { systemId },
        data: { isDeleted: true },
      })
    })

    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Danh mục')
    }
    console.error('Error deleting category:', error)
    return apiError('Failed to delete category', 500)
  }
}
