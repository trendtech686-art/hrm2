import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import 'dotenv/config';

let connectionString = process.env.DATABASE_URL || '';
connectionString = connectionString.replace(/^["']|["']$/g, '');
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function testUpdate() {
  try {
    // Test 1: Simple field update
    console.log('Test 1: Simple notes update...');
    const r1 = await prisma.order.update({
      where: { systemId: 'ORDER007716' },
      data: { notes: 'test ' + Date.now() },
      select: { systemId: true, notes: true, status: true },
    });
    console.log('Test 1 OK:', JSON.stringify(r1));

    // Test 2: Update with status enum
    console.log('\nTest 2: Status enum update...');
    const r2 = await prisma.order.update({
      where: { systemId: 'ORDER007716' },
      data: { status: r1.status }, // same status
      select: { systemId: true, status: true },
    });
    console.log('Test 2 OK:', JSON.stringify(r2));

    // Test 3: Update invoiceInfo as JSON
    console.log('\nTest 3: JSON invoiceInfo update...');
    const r3 = await prisma.order.update({
      where: { systemId: 'ORDER007716' },
      data: {
        invoiceInfo: {
          company: 'Nông Ngọc Sơn',
          taxId: '004088008557',
          address: '34 Phan Bội Châu, Phường Buôn Ma Thuột, Tỉnh Đắk Lắk',
        },
      },
      select: { systemId: true, invoiceInfo: true },
    });
    console.log('Test 3 OK:', JSON.stringify(r3));

    // Test 4: Simulate the full update with typical fields
    console.log('\nTest 4: Multi-field update (simulating full save)...');
    const current = await prisma.order.findUnique({
      where: { systemId: 'ORDER007716' },
      select: {
        id: true, customerId: true, customerName: true,
        branchId: true, branchName: true, salespersonId: true, salespersonName: true,
        status: true, paymentStatus: true, deliveryStatus: true, deliveryMethod: true,
        subtotal: true, shippingFee: true, tax: true, discount: true, grandTotal: true,
        paidAmount: true, codAmount: true, printStatus: true, stockOutStatus: true, returnStatus: true,
        tags: true, source: true, notes: true, orderDate: true,
        shippingAddress: true, billingAddress: true, invoiceInfo: true,
      },
    });
    if (!current) { console.log('Order not found'); return; }
    
    // Now update with exactly the same values (should be no-op)
    const r4 = await prisma.order.update({
      where: { systemId: 'ORDER007716' },
      data: {
        id: current.id,
        customerId: current.customerId,
        customerName: current.customerName,
        branchId: current.branchId,
        branchName: current.branchName,
        salespersonId: current.salespersonId,
        salespersonName: current.salespersonName,
        status: current.status,
        paymentStatus: current.paymentStatus,
        deliveryStatus: current.deliveryStatus,
        deliveryMethod: current.deliveryMethod,
        subtotal: current.subtotal,
        shippingFee: current.shippingFee,
        tax: current.tax,
        discount: current.discount,
        grandTotal: current.grandTotal,
        paidAmount: current.paidAmount,
        codAmount: current.codAmount,
        printStatus: current.printStatus,
        stockOutStatus: current.stockOutStatus,
        returnStatus: current.returnStatus,
        tags: current.tags,
        source: current.source,
        notes: current.notes,
        orderDate: current.orderDate,
        shippingAddress: current.shippingAddress as object,
        billingAddress: current.billingAddress as object,
        invoiceInfo: current.invoiceInfo as object,
      },
      select: { systemId: true, id: true },
    });
    console.log('Test 4 OK:', JSON.stringify(r4));

  // Find order DH000003
  const order3 = await prisma.order.findFirst({
    where: { id: 'DH000003' },
    select: { systemId: true, id: true, status: true },
  });
  console.log('DH000003:', JSON.stringify(order3));

  // Test 5: Simulate EXACTLY what the PATCH handler does
  console.log('\nTest 5: Simulate PATCH handler with full body...');
  const fullOrder = await prisma.order.findUnique({
    where: { systemId: 'ORDER007717' },
    include: { customer: true, lineItems: { include: { product: true } }, payments: true },
  });
  if (!fullOrder) { console.log('ORDER007717 not found'); return; }

  // Simulate the merged data the frontend sends
  const body: Record<string, unknown> = {
    ...fullOrder,
    // Frontend field names
    customerSystemId: fullOrder.customerId,
    branchSystemId: fullOrder.branchId,
    salespersonSystemId: fullOrder.salespersonId,
    salesperson: fullOrder.salespersonName,
    // Convert status to what convertOrderForApi would produce
    status: fullOrder.status, // Already enum value
    paymentStatus: fullOrder.paymentStatus,
    deliveryStatus: fullOrder.deliveryStatus,
    deliveryMethod: fullOrder.deliveryMethod,
    printStatus: fullOrder.printStatus,
    stockOutStatus: fullOrder.stockOutStatus,
    returnStatus: fullOrder.returnStatus,
    // JSON fields
    invoiceInfo: { company: 'Test', taxId: '123' },
    // Simulate createdAt from form
    createdAt: new Date().toISOString(),
    // Packagings (relation - should be filtered out)
    packagings: [],
  };

  // Extract payments and lineItems like PATCH handler
  const { payments: newPayments, lineItems: newLineItems, ...rest2 } = body;

  const ORDER_SCALAR_FIELDS = new Set([
    'id', 'customerId', 'customerName', 'branchId', 'branchName',
    'salespersonId', 'salespersonName', 'orderDate', 'expectedDeliveryDate',
    'approvedDate', 'completedDate', 'cancelledDate',
    'shippingAddress', 'billingAddress', 'invoiceInfo',
    'status', 'paymentStatus', 'deliveryStatus', 'deliveryMethod',
    'subtotal', 'shippingFee', 'tax', 'discount', 'discountType',
    'grandTotal', 'paidAmount', 'codAmount',
    'shippingCarrier', 'trackingCode', 'notes', 'cancellationReason',
    'tags', 'source', 'externalReference', 'createdBy', 'updatedBy',
    'assignedPackerId', 'assignedPackerName',
    'sourceSalesReturnId', 'linkedSalesReturnSystemId', 'linkedSalesReturnValue',
    'expectedPaymentMethod', 'referenceUrl', 'serviceFees',
    'printStatus', 'stockOutStatus', 'returnStatus',
    'cancellationMetadata', 'dispatchedDate', 'dispatchedByEmployeeId', 'dispatchedByEmployeeName',
    'orderDiscount', 'orderDiscountType', 'orderDiscountReason',
    'voucherCode', 'voucherAmount', 'shippingInfo', 'subtasks',
  ]);

  const updateData: Record<string, unknown> = {};
  for (const key of Object.keys(rest2)) {
    if (ORDER_SCALAR_FIELDS.has(key)) {
      updateData[key] = rest2[key];
    }
  }
  console.log('updateData keys:', Object.keys(updateData).join(', '));
  console.log('updateData types:', Object.entries(updateData).map(([k,v]) => `${k}:${typeof v}(${v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v === 'object' ? 'obj' : String(v).substring(0,20)})`).join(', '));
  
  try {
    const r5 = await prisma.order.update({
      where: { systemId: 'ORDER007717' },
      data: updateData,
      select: { systemId: true, id: true, invoiceInfo: true },
    });
    console.log('Test 5 OK:', JSON.stringify(r5));
  } catch (e: any) {
    console.error('Test 5 FAILED:', e.message);
    console.error('Code:', e.code);
    console.error('Meta:', JSON.stringify(e.meta));
  }

  // Test 6: Simulate with JSON-serialized data (as API would receive)
  console.log('\nTest 6: JSON-serialized data (simulating API request)...');
  const jsonBody = JSON.parse(JSON.stringify(body)); // Dates → strings, Decimals → strings/numbers
  const { payments: p2, lineItems: li2, ...rest3 } = jsonBody;
  const updateData2: Record<string, unknown> = {};
  for (const key of Object.keys(rest3)) {
    if (ORDER_SCALAR_FIELDS.has(key)) {
      updateData2[key] = rest3[key];
    }
  }
  console.log('JSON types:', Object.entries(updateData2).filter(([,v]) => v !== null && v !== undefined).map(([k,v]) => `${k}:${typeof v}`).join(', '));
  
  try {
    const r6 = await prisma.order.update({
      where: { systemId: 'ORDER007717' },
      data: updateData2,
      select: { systemId: true, id: true },
    });
    console.log('Test 6 OK:', JSON.stringify(r6));
  } catch (e2: any) {
    console.error('Test 6 FAILED:', e2.message);
    console.error('Code:', e2.code);
  }

  // Test 7: Full transaction with lineItems deleteMany + createMany
  console.log('\nTest 7: Full transaction with lineItems...');
  const existingLineItems = fullOrder!.lineItems;
  console.log(`  Existing line items: ${existingLineItems.length}`);
  try {
    const r7 = await prisma.$transaction(async (tx) => {
      // Delete existing line items
      const deleted = await tx.orderLineItem.deleteMany({ where: { orderId: 'ORDER007717' } });
      console.log(`  Deleted ${deleted.count} line items`);
      
      // Re-create line items (simulate frontend data)
      const timestamp = Date.now().toString(36);
      const lineItemData = existingLineItems.map((li, idx) => ({
        systemId: crypto.randomUUID(),
        orderId: 'ORDER007717',
        productId: li.productId,
        productSku: li.productSku,
        productName: li.productName,
        quantity: li.quantity,
        unitPrice: li.unitPrice,
        discount: li.discount,
        discountType: li.discountType,
        tax: li.tax,
        taxId: li.taxId || undefined,
        total: li.total,
        note: li.note || undefined,
      }));
      console.log(`  Creating ${lineItemData.length} line items...`);
      await tx.orderLineItem.createMany({ data: lineItemData });
      console.log('  Created successfully');
      
      // Update order scalar data
      return tx.order.update({
        where: { systemId: 'ORDER007717' },
        data: { notes: 'Test 7 - full transaction ' + Date.now() },
        include: { lineItems: true },
      });
    });
    console.log(`Test 7 OK: ${r7.lineItems.length} line items`);
  } catch (e7: any) {
    console.error('Test 7 FAILED:', e7.message);
    console.error('Code:', e7.code);
    console.error('Meta:', JSON.stringify(e7.meta));
  }

  // Test 8: Simulate JSON-serialized line items (exact API format)
  console.log('\nTest 8: JSON-serialized line items (simulating exact API body)...');
  // Simulate what convertOrderForApi produces for lineItems
  const apiLineItems = existingLineItems.map(li => ({
    productSystemId: li.productId, // What frontend calls productSystemId
    productId: li.productSku, // What frontend calls productId (SKU)
    productName: li.productName,
    quantity: li.quantity,
    unitPrice: Number(li.unitPrice),
    discount: Number(li.discount),
    discountType: li.discountType, // Prisma enum string
    tax: Number(li.tax),
    taxId: li.taxId || '',
    note: li.note || undefined,
    // NOTE: NO systemId, NO total - just like frontend sends
  }));
  // JSON-serialize like the actual HTTP request
  const jsonLineItems = JSON.parse(JSON.stringify(apiLineItems)) as Record<string, unknown>[];
  console.log(`  JSON line items: ${jsonLineItems.length}`);
  console.log(`  Sample: ${JSON.stringify(jsonLineItems[0]).substring(0, 200)}`);
  
  try {
    const r8 = await prisma.$transaction(async (tx) => {
      await tx.orderLineItem.deleteMany({ where: { orderId: 'ORDER007717' } });
      const ts = Date.now().toString(36);
      await tx.orderLineItem.createMany({
        data: jsonLineItems.map((li, idx) => ({
          systemId: crypto.randomUUID(),
          orderId: 'ORDER007717',
          productId: (li.productSystemId || null) as string | null,
          productSku: ((li.productId || '') as string).trim().toUpperCase(),
          productName: (li.productName || '') as string,
          quantity: Number(li.quantity) || 1,
          unitPrice: Number(li.unitPrice) || 0,
          discount: Number(li.discount) || 0,
          discountType: li.discountType === 'PERCENTAGE' ? 'PERCENTAGE'
            : li.discountType === 'FIXED' ? 'FIXED'
            : undefined,
          tax: Number(li.tax) || 0,
          taxId: (li.taxId as string) || undefined,
          total: Number(li.total) || 0,
          note: (li.note as string) || undefined,
        })),
      });
      
      return tx.order.update({
        where: { systemId: 'ORDER007717' },
        data: updateData2, // Same scalar data as Test 6
        include: { lineItems: { select: { systemId: true, productName: true, total: true } } },
      });
    });
    console.log(`Test 8 OK: ${r8.lineItems.length} line items`);
    r8.lineItems.forEach(li => console.log(`  - ${li.productName}: total=${li.total}`));
  } catch (e8: any) {
    console.error('Test 8 FAILED:', e8.message);
    console.error('Code:', e8.code);
    console.error('Meta:', JSON.stringify(e8.meta));
  }

  // Test 9: Verify specific decimal string values are accepted
  console.log('\nTest 9: Decimal string values...');
  try {
    const r9 = await prisma.order.update({
      where: { systemId: 'ORDER007717' },
      data: {
        voucherAmount: '0.00' as unknown as number, // Simulating JSON-serialized Decimal
        orderDiscount: '0.00' as unknown as number,
        linkedSalesReturnValue: null,
      },
      select: { systemId: true, voucherAmount: true, orderDiscount: true },
    });
    console.log('Test 9 OK:', JSON.stringify(r9));
  } catch (e9: any) {
    console.error('Test 9 FAILED:', e9.message);
  }

  } catch (e: any) {
    console.error('FAILED:', e.message);
    console.error('Code:', e.code);
    console.error('Meta:', JSON.stringify(e.meta));
  } finally {
    await prisma.$disconnect();
  }
}

testUpdate();
