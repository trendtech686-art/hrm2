import * as React from "react";
import { useForm } from "react-hook-form"
import type { JobTitle } from "./types.ts"
import { useJobTitleStore } from "./store.ts";

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
import { Textarea } from "../../../components/ui/textarea.tsx";

export type JobTitleFormValues = Omit<JobTitle, 'systemId'>;

type JobTitleFormProps = {
  initialData: JobTitle | null
  onSubmit: (values: JobTitleFormValues) => void;
  onCancel: () => void;
}

export function JobTitleForm({ initialData, onSubmit, onCancel }: JobTitleFormProps) {
  const { data: jobTitles } = useJobTitleStore();
  const form = useForm<JobTitleFormValues>({
    defaultValues: initialData || {
      id: "", // ✅ Empty string = auto-generate
      name: "",
      description: "",
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
         <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mã chức vụ</FormLabel>
              <FormControl>
                <Input placeholder="VD: NV, TP" {...field} />
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
              <FormLabel>Tên chức vụ</FormLabel>
              <FormControl>
                <Input placeholder="VD: Trưởng phòng" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea placeholder="Mô tả vai trò, trách nhiệm của chức vụ..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>Hủy</Button>
            <Button type="submit">Lưu</Button>
        </div>
      </form>
    </Form>
  )
}
