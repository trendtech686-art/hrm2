'use client'

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CurrencyInput } from '@/components/ui/currency-input';
import { useAllPaymentMethods } from '@/features/settings/payments/hooks/use-all-payment-methods';
import { useAllCashAccounts } from '@/features/cashbook/hooks/use-all-cash-accounts';
import { useStoreInfoData } from '@/features/settings/store-info/hooks/use-store-info';
import type { CashAccount } from '@/lib/types/prisma-extended';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { MobileTabsList, MobileTabsTrigger } from '@/components/layout/page-section';
import { OptimizedImage } from '@/components/ui/optimized-image';
import type { PaymentFormValues } from './types';
import { logError } from '@/lib/logger'

// VietQR bank BIN mapping (common banks)
const BANK_BINS: Record<string, string> = {
  'vietcombank': '970436',
  'vcb': '970436',
  'techcombank': '970407',
  'tcb': '970407',
  'vietinbank': '970415',
  'ctg': '970415',
  'bidv': '970418',
  'agribank': '970405',
  'mbbank': '970422',
  'mb': '970422',
  'acb': '970416',
  'vpbank': '970432',
  'tpbank': '970423',
  'sacombank': '970403',
  'hdbank': '970437',
  'vib': '970441',
  'shb': '970443',
  'eximbank': '970431',
  'msb': '970426',
  'seabank': '970448',
  'oceanbank': '970414',
  'pvcombank': '970412',
  'baovietbank': '970438',
  'abbank': '970425',
  'ncb': '970419',
  'namabank': '970428',
  'vietabank': '970427',
  'saigonbank': '970400',
  'lienvietpostbank': '970449',
  'lpb': '970449',
  'kienlongbank': '970452',
  'indovinabank': '970434',
};

function getBankBin(bankName?: string): string | null {
  if (!bankName) return null;
  const normalized = bankName.toLowerCase().replace(/[^a-z0-9]/g, '');
  // Check direct match
  for (const [key, bin] of Object.entries(BANK_BINS)) {
    if (normalized.includes(key)) return bin;
  }
  return null;
}

function generateVietQRUrl(params: {
  bankBin: string;
  accountNumber: string;
  amount: number;
  accountName?: string;
  reference?: string;
}): string {
  const { bankBin, accountNumber, amount, accountName, reference } = params;
  // VietQR API format
  let url = `https://img.vietqr.io/image/${bankBin}-${accountNumber}-compact2.png?amount=${amount}`;
  if (accountName) {
    url += `&accountName=${encodeURIComponent(accountName)}`;
  }
  if (reference) {
    url += `&addInfo=${encodeURIComponent(reference)}`;
  }
  return url;
}

interface PaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  amountDue: number;
  onSubmit: (data: PaymentFormValues) => void;
  isSubmitting?: boolean;
}

export function PaymentDialog({
  isOpen,
  onOpenChange,
  amountDue,
  onSubmit,
  isSubmitting = false,
}: PaymentDialogProps) {
  const { data: paymentMethods } = useAllPaymentMethods({ enabled: isOpen });
  const { accounts: cashAccounts } = useAllCashAccounts({ enabled: isOpen });
  const { info: storeInfo } = useStoreInfoData();

  const bankAccounts = React.useMemo(
    () => cashAccounts.filter((a): a is CashAccount & { bankAccountNumber: string; bankName: string } =>
      a.type === 'bank' && a.isActive && !!a.bankAccountNumber && !!a.bankName
    ),
    [cashAccounts]
  );

  const defaultPaymentMethod = React.useMemo(
    () => paymentMethods.find(pm => pm.isDefault) || paymentMethods[0],
    [paymentMethods]
  );
  
  // Get default method name for form
  const defaultMethodName = defaultPaymentMethod?.name || 'Tiền mặt';

  // Default bank info: cash account first, fallback to store info
  const defaultBankInfo = React.useMemo(() => {
    const defaultAccount = bankAccounts.find(a => a.isDefault) || bankAccounts[0];
    if (defaultAccount) {
      return {
        accountNumber: defaultAccount.bankAccountNumber,
        accountName: defaultAccount.accountHolder || '',
        bankName: defaultAccount.bankName,
      };
    }
    // Fallback to store info settings
    if (storeInfo?.bankAccountNumber && storeInfo?.bankName) {
      return {
        accountNumber: storeInfo.bankAccountNumber,
        accountName: storeInfo.bankAccountName || '',
        bankName: storeInfo.bankName,
      };
    }
    return null;
  }, [bankAccounts, storeInfo]);
  
  const form = useForm<PaymentFormValues>({
    defaultValues: {
      method: defaultMethodName,
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
        method: defaultMethodName,
        amount: amountDue > 0 ? amountDue : 0,
        reference: '',
        accountNumber: defaultBankInfo?.accountNumber || '',
        accountName: defaultBankInfo?.accountName || '',
        bankName: defaultBankInfo?.bankName || '',
      });
    }
  }, [isOpen, amountDue, form, defaultMethodName, defaultBankInfo]);

  // Check if selected method is a bank transfer type
  const isBankTransfer = React.useMemo(() => {
    const selectedPm = paymentMethods.find(pm => pm.name === selectedMethod);
    return selectedPm?.type === 'bank' || selectedMethod.toLowerCase().includes('chuyển khoản');
  }, [selectedMethod, paymentMethods]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent mobileFullScreen open={isOpen}>
        <DialogHeader>
          <DialogTitle>Thanh toán đơn hàng</DialogTitle>
          <DialogDescription>Nhập thông tin thanh toán cho đơn hàng này.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form id="payment-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField control={form.control} name="method" render={({ field }) => (
                <FormItem>
                    <FormLabel>Phương thức</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                            {paymentMethods.length > 0 ? (
                                paymentMethods.map((pm) => (
                                    <SelectItem key={pm.systemId} value={pm.name}>
                                        {pm.name}
                                    </SelectItem>
                                ))
                            ) : (
                                <>
                                    <SelectItem value="Tiền mặt">Tiền mặt</SelectItem>
                                    <SelectItem value="Chuyển khoản">Chuyển khoản</SelectItem>
                                    <SelectItem value="Quẹt thẻ">Quẹt thẻ</SelectItem>
                                </>
                            )}
                        </SelectContent>
                    </Select>
                </FormItem>
            )} />
            <FormField 
                control={form.control} 
                name="amount" 
                rules={{
                    required: 'Vui lòng nhập số tiền',
                    min: { value: 1, message: 'Số tiền phải lớn hơn 0' },
                    // Only validate max if amountDue > 0
                    ...(amountDue > 0 ? { max: { value: amountDue, message: `Số tiền không được vượt quá ${new Intl.NumberFormat('vi-VN').format(amountDue)} ₫` } } : {})
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
                        <p className="text-sm text-destructive">{fieldState.error.message}</p>
                    )}
                </FormItem>
            )} />
            <FormField control={form.control} name="reference" render={({ field }) => (
                <FormItem>
                    <FormLabel>Tham chiếu</FormLabel>
                    <FormControl><Input {...field} placeholder="VD: Mã giao dịch ngân hàng" /></FormControl>
                </FormItem>
            )} />
            
            {/* Bank transfer: show QR code or account info */}
            {isBankTransfer && (
              <BankTransferSection 
                form={form} 
                bankAccounts={bankAccounts}
                amount={form.watch('amount')}
                reference={form.watch('reference')}
              />
            )}
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Hủy</Button>
              <Button 
                type="button" 
                disabled={isSubmitting}
                onClick={() => {
                  form.handleSubmit((data) => {
                    onSubmit(data);
                  }, (errors) => {
                    logError('[PaymentDialog] Form validation errors', errors);
                  })();
                }}
              >
                {isSubmitting ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Separate component for bank transfer section
interface BankTransferSectionProps {
  form: ReturnType<typeof useForm<PaymentFormValues>>;
  bankAccounts: Array<CashAccount & { bankAccountNumber: string; bankName: string }>;
  amount: number;
  reference?: string;
}

function BankTransferSection({ form, bankAccounts, amount, reference }: BankTransferSectionProps) {
  const accountNumber = form.watch('accountNumber');
  const accountName = form.watch('accountName');
  const bankName = form.watch('bankName');

  // Handle bank account selection
  const handleAccountChange = React.useCallback((accountSystemId: string) => {
    const account = bankAccounts.find(a => a.systemId === accountSystemId);
    if (account) {
      form.setValue('accountNumber', account.bankAccountNumber);
      form.setValue('accountName', account.accountHolder || '');
      form.setValue('bankName', account.bankName);
    }
  }, [bankAccounts, form]);

  // Find currently selected account (match by accountNumber)
  const selectedAccount = React.useMemo(
    () => bankAccounts.find(a => a.bankAccountNumber === accountNumber),
    [bankAccounts, accountNumber]
  );
  const selectedAccountId = selectedAccount?.systemId || '';
  
  // Generate VietQR URL if we have enough info
  // Use bankCode from cash account first (exact match), fallback to bankName parsing
  const qrUrl = React.useMemo(() => {
    if (!accountNumber || !bankName) return null;
    const bankBin = getBankBin(selectedAccount?.bankCode || '') || getBankBin(bankName);
    if (!bankBin) return null;
    
    return generateVietQRUrl({
      bankBin,
      accountNumber: accountNumber.replace(/\s/g, ''),
      amount: amount || 0,
      accountName: accountName || undefined,
      reference: reference || undefined,
    });
  }, [accountNumber, bankName, amount, accountName, reference, selectedAccount]);

  const hasQRSupport = !!qrUrl;

  return (
    <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/30">
      {/* Bank account selector */}
      {bankAccounts.length > 0 && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Tài khoản nhận</label>
          <Select value={selectedAccountId} onValueChange={handleAccountChange}>
            <SelectTrigger>
              <SelectValue placeholder="-- Chọn tài khoản --" />
            </SelectTrigger>
            <SelectContent>
              {bankAccounts.map((account) => (
                <SelectItem key={account.systemId} value={account.systemId}>
                  {account.name} — {account.bankAccountNumber}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {hasQRSupport ? (
        <Tabs defaultValue="qr" className="w-full">
          <MobileTabsList>
            <MobileTabsTrigger value="qr">QR Code</MobileTabsTrigger>
            <MobileTabsTrigger value="info">Thông tin TK</MobileTabsTrigger>
          </MobileTabsList>
          <TabsContent value="qr" className="space-y-3 pt-3">
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm text-muted-foreground text-center">
                Quét mã QR để thanh toán {new Intl.NumberFormat('vi-VN').format(amount)} ₫
              </p>
              <OptimizedImage 
                src={qrUrl} 
                alt="VietQR Payment" 
                width={192} 
                height={192} 
                className="w-48 h-48 border rounded-lg bg-white p-2"
                unoptimized
              />
              <div className="text-center text-sm">
                <p className="font-medium">{accountName}</p>
                <p className="text-muted-foreground">{accountNumber}</p>
                <p className="text-muted-foreground">{bankName}</p>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="info" className="space-y-3 pt-3">
            <BankAccountFields form={form} />
          </TabsContent>
        </Tabs>
      ) : (
        <>
          <p className="text-sm font-medium">Thông tin tài khoản nhận</p>
          <BankAccountFields form={form} />
        </>
      )}
    </div>
  );
}

function BankAccountFields({ form }: { form: ReturnType<typeof useForm<PaymentFormValues>> }) {
  return (
    <>
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
    </>
  );
}
