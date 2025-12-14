import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { PaymentMethod } from "./types.ts";
import { usePaymentMethodStore } from "./store.ts";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "../../../../components/ui/form.tsx";
import { Input } from "../../../../components/ui/input.tsx";
import { Switch } from "../../../../components/ui/switch.tsx";

const formSchema = z.object({
  name: z.string().min(1, "Tên hình thức là bắt buộc").max(100, "Tên không được vượt quá 100 ký tự"),
  isActive: z.boolean(),
  description: z.string().optional(),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  bankName: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
});

export type PaymentMethodFormValues = z.infer<typeof formSchema>;

type FormProps = {
  initialData?: PaymentMethod | null;
  onSubmit: (values: PaymentMethodFormValues) => void;
};

export function PaymentMethodForm({ initialData, onSubmit }: FormProps) {
  const form = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          isActive: initialData.isActive,
          description: initialData.description ?? '',
          accountNumber: initialData.accountNumber ?? '',
          accountName: initialData.accountName ?? '',
          bankName: initialData.bankName ?? '',
          color: initialData.color ?? '',
          icon: initialData.icon ?? '',
        }
      : {
          name: '',
          isActive: true,
          description: '',
          accountNumber: '',
          accountName: '',
          bankName: '',
          color: '#10b981',
          icon: '',
        },
  });

  return (
    <Form {...form}>
      <form id="payment-method-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem><FormLabel>Tên hình thức thanh toán <span className="text-destructive">*</span></FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
        )} />
        
        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem><FormLabel>Mô tả</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
        )} />

        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="color" render={({ field }) => (
            <FormItem>
              <FormLabel>Màu hiển thị</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input
                    type="color"
                    value={field.value || '#10b981'}
                    onChange={(event) => field.onChange(event.target.value)}
                    className="h-9 w-14 p-1"
                  />
                  <Input
                    value={field.value || ''}
                    onChange={(event) => field.onChange(event.target.value)}
                    placeholder="#10b981"
                  />
                </div>
              </FormControl>
              <FormDescription>Hiển thị nền icon trong bảng</FormDescription>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="icon" render={({ field }) => (
            <FormItem>
              <FormLabel>Tên icon</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} placeholder="VD: Wallet, CreditCard" />
              </FormControl>
              <FormDescription>Trùng tên icon của Lucide</FormDescription>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        
        {/* Bank account fields (for transfer methods) */}
        <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
          <p className="text-sm font-medium text-muted-foreground">Thông tin tài khoản (dành cho chuyển khoản)</p>
          
          <FormField control={form.control} name="accountNumber" render={({ field }) => (
            <FormItem><FormLabel>Số tài khoản</FormLabel><FormControl><Input {...field} value={field.value ?? ''} placeholder="VD: 1234567890" /></FormControl><FormMessage /></FormItem>
          )} />
          
          <FormField control={form.control} name="accountName" render={({ field }) => (
            <FormItem><FormLabel>Tên chủ tài khoản</FormLabel><FormControl><Input {...field} value={field.value ?? ''} placeholder="VD: NGUYEN VAN A" /></FormControl><FormMessage /></FormItem>
          )} />
          
          <FormField control={form.control} name="bankName" render={({ field }) => (
            <FormItem><FormLabel>Tên ngân hàng</FormLabel><FormControl><Input {...field} value={field.value ?? ''} placeholder="VD: Vietcombank - CN HCM" /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        
        <FormField control={form.control} name="isActive" render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <FormLabel>Trạng thái hoạt động</FormLabel>
              <FormDescription>Cho phép sử dụng hình thức thanh toán này</FormDescription>
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
