import 'dotenv/config';
import { prisma } from './lib/prisma.js';

async function deleteAllPayments() {
  console.log('🗑️  Bắt đầu xóa tất cả phiếu chi (payments)...\n');
  
  try {
    // Xóa tất cả payments
    const deletedPayments = await prisma.payment.deleteMany({});
    console.log(`✅ Đã xóa ${deletedPayments.count} phiếu chi\n`);
    
    console.log('🎉 Hoàn thành! Tất cả phiếu chi đã được xóa.');
    
  } catch (error) {
    console.error('❌ Lỗi khi xóa phiếu chi:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllPayments().catch(console.error);
