import { prisma } from '@/lib/prisma'
import { Prisma, OrderStatus, PaymentStatus, DeliveryMethod, DiscountType, PackagingStatus, DeliveryStatus as PrismaDeliveryStatus, PrintStatus, StockOutStatus, ReturnStatus } from '@/generated/prisma/client'
import { requireAuth, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createNotification } from '@/lib/notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'
import { resolveStockItems } from '@/lib/inventory/combo-stock-helper'

// Route segment config - force dynamic since we use auth and query params
export const dynamic = 'force-dynamic'

import { 
  parseOrderStatus, 
  parsePaymentStatus, 
  parseDeliveryMethod,
  parseDeliveryStatus,
  parsePrintStatus,
  parseStockOutStatus,
  parseReturnStatus,
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
  customerPhone?: string;
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
  invoiceInfo?: Record<string, unknown> | null;
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
  orderDiscount?: number;
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
  cancelledDate?: string | null;
  approvedDate?: string | null;
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
    const productSystemId = searchParams.get('productSystemId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const stockOutStatusNot = searchParams.get('stockOutStatusNot')
    const stockOutStatus = searchParams.get('stockOutStatus')
    const paymentStatusNot = searchParams.get('paymentStatusNot')
    const deliveryStatus = searchParams.get('deliveryStatus')
    const paymentStatus = searchParams.get('paymentStatus')
    const salespersonSystemId = searchParams.get('salespersonSystemId')
    const returnStatus = searchParams.get('returnStatus')
    const codPending = searchParams.get('codPending') // special filter for COD collection
    const statusNotIn = searchParams.get('statusNotIn') // comma-separated statuses to exclude
    const createdBy = searchParams.get('createdBy')
    const deliveryMethod = searchParams.get('deliveryMethod')
    const source = searchParams.get('source')
    const expectedDeliveryStartDate = searchParams.get('expectedDeliveryStartDate')
    const expectedDeliveryEndDate = searchParams.get('expectedDeliveryEndDate')
    const approvedStartDate = searchParams.get('approvedStartDate')
    const approvedEndDate = searchParams.get('approvedEndDate')
    const completedStartDate = searchParams.get('completedStartDate')
    const completedEndDate = searchParams.get('completedEndDate')
    const cancelledStartDate = searchParams.get('cancelledStartDate')
    const cancelledEndDate = searchParams.get('cancelledEndDate')
    const printStatus = searchParams.get('printStatus')
    const packagingStatus = searchParams.get('packagingStatus')
    const minGrandTotal = searchParams.get('minGrandTotal')
    const maxGrandTotal = searchParams.get('maxGrandTotal')
    const minDiscount = searchParams.get('minDiscount')
    const maxDiscount = searchParams.get('maxDiscount')
    const hasNotes = searchParams.get('hasNotes')

    const where: Prisma.OrderWhereInput = {}

    const searchWhere = buildSearchWhere<Prisma.OrderWhereInput>(search, [
      'id',
      'customerName',
      { key: 'trackingCode', caseSensitive: true },
    ])
    if (searchWhere) Object.assign(where, searchWhere)

    if (status) {
      where.status = status as OrderStatus
    }

    // Support comma-separated statusIn for filtering by multiple enum values
    const statusIn = searchParams.get('statusIn')
    if (statusIn) {
      const statuses = statusIn.split(',').filter(Boolean) as OrderStatus[]
      if (statuses.length === 1) {
        where.status = statuses[0]
      } else if (statuses.length > 1) {
        where.status = { in: statuses }
      }
    }

    if (statusNotIn) {
      const excluded = statusNotIn.split(',').filter(Boolean) as OrderStatus[]
      if (excluded.length > 0) {
        where.status = { ...((where.status && typeof where.status === 'object') ? where.status : {}), notIn: excluded }
      }
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

    // ⚡ Filter by product - orders containing lineItems for this product
    if (productSystemId) {
      where.lineItems = { some: { productId: productSystemId } }
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

    if (stockOutStatusNot) {
      where.stockOutStatus = { not: stockOutStatusNot as StockOutStatus }
    }

    if (stockOutStatus) {
      where.stockOutStatus = stockOutStatus as StockOutStatus
    }

    if (paymentStatusNot) {
      where.paymentStatus = { not: paymentStatusNot as PaymentStatus }
    }

    if (deliveryStatus) {
      where.deliveryStatus = deliveryStatus as PrismaDeliveryStatus
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus as PaymentStatus
    }

    if (salespersonSystemId) {
      where.salespersonId = salespersonSystemId
    }

    if (returnStatus) {
      const parts = returnStatus.split(',').filter(Boolean) as ReturnStatus[]
      where.returnStatus = parts.length > 1 ? { in: parts } : parts[0]
    }

    if (createdBy) {
      where.createdBy = createdBy
    }

    if (deliveryMethod) {
      where.deliveryMethod = deliveryMethod as DeliveryMethod
    }

    if (source) {
      where.source = { contains: source, mode: 'insensitive' }
    }

    if (expectedDeliveryStartDate || expectedDeliveryEndDate) {
      where.expectedDeliveryDate = {}
      if (expectedDeliveryStartDate) where.expectedDeliveryDate.gte = new Date(expectedDeliveryStartDate)
      if (expectedDeliveryEndDate) where.expectedDeliveryDate.lte = new Date(expectedDeliveryEndDate)
    }

    if (approvedStartDate || approvedEndDate) {
      where.approvedDate = {}
      if (approvedStartDate) where.approvedDate.gte = new Date(approvedStartDate)
      if (approvedEndDate) where.approvedDate.lte = new Date(approvedEndDate)
    }

    if (completedStartDate || completedEndDate) {
      where.completedDate = {}
      if (completedStartDate) where.completedDate.gte = new Date(completedStartDate)
      if (completedEndDate) where.completedDate.lte = new Date(completedEndDate)
    }

    if (cancelledStartDate || cancelledEndDate) {
      where.cancelledDate = {}
      if (cancelledStartDate) where.cancelledDate.gte = new Date(cancelledStartDate)
      if (cancelledEndDate) where.cancelledDate.lte = new Date(cancelledEndDate)
    }

    // Print status filter
    if (printStatus) {
      where.printStatus = printStatus as PrintStatus
    }

    // Packaging status filter (via packagings relation)
    if (packagingStatus) {
      where.packagings = { some: { status: packagingStatus as PackagingStatus } }
    }

    // Grand total range filter
    if (minGrandTotal || maxGrandTotal) {
      where.grandTotal = {}
      if (minGrandTotal) where.grandTotal.gte = parseFloat(minGrandTotal)
      if (maxGrandTotal) where.grandTotal.lte = parseFloat(maxGrandTotal)
    }

    // Discount range filter
    if (minDiscount || maxDiscount) {
      where.discount = {}
      if (minDiscount) where.discount.gte = parseFloat(minDiscount)
      if (maxDiscount) where.discount.lte = parseFloat(maxDiscount)
    }

    // Has notes filter
    if (hasNotes === 'true') {
      where.notes = { not: null }
    } else if (hasNotes === 'false') {
      where.notes = null
    }

    // Special filter: Chờ thu hộ COD (delivered + codAmount > 0 + not paid)
    if (codPending === 'true') {
      where.deliveryStatus = 'DELIVERED' as PrismaDeliveryStatus
      where.codAmount = { gt: 0 }
      where.paymentStatus = { not: PaymentStatus.PAID }
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
                  warrantyPeriodMonths: true,
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

    // ✅ Resolve createdBy IDs to employee names
    const creatorIds = [...new Set(orders.map(o => o.createdBy).filter(Boolean))] as string[]
    const creators = creatorIds.length > 0
      ? await prisma.employee.findMany({
          where: { systemId: { in: creatorIds } },
          select: { systemId: true, fullName: true },
        })
      : []
    const creatorNameMap = new Map(creators.map(e => [e.systemId, e.fullName]))

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
      customerId: order.customer?.id || undefined,
      customerSystemId: order.customer?.systemId || undefined, // ✅ Add customerSystemId from relation
      branchSystemId: order.branchId, // ✅ Add branchSystemId for frontend (order.branchId IS the branch systemId)
      createdByName: order.createdBy ? (creatorNameMap.get(order.createdBy) || order.salespersonName || undefined) : (order.salespersonName || undefined),
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
      // ✅ Build shippingInfo from order-level fields for consistent frontend typing
      shippingInfo: order.shippingInfo as { carrier?: string; service?: string; trackingCode?: string } | undefined ?? {
        carrier: order.shippingCarrier || undefined,
        trackingCode: order.trackingCode || undefined,
      },
      // ✅ Transform linkedSalesReturnValue from Decimal to number
      linkedSalesReturnValue: order.linkedSalesReturnValue ? Number(order.linkedSalesReturnValue) : undefined,
      // ✅ Transform lineItems Decimal fields
      lineItems: order.lineItems.map(item => ({
        ...item,
        productSystemId: item.productId, // DB productId = Product.systemId
        productId: item.productSku || item.product?.id || item.productId, // Business SKU for display
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
    logError('Error fetching orders', error)
    return apiError('Không thể tải danh sách đơn hàng', 500)
  }
}

// ========================================
// ID GENERATION - Using centralized id-system
// ========================================
import { generateNextIdsWithTx } from '@/lib/id-system'
import type { EntityType } from '@/lib/id-config-constants'
import { logError } from '@/lib/logger'
import { syncSingleOrder } from '@/lib/meilisearch-sync'
import { buildSearchWhere } from '@/lib/search/build-search-where'

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
  const [initialCustomer, branch] = await Promise.all([
    prisma.customer.findUnique({ where: { systemId: customerId } }),
    prisma.branch.findUnique({ where: { systemId: branchId } }),
  ])

  // Auto-create customer if not found (for import compatibility)
  let customer = initialCustomer
  if (!customer) {
    // Try lookup by business id
    customer = await prisma.customer.findUnique({ where: { id: customerId } })
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
    ?? { allowNegativeOrder: false };
  
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

  // G4: Enforce maxDebt - prevent order if customer would exceed credit limit
  if (customer && customer.maxDebt != null && Number(customer.maxDebt) > 0) {
    const currentDebt = Number(customer.currentDebt ?? 0)
    const orderTotal = Number(body.grandTotal || 0)
    const projectedDebt = currentDebt + orderTotal
    if (projectedDebt > Number(customer.maxDebt)) {
      return apiError(
        `Khách hàng "${customer.name}" vượt hạn mức công nợ. Công nợ hiện tại: ${currentDebt.toLocaleString('vi-VN')} đ, đơn hàng: ${orderTotal.toLocaleString('vi-VN')} đ, hạn mức: ${Number(customer.maxDebt).toLocaleString('vi-VN')} đ`,
        400
      )
    }
  }

  // ✅ Retry logic for race condition on ID generation
  const MAX_RETRIES = 3
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // ✅ Use transaction to ensure atomic ID generation and insert
      const order = await prisma.$transaction(async (tx) => {
        // Auto-create customer if not found
        let resolvedCustomer = customer
        let resolvedCustomerId = customerId
        if (!resolvedCustomer) {
          const { systemId: custSysId, businessId: custBizId } = await generateNextIdsWithTx(
            tx, 'customers' as EntityType, undefined
          )
          resolvedCustomer = await tx.customer.create({
            data: {
              systemId: custSysId,
              id: custBizId,
              name: body.customerName || customerId || 'Khách hàng mới',
              phone: body.customerPhone || undefined,
            }
          })
          resolvedCustomerId = resolvedCustomer.systemId
        }

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
        
        
        // Check if IDs already exist (debug)
        const existingOrder = await tx.order.findFirst({
          where: { OR: [{ systemId }, { id: finalBusinessId }] },
          select: { systemId: true, id: true }
        })
        if (existingOrder) {
          throw new Error(`Order already exists: systemId=${existingOrder.systemId}, id=${existingOrder.id}`)
        }
        
        // ✅ OPTIMIZED: Batch fetch all products in ONE query (fix N+1)
        const productIds = body.lineItems
          .map(item => item.productSystemId || item.productId)
          .filter((id): id is string => !!id);
        
        // Search by both systemId and business id for import compatibility
        const products = await tx.product.findMany({
          where: {
            OR: [
              { systemId: { in: productIds } },
              { id: { in: productIds } },
            ]
          },
          select: { systemId: true, id: true, name: true }
        });
        // Map by both systemId and business id for flexible lookup
        const productMap = new Map<string, { systemId: string; id: string; name: string }>();
        for (const p of products) {
          productMap.set(p.systemId, p);
          productMap.set(p.id, p);
        }
        
        // Validate all products exist — auto-create missing ones for import
        for (let i = 0; i < body.lineItems.length; i++) {
          const item = body.lineItems[i];
          const productKey = item.productSystemId || item.productId;
          if (!productKey) {
            throw new Error(`Line item #${i + 1} is missing productSystemId or productId`);
          }
          if (!productMap.has(productKey)) {
            // Check if product exists in DB by a different key
            const existingProd = await tx.product.findFirst({
              where: { OR: [{ systemId: productKey }, { id: productKey }] },
              select: { systemId: true, id: true, name: true },
            });
            if (existingProd) {
              productMap.set(existingProd.systemId, existingProd);
              productMap.set(existingProd.id, existingProd);
              productMap.set(productKey, existingProd);
            } else {
              // Auto-create minimal product within transaction
              const { systemId: prodSysId, businessId: prodBizId } = await generateNextIdsWithTx(
                tx, 'products' as EntityType, item.productId || undefined
              );
              // Check if generated ID already exists
              const existingById = await tx.product.findFirst({
                where: { OR: [{ systemId: prodSysId as string }, { id: prodBizId as string }] },
                select: { systemId: true, id: true, name: true },
              });
              if (existingById) {
                productMap.set(existingById.systemId, existingById);
                productMap.set(existingById.id, existingById);
                productMap.set(productKey, existingById);
              } else {
                const newProduct = await tx.product.create({
                  data: {
                    systemId: prodSysId,
                    id: prodBizId,
                    name: item.productName || productKey,
                    unit: 'Cái',
                    status: 'ACTIVE',
                  }
                });
                const entry = { systemId: newProduct.systemId, id: newProduct.id, name: newProduct.name };
                productMap.set(newProduct.systemId, entry);
                productMap.set(newProduct.id, entry);
                if (productKey !== newProduct.systemId && productKey !== newProduct.id) {
                  productMap.set(productKey, entry);
                }
              }
            }
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
        const discount = body.discount || body.orderDiscount || 0
        const grandTotal = body.grandTotal || (subtotal + tax + shippingFee - discount)
    
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
        
        const createdOrder = await tx.order.create({
          data: {
            systemId: systemId,
            id: finalBusinessId,
            customerId: resolvedCustomerId,
            customerName: body.customerName || resolvedCustomer.name,
            branchId: branchId,
            salespersonId: salespersonId,
            branchName: body.branchName || branch.name,
            salespersonName: salespersonName,
            orderDate: body.orderDate ? new Date(body.orderDate) : new Date(),
            expectedDeliveryDate: body.expectedDeliveryDate ? new Date(body.expectedDeliveryDate) : null,
            shippingAddress: shippingAddressValue,
            status: (parseOrderStatus(body.status) || 'PENDING') as OrderStatus,
            paymentStatus: (parsePaymentStatus(body.paymentStatus) || 'UNPAID') as PaymentStatus,
            deliveryStatus: (parseDeliveryStatus(body.deliveryStatus) || 'PENDING_PACK') as PrismaDeliveryStatus,
            deliveryMethod: (parseDeliveryMethod(body.deliveryMethod) || 'SHIPPING') as DeliveryMethod,
            printStatus: (parsePrintStatus(body.printStatus) || 'NOT_PRINTED') as PrintStatus,
            stockOutStatus: (parseStockOutStatus(body.stockOutStatus) || 'NOT_STOCKED_OUT') as StockOutStatus,
            returnStatus: (parseReturnStatus(body.returnStatus) || 'NO_RETURN') as ReturnStatus,
            // ✅ Use provided approvedDate, or auto-set for non-pending orders
            approvedDate: body.approvedDate ? new Date(body.approvedDate)
              : ['PENDING', 'DRAFT'].includes(parseOrderStatus(body.status) || 'PENDING') 
                ? null 
                : new Date(),
            completedDate: body.completedDate ? new Date(body.completedDate) : null,
            cancelledDate: body.cancelledDate ? new Date(body.cancelledDate) : null,
            paidAmount: body.paidAmount || 0,
            codAmount: body.codAmount || 0,
            subtotal,
            shippingFee,
            tax,
            discount,
            grandTotal,
            billingAddress: body.billingAddress ? (typeof body.billingAddress === 'string' ? body.billingAddress : body.billingAddress as Prisma.InputJsonValue) : undefined,
            invoiceInfo: body.invoiceInfo ? body.invoiceInfo as Prisma.InputJsonValue : undefined,
            notes: body.notes,
            source: body.source,
            tags: body.tags || [],
            createdAt: body.createdAt ? new Date(body.createdAt) : new Date(),
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
              
              // ✅ Tracking code: use provided value or leave empty
              // For in-store pickup, tracking code is generated later when in-store-pickup endpoint is called
              const trackingCode = pkg.trackingCode || undefined;
              
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
        // For combo products, commit stock of child components instead
        const stockItems = await resolveStockItems(tx, lineItemsData)
        for (const stockItem of stockItems) {
          await tx.productInventory.upsert({
            where: {
              productId_branchId: {
                productId: stockItem.productId,
                branchId: branchId,
              },
            },
            update: {
              committed: { increment: stockItem.quantity },
              updatedAt: new Date(),
            },
            create: {
              productId: stockItem.productId,
              branchId: branchId,
              onHand: 0,
              committed: stockItem.quantity,
              inTransit: 0,
            },
          });
        }
        

        return createdOrder
      }) // End of transaction

      // ✅ Notify salesperson about new order
      if (order.salespersonId && session.user?.employeeId !== order.salespersonId) {
        createNotification({
          type: 'order',
          title: 'Đơn hàng mới',
          message: `Bạn được giao đơn hàng ${order.id || order.systemId}`,
          link: `/orders/${order.systemId}`,
          recipientId: order.salespersonId,
          senderId: session.user?.employeeId,
          senderName: session.user?.name,
          settingsKey: 'order:created',
        }).catch(e => logError('[Orders POST] notification failed', e))
      }

      // ✅ Log activity
      const userName = await getUserNameFromDb(session.user?.id);
      await prisma.activityLog.create({
        data: {
          entityType: 'order',
          entityId: order.systemId,
          action: 'created',
          actionType: 'create',
          note: `Tạo đơn hàng ${order.id || order.systemId}`,
          metadata: { userName, orderId: order.id, customerName: order.customerName },
          createdBy: userName,
        }
      }).catch(e => logError('[Orders POST] activity log failed', e))

      // ✅ Success - return the order
      // Fire-and-forget: sync to Meilisearch
      syncSingleOrder(order.systemId).catch(e => logError('[Meilisearch] Order sync failed', e))

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
        logError('Error creating order', error)
        const message = error instanceof Error ? error.message : 'Không thể tạo đơn hàng'
        return apiError(message, 500)
      }
    }
  }

  // All retries failed
  logError('[Orders API] All retries failed for order creation', lastError)
  if (lastError instanceof Prisma.PrismaClientKnownRequestError && lastError.code === 'P2002') {
    return apiError('Không thể tạo mã đơn hàng duy nhất. Vui lòng thử lại.', 400)
  }
  return apiError('Không thể tạo đơn hàng sau nhiều lần thử', 500)}