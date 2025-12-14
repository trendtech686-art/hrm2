import * as React from "react";
import { useForm, type ControllerProps, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { CashAccount } from "../../cashbook/types.ts";
import { useBranchStore } from "../branches/store.ts";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "../../../components/ui/form.tsx";
import { Input } from "../../../components/ui/input.tsx";
import { CurrencyInput } from "../../../components/ui/currency-input.tsx";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select.tsx";
import { Switch } from "../../../components/ui/switch.tsx";

const formSchema = z.object({
  id: z.string().min(1, "Mã tài khoản là bắt buộc"),
  name: z.string().min(1, "Tên tài khoản là bắt buộc").max(100, "Tên không được vượt quá 100 ký tự"),
  initialBalance: z.number().min(0, "Số dư không được âm"),
  type: z.enum(['cash', 'bank'] as const),
  bankAccountNumber: z.string().optional(),
  bankBranch: z.string().optional(),
  branchSystemId: z.string().optional(),
  isActive: z.boolean(),
  isDefault: z.boolean().optional(),
  bankName: z.string().optional(),
  bankCode: z.string().optional(),
  accountHolder: z.string().optional(),
  minBalance: z.number().optional(),
  maxBalance: z.number().optional(),
  managedBy: z.string().optional(),
});

export type CashAccountFormValues = z.infer<typeof formSchema>;

const CashAccountFormField = <TName extends FieldPath<CashAccountFormValues>>(props: ControllerProps<CashAccountFormValues, TName>) => (
  <FormField<CashAccountFormValues, TName> {...props} />
);

type FormProps = {
  initialData?: CashAccount | null;
  onSubmit: (values: CashAccountFormValues) => void;
};

export function CashAccountForm({ initialData, onSubmit }: FormProps) {
  const { data: branches } = useBranchStore();

  const defaultBranchSystemId = React.useMemo(() => {
    const branch = branches.find(b => b.isDefault);
    return branch?.systemId ? String(branch.systemId) : undefined;
  }, [branches]);

  const buildFormValues = React.useCallback(
    (account?: CashAccount | null): CashAccountFormValues => {
      if (account) {
        return {
          id: String(account.id),
          name: account.name,
          initialBalance: account.initialBalance,
          type: account.type,
          bankAccountNumber: account.bankAccountNumber ?? undefined,
          bankBranch: account.bankBranch ?? undefined,
          branchSystemId: account.branchSystemId ? String(account.branchSystemId) : undefined,
          isActive: account.isActive,
          isDefault: account.isDefault ?? false,
          bankName: account.bankName ?? undefined,
          bankCode: account.bankCode ?? undefined,
          accountHolder: account.accountHolder ?? undefined,
          minBalance: account.minBalance ?? undefined,
          maxBalance: account.maxBalance ?? undefined,
          managedBy: account.managedBy ? String(account.managedBy) : undefined,
        };
      }

      return {
        id: "",
        name: "",
        initialBalance: 0,
        type: 'cash',
        bankAccountNumber: undefined,
        bankBranch: undefined,
        branchSystemId: defaultBranchSystemId,
        isActive: true,
        isDefault: false,
        bankName: undefined,
        bankCode: undefined,
        accountHolder: undefined,
        minBalance: undefined,
        maxBalance: undefined,
        managedBy: undefined,
      };
    },
    [defaultBranchSystemId]
  );

  const form = useForm<CashAccountFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: buildFormValues(initialData),
  });

  React.useEffect(() => {
    form.reset(buildFormValues(initialData));
  }, [initialData, buildFormValues, form]);

  const accountType = form.watch('type');

  return (
    <Form {...form}>
      <form id="cash-account-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4 max-h-[70vh] overflow-y-auto px-1">
         <CashAccountFormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Loại tài khoản</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex space-x-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="cash" />
                    </FormControl>
                    <FormLabel className="font-normal">Tiền mặt</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="bank" />
                    </FormControl>
                    <FormLabel className="font-normal">Ngân hàng</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <CashAccountFormField control={form.control} name="name" render={({ field }) => (
          <FormItem><FormLabel>Tên tài khoản <span className="text-destructive">*</span></FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
        )} />
        <CashAccountFormField control={form.control} name="id" render={({ field }) => (
          <FormItem><FormLabel>Mã tài khoản <span className="text-destructive">*</span></FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
        )} />
        <CashAccountFormField control={form.control} name="branchSystemId" render={({ field }) => (
            <FormItem>
                <FormLabel>Thuộc chi nhánh</FormLabel>
                <Select onValueChange={field.onChange} value={field.value ?? ''}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Chọn chi nhánh" /></SelectTrigger></FormControl>
                    <SelectContent>{branches.map(b => <SelectItem key={b.systemId} value={b.systemId}>{b.name}</SelectItem>)}</SelectContent>
                </Select>
                <FormMessage />
            </FormItem>
        )} />
        {accountType === 'bank' && (
          <>
            <CashAccountFormField control={form.control} name="bankName" render={({ field }) => (
              <FormItem><FormLabel>Tên ngân hàng</FormLabel><FormControl><Input {...field} value={field.value ?? ''} placeholder="Vietcombank, ACB..." /></FormControl><FormMessage /></FormItem>
            )} />
            <CashAccountFormField control={form.control} name="bankCode" render={({ field }) => (
              <FormItem><FormLabel>Mã ngân hàng</FormLabel><FormControl><Input {...field} value={field.value ?? ''} placeholder="VCB, ACB..." /></FormControl><FormMessage /></FormItem>
            )} />
            <CashAccountFormField control={form.control} name="bankAccountNumber" render={({ field }) => (
              <FormItem><FormLabel>Số tài khoản ngân hàng</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <CashAccountFormField control={form.control} name="accountHolder" render={({ field }) => (
              <FormItem><FormLabel>Chủ tài khoản</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
            )} />
            <CashAccountFormField control={form.control} name="bankBranch" render={({ field }) => (
              <FormItem><FormLabel>Chi nhánh ngân hàng</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
            )} />
          </>
        )}
        <CashAccountFormField control={form.control} name="initialBalance" render={({ field }) => (
          <FormItem><FormLabel>Số dư ban đầu</FormLabel><FormControl><CurrencyInput value={field.value ?? 0} onChange={field.onChange} disabled={!!initialData} /></FormControl><FormMessage /></FormItem>
        )} />
        
        <div className="grid grid-cols-2 gap-4">
          <CashAccountFormField control={form.control} name="minBalance" render={({ field }) => (
            <FormItem><FormLabel>Số dư tối thiểu</FormLabel><FormControl><CurrencyInput value={field.value ?? 0} onChange={field.onChange} placeholder="0" /></FormControl><FormDescription>Cảnh báo khi dưới mức này</FormDescription><FormMessage /></FormItem>
          )} />
          <CashAccountFormField control={form.control} name="maxBalance" render={({ field }) => (
            <FormItem><FormLabel>Số dư tối đa</FormLabel><FormControl><CurrencyInput value={field.value ?? 0} onChange={field.onChange} placeholder="0" /></FormControl><FormDescription>Cảnh báo khi vượt mức này</FormDescription><FormMessage /></FormItem>
          )} />
        </div>
        
        <CashAccountFormField control={form.control} name="isActive" render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <FormLabel>Trạng thái hoạt động</FormLabel>
              <FormDescription>Cho phép sử dụng tài khoản quỹ này</FormDescription>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )} />
      </form>
    </Form>
  );
}

