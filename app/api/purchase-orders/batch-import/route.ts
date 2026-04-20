import { prisma } from '@/lib/prisma'
import { PurchaseOrderStatus } from '@/generated/prisma/client'
import { apiSuccess, apiError } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'
import { generateNextIdsWithTx } from '@/lib/id-system'
import { generateIdWithPrefix } from '@/lib/id-generator'
import type { EntityType } from '@/lib/id-config-constants'
import { logError } from '@/lib/logger'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

interface LineItemInput {
  productSku?: string
  productName?: string
  barcode?: string
  quantity: number
  unitPrice: number
  discount?: number
  total?: number
  receivedQty?: number
}

interface POInput {
  id?: string
  supplierId?: string
  supplierName?: string
  branchName?: string
  branchSystemId?: string
  buyerName?: string
  creatorName?: string
  orderDate?: string
  expectedDate?: string
  receivedDate?: string
  deliveryDate?: string
  status?: string
  deliveryStatus?: string
  paymentStatus?: string
  subtotal?: number
  shippingFee?: number
  discount?: number
  tax?: number
  total?: number
  grandTotal?: number
  paid?: number
  debt?: number
  notes?: string
  reference?: string
  createdAt?: string
  lineItems: LineItemInput[]
  payments?: Array<{ method?: string; amount?: number; date?: string; description?: string; reference?: string }>
  returns?: Array<{
    returnOrderId: string
    returnDate?: string
    createdDate?: string
    creatorName?: string
    items: Array<{
      productSku?: string
      productName?: string
      quantity: number
      unitPrice: number
      cost?: number
      tax?: number
      discount?: number
      totalValue?: number
    }>
    totalReturnValue?: number
    refundAmount?: number
    refundMethod?: string
  }>
  _importOptions?: {
    autoCreateSupplier?: boolean
    autoCreateProduct?: boolean
  }
}

interface BatchImportBody {
  purchaseOrders: POInput[]
  mode: 'insert-only' | 'update-only' | 'upsert'
}

// Map Vietnamese status to Prisma enum
function mapStatusToPrismaEnum(status?: string): PurchaseOrderStatus {
  if (!status) return 'DRAFT'
  const statusMap: Record<string, PurchaseOrderStatus> = {
    'Đặt hàng': 'PENDING',
    'Đang giao dịch': 'CONFIRMED',
    'Hoàn thành': 'COMPLETED',
    'Kết thúc': 'COMPLETED',
    'Đã hủy': 'CANCELLED',
    'DRAFT': 'DRAFT',
    'PENDING': 'PENDING',
    'CONFIRMED': 'CONFIRMED',
    'RECEIVING': 'RECEIVING',
    'COMPLETED': 'COMPLETED',
    'CANCELLED': 'CANCELLED',
  }
  return statusMap[status] || 'DRAFT'
}

type TxClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0]

// POST /api/purchase-orders/batch-import
export const POST = apiHandler(async (request, { session }) => {
  let body: BatchImportBody
  try {
    body = await request.json() as BatchImportBody
  } catch {
    return apiError('Invalid JSON body', 400)
  }

  const { purchaseOrders, mode = 'insert-only' } = body
  if (!purchaseOrders || !Array.isArray(purchaseOrders) || purchaseOrders.length === 0) {
    return apiError('No purchase orders provided', 400)
  }

  const results = {
    success: 0,
    failed: 0,
    inserted: 0,
    updated: 0,
    skipped: 0,
    errors: [] as Array<{ index: number; id?: string; message: string }>,
  }

  const createdBy = session!.user?.employee?.fullName || session!.user?.name || 'System'

  try {
    // ─── PRE-FETCH ALL NEEDED DATA IN BATCH ───

    // 1. Suppliers (by business id or name)
    const supplierIdSet = new Set<string>()
    for (const po of purchaseOrders) {
      if (po.supplierId) supplierIdSet.add(po.supplierId)
      if (po.supplierName) supplierIdSet.add(po.supplierName)
    }
    const existingSuppliers = await prisma.supplier.findMany({
      where: {
        OR: [
          { id: { in: [...supplierIdSet] } },
          { name: { in: [...supplierIdSet] } },
          { systemId: { in: [...supplierIdSet] } },
        ],
      },
    })
    const supplierMap = new Map<string, typeof existingSuppliers[0]>()
    for (const s of existingSuppliers) {
      supplierMap.set(s.systemId, s)
      supplierMap.set(s.id, s)
      supplierMap.set(s.name.toLowerCase(), s)
    }

    // 2. Branches (by name)
    const branchNames = new Set<string>()
    for (const po of purchaseOrders) {
      if (po.branchName) branchNames.add(po.branchName)
      if (po.branchSystemId) branchNames.add(po.branchSystemId)
    }
    const branches = await prisma.branch.findMany()
    const branchMap = new Map<string, typeof branches[0]>()
    for (const b of branches) {
      branchMap.set(b.systemId, b)
      branchMap.set(b.name.toLowerCase(), b)
    }

    // 3. Employees (for buyer/creator lookup by name)
    const employeeNames = new Set<string>()
    for (const po of purchaseOrders) {
      if (po.buyerName) employeeNames.add(po.buyerName)
      if (po.creatorName) employeeNames.add(po.creatorName)
    }
    const employees = employeeNames.size > 0 ? await prisma.employee.findMany({
      where: { fullName: { in: [...employeeNames] } },
      select: { systemId: true, fullName: true },
    }) : []
    const employeeMap = new Map<string, typeof employees[0]>()
    for (const e of employees) {
      employeeMap.set(e.fullName.toLowerCase(), e)
    }

    // 4. Products (by SKU or barcode)
    const productSkuSet = new Set<string>()
    for (const po of purchaseOrders) {
      for (const li of po.lineItems || []) {
        if (li.productSku) productSkuSet.add(li.productSku)
        if (li.barcode) productSkuSet.add(li.barcode)
      }
    }
    const existingProducts = await prisma.product.findMany({
      where: {
        OR: [
          { id: { in: [...productSkuSet] } },
          { barcode: { in: [...productSkuSet] } },
          { systemId: { in: [...productSkuSet] } },
        ],
      },
      select: { systemId: true, id: true, name: true, barcode: true },
    })
    const productMap = new Map<string, { systemId: string; id: string; name: string }>()
    for (const p of existingProducts) {
      productMap.set(p.systemId, p)
      productMap.set(p.id, p)
      if (p.barcode) productMap.set(p.barcode, p)
    }

    // 5. Existing POs for duplicate check
    const poBusinessIds = purchaseOrders.map(po => po.id).filter((id): id is string => !!id)
    let existingPOMap = new Map<string, { id: string; systemId: string }>()
    if (poBusinessIds.length > 0) {
      const existingPOs = await prisma.purchaseOrder.findMany({
        where: { id: { in: poBusinessIds } },
        select: { id: true, systemId: true },
      })
      existingPOMap = new Map(existingPOs.map(po => [po.id, po]))
    }

    // ─── PROCESS EACH PO SEQUENTIALLY (no ID race conditions) ───
    for (let i = 0; i < purchaseOrders.length; i++) {
      const poInput = purchaseOrders[i]
      try {
        const existingPO = poInput.id ? existingPOMap.get(poInput.id) : undefined

        if (existingPO) {
          if (mode === 'insert-only') {
            results.skipped++
            continue
          }
          // For upsert/update: update basic fields + price if received
          await prisma.$transaction(async (tx) => {
            await tx.purchaseOrder.update({
              where: { systemId: existingPO.systemId },
              data: {
                status: mapStatusToPrismaEnum(poInput.status),
                deliveryStatus: poInput.deliveryStatus,
                paymentStatus: poInput.paymentStatus,
                paid: poInput.paid,
                debt: poInput.debt,
                notes: poInput.notes,
                updatedAt: new Date(),
              },
            })

            // ─── Update product prices when goods have been received ───
            const deliveryStr = poInput.deliveryStatus || ''
            const statusStr = poInput.status || ''
            const hasReceived =
              deliveryStr.includes('Đã nhập') ||
              deliveryStr.includes('Nhập một phần') ||
              ['Hoàn thành', 'Kết thúc'].includes(statusStr) ||
              poInput.lineItems.some(li => (li.receivedQty || 0) > 0)

            if (hasReceived && poInput.lineItems.length > 0) {
              // Fetch existing PO items to get product links
              const existingItems = await tx.purchaseOrderItem.findMany({
                where: { purchaseOrderId: existingPO.systemId },
                select: { productId: true, unitPrice: true, quantity: true, receivedQty: true },
              })

              // Calculate fee allocation
              const totalQty = existingItems.reduce((sum, li) => sum + (Number(li.quantity) || 0), 0)
              const totalFees = (poInput.shippingFee || 0) + (poInput.tax || 0)
              const feePerUnit = totalQty > 0 ? totalFees / totalQty : 0
              const receiptDate = poInput.receivedDate ? new Date(poInput.receivedDate) : new Date()

              for (const item of existingItems) {
                const unitPrice = Number(item.unitPrice) || 0
                if (!item.productId || unitPrice <= 0) continue

                const costPrice = Math.round(unitPrice + feePerUnit)
                await tx.product.update({
                  where: { systemId: item.productId },
                  data: {
                    lastPurchasePrice: unitPrice,
                    lastPurchaseDate: receiptDate,
                    costPrice,
                  },
                })
              }
            }
          }, { timeout: 15000 })

          results.updated++
          results.success++
          continue
        }

        if (mode === 'update-only') {
          results.skipped++
          continue
        }

        // ─── INSERT NEW PO IN TRANSACTION ───
        // Resolve supplier
        const supplierKey = poInput.supplierId || poInput.supplierName || ''
        let supplier = supplierMap.get(supplierKey) || supplierMap.get(supplierKey.toLowerCase())

        // Resolve branch
        const branchKey = poInput.branchSystemId || poInput.branchName || ''
        const branch = branchMap.get(branchKey) || branchMap.get(branchKey.toLowerCase())

        // Resolve buyer/creator
        const buyerName = poInput.buyerName || poInput.creatorName || ''
        const employee = employeeMap.get(buyerName.toLowerCase())

        await prisma.$transaction(async (tx: TxClient) => {
          // If supplier not found, try within transaction then auto-create if enabled
          if (!supplier && supplierKey) {
            const found = await tx.supplier.findFirst({
              where: {
                OR: [
                  { id: supplierKey },
                  { systemId: supplierKey },
                  { name: { equals: supplierKey, mode: 'insensitive' } },
                ],
              },
            })
            if (found) {
              supplier = found
              supplierMap.set(found.systemId, found)
              supplierMap.set(found.id, found)
              supplierMap.set(found.name.toLowerCase(), found)
            } else if (poInput._importOptions?.autoCreateSupplier !== false) {
              // Auto-create supplier
              const { systemId: supSysId, businessId: supBizId } = await generateNextIdsWithTx(
                tx, 'suppliers' as EntityType, poInput.supplierId || undefined
              )
              // Check if generated ID already exists
              const existingSup = await tx.supplier.findFirst({
                where: { OR: [{ systemId: supSysId as string }, { id: supBizId as string }] },
              })
              if (existingSup) {
                supplier = existingSup
              } else {
                supplier = await tx.supplier.create({
                  data: {
                    systemId: supSysId,
                    id: supBizId as string,
                    name: poInput.supplierName || poInput.supplierId || 'Nhà cung cấp mới',
                    phone: '',
                  },
                })
              }
              supplierMap.set(supplier.systemId, supplier)
              supplierMap.set(supplier.id, supplier)
              supplierMap.set(supplier.name.toLowerCase(), supplier)
              if (supplierKey) supplierMap.set(supplierKey, supplier)
              if (supplierKey.toLowerCase()) supplierMap.set(supplierKey.toLowerCase(), supplier)
            }
          }

          // Generate PO IDs
          const { systemId: poSystemId, businessId: poBusinessId } =
            await generateNextIdsWithTx(tx, 'purchase-orders' as EntityType)
          const finalBusinessId = poInput.id || (poBusinessId as string)

          // Resolve products and build item data
          const itemsData: Array<{
            systemId: string; productId: string; productName: string; productSku: string;
            quantity: number; receivedQty: number; unitPrice: number; discount: number; total: number;
          }> = []

          for (let li = 0; li < (poInput.lineItems || []).length; li++) {
            const item = poInput.lineItems[li]
            const productKey = item.productSku || item.barcode || ''
            let product = productMap.get(productKey)

            if (!product && productKey) {
              // Check DB within transaction
              const existingProd = await tx.product.findFirst({
                where: {
                  OR: [
                    { id: productKey },
                    { barcode: productKey },
                    { systemId: productKey },
                  ],
                },
                select: { systemId: true, id: true, name: true },
              })
              if (existingProd) {
                product = existingProd
              } else if (poInput._importOptions?.autoCreateProduct !== false) {
                // Auto-create product (only when option enabled)
                const { systemId: prodSysId, businessId: prodBizId } = await generateNextIdsWithTx(
                  tx, 'products' as EntityType, item.productSku || undefined
                )
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
                }
              }
              if (product) {
                const p = product
                productMap.set(p.systemId, p)
                productMap.set(p.id, p)
                if (productKey) productMap.set(productKey, p)
              }
            }

            const itemTotal = item.total || (item.quantity * item.unitPrice - (item.discount || 0))
            const itemSystemId = await generateIdWithPrefix('POI', tx as unknown as typeof prisma)

            itemsData.push({
              systemId: itemSystemId,
              productId: product?.systemId || '',
              productName: product?.name || item.productName || productKey,
              productSku: product?.id || item.productSku || '',
              quantity: item.quantity,
              receivedQty: item.receivedQty || 0,
              unitPrice: item.unitPrice,
              discount: item.discount || 0,
              total: itemTotal,
            })
          }

          // Calculate totals
          const subtotal = poInput.subtotal || itemsData.reduce((sum, li) => sum + li.total, 0)
          const tax = poInput.tax || 0
          const shippingFee = poInput.shippingFee || 0
          const discount = poInput.discount || 0
          const grandTotal = poInput.grandTotal || (subtotal + tax + shippingFee - discount)
          const paid = poInput.paid || 0
          const debt = poInput.debt ?? Math.max(0, grandTotal - paid)

          await tx.purchaseOrder.create({
            data: {
              systemId: poSystemId as string,
              id: finalBusinessId,
              // Supplier
              ...(supplier ? { supplier: { connect: { systemId: supplier.systemId } } } : {}),
              supplierSystemId: supplier?.systemId || null,
              supplierName: supplier?.name || poInput.supplierName || '',
              // Branch
              branchSystemId: branch?.systemId || null,
              branchName: branch?.name || poInput.branchName || '',
              // Buyer/creator
              buyerSystemId: employee?.systemId || null,
              buyer: employee?.fullName || poInput.buyerName || '',
              creatorSystemId: employee?.systemId || null,
              creatorName: employee?.fullName || poInput.creatorName || createdBy,
              // Dates
              orderDate: poInput.orderDate ? new Date(poInput.orderDate) : new Date(),
              expectedDate: poInput.expectedDate ? new Date(poInput.expectedDate) : null,
              receivedDate: poInput.receivedDate ? new Date(poInput.receivedDate) : null,
              deliveryDate: poInput.deliveryDate ? new Date(poInput.deliveryDate) : null,
              // Status
              status: mapStatusToPrismaEnum(poInput.status),
              deliveryStatus: poInput.deliveryStatus || 'Chưa nhập',
              paymentStatus: poInput.paymentStatus || 'Chưa thanh toán',
              // Financial
              subtotal,
              tax,
              discount,
              shippingFee,
              total: poInput.total || subtotal,
              grandTotal,
              paid,
              debt,
              // Other
              notes: poInput.notes,
              reference: poInput.reference || null,
              createdAt: poInput.createdAt ? new Date(poInput.createdAt) : new Date(),
              createdBy: createdBy,
              // Items
              items: itemsData.length > 0 ? { create: itemsData } : undefined,
            },
          })

          // Create Payment records if payments exist
          if (poInput.payments && poInput.payments.length > 0) {
            for (let pIdx = 0; pIdx < poInput.payments.length; pIdx++) {
              const p = poInput.payments[pIdx]
              const paymentAmount = p.amount || 0
              if (paymentAmount <= 0) continue

              const { systemId: paySysId, businessId: payBizId } = await generateNextIdsWithTx(
                tx, 'payments' as EntityType
              )
              await tx.payment.create({
                data: {
                  systemId: paySysId,
                  id: payBizId as string,
                  type: 'SUPPLIER_PAYMENT',
                  amount: paymentAmount,
                  description: p.description || `Thanh toán đơn nhập hàng ${finalBusinessId}`,
                  category: 'purchase',
                  status: 'completed',
                  branchId: branch?.systemId || '',
                  branchSystemId: branch?.systemId || null,
                  branchName: branch?.name || poInput.branchName || '',
                  supplierId: supplier?.systemId || null,
                  purchaseOrderId: poSystemId as string,
                  purchaseOrderSystemId: poSystemId as string,
                  purchaseOrderBusinessId: finalBusinessId,
                  method: p.method || 'Tiền mặt',
                  paymentMethod: p.method || 'Tiền mặt',
                  paymentDate: p.date ? new Date(p.date) : new Date(),
                  recipientTypeName: 'Nhà cung cấp',
                  recipientName: supplier?.name || poInput.supplierName || '',
                  recipientSystemId: supplier?.systemId || null,
                  paymentReceiptTypeSystemId: 'PURCHASE',
                  paymentReceiptTypeName: 'Chi tiền nhập hàng',
                  originalDocumentId: finalBusinessId,
                  createdAt: poInput.createdAt ? new Date(poInput.createdAt) : new Date(),
                  createdBy,
                  affectsDebt: true,
                },
              })
            }
          }
          // Create PurchaseReturn records if returns exist
          if (poInput.returns && poInput.returns.length > 0) {
            for (const ret of poInput.returns) {
              // Check if return already exists
              const existingReturn = await tx.purchaseReturn.findFirst({
                where: { id: ret.returnOrderId },
              })
              if (existingReturn) continue

              const { systemId: retSysId, businessId: retBizId } = await generateNextIdsWithTx(
                tx, 'purchase-returns' as EntityType
              )

              const returnItems = ret.items.map(item => ({
                productSku: item.productSku || '',
                productName: item.productName || '',
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                cost: item.cost || 0,
                tax: item.tax || 0,
                discount: item.discount || 0,
                totalValue: item.totalValue || (item.quantity * item.unitPrice),
              }))

              await tx.purchaseReturn.create({
                data: {
                  systemId: retSysId,
                  id: retBizId as string,
                  purchaseOrderId: poSystemId as string,
                  purchaseOrderSystemId: poSystemId as string,
                  purchaseOrderBusinessId: finalBusinessId,
                  supplierId: supplier?.systemId || null,
                  supplierSystemId: supplier?.systemId || null,
                  supplierName: supplier?.name || poInput.supplierName || '',
                  branchId: branch?.systemId || null,
                  branchSystemId: branch?.systemId || null,
                  branchName: branch?.name || poInput.branchName || '',
                  returnDate: ret.returnDate ? new Date(ret.returnDate) : new Date(),
                  createdAt: ret.createdDate ? new Date(ret.createdDate) : new Date(),
                  creatorName: ret.creatorName,
                  status: 'COMPLETED',
                  returnItems: JSON.stringify(returnItems),
                  totalReturnValue: ret.totalReturnValue || 0,
                  refundAmount: ret.refundAmount || 0,
                  refundMethod: ret.refundMethod,
                  subtotal: ret.totalReturnValue || 0,
                  total: ret.totalReturnValue || 0,
                  createdBy,
                },
              })
            }
          }

          // ─── INVENTORY UPDATE: when goods have been received ───
          const deliveryStr = poInput.deliveryStatus || ''
          const statusStr = poInput.status || ''
          const isReceived =
            deliveryStr.includes('Đã nhập') ||
            deliveryStr.includes('Nhập một phần') ||
            ['Hoàn thành', 'Kết thúc'].includes(statusStr) ||
            itemsData.some(li => li.receivedQty > 0)
          if (isReceived && branch && itemsData.length > 0) {
            // Calculate fee allocation per unit
            const totalQty = itemsData.reduce((sum, li) => sum + li.quantity, 0)
            const totalFees = (poInput.shippingFee || 0) + (poInput.tax || 0)
            const feePerUnit = totalQty > 0 ? totalFees / totalQty : 0

            // Create InventoryReceipt (for price history tracking)
            const { systemId: irSysId, businessId: irBizId } = await generateNextIdsWithTx(
              tx, 'inventory-receipts' as EntityType
            )
            const receiptDate = poInput.receivedDate ? new Date(poInput.receivedDate) : new Date()
            const receiptItems = itemsData
              .filter(li => li.productId && li.quantity > 0)
              .map(li => ({
                productId: li.productId,
                productName: li.productName,
                productSku: li.productSku,
                quantity: li.quantity,
                unitCost: li.unitPrice,
                totalCost: li.quantity * li.unitPrice,
              }))

            if (receiptItems.length > 0) {
              await tx.inventoryReceipt.create({
                data: {
                  systemId: irSysId as string,
                  id: irBizId as string,
                  type: 'PURCHASE',
                  branchId: branch.systemId,
                  branchSystemId: branch.systemId,
                  branchName: branch.name,
                  receiptDate,
                  receivedDate: receiptDate,
                  status: 'CONFIRMED',
                  purchaseOrderId: finalBusinessId,
                  purchaseOrderSystemId: poSystemId as string,
                  supplierSystemId: supplier?.systemId || null,
                  supplierName: supplier?.name || poInput.supplierName || '',
                  receiverName: poInput.creatorName || createdBy,
                  createdAt: poInput.createdAt ? new Date(poInput.createdAt) : new Date(),
                  createdBy,
                  notes: `Nhập kho từ đơn nhập hàng Sapo ${finalBusinessId}`,
                  items: { create: receiptItems },
                },
              })
            }

            for (const item of itemsData) {
              if (!item.productId || item.quantity <= 0) continue

              // Update ProductInventory
              const updatedInventory = await tx.productInventory.upsert({
                where: {
                  productId_branchId: {
                    productId: item.productId,
                    branchId: branch.systemId,
                  },
                },
                update: {
                  onHand: { increment: item.quantity },
                  updatedAt: new Date(),
                },
                create: {
                  productId: item.productId,
                  branchId: branch.systemId,
                  onHand: item.quantity,
                  committed: 0,
                  inTransit: 0,
                  inDelivery: 0,
                },
              })

              // Create StockHistory
              await tx.stockHistory.create({
                data: {
                  productId: item.productId,
                  branchId: branch.systemId,
                  action: 'Nhập kho',
                  source: 'Đơn nhập hàng (Sapo import)',
                  quantityChange: item.quantity,
                  newStockLevel: updatedInventory.onHand,
                  documentId: finalBusinessId,
                  documentType: 'purchase_order',
                  employeeName: createdBy,
                  note: `Nhập kho từ đơn nhập hàng ${finalBusinessId}`,
                  createdAt: receiptDate,
                },
              })

              // Update Product cost price
              if (item.unitPrice > 0) {
                const costPrice = Math.round(item.unitPrice + feePerUnit)
                await tx.product.update({
                  where: { systemId: item.productId },
                  data: {
                    lastPurchasePrice: item.unitPrice,
                    lastPurchaseDate: receiptDate,
                    costPrice,
                  },
                })
              }
            }
          }
        }, { timeout: 30000 })

        // Track the created PO to prevent duplicates within the same batch
        if (poInput.id) {
          existingPOMap.set(poInput.id, { id: poInput.id, systemId: poInput.id })
        }

        results.inserted++
        results.success++
      } catch (error) {
        results.failed++
        results.errors.push({
          index: i,
          id: poInput.id,
          message: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    return apiSuccess(results)
  } catch (error) {
    logError('PO Batch import error', error)
    return apiError('Lỗi nhập hàng loạt', 500)
  }
})
