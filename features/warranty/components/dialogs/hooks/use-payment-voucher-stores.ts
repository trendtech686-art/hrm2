import * as React from 'react';
import { usePaymentStore } from '../../../../payments/store';
import { useAllReceipts } from '../../../../receipts/hooks/use-all-receipts';
import { useOrderStore } from '../../../../orders/store';
import { useAllOrders } from '../../../../orders/hooks/use-all-orders';
import { useWarrantyStore } from '../../../store';
import { useWarrantyFinder } from '../../../hooks/use-all-warranties';
import { useAllPaymentTypes } from '../../../../settings/payments/types/hooks/use-all-payment-types';
import { useAllPaymentMethods } from '../../../../settings/payments/hooks/use-all-payment-methods';
import { useAllCashAccounts } from '../../../../cashbook/hooks/use-all-cash-accounts';
import { useAuth } from '../../../../../contexts/auth-context';
import { asSystemId } from '@/lib/id-types';
import { calculateWarrantyProcessingState } from '../../logic/processing';

/**
 * Hook quản lý các stores và computed values cho PaymentVoucherDialog
 */
export function usePaymentVoucherStores(warrantySystemId: string) {
  const { add: addPayment, data: payments } = usePaymentStore();
  const { data: receipts } = useAllReceipts();
  const { data: orders } = useAllOrders();
  const { update: updateOrder } = useOrderStore();
  const { addHistory } = useWarrantyStore();
  const { findById: findWarrantyById } = useWarrantyFinder();
  const { data: paymentTypes } = useAllPaymentTypes();
  const { data: paymentMethods } = useAllPaymentMethods();
  const { accounts } = useAllCashAccounts();
  const { employee: authEmployee } = useAuth();

  const currentUserSystemId = authEmployee?.systemId ?? 'SYSTEM';
  const currentUserName = authEmployee?.fullName || authEmployee?.id || 'Hệ thống';

  // Get warranty payment types
  const warrantyRefundType = React.useMemo(() => 
    paymentTypes.find(t => t.id === 'HOANTIEN_BH' && t.isActive),
    [paymentTypes]
  );

  const warrantyOrderDeductionType = React.useMemo(() => 
    paymentTypes.find(t => t.id === 'TRAVAO_DONHANG' && t.isActive),
    [paymentTypes]
  );

  // Get default payment method (Tiền mặt)
  const defaultPaymentMethod = React.useMemo(() => 
    paymentMethods.find(m => m.isDefault && m.isActive) || paymentMethods.find(m => m.isActive),
    [paymentMethods]
  );

  // Get default cash account
  const defaultCashAccount = React.useMemo(() => 
    accounts.find(a => a.type === 'cash' && a.isDefault && a.isActive) || 
    accounts.find(a => a.type === 'cash' && a.isActive),
    [accounts]
  );

  // Get ticket và tính remaining amount
  const ticket = React.useMemo(() => 
    findWarrantyById(asSystemId(warrantySystemId)),
    [findWarrantyById, warrantySystemId]
  );
  
  const actualRemainingAmount = React.useMemo(() => {
    if (!ticket) return 0;
    
    const totalPaymentFromTicket = ticket.products.reduce((sum, p) => {
      if (p.resolution === 'out_of_stock') {
        return sum + ((p.quantity || 0) * (p.unitPrice || 0));
      }
      return sum;
    }, 0) + (ticket.shippingFee || 0);
    
    const state = calculateWarrantyProcessingState(ticket, payments, receipts, totalPaymentFromTicket);
    return state.remainingAmount;
  }, [ticket, payments, receipts]);

  return {
    // Store data
    payments,
    receipts,
    orders,
    paymentTypes,
    paymentMethods,
    accounts,
    ticket,
    
    // Store actions
    addPayment,
    updateOrder,
    addHistory,
    
    // Computed values
    warrantyRefundType,
    warrantyOrderDeductionType,
    defaultPaymentMethod,
    defaultCashAccount,
    actualRemainingAmount,
    currentUserSystemId,
    currentUserName,
  };
}
