/**
 * WarrantyPaymentVoucherDialog
 * 
 * Dialog tạo phiếu chi (payment voucher) từ warranty
 * - Auto-fill số tiền từ remainingAmount
 * - Chọn phương thức: Cash / Bank Transfer
 * - Optional: Link đơn hàng để trừ vào tiền hàng
 */

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '../../../../components/ui/dialog.tsx';
import { Button } from '../../../../components/ui/button.tsx';
import { Label } from '../../../../components/ui/label.tsx';
import { Input } from '../../../../components/ui/input.tsx';
import { CurrencyInput } from '../../../../components/ui/currency-input.tsx';
import { Textarea } from '../../../../components/ui/textarea.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select.tsx';
import { Alert, AlertDescription } from '../../../../components/ui/alert.tsx';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { usePaymentStore } from '../../../payments/store.ts';
import { useReceiptStore } from '../../../receipts/store.ts';
import { useOrderStore } from '../../../orders/store.ts';
import { useWarrantyStore } from '../../store.ts';
import type { SettlementType, WarrantyVoucherDialogBaseProps } from '../../types.ts';
import { usePaymentTypeStore } from '../../../settings/payments/types/store.ts';
import { usePaymentMethodStore } from '../../../settings/payments/methods/store.ts';
import { useCashbookStore } from '../../../cashbook/store.ts';
import { toISODateTime } from '../../../../lib/date-utils.ts';
import { searchOrders, type OrderSearchResult } from '../../../orders/order-search-api.ts';
import { VirtualizedCombobox } from '../../../../components/ui/virtualized-combobox.tsx';
import type { Payment } from '../../../payments/types.ts';
import type { PaymentMethod } from '../../../settings/payments/methods/types.ts';
import { useAuth } from '../../../../contexts/auth-context.tsx';
import { asSystemId, asBusinessId } from '@/lib/id-types';
import { calculateWarrantyProcessingState } from '../logic/processing.ts';
import { InsufficientBalanceDialog } from './insufficient-balance-dialog.tsx';
import { calculateWarrantySettlementTotal } from '../../utils/payment-calculations.ts';
import { recordWarrantySettlementMethods, type SettlementMethodInput } from '../../utils/settlement-store.ts';

interface WarrantyPaymentVoucherDialogProps extends WarrantyVoucherDialogBaseProps {
  existingPayments?: Payment[] | undefined;
}

interface FormValues {
  amount: number;
  settlementType: 'order_deduction' | 'direct_payment' | 'mixed';
  paymentMethodSystemId?: string | undefined;
  accountSystemId?: string | undefined;
  selectedOrderId?: string | undefined;
  notes: string;
  mixedOrderAmount?: number | undefined;
  mixedCashAmount?: number | undefined;
}

const detectDirectSettlementType = (paymentMethod?: PaymentMethod | null): Exclude<SettlementType, 'mixed'> => {
  if (!paymentMethod) {
    return 'cash';
  }

  const normalizedId = paymentMethod.id?.toUpperCase() || '';
  const normalizedName = paymentMethod.name.toLowerCase();

  if (normalizedId === 'TIEN_MAT' || normalizedName.includes('tiền mặt')) {
    return 'cash';
  }

  if (normalizedId === 'VI_DIEN_TU' || normalizedName.includes('momo') || normalizedName.includes('ví')) {
    return 'transfer';
  }

  return 'transfer';
};

export function WarrantyPaymentVoucherDialog({
  warrantyId,
  warrantySystemId,
  customer,
  defaultAmount = 0,
  linkedOrderId,
  branchSystemId,
  branchName,
  existingPayments = [],
}: WarrantyPaymentVoucherDialogProps) {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  
  const { add: addPayment, data: payments } = usePaymentStore();
  const { data: receipts } = useReceiptStore();
  const { data: orders, update: updateOrder } = useOrderStore();
  const { findById: findWarrantyById, addHistory } = useWarrantyStore();
  const { data: paymentTypes } = usePaymentTypeStore();
  const { data: paymentMethods } = usePaymentMethodStore();
  const { accounts } = useCashbookStore();
  const { employee: authEmployee } = useAuth();

  const currentUserSystemId = authEmployee?.systemId ?? 'SYSTEM';
  const currentUserName = authEmployee?.fullName || authEmployee?.id || 'Hệ thống';

  // Order search state
  const [orderSearchQuery, setOrderSearchQuery] = React.useState('');
  const [orderSearchResults, setOrderSearchResults] = React.useState<OrderSearchResult[]>([]);
  const [isSearchingOrders, setIsSearchingOrders] = React.useState(false);

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

  // ✅ Tính số tiền còn lại THỰC TẾ dùng warranty-processing-logic.ts
  const ticket = React.useMemo(() => 
    findWarrantyById(asSystemId(warrantySystemId)),
    [findWarrantyById, warrantySystemId]
  );
  
  const actualRemainingAmount = React.useMemo(() => {
    // ✅ Tính lại từ ticket thực tế, KHÔNG dùng defaultAmount (vì nó đã bị trừ)
    if (!ticket) return 0;
    
    // Tính totalPayment từ ticket (giống WarrantyProcessingCard)
    const totalPaymentFromTicket = ticket.products.reduce((sum, p) => {
      if (p.resolution === 'out_of_stock') {
        return sum + ((p.quantity || 0) * (p.unitPrice || 0));
      }
      return sum;
    }, 0) + (ticket.shippingFee || 0);
    
    const state = calculateWarrantyProcessingState(ticket, payments, receipts, totalPaymentFromTicket);
    
    console.log('💰 [ACTUAL REMAINING CALCULATION]', {
      totalPaymentFromTicket,
      remainingAmount: state.remainingAmount,
      warrantySystemId,
      paymentsCount: state.warrantyPayments.length,
      receiptsCount: state.warrantyReceipts.length,
      warrantyPaymentsTotal: state.warrantyPayments.reduce((sum, p) => p.status !== 'cancelled' ? sum + p.amount : sum, 0)
    });
    
    return state.remainingAmount;
  }, [ticket, payments, receipts, warrantySystemId]);

  const { control, handleSubmit, watch, reset, setValue } = useForm<FormValues>({
    defaultValues: {
      amount: 0, // Sẽ được set trong useEffect
      settlementType: 'direct_payment',
      paymentMethodSystemId: defaultPaymentMethod?.systemId,
      accountSystemId: defaultCashAccount?.systemId,
      selectedOrderId: linkedOrderId,
      notes: `Hoàn tiền bảo hành ${warrantyId}`,
      mixedOrderAmount: undefined,
      mixedCashAmount: undefined,
    },
  });

  const settlementType = watch('settlementType');
  const selectedOrderId = watch('selectedOrderId');
  const paymentMethodSystemId = watch('paymentMethodSystemId');
  const accountSystemId = watch('accountSystemId');
  const amount = watch('amount');
  const mixedOrderAmount = watch('mixedOrderAmount');
  const mixedCashAmount = watch('mixedCashAmount');

  // Get selected payment method to determine account type
  const selectedPaymentMethod = React.useMemo(() => 
    paymentMethods.find(m => m.systemId === paymentMethodSystemId),
    [paymentMethods, paymentMethodSystemId]
  );

  // Filter accounts based on payment method
  // Tiền mặt → cash accounts, Chuyển khoản → bank accounts
  const filteredAccounts = React.useMemo(() => {
    if (!selectedPaymentMethod) return accounts.filter(a => a.isActive);
    
    const isCashMethod = selectedPaymentMethod.name.toLowerCase().includes('tiền mặt') || 
                         selectedPaymentMethod.id === 'TIEN_MAT';
    const accountType = isCashMethod ? 'cash' : 'bank';
    
    return accounts.filter(a => a.isActive && a.type === accountType);
  }, [accounts, selectedPaymentMethod]);

  // Auto-select appropriate account when payment method changes
  React.useEffect(() => {
    if (!selectedPaymentMethod || settlementType !== 'direct_payment') return;
    
    const isCashMethod = selectedPaymentMethod.name.toLowerCase().includes('tiền mặt') || 
                         selectedPaymentMethod.id === 'TIEN_MAT';
    const accountType = isCashMethod ? 'cash' : 'bank';
    
    // Find default account of the correct type
    const defaultAccount = accounts.find(a => a.type === accountType && a.isDefault && a.isActive) ||
                          accounts.find(a => a.type === accountType && a.isActive);
    
    if (defaultAccount) {
      setValue('accountSystemId', defaultAccount.systemId);
    }
  }, [selectedPaymentMethod, accounts, setValue, settlementType]);

  // Reset form when dialog opens và auto-fill số tiền tối đa
  React.useEffect(() => {
    if (open) {
      reset({
        amount: actualRemainingAmount, // ✅ Auto-fill số tiền tối đa
        settlementType: 'direct_payment',
        paymentMethodSystemId: defaultPaymentMethod?.systemId,
        accountSystemId: defaultCashAccount?.systemId,
        selectedOrderId: linkedOrderId,
        notes: `Hoàn tiền bảo hành ${warrantyId}`,
        mixedOrderAmount: undefined,
        mixedCashAmount: undefined,
      });
    }
  }, [open, linkedOrderId, warrantyId, reset, defaultPaymentMethod, defaultCashAccount, actualRemainingAmount]);

  // Server-side search for orders with debounce - ONLY SHOW ORDERS NOT SHIPPED YET
  React.useEffect(() => {
    const performSearch = async () => {
      setIsSearchingOrders(true);
      try {
        const results = await searchOrders(
          { query: orderSearchQuery, limit: 50 },
          orders
        );
        
        // Filter: Only show orders that:
        // 1. NOT been shipped yet (stockOutStatus === 'Chưa xuất kho')
        // 2. Still have remaining amount to deduct (grandTotal - paidAmount > 0)
        const unshippedResults = results.filter(result => {
          const order = orders.find(o => o.systemId === result.value);
          if (!order) return false;
          
          // Check if order is not shipped yet
          if (order.stockOutStatus !== 'Chưa xuất kho') return false;
          
          // Calculate remaining amount (grandTotal - already paid from warranty)
          const paidAmount = order.paidAmount || 0;
          const remainingAmount = order.grandTotal - paidAmount;
          
          // Only show orders with remaining amount > 0
          return remainingAmount > 0;
        });
        
        // Update subtitle to show remaining amount
        const resultsWithRemaining = unshippedResults.map(result => {
          const order = orders.find(o => o.systemId === result.value);
          if (!order) return result;
          
          const paidAmount = order.paidAmount || 0;
          const remainingAmount = order.grandTotal - paidAmount;
          
          return {
            ...result,
            subtitle: `${order.grandTotal.toLocaleString('vi-VN')} đ • Còn lại: ${remainingAmount.toLocaleString('vi-VN')} đ • ${order.orderDate}`,
          };
        });
        
        setOrderSearchResults(resultsWithRemaining);
      } catch (error) {
        console.error('Order search error:', error);
        setOrderSearchResults([]);
      } finally {
        setIsSearchingOrders(false);
      }
    };

    performSearch();
  }, [orderSearchQuery, orders]);

  // Memoize selected order value for VirtualizedCombobox
  const selectedOrderValue = React.useMemo(() => {
    if (!selectedOrderId) return null;
    const order = orders.find(o => o.systemId === selectedOrderId);
    if (!order) return null;
    
    const paidAmount = order.paidAmount || 0;
    const remainingAmount = order.grandTotal - paidAmount;
    
    return {
      value: order.systemId,
      label: `${order.id} - ${order.customerName}`,
      subtitle: `${order.grandTotal.toLocaleString('vi-VN')} đ • Còn lại: ${remainingAmount.toLocaleString('vi-VN')} đ • ${order.orderDate}`
    };
  }, [selectedOrderId, orders]);

  // Get selected order details for validation
  const selectedOrder = React.useMemo(() => 
    orders.find(o => o.systemId === selectedOrderId),
    [orders, selectedOrderId]
  );

  const [insufficientDialogOpen, setInsufficientDialogOpen] = React.useState(false);

  const orderRemainingAmount = React.useMemo(() => {
    if (!selectedOrder) return 0;
    const orderPaidAmount = selectedOrder.paidAmount || 0;
    return Math.max(selectedOrder.grandTotal - orderPaidAmount, 0);
  }, [selectedOrder]);

  const shortageAmount = React.useMemo(() => {
    if (!selectedOrder) return 0;
    return Math.max(actualRemainingAmount - orderRemainingAmount, 0);
  }, [selectedOrder, actualRemainingAmount, orderRemainingAmount]);

  const shouldShowInsufficientWarning = React.useMemo(() => {
    if (!selectedOrder) return false;
    return settlementType === 'order_deduction' && shortageAmount > 0;
  }, [settlementType, selectedOrder, shortageAmount]);

  const applyMixedSuggestion = React.useCallback(() => {
    if (!selectedOrder) return;
    const orderAllocation = Math.min(orderRemainingAmount, actualRemainingAmount);
    const cashAllocation = Math.max(actualRemainingAmount - orderAllocation, 0);
    setValue('settlementType', 'mixed', { shouldValidate: true, shouldDirty: true });
    setValue('mixedOrderAmount', orderAllocation, { shouldValidate: true, shouldDirty: true });
    setValue('mixedCashAmount', cashAllocation, { shouldValidate: true, shouldDirty: true });
    setValue('amount', cashAllocation, { shouldValidate: true, shouldDirty: true });
    setInsufficientDialogOpen(false);
  }, [selectedOrder, orderRemainingAmount, actualRemainingAmount, setValue]);

  const applyCashOnlySuggestion = React.useCallback(() => {
    setValue('settlementType', 'direct_payment', { shouldValidate: true, shouldDirty: true });
    setValue('selectedOrderId', '', { shouldValidate: true, shouldDirty: true });
    setValue('mixedOrderAmount', undefined);
    setValue('mixedCashAmount', undefined);
    setValue('amount', actualRemainingAmount, { shouldValidate: true, shouldDirty: true });
    setInsufficientDialogOpen(false);
  }, [actualRemainingAmount, setValue]);

  React.useEffect(() => {
    if (settlementType !== 'mixed') return;
    const maxOrderAllocation = Math.min(orderRemainingAmount, actualRemainingAmount);
    const rawOrderAmount = mixedOrderAmount ?? maxOrderAllocation;
    const clampedOrderAmount = Math.max(0, Math.min(rawOrderAmount, maxOrderAllocation));

    if (clampedOrderAmount !== (mixedOrderAmount ?? 0)) {
      setValue('mixedOrderAmount', clampedOrderAmount, { shouldValidate: true, shouldDirty: true });
    }

    const recalculatedCashAmount = Math.max(actualRemainingAmount - clampedOrderAmount, 0);
    if (recalculatedCashAmount !== (mixedCashAmount ?? 0)) {
      setValue('mixedCashAmount', recalculatedCashAmount, { shouldValidate: true, shouldDirty: true });
    }

    if (settlementType === 'mixed' && amount !== recalculatedCashAmount) {
      setValue('amount', recalculatedCashAmount, { shouldValidate: true, shouldDirty: true });
    }
  }, [settlementType, mixedOrderAmount, mixedCashAmount, orderRemainingAmount, actualRemainingAmount, amount, setValue]);

  // Calculate max amount based on settlement type
  const maxAmount = React.useMemo(() => {
    if (settlementType === 'order_deduction' && selectedOrder) {
      // Nếu trừ vào đơn hàng: max = min(actualRemainingAmount, order remaining amount)
      const orderPaidAmount = selectedOrder.paidAmount || 0;
      const orderRemainingAmount = selectedOrder.grandTotal - orderPaidAmount;
      return Math.min(actualRemainingAmount, orderRemainingAmount);
    }
    // Nếu trả trực tiếp: max = actualRemainingAmount
    return actualRemainingAmount;
  }, [settlementType, selectedOrder, actualRemainingAmount]);

  const handleMixedSettlement = async (values: FormValues) => {
    if (!ticket) {
      toast.error('Không tìm thấy thông tin phiếu bảo hành');
      return;
    }

    const selectedOrderSystemId = values.selectedOrderId;
    if (!selectedOrderSystemId) {
      toast.error('Vui lòng chọn đơn hàng để bù trừ');
      return;
    }

    const order = orders.find(o => o.systemId === selectedOrderSystemId);
    if (!order) {
      toast.error('Không tìm thấy thông tin đơn hàng để bù trừ');
      return;
    }

    const orderAmount = values.mixedOrderAmount || 0;
    const cashAmount = values.mixedCashAmount || 0;

    if (orderAmount <= 0) {
      toast.error('Số tiền trừ vào đơn phải lớn hơn 0');
      return;
    }

    if (cashAmount <= 0) {
      toast.error('Số tiền chi trực tiếp phải lớn hơn 0');
      return;
    }

    const orderPaidAmount = order.paidAmount || 0;
    const orderRemainingAmountForOrder = order.grandTotal - orderPaidAmount;
    if (orderAmount > orderRemainingAmountForOrder) {
      toast.error('Số tiền trừ vào đơn vượt quá số dư của đơn hàng', {
        description: `Còn lại: ${orderRemainingAmountForOrder.toLocaleString('vi-VN')} đ`,
      });
      return;
    }

    const latestPayments = usePaymentStore.getState().data;
    const latestReceipts = useReceiptStore.getState().data;
    const totalPaymentFromTicket = calculateWarrantySettlementTotal(ticket);
    const currentState = calculateWarrantyProcessingState(ticket, latestPayments, latestReceipts, totalPaymentFromTicket);
    const currentRemainingAmount = currentState.remainingAmount;

    if (orderAmount + cashAmount > currentRemainingAmount) {
      toast.error('Tổng số tiền vượt quá số tiền cần hoàn cho khách', {
        description: `Còn lại: ${currentRemainingAmount.toLocaleString('vi-VN')} đ`,
      });
      return;
    }

    if (!warrantyOrderDeductionType || !warrantyRefundType) {
      toast.error('Thiếu cấu hình loại phiếu chi bảo hành trong cài đặt');
      return;
    }

    let selectedPaymentMethod = paymentMethods.find(m => m.systemId === values.paymentMethodSystemId);
    if (!selectedPaymentMethod) {
      selectedPaymentMethod = defaultPaymentMethod;
    }

    if (!selectedPaymentMethod) {
      toast.error('Vui lòng chọn hình thức thanh toán cho phần chi trực tiếp');
      return;
    }

    if (!values.accountSystemId) {
      toast.error('Vui lòng chọn tài khoản chi cho phần chi trực tiếp');
      return;
    }

    const now = new Date();
    const isoNow = toISODateTime(now) || now.toISOString();
    const baseNotes = values.notes || `Hoàn tiền bảo hành ${warrantyId}`;

    // --- Step 1: Order deduction ---
    const orderDeductionPayment: Omit<Payment, 'systemId'> = {
      id: asBusinessId(''),
      date: isoNow,
      amount: orderAmount,
      recipientTypeSystemId: asSystemId('KHACHHANG'),
      recipientTypeName: 'Khách hàng',
      recipientName: customer.name,
      description: `${baseNotes} - Trừ vào đơn ${order.id}`,
      paymentMethodSystemId: asSystemId('ORDER_DEDUCTION'),
      paymentMethodName: 'Bù trừ đơn hàng',
      accountSystemId: asSystemId(''),
      paymentReceiptTypeSystemId: warrantyOrderDeductionType.systemId,
      paymentReceiptTypeName: warrantyOrderDeductionType.name,
      branchSystemId: asSystemId(branchSystemId || ''),
      branchName: branchName || '',
      status: 'completed',
      category: 'warranty_refund',
      linkedWarrantySystemId: asSystemId(warrantySystemId),
      linkedOrderSystemId: order.systemId,
      originalDocumentId: warrantyId,
      customerSystemId: undefined,
      customerName: customer.name,
      affectsDebt: false,
      createdBy: asSystemId(currentUserSystemId),
      createdAt: isoNow,
    };

    const orderPayment = addPayment(orderDeductionPayment);

    const existingOrderPayments = order.payments || [];
    const orderPaymentEntry = {
      systemId: orderPayment.systemId,
      id: orderPayment.id,
      date: orderPayment.date,
      method: 'Bù trừ bảo hành',
      amount: -orderAmount,
      createdBy: orderPayment.createdBy,
      description: `Trừ tiền bảo hành ${warrantyId}`,
      linkedWarrantySystemId: warrantySystemId,
    };

    updateOrder(order.systemId, {
      payments: [...existingOrderPayments, orderPaymentEntry],
      paidAmount: (order.paidAmount || 0) + orderAmount,
    });

    addHistory(
      asSystemId(warrantySystemId),
      `Bù trừ ${orderAmount.toLocaleString('vi-VN')} đ vào đơn ${order.id}`,
      currentUserName,
      `Đơn ${order.id} - Khách hàng: ${order.customerName}`,
      { paymentSystemId: orderPayment.systemId, linkedOrderSystemId: order.systemId }
    );

    // --- Step 2: Cash payment ---
    const cashPayment: Omit<Payment, 'systemId'> = {
      id: asBusinessId(''),
      date: isoNow,
      amount: cashAmount,
      recipientTypeSystemId: asSystemId('KHACHHANG'),
      recipientTypeName: 'Khách hàng',
      recipientName: customer.name,
      description: `${baseNotes} - Chi trực tiếp`,
      paymentMethodSystemId: selectedPaymentMethod.systemId,
      paymentMethodName: selectedPaymentMethod.name,
      accountSystemId: asSystemId(values.accountSystemId || ''),
      paymentReceiptTypeSystemId: warrantyRefundType.systemId,
      paymentReceiptTypeName: warrantyRefundType.name,
      branchSystemId: asSystemId(branchSystemId || ''),
      branchName: branchName || '',
      status: 'completed',
      category: 'warranty_refund',
      linkedWarrantySystemId: asSystemId(warrantySystemId),
      originalDocumentId: warrantyId,
      customerSystemId: undefined,
      customerName: customer.name,
      affectsDebt: false,
      createdBy: asSystemId(currentUserSystemId),
      createdAt: isoNow,
    };

    const cashPaymentResult = addPayment(cashPayment);

    addHistory(
      asSystemId(warrantySystemId),
      `Chi ${cashAmount.toLocaleString('vi-VN')} đ cho khách`,
      currentUserName,
      `${selectedPaymentMethod.name} - ${cashAmount.toLocaleString('vi-VN')} đ`,
      { paymentSystemId: cashPaymentResult.systemId }
    );

    const settlementMethods: SettlementMethodInput[] = [
      {
        type: 'order_deduction',
        amount: orderAmount,
        status: 'completed',
        linkedOrderSystemId: order.systemId,
        paymentVoucherId: orderPayment.systemId,
        notes: `Trừ vào đơn ${order.id}`,
        createdAt: isoNow,
        completedAt: isoNow,
      },
      {
        type: detectDirectSettlementType(selectedPaymentMethod),
        amount: cashAmount,
        status: 'completed',
        paymentVoucherId: cashPaymentResult.systemId,
        notes: `${selectedPaymentMethod.name} - ${baseNotes}`,
        createdAt: isoNow,
        completedAt: cashPaymentResult.status === 'completed' ? isoNow : undefined,
      },
    ];

    recordWarrantySettlementMethods({
      ticket,
      settlementType: 'mixed',
      totalAmount: totalPaymentFromTicket,
      methods: settlementMethods,
    });

    setInsufficientDialogOpen(false);
    toast.success('Đã xử lý bù trừ + chi tiền', {
      description: `Trừ ${orderAmount.toLocaleString('vi-VN')} đ vào ${order.id} + Chi ${cashAmount.toLocaleString('vi-VN')} đ`,
      action: {
        label: 'Xem phiếu chi',
        onClick: () => navigate(`/payments/${cashPaymentResult.systemId}`),
      },
    });
  };

  const onSubmit = async (values: FormValues) => {
    try {
      if (values.settlementType === 'mixed') {
        await handleMixedSettlement(values);
        setOpen(false);
        return;
      }

      const now = new Date();

      if (!ticket) {
        toast.error('Không tìm thấy thông tin phiếu bảo hành');
        return;
      }

      const totalPaymentFromTicket = calculateWarrantySettlementTotal(ticket);
      const currentState = calculateWarrantyProcessingState(ticket, payments, receipts, totalPaymentFromTicket);
      const currentRemainingAmount = currentState.remainingAmount;
      
      console.log('💰 [PAYMENT VALIDATION]', {
        totalPaymentFromTicket,
        totalPayments: currentState.warrantyPayments.reduce((sum, p) => p.status !== 'cancelled' ? sum + p.amount : sum, 0),
        totalReceipts: currentState.warrantyReceipts.reduce((sum, r) => r.status !== 'cancelled' ? sum + r.amount : sum, 0),
        currentRemainingAmount,
        attemptingToPay: values.amount,
        willExceed: values.amount > currentRemainingAmount
      });

      // Không cho thanh toán vượt quá số tiền còn phải trả
      if (values.amount > currentRemainingAmount) {
        const totalPaid = totalPaymentFromTicket - currentRemainingAmount;
        toast.error('Số tiền không được vượt quá số tiền còn phải trả cho khách', {
          description: `Đã trả: ${totalPaid.toLocaleString('vi-VN')} đ\nCòn lại: ${currentRemainingAmount.toLocaleString('vi-VN')} đ`,
          duration: 5000,
        });
        return;
      }

      // Determine payment type and method based on settlement type
      let paymentType = warrantyRefundType;
      let selectedPaymentMethod = paymentMethods.find(m => m.systemId === values.paymentMethodSystemId);
      let linkedOrderSystemId: string | undefined;

      if (values.settlementType === 'order_deduction') {
        // Trừ vào đơn hàng - use TRAVAO_DONHANG type
        paymentType = warrantyOrderDeductionType;
        linkedOrderSystemId = values.selectedOrderId;
        
        if (!linkedOrderSystemId) {
          toast.error('Vui lòng chọn đơn hàng');
          return;
        }
        
        // ✅ ADDITIONAL VALIDATION: Kiểm tra số tiền không vượt quá số dư đơn hàng
        if (selectedOrder) {
          const orderPaidAmount = selectedOrder.paidAmount || 0;
          const orderRemainingAmount = selectedOrder.grandTotal - orderPaidAmount;
          if (values.amount > orderRemainingAmount) {
            toast.error('Số tiền không được vượt quá số dư đơn hàng', {
              description: `Còn lại: ${orderRemainingAmount.toLocaleString('vi-VN')} đ`,
              duration: 5000,
            });
            return;
          }
        }
      }

      // Validation
      if (!paymentType) {
        toast.error('Không tìm thấy loại phiếu chi phù hợp trong cài đặt');
        return;
      }

      if (!selectedPaymentMethod) {
        selectedPaymentMethod = defaultPaymentMethod;
      }

      if (!selectedPaymentMethod) {
        toast.error('Không tìm thấy phương thức thanh toán');
        return;
      }

      // Validate account for direct payment
      if (values.settlementType === 'direct_payment' && !values.accountSystemId) {
        toast.error('Vui lòng chọn tài khoản chi');
        return;
      }

      const settlementRecordType: SettlementType = values.settlementType === 'order_deduction'
        ? 'order_deduction'
        : detectDirectSettlementType(selectedPaymentMethod);

      const payment: Omit<Payment, 'systemId'> = {
        id: asBusinessId(''), // Let store generate PC-XXXXXX ID
        date: toISODateTime(now) || now.toISOString(),
        amount: values.amount,
        
        // Recipient info (TargetGroup)
        recipientTypeSystemId: asSystemId('KHACHHANG'), // TODO: Get KHACHHANG systemId from TargetGroup
        recipientTypeName: 'Khách hàng',
        recipientName: customer.name,
        recipientSystemId: undefined, // TODO: Get customer systemId if needed
        
        description: values.notes || `Hoàn tiền bảo hành ${warrantyId}`,
        
        // Payment Method - From settings
        paymentMethodSystemId: selectedPaymentMethod.systemId,
        paymentMethodName: selectedPaymentMethod.name,
        
        // Account & Type - From settings
        accountSystemId: asSystemId(values.accountSystemId || ''),
        paymentReceiptTypeSystemId: paymentType.systemId,
        paymentReceiptTypeName: paymentType.name,
        
        // Branch info
        branchSystemId: asSystemId(branchSystemId || ''),
        branchName: branchName || '',
        
        // Status & Category
        status: 'completed', // Xuất tiền luôn
        category: 'warranty_refund',
        
        // Links to warranty and order
        linkedWarrantySystemId: asSystemId(warrantySystemId), // Link đến phiếu bảo hành
        linkedOrderSystemId: linkedOrderSystemId ? asSystemId(linkedOrderSystemId) : undefined, // Link đến đơn hàng (nếu trừ vào đơn)
        originalDocumentId: warrantyId,
        customerSystemId: undefined,
        customerName: customer.name,
        
        // Financial
        affectsDebt: false,
        
        createdBy: asSystemId(currentUserSystemId),
        createdAt: toISODateTime(now) || now.toISOString(),
      };

      const newPayment = addPayment(payment);

      // ============================================================
      // UPDATE ORDER if this is order_deduction
      // ============================================================
      if (linkedOrderSystemId) {
        const order = orders.find(o => o.systemId === linkedOrderSystemId);
        if (order) {
          // Create OrderPayment object
          const orderPayment = {
            systemId: newPayment.systemId,
            id: newPayment.id,
            date: newPayment.date,
            method: selectedPaymentMethod?.name || 'N/A',
            amount: -values.amount, // ÂM vì đây là trả tiền khách (giảm công nợ)
            createdBy: newPayment.createdBy,
            description: `Trừ tiền bảo hành ${warrantyId}`,
            linkedWarrantySystemId: warrantySystemId,
          };

          // Update order: add payment and increase paidAmount
          const updatedPayments = [...order.payments, orderPayment];
          const newPaidAmount = (order.paidAmount || 0) + values.amount;

          updateOrder(linkedOrderSystemId, {
            payments: updatedPayments,
            paidAmount: newPaidAmount,
          });
        }
      }

      // Add history to warranty với metadata
      const settlementLabel = values.settlementType === 'order_deduction' 
        ? `Trừ vào đơn hàng (${paymentType.name})` 
        : `${selectedPaymentMethod.name} (${paymentType.name})`;
      
      addHistory(
        asSystemId(warrantySystemId), 
        `Tạo phiếu chi ${newPayment.id}`,
        currentUserName,
        `Số tiền: ${values.amount.toLocaleString('vi-VN')}đ - Phương thức: ${settlementLabel}`,
        { paymentSystemId: newPayment.systemId } // ✅ Lưu systemId vào metadata
      );

      recordWarrantySettlementMethods({
        ticket,
        settlementType: settlementRecordType,
        totalAmount: totalPaymentFromTicket,
        methods: [{
          type: settlementRecordType,
          amount: values.amount,
          status: 'completed',
          paymentVoucherId: newPayment.systemId,
          linkedOrderSystemId: linkedOrderSystemId ? asSystemId(linkedOrderSystemId) : undefined,
          notes: settlementLabel,
          createdAt: newPayment.createdAt,
          completedAt: newPayment.status === 'completed' ? newPayment.createdAt : undefined,
        }],
      });

      toast.success(`Đã tạo phiếu chi ${newPayment.id}`, {
        description: `Đã xuất tiền (${values.amount.toLocaleString('vi-VN')} đ)`,
        action: {
          label: 'Xem phiếu chi',
          onClick: () => navigate(`/payments/${newPayment.systemId}`),
        },
      });

      setOpen(false);
    } catch (error) {
      console.error('Error creating payment voucher:', error);
      toast.error('Không thể tạo phiếu chi');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="default" 
          size="lg"
          className="h-9 flex-1"
        >
          Tạo phiếu chi
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo phiếu chi - Hoàn tiền bảo hành</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Warning if payment types not found */}
          {(!warrantyRefundType || !warrantyOrderDeductionType) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Thiếu cấu hình:</strong> Không tìm thấy loại phiếu chi phù hợp trong cài đặt.
                Vui lòng vào <strong>Cài đặt {'>'} Loại phiếu chi</strong> để kiểm tra các loại:
                <ul className="mt-2 ml-4 list-disc text-sm">
                  {!warrantyRefundType && <li><strong>HOANTIEN_BH</strong> - Hoàn tiền bảo hành</li>}
                  {!warrantyOrderDeductionType && <li><strong>TRAVAO_DONHANG</strong> - Trả bảo hành vào đơn hàng</li>}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Warranty Info */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">Phiếu bảo hành:</span>
                <span className="font-mono">{warrantyId}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Khách hàng:</span>
                <span>{customer.name} • {customer.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Cần bù trừ:</span>
                <span className="font-semibold text-red-600">{actualRemainingAmount.toLocaleString('vi-VN')} đ</span>
              </div>
            </AlertDescription>
          </Alert>


          {/* Settlement Type */}
          <div className="space-y-2">
            <Label htmlFor="settlementType">Phương thức *</Label>
            <Controller
              name="settlementType"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="settlementType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct_payment">Trả tiền trực tiếp</SelectItem>
                    <SelectItem value="order_deduction">Trừ vào đơn hàng</SelectItem>
                    <SelectItem value="mixed">Bù trừ đơn + Chi tiền</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Payment Method - Show for direct payment and mixed (cash portion) */}
          {(settlementType === 'direct_payment' || settlementType === 'mixed') && (
            <>
              <div className="space-y-2">
                <Label htmlFor="paymentMethodSystemId">Hình thức thanh toán *</Label>
                <Controller
                  name="paymentMethodSystemId"
                  control={control}
                  rules={{ required: settlementType === 'direct_payment' || settlementType === 'mixed' }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="paymentMethodSystemId">
                        <SelectValue placeholder="-- Chọn hình thức --" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.filter(m => m.isActive).map((method) => (
                          <SelectItem key={method.systemId} value={method.systemId}>
                            <div className="flex items-center gap-2">
                              <span>{method.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  Chọn hình thức thanh toán phù hợp từ cài đặt hệ thống
                </p>
              </div>

              {/* Account Selection - Show for direct payment */}
              <div className="space-y-2">
                <Label htmlFor="accountSystemId">Tài khoản chi *</Label>
                <Controller
                  name="accountSystemId"
                  control={control}
                  rules={{ required: settlementType === 'direct_payment' || settlementType === 'mixed' }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="accountSystemId">
                        <SelectValue placeholder="-- Chọn tài khoản --" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredAccounts.length === 0 ? (
                          <div className="p-4 text-sm text-muted-foreground text-center">
                            Không có tài khoản khả dụng
                          </div>
                        ) : (
                          filteredAccounts.map((account) => (
                            <SelectItem key={account.systemId} value={account.systemId}>
                              <div className="flex items-center gap-2">
                                <span>{account.name}</span>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  {selectedPaymentMethod?.name === 'Tiền mặt' 
                    ? 'Hiển thị tài khoản quỹ tiền mặt' 
                    : 'Hiển thị tài khoản ngân hàng'}
                </p>
              </div>
            </>
          )}

          {/* Order Selection - Show for order deduction and mixed */}
          {(settlementType === 'order_deduction' || settlementType === 'mixed') && (
            <div className="space-y-2">
              <Label htmlFor="selectedOrderId">Chọn đơn hàng *</Label>
              <div className="text-xs text-muted-foreground mb-2">
                Nhập mã đơn hàng hoặc tên khách để tìm nhanh. 
                Hệ thống tự động lọc kết quả từ đơn hàng.
              </div>
              <VirtualizedCombobox
                options={orderSearchResults}
                value={selectedOrderValue}
                onChange={(option) => setValue('selectedOrderId', option?.value || '')}
                onSearchChange={(query) => setOrderSearchQuery(query)}
                placeholder="Tìm kiếm đơn hàng..."
                searchPlaceholder="Nhập mã đơn hoặc tên khách hàng..."
                emptyPlaceholder={
                  orderSearchQuery 
                    ? "Không tìm thấy đơn hàng phù hợp" 
                    : "Nhập từ khóa để tìm kiếm đơn hàng"
                }
                isLoading={isSearchingOrders}
                minSearchLength={0}
                estimatedItemHeight={56}
                maxHeight={400}
              />
              <p className="text-xs text-muted-foreground">
                Chỉ hiển thị đơn hàng <strong>chưa xuất kho</strong> và <strong>còn số dư có thể trừ</strong>.
              </p>
            </div>
          )}

          {shouldShowInsufficientWarning && (
            <Alert className="border-yellow-400 bg-yellow-50 text-yellow-900">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 mt-0.5" />
                <div className="space-y-1 text-sm">
                  <p className="font-medium">Đơn {selectedOrder?.id} không đủ để trừ toàn bộ.</p>
                  <p className="text-xs">
                    Thiếu <strong>{shortageAmount.toLocaleString('vi-VN')} đ</strong> so với số tiền cần hoàn. Chọn cách xử lý bên dưới.
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="mt-1"
                    onClick={() => setInsufficientDialogOpen(true)}
                  >
                    Mở gợi ý xử lý
                  </Button>
                </div>
              </div>
            </Alert>
          )}
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Số tiền *</Label>
            <Controller
              name="amount"
              control={control}
              rules={{ 
                required: 'Vui lòng nhập số tiền',
                min: { value: 1, message: 'Số tiền phải lớn hơn 0' },
                max: { 
                  value: maxAmount, 
                  message: settlementType === 'order_deduction' && selectedOrder
                    ? (() => {
                        const orderPaidAmount = selectedOrder.paidAmount || 0;
                        const orderRemainingAmount = selectedOrder.grandTotal - orderPaidAmount;
                        return `Số tiền không được vượt quá số tiền còn lại của đơn hàng (${orderRemainingAmount.toLocaleString('vi-VN')} đ)`;
                      })()
                    : `Số tiền không được vượt quá ${actualRemainingAmount.toLocaleString('vi-VN')} đ`
                }
              }}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <CurrencyInput
                    value={field.value}
                    onChange={field.onChange}
                    disabled={settlementType === 'mixed'}
                    placeholder="0"
                  />
                  {fieldState.error && (
                    <p className="text-xs text-destructive">{fieldState.error.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {settlementType === 'order_deduction' && selectedOrder ? (
                      <>
                        {(() => {
                          const orderPaidAmount = selectedOrder.paidAmount || 0;
                          const orderRemainingAmount = selectedOrder.grandTotal - orderPaidAmount;
                          const maxAllowed = Math.min(actualRemainingAmount, orderRemainingAmount);
                          
                          return (
                            <>
                              Số tiền tối đa: {maxAllowed.toLocaleString('vi-VN')} đ
                              {orderPaidAmount > 0 && (
                                <span className="text-blue-600 font-medium">
                                  {' '}(Đã trừ: {orderPaidAmount.toLocaleString('vi-VN')} đ / {selectedOrder.grandTotal.toLocaleString('vi-VN')} đ)
                                </span>
                              )}
                            </>
                          );
                        })()}
                      </>
                    ) : settlementType === 'mixed' ? (
                      `Tiền mặt cần chi: ${(mixedCashAmount || 0).toLocaleString('vi-VN')} đ (tự động từ phần bù trừ)`
                    ) : (
                      `Số tiền tối đa: ${actualRemainingAmount.toLocaleString('vi-VN')} đ`
                    )}
                  </p>
                </div>
              )}
            />
          </div>

          {settlementType === 'mixed' && (
            <div className="space-y-3 rounded-lg border p-3 bg-muted/40">
              <div className="text-sm font-medium">Phân bổ bù trừ</div>
              <div className="text-xs text-muted-foreground">
                Tổng cần hoàn: <strong>{actualRemainingAmount.toLocaleString('vi-VN')} đ</strong>. Điều chỉnh số tiền trừ vào đơn, phần còn lại sẽ chi trực tiếp.
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <Label>Trừ vào đơn</Label>
                  <CurrencyInput
                    value={mixedOrderAmount || 0}
                    onChange={(value) => setValue('mixedOrderAmount', value || 0, { shouldValidate: true, shouldDirty: true })}
                    max={orderRemainingAmount}
                    min={0}
                  />
                  <p className="text-xs text-muted-foreground">
                    Tối đa: {orderRemainingAmount.toLocaleString('vi-VN')} đ
                  </p>
                </div>
                <div className="space-y-1">
                  <Label>Chi trực tiếp</Label>
                  <div className="rounded-md border bg-background px-3 py-2 text-right font-semibold">
                    {(mixedCashAmount || 0).toLocaleString('vi-VN')} đ
                  </div>
                  <p className="text-xs text-muted-foreground">Tự động tính = Tổng cần hoàn - Trừ vào đơn</p>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú</Label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  id="notes"
                  placeholder="Thêm ghi chú cho phiếu chi..."
                  rows={3}
                />
              )}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button type="submit">
              Tạo phiếu chi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

      <InsufficientBalanceDialog
        open={insufficientDialogOpen}
        onOpenChange={setInsufficientDialogOpen}
        totalAmount={actualRemainingAmount}
        orderAmount={orderRemainingAmount}
        shortageAmount={shortageAmount}
        orderLabel={selectedOrder?.id}
        onSelectMixed={applyMixedSuggestion}
        onSelectCashOnly={applyCashOnlySuggestion}
      />
    </Dialog>
  );
}
