import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/brands/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const brand = await prisma.brand.findUnique({
      where: { systemId },
      include: {
        products: {
          where: { isDeleted: false },
          take: 10,
          select: {
            systemId: true,
            id: true,
            name: true,
            imageUrl: true,
          },
        },
        _count: { select: { products: true } },
      },
    })

    if (!brand) {
      return apiNotFound('Thương hiệu')
    }

    return apiSuccess(brand)
  } catch (error) {
    console.error('Error fetching brand:', error)
    return apiError('Failed to fetch brand', 500)
  }
}

// PUT /api/brands/[systemId]
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params
    const body = await request.json()

    const brand = await prisma.brand.update({
      where: { systemId },
      data: {
        name: body.name,
        description: body.description,
        logoUrl: body.logo || body.logoUrl,
        website: body.website,
      },
    })

    return apiSuccess(brand)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Thương hiệu')
    }
    console.error('Error updating brand:', error)
    return apiError('Failed to update brand', 500)
  }
}

// PATCH /api/brands/[systemId] - Same as PUT for partial updates
export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params
    const body = await request.json()

    const brand = await prisma.brand.update({
      where: { systemId },
      data: {
        ...(body.id !== undefined && { id: body.id }),
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.logo !== undefined && { logoUrl: body.logo }),
        ...(body.logoUrl !== undefined && { logoUrl: body.logoUrl }),
        ...(body.website !== undefined && { website: body.website }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.seoTitle !== undefined && { seoTitle: body.seoTitle }),
        ...(body.metaDescription !== undefined && { metaDescription: body.metaDescription }),
        ...(body.shortDescription !== undefined && { shortDescription: body.shortDescription }),
        ...(body.longDescription !== undefined && { longDescription: body.longDescription }),
        ...(body.websiteSeo !== undefined && { websiteSeo: body.websiteSeo }),
      },
    })

    return apiSuccess(brand)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Thương hiệu')
    }
    console.error('Error updating brand:', error)
    return apiError('Failed to update brand', 500)
  }
}

// DELETE /api/brands/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    // Use transaction to ensure consistency
    await prisma.$transaction(async (tx) => {
      // 1. Delete PKGX mapping for this brand
      await tx.pkgxBrandMapping.deleteMany({
        where: { hrmBrandId: systemId },
      })

      // 2. Soft delete the brand
      await tx.brand.update({
        where: { systemId },
        data: { isDeleted: true },
      })
    })

    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Thương hiệu')
    }
    console.error('Error deleting brand:', error)
    return apiError('Failed to delete brand', 500)
  }
}
