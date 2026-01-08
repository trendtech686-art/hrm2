import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

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

    const category = await prisma.category.update({
      where: { systemId },
      data: {
        name: body.name,
        description: body.description,
        imageUrl: body.thumbnail || body.imageUrl,
        parentId: body.parentId,
        sortOrder: body.sortOrder,
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

    const category = await prisma.category.update({
      where: { systemId },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
        ...(body.thumbnail !== undefined && { imageUrl: body.thumbnail }),
        ...(body.parentId !== undefined && { parentId: body.parentId }),
        ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
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

    await prisma.category.update({
      where: { systemId },
      data: { isDeleted: true },
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
