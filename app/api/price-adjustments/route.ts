/**
 * Price Adjustments API Routes
 * GET - List price adjustments with filters and pagination
 * POST - Create new price adjustment
 */

import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiPaginated } from '@/lib/api-utils'
import { generateNextIds } from '@/lib/id-system'
import { Prisma } from '@/generated/prisma/client'
import { generateIdWithPrefix } from '@/lib/id-generator'

// GET - List price adjustments
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status')
    const pricingPolicyId = searchParams.get('pricingPolicyId')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'

    const where: Prisma.PriceAdjustmentWhereInput = {}

    if (status) {
      where.status = status as Prisma.PriceAdjustmentWhereInput['status']
    }

    if (pricingPolicyId) {
      where.pricingPolicyId = pricingPolicyId
    }

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { reason: { contains: search, mode: 'insensitive' } },
        { referenceCode: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [data, total] = await Promise.all([
      prisma.priceAdjustment.findMany({
        where,
        include: {
          items: true,
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.priceAdjustment.count({ where }),
    ])

    // Transform data
    const transformedData = data.map(adj => ({
      ...adj,
      items: adj.items.map(item => ({
        ...item,
        oldPrice: Number(item.oldPrice),
        newPrice: Number(item.newPrice),
        adjustmentAmount: Number(item.adjustmentAmount),
        adjustmentPercent: Number(item.adjustmentPercent),
      })),
    }))

    return apiPaginated(transformedData, { page, limit, total })
  } catch (error) {
    console.error('[Price Adjustments API] List error:', error)
    return apiError('Failed to fetch price adjustments', 500)
  }
}

// POST - Create new price adjustment
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const body = await request.json()
    const { 
      pricingPolicyId,
      pricingPolicyName,
      items, 
      type = 'manual',
      reason,
      note,
      referenceCode,
      businessId,
      createdBy,
      createdByName,
    } = body

    if (!pricingPolicyId) {
      return apiError('Pricing policy ID is required', 400)
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return apiError('Items are required', 400)
    }

    // Generate IDs using unified ID system
    const { systemId, businessId: generatedId } = await generateNextIds('price-adjustments', businessId)
    const id = businessId || generatedId

    // Get default branch
    const defaultBranch = await prisma.branch.findFirst({
      where: { isDefault: true },
    })

    // Create adjustment with items
    const adjustment = await prisma.$transaction(async (tx) => {
      const itemIds = await Promise.all(
        items.map(() => generateIdWithPrefix('PADJI', tx as unknown as typeof prisma))
      );
      
      interface PriceAdjustmentItemInput {
        productSystemId: string;
        productId?: string;
        productName?: string;
        productImage?: string;
        oldPrice: number;
        newPrice: number;
        adjustmentAmount?: number;
        adjustmentPercent?: number;
        note?: string;
      }

      return tx.priceAdjustment.create({
        data: {
          systemId,
          id,
          branchId: defaultBranch?.systemId || 'default',
          pricingPolicyId,
          pricingPolicyName,
          type,
          reason,
          note,
          referenceCode,
          createdBySystemId: createdBy,
          createdByName,
          createdBy: createdBy,
          items: {
            create: items.map((item: PriceAdjustmentItemInput, index: number) => ({
              systemId: itemIds[index],
              productSystemId: item.productSystemId,
              productId: item.productId || '',
              productName: item.productName,
              productImage: item.productImage,
              oldPrice: item.oldPrice || 0,
              newPrice: item.newPrice || 0,
              adjustmentAmount: item.adjustmentAmount || (item.newPrice - item.oldPrice),
              adjustmentPercent: item.adjustmentPercent || (item.oldPrice > 0 ? ((item.newPrice - item.oldPrice) / item.oldPrice * 100) : 0),
              note: item.note,
            })) as unknown as Prisma.PriceAdjustmentItemCreateWithoutPriceAdjustmentInput[],
          },
        },
        include: {
          items: true,
        },
      }) as unknown as Prisma.PriceAdjustmentGetPayload<{ include: { items: true } }>;
    });

    // Transform for response
    const transformedAdjustment = {
      ...adjustment,
      items: adjustment.items.map(item => ({
        ...item,
        oldPrice: Number(item.oldPrice),
        newPrice: Number(item.newPrice),
        adjustmentAmount: Number(item.adjustmentAmount),
        adjustmentPercent: Number(item.adjustmentPercent),
      })),
    }

    return apiSuccess(transformedAdjustment, 201)
  } catch (error) {
    console.error('[Price Adjustments API] Create error:', error)
    return apiError('Failed to create price adjustment', 500)
  }
}
