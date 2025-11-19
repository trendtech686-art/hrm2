/**
 * CreateReceiptVoucherDialog
 * 
 * Dialog tạo phiếu thu (receipt voucher) từ warranty
 * - Thu thêm tiền từ khách (trường hợp đặc biệt)
 * - Nhập số tiền, lý do, phương thức thu
 */

import * as React from 'react';
import { useForm, Controller, type RegisterOptions } from 'react-hook-form';
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
import { Textarea } from '../../../../components/ui/textarea.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select.tsx';
import { Alert, AlertDescription } from '../../../../components/ui/alert.tsx';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { usePaymentStore } from '../../../payments/store.ts';
import { useReceiptStore } from '../../../receipts/store.ts';
import { useWarrantyStore } from '../../store.ts';
import type { WarrantyVoucherDialogBaseProps } from '../../types.ts';
import { useAuth } from '../../../../contexts/auth-context.tsx';
import { toISODateTime } from '../../../../lib/date-utils.ts';
import type { Receipt } from '../../../receipts/types.ts';
import { asBusinessId, asSystemId } from '../../../../lib/id-types.ts';
import { calculateWarrantyProcessingState } from '../logic/processing.ts';
import { calculateWarrantySettlementTotal } from '../../utils/payment-calculations.ts';
import { useWarrantySettlement } from '../../hooks/use-warranty-settlement.ts';
import { CurrencyInput } from '../../../../components/ui/currency-input.tsx';

interface WarrantyReceiptVoucherDialogProps extends WarrantyVoucherDialogBaseProps {
  existingReceipts?: Receipt[];
}

interface FormValues {
  amount: number;
  reason: string;
  paymentMethod: 'Tiền mặt' | 'Chuyển khoản';
  notes: string;
}

export function WarrantyReceiptVoucherDialog({
  warrantyId,
  warrantySystemId,
  customer,
  defaultAmount = 0,
  linkedOrderId,
  branchSystemId,
  branchName,
  existingReceipts = [],
}: WarrantyReceiptVoucherDialogProps) {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  
  const { add: addReceipt } = useReceiptStore();
  const { findById, addHistory } = useWarrantyStore();
  const { employee: authEmployee } = useAuth();
  const currentUserSystemId = authEmployee?.systemId ?? asSystemId('SYSTEM');
  const currentUserName = authEmployee?.fullName || authEmployee?.id || 'Hệ thống';

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

  const { control, handleSubmit, watch, reset } = useForm<FormValues>({
    defaultValues: {
      amount: defaultAmount,
      reason: 'Chi phí sửa chữa thêm',
      paymentMethod: 'Tiền mặt',
      notes: `Thu thêm từ bảo hành ${warrantyId}`,
    },
  });

  const amount = watch('amount');

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      reset({
        amount: remainingAmountForReceipt || defaultAmount,
        reason: 'Chi phí sửa chữa thêm',
        paymentMethod: 'Tiền mặt',
        notes: `Thu thêm từ bảo hành ${warrantyId}`,
      });
    }
  }, [open, warrantyId, defaultAmount, remainingAmountForReceipt, reset]);

  const onSubmit = (values: FormValues) => {
    try {
      const now = new Date();
      const latestTicket = findById(asSystemId(warrantySystemId));
      if (!latestTicket) {
        toast.error('Không tìm thấy phiếu bảo hành');
        return;
      }

      const latestPayments = usePaymentStore.getState().data;
      const latestReceipts = useReceiptStore.getState().data;

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
        payerTypeSystemId: asSystemId('KHACHHANG'), // TODO: Get KHACHHANG systemId from TargetGroup
        payerTypeName: 'Khách hàng',
        payerName: customer.name,
        payerSystemId: undefined, // TODO: Get customer systemId if needed
        
        description: values.reason,
        
        // Payment Method - TODO: Get from settings
        paymentMethodSystemId: asSystemId(''), // TODO: Get payment method systemId
        paymentMethodName: values.paymentMethod,
        
        // Account & Type - TODO: Get from settings
        accountSystemId: asSystemId(''), // TODO: Get default cash account
        paymentReceiptTypeSystemId: asSystemId(''), // TODO: Get "Thu thêm bảo hành" type
        paymentReceiptTypeName: 'Thu thêm bảo hành',
        
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
        
        createdBy: asSystemId(currentUserSystemId),
        createdAt: toISODateTime(now) || now.toISOString(),
      };

      const newReceipt = addReceipt(receipt);

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
          onClick: () => navigate(`/receipts/${newReceipt.systemId}`),
        },
      });

      setOpen(false);
    } catch (error) {
      console.error('Error creating receipt voucher:', error);
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
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Lý do thu thêm *</Label>
            <Controller
              name="reason"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="reason">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chi phí sửa chữa thêm">Chi phí sửa chữa thêm</SelectItem>
                    <SelectItem value="Chi phí linh kiện">Chi phí linh kiện</SelectItem>
                    <SelectItem value="Phí dịch vụ">Phí dịch vụ</SelectItem>
                    <SelectItem value="Bù trừ thiếu hụt">Bù trừ thiếu hụt</SelectItem>
                    <SelectItem value="Khác">Khác</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Phương thức thu *</Label>
            <Controller
              name="paymentMethod"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="paymentMethod">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tiền mặt">Tiền mặt</SelectItem>
                    <SelectItem value="Chuyển khoản">Chuyển khoản</SelectItem>
                  </SelectContent>
                </Select>
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
