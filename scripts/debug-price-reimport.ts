/**
 * Debug: Kiểm tra flow giá khi re-import
 * Trace UH102 từ PKGX → pkgxProduct → ProductPrice → Meilisearch
 */

import { MeiliSearch } from 'meilisearch'
import { prisma } from '../lib/prisma'

async function main() {
  const SEARCH_ID = 'UH102' // Mã sản phẩm từ screenshot
  
  console.log('=== DEBUG GIÁ RE-IMPORT ===\n')

  // 1. Tìm HRM product
  const hrmProduct = await prisma.product.findFirst({
    where: { id: SEARCH_ID, isDeleted: false },
    select: {
      systemId: true,
      id: true,
      name: true,
      pkgxId: true,
      costPrice: true,
    },
  })

  if (!hrmProduct) {
    console.log(`❌ Không tìm thấy product với id = ${SEARCH_ID}`)
    // Try by partial match
    const partial = await prisma.product.findMany({
      where: { id: { contains: SEARCH_ID }, isDeleted: false },
      select: { systemId: true, id: true, name: true, pkgxId: true },
      take: 5,
    })
    console.log('Partial matches:', partial)
    return
  }

  console.log('1. HRM Product:')
  console.log(`   ID: ${hrmProduct.id}`)
  console.log(`   Name: ${hrmProduct.name}`)
  console.log(`   SystemId: ${hrmProduct.systemId}`)
  console.log(`   pkgxId: ${hrmProduct.pkgxId}`)
  console.log(`   costPrice: ${hrmProduct.costPrice}`)

  // 2. Kiểm tra pkgxProduct (cache local)
  if (hrmProduct.pkgxId) {
    const pkgxProd = await prisma.pkgxProduct.findUnique({
      where: { id: hrmProduct.pkgxId },
    })
    if (pkgxProd) {
      console.log('\n2. PKGX Product (local cache):')
      console.log(`   shopPrice: ${pkgxProd.shopPrice}`)
      console.log(`   marketPrice: ${pkgxProd.marketPrice}`)
      console.log(`   partnerPrice: ${pkgxProd.partnerPrice}`)
      console.log(`   acePrice: ${pkgxProd.acePrice}`)
      console.log(`   dealPrice: ${pkgxProd.dealPrice}`)
      console.log(`   syncedAt: ${pkgxProd.syncedAt}`)
    } else {
      console.log('\n2. ❌ Không tìm thấy pkgxProduct với id =', hrmProduct.pkgxId)
    }
  }

  // 3. Kiểm tra ProductPrice records
  const prices = await prisma.productPrice.findMany({
    where: { productId: hrmProduct.systemId },
    include: {
      pricingPolicy: {
        select: { systemId: true, name: true },
      },
    },
  })
  console.log(`\n3. ProductPrice records (${prices.length}):`)
  for (const p of prices) {
    console.log(`   Policy: ${p.pricingPolicy?.name || p.pricingPolicyId} → ${p.price}`)
  }

  // 4. Kiểm tra PkgxPriceMapping
  const allPolicies = await prisma.pricingPolicy.findMany({
    select: { systemId: true, name: true, isDefault: true },
    orderBy: { name: 'asc' },
  })

  const mappings = await prisma.pkgxPriceMapping.findMany({
    where: { isActive: true },
  })
  console.log(`\n4. PKGX Price Mappings (${mappings.length}):`)
  for (const m of mappings) {
    const policy = allPolicies.find(p => p.systemId === m.pricingPolicyId)
    console.log(`   ${m.priceType} → ${policy?.name || m.pricingPolicyId} (active: ${m.isActive})`)
  }

  // 5. Kiểm tra Meilisearch
  try {
    const client = new MeiliSearch({
      host: process.env.MEILISEARCH_HOST || 'http://localhost:7700',
      apiKey: process.env.MEILISEARCH_API_KEY || '',
    })
    const index = client.index('products')
    const result = await index.search(SEARCH_ID, { limit: 1 })
    if (result.hits.length > 0) {
      const hit = result.hits[0] as Record<string, unknown>
      console.log('\n5. Meilisearch product:')
      console.log(`   id: ${hit.id}`)
      console.log(`   name: ${hit.name}`)
      console.log(`   price: ${hit.price}`)
      console.log(`   prices:`, JSON.stringify(hit.prices, null, 2))
    } else {
      console.log('\n5. ❌ Không tìm thấy trong Meilisearch')
    }
  } catch (e) {
    console.log('\n5. ⚠️ Meilisearch error:', (e as Error).message)
  }

  // 6. Summary
  console.log(`\n6. All PricingPolicies (${allPolicies.length}):`)
  for (const pol of allPolicies) {
    const priceForProduct = prices.find(p => p.pricingPolicyId === pol.systemId)
    console.log(`   ${pol.name} (${pol.systemId})${pol.isDefault ? ' [DEFAULT]' : ''} → ${priceForProduct ? priceForProduct.price : '❌ no price'}`)
  }

  console.log('\n=== END DEBUG ===')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
