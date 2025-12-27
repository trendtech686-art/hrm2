'use client'

import * as React from 'react';
import { useForm, type ControllerProps, type FieldPath } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useReceiptTypeStore } from '../settings/receipt-types/store';
import { usePaymentMethodStore } from '../settings/payments/methods/store';
import { useTargetGroupStore } from '../settings/target-groups/store';
import { useCashbookStore } from '../cashbook/store';
import { useBranchStore } from '../settings/branches/store';
import { useCustomerStore } from '../customers/store';
import { useSupplierStore } from '../suppliers/store';
import { useEmployeeStore } from '../employees/store';
import { useShippingPartnerStore } from '../settings/shipping/store';
import type { Receipt, ReceiptStatus } from '@/lib/types/prisma-extended';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { VirtualizedCombobox, type ComboboxOption } from '@/components/ui/virtualized-combobox';
import { CurrencyInput } from '@/components/ui/currency-input';
import { Checkbox } from '@/components/ui/checkbox';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ROUTES } from '@/lib/router';

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
};

const ReceiptFormField = <TName extends FieldPath<ReceiptFormValues>>(props: ControllerProps<ReceiptFormValues, TName>) => (
  <FormField<ReceiptFormValues, TName> {...props} />
);

interface ReceiptFormProps {
  initialData?: Receipt | null;
  onSubmit: (data: ReceiptFormValues) => void;
  isEditing?: boolean;
}

export function ReceiptForm({ initialData, onSubmit, isEditing = false }: ReceiptFormProps) {
  const router = useRouter();
  const { data: receiptTypes } = useReceiptTypeStore();
  const { data: paymentMethods } = usePaymentMethodStore();
  const { data: targetGroups } = useTargetGroupStore();
  const { accounts } = useCashbookStore();
  const { data: branches } = useBranchStore();
  const { data: customers } = useCustomerStore();
  const { data: suppliers } = useSupplierStore();
  const { data: employees } = useEmployeeStore();
  const { data: shippingPartners } = useShippingPartnerStore();

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
        };

        if (receipt.payerSystemId) {
          values.payerSystemId = receipt.payerSystemId;
        }

        return values;
      }

      const preferredTargetGroup = activeTargetGroups.find(tg => tg.id === 'KHACHHANG') ?? activeTargetGroups[0];
      const defaultPaymentMethod = activePaymentMethods[0];
      const defaultReceiptType = activeReceiptTypes[0];
      const defaultBranch = activeBranches[0];
      const defaultAccount = activeAccounts[0];

      // ✅ Mặc định affectsDebt=true nếu loại người nộp là Khách hàng
      const defaultAffectsDebt = preferredTargetGroup?.id === 'KHACHHANG';

      return {
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        payerTypeSystemId: preferredTargetGroup?.systemId ?? '',
        payerTypeName: preferredTargetGroup?.name ?? '',
        payerName: '',
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
      };
    },
    [activeAccounts, activeBranches, activePaymentMethods, activeReceiptTypes, activeTargetGroups]
  );

  const defaultValues = React.useMemo(() => buildDefaultValues(initialData), [buildDefaultValues, initialData]);

  const form = useForm<ReceiptFormValues>({
    defaultValues,
  });

  React.useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

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

  // Watch paymentMethodSystemId và payerTypeSystemId để filter
  const paymentMethodSystemId = form.watch('paymentMethodSystemId');
  const payerTypeSystemId = form.watch('payerTypeSystemId');

  // Lấy payment method và target group để filter
  const selectedPaymentMethod = React.useMemo(
    () => paymentMethods.find(pm => pm.systemId === paymentMethodSystemId),
    [paymentMethods, paymentMethodSystemId]
  );

  const selectedTargetGroup = React.useMemo(
    () => targetGroups.find(tg => tg.systemId === payerTypeSystemId),
    [targetGroups, payerTypeSystemId]
  );

  // Filter accounts theo payment method
  const filteredAccounts = React.useMemo(() => {
    if (!selectedPaymentMethod) return activeAccounts;
    
    // Tiền mặt -> chỉ hiện cash accounts
    if (selectedPaymentMethod.id === 'TIEN_MAT') {
      return activeAccounts.filter(acc => acc.type === 'cash');
    }
    // Chuyển khoản, Quẹt thẻ -> chỉ hiện bank accounts
    else if (selectedPaymentMethod.id === 'CHUYEN_KHOAN' || selectedPaymentMethod.id === 'QUET_THE') {
      return activeAccounts.filter(acc => acc.type === 'bank');
    }
    return activeAccounts;
  }, [activeAccounts, selectedPaymentMethod]);

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

  // Prepare payer options based on selected target group
  const payerOptions: ComboboxOption[] = React.useMemo(() => {
    if (!selectedTargetGroup) return [];
    
    // KHACHHANG -> customers
    if (selectedTargetGroup.id === 'KHACHHANG') {
      return customers.map(c => ({
        value: c.systemId,
        label: c.name || '',
        subtitle: c.phone || ''
      }));
    } 
    // NHACUNGCAP -> suppliers
    else if (selectedTargetGroup.id === 'NHACUNGCAP') {
      return suppliers.map(s => ({
        value: s.systemId,
        label: s.name,
        subtitle: s.phone || ''
      }));
    } 
    // NHANVIEN -> employees
    else if (selectedTargetGroup.id === 'NHANVIEN') {
      return employees.map(e => ({
        value: e.systemId,
        label: e.fullName,
        subtitle: e.phone || ''
      }));
    }
    // DOITACVC -> shipping partners
    else if (selectedTargetGroup.id === 'DOITACVC') {
      return shippingPartners.map(sp => ({
        value: sp.systemId,
        label: sp.name,
        subtitle: sp.id
      }));
    }
    // KHAC -> empty (manual input)
    return [];
  }, [selectedTargetGroup, customers, suppliers, employees, shippingPartners]);

  const handleSubmit = (data: ReceiptFormValues) => {
    // Tự động điền tên từ systemId đã chọn
    const selectedType = receiptTypes.find(rt => rt.systemId === data.paymentReceiptTypeSystemId);
    const selectedBranch = branches.find(b => b.systemId === data.branchSystemId);
    const selectedMethod = paymentMethods.find(pm => pm.systemId === data.paymentMethodSystemId);
    const selectedGroup = targetGroups.find(tg => tg.systemId === data.payerTypeSystemId);
    
    onSubmit({
      ...data,
      paymentReceiptTypeName: selectedType?.name || data.paymentReceiptTypeName,
      branchName: selectedBranch?.name || data.branchName,
      paymentMethodName: selectedMethod?.name || data.paymentMethodName,
      payerTypeName: selectedGroup?.name || data.payerTypeName,
    });
  };

  return (
    <Form {...form}>
      <form id="receipt-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                    className="h-9"
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
                          "h-9 w-full pl-3 text-left font-normal",
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

          {/* Số tiền */}
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

          {/* Loại phiếu thu (Link đến Receipt Type) */}
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

          {/* Loại người nộp (Nhóm đối tượng) */}
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
                        // Tự động điền payerTypeName
                        form.setValue('payerTypeName', option?.label || '');
                        // Reset payerSystemId when changing type
                        form.setValue('payerSystemId', undefined);
                        form.setValue('payerName', '');
                        // ✅ Tự động bật affectsDebt nếu chọn Khách hàng
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

          {/* Tên người nộp */}
          {selectedTargetGroup?.id === 'KHAC' ? (
            // KHAC -> Manual Input
            <ReceiptFormField
              control={form.control}
              name="payerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên người nộp *</FormLabel>
                  <FormControl>
                    <Input 
                      className="h-9" 
                      placeholder="Nhập tên người nộp" 
                      disabled={isEditing}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            // Other types -> VirtualizedCombobox
            <ReceiptFormField
              control={form.control}
              name="payerSystemId"
              render={({ field }) => {
                const selectedOption = payerOptions.find(opt => opt.value === field.value) || null;
                return (
                  <FormItem>
                    <FormLabel>Tên người nộp *</FormLabel>
                    <FormControl>
                      <VirtualizedCombobox
                        value={selectedOption}
                        onChange={(option) => {
                          field.onChange(option?.value ?? undefined);
                          // Tự động điền payerName
                          form.setValue('payerName', option?.label || '');
                        }}
                        options={payerOptions}
                        placeholder={`Chọn ${selectedTargetGroup?.name || ''}`}
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
          )}

          {/* Phương thức thanh toán */}
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
                        // Tự động điền paymentMethodName
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

          {/* Tài khoản (Link đến CashAccount) - Lọc theo phương thức */}
          <ReceiptFormField
            control={form.control}
            name="accountSystemId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tài khoản nhận *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={isEditing}>
                  <FormControl>
                    <SelectTrigger className="h-9">
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

          {/* Chi nhánh */}
          <ReceiptFormField
            control={form.control}
            name="branchSystemId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chi nhánh *</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={isEditing}>
                  <FormControl>
                    <SelectTrigger className="h-9">
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
        </div>

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
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isEditing}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Ảnh hưởng công nợ</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Nếu bật, phiếu thu sẽ được tính vào công nợ khách hàng
                </p>
              </div>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
