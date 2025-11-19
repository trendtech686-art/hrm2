/**
 * CreatePaymentVoucherDialog
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
} from '../../../components/ui/dialog.tsx';
import { Button } from '../../../components/ui/button.tsx';
import { Label } from '../../../components/ui/label.tsx';
import { Input } from '../../../components/ui/input.tsx';
import { CurrencyInput } from '../../../components/ui/currency-input.tsx';
import { Textarea } from '../../../components/ui/textarea.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select.tsx';
import { Alert, AlertDescription } from '../../../components/ui/alert.tsx';
import { Badge } from '../../../components/ui/badge.tsx';
import { Minus, AlertCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { usePaymentStore } from '../../payments/store.ts';
import { useReceiptStore } from '../../receipts/store.ts';
import { useOrderStore } from '../../orders/store.ts';
import { useWarrantyStore } from '../store.ts';
import type { WarrantyVoucherDialogBaseProps } from '../types.ts';
import { usePaymentTypeStore } from '../../settings/payments/types/store.ts';
import { usePaymentMethodStore } from '../../settings/payments/methods/store.ts';
import { useCashbookStore } from '../../cashbook/store.ts';
import { toISODateTime } from '../../../lib/date-utils.ts';
import { searchOrders, type OrderSearchResult } from '../../orders/order-search-api.ts';
import { VirtualizedCombobox } from '../../../components/ui/virtualized-combobox.tsx';
import type { Payment } from '../../payments/types.ts';
import { useAuth } from '../../../contexts/auth-context.tsx';
import { asSystemId, asBusinessId } from '@/lib/id-types';
// import { calculateWarrantyProcessingState } from './warranty-processing-logic.ts'; // TODO: Create this file
import { calculateWarrantySettlementTotal } from '../utils/payment-calculations.ts';
import { useWarrantySettlement } from '../hooks/use-warranty-settlement.ts';

interface CreatePaymentVoucherDialogProps extends WarrantyVoucherDialogBaseProps {
  existingPayments?: Payment[];
}

interface FormValues {
  amount: number;
  settlementType: 'order_deduction' | 'direct_payment';
  paymentMethodSystemId?: string;
  accountSystemId?: string;
  selectedOrderId?: string;
  notes: string;
}

export function CreatePaymentVoucherDialog({
  warrantyId,
  warrantySystemId,
  customer,
  defaultAmount = 0,
  linkedOrderId,
  branchSystemId,
  branchName,
  existingPayments = [],
}: CreatePaymentVoucherDialogProps) {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  
  const { add: addPayment, data: payments } = usePaymentStore();
  const { data: receipts } = useReceiptStore();
  const { data: orders, update: updateOrder } = useOrderStore();
  const { addHistory } = useWarrantyStore();
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

  const {
    ticket,
    totalPayment: totalSettlementAmount,
    remainingAmount: actualRemainingAmount,
    processingState: settlementState,
  } = useWarrantySettlement(warrantySystemId);

  React.useEffect(() => {
    if (!ticket) return;

    console.log('💰 [ACTUAL REMAINING CALCULATION]', {
      totalPaymentFromTicket: totalSettlementAmount,
      remainingAmount: settlementState.remainingAmount,
      warrantySystemId,
      paymentsCount: settlementState.warrantyPayments.length,
      receiptsCount: settlementState.warrantyReceipts.length,
      warrantyPaymentsTotal: settlementState.warrantyPayments.reduce((sum, p) => p.status !== 'cancelled' ? sum + p.amount : sum, 0),
    });
  }, [ticket, totalSettlementAmount, settlementState, warrantySystemId]);

  const { control, handleSubmit, watch, reset, setValue } = useForm<FormValues>({
    defaultValues: {
      amount: 0, // Sẽ được set trong useEffect
      settlementType: 'direct_payment',
      paymentMethodSystemId: defaultPaymentMethod?.systemId,
      accountSystemId: defaultCashAccount?.systemId,
      selectedOrderId: linkedOrderId,
      notes: `Hoàn tiền bảo hành ${warrantyId}`,
    },
  });

  const settlementType = watch('settlementType');
  const selectedOrderId = watch('selectedOrderId');
  const paymentMethodSystemId = watch('paymentMethodSystemId');
  const accountSystemId = watch('accountSystemId');
  const amount = watch('amount');

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
        amount: actualRemainingAmount, // Auto-fill số tiền tối đa
        settlementType: 'direct_payment',
        paymentMethodSystemId: defaultPaymentMethod?.systemId,
        accountSystemId: defaultCashAccount?.systemId,
        selectedOrderId: linkedOrderId,
        notes: `Hoàn tiền bảo hành ${warrantyId}`,
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

  const onSubmit = (values: FormValues) => {
    try {
      const now = new Date();

      // CRITICAL VALIDATION: Tính lại từ ticket thực tế
      if (!ticket) {
        toast.error('Không tìm thấy thông tin phiếu bảo hành');
        return;
      }
      
      const totalPaymentFromTicket = calculateWarrantySettlementTotal(ticket);
      
      // TODO: Implement calculateWarrantyProcessingState function
      // const currentState = calculateWarrantyProcessingState(ticket, payments, receipts, totalPaymentFromTicket);
      // const currentRemainingAmount = currentState.remainingAmount;
      
      // Temporary: Calculate remaining amount manually
      const totalPaidPayments = payments.filter(p => p.linkedWarrantySystemId === warrantySystemId && p.status !== 'cancelled')
        .reduce((sum, p) => sum + p.amount, 0);
      const totalReceivedReceipts = receipts.filter(r => r.linkedWarrantySystemId === warrantySystemId && r.status !== 'cancelled')
        .reduce((sum, r) => sum + r.amount, 0);
      const currentRemainingAmount = totalPaymentFromTicket - totalPaidPayments + totalReceivedReceipts;
      
      console.log('💰 [PAYMENT VALIDATION]', {
        totalPaymentFromTicket,
        totalPayments: totalPaidPayments,
        totalReceipts: totalReceivedReceipts,
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
        
        // ADDITIONAL VALIDATION: Kiểm tra số tiền không vượt quá số dư đơn hàng
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

      const payment: Omit<Payment, 'systemId'> = {
        id: asBusinessId(''), // Let store generate PC-XXXXXX ID
        date: toISODateTime(now) || now.toISOString(),
        amount: values.amount,
        
        // Recipient info (TargetGroup)
        recipientTypeSystemId: asSystemId('KHACHHANG'), // TODO: Get from TargetGroup store
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
        
        createdBy: asSystemId(currentUserSystemId), // Use systemId instead of name
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
        { paymentSystemId: newPayment.systemId } // Lưu systemId vào metadata
      );

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
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Payment Method - Only show if direct_payment */}
          {settlementType === 'direct_payment' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="paymentMethodSystemId">Hình thức thanh toán *</Label>
                <Controller
                  name="paymentMethodSystemId"
                  control={control}
                  rules={{ required: settlementType === 'direct_payment' }}
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
                  rules={{ required: settlementType === 'direct_payment' }}
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

          {/* Order Selection - Only show if order_deduction */}
          {settlementType === 'order_deduction' && (
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
                    ) : (
                      `Số tiền tối đa: ${actualRemainingAmount.toLocaleString('vi-VN')} đ`
                    )}
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
