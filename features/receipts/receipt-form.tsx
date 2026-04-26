'use client'

import * as React from 'react';
import { useForm, type ControllerProps, type FieldPath } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAllReceiptTypes } from '../settings/receipt-types/hooks/use-all-receipt-types';
import { useAllPaymentMethods } from '../settings/payments/hooks/use-all-payment-methods';
import { useAllTargetGroups } from '../settings/target-groups/hooks/use-all-target-groups';
import { useAllCashAccounts } from '../cashbook/hooks/use-all-cash-accounts';
import { useAllBranches } from '../settings/branches/hooks/use-all-branches';
import { useUnpaidOrders, type UnpaidOrder } from '../orders/hooks/use-unpaid-orders';
import { RecipientCombobox, type RecipientType } from '../payments/components/recipient-combobox';
import type { Receipt, ReceiptStatus } from '@/lib/types/prisma-extended';
import { asSystemId, asBusinessId, type SystemId } from '@/lib/id-types';
import type { ReceiptFormOptions } from '@/lib/data/payment-form-options';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { VirtualizedCombobox, type ComboboxOption } from '@/components/ui/virtualized-combobox';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Switch } from '@/components/ui/switch';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ROUTES } from '@/lib/router';

// Stable empty array reference to prevent infinite re-render loops from ?? [] creating new refs each render
const EMPTY_ARRAY: never[] = [];

export type ReceiptFormValues = {
  id?: string;
  date: string;
  amount: number;
  payerTypeSystemId: string;
  payerTypeName: string;
  payerName: string;
  payerSystemId?: string;
  description: string;
  paymentMethodSystemId: string;
  paymentMethodName: string;
  accountSystemId: string;
  paymentReceiptTypeSystemId: string;
  paymentReceiptTypeName: string;
  branchSystemId: string;
  branchName: string;
  status: ReceiptStatus;
  affectsDebt: boolean;
  affectsBusinessReport: boolean;
  orderAllocations?: { orderSystemId: string; orderId: string; amount: number }[];
};

const ReceiptFormField = <TName extends FieldPath<ReceiptFormValues>>(props: ControllerProps<ReceiptFormValues, TName>) => (
  <FormField<ReceiptFormValues, TName> {...props} />
);

interface ReceiptFormProps {
  initialData?: Receipt | null;
  onSubmit: (data: ReceiptFormValues) => void;
  isEditing?: boolean;
  initialOptions?: ReceiptFormOptions;
  defaultPayer?: {
    systemId: string;
    name: string;
    typeId: string;
  };
  defaultAmount?: number;
}

export const ReceiptForm = React.forwardRef<HTMLFormElement, ReceiptFormProps>(
  function ReceiptForm({ initialData, onSubmit, isEditing = false, initialOptions, defaultPayer, defaultAmount }, ref) {
  const router = useRouter();
  // Stabilize defaultPayer to primitive values to avoid infinite re-render loops
  const defaultPayerSystemId = defaultPayer?.systemId;
  const defaultPayerName = defaultPayer?.name;
  const defaultPayerTypeId = defaultPayer?.typeId;
  const defaultAmountValue = defaultAmount;
  
  // === Settings data - use initialOptions if provided, otherwise fallback to hooks ===
  const { data: receiptTypesHook, isLoading: isLoadingReceiptTypes } = useAllReceiptTypes({ enabled: !initialOptions });
  const { data: paymentMethodsHook, isLoading: isLoadingPaymentMethods } = useAllPaymentMethods({ enabled: !initialOptions });
  const { data: targetGroupsHook, isLoading: isLoadingTargetGroups } = useAllTargetGroups({ enabled: !initialOptions });
  const { accounts: accountsHook, isLoading: isLoadingAccounts } = useAllCashAccounts({ enabled: !initialOptions });
  const { data: branchesHook, isLoading: isLoadingBranches } = useAllBranches({ enabled: !initialOptions });
  const isHooksLoading = !initialOptions && (isLoadingReceiptTypes || isLoadingPaymentMethods || isLoadingTargetGroups || isLoadingAccounts || isLoadingBranches);
  
  // Use server-side data if available, otherwise use client hooks
  const receiptTypes = initialOptions?.receiptTypes ?? receiptTypesHook ?? EMPTY_ARRAY;
  const paymentMethods = initialOptions?.paymentMethods ?? paymentMethodsHook ?? EMPTY_ARRAY;
  const targetGroups = initialOptions?.targetGroups ?? targetGroupsHook ?? EMPTY_ARRAY;
  const accounts = initialOptions?.cashAccounts ?? accountsHook ?? EMPTY_ARRAY;
  const branches = initialOptions?.branches ?? branchesHook ?? EMPTY_ARRAY;

  // Chỉ lấy active items
  const activeReceiptTypes = React.useMemo(
    () => receiptTypes.filter(rt => rt.isActive),
    [receiptTypes]
  );
  const activePaymentMethods = React.useMemo(
    () => paymentMethods.filter(pm => pm.isActive),
    [paymentMethods]
  );
  const activeTargetGroups = React.useMemo(
    () => targetGroups.filter(tg => tg.isActive),
    [targetGroups]
  );
  const activeAccounts = React.useMemo(
    () => accounts.filter(acc => acc.isActive),
    [accounts]
  );
  const activeBranches = branches;

  const missingConfigs = React.useMemo(() => {
    const items: string[] = [];
    if (activeReceiptTypes.length === 0) items.push('Loại phiếu thu');
    if (activePaymentMethods.length === 0) items.push('Hình thức thanh toán');
    if (activeTargetGroups.length === 0) items.push('Nhóm đối tượng');
    if (activeAccounts.length === 0) items.push('Tài khoản quỹ');
    if (activeBranches.length === 0) items.push('Chi nhánh');
    return items;
  }, [activeReceiptTypes.length, activePaymentMethods.length, activeTargetGroups.length, activeAccounts.length, activeBranches.length]);

  const buildDefaultValues = React.useCallback(
    (receipt?: Receipt | null): ReceiptFormValues => {
      if (receipt) {
        const values: ReceiptFormValues = {
          id: receipt.id,
          date: receipt.date,
          amount: receipt.amount,
          payerTypeSystemId: receipt.payerTypeSystemId,
          payerTypeName: receipt.payerTypeName,
          payerName: receipt.payerName,
          description: receipt.description,
          paymentMethodSystemId: receipt.paymentMethodSystemId,
          paymentMethodName: receipt.paymentMethodName,
          accountSystemId: receipt.accountSystemId,
          paymentReceiptTypeSystemId: receipt.paymentReceiptTypeSystemId,
          paymentReceiptTypeName: receipt.paymentReceiptTypeName,
          branchSystemId: receipt.branchSystemId,
          branchName: receipt.branchName,
          status: receipt.status,
          affectsDebt: receipt.affectsDebt,
          affectsBusinessReport: receipt.affectsBusinessReport ?? true,
        };

        if (receipt.payerSystemId) {
          values.payerSystemId = receipt.payerSystemId;
        }

        return values;
      }

      const preferredTargetGroup = defaultPayerTypeId
        ? (activeTargetGroups.find(tg => tg.id === defaultPayerTypeId) ?? activeTargetGroups[0])
        : (activeTargetGroups.find(tg => tg.id === 'KHACHHANG') ?? activeTargetGroups[0]);
      const defaultPaymentMethod = activePaymentMethods[0];
      const defaultReceiptType = activeReceiptTypes[0];
      const defaultBranch = activeBranches[0];
      
      // ✅ Select default account based on default payment method type
      const getDefaultAccount = () => {
        if (!defaultPaymentMethod) return activeAccounts[0];
        
        // So sánh trực tiếp type từ DB: paymentMethod.type === cashAccount.type
        const methodType = defaultPaymentMethod.type;
        let matchingAccounts = activeAccounts;
        if (methodType) {
          const matched = activeAccounts.filter(acc => acc.type === methodType);
          if (matched.length > 0) matchingAccounts = matched;
        }
        
        // Prefer default account of matching type
        return matchingAccounts.find(acc => acc.isDefault) || matchingAccounts[0] || activeAccounts[0];
      };
      const defaultAccount = getDefaultAccount();

      // ✅ Mặc định affectsDebt=true nếu loại người nộp là Khách hàng
      const defaultAffectsDebt = preferredTargetGroup?.id === 'KHACHHANG';

      return {
        date: new Date().toISOString().split('T')[0],
        amount: defaultAmountValue ?? 0,
        payerTypeSystemId: preferredTargetGroup?.systemId ?? '',
        payerTypeName: preferredTargetGroup?.name ?? '',
        payerName: defaultPayerName ?? '',
        payerSystemId: defaultPayerSystemId,
        description: '',
        paymentMethodSystemId: defaultPaymentMethod?.systemId ?? '',
        paymentMethodName: defaultPaymentMethod?.name ?? '',
        accountSystemId: defaultAccount?.systemId ?? '',
        paymentReceiptTypeSystemId: defaultReceiptType?.systemId ?? '',
        paymentReceiptTypeName: defaultReceiptType?.name ?? '',
        branchSystemId: defaultBranch?.systemId ?? '',
        branchName: defaultBranch?.name ?? '',
        status: 'completed',
        affectsDebt: defaultAffectsDebt,
        affectsBusinessReport: true,
      };
    },
    [activeAccounts, activeBranches, activePaymentMethods, activeReceiptTypes, activeTargetGroups, defaultPayerTypeId, defaultPayerName, defaultPayerSystemId, defaultAmountValue]
  );

  const defaultValues = React.useMemo(() => buildDefaultValues(initialData), [buildDefaultValues, initialData]);

  // Stable key for value comparison — prevents infinite loop when hook data
  // returns new [] references each render before loading completes
  const defaultValuesKey = JSON.stringify(defaultValues);

  const form = useForm<ReceiptFormValues>({
    defaultValues,
  });

  React.useEffect(() => {
    form.reset(defaultValues);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValuesKey]);

  // All hooks must be called before any early returns (React hooks rules)
  // Watch paymentMethodSystemId và payerTypeSystemId để filter
  const paymentMethodSystemId = form.watch('paymentMethodSystemId');
  const payerTypeSystemId = form.watch('payerTypeSystemId');
  const paymentReceiptTypeSystemId = form.watch('paymentReceiptTypeSystemId');
  
  // State for order payment timing (only shown for "Thanh toán cho đơn hàng")
  const [orderPaymentTiming, setOrderPaymentTiming] = React.useState<'order_first' | 'payment_first'>('order_first');

  // Lấy payment method và target group để filter
  const selectedPaymentMethod = React.useMemo(
    () => paymentMethods.find(pm => pm.systemId === paymentMethodSystemId),
    [paymentMethods, paymentMethodSystemId]
  );

  const selectedTargetGroup = React.useMemo(
    () => targetGroups.find(tg => tg.systemId === payerTypeSystemId),
    [targetGroups, payerTypeSystemId]
  );

  // Check if selected receipt type is "Thanh toán cho đơn hàng"
  const selectedReceiptType = React.useMemo(
    () => receiptTypes.find(rt => rt.systemId === paymentReceiptTypeSystemId),
    [receiptTypes, paymentReceiptTypeSystemId]
  );
  const showOrderPaymentTiming = selectedReceiptType?.id === 'THANHTOAN';

  // Fetch unpaid orders for the selected customer when "Thanh toán theo đơn hàng" is selected
  const payerSystemId = form.watch('payerSystemId');
  const isCustomerType = selectedTargetGroup?.id === 'KHACHHANG';
  const shouldFetchOrders = showOrderPaymentTiming && isCustomerType && !!payerSystemId;
  const { data: unpaidOrders = [] } = useUnpaidOrders(shouldFetchOrders ? payerSystemId : undefined);

  // Order allocation state
  const [orderAllocations, setOrderAllocations] = React.useState<Record<string, number>>({});

  // Auto-allocate when amount or unpaid orders change
  const formAmount = form.watch('amount');
  const unpaidOrdersKey = unpaidOrders.map(o => `${o.systemId}:${o.remainingAmount}`).join(',');
  React.useEffect(() => {
    if (!shouldFetchOrders || unpaidOrders.length === 0 || !formAmount) {
      setOrderAllocations(prev => Object.keys(prev).length === 0 ? prev : {});
      return;
    }
    const sorted = orderPaymentTiming === 'order_first'
      ? [...unpaidOrders].sort((a, b) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime())
      : [...unpaidOrders].sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

    let remaining = formAmount;
    const allocs: Record<string, number> = {};
    for (const order of sorted) {
      if (remaining <= 0) break;
      const allocAmount = Math.min(remaining, order.remainingAmount);
      if (allocAmount > 0) {
        allocs[order.systemId] = allocAmount;
        remaining -= allocAmount;
      }
    }
    setOrderAllocations(allocs);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formAmount, unpaidOrdersKey, orderPaymentTiming, shouldFetchOrders]);

  // Filter accounts theo payment method: ưu tiên accountType, fallback theo tên
  const filteredAccounts = React.useMemo(() => {
    if (!selectedPaymentMethod) return activeAccounts;
    const methodSystemId = String(selectedPaymentMethod.systemId);
    // Ưu tiên: lọc theo accountType (liên kết trực tiếp với payment method)
    const byAccountType = activeAccounts.filter(acc => acc.accountType === methodSystemId);
    if (byAccountType.length > 0) return byAccountType;
    // Fallback cho tài khoản cũ chưa có accountType: lọc theo tên
    let methodType = selectedPaymentMethod?.type;
    if (!methodType || methodType === 'other') {
      const name = selectedPaymentMethod?.name?.toLowerCase() || '';
      if (name.includes('tiền mặt') || name.includes('cash') || name.includes('cod')) methodType = 'cash';
      else if (name.includes('chuyển khoản') || name.includes('bank') || name.includes('transfer')) methodType = 'bank';
    }
    if (!methodType || methodType === 'other') return activeAccounts;
    const matched = activeAccounts.filter(acc => acc.type === methodType);
    return matched.length > 0 ? matched : activeAccounts;
  }, [activeAccounts, selectedPaymentMethod]);

  // ✅ Auto-select default account when payment method changes
  React.useEffect(() => {
    if (!selectedPaymentMethod || isEditing) return;
    
    const currentAccountId = form.getValues('accountSystemId');
    const currentAccountStillValid = filteredAccounts.some(acc => acc.systemId === currentAccountId);
    
    // Only change if current account is not in filtered list
    if (!currentAccountStillValid && filteredAccounts.length > 0) {
      // Prefer default account, then first available
      const defaultAccount = filteredAccounts.find(acc => acc.isDefault) || filteredAccounts[0];
      if (defaultAccount) {
        form.setValue('accountSystemId', defaultAccount.systemId);
      }
    }
  }, [selectedPaymentMethod, filteredAccounts, form, isEditing]);

  // Prepare options for VirtualizedCombobox
  const receiptTypeOptions: ComboboxOption[] = React.useMemo(() => 
    activeReceiptTypes.map(rt => ({
      value: rt.systemId,
      label: rt.name,
    }))
  , [activeReceiptTypes]);

  // Prepare payment method options
  const paymentMethodOptions: ComboboxOption[] = React.useMemo(() =>
    activePaymentMethods.map(pm => ({
      value: pm.systemId,
      label: pm.name,
    }))
  , [activePaymentMethods]);

  // Prepare target group options (Nhóm đối tượng)
  const targetGroupOptions: ComboboxOption[] = React.useMemo(() =>
    activeTargetGroups.map(tg => ({
      value: tg.systemId,
      label: tg.name,
    }))
  , [activeTargetGroups]);

  // Early return after all hooks have been called
  if (isHooksLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (missingConfigs.length > 0) {
    return (
      <Alert variant="destructive" className="space-y-3">
        <div>
          <AlertTitle>Thiếu cấu hình bắt buộc</AlertTitle>
          <AlertDescription>
            {`Vui lòng tạo ${missingConfigs.join(', ')} trong Cài đặt › Thanh toán trước khi lập phiếu thu.`}
          </AlertDescription>
        </div>
        <Button type="button" variant="outline" onClick={() => router.push(ROUTES.SETTINGS.PAYMENTS)}>
          Mở Cài đặt thanh toán
        </Button>
      </Alert>
    );
  }

  const handleSubmit = (data: ReceiptFormValues) => {
    // Tự động điền tên từ systemId đã chọn
    const selectedType = receiptTypes.find(rt => rt.systemId === data.paymentReceiptTypeSystemId);
    const selectedBranch = branches.find(b => b.systemId === data.branchSystemId);
    const selectedMethod = paymentMethods.find(pm => pm.systemId === data.paymentMethodSystemId);
    const selectedGroup = targetGroups.find(tg => tg.systemId === data.payerTypeSystemId);
    
    // Build order allocations from state
    const allocations = shouldFetchOrders
      ? Object.entries(orderAllocations)
          .filter(([, amount]) => amount > 0)
          .map(([orderSystemId, amount]) => {
            const order = unpaidOrders.find(o => o.systemId === orderSystemId);
            return { orderSystemId: asSystemId(orderSystemId), orderId: asBusinessId(order?.id || ''), amount };
          })
      : undefined;
    
    onSubmit({
      ...data,
      paymentReceiptTypeName: selectedType?.name || data.paymentReceiptTypeName,
      branchName: selectedBranch?.name || data.branchName,
      paymentMethodName: selectedMethod?.name || data.paymentMethodName,
      payerTypeName: selectedGroup?.name || data.payerTypeName,
      orderAllocations: allocations && allocations.length > 0 ? allocations : undefined,
    });
  };
  
  const handleInvalid = (errors: Record<string, unknown>) => {
    // Validation errors are handled by FormMessage components
  };

  return (
    <Form {...form}>
      <form 
        ref={ref}
        id="receipt-form" 
        onSubmit={form.handleSubmit(handleSubmit, handleInvalid)} 
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mã phiếu thu (Business ID) */}
          <ReceiptFormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mã phiếu thu</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Để trống = tự động"
                    disabled={isEditing}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Ngày thu */}
          <ReceiptFormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày thu *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        disabled={isEditing}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "dd/MM/yyyy", { locale: vi })
                        ) : (
                          <span>Chọn ngày</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date?.toISOString().split('T')[0])}
                      locale={vi}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 1. Chi nhánh */}
          <ReceiptFormField
            control={form.control}
            name="branchSystemId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chi nhánh *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={isEditing}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn chi nhánh" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {activeBranches.map((branch) => (
                      <SelectItem key={branch.systemId} value={branch.systemId}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 2. Phương thức thanh toán */}
          <ReceiptFormField
            control={form.control}
            name="paymentMethodSystemId"
            render={({ field }) => {
              const selectedOption = paymentMethodOptions.find(opt => opt.value === field.value) || null;
              return (
                <FormItem>
                  <FormLabel>Phương thức thanh toán *</FormLabel>
                  <FormControl>
                    <VirtualizedCombobox
                      value={selectedOption}
                      onChange={(option) => {
                        field.onChange(option?.value || '');
                        form.setValue('paymentMethodName', option?.label || '');
                      }}
                      options={paymentMethodOptions}
                      placeholder="Chọn phương thức"
                      searchPlaceholder="Tìm kiếm..."
                      emptyPlaceholder="Không tìm thấy kết quả"
                      disabled={isEditing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {/* 3. Tài khoản nhận */}
          <ReceiptFormField
            control={form.control}
            name="accountSystemId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tài khoản nhận *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={isEditing}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn tài khoản" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredAccounts.map((account) => (
                      <SelectItem key={account.systemId} value={account.systemId}>
                        {account.name} ({account.type === 'cash' ? 'Tiền mặt' : 'Ngân hàng'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 4. Loại người nộp */}
          <ReceiptFormField
            control={form.control}
            name="payerTypeSystemId"
            render={({ field }) => {
              const selectedOption = targetGroupOptions.find(opt => opt.value === field.value) || null;
              return (
                <FormItem>
                  <FormLabel>Loại người nộp *</FormLabel>
                  <FormControl>
                    <VirtualizedCombobox
                      value={selectedOption}
                      onChange={(option) => {
                        field.onChange(option?.value || '');
                        form.setValue('payerTypeName', option?.label || '');
                        form.setValue('payerSystemId', undefined);
                        form.setValue('payerName', '');
                        const selectedGroup = targetGroups.find(tg => tg.systemId === option?.value);
                        if (selectedGroup?.id === 'KHACHHANG') {
                          form.setValue('affectsDebt', true);
                        }
                      }}
                      options={targetGroupOptions}
                      placeholder="Chọn nhóm đối tượng"
                      searchPlaceholder="Tìm kiếm..."
                      emptyPlaceholder="Không tìm thấy kết quả"
                      disabled={isEditing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {/* 5. Loại phiếu thu */}
          <ReceiptFormField
            control={form.control}
            name="paymentReceiptTypeSystemId"
            render={({ field }) => {
              const selectedOption = receiptTypeOptions.find(opt => opt.value === field.value) || null;
              return (
                <FormItem>
                  <FormLabel>Loại phiếu thu *</FormLabel>
                  <FormControl>
                    <VirtualizedCombobox
                      value={selectedOption}
                      onChange={(option) => field.onChange(option?.value || '')}
                      options={receiptTypeOptions}
                      placeholder="Chọn loại phiếu thu"
                      searchPlaceholder="Tìm kiếm loại phiếu thu..."
                      emptyPlaceholder="Không tìm thấy loại phiếu thu"
                      disabled={isEditing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {/* 6. Thanh toán theo (conditional) */}
          {showOrderPaymentTiming && (
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Thanh toán theo</label>
              <Select value={orderPaymentTiming} onValueChange={(v) => setOrderPaymentTiming(v as 'order_first' | 'payment_first')} disabled={isEditing}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phương thức" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="order_first">Đơn hàng mua trước thanh toán trước</SelectItem>
                  <SelectItem value="payment_first">Đơn hàng mua sau thanh toán trước</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* 7. Tên người nộp */}
          <ReceiptFormField
            control={form.control}
            name="payerSystemId"
            render={() => (
              <FormItem>
                <FormLabel>Tên người nộp *</FormLabel>
                <FormControl>
                  <RecipientCombobox
                    recipientType={(selectedTargetGroup?.id as RecipientType) || 'KHACHHANG'}
                    value={form.watch('payerSystemId') as SystemId | undefined ?? null}
                    onValueChange={(systemId, name) => {
                      form.setValue('payerSystemId', systemId ?? undefined);
                      form.setValue('payerName', name);
                    }}
                    placeholder={`Chọn ${selectedTargetGroup?.name || 'đối tượng'}...`}
                    disabled={isEditing}
                    initialLabel={defaultPayerName}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 8. Số tiền */}
          <ReceiptFormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số tiền *</FormLabel>
                <FormControl>
                  <CurrencyInput 
                    className="h-9" 
                    placeholder="0" 
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isEditing}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Bảng phân bổ đơn hàng */}
        {showOrderPaymentTiming && shouldFetchOrders && unpaidOrders.length > 0 && (
          <div className="space-y-2 rounded-md border p-4">
            <h4 className="text-sm font-medium">Phân bổ thanh toán cho đơn hàng</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 pr-4">Mã đơn hàng</th>
                    <th className="pb-2 pr-4 text-right">Tổng tiền</th>
                    <th className="pb-2 pr-4 text-right">Đã thanh toán</th>
                    <th className="pb-2 pr-4 text-right">Còn lại</th>
                    <th className="pb-2 text-right">Phân bổ</th>
                  </tr>
                </thead>
                <tbody>
                  {unpaidOrders.map((order) => (
                    <tr key={order.systemId} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-medium">{order.id}</td>
                      <td className="py-2 pr-4 text-right">{order.grandTotal.toLocaleString('vi-VN')}đ</td>
                      <td className="py-2 pr-4 text-right">{order.paidAmount.toLocaleString('vi-VN')}đ</td>
                      <td className="py-2 pr-4 text-right">{order.remainingAmount.toLocaleString('vi-VN')}đ</td>
                      <td className="py-2 text-right">
                        <CurrencyInput
                          className="h-8 w-32 text-right ml-auto"
                          value={orderAllocations[order.systemId] || 0}
                          onChange={(val) => {
                            const maxAlloc = order.remainingAmount;
                            const clamped = Math.min(Math.max(0, val || 0), maxAlloc);
                            setOrderAllocations(prev => ({ ...prev, [order.systemId]: clamped }));
                          }}
                          disabled={isEditing}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-medium">
                    <td colSpan={4} className="pt-2 text-right pr-4">Tổng phân bổ:</td>
                    <td className="pt-2 text-right">
                      {Object.values(orderAllocations).reduce((sum, v) => sum + v, 0).toLocaleString('vi-VN')}đ
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Diễn giải */}
        <ReceiptFormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diễn giải</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Nhập diễn giải cho phiếu thu" 
                  className="resize-none"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Ảnh hưởng công nợ */}
        <ReceiptFormField
          control={form.control}
          name="affectsDebt"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
              <div className="space-y-0.5">
                <FormLabel>Ảnh hưởng công nợ</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Nếu bật, phiếu thu sẽ được tính vào công nợ khách hàng
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isEditing}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Hạch toán kết quả kinh doanh */}
        <ReceiptFormField
          control={form.control}
          name="affectsBusinessReport"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
              <div className="space-y-0.5">
                <FormLabel>Hạch toán KQKD</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Nếu bật, phiếu thu sẽ được tính vào báo cáo kết quả kinh doanh
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isEditing}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
});
