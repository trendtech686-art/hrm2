import * as React from "react"
import { useForm } from "react-hook-form"
import type { District } from "./types"

import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"

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
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="id">Mã Quận/Huyện</Label>
        <Input
          id="id"
          type="number"
          placeholder="VD: 760"
          {...form.register('id', { 
            required: 'Vui lòng nhập mã',
            valueAsNumber: true
          })}
        />
        {form.formState.errors.id && (
          <p className="text-sm text-destructive">{form.formState.errors.id.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Tên Quận/Huyện</Label>
        <Input
          id="name"
          placeholder="VD: Quận 1"
          {...form.register('name', { required: 'Vui lòng nhập tên' })}
        />
        {form.formState.errors.name && (
          <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit">
          {initialData ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </div>
    </form>
  )
}
