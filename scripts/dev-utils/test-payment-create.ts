import 'dotenv/config';
import { prisma } from './lib/prisma.js';

async function testPayment() {
  try {
    console.log('Testing payment creation...');
    
    const payment = await prisma.payment.create({
      data: {
        systemId: 'PAYMENT000001',
        id: 'PC000001',
        branchId: 'BRANCH-001',
        type: 'EMPLOYEE_PAYMENT',
        amount: 1000000,
        status: 'completed',
        branchSystemId: 'BRANCH-001',
        branchName: 'Chi nhánh chính',
        recipientTypeSystemId: 'NHANVIEN',
        recipientTypeName: 'Nhân viên',
        recipientName: 'Test Employee',
        description: 'Chi lương tháng 12/2025 - Test Employee',
        paymentMethodSystemId: 'CHUYENKHOAN',
        paymentMethodName: 'Chuyển khoản',
        paymentReceiptTypeSystemId: 'CHILUONG',
        paymentReceiptTypeName: 'Chi lương',
        category: 'salary',
        affectsDebt: false,
      }
    });
    
    console.log('✅ Created payment:', payment.systemId, payment.id);
    
    // Cleanup
    await prisma.payment.delete({ where: { systemId: 'PAYMENT000001' } });
    console.log('✅ Deleted test payment');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPayment();
