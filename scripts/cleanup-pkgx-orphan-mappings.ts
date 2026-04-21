/**
 * PKGX Orphan Mapping Cleanup
 * =============================================================
 * Quét và (tuỳ chọn) dọn các mapping PKGX mà phía HRM đã biến mất hoặc đã soft-delete:
 *   - PkgxBrandMapping.hrmBrandId    → Brand (không tồn tại / isDeleted=true)
 *   - PkgxCategoryMapping.hrmCategoryId → Category (không tồn tại / isDeleted=true)
 *   - PkgxProduct.hrmProductId       → Product (không tồn tại / isDeleted=true)
 *
 * Các mapping orphan này gây ra hiện tượng "zombie" — UI setting PKGX vẫn hiển thị
 * "đã mapping", nhưng khi thử import mới thì bị 409 conflict và brand/category
 * HRM mới KHÔNG được tạo.
 *
 * Mặc định chạy ở **dry-run** — chỉ in ra danh sách, KHÔNG xóa.
 * Chạy `npx tsx scripts/cleanup-pkgx-orphan-mappings.ts --execute` để xóa thật.
 *
 * Run: npx tsx scripts/cleanup-pkgx-orphan-mappings.ts [--execute]
 */

import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL!
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) })

const EXECUTE = process.argv.includes('--execute')

function header(title: string) {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(` ${title}`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
}

async function scanBrandMappings() {
  header('1) PkgxBrandMapping — quét orphan')

  const mappings = await prisma.pkgxBrandMapping.findMany({
    select: {
      systemId: true,
      hrmBrandId: true,
      hrmBrandName: true,
      pkgxBrandId: true,
      pkgxBrandName: true,
    },
  })
  console.log(`Tổng mapping: ${mappings.length}`)

  const hrmBrandIds = Array.from(new Set(mappings.map((m) => m.hrmBrandId)))
  const brands = await prisma.brand.findMany({
    where: { systemId: { in: hrmBrandIds } },
    select: { systemId: true, name: true, isDeleted: true },
  })
  const byId = new Map(brands.map((b) => [b.systemId, b]))

  const orphans = mappings.filter((m) => {
    const b = byId.get(m.hrmBrandId)
    return !b || b.isDeleted === true
  })

  console.log(`Orphan: ${orphans.length}`)
  for (const m of orphans) {
    const b = byId.get(m.hrmBrandId)
    const reason = !b ? 'KHÔNG TỒN TẠI' : 'isDeleted=true'
    console.log(
      `  • [${m.pkgxBrandId}] "${m.pkgxBrandName}" → HRM "${m.hrmBrandName}" (${m.hrmBrandId.slice(0, 8)}…) — ${reason}`,
    )
  }

  if (EXECUTE && orphans.length > 0) {
    const ids = orphans.map((m) => m.systemId)
    const res = await prisma.pkgxBrandMapping.deleteMany({
      where: { systemId: { in: ids } },
    })
    console.log(`  ✓ ĐÃ XÓA ${res.count} orphan brand mapping`)
  }

  return orphans.length
}

async function scanCategoryMappings() {
  header('2) PkgxCategoryMapping — quét orphan')

  const mappings = await prisma.pkgxCategoryMapping.findMany({
    select: {
      systemId: true,
      hrmCategoryId: true,
      hrmCategoryName: true,
      pkgxCategoryId: true,
      pkgxCategoryName: true,
    },
  })
  console.log(`Tổng mapping: ${mappings.length}`)

  const hrmCategoryIds = Array.from(new Set(mappings.map((m) => m.hrmCategoryId)))
  const categories = await prisma.category.findMany({
    where: { systemId: { in: hrmCategoryIds } },
    select: { systemId: true, name: true, isDeleted: true },
  })
  const byId = new Map(categories.map((c) => [c.systemId, c]))

  const orphans = mappings.filter((m) => {
    const c = byId.get(m.hrmCategoryId)
    return !c || c.isDeleted === true
  })

  console.log(`Orphan: ${orphans.length}`)
  for (const m of orphans) {
    const c = byId.get(m.hrmCategoryId)
    const reason = !c ? 'KHÔNG TỒN TẠI' : 'isDeleted=true'
    console.log(
      `  • [${m.pkgxCategoryId}] "${m.pkgxCategoryName}" → HRM "${m.hrmCategoryName}" (${m.hrmCategoryId.slice(0, 8)}…) — ${reason}`,
    )
  }

  if (EXECUTE && orphans.length > 0) {
    const ids = orphans.map((m) => m.systemId)
    const res = await prisma.pkgxCategoryMapping.deleteMany({
      where: { systemId: { in: ids } },
    })
    console.log(`  ✓ ĐÃ XÓA ${res.count} orphan category mapping`)
  }

  return orphans.length
}

async function scanProductLinks() {
  header('3) PkgxProduct.hrmProductId — quét link trỏ vào product đã xóa')

  const linked = await prisma.pkgxProduct.findMany({
    where: { hrmProductId: { not: null } },
    select: { id: true, name: true, hrmProductId: true },
  })
  console.log(`Tổng PkgxProduct đang trỏ HRM: ${linked.length}`)

  const hrmIds = linked
    .map((p) => p.hrmProductId)
    .filter((id): id is string => !!id)
  const products = await prisma.product.findMany({
    where: { systemId: { in: hrmIds } },
    select: { systemId: true, name: true, isDeleted: true },
  })
  const byId = new Map(products.map((p) => [p.systemId, p]))

  const orphans = linked.filter((p) => {
    if (!p.hrmProductId) return false
    const hrm = byId.get(p.hrmProductId)
    return !hrm || hrm.isDeleted === true
  })

  console.log(`Orphan: ${orphans.length}`)
  for (const p of orphans) {
    const hrm = p.hrmProductId ? byId.get(p.hrmProductId) : undefined
    const reason = !hrm ? 'KHÔNG TỒN TẠI' : 'isDeleted=true'
    console.log(`  • PKGX#${p.id} "${p.name}" → HRM ${p.hrmProductId?.slice(0, 8)}… — ${reason}`)
  }

  if (EXECUTE && orphans.length > 0) {
    const ids = orphans.map((p) => p.id)
    const res = await prisma.pkgxProduct.updateMany({
      where: { id: { in: ids } },
      data: { hrmProductId: null },
    })
    console.log(`  ✓ ĐÃ BỎ LINK ${res.count} PkgxProduct (hrmProductId=null)`)
  }

  return orphans.length
}

async function main() {
  console.log(`\n🔍 PKGX Orphan Mapping Cleanup`)
  console.log(`Mode: ${EXECUTE ? '⚠️  EXECUTE (sẽ xóa thật)' : '👓 DRY-RUN (chỉ in, không xóa)'}`)

  const brandOrphans = await scanBrandMappings()
  const categoryOrphans = await scanCategoryMappings()
  const productOrphans = await scanProductLinks()

  header('Tổng kết')
  console.log(`  - Brand mapping orphan:    ${brandOrphans}`)
  console.log(`  - Category mapping orphan: ${categoryOrphans}`)
  console.log(`  - Product link orphan:     ${productOrphans}`)
  if (!EXECUTE && brandOrphans + categoryOrphans + productOrphans > 0) {
    console.log(`\n💡 Chạy lại với flag --execute để xóa thật.`)
  }
  console.log(`\n✨ Hoàn thành.`)
}

main()
  .catch((e) => {
    console.error('❌ Lỗi:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
