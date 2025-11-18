import * as React from 'react';
import { useForm } from 'react-hook-form';
import type { Tax, TaxFormValues } from './types.ts';
import { useTaxStore } from './store.ts';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../components/ui/form.tsx';
import { Input } from '../../../components/ui/input.tsx';
import { Button } from '../../../components/ui/button.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select.tsx';
import { Checkbox } from '../../../components/ui/checkbox.tsx';

type TaxFormProps = {
  initialData: Tax | null;
  onSubmit: (values: TaxFormValues) => void;
  onCancel: () => void;
};

export function TaxForm({ initialData, onSubmit, onCancel }: TaxFormProps) {
  const form = useForm<TaxFormValues>({
    defaultValues: initialData || {
      id: '', // Let store generate TAX ID
      name: '',
      rate: 0,
      type: 'purchase', // Default type, will be overridden
      isDefault: false,
      description: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Tên thuế */}
        <FormField
          name="name"
          control={form.control}
          rules={{ required: 'Tên thuế là bắt buộc' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Tên thuế <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Ví dụ: VAT" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mã thuế */}
          <FormField
            name="id"
            control={form.control}
            rules={{ required: 'Mã thuế là bắt buộc' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Mã thuế <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Ví dụ: THUEDAUVAO" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Thuế suất */}
          <FormField
            name="rate"
            control={form.control}
            rules={{
              required: 'Thuế suất là bắt buộc',
              min: { value: 0, message: 'Thuế suất phải >= 0' },
              max: { value: 100, message: 'Thuế suất phải <= 100' },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Thuế suất (%) <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="Ví dụ: 10%"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Thoát
          </Button>
          <Button type="submit">
            Xác nhận
          </Button>
        </div>
      </form>
    </Form>
  );
}
