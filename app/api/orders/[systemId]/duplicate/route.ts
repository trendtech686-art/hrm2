import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';
import { generateNextIdsWithTx } from '@/lib/id-system';
import { orderErrors, orderSuccess } from '@/lib/constants/order-error-messages';
import type { EntityType } from '@/lib/id-config-constants';

interface RouteParams {
  params: Promise<{ systemId: string }>;
}

type TransactionClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

/**
 * POST /api/orders/[systemId]/duplicate
 * 
 * Sao chép đơn hàng - tạo đơn hàng mới từ đơn hàng hiện có
 * 
 * Features:
 * - Copy tất cả line items
 * - Reset status về PENDING
 * - Reset payment status về UNPAID
 * - Set orderDate = now()
 * - Không copy packagings, payments, shipments
 */
export async function POST(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError(orderErrors.UNAUTHORIZED, 401);

  try {
    const { systemId } = await params;
    
    // Parse optional body
    let body: { notes?: string; preserveNotes?: boolean } = {};
    try {
      body = await request.json();
    } catch {
      // No body provided, use defaults
    }

    // Get original order with line items
    const originalOrder = await prisma.order.findUnique({
      where: { systemId },
      include: {
        lineItems: true,
        customer: {
          select: { systemId: true, name: true },
        },
        branch: {
          select: { systemId: true, name: true },
        },
      },
    });

    if (!originalOrder) {
      return apiNotFound(orderErrors.ORDER_NOT_FOUND);
    }

    // Create duplicated order in transaction
    const newOrder = await prisma.$transaction(async (tx: TransactionClient) => {
      // Generate new IDs
      const orderIds = await generateNextIdsWithTx(tx, 'orders' as EntityType);
      const { businessId, systemId: newSystemId, counter: orderNum } = orderIds;

      // Create new line items data
      const lineItemsData = originalOrder.lineItems.map((item, index) => ({
        systemId: `OLI${String(orderNum).padStart(6, '0')}-${String(index + 1).padStart(3, '0')}`,
        productId: item.productId,
        productSku: item.productSku,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
        discountType: item.discountType,
        tax: item.tax,
        total: item.total,
        note: item.note,
      }));

      // Prepare notes
      const notes = body.preserveNotes 
        ? originalOrder.notes 
        : body.notes || `Sao chép từ đơn hàng ${originalOrder.id}`;

      // Create new order
      const duplicatedOrder = await tx.order.create({
        data: {
          systemId: newSystemId as string,
          id: businessId as string,
          
          // Customer & Branch - copy from original
          customerId: originalOrder.customerId,
          customerName: originalOrder.customerName,
          branchId: originalOrder.branchId,
          branchName: originalOrder.branchName,
          salespersonId: originalOrder.salespersonId,
          salespersonName: originalOrder.salespersonName,
          
          // Dates - reset
          orderDate: new Date(),
          expectedDeliveryDate: null,
          approvedDate: null,
          completedDate: null,
          cancelledDate: null,
          dispatchedDate: null,
          
          // Statuses - reset to initial
          status: 'PENDING',
          paymentStatus: 'UNPAID',
          deliveryStatus: 'PENDING_PACK',
          deliveryMethod: originalOrder.deliveryMethod,
          printStatus: 'NOT_PRINTED',
          stockOutStatus: 'NOT_STOCKED_OUT',
          returnStatus: 'NO_RETURN',
          
          // Addresses - copy
          shippingAddress: originalOrder.shippingAddress as object | undefined,
          billingAddress: originalOrder.billingAddress as object | undefined,
          
          // Financial - copy from original
          subtotal: originalOrder.subtotal,
          shippingFee: originalOrder.shippingFee,
          tax: originalOrder.tax,
          discount: originalOrder.discount,
          grandTotal: originalOrder.grandTotal,
          paidAmount: 0, // Reset payment
          codAmount: originalOrder.codAmount,
          
          // Discounts & Vouchers - copy
          orderDiscount: originalOrder.orderDiscount,
          orderDiscountType: originalOrder.orderDiscountType,
          orderDiscountReason: originalOrder.orderDiscountReason,
          voucherCode: null, // Reset voucher
          voucherAmount: null,
          
          // Other fields
          notes,
          source: originalOrder.source,
          tags: originalOrder.tags,
          expectedPaymentMethod: originalOrder.expectedPaymentMethod,
          referenceUrl: originalOrder.referenceUrl,
          externalReference: null, // Reset external reference
          
          // Metadata
          createdBy: session.user?.employee?.fullName || session.user?.name || 'System',
          
          // Line items
          lineItems: {
            create: lineItemsData,
          },
        },
        include: {
          customer: {
            select: { systemId: true, id: true, name: true },
          },
          branch: {
            select: { systemId: true, id: true, name: true },
          },
          lineItems: {
            include: {
              product: {
                select: { systemId: true, id: true, name: true, imageUrl: true },
              },
            },
          },
        },
      });

      return duplicatedOrder;
    });

    console.log(`[Orders API] Duplicated order ${originalOrder.id} -> ${newOrder.id}`);

    return apiSuccess({
      ...newOrder,
      message: orderSuccess.ORDER_CREATED,
      duplicatedFrom: originalOrder.id,
    }, 201);

  } catch (error) {
    console.error('Error duplicating order:', error);
    const message = error instanceof Error ? error.message : orderErrors.INTERNAL_ERROR;
    return apiError(message, 500);
  }
}
