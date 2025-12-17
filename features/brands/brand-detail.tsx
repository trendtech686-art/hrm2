import * as React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Save, 
  X, 
  Trash2,
  Globe,
  Tags,
  ExternalLink,
  Image as ImageIcon,
  Pencil,
  ArrowLeft,
  BarChart3,
  RefreshCw,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useBrandStore } from '../settings/inventory/brand-store';
import type { Brand } from '../settings/inventory/types';
import { asSystemId, asBusinessId, type SystemId } from '@/lib/id-types';
import { toast } from 'sonner';
import { NewDocumentsUpload } from '@/components/ui/new-documents-upload';
import { FileUploadAPI, type StagingFile } from '@/lib/file-upload-api';
import { SeoAnalysisPanel } from '@/components/shared/seo-preview';
import { TipTapEditor } from '@/components/ui/tiptap-editor';
import { usePageHeader } from '@/contexts/page-header-context';
import { usePkgxBrandSync } from './hooks/use-pkgx-brand-sync';

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
  // SEO mặc định
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

type BrandFormValues = z.infer<typeof brandFormSchema>;

export function BrandDetailPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isEditMode = location.pathname.endsWith('/edit');
  
  const { data, update, remove } = useBrandStore();
  
  // PKGX sync hook
  const { handleSyncSeo, handleSyncDescription, handleSyncAll, hasPkgxMapping } = usePkgxBrandSync();
  
  const brand = React.useMemo(() => 
    data.find(b => b.systemId === systemId), 
    [data, systemId]
  );
  
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'general' | 'seo-default' | 'seo-pkgx' | 'seo-trendtech'>('general');
  
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
      // SEO mặc định
      seoTitle: '',
      metaDescription: '',
      seoKeywords: '',
      shortDescription: '',
      longDescription: '',
      // SEO riêng cho từng website
      websiteSeo: {
        pkgx: {},
        trendtech: {},
      },
    },
  });

  // Reset form when brand data changes
  React.useEffect(() => {
    if (brand) {
      form.reset({
        id: brand.id || '',
        name: brand.name || '',
        description: brand.description || '',
        website: brand.website || '',
        logo: brand.logo || '',
        isActive: brand.isActive ?? true,
        // SEO mặc định
        seoTitle: brand.seoTitle || '',
        metaDescription: brand.metaDescription || '',
        seoKeywords: brand.seoKeywords || '',
        shortDescription: brand.shortDescription || '',
        longDescription: brand.longDescription || '',
        // SEO riêng cho từng website
        websiteSeo: {
          pkgx: brand.websiteSeo?.pkgx || {},
          trendtech: brand.websiteSeo?.trendtech || {},
        },
      });
    }
  }, [brand, form]);

  const watchedName = form.watch('name');
  const watchedPkgxSeoTitle = form.watch('websiteSeo.pkgx.seoTitle');
  const watchedPkgxMetaDesc = form.watch('websiteSeo.pkgx.metaDescription');
  const watchedPkgxKeywords = form.watch('websiteSeo.pkgx.seoKeywords');
  const watchedPkgxSlug = form.watch('websiteSeo.pkgx.slug');
  const watchedTrendtechSeoTitle = form.watch('websiteSeo.trendtech.seoTitle');
  const watchedTrendtechMetaDesc = form.watch('websiteSeo.trendtech.metaDescription');
  const watchedTrendtechKeywords = form.watch('websiteSeo.trendtech.seoKeywords');
  const watchedTrendtechSlug = form.watch('websiteSeo.trendtech.slug');

  const handleSubmit = async (data: BrandFormValues) => {
    if (!systemId) return;
    
    // Confirm logo staging files
    let logoUrl = data.logo;
    if (logoFiles.length > 0 && logoSessionId) {
      try {
        await FileUploadAPI.confirmStagingFiles(
          logoSessionId,
          systemId,
          'brands',
          'logo',
          { name: data.name }
        );
        logoUrl = logoFiles[0]?.url || logoUrl;
      } catch (error) {
        console.error('Error confirming logo:', error);
      }
    }
    
    update(asSystemId(systemId), {
      ...data,
      id: asBusinessId(data.id),
      logo: logoUrl,
    });
    
    toast.success('Đã cập nhật thương hiệu');
    navigate(`/brands/${systemId}`);
  };

  const handleDelete = () => {
    if (!systemId) return;
    remove(asSystemId(systemId));
    toast.success('Đã xóa thương hiệu');
    navigate('/brands');
  };

  const handleSwitchToEdit = () => {
    navigate(`/brands/${systemId}/edit`);
  };

  // Header actions
  const headerActions = React.useMemo(() => {
    if (isEditMode) {
      return [
        <Button key="cancel" variant="outline" size="sm" className="h-9" onClick={() => navigate(`/brands/${systemId}`)}>
          <X className="mr-2 h-4 w-4" />
          Hủy
        </Button>,
        <Button key="save" size="sm" className="h-9" onClick={form.handleSubmit(handleSubmit)}>
          <Save className="mr-2 h-4 w-4" />
          Lưu
        </Button>
      ];
    }
    return [
      <Button key="delete" variant="outline" size="sm" className="h-9 text-destructive hover:text-destructive" onClick={() => setIsDeleteAlertOpen(true)}>
        <Trash2 className="mr-2 h-4 w-4" />
        Xóa
      </Button>,
      <Button key="edit" size="sm" className="h-9" onClick={handleSwitchToEdit}>
        <Pencil className="mr-2 h-4 w-4" />
        Chỉnh sửa
      </Button>
    ];
  }, [isEditMode, systemId, navigate, form]);

  usePageHeader({
    actions: headerActions,
    showBackButton: true,
  });

  if (!brand) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <p className="text-muted-foreground">Không tìm thấy thương hiệu</p>
          <Button variant="link" onClick={() => navigate('/brands')}>
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  // View mode
  if (!isEditMode) {
    return (
      <div className="space-y-6 pb-8">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="general">Thông tin</TabsTrigger>
            <TabsTrigger value="seo-default" className="gap-1">
              <Globe className="h-3 w-3" />
              SEO Chung
            </TabsTrigger>
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
            {/* Brand Header Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-6">
                  <Avatar className="h-24 w-24 rounded-lg border">
                    {brand.logo ? (
                      <AvatarImage src={brand.logo} alt={brand.name} className="object-cover" />
                    ) : null}
                    <AvatarFallback className="rounded-lg bg-muted">
                      <ImageIcon className="h-10 w-10 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Mã thương hiệu</p>
                        <p className="font-mono font-medium">{brand.id}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Trạng thái</p>
                        {brand.isActive !== false ? (
                          <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                            Hoạt động
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Tạm tắt</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Tên thương hiệu</p>
                      <p className="text-lg font-semibold">{brand.name}</p>
                    </div>
                    
                    {brand.website && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Website</p>
                        <a 
                          href={brand.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                        >
                          <Globe className="h-4 w-4" />
                          {brand.website}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description Card */}
            {brand.description && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Mô tả</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{brand.description}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* SEO Default Tab */}
          <TabsContent value="seo-default" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <CardTitle className="text-base">SEO Mặc định</CardTitle>
                </div>
                <CardDescription>Thông tin SEO chung - sẽ được dùng nếu không có SEO riêng cho từng website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Tiêu đề SEO</p>
                  <p className="text-sm font-medium">{brand.seoTitle || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Meta Description</p>
                  <p className="text-sm">{brand.metaDescription || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Từ khóa SEO</p>
                  <p className="text-sm">{brand.seoKeywords || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Mô tả ngắn</p>
                  {brand.shortDescription ? (
                    <div className="prose prose-sm max-w-none text-sm border rounded-md p-3 bg-muted/30" dangerouslySetInnerHTML={{ __html: brand.shortDescription }} />
                  ) : <p className="text-sm text-muted-foreground">-</p>}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Mô tả chi tiết</p>
                  {brand.longDescription ? (
                    <div className="prose prose-sm max-w-none text-sm border rounded-md p-3 bg-muted/30" dangerouslySetInnerHTML={{ __html: brand.longDescription }} />
                  ) : <p className="text-sm text-muted-foreground">-</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO PKGX Tab */}
          <TabsContent value="seo-pkgx" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-red-500" />
                    <CardTitle className="text-base">SEO PKGX</CardTitle>
                  </div>
                  {brand && hasPkgxMapping(brand) && (
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-xs"
                        onClick={() => handleSyncSeo(brand)}
                      >
                        <RefreshCw className="mr-1.5 h-3 w-3" />
                        Đồng bộ SEO
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 text-xs"
                        onClick={() => handleSyncDescription(brand)}
                      >
                        <RefreshCw className="mr-1.5 h-3 w-3" />
                        Đồng bộ mô tả
                      </Button>
                      <Button 
                        size="sm" 
                        className="h-8 text-xs"
                        onClick={() => handleSyncAll(brand)}
                      >
                        <RefreshCw className="mr-1.5 h-3 w-3" />
                        Đồng bộ tất cả
                      </Button>
                    </div>
                  )}
                </div>
                <CardDescription>
                  phukiengiaxuong.com.vn - Override SEO chung
                  {brand && !hasPkgxMapping(brand) && (
                    <span className="text-orange-600 ml-2">(Chưa mapping với PKGX - vào Cài đặt &gt; PKGX để mapping)</span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Tiêu đề SEO</p>
                  <p className="text-sm font-medium">{brand.websiteSeo?.pkgx?.seoTitle || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Meta Description</p>
                  <p className="text-sm">{brand.websiteSeo?.pkgx?.metaDescription || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Từ khóa SEO</p>
                  <p className="text-sm">{brand.websiteSeo?.pkgx?.seoKeywords || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">URL Slug</p>
                  <p className="text-sm font-mono">{brand.websiteSeo?.pkgx?.slug || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Mô tả ngắn</p>
                  {brand.websiteSeo?.pkgx?.shortDescription ? (
                    <div className="prose prose-sm max-w-none text-sm border rounded-md p-3 bg-muted/30" dangerouslySetInnerHTML={{ __html: brand.websiteSeo.pkgx.shortDescription }} />
                  ) : <p className="text-sm text-muted-foreground">-</p>}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Mô tả chi tiết</p>
                  {brand.websiteSeo?.pkgx?.longDescription ? (
                    <div className="prose prose-sm max-w-none text-sm border rounded-md p-3 bg-muted/30" dangerouslySetInnerHTML={{ __html: brand.websiteSeo.pkgx.longDescription }} />
                  ) : <p className="text-sm text-muted-foreground">-</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Trendtech Tab */}
          <TabsContent value="seo-trendtech" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-500" />
                  <CardTitle className="text-base">SEO Trendtech</CardTitle>
                </div>
                <CardDescription>trendtech.vn - Override SEO chung</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Tiêu đề SEO</p>
                  <p className="text-sm font-medium">{brand.websiteSeo?.trendtech?.seoTitle || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Meta Description</p>
                  <p className="text-sm">{brand.websiteSeo?.trendtech?.metaDescription || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Từ khóa SEO</p>
                  <p className="text-sm">{brand.websiteSeo?.trendtech?.seoKeywords || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">URL Slug</p>
                  <p className="text-sm font-mono">{brand.websiteSeo?.trendtech?.slug || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Mô tả ngắn</p>
                  {brand.websiteSeo?.trendtech?.shortDescription ? (
                    <div className="prose prose-sm max-w-none text-sm border rounded-md p-3 bg-muted/30" dangerouslySetInnerHTML={{ __html: brand.websiteSeo.trendtech.shortDescription }} />
                  ) : <p className="text-sm text-muted-foreground">-</p>}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Mô tả chi tiết</p>
                  {brand.websiteSeo?.trendtech?.longDescription ? (
                    <div className="prose prose-sm max-w-none text-sm border rounded-md p-3 bg-muted/30" dangerouslySetInnerHTML={{ __html: brand.websiteSeo.trendtech.longDescription }} />
                  ) : <p className="text-sm text-muted-foreground">-</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Delete Alert */}
        <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xóa thương hiệu?</AlertDialogTitle>
              <AlertDialogDescription>
                Thương hiệu "{brand.name}" sẽ bị xóa khỏi hệ thống. Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Đóng</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // Edit mode
  return (
    <div className="space-y-4 pb-8">
      <Form {...form}>
        <form className="space-y-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
            <TabsList className="grid w-full grid-cols-4 max-w-2xl">
              <TabsTrigger value="general">Thông tin</TabsTrigger>
              <TabsTrigger value="seo-default" className="gap-1">
                <Globe className="h-3 w-3" />
                SEO Chung
              </TabsTrigger>
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
                              disabled
                              className="bg-muted"
                            />
                          </FormControl>
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
                <CardContent className="space-y-4">
                  {brand?.logo && logoFiles.length === 0 && (
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 rounded-lg border overflow-hidden bg-muted flex items-center justify-center">
                        <img 
                          src={brand.logo} 
                          alt="Logo hiện tại" 
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Logo hiện tại. Upload logo mới để thay thế.
                      </div>
                    </div>
                  )}
                  
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

            {/* SEO Default Tab */}
            <TabsContent value="seo-default" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <CardTitle className="text-base">SEO Mặc định</CardTitle>
                  </div>
                  <CardDescription>Thông tin SEO chung - sẽ được dùng nếu không có SEO riêng</CardDescription>
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
