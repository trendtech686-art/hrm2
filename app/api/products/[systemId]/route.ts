import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/products/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const product = await prisma.product.findUnique({
      where: { systemId },
      include: {
        brand: true,
        productCategories: {
          include: {
            category: true,
          },
        },
        inventoryRecords: true,
        prices: {
          include: {
            pricingPolicy: true,
          },
        },
      },
    })

    if (!product) {
      return apiNotFound('Product')
    }

    return apiSuccess(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return apiError('Failed to fetch product', 500)
  }
}

// PATCH /api/products/[systemId]
export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params
    const body = await request.json()

    // Extract category IDs if provided
    const { categoryIds, brandId, ...updateData } = body

    // Build update object
    const data: Record<string, unknown> = {
      ...updateData,
      updatedAt: new Date(),
    }

    // Handle brand connection
    if (brandId !== undefined) {
      data.brand = brandId 
        ? { connect: { systemId: brandId } } 
        : { disconnect: true }
    }

    // Handle image fields mapping
    if (body.thumbnailImage !== undefined) {
      data.thumbnailImage = body.thumbnailImage
      data.imageUrl = body.thumbnailImage
    }
    if (body.galleryImages !== undefined) {
      data.galleryImages = body.galleryImages
    }
    if (body.images !== undefined) {
      data.galleryImages = body.images
    }

    const product = await prisma.product.update({
      where: { systemId },
      data,
      include: {
        brand: true,
        productCategories: {
          include: {
            category: true,
          },
        },
      },
    })

    // Update categories if provided
    if (categoryIds !== undefined) {
      // Remove existing categories
      await prisma.productCategory.deleteMany({
        where: { productId: systemId },
      })

      // Add new categories
      if (categoryIds.length > 0) {
        await prisma.productCategory.createMany({
          data: categoryIds.map((categoryId: string) => ({
            productId: systemId,
            categoryId,
          })),
        })
      }
    }

    return apiSuccess(product)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Product')
    }
    console.error('Error updating product:', error)
    return apiError('Failed to update product', 500)
  }
}

// DELETE /api/products/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    // Soft delete
    await prisma.product.update({
      where: { systemId },
      data: { 
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return apiNotFound('Product')
    }
    console.error('Error deleting product:', error)
    return apiError('Failed to delete product', 500)
  }
}
