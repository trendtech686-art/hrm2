/**
 * Script để đồng bộ công nợ khách hàng từ các giao dịch
 * 
 * Chạy: npx tsx sync-customer-debt.ts
 * 
 * Script này sẽ:
 * 1. Duyệt qua tất cả khách hàng có giao dịch
 * 2. Tính toán lại công nợ từ: đơn hàng + phiếu thu + phiếu chi + trả hàng
 * 3. Cập nhật field currentDebt trong database
 */

import 'dotenv/config';
import { prisma } from './lib/prisma';
import { syncAllCustomerDebts } from './lib/services/customer-debt-service';

async function main() {
  console.log('=== Bắt đầu đồng bộ công nợ khách hàng ===\n');

  try {
    const results = await syncAllCustomerDebts();

    console.log('\n=== Kết quả đồng bộ ===');
    console.log(`Tổng khách hàng được xử lý: ${results.total}`);
    console.log(`Thành công: ${results.updated}`);
    console.log(`Thất bại: ${results.errors.length}`);

    if (results.errors.length > 0) {
      console.log('\n=== Lỗi chi tiết ===');
      results.errors.forEach((error: string) => {
        console.log(`- ${error}`);
      });
    }

    // Hiển thị một số khách hàng có công nợ lớn nhất
    const topDebtors = await prisma.customer.findMany({
      where: {
        currentDebt: { gt: 0 },
      },
      orderBy: { currentDebt: 'desc' },
      take: 10,
      select: {
        systemId: true,
        id: true,
        name: true,
        currentDebt: true,
      },
    });

    if (topDebtors.length > 0) {
      console.log('\n=== Top 10 khách hàng có công nợ cao nhất ===');
      topDebtors.forEach((c, i) => {
        console.log(`${i + 1}. ${c.name || c.id} (${c.systemId}): ${Number(c.currentDebt).toLocaleString('vi-VN')} ₫`);
      });
    }

  } catch (error) {
    console.error('Lỗi khi đồng bộ công nợ:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
