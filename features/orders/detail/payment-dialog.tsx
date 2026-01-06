'use client'

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CurrencyInput } from '@/components/ui/currency-input';
import { useAllPaymentMethods } from '@/features/settings/payments/hooks/use-all-payment-methods';
import type { PaymentFormValues } from './types';

interface PaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  amountDue: number;
  onSubmit: (data: PaymentFormValues) => void;
}

export function PaymentDialog({
  isOpen,
  onOpenChange,
  amountDue,
  onSubmit,
}: PaymentDialogProps) {
  const { data: paymentMethods } = useAllPaymentMethods();
  const defaultPaymentMethod = React.useMemo(
    () => paymentMethods.find(pm => pm.isDefault),
    [paymentMethods]
  );
  
  const form = useForm<PaymentFormValues>({
    defaultValues: {
      method: 'Tiền mặt',
      amount: amountDue,
      reference: '',
      accountNumber: '',
      accountName: '',
      bankName: '',
    },
  });

  const selectedMethod = form.watch('method');

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        method: 'Tiền mặt',
        amount: amountDue > 0 ? amountDue : 0,
        reference: '',
        accountNumber: '',
        accountName: '',
        bankName: '',
      });
    }
  }, [isOpen, amountDue, form]);

  // Auto-fill bank account info when selecting "Chuyển khoản"
  React.useEffect(() => {
    if (selectedMethod === 'Chuyển khoản' && defaultPaymentMethod) {
      form.setValue('accountNumber', defaultPaymentMethod.accountNumber || '');
      form.setValue('accountName', defaultPaymentMethod.accountName || '');
      form.setValue('bankName', defaultPaymentMethod.bankName || '');
    }
  }, [selectedMethod, defaultPaymentMethod, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thanh toán đơn hàng</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form id="payment-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField control={form.control} name="method" render={({ field }) => (
                <FormItem>
                    <FormLabel>Phương thức</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="Tiền mặt">Tiền mặt</SelectItem><SelectItem value="Chuyển khoản">Chuyển khoản</SelectItem><SelectItem value="Quẹt thẻ">Quẹt thẻ</SelectItem></SelectContent>
                    </Select>
                </FormItem>
            )} />
            <FormField 
                control={form.control} 
                name="amount" 
                rules={{
                    required: 'Vui lòng nhập số tiền',
                    min: { value: 1, message: 'Số tiền phải lớn hơn 0' },
                    max: { value: amountDue, message: `Số tiền không được vượt quá ${new Intl.NumberFormat('vi-VN').format(amountDue)} ₫` }
                }}
                render={({ field, fieldState }) => (
                <FormItem>
                    <FormLabel>Số tiền</FormLabel>
                    <FormControl>
                        <CurrencyInput 
                            value={field.value as number} 
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                            className={fieldState.error ? 'border-destructive' : ''}
                        />
                    </FormControl>
                    {fieldState.error && (
                        <p className="text-body-sm text-destructive">{fieldState.error.message}</p>
                    )}
                </FormItem>
            )} />
            <FormField control={form.control} name="reference" render={({ field }) => (
                <FormItem>
                    <FormLabel>Tham chiếu</FormLabel>
                    <FormControl><Input {...field} placeholder="VD: Mã giao dịch ngân hàng" /></FormControl>
                </FormItem>
            )} />
            
            {/* Bank account info - only show when method is "Chuyển khoản" */}
            {selectedMethod === 'Chuyển khoản' && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                <p className="text-body-sm font-medium">Thông tin tài khoản nhận</p>
                <FormField control={form.control} name="accountNumber" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số tài khoản</FormLabel>
                    <FormControl><Input {...field} placeholder="VD: 1234567890" /></FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="accountName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên chủ tài khoản</FormLabel>
                    <FormControl><Input {...field} placeholder="VD: NGUYEN VAN A" /></FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="bankName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngân hàng</FormLabel>
                    <FormControl><Input {...field} placeholder="VD: Vietcombank - CN HCM" /></FormControl>
                  </FormItem>
                )} />
              </div>
            )}
          </form>
        </Form>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button type="submit" form="payment-form">Xác nhận thanh toán</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
