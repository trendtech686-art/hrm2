'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TipTapEditor } from '@/components/ui/tiptap-editor';
import type { ProductFormCompleteValues } from './types';

export function SeoDefaultTab() {
  const form = useFormContext<ProductFormCompleteValues>();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          <CardTitle>SEO Mặc định</CardTitle>
        </div>
        <CardDescription>
          Thông tin SEO chung - sẽ được dùng cho tất cả website nếu không có SEO riêng
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề SEO (ktitle)</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} placeholder="Tiêu đề tối ưu SEO" />
              </FormControl>
              <FormDescription>
                Title tag mặc định. Nên 50-60 ký tự. Nếu để trống sẽ dùng tên sản phẩm.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="seoDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta Description</FormLabel>
              <FormControl>
                <Textarea {...field} value={field.value || ''} placeholder="Mô tả ngắn gọn về sản phẩm cho SEO" rows={2} />
              </FormControl>
              <FormDescription>
                Meta description mặc định. Nên 150-160 ký tự.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="seoKeywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Từ khóa SEO</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} placeholder="từ khóa 1, từ khóa 2, từ khóa 3" />
              </FormControl>
              <FormDescription>
                Các từ khóa cách nhau bởi dấu phẩy. Nên 3-5 từ khóa.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shortDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả ngắn</FormLabel>
              <FormControl>
                <TipTapEditor
                  content={field.value || ''}
                  onChange={field.onChange}
                  placeholder="Mô tả ngắn gọn 1-2 câu về sản phẩm..."
                  minHeight="100px"
                />
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
              <FormLabel>Mô tả chi tiết</FormLabel>
              <FormControl>
                <TipTapEditor
                  content={field.value || ''}
                  onChange={field.onChange}
                  placeholder="Mô tả đầy đủ về sản phẩm..."
                  minHeight="250px"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
