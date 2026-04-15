/**
 * Customer Debt Service
 * 
 * Tính toán và cập nhật công nợ khách hàng (currentDebt) trong database.
 * 
 * Công thức:
 *   currentDebt = Tổng tiền đơn hàng đã giao 
 *                 - Tổng giá trị hàng trả lại (đã nhận hàng)
 *                 - Tổng phiếu thu (affectsDebt=true)
 *                 + Tổng phiếu chi hoàn tiền khách (affectsDebt=true, không phải hoàn từ trả hàng)
 * 
 * Lưu ý: Phiếu chi hoàn tiền từ trả hàng KHÔNG ảnh hưởng công nợ vì giá trị hàng trả đã được trừ ở trên.
 * Nếu tính cả hai sẽ bị trừ hai lần!
 * 
 * Được gọi khi:
 * - Tạo/cập nhật/hủy đơn hàng (khi status hoàn thành hoặc đã giao)
 * - Tạo/cập nhật/hủy phiếu thu (khi affectsDebt=true)
 * - Tạo/cập nhật/hủy phiếu chi (khi affectsDebt=true)
 * - Xử lý trả hàng
 */

import { prisma } from '@/lib/prisma';
import { OrderStatus, DeliveryStatus, StockOutStatus } from '@/generated/prisma/client';
import { Prisma } from '@/generated/prisma/client';
import { logError } from '@/lib/logger'

export interface CustomerDebtResult {
  customerSystemId: string;
  previousDebt: number;
  newDebt: number;
  breakdown: {
    orderTotal: number;
    returnedTotal: number;
    receiptTotal: number;
    paymentTotal: number;
  };
}

/**
 * Tính toán công nợ của khách hàng từ transactions
 */
export async function calculateCustomerDebt(customerSystemId: string): Promise<{
  debt: number;
  breakdown: {
    orderTotal: number;
    returnedTotal: number;
    receiptTotal: number;
    paymentTotal: number;
  };
}> {
  // Fetch customer name for name-based matching (same as debt transactions API)
  const customer = await prisma.customer.findUnique({
    where: { systemId: customerSystemId },
    select: { name: true },
  });
  const customerName = customer?.name;

  // 1. Tổng tiền đơn hàng đã giao (status = COMPLETED hoặc DELIVERED, hoặc stockOutStatus = FULLY_STOCKED_OUT)
  // Order model uses customerId field (not customerSystemId)
  const orders = await prisma.order.findMany({
    where: {
      customerId: customerSystemId,
      status: { not: OrderStatus.CANCELLED },
      OR: [
        { status: OrderStatus.COMPLETED },
        { status: OrderStatus.DELIVERED },
        { deliveryStatus: DeliveryStatus.DELIVERED },
        { stockOutStatus: StockOutStatus.FULLY_STOCKED_OUT },
      ],
    },
    select: { grandTotal: true },
  });
  const orderTotal = orders.reduce((sum, o) => sum + (Number(o.grandTotal) || 0), 0);

  // 2. ✅ Tổng giá trị hàng trả lại (đã nhận hàng) - GIẢM công nợ
  // Chỉ tính những phiếu trả đã nhận hàng (isReceived=true) và không bị từ chối
  const salesReturns = await prisma.salesReturn.findMany({
    where: {
      customerSystemId,
      isReceived: true,
      status: { not: 'REJECTED' },
    },
    select: { totalReturnValue: true },
  });
  const returnedTotal = salesReturns.reduce((sum, sr) => sum + (Number(sr.totalReturnValue) || 0), 0);

  // 3. Tổng phiếu thu có ảnh hưởng công nợ (giảm công nợ)
  // Match by systemId fields OR by name (same as debt transactions API)
  const receipts = await prisma.receipt.findMany({
    where: {
      status: { not: 'cancelled' },
      affectsDebt: true,
      OR: [
        { customerSystemId },
        { payerSystemId: customerSystemId },
        ...(customerName ? [{ payerTypeName: 'Khách hàng', payerName: customerName }] : []),
      ],
    },
    select: { amount: true },
  });
  const receiptTotal = receipts.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  // 4. Tổng phiếu chi có ảnh hưởng công nợ (không phải hoàn trả hàng, không phải khiếu nại)
  // Match by systemId fields OR by name (same as debt transactions API)
  const payments = await prisma.payment.findMany({
    where: {
      status: { not: 'cancelled' },
      affectsDebt: true,
      linkedSalesReturnSystemId: null,
      linkedComplaintSystemId: null,
      OR: [
        { customerSystemId },
        { recipientSystemId: customerSystemId },
        ...(customerName ? [{ recipientTypeName: 'Khách hàng', recipientName: customerName }] : []),
      ],
    },
    select: { 
      amount: true, 
      paymentReceiptTypeName: true,
      category: true,
    },
  });
  
  // Tất cả phiếu chi đều tăng công nợ (trả tiền cho khách → từ âm về 0)
  let paymentTotal = 0;
  for (const p of payments) {
    paymentTotal += Number(p.amount) || 0;
  }

  // 5. ✅ Tổng phiếu chi hoàn tiền từ trả hàng - TĂNG công nợ (từ âm về 0)
  // Hàng trả làm công nợ âm (công ty nợ khách), PC hoàn làm công nợ về 0
  // Match by systemId fields OR by name (same as debt transactions API)
  const salesReturnRefunds = await prisma.payment.aggregate({
    where: {
      status: { not: 'cancelled' },
      linkedSalesReturnSystemId: { not: null },
      OR: [
        { customerSystemId },
        { recipientSystemId: customerSystemId },
        ...(customerName ? [{ recipientTypeName: 'Khách hàng', recipientName: customerName }] : []),
      ],
    },
    _sum: { amount: true },
  });
  const salesReturnRefundTotal = Number(salesReturnRefunds._sum.amount ?? 0);

  // ✅ Công nợ = Đơn hàng - Hàng trả - Phiếu thu + PC hoàn từ SR + Phiếu chi khác
  const debt = orderTotal - returnedTotal - receiptTotal + salesReturnRefundTotal + paymentTotal;

  return {
    debt,
    breakdown: {
      orderTotal,
      returnedTotal,
      receiptTotal,
      paymentTotal,
    },
  };
}

/**
 * Cập nhật công nợ của khách hàng trong database
 */
export async function updateCustomerDebt(customerSystemId: string): Promise<CustomerDebtResult | null> {
  if (!customerSystemId) {
    console.warn('[CustomerDebtService] Missing customerSystemId');
    return null;
  }

  try {
    // Lấy công nợ hiện tại
    const customer = await prisma.customer.findUnique({
      where: { systemId: customerSystemId },
      select: { currentDebt: true },
    });

    if (!customer) {
      console.warn(`[CustomerDebtService] Customer not found: ${customerSystemId}`);
      return null;
    }

    const previousDebt = Number(customer.currentDebt) || 0;

    // Tính công nợ mới
    const { debt: newDebt, breakdown } = await calculateCustomerDebt(customerSystemId);

    // Cập nhật database
    await prisma.customer.update({
      where: { systemId: customerSystemId },
      data: { currentDebt: new Prisma.Decimal(newDebt) },
    });


    return {
      customerSystemId,
      previousDebt,
      newDebt,
      breakdown,
    };
  } catch (error) {
    logError(`[CustomerDebtService] Error updating debt for ${customerSystemId}`, error);
    throw error;
  }
}

/**
 * Batch update công nợ cho nhiều khách hàng
 */
export async function updateMultipleCustomerDebts(customerSystemIds: string[]): Promise<CustomerDebtResult[]> {
  const results: CustomerDebtResult[] = [];
  
  for (const id of customerSystemIds) {
    const result = await updateCustomerDebt(id);
    if (result) {
      results.push(result);
    }
  }
  
  return results;
}

/**
 * Sync công nợ cho TẤT CẢ khách hàng (dùng cho migration/fix data)
 */
export async function syncAllCustomerDebts(): Promise<{
  total: number;
  updated: number;
  errors: string[];
}> {
  const customers = await prisma.customer.findMany({
    select: { systemId: true },
  });

  let updated = 0;
  const errors: string[] = [];

  for (const customer of customers) {
    try {
      await updateCustomerDebt(customer.systemId);
      updated++;
    } catch (error) {
      errors.push(`${customer.systemId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }


  return {
    total: customers.length,
    updated,
    errors,
  };
}

// Export service object for backward compatibility
export const customerDebtService = {
  calculateCustomerDebt,
  updateCustomerDebt,
  updateMultipleCustomerDebts,
  syncAllCustomerDebts,
};
