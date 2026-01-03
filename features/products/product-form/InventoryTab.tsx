'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Combobox } from '@/components/ui/combobox';
import type { ProductFormCompleteValues, ComboboxOption } from './types';

interface InventoryTabProps {
  storageLocationOptions: ComboboxOption[];
}

export function InventoryTab({ storageLocationOptions }: InventoryTabProps) {
  const form = useFormContext<ProductFormCompleteValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quản lý kho</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="isStockTracked"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value !== false}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="h-4 w-4"
                />
              </FormControl>
              <FormLabel className="!mt-0">Theo dõi tồn kho</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="storageLocationSystemId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Điểm lưu kho</FormLabel>
              <FormControl>
                <Combobox
                  options={storageLocationOptions}
                  value={storageLocationOptions.find(opt => opt.value === field.value) || null}
                  onChange={option => field.onChange(option?.value)}
                  placeholder="Chọn điểm lưu kho"
                  searchPlaceholder="Tìm kiếm..."
                  emptyPlaceholder="Không tìm thấy"
                />
              </FormControl>
              <FormDescription>
                Vị trí lưu trữ sản phẩm trong kho
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="reorderLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mức đặt hàng lại</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    placeholder="0"
                  />
                </FormControl>
                <FormDescription>
                  Cảnh báo khi tồn kho xuống dưới mức này
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="safetyStock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tồn kho an toàn</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    placeholder="0"
                  />
                </FormControl>
                <FormDescription>
                  Mức tồn dự phòng tối thiểu
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxStock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mức tồn tối đa</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    placeholder="0"
                  />
                </FormControl>
                <FormDescription>
                  Giới hạn tồn kho tối đa
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
