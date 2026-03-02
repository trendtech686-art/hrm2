import 'dotenv/config';
import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function fixPurchaseOrderData() {
  // Get all purchase orders with missing denormalized data
  const orders = await prisma.purchaseOrder.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      supplier: true,
    },
  });

  console.log(`Found ${orders.length} purchase orders to check`);

  for (const order of orders) {
    const updates: Record<string, unknown> = {};
    
    // Fix supplierSystemId and supplierName if missing
    if (!order.supplierSystemId && order.supplierId) {
      updates.supplierSystemId = order.supplierId;
    }
    if (!order.supplierName && order.supplier?.name) {
      updates.supplierName = order.supplier.name;
    }
    
    // Fix deliveryStatus if missing
    if (!order.deliveryStatus) {
      updates.deliveryStatus = 'Chưa nhập';
    }
    
    // Fix paymentStatus if missing
    if (!order.paymentStatus) {
      updates.paymentStatus = 'Chưa thanh toán';
    }
    
    // Fix returnStatus if missing
    if (!order.returnStatus) {
      updates.returnStatus = 'Chưa hoàn trả';
    }
    
    // Fix refundStatus if missing
    if (!order.refundStatus) {
      updates.refundStatus = 'Chưa hoàn tiền';
    }
    
    // Fix grandTotal if missing
    if (!order.grandTotal || Number(order.grandTotal) === 0) {
      updates.grandTotal = order.total;
    }

    if (Object.keys(updates).length > 0) {
      console.log(`Updating order ${order.id} with:`, updates);
      await prisma.purchaseOrder.update({
        where: { systemId: order.systemId },
        data: updates,
      });
    }
  }

  console.log('Done fixing purchase order data');
  await prisma.$disconnect();
  process.exit(0);
}

fixPurchaseOrderData().catch(console.error);
