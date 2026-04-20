/**
 * Check PKGX orphan data:
 * 1. HRM products with pkgxId pointing to non-existent PKGX products
 * 2. Employees count vs isDeleted status
 * 
 * Run: npx tsx -r dotenv/config scripts/check-pkgx-orphans.ts
 */
import 'dotenv/config'
import { prisma } from '../lib/prisma'

// UTF-8 output
process.stdout.setDefaultEncoding?.('utf-8')

async function main() {
  console.log('=== PKGX Orphans Check ===\n')

  // 1. PKGX products in DB
  const pkgxCount = await prisma.pkgxProduct.count()
  console.log(`PKGX products in DB: ${pkgxCount}`)

  // 2. HRM products with pkgxId
  const hrmLinked = await prisma.product.count({
    where: { isDeleted: false, pkgxId: { not: null } },
  })
  console.log(`HRM products with pkgxId (linked): ${hrmLinked}`)

  // 3. Find orphans: HRM products whose pkgxId doesn't exist in pkgx_products
  const allPkgxIds = (await prisma.pkgxProduct.findMany({ select: { id: true } })).map(p => p.id)
  const pkgxIdSet = new Set(allPkgxIds)

  const hrmWithPkgx = await prisma.product.findMany({
    where: { isDeleted: false, pkgxId: { not: null } },
    select: { systemId: true, id: true, name: true, pkgxId: true },
  })

  const orphans = hrmWithPkgx.filter(p => p.pkgxId !== null && !pkgxIdSet.has(p.pkgxId))
  console.log(`\nOrphan HRM products (pkgxId -> deleted PKGX): ${orphans.length}`)
  if (orphans.length > 0 && orphans.length <= 20) {
    orphans.forEach(p => console.log(`  - ${p.id} | pkgxId=${p.pkgxId} | ${p.name}`))
  }

  console.log(`\nValid linked: ${hrmWithPkgx.length - orphans.length}`)
  console.log(`Should show "Đã liên kết": ${hrmWithPkgx.length - orphans.length}`)

  // 4. Total HRM products
  const totalHrm = await prisma.product.count({ where: { isDeleted: false } })
  const deletedHrm = await prisma.product.count({ where: { isDeleted: true } })
  console.log(`\nTotal HRM products (active): ${totalHrm}`)
  console.log(`Total HRM products (deleted): ${deletedHrm}`)

  // 5. Business ID check - malformed IDs with timestamp suffix
  const malformedProducts = await prisma.product.findMany({
    where: {
      isDeleted: false,
      id: { contains: '-' },
      // SP000001-xxxxx pattern
    },
    select: { systemId: true, id: true, name: true, pkgxId: true },
    take: 50,
  })

  // Filter to find SP-prefixed IDs with suffix
  const spMalformed = malformedProducts.filter(p => /^SP\d+-\w+$/.test(p.id))
  console.log(`\nMalformed SP IDs (SP000001-xxxx): ${spMalformed.length}`)
  if (spMalformed.length > 0) {
    spMalformed.slice(0, 10).forEach(p => console.log(`  - ${p.id} | pkgxId=${p.pkgxId} | ${p.name}`))
  }

  // 6. Employees
  console.log('\n=== Employees ===')
  const empTotal = await prisma.employee.count({ where: { isDeleted: false } })
  const empActive = await prisma.employee.count({ where: { isDeleted: false, employmentStatus: 'ACTIVE' } })
  const empDeleted = await prisma.employee.count({ where: { isDeleted: true } })
  console.log(`Employees (isDeleted=false): ${empTotal}`)
  console.log(`Employees (ACTIVE + isDeleted=false): ${empActive}`)
  console.log(`Employees (isDeleted=true): ${empDeleted}`)

  // Show all employees
  const allEmps = await prisma.employee.findMany({
    select: { systemId: true, id: true, fullName: true, employmentStatus: true, isDeleted: true },
    orderBy: { id: 'asc' },
  })
  console.log('\nAll employees:')
  allEmps.forEach(e => console.log(`  ${e.id} | ${e.fullName} | status=${e.employmentStatus} | deleted=${e.isDeleted}`))
}

main()
  .catch(err => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
