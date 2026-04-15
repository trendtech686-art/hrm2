'use client';

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { PaymentMethod } from '@/lib/types/prisma-extended';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import { Switch } from "../../../../components/ui/switch";

const formSchema = z.object({
  id: z.string().min(1, "Mã hình thức là bắt buộc"),
  name: z.string().min(1, "Tên hình thức là bắt buộc").max(100, "Tên không được vượt quá 100 ký tự"),
  isActive: z.boolean(),
  description: z.string().optional(),
});

export type PaymentMethodFormValues = z.infer<typeof formSchema>;

type FormProps = {
  initialData?: PaymentMethod | null;
  onSubmit: (values: PaymentMethodFormValues) => void;
  formRef?: React.RefObject<HTMLFormElement | null>;
};

export function PaymentMethodForm({ initialData, onSubmit, formRef }: FormProps) {
  const form = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          id: initialData.id ?? '',
          name: initialData.name,
          isActive: initialData.isActive,
          description: initialData.description ?? '',
        }
      : {
          id: '',
          name: '',
          isActive: true,
          description: '',
        },
  });

  // Reset form when initialData changes (edit different item or open add new)
  React.useEffect(() => {
    if (initialData) {
      form.reset({
        id: initialData.id ?? '',
        name: initialData.name,
        isActive: initialData.isActive,
        description: initialData.description ?? '',
      });
    } else {
      form.reset({
        id: '',
        name: '',
        isActive: true,
        description: '',
      });
    }
  }, [initialData, form]);

  return (
    <Form {...form}>
      <form ref={formRef} id="payment-method-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem><FormLabel>Tên hình thức thanh toán <span className="text-destructive">*</span></FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="id" render={({ field }) => (
            <FormItem><FormLabel>Mã <span className="text-destructive">*</span></FormLabel><FormControl><Input {...field} value={field.value ?? ''} className="uppercase" onChange={(e) => field.onChange(e.target.value.toUpperCase())} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="description" render={({ field }) => (
            <FormItem><FormLabel>Mô tả</FormLabel><FormControl><Input {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
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
