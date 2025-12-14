import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { ReceiptType } from "./types.ts";
import { useReceiptTypeStore } from "./store.ts";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "../../../components/ui/form.tsx";
import { Input } from "../../../components/ui/input.tsx";
import { Textarea } from "../../../components/ui/textarea.tsx";
import { Checkbox } from "../../../components/ui/checkbox.tsx";
import { Label } from "../../../components/ui/label.tsx";
import { Switch } from "../../../components/ui/switch.tsx";

const formSchema = z.object({
  id: z.string().min(1, "Mã loại là bắt buộc"),
  name: z.string().min(1, "Tên loại là bắt buộc").max(100, "Tên không được vượt quá 100 ký tự"),
  description: z.string().optional(),
  isBusinessResult: z.boolean(),
  isActive: z.boolean(),
  color: z.string().optional(),
});

export type ReceiptTypeFormValues = z.infer<typeof formSchema>;

type FormProps = {
  initialData?: ReceiptType | null;
  onSubmit: (values: ReceiptTypeFormValues) => void;
};

export function ReceiptTypeForm({ initialData, onSubmit }: FormProps) {
  const defaultValues: ReceiptTypeFormValues = React.useMemo(() => ({
    id: '',
    name: "",
    description: "",
    isBusinessResult: true,
    isActive: true,
    color: '#22c55e',
  }), []);

  const form = useForm<ReceiptTypeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          id: initialData.id,
          name: initialData.name,
          description: initialData.description ?? '',
          isBusinessResult: initialData.isBusinessResult,
          isActive: initialData.isActive,
          color: initialData.color ?? '',
        }
      : defaultValues,
  });

  React.useEffect(() => {
    if (initialData) {
      form.reset({
        id: initialData.id,
        name: initialData.name,
        description: initialData.description ?? '',
        isBusinessResult: initialData.isBusinessResult,
        isActive: initialData.isActive,
        color: initialData.color ?? '',
      });
    } else {
      form.reset(defaultValues);
    }
  }, [form, initialData, defaultValues]);

  return (
    <Form {...form}>
      <form id="receipt-type-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4 max-h-[70vh] overflow-y-auto px-1">
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel>Tên <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} className="h-9" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="id" render={({ field }) => (
            <FormItem>
              <FormLabel>Mã</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ''}
                  className="h-9 uppercase"
                  onChange={(event) => field.onChange(event.target.value.toUpperCase())}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>
        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel>Mô tả</FormLabel>
            <FormControl>
              <Textarea {...field} value={field.value ?? ''} rows={3} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="color" render={({ field }) => (
          <FormItem>
            <FormLabel>Màu hiển thị</FormLabel>
            <FormControl>
              <Input {...field} value={field.value ?? ''} placeholder="#22c55e" />
            </FormControl>
            <FormDescription>Giúp phân biệt loại phiếu thu trên báo cáo</FormDescription>
            <FormMessage />
          </FormItem>
        )} />
        
        <FormField control={form.control} name="isBusinessResult" render={({ field }) => (
          <FormItem className="flex items-center space-x-2">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(Boolean(checked))}
              />
            </FormControl>
            <Label>Hạch toán kết quả kinh doanh</Label>
          </FormItem>
        )} />
        
        <FormField control={form.control} name="isActive" render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <FormLabel>Trạng thái hoạt động</FormLabel>
              <FormDescription>Cho phép sử dụng loại phiếu thu này</FormDescription>
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
