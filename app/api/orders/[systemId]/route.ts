import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';
import type { Prisma, OrderPayment, OrderLineItem } from '@prisma/client';

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
                imageUrl: true,
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

    // Transform to match frontend Order type
    const transformedOrder = {
      ...order,
      // Map Prisma field names to frontend field names
      salespersonSystemId: order.salespersonId,
      salesperson: order.salespersonName,
      customerSystemId: order.customer?.systemId || null, // ✅ Use customer relation's systemId (UUID), not customerId (business ID)
      branchSystemId: order.branchId,
      // Transform lineItems to include productSystemId
      lineItems: order.lineItems.map(item => ({
        ...item,
        productSystemId: item.productId,
        unitPrice: Number(item.unitPrice),
        discount: Number(item.discount),
        tax: Number(item.tax),
        total: Number(item.total),
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
        return {
          ...pkg,
          status: statusMap[pkg.status] || pkg.status,
          deliveryStatus: pkg.deliveryStatus ? (deliveryStatusMap[pkg.deliveryStatus] || pkg.deliveryStatus) : undefined,
          deliveryMethod: pkg.deliveryMethod ? (deliveryMethodMap[pkg.deliveryMethod] || pkg.deliveryMethod) : undefined,
          shippingFeeToPartner: pkg.shippingFeeToPartner ? Number(pkg.shippingFeeToPartner) : undefined,
          codAmount: pkg.codAmount ? Number(pkg.codAmount) : undefined,
          weight: pkg.weight ? Number(pkg.weight) : undefined,
          // In-store pickup info
          requestorName: pkg.requestorName,
          requestorPhone: pkg.requestorPhone,
          requestorId: pkg.requestorId,
        };
      }),
    };

    return apiSuccess(transformedOrder);
  } catch (error) {
    console.error('Error fetching order:', error);
    return apiError('Failed to fetch order', 500);
  }
}

// PATCH /api/orders/[systemId] - Update order
export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    const body = await request.json();

    const order = await prisma.order.update({
      where: { systemId },
      data: body,
      include: {
        customer: true,
        lineItems: {
          include: { product: true },
        },
        payments: true,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return apiSuccess(serializeOrder(order as any));
  } catch (error) {
    console.error('Error updating order:', error);
    return apiError('Failed to update order', 500);
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

    await prisma.order.update({
      where: { systemId },
      data: { 
        status: 'CANCELLED',
        cancelledDate: new Date(),
        cancellationReason: 'Deleted by user',
      },
    });

    return apiSuccess({ success: true });
  } catch (error) {
    console.error('Error deleting order:', error);
    return apiError('Failed to delete order', 500);
  }
}
