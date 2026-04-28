import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { generateNextIdsWithTx } from '@/lib/id-system'
import { resolveDefaultCashAccountSystemId } from '@/lib/finance/resolve-default-cash-account'
import { SalesReturnStatus, DeliveryStatus, OrderStatus, StockOutStatus, PaymentStatus } from '@/generated/prisma/client'
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { createActivityLog } from '@/lib/services/activity-log-service'

interface RouteParams {
  params: Promise<{ systemId: string }>;
}

// GET /api/orders/[systemId]/payments - List payments for order
export async function GET(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params;

    const payments = await prisma.orderPayment.findMany({
      where: { orderId: systemId },
      orderBy: { createdAt: 'desc' },
    });

    // Serialize for client (convert Decimal to number)
    const serialized = payments.map(p => ({
      ...p,
      amount: Number(p.amount),
    }));

    return apiSuccess(serialized);
  } catch (error) {
    logError('Error fetching payments', error);
    return apiError('Failed to fetch payments', 500);
  }
}

// POST /api/orders/[systemId]/payments - Add payment to order
export async function POST(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    const body = await request.json();
    const { amount, paymentMethodId, note, employeeSystemId } = body;

    // Validate amount
    if (!amount || amount <= 0) {
      return apiError('Invalid payment amount', 400);
    }

    // Get the order with branch info and sales returns
    const orderWithRelations = await prisma.order.findUnique({
      where: { systemId },
      select: {
        systemId: true,
        id: true,
        status: true,
        paymentStatus: true,
        deliveryStatus: true,
        stockOutStatus: true,
        branchId: true,
        customerId: true,
        customerName: true,
        salespersonId: true,
        grandTotal: true,
        paidAmount: true,
        linkedSalesReturnValue: true,
        payments: {
          select: {
            systemId: true,
            id: true,
            orderId: true,
            amount: true,
            method: true,
            description: true,
            createdBy: true,
            createdAt: true,
            linkedReceiptSystemId: true,
          },
        },
        branch: { select: { systemId: true, name: true } },
        customer: { select: { systemId: true, name: true } },
        sales_returns: {
          select: { totalReturnValue: true },
          where: { status: { not: SalesReturnStatus.REJECTED } },
        },
      },
    });

    if (!orderWithRelations) {
      return apiNotFound('Order');
    }
    
    // Destructure for TypeScript
    const { payments, sales_returns, customer, branch, ...order } = orderWithRelations;

    // Get payment method info if provided
    const paymentMethod = paymentMethodId
      ? await prisma.paymentMethod.findFirst({
          where: {
            OR: [{ systemId: paymentMethodId }, { name: paymentMethodId }],
          },
          select: { systemId: true, name: true, type: true },
        })
      : await prisma.paymentMethod.findFirst({
          where: { isDefault: true, isActive: true },
          select: { systemId: true, name: true, type: true },
        })

    const accountSystemId = await resolveDefaultCashAccountSystemId({
      branchId: order.branchId,
      paymentMethodType: paymentMethod?.type,
    })

    // Calculate paid amount
    const paidAmount = payments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    
    // ✅ Calculate effective grandTotal: subtract return value and linked sales return value
    const grandTotal = Number(order.grandTotal || 0);
    // Sum totalReturnValue from all non-cancelled sales returns
    const totalReturnValue = sales_returns.reduce((sum, sr) => sum + Number(sr.totalReturnValue || 0), 0);
    const linkedSalesReturnValue = Number(order.linkedSalesReturnValue || 0);
    const effectiveGrandTotal = Math.max(0, grandTotal - totalReturnValue - linkedSalesReturnValue);
    
    const remainingAmount = effectiveGrandTotal - paidAmount;

    if (amount > remainingAmount) {
      return apiError(`Payment amount exceeds remaining balance of ${remainingAmount}`, 400);
    }

    // Transaction: add payment and update order
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Get creator name - check both name and fullName for compatibility
      const employeeInfo = session.user?.employee as { fullName?: string; name?: string; systemId?: string } | undefined;
      const creatorName = employeeInfo?.fullName || employeeInfo?.name || session.user?.name || 'Hệ thống';
      
      // Generate Receipt IDs using unified ID system
      const { systemId: receiptSystemId, businessId: receiptBusinessId } = await generateNextIdsWithTx(
        tx,
        'receipts'
      );
      
      // ✅ Use receipt businessId for OrderPayment.id too for consistency
      const paymentId = receiptBusinessId;
      
      // ✅ Get customer systemId (UUID) from relation, not business ID
      const customerSystemId = customer?.systemId || order.customerId;
      
      // Create Receipt first (phiếu thu)
      await tx.receipt.create({
        data: {
          systemId: receiptSystemId,
          id: receiptBusinessId,
          type: 'CUSTOMER_PAYMENT',
          customerId: order.customerId, // Business ID for display
          branchId: order.branchId,
          employeeId: employeeSystemId || employeeInfo?.systemId,
          orderId: systemId,
          amount,
          paymentMethod: paymentMethodId || 'CASH',
          description: note || `Thanh toán đơn hàng ${order.id}`,
          createdBy: creatorName,
          status: 'completed',
          category: 'sale',
          // Payer info - use customer systemId (UUID) for proper filtering
          payerName: customer?.name || order.customerName,
          payerSystemId: customerSystemId,
          payerTypeSystemId: 'CUSTOMER',
          payerTypeName: 'Khách hàng',
          // Branch info
          branchSystemId: order.branchId,
          branchName: branch?.name,
          // Payment method info
          paymentMethodSystemId: paymentMethod?.systemId,
          paymentMethodName: paymentMethod?.name || paymentMethodId || 'Tiền mặt',
          accountSystemId,
          // Receipt type
          paymentReceiptTypeSystemId: 'SALE',
          paymentReceiptTypeName: 'Thu tiền bán hàng',
          // Link to order
          linkedOrderSystemId: systemId,
          originalDocumentId: order.id,
          customerSystemId: customerSystemId, // ✅ Use UUID, not business ID
          customerName: customer?.name || order.customerName,
          affectsDebt: true, // ✅ Explicitly set for debt calculation
        },
      });
      
      // Create OrderPayment with link to Receipt
      await tx.orderPayment.create({
        data: {
          id: paymentId,
          orderId: systemId,
          amount,
          method: paymentMethodId || 'CASH',
          description: note,
          createdBy: creatorName,
          linkedReceiptSystemId: receiptSystemId,
        },
      });

      // Update order paid amount and status
      const newPaidAmount = paidAmount + amount;
      // ✅ Use effectiveGrandTotal (already subtracted return values) for comparison
      const isPaidFull = newPaidAmount >= effectiveGrandTotal;
      
      // Determine if order should be marked as COMPLETED
      // Order is complete when: fully paid AND (delivered OR fully stocked out)
      // NOT PROCESSING - that just means order is being handled, not delivered
      const isDelivered = order.deliveryStatus === DeliveryStatus.DELIVERED ||
                          order.status === OrderStatus.DELIVERED ||
                          order.stockOutStatus === StockOutStatus.FULLY_STOCKED_OUT;
      const shouldComplete = isPaidFull && isDelivered;

      const updated = await tx.order.update({
        where: { systemId },
        data: {
          paidAmount: newPaidAmount,
          paymentStatus: isPaidFull ? PaymentStatus.PAID : PaymentStatus.PARTIAL,
          ...(shouldComplete && { 
            status: OrderStatus.DELIVERED, // Use DELIVERED as closest to COMPLETED
            completedDate: new Date(),
          }),
        },
        select: {
          systemId: true,
          id: true,
          status: true,
          paymentStatus: true,
          deliveryStatus: true,
          completedDate: true,
          customerId: true,
          customerName: true,
          branchId: true,
          salespersonId: true,
          grandTotal: true,
          paidAmount: true,
          customer: {
            select: {
              systemId: true,
              id: true,
              name: true,
              phone: true,
            },
          },
          lineItems: {
            select: {
              systemId: true,
              productId: true,
              productSku: true,
              productName: true,
              quantity: true,
              unitPrice: true,
              discount: true,
              tax: true,
              total: true,
              note: true,
              product: {
                select: {
                  systemId: true,
                  id: true,
                  name: true,
                  thumbnailImage: true,
                },
              },
            },
          },
          payments: {
            select: {
              systemId: true,
              id: true,
              orderId: true,
              amount: true,
              method: true,
              description: true,
              createdBy: true,
              createdAt: true,
              linkedReceiptSystemId: true,
            },
          },
        },
      });

      // Note: Cashbook entry should be handled separately if needed

      return updated;
    });

    // Log activity
    await createActivityLog({
      entityType: 'order',
      entityId: systemId,
      action: `Thêm thanh toán ${amount.toLocaleString('vi-VN')}đ - ${updatedOrder.id || systemId}`,
      actionType: 'update',
      createdBy: session.user?.employee?.fullName || session.user?.name || session.user?.id || undefined,
    }).catch(e => logError('[Order Payment] activity log failed', e));

    // Notify salesperson about payment received
    if (updatedOrder.salespersonId && updatedOrder.salespersonId !== session.user?.employeeId) {
      createNotification({
        type: 'order',
        settingsKey: 'payment:received',
        title: 'Thanh toán đơn hàng',
        message: `Đơn hàng ${updatedOrder.id || systemId} vừa nhận thanh toán ${amount.toLocaleString('vi-VN')}đ`,
        link: `/orders/${systemId}`,
        recipientId: updatedOrder.salespersonId,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
      }).catch(e => logError('[Order Payment] notification failed', e));
    }

    return apiSuccess(updatedOrder);
  } catch (error) {
    logError('Error adding payment', error);
    return apiError('Failed to add payment', 500);
  }
}
