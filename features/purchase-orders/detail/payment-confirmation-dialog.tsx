import * as React from 'react';
import { useForm } from 'react-hook-form';
import { formatDateTime, getCurrentDate } from '@/lib/date-utils';
import { useCashbookStore } from '../../cashbook/store';
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
};

interface PaymentConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  amountRemaining: number;
  onSubmit: (values: PaymentConfirmationFormValues) => void;
}

export function PaymentConfirmationDialog({
  isOpen,
  onOpenChange,
  amountRemaining,
  onSubmit,
}: PaymentConfirmationDialogProps) {
  const { accounts } = useCashbookStore();
  
  // Get default account for current payment method
  const getDefaultAccount = React.useCallback((type: 'cash' | 'bank') => {
    const filtered = accounts.filter(acc => acc.type === type && acc.isActive);
    const defaultAcc = filtered.find(acc => acc.isDefault);
    return defaultAcc?.systemId || filtered[0]?.systemId || '';
  }, [accounts]);
  
  const form = useForm<PaymentConfirmationFormValues>({
    defaultValues: {
      paymentMethod: 'Tiền mặt',
      accountSystemId: getDefaultAccount('cash'),
      amount: amountRemaining > 0 ? amountRemaining : 0,
      paymentDate: formatDateTime(getCurrentDate()),
      reference: '',
    },
  });

  const { control, handleSubmit, reset, watch, setValue } = form;
  const paymentMethod = watch('paymentMethod');

  // Filter accounts based on payment method
  const filteredAccounts = React.useMemo(() => {
    if (paymentMethod === 'Tiền mặt') {
      return accounts.filter(acc => acc.type === 'cash' && acc.isActive);
    } else if (paymentMethod === 'Chuyển khoản') {
      return accounts.filter(acc => acc.type === 'bank' && acc.isActive);
    }
    return [];
  }, [accounts, paymentMethod]);

  // Update accountSystemId when payment method changes
  React.useEffect(() => {
    const accountType = paymentMethod === 'Tiền mặt' ? 'cash' : 'bank';
    const defaultAccount = getDefaultAccount(accountType);
    if (defaultAccount) {
      setValue('accountSystemId', defaultAccount);
    }
  }, [paymentMethod, getDefaultAccount, setValue]);

  React.useEffect(() => {
    if (isOpen) {
      const defaultAccount = getDefaultAccount('cash');
      reset({
        paymentMethod: 'Tiền mặt',
        accountSystemId: defaultAccount,
        amount: amountRemaining > 0 ? amountRemaining : 0,
        paymentDate: formatDateTime(getCurrentDate()),
        reference: '',
      });
    }
  }, [isOpen, amountRemaining, reset, getDefaultAccount]);


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" open={isOpen}>
        <DialogHeader>
          <DialogTitle>Xác nhận thanh toán</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form id="payment-confirmation-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
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
                <FormLabel>Số tiền</FormLabel>
                {/* FIX: Explicitly cast `field.value` to `number` to match the expected prop type of `NumberInput`. */}
                <FormControl><NumberInput {...field} value={field.value as number} /></FormControl>
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
              <Button type="submit">Thanh toán</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
