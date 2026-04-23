'use client';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { mobileBleedCardClass } from '@/components/layout/page-section';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TipTapEditor } from '@/components/ui/tiptap-editor';
import type { ProductFormCompleteValues } from './types';

export function SeoTrendtechTab() {
  const form = useFormContext<ProductFormCompleteValues>();

  return (
    <Card className={mobileBleedCardClass}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5" style={{ color: '#3b82f6' }} />
          <CardTitle>SEO cho Trendtech</CardTitle>
        </div>
        <CardDescription>Coming soon - SEO riêng cho website này</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="seoTrendtech.slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug Trendtech (URL)</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} placeholder="ao-so-mi-nam-oxford" />
              </FormControl>
              <FormDescription>
                URL thân thiện SEO cho website Trendtech. Để trống sẽ tự động tạo từ tên sản phẩm.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="seoTrendtech.seoTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề SEO</FormLabel>
              <FormControl>
                <Input placeholder="Tiêu đề cho Trendtech" {...field} value={field.value || ''} />
              </FormControl>
              <FormDescription>Title tag. Nên 50-60 ký tự.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="seoTrendtech.metaDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Mô tả SEO cho Trendtech" {...field} value={field.value || ''} rows={2} />
              </FormControl>
              <FormDescription>Nên 150-160 ký tự.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="seoTrendtech.seoKeywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Từ khóa SEO</FormLabel>
              <FormControl>
                <Input placeholder="từ khóa 1, từ khóa 2" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="seoTrendtech.shortDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả ngắn</FormLabel>
              <FormControl>
                <TipTapEditor
                  content={field.value || ''}
                  onChange={field.onChange}
                  placeholder="Mô tả ngắn gọn 1-2 câu..."
                  minHeight="100px"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="seoTrendtech.longDescription"
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
