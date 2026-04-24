import { prisma } from '@/lib/prisma'
import { Prisma, WarrantyStatus } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createWarrantySchema } from './validation'
import { generateNextIdsWithTx } from '@/lib/id-system'
import { generateSubEntityId } from '@/lib/id-utils'
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { notifyWarrantyCreated } from '@/lib/warranty-notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'
import { buildSearchWhere } from '@/lib/search/build-search-where'

// GET /api/warranties - List all warranties with filtering and pagination
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Chưa được xác thực', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const customerId = searchParams.get('customerId')
    const productId = searchParams.get('productId')
    const orderSystemId = searchParams.get('orderSystemId')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')
    const branchId = searchParams.get('branchId')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'

    const where: Prisma.WarrantyWhereInput = {
      isDeleted: false,
    }

    const searchWhere = buildSearchWhere<Prisma.WarrantyWhereInput>(search, [
      'id',
      'customerName',
      'productName',
      'trackingCode',
      'publicTrackingCode',
    ])
    if (searchWhere) Object.assign(where, searchWhere)

    if (status && status !== 'all') {
      where.status = status as WarrantyStatus
    }

    if (customerId) {
      where.customerId = customerId
    }

    if (productId) {
      where.productId = productId
    }

    if (orderSystemId) {
      if (!where.AND) where.AND = [];
      (where.AND as Prisma.WarrantyWhereInput[]).push({
        OR: [
          { orderId: orderSystemId },
          { linkedOrderSystemId: orderSystemId },
        ],
      });
    }

    if (branchId) {
      where.branchSystemId = branchId
    }

    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) {
        where.createdAt.gte = new Date(dateFrom)
      }
      if (dateTo) {
        where.createdAt.lte = new Date(dateTo)
      }
    }

    // Build orderBy
    const orderBy: Prisma.WarrantyOrderByWithRelationInput = { [sortBy]: sortOrder }

    const [warranties, total] = await Promise.all([
      prisma.warranty.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          product: {
            select: { systemId: true, id: true, name: true, imageUrl: true },
          },
          customers: {
            select: { systemId: true, id: true, name: true, phone: true },
          },
          order: {
            select: { systemId: true, id: true },
          },
        },
      }),
      prisma.warranty.count({ where }),
    ])

    // Serialize Decimal fields to numbers
    const serialized = warranties.map(w => ({
      ...w,
      shippingFee: w.shippingFee != null ? Number(w.shippingFee) : 0,
      partsCost: w.partsCost != null ? Number(w.partsCost) : 0,
      laborCost: w.laborCost != null ? Number(w.laborCost) : 0,
      totalCost: w.totalCost != null ? Number(w.totalCost) : 0,
    }))

    return apiPaginated(serialized, { page, limit, total })
  } catch (error) {
    logError('Error fetching warranties', error)
    return apiError('Không thể tải danh sách bảo hành', 500)
  }
}

// POST /api/warranties - Create new warranty with optional stock commitment
/**
 * Create warranty flow:
 * 1. Validate request data (productId, customerId, issue description)
 * 2. Check product and customer exist
 * 3. Generate warranty tracking code
 * 4. Atomic transaction:
 *    - Create Warranty record
 *    - If replacement needed: Commit stock (reserve for warranty)
 *    - Create warranty history record
 * 5. Return created warranty with full details
 * 
 * Stock commitment: For replacement warranties, stock is committed (reserved)
 * but not deducted until warranty is completed.
 */
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Chưa được xác thực', 401)

  const result = await validateBody(request, createWarrantySchema)
  if (!result.success) return apiError(result.error, 400)

  try {
    const body = result.data
    
    // Debug: Log important fields

    // Validate product exists if productId provided
    if (body.productId) {
      const product = await prisma.product.findUnique({
        where: { systemId: body.productId },
        select: { systemId: true, name: true },
      })
      if (!product) {
        return apiError('Sản phẩm không tồn tại', 404)
      }
    }

    // Validate customer exists if customerId provided
    if (body.customerId) {
      const customer = await prisma.customer.findUnique({
        where: { systemId: body.customerId },
        select: { systemId: true, name: true },
      })
      if (!customer) {
        return apiError('Khách hàng không tồn tại', 404)
      }
    }

    // Start transaction for atomic operations
    const warranty = await prisma.$transaction(async (tx) => {
      // Generate IDs using unified ID system
      const { systemId, businessId } = await generateNextIdsWithTx(
        tx,
        'warranty',
        body.id?.trim() || undefined
      );

      // Generate tracking code
      // Use provided trackingCode or generate new one
      const trackingCode = body.trackingCode || generateSubEntityId('WAR')
      const publicTrackingCode = body.publicTrackingCode || `${businessId}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`

      // Create warranty
      const newWarranty = await tx.warranty.create({
        data: {
          systemId,
          id: businessId,
          trackingCode,
          publicTrackingCode,
          productId: body.productId,
          orderId: body.orderId,
          customerId: body.customerId,
          customerName: body.customerName || '',
          customerPhone: body.customerPhone || '',
          customerEmail: body.customerEmail,
          customerAddress: body.customerAddress || '',
          productName: body.productName || '',
          serialNumber: body.serialNumber,
          title: body.title || 'Phiếu bảo hành',
          description: body.description,
          issueDescription: body.issueDescription,
          notes: body.notes,
          status: body.status as WarrantyStatus,
          priority: body.priority,
          branchSystemId: body.branchSystemId,
          branchName: body.branchName,
          employeeSystemId: body.employeeSystemId || session.user?.id,
          employeeName: body.employeeName || session.user?.name || 'System',
          isUnderWarranty: body.isUnderWarranty ?? true,
          purchaseDate: body.purchaseDate ? new Date(body.purchaseDate) : undefined,
          startedAt: body.startDate ? new Date(body.startDate) : undefined,
          warrantyExpireDate: body.endDate ? new Date(body.endDate) : undefined,
          solution: body.solution,
          
          // ===== ADDITIONAL FIELDS =====
          // Shipping & external refs
          shippingFee: body.shippingFee,
          referenceUrl: body.referenceUrl,
          externalReference: body.externalReference,
          
          // Images
          receivedImages: body.receivedImages || [],
          processedImages: body.processedImages || [],
          
          // Products (JSON array)
          products: body.products || [],
          
          // Settlement (JSON object)
          settlement: body.settlement,
          settlementStatus: body.settlementStatus || 'pending',
          
          // Summary (JSON object)
          summary: body.summary,
          
          // History & comments (JSON arrays)
          history: body.history || [],
          comments: body.comments || [],
          
          // Subtasks
          subtasks: body.subtasks || [],
          
          // Order linking
          linkedOrderSystemId: body.linkedOrderSystemId,
          
          // Audit
          createdBy: body.createdBy || session.user?.email || 'system',
          createdBySystemId: body.createdBySystemId || session.user?.id,
        },
        include: {
          product: {
            select: { systemId: true, id: true, name: true, imageUrl: true },
          },
          customers: {
            select: { systemId: true, id: true, name: true, phone: true },
          },
        },
      })

      // TODO: Stock commitment logic would go here
      // Since the current Prisma schema doesn't have ProductWarehouse model,
      // this would need to be added when the schema is updated
      //
      // Example pseudo-code for replacement warranty:
      // if (body.isReplacement && body.replacementProductId) {
      //   const product = await tx.product.findUnique({
      //     where: { systemId: body.replacementProductId }
      //   })
      //   
      //   // Check availability
      //   const warehouse = await tx.productWarehouse.findUnique({
      //     where: {
      //       productSystemId_warehouseId: {
      //         productSystemId: body.replacementProductId,
      //         warehouseId: body.branchSystemId
      //       }
      //     }
      //   })
      //   
      //   const available = (warehouse?.onHand || 0) - (warehouse?.committedQuantity || 0)
      //   if (available < body.replacementQuantity) {
      //     throw new Error('INSUFFICIENT_STOCK')
      //   }
      //   
      //   // Commit stock (reserve for warranty)
      //   await tx.productWarehouse.update({
      //     where: {
      //       productSystemId_warehouseId: {
      //         productSystemId: body.replacementProductId,
      //         warehouseId: body.branchSystemId
      //       }
      //     },
      //     data: {
      //       committedQuantity: { increment: body.replacementQuantity }
      //     }
      //   })
      // }

      return newWarranty
    })

    // Notify assigned employee (non-blocking)
    const assignedEmployeeId = warranty.employeeSystemId;
    const currentUserEmployeeId = session.user?.employeeId;
    if (assignedEmployeeId && assignedEmployeeId !== currentUserEmployeeId) {
      createNotification({
        type: 'warranty',
        title: 'Phiếu bảo hành mới',
        message: `Bạn được giao phiếu bảo hành "${warranty.title}" (${warranty.id})`,
        link: `/warranty/${warranty.systemId}`,
        recipientId: assignedEmployeeId,
        senderId: currentUserEmployeeId || undefined,
        senderName: session.user?.name || undefined,
        settingsKey: 'warranty:created',
      }).catch(e => logError('[Warranty] Creation notification failed', e));

      // Send email notification (non-blocking)
      notifyWarrantyCreated({
        systemId: warranty.systemId,
        title: warranty.title,
        id: warranty.id,
        assigneeId: assignedEmployeeId,
        creatorName: session.user?.name,
      }).catch(e => logError('[Warranty] Creation email failed', e));
    }

    // Log activity
    const productName = warranty.product?.name || warranty.productName || '';
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'warranty',
          entityId: warranty.systemId,
          action: 'created',
          actionType: 'create',
          note: `Tạo phiếu bảo hành: ${warranty.id} - Sản phẩm: ${productName}`,
          metadata: { userName, warrantyId: warranty.id, productName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] warranty create failed', e))
    return apiSuccess(warranty, 201)
  } catch (error) {
    logError('Error creating warranty', error)
    
    if (error instanceof Error && error.message === 'INSUFFICIENT_STOCK') {
      return apiError('Không đủ hàng trong kho để cam kết cho bảo hành', 400)
    }
    
    return apiError('Không thể tạo phiếu bảo hành', 500)
  }
}
