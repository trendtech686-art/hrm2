'use client'

import * as React from 'react';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { 
  Save, 
  X, 
  Trash2,
  Globe,
  Image as ImageIcon,
  Pencil,
  BarChart3,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  Layers,
  Info,
  FileText,
  Unlink,
  Loader2,
  MoreHorizontal,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { MobileTabsList, MobileTabsTrigger, mobileBleedCardClass } from '@/components/layout/page-section';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { useBrandMutations } from './hooks/use-brands';
import { useAllBrands } from './hooks/use-all-brands';
import type { Brand as _Brand, MultiWebsiteSeo } from '../settings/inventory/types';
import { asSystemId, asBusinessId, type SystemId as _SystemId } from '@/lib/id-types';
import { toast } from 'sonner';
import { NewDocumentsUpload } from '@/components/ui/new-documents-upload';
import { ExistingDocumentsViewer } from '@/components/ui/existing-documents-viewer';
import { FileUploadAPI, type StagingFile } from '@/lib/file-upload-api';
import { SeoAnalysisPanel } from '@/components/shared/seo-preview';
import { TipTapEditor } from '@/components/ui/tiptap-editor';
import { usePageHeader } from '@/contexts/page-header-context';
import { useBreakpoint } from '@/contexts/breakpoint-context';
import { useAuth } from '@/contexts/auth-context';
import { usePkgxBrandSync } from './hooks/use-pkgx-brand-sync';
import { usePkgxBrandMappingMutations, usePkgxMappings } from '@/features/settings/pkgx/hooks/use-pkgx-settings';
import { PkgxSyncConfirmDialog } from '@/features/settings/pkgx/components/pkgx-sync-confirm-dialog';
import { logError } from '@/lib/logger'
import { sanitizeHtml } from '@/lib/sanitize'

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
  const router = useRouter();
  const { can, isAdmin } = useAuth();
  const { isMobile } = useBreakpoint();
  const pathname = usePathname();
  
  const isEditMode = pathname?.endsWith('/edit') ?? false;
  
  const { data: brands = [], isLoading: isBrandsLoading } = useAllBrands();
  const { update, remove } = useBrandMutations({
    onUpdateSuccess: () => {
      toast.success('Đã cập nhật thương hiệu');
      router.push(`/brands/${systemId}`);
    },
    onDeleteSuccess: () => {
      toast.success('Đã xóa thương hiệu');
      router.push('/brands');
    },
    onError: (err) => toast.error(err.message)
  });
  
  // PKGX sync hook with import
  const { handleSyncSeo, handleSyncDescription, handleSyncAll, handleSyncBasicInfo, handleImportFromPkgx, hasPkgxMapping } = usePkgxBrandSync();
  
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
  
  const brand = React.useMemo(() => 
    brands.find(b => b.systemId === systemId), 
    [brands, systemId]
  );
  
  // PKGX mapping hooks - use React Query hook instead of localStorage
  const { data: pkgxMappingsData } = usePkgxMappings();
  const pkgxBrandMappings = React.useMemo(() => pkgxMappingsData?.brandMappings ?? [], [pkgxMappingsData?.brandMappings]);
  
  const brandMapping = React.useMemo(() => 
    brand ? pkgxBrandMappings.find((m: { hrmBrandId: string }) => m.hrmBrandId === brand.systemId) : null,
    [brand, pkgxBrandMappings]
  );
  
  // PKGX unlink mapping
  const { deleteBrandMapping } = usePkgxBrandMappingMutations({ onSuccess: () => {
    toast.success('Đã hủy liên kết mapping với PKGX');
  }});
  const handleUnlinkPkgx = React.useCallback(() => {
    if (!brand) return;
    const mapping = pkgxBrandMappings.find(m => m.hrmBrandId === brand.systemId);
    if (mapping) {
      deleteBrandMapping.mutate(mapping.systemId);
    }
  }, [brand, pkgxBrandMappings, deleteBrandMapping]);
  
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'general' | 'seo-default' | 'seo-pkgx' | 'seo-trendtech'>('general');
  
  // Logo upload state
  const [logoFiles, setLogoFiles] = React.useState<StagingFile[]>([]);
  const [logoSessionId, setLogoSessionId] = React.useState<string | undefined>();
  const [logoPermanentFiles, setLogoPermanentFiles] = React.useState<StagingFile[]>([]);
  const [logoFilesToDelete, setLogoFilesToDelete] = React.useState<string[]>([]);

  // Load existing logo as permanent file
  React.useEffect(() => {
    if (brand?.logo && logoPermanentFiles.length === 0) {
      setLogoPermanentFiles([{
        id: 'existing-logo',
        sessionId: '',
        name: 'logo',
        originalName: 'logo',
        slug: 'logo',
        filename: brand.logo,
        size: 0,
        type: 'image',
        url: brand.logo,
        status: 'permanent' as const,
        uploadedAt: new Date().toISOString(),
        metadata: {},
      }]);
    }
  }, [brand?.logo, logoPermanentFiles.length]);

  // Handle marking logo for deletion
  const handleMarkLogoForDeletion = React.useCallback((fileId: string) => {
    setLogoFilesToDelete(prev => {
      if (prev.includes(fileId)) {
        return prev.filter(id => id !== fileId);
      }
      return [...prev, fileId];
    });
  }, []);

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
          pkgx: (brand.websiteSeo as MultiWebsiteSeo | undefined)?.pkgx || {},
          trendtech: (brand.websiteSeo as MultiWebsiteSeo | undefined)?.trendtech || {},
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

  const handleSubmit = React.useCallback(async (data: BrandFormValues) => {
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
        logError('Error confirming logo', error);
      }
    }
    
    update.mutate({
      systemId: asSystemId(systemId),
      data: {
        ...data,
        id: asBusinessId(data.id),
        logo: logoUrl,
      }
    });
  }, [systemId, logoFiles, logoSessionId, update]);

  const handleDelete = () => {
    if (!systemId) return;
    remove.mutate(asSystemId(systemId));
  };

  const handleSwitchToEdit = React.useCallback(() => {
    router.push(`/brands/${systemId}/edit`);
  }, [router, systemId]);

  // Import handler
  const _handleImport = React.useCallback(() => {
    if (!brand) return;
    
    
    handleImportFromPkgx(brand as unknown as _Brand, async (importedData) => {
      
      // Prepare full data to save
      const dataToSave = {
        ...form.getValues(),
        name: importedData.name || form.getValues('name'),
        website: importedData.website || form.getValues('website'),
        description: importedData.description || form.getValues('description'),
        seoTitle: importedData.seoTitle || form.getValues('seoTitle'),
        metaDescription: importedData.metaDescription || form.getValues('metaDescription'),
        seoKeywords: importedData.seoKeywords || form.getValues('seoKeywords'),
        shortDescription: importedData.shortDescription || form.getValues('shortDescription'),
        longDescription: importedData.longDescription || form.getValues('longDescription'),
        websiteSeo: {
          pkgx: importedData.websiteSeo?.pkgx || form.getValues('websiteSeo')?.pkgx || {},
          trendtech: form.getValues('websiteSeo')?.trendtech || {},
        },
      };
      
      
      // Save to database immediately
      if (systemId) {
        update.mutate({
          systemId: asSystemId(systemId),
          data: {
            ...dataToSave,
            id: asBusinessId(dataToSave.id),
          }
        });
      }
    });
  }, [brand, handleImportFromPkgx, form, systemId, update]);

  // Header actions
  const headerActions = React.useMemo((): React.ReactNode[] => {
    if (isEditMode) {
      return [
        <Button key="cancel" variant="outline" size="sm" onClick={() => router.push(`/brands/${systemId}`)}>
          <X className="mr-2 h-4 w-4" />
          Hủy
        </Button>,
        <Button key="save" size="sm" onClick={form.handleSubmit(handleSubmit)} disabled={update.isPending}>
          {update.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          {update.isPending ? 'Đang lưu...' : 'Lưu'}
        </Button>
      ];
    }
    
    const actions = [
      <Button key="delete" variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => setIsDeleteAlertOpen(true)}>
        <Trash2 className="mr-2 h-4 w-4" />
        Xóa
      </Button>,
    ];
    
    // Add PKGX sync actions if brand is mapped
    if (brand) {
      const brandWithBrandedIds = brand as unknown as _Brand;
      
      if (hasPkgxMapping(brandWithBrandedIds)) {
        actions.unshift(
          <DropdownMenu key="pkgx-sync">
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Cập nhật PKGX
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleConfirm(
                'Đồng bộ tất cả',
                `Bạn có chắc muốn đồng bộ TẤT CẢ thông tin thương hiệu "${brand?.name}" lên PKGX?`,
                () => handleSyncAll(brandWithBrandedIds)
              )}>
                <Layers className="mr-2 h-4 w-4" />
                Đồng bộ tất cả
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleConfirm(
                'Đồng bộ thông tin cơ bản',
                `Bạn có chắc muốn đồng bộ thông tin cơ bản (Tên, Website) của "${brand?.name}" lên PKGX?`,
                () => handleSyncBasicInfo(brandWithBrandedIds)
              )}>
                <Info className="mr-2 h-4 w-4" />
                Thông tin cơ bản
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleConfirm(
                'Đồng bộ SEO',
                `Bạn có chắc muốn đồng bộ SEO (Keywords, Meta Title, Meta Description) của "${brand?.name}" lên PKGX?`,
                () => handleSyncSeo(brandWithBrandedIds)
              )}>
                <Globe className="mr-2 h-4 w-4" />
                SEO
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleConfirm(
                'Đồng bộ mô tả',
                `Bạn có chắc muốn đồng bộ mô tả (Short Desc, Long Desc) của "${brand?.name}" lên PKGX?`,
                () => handleSyncDescription(brandWithBrandedIds)
              )}>
                <FileText className="mr-2 h-4 w-4" />
                Mô tả
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                const mapping = pkgxBrandMappings.find(m => m.hrmBrandId === brand?.systemId);
                if (mapping?.pkgxBrandId) {
                  window.open(`https://phukiengiaxuong.com.vn/admin/brand.php?act=edit&id=${mapping.pkgxBrandId}`, '_blank');
                }
              }}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Xem trên web
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={handleUnlinkPkgx}
              >
                <Unlink className="mr-2 h-4 w-4" />
                Hủy liên kết
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
    
    if (isAdmin || can('edit_products')) {
      actions.push(
        <Button key="edit" size="sm" onClick={handleSwitchToEdit}>
          <Pencil className="mr-2 h-4 w-4" />
          Chỉnh sửa
        </Button>
      );
    }
    
    return actions;
  }, [isEditMode, systemId, router, form, handleSubmit, handleSwitchToEdit, brand, hasPkgxMapping, handleSyncAll, handleSyncSeo, handleSyncDescription, handleSyncBasicInfo, handleUnlinkPkgx, pkgxBrandMappings, isAdmin, can, update.isPending]);

  // Mobile: gom tất cả view-mode actions vào 1 dropdown (edit mode 2 nút OK)
  const mobileHeaderActions = React.useMemo(() => {
    if (!isMobile || isEditMode) return null;
    const brandWithBrandedIds = brand as unknown as _Brand;
    const hasPkgx = brand && hasPkgxMapping(brandWithBrandedIds);

    return [
      <DropdownMenu key="mobile-actions">
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {(isAdmin || can('edit_products')) && (
            <DropdownMenuItem onClick={handleSwitchToEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </DropdownMenuItem>
          )}
          {hasPkgx && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleConfirm('Đồng bộ tất cả', `Đồng bộ TẤT CẢ "${brand?.name}" lên PKGX?`, () => handleSyncAll(brandWithBrandedIds))}>
                <Layers className="mr-2 h-4 w-4" />
                Đồng bộ tất cả PKGX
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleConfirm('Sync thông tin cơ bản', `Đồng bộ thông tin cơ bản "${brand?.name}" lên PKGX?`, () => handleSyncBasicInfo(brandWithBrandedIds))}>
                <Info className="mr-2 h-4 w-4" />
                Thông tin cơ bản
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleConfirm('Sync SEO', `Đồng bộ SEO "${brand?.name}" lên PKGX?`, () => handleSyncSeo(brandWithBrandedIds))}>
                <Globe className="mr-2 h-4 w-4" />
                SEO
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleConfirm('Sync mô tả', `Đồng bộ mô tả "${brand?.name}" lên PKGX?`, () => handleSyncDescription(brandWithBrandedIds))}>
                <FileText className="mr-2 h-4 w-4" />
                Mô tả
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleUnlinkPkgx}>
                <Unlink className="mr-2 h-4 w-4" />
                Hủy liên kết PKGX
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setIsDeleteAlertOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    ];
  }, [isMobile, isEditMode, headerActions, brand, hasPkgxMapping, handleSwitchToEdit, handleSyncAll, handleSyncBasicInfo, handleSyncSeo, handleSyncDescription, handleUnlinkPkgx, handleConfirm, isAdmin, can]);

  usePageHeader({
    title: brand?.name,
    actions: isMobile ? mobileHeaderActions : headerActions,
    showBackButton: true,
  });

  // Show loading while fetching brands
  if (isBrandsLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <p className="text-muted-foreground">Không tìm thấy thương hiệu</p>
          <Button variant="link" onClick={() => router.push('/brands')}>
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
          <MobileTabsList>
            <MobileTabsTrigger value="general">Thông tin</MobileTabsTrigger>
            <MobileTabsTrigger value="seo-default" className="gap-1">
              <Globe className="h-3 w-3" />
              SEO Chung
            </MobileTabsTrigger>
            <MobileTabsTrigger value="seo-pkgx" className="gap-1">
              <Globe className="h-3 w-3 text-destructive" />
              SEO PKGX
            </MobileTabsTrigger>
            <MobileTabsTrigger value="seo-trendtech" className="gap-1">
              <Globe className="h-3 w-3 text-info" />
              SEO Trendtech
            </MobileTabsTrigger>
          </MobileTabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-4 mt-4">
            {/* PKGX Mapping Info Card */}
            {brandMapping && (
              <Card className={cn('border-info/30 bg-info/5', mobileBleedCardClass)}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-info" />
                    Thông tin mapping PKGX
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">PKGX Brand ID:</span>
                      <span className="ml-2 font-mono font-semibold">{brandMapping.pkgxBrandId}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Brand Header Card */}
            <Card className={mobileBleedCardClass}>
              <CardHeader className="pb-3">
                <CardTitle>Thông tin cơ bản</CardTitle>
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
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Mã thương hiệu</p>
                        <p className="font-medium">{brand.id}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Trạng thái</p>
                        {brand.isActive !== false ? (
                          <Badge variant="default" className="bg-success/15 text-success-foreground hover:bg-success/15">
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
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description Card */}
            {brand.description && (
              <Card className={mobileBleedCardClass}>
                <CardHeader className="pb-3">
                  <CardTitle>Mô tả</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{brand.description}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* SEO Default Tab */}
          <TabsContent value="seo-default" className="space-y-4 mt-4">
            <Card className={mobileBleedCardClass}>
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
                    <div className="prose prose-sm max-w-none text-sm border rounded-md p-3 bg-muted/30" dangerouslySetInnerHTML={{ __html: sanitizeHtml(brand.shortDescription) }} />
                  ) : <p className="text-sm text-muted-foreground">-</p>}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Mô tả chi tiết</p>
                  {brand.longDescription ? (
                    <div className="prose prose-sm max-w-none text-sm border rounded-md p-3 bg-muted/30" dangerouslySetInnerHTML={{ __html: sanitizeHtml(brand.longDescription) }} />
                  ) : <p className="text-sm text-muted-foreground">-</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO PKGX Tab */}
          <TabsContent value="seo-pkgx" className="space-y-4 mt-4">
            <Card className={mobileBleedCardClass}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-red-500" />
                    <CardTitle>SEO PKGX</CardTitle>
                  </div>
                </div>
                <CardDescription>
                  phukiengiaxuong.com.vn - Override SEO chung
                  {brand && !hasPkgxMapping(brand as unknown as _Brand) && (
                    <span className="text-orange-600 ml-2">(Chưa mapping với PKGX - vào Cài đặt &gt; PKGX để mapping)</span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Tiêu đề SEO</p>
                  <p className="text-sm font-medium">{(brand.websiteSeo as MultiWebsiteSeo | undefined)?.pkgx?.seoTitle || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Meta Description</p>
                  <p className="text-sm">{(brand.websiteSeo as MultiWebsiteSeo | undefined)?.pkgx?.metaDescription || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Từ khóa SEO</p>
                  <p className="text-sm">{(brand.websiteSeo as MultiWebsiteSeo | undefined)?.pkgx?.seoKeywords || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">URL Slug</p>
                  <p className="text-sm font-mono">{(brand.websiteSeo as MultiWebsiteSeo | undefined)?.pkgx?.slug || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Mô tả ngắn</p>
                  {(brand.websiteSeo as MultiWebsiteSeo | undefined)?.pkgx?.shortDescription ? (
                    <div className="prose prose-sm max-w-none text-sm border rounded-md p-3 bg-muted/30" dangerouslySetInnerHTML={{ __html: sanitizeHtml((brand.websiteSeo as MultiWebsiteSeo).pkgx?.shortDescription || '') }} />
                  ) : <p className="text-sm text-muted-foreground">-</p>}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Mô tả chi tiết</p>
                  {(brand.websiteSeo as MultiWebsiteSeo | undefined)?.pkgx?.longDescription ? (
                    <div className="prose prose-sm max-w-none text-sm border rounded-md p-3 bg-muted/30" dangerouslySetInnerHTML={{ __html: sanitizeHtml((brand.websiteSeo as MultiWebsiteSeo).pkgx?.longDescription || '') }} />
                  ) : <p className="text-sm text-muted-foreground">-</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Trendtech Tab */}
          <TabsContent value="seo-trendtech" className="space-y-4 mt-4">
            <Card className={mobileBleedCardClass}>
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
                  <p className="text-sm font-medium">{(brand.websiteSeo as MultiWebsiteSeo | undefined)?.trendtech?.seoTitle || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Meta Description</p>
                  <p className="text-sm">{(brand.websiteSeo as MultiWebsiteSeo | undefined)?.trendtech?.metaDescription || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Từ khóa SEO</p>
                  <p className="text-sm">{(brand.websiteSeo as MultiWebsiteSeo | undefined)?.trendtech?.seoKeywords || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">URL Slug</p>
                  <p className="text-sm font-mono">{(brand.websiteSeo as MultiWebsiteSeo | undefined)?.trendtech?.slug || '-'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Mô tả ngắn</p>
                  {(brand.websiteSeo as MultiWebsiteSeo | undefined)?.trendtech?.shortDescription ? (
                    <div className="prose prose-sm max-w-none text-sm border rounded-md p-3 bg-muted/30" dangerouslySetInnerHTML={{ __html: sanitizeHtml((brand.websiteSeo as MultiWebsiteSeo).trendtech?.shortDescription || '') }} />
                  ) : <p className="text-sm text-muted-foreground">-</p>}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Mô tả chi tiết</p>
                  {(brand.websiteSeo as MultiWebsiteSeo | undefined)?.trendtech?.longDescription ? (
                    <div className="prose prose-sm max-w-none text-sm border rounded-md p-3 bg-muted/30" dangerouslySetInnerHTML={{ __html: sanitizeHtml((brand.websiteSeo as MultiWebsiteSeo).trendtech?.longDescription || '') }} />
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
            <MobileTabsList>
              <MobileTabsTrigger value="general">Thông tin</MobileTabsTrigger>
              <MobileTabsTrigger value="seo-default" className="gap-1">
                <Globe className="h-3 w-3" />
                SEO Chung
              </MobileTabsTrigger>
              <MobileTabsTrigger value="seo-pkgx" className="gap-1">
                <Globe className="h-3 w-3 text-red-500" />
                SEO PKGX
              </MobileTabsTrigger>
              <MobileTabsTrigger value="seo-trendtech" className="gap-1">
                <Globe className="h-3 w-3 text-blue-500" />
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
                            />
                          </FormControl>
                          <FormDescription>
                            Mã định danh thương hiệu (có thể sửa đổi)
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
                  {/* Existing logo - show only in edit mode with permanent files */}
                  {isEditMode && logoPermanentFiles.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-medium text-success-foreground bg-success/10 px-2 py-1 rounded">
                        <span>✓</span>
                        <span>Logo hiện tại</span>
                      </div>
                      <ExistingDocumentsViewer
                        files={logoPermanentFiles}
                        onMarkForDeletion={handleMarkLogoForDeletion}
                        markedForDeletion={logoFilesToDelete}
                      />
                    </div>
                  )}
                  
                  {/* New logo upload */}
                  <div className="space-y-2">
                    {isEditMode && logoPermanentFiles.length > 0 && (
                      <div className="flex items-center gap-2 text-xs font-medium text-warning-foreground bg-warning/10 px-2 py-1 rounded">
                        <span>📤</span>
                        <span>Upload logo mới để thay thế</span>
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
                      className="min-h-30"
                    />
                  </div>
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
              <Card className={mobileBleedCardClass}>
                <CardHeader className="pb-3">
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

              <Card className={mobileBleedCardClass}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Phân tích SEO</CardTitle>
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
                    <Globe className="h-4 w-4 text-blue-500" />
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

              <Card className={mobileBleedCardClass}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Phân tích SEO</CardTitle>
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
      
      <PkgxSyncConfirmDialog 
        confirmAction={confirmAction}
        isSyncing={false}
        onConfirm={executeAction}
        onCancel={cancelConfirm}
      />
    </div>
  );
}
