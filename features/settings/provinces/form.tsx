import * as React from "react";
import { useForm } from "react-hook-form"
import type { Province } from "./types.ts"
import { useProvinceStore } from "./store.ts";
import { Button } from "../../../components/ui/button.tsx"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form.tsx"
import { Input } from "../../../components/ui/input.tsx"

export type ProvinceFormValues = Omit<Province, 'systemId'>;

type ProvinceFormProps = {
  initialData: Province | null
  onSubmit: (values: ProvinceFormValues) => void;
  onCancel: () => void;
}

export function ProvinceForm({ initialData, onSubmit, onCancel }: ProvinceFormProps) {
  const { data: provinces } = useProvinceStore();
  const form = useForm<ProvinceFormValues>({
    defaultValues: initialData || {
      id: "", // ✅ Empty string = auto-generate
      name: "",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField control={form.control} name="id" render={({ field }) => (
          <FormItem>
            <FormLabel>Mã Tỉnh thành</FormLabel>
            <FormControl><Input placeholder="VD: T000001" {...field} value={field.value ?? ''} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Tên Tỉnh thành</FormLabel>
            <FormControl><Input placeholder="VD: TP. Hồ Chí Minh" {...field} value={field.value ?? ''} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>Hủy</Button>
            <Button type="submit">Lưu</Button>
        </div>
      </form>
    </Form>
  )
}
