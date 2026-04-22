/**
 * Một lần: chuyển bản ghi `settings_data` (type=storage-location) → `stock_locations`
 * giữ nguyên `systemId` để `product.storageLocationSystemId` vẫn hợp lệ.
 *
 *   npx tsx scripts/migrate-settings-storage-to-stock-locations.ts
 */
import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

const TYPE = 'storage-location'

async function main() {
  const defaultBranch =
    (await prisma.branch.findFirst({ where: { isDeleted: false, isDefault: true } })) ||
    (await prisma.branch.findFirst({ where: { isDeleted: false } }))
  if (!defaultBranch) {
    console.error('No branch in DB. Create a branch first.')
    process.exit(1)
  }

  const rows = await prisma.settingsData.findMany({
    where: { type: TYPE, isDeleted: false },
  })
  let migrated = 0
  for (const row of rows) {
    const exists = await prisma.stockLocation.findUnique({ where: { systemId: row.systemId } })
    if (exists) {
      await prisma.settingsData.delete({ where: { systemId: row.systemId } }).catch(() => {})
      continue
    }
    const meta = (row.metadata as { branchId?: string } | null) || {}
    let branch = defaultBranch
    if (meta.branchId) {
      const b = await prisma.branch.findFirst({
        where: { isDeleted: false, OR: [{ systemId: meta.branchId }, { id: meta.branchId }] },
      })
      if (b) branch = b
    }
    await prisma.stockLocation.create({
      data: {
        systemId: row.systemId,
        id: row.id,
        name: row.name,
        description: row.description,
        code: row.id,
        branchId: branch.id,
        branchSystemId: branch.systemId,
        isDefault: row.isDefault,
        isActive: row.isActive,
        createdBy: row.createdBy,
        updatedBy: row.updatedBy,
      },
    })
    await prisma.settingsData.delete({ where: { systemId: row.systemId } })
    migrated += 1
  }
  console.log(`Migrated ${migrated} storage-location rows. Remaining settings_data same type: (should be 0).`)
  const left = await prisma.settingsData.count({ where: { type: TYPE, isDeleted: false } })
  console.log('Left (non-deleted):', left)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
