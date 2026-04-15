/**
 * Script kiểm tra dữ liệu combo product trong DB
 * Chạy: npx tsx --env-file=.env scripts/check-combo-data.ts
 */
import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  try {
    // Lấy product SP000004
    const product = await prisma.product.findUnique({
      where: { systemId: 'SP000004' },
      select: {
        systemId: true,
        id: true,
        name: true,
        type: true,
        comboItems: true,
        comboPricingType: true,
        comboDiscount: true,
        storageLocationSystemId: true,
        lastPurchasePrice: true,
        lastPurchaseDate: true,
        costPrice: true,
      },
    })

    console.log('\n=== Product SP000004 ===')
    console.log(JSON.stringify(product, null, 2))

    // Kiểm tra tất cả combo products
    const combos = await prisma.product.findMany({
      where: { type: 'COMBO', isDeleted: false },
      select: {
        systemId: true,
        id: true,
        name: true,
        type: true,
        comboItems: true,
        comboPricingType: true,
        comboDiscount: true,
      },
      take: 5,
    })

    console.log(`\n=== Tất cả Combo Products (${combos.length}) ===`)
    for (const combo of combos) {
      const items = combo.comboItems
      const itemCount = Array.isArray(items) ? items.length : 0
      console.log(`- ${combo.systemId} | ${combo.name} | type=${combo.type} | comboItems=${itemCount} items | pricingType=${combo.comboPricingType} | discount=${combo.comboDiscount}`)
      if (Array.isArray(items) && items.length > 0) {
        console.log(`  Items: ${JSON.stringify(items)}`)
      } else {
        console.log(`  Items RAW: ${JSON.stringify(items)}`)
      }
    }

    // Check stock history for SP000004
    const stockHistory = await prisma.stockHistory.findMany({
      where: { productId: 'SP000004' },
      orderBy: { createdAt: 'desc' },
      take: 3,
      select: {
        action: true,
        source: true,
        quantityChange: true,
        branchId: true,
        createdAt: true,
      },
    })
    console.log(`\n=== Stock History SP000004 (${stockHistory.length}) ===`)
    for (const sh of stockHistory) {
      console.log(`- ${sh.action} | qty=${sh.quantityChange} | branch=${sh.branchId} | ${sh.createdAt.toISOString()}`)
    }

  } finally {
    await prisma.$disconnect()
  }
}

main().catch(console.error)
