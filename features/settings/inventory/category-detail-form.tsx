'use client'

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Trash2, 
  Save,
  X,
  Check,
  Globe
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Switch } from '../../../components/ui/switch';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { OptimizedImage } from '../../../components/ui/optimized-image';
import { VirtualizedCombobox, type ComboboxOption } from '../../../components/ui/virtualized-combobox';
import { TipTapEditor } from '../../../components/ui/tiptap-editor';
import { NewDocumentsUpload } from '../../../components/ui/new-documents-upload';
import { FileUploadAPI, type StagingFile } from '../../../lib/file-upload-api';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../components/ui/form';
import type { ProductCategory, WebsiteSeoData } from './types';
// SystemId is imported indirectly via ProductCategory type
import { nanoid } from 'nanoid';
import { SeoAnalysisPanel } from '../../../components/shared/seo-preview';
import { logError } from '@/lib/logger'

// Helper to safely access websiteSeo
function getWebsiteSeo(category?: ProductCategory | null): Record<string, WebsiteSeoData> | undefined {
  if (!category?.websiteSeo) return undefined;
  return category.websiteSeo as Record<string, WebsiteSeoData>;
}

// =============================================================================
// FORM SCHEMA
// =============================================================================

// Schema cho SEO của một website
const websiteSeoSchema = z.object({
  seoTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  slug: z.string().optional(),
}).optional();

const categoryFormSchema = z.object({
  name: z.string().min(1, 'Tên danh mục là bắt buộc'),
  slug: z.string().optional(),
  seoTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  parentId: z.string().optional(),
  color: z.string().optional(),
  thumbnailImage: z.string().optional(),
  sortOrder: z.number().optional(),
  isActive: z.boolean().optional(),
  // SEO cho từng website
  websiteSeo: z.object({
    pkgx: websiteSeoSchema,
    trendtech: websiteSeoSchema,
  }).optional(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

// =============================================================================
// COMPONENT PROPS
// =============================================================================

export interface CategoryDetailFormProps {
  category: ProductCategory | null;
  isNew: boolean;
  parentCategory?: ProductCategory;
  allCategories: ProductCategory[];
  existingIds: string[];
  onSave: (data: CategoryFormValues) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

// =============================================================================
// CATEGORY DETAIL FORM COMPONENT
// =============================================================================

export function CategoryDetailForm({
  category,
  isNew,
  parentCategory,
  allCategories,
  existingIds: _existingIds,
  onSave,
  onCancel,
  onDelete,
}: CategoryDetailFormProps) {
  const [activeTab, setActiveTab] = React.useState<'general' | 'seo-default' | 'seo-pkgx' | 'seo-trendtech'>('general');
  
  // Image upload state (thumbnail)
  const [thumbnailFiles, setThumbnailFiles] = React.useState<StagingFile[]>([]);
  const [thumbnailSessionId, setThumbnailSessionId] = React.useState<string | undefined>();
  
  // Editor image staging state (description)
  const [editorSessionId, setEditorSessionId] = React.useState<string | undefined>();
  const [editorStagingFiles, setEditorStagingFiles] = React.useState<StagingFile[]>([]);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category?.name || '',
      slug: category?.slug || '',
      seoTitle: category?.seoTitle || '',
      metaDescription: category?.metaDescription || '',
      shortDescription: category?.shortDescription || '',
      longDescription: category?.longDescription || '',
      parentId: category?.parentId || parentCategory?.systemId || undefined,
      thumbnailImage: category?.thumbnailImage || '',
      sortOrder: category?.sortOrder || 0,
      isActive: category?.isActive !== undefined ? category.isActive : true,
      websiteSeo: {
        pkgx: getWebsiteSeo(category)?.pkgx || {},
        trendtech: getWebsiteSeo(category)?.trendtech || {},
      },
    },
  });

  // Reset form when category changes
  React.useEffect(() => {
    form.reset({
      name: category?.name || '',
      slug: category?.slug || '',
      seoTitle: category?.seoTitle || '',
      metaDescription: category?.metaDescription || '',
      shortDescription: category?.shortDescription || '',
      longDescription: category?.longDescription || '',
      parentId: category?.parentId || parentCategory?.systemId || undefined,
      thumbnailImage: category?.thumbnailImage || '',
      sortOrder: category?.sortOrder || 0,
      isActive: category?.isActive !== undefined ? category.isActive : true,
      websiteSeo: {
        pkgx: getWebsiteSeo(category)?.pkgx || {},
        trendtech: getWebsiteSeo(category)?.trendtech || {},
      },
    });
    // Reset image upload state
    setThumbnailFiles([]);
    setThumbnailSessionId(undefined);
    // Reset editor staging state
    setEditorSessionId(undefined);
    setEditorStagingFiles([]);
    setActiveTab('general');
  }, [category, parentCategory, form]);

  // Auto-generate slug
  const watchName = form.watch('name');
  
  // Watch SEO fields for PKGX
  const watchedPkgxSeoTitle = form.watch('websiteSeo.pkgx.seoTitle');
  const watchedPkgxMetaDesc = form.watch('websiteSeo.pkgx.metaDescription');
  const watchedPkgxKeywords = form.watch('websiteSeo.pkgx.seoKeywords');
  const watchedPkgxSlug = form.watch('websiteSeo.pkgx.slug');
  
  // Watch SEO fields for Trendtech
  const watchedTrendtechSeoTitle = form.watch('websiteSeo.trendtech.seoTitle');
  const watchedTrendtechMetaDesc = form.watch('websiteSeo.trendtech.metaDescription');
  const watchedTrendtechKeywords = form.watch('websiteSeo.trendtech.seoKeywords');
  const watchedTrendtechSlug = form.watch('websiteSeo.trendtech.slug');

  React.useEffect(() => {
    if (watchName && isNew) {
      const slug = watchName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      form.setValue('slug', slug);
    }
  }, [watchName, isNew, form]);

  const handleSubmit = async (data: CategoryFormValues) => {
    const categoryId = category?.systemId || `CAT_${nanoid(10)}`;
    
    // Confirm thumbnail staging files
    let thumbnailUrl = data.thumbnailImage;
    if (thumbnailFiles.length > 0 && thumbnailSessionId) {
      try {
        await FileUploadAPI.confirmStagingFiles(
          thumbnailSessionId,
          categoryId,
          'categories',
          'thumbnail',
          { name: data.name }
        );
        thumbnailUrl = thumbnailFiles[0]?.url || thumbnailUrl;
      } catch (error) {
        logError('Error confirming thumbnail', error);
      }
    }
    
    // Confirm editor staging files (images in description)
    if (editorStagingFiles.length > 0 && editorSessionId) {
      try {
        await FileUploadAPI.confirmStagingFiles(
          editorSessionId,
          categoryId,
          'categories',
          'content',
          { name: data.name }
        );
      } catch (error) {
        logError('Error confirming editor images', error);
      }
    }
    
    onSave({
      ...data,
      thumbnailImage: thumbnailUrl,
    });
  };

  // Build breadcrumb path
  const getBreadcrumb = () => {
    if (!category?.parentId && !parentCategory) return 'Danh mục gốc';
    
    const path: string[] = [];
    let currentParentId: string | null | undefined = category?.parentId || parentCategory?.systemId;
    
    while (currentParentId) {
      const parent = allCategories.find(c => c.systemId === currentParentId);
      if (parent) {
        path.unshift(parent.name);
        currentParentId = parent.parentId;
      } else {
        break;
      }
    }
    
    return path.length > 0 ? path.join(' → ') : 'Danh mục gốc';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <div>
          <h3 className="font-semibold text-lg">
            {isNew ? 'Thêm danh mục mới' : `Chỉnh sửa: ${category?.name}`}
          </h3>
          <p className="text-sm text-muted-foreground">
            {getBreadcrumb()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && onDelete && (
            <Button variant="outline" size="sm" onClick={onDelete} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-1" />
              Xóa
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              // Reset form to original values
              form.reset();
              // Clear uploaded files
              setThumbnailFiles([]);
              setThumbnailSessionId(undefined);
              // If adding new, cancel the add mode
              if (isNew) {
                onCancel();
              }
            }}
          >
            <X className="h-4 w-4 mr-1" />
            {isNew ? 'Hủy' : 'Hoàn tác'}
          </Button>
          <Button size="sm" onClick={form.handleSubmit(handleSubmit)}>
            <Save className="h-4 w-4 mr-1" />
            {isNew ? 'Tạo mới' : 'Lưu'}
          </Button>
        </div>
      </div>

      {/* Form Content */}
      <ScrollArea className="flex-1">
        <Form {...form}>
          <form className="p-4 space-y-6">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">Thông tin</TabsTrigger>
                <TabsTrigger value="seo-default" className="gap-1">
                  <Globe className="h-3 w-3" />
                  SEO Chung
                </TabsTrigger>
                <TabsTrigger value="seo-pkgx" className="gap-1">
                  <Globe className="h-3 w-3" style={{ color: '#ef4444' }} />
                  SEO PKGX
                </TabsTrigger>
                <TabsTrigger value="seo-trendtech" className="gap-1">
                  <Globe className="h-3 w-3" style={{ color: '#3b82f6' }} />
                  SEO Trendtech
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4 mt-4">
                {/* Basic Info Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Thông tin cơ bản</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tên danh mục <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="VD: Điện tử" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="sortOrder"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Thứ tự</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL Slug</FormLabel>
                          <FormControl>
                            <Input placeholder="dien-tu" {...field} />
                          </FormControl>
                          <FormDescription>Tự động tạo từ tên danh mục</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="parentId"
                      render={({ field }) => {
                        // Filter out current category and its descendants to prevent circular reference
                        const getDescendantIds = (parentId: string): string[] => {
                          const children = allCategories.filter(c => c.parentId === parentId);
                          return children.flatMap(c => [c.systemId, ...getDescendantIds(c.systemId)]);
                        };
                        const excludeIds = category?.systemId 
                          ? [category.systemId, ...getDescendantIds(category.systemId)]
                          : [];
                        const availableParents = allCategories.filter(
                          c => !excludeIds.includes(c.systemId) && c.isActive !== false
                        );

                        // Build hierarchy with level for indentation
                        const getCategoryLevel = (cat: typeof allCategories[0]): number => {
                          if (!cat.parentId) return 0;
                          const parent = allCategories.find(c => c.systemId === cat.parentId);
                          if (!parent) return 0;
                          return 1 + getCategoryLevel(parent);
                        };

                        // Sort categories by hierarchy (parents before children)
                        const sortedCategories = [...availableParents].sort((a, b) => {
                          const getPath = (cat: typeof allCategories[0]): string[] => {
                            if (!cat.parentId) return [cat.name];
                            const parent = allCategories.find(c => c.systemId === cat.parentId);
                            if (!parent) return [cat.name];
                            return [...getPath(parent), cat.name];
                          };
                          return getPath(a).join('/').localeCompare(getPath(b).join('/'));
                        });

                        // Build options with level metadata
                        const parentOptions: ComboboxOption[] = [
                          { value: '__root__', label: '— Không có (Danh mục gốc) —', metadata: { level: -1 } },
                          ...sortedCategories.map(cat => ({
                            value: cat.systemId,
                            label: cat.name,
                            metadata: { level: getCategoryLevel(cat) },
                          })),
                        ];

                        const selectedOption = field.value 
                          ? parentOptions.find(o => o.value === field.value) || null
                          : parentOptions[0]; // Default to root

                        return (
                          <FormItem>
                            <FormLabel>Danh mục cha</FormLabel>
                            <FormControl>
                              <VirtualizedCombobox
                                value={selectedOption}
                                onChange={(option) => {
                                  field.onChange(option?.value === '__root__' ? undefined : option?.value);
                                }}
                                options={parentOptions}
                                placeholder="Chọn danh mục cha"
                                searchPlaceholder="Tìm danh mục..."
                                emptyPlaceholder="Không tìm thấy danh mục"
                                estimatedItemHeight={36}
                                maxHeight={280}
                                renderOption={(option, isSelected) => (
                                  <div className="flex items-center flex-1 min-w-0">
                                    <Check
                                      className={cn(
                                        'mr-2 h-4 w-4 shrink-0',
                                        isSelected ? 'opacity-100' : 'opacity-0'
                                      )}
                                    />
                                    <span 
                                      className={cn(
                                        "truncate",
                                        (option.metadata as { level?: number })?.level === -1 && "text-muted-foreground"
                                      )}
                                      style={{ 
                                        paddingLeft: ((option.metadata as { level?: number })?.level ?? 0) > 0 
                                          ? `${(option.metadata as { level?: number }).level! * 16}px` 
                                          : undefined 
                                      }}
                                    >
                                      {((option.metadata as { level?: number })?.level ?? 0) > 0 && (
                                        <span className="text-muted-foreground mr-1">└</span>
                                      )}
                                      {option.label}
                                    </span>
                                  </div>
                                )}
                              />
                            </FormControl>
                            <FormDescription>
                              Chọn danh mục cha để tạo cấu trúc phân cấp
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />

                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-md border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Kích hoạt</FormLabel>
                            <FormDescription>
                              Danh mục sẽ hiển thị trong danh sách lựa chọn
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Thumbnail Card */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Ảnh đại diện</CardTitle>
                    <CardDescription>Ảnh hiển thị cho danh mục (tối đa 1 ảnh, 2MB)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Existing thumbnail */}
                    {category?.thumbnailImage && thumbnailFiles.length === 0 && (
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-24 rounded-lg border overflow-hidden">
                          <OptimizedImage 
                            src={category.thumbnailImage} 
                            alt="Thumbnail hiện tại" 
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Ảnh hiện tại. Upload ảnh mới để thay thế.
                        </div>
                      </div>
                    )}
                    
                    {/* Upload new thumbnail */}
                    <NewDocumentsUpload
                      accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
                      maxFiles={1}
                      maxSize={2 * 1024 * 1024}
                      value={thumbnailFiles}
                      onChange={setThumbnailFiles}
                      sessionId={thumbnailSessionId}
                      onSessionChange={setThumbnailSessionId}
                      className="min-h-30"
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SEO Default Tab */}
              <TabsContent value="seo-default" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      <CardTitle>SEO Mặc định</CardTitle>
                    </div>
                    <CardDescription>
                      Thông tin SEO chung - sẽ được dùng cho tất cả website nếu không có SEO riêng
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="seoTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tiêu đề SEO</FormLabel>
                          <FormControl>
                            <Input placeholder="Tiêu đề mặc định" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormDescription>Title tag mặc định. Nên 50-60 ký tự.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="metaDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meta Description</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Mô tả SEO mặc định" {...field} value={field.value || ''} rows={2} />
                          </FormControl>
                          <FormDescription>Nên 150-160 ký tự.</FormDescription>
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
                            <Input placeholder="từ khóa 1, từ khóa 2" {...field} value={field.value || ''} />
                          </FormControl>
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
                      name="longDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mô tả chi tiết</FormLabel>
                          <FormControl>
                            <TipTapEditor
                              content={field.value || ''}
                              onChange={field.onChange}
                              placeholder="Mô tả đầy đủ về danh mục..."
                              minHeight="200px"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SEO PKGX Tab */}
              <TabsContent value="seo-pkgx" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" style={{ color: '#ef4444' }} />
                      <CardTitle>SEO cho PKGX</CardTitle>
                    </div>
                    <CardDescription>phukiengiaxuong.com.vn - Override SEO chung</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="websiteSeo.pkgx.seoTitle"
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
                      name="websiteSeo.pkgx.metaDescription"
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
                      name="websiteSeo.pkgx.seoKeywords"
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
                      name="websiteSeo.pkgx.shortDescription"
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
                      name="websiteSeo.pkgx.longDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mô tả chi tiết</FormLabel>
                          <FormControl>
                            <TipTapEditor
                              content={field.value || ''}
                              onChange={field.onChange}
                              placeholder="Mô tả đầy đủ về danh mục..."
                              minHeight="200px"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="websiteSeo.pkgx.slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL Slug</FormLabel>
                          <FormControl>
                            <Input placeholder="danh-muc-abc" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormDescription>Đường dẫn URL cho website PKGX</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* SEO Analysis Panel - PKGX */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>📊 Phân tích SEO</CardTitle>
                    <CardDescription>Điểm số và xem trước kết quả tìm kiếm Google</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SeoAnalysisPanel
                      title={watchedPkgxSeoTitle || watchName || ''}
                      description={watchedPkgxMetaDesc || ''}
                      keywords={watchedPkgxKeywords || ''}
                      slug={watchedPkgxSlug || ''}
                      siteName="phukiengiaxuong.com.vn"
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SEO Trendtech Tab */}
              <TabsContent value="seo-trendtech" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Globe className="h-3 w-3" style={{ color: '#3b82f6' }} />
                      <CardTitle>SEO cho Trendtech</CardTitle>
                    </div>
                    <CardDescription>Coming soon</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="websiteSeo.trendtech.seoTitle"
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
                      name="websiteSeo.trendtech.metaDescription"
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
                      name="websiteSeo.trendtech.seoKeywords"
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
                      name="websiteSeo.trendtech.shortDescription"
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
                      name="websiteSeo.trendtech.longDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mô tả chi tiết</FormLabel>
                          <FormControl>
                            <TipTapEditor
                              content={field.value || ''}
                              onChange={field.onChange}
                              placeholder="Mô tả đầy đủ về danh mục..."
                              minHeight="200px"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="websiteSeo.trendtech.slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL Slug</FormLabel>
                          <FormControl>
                            <Input placeholder="danh-muc-abc" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormDescription>Đường dẫn URL cho website Trendtech</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* SEO Analysis Panel - Trendtech */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>📊 Phân tích SEO</CardTitle>
                    <CardDescription>Điểm số và xem trước kết quả tìm kiếm Google</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SeoAnalysisPanel
                      title={watchedTrendtechSeoTitle || watchName || ''}
                      description={watchedTrendtechMetaDesc || ''}
                      keywords={watchedTrendtechKeywords || ''}
                      slug={watchedTrendtechSlug || ''}
                      siteName="trendtech.vn"
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </ScrollArea>
    </div>
  );
}
