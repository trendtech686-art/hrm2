/**
 * Customer Debt Service
 * 
 * Tính toán và cập nhật công nợ khách hàng (currentDebt) trong database.
 * 
 * Công thức:
 *   currentDebt = Tổng tiền đơn hàng đã giao 
 *                 - Tổng phiếu thu (affectsDebt=true)
 *                 + Tổng phiếu chi hoàn tiền khách (affectsDebt=true, không phải hoàn từ trả hàng)
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

export interface CustomerDebtResult {
  customerSystemId: string;
  previousDebt: number;
  newDebt: number;
  breakdown: {
    orderTotal: number;
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
    receiptTotal: number;
    paymentTotal: number;
  };
}> {
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

  // 2. Tổng phiếu thu có ảnh hưởng công nợ (giảm công nợ)
  const receipts = await prisma.receipt.findMany({
    where: {
      status: { not: 'cancelled' },
      affectsDebt: true,
      OR: [
        { customerSystemId },
        { payerSystemId: customerSystemId },
      ],
    },
    select: { amount: true },
  });
  const receiptTotal = receipts.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  // 3. Tổng phiếu chi có ảnh hưởng công nợ (hoàn tiền khách = giảm công nợ)
  // Không tính phiếu chi hoàn tiền từ trả hàng (linkedSalesReturnSystemId)
  const payments = await prisma.payment.findMany({
    where: {
      status: { not: 'cancelled' },
      affectsDebt: true,
      linkedSalesReturnSystemId: null, // Không phải hoàn từ trả hàng
      OR: [
        { customerSystemId },
        { recipientSystemId: customerSystemId },
      ],
    },
    select: { 
      amount: true, 
      paymentReceiptTypeName: true,
      category: true,
    },
  });
  
  // Phiếu chi hoàn tiền khách = giảm công nợ (change âm)
  // Phiếu chi khác (hiếm) = tăng công nợ (change dương)
  let paymentTotal = 0;
  for (const p of payments) {
    const isRefundToCustomer = p.paymentReceiptTypeName === 'Hoàn tiền khách hàng' || 
                                p.category === 'complaint_refund';
    if (isRefundToCustomer) {
      paymentTotal -= Number(p.amount) || 0; // Giảm công nợ
    } else {
      paymentTotal += Number(p.amount) || 0; // Tăng công nợ (rare case)
    }
  }

  // Công nợ = Đơn hàng - Phiếu thu + Phiếu chi (đã tính dấu)
  const debt = orderTotal - receiptTotal + paymentTotal;

  return {
    debt,
    breakdown: {
      orderTotal,
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
    console.error(`[CustomerDebtService] Error updating debt for ${customerSystemId}:`, error);
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
