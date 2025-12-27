import * as React from "react";
import { useForm } from "react-hook-form"
import type { Ward } from '@/lib/types/prisma-extended'

import { Button } from "../../../components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form"
import { Input } from "../../../components/ui/input"

export type WardFormValues = Omit<Ward, 'systemId' | 'provinceId'>;

type WardFormProps = {
  initialData: Ward | null
  onSubmit: (values: WardFormValues) => void;
  onCancel: () => void;
}

export function WardForm({ initialData, onSubmit, onCancel }: WardFormProps) {
  const form = useForm<WardFormValues>({
    defaultValues: initialData || {
      id: "",
      name: "",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField control={form.control} name="id" render={({ field }) => (
          <FormItem>
            <FormLabel>Mã Phường/Xã</FormLabel>
            <FormControl><Input placeholder="VD: 00001" {...field} value={field.value ?? ''} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel>Tên Phường/Xã</FormLabel>
            <FormControl><Input placeholder="VD: Phường Phúc Xá" {...field} value={field.value ?? ''} /></FormControl>
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
