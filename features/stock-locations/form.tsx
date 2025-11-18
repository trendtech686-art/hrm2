import * as React from "react";
import { useForm } from "react-hook-form";
import type { StockLocation } from "./types.ts";
import { useStockLocationStore } from "./store.ts";
import { useBranchStore } from "../settings/branches/store.ts";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form.tsx";
import { Input } from "../../components/ui/input.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select.tsx";

export type StockLocationFormValues = Omit<StockLocation, 'systemId'>;

type FormProps = {
  initialData?: StockLocation | null;
  onSubmit: (values: StockLocationFormValues) => void;
};

export function StockLocationForm({ initialData, onSubmit }: FormProps) {
  const { data: branches } = useBranchStore();
  const form = useForm<StockLocationFormValues>({
    defaultValues: initialData || {
      id: '', // Let store generate LOC ID
      name: "",
      branchSystemId: branches.find(b => b.isDefault)?.systemId || '',
    },
  });

  return (
    <Form {...form}>
      <form id="stock-location-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem><FormLabel>Tên điểm lưu kho <span className="text-destructive">*</span></FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="id" render={({ field }) => (
            <FormItem><FormLabel>Mã</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="branchSystemId" render={({ field }) => (
            <FormItem><FormLabel>Chi nhánh</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Chọn chi nhánh" /></SelectTrigger></FormControl>
                    <SelectContent>{branches.map(b => <SelectItem key={b.systemId} value={b.systemId}>{b.name}</SelectItem>)}</SelectContent>
                </Select>
            <FormMessage />
            </FormItem>
          )} />
        </div>
      </form>
    </Form>
  );
}
