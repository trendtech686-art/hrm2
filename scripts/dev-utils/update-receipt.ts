import { prisma } from './lib/prisma';

async function updateReceipt() {
  // Get order and branch info
  const order = await prisma.order.findUnique({
    where: { systemId: 'ORDER000005' },
    include: { 
      branch: { select: { systemId: true, name: true } },
      customer: { select: { systemId: true, name: true } }
    }
  });
  
  console.log('Order:', order?.id, 'Branch:', order?.branch?.name, 'Customer:', order?.customer?.name);
  
  // Update receipt with missing fields
  const updated = await prisma.receipt.update({
    where: { systemId: 'RECEIPT000001' },
    data: {
      payerTypeName: 'Khách hàng',
      payerTypeSystemId: 'CUSTOMER',
      paymentMethodName: 'Chuyển khoản NHL',
      paymentReceiptTypeName: 'Thu tiền bán hàng',
      paymentReceiptTypeSystemId: 'SALE',
      branchName: order?.branch?.name || 'Chi nhánh chính',
      branchSystemId: order?.branchId,
      linkedOrderSystemId: 'ORDER000005',
      originalDocumentId: order?.id,
      customerSystemId: order?.customerId,
      customerName: order?.customer?.name || order?.customerName,
    }
  });
  
  console.log('Updated receipt:', updated.systemId);
  console.log('payerTypeName:', updated.payerTypeName);
  console.log('paymentMethodName:', updated.paymentMethodName);
  console.log('paymentReceiptTypeName:', updated.paymentReceiptTypeName);
  console.log('branchName:', updated.branchName);
}

updateReceipt().catch(console.error).finally(() => prisma.$disconnect());
