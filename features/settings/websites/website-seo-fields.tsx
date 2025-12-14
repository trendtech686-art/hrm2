/**
 * Website SEO Fields Component
 * 
 * Reusable component để hiển thị các fields SEO cho một website
 * Sử dụng trong Brand, Category, Product forms
 */
import * as React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TipTapEditor } from '@/components/ui/tiptap-editor';
import { Badge } from '@/components/ui/badge';
import { Globe, ExternalLink } from 'lucide-react';
import type { WebsiteDefinition } from './types';

interface WebsiteSeoFieldsProps {
  websiteCode: string;
  website: WebsiteDefinition;
  form: UseFormReturn<any>;
  fieldPrefix: string; // e.g., 'websiteSeo.pkgx'
  showRichEditor?: boolean; // Show TipTap for long description
  editorSessionId?: string;
  onEditorSessionChange?: (sessionId: string) => void;
}

export function WebsiteSeoFields({
  websiteCode,
  website,
  form,
  fieldPrefix,
  showRichEditor = false,
  editorSessionId,
  onEditorSessionChange,
}: WebsiteSeoFieldsProps) {
  return (
    <div className="space-y-4">
      {/* Website Header */}
      <div className="flex items-center justify-between pb-2 border-b">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" style={{ color: website.color }} />
          <span className="font-medium">{website.name}</span>
          {website.baseUrl && (
            <a
              href={website.baseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
        <Badge 
          variant={website.isActive ? 'default' : 'secondary'}
          style={{ backgroundColor: website.isActive ? website.color : undefined }}
        >
          {website.isActive ? 'Active' : 'Coming soon'}
        </Badge>
      </div>

      {/* SEO Title */}
      <FormField
        control={form.control}
        name={`${fieldPrefix}.seoTitle`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tiêu đề SEO</FormLabel>
            <FormControl>
              <Input
                placeholder={`Tiêu đề cho ${website.shortName}`}
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormDescription>
              Title tag cho trang web. Nên 50-60 ký tự.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Meta Description */}
      <FormField
        control={form.control}
        name={`${fieldPrefix}.metaDescription`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Meta Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder={`Mô tả SEO cho ${website.shortName}`}
                {...field}
                value={field.value || ''}
                rows={2}
              />
            </FormControl>
            <FormDescription>
              Mô tả hiển thị trên Google. Nên 150-160 ký tự.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* SEO Keywords */}
      <FormField
        control={form.control}
        name={`${fieldPrefix}.seoKeywords`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Từ khóa SEO</FormLabel>
            <FormControl>
              <Input
                placeholder="từ khóa 1, từ khóa 2, từ khóa 3"
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormDescription>
              Các từ khóa cách nhau bằng dấu phẩy
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* URL Slug */}
      <FormField
        control={form.control}
        name={`${fieldPrefix}.slug`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL Slug</FormLabel>
            <FormControl>
              <Input
                placeholder="duong-dan-trang"
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormDescription>
              Đường dẫn URL thân thiện (không dấu, lowercase)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Short Description */}
      <FormField
        control={form.control}
        name={`${fieldPrefix}.shortDescription`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mô tả ngắn</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Mô tả ngắn gọn 1-2 câu"
                {...field}
                value={field.value || ''}
                rows={2}
              />
            </FormControl>
            <FormDescription>
              Hiển thị ở đầu trang hoặc listing
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Long Description */}
      <FormField
        control={form.control}
        name={`${fieldPrefix}.longDescription`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mô tả chi tiết</FormLabel>
            <FormControl>
              {showRichEditor ? (
                <div className="border rounded-md">
                  <TipTapEditor
                    content={field.value || ''}
                    onChange={(html) => field.onChange(html)}
                    placeholder="Mô tả đầy đủ với định dạng văn bản..."
                    sessionId={editorSessionId}
                    onSessionChange={onEditorSessionChange}
                  />
                </div>
              ) : (
                <Textarea
                  placeholder="Mô tả chi tiết (hỗ trợ HTML)"
                  {...field}
                  value={field.value || ''}
                  rows={4}
                />
              )}
            </FormControl>
            <FormDescription>
              Nội dung chi tiết, có thể bao gồm HTML
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

/**
 * Simplified SEO Fields (without rich editor)
 */
export function SimpleSeoFields({
  websiteCode,
  website,
  form,
  fieldPrefix,
}: Omit<WebsiteSeoFieldsProps, 'showRichEditor' | 'editorSessionId' | 'onEditorSessionChange'>) {
  return (
    <WebsiteSeoFields
      websiteCode={websiteCode}
      website={website}
      form={form}
      fieldPrefix={fieldPrefix}
      showRichEditor={false}
    />
  );
}
