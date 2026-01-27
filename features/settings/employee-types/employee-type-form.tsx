'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import type { EmployeeTypeSetting } from '@/lib/types/prisma-extended'

const formSchema = z.object({
  id: z.string().min(1, 'Mã loại nhân viên là bắt buộc').regex(/^[A-Za-z0-9_-]+$/, 'Chỉ cho phép chữ, số, - và _'),
  name: z.string().min(1, 'Tên loại nhân viên là bắt buộc'),
  description: z.string().optional(),
  isDefault: z.boolean().optional(),
  sortOrder: z.number().optional(),
})

export type EmployeeTypeFormValues = z.infer<typeof formSchema>

interface EmployeeTypeFormProps {
  initialData?: EmployeeTypeSetting | null
  onSubmit: (values: EmployeeTypeFormValues) => void
  onCancel: () => void
  isLoading?: boolean
}

export function EmployeeTypeForm({ initialData, onSubmit, onCancel, isLoading }: EmployeeTypeFormProps) {
  const form = useForm<EmployeeTypeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: initialData?.id || '',
      name: initialData?.name || '',
      description: initialData?.description || '',
      isDefault: initialData?.isDefault || false,
      sortOrder: initialData?.sortOrder || 0,
    },
  })

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation() // Prevent bubbling to parent form
    form.handleSubmit(onSubmit)(e)
  }

  return (
    <Form {...form}>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mã loại nhân viên <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input placeholder="VD: FULLTIME, PARTTIME..." {...field} disabled={!!initialData} />
              </FormControl>
              <FormDescription>Chỉ cho phép chữ, số, dấu - và _</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên loại nhân viên <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input placeholder="VD: Chính thức, Thử việc..." {...field} />
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
                <Textarea placeholder="Mô tả chi tiết về loại nhân viên này..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isDefault"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Loại mặc định</FormLabel>
                <FormDescription>
                  Sử dụng làm mặc định khi thêm nhân viên mới
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Đang lưu...' : initialData ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
