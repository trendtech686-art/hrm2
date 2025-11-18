import * as React from "react";
import { useForm } from "react-hook-form"
import type { Department } from "./types.ts"
import { useDepartmentStore } from "./store.ts";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form.tsx"
import { Input } from "../../../components/ui/input.tsx"

export type DepartmentFormValues = Omit<Department, 'systemId' | 'jobTitleIds' | 'managerId'> & { name: string; id: string };


type DepartmentFormProps = {
  initialData: Department | null
  onSubmit: (values: DepartmentFormValues) => void;
}

export function DepartmentForm({ initialData, onSubmit }: DepartmentFormProps) {
  const { data: departments } = useDepartmentStore();
  const form = useForm<DepartmentFormValues>({
    defaultValues: initialData || {
      id: '',
      name: "",
    },
  })

  return (
    <Form {...form}>
      <form id="department-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mã phòng ban</FormLabel>
              <FormControl>
                <Input placeholder="VD: KD, KT" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên phòng ban</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên phòng ban" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
