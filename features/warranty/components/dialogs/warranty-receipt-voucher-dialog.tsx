/**
 * CreateReceiptVoucherDialog
 * 
 * Dialog tạo phiếu thu (receipt voucher) từ warranty
 * - Thu thêm tiền từ khách (trường hợp đặc biệt)
 * - Nhập số tiền, lý do, phương thức thu
 */

import * as React from 'react';
import { useForm, Controller, type RegisterOptions } from 'react-hook-form';
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
import { Textarea } from '../../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Alert, AlertDescription } from '../../../../components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useWarrantyPayments, useWarrantyReceipts } from '../../hooks/use-warranty-financial-data';
import { useReceiptMutations } from '../../../receipts/hooks/use-receipts';
import { useWarranty } from '../../hooks/use-warranties';
import type { WarrantyVoucherDialogBaseProps } from '../../types';
import { useAuth } from '../../../../contexts/auth-context';
import { toISODateTime } from '../../../../lib/date-utils';
import type { Receipt } from '../../../receipts/types';
import { asBusinessId, asSystemId } from '../../../../lib/id-types';
import { calculateWarrantyProcessingState } from '../logic/processing';
import { calculateWarrantySettlementTotal } from '../../utils/payment-calculations';
import { useWarrantySettlement } from '../../hooks/use-warranty-settlement';
import { CurrencyInput } from '../../../../components/ui/currency-input';
import { useAllPaymentMethods } from '../../../settings/payments/hooks/use-all-payment-methods';
import { useAllCashAccounts } from '../../../cashbook/hooks/use-all-cash-accounts';
import { useAllReceiptTypes } from '../../../settings/receipt-types/hooks/use-all-receipt-types';
import { logError } from '@/lib/logger'
// addHistory was a Zustand store mutator (now deleted) - history is tracked in DB via mutations
const addHistory = (..._args: unknown[]) => { /* no-op: store removed, history tracked in DB */ };

interface WarrantyReceiptVoucherDialogProps extends WarrantyVoucherDialogBaseProps {
  existingReceipts?: Receipt[] | undefined;
}

interface FormValues {
  amount: number;
  receiptTypeSystemId: string;
  paymentMethod: string;
  accountSystemId: string;
  notes: string;
}

export function WarrantyReceiptVoucherDialog({
  warrantyId,
  warrantySystemId,
  customer,
  defaultAmount = 0,
  branchSystemId,
  branchName,
}: WarrantyReceiptVoucherDialogProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  
  // ⚡ PERFORMANCE: Only fetch data for this specific warranty
  const { data: payments } = useWarrantyPayments(warrantySystemId);
  const { data: receipts } = useWarrantyReceipts(warrantySystemId);
  const { create: createReceipt } = useReceiptMutations();
  // ✅ Phase 14: useWarranty(id) single-item thay vì useWarrantyFinder (ALL warranties)
  const { data: warrantyTicket } = useWarranty(warrantySystemId);
  const { employee: authEmployee } = useAuth();
  const currentUserSystemId = authEmployee?.systemId ?? asSystemId('SYSTEM');
  const currentUserName = authEmployee?.fullName || authEmployee?.id || 'Hệ thống';

  // Fetch payment settings
  const { data: paymentMethods } = useAllPaymentMethods({ enabled: open });
  const { accounts } = useAllCashAccounts({ enabled: open });
  const { data: receiptTypes } = useAllReceiptTypes({ enabled: open });
  const activeReceiptTypes = React.useMemo(() => receiptTypes.filter(t => t.isActive), [receiptTypes]);

  // Get default payment method (match form "Tiền mặt" / "Chuyển khoản")
  const defaultPaymentMethod = React.useMemo(() =>
    paymentMethods.find(m => m.isDefault && m.isActive) || paymentMethods.find(m => m.isActive),
    [paymentMethods]
  );

  // ✅ Get default account based on payment method type from settings
  const getDefaultAccountForMethod = React.useCallback((methodName: string) => {
    // Look up the method in settings to get its type
    const method = paymentMethods.find(m => m.name === methodName && m.isActive);
    const methodType = method?.type;
    if (methodType) {
      return accounts.find(a => a.type === methodType && a.isDefault && a.isActive) ||
             accounts.find(a => a.type === methodType && a.isActive);
    }
    // Fallback: use default active account
    return accounts.find(a => a.isDefault && a.isActive) ||
           accounts.find(a => a.isActive);
  }, [accounts, paymentMethods]);

  // Get default receipt type for warranty additional charges
  const defaultReceiptType = React.useMemo(() =>
    activeReceiptTypes.find(t => t.isDefault) || activeReceiptTypes[0],
    [activeReceiptTypes]
  );

  const { remainingAmount: remainingAmountForReceipt } = useWarrantySettlement(warrantySystemId);

  const amountValidationRules = React.useMemo<RegisterOptions<FormValues, 'amount'>>(() => {
    const baseRules: RegisterOptions<FormValues, 'amount'> = {
      required: 'Vui lòng nhập số tiền',
      min: { value: 1, message: 'Số tiền phải lớn hơn 0' },
    };

    if (remainingAmountForReceipt > 0) {
      baseRules.max = {
        value: remainingAmountForReceipt,
        message: `Số tiền không được vượt quá ${remainingAmountForReceipt.toLocaleString('vi-VN')} đ`,
      };
    }

    return baseRules;
  }, [remainingAmountForReceipt]);

  const { control, handleSubmit, watch, reset, setValue } = useForm<FormValues>({
    defaultValues: {
      amount: defaultAmount,
      receiptTypeSystemId: '',
      paymentMethod: '',
      accountSystemId: '',
      notes: `Thu thêm từ bảo hành ${warrantyId}`,
    },
  });

  const amount = watch('amount');
  const watchedPaymentMethod = watch('paymentMethod');

  // Get selected payment method object to determine account type
  const selectedPaymentMethod = React.useMemo(() =>
    paymentMethods.find(m => m.name === watchedPaymentMethod && m.isActive),
    [paymentMethods, watchedPaymentMethod]
  );

  // Filter accounts by selected payment method type
  const filteredAccounts = React.useMemo(() => {
    const active = accounts.filter(a => a.isActive);
    if (!selectedPaymentMethod?.type) return active;
    const matched = active.filter(a => a.type === selectedPaymentMethod.type);
    return matched.length > 0 ? matched : active;
  }, [accounts, selectedPaymentMethod]);

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      const methodName = defaultPaymentMethod?.name ?? '';
      const defaultAccount = methodName ? getDefaultAccountForMethod(methodName) : undefined;
      reset({
        amount: remainingAmountForReceipt || defaultAmount,
        receiptTypeSystemId: defaultReceiptType?.systemId ?? '',
        paymentMethod: methodName,
        accountSystemId: defaultAccount?.systemId ?? '',
        notes: `Thu thêm từ bảo hành ${warrantyId}`,
      });
    }
  }, [open, warrantyId, defaultAmount, remainingAmountForReceipt, reset, defaultReceiptType, defaultPaymentMethod, getDefaultAccountForMethod]);

  // Set default receipt type when data loads
  React.useEffect(() => {
    if (defaultReceiptType && !watch('receiptTypeSystemId')) {
      setValue('receiptTypeSystemId', defaultReceiptType.systemId);
    }
  }, [defaultReceiptType, setValue, watch]);

  const onSubmit = async (values: FormValues) => {
    try {
      const now = new Date();
      const latestTicket = warrantyTicket;
      if (!latestTicket) {
        toast.error('Không tìm thấy phiếu bảo hành');
        return;
      }

      const latestPayments = payments;
      const latestReceipts = receipts;

      const totalPaymentFromTicket = calculateWarrantySettlementTotal(latestTicket);

      const currentState = calculateWarrantyProcessingState(latestTicket, latestPayments, latestReceipts, totalPaymentFromTicket);

      if (totalPaymentFromTicket >= 0) {
        toast.error('Phiếu này không cần thu thêm tiền');
        return;
      }

      if (values.amount > currentState.remainingAmount) {
        const collected = Math.abs(totalPaymentFromTicket) - currentState.remainingAmount;
        toast.error('Số tiền không được vượt quá số tiền khách phải trả', {
          description: `Đã thu: ${collected.toLocaleString('vi-VN')} đ • Còn lại: ${currentState.remainingAmount.toLocaleString('vi-VN')} đ`,
          duration: 5000,
        });
        return;
      }

      const receipt: Omit<Receipt, 'systemId'> = {
        id: asBusinessId(''), // Let store generate PT-XXXXXX ID
        date: toISODateTime(now) || now.toISOString(),
        amount: values.amount,
        
        // Payer info (TargetGroup)
        payerTypeSystemId: asSystemId('KHACHHANG'), // TargetGroup ID for Customer classification
        payerTypeName: 'Khách hàng',
        payerName: customer.name,
        payerSystemId: customer.systemId ? asSystemId(customer.systemId) : undefined,
        
        description: `Thu phí bảo hành ${warrantyId} - ${customer.name}`,
        
        // Payment Method - resolved from settings
        paymentMethodSystemId: (() => {
          const methodName = values.paymentMethod;
          const matched = paymentMethods.find(m => m.name === methodName && m.isActive);
          return matched?.systemId ?? defaultPaymentMethod?.systemId ?? asSystemId('');
        })(),
        paymentMethodName: values.paymentMethod,
        
        // ✅ Account - use selected account from form
        accountSystemId: values.accountSystemId ? asSystemId(values.accountSystemId) : (getDefaultAccountForMethod(values.paymentMethod)?.systemId ?? asSystemId('')),
        paymentReceiptTypeSystemId: (() => {
          const selectedType = activeReceiptTypes.find(t => t.systemId === values.receiptTypeSystemId);
          return selectedType?.systemId ?? defaultReceiptType?.systemId ?? asSystemId('');
        })(),
        paymentReceiptTypeName: (() => {
          const selectedType = activeReceiptTypes.find(t => t.systemId === values.receiptTypeSystemId);
          return selectedType?.name ?? defaultReceiptType?.name ?? 'Thu thêm bảo hành';
        })(),
        
        // Branch info
        branchSystemId: asSystemId(branchSystemId || ''),
        branchName: branchName || '',
        
        // Status & Category
        status: 'completed', // Receipt usually completed immediately
        category: 'warranty_additional',
        
        // Links to warranty
        linkedWarrantySystemId: asSystemId(warrantySystemId), // Link đến phiếu bảo hành
        originalDocumentId: warrantyId ? asBusinessId(warrantyId) : undefined,
        customerSystemId: undefined,
        customerName: customer.name,
        
        // Financial
        affectsDebt: false, // Không ảnh hưởng công nợ
        affectsBusinessReport: false,
        
        createdBy: asSystemId(currentUserSystemId),
        createdAt: toISODateTime(now) || now.toISOString(),
      };

      const newReceipt = await createReceipt.mutateAsync(receipt);

      // Add history to warranty với metadata
      addHistory(
        asSystemId(warrantySystemId),
        `Tạo phiếu thu ${newReceipt.id}`,
        currentUserName,
        `Số tiền: ${values.amount.toLocaleString('vi-VN')}đ - Phương thức: ${values.paymentMethod}`,
        { receiptSystemId: newReceipt.systemId } // ✅ Lưu systemId vào metadata
      );

      toast.success(`Đã tạo phiếu thu ${newReceipt.id}`, {
        description: `Thu ${values.amount.toLocaleString('vi-VN')} đ từ ${customer.name}`,
        action: {
          label: 'Xem phiếu thu',
          onClick: () => router.push(`/receipts/${newReceipt.systemId}`),
        },
      });

      setOpen(false);
    } catch (error) {
      logError('Error creating receipt voucher', error);
      toast.error('Không thể tạo phiếu thu');
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
          Tạo phiếu thu
        </Button>
      </DialogTrigger>
      
      <DialogContent mobileFullScreen className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo phiếu thu - Thu thêm từ khách</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            </AlertDescription>
          </Alert>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Số tiền thu *</Label>
            <Controller
              name="amount"
              control={control}
              rules={amountValidationRules}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <CurrencyInput
                    id="amount"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Nhập số tiền cần thu thêm"
                  />
                  {fieldState.error && (
                    <p className="text-xs text-destructive">{fieldState.error.message}</p>
                  )}
                </div>
              )}
            />
            <p className="text-xs text-muted-foreground">
              {amount > 0 ? `Đã nhập: ${amount.toLocaleString('vi-VN')} đ` : 'Chưa nhập số tiền'}
            </p>
            {remainingAmountForReceipt > 0 && (
              <p className="text-xs text-muted-foreground">
                Có thể thu tối đa: {remainingAmountForReceipt.toLocaleString('vi-VN')} đ
              </p>
            )}
          </div>

          {/* Receipt Type */}
          <div className="space-y-2">
            <Label htmlFor="receiptTypeSystemId">Loại phiếu thu *</Label>
            <Controller
              name="receiptTypeSystemId"
              control={control}
              rules={{ required: 'Vui lòng chọn loại phiếu thu' }}
              render={({ field, fieldState }) => (
                <div className="space-y-1">
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="receiptTypeSystemId">
                      <SelectValue placeholder="Chọn loại phiếu thu" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeReceiptTypes.map(type => (
                        <SelectItem key={type.systemId} value={type.systemId}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error && (
                    <p className="text-xs text-destructive">{fieldState.error.message}</p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Hình thức *</Label>
            <Controller
              name="paymentMethod"
              control={control}
              rules={{ required: 'Vui lòng chọn hình thức' }}
              render={({ field, fieldState }) => (
                <div>
                  <Select value={field.value} onValueChange={(val) => {
                    field.onChange(val);
                    // Auto-select default account for this method
                    const defaultAcc = getDefaultAccountForMethod(val);
                    if (defaultAcc) setValue('accountSystemId', defaultAcc.systemId);
                  }}>
                    <SelectTrigger id="paymentMethod">
                      <SelectValue placeholder="Chọn hình thức" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.filter(m => m.isActive).map((m) => (
                        <SelectItem key={m.systemId} value={m.name}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error && (
                    <p className="text-xs text-destructive">{fieldState.error.message}</p>
                  )}
                </div>
              )}
            />
          </div>

          {/* Bank Account */}
          <div className="space-y-2">
            <Label htmlFor="accountSystemId">Tài khoản *</Label>
            <Controller
              name="accountSystemId"
              control={control}
              rules={{ required: 'Vui lòng chọn tài khoản' }}
              render={({ field, fieldState }) => (
                <div>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="accountSystemId">
                      <SelectValue placeholder="Chọn tài khoản" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredAccounts.map((a) => (
                        <SelectItem key={a.systemId} value={a.systemId}>
                          {a.name}{a.bankAccountNumber ? ` - ${a.bankAccountNumber}` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error && (
                    <p className="text-xs text-destructive">{fieldState.error.message}</p>
                  )}
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
                  placeholder="Thêm ghi chú cho phiếu thu..."
                  rows={3}
                />
              )}
            />
          </div>

          {/* Info */}
          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              💡 <strong>Lưu ý:</strong> Phiếu thu dùng khi khách hàng phải bù thêm chi phí (sản phẩm hỏng nặng, cần sửa chữa thêm, v.v.)
            </AlertDescription>
          </Alert>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button type="submit">
              Tạo phiếu thu
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
