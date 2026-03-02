// Debug script để kiểm tra CommittedStockDialog logic
import { prisma } from './lib/prisma';

async function main() {
  // Tìm order DH000063
  const order = await prisma.order.findFirst({
    where: { id: 'DH000063' },
    include: {
      lineItems: {
        include: {
          product: true,
        },
      },
      branch: true,
    },
  });

  if (!order) {
    console.log('Order DH000063 not found');
    return;
  }

  console.log('=== Order DH000063 ===');
  console.log('systemId:', order.systemId);
  console.log('branchId:', order.branchId);
  console.log('branch.systemId:', order.branch?.systemId);
  console.log('branch.id:', order.branch?.id);
  console.log('branch.name:', order.branch?.name);
  console.log('status:', order.status);
  console.log('stockOutStatus:', order.stockOutStatus);
  console.log('lineItems count:', order.lineItems.length);
  
  console.log('\n=== Line Items ===');
  for (const item of order.lineItems) {
    console.log(`- productId (systemId of product): ${item.productId}`);
    console.log(`  product.systemId: ${item.product?.systemId}`);
    console.log(`  product.id (SKU): ${item.product?.id}`);
    console.log(`  product.name: ${item.product?.name}`);
    console.log(`  quantity: ${item.quantity}`);
  }

  // Kiểm tra ProductInventory cho sản phẩm đầu tiên
  if (order.lineItems.length > 0 && order.lineItems[0].productId) {
    const firstItem = order.lineItems[0];
    const inventory = await prisma.productInventory.findFirst({
      where: {
        productId: firstItem.productId,  // Use productId, not productSystemId
        branchId: order.branchId,         // Use branchId, not branchSystemId
      },
    });
    console.log('\n=== ProductInventory ===');
    if (inventory) {
      console.log('found:', true);
      console.log('productId:', inventory.productId);
      console.log('branchId:', inventory.branchId);
      console.log('onHand:', inventory.onHand);
      console.log('committed:', inventory.committed);
    } else {
      console.log('No ProductInventory found for:');
      console.log('  productId:', firstItem.productId);
      console.log('  branchId:', order.branchId);
    }
  }

  // Kiểm tra CommittedStockDialog filter logic
  console.log('\n=== Filter Check ===');
  console.log('status === CANCELLED:', order.status === 'CANCELLED');
  console.log('status === Đã hủy:', order.status === 'Đã hủy');
  console.log('status === COMPLETED:', order.status === 'COMPLETED');
  console.log('status === Hoàn thành:', order.status === 'Hoàn thành');
  console.log('stockOutStatus:', order.stockOutStatus);
  console.log('stockOutStatus === FULLY_DISPATCHED:', order.stockOutStatus === 'FULLY_DISPATCHED');
  
  const cancelledStatuses = ['CANCELLED', 'Đã hủy'];
  const completedStatuses = ['COMPLETED', 'DELIVERED', 'Hoàn thành'];
  const dispatchedStockOutStatuses = ['FULLY_DISPATCHED', 'Xuất kho toàn bộ'];
  
  const shouldInclude = 
    !cancelledStatuses.includes(order.status) && 
    !completedStatuses.includes(order.status) &&
    !dispatchedStockOutStatuses.includes(order.stockOutStatus || '');
    
  console.log('\nShould be included:', shouldInclude);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
