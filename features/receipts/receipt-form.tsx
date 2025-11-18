import * as React from 'react';
import { useForm } from 'react-hook-form';
import { useReceiptTypeStore } from '../settings/receipt-types/store.ts';
import { usePaymentMethodStore } from '../settings/payments/methods/store.ts';
import { useTargetGroupStore } from '../settings/target-groups/store.ts';
import { useCashbookStore } from '../cashbook/store.ts';
import { useBranchStore } from '../settings/branches/store.ts';
import { useCustomerStore } from '../customers/store.ts';
import { useSupplierStore } from '../suppliers/store.ts';
import { useEmployeeStore } from '../employees/store.ts';
import { useShippingPartnerStore } from '../settings/shipping/store.ts';
import type { Receipt } from './types.ts';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form.tsx';
import { Input } from '../../components/ui/input.tsx';
import { Textarea } from '../../components/ui/textarea.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select.tsx';
import { Calendar } from '../../components/ui/calendar.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover.tsx';
import { Button } from '../../components/ui/button.tsx';
import { VirtualizedCombobox, type ComboboxOption } from '../../components/ui/virtualized-combobox.tsx';
import { CurrencyInput } from '../../components/ui/currency-input.tsx';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { cn } from '../../lib/utils.ts';

export type ReceiptFormValues = Omit<Receipt, 'systemId' | 'createdAt' | 'runningBalance'>;

interface ReceiptFormProps {
  initialData?: Receipt | null;
  onSubmit: (data: ReceiptFormValues) => void;
  isEditing?: boolean;
}

export function ReceiptForm({ initialData, onSubmit, isEditing = false }: ReceiptFormProps) {
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
  const activeReceiptTypes = receiptTypes.filter(rt => rt.isActive);
  const activePaymentMethods = paymentMethods.filter(pm => pm.isActive);
  const activeTargetGroups = targetGroups.filter(tg => tg.isActive);
  const activeAccounts = accounts.filter(acc => acc.isActive);
  const activeBranches = branches;

  const form = useForm<ReceiptFormValues>({
    defaultValues: initialData ? {
      id: initialData.id,
      date: initialData.date,
      amount: initialData.amount,
      payerTypeSystemId: initialData.payerTypeSystemId,
      payerTypeName: initialData.payerTypeName,
      payerName: initialData.payerName,
      payerSystemId: initialData.payerSystemId,
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
      id: '',
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      payerTypeSystemId: activeTargetGroups.find(tg => tg.id === 'KHACHHANG')?.systemId || activeTargetGroups[0]?.systemId || '',
      payerTypeName: activeTargetGroups.find(tg => tg.id === 'KHACHHANG')?.name || activeTargetGroups[0]?.name || '',
      payerName: '',
      description: '',
      paymentMethodSystemId: activePaymentMethods[0]?.systemId || '',
      paymentMethodName: activePaymentMethods[0]?.name || '',
      accountSystemId: activeAccounts[0]?.systemId || '',
      paymentReceiptTypeSystemId: activeReceiptTypes[0]?.systemId || '',
      paymentReceiptTypeName: activeReceiptTypes[0]?.name || '',
      branchSystemId: activeBranches[0]?.systemId || '',
      branchName: activeBranches[0]?.name || '',
      createdBy: '',
      status: 'completed',
      affectsDebt: false,
    }
  });

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
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mã phiếu thu</FormLabel>
                <FormControl>
                  <Input className="h-9" placeholder="Để trống = tự động" disabled={isEditing} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Ngày thu */}
          <FormField
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
          <FormField
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
          <FormField
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
          <FormField
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
                        form.setValue('payerSystemId', '');
                        form.setValue('payerName', '');
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
            <FormField
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
            <FormField
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
                          field.onChange(option?.value || '');
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
          <FormField
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
                  placeholder="Nhập diễn giải cho phiếu thu" 
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
