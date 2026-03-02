import { prisma } from '@/lib/prisma'
import { Prisma, OrderStatus, PaymentStatus, DeliveryMethod, DiscountType, PackagingStatus, DeliveryStatus as PrismaDeliveryStatus, PrintStatus } from '@/generated/prisma/client'
import { requireAuth, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'

// Route segment config - force dynamic since we use auth and query params
export const dynamic = 'force-dynamic'

import { 
  parseOrderStatus, 
  parsePaymentStatus, 
  parseDeliveryMethod,
  parseDiscountType,
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
} from '@/lib/constants/order-enums'
import {
  deliveryStatusLabels,
  packagingStatusLabels,
  deliveryMethodLabels,
  printStatusLabels,
  stockOutStatusLabels,
  returnStatusLabels,
} from '@/lib/constants/order-status-labels'

// Interface for order line item input
interface OrderLineItemInput {
  productSystemId: string;
  productId?: string;
  productName?: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  discountType?: string;
  tax?: number;
  taxId?: string;
  note?: string;
}

// Interface for order input
interface CreateOrderInput {
  id?: string;
  customerId?: string;
  customerSystemId?: string;
  customerName?: string;
  branchId?: string;
  branchSystemId?: string;
  branchName?: string;
  salespersonId?: string;
  salespersonSystemId?: string;
  salespersonName?: string;
  salesperson?: string;
  assignedPackerSystemId?: string;
  assignedPackerName?: string;
  lineItems: OrderLineItemInput[];
  orderDate?: string;
  expectedDeliveryDate?: string;
  expectedPaymentMethod?: string;
  shippingAddress?: string | Record<string, unknown> | null;
  billingAddress?: string | Record<string, unknown> | null;
  status?: string;
  paymentStatus?: string;
  deliveryStatus?: string;
  stockOutStatus?: string;
  returnStatus?: string;
  printStatus?: string;
  deliveryMethod?: string;
  shippingFee?: number;
  tax?: number;
  discount?: number;
  subtotal?: number;
  grandTotal?: number;
  paidAmount?: number;
  codAmount?: number;
  notes?: string;
  source?: string;
  tags?: string[];
  packagings?: unknown[];
  payments?: unknown[];
  completedDate?: string | null;
  createdAt?: string;
  createdBy?: string;
}

// GET /api/orders - List all orders
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const customerId = searchParams.get('customerId')
    const customerSystemId = searchParams.get('customerSystemId')
    const branchId = searchParams.get('branchId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: Prisma.OrderWhereInput = {}

    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { customerName: { contains: search, mode: 'insensitive' } },
        { trackingCode: { contains: search } },
      ]
    }

    if (status) {
      where.status = status as OrderStatus
    }

    if (customerId) {
      where.customerId = customerId
    }

    // ✅ Support filtering by customerSystemId (UUID) - use relation filter
    if (customerSystemId) {
      where.customer = { systemId: customerSystemId }
    }

    if (branchId) {
      where.branchId = branchId
    }

    if (startDate || endDate) {
      where.orderDate = {}
      if (startDate) {
        where.orderDate.gte = new Date(startDate)
      }
      if (endDate) {
        where.orderDate.lte = new Date(endDate)
      }
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { orderDate: 'desc' },
        include: {
          customer: {
            select: {
              systemId: true,
              id: true,
              name: true,
              phone: true,
              email: true,
            },
          },
          branch: {
            select: {
              systemId: true,
              id: true,
              name: true,
            },
          },
          lineItems: {
            include: {
              product: {
                select: {
                  systemId: true,
                  id: true,
                  name: true,
                  imageUrl: true,
                  thumbnailImage: true,
                },
              },
            },
          },
          payments: true,
          packagings: true,
          // Note: createdBy is just a string field, not a relation
          // NV tạo đơn sẽ được lấy từ salespersonName (thường là người tạo)
        },
      }),
      prisma.order.count({ where }),
    ])

    // ✅ Transform using shared status label utilities
    const transformedOrders = orders.map(order => ({
      ...order,
      // ✅ Transform order-level status fields to Vietnamese (use ORDER_STATUS_LABELS for consistency)
      status: ORDER_STATUS_LABELS[order.status] || order.status,
      paymentStatus: PAYMENT_STATUS_LABELS[order.paymentStatus] || order.paymentStatus,
      deliveryStatus: order.deliveryStatus ? (deliveryStatusLabels[order.deliveryStatus] || order.deliveryStatus) : undefined,
      printStatus: order.printStatus ? (printStatusLabels[order.printStatus] || order.printStatus) : 'Chưa in',
      stockOutStatus: order.stockOutStatus ? (stockOutStatusLabels[order.stockOutStatus] || order.stockOutStatus) : 'Chưa xuất kho',
      returnStatus: order.returnStatus ? (returnStatusLabels[order.returnStatus] || order.returnStatus) : 'Chưa trả hàng',
      // ✅ Add extra fields for display
      salesperson: order.salespersonName || undefined,
      customerPhone: order.customer?.phone || undefined,
      customerEmail: order.customer?.email || undefined,
      customerId: order.customer?.id || undefined,
      customerSystemId: order.customer?.systemId || undefined, // ✅ Add customerSystemId from relation
      branchSystemId: order.branchId, // ✅ Add branchSystemId for frontend (order.branchId IS the branch systemId)
      createdByName: order.salespersonName || undefined,
      // ✅ Add assignedPackerName from packagings
      assignedPackerName: order.packagings?.find(p => p.assignedEmployeeName)?.assignedEmployeeName || undefined,
      // ✅ Transform dates to ISO strings
      orderDate: order.orderDate?.toISOString() || undefined,
      dispatchedDate: order.dispatchedDate?.toISOString() || undefined,
      createdAt: order.createdAt?.toISOString() || undefined,
      // ✅ Add missing date fields
      approvedDate: order.approvedDate?.toISOString() || undefined,
      completedDate: order.completedDate?.toISOString() || undefined,
      cancelledDate: order.cancelledDate?.toISOString() || undefined,
      expectedDeliveryDate: order.expectedDeliveryDate?.toISOString() || undefined,
      // ✅ Transform Decimal fields to numbers
      subtotal: Number(order.subtotal),
      grandTotal: Number(order.grandTotal),
      paidAmount: Number(order.paidAmount),
      shippingFee: Number(order.shippingFee),
      tax: Number(order.tax),
      discount: Number(order.discount),
      codAmount: Number(order.codAmount),
      // ✅ Transform linkedSalesReturnValue from Decimal to number
      linkedSalesReturnValue: order.linkedSalesReturnValue ? Number(order.linkedSalesReturnValue) : undefined,
      // ✅ Transform lineItems Decimal fields
      lineItems: order.lineItems.map(item => ({
        ...item,
        unitPrice: Number(item.unitPrice),
        discount: Number(item.discount),
        tax: Number(item.tax),
        total: Number(item.total),
      })),
      // ✅ Transform payments Decimal fields and include linkedReceiptSystemId
      payments: order.payments.map(p => ({
        ...p,
        amount: Number(p.amount),
      })),
      packagings: order.packagings.map(pkg => ({
        ...pkg,
        requestDate: pkg.requestDate?.toISOString() || undefined,
        confirmDate: pkg.confirmDate?.toISOString() || undefined,
        cancelDate: pkg.cancelDate?.toISOString() || undefined,
        deliveredDate: pkg.deliveredDate?.toISOString() || undefined,
        status: packagingStatusLabels[pkg.status] || pkg.status,
        deliveryStatus: pkg.deliveryStatus ? (deliveryStatusLabels[pkg.deliveryStatus] || pkg.deliveryStatus) : undefined,
        deliveryMethod: pkg.deliveryMethod ? (deliveryMethodLabels[pkg.deliveryMethod] || pkg.deliveryMethod) : undefined,
        printStatus: pkg.printStatus ? (printStatusLabels[pkg.printStatus] || pkg.printStatus) : 'Chưa in',
        shippingFeeToPartner: pkg.shippingFeeToPartner ? Number(pkg.shippingFeeToPartner) : undefined,
        codAmount: pkg.codAmount ? Number(pkg.codAmount) : undefined,
        weight: pkg.weight ? Number(pkg.weight) : undefined,
      })),
    }));

    return apiPaginated(transformedOrders, { page, limit, total })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return apiError('Failed to fetch orders', 500)
  }
}

// ========================================
// ID GENERATION - Using centralized id-system
// ========================================
import { generateNextIdsWithTx } from '@/lib/id-system'
import type { EntityType } from '@/lib/id-config-constants'

type TransactionClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0]

/**
 * Helper wrapper that uses centralized id-system
 * Returns format compatible with existing code
 */
async function generateNextEntityId(
  tx: TransactionClient,
  entityType: 'orders' | 'packaging' | 'shipments'
): Promise<{ businessId: string; systemId: string; counter: number }> {
  const result = await generateNextIdsWithTx(tx, entityType as EntityType);
  return {
    businessId: result.businessId as string,
    systemId: result.systemId as string,
    counter: result.counter,
  };
}

// POST /api/orders - Create new order
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  // Parse body once
  let body: CreateOrderInput
  try {
    body = await request.json() as CreateOrderInput
  } catch {
    return apiError('Invalid JSON body', 400)
  }

  // ✅ Simple validation for required fields
  const customerId = body.customerId || body.customerSystemId
  const branchId = body.branchId || body.branchSystemId
  
  console.log('[Orders API] Create order request:', {
    customerId,
    branchId,
    hasPackagings: !!body.packagings,
    packagingsCount: body.packagings?.length || 0,
  });
  
  if (!customerId) {
    return apiError('Customer is required', 400)
  }
  if (!branchId) {
    return apiError('Branch is required', 400)
  }
  if (!body.lineItems || body.lineItems.length === 0) {
    return apiError('At least one line item is required', 400)
  }
  
  // Validate all line items have product reference
  for (let i = 0; i < body.lineItems.length; i++) {
    const item = body.lineItems[i];
    if (!item.productSystemId && !item.productId) {
      return apiError(`Line item #${i + 1} is missing product reference (productSystemId or productId)`, 400)
    }
  }
  
  const salespersonId = body.salespersonId || body.salespersonSystemId
  const salespersonName = body.salespersonName || body.salesperson || 'N/A'

  if (!salespersonId) {
    return apiError('Salesperson ID is required', 400)
  }

  // Get customer and branch info first (outside transaction for validation)
  const [customer, branch] = await Promise.all([
    prisma.customer.findUnique({ where: { systemId: customerId } }),
    prisma.branch.findUnique({ where: { systemId: branchId } }),
  ])

  if (!customer) {
    return apiError('Customer not found', 400)
  }

  if (!branch) {
    return apiError('Branch not found', 400)
  }

  // ✅ Check allowNegativeOrder setting - validate stock before creating order
  const salesSetting = await prisma.setting.findFirst({
    where: { key: 'sales-management-settings' },
  });
  // Note: setting.value is already a JSON object (Prisma Json type), no need to parse
  const salesSettings = (salesSetting?.value as { allowNegativeOrder?: boolean } | null) 
    ?? { allowNegativeOrder: true };
  
  if (!salesSettings.allowNegativeOrder) {
    // Check if any product has insufficient stock
    const productIds = body.lineItems
      .map(item => item.productSystemId || item.productId)
      .filter((id): id is string => !!id);
    
    const inventories = await prisma.productInventory.findMany({
      where: {
        productId: { in: productIds },
        branchId: branchId,
      },
    });
    const inventoryMap = new Map(inventories.map(inv => [inv.productId, inv]));
    
    for (const item of body.lineItems) {
      const productId = item.productSystemId || item.productId;
      if (!productId) continue;
      
      const inventory = inventoryMap.get(productId);
      const onHand = inventory?.onHand ?? 0;
      const committed = inventory?.committed ?? 0;
      const available = onHand - committed;
      
      if (item.quantity > available) {
        return apiError(
          `Sản phẩm "${item.productName || productId}" không đủ tồn kho. Có thể bán: ${available}, yêu cầu: ${item.quantity}`,
          400
        );
      }
    }
  }

  // ✅ Retry logic for race condition on ID generation
  const MAX_RETRIES = 3
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // ✅ Use transaction to ensure atomic ID generation and insert
      const order = await prisma.$transaction(async (tx) => {
        // Generate order IDs using id-config system
        const orderIds = await generateNextEntityId(tx, 'orders')
        const { businessId, systemId, counter: orderNum } = orderIds
        
        // Generate packaging IDs based on order number (order_num-index format)
        // This ensures unique IDs without needing MAX query on packagings table
        const packagingIds: Array<{ businessId: string; systemId: string }> = []
        if (body.packagings && body.packagings.length > 0) {
          for (let i = 0; i < body.packagings.length; i++) {
            const packagingIndex = String(i + 1).padStart(2, '0');
            const orderNumPadded = String(orderNum).padStart(6, '0');
            packagingIds.push({
              systemId: `PACKAGE${orderNumPadded}-${packagingIndex}`,
              businessId: `DG${orderNumPadded}-${packagingIndex}`,
            });
          }
        }
        
        // Use provided ID or generated one
        const finalBusinessId = body.id || businessId
        
        console.log(`[Orders API] Creating order with systemId=${systemId}, businessId=${finalBusinessId}`)
        
        // Check if IDs already exist (debug)
        const existingOrder = await tx.order.findFirst({
          where: { OR: [{ systemId }, { id: finalBusinessId }] },
          select: { systemId: true, id: true }
        })
        if (existingOrder) {
          console.log(`[Orders API] CONFLICT FOUND: existing order`, existingOrder)
          throw new Error(`Order already exists: systemId=${existingOrder.systemId}, id=${existingOrder.id}`)
        }
        
        // ✅ OPTIMIZED: Batch fetch all products in ONE query (fix N+1)
        const productIds = body.lineItems
          .map(item => item.productSystemId || item.productId)
          .filter((id): id is string => !!id);
        
        const products = await tx.product.findMany({
          where: { systemId: { in: productIds } },
          select: { systemId: true, id: true, name: true }
        });
        const productMap = new Map(products.map(p => [p.systemId, p]));
        
        // Validate all products exist
        for (let i = 0; i < body.lineItems.length; i++) {
          const item = body.lineItems[i];
          const productKey = item.productSystemId || item.productId;
          if (!productKey) {
            throw new Error(`Line item #${i + 1} is missing productSystemId or productId`);
          }
          if (!productMap.has(productKey)) {
            throw new Error(`Product ${productKey} not found`);
          }
        }
        
        // Calculate totals from line items (no more N+1 queries!)
        let subtotal = 0
        const lineItemsData = body.lineItems.map((item: OrderLineItemInput, index: number) => {
          const productKey = item.productSystemId || item.productId as string;
          const product = productMap.get(productKey)!;
          
          const itemTotal = item.quantity * item.unitPrice - (item.discount || 0)
          subtotal += itemTotal

          return {
            systemId: `OLI${String(orderNum).padStart(6, '0')}-${String(index + 1).padStart(3, '0')}`,
            productId: product.systemId,
            productSku: product.id,
            productName: product.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount || 0,
            discountType: parseDiscountType(item.discountType) as DiscountType | undefined,
            tax: item.tax || 0,
            total: itemTotal,
            note: item.note,
          }
        })

        const tax = body.tax || 0
        const shippingFee = body.shippingFee || 0
        const discount = body.discount || 0
        const grandTotal = subtotal + tax + shippingFee - discount
    
        // ✅ Normalize shippingAddress - convert object to JSON string if needed
        let shippingAddressValue: Prisma.InputJsonValue | undefined = undefined
        if (body.shippingAddress) {
          if (typeof body.shippingAddress === 'string') {
            shippingAddressValue = body.shippingAddress
          } else {
            shippingAddressValue = body.shippingAddress as Prisma.InputJsonValue
          }
        }

        // ✅ Create order inside transaction
        console.log(`[Orders API] About to create order:`, {
          systemId,
          id: finalBusinessId,
          lineItemsCount: lineItemsData.length,
          lineItemSystemIds: lineItemsData.map(li => li.systemId),
          packagingsCount: body.packagings?.length || 0,
        })
        
        const createdOrder = await tx.order.create({
          data: {
            systemId: systemId,
            id: finalBusinessId,
            customerId: customerId,
            customerName: body.customerName || customer.name,
            branchId: branchId,
            salespersonId: salespersonId,
            branchName: body.branchName || branch.name,
            salespersonName: salespersonName,
            orderDate: body.orderDate ? new Date(body.orderDate) : new Date(),
            expectedDeliveryDate: body.expectedDeliveryDate ? new Date(body.expectedDeliveryDate) : null,
            shippingAddress: shippingAddressValue,
            status: (parseOrderStatus(body.status) || 'PENDING') as OrderStatus,
            paymentStatus: (parsePaymentStatus(body.paymentStatus) || 'UNPAID') as PaymentStatus,
            deliveryMethod: (parseDeliveryMethod(body.deliveryMethod) || 'SHIPPING') as DeliveryMethod,
            // ✅ Set approvedDate if status is not PENDING/DRAFT (i.e., order is approved)
            approvedDate: ['PENDING', 'DRAFT'].includes(parseOrderStatus(body.status) || 'PENDING') 
              ? null 
              : new Date(),
            subtotal,
            shippingFee,
            tax,
            discount,
            grandTotal,
            notes: body.notes,
            source: body.source,
            createdBy: body.createdBy || session.user?.employee?.fullName || session.user?.name || 'System',
            lineItems: {
              create: lineItemsData,
            },
            // ✅ Create packagings if provided
            ...(body.packagings && body.packagings.length > 0 ? {
              packagings: {
                create: (body.packagings as Array<{
                  systemId?: string;
                  id?: string;
                  requestDate?: string;
                  confirmDate?: string;
                  requestingEmployeeId?: string;
                  requestingEmployeeName?: string;
                  confirmingEmployeeId?: string;
              confirmingEmployeeName?: string;
              assignedEmployeeId?: string;
              assignedEmployeeName?: string;
              status?: string;
              deliveryStatus?: string;
              printStatus?: string;
              deliveryMethod?: string;
              carrier?: string;
              service?: string;
              trackingCode?: string;
              shippingFeeToPartner?: number;
              codAmount?: number;
              payer?: string;
              noteToShipper?: string;
              weight?: number;
              dimensions?: string;
            }>).map((pkg, index) => {
              // Parse packaging status - Use correct Prisma enum: PENDING, IN_PROGRESS, COMPLETED, CANCELLED
              const packagingStatus = pkg.status === 'Đã đóng gói' ? 'COMPLETED' 
                : pkg.status === 'Chờ đóng gói' ? 'PENDING' 
                : pkg.status === 'Đang đóng gói' ? 'IN_PROGRESS'
                : pkg.status === 'Đã hủy' ? 'CANCELLED' 
                : 'PENDING';
              
              // Parse delivery status - Use correct Prisma enum: PENDING_PACK, PACKED, PENDING_SHIP, SHIPPING, DELIVERED, RESCHEDULED, CANCELLED
              const deliveryStatus = pkg.deliveryStatus === 'Chờ lấy hàng' ? 'PENDING_SHIP'
                : pkg.deliveryStatus === 'Đang giao hàng' ? 'SHIPPING'
                : pkg.deliveryStatus === 'Đã giao hàng' ? 'DELIVERED'
                : pkg.deliveryStatus === 'Chờ đóng gói' ? 'PENDING_PACK'
                : pkg.deliveryStatus === 'Đã đóng gói' ? 'PACKED'
                : pkg.deliveryStatus === 'Đã hủy' ? 'CANCELLED'
                : 'PENDING_PACK';
                
              // Parse print status
              const printStatus = pkg.printStatus === 'Đã in' ? 'PRINTED' : 'NOT_PRINTED';
              
              // Parse delivery method - Prisma enum: PICKUP, SHIPPING, IN_STORE_PICKUP
              const deliveryMethod = pkg.deliveryMethod === 'Nhận tại cửa hàng' ? 'IN_STORE_PICKUP' 
                : pkg.deliveryMethod === 'Dịch vụ giao hàng' ? 'SHIPPING'
                : pkg.deliveryMethod === 'Lấy tại kho' ? 'PICKUP'
                : 'SHIPPING';

              // Use pre-generated packaging IDs from id-config system
              const pkgIds = packagingIds[index];
              console.log(`[Orders API] Packaging ${index}: systemId=${pkgIds.systemId}, businessId=${pkgIds.businessId}`);
              
              // ✅ Auto-generate tracking code for in-store pickup
              let trackingCode = pkg.trackingCode;
              if (deliveryMethod === 'IN_STORE_PICKUP' && !trackingCode) {
                trackingCode = `INSTORE-${pkgIds.businessId}`;
              }
              
              return {
                systemId: pkgIds.systemId,
                id: pkgIds.businessId,
                branchId: branchId,
                requestDate: pkg.requestDate ? new Date(pkg.requestDate) : new Date(),
                confirmDate: pkg.confirmDate ? new Date(pkg.confirmDate) : null,
                requestingEmployeeId: pkg.requestingEmployeeId,
                requestingEmployeeName: pkg.requestingEmployeeName,
                confirmingEmployeeId: pkg.confirmingEmployeeId,
                confirmingEmployeeName: pkg.confirmingEmployeeName,
                assignedEmployeeId: pkg.assignedEmployeeId,
                assignedEmployeeName: pkg.assignedEmployeeName,
                status: packagingStatus as PackagingStatus,
                deliveryStatus: deliveryStatus as PrismaDeliveryStatus,
                printStatus: printStatus as PrintStatus,
                deliveryMethod: deliveryMethod as DeliveryMethod,
                carrier: pkg.carrier,
                service: pkg.service,
                trackingCode: trackingCode,
                shippingFeeToPartner: pkg.shippingFeeToPartner,
                codAmount: pkg.codAmount,
                payer: pkg.payer,
                noteToShipper: pkg.noteToShipper,
                weight: pkg.weight,
                dimensions: pkg.dimensions,
                createdBy: session.user?.employee?.fullName || session.user?.name || 'System',
              };
            }),
          },
        } : {}),
      },
      include: {
        customer: true,
        branch: true,
        lineItems: {
          include: {
            product: true,
          },
        },
        packagings: true, // ✅ Include packagings in response
      },
    })

        // ✅ Update ProductInventory - increase committed for each line item
        // This reserves stock for the order without reducing onHand yet
        for (const item of lineItemsData) {
          const _inventory = await tx.productInventory.findUnique({
            where: {
              productId_branchId: {
                productId: item.productId,
                branchId: branchId,
              },
            },
          });

          await tx.productInventory.upsert({
            where: {
              productId_branchId: {
                productId: item.productId,
                branchId: branchId,
              },
            },
            update: {
              committed: { increment: item.quantity },
              updatedAt: new Date(),
            },
            create: {
              productId: item.productId,
              branchId: branchId,
              onHand: 0,
              committed: item.quantity,
              inTransit: 0,
            },
          });

          // ❌ REMOVED: Don't create StockHistory for "Đặt hàng" 
          // "Giữ" (committed) only affects "Có thể bán", not actual stock level
          // StockHistory should only record actual stock changes (xuất/nhập kho)
        }
        
        console.log(`[Orders API] Updated inventory committed for ${lineItemsData.length} products`);

        return createdOrder
      }) // End of transaction

      // ✅ Success - return the order
      console.log(`[Orders API] Order created successfully: ${order.systemId} (${order.id})`)
      return apiSuccess(order, 201)
      
    } catch (error) {
      // Check if it's a unique constraint error (race condition)
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const target = error.meta?.target as string[] | undefined
        const conflictField = target?.join(', ') || 'unknown'
        console.warn(`[Orders API] Attempt ${attempt}/${MAX_RETRIES} - ID conflict on ${conflictField}, retrying...`)
        lastError = error as Error
        
        // Wait a bit before retry (exponential backoff)
        if (attempt < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, 100 * attempt))
          continue
        }
      } else {
        // Non-retryable error
        console.error('Error creating order:', error)
        const message = error instanceof Error ? error.message : 'Failed to create order'
        return apiError(message, 500)
      }
    }
  }

  // All retries failed
  console.error('[Orders API] All retries failed for order creation')
  if (lastError instanceof Prisma.PrismaClientKnownRequestError && lastError.code === 'P2002') {
    return apiError('Failed to generate unique order ID after multiple attempts. Please try again.', 400)
  }
  return apiError('Failed to create order after multiple attempts', 500)}