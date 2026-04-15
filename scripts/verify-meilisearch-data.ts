/**
 * Verify Meilisearch Data Integrity
 *
 * So sánh dữ liệu trong Meilisearch index với PostgreSQL,
 * phát hiện systemId mapping sai, bản ghi thiếu, tên/phone lệch.
 *
 * Run: npx tsx scripts/verify-meilisearch-data.ts
 * Options:
 *   --customers   Verify customers only
 *   --products    Verify products only
 *   --fix         Re-sync after verifying (optional)
 */

import { prisma } from '@/lib/prisma'
import { getMeiliClient, INDEXES, healthCheck } from '@/lib/meilisearch'
import type { MeiliCustomer, MeiliProduct } from '@/lib/meilisearch'
import { syncCustomers, syncProducts } from '@/lib/meilisearch-sync'
import * as fs from 'fs'
import * as path from 'path'

// UTF-8 output
process.stdout.setDefaultEncoding?.('utf-8')

interface Mismatch {
  meiliId: string
  meiliName: string
  meiliPhone?: string | null
  dbSystemId: string
  dbName: string
  dbPhone?: string | null
  issue: string
}

async function verifyCustomers(): Promise<{
  total: number
  mismatches: Mismatch[]
  missingInDb: string[]
  missingInMeili: string[]
  staleDeleted: string[]
}> {
  console.log('\n══════════════════════════════════════')
  console.log('🔍 Verifying CUSTOMERS index...')
  console.log('══════════════════════════════════════\n')

  const client = getMeiliClient()
  const index = client.index<MeiliCustomer>(INDEXES.CUSTOMERS)

  // 1. Get ALL documents from Meilisearch (paginated)
  const meiliDocs: MeiliCustomer[] = []
  let offset = 0
  const limit = 1000
  while (true) {
    const batch = await index.getDocuments({ limit, offset })
    meiliDocs.push(...batch.results)
    if (batch.results.length < limit) break
    offset += limit
  }
  console.log(`  Meilisearch: ${meiliDocs.length} documents`)

  // 2. Get ALL active customers from PostgreSQL
  const dbCustomers = await prisma.customer.findMany({
    where: { isDeleted: false },
    select: { systemId: true, id: true, name: true, phone: true },
  })
  console.log(`  PostgreSQL:  ${dbCustomers.length} active customers`)

  // 3. Build lookup maps
  const dbBySystemId = new Map(dbCustomers.map(c => [c.systemId, c]))
  const meiliById = new Map(meiliDocs.map(d => [d.id, d]))

  const mismatches: Mismatch[] = []
  const missingInDb: string[] = []
  const staleDeleted: string[] = []

  // 4. Check each Meilisearch document against DB
  for (const doc of meiliDocs) {
    const dbCustomer = dbBySystemId.get(doc.id)

    if (!dbCustomer) {
      // Document exists in Meili but NOT in DB (deleted or wrong ID)
      missingInDb.push(`Meili id=${doc.id} customerId=${doc.customerId} name="${doc.name}" → NOT FOUND in DB`)
      staleDeleted.push(doc.id)
      continue
    }

    // Check name mismatch
    if (dbCustomer.name !== doc.name) {
      mismatches.push({
        meiliId: doc.id,
        meiliName: doc.name,
        meiliPhone: doc.phone,
        dbSystemId: dbCustomer.systemId,
        dbName: dbCustomer.name,
        dbPhone: dbCustomer.phone,
        issue: `NAME MISMATCH: Meili="${doc.name}" vs DB="${dbCustomer.name}"`,
      })
    }

    // Check phone mismatch
    if ((dbCustomer.phone || null) !== (doc.phone || null)) {
      mismatches.push({
        meiliId: doc.id,
        meiliName: doc.name,
        meiliPhone: doc.phone,
        dbSystemId: dbCustomer.systemId,
        dbName: dbCustomer.name,
        dbPhone: dbCustomer.phone,
        issue: `PHONE MISMATCH: Meili="${doc.phone}" vs DB="${dbCustomer.phone}"`,
      })
    }

    // Check customerId (business ID) mismatch
    if (dbCustomer.id !== doc.customerId) {
      mismatches.push({
        meiliId: doc.id,
        meiliName: doc.name,
        dbSystemId: dbCustomer.systemId,
        dbName: dbCustomer.name,
        issue: `BUSINESS_ID MISMATCH: Meili="${doc.customerId}" vs DB="${dbCustomer.id}"`,
      })
    }
  }

  // 5. Check customers in DB but missing from Meilisearch
  const missingInMeili: string[] = []
  for (const customer of dbCustomers) {
    if (!meiliById.has(customer.systemId)) {
      missingInMeili.push(`DB systemId=${customer.systemId} id=${customer.id} name="${customer.name}" → NOT in Meilisearch`)
    }
  }

  // 6. Report
  console.log(`\n  ✅ Matched:        ${meiliDocs.length - mismatches.length - missingInDb.length}`)
  console.log(`  ⚠️  Mismatches:     ${mismatches.length}`)
  console.log(`  ❌ Missing in DB:  ${missingInDb.length} (stale/deleted)`)
  console.log(`  ❌ Missing in Meili: ${missingInMeili.length}`)

  if (mismatches.length > 0) {
    console.log('\n  --- MISMATCHES ---')
    for (const m of mismatches.slice(0, 20)) {
      console.log(`  ${m.issue}`)
      console.log(`    Meili: id=${m.meiliId} "${m.meiliName}" phone=${m.meiliPhone}`)
      console.log(`    DB:    systemId=${m.dbSystemId} "${m.dbName}" phone=${m.dbPhone}`)
    }
    if (mismatches.length > 20) {
      console.log(`  ... and ${mismatches.length - 20} more`)
    }
  }

  if (missingInDb.length > 0) {
    console.log('\n  --- STALE (in Meili, not in DB) ---')
    for (const msg of missingInDb.slice(0, 10)) {
      console.log(`  ${msg}`)
    }
    if (missingInDb.length > 10) {
      console.log(`  ... and ${missingInDb.length - 10} more`)
    }
  }

  if (missingInMeili.length > 0) {
    console.log('\n  --- MISSING in Meilisearch ---')
    for (const msg of missingInMeili.slice(0, 10)) {
      console.log(`  ${msg}`)
    }
    if (missingInMeili.length > 10) {
      console.log(`  ... and ${missingInMeili.length - 10} more`)
    }
  }

  return { total: meiliDocs.length, mismatches, missingInDb, missingInMeili, staleDeleted }
}

async function verifyProducts(): Promise<{
  total: number
  mismatches: Mismatch[]
  missingInDb: string[]
  missingInMeili: string[]
  staleDeleted: string[]
}> {
  console.log('\n══════════════════════════════════════')
  console.log('🔍 Verifying PRODUCTS index...')
  console.log('══════════════════════════════════════\n')

  const client = getMeiliClient()
  const index = client.index<MeiliProduct>(INDEXES.PRODUCTS)

  // 1. Get ALL documents from Meilisearch
  const meiliDocs: MeiliProduct[] = []
  let offset = 0
  const limit = 1000
  while (true) {
    const batch = await index.getDocuments({ limit, offset })
    meiliDocs.push(...batch.results)
    if (batch.results.length < limit) break
    offset += limit
  }
  console.log(`  Meilisearch: ${meiliDocs.length} documents`)

  // 2. Get ALL active products from PostgreSQL
  const dbProducts = await prisma.product.findMany({
    where: { isDeleted: false },
    select: { systemId: true, id: true, name: true, barcode: true },
  })
  console.log(`  PostgreSQL:  ${dbProducts.length} active products`)

  // 3. Build lookups
  const dbBySystemId = new Map(dbProducts.map(p => [p.systemId, p]))
  const meiliById = new Map(meiliDocs.map(d => [d.id, d]))

  const mismatches: Mismatch[] = []
  const missingInDb: string[] = []
  const staleDeleted: string[] = []

  // 4. Check Meilisearch docs
  for (const doc of meiliDocs) {
    const dbProduct = dbBySystemId.get(doc.id)

    if (!dbProduct) {
      missingInDb.push(`Meili id=${doc.id} productId=${doc.productId} name="${doc.name}" → NOT FOUND in DB`)
      staleDeleted.push(doc.id)
      continue
    }

    if (dbProduct.name !== doc.name) {
      mismatches.push({
        meiliId: doc.id,
        meiliName: doc.name,
        dbSystemId: dbProduct.systemId,
        dbName: dbProduct.name,
        issue: `NAME MISMATCH: Meili="${doc.name}" vs DB="${dbProduct.name}"`,
      })
    }

    if (dbProduct.id !== doc.productId) {
      mismatches.push({
        meiliId: doc.id,
        meiliName: doc.name,
        dbSystemId: dbProduct.systemId,
        dbName: dbProduct.name,
        issue: `BUSINESS_ID MISMATCH: Meili="${doc.productId}" vs DB="${dbProduct.id}"`,
      })
    }
  }

  // 5. Missing in Meilisearch
  const missingInMeili: string[] = []
  for (const product of dbProducts) {
    if (!meiliById.has(product.systemId)) {
      missingInMeili.push(`DB systemId=${product.systemId} id=${product.id} name="${product.name}" → NOT in Meilisearch`)
    }
  }

  // 6. Report
  console.log(`\n  ✅ Matched:        ${meiliDocs.length - mismatches.length - missingInDb.length}`)
  console.log(`  ⚠️  Mismatches:     ${mismatches.length}`)
  console.log(`  ❌ Missing in DB:  ${missingInDb.length} (stale/deleted)`)
  console.log(`  ❌ Missing in Meili: ${missingInMeili.length}`)

  if (mismatches.length > 0) {
    console.log('\n  --- MISMATCHES ---')
    for (const m of mismatches.slice(0, 20)) {
      console.log(`  ${m.issue}`)
    }
    if (mismatches.length > 20) console.log(`  ... and ${mismatches.length - 20} more`)
  }

  if (missingInDb.length > 0) {
    console.log('\n  --- STALE (in Meili, not in DB) ---')
    for (const msg of missingInDb.slice(0, 10)) console.log(`  ${msg}`)
    if (missingInDb.length > 10) console.log(`  ... and ${missingInDb.length - 10} more`)
  }

  if (missingInMeili.length > 0) {
    console.log('\n  --- MISSING in Meilisearch ---')
    for (const msg of missingInMeili.slice(0, 10)) console.log(`  ${msg}`)
    if (missingInMeili.length > 10) console.log(`  ... and ${missingInMeili.length - 10} more`)
  }

  return { total: meiliDocs.length, mismatches, missingInDb, missingInMeili, staleDeleted }
}

async function main() {
  console.log('🔍 Meilisearch Data Integrity Verifier')
  console.log('=' .repeat(50))

  // Check connection
  const isHealthy = await healthCheck()
  if (!isHealthy) {
    console.error('❌ Cannot connect to Meilisearch!')
    console.error('   docker-compose up -d meilisearch')
    process.exit(1)
  }
  console.log('✅ Meilisearch connected')

  const args = process.argv.slice(2)
  const verifyCustomersOnly = args.includes('--customers')
  const verifyProductsOnly = args.includes('--products')
  const shouldFix = args.includes('--fix')
  const verifyAll = !verifyCustomersOnly && !verifyProductsOnly

  let hasIssues = false

  // Verify customers
  if (verifyAll || verifyCustomersOnly) {
    const result = await verifyCustomers()
    if (result.mismatches.length > 0 || result.missingInDb.length > 0 || result.missingInMeili.length > 0) {
      hasIssues = true
    }
  }

  // Verify products
  if (verifyAll || verifyProductsOnly) {
    const result = await verifyProducts()
    if (result.mismatches.length > 0 || result.missingInDb.length > 0 || result.missingInMeili.length > 0) {
      hasIssues = true
    }
  }

  // Fix if requested
  if (shouldFix && hasIssues) {
    console.log('\n\n🔧 RE-SYNCING to fix issues...\n')

    if (verifyAll || verifyCustomersOnly) {
      console.log('  Syncing customers...')
      const count = await syncCustomers()
      console.log(`  ✅ Customers synced: ${count}`)
    }
    if (verifyAll || verifyProductsOnly) {
      console.log('  Syncing products...')
      const count = await syncProducts({ fullSync: true })
      console.log(`  ✅ Products synced: ${count}`)
    }

    console.log('\n🎉 Re-sync complete! Run without --fix to verify again.')
  } else if (hasIssues) {
    console.log('\n\n⚠️  Issues found! Run with --fix to re-sync:')
    console.log('   npx tsx scripts/verify-meilisearch-data.ts --fix')
  } else {
    console.log('\n\n✅ All data is consistent! No issues found.')
  }

  // Write report
  const reportPath = path.join(process.cwd(), 'meilisearch-verify-report.txt')
  const timestamp = new Date().toISOString()
  fs.writeFileSync(reportPath, `Meilisearch Verification Report\nGenerated: ${timestamp}\n\nSee console output for details.\n`, 'utf-8')
  console.log(`\n📄 Report: ${reportPath}`)
}

main()
  .catch(console.error)
  .finally(() => {
    prisma.$disconnect()
    process.exit(0)
  })
