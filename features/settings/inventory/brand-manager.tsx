import * as React from 'react';
import { 
  Plus, 
  Trash2, 
  Save,
  X,
  Search,
  Globe,
  Tags,
  ExternalLink,
  MoreVertical,
  Power,
  Pencil,
  Image as ImageIcon,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '../../../lib/utils';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Switch } from '../../../components/ui/switch';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import type { Brand } from './types';
import { type SystemId } from '@/lib/id-types';
import { toast } from 'sonner';
import { NewDocumentsUpload } from '../../../components/ui/new-documents-upload';
import { FileUploadAPI, type StagingFile } from '../../../lib/file-upload-api';
import { SeoAnalysisPanel } from '../../../components/shared/seo-preview';
import { TipTapEditor } from '../../../components/ui/tiptap-editor';
import { nanoid } from 'nanoid';

// =============================================================================
// TYPES
// =============================================================================

interface BrandManagerProps {
  brands: Brand[];
  onAdd: (data: BrandFormValues) => void;
  onUpdate: (systemId: SystemId, data: Partial<BrandFormValues>) => void;
  onDelete: (systemId: SystemId) => void;
  onToggleActive: (systemId: SystemId, isActive: boolean) => void;
  existingIds: string[];
  /** Ref để expose hàm addNew từ PageHeader */
  addNewRef?: React.RefObject<{ addNew: () => void } | null>;
}

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
// BRAND LIST ITEM
// =============================================================================

interface BrandListItemProps {
  brand: Brand;
  isSelected: boolean;
  onSelect: (brand: Brand) => void;
  onToggleActive: (brand: Brand) => void;
  onDelete: (brand: Brand) => void;
  searchTerm: string;
}

function BrandListItem({
  brand,
  isSelected,
  onSelect,
  onToggleActive,
  onDelete,
  searchTerm,
}: BrandListItemProps) {
  const matchesSearch = searchTerm && brand.name.toLowerCase().includes(searchTerm.toLowerCase());

  return (
    <div
      className={cn(
        'group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all',
        'hover:bg-accent border border-transparent',
        isSelected && 'bg-primary/10 border-primary/20',
        matchesSearch && !isSelected && 'bg-yellow-50 dark:bg-yellow-900/20',
      )}
      onClick={() => onSelect(brand)}
    >
      {/* Logo or Icon */}
      <div className={cn(
        'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
        brand.logo ? 'bg-background border' : 'bg-primary/10'
      )}>
        {brand.logo ? (
          <OptimizedImage src={brand.logo} alt={brand.name} className="w-8 h-8 object-contain" width={32} height={32} />
        ) : (
          <Tags className="h-5 w-5 text-primary" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn(
            'font-medium truncate',
            !brand.isActive && 'text-muted-foreground'
          )}>
            {brand.name}
          </span>
          {!brand.isActive && (
            <Badge variant="secondary" className="h-5 text-[10px]">
              Ẩn
            </Badge>
          )}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {brand.id}
          {brand.website && (
            <>
              <span className="mx-1">•</span>
              <span className="truncate">{brand.website}</span>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            onSelect(brand);
          }}>
            <Pencil className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            onToggleActive(brand);
          }}>
            <Power className="h-4 w-4 mr-2" />
            {brand.isActive ? 'Tắt' : 'Bật'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(brand);
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// =============================================================================
// BRAND DETAIL FORM
// =============================================================================

interface BrandDetailFormProps {
  brand: Brand | null;
  isNew: boolean;
  existingIds: string[];
  onSave: (data: BrandFormValues) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

function BrandDetailForm({
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
        console.error('Error confirming logo:', error);
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
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" style={{ color: '#ef4444' }} />
                      <CardTitle className="text-base">SEO cho PKGX</CardTitle>
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
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">📊 Phân tích SEO</CardTitle>
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
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" style={{ color: '#3b82f6' }} />
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

                {/* SEO Analysis Panel - Trendtech */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">📊 Phân tích SEO</CardTitle>
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

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function BrandManager({
  brands,
  onAdd,
  onUpdate,
  onDelete,
  onToggleActive,
  existingIds,
  addNewRef,
}: BrandManagerProps) {
  const [selectedBrand, setSelectedBrand] = React.useState<Brand | null>(null);
  const [isNewMode, setIsNewMode] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [brandToDelete, setBrandToDelete] = React.useState<Brand | null>(null);

  // Expose addNew function via ref for PageHeader
  React.useImperativeHandle(addNewRef, () => ({
    addNew: () => {
      setSelectedBrand(null);
      setIsNewMode(true);
    }
  }), []);

  // Sort brands by name
  const sortedBrands = React.useMemo(
    () => [...brands].sort((a, b) => a.name.localeCompare(b.name)),
    [brands]
  );

  // Filter by search
  const filteredBrands = React.useMemo(() => {
    if (!searchTerm) return sortedBrands;
    const term = searchTerm.toLowerCase();
    return sortedBrands.filter(
      b => b.name.toLowerCase().includes(term) || b.id.toLowerCase().includes(term)
    );
  }, [sortedBrands, searchTerm]);

  const handleSelectBrand = (brand: Brand) => {
    setSelectedBrand(brand);
    setIsNewMode(false);
  };

  const handleAddNew = () => {
    setSelectedBrand(null);
    setIsNewMode(true);
  };

  const handleSave = (data: BrandFormValues) => {
    if (isNewMode) {
      onAdd(data);
      setIsNewMode(false);
      toast.success('Đã thêm thương hiệu mới');
    } else if (selectedBrand) {
      onUpdate(selectedBrand.systemId, data);
      toast.success('Đã cập nhật thương hiệu');
    }
  };

  const handleCancel = () => {
    setIsNewMode(false);
    if (!selectedBrand && brands.length > 0) {
      setSelectedBrand(sortedBrands[0] || null);
    }
  };

  const handleToggleActive = (brand: Brand) => {
    onToggleActive(brand.systemId, !brand.isActive);
    toast.success(brand.isActive ? 'Đã tắt thương hiệu' : 'Đã bật thương hiệu');
  };

  const handleDeleteRequest = (brand: Brand) => {
    setBrandToDelete(brand);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (brandToDelete) {
      onDelete(brandToDelete.systemId);
      if (selectedBrand?.systemId === brandToDelete.systemId) {
        setSelectedBrand(null);
      }
      toast.success('Đã xóa thương hiệu');
    }
    setDeleteDialogOpen(false);
    setBrandToDelete(null);
  };

  const totalCount = brands.length;
  const activeCount = brands.filter(b => b.isActive).length;

  return (
    <>
      <div className="h-[calc(100vh-140px)] flex border rounded-lg overflow-hidden bg-background">
        {/* Left Panel - Brand List */}
        <div className="w-80 border-r flex flex-col bg-muted/30">
          {/* Header */}
          <div className="p-3 border-b space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">
                  Thương hiệu ({totalCount})
                </div>
                <div className="text-xs text-muted-foreground">
                  {activeCount} đang hoạt động
                </div>
              </div>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm thương hiệu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>

          {/* Brand List */}
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {filteredBrands.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  {searchTerm ? 'Không tìm thấy thương hiệu' : 'Chưa có thương hiệu nào'}
                </div>
              ) : (
                filteredBrands.map((brand) => (
                  <BrandListItem
                    key={brand.systemId}
                    brand={brand}
                    isSelected={selectedBrand?.systemId === brand.systemId}
                    onSelect={handleSelectBrand}
                    onToggleActive={handleToggleActive}
                    onDelete={handleDeleteRequest}
                    searchTerm={searchTerm}
                  />
                ))
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="p-2 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={handleAddNew}
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm thương hiệu
            </Button>
          </div>
        </div>

        {/* Right Panel - Detail Form */}
        <div className="flex-1 flex flex-col">
          {selectedBrand || isNewMode ? (
            <BrandDetailForm
              brand={isNewMode ? null : selectedBrand}
              isNew={isNewMode}
              existingIds={existingIds}
              onSave={handleSave}
              onCancel={handleCancel}
              {...(!isNewMode && selectedBrand ? { onDelete: () => handleDeleteRequest(selectedBrand) } : {})}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center space-y-2">
                <Tags className="h-12 w-12 mx-auto opacity-30" />
                <p>Chọn thương hiệu để xem chi tiết</p>
                <p className="text-sm">hoặc</p>
                <Button variant="outline" size="sm" onClick={handleAddNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm thương hiệu mới
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa thương hiệu</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa thương hiệu "{brandToDelete?.name}"?
              <span className="block mt-2 text-muted-foreground">
                Hành động này không thể hoàn tác.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
