import * as React from "react";
import { useForm } from "react-hook-form";
import type { LeaveType } from "./types.ts";
import { Button } from "../../../components/ui/button.tsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form.tsx";
import { Input } from "../../../components/ui/input.tsx";
import { Switch } from "../../../components/ui/switch.tsx";
import { DialogFooter } from "../../../components/ui/dialog.tsx";
import { NumberInput } from "../../../components/ui/number-input.tsx";

export type LeaveTypeFormValues = Omit<LeaveType, 'systemId' | 'id' | 'applicableGender' | 'applicableDepartmentSystemIds' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'>;

type LeaveTypeFormProps = {
  initialData?: LeaveTypeFormValues | undefined;
  onSubmit: (values: LeaveTypeFormValues) => void;
  onCancel: () => void;
};

export function LeaveTypeForm({ initialData, onSubmit, onCancel }: LeaveTypeFormProps) {
  const form = useForm<LeaveTypeFormValues>({
    defaultValues: initialData || {
      name: '',
      numberOfDays: 0,
      isPaid: true,
      requiresAttachment: false,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Tên loại phép</FormLabel>
            <FormControl><Input placeholder="VD: Nghỉ kết hôn" {...field} value={field.value ?? ''} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="numberOfDays" render={({ field }) => (
          <FormItem>
            <FormLabel>Số ngày nghỉ</FormLabel>
            <FormControl><NumberInput {...field} value={field.value ?? 0} onChange={field.onChange} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="isPaid" render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Được hưởng lương</FormLabel>
            </div>
            <FormControl><Switch checked={field.value ?? false} onCheckedChange={field.onChange} /></FormControl>
          </FormItem>
        )} />
        <FormField control={form.control} name="requiresAttachment" render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <FormLabel>Yêu cầu tài liệu đính kèm</FormLabel>
            </div>
            <FormControl><Switch checked={field.value ?? false} onCheckedChange={field.onChange} /></FormControl>
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
