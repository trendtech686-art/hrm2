import * as React from "react";
import { useForm } from "react-hook-form";
import type { SalaryComponent } from "./types.ts";
import { Button } from "../../../components/ui/button.tsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form.tsx";
import { Input } from "../../../components/ui/input.tsx";
import { Switch } from "../../../components/ui/switch.tsx";
import { DialogFooter } from "../../../components/ui/dialog.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select.tsx";
import { NumberInput } from "../../../components/ui/number-input.tsx";

export type SalaryComponentFormValues = Omit<SalaryComponent, 'systemId' | 'id' | 'applicableDepartmentSystemIds' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>;

type SalaryComponentFormProps = {
  initialData?: SalaryComponentFormValues;
  onSubmit: (values: SalaryComponentFormValues) => void;
  onCancel: () => void;
};

export function SalaryComponentForm({ initialData, onSubmit, onCancel }: SalaryComponentFormProps) {
  const form = useForm<SalaryComponentFormValues>({
    defaultValues: initialData || {
      name: '',
      type: 'fixed',
      amount: 0,
      formula: '',
      taxable: false,
      partOfSocialInsurance: false,
    },
  });

  const componentType = form.watch('type');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Tên thành phần</FormLabel>
            <FormControl><Input placeholder="VD: Phụ cấp ăn trưa" {...field} value={field.value as string} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="type" render={({ field }) => (
          <FormItem>
            <FormLabel>Loại</FormLabel>
            <Select onValueChange={field.onChange} value={field.value as string}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                    <SelectItem value="fixed">Khoản cố định</SelectItem>
                    <SelectItem value="formula">Theo công thức</SelectItem>
                </SelectContent>
            </Select>
          </FormItem>
        )} />

        {componentType === 'fixed' ? (
            <FormField control={form.control} name="amount" render={({ field }) => (
              <FormItem>
                <FormLabel>Số tiền</FormLabel>
                <FormControl><NumberInput {...field} value={field.value as number} onChange={field.onChange} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
        ) : (
            <FormField control={form.control} name="formula" render={({ field }) => (
              <FormItem>
                <FormLabel>Công thức</FormLabel>
                <FormControl><Input placeholder="VD: [LUONG_CO_BAN] * 0.1" {...field} value={field.value as string} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
        )}

        <FormField control={form.control} name="taxable" render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <FormLabel>Tính thuế TNCN</FormLabel>
            <FormControl><Switch checked={field.value as boolean} onCheckedChange={field.onChange} /></FormControl>
          </FormItem>
        )} />
        <FormField control={form.control} name="partOfSocialInsurance" render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <FormLabel>Tính vào lương đóng BHXH</FormLabel>
            <FormControl><Switch checked={field.value as boolean} onCheckedChange={field.onChange} /></FormControl>
          </FormItem>
        )} />
        <DialogFooter className="pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Hủy</Button>
          <Button type="submit">Lưu</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
