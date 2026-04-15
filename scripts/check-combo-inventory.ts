/**
 * Script kiểm tra inventory + branches data cho combo items
 * Mục đích: Debug "Có thể bán" = 0 + check branches
 * Chạy: npx tsx --env-file=.env scripts/check-combo-inventory.ts
 */
import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  try {
    // 1. Check all settingsData types
    const types = await prisma.settingsData.groupBy({
      by: ['type'],
      _count: { type: true },
      where: { isDeleted: false },
    })
    console.log('\n=== SettingsData types ===')
    for (const t of types) {
      console.log(`  ${t.type}: ${t._count.type} records`)
    }

    // 2. Check branches
    const branchLike = await prisma.settingsData.findMany({
      where: {
        isDeleted: false,
        type: { in: ['branch', 'Branch', 'BRANCH', 'chi_nhanh', 'chi-nhanh', 'store', 'warehouse'] },
      },
      select: { systemId: true, name: true, type: true },
      take: 10,
    })
    console.log(`\n=== Branch-like settings (${branchLike.length}) ===`)
    for (const b of branchLike) {
      console.log(`  ${b.systemId} | ${b.name} | type=${b.type}`)
    }

    // 3. Check ProductInventory table
    const invCount = await prisma.productInventory.count()
    console.log(`\n=== ProductInventory total: ${invCount} ===`)

    const sampleInv = await prisma.productInventory.findMany({
      take: 5,
      select: {
        productId: true,
        branchId: true,
        onHand: true,
        committed: true,
      },
    })
    console.log('Sample:')
    for (const inv of sampleInv) {
      console.log(`  productId=${inv.productId} | branchId=${inv.branchId} | onHand=${inv.onHand} | committed=${inv.committed}`)
    }

    // 4. Combo product + items
    const combo = await prisma.product.findUnique({
      where: { systemId: 'SP000004' },
      select: {
        systemId: true,
        name: true,
        type: true,
        comboItems: true,
        isPublished: true,
        pkgxId: true,
      },
    })
    console.log(`\n=== Combo SP000004 ===`)
    console.log(`  isPublished: ${combo?.isPublished} | pkgxId: ${combo?.pkgxId}`)
    console.log(`  comboItems: ${JSON.stringify(combo?.comboItems)}`)

    // 5. Check branches from Branch table
    const allBranches = await prisma.branch.findMany({
      where: { isDeleted: false },
      select: { systemId: true, id: true, name: true },
    })
    console.log(`\n=== Branches from Branch table (${allBranches.length}) ===`)
    for (const b of allBranches) {
      console.log(`  ${b.systemId} | ${b.id} | ${b.name}`)
    }

    // 6. Check combo items' inventory
    const comboItems = Array.isArray(combo?.comboItems) ? combo.comboItems : []
    const productIds = (comboItems as Array<{ productSystemId: string }>).map(i => i.productSystemId)
    
    if (productIds.length > 0) {
      // Check ProductInventory records for these products
      const comboInv = await prisma.productInventory.findMany({
        where: { productId: { in: productIds } },
        select: {
          productId: true,
          branchId: true,
          onHand: true,
          committed: true,
          inTransit: true,
          inDelivery: true,
        },
      })
      console.log(`\n=== ProductInventory for combo items (${comboInv.length}) ===`)
      for (const inv of comboInv) {
        const sellable = Math.max(0, inv.onHand - inv.committed)
        console.log(`  ${inv.productId} | branchId=${inv.branchId} | onHand=${inv.onHand} | committed=${inv.committed} | sellable=${sellable}`)
      }

      // Check Product.inventoryByBranch JSON column  
      const products = await prisma.product.findMany({
        where: { systemId: { in: productIds } },
        select: {
          systemId: true,
          id: true,
          name: true,
          inventoryByBranch: true,
          committedByBranch: true,
        },
      })
      console.log(`\n=== Product.inventoryByBranch JSON column ===`)
      for (const p of products) {
        console.log(`  ${p.systemId} | ${p.id} | inventoryByBranch=${JSON.stringify(p.inventoryByBranch)} | committedByBranch=${JSON.stringify(p.committedByBranch)}`)
      }

      // 7. Simulate getAvailableStock for each product
      console.log(`\n=== Simulated getAvailableStock ===`)
      for (const p of products) {
        const inv = (p.inventoryByBranch || {}) as Record<string, number>
        const com = (p.committedByBranch || {}) as Record<string, number>
        
        // Method 1: iterate branches (what component does)
        let sell1 = 0
        for (const b of allBranches) {
          const onHand = inv[b.systemId] || 0
          const committed = com[b.systemId] || 0
          sell1 += Math.max(0, onHand - committed)
        }
        
        // Method 2: iterate ProductInventory records (the "correct" way)
        const prodInv = comboInv.filter(i => i.productId === p.systemId)
        let sell2 = 0
        for (const i of prodInv) {
          sell2 += Math.max(0, i.onHand - i.committed)
        }
        
        // Method 3: sum raw values
        const rawSum = Object.values(inv).reduce((s, v) => s + v, 0)
        
        console.log(`  ${p.id}: Branch-iter=${sell1} | ProdInv-iter=${sell2} | rawSum=${rawSum} | invKeys=${JSON.stringify(Object.keys(inv))} | branchIds=${JSON.stringify(allBranches.map(b => b.systemId))}`)
      }
    }

  } finally {
    await prisma.$disconnect()
  }
}

main().catch(console.error)
