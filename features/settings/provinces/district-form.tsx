import * as React from "react"
import { useForm } from "react-hook-form"
import type { District } from '@/lib/types/prisma-extended'

import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form"

export interface DistrictFormValues {
  id: number
  name: string
  provinceId: string
}

interface DistrictFormProps {
  initialData?: District | null
  provinceId: string
  onSubmit: (data: DistrictFormValues) => void
  onCancel: () => void
}

export function DistrictForm({ initialData, provinceId, onSubmit, onCancel }: DistrictFormProps) {
  const form = useForm<DistrictFormValues>({
    defaultValues: initialData || {
      id: 0,
      name: '',
      provinceId: provinceId
    }
  })

  const handleSubmit = (data: DistrictFormValues) => {
    onSubmit({
      ...data,
      provinceId: provinceId
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="id"
          rules={{ required: 'Vui lòng nhập mã' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mã Quận/Huyện</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="VD: 760" 
                  {...field} 
                  value={field.value ?? 0}
                  onChange={e => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          rules={{ required: 'Vui lòng nhập tên' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên Quận/Huyện</FormLabel>
              <FormControl>
                <Input 
                  placeholder="VD: Quận 1" 
                  {...field} 
                  value={field.value ?? ''} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
          <Button type="submit">
            {initialData ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
