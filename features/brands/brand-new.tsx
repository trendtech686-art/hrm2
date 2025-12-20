'use client'

import * as React from 'react';
import { Link, useLocation, useNavigate } from '@/lib/next-compat';
import { 
  Save, 
  X, 
  Globe,
  Tags,
  ExternalLink,
  Image as ImageIcon,
  BarChart3,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useBrandStore } from '../settings/inventory/brand-store';
import { asBusinessId } from '@/lib/id-types';
import { toast } from 'sonner';
import { NewDocumentsUpload } from '@/components/ui/new-documents-upload';
import { FileUploadAPI, type StagingFile } from '@/lib/file-upload-api';
import { SeoAnalysisPanel } from '@/components/shared/seo-preview';
import { TipTapEditor } from '@/components/ui/tiptap-editor';
import { usePageHeader } from '@/contexts/page-header-context';

// Schema
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
  websiteSeo: z.object({
    pkgx: websiteSeoSchema,
    trendtech: websiteSeoSchema,
  }).optional(),
});

type BrandFormValues = z.infer<typeof brandFormSchema>;

export function BrandNewPage() {
  const navigate = useNavigate();
  
  const { data, add, getNextId, counter } = useBrandStore();
  
  const existingIds = React.useMemo(() => data.map(b => String(b.id)), [data]);
  
  // Generate SystemId for file uploads (preview before actual save)
  const tempSystemId = React.useMemo(() => {
    return `BRAND${String(counter + 1).padStart(6, '0')}`;
  }, [counter]);
  
  const [activeTab, setActiveTab] = React.useState<'general' | 'seo-pkgx' | 'seo-trendtech'>('general');
  
  // Logo upload state
  const [logoFiles, setLogoFiles] = React.useState<StagingFile[]>([]);
  const [logoSessionId, setLogoSessionId] = React.useState<string | undefined>();

  const form = useForm<BrandFormValues>({
    resolver: zodResolver(brandFormSchema),
    defaultValues: {
      id: '',
      name: '',
      description: '',
      website: '',
      logo: '',
      isActive: true,
      websiteSeo: {
        pkgx: {},
        trendtech: {},
      },
    },
  });

  const watchedName = form.watch('name');
  const watchedPkgxSeoTitle = form.watch('websiteSeo.pkgx.seoTitle');
  const watchedPkgxMetaDesc = form.watch('websiteSeo.pkgx.metaDescription');
  const watchedPkgxKeywords = form.watch('websiteSeo.pkgx.seoKeywords');
  const watchedPkgxSlug = form.watch('websiteSeo.pkgx.slug');
  const watchedTrendtechSeoTitle = form.watch('websiteSeo.trendtech.seoTitle');
  const watchedTrendtechMetaDesc = form.watch('websiteSeo.trendtech.metaDescription');
  const watchedTrendtechKeywords = form.watch('websiteSeo.trendtech.seoKeywords');
  const watchedTrendtechSlug = form.watch('websiteSeo.trendtech.slug');

  // Auto-generate ID from name
  React.useEffect(() => {
    if (watchedName && !form.getValues('id')) {
      const generatedId = watchedName
        .toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, 20);
      form.setValue('id', generatedId);
    }
  }, [watchedName, form]);

  const handleSubmit = async (data: BrandFormValues) => {
    // Validate unique id
    if (existingIds.includes(String(data.id))) {
      form.setError('id', { message: 'Mã thương hiệu đã tồn tại' });
      return;
    }
    
    // Confirm logo staging files
    let logoUrl = data.logo;
    if (logoFiles.length > 0 && logoSessionId) {
      try {
        await FileUploadAPI.confirmStagingFiles(
          logoSessionId,
          tempSystemId,
          'brands',
          'logo',
          { name: data.name }
        );
        logoUrl = logoFiles[0]?.url || logoUrl;
      } catch (error) {
        console.error('Error confirming logo:', error);
      }
    }
    
    add({
      ...data,
      id: asBusinessId(data.id),
      logo: logoUrl,
    });
    
    toast.success('Đã thêm thương hiệu mới');
    navigate('/brands');
  };

  // Header actions
  const headerActions = React.useMemo(() => [
    <Button key="cancel" variant="outline" size="sm" className="h-9" onClick={() => navigate('/brands')}>
      <X className="mr-2 h-4 w-4" />
      Hủy
    </Button>,
    <Button key="save" size="sm" className="h-9" onClick={form.handleSubmit(handleSubmit)}>
      <Save className="mr-2 h-4 w-4" />
      Tạo mới
    </Button>
  ], [navigate, form]);

  usePageHeader({
    actions: headerActions,
    showBackButton: true,
  });

  return (
    <div className="space-y-4 pb-8">
      <Form {...form}>
        <form className="space-y-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
            <TabsList className="grid w-full grid-cols-3 max-w-lg">
              <TabsTrigger value="general">Thông tin</TabsTrigger>
              <TabsTrigger value="seo-pkgx" className="gap-1">
                <Globe className="h-3 w-3 text-red-500" />
                SEO PKGX
              </TabsTrigger>
              <TabsTrigger value="seo-trendtech" className="gap-1">
                <Globe className="h-3 w-3 text-blue-500" />
                SEO Trendtech
              </TabsTrigger>
            </TabsList>

            {/* General Tab */}
            <TabsContent value="general" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Thông tin cơ bản</CardTitle>
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
                                className="flex-shrink-0"
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
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Logo thương hiệu
                  </CardTitle>
                  <CardDescription>Tải lên logo thương hiệu (PNG, JPG, WebP - tối đa 2MB)</CardDescription>
                </CardHeader>
                <CardContent>
                  <NewDocumentsUpload
                    accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
                    maxFiles={1}
                    maxSize={2 * 1024 * 1024}
                    value={logoFiles}
                    onChange={setLogoFiles}
                    sessionId={logoSessionId}
                    onSessionChange={setLogoSessionId}
                    className="min-h-[120px]"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* SEO PKGX Tab */}
            <TabsContent value="seo-pkgx" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-red-500" />
                    <CardTitle className="text-base">SEO cho PKGX</CardTitle>
                  </div>
                  <CardDescription>phukiengiaxuong.com.vn</CardDescription>
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
                        <FormDescription>Đường dẫn URL thân thiện</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Phân tích SEO</CardTitle>
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
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-blue-500" />
                    <CardTitle className="text-base">SEO cho Trendtech</CardTitle>
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

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Phân tích SEO</CardTitle>
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
    </div>
  );
}
