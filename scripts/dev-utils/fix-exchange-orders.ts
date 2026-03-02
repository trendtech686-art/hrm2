/**
 * Script to fix old sales returns that have exchangeItems but no exchangeOrderSystemId
 * This creates proper exchange orders for them
 */
import { prisma } from './lib/prisma';
import { generateNextIdsWithTx, type EntityType } from './lib/id-generator-prisma';
import { v4 as uuidv4 } from 'uuid';

async function fixSalesReturnsExchangeOrders() {
  console.log('Finding sales returns with exchange items but no exchange order...');
  
  // Find all sales returns that have exchangeItems but no exchangeOrderSystemId
  const salesReturns = await prisma.salesReturn.findMany({
    where: {
      exchangeOrderSystemId: null,
      // Check if exchangeItems has data
    },
    include: {
      order: {
        include: {
          packagings: true,
        }
      }
    }
  });
  
  // Filter to only those with actual exchange items
  const needsFix = salesReturns.filter(sr => {
    const items = sr.exchangeItems as any[];
    return items && items.length > 0;
  });
  
  console.log(`Found ${needsFix.length} sales returns that need fixing`);
  
  for (const salesReturn of needsFix) {
    const exchangeItems = salesReturn.exchangeItems as any[];
    const order = salesReturn.order;
    
    if (!order) {
      console.log(`❌ SalesReturn ${salesReturn.id}: No order found, skipping`);
      continue;
    }
    
    console.log(`\n=== Processing ${salesReturn.id} ===`);
    console.log(`- Exchange items: ${exchangeItems.length}`);
    console.log(`- Original order: ${order.id}`);
    
    try {
      const result = await prisma.$transaction(async (tx) => {
        // Generate IDs
        const { systemId: orderSystemId, businessId: orderBusinessId } = await generateNextIdsWithTx(tx, 'orders' as EntityType);
        const { systemId: pkgSystemId, businessId: pkgBusinessId } = await generateNextIdsWithTx(tx, 'packagings' as EntityType);
        
        // Calculate subtotal
        const exchangeSubtotal = exchangeItems.reduce((sum, item) => {
          return sum + (item.unitPrice || 0) * (item.quantity || 1);
        }, 0);
        
        // Create exchange order
        const trackingCode = `INSTORE-${pkgBusinessId}`;
        
        const newOrder = await tx.order.create({
          data: {
            systemId: orderSystemId,
            id: orderBusinessId,
            customerId: order.customerId,
            customerName: order.customerName || '',
            branchId: salesReturn.branchSystemId || order.branchId,
            branchName: order.branchName || '',
            salespersonId: salesReturn.creatorSystemId || '',
            salespersonName: salesReturn.creatorName || 'System',
            status: 'Hoàn thành',
            paymentStatus: 'Đã thanh toán',
            subtotal: exchangeSubtotal,
            tax: 0,
            discount: 0,
            grandTotal: exchangeSubtotal,
            paidAmount: exchangeSubtotal,
            orderDate: salesReturn.returnDate || new Date(),
            source: 'exchange',
            notes: `Đơn đổi hàng từ phiếu trả ${salesReturn.id} (Đơn gốc: ${order.id})`,
            createdBy: salesReturn.creatorSystemId,
            linkedSalesReturnSystemId: salesReturn.systemId,
            // Line items
            lineItems: {
              create: exchangeItems.map((item: any) => ({
                systemId: uuidv4(),
                productId: item.productSystemId,
                productSku: item.productId || item.productSystemId,
                productName: item.productName || '',
                quantity: item.quantity || 1,
                unitPrice: item.unitPrice || 0,
                discount: item.discount || 0,
                discountType: item.discountType === 'percentage' ? 'PERCENTAGE' : 'FIXED',
                tax: 0,
                total: (item.unitPrice || 0) * (item.quantity || 1),
              })),
            },
            // Packaging
            packagings: {
              create: {
                systemId: pkgSystemId,
                id: pkgBusinessId,
                branchId: salesReturn.branchSystemId || order.branchId,
                requestDate: salesReturn.returnDate || new Date(),
                confirmDate: salesReturn.returnDate || new Date(),
                requestingEmployeeId: salesReturn.creatorSystemId || '',
                requestingEmployeeName: salesReturn.creatorName || 'System',
                confirmingEmployeeId: salesReturn.creatorSystemId || '',
                confirmingEmployeeName: salesReturn.creatorName || 'System',
                status: 'CONFIRMED',
                deliveryStatus: 'DELIVERED',
                deliveryMethod: 'IN_STORE_PICKUP',
                trackingCode: trackingCode,
                printStatus: 'NOT_PRINTED',
                createdBy: salesReturn.creatorName || 'System',
                notes: `Đổi hàng từ phiếu trả ${salesReturn.id}`,
              },
            },
          },
          include: {
            packagings: true,
          },
        });
        
        // Update sales return
        await tx.salesReturn.update({
          where: { systemId: salesReturn.systemId },
          data: {
            exchangeOrderSystemId: newOrder.systemId,
            deliveryMethod: 'pickup',
          },
        });
        
        return { order: newOrder, trackingCode };
      });
      
      console.log(`✅ Created exchange order ${result.order.id} with tracking ${result.trackingCode}`);
    } catch (err) {
      console.error(`❌ Failed to process ${salesReturn.id}:`, err);
    }
  }
  
  console.log('\n=== Done! ===');
}

fixSalesReturnsExchangeOrders().catch(console.error);
