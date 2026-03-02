/**
 * Script to unify stock history action names
 * Changes 'Xuất kho giao hàng' and 'Xuất kho khách nhận' to 'Xuất kho bán hàng'
 */

import { config } from 'dotenv';
// Load environment variables BEFORE importing prisma
config({ path: '.env' });

import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL not found');
}
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Unifying stock history action names...\n');

  // Count records before
  const beforeCount = await prisma.stockHistory.groupBy({
    by: ['action'],
    _count: true,
    where: {
      action: {
        in: ['Xuất kho giao hàng', 'Xuất kho khách nhận']
      }
    }
  });

  console.log('Records before update:');
  beforeCount.forEach(r => console.log(`  - ${r.action}: ${r._count}`));

  // Update 'Xuất kho giao hàng'
  const result1 = await prisma.stockHistory.updateMany({
    where: { action: 'Xuất kho giao hàng' },
    data: { action: 'Xuất kho bán hàng' }
  });
  console.log(`\nUpdated ${result1.count} records from 'Xuất kho giao hàng' to 'Xuất kho bán hàng'`);

  // Update 'Xuất kho khách nhận'
  const result2 = await prisma.stockHistory.updateMany({
    where: { action: 'Xuất kho khách nhận' },
    data: { action: 'Xuất kho bán hàng' }
  });
  console.log(`Updated ${result2.count} records from 'Xuất kho khách nhận' to 'Xuất kho bán hàng'`);

  // Verify
  const afterCount = await prisma.stockHistory.count({
    where: { action: 'Xuất kho bán hàng' }
  });
  console.log(`\nTotal 'Xuất kho bán hàng' records: ${afterCount}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
