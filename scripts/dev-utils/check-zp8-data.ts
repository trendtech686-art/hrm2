import 'dotenv/config';
import { prisma } from './lib/prisma';

async function main() {
  const product = await prisma.product.findFirst({
    where: { id: 'ZP8' },
    select: {
      systemId: true,
      id: true,
      costPrice: true,
      lastPurchasePrice: true,
      lastPurchaseDate: true,
    },
  });
  console.log('Product ZP8:', JSON.stringify(product, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2));

  // Find recent purchase orders
  const orders = await prisma.purchaseOrder.findMany({
    orderBy: { createdAt: 'desc' },
    take: 3,
    select: {
      id: true,
      subtotal: true,
      shippingFee: true,
      tax: true,
      grandTotal: true,
      status: true,
      deliveryStatus: true,
      createdAt: true,
    }
  });
  console.log('\\nRecent POs:', JSON.stringify(orders, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2));

  // Find inventory for ZP8
  const inventory = await prisma.productInventory.findFirst({
    where: { 
      product: { id: 'ZP8' }
    },
    select: {
      productId: true,
      branchId: true,
      onHand: true,
    }
  });
  console.log('\\nInventory:', JSON.stringify(inventory, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2));

  // Find recent stock history to see what cost was recorded
  const stockHistory = await prisma.stockHistory.findMany({
    where: {
      product: { id: 'ZP8' }
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
    select: {
      systemId: true,
      action: true,
      quantityChange: true,
      newStockLevel: true,
      note: true,
      createdAt: true,
    }
  });
  console.log('\\nRecent Stock History:', JSON.stringify(stockHistory, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2));
}

main()
  .catch((e) => {
    console.error(e);
  });
