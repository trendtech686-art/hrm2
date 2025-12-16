import * as React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Save, X, Trash2, Globe, Image as ImageIcon, Pencil } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
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
import { useProductCategoryStore } from '../settings/inventory/product-category-store';
import type { ProductCategory } from '../settings/inventory/types';
import { asSystemId, asBusinessId } from '@/lib/id-types';
import { toast } from 'sonner';
import { NewDocumentsUpload } from '@/components/ui/new-documents-upload';
import { type StagingFile } from '@/lib/file-upload-api';
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
  id: z.string().min(1, 'Mã danh mục là bắt buộc'),
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

export function CategoryDetailPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isEditMode = location.pathname.endsWith('/edit');
  
  const { data, update, remove, isBusinessIdExists } = useProductCategoryStore();
  
  const category = React.useMemo(() => 
    data.find(c => c.systemId === systemId), 
    [data, systemId]
  );
  
  // Get all active categories for parent selection (exclude self and descendants)
  const availableParents = React.useMemo(() => {
    if (!systemId) return data.filter(c => !c.isDeleted);
    
    const getDescendantIds = (parentId: string): string[] => {
      const children = data.filter(c => c.parentId === parentId && !c.isDeleted);
      return children.flatMap(c => [String(c.systemId), ...getDescendantIds(String(c.systemId))]);
    };
    
    const excludeIds = [systemId, ...getDescendantIds(systemId)];
    return data.filter(c => !c.isDeleted && !excludeIds.includes(String(c.systemId)));
  }, [data, systemId]);

  // Get child categories
  const childCategories = React.useMemo(() => 
    data.filter(c => c.parentId === systemId && !c.isDeleted),
    [data, systemId]
  );
  
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'general' | 'seo-pkgx' | 'seo-trendtech'>('general');
  
  // Image upload states
  const [thumbnailFiles, setThumbnailFiles] = React.useState<StagingFile[]>([]);
  const [thumbnailSessionId, setThumbnailSessionId] = React.useState<string | undefined>();
  const [pkgxImageFiles, setPkgxImageFiles] = React.useState<StagingFile[]>([]);
  const [pkgxImageSessionId, setPkgxImageSessionId] = React.useState<string | undefined>();
  const [trendtechImageFiles, setTrendtechImageFiles] = React.useState<StagingFile[]>([]);
  const [trendtechImageSessionId, setTrendtechImageSessionId] = React.useState<string | undefined>();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      id: '',
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

  // Reset form when category data changes
  React.useEffect(() => {
    if (category) {
      form.reset({
        id: String(category.id) || '',
        name: category.name || '',
        parentId: category.parentId ? String(category.parentId) : '',
        thumbnailImage: category.thumbnailImage || '',
        isActive: category.isActive ?? true,
        websiteSeo: {
          pkgx: category.websiteSeo?.pkgx || {},
          trendtech: category.websiteSeo?.trendtech || {},
        },
      });
    }
  }, [category, form]);

  const watchedName = form.watch('name');
  const watchedId = form.watch('id');
  const watchedPkgxSeoTitle = form.watch('websiteSeo.pkgx.seoTitle');
  const watchedPkgxMetaDesc = form.watch('websiteSeo.pkgx.metaDescription');
  const watchedPkgxKeywords = form.watch('websiteSeo.pkgx.seoKeywords');
  const watchedPkgxSlug = form.watch('websiteSeo.pkgx.slug');
  const watchedTrendtechSeoTitle = form.watch('websiteSeo.trendtech.seoTitle');
  const watchedTrendtechMetaDesc = form.watch('websiteSeo.trendtech.metaDescription');
  const watchedTrendtechKeywords = form.watch('websiteSeo.trendtech.seoKeywords');
  const watchedTrendtechSlug = form.watch('websiteSeo.trendtech.slug');

  const handleSubmit = async (formData: CategoryFormValues) => {
    if (!systemId || !category) return;
    
    // Check if businessId changed and already exists
    if (formData.id !== String(category.id) && isBusinessIdExists(formData.id)) {
      form.setError('id', { message: 'Mã danh mục đã tồn tại' });
      return;
    }
    
    // Get image URLs from staging files
    let thumbnailUrl = formData.thumbnailImage;
    let pkgxOgImage = formData.websiteSeo?.pkgx?.ogImage;
    let trendtechOgImage = formData.websiteSeo?.trendtech?.ogImage;
    
    if (thumbnailFiles.length > 0) {
      thumbnailUrl = thumbnailFiles[0]?.url || thumbnailUrl;
    }
    if (pkgxImageFiles.length > 0) {
      pkgxOgImage = pkgxImageFiles[0]?.url || pkgxOgImage;
    }
    if (trendtechImageFiles.length > 0) {
      trendtechOgImage = trendtechImageFiles[0]?.url || trendtechOgImage;
    }
    
    update(asSystemId(systemId), {
      ...formData,
      id: asBusinessId(formData.id),
      parentId: formData.parentId ? asSystemId(formData.parentId) : undefined,
      thumbnailImage: thumbnailUrl,
      websiteSeo: {
        pkgx: {
          ...formData.websiteSeo?.pkgx,
          ogImage: pkgxOgImage,
        },
        trendtech: {
          ...formData.websiteSeo?.trendtech,
          ogImage: trendtechOgImage,
        },
      },
    });
    
    toast.success('Đã cập nhật danh mục');
    navigate(`/categories/${systemId}`);
  };

  const handleDelete = () => {
    if (!systemId) return;
    
    if (childCategories.length > 0) {
      toast.error('Không thể xóa danh mục có danh mục con');
      return;
    }
    
    remove(asSystemId(systemId));
    toast.success('Đã xóa danh mục');
    navigate('/categories');
  };

  const handleSwitchToEdit = () => {
    navigate(`/categories/${systemId}/edit`);
  };

  // Header actions
  const headerActions = React.useMemo(() => {
    if (isEditMode) {
      return [
        <Button key="cancel" variant="outline" size="sm" className="h-9" onClick={() => navigate(`/categories/${systemId}`)}>
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

  if (!category) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <p className="text-muted-foreground">Không tìm thấy danh mục</p>
          <Button variant="link" onClick={() => navigate('/categories')}>
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  // Get parent category info
  const parentCategory = category.parentId 
    ? data.find(c => c.systemId === category.parentId) 
    : null;

  // View mode
  if (!isEditMode) {
    return (
      <div className="space-y-6 pb-8">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList>
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
          <TabsContent value="general" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-6">
                  {/* Thumbnail */}
                  <Avatar className="h-24 w-24 rounded-lg border">
                    {category.thumbnailImage ? (
                      <AvatarImage src={category.thumbnailImage} alt={category.name} className="object-cover" />
                    ) : null}
                    <AvatarFallback className="rounded-lg bg-muted">
                      <ImageIcon className="h-10 w-10 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Mã danh mục</p>
                        <p className="font-mono font-medium">{category.id}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Trạng thái</p>
                        {category.isActive !== false ? (
                          <Badge variant="default">Hoạt động</Badge>
                        ) : (
                          <Badge variant="secondary">Tạm tắt</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Tên danh mục</p>
                      <p className="text-lg font-semibold">{category.name}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Cấp độ</p>
                        <Badge variant="outline">Cấp {category.level ?? 0}</Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Danh mục cha</p>
                        {parentCategory ? (
                          <Button 
                            variant="link" 
                            className="h-auto p-0 text-primary"
                            onClick={() => navigate(`/categories/${parentCategory.systemId}`)}
                          >
                            {parentCategory.name}
                          </Button>
                        ) : (
                          <p className="text-muted-foreground">— (Danh mục gốc)</p>
                        )}
                      </div>
                    </div>

                    {category.path && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Đường dẫn</p>
                        <p className="text-sm">{category.path}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Child Categories */}
            {childCategories.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Danh mục con ({childCategories.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {childCategories.map(child => (
                      <Button
                        key={String(child.systemId)}
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/categories/${child.systemId}`)}
                      >
                        {child.name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* SEO PKGX Tab */}
          <TabsContent value="seo-pkgx" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-red-500" />
                  <CardTitle>SEO PKGX</CardTitle>
                </div>
                <CardDescription>phukiengiaxuong.com.vn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.websiteSeo?.pkgx?.seoTitle || category.websiteSeo?.pkgx?.metaDescription ? (
                  <div className="space-y-4">
                    {category.websiteSeo?.pkgx?.ogImage && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Hình ảnh OG</p>
                        <img 
                          src={category.websiteSeo.pkgx.ogImage} 
                          alt="OG Image" 
                          className="max-w-md rounded-lg border"
                        />
                      </div>
                    )}
                    <Separator />
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">SEO Title</p>
                        <p className="font-medium">{category.websiteSeo?.pkgx?.seoTitle || '—'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">URL Slug</p>
                        <p className="font-mono text-sm">{category.websiteSeo?.pkgx?.slug ? `/${category.websiteSeo.pkgx.slug}` : '—'}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Meta Description</p>
                      <p className="text-sm">{category.websiteSeo?.pkgx?.metaDescription || '—'}</p>
                    </div>
                    
                    {category.websiteSeo?.pkgx?.seoKeywords && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Keywords</p>
                        <div className="flex flex-wrap gap-1">
                          {category.websiteSeo.pkgx.seoKeywords.split(',').map((kw, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {kw.trim()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Globe className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground">Chưa cấu hình SEO</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Trendtech Tab */}
          <TabsContent value="seo-trendtech" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-500" />
                  <CardTitle>SEO Trendtech</CardTitle>
                </div>
                <CardDescription>trendtech.vn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.websiteSeo?.trendtech?.seoTitle || category.websiteSeo?.trendtech?.metaDescription ? (
                  <div className="space-y-4">
                    {category.websiteSeo?.trendtech?.ogImage && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Hình ảnh OG</p>
                        <img 
                          src={category.websiteSeo.trendtech.ogImage} 
                          alt="OG Image" 
                          className="max-w-md rounded-lg border"
                        />
                      </div>
                    )}
                    <Separator />
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">SEO Title</p>
                        <p className="font-medium">{category.websiteSeo?.trendtech?.seoTitle || '—'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">URL Slug</p>
                        <p className="font-mono text-sm">{category.websiteSeo?.trendtech?.slug ? `/${category.websiteSeo.trendtech.slug}` : '—'}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Meta Description</p>
                      <p className="text-sm">{category.websiteSeo?.trendtech?.metaDescription || '—'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Globe className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground">Chưa cấu hình SEO</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Delete Alert */}
        <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xóa danh mục?</AlertDialogTitle>
              <AlertDialogDescription>
                {childCategories.length > 0 
                  ? `Danh mục "${category.name}" có ${childCategories.length} danh mục con. Vui lòng xóa hoặc di chuyển các danh mục con trước.`
                  : `Danh mục "${category.name}" sẽ bị xóa khỏi hệ thống. Hành động này không thể hoàn tác.`
                }
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Đóng</AlertDialogCancel>
              {childCategories.length === 0 && (
                <AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // Edit mode
  return (
    <div className="space-y-6 pb-8">
      <Form {...form}>
        <form className="space-y-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
            <TabsList>
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
            <TabsContent value="general" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin cơ bản</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mã danh mục <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="VD: DM000001" {...field} />
                          </FormControl>
                          <FormDescription>Có thể tùy chỉnh mã theo quy tắc của bạn</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
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
                  </div>

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
                          Để trống nếu đây là danh mục gốc
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Kích hoạt</FormLabel>
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
                <CardHeader>
                  <CardTitle>Ảnh đại diện</CardTitle>
                  <CardDescription>Ảnh hiển thị trong danh sách danh mục</CardDescription>
                </CardHeader>
                <CardContent>
                  <NewDocumentsUpload
                    accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
                    maxFiles={1}
                    maxSize={2 * 1024 * 1024}
                    value={thumbnailFiles}
                    onChange={setThumbnailFiles}
                    sessionId={thumbnailSessionId}
                    onSessionChange={setThumbnailSessionId}
                    className="min-h-[120px]"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* SEO PKGX Tab */}
            <TabsContent value="seo-pkgx" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-red-500" />
                    <CardTitle>SEO cho PKGX</CardTitle>
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
                          <Input placeholder="Tiêu đề hiển thị trên Google" {...field} />
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
                            placeholder="Mô tả ngắn gọn về danh mục, hiển thị dưới tiêu đề trên Google" 
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>Nên từ 150-160 ký tự.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="websiteSeo.pkgx.slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL Slug</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input placeholder="danh-muc-san-pham" {...field} />
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
                          <FormDescription>Không dấu, phân cách bằng gạch ngang</FormDescription>
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
                          <FormDescription>3-10 từ khóa</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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
                            placeholder="Mô tả ngắn 1-2 câu..."
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
            <TabsContent value="seo-trendtech" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-blue-500" />
                    <CardTitle>SEO cho Trendtech</CardTitle>
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
                          <Input placeholder="Tiêu đề hiển thị trên Google" {...field} />
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
                            placeholder="Mô tả ngắn gọn về danh mục" 
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>Nên từ 150-160 ký tự.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="websiteSeo.trendtech.slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL Slug</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input placeholder="danh-muc-san-pham" {...field} />
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
                          <FormDescription>3-10 từ khóa</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

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
                            placeholder="Mô tả ngắn 1-2 câu..."
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
