'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { ProductFormCompleteValues } from './types';

export function LabelTab() {
  const form = useFormContext<ProductFormCompleteValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin tem phụ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="nameVat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên hàng hóa (VAT)</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} placeholder="Tên hàng hóa trên hóa đơn VAT" />
              </FormControl>
              <FormDescription>
                Tên sản phẩm sẽ hiển thị trên hóa đơn VAT
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="origin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Xuất xứ</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} placeholder="Nhập xuất xứ" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="importerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên nhà nhập khẩu</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} placeholder="Nhập tên nhà nhập khẩu" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="importerAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa chỉ nhà nhập khẩu</FormLabel>
              <FormControl>
                <Textarea {...field} value={field.value || ''} placeholder="Nhập địa chỉ nhà nhập khẩu" rows={2} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="usageGuide"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hướng dẫn sử dụng</FormLabel>
              <FormControl>
                <Textarea {...field} value={field.value || ''} placeholder="Nhập hướng dẫn sử dụng" rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
