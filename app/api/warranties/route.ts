import { prisma } from '@/lib/prisma'
import { Prisma, WarrantyStatus } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createWarrantySchema } from './validation'
import { generateNextIdsWithTx } from '@/lib/id-system'
import { generateSubEntityId } from '@/lib/id-utils'

// GET /api/warranties - List all warranties with filtering and pagination
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

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

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { productName: { contains: search, mode: 'insensitive' } },
        { trackingCode: { contains: search, mode: 'insensitive' } },
        { publicTrackingCode: { contains: search, mode: 'insensitive' } },
      ]
    }

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
      where.orderId = orderSystemId
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
        },
      }),
      prisma.warranty.count({ where }),
    ])

    return apiPaginated(warranties, { page, limit, total })
  } catch (error) {
    console.error('Error fetching warranties:', error)
    return apiError('Failed to fetch warranties', 500)
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
  if (!session) return apiError('Unauthorized', 401)

  const result = await validateBody(request, createWarrantySchema)
  if (!result.success) return apiError(result.error, 400)

  try {
    const body = result.data
    
    // Debug: Log important fields
    console.log('[POST /api/warranties] Received data:', {
      receivedImages: body.receivedImages,
      processedImages: body.processedImages,
      products: body.products?.length,
      summary: body.summary,
    });

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

    return apiSuccess(warranty, 201)
  } catch (error) {
    console.error('Error creating warranty:', error)
    
    if (error instanceof Error && error.message === 'INSUFFICIENT_STOCK') {
      return apiError('Không đủ hàng trong kho để cam kết cho bảo hành', 400)
    }
    
    return apiError('Failed to create warranty', 500)
  }
}
