import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { PaymentMethod } from "./types.ts";
import { usePaymentMethodStore } from "./store.ts";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "../../../../components/ui/form.tsx";
import { Input } from "../../../../components/ui/input.tsx";
import { Switch } from "../../../../components/ui/switch.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select.tsx";
import * as Icons from "lucide-react";

const ICON_OPTIONS = [
  { value: 'Wallet', label: 'Ví tiền (Wallet)' },
  { value: 'CreditCard', label: 'Thẻ tín dụng (Credit Card)' },
  { value: 'Banknote', label: 'Tiền mặt (Banknote)' },
  { value: 'ArrowRightLeft', label: 'Chuyển khoản (Transfer)' },
  { value: 'Package', label: 'COD (Package)' },
  { value: 'Smartphone', label: 'Ví điện tử (E-Wallet)' },
  { value: 'QrCode', label: 'QR Code' },
];

const COLOR_OPTIONS = [
  { value: '#10b981', label: 'Xanh lá' },
  { value: '#3b82f6', label: 'Xanh dương' },
  { value: '#8b5cf6', label: 'Tím' },
  { value: '#f59e0b', label: 'Cam' },
  { value: '#ef4444', label: 'Đỏ' },
  { value: '#ec4899', label: 'Hồng' },
  { value: '#14b8a6', label: 'Xanh ngọc' },
  { value: '#6b7280', label: 'Xám' },
];

const formSchema = z.object({
  name: z.string().min(1, "Tên hình thức là bắt buộc").max(100, "Tên không được vượt quá 100 ký tự"),
  isActive: z.boolean(),
  color: z.string().optional(),
  icon: z.string().optional(),
  description: z.string().optional(),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  bankName: z.string().optional(),
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
          color: initialData.color ?? '#10b981',
          icon: initialData.icon ?? 'Wallet',
          description: initialData.description ?? '',
          accountNumber: initialData.accountNumber ?? '',
          accountName: initialData.accountName ?? '',
          bankName: initialData.bankName ?? '',
        }
      : {
          name: '',
          isActive: true,
          color: '#10b981',
          icon: 'Wallet',
          description: '',
          accountNumber: '',
          accountName: '',
          bankName: '',
        },
  });

  return (
    <Form {...form}>
      <form id="payment-method-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem><FormLabel>Tên hình thức thanh toán <span className="text-destructive">*</span></FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        
        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem><FormLabel>Mô tả</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        
        <FormField control={form.control} name="color" render={({ field }) => (
          <FormItem>
            <FormLabel>Màu sắc</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn màu sắc" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {COLOR_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded" style={{ backgroundColor: option.value }} />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
        
        <FormField control={form.control} name="icon" render={({ field }) => (
          <FormItem>
            <FormLabel>Icon</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn icon" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {ICON_OPTIONS.map(option => {
                  const IconComponent = (Icons as any)[option.value];
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        {IconComponent && <IconComponent className="h-4 w-4" />}
                        {option.label}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />
        
        {/* Bank account fields (for transfer methods) */}
        <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
          <p className="text-sm font-medium text-muted-foreground">Thông tin tài khoản (dành cho chuyển khoản)</p>
          
          <FormField control={form.control} name="accountNumber" render={({ field }) => (
            <FormItem><FormLabel>Số tài khoản</FormLabel><FormControl><Input {...field} placeholder="VD: 1234567890" /></FormControl><FormMessage /></FormItem>
          )} />
          
          <FormField control={form.control} name="accountName" render={({ field }) => (
            <FormItem><FormLabel>Tên chủ tài khoản</FormLabel><FormControl><Input {...field} placeholder="VD: NGUYEN VAN A" /></FormControl><FormMessage /></FormItem>
          )} />
          
          <FormField control={form.control} name="bankName" render={({ field }) => (
            <FormItem><FormLabel>Tên ngân hàng</FormLabel><FormControl><Input {...field} placeholder="VD: Vietcombank - CN HCM" /></FormControl><FormMessage /></FormItem>
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
