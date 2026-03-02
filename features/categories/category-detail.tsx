'use client'

import * as React from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { Save, X, Trash2, Globe, Image as ImageIcon, Pencil, RefreshCw } from 'lucide-react';
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
import { useCategory, useCategories, useCategoryMutations } from './hooks/use-categories';
import { asSystemId, asBusinessId } from '@/lib/id-types';
import { toast } from 'sonner';
import { NewDocumentsUpload } from '@/components/ui/new-documents-upload';
import { ExistingDocumentsViewer } from '@/components/ui/existing-documents-viewer';
import { type StagingFile } from '@/lib/file-upload-api';
import { SeoAnalysisPanel } from '@/components/shared/seo-preview';
import { TipTapEditor } from '@/components/ui/tiptap-editor';
import { usePageHeader } from '@/contexts/page-header-context';
import { slugify } from '@/lib/utils';
import { CharacterCounter } from '@/components/shared/character-counter';
import { SeoScoreDisplay } from '@/components/shared/seo-score-display';
import { usePkgxCategorySync } from './hooks/use-pkgx-category-sync';
import { usePkgxCategoryMappings, usePkgxCategoryMappingMutations } from '@/features/settings/pkgx/hooks/use-pkgx-settings';
import { PkgxSyncConfirmDialog } from '@/features/settings/pkgx/components/pkgx-sync-confirm-dialog';
import type { ProductCategory } from '@/features/settings/inventory/types';

// Helper type for websiteSeo
type WebsiteSeoType = {
  pkgx?: {
    seoTitle?: string;
    metaDescription?: string;
    seoKeywords?: string;
    shortDescription?: string;
    longDescription?: string;
    slug?: string;
    ogImage?: string;
  };
  trendtech?: {
    seoTitle?: string;
    metaDescription?: string;
    seoKeywords?: string;
    shortDescription?: string;
    longDescription?: string;
    slug?: string;
    ogImage?: string;
  };
};

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

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export function CategoryDetailPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const router = useRouter();
  const pathname = usePathname();
  
  const isEditMode = pathname?.endsWith('/edit') ?? false;
  
  
  // Use React Query to fetch single category and all categories
  const { data: category, isLoading: isCategoryLoading } = useCategory(systemId);
  const { data: categoriesData } = useCategories({ all: true });
  const allCategories = React.useMemo(() => categoriesData?.data ?? [], [categoriesData?.data]);
  
  // Check businessId uniqueness using React Query data
  const isBusinessIdExists = React.useCallback(
    (id: string) => allCategories.some(c => c.id === id),
    [allCategories]
  );
  
  // Category mutations
  const { update, remove } = useCategoryMutations({
    onUpdateSuccess: () => toast.success('Đã cập nhật danh mục'),
    onDeleteSuccess: () => {
      toast.success('Đã xóa danh mục');
      router.push('/categories');
    },
    onError: (err) => toast.error(err.message),
  });
  
  // PKGX sync hook
  const { handleSyncSeo, handleSyncDescription, handleSyncAll, handleSyncBasic, hasPkgxMapping, getPkgxCatId } = usePkgxCategorySync();
  
  // Confirm dialog state for sync actions
  const [confirmAction, setConfirmAction] = React.useState<{
    open: boolean;
    title: string;
    description: string;
    action: (() => void) | null;
  }>({ open: false, title: '', description: '', action: null });
  
  const handleConfirm = (title: string, description: string, action: () => void) => {
    setConfirmAction({ open: true, title, description, action });
  };
  
  const executeAction = () => {
    if (confirmAction.action) {
      confirmAction.action();
    }
    setConfirmAction({ open: false, title: '', description: '', action: null });
  };
  
  const cancelConfirm = () => {
    setConfirmAction({ open: false, title: '', description: '', action: null });
  };
  
  // PKGX unlink mapping
  const { deleteCategoryMapping } = usePkgxCategoryMappingMutations({ onSuccess: () => {
    toast.success('Đã hủy liên kết mapping với PKGX');
  }});
  const categoryMappings = usePkgxCategoryMappings();
  const handleUnlinkPkgx = React.useCallback(() => {
    if (!category) return;
    const mapping = categoryMappings.find(m => m.hrmCategoryId === category.systemId);
    if (mapping) {
      deleteCategoryMapping.mutate(mapping.systemId);
    }
  }, [category, categoryMappings, deleteCategoryMapping]);
  
  // Get all active categories for parent selection (exclude self and descendants)
  const availableParents = React.useMemo(() => {
    if (!systemId) return allCategories.filter(c => !c.isDeleted);
    
    const getDescendantIds = (parentId: string): string[] => {
      const children = allCategories.filter(c => c.parentId === parentId && !c.isDeleted);
      return children.flatMap(c => [String(c.systemId), ...getDescendantIds(String(c.systemId))]);
    };
    
    const excludeIds = [systemId, ...getDescendantIds(systemId)];
    const result = allCategories.filter(c => !c.isDeleted && !excludeIds.includes(String(c.systemId)));
    
    // Debug: Check if parent is in availableParents
    if (category?.parentId) {
      const parentInList = result.find(c => c.systemId === category.parentId);
      console.log('[CategoryDetail] Parent check:', {
        parentId: category.parentId,
        parentInList: !!parentInList,
        excludeIds,
        allCategoriesCount: allCategories.length,
        availableParentsCount: result.length,
      });
    }
    
    return result;
  }, [allCategories, systemId, category?.parentId]);

  // Get child categories
  const childCategories = React.useMemo(() => 
    allCategories.filter(c => c.parentId === systemId && !c.isDeleted),
    [allCategories, systemId]
  );
  
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'general' | 'seo-default' | 'seo-pkgx' | 'seo-trendtech'>('general');
  
  // Image upload states
  const [thumbnailFiles, setThumbnailFiles] = React.useState<StagingFile[]>([]);
  const [thumbnailSessionId, setThumbnailSessionId] = React.useState<string | undefined>();
  // Permanent files (existing thumbnail)
  const [thumbnailPermanentFiles, setThumbnailPermanentFiles] = React.useState<StagingFile[]>([]);
  const [thumbnailFilesToDelete, setThumbnailFilesToDelete] = React.useState<string[]>([]);
  
  // Handle marking thumbnail for deletion (toggle)
  const handleMarkThumbnailForDeletion = React.useCallback((fileId: string) => {
    setThumbnailFilesToDelete(prev => 
      prev.includes(fileId) ? prev.filter(id => id !== fileId) : [...prev, fileId]
    );
  }, []);
  const [pkgxImageFiles, _setPkgxImageFiles] = React.useState<StagingFile[]>([]);
  const [_pkgxImageSessionId, _setPkgxImageSessionId] = React.useState<string | undefined>();
  const [trendtechImageFiles, _setTrendtechImageFiles] = React.useState<StagingFile[]>([]);
  const [_trendtechImageSessionId, _setTrendtechImageSessionId] = React.useState<string | undefined>();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      id: '',
      name: '',
      parentId: '',
      thumbnailImage: '',
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

  // Reset form whenever category data is available or edit mode toggles
  React.useEffect(() => {
    if (!category) return;

    form.reset({
      id: String(category.id) || '',
      name: category.name || '',
      parentId: category.parentId ? String(category.parentId) : '',
      thumbnailImage: category.imageUrl || category.thumbnail || '',
      isActive: category.isActive ?? true,
      // SEO mặc định
      seoTitle: category.seoTitle || '',
      metaDescription: category.metaDescription || '',
      seoKeywords: category.seoKeywords || '',
      shortDescription: category.shortDescription || '',
      longDescription: category.longDescription || '',
      // SEO riêng cho từng website
      websiteSeo: {
        pkgx: (category.websiteSeo as WebsiteSeoType)?.pkgx || {},
        trendtech: (category.websiteSeo as WebsiteSeoType)?.trendtech || {},
      },
    });
  }, [category, isEditMode, form]);

  const watchedName = form.watch('name');
  const _watchedId = form.watch('id');
  const watchedPkgxSeoTitle = form.watch('websiteSeo.pkgx.seoTitle');
  const watchedPkgxMetaDesc = form.watch('websiteSeo.pkgx.metaDescription');
  const watchedPkgxKeywords = form.watch('websiteSeo.pkgx.seoKeywords');
  const watchedPkgxSlug = form.watch('websiteSeo.pkgx.slug');
  const watchedTrendtechSeoTitle = form.watch('websiteSeo.trendtech.seoTitle');
  const watchedTrendtechMetaDesc = form.watch('websiteSeo.trendtech.metaDescription');
  const watchedTrendtechKeywords = form.watch('websiteSeo.trendtech.seoKeywords');
  const watchedTrendtechSlug = form.watch('websiteSeo.trendtech.slug');

  // Load existing thumbnail as permanent file
  React.useEffect(() => {
    const current = category?.imageUrl || category?.thumbnail;
    if (!current || thumbnailPermanentFiles.length > 0) return;
    setThumbnailPermanentFiles([{
      id: 'existing-thumbnail',
      sessionId: 'permanent',
      name: 'thumbnail',
      originalName: 'Ảnh đại diện',
      slug: 'thumbnail',
      filename: 'Ảnh đại diện',
      url: current,
      type: 'image',
      size: 0,
      status: 'permanent',
      uploadedAt: new Date().toISOString(),
      metadata: {},
    }]);
  }, [category?.imageUrl, category?.thumbnail, thumbnailPermanentFiles.length]);
  
  // Reset delete tracking when exiting edit mode
  React.useEffect(() => {
    if (!isEditMode) {
      setThumbnailFilesToDelete([]);
    }
  }, [isEditMode]);

  const handleSubmit = React.useCallback(async (formData: CategoryFormValues) => {
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
    
    update.mutate({
      systemId: systemId,
      data: {
        ...formData,
        id: asBusinessId(formData.id),
        parentId: formData.parentId ? asSystemId(formData.parentId) : undefined,
        imageUrl: thumbnailUrl,
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
      },
    });
    
    router.push(`/categories/${systemId}`);
  }, [systemId, category, isBusinessIdExists, form, thumbnailFiles, pkgxImageFiles, trendtechImageFiles, update, router]);

  const handleDelete = () => {
    if (!systemId) return;
    
    if (childCategories.length > 0) {
      toast.error('Không thể xóa danh mục có danh mục con');
      return;
    }
    
    remove.mutate(systemId);
  };

  const handleSwitchToEdit = React.useCallback(() => {
    router.push(`/categories/${systemId}/edit`);
  }, [router, systemId]);

  // Header actions
  const headerActions = React.useMemo(() => {
    if (isEditMode) {
      return [
        <Button key="cancel" variant="outline" size="sm" className="h-9" onClick={() => router.push(`/categories/${systemId}`)}>
          <X className="mr-2 h-4 w-4" />
          Hủy
        </Button>,
        <Button key="save" size="sm" className="h-9" onClick={form.handleSubmit(handleSubmit)}>
          <Save className="mr-2 h-4 w-4" />
          Lưu
        </Button>
      ];
    }
    
    const actions = [
      <Button key="delete" variant="outline" size="sm" className="h-9 text-destructive hover:text-destructive" onClick={() => setIsDeleteAlertOpen(true)}>
        <Trash2 className="mr-2 h-4 w-4" />
        Xóa
      </Button>,
    ];
    
    // Add PKGX sync actions if category is mapped
    if (category) {
      const categoryWithBrandedIds = {
        ...category,
        systemId: asSystemId(category.systemId),
        id: asBusinessId(category.id)
      } as unknown as ProductCategory;
      
      if (hasPkgxMapping(categoryWithBrandedIds)) {
        actions.unshift(
          <Button key="unlink-pkgx" variant="destructive" size="sm" className="h-9" onClick={handleUnlinkPkgx}>
            <X className="mr-2 h-4 w-4" />
            Hủy liên kết
          </Button>,
          <Button key="sync-basic" variant="outline" size="sm" className="h-9" onClick={() => handleConfirm(
            'Đồng bộ thông tin cơ bản',
            `Bạn có chắc muốn đồng bộ thông tin cơ bản (Tên) của "${category?.name}" lên PKGX?`,
            () => handleSyncBasic(categoryWithBrandedIds)
          )}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Thông tin cơ bản
          </Button>,
          <Button key="sync-desc" variant="outline" size="sm" className="h-9" onClick={() => handleConfirm(
            'Đồng bộ mô tả',
            `Bạn có chắc muốn đồng bộ mô tả (Short Desc, Long Desc) của "${category?.name}" lên PKGX?`,
            () => handleSyncDescription(categoryWithBrandedIds)
          )}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Mô tả
          </Button>,
          <Button key="sync-seo" variant="outline" size="sm" className="h-9" onClick={() => handleConfirm(
            'Đồng bộ SEO',
            `Bạn có chắc muốn đồng bộ SEO (Keywords, Meta Title, Meta Description) của "${category?.name}" lên PKGX?`,
            () => handleSyncSeo(categoryWithBrandedIds)
          )}>
            <RefreshCw className="mr-2 h-4 w-4" />
            SEO
          </Button>,
          <Button key="sync-all" variant="outline" size="sm" className="h-9" onClick={() => handleConfirm(
            'Đồng bộ tất cả',
            `Bạn có chắc muốn đồng bộ TẤT CẢ thông tin danh mục "${category?.name}" lên PKGX?`,
            () => handleSyncAll(categoryWithBrandedIds)
          )}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Đồng bộ tất cả
          </Button>
        );
      }
    }
    
    actions.push(
      <Button key="edit" size="sm" className="h-9" onClick={handleSwitchToEdit}>
        <Pencil className="mr-2 h-4 w-4" />
        Chỉnh sửa
      </Button>
    );
    
    return actions;
  }, [isEditMode, systemId, router, form, handleSubmit, handleSwitchToEdit, category, hasPkgxMapping, handleSyncAll, handleSyncSeo, handleSyncDescription, handleSyncBasic, handleUnlinkPkgx]);

  usePageHeader({
    title: category?.name || 'Danh mục',
    actions: headerActions,
    showBackButton: true,
  });

  // Loading state
  if (isCategoryLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <p className="text-muted-foreground">Không tìm thấy danh mục</p>
          <Button variant="link" onClick={() => router.push('/categories')}>
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  // Get parent category info
  const parentCategory = category.parentId 
    ? allCategories.find(c => c.systemId === category.parentId) 
    : null;

  // View mode
  if (!isEditMode) {
    return (
      <div className="space-y-6 pb-8">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList>
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
          <TabsContent value="general" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-6">
                  {/* Thumbnail */}
                  <Avatar className="h-24 w-24 rounded-lg border">
                    {(category.imageUrl || category.thumbnail) ? (
                      <AvatarImage src={category.imageUrl || category.thumbnail || ''} alt={category.name} className="object-cover" />
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
                            onClick={() => router.push(`/categories/${parentCategory.systemId}`)}
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
                    
                    {/* PKGX Mapping Info */}
                    {category && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Mapping PKGX</p>
                        {(() => {
                          const categoryWithBrandedIds = {
                            ...category,
                            systemId: asSystemId(category.systemId),
                            id: asBusinessId(category.id)
                          } as unknown as ProductCategory;
                          return hasPkgxMapping(categoryWithBrandedIds) ? (
                            <Badge variant="default" className="bg-green-500">
                              <span className="mr-1">✓</span>
                              Đã mapping (ID: {getPkgxCatId(categoryWithBrandedIds)})
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Chưa mapping</Badge>
                          );
                        })()}
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
                        onClick={() => router.push(`/categories/${child.systemId}`)}
                      >
                        {child.name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* SEO Default Tab */}
          <TabsContent value="seo-default" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <CardTitle>SEO Mặc định</CardTitle>
                </div>
                <CardDescription>Thông tin SEO chung - sẽ được dùng nếu không có SEO riêng cho từng website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Tiêu đề SEO</p>
                  <p className="text-sm font-medium">{category.seoTitle || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Meta Description</p>
                  <p className="text-sm">{category.metaDescription || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Từ khóa SEO</p>
                  <p className="text-sm">{category.seoKeywords || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Mô tả ngắn</p>
                  {category.shortDescription ? (
                    <div className="prose prose-sm max-w-none text-sm border rounded-md p-3 bg-muted/30" dangerouslySetInnerHTML={{ __html: category.shortDescription }} />
                  ) : <p className="text-sm text-muted-foreground">-</p>}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Mô tả chi tiết</p>
                  {category.longDescription ? (
                    <div className="prose prose-sm max-w-none text-sm border rounded-md p-3 bg-muted/30" dangerouslySetInnerHTML={{ __html: category.longDescription }} />
                  ) : <p className="text-sm text-muted-foreground">-</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO PKGX Tab */}
          <TabsContent value="seo-pkgx" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-red-500" />
                    <CardTitle>SEO PKGX</CardTitle>
                  </div>
                </div>
                <CardDescription>
                  phukiengiaxuong.com.vn - Override SEO chung
                  {category && !hasPkgxMapping(category as unknown as ProductCategory) && (
                    <span className="text-orange-600 ml-2">(Chưa mapping với PKGX - vào Cài đặt &gt; PKGX để mapping)</span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Tiêu đề SEO</p>
                  <p className="text-sm font-medium">{(category.websiteSeo as WebsiteSeoType)?.pkgx?.seoTitle || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Meta Description</p>
                  <p className="text-sm">{(category.websiteSeo as WebsiteSeoType)?.pkgx?.metaDescription || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Từ khóa SEO</p>
                  <p className="text-sm">{(category.websiteSeo as WebsiteSeoType)?.pkgx?.seoKeywords || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">URL Slug</p>
                  <p className="text-sm font-mono">{(category.websiteSeo as WebsiteSeoType)?.pkgx?.slug || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Mô tả ngắn</p>
                  {(category.websiteSeo as WebsiteSeoType)?.pkgx?.shortDescription ? (
                    <div className="prose prose-sm max-w-none text-sm border rounded-md p-3 bg-muted/30" dangerouslySetInnerHTML={{ __html: (category.websiteSeo as WebsiteSeoType)?.pkgx?.shortDescription || '' }} />
                  ) : <p className="text-sm text-muted-foreground">-</p>}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Mô tả chi tiết</p>
                  {(category.websiteSeo as WebsiteSeoType)?.pkgx?.longDescription ? (
                    <div className="prose prose-sm max-w-none text-sm border rounded-md p-3 bg-muted/30" dangerouslySetInnerHTML={{ __html: (category.websiteSeo as WebsiteSeoType)?.pkgx?.longDescription || '' }} />
                  ) : <p className="text-sm text-muted-foreground">-</p>}
                </div>
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
                <CardDescription>trendtech.vn - Override SEO chung</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Tiêu đề SEO</p>
                  <p className="text-sm font-medium">{(category.websiteSeo as WebsiteSeoType)?.trendtech?.seoTitle || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Meta Description</p>
                  <p className="text-sm">{(category.websiteSeo as WebsiteSeoType)?.trendtech?.metaDescription || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Từ khóa SEO</p>
                  <p className="text-sm">{(category.websiteSeo as WebsiteSeoType)?.trendtech?.seoKeywords || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">URL Slug</p>
                  <p className="text-sm font-mono">{(category.websiteSeo as WebsiteSeoType)?.trendtech?.slug || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Mô tả ngắn</p>
                  {(category.websiteSeo as WebsiteSeoType)?.trendtech?.shortDescription ? (
                    <div className="prose prose-sm max-w-none text-sm border rounded-md p-3 bg-muted/30" dangerouslySetInnerHTML={{ __html: (category.websiteSeo as WebsiteSeoType)?.trendtech?.shortDescription || '' }} />
                  ) : <p className="text-sm text-muted-foreground">-</p>}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Mô tả chi tiết</p>
                  {(category.websiteSeo as WebsiteSeoType)?.trendtech?.longDescription ? (
                    <div className="prose prose-sm max-w-none text-sm border rounded-md p-3 bg-muted/30" dangerouslySetInnerHTML={{ __html: (category.websiteSeo as WebsiteSeoType)?.trendtech?.longDescription || '' }} />
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
                    render={({ field }) => {
                      const currentParentId = field.value || '';
                      const parentFallback = currentParentId && !availableParents.find(p => String(p.systemId) === currentParentId)
                        ? allCategories.find(c => c.systemId === currentParentId)
                        : null;
                      return (
                      <FormItem>
                        <FormLabel>Danh mục cha</FormLabel>
                        <Select
                          key={currentParentId || '__none__'}
                          value={currentParentId || '__none__'}
                          onValueChange={(val) => field.onChange(val === '__none__' ? '' : val)}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn danh mục cha" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="__none__">— Danh mục gốc (Cấp 0) —</SelectItem>
                            {parentFallback ? (
                              <SelectItem value={String(parentFallback.systemId)} className="flex items-center text-orange-600">
                                <span className="flex items-center gap-1">{parentFallback.name} (đang bị ẩn khỏi danh sách)</span>
                              </SelectItem>
                            ) : null}
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
                    )}}
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
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Ảnh đại diện
                  </CardTitle>
                  <CardDescription>Ảnh hiển thị trong danh sách danh mục (PNG, JPG, WebP - tối đa 2MB)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Existing thumbnail - show in edit mode with permanent files */}
                  {isEditMode && thumbnailPermanentFiles.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded">
                        <span>✓</span>
                        <span>Ảnh hiện tại</span>
                      </div>
                      <ExistingDocumentsViewer
                        files={thumbnailPermanentFiles}
                        onMarkForDeletion={handleMarkThumbnailForDeletion}
                        markedForDeletion={thumbnailFilesToDelete}
                      />
                    </div>
                  )}
                  
                  {/* New thumbnail upload */}
                  <div className="space-y-2">
                    {isEditMode && thumbnailPermanentFiles.length > 0 && (
                      <div className="flex items-center gap-2 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded">
                        <span>📤</span>
                        <span>Upload ảnh mới để thay thế</span>
                      </div>
                    )}
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
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SEO Default Tab */}
            <TabsContent value="seo-default" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <CardTitle>SEO Mặc định</CardTitle>
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
                            className="min-h-20"
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
                            className="min-h-20"
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
      
      <PkgxSyncConfirmDialog 
        confirmAction={confirmAction}
        isSyncing={false}
        onConfirm={executeAction}
        onCancel={cancelConfirm}
      />
    </div>
  );
}
