'use client'

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Trash2, 
  Save,
  X,
  Globe,
  Tags,
  ExternalLink,
  Image as ImageIcon,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { mobileBleedCardClass } from '../../../components/layout/page-section';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Switch } from '../../../components/ui/switch';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Tabs, TabsContent } from '../../../components/ui/tabs';
import { MobileTabsList, MobileTabsTrigger } from '../../../components/layout/page-section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { OptimizedImage } from '../../../components/ui/optimized-image';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../components/ui/form';
import type { Brand } from './types';
import { NewDocumentsUpload } from '../../../components/ui/new-documents-upload';
import { FileUploadAPI, type StagingFile } from '../../../lib/file-upload-api';
import { SeoAnalysisPanel } from '../../../components/shared/seo-preview';
import { TipTapEditor } from '../../../components/ui/tiptap-editor';
import { nanoid } from 'nanoid';
import { logError } from '@/lib/logger'

// =============================================================================
// FORM SCHEMA
// =============================================================================

const websiteSeoSchema = z.object({
  seoTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  slug: z.string().optional(),
}).optional();

const brandFormSchema = z.object({
  id: z.string().min(1, 'Mã thương hiệu là bắt buộc'),
  name: z.string().min(1, 'Tên thương hiệu là bắt buộc'),
  description: z.string().optional(),
  website: z.string().optional(),
  logo: z.string().optional(),
  isActive: z.boolean().optional(),
  // SEO mặc định (chung cho tất cả website)
  seoTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  // SEO riêng cho từng website
  websiteSeo: z.object({
    pkgx: websiteSeoSchema,
    trendtech: websiteSeoSchema,
  }).optional(),
});

export type BrandFormValues = z.infer<typeof brandFormSchema>;

// =============================================================================
// COMPONENT PROPS
// =============================================================================

export interface BrandDetailFormProps {
  brand: Brand | null;
  isNew: boolean;
  existingIds: string[];
  onSave: (data: BrandFormValues) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

// =============================================================================
// BRAND DETAIL FORM COMPONENT
// =============================================================================

export function BrandDetailForm({
  brand,
  isNew,
  existingIds,
  onSave,
  onCancel,
  onDelete,
}: BrandDetailFormProps) {
  const [activeTab, setActiveTab] = React.useState<'general' | 'seo-default' | 'seo-pkgx' | 'seo-trendtech'>('general');
  
  // Logo upload state
  const [logoFiles, setLogoFiles] = React.useState<StagingFile[]>([]);
  const [logoSessionId, setLogoSessionId] = React.useState<string | undefined>();

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: {
      id: brand?.id || '',
      name: brand?.name || '',
      description: brand?.description || '',
      website: brand?.website || '',
      logo: brand?.logo || '',
      isActive: brand?.isActive ?? true,
      // SEO mặc định
      seoTitle: brand?.seoTitle || '',
      metaDescription: brand?.metaDescription || '',
      seoKeywords: brand?.seoKeywords || '',
      shortDescription: brand?.shortDescription || '',
      longDescription: brand?.longDescription || '',
      // SEO riêng cho từng website
      websiteSeo: {
        pkgx: brand?.websiteSeo?.pkgx || {},
        trendtech: brand?.websiteSeo?.trendtech || {},
      },
    },
  });

  React.useEffect(() => {
    form.reset({
      id: brand?.id || '',
      name: brand?.name || '',
      description: brand?.description || '',
      website: brand?.website || '',
      logo: brand?.logo || '',
      isActive: brand?.isActive ?? true,
      // SEO mặc định
      seoTitle: brand?.seoTitle || '',
      metaDescription: brand?.metaDescription || '',
      seoKeywords: brand?.seoKeywords || '',
      shortDescription: brand?.shortDescription || '',
      longDescription: brand?.longDescription || '',
      // SEO riêng cho từng website
      websiteSeo: {
        pkgx: brand?.websiteSeo?.pkgx || {},
        trendtech: brand?.websiteSeo?.trendtech || {},
      },
    });
    // Reset logo upload state when brand changes
    setLogoFiles([]);
    setLogoSessionId(undefined);
    setActiveTab('general');
  }, [brand, form]);

  const handleSubmit = async (data: BrandFormValues) => {
    // Validate unique id for new brands
    if (isNew && existingIds.includes(data.id)) {
      form.setError('id', { message: 'Mã thương hiệu đã tồn tại' });
      return;
    }
    
    const brandId = brand?.systemId || `BRAND_${nanoid(10)}`;
    
    // Confirm logo staging files
    let logoUrl = data.logo;
    if (logoFiles.length > 0 && logoSessionId) {
      try {
        await FileUploadAPI.confirmStagingFiles(
          logoSessionId,
          brandId,
          'brands',
          'logo',
          { name: data.name }
        );
        logoUrl = logoFiles[0]?.url || logoUrl;
      } catch (error) {
        logError('Error confirming logo', error);
      }
    }
    
    onSave({
      ...data,
      logo: logoUrl,
    });
  };

  const watchedName = form.watch('name');
  
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

  // Auto-generate ID from name for new brands
  React.useEffect(() => {
    if (isNew && watchedName && !form.getValues('id')) {
      const generatedId = watchedName
        .toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, 20);
      form.setValue('id', generatedId);
    }
  }, [watchedName, isNew, form]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <Tags className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-semibold">
              {isNew ? 'Thêm thương hiệu mới' : brand?.name || 'Chi tiết thương hiệu'}
            </h3>
            {!isNew && brand && (
              <p className="text-xs text-muted-foreground">{brand.id}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4 mr-1" />
            Hủy
          </Button>
          {!isNew && onDelete && (
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-1" />
              Xóa
            </Button>
          )}
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
              <MobileTabsList>
                <MobileTabsTrigger value="general">Thông tin</MobileTabsTrigger>
                <MobileTabsTrigger value="seo-default">
                  <Globe className="h-3 w-3" />
                  SEO Chung
                </MobileTabsTrigger>
                <MobileTabsTrigger value="seo-pkgx">
                  <Globe className="h-3 w-3" style={{ color: '#ef4444' }} />
                  SEO PKGX
                </MobileTabsTrigger>
                <MobileTabsTrigger value="seo-trendtech">
                  <Globe className="h-3 w-3" style={{ color: '#3b82f6' }} />
                  SEO Trendtech
                </MobileTabsTrigger>
              </MobileTabsList>

              {/* General Tab */}
              <TabsContent value="general" className="space-y-4 mt-4">
                <Card className={mobileBleedCardClass}>
                  <CardHeader className="pb-3">
                    <CardTitle>Thông tin cơ bản</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mã thương hiệu <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="VD: APPLE" 
                                {...field} 
                                disabled={!isNew}
                                className={cn(!isNew && "bg-muted")}
                              />
                            </FormControl>
                            <FormDescription>
                              Mã định danh duy nhất, viết liền không dấu
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tên thương hiệu <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="VD: Apple Inc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input placeholder="https://apple.com" {...field} />
                              {field.value && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  className="shrink-0"
                                  onClick={() => window.open(field.value, '_blank')}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
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
                          <FormLabel>Mô tả</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Mô tả về thương hiệu..." 
                              {...field} 
                              rows={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Kích hoạt</FormLabel>
                            <FormDescription>
                              Thương hiệu sẽ hiển thị trong danh sách lựa chọn
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

                {/* Logo Upload Card */}
                <Card className={mobileBleedCardClass}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Logo thương hiệu
                    </CardTitle>
                    <CardDescription>Tải lên logo thương hiệu (PNG, JPG, WebP - tối đa 2MB)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Existing logo */}
                    {brand?.logo && logoFiles.length === 0 && (
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-24 rounded-lg border overflow-hidden bg-muted flex items-center justify-center">
                          <OptimizedImage 
                            src={brand.logo} 
                            alt="Logo hiện tại" 
                            width={96}
                            height={96}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Logo hiện tại. Upload logo mới để thay thế.
                        </div>
                      </div>
                    )}
                    
                    {/* Upload new logo */}
                    <NewDocumentsUpload
                      accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
                      maxFiles={1}
                      maxSize={2 * 1024 * 1024}
                      value={logoFiles}
                      onChange={setLogoFiles}
                      sessionId={logoSessionId}
                      onSessionChange={setLogoSessionId}
                      className="min-h-30"
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* SEO Default Tab */}
              <TabsContent value="seo-default" className="space-y-4 mt-4">
                <Card className={mobileBleedCardClass}>
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
                              placeholder="Mô tả đầy đủ về thương hiệu..."
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
                <Card className={mobileBleedCardClass}>
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
                              placeholder="Mô tả đầy đủ về thương hiệu..."
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
                            <Input placeholder="thuong-hieu-abc" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormDescription>Đường dẫn URL thân thiện. VD: /thuong-hieu/thuong-hieu-abc</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* SEO Analysis Panel - PKGX */}
                <Card className={mobileBleedCardClass}>
                  <CardHeader className="pb-3">
                    <CardTitle>📊 Phân tích SEO</CardTitle>
                    <CardDescription>Điểm số và xem trước kết quả tìm kiếm Google</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SeoAnalysisPanel
                      title={watchedPkgxSeoTitle || watchedName || ''}
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
                <Card className={mobileBleedCardClass}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" style={{ color: '#3b82f6' }} />
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
                              placeholder="Mô tả đầy đủ về thương hiệu..."
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
                            <Input placeholder="thuong-hieu-abc" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormDescription>Đường dẫn URL thân thiện</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* SEO Analysis Panel - Trendtech */}
                <Card className={mobileBleedCardClass}>
                  <CardHeader className="pb-3">
                    <CardTitle>📊 Phân tích SEO</CardTitle>
                    <CardDescription>Điểm số và xem trước kết quả tìm kiếm Google</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SeoAnalysisPanel
                      title={watchedTrendtechSeoTitle || watchedName || ''}
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
