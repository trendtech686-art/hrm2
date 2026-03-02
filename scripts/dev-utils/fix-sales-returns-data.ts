/**
 * Script để fix dữ liệu sales returns cũ
 * - Cập nhật finalAmount từ grandTotalNew - totalReturnValue
 * - Đảm bảo returnDate có giá trị
 */

import { prisma } from './lib/prisma';

async function fixSalesReturnsData() {
  console.log('🔧 Fixing sales returns data...\n');

  try {
    // 1. Lấy tất cả sales returns
    const salesReturns = await prisma.salesReturn.findMany({
      select: {
        systemId: true,
        id: true,
        returnDate: true,
        createdAt: true,
        totalReturnValue: true,
        grandTotalNew: true,
        finalAmount: true,
        refundAmount: true,
        refunded: true,
      },
    });

    console.log(`📋 Found ${salesReturns.length} sales returns\n`);

    let updatedCount = 0;

    for (const sr of salesReturns) {
      const updates: Record<string, unknown> = {};
      
      // 1. Fix returnDate nếu null
      if (!sr.returnDate && sr.createdAt) {
        updates.returnDate = sr.createdAt;
      }

      // 2. Tính và fix finalAmount
      const totalReturnValue = Number(sr.totalReturnValue) || 0;
      const grandTotalNew = Number(sr.grandTotalNew) || 0;
      const calculatedFinalAmount = grandTotalNew - totalReturnValue;
      const currentFinalAmount = Number(sr.finalAmount) || 0;

      if (currentFinalAmount !== calculatedFinalAmount) {
        updates.finalAmount = calculatedFinalAmount;
      }

      // 3. Update nếu có thay đổi
      if (Object.keys(updates).length > 0) {
        await prisma.salesReturn.update({
          where: { systemId: sr.systemId },
          data: updates,
        });
        
        console.log(`✅ Updated ${sr.id}:`, updates);
        updatedCount++;
      }
    }

    console.log(`\n🎉 Done! Updated ${updatedCount}/${salesReturns.length} sales returns`);

    // 4. Hiển thị dữ liệu sau khi update
    const updated = await prisma.salesReturn.findMany({
      select: {
        id: true,
        returnDate: true,
        totalReturnValue: true,
        grandTotalNew: true,
        finalAmount: true,
        refundAmount: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    console.log('\n📊 Latest 10 sales returns after fix:');
    console.table(updated.map(sr => ({
      id: sr.id,
      returnDate: sr.returnDate?.toISOString().split('T')[0] || 'null',
      returnValue: Number(sr.totalReturnValue),
      exchangeValue: Number(sr.grandTotalNew),
      finalAmount: Number(sr.finalAmount),
      refundAmount: Number(sr.refundAmount),
    })));

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixSalesReturnsData();
