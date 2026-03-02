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

export function SeoPkgxTab() {
  const form = useFormContext<ProductFormCompleteValues>();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5" style={{ color: '#ef4444' }} />
          <CardTitle>SEO cho PKGX</CardTitle>
        </div>
        <CardDescription>phukiengiaxuong.com.vn - SEO riêng cho website này (override SEO chung)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="seoPkgx.seoTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề SEO</FormLabel>
              <FormControl>
                <Input placeholder="Tiêu đề cho PKGX" {...field} value={field.value || ''} />
              </FormControl>
              <FormDescription>Title tag. Nên 50-60 ký tự.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="seoPkgx.metaDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Mô tả SEO cho PKGX" {...field} value={field.value || ''} rows={2} />
              </FormControl>
              <FormDescription>Nên 150-160 ký tự.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="seoPkgx.seoKeywords"
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
          name="seoPkgx.shortDescription"
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
          name="seoPkgx.longDescription"
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
