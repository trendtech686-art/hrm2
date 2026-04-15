import * as React from 'react';
import { useForm } from 'react-hook-form';
import { formatDateTime, getCurrentDate } from '@/lib/date-utils';
import { useAllCashAccounts } from '../../cashbook/hooks/use-all-cash-accounts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../../../components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Input } from '../../../components/ui/input';
import { NumberInput } from '../../../components/ui/number-input';
import { Button } from '../../../components/ui/button';

export type PaymentConfirmationFormValues = {
  paymentMethod: string;
  accountSystemId: string;
  amount: number;
  paymentDate: string;
  reference?: string;
  expenseType?: 'shipping' | 'other'; // Only used for expense payments
};

interface PaymentConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  amountRemaining: number;
  onSubmit: (values: PaymentConfirmationFormValues) => void;
  title?: string;
  isExpensePayment?: boolean; // Show expense type selector
}

export function PaymentConfirmationDialog({
  isOpen,
  onOpenChange,
  amountRemaining,
  onSubmit,
  title = 'Xác nhận thanh toán',
  isExpensePayment = false,
}: PaymentConfirmationDialogProps) {
  const { accounts, isLoading: isLoadingAccounts } = useAllCashAccounts({ enabled: isOpen });
  
  // Track if form has been initialized to prevent re-initialization
  const [isInitialized, setIsInitialized] = React.useState(false);
  
  const form = useForm<PaymentConfirmationFormValues>({
    defaultValues: {
      paymentMethod: 'Tiền mặt',
      accountSystemId: '',
      amount: amountRemaining > 0 ? amountRemaining : 0,
      paymentDate: formatDateTime(getCurrentDate()),
      reference: '',
      expenseType: 'shipping',
    },
  });

  const { control, handleSubmit, reset, watch, setValue } = form;
  const paymentMethod = watch('paymentMethod');
  const currentAccountId = watch('accountSystemId');

  // Filter accounts based on payment method
  const filteredAccounts = React.useMemo(() => {
    if (paymentMethod === 'Tiền mặt') {
      return accounts.filter(acc => acc.type === 'cash' && acc.isActive);
    } else if (paymentMethod === 'Chuyển khoản') {
      return accounts.filter(acc => acc.type === 'bank' && acc.isActive);
    }
    return [];
  }, [accounts, paymentMethod]);

  // Get default account for current payment method
  const defaultAccountId = React.useMemo(() => {
    const defaultAcc = filteredAccounts.find(acc => acc.isDefault);
    return defaultAcc?.systemId || filteredAccounts[0]?.systemId || '';
  }, [filteredAccounts]);

  // Initialize form when dialog opens AND accounts are loaded
  React.useEffect(() => {
    if (isOpen && !isLoadingAccounts && !isInitialized) {
      const cashAccounts = accounts.filter(acc => acc.type === 'cash' && acc.isActive);
      const defaultAccount = cashAccounts.find(acc => acc.isDefault)?.systemId || cashAccounts[0]?.systemId || '';
      
      reset({
        paymentMethod: 'Tiền mặt',
        accountSystemId: defaultAccount,
        amount: amountRemaining > 0 ? amountRemaining : 0,
        paymentDate: formatDateTime(getCurrentDate()),
        reference: '',
        expenseType: 'shipping',
      });
      setIsInitialized(true);
    }
  }, [isOpen, isLoadingAccounts, isInitialized, accounts, amountRemaining, reset]);

  // Reset initialization flag when dialog closes
  React.useEffect(() => {
    if (!isOpen) {
      setIsInitialized(false);
    }
  }, [isOpen]);

  // Update accountSystemId when payment method changes (only after initialized)
  React.useEffect(() => {
    if (isInitialized && defaultAccountId && currentAccountId !== defaultAccountId) {
      // Only update if current account is not valid for new payment method
      const isCurrentAccountValid = filteredAccounts.some(acc => acc.systemId === currentAccountId);
      if (!isCurrentAccountValid) {
        setValue('accountSystemId', defaultAccountId);
      }
    }
  }, [paymentMethod, isInitialized, defaultAccountId, currentAccountId, filteredAccounts, setValue]);


  const onFormSubmit = React.useCallback((values: PaymentConfirmationFormValues) => {
    // Validate amount doesn't exceed remaining
    if (values.amount > amountRemaining && amountRemaining > 0) {
      return; // Don't submit if exceeds max
    }
    onSubmit(values);
  }, [onSubmit, amountRemaining]);

  const handlePaymentClick = React.useCallback(() => {
    handleSubmit(onFormSubmit)();
  }, [handleSubmit, onFormSubmit]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" open={isOpen}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <div className="space-y-4 pt-4">
            {isExpensePayment && (
              <FormField control={control} name="expenseType" render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại chi phí</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="shipping">Chi phí vận chuyển</SelectItem>
                      <SelectItem value="other">Chi phí khác</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}/>
            )}
            <FormField control={control} name="paymentMethod" render={({ field }) => (
              <FormItem>
                <FormLabel>Phương thức thanh toán</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="Tiền mặt">Tiền mặt</SelectItem>
                    <SelectItem value="Chuyển khoản">Chuyển khoản</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}/>
            <FormField control={control} name="accountSystemId" render={({ field }) => (
              <FormItem>
                <FormLabel>Tài khoản</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                >
                  <FormControl><SelectTrigger><SelectValue placeholder="Chọn tài khoản" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {filteredAccounts.length === 0 ? (
                      <SelectItem value="no-account" disabled>
                        Không có tài khoản {paymentMethod === 'Tiền mặt' ? 'tiền mặt' : 'ngân hàng'}
                      </SelectItem>
                    ) : (
                      filteredAccounts.map((account) => (
                        <SelectItem key={account.systemId} value={account.systemId}>
                          {account.name} {account.bankAccountNumber ? `(${account.bankAccountNumber})` : ''}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </FormItem>
            )}/>
            <FormField control={control} name="amount" render={({ field }) => (
              <FormItem>
                <FormLabel>Số tiền (tối đa: {amountRemaining > 0 ? amountRemaining.toLocaleString('vi-VN') : 0} đ)</FormLabel>
                {/* FIX: Explicitly cast `field.value` to `number` to match the expected prop type of `NumberInput`. */}
                <FormControl>
                  <NumberInput 
                    {...field} 
                    value={field.value as number}
                    max={amountRemaining > 0 ? amountRemaining : 0}
                  />
                </FormControl>
                {field.value > amountRemaining && amountRemaining > 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    Số tiền không được vượt quá {amountRemaining.toLocaleString('vi-VN')} đ
                  </p>
                )}
              </FormItem>
            )}/>
            <FormField control={control} name="paymentDate" render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày thanh toán</FormLabel>
                <FormControl><Input {...field} /></FormControl>
              </FormItem>
            )}/>
             <FormField control={control} name="reference" render={({ field }) => (
              <FormItem>
                <FormLabel>Tham chiếu</FormLabel>
                <FormControl><Input {...field} placeholder="VD: Số hóa đơn, mã giao dịch..." /></FormControl>
              </FormItem>
            )}/>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Thoát</Button>
              <Button type="button" onClick={handlePaymentClick}>Thanh toán</Button>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
