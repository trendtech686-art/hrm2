import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';
import { createNotification } from '@/lib/notifications';
import type { Prisma, OrderPayment, OrderLineItem } from '@/generated/prisma/client';
import { PaymentStatus, DiscountType } from '@/generated/prisma/client';
import { logError } from '@/lib/logger'
import { getUserNameFromDb } from '@/lib/get-user-name'
import { syncSingleOrder } from '@/lib/meilisearch-sync'
import { updateCustomerDebt } from '@/lib/services/customer-debt-service'
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from '@/lib/constants/order-enums';
import {
  deliveryStatusLabels,
  stockOutStatusLabels,
  returnStatusLabels,
  printStatusLabels,
} from '@/lib/constants/order-status-labels';

// Type alias for compatibility
type LineItem = OrderLineItem;

// Helper type for lineItems with optional relations - use Record for flexibility
type LineItemWithRelations = Omit<LineItem, 'unitPrice' | 'discount' | 'tax' | 'total'> & { 
  product?: Record<string, unknown> | null;
  unitPrice?: Prisma.Decimal | number | null; 
  discount?: Prisma.Decimal | number | null; 
  tax?: Prisma.Decimal | number | null; 
  total?: Prisma.Decimal | number | null;
};

// Helper to serialize Decimal fields for client
function serializeOrder<T extends { 
  subtotal?: Prisma.Decimal | number | null;
  shippingFee?: Prisma.Decimal | number | null;
  tax?: Prisma.Decimal | number | null;
  discount?: Prisma.Decimal | number | null;
  grandTotal?: Prisma.Decimal | number | null;
  paidAmount?: Prisma.Decimal | number | null;
  codAmount?: Prisma.Decimal | number | null;
  linkedSalesReturnValue?: Prisma.Decimal | number | null;
  orderDiscount?: Prisma.Decimal | number | null;
  lineItems?: LineItemWithRelations[];
  payments?: OrderPayment[];
}>(order: T) {
  return {
    ...order,
    subtotal: order.subtotal !== null && order.subtotal !== undefined ? Number(order.subtotal) : 0,
    shippingFee: order.shippingFee !== null && order.shippingFee !== undefined ? Number(order.shippingFee) : 0,
    tax: order.tax !== null && order.tax !== undefined ? Number(order.tax) : 0,
    discount: order.discount !== null && order.discount !== undefined ? Number(order.discount) : 0,
    grandTotal: order.grandTotal !== null && order.grandTotal !== undefined ? Number(order.grandTotal) : 0,
    paidAmount: order.paidAmount !== null && order.paidAmount !== undefined ? Number(order.paidAmount) : 0,
    codAmount: order.codAmount !== null && order.codAmount !== undefined ? Number(order.codAmount) : 0,
    linkedSalesReturnValue: order.linkedSalesReturnValue !== null && order.linkedSalesReturnValue !== undefined ? Number(order.linkedSalesReturnValue) : null,
    orderDiscount: order.orderDiscount !== null && order.orderDiscount !== undefined ? Number(order.orderDiscount) : null,
    lineItems: order.lineItems?.map(item => ({
      ...item,
      unitPrice: item.unitPrice !== null && item.unitPrice !== undefined ? Number(item.unitPrice) : 0,
      discount: item.discount !== null && item.discount !== undefined ? Number(item.discount) : 0,
      tax: item.tax !== null && item.tax !== undefined ? Number(item.tax) : 0,
      total: item.total !== null && item.total !== undefined ? Number(item.total) : 0,
    })),
    payments: order.payments?.map(p => ({
      ...p,
      amount: Number(p.amount),
    })),
  };
}

interface RouteParams {
  params: Promise<{ systemId: string }>;
}

// GET /api/orders/[systemId] - Get single order
export async function GET(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;

    const order = await prisma.order.findUnique({
      where: { systemId },
      include: {
        customer: true,
        branch: true,
        lineItems: {
          include: {
            product: {
              select: {
                systemId: true,
                id: true,
                name: true,
                nameVat: true,
                imageUrl: true,
                costPrice: true,
                productTypeSystemId: true,
                type: true,
              },
            },
          },
        },
        payments: true,
        packagings: {
          include: {
            assignedEmployee: {
              select: {
                systemId: true,
                fullName: true,
              },
            },
            shipment: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) {
      return apiNotFound('Order');
    }

    // ✅ PERFORMANCE: Fetch warranties in parallel (merged into order API)
    // - Warranties: for warranty ID lookup in payment history (systemId → display id)
    // ✅ PERFORMANCE: Fetch pricing policy + sales channel in parallel (saves 2 API calls)
    const [warranties, defaultPricingPolicy, salesChannel] = await Promise.all([
      prisma.warranty.findMany({
        where: { orderId: systemId },
        select: { systemId: true, id: true },
      }),
      prisma.pricingPolicy.findFirst({
        where: { type: 'Bán hàng', isDefault: true },
        select: { name: true },
      }),
      order.source
        ? prisma.salesChannel.findFirst({
            where: { OR: [{ id: order.source }, { systemId: order.source }], isApplied: true },
            select: { name: true },
          })
        : Promise.resolve(null),
    ]);

    // Transform to match frontend Order type
    // ✅ UNIFIED: Same status/date transforms as list API (app/api/orders/route.ts)
    const transformedOrder = {
      ...order,
      // ✅ Transform status enums to Vietnamese (consistent with list API)
      status: ORDER_STATUS_LABELS[order.status] || order.status,
      paymentStatus: PAYMENT_STATUS_LABELS[order.paymentStatus] || order.paymentStatus,
      deliveryStatus: order.deliveryStatus ? (deliveryStatusLabels[order.deliveryStatus] || order.deliveryStatus) : undefined,
      stockOutStatus: order.stockOutStatus ? (stockOutStatusLabels[order.stockOutStatus] || order.stockOutStatus) : 'Chưa xuất kho',
      returnStatus: order.returnStatus ? (returnStatusLabels[order.returnStatus] || order.returnStatus) : 'Chưa trả hàng',
      printStatus: order.printStatus ? (printStatusLabels[order.printStatus] || order.printStatus) : 'Chưa in',
      // ✅ Transform dates to ISO strings (consistent with list API)
      orderDate: order.orderDate?.toISOString() || undefined,
      approvedDate: order.approvedDate?.toISOString() || undefined,
      dispatchedDate: order.dispatchedDate?.toISOString() || undefined,
      completedDate: order.completedDate?.toISOString() || undefined,
      cancelledDate: order.cancelledDate?.toISOString() || undefined,
      expectedDeliveryDate: order.expectedDeliveryDate?.toISOString() || undefined,
      createdAt: order.createdAt?.toISOString() || undefined,
      // Map Prisma field names to frontend field names
      salespersonSystemId: order.salespersonId,
      salesperson: order.salespersonName,
      customerSystemId: order.customer?.systemId || null, // ✅ Use customer relation's systemId (UUID), not customerId (business ID)
      branchSystemId: order.branchId,
      // Transform lineItems to include productSystemId
      lineItems: order.lineItems.map(item => ({
        ...item,
        productSystemId: item.productId, // DB productId = Product.systemId
        productId: item.productSku || item.product?.id || item.productId, // Business SKU for display
        unitPrice: Number(item.unitPrice),
        discount: Number(item.discount),
        tax: Number(item.tax),
        total: Number(item.total),
        product: item.product ? {
          ...item.product,
          costPrice: item.product.costPrice !== null && item.product.costPrice !== undefined ? Number(item.product.costPrice) : 0,
        } : undefined,
      })),
      // Transform numeric fields
      subtotal: Number(order.subtotal),
      shippingFee: Number(order.shippingFee),
      tax: Number(order.tax),
      discount: Number(order.discount),
      grandTotal: Number(order.grandTotal),
      paidAmount: Number(order.paidAmount),
      // ✅ Transform linked sales return value from Decimal to number
      linkedSalesReturnValue: order.linkedSalesReturnValue ? Number(order.linkedSalesReturnValue) : undefined,
      linkedSalesReturnSystemId: order.linkedSalesReturnSystemId || undefined,
      sourceSalesReturnId: order.sourceSalesReturnId || undefined,
      // Transform payments
      payments: order.payments.map(p => ({
        ...p,
        amount: Number(p.amount),
      })),
      // Transform packagings - convert Prisma enums to Vietnamese labels
      packagings: order.packagings.map(pkg => {
        // Map PackagingStatus: PENDING→Chờ đóng gói, IN_PROGRESS→Chờ đóng gói, COMPLETED→Đã đóng gói, CANCELLED→Hủy đóng gói
        const statusMap: Record<string, string> = {
          'PENDING': 'Chờ đóng gói',
          'IN_PROGRESS': 'Chờ đóng gói',
          'COMPLETED': 'Đã đóng gói',
          'CANCELLED': 'Hủy đóng gói',
        };
        // Map DeliveryStatus: PENDING_PACK→Chờ đóng gói, PACKED→Đã đóng gói, PENDING_SHIP→Chờ lấy hàng, SHIPPING→Đang giao hàng, DELIVERED→Đã giao hàng, RESCHEDULED→Chờ giao lại, CANCELLED→Đã hủy
        const deliveryStatusMap: Record<string, string> = {
          'PENDING_PACK': 'Chờ đóng gói',
          'PACKED': 'Đã đóng gói',
          'PENDING_SHIP': 'Chờ lấy hàng',
          'SHIPPING': 'Đang giao hàng',
          'DELIVERED': 'Đã giao hàng',
          'RESCHEDULED': 'Chờ giao lại',
          'CANCELLED': 'Đã hủy',
        };
        // Map DeliveryMethod: SHIPPING→Dịch vụ giao hàng, PICKUP→Lấy tại kho, IN_STORE_PICKUP→Nhận tại cửa hàng
        const deliveryMethodMap: Record<string, string> = {
          'SHIPPING': 'Dịch vụ giao hàng',
          'PICKUP': 'Lấy tại kho',
          'IN_STORE_PICKUP': 'Nhận tại cửa hàng',
        };
        // ✅ Resolve employee names from relation if denormalized field is missing
        const resolvedAssignedEmployeeName = pkg.assignedEmployeeName 
          || (pkg.assignedEmployee as { fullName?: string } | null)?.fullName 
          || undefined;
        return {
          ...pkg,
          assignedEmployeeName: resolvedAssignedEmployeeName,
          status: statusMap[pkg.status] || pkg.status,
          deliveryStatus: pkg.deliveryStatus ? (deliveryStatusMap[pkg.deliveryStatus] || pkg.deliveryStatus) : undefined,
          deliveryMethod: pkg.deliveryMethod ? (deliveryMethodMap[pkg.deliveryMethod] || pkg.deliveryMethod) : undefined,
          shippingFeeToPartner: pkg.shippingFeeToPartner ? Number(pkg.shippingFeeToPartner) : undefined,
          codAmount: pkg.codAmount ? Number(pkg.codAmount) : undefined,
          weight: pkg.weight ? Number(pkg.weight) : undefined,
          // ✅ Transform dates to ISO strings (consistent with list API)
          requestDate: pkg.requestDate?.toISOString() || undefined,
          confirmDate: pkg.confirmDate?.toISOString() || undefined,
          cancelDate: pkg.cancelDate?.toISOString() || undefined,
          deliveredDate: pkg.deliveredDate?.toISOString() || undefined,
          // In-store pickup info
          requestorName: pkg.requestorName,
          requestorPhone: pkg.requestorPhone,
          requestorId: pkg.requestorId,
        };
      }),
      // ✅ PERFORMANCE: Warranty ID map for payment history (saves /api/warranties call)
      _warranties: warranties.map(w => ({
        systemId: w.systemId,
        id: w.id,
      })),
      // ✅ PERFORMANCE: Resolved names (saves /api/settings/pricing-policies + /api/settings/sales-channels calls)
      _pricingPolicyName: defaultPricingPolicy?.name ?? null,
      _salesChannelName: salesChannel?.name ?? null,
    };

    return apiSuccess(transformedOrder);
  } catch (error) {
    logError('Error fetching order', error);
    return apiError('Failed to fetch order', 500);
  }
}

// Allowed scalar fields for Order.update (excludes relations, PK, and computed fields)
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

// PATCH /api/orders/[systemId] - Update order
export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  let step = 'init';
  let debugInfo = '';
  
  const appendDebug = (msg: string) => { debugInfo += msg + '\n'; };

  try {
    step = 'parse-params';
    const { systemId } = await params;
    appendDebug(`${new Date().toISOString()}\nsystemId: ${systemId}`);

    step = 'parse-body';
    const body = await request.json();
    const bodyKeys = Object.keys(body);
    appendDebug(`bodyKeys(${bodyKeys.length}): ${bodyKeys.join(', ')}`);

    step = 'extract-relations';
    // Extract relation fields from body
    const { payments: newPayments, lineItems: newLineItems, ...rest } = body;

    // ── Status-based edit restrictions ──────────────────────────────────
    // Check current order status to restrict which fields can be edited
    step = 'status-check';
    const currentOrder = await prisma.order.findUnique({
      where: { systemId },
      select: { status: true, deliveryStatus: true, stockOutStatus: true },
    });
    if (!currentOrder) return apiNotFound('Order not found');

    const orderStatus = currentOrder.status;

    // CANCELLED → no edits allowed
    if (orderStatus === 'CANCELLED') {
      return apiError('Không thể chỉnh sửa đơn hàng đã hủy', 400);
    }

    // Fields always allowed (metadata)
    const METADATA_FIELDS = new Set([
      'tags', 'notes', 'referenceUrl', 'externalReference',
      'expectedDeliveryDate', 'subtasks',
    ]);

    // Fields forbidden after CONFIRMED (locked at creation)
    const LOCKED_AFTER_CONFIRMED = new Set(['id', 'branchId', 'branchName']);

    // Post-packaging statuses: only metadata editable
    const POST_PACKAGING_STATUSES = new Set([
      'PACKING', 'PACKED', 'READY_FOR_PICKUP', 'SHIPPING',
      'DELIVERED', 'COMPLETED', 'FAILED_DELIVERY', 'RETURNED',
    ]);

    const isPostPackaging = POST_PACKAGING_STATUSES.has(orderStatus);

    // Internal status updates are always allowed (from system actions like cancel, dispatch, payment)
    const SYSTEM_STATUS_FIELDS = new Set([
      'status', 'paymentStatus', 'deliveryStatus', 'paidAmount',
      'printStatus', 'stockOutStatus', 'returnStatus',
      'assignedPackerId', 'assignedPackerName',
      'approvedDate', 'completedDate', 'cancelledDate', 'dispatchedDate',
      'dispatchedByEmployeeId', 'dispatchedByEmployeeName',
      'cancellationReason', 'cancellationMetadata',
      'trackingCode', 'shippingCarrier', 'shippingInfo',
      'linkedSalesReturnSystemId', 'linkedSalesReturnValue', 'sourceSalesReturnId',
    ]);

    step = 'filter-allowlist';
    // Only keep allowed scalar fields to prevent Prisma errors from relation objects
    const updateData: Record<string, unknown> = {};
    for (const key of Object.keys(rest)) {
      if (!ORDER_SCALAR_FIELDS.has(key)) continue;

      // System fields always pass through (internal action updates)
      if (SYSTEM_STATUS_FIELDS.has(key)) {
        updateData[key] = rest[key];
        continue;
      }

      // Post-packaging: only metadata fields
      if (isPostPackaging && !METADATA_FIELDS.has(key)) {
        continue; // Silently skip non-metadata fields
      }

      // CONFIRMED: block locked fields
      if (orderStatus === 'CONFIRMED' && LOCKED_AFTER_CONFIRMED.has(key)) {
        continue;
      }

      updateData[key] = rest[key];
    }

    // Post-packaging: block line item replacements
    if (isPostPackaging && Array.isArray(newLineItems) && newLineItems.length > 0) {
      appendDebug('BLOCKED: lineItems update in post-packaging status');
    }

    // Map frontend field names to Prisma schema field names
    if (updateData.customerId === undefined && rest.customerSystemId) {
      updateData.customerId = rest.customerSystemId;
    }
    if (updateData.branchId === undefined && rest.branchSystemId) {
      updateData.branchId = rest.branchSystemId;
    }
    if (updateData.salespersonId === undefined && rest.salespersonSystemId) {
      updateData.salespersonId = rest.salespersonSystemId;
    }
    if (rest.salesperson && !updateData.salespersonName) {
      updateData.salespersonName = rest.salesperson;
    }
    if (updateData.assignedPackerId === undefined && rest.assignedPackerSystemId) {
      updateData.assignedPackerId = rest.assignedPackerSystemId;
    }

    // Remove undefined values — Prisma handles nulls but undefined in some contexts can cause issues  
    for (const key of Object.keys(updateData)) {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    }

    // Coerce DateTime fields: Prisma requires full ISO-8601 (with timezone)
    // but the frontend may send truncated formats like "2026-03-23T17:57:03"
    const DATE_FIELDS = ['orderDate', 'expectedDeliveryDate', 'approvedDate', 'completedDate', 'cancelledDate', 'dispatchedDate'];
    for (const field of DATE_FIELDS) {
      if (updateData[field] != null && typeof updateData[field] === 'string') {
        updateData[field] = new Date(updateData[field] as string);
      }
    }

    appendDebug(`updateData keys(${Object.keys(updateData).length}): ${Object.keys(updateData).join(', ')}`);
    appendDebug(`updateData types: ${Object.entries(updateData).map(([k, v]) => `${k}:${v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v}`).join(', ')}`);
    appendDebug(`lineItems: ${Array.isArray(newLineItems) ? newLineItems.length : 'none'}, payments: ${Array.isArray(newPayments) ? newPayments.length : 'none'}`);

    // Fetch existing order to detect changes for notifications + activity log
    const existingOrder = await prisma.order.findUnique({
      where: { systemId },
      select: {
        id: true, salespersonId: true, assignedPackerId: true,
        customerId: true, customerName: true, branchId: true, branchName: true,
        salespersonName: true, assignedPackerName: true,
        status: true, paymentStatus: true, deliveryStatus: true, deliveryMethod: true,
        shippingAddress: true, billingAddress: true, invoiceInfo: true,
        notes: true, tags: true, shippingFee: true, discount: true, grandTotal: true,
        paidAmount: true, codAmount: true, subtotal: true, tax: true,
        expectedDeliveryDate: true, trackingCode: true,
        printStatus: true, stockOutStatus: true, returnStatus: true,
        orderDiscount: true, orderDiscountType: true, orderDiscountReason: true,
        voucherCode: true, voucherAmount: true, cancellationReason: true, source: true,
        expectedPaymentMethod: true, shippingInfo: true, serviceFees: true,
      },
    });

    step = 'transaction';
    const order = await prisma.$transaction(async (tx) => {
      // If new payments provided, create them as OrderPayment records
      if (Array.isArray(newPayments)) {
        step = 'payments';
        for (const payment of newPayments) {
          // Skip if this payment already exists
          if (payment.systemId) {
            const exists = await tx.orderPayment.findUnique({ where: { systemId: payment.systemId } });
            if (exists) continue;
          }
          await tx.orderPayment.create({
            data: {
              id: payment.id,
              orderId: systemId,
              date: payment.date ? new Date(payment.date) : new Date(),
              method: payment.method || 'N/A',
              amount: Math.abs(payment.amount), // Store as positive
              description: payment.description,
              createdBy: payment.createdBy || 'system',
              linkedWarrantySystemId: payment.linkedWarrantySystemId || undefined,
              linkedReceiptSystemId: payment.linkedReceiptSystemId || undefined,
            },
          });
        }
      }

      // If lineItems provided, replace all existing line items (blocked in post-packaging)
      if (Array.isArray(newLineItems) && newLineItems.length > 0 && !isPostPackaging) {
        step = 'lineItems-delete';
        await tx.orderLineItem.deleteMany({ where: { orderId: systemId } });
        step = 'lineItems-create';
        const timestamp = Date.now().toString(36);
        await tx.orderLineItem.createMany({
          data: newLineItems.map((li: Record<string, unknown>, idx: number) => ({
            systemId: (li.systemId as string) || `OLI-${timestamp}-${String(idx + 1).padStart(3, '0')}`,
            orderId: systemId,
            productId: (li.productSystemId || null) as string | null,
            productSku: ((li.productId || '') as string).trim(),
            productName: (li.productName || '') as string,
            quantity: Number(li.quantity) || 1,
            unitPrice: Number(li.unitPrice) || 0,
            discount: Number(li.discount) || 0,
            discountType: li.discountType === 'PERCENTAGE' || li.discountType === 'percentage'
              ? DiscountType.PERCENTAGE
              : li.discountType === 'FIXED' || li.discountType === 'fixed'
                ? DiscountType.FIXED
                : undefined,
            tax: Number(li.tax) || 0,
            taxId: (li.taxId as string) || undefined,
            total: Number(li.total) || 0,
            note: (li.note as string) || undefined,
          })),
        });
        appendDebug(`lineItems: deleted + created ${newLineItems.length}`);
      }

      // Update paidAmount and paymentStatus
      if (updateData.paidAmount !== undefined) {
        step = 'paidAmount-calc';
        const currentOrder = await tx.order.findUnique({ where: { systemId }, select: { grandTotal: true } });
        if (currentOrder) {
          const grandTotal = Number(currentOrder.grandTotal);
          const newPaid = Number(updateData.paidAmount);
          if (newPaid >= grandTotal) {
            updateData.paymentStatus = PaymentStatus.PAID;
          } else if (newPaid > 0) {
            updateData.paymentStatus = PaymentStatus.PARTIAL;
          }
        }
      }

      step = 'order-update';
      return tx.order.update({
        where: { systemId },
        data: updateData,
        include: {
          customer: true,
          lineItems: {
            include: { product: true },
          },
          payments: true,
        },
      });
    });

    step = 'serialize';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = serializeOrder(order as any);
    
    // Write success debug
    try {
      const fs = await import('fs');
      appendDebug(`SUCCESS at step: ${step}`);
      fs.writeFileSync('d:/hrm2/order-update-debug.txt', debugInfo);
    } catch { /* ignore */ }
    
    // ✅ Notify salesperson/packer on assignment changes
    if (existingOrder) {
      const newSalesperson = updateData.salespersonId as string | undefined
      if (newSalesperson && newSalesperson !== existingOrder.salespersonId && newSalesperson !== session.user?.employeeId) {
        createNotification({
          type: 'order',
          settingsKey: 'order:assigned',
          title: 'Giao đơn hàng',
          message: `Bạn được giao đơn hàng ${existingOrder.id || systemId}`,
          link: `/orders/${systemId}`,
          recipientId: newSalesperson,
          senderId: session.user?.employeeId,
          senderName: session.user?.name,
        }).catch(e => logError('[Orders PATCH] salesperson notification failed', e))
      }
      const newPacker = updateData.assignedPackerId as string | undefined
      if (newPacker && newPacker !== existingOrder.assignedPackerId && newPacker !== session.user?.employeeId) {
        createNotification({
          type: 'order',
          settingsKey: 'order:assigned',
          title: 'Đóng gói đơn hàng',
          message: `Bạn được giao đóng gói đơn hàng ${existingOrder.id || systemId}`,
          link: `/orders/${systemId}`,
          recipientId: newPacker,
          senderId: session.user?.employeeId,
          senderName: session.user?.name,
        }).catch(e => logError('[Orders PATCH] packer notification failed', e))
      }
    }

    // ✅ Log activity with descriptive changes — only fields that actually changed
    const fieldLabels: Record<string, string> = {
      status: 'Trạng thái', paymentStatus: 'Thanh toán', deliveryStatus: 'Giao hàng',
      deliveryMethod: 'Phương thức giao', customerName: 'Khách hàng', salespersonName: 'Nhân viên bán',
      shippingAddress: 'Địa chỉ giao', billingAddress: 'Địa chỉ thanh toán',
      invoiceInfo: 'Thông tin hóa đơn',
      notes: 'Ghi chú', tags: 'Tags', shippingFee: 'Phí vận chuyển',
      discount: 'Chiết khấu', grandTotal: 'Tổng tiền', paidAmount: 'Đã thanh toán',
      expectedDeliveryDate: 'Ngày giao dự kiến', shippingCarrier: 'Đơn vị vận chuyển',
      trackingCode: 'Mã vận đơn', assignedPackerName: 'NV đóng gói',
      printStatus: 'Trạng thái in', stockOutStatus: 'Xuất kho',
      orderDiscount: 'Giảm giá đơn', voucherCode: 'Mã voucher',
      cancellationReason: 'Lý do hủy', source: 'Nguồn đơn',
    };
    // Compare old vs new to find actually changed fields
    const actuallyChanged = existingOrder
      ? Object.keys(updateData).filter(key => {
          const oldVal = (existingOrder as Record<string, unknown>)[key];
          const newVal = updateData[key];
          // Normalize for comparison: JSON stringify handles objects/arrays/Decimals
          const oldStr = oldVal instanceof Date ? oldVal.toISOString()
            : (typeof oldVal === 'object' && oldVal !== null) ? JSON.stringify(oldVal)
            : String(oldVal ?? '');
          const newStr = newVal instanceof Date ? newVal.toISOString()
            : (typeof newVal === 'object' && newVal !== null) ? JSON.stringify(newVal)
            : String(newVal ?? '');
          return oldStr !== newStr;
        })
      : Object.keys(updateData);
    const changedLabels = actuallyChanged
      .map(k => fieldLabels[k])
      .filter(Boolean);
    const hasLineItems = Array.isArray(newLineItems) && newLineItems.length > 0;
    const hasPayments = Array.isArray(newPayments) && newPayments.length > 0;
    if (hasLineItems) changedLabels.push('Sản phẩm');
    if (hasPayments) changedLabels.push('Thanh toán');
    const changeDesc = changedLabels.length > 0
      ? changedLabels.join(', ')
      : 'thông tin đơn hàng';
    const userName = await getUserNameFromDb(session.user?.id);
    await prisma.activityLog.create({
      data: {
        entityType: 'order',
        entityId: systemId,
        action: 'updated',
        actionType: 'update',
        note: `Cập nhật ${changeDesc} - ${existingOrder?.id || systemId}`,
        metadata: { userName, orderId: existingOrder?.id, changedFields: actuallyChanged },
        createdBy: userName,
      }
    }).catch(e => logError('[Orders PATCH] activity log failed', e))

    // ✅ Dedicated log: status change
    if (existingOrder && updateData.status !== undefined && existingOrder.status !== updateData.status) {
      const newStatus = updateData.status as string;
      const oldStatus = existingOrder.status;
      const STATUS_LABELS: Record<string, string> = {
        PENDING: 'Đặt hàng',
        CONFIRMED: 'Đang giao dịch',
        PROCESSING: 'Đang giao dịch',
        PACKING: 'Đang giao dịch',
        PACKED: 'Đang giao dịch',
        READY_FOR_PICKUP: 'Đang giao dịch',
        SHIPPING: 'Đang giao dịch',
        DELIVERED: 'Đang giao dịch',
        COMPLETED: 'Hoàn thành',
        ARCHIVED: 'Đã lưu trữ',
        FAILED_DELIVERY: 'Đang giao dịch',
        RETURNED: 'Đang giao dịch',
        CANCELLED: 'Đã hủy',
      };
      const oldLabel = STATUS_LABELS[oldStatus] || oldStatus;
      const newLabel = STATUS_LABELS[newStatus] || newStatus;
      const orderId = existingOrder.id || systemId;

      await prisma.activityLog.create({
        data: {
          entityType: 'order',
          entityId: systemId,
          action: 'status_changed',
          actionType: 'update',
          note: `Đơn hàng ${orderId} chuyển trạng thái: ${oldLabel} → ${newLabel}`,
          metadata: {
            oldStatus,
            newStatus,
            orderId,
            oldLabel,
            newLabel,
          },
          createdBy: userName,
        }
      }).catch(e => logError('[Orders PATCH] status_changed activity log failed', e))
    }

    // Sync customer debt when order data changes (grandTotal, status, etc.)
    if (order.customerId) {
      updateCustomerDebt(order.customerId).catch(err => {
        logError('[Orders PATCH] updateCustomerDebt failed', err)
      })
    }

    // Fire-and-forget: sync to Meilisearch
    syncSingleOrder(systemId).catch(e => logError('[Meilisearch] Order update sync failed', e))

    return apiSuccess(result);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : '';
    logError(`Error updating order at step [${step}]`, error);
    // Write error debug
    try {
      const fs = await import('fs');
      appendDebug(`\nFAILED at step: ${step}\nERROR: ${detail}\nSTACK: ${stack}`);
      fs.writeFileSync('d:/hrm2/order-update-debug.txt', debugInfo);
    } catch { /* ignore */ }
    return apiError(`Failed to update order [${step}]: ${detail}`, 500);
  }
}

// PUT /api/orders/[systemId] - Update order (alias for PATCH)
export async function PUT(request: Request, { params }: RouteParams) {
  return PATCH(request, { params });
}

// DELETE /api/orders/[systemId] - Delete order (soft delete via status)
export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;

    // Fetch order to get customerId and orderId before cancelling
    const order = await prisma.order.findUnique({
      where: { systemId },
      select: { customerId: true, id: true },
    });

    const orderId = order?.id || systemId;

    await prisma.order.update({
      where: { systemId },
      data: { 
        status: 'CANCELLED',
        cancelledDate: new Date(),
        cancellationReason: 'Deleted by user',
      },
    });

    // Log activity after successful deletion
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'order',
          entityId: systemId,
          action: 'deleted',
          actionType: 'delete',
          note: `Xóa đơn hàng: ${orderId}`,
          metadata: { userName, orderId },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] order delete failed', e))

    // Sync customer debt after cancellation
    if (order?.customerId) {
      updateCustomerDebt(order.customerId).catch(err => {
        logError('[Orders DELETE] updateCustomerDebt failed', err)
      })
    }

    // Fire-and-forget: sync to Meilisearch (order cancelled)
    syncSingleOrder(systemId).catch(e => logError('[Meilisearch] Order delete sync failed', e))

    return apiSuccess({ success: true });
  } catch (error) {
    logError('Error deleting order', error);
    return apiError('Failed to delete order', 500);
  }
}
