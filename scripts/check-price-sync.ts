/**
 * Check product prices: DB vs Meilisearch
 * Run: npx tsx -r dotenv/config scripts/check-price-sync.ts
 */
import 'dotenv/config'
import { prisma } from '../lib/prisma'
import { getMeiliClient, INDEXES } from '../lib/meilisearch'

process.stdout.setDefaultEncoding?.('utf-8')

async function main() {
  console.log('=== Price Sync Check ===\n')

  // 1. Check pkgxPriceMapping
  const mappings = await prisma.pkgxPriceMapping.findMany({ where: { isActive: true } })
  console.log(`Active price mappings: ${mappings.length}`)
  for (const m of mappings) {
    console.log(`  ${m.priceType} → pricingPolicyId: ${m.pricingPolicyId}`)
  }

  // 2. Check a sample product with pkgxId
  const sampleProduct = await prisma.product.findFirst({
    where: { isDeleted: false, pkgxId: { not: null } },
    include: {
      prices: { select: { pricingPolicyId: true, price: true } },
      productInventory: { select: { onHand: true, branch: { select: { systemId: true, name: true } } } },
    },
  })

  if (sampleProduct) {
    console.log(`\n=== Sample HRM Product ===`)
    console.log(`systemId: ${sampleProduct.systemId}`)
    console.log(`id: ${sampleProduct.id}`)
    console.log(`name: ${sampleProduct.name}`)
    console.log(`pkgxId: ${sampleProduct.pkgxId}`)
    console.log(`costPrice: ${sampleProduct.costPrice}`)
    console.log(`Prices in DB (${sampleProduct.prices.length}):`)
    for (const p of sampleProduct.prices) {
      console.log(`  ${p.pricingPolicyId} = ${p.price}`)
    }
    console.log(`Inventory:`)
    for (const inv of sampleProduct.productInventory) {
      console.log(`  ${inv.branch.name} (${inv.branch.systemId}): ${inv.onHand}`)
    }

    // Check Meilisearch
    const client = getMeiliClient()
    try {
      const meiliProduct = await client.index(INDEXES.PRODUCTS).getDocument(sampleProduct.systemId)
      console.log(`\n=== Same product in Meilisearch ===`)
      console.log(`prices: ${JSON.stringify(meiliProduct.prices)}`)
      console.log(`price (default): ${meiliProduct.price}`)
      console.log(`totalStock: ${meiliProduct.totalStock}`)
      console.log(`branchStocks: ${JSON.stringify(meiliProduct.branchStocks)}`)
    } catch (err) {
      console.log(`NOT FOUND in Meilisearch!`)
    }

    // Check corresponding PKGX product
    if (sampleProduct.pkgxId) {
      const pkgxProd = await prisma.pkgxProduct.findUnique({ where: { id: sampleProduct.pkgxId } })
      if (pkgxProd) {
        console.log(`\n=== PKGX Product ===`)
        console.log(`shopPrice: ${pkgxProd.shopPrice}`)
        console.log(`marketPrice: ${pkgxProd.marketPrice}`)
        console.log(`partnerPrice: ${pkgxProd.partnerPrice}`)
        console.log(`acePrice: ${pkgxProd.acePrice}`)
        console.log(`dealPrice: ${pkgxProd.dealPrice}`)
      }
    }
  }

  // 3. Count products with no prices at all
  const noPrice = await prisma.product.count({
    where: { isDeleted: false, pkgxId: { not: null }, prices: { none: {} } },
  })
  const withPrice = await prisma.product.count({
    where: { isDeleted: false, pkgxId: { not: null }, prices: { some: {} } },
  })
  console.log(`\n=== Price Stats ===`)
  console.log(`PKGX-linked products WITH prices: ${withPrice}`)
  console.log(`PKGX-linked products WITHOUT prices: ${noPrice}`)

  // 4. Check Meilisearch stats
  const client = getMeiliClient()
  try {
    const results = await client.index(INDEXES.PRODUCTS).search('', { limit: 5 })
    console.log(`\n=== Meilisearch sample (first 5) ===`)
    for (const hit of results.hits) {
      const h = hit as { productId: string; name: string; price: number; prices: Record<string, number>; totalStock: number; branchStocks: Array<{branchId: string; branchName: string; onHand: number}> }
      console.log(`  ${h.productId} | price=${h.price} | prices=${JSON.stringify(h.prices)} | stock=${h.totalStock} | branches=${h.branchStocks?.length || 0}`)
    }
  } catch {
    console.log('Meilisearch query failed')
  }

  // 5. Check pricing policies
  const policies = await prisma.pricingPolicy.findMany({
    where: { isDeleted: false },
    select: { systemId: true, name: true, type: true, isDefault: true },
    orderBy: { name: 'asc' },
  })
  console.log(`\n=== Pricing Policies ===`)
  for (const p of policies) {
    console.log(`  ${p.systemId} | ${p.name} | type=${p.type} | default=${p.isDefault}`)
  }
}

main()
  .catch(err => { console.error(err); process.exitCode = 1 })
  .finally(async () => { await prisma.$disconnect() })
