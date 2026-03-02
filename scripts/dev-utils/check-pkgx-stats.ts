import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './generated/prisma/client'
import pg from 'pg'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://erp_user:erp_password@localhost:5433/erp_db',
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  // Get all HRM pkgxIds
  const hrmProducts = await prisma.product.findMany({
    where: { isDeleted: false, pkgxId: { not: null } },
    select: { pkgxId: true },
  })
  const hrmPkgxIds = new Set(hrmProducts.map(p => p.pkgxId))
  console.log(`\nHRM products với pkgxId: ${hrmPkgxIds.size}`)

  // Get PKGX products from local cache file or API
  // For now, just show stats
  console.log('\n=== Thống kê ===')
  const total = await prisma.product.count({ where: { isDeleted: false } })
  const linked = await prisma.product.count({ 
    where: { isDeleted: false, pkgxId: { not: null } } 
  })
  console.log(`Total HRM: ${total}`)
  console.log(`Linked (có pkgxId): ${linked}`)
  console.log(`PKGX theo UI: 3019`)
  console.log(`Chênh lệch: ${3019 - linked}`)
  
  // Check if there are duplicate pkgxIds (one pkgxId linked to multiple products)
  const pkgxIdCounts: Record<number, number> = {}
  for (const p of hrmProducts) {
    if (p.pkgxId) {
      pkgxIdCounts[p.pkgxId] = (pkgxIdCounts[p.pkgxId] || 0) + 1
    }
  }
  const duplicates = Object.entries(pkgxIdCounts).filter(([_, count]) => count > 1)
  if (duplicates.length > 0) {
    console.log('\n=== Duplicate pkgxId (1 pkgxId → nhiều products) ===')
    console.log(duplicates)
  } else {
    console.log('\nKhông có duplicate pkgxId')
  }

  await pool.end()
}

main().catch(console.error)
