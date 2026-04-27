import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiError, isAdmin } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'
import { getMeiliClient, INDEXES } from '@/lib/meilisearch'
import { z } from 'zod'
import { execSync } from 'child_process'
import { existsSync, rmSync } from 'node:fs'
import path from 'path'
import bcrypt from 'bcryptjs'

// ============================================
// GET /api/admin-tools — Counts for dashboard
// ============================================
export const GET = apiHandler(async (_req, { session }) => {
  if (!session || !isAdmin(session)) {
    return apiError('Chỉ Admin mới có quyền truy cập', 403)
  }

  const [
    products, customers, orders, purchaseOrders,
    suppliers, receipts, payments, activityLogs,
    attendance, leaves, payrolls, penalties,
    brands, categories, salesReturns, shipments,
    packagings, reconciliation, stockTransfers, inventoryChecks,
    costAdjustments, priceAdjustments, cashAccounts, cashTransactions,
    tasks, supplierWarranties, complaints, wiki,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.customer.count(),
    prisma.order.count(),
    prisma.purchaseOrder.count(),
    prisma.supplier.count(),
    prisma.receipt.count(),
    prisma.payment.count(),
    prisma.activityLog.count(),
    prisma.attendanceRecord.count(),
    prisma.leave.count(),
    prisma.payroll.count(),
    prisma.penalty.count(),
    prisma.brand.count(),
    prisma.category.count(),
    prisma.salesReturn.count(),
    prisma.shipment.count(),
    prisma.packaging.count(),
    prisma.reconciliationSheet.count(),
    prisma.stockTransfer.count(),
    prisma.inventoryCheck.count(),
    prisma.costAdjustment.count(),
    prisma.priceAdjustment.count(),
    prisma.cashAccount.count(),
    prisma.cashTransaction.count(),
    prisma.task.count(),
    prisma.supplierWarranty.count(),
    prisma.complaint.count(),
    prisma.wiki.count(),
  ])

  return apiSuccess({
    products, customers, orders, purchaseOrders,
    suppliers, receipts, payments, activityLogs,
    attendance, leaves, payrolls, penalties,
    brands, categories, salesReturns, shipments,
    packagings, reconciliation, stockTransfers, inventoryChecks,
    costAdjustments, priceAdjustments, cashAccounts, cashTransactions,
    tasks, supplierWarranties, complaints, wiki,
  })
})

// ============================================
// POST /api/admin-tools — Bulk operations
// ============================================
const actionSchema = z.object({
  action: z.enum([
    // Delete - existing broad
    'delete-products', 'delete-customers', 'delete-orders',
    'delete-purchase-orders', 'delete-suppliers', 'delete-finance',
    // Delete - granular per module
    'delete-attendance', 'delete-leaves', 'delete-payroll', 'delete-penalties',
    'delete-brands', 'delete-categories',
    'delete-sales-returns', 'delete-shipments', 'delete-reconciliation',
    'delete-stock-transfers', 'delete-inventory-checks',
    'delete-cost-adjustments', 'delete-price-adjustments',
    'delete-cashbook', 'delete-tasks', 'delete-warranty',
    'delete-complaints', 'delete-wiki',
    // Bulk
    'purge-all-business-data', 'delete-all-settings', 'clear-activity-logs', 'resync-meilisearch',
    // Seed
    'seed-all-settings', 'seed-roles', 'seed-admin-units', 'seed-sample-employees',
    // System
    'reset-user-password', 'system-health-check', 'database-statistics',
    'force-logout-all', 'export-db-backup', 'permission-audit', 'docker-prune',
    'check-disk', 'deploy-rebuild', 'prisma-migrate', 'prisma-db-push', 'docker-builder-prune',
    'clear-next-cache',
  ]),
  confirmText: z.string(),
  // Extra data for specific actions
  extra: z.record(z.string(), z.string()).optional(),
})

const CONFIRM_MAP: Record<string, string> = {
  'delete-products': 'XÓA SẢN PHẨM',
  'delete-customers': 'XÓA KHÁCH HÀNG',
  'delete-orders': 'XÓA ĐƠN HÀNG',
  'delete-purchase-orders': 'XÓA ĐƠN NHẬP',
  'delete-suppliers': 'XÓA NHÀ CUNG CẤP',
  'delete-finance': 'XÓA TÀI CHÍNH',
  'delete-attendance': 'XÓA CHẤM CÔNG',
  'delete-leaves': 'XÓA NGHỈ PHÉP',
  'delete-payroll': 'XÓA BẢNG LƯƠNG',
  'delete-penalties': 'XÓA PHIẾU PHẠT',
  'delete-brands': 'XÓA THƯƠNG HIỆU',
  'delete-categories': 'XÓA DANH MỤC',
  'delete-sales-returns': 'XÓA TRẢ HÀNG',
  'delete-shipments': 'XÓA VẬN ĐƠN',
  'delete-reconciliation': 'XÓA ĐỐI SOÁT',
  'delete-stock-transfers': 'XÓA CHUYỂN KHO',
  'delete-inventory-checks': 'XÓA KIỂM KÊ',
  'delete-cost-adjustments': 'XÓA GIÁ VỐN',
  'delete-price-adjustments': 'XÓA GIÁ BÁN',
  'delete-cashbook': 'XÓA SỔ QUỸ',
  'delete-tasks': 'XÓA CÔNG VIỆC',
  'delete-warranty': 'XÓA BẢO HÀNH',
  'delete-complaints': 'XÓA KHIẾU NẠI',
  'delete-wiki': 'XÓA WIKI',
  'purge-all-business-data': 'XÓA TOÀN BỘ DỮ LIỆU',
  'delete-all-settings': 'XÓA CÀI ĐẶT',
  'clear-activity-logs': 'XÓA NHẬT KÝ',
  'resync-meilisearch': 'ĐỒNG BỘ LẠI',
  'seed-all-settings': 'TẠO CÀI ĐẶT',
  'seed-roles': 'TẠO VAI TRÒ',
  'seed-admin-units': 'TẠO ĐỊA CHỈ',
  'seed-sample-employees': 'TẠO NHÂN VIÊN',
  'reset-user-password': 'RESET MẬT KHẨU',
  'system-health-check': 'KIỂM TRA',
  'database-statistics': 'THỐNG KÊ',
  'force-logout-all': 'ĐĂNG XUẤT TẤT CẢ',
  'export-db-backup': 'XUẤT BACKUP',
  'permission-audit': 'KIỂM TRA',
  'docker-prune': 'DỌN DOCKER',
  'check-disk': 'KIỂM TRA',
  'deploy-rebuild': 'DEPLOY',
  'prisma-migrate': 'MIGRATE',
  'prisma-db-push': 'DB PUSH',
  'docker-builder-prune': 'DỌN BUILD CACHE',
  'clear-next-cache': 'XÓA CACHE APP',
}

export const POST = apiHandler(async (req, { session }) => {
  if (!session || !isAdmin(session)) {
    return apiError('Chỉ Admin mới có quyền truy cập', 403)
  }

  const body = await req.json()
  const parsed = actionSchema.safeParse(body)
  if (!parsed.success) {
    return apiError('Dữ liệu không hợp lệ', 400)
  }

  const { action, confirmText, extra } = parsed.data
  if (confirmText !== CONFIRM_MAP[action]) {
    return apiError('Xác nhận không khớp', 400)
  }

  const userName = session.user?.name || session.user?.email || 'Unknown'

  switch (action) {
    case 'delete-products': return await deleteAllProducts(userName)
    case 'delete-customers': return await deleteAllCustomers(userName)
    case 'delete-orders': return await deleteAllOrders(userName)
    case 'delete-purchase-orders': return await deleteAllPurchaseOrders(userName)
    case 'delete-suppliers': return await deleteAllSuppliers(userName)
    case 'delete-finance': return await deleteAllFinance(userName)
    case 'delete-attendance': return await deleteAllAttendance(userName)
    case 'delete-leaves': return await deleteAllLeaves(userName)
    case 'delete-payroll': return await deleteAllPayroll(userName)
    case 'delete-penalties': return await deleteAllPenalties(userName)
    case 'delete-brands': return await deleteAllBrands(userName)
    case 'delete-categories': return await deleteAllCategories(userName)
    case 'delete-sales-returns': return await deleteAllSalesReturns(userName)
    case 'delete-shipments': return await deleteAllShipments(userName)
    case 'delete-reconciliation': return await deleteAllReconciliation(userName)
    case 'delete-stock-transfers': return await deleteAllStockTransfers(userName)
    case 'delete-inventory-checks': return await deleteAllInventoryChecks(userName)
    case 'delete-cost-adjustments': return await deleteAllCostAdjustments(userName)
    case 'delete-price-adjustments': return await deleteAllPriceAdjustments(userName)
    case 'delete-cashbook': return await deleteAllCashbook(userName)
    case 'delete-tasks': return await deleteAllTasks(userName)
    case 'delete-warranty': return await deleteAllWarranty(userName)
    case 'delete-complaints': return await deleteAllComplaints(userName)
    case 'delete-wiki': return await deleteAllWiki(userName)
    case 'purge-all-business-data': return await purgeAllBusinessData(userName)
    case 'delete-all-settings': return await deleteAllSettingsData(userName)
    case 'clear-activity-logs': return await clearActivityLogs(userName)
    case 'resync-meilisearch': return await resyncMeilisearch()
    case 'seed-all-settings': return await runSeedScript('prisma/seeds/seed-all-settings.ts', 'Seed toàn bộ cài đặt')
    case 'seed-roles': return await runSeedScript('prisma/seeds/seed-roles.ts', 'Seed vai trò hệ thống')
    case 'seed-admin-units': return await runSeedScript('prisma/seeds/seed-admin-units-v2.ts', 'Seed đơn vị hành chính (~13K bản ghi)')
    case 'seed-sample-employees': return await runSeedScript('scripts/seed-sample-employees.ts', 'Seed nhân viên mẫu')
    case 'reset-user-password': return await resetUserPassword(extra)
    case 'system-health-check': return await systemHealthCheck()
    case 'database-statistics': return await databaseStatistics()
    case 'force-logout-all': return await forceLogoutAll(userName)
    case 'export-db-backup': return await exportDbBackup()
    case 'permission-audit': return await permissionAudit()
    case 'docker-prune': return await dockerPrune()
    case 'check-disk': return await checkDisk()
    case 'deploy-rebuild': return await deployRebuild()
    case 'prisma-migrate': return await prismaMigrate()
    case 'prisma-db-push': return await prismaDbPush()
    case 'docker-builder-prune': return await dockerBuilderPrune()
    case 'clear-next-cache': return await clearNextBuildCache()
    default: return apiError('Action không hợp lệ', 400)
  }
}, { rateLimit: { max: 40, windowMs: 60_000 } })

// ============================================
// DELETE ALL PRODUCTS
// (Based on purge-business-data.ts Phase 3)
// ============================================
async function deleteAllProducts(userName: string) {
  const count = await prisma.product.count()
  if (count === 0) return apiSuccess({ deleted: 0, message: 'Không có sản phẩm nào' })

  await prisma.$transaction(async (tx) => {
    // Product child tables (FK RESTRICT)
    await tx.inventoryCheckItem.deleteMany({})
    await tx.inventoryCheck.deleteMany({})
    await tx.stockTransferItem.deleteMany({})
    await tx.stockTransfer.deleteMany({})
    await tx.stockHistory.deleteMany({})
    await tx.stockLocation.deleteMany({})
    await tx.inventoryReceiptItem.deleteMany({})
    await tx.inventoryReceipt.deleteMany({})
    await tx.productSerial.deleteMany({})
    await tx.productBatch.deleteMany({})
    await tx.productPrice.deleteMany({})
    await tx.productConversion.deleteMany({})
    await tx.productInventory.deleteMany({})
    await tx.productCategory.deleteMany({})
    await tx.inventory.deleteMany({})

    // Price adjustments (snapshot productSystemId, no FK) — drop records
    await tx.priceAdjustmentItem.deleteMany({})
    await tx.priceAdjustment.deleteMany({})

    // Unlink from shared tables
    await tx.warranty.updateMany({
      where: { productId: { not: null } },
      data: { productId: null },
    })
    await tx.supplierWarrantyItem.deleteMany({})
    await tx.costAdjustmentItem.deleteMany({})
    await tx.costAdjustment.deleteMany({})

    // Unlink PKGX product cache — keep PKGX data for re-sync, just break HRM link
    await tx.pkgxProduct.updateMany({
      where: { hrmProductId: { not: null } },
      data: { hrmProductId: null },
    })

    // Delete products (OrderLineItem & PurchaseOrderItem = SetNull, auto-handled)
    await tx.product.deleteMany({})
  }, { timeout: 180_000 })

  clearMeiliIndex(INDEXES.PRODUCTS)
  await logAdminAction('delete-all-products', count, userName)
  return apiSuccess({ deleted: count, message: `Đã xóa ${count} sản phẩm và dữ liệu kho liên quan` })
}

// ============================================
// DELETE ALL CUSTOMERS
// ============================================
async function deleteAllCustomers(userName: string) {
  const count = await prisma.customer.count()
  if (count === 0) return apiSuccess({ deleted: 0, message: 'Không có khách hàng nào' })

  await prisma.$transaction(async (tx) => {
    await tx.complaint.deleteMany({})
    await tx.warranty.updateMany({
      where: { customerId: { not: null } },
      data: { customerId: null },
    })
    await tx.payment.updateMany({
      where: { customerId: { not: null } },
      data: { customerId: null },
    })
    await tx.receipt.updateMany({
      where: { customerId: { not: null } },
      data: { customerId: null },
    })
    // Order.customerId = SetNull (auto-handled)
    await tx.customer.deleteMany({})
  }, { timeout: 120_000 })

  clearMeiliIndex(INDEXES.CUSTOMERS)
  await logAdminAction('delete-all-customers', count, userName)
  return apiSuccess({ deleted: count, message: `Đã xóa ${count} khách hàng` })
}

// ============================================
// DELETE ALL ORDERS
// (Based on purge-business-data.ts Phase 2)
// ============================================
async function deleteAllOrders(userName: string) {
  const count = await prisma.order.count()
  if (count === 0) return apiSuccess({ deleted: 0, message: 'Không có đơn hàng nào' })

  await prisma.$transaction(async (tx) => {
    await tx.reconciliationSheetItem.deleteMany({})
    await tx.reconciliationSheet.deleteMany({})
    await tx.warranty.updateMany({
      where: { orderId: { not: null } },
      data: { orderId: null },
    })
    await tx.receipt.updateMany({
      where: { orderId: { not: null } },
      data: { orderId: null },
    })
    await tx.salesReturnItem.deleteMany({})
    await tx.salesReturn.deleteMany({})
    await tx.shipment.deleteMany({})
    await tx.packagingItem.deleteMany({})
    await tx.packaging.deleteMany({})
    await tx.orderPayment.deleteMany({})
    await tx.orderLineItem.deleteMany({})
    await tx.order.deleteMany({})
  }, { timeout: 180_000 })

  clearMeiliIndex(INDEXES.ORDERS)
  await logAdminAction('delete-all-orders', count, userName)
  return apiSuccess({ deleted: count, message: `Đã xóa ${count} đơn hàng và dữ liệu liên quan` })
}

// ============================================
// DELETE ALL PURCHASE ORDERS
// ============================================
async function deleteAllPurchaseOrders(userName: string) {
  const count = await prisma.purchaseOrder.count()
  if (count === 0) return apiSuccess({ deleted: 0, message: 'Không có đơn nhập hàng nào' })

  await prisma.$transaction(async (tx) => {
    await tx.payment.updateMany({
      where: { purchaseOrderId: { not: null } },
      data: { purchaseOrderId: null },
    })
    await tx.purchaseReturnItem.deleteMany({})
    await tx.purchaseReturn.deleteMany({})
    await tx.purchaseOrderItem.deleteMany({})
    await tx.purchaseOrder.deleteMany({})
  }, { timeout: 120_000 })

  await logAdminAction('delete-all-purchase-orders', count, userName)
  return apiSuccess({ deleted: count, message: `Đã xóa ${count} đơn nhập hàng` })
}

// ============================================
// DELETE ALL SUPPLIERS
// ============================================
async function deleteAllSuppliers(userName: string) {
  const count = await prisma.supplier.count()
  if (count === 0) return apiSuccess({ deleted: 0, message: 'Không có nhà cung cấp nào' })

  await prisma.$transaction(async (tx) => {
    await tx.supplierWarrantyItem.deleteMany({})
    await tx.supplierWarranty.deleteMany({})
    // PurchaseOrder.supplierId = SetNull (auto-handled)
    await tx.supplier.deleteMany({})
  }, { timeout: 60_000 })

  await logAdminAction('delete-all-suppliers', count, userName)
  return apiSuccess({ deleted: count, message: `Đã xóa ${count} nhà cung cấp` })
}

// ============================================
// DELETE ALL FINANCE (Receipts + Payments + Cash)
// ============================================
async function deleteAllFinance(userName: string) {
  const [receiptCount, paymentCount] = await Promise.all([
    prisma.receipt.count(),
    prisma.payment.count(),
  ])
  const total = receiptCount + paymentCount
  if (total === 0) return apiSuccess({ deleted: 0, message: 'Không có dữ liệu tài chính nào' })

  await prisma.$transaction(async (tx) => {
    await tx.cashTransaction.deleteMany({})
    await tx.receipt.deleteMany({})
    await tx.payment.deleteMany({})
  }, { timeout: 60_000 })

  await logAdminAction('delete-all-finance', total, userName)
  return apiSuccess({ deleted: total, message: `Đã xóa ${receiptCount} phiếu thu/chi + ${paymentCount} thanh toán` })
}

// ============================================
// PURGE ALL BUSINESS DATA
// (Mirror of scripts/purge-business-data.ts)
// ============================================
async function purgeAllBusinessData(userName: string) {
  const details: string[] = []

  // Phase 1: Dependent records
  const phase1 = await prisma.$transaction(async (tx) => {
    const complaints = await tx.complaint.deleteMany({})
    const warranties = await tx.warranty.deleteMany({})
    const supplierWarranties = await tx.supplierWarranty.deleteMany({})
    const receipts = await tx.receipt.deleteMany({})
    const salesReturnItems = await tx.salesReturnItem.deleteMany({})
    const salesReturns = await tx.salesReturn.deleteMany({})
    const purchaseReturnItems = await tx.purchaseReturnItem.deleteMany({})
    const purchaseReturns = await tx.purchaseReturn.deleteMany({})
    const payments = await tx.payment.deleteMany({})
    const cashTransactions = await tx.cashTransaction.deleteMany({})
    return {
      complaints: complaints.count, warranties: warranties.count,
      supplierWarranties: supplierWarranties.count, receipts: receipts.count,
      salesReturnItems: salesReturnItems.count, salesReturns: salesReturns.count,
      purchaseReturnItems: purchaseReturnItems.count, purchaseReturns: purchaseReturns.count,
      payments: payments.count, cashTransactions: cashTransactions.count,
    }
  }, { timeout: 120_000 })
  details.push(`Phase 1: ${Object.values(phase1).reduce((a, b) => a + b, 0)} bản ghi phụ thuộc`)

  // Phase 2: Orders & Operations
  const phase2 = await prisma.$transaction(async (tx) => {
    const reconcItems = await tx.reconciliationSheetItem.deleteMany({})
    const reconcSheets = await tx.reconciliationSheet.deleteMany({})
    const packagingItems = await tx.packagingItem.deleteMany({})
    const packagings = await tx.packaging.deleteMany({})
    const orderPayments = await tx.orderPayment.deleteMany({})
    const orderItems = await tx.orderLineItem.deleteMany({})
    const shipments = await tx.shipment.deleteMany({})
    const costAdjItems = await tx.costAdjustmentItem.deleteMany({})
    const costAdjs = await tx.costAdjustment.deleteMany({})
    const orders = await tx.order.deleteMany({})
    const poItems = await tx.purchaseOrderItem.deleteMany({})
    const purchaseOrders = await tx.purchaseOrder.deleteMany({})
    return {
      reconcItems: reconcItems.count, reconcSheets: reconcSheets.count,
      packagings: packagingItems.count + packagings.count,
      orderPayments: orderPayments.count, orderItems: orderItems.count,
      shipments: shipments.count, costAdjs: costAdjItems.count + costAdjs.count,
      orders: orders.count, purchaseOrders: purchaseOrders.count + poItems.count,
    }
  }, { timeout: 180_000 })
  details.push(`Phase 2: ${phase2.orders} đơn bán + ${phase2.purchaseOrders} đơn nhập`)

  // Phase 3: Inventory + Price adjustments + PKGX product cache
  const phase3 = await prisma.$transaction(async (tx) => {
    const invCheckItems = await tx.inventoryCheckItem.deleteMany({})
    const invChecks = await tx.inventoryCheck.deleteMany({})
    const stockTransferItems = await tx.stockTransferItem.deleteMany({})
    const stockTransfers = await tx.stockTransfer.deleteMany({})
    const stockHistory = await tx.stockHistory.deleteMany({})
    const stockLocations = await tx.stockLocation.deleteMany({})
    const invReceiptItems = await tx.inventoryReceiptItem.deleteMany({})
    const invReceipts = await tx.inventoryReceipt.deleteMany({})
    const productSerials = await tx.productSerial.deleteMany({})
    const productBatches = await tx.productBatch.deleteMany({})
    const productPrices = await tx.productPrice.deleteMany({})
    const productConversions = await tx.productConversion.deleteMany({})
    const productInventory = await tx.productInventory.deleteMany({})
    const productCategories = await tx.productCategory.deleteMany({})
    const inventory = await tx.inventory.deleteMany({})
    const supplierWarrantyItems = await tx.supplierWarrantyItem.deleteMany({})
    const priceAdjItems = await tx.priceAdjustmentItem.deleteMany({})
    const priceAdjs = await tx.priceAdjustment.deleteMany({})
    const pkgxProducts = await tx.pkgxProduct.deleteMany({})
    const products = await tx.product.deleteMany({})
    return {
      products: products.count,
      pkgxProducts: pkgxProducts.count,
      rest: inventory.count + invCheckItems.count + invChecks.count + stockTransferItems.count + stockTransfers.count + stockHistory.count + stockLocations.count + invReceiptItems.count + invReceipts.count + productSerials.count + productBatches.count + productPrices.count + productConversions.count + productInventory.count + productCategories.count + supplierWarrantyItems.count + priceAdjItems.count + priceAdjs.count,
    }
  }, { timeout: 180_000 })
  details.push(`Phase 3: ${phase3.products} sản phẩm + ${phase3.pkgxProducts} PKGX cache + ${phase3.rest} bản ghi kho/điều chỉnh`)

  // Phase 4: Main entities + Brands/Categories + PKGX mappings
  const phase4 = await prisma.$transaction(async (tx) => {
    const customers = await tx.customer.deleteMany({})
    const suppliers = await tx.supplier.deleteMany({})
    const pkgxBrandMappings = await tx.pkgxBrandMapping.deleteMany({})
    const pkgxCategoryMappings = await tx.pkgxCategoryMapping.deleteMany({})
    // Clear category hierarchy first, then delete
    await tx.category.updateMany({ where: { parentId: { not: null } }, data: { parentId: null } })
    const categories = await tx.category.deleteMany({})
    const brands = await tx.brand.deleteMany({})
    return {
      customers: customers.count,
      suppliers: suppliers.count,
      brands: brands.count,
      categories: categories.count,
      pkgxMappings: pkgxBrandMappings.count + pkgxCategoryMappings.count,
    }
  }, { timeout: 60_000 })
  details.push(`Phase 4: ${phase4.customers} KH + ${phase4.suppliers} NCC + ${phase4.brands} TH + ${phase4.categories} DM + ${phase4.pkgxMappings} PKGX mapping`)

  // Phase 5: Activity logs
  const activityLogs = await prisma.activityLog.deleteMany({
    where: {
      entityType: {
        in: [
          'customer', 'supplier', 'product', 'order', 'purchase_order',
          'payment', 'receipt', 'cashbook', 'complaint', 'warranty',
          'sales_return', 'purchase_return', 'shipment', 'stock_check',
          'stock_transfer', 'inventory_receipt', 'brand', 'category',
          'pkgx_settings',
        ],
      },
    },
  })
  details.push(`Phase 5: ${activityLogs.count} nhật ký`)

  // Clear Meilisearch indexes
  clearMeiliIndex(INDEXES.PRODUCTS)
  clearMeiliIndex(INDEXES.CUSTOMERS)
  clearMeiliIndex(INDEXES.ORDERS)

  await logAdminAction('purge-all-business-data', 0, userName)
  return apiSuccess({ message: 'Đã xóa toàn bộ dữ liệu kinh doanh', details })
}

// ============================================
// DELETE ALL APPLICATION SETTINGS
// (settings + settings_data + PTTK, TK quỹ, thuế, phòng ban/chức vụ cấu hình, v.v. — KHÔNG xóa user/role/branch/đơn vị hành chính)
// ============================================
async function deleteAllSettingsData(userName: string) {
  const details: string[] = []

  const counts = await prisma.$transaction(
    async (tx) => {
      const cashTx = await tx.cashTransaction.deleteMany({})
      const pkgxPriceMap = await tx.pkgxPriceMapping.deleteMany({})
      const productPrices = await tx.productPrice.deleteMany({})
      const userPrefs = await tx.userPreference.deleteMany({})

      await tx.employee.updateMany({ data: { departmentId: null, jobTitleId: null } })
      await tx.department.updateMany({ where: { parentId: { not: null } }, data: { parentId: null } })
      const departments = await tx.department.deleteMany({})
      const jobTitles = await tx.jobTitle.deleteMany({})
      const employeeTypeSettings = await tx.employeeTypeSetting.deleteMany({})
      const penaltyTypeSettings = await tx.penaltyTypeSetting.deleteMany({})
      const complaintTypeSettings = await tx.complaintTypeSetting.deleteMany({})
      const units = await tx.unit.deleteMany({})
      const shippingPartners = await tx.shippingPartner.deleteMany({})
      const salesChannels = await tx.salesChannel.deleteMany({})
      const pricingPolicies = await tx.pricingPolicy.deleteMany({})
      const taxes = await tx.tax.deleteMany({})
      const cashAccounts = await tx.cashAccount.deleteMany({})
      const paymentMethods = await tx.paymentMethod.deleteMany({})
      const settingsData = await tx.settingsData.deleteMany({})
      const settings = await tx.setting.deleteMany({})
      const pkgxConfig = await tx.pkgxConfig.deleteMany({})

      return {
        cashTransaction: cashTx.count,
        pkgxPriceMapping: pkgxPriceMap.count,
        productPrice: productPrices.count,
        userPreference: userPrefs.count,
        department: departments.count,
        jobTitle: jobTitles.count,
        employeeTypeSetting: employeeTypeSettings.count,
        penaltyTypeSetting: penaltyTypeSettings.count,
        complaintTypeSetting: complaintTypeSettings.count,
        unit: units.count,
        shippingPartner: shippingPartners.count,
        salesChannel: salesChannels.count,
        pricingPolicy: pricingPolicies.count,
        tax: taxes.count,
        cashAccount: cashAccounts.count,
        paymentMethod: paymentMethods.count,
        settingsData: settingsData.count,
        setting: settings.count,
        pkgxConfig: pkgxConfig.count,
      }
    },
    { timeout: 120_000 },
  )

  for (const [k, v] of Object.entries(counts)) {
    if (v > 0) details.push(`${k}: ${v}`)
  }
  if (details.length === 0) {
    details.push('Không có bản ghi cài đặt nào (đã trống).')
  }

  await logAdminAction('delete-all-settings', counts.setting + counts.settingsData, userName)
  return apiSuccess({
    message: 'Đã xóa cấu hình hệ thống (bảng settings, loại thu-chi, PTTK, quỹ, thuế, PKGX cấu hình, …). Dùng Khởi tạo để tạo lại mặc định.',
    details,
  })
}

// ============================================
// CLEAR ACTIVITY LOGS
// ============================================
async function clearActivityLogs(userName: string) {
  const count = await prisma.activityLog.count()
  if (count === 0) return apiSuccess({ deleted: 0, message: 'Không có nhật ký nào' })
  await prisma.activityLog.deleteMany({})
  await logAdminAction('clear-activity-logs', count, userName)
  return apiSuccess({ deleted: count, message: `Đã xóa ${count} nhật ký hoạt động` })
}

// ============================================
// RESYNC MEILISEARCH
// ============================================
async function resyncMeilisearch() {
  const { syncProducts, syncCustomers, syncOrders } = await import('@/lib/meilisearch-sync')
  const results = await Promise.allSettled([syncProducts(), syncCustomers(), syncOrders()])
  const names = ['Products', 'Customers', 'Orders']
  const statuses = results.map((r, i) => `${names[i]}: ${r.status === 'fulfilled' ? 'OK' : 'Lỗi'}`)
  return apiSuccess({ message: `Đồng bộ hoàn tất: ${statuses.join(', ')}` })
}

// ============================================
// SEED RUNNER
// ============================================
async function runSeedScript(scriptPath: string, label: string) {
  try {
    const fullPath = path.resolve(process.cwd(), scriptPath)
    const isLargeSeed = scriptPath.includes('seed-admin-units')
    const output = execSync(`npx tsx "${fullPath}"`, {
      cwd: process.cwd(),
      timeout: isLargeSeed ? 900_000 : 300_000,
      encoding: 'utf-8',
      env: { ...process.env },
    })
    // Extract last meaningful lines from output
    const lines = output.split('\n').filter(l => l.trim()).slice(-5)
    return apiSuccess({ message: `${label} — hoàn tất`, details: lines })
  } catch (err) {
    const { message, details } = extractExecError(err)
    const tail = details.length > 0 ? ` — ${details.join(' | ')}` : ''
    return apiError(`Seed thất bại: ${message}${tail}`, 500)
  }
}

// ============================================
// DELETE - HR MODULES
// ============================================
async function deleteAllAttendance(userName: string) {
  const count = await prisma.attendanceRecord.count()
  if (count === 0) return apiSuccess({ deleted: 0, message: 'Không có bản ghi chấm công nào' })
  await prisma.attendanceRecord.deleteMany({})
  await logAdminAction('delete-all-attendance', count, userName)
  return apiSuccess({ deleted: count, message: `Đã xóa ${count} bản ghi chấm công` })
}

async function deleteAllLeaves(userName: string) {
  const count = await prisma.leave.count()
  if (count === 0) return apiSuccess({ deleted: 0, message: 'Không có đơn nghỉ phép nào' })
  await prisma.leave.deleteMany({})
  await logAdminAction('delete-all-leaves', count, userName)
  return apiSuccess({ deleted: count, message: `Đã xóa ${count} đơn nghỉ phép` })
}

async function deleteAllPayroll(userName: string) {
  const count = await prisma.payroll.count()
  if (count === 0) return apiSuccess({ deleted: 0, message: 'Không có bảng lương nào' })
  await prisma.$transaction(async (tx) => {
    await tx.payrollItem.deleteMany({})
    await tx.payroll.deleteMany({})
  })
  await logAdminAction('delete-all-payroll', count, userName)
  return apiSuccess({ deleted: count, message: `Đã xóa ${count} bảng lương` })
}

async function deleteAllPenalties(userName: string) {
  const count = await prisma.penalty.count()
  if (count === 0) return apiSuccess({ deleted: 0, message: 'Không có phiếu phạt nào' })
  await prisma.penalty.deleteMany({})
  await logAdminAction('delete-all-penalties', count, userName)
  return apiSuccess({ deleted: count, message: `Đã xóa ${count} phiếu phạt` })
}

// ============================================
// DELETE - BUSINESS MODULES
// ============================================
async function deleteAllBrands(userName: string) {
  const count = await prisma.brand.count()
  if (count === 0) return apiSuccess({ deleted: 0, message: 'Không có thương hiệu nào' })
  await prisma.$transaction(async (tx) => {
    // PKGX brand mapping stores hrmBrandId (string, no FK) — clear mappings explicitly
    await tx.pkgxBrandMapping.deleteMany({})
    await tx.product.updateMany({ where: { brandId: { not: null } }, data: { brandId: null } })
    await tx.brand.deleteMany({})
  })
  await logAdminAction('delete-all-brands', count, userName)
  return apiSuccess({ deleted: count, message: `Đã xóa ${count} thương hiệu và các mapping PKGX liên quan` })
}

async function deleteAllCategories(userName: string) {
  const count = await prisma.category.count()
  if (count === 0) return apiSuccess({ deleted: 0, message: 'Không có danh mục nào' })
  await prisma.$transaction(async (tx) => {
    // PKGX category mapping stores hrmCategoryId (string, no FK) — clear mappings explicitly
    await tx.pkgxCategoryMapping.deleteMany({})
    await tx.productCategory.deleteMany({})
    await tx.category.updateMany({ where: { parentId: { not: null } }, data: { parentId: null } })
    await tx.category.deleteMany({})
  })
  await logAdminAction('delete-all-categories', count, userName)
  return apiSuccess({ deleted: count, message: `Đã xóa ${count} danh mục sản phẩm và các mapping PKGX liên quan` })
}

// ============================================
// DELETE - SALES MODULES
// ============================================
async function deleteAllSalesReturns(userName: string) {
  const count = await prisma.salesReturn.count()
  if (count === 0) return apiSuccess({ deleted: 0, message: 'Không có đơn trả hàng nào' })
  await prisma.$transaction(async (tx) => {
    await tx.salesReturnItem.deleteMany({})
    await tx.salesReturn.deleteMany({})
  })
  await logAdminAction('delete-all-sales-returns', count, userName)
  return apiSuccess({ deleted: count, message: `Đã xóa ${count} đơn trả hàng` })
}

async function deleteAllShipments(userName: string) {
  const [shipmentCount, packagingCount] = await Promise.all([
    prisma.shipment.count(),
    prisma.packaging.count(),
  ])
  const total = shipmentCount + packagingCount
  if (total === 0) return apiSuccess({ deleted: 0, message: 'Không có vận đơn/đóng gói nào' })
  await prisma.$transaction(async (tx) => {
    await tx.shipment.deleteMany({})
    await tx.packagingItem.deleteMany({})
    await tx.packaging.deleteMany({})
  })
  await logAdminAction('delete-all-shipments', total, userName)
  return apiSuccess({ deleted: total, message: `Đã xóa ${shipmentCount} vận đơn + ${packagingCount} đóng gói` })
}

async function deleteAllReconciliation(userName: string) {
  const count = await prisma.reconciliationSheet.count()
  if (count === 0) return apiSuccess({ deleted: 0, message: 'Không có phiếu đối soát nào' })
  await prisma.$transaction(async (tx) => {
    await tx.reconciliationSheetItem.deleteMany({})
    await tx.reconciliationSheet.deleteMany({})
  })
  await logAdminAction('delete-all-reconciliation', count, userName)
  return apiSuccess({ deleted: count, message: `Đã xóa ${count} phiếu đối soát COD` })
}

// ============================================
// DELETE - INVENTORY MODULES
// ============================================
async function deleteAllStockTransfers(userName: string) {
  const count = await prisma.stockTransfer.count()
  if (count === 0) return apiSuccess({ deleted: 0, message: 'Không có phiếu chuyển kho nào' })
  await prisma.$transaction(async (tx) => {
    await tx.stockTransferItem.deleteMany({})
    await tx.stockTransfer.deleteMany({})
  })
  await logAdminAction('delete-all-stock-transfers', count, userName)
  return apiSuccess({ deleted: count, message: `Đã xóa ${count} phiếu chuyển kho` })
}

async function deleteAllInventoryChecks(userName: string) {
  const count = await prisma.inventoryCheck.count()
  if (count === 0) return apiSuccess({ deleted: 0, message: 'Không có phiếu kiểm kê nào' })
  await prisma.$transaction(async (tx) => {
    await tx.inventoryCheckItem.deleteMany({})
    await tx.inventoryCheck.deleteMany({})
  })
  await logAdminAction('delete-all-inventory-checks', count, userName)
  return apiSuccess({ deleted: count, message: `Đã xóa ${count} phiếu kiểm kê` })
}

async function deleteAllCostAdjustments(userName: string) {
  const count = await prisma.costAdjustment.count()
  if (count === 0) return apiSuccess({ deleted: 0, message: 'Không có phiếu điều chỉnh giá vốn nào' })
  await prisma.$transaction(async (tx) => {
    await tx.costAdjustmentItem.deleteMany({})
    await tx.costAdjustment.deleteMany({})
  })
  await logAdminAction('delete-all-cost-adjustments', count, userName)
  return apiSuccess({ deleted: count, message: `Đã xóa ${count} phiếu điều chỉnh giá vốn` })
}

async function deleteAllPriceAdjustments(userName: string) {
  const count = await prisma.priceAdjustment.count()
  if (count === 0) return apiSuccess({ deleted: 0, message: 'Không có phiếu điều chỉnh giá bán nào' })
  await prisma.$transaction(async (tx) => {
    await tx.priceAdjustmentItem.deleteMany({})
    await tx.priceAdjustment.deleteMany({})
  })
  await logAdminAction('delete-all-price-adjustments', count, userName)
  return apiSuccess({ deleted: count, message: `Đã xóa ${count} phiếu điều chỉnh giá bán` })
}

// ============================================
// DELETE - FINANCE MODULES
// ============================================
async function deleteAllCashbook(userName: string) {
  const [accounts, transactions] = await Promise.all([
    prisma.cashAccount.count(),
    prisma.cashTransaction.count(),
  ])
  if (accounts + transactions === 0) return apiSuccess({ deleted: 0, message: 'Không có dữ liệu sổ quỹ nào' })
  await prisma.$transaction(async (tx) => {
    await tx.cashTransaction.deleteMany({})
    await tx.cashAccount.deleteMany({})
  })
  await logAdminAction('delete-all-cashbook', accounts + transactions, userName)
  return apiSuccess({ deleted: accounts + transactions, message: `Đã xóa ${accounts} tài khoản + ${transactions} giao dịch quỹ` })
}

// ============================================
// DELETE - OPERATIONS MODULES
// ============================================
async function deleteAllTasks(userName: string) {
  const count = await prisma.task.count()
  if (count === 0) return apiSuccess({ deleted: 0, message: 'Không có công việc nào' })
  await prisma.$transaction(async (tx) => {
    await tx.task.deleteMany({})
    await tx.taskBoard.deleteMany({})
  })
  await logAdminAction('delete-all-tasks', count, userName)
  return apiSuccess({ deleted: count, message: `Đã xóa ${count} công việc và bảng công việc` })
}

async function deleteAllWarranty(userName: string) {
  const count = await prisma.supplierWarranty.count()
  if (count === 0) return apiSuccess({ deleted: 0, message: 'Không có phiếu bảo hành NCC nào' })
  await prisma.$transaction(async (tx) => {
    await tx.supplierWarrantyItem.deleteMany({})
    await tx.supplierWarranty.deleteMany({})
  })
  await logAdminAction('delete-all-warranty', count, userName)
  return apiSuccess({ deleted: count, message: `Đã xóa ${count} phiếu bảo hành NCC` })
}

async function deleteAllComplaints(userName: string) {
  const count = await prisma.complaint.count()
  if (count === 0) return apiSuccess({ deleted: 0, message: 'Không có khiếu nại nào' })
  await prisma.complaint.deleteMany({})
  await logAdminAction('delete-all-complaints', count, userName)
  return apiSuccess({ deleted: count, message: `Đã xóa ${count} khiếu nại` })
}

async function deleteAllWiki(userName: string) {
  const count = await prisma.wiki.count()
  if (count === 0) return apiSuccess({ deleted: 0, message: 'Không có bài wiki nào' })
  await prisma.wiki.deleteMany({})
  await logAdminAction('delete-all-wiki', count, userName)
  return apiSuccess({ deleted: count, message: `Đã xóa ${count} bài wiki` })
}

// ============================================
// RESET USER PASSWORD
// ============================================
async function resetUserPassword(extra?: Record<string, string>) {
  const email = extra?.email
  const newPassword = extra?.newPassword

  if (!email || !newPassword) {
    return apiError('Cần cung cấp email và mật khẩu mới', 400)
  }

  if (newPassword.length < 6) {
    return apiError('Mật khẩu phải có ít nhất 6 ký tự', 400)
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { systemId: true, email: true, employee: { select: { fullName: true } } },
  })

  if (!user) {
    return apiError(`Không tìm thấy user với email: ${email}`, 404)
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)
  await prisma.user.update({
    where: { systemId: user.systemId },
    data: { password: hashedPassword },
  })

  return apiSuccess({
    message: `Đã reset mật khẩu cho ${user.employee?.fullName || user.email}`,
  })
}

// ============================================
// SYSTEM HEALTH CHECK
// ============================================
async function systemHealthCheck() {
  const checks: Record<string, { status: 'ok' | 'error'; detail: string }> = {}

  // 1. Database
  try {
    const start = Date.now()
    await prisma.$queryRaw`SELECT 1`
    const ms = Date.now() - start
    checks['database'] = { status: 'ok', detail: `PostgreSQL — ${ms}ms` }
  } catch (e) {
    checks['database'] = { status: 'error', detail: `Lỗi: ${e instanceof Error ? e.message : 'Unknown'}` }
  }

  // 2. Meilisearch
  try {
    const client = getMeiliClient()
    const start = Date.now()
    const health = await client.health()
    const ms = Date.now() - start
    checks['meilisearch'] = { status: health.status === 'available' ? 'ok' : 'error', detail: `${health.status} — ${ms}ms` }
  } catch (e) {
    checks['meilisearch'] = { status: 'error', detail: `Lỗi: ${e instanceof Error ? e.message : 'Không kết nối được'}` }
  }

  // 3. Disk space (Node.js)
  try {
    const { statfs } = await import('fs/promises')
    const stats = await statfs(process.cwd())
    const freeGB = Number((stats.bfree * stats.bsize) / (1024 ** 3)).toFixed(1)
    const totalGB = Number((stats.blocks * stats.bsize) / (1024 ** 3)).toFixed(1)
    checks['disk'] = { status: Number(freeGB) > 1 ? 'ok' : 'error', detail: `${freeGB} GB free / ${totalGB} GB` }
  } catch {
    checks['disk'] = { status: 'ok', detail: 'Không đọc được (Windows)' }
  }

  // 4. Memory
  const mem = process.memoryUsage()
  const heapMB = (mem.heapUsed / 1024 / 1024).toFixed(0)
  const rssMB = (mem.rss / 1024 / 1024).toFixed(0)
  checks['memory'] = { status: Number(rssMB) < 1500 ? 'ok' : 'error', detail: `Heap: ${heapMB}MB, RSS: ${rssMB}MB` }

  // 5. Uptime
  const uptimeHours = (process.uptime() / 3600).toFixed(1)
  checks['uptime'] = { status: 'ok', detail: `${uptimeHours} giờ` }

  // 6. Database pool
  try {
    // Access Prisma metrics if available (requires metrics to be enabled in Prisma config)
    type PrismaClientWithMetrics = typeof prisma & { $metrics?: { json: () => Promise<unknown> } };
    const metrics = await (prisma as unknown as PrismaClientWithMetrics).$metrics?.json() as { gauges?: Array<{ key: string; value: number }> } | undefined;
    const activeConns = metrics?.gauges?.find((g) => g.key === 'prisma_pool_connections_open')
    checks['db-pool'] = { status: 'ok', detail: `${activeConns?.value ?? '?'} connections` }
  } catch {
    checks['db-pool'] = { status: 'ok', detail: 'Metrics chưa bật' }
  }

  const allOk = Object.values(checks).every(c => c.status === 'ok')
  return apiSuccess({ status: allOk ? 'healthy' : 'degraded', checks })
}

// ============================================
// DATABASE STATISTICS
// ============================================
async function databaseStatistics() {
  const tables = [
    { name: 'Sản phẩm', query: prisma.product.count() },
    { name: 'Khách hàng', query: prisma.customer.count() },
    { name: 'Nhà cung cấp', query: prisma.supplier.count() },
    { name: 'Đơn hàng', query: prisma.order.count() },
    { name: 'Đơn nhập', query: prisma.purchaseOrder.count() },
    { name: 'Nhân viên', query: prisma.employee.count() },
    { name: 'Phiếu thu', query: prisma.receipt.count() },
    { name: 'Phiếu chi/TT', query: prisma.payment.count() },
    { name: 'Tồn kho', query: prisma.productInventory.count() },
    { name: 'Lịch sử kho', query: prisma.stockHistory.count() },
    { name: 'Bảo hành', query: prisma.warranty.count() },
    { name: 'Khiếu nại', query: prisma.complaint.count() },
    { name: 'Nhật ký', query: prisma.activityLog.count() },
    { name: 'Users', query: prisma.user.count() },
  ]

  const counts = await Promise.all(tables.map(t => t.query))
  const stats = tables.map((t, i) => ({ name: t.name, count: counts[i] }))
  const total = counts.reduce((a, b) => a + b, 0)

  // DB size (PostgreSQL specific)
  let dbSize = 'N/A'
  try {
    const result = await prisma.$queryRaw<[{ size: string }]>`
      SELECT pg_size_pretty(pg_database_size(current_database())) as size
    `
    dbSize = result[0]?.size || 'N/A'
  } catch {
    // Not available
  }

  return apiSuccess({ stats, total, dbSize })
}

// ============================================
// FORCE LOGOUT ALL SESSIONS
// ============================================
async function forceLogoutAll(userName: string) {
  // Since we use JWT, we can't truly invalidate tokens without a blocklist.
  // Best approach: update all users' password hash timestamps or a version field.
  // Practical approach: change NEXTAUTH_SECRET env var (requires restart).
  // For now: set all non-admin users to isActive=false, then immediately re-activate.
  // This doesn't actually work with stateless JWT.
  
  // Real approach: Update all users' updatedAt to trigger token refresh
  const result = await prisma.user.updateMany({
    data: { updatedAt: new Date() },
  })

  await logAdminAction('force-logout-all', result.count, userName)
  return apiSuccess({
    message: `Đã đánh dấu ${result.count} tài khoản cần đăng nhập lại. Lưu ý: JWT hiện tại vẫn hoạt động đến hết maxAge (24h). Để force ngay, khởi động lại server hoặc đổi NEXTAUTH_SECRET.`,
    details: [
      `Users affected: ${result.count}`,
      'JWT stateless — không thể revoke ngay lập tức',
      'Khuyến nghị: Restart server nếu cần force logout ngay',
    ],
  })
}

// ============================================
// HELPERS
// ============================================
function clearMeiliIndex(indexName: string) {
  try {
    const client = getMeiliClient()
    client.index(indexName).deleteAllDocuments().catch(() => {})
  } catch {
    // getMeiliClient may fail if not configured
  }
}

async function logAdminAction(action: string, count: number, userName: string) {
  try {
    await prisma.activityLog.create({
      data: {
        action,
        actionType: 'delete',
        entityType: 'admin-tools',
        entityId: 'bulk-delete',
        note: `[Admin Tools] ${action}: ${count} bản ghi đã xóa bởi ${userName}`,
        createdBy: userName,
      },
    })
  } catch {
    // Activity log failure should not break the operation
  }
}

// ============================================
// EXPORT DB BACKUP (JSON)
// ============================================
async function exportDbBackup() {
  const tables = [
    'product', 'customer', 'order', 'purchaseOrder', 'supplier',
    'payment', 'receipt', 'employee', 'user',
  ] as const

  const counts: Record<string, number> = {}
  for (const table of tables) {
    // Access Prisma model dynamically by name
    const model = (prisma as unknown as Record<string, { count: () => Promise<number> }>)[table];
    counts[table] = model ? await model.count() : 0;
  }

  const totalRecords = Object.values(counts).reduce((a, b) => a + b, 0)

  return apiSuccess({
    message: `Backup info: ${totalRecords.toLocaleString()} bản ghi trong ${tables.length} bảng`,
    details: [
      'Để xuất backup đầy đủ, sử dụng pg_dump trên server.',
      'Lệnh: pg_dump -Fc -f backup.dump $DATABASE_URL',
    ],
    counts,
  })
}

// ============================================
// PERMISSION AUDIT
// ============================================
function countRolePermissions(permissions: unknown): number {
  if (Array.isArray(permissions)) return permissions.length
  if (typeof permissions === 'string') {
    try {
      const parsed = JSON.parse(permissions) as unknown
      return Array.isArray(parsed) ? parsed.length : 0
    } catch {
      return 0
    }
  }
  return 0
}

async function permissionAudit() {
  const [employees, roles] = await Promise.all([
    prisma.employee.findMany({
      where: { employmentStatus: 'ACTIVE' },
      select: { fullName: true, role: true },
      orderBy: { fullName: 'asc' },
    }),
    prisma.roleSetting.findMany({
      where: { isDeleted: false },
      select: { id: true, name: true, permissions: true },
    }),
  ])

  // Employee.role lưu theo id vai trò HOẶC tên hiển thị (dữ liệu cũ) — map cả hai.
  const roleMap = new Map<string, { displayName: string; count: number }>()
  for (const r of roles) {
    const count = countRolePermissions(r.permissions)
    const entry = { displayName: r.name, count }
    roleMap.set(r.id, entry)
    roleMap.set(r.name, entry)
    roleMap.set(r.name.trim(), entry)
  }

  const audit = employees.map((e) => {
    const key = e.role?.trim() ?? ''
    const roleInfo = roleMap.get(e.role) ?? roleMap.get(key)
    return {
      user: e.fullName,
      role: roleInfo?.displayName || e.role,
      permissions: roleInfo?.count ?? 0,
    }
  })

  return apiSuccess({
    message: `Kiểm tra phân quyền: ${employees.length} nhân viên active`,
    audit,
  })
}

// ============================================
// CLEAR NEXT.JS BUILD CACHE (VPS PM2 / không Docker)
// ============================================
function clearNextBuildCache() {
  const root = process.cwd()
  const candidates = ['.next', 'node_modules/.cache'] as const
  const removed: string[] = []
  try {
    for (const rel of candidates) {
      const target = path.join(root, rel)
      if (existsSync(target)) {
        rmSync(target, { recursive: true, force: true })
        removed.push(rel)
      }
    }
    return apiSuccess({
      message: removed.length > 0
        ? `Đã xóa cache build: ${removed.join(', ')}. Khởi động lại ứng dụng (PM2 / systemd) để build lại.`
        : 'Không tìm thấy .next hoặc node_modules/.cache (thư mục gốc ứng dụng đã sạch hoặc chưa build).',
      details: removed,
    })
  } catch (err) {
    const { message } = extractExecError(err)
    return apiError(`Xóa cache lỗi: ${message}`, 500)
  }
}

// ============================================
// DOCKER PRUNE
// ============================================
async function dockerPrune() {
  try {
    const output = execSync('docker system prune -a -f --volumes 2>&1', {
      encoding: 'utf-8',
      timeout: 120_000,
    })

    // Parse "Total reclaimed space: X.XXX GB"
    const spaceMatch = output.match(/Total reclaimed space:\s*(.+)/i)
    const reclaimed = spaceMatch?.[1]?.trim() || 'unknown'

    return apiSuccess({
      message: `Docker prune hoàn tất — giải phóng ${reclaimed}`,
      details: output.split('\n').filter(Boolean).slice(0, 20),
    })
  } catch (err) {
    const { message } = extractExecError(err)
    if (/not found|not recognized|command not found/i.test(message)) {
      return apiError('Docker chưa được cài đặt trên server', 400)
    }
    return apiError(`Docker prune lỗi: ${message}`, 500)
  }
}

// ============================================
// CHECK DISK USAGE
// ============================================
async function checkDisk() {
  try {
    const output = execSync('df -h 2>&1', { encoding: 'utf-8', timeout: 10_000 })
    const lines = output.trim().split('\n')
    const header = lines[0]
    const rows = lines.slice(1).map((line) => {
      const parts = line.split(/\s+/)
      return {
        filesystem: parts[0],
        size: parts[1],
        used: parts[2],
        avail: parts[3],
        usePercent: parts[4],
        mountedOn: parts[5],
      }
    })
    // Find root or main partition
    const root = rows.find((r) => r.mountedOn === '/' || r.mountedOn === '/data')
    return apiSuccess({
      message: `Disk: ${root?.used || '?'} used / ${root?.size || '?'} total (${root?.usePercent || '?'})`,
      details: [header, ...lines.slice(1).filter((l) => !l.includes('tmpfs') && !l.includes('udev'))],
    })
  } catch (err) {
    // Windows fallback
    try {
      const output = execSync('wmic logicaldisk get size,freespace,caption 2>&1', { encoding: 'utf-8', timeout: 10_000 })
      return apiSuccess({ message: 'Disk info (Windows)', details: output.trim().split('\n').filter(Boolean) })
    } catch {
      return apiError(`Không đọc được disk: ${err instanceof Error ? err.message : String(err)}`, 500)
    }
  }
}

// ============================================
// DEPLOY & REBUILD (git pull + docker compose build)
// ============================================
async function deployRebuild() {
  const details: string[] = []
  const cwd = '/www/wwwroot/hrm.trendtech.vn'

  try {
    // Step 1: git pull
    const gitOutput = execSync('git pull origin main 2>&1', { encoding: 'utf-8', timeout: 60_000, cwd })
    details.push('=== Git Pull ===', ...gitOutput.trim().split('\n').slice(-5))

    // Step 2: docker compose build + up
    const dockerOutput = execSync('docker compose -f docker-compose.prod.yml up -d --build app 2>&1', {
      encoding: 'utf-8', timeout: 300_000, cwd,
    })
    details.push('=== Docker Build ===', ...dockerOutput.trim().split('\n').slice(-10))

    return apiSuccess({
      message: 'Deploy hoàn tất — git pull + docker build + restart',
      details,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    const shortLines = msg.split('\n').filter(Boolean).slice(-10)
    return apiError(`Deploy lỗi: ${shortLines.join(' | ')}`, 500)
  }
}

// ============================================
// PRISMA MIGRATE DEPLOY
// ============================================
async function prismaMigrate() {
  try {
    const output = execSync('npx prisma migrate deploy 2>&1', {
      encoding: 'utf-8',
      timeout: 120_000,
      cwd: process.cwd(),
    })
    const lines = output.trim().split('\n').filter(Boolean)
    const appliedMatch = output.match(/(\d+) migration/i)
    return apiSuccess({
      message: `Prisma migrate deploy hoàn tất${appliedMatch ? ` — ${appliedMatch[0]}` : ''}`,
      details: lines.slice(-10),
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return apiError(`Migrate lỗi: ${msg.split('\n').filter(Boolean).slice(-5).join(' | ')}`, 500)
  }
}

// ============================================
// PRISMA DB PUSH
// ============================================
async function prismaDbPush() {
  try {
    const output = execSync('npx prisma db push --accept-data-loss 2>&1', {
      encoding: 'utf-8',
      timeout: 120_000,
      cwd: process.cwd(),
    })
    const lines = output.trim().split('\n').filter(Boolean)
    return apiSuccess({
      message: 'Prisma db push hoàn tất — schema đã đồng bộ',
      details: lines.slice(-10),
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return apiError(`DB Push lỗi: ${msg.split('\n').filter(Boolean).slice(-5).join(' | ')}`, 500)
  }
}

// ============================================
// DOCKER BUILDER PRUNE
// ============================================
async function dockerBuilderPrune() {
  const details: string[] = []
  try {
    // Docker system prune with 24h filter (safe - only old stuff)
    const pruneOutput = execSync('docker system prune -a -f --filter "until=24h" 2>&1', {
      encoding: 'utf-8', timeout: 120_000,
    })
    const spaceMatch1 = pruneOutput.match(/Total reclaimed space:\s*(.+)/i)
    details.push(`System prune (>24h): giải phóng ${spaceMatch1?.[1]?.trim() || '0B'}`)

    // Docker builder prune
    const builderOutput = execSync('docker builder prune -a -f 2>&1', {
      encoding: 'utf-8', timeout: 120_000,
    })
    const spaceMatch2 = builderOutput.match(/Total:\s*(.+)/i)
    details.push(`Builder prune: giải phóng ${spaceMatch2?.[1]?.trim() || '0B'}`)

    return apiSuccess({
      message: `Dọn build cache hoàn tất`,
      details,
    })
  } catch (err) {
    const { message, details: errDetails } = extractExecError(err)
    if (/not found|not recognized|command not found/i.test(message)) {
      return apiError('Docker chưa được cài đặt trên server', 400)
    }
    // Return partial results if one command succeeded
    if (details.length > 0) {
      return apiSuccess({
        message: 'Dọn build cache (partial)',
        details: [...details, `Lỗi: ${message}`, ...errDetails.slice(0, 5)],
      })
    }
    return apiError(`Docker builder prune lỗi: ${message}`, 500)
  }
}

// ============================================
// HELPER: Extract exec error with full stdout/stderr context
// ============================================
function extractExecError(err: unknown): { message: string; details: string[] } {
  const e = err as {
    message?: string
    stdout?: Buffer | string
    stderr?: Buffer | string
    output?: (Buffer | null)[]
    status?: number
  }
  const out0 = e?.output?.[0] != null ? Buffer.isBuffer(e.output[0]) ? e.output[0].toString().trim() : String(e.output[0]).trim() : ''
  const out1 = e?.output?.[1] != null ? Buffer.isBuffer(e.output[1]) ? e.output[1].toString().trim() : String(e.output[1]).trim() : ''
  const stdout = (e?.stdout ? e.stdout.toString().trim() : '') || out0
  const stderr = (e?.stderr ? e.stderr.toString().trim() : '') || out1
  const combined = [stderr, stdout].filter(Boolean).join('\n').trim()

  // Prefer actual command output over generic "Command failed" prefix
  if (combined) {
    const lines = combined.split('\n').filter((l) => l.trim()).slice(-8)
    const firstMeaningful = lines.find((l) => !/^Command failed/i.test(l)) || lines[0] || ''
    return {
      message: firstMeaningful.slice(0, 300),
      details: lines,
    }
  }

  const raw = e?.message || String(err)
  const lines = raw.split('\n').filter((l) => l.trim())
  const firstMeaningful = lines.find((l) => !/^Command failed/i.test(l)) || lines[0] || raw
  return {
    message: firstMeaningful.slice(0, 300),
    details: lines.slice(-8),
  }
}
