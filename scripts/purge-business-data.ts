/**
 * Clean up ALL customer, supplier, and product data.
 * Deletes in FK-safe order.
 * 
 * Run: npx tsx scripts/purge-business-data.ts
 */
import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) })

async function main() {
  console.log('')
  console.log('═══════════════════════════════════════════════════════════')
  console.log('🗑️  PURGE BUSINESS DATA (Customers, Suppliers, Products)')
  console.log('═══════════════════════════════════════════════════════════')

  // === Phase 1: Delete dependent records (FK constraints) ===
  console.log('\n📋 Phase 1: Deleting dependent records...')

  // Complaints → Customer
  const complaints = await prisma.complaint.deleteMany({})
  console.log(`  ✓ Complaints: ${complaints.count} deleted`)

  // Warranty → Customer
  const warranties = await prisma.warranty.deleteMany({})
  console.log(`  ✓ Warranties: ${warranties.count} deleted`)

  // SupplierWarranty → Supplier
  const supplierWarranties = await prisma.supplierWarranty.deleteMany({})
  console.log(`  ✓ Supplier Warranties: ${supplierWarranties.count} deleted`)

  // Receipt → Customer
  const receipts = await prisma.receipt.deleteMany({})
  console.log(`  ✓ Receipts: ${receipts.count} deleted`)

  // SalesReturn items first, then SalesReturn → Customer
  const salesReturnItems = await prisma.salesReturnItem.deleteMany({})
  console.log(`  ✓ Sales Return Items: ${salesReturnItems.count} deleted`)
  const salesReturns = await prisma.salesReturn.deleteMany({})
  console.log(`  ✓ Sales Returns: ${salesReturns.count} deleted`)

  // PurchaseReturn items, then PurchaseReturn → Supplier
  const purchaseReturnItems = await prisma.purchaseReturnItem.deleteMany({})
  console.log(`  ✓ Purchase Return Items: ${purchaseReturnItems.count} deleted`)
  const purchaseReturns = await prisma.purchaseReturn.deleteMany({})
  console.log(`  ✓ Purchase Returns: ${purchaseReturns.count} deleted`)

  // Payment → Customer & Supplier
  const payments = await prisma.payment.deleteMany({})
  console.log(`  ✓ Payments: ${payments.count} deleted`)

  // Cash transactions
  const cashTransactions = await prisma.cashTransaction.deleteMany({})
  console.log(`  ✓ Cash Transactions: ${cashTransactions.count} deleted`)

  // === Phase 2: Orders & Purchase Orders ===
  console.log('\n📋 Phase 2: Deleting orders & operations...')

  // Packaging items → Packaging → Order
  const packagingItems = await prisma.packagingItem.deleteMany({})
  console.log(`  ✓ Packaging Items: ${packagingItems.count} deleted`)
  const packagings = await prisma.packaging.deleteMany({})
  console.log(`  ✓ Packagings: ${packagings.count} deleted`)

  // OrderPayment → Order
  const orderPayments = await prisma.orderPayment.deleteMany({})
  console.log(`  ✓ Order Payments: ${orderPayments.count} deleted`)

  // OrderLineItem → Order
  const orderItems = await prisma.orderLineItem.deleteMany({})
  console.log(`  ✓ Order Line Items: ${orderItems.count} deleted`)

  // Shipment → Order
  const shipments = await prisma.shipment.deleteMany({})
  console.log(`  ✓ Shipments: ${shipments.count} deleted`)

  // CostAdjustment items → CostAdjustment
  const costAdjItems = await prisma.costAdjustmentItem.deleteMany({})
  console.log(`  ✓ Cost Adjustment Items: ${costAdjItems.count} deleted`)
  const costAdjs = await prisma.costAdjustment.deleteMany({})
  console.log(`  ✓ Cost Adjustments: ${costAdjs.count} deleted`)

  // Order → Customer
  const orders = await prisma.order.deleteMany({})
  console.log(`  ✓ Orders: ${orders.count} deleted`)

  // PurchaseOrderItem → PurchaseOrder
  const poItems = await prisma.purchaseOrderItem.deleteMany({})
  console.log(`  ✓ Purchase Order Items: ${poItems.count} deleted`)

  // PurchaseOrder → Supplier
  const purchaseOrders = await prisma.purchaseOrder.deleteMany({})
  console.log(`  ✓ Purchase Orders: ${purchaseOrders.count} deleted`)

  // === Phase 3: Inventory related ===
  console.log('\n📋 Phase 3: Deleting inventory data...')

  // InventoryCheckItem → InventoryCheck
  const invCheckItems = await prisma.inventoryCheckItem.deleteMany({})
  console.log(`  ✓ Inventory Check Items: ${invCheckItems.count} deleted`)
  const invChecks = await prisma.inventoryCheck.deleteMany({})
  console.log(`  ✓ Inventory Checks: ${invChecks.count} deleted`)

  // StockTransferItem → StockTransfer
  const stockTransferItems = await prisma.stockTransferItem.deleteMany({})
  console.log(`  ✓ Stock Transfer Items: ${stockTransferItems.count} deleted`)
  const stockTransfers = await prisma.stockTransfer.deleteMany({})
  console.log(`  ✓ Stock Transfers: ${stockTransfers.count} deleted`)

  // StockHistory
  const stockHistory = await prisma.stockHistory.deleteMany({})
  console.log(`  ✓ Stock History: ${stockHistory.count} deleted`)

  // StockLocation
  const stockLocations = await prisma.stockLocation.deleteMany({})
  console.log(`  ✓ Stock Locations: ${stockLocations.count} deleted`)

  // InventoryReceipt items
  const inventoryReceiptItems = await prisma.inventoryReceiptItem.deleteMany({})
  console.log(`  ✓ Inventory Receipt Items: ${inventoryReceiptItems.count} deleted`)
  const inventoryReceipts = await prisma.inventoryReceipt.deleteMany({})
  console.log(`  ✓ Inventory Receipts: ${inventoryReceipts.count} deleted`)

  // Product related tables
  const productSerials = await prisma.productSerial.deleteMany({})
  console.log(`  ✓ Product Serials: ${productSerials.count} deleted`)
  const productBatches = await prisma.productBatch.deleteMany({})
  console.log(`  ✓ Product Batches: ${productBatches.count} deleted`)
  const productPrices = await prisma.productPrice.deleteMany({})
  console.log(`  ✓ Product Prices: ${productPrices.count} deleted`)
  const productConversions = await prisma.productConversion.deleteMany({})
  console.log(`  ✓ Product Conversions: ${productConversions.count} deleted`)
  const productInventory = await prisma.productInventory.deleteMany({})
  console.log(`  ✓ Product Inventory: ${productInventory.count} deleted`)
  const productCategories = await prisma.productCategory.deleteMany({})
  console.log(`  ✓ Product Categories: ${productCategories.count} deleted`)

  // Products
  const products = await prisma.product.deleteMany({})
  console.log(`  ✓ Products: ${products.count} deleted`)

  // === Phase 4: Main entities ===
  console.log('\n📋 Phase 4: Deleting main entities...')

  const customers = await prisma.customer.deleteMany({})
  console.log(`  ✓ Customers: ${customers.count} deleted`)

  const suppliers = await prisma.supplier.deleteMany({})
  console.log(`  ✓ Suppliers: ${suppliers.count} deleted`)

  // === Phase 5: Activity logs for these entities ===
  console.log('\n📋 Phase 5: Cleaning activity logs...')
  const activityLogs = await prisma.activityLog.deleteMany({
    where: {
      entityType: {
        in: ['customer', 'supplier', 'product', 'order', 'purchase_order', 'payment', 'receipt', 'cashbook', 'complaint', 'warranty', 'sales_return', 'purchase_return', 'shipment', 'stock_check', 'stock_transfer', 'inventory_receipt']
      }
    }
  })
  console.log(`  ✓ Activity Logs: ${activityLogs.count} deleted`)

  // === Summary ===
  console.log('\n═══════════════════════════════════════════════════════════')
  console.log('✅ DONE! All customer, supplier, and product data purged.')
  console.log('═══════════════════════════════════════════════════════════')

  // Verify
  const remainingCustomers = await prisma.customer.count()
  const remainingSuppliers = await prisma.supplier.count()
  const remainingProducts = await prisma.product.count()
  const remainingOrders = await prisma.order.count()
  console.log(`\n🔍 Verification:`)
  console.log(`  Customers: ${remainingCustomers}`)
  console.log(`  Suppliers: ${remainingSuppliers}`)
  console.log(`  Products: ${remainingProducts}`)
  console.log(`  Orders: ${remainingOrders}`)
}

main()
  .then(() => prisma.$disconnect())
  .catch(e => {
    console.error('❌ Error:', e)
    prisma.$disconnect()
    process.exit(1)
  })
