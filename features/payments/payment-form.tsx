import * as React from 'react';
import { useForm } from 'react-hook-form';
import { usePaymentTypeStore } from '../settings/payments/types/store.ts';
import { usePaymentMethodStore } from '../settings/payments/methods/store.ts';
import { useTargetGroupStore } from '../settings/target-groups/store.ts';
import { useCashbookStore } from '../cashbook/store.ts';
import { useBranchStore } from '../settings/branches/store.ts';
import { useCustomerStore } from '../customers/store.ts';
import { useSupplierStore } from '../suppliers/store.ts';
import { useEmployeeStore } from '../employees/store.ts';
import { useShippingPartnerStore } from '../settings/shipping/store.ts';
import { VirtualizedCombobox, type ComboboxOption } from '../../components/ui/virtualized-combobox.tsx';
import { CurrencyInput } from '../../components/ui/currency-input.tsx';
import type { Payment } from './types.ts';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form.tsx';
import { Input } from '../../components/ui/input.tsx';
import { Textarea } from '../../components/ui/textarea.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select.tsx';
import { Calendar } from '../../components/ui/calendar.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover.tsx';
import { Button } from '../../components/ui/button.tsx';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '../../lib/utils.ts';
import { asBusinessId, asSystemId } from '../../lib/id-types.ts';

export type PaymentFormValues = Omit<Payment, 'systemId' | 'createdAt' | 'runningBalance'>;

interface PaymentFormProps {
  initialData?: Payment | null;
  onSubmit: (data: PaymentFormValues) => void;
  isEditing?: boolean;
}

export function PaymentForm({ initialData, onSubmit, isEditing = false }: PaymentFormProps) {
  const { data: paymentTypes } = usePaymentTypeStore();
  const { data: paymentMethods } = usePaymentMethodStore();
  const { data: targetGroups } = useTargetGroupStore();
  const { accounts } = useCashbookStore();
  const { data: branches } = useBranchStore();
  const { data: customers } = useCustomerStore();
  const { data: suppliers } = useSupplierStore();
  const { data: employees } = useEmployeeStore();
  const { data: shippingPartners } = useShippingPartnerStore();

  // Chỉ lấy active items
  const activePaymentTypes = paymentTypes.filter(pt => pt.isActive);
  const activePaymentMethods = paymentMethods.filter(pm => pm.isActive);
  const activeTargetGroups = targetGroups.filter(tg => tg.isActive);
  const activeAccounts = accounts.filter(acc => acc.isActive);
  const activeBranches = branches;

  const preferredRecipientGroup = activeTargetGroups.find(tg => tg.id === 'NHACUNGCAP');
  const defaultRecipientGroup = preferredRecipientGroup?.systemId ?? activeTargetGroups[0]?.systemId ?? asSystemId('TARGETGROUP000000');
  const defaultRecipientGroupName = preferredRecipientGroup?.name ?? activeTargetGroups[0]?.name ?? '';
  const defaultPaymentMethodSystemId = activePaymentMethods[0]?.systemId ?? asSystemId('PAYMENTMETHOD000000');
  const defaultPaymentMethodName = activePaymentMethods[0]?.name ?? '';
  const defaultAccountSystemId = activeAccounts[0]?.systemId ?? asSystemId('CASHACCOUNT000000');
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
    } : {
      id: asBusinessId(''),
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      recipientTypeSystemId: defaultRecipientGroup,
      recipientTypeName: defaultRecipientGroupName,
      recipientName: '',
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
    }
  });

  // Watch paymentMethodSystemId và recipientTypeSystemId để filter
  const paymentMethodSystemId = form.watch('paymentMethodSystemId');
  const recipientTypeSystemId = form.watch('recipientTypeSystemId');

  // Lấy payment method và target group để filter
  const selectedPaymentMethod = React.useMemo(
    () => paymentMethods.find(pm => pm.systemId === paymentMethodSystemId),
    [paymentMethods, paymentMethodSystemId]
  );

  const selectedTargetGroup = React.useMemo(
    () => targetGroups.find(tg => tg.systemId === recipientTypeSystemId),
    [targetGroups, recipientTypeSystemId]
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

  // Generate recipient options based on selected target group
  const recipientOptions = React.useMemo((): ComboboxOption[] => {
    if (!selectedTargetGroup) return [];
    
    // KHACHHANG -> customers
    if (selectedTargetGroup.id === 'KHACHHANG') {
      return customers.map(c => ({
        value: c.systemId,
        label: c.name,
        subtitle: c.phone,
      }));
    } 
    // NHACUNGCAP -> suppliers
    else if (selectedTargetGroup.id === 'NHACUNGCAP') {
      return suppliers.map(s => ({
        value: s.systemId,
        label: s.name,
        subtitle: s.phone,
      }));
    } 
    // NHANVIEN -> employees
    else if (selectedTargetGroup.id === 'NHANVIEN') {
      return employees.map(e => ({
        value: e.systemId,
        label: e.fullName,
        subtitle: e.phone,
      }));
    }
    // DOITACVC -> shipping partners
    else if (selectedTargetGroup.id === 'DOITACVC') {
      return shippingPartners.map(sp => ({
        value: sp.systemId,
        label: sp.name,
        subtitle: sp.id,
      }));
    }
    // KHAC -> empty (manual input)
    return [];
  }, [selectedTargetGroup, customers, suppliers, employees, shippingPartners]);

  const handleSubmit = (data: PaymentFormValues) => {
    // Tự động điền tên từ systemId đã chọn
    const selectedType = paymentTypes.find(pt => pt.systemId === data.paymentReceiptTypeSystemId);
    const selectedBranch = branches.find(b => b.systemId === data.branchSystemId);
    const selectedMethod = paymentMethods.find(pm => pm.systemId === data.paymentMethodSystemId);
    const selectedGroup = targetGroups.find(tg => tg.systemId === data.recipientTypeSystemId);
    
    onSubmit({
      ...data,
      paymentReceiptTypeName: selectedType?.name || data.paymentReceiptTypeName,
      branchName: selectedBranch?.name || data.branchName,
      paymentMethodName: selectedMethod?.name || data.paymentMethodName,
      recipientTypeName: selectedGroup?.name || data.recipientTypeName,
    });
  };

  return (
    <Form {...form}>
      <form id="payment-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mã phiếu chi (Business ID) */}
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mã phiếu chi</FormLabel>
                <FormControl>
                  <Input className="h-9" placeholder="Để trống = tự động" disabled={isEditing} {...field} />
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

          {/* Loại phiếu chi (Link đến Payment Type) */}
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

          {/* Loại người nhận (Nhóm đối tượng) */}
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

          {/* Tên người nhận */}
          {selectedTargetGroup?.id === 'KHAC' ? (
            // KHAC -> Manual Input
            <FormField
              control={form.control}
              name="recipientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên người nhận *</FormLabel>
                  <FormControl>
                    <Input 
                      className="h-9" 
                      placeholder="Nhập tên người nhận" 
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
            <FormField
              control={form.control}
              name="recipientSystemId"
              render={({ field }) => {
                const selectedOption = recipientOptions.find(opt => opt.value === field.value) || null;
                return (
                  <FormItem>
                    <FormLabel>Tên người nhận *</FormLabel>
                    <FormControl>
                      <VirtualizedCombobox
                        value={selectedOption}
                        onChange={(option) => {
                          field.onChange(option ? asSystemId(option.value) : undefined);
                          // Auto-fill recipientName from selected option
                          if (option) {
                            form.setValue('recipientName', option.label);
                          } else {
                            form.setValue('recipientName', '');
                          }
                        }}
                        options={recipientOptions}
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
          <FormField
            control={form.control}
            name="paymentMethodSystemId"
            render={({ field }) => {
              const selectedOption = paymentMethodOptions.find(opt => opt.value === field.value) || null;
              return (
                <FormItem>
                  <FormLabel>Phương thức *</FormLabel>
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

          {/* Tài khoản (Link đến CashAccount) */}
          <FormField
            control={form.control}
            name="accountSystemId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tài khoản chi *</FormLabel>
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
          <FormField
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
      </form>
    </Form>
  );
}
