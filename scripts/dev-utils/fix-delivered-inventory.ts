import 'dotenv/config';
import { prisma } from './lib/prisma';

/**
 * Script sửa dữ liệu tồn kho cho các đơn hàng đã giao nhưng committed chưa được trừ
 */
async function fixInventory() {
  console.log('🔍 Tìm các đơn hàng đã giao với committed chưa trừ...\n');
  
  // Tìm tất cả packaging đã DELIVERED
  const deliveredPackagings = await prisma.packaging.findMany({
    where: { 
      deliveryStatus: 'DELIVERED',
      // Hoặc có shipment với status DELIVERED
      OR: [
        { deliveryMethod: 'PICKUP' },
        { shipment: { status: 'DELIVERED' } }
      ]
    },
    include: {
      order: {
        include: {
          lineItems: true,
          branch: true
        }
      },
      shipment: true
    }
  });

  console.log(`📦 Tìm thấy ${deliveredPackagings.length} packaging đã giao\n`);

  for (const pkg of deliveredPackagings) {
    const order = pkg.order;
    if (!order) continue;
    
    console.log(`\n📋 Đơn ${order.id} (${order.systemId}) - ${pkg.deliveryMethod || 'SHIPPING'}`);
    
    for (const item of order.lineItems) {
      if (!item.productId) continue;
      
      const inv = await prisma.productInventory.findUnique({
        where: { productId_branchId: { productId: item.productId, branchId: order.branchId } }
      });
      
      if (!inv) {
        console.log(`  ⚠️ ${item.productId}: Không có ProductInventory`);
        continue;
      }
      
      // Nếu committed > 0, cần trừ đi
      if (inv.committed > 0) {
        const newCommitted = Math.max(0, inv.committed - item.quantity);
        console.log(`  🔧 ${item.productId}: committed ${inv.committed} -> ${newCommitted} (trừ ${item.quantity})`);
        
        await prisma.productInventory.update({
          where: { productId_branchId: { productId: item.productId, branchId: order.branchId } },
          data: { committed: newCommitted }
        });
      } else {
        console.log(`  ✅ ${item.productId}: committed = ${inv.committed} (OK)`);
      }
    }
  }
  
  console.log('\n✅ Hoàn tất fix inventory!');
  await prisma.$disconnect();
}

fixInventory().catch(console.error);
