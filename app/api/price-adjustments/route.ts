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
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'
import { buildSearchWhere } from '@/lib/search/build-search-where'
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

    const searchWhere = buildSearchWhere<Prisma.PriceAdjustmentWhereInput>(search, [
      'id',
      'reason',
      'referenceCode',
    ])
    if (searchWhere) Object.assign(where, searchWhere)

    const [data, total] = await Promise.all([
      prisma.priceAdjustment.findMany({
        where,
        select: {
          systemId: true,
          id: true,
          branchId: true,
          pricingPolicyId: true,
          pricingPolicyName: true,
          type: true,
          status: true,
          reason: true,
          note: true,
          referenceCode: true,
          createdBy: true,
          createdByName: true,
          createdBySystemId: true,
          createdAt: true,
          updatedAt: true,
          items: {
            select: {
              systemId: true,
              productSystemId: true,
              productId: true,
              productName: true,
              productImage: true,
              oldPrice: true,
              newPrice: true,
              adjustmentAmount: true,
              adjustmentPercent: true,
              note: true,
            },
          },
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
    logError('[Price Adjustments API] List error', error)
    return apiError('Lỗi khi lấy danh sách điều chỉnh giá', 500)
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
      return apiError('Mã chính sách giá là bắt buộc', 400)
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return apiError('Danh sách sản phẩm là bắt buộc', 400)
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
        select: {
          systemId: true,
          id: true,
          branchId: true,
          pricingPolicyId: true,
          pricingPolicyName: true,
          type: true,
          reason: true,
          note: true,
          referenceCode: true,
          status: true,
          createdBy: true,
          createdByName: true,
          createdBySystemId: true,
          createdAt: true,
          updatedAt: true,
          items: {
            select: {
              systemId: true,
              productSystemId: true,
              productId: true,
              productName: true,
              productImage: true,
              oldPrice: true,
              newPrice: true,
              adjustmentAmount: true,
              adjustmentPercent: true,
              note: true,
            },
          },
        },
      }) as unknown as Prisma.PriceAdjustmentGetPayload<{ select: { systemId: true; id: true; branchId: true; pricingPolicyId: true; pricingPolicyName: true; type: true; reason: true; note: true; referenceCode: true; status: true; createdBy: true; createdByName: true; createdBySystemId: true; createdAt: true; updatedAt: true; items: { select: { systemId: true; productSystemId: true; productId: true; productName: true; productImage: true; oldPrice: true; newPrice: true; adjustmentAmount: true; adjustmentPercent: true; note: true } } } }>;
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

    // Notify creator if different from session user
    if (adjustment.createdBySystemId && adjustment.createdBySystemId !== session.user?.employeeId) {
      createNotification({
        type: 'price_adjustment',
        settingsKey: 'price-adjustment:updated',
        title: 'Phiếu điều chỉnh giá mới',
        message: `Phiếu điều chỉnh giá ${adjustment.id || adjustment.systemId} đã được tạo`,
        link: `/price-adjustments/${adjustment.systemId}`,
        recipientId: adjustment.createdBySystemId,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
      }).catch(e => logError('[Price Adjustment] notification failed', e));
    }

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'price_adjustment',
          entityId: transformedAdjustment.systemId,
          action: 'created',
          actionType: 'create',
          note: `Tạo phiếu điều chỉnh giá`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] price_adjustment create failed', e))
    return apiSuccess(transformedAdjustment, 201)
  } catch (error) {
    logError('[Price Adjustments API] Create error', error)
    return apiError('Lỗi khi tạo phiếu điều chỉnh giá', 500)
  }
}
