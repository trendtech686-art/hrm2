import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/products/[systemId]
export async function GET(request: Request, { params }: RouteParams) {
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
      return NextResponse.json(
        { error: 'Sản phẩm không tồn tại' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PATCH /api/products/[systemId]
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { systemId } = await params
    const body = await request.json()

    // Extract category IDs if provided
    const { categoryIds, brandId, ...updateData } = body

    // Build update object
    const data: any = {
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

    return NextResponse.json(product)
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Sản phẩm không tồn tại' },
        { status: 404 }
      )
    }
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[systemId]
export async function DELETE(request: Request, { params }: RouteParams) {
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

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Sản phẩm không tồn tại' },
        { status: 404 }
      )
    }
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
