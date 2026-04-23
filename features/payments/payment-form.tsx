'use client'

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAllPaymentTypes } from '../settings/payments/types/hooks/use-all-payment-types';
import { useAllPaymentMethods } from '../settings/payments/hooks/use-all-payment-methods';
import { useAllTargetGroups } from '../settings/target-groups/hooks/use-all-target-groups';
import { useAllCashAccounts } from '../cashbook/hooks/use-all-cash-accounts';
import { useAllBranches } from '../settings/branches/hooks/use-all-branches';
import { useUnpaidPurchaseOrders } from '../purchase-orders/hooks/use-unpaid-purchase-orders';
import { VirtualizedCombobox, type ComboboxOption } from '../../components/ui/virtualized-combobox';
import { RecipientCombobox, type RecipientType } from './components/recipient-combobox';
import { CurrencyInput } from '../../components/ui/currency-input';
import { Switch } from '@/components/ui/switch';
import type { Payment } from '@/lib/types/prisma-extended';
import type { PaymentFormOptions } from '@/lib/data/payment-form-options';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Calendar } from '../../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import { Button } from '../../components/ui/button';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '../../lib/utils';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { ROUTES } from '../../lib/router';
import { asBusinessId, asSystemId } from '../../lib/id-types';

export type PaymentFormValues = Omit<Payment, 'systemId' | 'createdAt' | 'runningBalance'>;

interface PaymentFormProps {
  initialData?: Payment | null;
  onSubmit: (data: PaymentFormValues) => void;
  isEditing?: boolean;
  initialOptions?: PaymentFormOptions;
  defaultRecipient?: {
    systemId: string;
    name: string;
    typeId: string;
  };
  defaultAmount?: number;
}

export const PaymentForm = React.forwardRef<HTMLFormElement, PaymentFormProps>(
  function PaymentForm({ initialData, onSubmit, isEditing = false, initialOptions, defaultRecipient, defaultAmount }, ref) {
  const router = useRouter();
  // Stabilize defaultRecipient to primitive values
  const defaultRecipientSystemId = defaultRecipient?.systemId;
  const defaultRecipientName = defaultRecipient?.name;
  const defaultRecipientTypeId = defaultRecipient?.typeId;
  const defaultAmountValue = defaultAmount;
  
  // === Settings data - use initialOptions if provided, otherwise fallback to hooks ===
  const { data: paymentTypesHook, isLoading: isLoadingPaymentTypes } = useAllPaymentTypes({ enabled: !initialOptions });
  const { data: paymentMethodsHook, isLoading: isLoadingPaymentMethods } = useAllPaymentMethods({ enabled: !initialOptions });
  const { data: targetGroupsHook, isLoading: isLoadingTargetGroups } = useAllTargetGroups({ enabled: !initialOptions });
  const { accounts: accountsHook, isLoading: isLoadingAccounts } = useAllCashAccounts({ enabled: !initialOptions });
  const { data: branchesHook, isLoading: isLoadingBranches } = useAllBranches({ enabled: !initialOptions });
  const isHooksLoading = !initialOptions && (isLoadingPaymentTypes || isLoadingPaymentMethods || isLoadingTargetGroups || isLoadingAccounts || isLoadingBranches);
  
  // Use server-side data if available, otherwise use client hooks
  const paymentTypes = initialOptions?.paymentTypes ?? paymentTypesHook ?? [];
  const paymentMethods = initialOptions?.paymentMethods ?? paymentMethodsHook ?? [];
  const targetGroups = initialOptions?.targetGroups ?? targetGroupsHook ?? [];
  const accounts = initialOptions?.cashAccounts ?? accountsHook ?? [];
  const branches = initialOptions?.branches ?? branchesHook ?? [];

  // Chỉ lấy active items
  const activePaymentTypes = paymentTypes.filter(pt => pt.isActive);
  const activePaymentMethods = paymentMethods.filter(pm => pm.isActive);
  const activeTargetGroups = targetGroups.filter(tg => tg.isActive);
  const activeAccounts = accounts.filter(acc => acc.isActive);
  const activeBranches = branches;

  const missingConfigs = React.useMemo(() => {
    const items: string[] = [];
    if (activePaymentTypes.length === 0) items.push('Loại phiếu chi');
    if (activePaymentMethods.length === 0) items.push('Hình thức thanh toán');
    if (activeAccounts.length === 0) items.push('Tài khoản quỹ');
    if (activeTargetGroups.length === 0) items.push('Nhóm đối tượng');
    if (activeBranches.length === 0) items.push('Chi nhánh');
    return items;
  }, [activePaymentTypes.length, activePaymentMethods.length, activeAccounts.length, activeTargetGroups.length, activeBranches.length]);

  const preferredRecipientGroup = defaultRecipientTypeId
    ? (activeTargetGroups.find(tg => tg.id === defaultRecipientTypeId) ?? activeTargetGroups.find(tg => tg.id === 'NHACUNGCAP') ?? activeTargetGroups[0])
    : (activeTargetGroups.find(tg => tg.id === 'NHACUNGCAP'));
  const defaultRecipientGroup = preferredRecipientGroup?.systemId ?? activeTargetGroups[0]?.systemId ?? asSystemId('TARGETGROUP000000');
  const defaultRecipientGroupName = preferredRecipientGroup?.name ?? activeTargetGroups[0]?.name ?? '';
  const defaultPaymentMethod = activePaymentMethods[0];
  const defaultPaymentMethodSystemId = defaultPaymentMethod?.systemId ?? asSystemId('PAYMENTMETHOD000000');
  const defaultPaymentMethodName = defaultPaymentMethod?.name ?? '';
  
  // ✅ Select default account based on default payment method type
  const getDefaultAccountForMethod = (method: typeof defaultPaymentMethod) => {
    if (!method) return activeAccounts[0];
    
    // So sánh trực tiếp type từ DB: paymentMethod.type === cashAccount.type
    const methodType = method.type;
    let matchingAccounts = activeAccounts;
    if (methodType) {
      const matched = activeAccounts.filter(acc => acc.type === methodType);
      if (matched.length > 0) matchingAccounts = matched;
    }
    
    // Prefer default account of matching type
    return matchingAccounts.find(acc => acc.isDefault) || matchingAccounts[0] || activeAccounts[0];
  };
  const defaultAccount = getDefaultAccountForMethod(defaultPaymentMethod);
  const defaultAccountSystemId = defaultAccount?.systemId ?? asSystemId('CASHACCOUNT000000');
  
  const defaultPaymentTypeSystemId = activePaymentTypes[0]?.systemId ?? asSystemId('PAYMENTTYPE000000');
  const defaultPaymentTypeName = activePaymentTypes[0]?.name ?? '';
  const defaultBranchSystemId = activeBranches[0]?.systemId ?? asSystemId('BRANCH000000');
  const defaultBranchName = activeBranches[0]?.name ?? '';

  const form = useForm<PaymentFormValues>({
    defaultValues: initialData ? {
      id: initialData.id,
      date: initialData.date,
      amount: initialData.amount,
      recipientTypeSystemId: initialData.recipientTypeSystemId,
      recipientTypeName: initialData.recipientTypeName,
      recipientName: initialData.recipientName,
      recipientSystemId: initialData.recipientSystemId,
      description: initialData.description,
      paymentMethodSystemId: initialData.paymentMethodSystemId,
      paymentMethodName: initialData.paymentMethodName,
      accountSystemId: initialData.accountSystemId,
      paymentReceiptTypeSystemId: initialData.paymentReceiptTypeSystemId,
      paymentReceiptTypeName: initialData.paymentReceiptTypeName,
      branchSystemId: initialData.branchSystemId,
      branchName: initialData.branchName,
      createdBy: initialData.createdBy,
      status: initialData.status,
      affectsDebt: initialData.affectsDebt,
      affectsBusinessReport: initialData.affectsBusinessReport ?? true,
    } : {
      id: asBusinessId(''),
      date: new Date().toISOString().split('T')[0],
      amount: defaultAmountValue ?? 0,
      recipientTypeSystemId: defaultRecipientGroup,
      recipientTypeName: defaultRecipientGroupName,
      recipientName: defaultRecipientName ?? '',
      recipientSystemId: defaultRecipientSystemId,
      description: '',
      paymentMethodSystemId: defaultPaymentMethodSystemId,
      paymentMethodName: defaultPaymentMethodName,
      accountSystemId: defaultAccountSystemId,
      paymentReceiptTypeSystemId: defaultPaymentTypeSystemId,
      paymentReceiptTypeName: defaultPaymentTypeName,
      branchSystemId: defaultBranchSystemId,
      branchName: defaultBranchName,
      createdBy: asSystemId('SYSTEM'),
      status: 'completed',
      affectsDebt: false,
      affectsBusinessReport: true,
    }
  });

  // Reset form when hooks finish loading and default values change
  const defaultValuesForReset = React.useMemo(() => {
    if (initialData || isHooksLoading) return null;
    return {
      id: asBusinessId(''),
      date: new Date().toISOString().split('T')[0],
      amount: defaultAmountValue ?? 0,
      recipientTypeSystemId: defaultRecipientGroup,
      recipientTypeName: defaultRecipientGroupName,
      recipientName: defaultRecipientName ?? '',
      recipientSystemId: defaultRecipientSystemId,
      description: '',
      paymentMethodSystemId: defaultPaymentMethodSystemId,
      paymentMethodName: defaultPaymentMethodName,
      accountSystemId: defaultAccountSystemId,
      paymentReceiptTypeSystemId: defaultPaymentTypeSystemId,
      paymentReceiptTypeName: defaultPaymentTypeName,
      branchSystemId: defaultBranchSystemId,
      branchName: defaultBranchName,
      createdBy: asSystemId('SYSTEM'),
      status: 'completed' as const,
      affectsDebt: false,
      affectsBusinessReport: true,
    };
  }, [initialData, isHooksLoading, defaultAmountValue, defaultRecipientGroup, defaultRecipientGroupName, defaultRecipientName, defaultRecipientSystemId, defaultPaymentMethodSystemId, defaultPaymentMethodName, defaultAccountSystemId, defaultPaymentTypeSystemId, defaultPaymentTypeName, defaultBranchSystemId, defaultBranchName]);

  const resetKey = JSON.stringify(defaultValuesForReset);
  React.useEffect(() => {
    if (defaultValuesForReset) {
      form.reset(defaultValuesForReset);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  // All hooks must be called before any early returns (React hooks rules)
  // Watch paymentMethodSystemId và recipientTypeSystemId để filter
  const paymentMethodSystemId = form.watch('paymentMethodSystemId');
  const recipientTypeSystemId = form.watch('recipientTypeSystemId');
  const paymentReceiptTypeSystemId = form.watch('paymentReceiptTypeSystemId');
  
  // State for order payment timing (only shown for "Thanh toán cho đơn nhập hàng")
  const [orderPaymentTiming, setOrderPaymentTiming] = React.useState<'order_first' | 'payment_first'>('order_first');

  // Lấy payment method và target group để filter
  const selectedPaymentMethod = React.useMemo(
    () => paymentMethods.find(pm => pm.systemId === paymentMethodSystemId),
    [paymentMethods, paymentMethodSystemId]
  );

  const selectedTargetGroup = React.useMemo(
    () => targetGroups.find(tg => tg.systemId === recipientTypeSystemId),
    [targetGroups, recipientTypeSystemId]
  );

  // Check if selected payment type is "Thanh toán cho đơn nhập hàng"
  const selectedPaymentType = React.useMemo(
    () => paymentTypes.find(pt => pt.systemId === paymentReceiptTypeSystemId),
    [paymentTypes, paymentReceiptTypeSystemId]
  );
  const showOrderPaymentTiming = selectedPaymentType?.id === 'THANHTOANDONNHAP';

  // Fetch unpaid purchase orders for the selected supplier when "Thanh toán cho đơn nhập" is selected
  const recipientSystemId = form.watch('recipientSystemId');
  const isSupplierType = selectedTargetGroup?.id === 'NHACUNGCAP';
  const shouldFetchPOs = showOrderPaymentTiming && isSupplierType && !!recipientSystemId;
  const { data: unpaidPOs = [] } = useUnpaidPurchaseOrders(shouldFetchPOs ? (recipientSystemId as string) : undefined);

  // Purchase order allocation state
  const [poAllocations, setPOAllocations] = React.useState<Record<string, number>>({});

  // Auto-allocate when amount or unpaid POs change
  const formAmount = form.watch('amount');
  const unpaidPOsKey = unpaidPOs.map(po => `${po.systemId}:${po.remainingAmount}`).join(',');
  React.useEffect(() => {
    if (!shouldFetchPOs || unpaidPOs.length === 0 || !formAmount) {
      setPOAllocations(prev => Object.keys(prev).length === 0 ? prev : {});
      return;
    }
    const sorted = orderPaymentTiming === 'order_first'
      ? [...unpaidPOs].sort((a, b) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime())
      : [...unpaidPOs].sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

    let remaining = formAmount;
    const allocs: Record<string, number> = {};
    for (const po of sorted) {
      if (remaining <= 0) break;
      const allocAmount = Math.min(remaining, po.remainingAmount);
      if (allocAmount > 0) {
        allocs[po.systemId] = allocAmount;
        remaining -= allocAmount;
      }
    }
    setPOAllocations(allocs);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formAmount, unpaidPOsKey, orderPaymentTiming, shouldFetchPOs]);

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
    
    if (!currentAccountStillValid && filteredAccounts.length > 0) {
      // Select default account of matching type, or first available
      const defaultAccount = filteredAccounts.find(acc => acc.isDefault) || filteredAccounts[0];
      if (defaultAccount) {
        form.setValue('accountSystemId', asSystemId(defaultAccount.systemId as string));
      }
    }
  }, [selectedPaymentMethod, filteredAccounts, form, isEditing]);

  // Convert payment types to ComboboxOption format
  const paymentTypeOptions = React.useMemo((): ComboboxOption[] => {
    return activePaymentTypes.map(pt => ({
      value: pt.systemId,
      label: pt.name,
    }));
  }, [activePaymentTypes]);

  // Prepare payment method options
  const paymentMethodOptions = React.useMemo((): ComboboxOption[] => {
    return activePaymentMethods.map(pm => ({
      value: pm.systemId,
      label: pm.name,
    }));
  }, [activePaymentMethods]);

  // Prepare target group options (Nhóm đối tượng)
  const targetGroupOptions = React.useMemo((): ComboboxOption[] => {
    return activeTargetGroups.map(tg => ({
      value: tg.systemId,
      label: tg.name,
    }));
  }, [activeTargetGroups]);

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
            {`Vui lòng tạo ${missingConfigs.join(', ')} trong Cài đặt › Thanh toán trước khi lập phiếu chi.`}
          </AlertDescription>
        </div>
        <Button type="button" variant="outline" onClick={() => router.push(ROUTES.SETTINGS.PAYMENTS)}>
          Mở Cài đặt thanh toán
        </Button>
      </Alert>
    );
  }

  const handleSubmit = (data: PaymentFormValues) => {
    console.log('✅ PaymentForm handleSubmit called with data:', data);
    
    // Tự động điền tên từ systemId đã chọn
    const selectedType = paymentTypes.find(pt => pt.systemId === data.paymentReceiptTypeSystemId);
    const selectedBranch = branches.find(b => b.systemId === data.branchSystemId);
    const selectedMethod = paymentMethods.find(pm => pm.systemId === data.paymentMethodSystemId);
    const selectedGroup = targetGroups.find(tg => tg.systemId === data.recipientTypeSystemId);
    
    // Build purchase order allocations from state
    const allocations = shouldFetchPOs
      ? Object.entries(poAllocations)
          .filter(([, amount]) => amount > 0)
          .map(([purchaseOrderSystemId, amount]) => {
            const po = unpaidPOs.find(p => p.systemId === purchaseOrderSystemId);
            return { purchaseOrderSystemId: asSystemId(purchaseOrderSystemId), purchaseOrderId: asBusinessId(po?.id || ''), amount };
          })
      : undefined;
    
    onSubmit({
      ...data,
      paymentReceiptTypeName: selectedType?.name || data.paymentReceiptTypeName,
      branchName: selectedBranch?.name || data.branchName,
      paymentMethodName: selectedMethod?.name || data.paymentMethodName,
      recipientTypeName: selectedGroup?.name || data.recipientTypeName,
      orderAllocations: allocations && allocations.length > 0 ? allocations : undefined,
    });
  };

  const handleInvalid = (errors: Record<string, unknown>) => {
    console.error('❌ PaymentForm validation errors:', errors);
  };

  // Debug: native form submit handler
  const handleNativeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log('🟢 Native form submit triggered');
  };

  return (
    <Form {...form}>
      <form 
        ref={ref}
        id="payment-form" 
        onSubmit={(e) => {
          handleNativeSubmit(e);
          form.handleSubmit(handleSubmit, handleInvalid)(e);
        }} 
        className="space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mã phiếu chi (Business ID) */}
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mã phiếu chi</FormLabel>
                <FormControl>
                  <Input placeholder="Để trống = tự động" disabled={isEditing} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Ngày chi */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày chi *</FormLabel>
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
          <FormField
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
          <FormField
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
                        if (option) {
                          field.onChange(asSystemId(option.value));
                          form.setValue('paymentMethodName', option.label);
                        } else {
                          form.setValue('paymentMethodName', '');
                        }
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

          {/* 3. Tài khoản chi */}
          <FormField
            control={form.control}
            name="accountSystemId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tài khoản chi *</FormLabel>
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

          {/* 4. Loại người nhận */}
          <FormField
            control={form.control}
            name="recipientTypeSystemId"
            render={({ field }) => {
              const selectedOption = targetGroupOptions.find(opt => opt.value === field.value) || null;
              return (
                <FormItem>
                  <FormLabel>Loại người nhận *</FormLabel>
                  <FormControl>
                    <VirtualizedCombobox
                      value={selectedOption}
                      onChange={(option) => {
                        if (option) {
                          field.onChange(asSystemId(option.value));
                          form.setValue('recipientTypeName', option.label);
                        } else {
                          form.setValue('recipientTypeName', '');
                        }
                        form.setValue('recipientSystemId', undefined);
                        form.setValue('recipientName', '');
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

          {/* 5. Loại phiếu chi */}
          <FormField
            control={form.control}
            name="paymentReceiptTypeSystemId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại phiếu chi *</FormLabel>
                <FormControl>
                  <VirtualizedCombobox
                    options={paymentTypeOptions}
                    value={paymentTypeOptions.find(opt => opt.value === field.value) || null}
                    onChange={(option) => {
                      if (option) {
                        field.onChange(asSystemId(option.value));
                      }
                    }}
                    placeholder="Chọn loại phiếu chi"
                    searchPlaceholder="Tìm loại phiếu chi..."
                    disabled={isEditing}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
                  <SelectItem value="order_first">Đơn hàng nhập trước thanh toán trước</SelectItem>
                  <SelectItem value="payment_first">Đơn hàng nhập sau thanh toán trước</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* 7. Tên người nhận */}
          <FormField
            control={form.control}
            name="recipientSystemId"
            render={() => (
              <FormItem>
                <FormLabel>Tên người nhận *</FormLabel>
                <FormControl>
                  <RecipientCombobox
                    recipientType={(selectedTargetGroup?.id as RecipientType) || 'NHACUNGCAP'}
                    value={form.watch('recipientSystemId') ?? null}
                    onValueChange={(systemId, name) => {
                      form.setValue('recipientSystemId', systemId ?? undefined);
                      form.setValue('recipientName', name);
                    }}
                    placeholder={`Chọn ${selectedTargetGroup?.name || 'đối tượng'}...`}
                    disabled={isEditing}
                    initialLabel={defaultRecipientName}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 8. Số tiền */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số tiền *</FormLabel>
                <FormControl>
                  <CurrencyInput
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

        {/* Bảng phân bổ đơn nhập hàng */}
        {showOrderPaymentTiming && shouldFetchPOs && unpaidPOs.length > 0 && (
          <div className="space-y-2 rounded-md border p-4">
            <h4 className="text-sm font-medium">Phân bổ thanh toán cho đơn nhập hàng</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 pr-4">Mã đơn nhập</th>
                    <th className="pb-2 pr-4 text-right">Tổng tiền</th>
                    <th className="pb-2 pr-4 text-right">Đã thanh toán</th>
                    <th className="pb-2 pr-4 text-right">Còn lại</th>
                    <th className="pb-2 text-right">Phân bổ</th>
                  </tr>
                </thead>
                <tbody>
                  {unpaidPOs.map((po) => (
                    <tr key={po.systemId} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-medium">{po.id}</td>
                      <td className="py-2 pr-4 text-right">{po.grandTotal.toLocaleString('vi-VN')}đ</td>
                      <td className="py-2 pr-4 text-right">{po.paidAmount.toLocaleString('vi-VN')}đ</td>
                      <td className="py-2 pr-4 text-right">{po.remainingAmount.toLocaleString('vi-VN')}đ</td>
                      <td className="py-2 text-right">
                        <CurrencyInput
                          className="h-8 w-32 text-right ml-auto"
                          value={poAllocations[po.systemId] || 0}
                          onChange={(val) => {
                            const maxAlloc = po.remainingAmount;
                            const clamped = Math.min(Math.max(0, val || 0), maxAlloc);
                            setPOAllocations(prev => ({ ...prev, [po.systemId]: clamped }));
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
                      {Object.values(poAllocations).reduce((sum, v) => sum + v, 0).toLocaleString('vi-VN')}đ
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Diễn giải */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diễn giải</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Nhập diễn giải cho phiếu chi" 
                  className="resize-none"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Ảnh hưởng công nợ */}
        <FormField
          control={form.control}
          name="affectsDebt"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
              <div className="space-y-0.5">
                <FormLabel>Ảnh hưởng công nợ</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Nếu bật, phiếu chi sẽ được tính vào công nợ khách hàng
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
        <FormField
          control={form.control}
          name="affectsBusinessReport"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
              <div className="space-y-0.5">
                <FormLabel>Hạch toán KQKD</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Nếu bật, phiếu chi sẽ được tính vào báo cáo kết quả kinh doanh
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