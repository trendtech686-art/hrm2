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
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '../../../../components/ui/dialog';
import { Button } from '../../../../components/ui/button';
import { Label } from '../../../../components/ui/label';
import { CurrencyInput } from '../../../../components/ui/currency-input';
import { Textarea } from '../../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Alert, AlertDescription } from '../../../../components/ui/alert';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { usePaymentMutations } from '../../../payments/hooks/use-payments';
import { useWarrantyPayments, useWarrantyReceipts } from '../../hooks/use-warranty-financial-data';
// addHistory was a Zustand store mutator (now deleted) - history is tracked in DB via mutations
const addHistory = (..._args: unknown[]) => { /* no-op: store removed, history tracked in DB */ };
import { useOrderMutations } from '../../../orders/hooks/use-order-mutations';
import type { Order } from '@/lib/types/prisma-extended';
import { useQuery } from '@tanstack/react-query';
import { useWarranty } from '../../hooks/use-warranties';
import type { SettlementType, WarrantyVoucherDialogBaseProps } from '../../types';
import { useAllPaymentTypes } from '../../../settings/payments/types/hooks/use-all-payment-types';
import { useAllPaymentMethods } from '../../../settings/payments/hooks/use-all-payment-methods';
import { useAllCashAccounts } from '../../../cashbook/hooks/use-all-cash-accounts';
import { toISODateTime } from '../../../../lib/date-utils';
import { searchOrders, type OrderSearchResult } from '../../../orders/order-search-api';
import { VirtualizedCombobox } from '../../../../components/ui/virtualized-combobox';
import type { Payment } from '../../../payments/types';
import { useAuth } from '../../../../contexts/auth-context';
import { asSystemId, asBusinessId } from '@/lib/id-types';
import { calculateWarrantyProcessingState } from '../logic/processing';
import { calculateWarrantySettlementTotal } from '../../utils/payment-calculations';
import { recordWarrantySettlementMethods, type SettlementMethodInput } from '../../utils/settlement-store';
import { logError } from '@/lib/logger'

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

const detectDirectSettlementType = (paymentMethod?: { id?: string; name: string } | null): Exclude<SettlementType, 'mixed'> => {
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
};

/**
 * Calculate the actual deductible amount for an order.
 * Accounts for: paidAmount, active COD, and linked sales return value.
 */
function getOrderDeductibleAmount(order: Order): number {
  const paidAmount = order.paidAmount || 0;
  const linkedReturnValue = order.linkedSalesReturnValue || 0;
  // Sum COD from active (non-cancelled) packagings
  const activeCodAmount = (order.packagings || []).reduce((sum, pkg) => {
    if (pkg.status === 'Hủy đóng gói') return sum;
    return sum + (pkg.codAmount || 0);
  }, 0);
  return Math.max(0, order.grandTotal - paidAmount - activeCodAmount - linkedReturnValue);
}

export function WarrantyPaymentVoucherDialog({
  warrantyId,
  warrantySystemId,
  customer,
  linkedOrderId,
  branchSystemId,
  branchName,
}: WarrantyPaymentVoucherDialogProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  
  const { create: createPayment } = usePaymentMutations({});
  // ⚡ PERFORMANCE: Only fetch data for this specific warranty
  const { data: payments } = useWarrantyPayments(warrantySystemId);
  const { data: receipts } = useWarrantyReceipts(warrantySystemId);
  // Fetch only this customer's unpaid orders (NOT all orders)
  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ['orders', 'customer', customer.systemId, 'unpaid'],
    queryFn: async () => {
      if (!customer.systemId) return [];
      const params = new URLSearchParams();
      params.set('customerSystemId', customer.systemId);
      params.set('paymentStatusNot', 'PAID');
      params.set('limit', '200');
      const res = await fetch(`/api/orders?${params}`);
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || [];
    },
    enabled: open && !!customer.systemId,
    staleTime: 5 * 60 * 1000,
  });
  const { update: updateOrder } = useOrderMutations();
  // ✅ Phase 14: useWarranty(id) single-item thay vì useWarrantyFinder (ALL warranties)
  const { data: ticket } = useWarranty(warrantySystemId);
  const { data: paymentTypes } = useAllPaymentTypes({ enabled: open });
  const { data: paymentMethods } = useAllPaymentMethods({ enabled: open });
  const { accounts } = useAllCashAccounts({ enabled: open });
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

  // Get default account matching the default payment method type
  const defaultAccountForMethod = React.useMemo(() => {
    const methodType = defaultPaymentMethod?.type;
    if (methodType) {
      return accounts.find(a => a.type === methodType && a.isDefault && a.isActive) ||
             accounts.find(a => a.type === methodType && a.isActive) ||
             accounts.find(a => a.isDefault && a.isActive) ||
             accounts.find(a => a.isActive);
    }
    return defaultCashAccount;
  }, [accounts, defaultPaymentMethod, defaultCashAccount]);

  // ✅ Tính số tiền còn lại THỰC TẾ dùng warranty-processing-logic
  const actualRemainingAmount = React.useMemo(() => {
    // ✅ Tính lại từ ticket thực tế, KHÔNG dùng defaultAmount (vì nó đã bị trừ)
    if (!ticket) return 0;
    
    // Tính totalPayment từ ticket - dùng calculateWarrantySettlementTotal (outOfStock - shippingFee)
    const totalPaymentFromTicket = calculateWarrantySettlementTotal(ticket);
    
    const state = calculateWarrantyProcessingState(ticket, payments, receipts, totalPaymentFromTicket);
    
    
    return state.remainingAmount;
  }, [ticket, payments, receipts]);

  const { control, handleSubmit, watch, reset, setValue } = useForm<FormValues>({
    defaultValues: {
      amount: 0, // Sẽ được set trong useEffect
      settlementType: 'direct_payment',
      paymentMethodSystemId: defaultPaymentMethod?.systemId,
      accountSystemId: defaultAccountForMethod?.systemId,
      selectedOrderId: '',
      notes: `Hoàn tiền bảo hành ${warrantyId}`,
      mixedOrderAmount: undefined,
      mixedCashAmount: undefined,
    },
  });

  const settlementType = watch('settlementType');
  const selectedOrderId = watch('selectedOrderId');
  const paymentMethodSystemId = watch('paymentMethodSystemId');
  const _accountSystemId = watch('accountSystemId');
  const amount = watch('amount');
  const mixedOrderAmount = watch('mixedOrderAmount');
  const mixedCashAmount = watch('mixedCashAmount');

  // Get selected payment method to determine account type
  const selectedPaymentMethod = React.useMemo(() => 
    paymentMethods.find(m => m.systemId === paymentMethodSystemId),
    [paymentMethods, paymentMethodSystemId]
  );

  // Filter accounts - so sánh trực tiếp type từ DB
  const filteredAccounts = React.useMemo(() => {
    const active = accounts.filter(a => a.isActive);
    if (!selectedPaymentMethod?.type) return active;
    
    const matched = active.filter(a => a.type === selectedPaymentMethod.type);
    return matched.length > 0 ? matched : active;
  }, [accounts, selectedPaymentMethod]);

  // Auto-select appropriate account when payment method changes
  React.useEffect(() => {
    if (!selectedPaymentMethod) return;
    if (settlementType !== 'direct_payment' && !needsCashSupplement) return;
    
    // So sánh trực tiếp type từ DB
    const methodType = selectedPaymentMethod.type;
    
    // Tìm account mặc định có type khớp, nếu không khớp thì lấy account mặc định bất kỳ
    const defaultAccount = methodType
      ? (accounts.find(a => a.type === methodType && a.isDefault && a.isActive) ||
         accounts.find(a => a.type === methodType && a.isActive) ||
         accounts.find(a => a.isDefault && a.isActive) || accounts.find(a => a.isActive))
      : (accounts.find(a => a.isDefault && a.isActive) || accounts.find(a => a.isActive));
    
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
        accountSystemId: defaultAccountForMethod?.systemId,
        selectedOrderId: '',
        notes: `Hoàn tiền bảo hành ${warrantyId}`,
        mixedOrderAmount: undefined,
        mixedCashAmount: undefined,
      });
    }
  }, [open, warrantyId, reset, defaultPaymentMethod, defaultAccountForMethod, actualRemainingAmount]);

  // Server-side search for orders with debounce
  React.useEffect(() => {
    if (!open || !customer.systemId) return;
    
    const performSearch = async () => {
      setIsSearchingOrders(true);
      try {
        const results = await searchOrders({ query: orderSearchQuery, limit: 50, paymentStatusNot: 'PAID', customerSystemId: customer.systemId });
        
        // Enrich results with deductible amount from local orders data
        const enrichedResults = results
          .map(result => {
            const order = orders.find(o => o.systemId === result.value);
            if (!order) return null;
            
            const deductible = getOrderDeductibleAmount(order);
            if (deductible <= 0) return null;
            
            let formattedDate = '';
            try {
              const d = new Date(order.orderDate);
              formattedDate = !isNaN(d.getTime())
                ? d.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                : String(order.orderDate);
            } catch { formattedDate = String(order.orderDate); }

            return {
              ...result,
              subtitle: `${order.grandTotal.toLocaleString('vi-VN')} đ • Còn lại: ${deductible.toLocaleString('vi-VN')} đ • ${formattedDate}`,
            };
          })
          .filter(Boolean) as OrderSearchResult[];
        
        setOrderSearchResults(enrichedResults);
      } catch (error) {
        logError('Order search error', error);
        setOrderSearchResults([]);
      } finally {
        setIsSearchingOrders(false);
      }
    };

    performSearch();
  }, [open, orderSearchQuery, orders, customer.systemId]);

  // Memoize selected order value for VirtualizedCombobox
  const selectedOrderValue = React.useMemo(() => {
    if (!selectedOrderId) return null;
    const order = orders.find(o => o.systemId === selectedOrderId);
    if (!order) return null;
    
    const deductible = getOrderDeductibleAmount(order);
    
    // Format date properly
    let formattedDate = '';
    try {
      const d = new Date(order.orderDate);
      formattedDate = !isNaN(d.getTime())
        ? d.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        : String(order.orderDate);
    } catch { formattedDate = String(order.orderDate); }

    return {
      value: order.systemId,
      label: `${order.id} - ${order.customerName}`,
      subtitle: `${order.grandTotal.toLocaleString('vi-VN')} đ • Còn lại: ${deductible.toLocaleString('vi-VN')} đ • ${formattedDate}`
    };
  }, [selectedOrderId, orders]);

  // Get selected order details for validation
  const selectedOrder = React.useMemo(() => 
    orders.find(o => o.systemId === selectedOrderId),
    [orders, selectedOrderId]
  );

  const orderRemainingAmount = React.useMemo(() => {
    if (!selectedOrder) return 0;
    return getOrderDeductibleAmount(selectedOrder);
  }, [selectedOrder]);

  // Detect if the selected order doesn't have enough balance for full deduction
  const needsCashSupplement = React.useMemo(() => {
    if (settlementType !== 'order_deduction' || !selectedOrder) return false;
    return orderRemainingAmount < actualRemainingAmount;
  }, [settlementType, selectedOrder, orderRemainingAmount, actualRemainingAmount]);

  // Auto-calculate mixed amounts when order is insufficient
  const autoOrderAmount = React.useMemo(() => {
    if (!needsCashSupplement || !selectedOrder) return 0;
    return Math.min(orderRemainingAmount, actualRemainingAmount);
  }, [needsCashSupplement, selectedOrder, orderRemainingAmount, actualRemainingAmount]);

  const autoCashAmount = React.useMemo(() => {
    if (!needsCashSupplement) return 0;
    return Math.max(actualRemainingAmount - autoOrderAmount, 0);
  }, [needsCashSupplement, actualRemainingAmount, autoOrderAmount]);

  // Auto-set mixed values when insufficient order detected
  React.useEffect(() => {
    if (needsCashSupplement) {
      setValue('mixedOrderAmount', autoOrderAmount, { shouldValidate: true });
      setValue('mixedCashAmount', autoCashAmount, { shouldValidate: true });
      setValue('amount', autoCashAmount, { shouldValidate: true });
    }
  }, [needsCashSupplement, autoOrderAmount, autoCashAmount, setValue]);

  // Calculate max amount based on settlement type
  const maxAmount = React.useMemo(() => {
    if (settlementType === 'order_deduction') {
      if (needsCashSupplement) {
        // Mixed: amount field = cash portion
        return autoCashAmount;
      }
      if (selectedOrder) {
        // Pure deduction: max = min(remaining, order deductible)
        return Math.min(actualRemainingAmount, getOrderDeductibleAmount(selectedOrder));
      }
    }
    // Direct payment: max = actualRemainingAmount
    return actualRemainingAmount;
  }, [settlementType, selectedOrder, actualRemainingAmount, needsCashSupplement, autoCashAmount]);

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

    const orderRemainingAmountForOrder = getOrderDeductibleAmount(order);
    if (orderAmount > orderRemainingAmountForOrder) {
      toast.error('Số tiền trừ vào đơn vượt quá số dư của đơn hàng', {
        description: `Còn lại: ${orderRemainingAmountForOrder.toLocaleString('vi-VN')} đ`,
      });
      return;
    }

    const latestPayments = payments;
    const latestReceipts = receipts;
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
      accountSystemId: defaultCashAccount?.systemId ?? asSystemId(''), // Virtual deduction — no real cash account
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
      affectsBusinessReport: false,
      createdBy: asSystemId(currentUserSystemId),
      createdAt: isoNow,
    };

    const orderPayment = await createPayment.mutateAsync(orderDeductionPayment);

    const orderPaymentEntry = {
      id: orderPayment.id,
      date: orderPayment.date,
      method: 'Bù trừ bảo hành',
      amount: orderAmount,
      createdBy: orderPayment.createdBy,
      description: `Trừ tiền bảo hành ${warrantyId}`,
      linkedWarrantySystemId: warrantySystemId,
    };

    await updateOrder.mutateAsync({
      id: order.systemId,
      payments: [orderPaymentEntry],
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
      paymentMethodSystemId: asSystemId(selectedPaymentMethod.systemId as string),
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
      affectsBusinessReport: false,
      createdBy: asSystemId(currentUserSystemId),
      createdAt: isoNow,
    };

    const cashPaymentResult = await createPayment.mutateAsync(cashPayment);

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

    toast.success('Đã xử lý bù trừ + chi tiền', {
      description: `Trừ ${orderAmount.toLocaleString('vi-VN')} đ vào ${order.id} + Chi ${cashAmount.toLocaleString('vi-VN')} đ`,
      action: {
        label: 'Xem phiếu chi',
        onClick: () => router.push(`/payments/${cashPaymentResult.systemId}`),
      },
    });
  };

  const onSubmit = async (values: FormValues) => {
    try {
      // If order_deduction with insufficient order balance → use mixed settlement
      if (values.settlementType === 'order_deduction' && needsCashSupplement) {
        await handleMixedSettlement({
          ...values,
          settlementType: 'mixed',
          mixedOrderAmount: autoOrderAmount,
          mixedCashAmount: autoCashAmount,
          amount: autoCashAmount,
        });
        setOpen(false);
        return;
      }

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
          const orderDeductible = getOrderDeductibleAmount(selectedOrder);
          if (values.amount > orderDeductible) {
            toast.error('Số tiền không được vượt quá số dư đơn hàng', {
              description: `Còn lại: ${orderDeductible.toLocaleString('vi-VN')} đ`,
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
        paymentMethodSystemId: asSystemId(selectedPaymentMethod.systemId as string),
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
        affectsBusinessReport: false,
        
        createdBy: asSystemId(currentUserSystemId),
        createdAt: toISODateTime(now) || now.toISOString(),
      };

      const newPayment = await createPayment.mutateAsync(payment);

      // ============================================================
      // UPDATE ORDER if this is order_deduction
      // ============================================================
      if (linkedOrderSystemId) {
        const order = orders.find(o => o.systemId === linkedOrderSystemId);
        if (order) {
          // Create OrderPayment entry for the order's payment history
          const orderPayment = {
            id: newPayment.id,
            date: newPayment.date,
            method: selectedPaymentMethod?.name || 'N/A',
            amount: values.amount,
            createdBy: newPayment.createdBy,
            description: `Trừ tiền bảo hành ${warrantyId}`,
            linkedWarrantySystemId: warrantySystemId,
          };

          // Send only the new payment (PATCH handler creates OrderPayment records)
          const newPaidAmount = (order.paidAmount || 0) + values.amount;

          await updateOrder.mutateAsync({
            id: asSystemId(linkedOrderSystemId),
            payments: [orderPayment],
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
          onClick: () => router.push(`/payments/${newPayment.systemId}`),
        },
      });

      setOpen(false);
    } catch (error) {
      logError('Error creating payment voucher', error);
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
      
      <DialogContent mobileFullScreen className="max-w-2xl max-h-[90vh] overflow-y-auto">
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


          {/* Settlement Type - 2 options only */}
          <div className="space-y-2">
            <Label htmlFor="settlementType">Phương thức *</Label>
            <Controller
              name="settlementType"
              control={control}
              render={({ field }) => (
                <Select value={field.value === 'mixed' ? 'order_deduction' : field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="settlementType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct_payment">Trả tiền trực tiếp</SelectItem>
                    <SelectItem value="order_deduction">Trừ vào đơn hàng</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Payment Method & Account - Show for: direct_payment OR order_deduction when order doesn't have enough */}
          {(settlementType === 'direct_payment' || needsCashSupplement) && (
            <>
              <div className="space-y-2">
                <Label htmlFor="paymentMethodSystemId">Hình thức thanh toán *</Label>
                <Controller
                  name="paymentMethodSystemId"
                  control={control}
                  rules={{ required: settlementType === 'direct_payment' || needsCashSupplement }}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="paymentMethodSystemId">
                        <SelectValue placeholder="-- Chọn hình thức --" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.filter(m => m.isActive).map((method) => (
                          <SelectItem key={method.systemId} value={method.systemId}>
                            {method.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {needsCashSupplement && (
                  <p className="text-xs text-muted-foreground">
                    Chọn hình thức thanh toán cho phần chi trực tiếp
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountSystemId">Tài khoản chi *</Label>
                <Controller
                  name="accountSystemId"
                  control={control}
                  rules={{ required: settlementType === 'direct_payment' || needsCashSupplement }}
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
                              {account.name}
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

          {/* Order Selection - Show for order_deduction */}
          {settlementType === 'order_deduction' && (
            <div className="space-y-2">
              <Label htmlFor="selectedOrderId">Chọn đơn hàng *</Label>
              <div className="text-xs text-muted-foreground mb-2">
                Nhập mã đơn hàng hoặc tên khách để tìm nhanh.
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
                maxHeight={280}
              />
              <p className="text-xs text-muted-foreground">
                Chỉ hiển thị đơn hàng <strong>chưa thanh toán</strong> và <strong>còn số dư có thể trừ</strong>.
              </p>
            </div>
          )}

          {/* Insufficient order balance — auto mixed breakdown */}
          {needsCashSupplement && selectedOrder && (
            <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
              <div className="flex items-center gap-2 text-sm font-medium text-amber-900">
                <AlertTriangle className="h-4 w-4" />
                Đơn {selectedOrder.id} không đủ số dư — hệ thống tự phân bổ
              </div>
              <div className="grid gap-2 md:grid-cols-2 text-sm">
                <div className="rounded-md border border-border bg-card px-3 py-2">
                  <div className="text-xs text-muted-foreground">Trừ vào đơn {selectedOrder.id}</div>
                  <div className="font-semibold">{autoOrderAmount.toLocaleString('vi-VN')} đ</div>
                </div>
                <div className="rounded-md border border-border bg-card px-3 py-2">
                  <div className="text-xs text-muted-foreground">Chi trực tiếp cho khách</div>
                  <div className="font-semibold text-red-600">{autoCashAmount.toLocaleString('vi-VN')} đ</div>
                </div>
              </div>
            </div>
          )}

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">
              {needsCashSupplement ? 'Số tiền chi trực tiếp *' : 'Số tiền *'}
            </Label>
            <Controller
              name="amount"
              control={control}
              rules={{ 
                required: 'Vui lòng nhập số tiền',
                min: { value: 1, message: 'Số tiền phải lớn hơn 0' },
                max: { 
                  value: maxAmount, 
                  message: `Số tiền không được vượt quá ${maxAmount.toLocaleString('vi-VN')} đ`
                }
              }}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <CurrencyInput
                    value={field.value}
                    onChange={field.onChange}
                    disabled={needsCashSupplement}
                    placeholder="0"
                  />
                  {fieldState.error && (
                    <p className="text-xs text-destructive">{fieldState.error.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Số tiền tối đa: {maxAmount.toLocaleString('vi-VN')} đ
                  </p>
                </div>
              )}
            />
          </div>

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

    </Dialog>
  );
}
