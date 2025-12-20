'use client'

import * as React from 'react';
import { useNavigate } from '@/lib/next-compat';
import { Save, X, Globe } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useProductCategoryStore } from '../settings/inventory/product-category-store';
import { toast } from 'sonner';
import { NewDocumentsUpload } from '@/components/ui/new-documents-upload';
import { FileUploadAPI, type StagingFile } from '@/lib/file-upload-api';
import { SeoAnalysisPanel } from '@/components/shared/seo-preview';
import { TipTapEditor } from '@/components/ui/tiptap-editor';
import { usePageHeader } from '@/contexts/page-header-context';
import { slugify } from '@/lib/utils';
import { CharacterCounter } from '@/components/shared/character-counter';
import { SeoScoreDisplay } from '@/components/shared/seo-score-display';

// Schema
const websiteSeoSchema = z.object({
  seoTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  slug: z.string().optional(),
  ogImage: z.string().optional(),
}).optional();

const categoryFormSchema = z.object({
  name: z.string().min(1, 'Tên danh mục là bắt buộc'),
  parentId: z.string().optional(),
  thumbnailImage: z.string().optional(),
  isActive: z.boolean().optional(),
  websiteSeo: z.object({
    pkgx: websiteSeoSchema,
    trendtech: websiteSeoSchema,
  }).optional(),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export function CategoryNewPage() {
  const navigate = useNavigate();
  const { data, add } = useProductCategoryStore();
  
  // Get all active categories for parent selection
  const availableParents = React.useMemo(() => 
    data.filter(c => !c.isDeleted),
    [data]
  );
  
  const [activeTab, setActiveTab] = React.useState<'general' | 'seo-pkgx' | 'seo-trendtech'>('general');
  
  // Image upload states
  const [imageFiles, setImageFiles] = React.useState<StagingFile[]>([]);
  const [imageSessionId, setImageSessionId] = React.useState<string | undefined>();
  const [pkgxImageFiles, setPkgxImageFiles] = React.useState<StagingFile[]>([]);
  const [pkgxImageSessionId, setPkgxImageSessionId] = React.useState<string | undefined>();
  const [trendtechImageFiles, setTrendtechImageFiles] = React.useState<StagingFile[]>([]);
  const [trendtechImageSessionId, setTrendtechImageSessionId] = React.useState<string | undefined>();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
      parentId: '',
      thumbnailImage: '',
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
  const watchedParentId = form.watch('parentId');

  // Calculate level based on parent
  const calculatedLevel = React.useMemo(() => {
    if (!watchedParentId) return 0;
    const parent = data.find(c => String(c.systemId) === watchedParentId);
    return parent ? (parent.level ?? 0) + 1 : 0;
  }, [watchedParentId, data]);

  const handleSubmit = async (formData: CategoryFormValues) => {
    // Confirm image staging files
    let imageUrl = '';
    let pkgxOgImage = '';
    let trendtechOgImage = '';
    
    if (imageFiles.length > 0 && imageSessionId) {
      try {
        await FileUploadAPI.confirmStagingFiles(
          imageSessionId,
          'temp-category',
          'categories',
          'thumbnail',
          { name: formData.name }
        );
        imageUrl = imageFiles[0]?.url || '';
      } catch (error) {
        console.error('Error confirming image:', error);
      }
    }
    
    // Get OG images
    if (pkgxImageFiles.length > 0) {
      pkgxOgImage = pkgxImageFiles[0]?.url || '';
    }
    if (trendtechImageFiles.length > 0) {
      trendtechOgImage = trendtechImageFiles[0]?.url || '';
    }
    
    // add() will auto-generate systemId, businessId, path, level
    const newCategory = add({
      name: formData.name,
      parentId: formData.parentId ? (formData.parentId as any) : undefined,
      thumbnailImage: imageUrl || undefined,
      isActive: formData.isActive ?? true,
      websiteSeo: {
        pkgx: {
          ...formData.websiteSeo?.pkgx,
          ogImage: pkgxOgImage || undefined,
        },
        trendtech: {
          ...formData.websiteSeo?.trendtech,
          ogImage: trendtechOgImage || undefined,
        },
      },
    } as any);
    
    toast.success('Đã tạo danh mục mới');
    navigate(`/categories/${newCategory.systemId}`);
  };

  // Header actions
  const headerActions = React.useMemo(() => [
    <Button key="cancel" variant="outline" size="sm" className="h-9" onClick={() => navigate('/categories')}>
      <X className="mr-2 h-4 w-4" />
      Hủy
    </Button>,
    <Button key="save" size="sm" className="h-9" onClick={form.handleSubmit(handleSubmit)}>
      <Save className="mr-2 h-4 w-4" />
      Lưu
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

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="parentId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Danh mục cha</FormLabel>
                          <Select
                            value={field.value || '__none__'}
                            onValueChange={(val) => field.onChange(val === '__none__' ? '' : val)}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn danh mục cha" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="__none__">— Danh mục gốc (Cấp 0) —</SelectItem>
                              {availableParents.map(parent => {
                                const level = parent.level ?? 0;
                                const indent = level > 0 ? `${level * 16}px` : '0';
                                return (
                                  <SelectItem 
                                    key={String(parent.systemId)} 
                                    value={String(parent.systemId)}
                                    className="flex items-center"
                                  >
                                    <span style={{ paddingLeft: indent }} className="flex items-center gap-1">
                                      {level > 0 && <span className="text-muted-foreground">└</span>}
                                      {parent.name}
                                    </span>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Để trống nếu đây là danh mục gốc. Cấp hiện tại: {calculatedLevel}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
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

              {/* Thumbnail Upload */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Ảnh đại diện</CardTitle>
                </CardHeader>
                <CardContent>
                  <NewDocumentsUpload
                    accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'] }}
                    maxFiles={1}
                    maxSize={2 * 1024 * 1024}
                    value={imageFiles}
                    onChange={setImageFiles}
                    sessionId={imageSessionId}
                    onSessionChange={setImageSessionId}
                    className="min-h-[120px]"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* SEO PKGX Tab */}
            <TabsContent value="seo-pkgx" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
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
                        <div className="flex items-center justify-between">
                          <FormLabel>Tiêu đề SEO</FormLabel>
                          <CharacterCounter value={field.value || ''} recommended={{ min: 50, max: 60 }} />
                        </div>
                        <FormControl>
                          <Input placeholder="Tiêu đề cho PKGX" {...field} />
                        </FormControl>
                        <FormDescription>Nên từ 50-60 ký tự để hiển thị tốt trên Google.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="websiteSeo.pkgx.metaDescription"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Meta Description</FormLabel>
                          <CharacterCounter value={field.value || ''} recommended={{ min: 150, max: 160 }} />
                        </div>
                        <FormControl>
                          <Textarea 
                            placeholder="Mô tả SEO cho PKGX" 
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>Nên từ 150-160 ký tự.</FormDescription>
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
                          <Input placeholder="từ khóa 1, từ khóa 2" {...field} />
                        </FormControl>
                        <FormDescription>Phân cách bằng dấu phẩy. Nên 3-10 từ khóa.</FormDescription>
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
                          <div className="flex gap-2">
                            <Input 
                              placeholder="danh-muc-san-pham" 
                              {...field} 
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const name = form.getValues('name');
                                if (name) {
                                  field.onChange(slugify(name));
                                }
                              }}
                            >
                              Tự động
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription>URL thân thiện, không dấu, phân cách bằng dấu gạch ngang.</FormDescription>
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
                        <FormLabel>Mô tả dài</FormLabel>
                        <FormControl>
                          <TipTapEditor
                            content={field.value || ''}
                            onChange={field.onChange}
                            placeholder="Mô tả chi tiết danh mục..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* SEO Preview */}
              <SeoAnalysisPanel
                title={watchedPkgxSeoTitle || watchedName || 'Tiêu đề danh mục'}
                description={watchedPkgxMetaDesc || ''}
                keywords={watchedPkgxKeywords || ''}
                slug={watchedPkgxSlug || 'slug-danh-muc'}
                siteName="PKGX"
              />

              {/* SEO Score */}
              <SeoScoreDisplay
                title={watchedPkgxSeoTitle}
                description={watchedPkgxMetaDesc}
                keywords={watchedPkgxKeywords}
                slug={watchedPkgxSlug}
                shortDescription={form.watch('websiteSeo.pkgx.shortDescription')}
                longDescription={form.watch('websiteSeo.pkgx.longDescription')}
                ogImage={pkgxImageFiles[0]?.url}
              />
            </TabsContent>

            {/* SEO Trendtech Tab */}
            <TabsContent value="seo-trendtech" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-blue-500" />
                    <CardTitle className="text-base">SEO cho Trendtech</CardTitle>
                  </div>
                  <CardDescription>trendtech.vn</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="websiteSeo.trendtech.seoTitle"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Tiêu đề SEO</FormLabel>
                          <CharacterCounter value={field.value || ''} recommended={{ min: 50, max: 60 }} />
                        </div>
                        <FormControl>
                          <Input placeholder="Tiêu đề cho Trendtech" {...field} />
                        </FormControl>
                        <FormDescription>Nên từ 50-60 ký tự để hiển thị tốt trên Google.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="websiteSeo.trendtech.metaDescription"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel>Meta Description</FormLabel>
                          <CharacterCounter value={field.value || ''} recommended={{ min: 150, max: 160 }} />
                        </div>
                        <FormControl>
                          <Textarea 
                            placeholder="Mô tả SEO cho Trendtech" 
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>Nên từ 150-160 ký tự.</FormDescription>
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
                          <Input placeholder="từ khóa 1, từ khóa 2" {...field} />
                        </FormControl>
                        <FormDescription>Phân cách bằng dấu phẩy. Nên 3-10 từ khóa.</FormDescription>
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
                          <div className="flex gap-2">
                            <Input 
                              placeholder="danh-muc-san-pham" 
                              {...field} 
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const name = form.getValues('name');
                                if (name) {
                                  field.onChange(slugify(name));
                                }
                              }}
                            >
                              Tự động
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription>URL thân thiện, không dấu, phân cách bằng dấu gạch ngang.</FormDescription>
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
                        <FormLabel>Mô tả dài</FormLabel>
                        <FormControl>
                          <TipTapEditor
                            content={field.value || ''}
                            onChange={field.onChange}
                            placeholder="Mô tả chi tiết danh mục..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* SEO Preview */}
              <SeoAnalysisPanel
                title={watchedTrendtechSeoTitle || watchedName || 'Tiêu đề danh mục'}
                description={watchedTrendtechMetaDesc || ''}
                keywords={watchedTrendtechKeywords || ''}
                slug={watchedTrendtechSlug || 'slug-danh-muc'}
                siteName="Trendtech"
              />

              {/* SEO Score */}
              <SeoScoreDisplay
                title={watchedTrendtechSeoTitle}
                description={watchedTrendtechMetaDesc}
                keywords={watchedTrendtechKeywords}
                slug={watchedTrendtechSlug}
                shortDescription={form.watch('websiteSeo.trendtech.shortDescription')}
                longDescription={form.watch('websiteSeo.trendtech.longDescription')}
                ogImage={trendtechImageFiles[0]?.url}
              />
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}
