import type { PaymentMethod } from '../../../../settings/payments/methods/types';
import type { SettlementType } from '../../../types';

/**
 * Detect settlement type từ payment method
 */
export function detectDirectSettlementType(paymentMethod?: PaymentMethod | null): Exclude<SettlementType, 'mixed'> {
  if (!paymentMethod) {
    return 'cash';
  }

  const normalizedId = paymentMethod.id?.toUpperCase() || '';
  const normalizedName = paymentMethod.name.toLowerCase();

  // ✅ Support both Vietnamese and English payment method names
  if (normalizedId === 'TIEN_MAT' || normalizedName.includes('tiền mặt') || normalizedName.includes('cash')) {
    return 'cash';
  }

  if (normalizedId === 'VI_DIEN_TU' || normalizedName.includes('momo') || normalizedName.includes('ví') || normalizedName.includes('wallet')) {
    return 'transfer';
  }

  return 'transfer';
}

/**
 * Kiểm tra payment method có phải tiền mặt không
 */
export function isCashPaymentMethod(paymentMethod?: PaymentMethod | null): boolean {
  if (!paymentMethod) return false;
  // ✅ Support both Vietnamese and English payment method names
  const name = paymentMethod.name.toLowerCase();
  return name.includes('tiền mặt') || name.includes('cash') || paymentMethod.id === 'TIEN_MAT';
}

/**
 * Tính toán số tiền tối đa có thể chi
 */
export function calculateMaxAmount(
  settlementType: string,
  actualRemainingAmount: number,
  selectedOrderGrandTotal?: number,
  selectedOrderPaidAmount?: number
): number {
  if (settlementType === 'order_deduction' && selectedOrderGrandTotal !== undefined) {
    const orderPaidAmount = selectedOrderPaidAmount || 0;
    const orderRemainingAmount = selectedOrderGrandTotal - orderPaidAmount;
    return Math.min(actualRemainingAmount, orderRemainingAmount);
  }
  return actualRemainingAmount;
}

/**
 * Tính toán shortage amount cho insufficient balance warning
 */
export function calculateShortageAmount(
  actualRemainingAmount: number,
  orderRemainingAmount: number
): number {
  return Math.max(actualRemainingAmount - orderRemainingAmount, 0);
}

/**
 * Kiểm tra có nên hiển thị insufficient warning không
 */
export function shouldShowInsufficientWarning(
  settlementType: string,
  selectedOrder: unknown,
  shortageAmount: number
): boolean {
  if (!selectedOrder) return false;
  return settlementType === 'order_deduction' && shortageAmount > 0;
}

/**
 * Form values interface
 */
export interface PaymentVoucherFormValues {
  amount: number;
  settlementType: 'order_deduction' | 'direct_payment' | 'mixed';
  paymentMethodSystemId?: string | undefined;
  accountSystemId?: string | undefined;
  selectedOrderId?: string | undefined;
  notes: string;
  mixedOrderAmount?: number | undefined;
  mixedCashAmount?: number | undefined;
}

/**
 * Get default form values
 */
export function getDefaultFormValues(
  actualRemainingAmount: number,
  defaultPaymentMethodSystemId?: string,
  defaultCashAccountSystemId?: string,
  linkedOrderId?: string,
  warrantyId?: string
): PaymentVoucherFormValues {
  return {
    amount: actualRemainingAmount,
    settlementType: 'direct_payment',
    paymentMethodSystemId: defaultPaymentMethodSystemId,
    accountSystemId: defaultCashAccountSystemId,
    selectedOrderId: linkedOrderId,
    notes: `Hoàn tiền bảo hành ${warrantyId || ''}`,
    mixedOrderAmount: undefined,
    mixedCashAmount: undefined,
  };
}
