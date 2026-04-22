/**
 * Nhóm count theo settings_data.type (hỗ trợ rà trùng nguồn).
 *
 *   npx tsx scripts/audit-settings-data-types.ts
 */
import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  const groups = await prisma.settingsData.groupBy({
    by: ['type'],
    where: { isDeleted: false },
    _count: { _all: true },
  })
  const sorted = [...groups].sort((a, b) => a.type.localeCompare(b.type))
  console.log('settings_data (isDeleted=false) by type:')
  for (const g of sorted) {
    console.log(`  ${g.type}: ${g._count._all}`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
