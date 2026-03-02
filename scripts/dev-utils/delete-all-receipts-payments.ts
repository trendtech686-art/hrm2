import 'dotenv/config';
import { prisma } from './lib/prisma.js';

async function deleteAllReceiptsAndPayments() {
  console.log('🗑️  Bắt đầu xóa tất cả phiếu thu và phiếu chi...\n');
  
  try {
    // Xóa tất cả OrderPayment (thanh toán đơn hàng)
    const deletedOrderPayments = await prisma.orderPayment.deleteMany({});
    console.log(`✅ Đã xóa ${deletedOrderPayments.count} thanh toán đơn hàng (OrderPayment)\n`);
    
    // Xóa tất cả Receipt (phiếu thu)
    const deletedReceipts = await prisma.receipt.deleteMany({});
    console.log(`✅ Đã xóa ${deletedReceipts.count} phiếu thu (Receipt)\n`);
    
    // Xóa tất cả Payment (phiếu chi)
    const deletedPayments = await prisma.payment.deleteMany({});
    console.log(`✅ Đã xóa ${deletedPayments.count} phiếu chi (Payment)\n`);
    
    // Reset paidAmount và paymentStatus của các đơn hàng
    const updatedOrders = await prisma.order.updateMany({
      data: {
        paidAmount: 0,
        paymentStatus: 'UNPAID',
      }
    });
    console.log(`✅ Đã reset ${updatedOrders.count} đơn hàng về trạng thái chưa thanh toán\n`);
    
    console.log('🎉 Hoàn thành! Tất cả phiếu thu/chi đã được xóa.');
    
  } catch (error) {
    console.error('❌ Lỗi khi xóa phiếu thu/chi:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllReceiptsAndPayments().catch(console.error);
