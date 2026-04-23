import { prisma } from '@/lib/prisma'
import { Prisma, OrderStatus, PaymentStatus, DeliveryMethod, DiscountType, PackagingStatus, DeliveryStatus as PrismaDeliveryStatus, PrintStatus, StockOutStatus, ReturnStatus } from '@/generated/prisma/client'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { generateNextIdsWithTx } from '@/lib/id-system'
import type { EntityType } from '@/lib/id-config-constants'
import { logError } from '@/lib/logger'
import { syncOrders, syncCustomers, syncProducts } from '@/lib/meilisearch-sync'
import { createActivityLog } from '@/lib/services/activity-log-service'
import {
  getDefaultCashAccountForVoucher,
  resolvePaymentMethodForVoucherImport,
} from '@/lib/finance/default-voucher-import'
import {
  parseOrderStatus,
  parsePaymentStatus,
  parseDeliveryMethod,
  parseDeliveryStatus,
  parsePrintStatus,
  parseStockOutStatus,
  parseReturnStatus,
  parseDiscountType,
} from '@/lib/constants/order-enums'

/**
 * Normalize Vietnamese phone number:
 * - Remove spaces, dashes, dots
 * - Add leading "0" if starts with 3/5/7/8/9 and has 9 digits
 * - Remove +84 prefix
 */
function normalizePhone(phone?: string): string | undefined {
  if (!phone) return undefined
  let cleaned = String(phone).replace(/[\s\-.]+/g, '').trim()
  if (!cleaned) return undefined
  if (cleaned.startsWith('+84')) cleaned = '0' + cleaned.slice(3)
  if (cleaned.startsWith('84') && cleaned.length === 11) cleaned = '0' + cleaned.slice(2)
  if (/^[3-9]\d{8}$/.test(cleaned)) cleaned = '0' + cleaned
  return cleaned || undefined
}

export const dynamic = 'force-dynamic'
export const maxDuration = 300

interface LineItemInput {
  productSystemId?: string
  productId?: string
  productName?: string
  quantity: number
  unitPrice: number
  discount?: number
  discountType?: string
  tax?: number
  note?: string
}

interface PackagingInput {
  requestDate?: string
  confirmDate?: string
  cancelDate?: string
  deliveredDate?: string
  requestingEmployeeId?: string
  requestingEmployeeName?: string
  confirmingEmployeeId?: string
  confirmingEmployeeName?: string
  assignedEmployeeId?: string
  assignedEmployeeName?: string
  status?: string
  deliveryStatus?: string
  printStatus?: string
  deliveryMethod?: string
  carrier?: string
  service?: string
  trackingCode?: string
  shippingFeeToPartner?: number
  codAmount?: number
  reconciliationStatus?: string
  payer?: string
  noteToShipper?: string
  weight?: number
  dimensions?: string
}

interface OrderInput {
  id?: string
  customerId?: string
  customerSystemId?: string
  customerName?: string
  customerPhone?: string
  branchId?: string
  branchSystemId?: string
  branchName?: string
  salespersonId?: string
  salespersonSystemId?: string
  salespersonName?: string
  salesperson?: string
  assignedPackerSystemId?: string
  assignedPackerName?: string
  lineItems: LineItemInput[]
  orderDate?: string
  expectedDeliveryDate?: string
  expectedPaymentMethod?: string
  shippingAddress?: string | Record<string, unknown> | null
  billingAddress?: string | Record<string, unknown> | null
  status?: string
  paymentStatus?: string
  deliveryStatus?: string
  stockOutStatus?: string
  returnStatus?: string
  printStatus?: string
  deliveryMethod?: string
  shippingFee?: number
  tax?: number
  discount?: number
  orderDiscount?: number
  subtotal?: number
  grandTotal?: number
  paidAmount?: number
  codAmount?: number
  notes?: string
  source?: string
  tags?: string[]
  packagings?: PackagingInput[]
  payments?: Array<{ method?: string; amount?: number; date?: string; description?: string }>
  completedDate?: string | null
  cancelledDate?: string | null
  approvedDate?: string | null
  dispatchedDate?: string | null
  createdAt?: string
  createdBy?: string
}

interface BatchImportBody {
  orders: OrderInput[]
  mode: 'insert-only' | 'update-only' | 'upsert'
}

type TxClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0]

/**
 * Build customer address entry from order shipping address
 */
function buildCustomerAddress(shippingAddress: string | Record<string, unknown> | null | undefined): Prisma.InputJsonValue[] {
  if (!shippingAddress) return []
  const addr = typeof shippingAddress === 'string'
    ? { street: shippingAddress }
    : shippingAddress as Record<string, unknown>
  const street = String(addr.street || addr.formattedAddress || '').trim()
  if (!street) return []
  return [{
    id: crypto.randomUUID(),
    label: 'Địa chỉ giao hàng',
    street,
    ward: String(addr.ward || ''),
    district: String(addr.district || ''),
    province: String(addr.province || ''),
    contactName: String(addr.contactName || ''),
    contactPhone: String(addr.phone || ''),
    isDefaultShipping: true,
  }]
}

// POST /api/orders/batch-import
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  let body: BatchImportBody
  try {
    body = await request.json() as BatchImportBody
  } catch {
    return apiError('Invalid JSON body', 400)
  }

  const { orders, mode = 'insert-only' } = body
  if (!orders || !Array.isArray(orders) || orders.length === 0) {
    return apiError('No orders provided', 400)
  }

  const results = {
    success: 0,
    failed: 0,
    inserted: 0,
    updated: 0,
    skipped: 0,
    newProducts: 0,
    newCustomers: 0,
    errors: [] as Array<{ index: number; id?: string; message: string }>,
  }

  const createdBy = session.user?.employee?.fullName || session.user?.name || 'System'

  try {
    // ─── PRE-FETCH ALL NEEDED DATA IN BATCH ───

    // 1. Branches
    const branchIdSet = new Set<string>()
    for (const o of orders) {
      const bid = o.branchId || o.branchSystemId
      if (bid) branchIdSet.add(bid)
    }
    const branches = await prisma.branch.findMany({
      where: { systemId: { in: [...branchIdSet] } },
    })
    const branchMap = new Map(branches.map(b => [b.systemId, b]))

    // 2. Customers (by systemId or business id)
    const customerIdSet = new Set<string>()
    for (const o of orders) {
      const cid = o.customerId || o.customerSystemId
      if (cid) customerIdSet.add(cid)
    }
    const existingCustomers = await prisma.customer.findMany({
      where: {
        OR: [
          { systemId: { in: [...customerIdSet] } },
          { id: { in: [...customerIdSet] } },
        ],
      },
    })
    const customerMap = new Map<string, typeof existingCustomers[0]>()
    for (const c of existingCustomers) {
      customerMap.set(c.systemId, c)
      customerMap.set(c.id, c)
    }

    // 3. Products (by systemId or business id)
    const productIdSet = new Set<string>()
    for (const o of orders) {
      for (const li of o.lineItems || []) {
        const pid = li.productSystemId || li.productId
        if (pid) productIdSet.add(pid)
      }
    }
    const existingProducts = await prisma.product.findMany({
      where: {
        OR: [
          { systemId: { in: [...productIdSet] } },
          { id: { in: [...productIdSet] } },
        ],
      },
      select: { systemId: true, id: true, name: true },
    })
    const productMap = new Map<string, { systemId: string; id: string; name: string }>()
    for (const p of existingProducts) {
      productMap.set(p.systemId, p)
      productMap.set(p.id, p)
      productMap.set(p.id.toLowerCase(), p)
    }

    // 4. Existing orders for duplicate check
    const orderBusinessIds = orders.map(o => o.id).filter((id): id is string => !!id)
    let existingOrderMap = new Map<string, { id: string; systemId: string }>()
    if (orderBusinessIds.length > 0) {
      const existingOrders = await prisma.order.findMany({
        where: { id: { in: orderBusinessIds } },
        select: { id: true, systemId: true },
      })
      existingOrderMap = new Map(existingOrders.map(o => [o.id, o]))
    }

    // ─── PROCESS EACH ORDER SEQUENTIALLY (no ID race conditions) ───
    for (let i = 0; i < orders.length; i++) {
      const orderInput = orders[i]
      try {
        const existingOrder = orderInput.id ? existingOrderMap.get(orderInput.id) : undefined

        if (existingOrder) {
          if (mode === 'insert-only') {
            results.skipped++
            continue
          }
          // For upsert/update: update basic fields only
          await prisma.order.update({
            where: { systemId: existingOrder.systemId },
            data: {
              status: (parseOrderStatus(orderInput.status) || undefined) as OrderStatus | undefined,
              paymentStatus: (parsePaymentStatus(orderInput.paymentStatus) || undefined) as PaymentStatus | undefined,
              deliveryStatus: (parseDeliveryStatus(orderInput.deliveryStatus) || undefined) as PrismaDeliveryStatus | undefined,
              printStatus: (parsePrintStatus(orderInput.printStatus) || undefined) as PrintStatus | undefined,
              stockOutStatus: (parseStockOutStatus(orderInput.stockOutStatus) || undefined) as StockOutStatus | undefined,
              returnStatus: (parseReturnStatus(orderInput.returnStatus) || undefined) as ReturnStatus | undefined,
              paidAmount: orderInput.paidAmount,
              codAmount: orderInput.codAmount,
              notes: orderInput.notes,
              updatedAt: new Date(),
            },
          })
          results.updated++
          results.success++
          continue
        }

        if (mode === 'update-only') {
          results.skipped++
          continue
        }

        // ─── INSERT NEW ORDER IN TRANSACTION ───
        const branchId = orderInput.branchId || orderInput.branchSystemId || ''
        const branch = branchMap.get(branchId)
        if (!branch) {
          results.failed++
          results.errors.push({ index: i, id: orderInput.id, message: `Branch not found: ${branchId}` })
          continue
        }

        await prisma.$transaction(async (tx: TxClient) => {
          // Normalize phone number (add leading 0 for Vietnamese numbers)
          const normalizedPhone = normalizePhone(orderInput.customerPhone)
          if (normalizedPhone) orderInput.customerPhone = normalizedPhone

          // Resolve customer
          const customerKey = orderInput.customerId || orderInput.customerSystemId || ''
          let customer = customerMap.get(customerKey)
          // Also check by normalized phone in the in-memory map
          if (!customer && normalizedPhone) {
            customer = customerMap.get(`phone:${normalizedPhone}`)
          }
          if (!customer) {
            // Check DB within transaction (may exist from previous import)
            const orConditions: Array<Record<string, unknown>> = []
            if (customerKey) {
              orConditions.push({ systemId: customerKey }, { id: customerKey }, { name: customerKey })
            }
            if (normalizedPhone) {
              orConditions.push({ phone: normalizedPhone })
            }
            if (orConditions.length > 0) {
              customer = await tx.customer.findFirst({
                where: { OR: orConditions },
              }) ?? undefined
            }
          }
          if (!customer) {
            const { systemId: custSysId, businessId: custBizId } = await generateNextIdsWithTx(
              tx, 'customers' as EntityType, undefined
            )
            // Check if generated ID already exists
            const existingCust = await tx.customer.findFirst({
              where: { OR: [{ systemId: custSysId as string }, { id: custBizId as string }] },
            })
            if (existingCust) {
              customer = existingCust
            } else {
              // Build initial address from shipping address data
              const initialAddresses = buildCustomerAddress(orderInput.shippingAddress)
              customer = await tx.customer.create({
                data: {
                  systemId: custSysId,
                  id: custBizId as string,
                  name: orderInput.customerName || customerKey || 'Khách hàng mới',
                  phone: orderInput.customerPhone || undefined,
                  ...(initialAddresses.length > 0 ? { addresses: initialAddresses } : {}),
                },
              })
              results.newCustomers++
            }
          }

          // Append new address to existing customer if shipping address is new
          if (customer && orderInput.shippingAddress) {
            const newAddr = buildCustomerAddress(orderInput.shippingAddress)
            if (newAddr.length > 0) {
              const newStreet = (newAddr[0] as { street?: string }).street || ''
              if (newStreet) {
                // Fetch current addresses from DB
                const custWithAddr = await tx.customer.findUnique({
                  where: { systemId: customer.systemId },
                  select: { addresses: true },
                })
                const addrList = Array.isArray(custWithAddr?.addresses) ? custWithAddr.addresses as Prisma.InputJsonValue[] : []
                const isDuplicate = addrList.some((a) => {
                  const addr = a as { street?: string }
                  return addr.street && addr.street === newStreet
                })
                if (!isDuplicate) {
                  await tx.customer.update({
                    where: { systemId: customer.systemId },
                    data: { addresses: [...addrList, ...newAddr] as Prisma.InputJsonValue },
                  })
                }
              }
            }
          }
          customerMap.set(customer.systemId, customer)
          customerMap.set(customer.id, customer)
          if (customerKey) customerMap.set(customerKey, customer)
          if (normalizedPhone) customerMap.set(`phone:${normalizedPhone}`, customer)

          // Generate order IDs
          const { systemId: orderSystemId, businessId: orderBusinessId, counter: orderNum } =
            await generateNextIdsWithTx(tx, 'orders' as EntityType)
          const finalBusinessId = orderInput.id || (orderBusinessId as string)

          // Resolve products and build lineItems
          const lineItemsData: Array<{
            systemId: string; productId: string; productSku: string; productName: string;
            quantity: number; unitPrice: number; discount: number; discountType?: DiscountType;
            tax: number; total: number; note?: string;
          }> = []
          for (let li = 0; li < (orderInput.lineItems || []).length; li++) {
            const item = orderInput.lineItems[li]
            const productKey = item.productSystemId || item.productId || ''
            let product = productMap.get(productKey) || productMap.get(productKey.toLowerCase())
            if (!product) {
              // Check DB within transaction (may exist from previous import)
              const existingProd = await tx.product.findFirst({
                where: { OR: [{ systemId: productKey }, { id: { equals: productKey, mode: 'insensitive' } }] },
                select: { systemId: true, id: true, name: true },
              })
              if (existingProd) {
                product = existingProd
              } else {
                // Generate IDs then check if the generated businessId already exists
                const { systemId: prodSysId, businessId: prodBizId } = await generateNextIdsWithTx(
                  tx, 'products' as EntityType, item.productId || undefined
                )
                // Check if generated ID already exists (race with previous imports)
                const existingById = await tx.product.findFirst({
                  where: { OR: [{ systemId: prodSysId as string }, { id: prodBizId as string }] },
                  select: { systemId: true, id: true, name: true },
                })
                if (existingById) {
                  product = existingById
                } else {
                  const newProd = await tx.product.create({
                    data: {
                      systemId: prodSysId,
                      id: prodBizId as string,
                      name: item.productName || productKey,
                      unit: 'Cái',
                      status: 'ACTIVE',
                    },
                  })
                  product = { systemId: newProd.systemId, id: newProd.id, name: newProd.name }
                  results.newProducts++
                }
              }
              productMap.set(product.systemId, product)
              productMap.set(product.id, product)
              if (productKey) productMap.set(productKey, product)
            }

            const itemTotal = item.quantity * item.unitPrice - (item.discount || 0)
            lineItemsData.push({
              systemId: `OLI${String(orderNum).padStart(6, '0')}-${String(li + 1).padStart(3, '0')}`,
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
            })
          }

          // Calculate totals
          const subtotal = lineItemsData.reduce((sum, li) => sum + li.total, 0)
          const tax = orderInput.tax || 0
          const shippingFee = orderInput.shippingFee || 0
          const discount = orderInput.discount || orderInput.orderDiscount || 0
          const grandTotal = orderInput.grandTotal || (subtotal + tax + shippingFee - discount)

          // Build packaging data
          const packagingsCreate = (orderInput.packagings || []).map((pkg, idx) => {
            const packagingIndex = String(idx + 1).padStart(2, '0')
            const orderNumPadded = String(orderNum).padStart(6, '0')

            const packagingStatus = pkg.status === 'Đã đóng gói' ? 'COMPLETED'
              : pkg.status === 'Chờ đóng gói' ? 'PENDING'
              : pkg.status === 'Đang đóng gói' ? 'IN_PROGRESS'
              : pkg.status === 'Đã hủy' ? 'CANCELLED'
              : 'PENDING'

            const deliveryStatus = pkg.deliveryStatus === 'Chờ lấy hàng' ? 'PENDING_SHIP'
              : pkg.deliveryStatus === 'Đang giao hàng' ? 'SHIPPING'
              : pkg.deliveryStatus === 'Đã giao hàng' ? 'DELIVERED'
              : pkg.deliveryStatus === 'Chờ đóng gói' ? 'PENDING_PACK'
              : pkg.deliveryStatus === 'Đã đóng gói' ? 'PACKED'
              : pkg.deliveryStatus === 'Đã hủy' ? 'CANCELLED'
              : 'PENDING_PACK'

            const printStatus = pkg.printStatus === 'Đã in' ? 'PRINTED' : 'NOT_PRINTED'

            const deliveryMethod = pkg.deliveryMethod === 'Nhận tại cửa hàng' ? 'IN_STORE_PICKUP'
              : pkg.deliveryMethod === 'Dịch vụ giao hàng' ? 'SHIPPING'
              : pkg.deliveryMethod === 'Lấy tại kho' ? 'PICKUP'
              : 'SHIPPING'

            // Thời gian đóng gói / thao tác Sapo: không mặc định theo thời điểm import (now)
            const requestDateFallback = orderInput.orderDate
              ? new Date(orderInput.orderDate)
              : orderInput.createdAt
                ? new Date(orderInput.createdAt)
                : new Date()

            return {
              systemId: `PACKAGE${orderNumPadded}-${packagingIndex}`,
              id: `DG${orderNumPadded}-${packagingIndex}`,
              branchId: branchId,
              requestDate: pkg.requestDate ? new Date(pkg.requestDate) : requestDateFallback,
              confirmDate: pkg.confirmDate ? new Date(pkg.confirmDate) : null,
              cancelDate: pkg.cancelDate ? new Date(pkg.cancelDate) : null,
              deliveredDate: pkg.deliveredDate ? new Date(pkg.deliveredDate) : null,
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
              trackingCode: pkg.trackingCode || undefined,
              shippingFeeToPartner: pkg.shippingFeeToPartner,
              codAmount: pkg.codAmount,
              reconciliationStatus: pkg.reconciliationStatus || undefined,
              payer: pkg.payer,
              noteToShipper: pkg.noteToShipper,
              weight: pkg.weight,
              dimensions: pkg.dimensions,
              createdBy,
            }
          })

          const pmForPayments: Array<{ name: string; systemId: string }> = []
          let importDefaultCash = null as Awaited<
            ReturnType<typeof getDefaultCashAccountForVoucher>
          > | null
          if (orderInput.payments && orderInput.payments.length > 0) {
            importDefaultCash = await getDefaultCashAccountForVoucher(tx, branchId)
            for (const p of orderInput.payments) {
              const pm = await resolvePaymentMethodForVoucherImport(tx, p.method)
              pmForPayments.push({ name: pm.name, systemId: pm.systemId })
            }
          }

          // Normalize shippingAddress
          let shippingAddressValue: Prisma.InputJsonValue | undefined = undefined
          if (orderInput.shippingAddress) {
            shippingAddressValue = typeof orderInput.shippingAddress === 'string'
              ? orderInput.shippingAddress
              : orderInput.shippingAddress as Prisma.InputJsonValue
          }

          const salespersonId = orderInput.salespersonId || orderInput.salespersonSystemId || ''
          const salespersonName = orderInput.salespersonName || orderInput.salesperson || 'N/A'

          await tx.order.create({
            data: {
              systemId: orderSystemId as string,
              id: finalBusinessId,
              customerId: customer.systemId,
              customerName: orderInput.customerName || customer.name,
              branchId: branchId,
              branchName: orderInput.branchName || branch.name,
              salespersonId,
              salespersonName,
              orderDate: orderInput.orderDate ? new Date(orderInput.orderDate) : new Date(),
              expectedDeliveryDate: orderInput.expectedDeliveryDate ? new Date(orderInput.expectedDeliveryDate) : null,
              shippingAddress: shippingAddressValue,
              status: (parseOrderStatus(orderInput.status) || 'PENDING') as OrderStatus,
              paymentStatus: (parsePaymentStatus(orderInput.paymentStatus) || 'UNPAID') as PaymentStatus,
              deliveryStatus: (parseDeliveryStatus(orderInput.deliveryStatus) || 'PENDING_PACK') as PrismaDeliveryStatus,
              deliveryMethod: (parseDeliveryMethod(orderInput.deliveryMethod) || 'SHIPPING') as DeliveryMethod,
              printStatus: (parsePrintStatus(orderInput.printStatus) || 'NOT_PRINTED') as PrintStatus,
              stockOutStatus: (parseStockOutStatus(orderInput.stockOutStatus) || 'NOT_STOCKED_OUT') as StockOutStatus,
              returnStatus: (parseReturnStatus(orderInput.returnStatus) || 'NO_RETURN') as ReturnStatus,
              approvedDate: orderInput.approvedDate ? new Date(orderInput.approvedDate)
                : ['PENDING', 'DRAFT'].includes(parseOrderStatus(orderInput.status) || 'PENDING')
                  ? null : new Date(),
              completedDate: orderInput.completedDate ? new Date(orderInput.completedDate) : null,
              cancelledDate: orderInput.cancelledDate ? new Date(orderInput.cancelledDate) : null,
              dispatchedDate: orderInput.dispatchedDate ? new Date(orderInput.dispatchedDate) : null,
              paidAmount: orderInput.paidAmount || 0,
              codAmount: orderInput.codAmount || 0,
              subtotal,
              shippingFee,
              tax,
              discount,
              grandTotal,
              notes: orderInput.notes,
              source: orderInput.source,
              tags: orderInput.tags || [],
              createdAt: orderInput.createdAt ? new Date(orderInput.createdAt) : new Date(),
              createdBy: orderInput.createdBy || createdBy,
              lineItems: { create: lineItemsData },
              ...(packagingsCreate.length > 0 ? { packagings: { create: packagingsCreate } } : {}),
              ...((orderInput.payments && orderInput.payments.length > 0) ? {
                payments: {
                  create: orderInput.payments.map((p, idx) => ({
                    id: `PT${String(orderNum).padStart(6, '0')}-${String(idx + 1).padStart(2, '0')}`,
                    method: pmForPayments[idx]?.name ?? p.method ?? 'Tiền mặt',
                    amount: p.amount || 0,
                    date: p.date ? new Date(p.date) : new Date(),
                    description: p.description || undefined,
                    createdBy: orderInput.createdBy || createdBy,
                  })),
                },
              } : {}),
            },
          })

          // Create Receipt records for each payment (so debt system recognizes them)
          if (orderInput.payments && orderInput.payments.length > 0) {
            for (let pIdx = 0; pIdx < orderInput.payments.length; pIdx++) {
              const p = orderInput.payments[pIdx]
              const paymentAmount = p.amount || 0
              if (paymentAmount <= 0) continue

              const { systemId: receiptSysId, businessId: receiptBizId } = await generateNextIdsWithTx(
                tx, 'receipts' as EntityType
              )
              const pmR = pmForPayments[pIdx]!
              await tx.receipt.create({
                data: {
                  systemId: receiptSysId,
                  id: receiptBizId as string,
                  type: 'CUSTOMER_PAYMENT',
                  amount: paymentAmount,
                  description: p.description || `Thu tiền đơn hàng ${finalBusinessId}`,
                  category: 'sale',
                  status: 'completed',
                  branchId: branchId,
                  orderId: orderSystemId as string,
                  payerTypeName: 'Khách hàng',
                  payerTypeSystemId: 'CUSTOMER',
                  payerName: orderInput.customerName || customer.name,
                  payerSystemId: customer.systemId,
                  customerSystemId: customer.systemId,
                  customerName: orderInput.customerName || customer.name,
                  method: pmR.name,
                  paymentMethod: pmR.name,
                  paymentMethodName: pmR.name,
                  paymentMethodSystemId: pmR.systemId,
                  accountSystemId: importDefaultCash?.systemId,
                  paymentReceiptTypeSystemId: 'SALE',
                  paymentReceiptTypeName: 'Thu tiền bán hàng',
                  branchSystemId: branchId,
                  branchName: orderInput.branchName || branch.name,
                  linkedOrderSystemId: orderSystemId as string,
                  originalDocumentId: finalBusinessId,
                  receiptDate: p.date ? new Date(p.date) : new Date(),
                  createdAt: orderInput.createdAt ? new Date(orderInput.createdAt) : new Date(),
                  createdBy: orderInput.createdBy || createdBy,
                  affectsDebt: true,
                },
              })
            }
          }

          // ── Update ProductInventory based on order status ──
          const parsedStockOut = parseStockOutStatus(orderInput.stockOutStatus) || 'NOT_STOCKED_OUT'
          const parsedStatus = parseOrderStatus(orderInput.status) || 'PENDING'

          if (branch && lineItemsData.length > 0) {
            const stockOutDate = orderInput.dispatchedDate
              ? new Date(orderInput.dispatchedDate)
              : orderInput.orderDate
                ? new Date(orderInput.orderDate)
                : new Date()

            // Determine which counters to update based on order lifecycle stage
            const isStockedOut = parsedStockOut === 'FULLY_STOCKED_OUT'
            const isDelivered = parsedStatus === 'COMPLETED' || parsedStatus === 'DELIVERED'
            const isShipping = isStockedOut && !isDelivered // Đã xuất kho nhưng chưa giao xong
            const isPending = !isStockedOut && parsedStatus !== 'CANCELLED'

            for (const item of lineItemsData) {
              if (!item.productId || item.quantity <= 0) continue

              if (isStockedOut) {
                // Đã xuất kho: onHand--, inDelivery++ (nếu đang giao)
                const updatedInventory = await tx.productInventory.upsert({
                  where: {
                    productId_branchId: {
                      productId: item.productId,
                      branchId: branch.systemId,
                    },
                  },
                  update: {
                    onHand: { decrement: item.quantity },
                    ...(isShipping ? { inDelivery: { increment: item.quantity } } : {}),
                    updatedAt: new Date(),
                  },
                  create: {
                    productId: item.productId,
                    branchId: branch.systemId,
                    onHand: -item.quantity,
                    committed: 0,
                    inTransit: 0,
                    inDelivery: isShipping ? item.quantity : 0,
                  },
                })

                // Update totalSold on Product if delivered/completed
                if (isDelivered) {
                  await tx.product.update({
                    where: { systemId: item.productId },
                    data: { totalSold: { increment: item.quantity } },
                  }).catch(() => {}) // product may not exist yet for auto-created
                }

                // Create StockHistory
                await tx.stockHistory.create({
                  data: {
                    productId: item.productId,
                    branchId: branch.systemId,
                    action: 'Xuất kho bán hàng',
                    source: 'Đơn hàng (Sapo import)',
                    quantityChange: -item.quantity,
                    newStockLevel: updatedInventory.onHand,
                    documentId: finalBusinessId,
                    documentType: 'sales_order',
                    employeeName: orderInput.salespersonName || orderInput.salesperson || createdBy,
                    note: `Xuất kho bán hàng - ${finalBusinessId}`,
                    createdAt: stockOutDate,
                  },
                })
              } else if (isPending) {
                // Chưa xuất kho, đơn đang chờ → committed++ (chờ xuất kho)
                await tx.productInventory.upsert({
                  where: {
                    productId_branchId: {
                      productId: item.productId,
                      branchId: branch.systemId,
                    },
                  },
                  update: {
                    committed: { increment: item.quantity },
                    updatedAt: new Date(),
                  },
                  create: {
                    productId: item.productId,
                    branchId: branch.systemId,
                    onHand: 0,
                    committed: item.quantity,
                    inTransit: 0,
                    inDelivery: 0,
                  },
                })
              }
            }
          }

          /** Mốc thời gian mã vận đơn: ưu tiên ngày từ packaging Sapo → đơn Sapo, không mặc định theo thời điểm import. */
          const waybillEventAt = (
            p: (typeof packagingsCreate)[number],
            o: OrderInput,
          ): Date => {
            if (p.requestDate) return p.requestDate
            if (p.confirmDate) return p.confirmDate
            if (p.deliveredDate) return p.deliveredDate
            if (o.createdAt) {
              const d = new Date(o.createdAt)
              if (!Number.isNaN(d.getTime())) return d
            }
            if (o.orderDate) {
              const d = new Date(o.orderDate)
              if (!Number.isNaN(d.getTime())) return d
            }
            return new Date()
          }

          // Create Shipment records for packagings that have trackingCode
          for (const pkg of packagingsCreate) {
            if (!pkg.trackingCode || !pkg.carrier) continue

            const lastShipment = await tx.shipment.findFirst({
              orderBy: { systemId: 'desc' },
              select: { systemId: true },
              where: { systemId: { startsWith: 'SHIPMENT' } },
            })
            const lastNum = lastShipment?.systemId
              ? parseInt(lastShipment.systemId.replace('SHIPMENT', '')) || 0
              : 0
            const shipmentSysId = `SHIPMENT${String(lastNum + 1).padStart(6, '0')}`
            const at = waybillEventAt(pkg, orderInput)
            const isDelivered = pkg.deliveryStatus === 'DELIVERED'

            await tx.shipment.create({
              data: {
                systemId: shipmentSysId,
                id: shipmentSysId,
                orderId: orderSystemId as string,
                packagingSystemId: pkg.systemId,
                trackingCode: pkg.trackingCode,
                carrier: pkg.carrier,
                status: isDelivered ? 'DELIVERED'
                  : pkg.deliveryStatus === 'SHIPPING' ? 'IN_TRANSIT'
                  : 'PENDING',
                deliveryStatus: isDelivered ? 'Đã giao hàng'
                  : pkg.deliveryStatus === 'SHIPPING' ? 'Đang giao hàng'
                  : pkg.deliveryStatus === 'PENDING_SHIP' ? 'Chờ lấy hàng'
                  : undefined,
                codAmount: pkg.codAmount || 0,
                shippingFeeToPartner: pkg.shippingFeeToPartner || 0,
                service: pkg.service || undefined,
                recipientName: orderInput.customerName,
                recipientPhone: orderInput.customerPhone || undefined,
                createdBy,
                createdAt: at,
                updatedAt: at,
                deliveredAt: isDelivered ? (pkg.deliveredDate ?? at) : null,
              },
            })
          }
        }, { timeout: 30000 })

        // Track the created order to prevent duplicates within the same batch
        if (orderInput.id) {
          existingOrderMap.set(orderInput.id, { id: orderInput.id, systemId: orderInput.id })
        }

        results.inserted++
        results.success++
      } catch (error) {
        results.failed++
        results.errors.push({
          index: i,
          id: orderInput.id,
          message: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    // Fire-and-forget: full sync to Meilisearch after batch import
    if (results.success > 0) {
      Promise.all([
        syncOrders(),
        syncCustomers(),
        syncProducts({ fullSync: true }),
      ]).catch(e => logError('[Meilisearch] Order batch import sync failed', e))
    }

    // Log the batch import as a single aggregated activity
    createActivityLog({
      entityType: 'order',
      entityId: 'BATCH',
      action: `Nhập hàng loạt đơn hàng (${results.success}/${orders.length})`,
      actionType: 'system',
      note: `Mode: ${mode} · Inserted: ${results.inserted} · Updated: ${results.updated} · Skipped: ${results.skipped} · Failed: ${results.failed}`,
      metadata: {
        userName: createdBy,
        total: orders.length,
        inserted: results.inserted,
        updated: results.updated,
        skipped: results.skipped,
        failed: results.failed,
        newCustomers: results.newCustomers,
        newProducts: results.newProducts,
        mode,
      },
      createdBy: session.user?.employeeId || createdBy,
    }).catch(() => undefined)

    return apiSuccess(results)
  } catch (error) {
    logError('Batch import error', error)
    const message = error instanceof Error ? error.message : 'Batch import failed'
    return apiError(message, 500)
  }
}
