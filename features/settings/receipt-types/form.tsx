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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select.tsx";

const COLOR_OPTIONS = [
  { value: '#10b981', label: 'Xanh lá' },
  { value: '#3b82f6', label: 'Xanh dương' },
  { value: '#8b5cf6', label: 'Tím' },
  { value: '#f59e0b', label: 'Cam' },
  { value: '#ef4444', label: 'Đỏ' },
  { value: '#ec4899', label: 'Hồng' },
  { value: '#14b8a6', label: 'Xanh ngọc' },
  { value: '#06b6d4', label: 'Xanh cyan' },
  { value: '#a855f7', label: 'Tím đậm' },
  { value: '#22c55e', label: 'Xanh lá đậm' },
  { value: '#0ea5e9', label: 'Xanh sky' },
  { value: '#6b7280', label: 'Xám' },
];

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
    color: '#10b981',
  }), []);

  const form = useForm<ReceiptTypeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ?? defaultValues,
  });

  React.useEffect(() => {
    form.reset(initialData ?? defaultValues);
  }, [form, initialData, defaultValues]);

  return (
    <Form {...form}>
      <form id="receipt-type-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4 max-h-[70vh] overflow-y-auto px-1">
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel>Tên <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input {...field} className="h-9" />
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
              <Textarea {...field} rows={3} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        
        <FormField control={form.control} name="color" render={({ field }) => (
          <FormItem>
            <FormLabel>Màu sắc</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn màu sắc" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {COLOR_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: option.value }} />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
