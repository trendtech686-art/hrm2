'use server'

/**
 * Server Actions for Products Management (Sản phẩm)
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { serializeDecimals } from '@/lib/api-utils'
import { auth } from '@/auth'
import type { ActionResult } from '@/types/action-result'
import { productFormSchema } from '@/features/products/validation'

// Types
type Product = NonNullable<Awaited<ReturnType<typeof prisma.product.findFirst>>>

export type CreateProductInput = {
  name: string
  description?: string
  shortDescription?: string
  thumbnailImage?: string
  imageUrl?: string
  galleryImages?: string[]
  type?: string
  brandId?: string
  unit?: string
  costPrice?: number
  isStockTracked?: boolean
  reorderLevel?: number
  safetyStock?: number
  maxStock?: number
  weight?: number
  weightUnit?: string
  barcode?: string
  warrantyPeriodMonths?: number
  primarySupplierId?: string
  isPublished?: boolean
  isFeatured?: boolean
  sortOrder?: number
  seoDescription?: string
  seoKeywords?: string
  slug?: string
  ktitle?: string
  videoLinks?: string[]
  seoPkgx?: unknown
  seoTrendtech?: unknown
  productTypeSystemId?: string
  categorySystemIds?: string[]
  categories?: string[]
  subCategory?: string
  subCategories?: string[]
  warehouseLocation?: string
  storageLocationSystemId?: string
  tags?: string[]
  pkgxId?: number
  trendtechId?: number
  dimensions?: unknown
  createdBy?: string
}

export type UpdateProductInput = {
  systemId: string
  name?: string
  description?: string
  shortDescription?: string
  thumbnailImage?: string
  imageUrl?: string
  galleryImages?: string[]
  type?: string
  brandId?: string | null
  unit?: string
  costPrice?: number
  lastPurchasePrice?: number
  isStockTracked?: boolean
  reorderLevel?: number
  safetyStock?: number
  maxStock?: number
  weight?: number
  weightUnit?: string
  barcode?: string
  warrantyPeriodMonths?: number
  primarySupplierId?: string | null
  isPublished?: boolean
  isFeatured?: boolean
  sortOrder?: number
  seoDescription?: string
  seoKeywords?: string
  slug?: string
  status?: string
  ktitle?: string
  videoLinks?: string[]
  seoPkgx?: unknown
  seoTrendtech?: unknown
  productTypeSystemId?: string
  categorySystemIds?: string[]
  categories?: string[]
  subCategory?: string
  subCategories?: string[]
  warehouseLocation?: string
  storageLocationSystemId?: string
  tags?: string[]
  pkgxId?: number
  trendtechId?: number
  dimensions?: unknown
  updatedBy?: string
}

// ====================================
// ACTIONS
// ====================================

export async function createProductAction(
  input: CreateProductInput
): Promise<ActionResult<Product>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  const validated = productFormSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }
  try {
    const systemId = await generateIdWithPrefix('SP', prisma)

    const product = await prisma.product.create({
      data: {
        systemId,
        id: systemId,
        name: input.name,
        description: input.description,
        shortDescription: input.shortDescription,
        thumbnailImage: input.thumbnailImage,
        imageUrl: input.imageUrl,
        galleryImages: input.galleryImages ?? [],
        type: (input.type as 'PHYSICAL' | 'SERVICE' | 'DIGITAL' | 'COMBO') ?? 'PHYSICAL',
        brandId: input.brandId,
        unit: input.unit ?? 'Cái',
        costPrice: input.costPrice ?? 0,
        isStockTracked: input.isStockTracked ?? true,
        reorderLevel: input.reorderLevel,
        safetyStock: input.safetyStock,
        maxStock: input.maxStock,
        weight: input.weight,
        weightUnit: (input.weightUnit as 'GRAM' | 'KILOGRAM') ?? 'GRAM',
        barcode: input.barcode,
        warrantyPeriodMonths: input.warrantyPeriodMonths ?? 12,
        primarySupplierId: input.primarySupplierId,
        isPublished: input.isPublished ?? false,
        isFeatured: input.isFeatured ?? false,
        sortOrder: input.sortOrder,
        seoDescription: input.seoDescription,
        seoKeywords: input.seoKeywords,
        slug: input.slug,
        ktitle: input.ktitle,
        videoLinks: input.videoLinks ?? [],
        seoPkgx: input.seoPkgx as never,
        seoTrendtech: input.seoTrendtech as never,
        productTypeSystemId: input.productTypeSystemId,
        categorySystemIds: input.categorySystemIds ?? [],
        categories: input.categories ?? [],
        subCategory: input.subCategory,
        subCategories: input.subCategories ?? [],
        warehouseLocation: input.warehouseLocation,
        storageLocationSystemId: input.storageLocationSystemId,
        tags: input.tags ?? [],
        pkgxId: input.pkgxId,
        trendtechId: input.trendtechId,
        dimensions: input.dimensions as never,
        createdBy: input.createdBy,
      },
    })

    revalidatePath('/products')
    return { success: true, data: serializeDecimals(product) }
  } catch (error) {
    console.error('Error creating product:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tạo sản phẩm',
    }
  }
}

export async function updateProductAction(
  input: UpdateProductInput
): Promise<ActionResult<Product>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  const validated = productFormSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }
  try {
    const { systemId, ...data } = input

    const existing = await prisma.product.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy sản phẩm' }
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.name !== undefined) updateData.name = data.name
    if (data.description !== undefined) updateData.description = data.description
    if (data.shortDescription !== undefined) updateData.shortDescription = data.shortDescription
    if (data.thumbnailImage !== undefined) updateData.thumbnailImage = data.thumbnailImage
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl
    if (data.galleryImages !== undefined) updateData.galleryImages = data.galleryImages
    if (data.type !== undefined) updateData.type = data.type
    if (data.brandId !== undefined) updateData.brandId = data.brandId
    if (data.unit !== undefined) updateData.unit = data.unit
    if (data.costPrice !== undefined) updateData.costPrice = data.costPrice
    if (data.lastPurchasePrice !== undefined) updateData.lastPurchasePrice = data.lastPurchasePrice
    if (data.isStockTracked !== undefined) updateData.isStockTracked = data.isStockTracked
    if (data.reorderLevel !== undefined) updateData.reorderLevel = data.reorderLevel
    if (data.safetyStock !== undefined) updateData.safetyStock = data.safetyStock
    if (data.maxStock !== undefined) updateData.maxStock = data.maxStock
    if (data.weight !== undefined) updateData.weight = data.weight
    if (data.weightUnit !== undefined) updateData.weightUnit = data.weightUnit
    if (data.barcode !== undefined) updateData.barcode = data.barcode
    if (data.warrantyPeriodMonths !== undefined) updateData.warrantyPeriodMonths = data.warrantyPeriodMonths
    if (data.primarySupplierId !== undefined) updateData.primarySupplierId = data.primarySupplierId
    if (data.isPublished !== undefined) updateData.isPublished = data.isPublished
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured
    if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder
    if (data.seoDescription !== undefined) updateData.seoDescription = data.seoDescription
    if (data.seoKeywords !== undefined) updateData.seoKeywords = data.seoKeywords
    if (data.slug !== undefined) updateData.slug = data.slug
    if (data.status !== undefined) updateData.status = data.status
    if (data.ktitle !== undefined) updateData.ktitle = data.ktitle
    if (data.videoLinks !== undefined) updateData.videoLinks = data.videoLinks
    if (data.seoPkgx !== undefined) updateData.seoPkgx = data.seoPkgx
    if (data.seoTrendtech !== undefined) updateData.seoTrendtech = data.seoTrendtech
    if (data.productTypeSystemId !== undefined) updateData.productTypeSystemId = data.productTypeSystemId
    if (data.categorySystemIds !== undefined) updateData.categorySystemIds = data.categorySystemIds
    if (data.categories !== undefined) updateData.categories = data.categories
    if (data.subCategory !== undefined) updateData.subCategory = data.subCategory
    if (data.subCategories !== undefined) updateData.subCategories = data.subCategories
    if (data.warehouseLocation !== undefined) updateData.warehouseLocation = data.warehouseLocation
    if (data.storageLocationSystemId !== undefined) updateData.storageLocationSystemId = data.storageLocationSystemId
    if (data.tags !== undefined) updateData.tags = data.tags
    if (data.pkgxId !== undefined) updateData.pkgxId = data.pkgxId
    if (data.trendtechId !== undefined) updateData.trendtechId = data.trendtechId
    if (data.dimensions !== undefined) updateData.dimensions = data.dimensions
    if (data.updatedBy !== undefined) updateData.updatedBy = data.updatedBy

    const product = await prisma.product.update({
      where: { systemId },
      data: updateData,
    })

    revalidatePath('/products')
    revalidatePath(`/products/${systemId}`)
    return { success: true, data: serializeDecimals(product) }
  } catch (error) {
    console.error('Error updating product:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật sản phẩm',
    }
  }
}

export async function deleteProductAction(
  systemId: string
): Promise<ActionResult<Product>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const product = await prisma.product.update({
      where: { systemId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: 'INACTIVE',
      },
    })

    revalidatePath('/products')
    return { success: true, data: serializeDecimals(product) }
  } catch (error) {
    console.error('Error deleting product:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xóa sản phẩm',
    }
  }
}

export async function restoreProductAction(
  systemId: string
): Promise<ActionResult<Product>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const product = await prisma.product.update({
      where: { systemId },
      data: {
        isDeleted: false,
        deletedAt: null,
        status: 'ACTIVE',
      },
    })

    revalidatePath('/products')
    return { success: true, data: serializeDecimals(product) }
  } catch (error) {
    console.error('Error restoring product:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật sản phẩm',
    }
  }
}

export async function getProductAction(
  systemId: string
): Promise<ActionResult<Product>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const product = await prisma.product.findUnique({
      where: { systemId },
      include: {
        brand: true,
        prices: true,
      },
    })

    if (!product) {
      return { success: false, error: 'Không tìm thấy sản phẩm' }
    }

    return { success: true, data: serializeDecimals(product) }
  } catch (error) {
    console.error('Error getting product:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tải sản phẩm',
    }
  }
}

export async function updateProductInventoryAction(
  systemId: string,
  branchSystemId: string,
  quantity: number,
  operation: 'set' | 'add' | 'subtract'
): Promise<ActionResult<Product>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const product = await prisma.product.findUnique({
      where: { systemId },
    })

    if (!product) {
      return { success: false, error: 'Không tìm thấy sản phẩm' }
    }

    const currentInventory = (product.inventoryByBranch as Record<string, number>) ?? {}
    const currentQty = currentInventory[branchSystemId] ?? 0

    let newQty: number
    switch (operation) {
      case 'set':
        newQty = quantity
        break
      case 'add':
        newQty = currentQty + quantity
        break
      case 'subtract':
        newQty = Math.max(0, currentQty - quantity)
        break
    }

    const newInventory = { ...currentInventory, [branchSystemId]: newQty }
    const totalInventory = Object.values(newInventory).reduce((sum, qty) => sum + qty, 0)

    const updated = await prisma.product.update({
      where: { systemId },
      data: {
        inventoryByBranch: newInventory,
        totalInventory,
        totalAvailable: totalInventory - (product.totalCommitted ?? 0),
        inventoryUpdatedAt: new Date(),
      },
    })

    revalidatePath('/products')
    revalidatePath(`/products/${systemId}`)
    return { success: true, data: serializeDecimals(updated) }
  } catch (error) {
    console.error('Error updating product inventory:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật sản phẩm',
    }
  }
}
