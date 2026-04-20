/**
 * Backfill Product.lastPurchasePrice, lastPurchaseDate, costPrice
 * from actual PurchaseOrder + InventoryReceipt data.
 *
 * Logic: Tìm phiếu nhập kho (InventoryReceipt) mới nhất cho mỗi sản phẩm,
 * lấy unitCost từ đó làm lastPurchasePrice. Nếu không có phiếu nhập kho,
 * fallback sang PurchaseOrderItem mới nhất có receivedQty > 0.
 *
 * Usage: npx tsx scripts/backfill-purchase-prices.ts
 */

import 'dotenv/config'
import { prisma } from '../lib/prisma.js'

async function main() {
  console.log('=== Backfill Purchase Prices ===\n')

  // Step 1: Get latest price from InventoryReceipt items (most reliable source)
  console.log('📊 Step 1: Getting latest prices from InventoryReceipt items...')

  const receiptPrices = await prisma.$queryRawUnsafe<
    Array<{
      productId: string
      unitCost: number
      receiptDate: Date
    }>
  >(`
    SELECT DISTINCT ON (iri."productId")
      iri."productId",
      iri."unitCost"::numeric as "unitCost",
      ir."receiptDate"
    FROM inventory_receipt_items iri
    JOIN inventory_receipts ir ON ir."systemId" = iri."receiptId"
    WHERE iri."productId" IS NOT NULL
      AND iri."unitCost" > 0
      AND ir.status = 'CONFIRMED'
    ORDER BY iri."productId", ir."receiptDate" DESC, ir."createdAt" DESC
  `)

  console.log(`  Found prices from ${receiptPrices.length} products via InventoryReceipt`)

  const priceMap = new Map<string, { unitPrice: number; date: Date }>()
  for (const r of receiptPrices) {
    priceMap.set(r.productId, {
      unitPrice: Number(r.unitCost),
      date: new Date(r.receiptDate),
    })
  }

  // Step 2: Fallback - get from PO items for products not in receiptPrices
  console.log('\n📊 Step 2: Getting fallback prices from PurchaseOrderItem...')

  const poItemPrices = await prisma.$queryRawUnsafe<
    Array<{
      productId: string
      unitPrice: number
      orderDate: Date
      shippingFee: number
      tax: number
      totalQty: number
    }>
  >(`
    SELECT DISTINCT ON (poi."productId")
      poi."productId",
      poi."unitPrice"::numeric as "unitPrice",
      po."orderDate",
      COALESCE(po."shippingFee", 0)::numeric as "shippingFee",
      COALESCE(po.tax, 0)::numeric as tax,
      (SELECT COALESCE(SUM(poi2.quantity), 0)
       FROM purchase_order_items poi2
       WHERE poi2."purchaseOrderId" = po."systemId")::numeric as "totalQty"
    FROM purchase_order_items poi
    JOIN purchase_orders po ON po."systemId" = poi."purchaseOrderId"
    WHERE poi."productId" IS NOT NULL
      AND poi."unitPrice" > 0
      AND po.status NOT IN ('CANCELLED')
      AND (po."deliveryStatus" IN ('Đã nhập', 'Nhập một phần')
           OR po.status IN ('COMPLETED')
           OR poi."receivedQty" > 0)
    ORDER BY poi."productId", po."orderDate" DESC, po."createdAt" DESC
  `)

  let fallbackCount = 0
  for (const r of poItemPrices) {
    if (priceMap.has(r.productId)) continue // Already have from receipt
    fallbackCount++
    const totalQty = Number(r.totalQty) || 1
    const fees = Number(r.shippingFee) + Number(r.tax)
    const feePerUnit = fees / totalQty
    priceMap.set(r.productId, {
      unitPrice: Number(r.unitPrice),
      date: new Date(r.orderDate),
    })
    // Store fee info for costPrice calculation
    ;(priceMap.get(r.productId) as Record<string, unknown>)._feePerUnit = feePerUnit
  }

  console.log(`  Found fallback prices for ${fallbackCount} additional products`)
  console.log(`  Total products to update: ${priceMap.size}`)

  // Step 3: Get current product prices to compare
  console.log('\n🔍 Step 3: Comparing with current Product prices...')

  const products = await prisma.product.findMany({
    where: {
      systemId: { in: [...priceMap.keys()] },
    },
    select: {
      systemId: true,
      id: true,
      name: true,
      lastPurchasePrice: true,
      lastPurchaseDate: true,
      costPrice: true,
    },
  })

  let updated = 0
  let skipped = 0
  const updates: Array<{ id: string; name: string; old: string; new: string }> = []

  // Step 4: Update products
  console.log('\n🔧 Step 4: Updating product prices...')

  for (const product of products) {
    const priceInfo = priceMap.get(product.systemId)
    if (!priceInfo) continue

    const currentPrice = Number(product.lastPurchasePrice || 0)
    const newPrice = priceInfo.unitPrice
    const newDate = priceInfo.date
    const feePerUnit = (priceInfo as Record<string, unknown>)._feePerUnit as number | undefined
    const newCostPrice = feePerUnit != null
      ? Math.round(newPrice + feePerUnit)
      : Math.round(newPrice) // If from receipt, costPrice = unitPrice (fees already excluded)

    // Only update if price changed or was 0
    if (currentPrice === newPrice && product.lastPurchaseDate != null) {
      skipped++
      continue
    }

    await prisma.product.update({
      where: { systemId: product.systemId },
      data: {
        lastPurchasePrice: newPrice,
        lastPurchaseDate: newDate,
        ...(Number(product.costPrice || 0) === 0 ? { costPrice: newCostPrice } : {}),
      },
    })

    updated++
    updates.push({
      id: product.id,
      name: product.name.substring(0, 40),
      old: `${currentPrice}`,
      new: `${newPrice}`,
    })
  }

  // Step 5: Summary
  console.log('\n📋 Summary:')
  console.log(`  Total products with PO data: ${priceMap.size}`)
  console.log(`  Updated: ${updated}`)
  console.log(`  Skipped (already correct): ${skipped}`)
  console.log(`  Not found in DB: ${priceMap.size - products.length}`)

  if (updates.length > 0) {
    console.log('\n📝 Updated products (first 30):')
    for (const u of updates.slice(0, 30)) {
      console.log(`  ${u.id} | ${u.name} | ${u.old} → ${u.new}`)
    }
    if (updates.length > 30) {
      console.log(`  ... and ${updates.length - 30} more`)
    }
  }

  console.log('\n✅ Done!')
  await prisma.$disconnect()
}

main().catch(async (e) => {
  console.error('❌ Error:', e)
  await prisma.$disconnect()
  process.exit(1)
})
