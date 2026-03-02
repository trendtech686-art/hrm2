import 'dotenv/config';
import { prisma } from './lib/prisma';

/**
 * Script to delete "Đặt hàng" stock history records
 * These should not be recorded as per business requirement
 * "Giữ" (committed) only affects "Có thể bán", not actual stock level
 */
async function main() {
  console.log('Deleting "Đặt hàng" stock history records...');
  
  const result = await prisma.stockHistory.deleteMany({
    where: {
      action: 'Đặt hàng',
    },
  });
  
  console.log(`Deleted ${result.count} "Đặt hàng" records`);
  
  // Verify
  const remaining = await prisma.stockHistory.count({
    where: {
      action: 'Đặt hàng',
    },
  });
  
  console.log(`Remaining "Đặt hàng" records: ${remaining}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
