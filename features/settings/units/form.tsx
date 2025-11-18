import * as React from "react";
import { useForm } from "react-hook-form";
import type { Unit } from "./types.ts";
import { useUnitStore } from "./store.ts";
import { Button } from "../../../components/ui/button.tsx";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form.tsx";
import { Input } from "../../../components/ui/input.tsx";
import { Textarea } from "../../../components/ui/textarea.tsx";

export type UnitFormValues = Omit<Unit, 'systemId'>;

type UnitFormProps = {
  initialData: Unit | null;
  onSubmit: (values: UnitFormValues) => void;
};

export function UnitForm({ initialData, onSubmit }: UnitFormProps) {
  const form = useForm<UnitFormValues>({
    defaultValues: initialData || {
      id: '', // Let store generate DVT ID
      name: "",
      description: "",
    },
  });

  return (
    <Form {...form}>
      <form id="unit-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
        <FormField control={form.control} name="id" render={({ field }) => (
          <FormItem><FormLabel>Mã đơn vị tính</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem><FormLabel>Tên đơn vị tính</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem><FormLabel>Mô tả</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
        )} />
      </form>
    </Form>
  );
}
