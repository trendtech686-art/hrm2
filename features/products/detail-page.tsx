'use client'

import * as React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useProductStore } from './store';
import { asSystemId, type SystemId } from '@/lib/id-types';
import { formatDateForDisplay, formatDateTimeForDisplay } from '@/lib/date-utils';
import { usePageHeader } from '../../contexts/page-header-context';
import { useAuth } from '../../contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Edit, Printer, AlertTriangle, Eye, Trash2, Package, ArrowLeft, Globe, Video } from 'lucide-react';
import { usePrint } from '@/lib/use-print';
// ✅ Print mapper - lazy loaded when print is triggered
import { useStoreInfoData } from '../settings/store-info/hooks/use-store-info';
import { DetailField } from '../../components/ui/detail-field';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { LazyImage } from '../../components/ui/lazy-image';
import { useComments } from '@/hooks/use-comments';
import type { HistoryEntry } from '../../components/ActivityHistory';
// ✅ Heavy components - lazy loaded
const Comments = dynamic(
  () => import('../../components/Comments').then(m => ({ default: m.Comments })),
  { ssr: false }
);
const ActivityHistory = dynamic(
  () => import('../../components/ActivityHistory').then(m => ({ default: m.ActivityHistory })),
  { ssr: false }
);
import { useAllPricingPolicies } from '../settings/pricing/hooks/use-all-pricing-policies';
import { useSupplierFinder } from '../suppliers/hooks/use-all-suppliers';
import { useStockHistoryStore } from '../stock-history/store';
import { getStockHistoryColumns } from '../stock-history/columns';
import { purchasePriceHistoryColumns, type PriceHistoryEntry } from './purchase-price-history-columns';
import { RelatedDataTable } from '../../components/data-table/related-data-table';
import { useAllBranches } from '../settings/branches/hooks/use-all-branches';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useAllPurchaseOrders } from '../purchase-orders/hooks/use-all-purchase-orders';
import { useAllInventoryReceipts } from '../inventory-receipts/hooks/use-all-inventory-receipts';
import { useAllOrders } from '../orders/hooks/use-all-orders';
import { useEmployeeFinder } from '../employees/hooks/use-all-employees';
import { useAllWarranties } from '../warranty/hooks/use-all-warranties';
import { useAllInventoryChecks } from '../inventory-checks/hooks/use-all-inventory-checks';
import { useAllStockTransfers } from '../stock-transfers/hooks/use-all-stock-transfers';
import { useImageStore } from './image-store';
import { FileUploadAPI } from '@/lib/file-upload-api';
import { ImagePreviewDialog } from '../../components/ui/image-preview-dialog';
import { calculateComboStock, isComboProduct } from './combo-utils';
import { StockAlertBadges } from './components/stock-alert-badges';
import { ComboItemsCard, ComboLowStockWarning, ComboInventoryCard } from './components/combo-detail-cards';
import { getProductStockAlerts, getTotalOnHandStock, getSuggestedOrderQuantity } from './stock-alert-utils';

// Dynamic imports for dialogs (code-splitting)
const CommittedStockDialog = dynamic(() => import('./components/committed-stock-dialog').then(mod => ({ default: mod.CommittedStockDialog })), { ssr: false });
const InTransitStockDialog = dynamic(() => import('./components/in-transit-stock-dialog').then(mod => ({ default: mod.InTransitStockDialog })), { ssr: false });
import { useProductTypeFinder } from '../settings/inventory/hooks/use-all-product-types';
import { useCategoryFinder } from '../categories/hooks/use-all-categories';
import { useStorageLocationFinder } from '../settings/inventory/hooks/use-storage-locations';
import { useBrandFinder } from '../brands/hooks/use-all-brands';
const EcommerceTab = dynamic(
  () => import('./components/ecommerce-tab').then(m => ({ default: m.EcommerceTab })),
  { ssr: false, loading: () => <div className="p-4 text-center text-muted-foreground">Đang tải...</div> }
);
import { sanitizeHtml } from '@/lib/sanitize';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../components/ui/alert-dialog';


const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '-';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const getStatusBadgeVariant = (status?: string) => {
  switch (status) {
    case 'active': return 'success';
    case 'discontinued': return 'destructive';
    default: return 'secondary';
  }
};

const getStatusLabel = (status?: string) => {
  switch (status) {
    case 'active': return 'Đang hoạt động';
    case 'inactive': return 'Tạm ngừng';
    case 'discontinued': return 'Ngừng kinh doanh';
    default: return 'Không xác định';
  }
};

const getTypeLabel = (type?: string) => {
  switch (type) {
    case 'physical': return 'Hàng hóa';
    case 'service': return 'Dịch vụ';
    case 'digital': return 'Sản phẩm số';
    case 'combo': return 'Combo';
    default: return 'Không xác định';
  }
};

export function ProductDetailPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const router = useRouter();
  const { findById: findProductById, data: allProducts, remove } = useProductStore();
  const { findById: findSupplierById } = useSupplierFinder();
  const { data: pricingPolicies } = useAllPricingPolicies();
  const { getHistoryForProduct } = useStockHistoryStore();
  const { data: branches } = useAllBranches();
  const { data: allPurchaseOrders } = useAllPurchaseOrders();
  const { data: allInventoryReceipts } = useAllInventoryReceipts();
  const { data: allOrders } = useAllOrders();
  const { findById: findEmployeeById } = useEmployeeFinder();
  const { data: allWarranties } = useAllWarranties();
  const { data: allInventoryChecks } = useAllInventoryChecks();
  const { data: allStockTransfers } = useAllStockTransfers();
  const { findById: findProductTypeById } = useProductTypeFinder();
  const { findById: findCategoryById } = useCategoryFinder();
  const { findBySystemId: findStorageLocationBySystemId } = useStorageLocationFinder();
  const { findById: findBrandById } = useBrandFinder();
  const { employee: authEmployee } = useAuth();
  
  const [historyBranchFilter, setHistoryBranchFilter] = React.useState<'all' | SystemId>('all');
  const [priceHistoryBranchFilter, setPriceHistoryBranchFilter] = React.useState<'all' | SystemId>('all');
  const [committedDialogOpen, setCommittedDialogOpen] = React.useState(false);
  const [selectedBranch, setSelectedBranch] = React.useState<{ systemId: SystemId; name: string } | null>(null);
  const [inTransitDialogOpen, setInTransitDialogOpen] = React.useState(false);
  const [inTransitBranch, setInTransitBranch] = React.useState<{ systemId: SystemId; name: string } | null>(null);

  // Include allProducts in deps to trigger re-render when store updates (e.g. after PKGX link)
  // eslint-disable-next-line react-hooks/exhaustive-deps -- allProducts triggers re-render when store updates
  const product = React.useMemo(() => (systemId ? findProductById(asSystemId(systemId)) : null), [systemId, findProductById, allProducts]);
  const productSystemId = product?.systemId ?? null;
  const supplier = React.useMemo(() => (product?.primarySupplierSystemId ? findSupplierById(product.primarySupplierSystemId) : null), [product, findSupplierById]);
  const createdByEmployee = React.useMemo(() => (product?.createdBy ? findEmployeeById(product.createdBy) : null), [product, findEmployeeById]);
  const updatedByEmployee = React.useMemo(() => (product?.updatedBy ? findEmployeeById(product.updatedBy) : null), [product, findEmployeeById]);
  const productType = React.useMemo(() => (product?.productTypeSystemId ? findProductTypeById(product.productTypeSystemId) : null), [product, findProductTypeById]);
  const category = React.useMemo(() => (product?.categorySystemId ? findCategoryById(product.categorySystemId) : null), [product, findCategoryById]);
  const brand = React.useMemo(() => (product?.brandSystemId ? findBrandById(product.brandSystemId) : null), [product, findBrandById]);
  const storageLocation = React.useMemo(() => (product?.storageLocationSystemId ? findStorageLocationBySystemId(product.storageLocationSystemId) : null), [product, findStorageLocationBySystemId]);

  // Comments from database
  const { 
    comments: dbComments, 
    addComment: dbAddComment, 
    deleteComment: dbDeleteComment 
  } = useComments('product', systemId || '');

  const comments = React.useMemo(() => 
    dbComments.map(c => ({
      id: c.systemId as unknown as SystemId,
      content: c.content,
      author: {
        systemId: (c.createdBy || 'system') as unknown as SystemId,
        name: c.createdByName || 'Hệ thống',
      },
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      attachments: c.attachments,
    })), 
    [dbComments]
  );

  const handleAddComment = React.useCallback((content: string, attachments?: string[], _parentId?: string) => {
    dbAddComment(content, attachments || []);
  }, [dbAddComment]);

  const handleUpdateComment = React.useCallback((_commentId: string, _content: string) => {
  }, []);

  const handleDeleteComment = React.useCallback((commentId: string) => {
    dbDeleteComment(commentId);
  }, [dbDeleteComment]);

  const commentCurrentUser = React.useMemo(() => ({
    systemId: authEmployee?.systemId ? asSystemId(authEmployee.systemId) : asSystemId('system'),
    name: authEmployee?.fullName || 'Hệ thống',
  }), [authEmployee]);

  // Build activity history from product data
  const activityHistory = React.useMemo((): HistoryEntry[] => {
    if (!product) return [];
    const entries: HistoryEntry[] = [];
    
    // Created entry
    if (product.createdAt) {
      entries.push({
        id: `${product.systemId}-created`,
        action: 'created',
        timestamp: new Date(product.createdAt),
        user: {
          systemId: product.createdBy || '',
          name: createdByEmployee?.fullName || 'Hệ thống',
        },
        description: `Tạo sản phẩm ${product.name}`,
      });
    }
    
    // Updated entry
    if (product.updatedAt && product.updatedAt !== product.createdAt) {
      entries.push({
        id: `${product.systemId}-updated`,
        action: 'updated',
        timestamp: new Date(product.updatedAt),
        user: {
          systemId: product.updatedBy || '',
          name: updatedByEmployee?.fullName || 'Hệ thống',
        },
        description: 'Cập nhật thông tin sản phẩm',
      });
    }
    
    return entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [product, createdByEmployee, updatedByEmployee]);

  // ✅ FIX: Use product.systemId (internal key) instead of product.id (SKU) for querying
  // For combo products: show combo's own history (not child products)
  const productHistory = React.useMemo(() => {
    if (!product) return [];
    
    // Get history for THIS product (whether combo or regular)
    // Combo has its own stock history entries (Khởi tạo sản phẩm, Xuất kho for combo sales, etc.)
    return getHistoryForProduct(product.systemId, historyBranchFilter);
  }, [product, getHistoryForProduct, historyBranchFilter]);
  
  const purchasePriceHistory = React.useMemo<PriceHistoryEntry[]>(() => {
    if (!productSystemId) return [];
    
    const history: PriceHistoryEntry[] = [];

    // Add history from Inventory Receipts
    allInventoryReceipts.forEach(receipt => {
      // Filter by branch
      if (priceHistoryBranchFilter !== 'all' && receipt.branchSystemId !== priceHistoryBranchFilter) {
        return;
      }

      const item = receipt.items.find(i => i.productSystemId === productSystemId);
      if (item) {
        const entry: PriceHistoryEntry = {
          systemId: `receipt-${receipt.id}`,
          id: `receipt-${receipt.id}`,
          date: receipt.receivedDate,
          price: item.unitPrice,
          supplierName: receipt.supplierName,
          reference: receipt.id,
          type: 'receipt',
          note: `Nhập ${item.receivedQuantity} ${product?.unit || ''}`,
        };
        if (receipt.branchSystemId) {
          entry.branchSystemId = receipt.branchSystemId;
        }
        if (typeof receipt.branchName === 'string') {
          entry.branchName = receipt.branchName;
        }
        history.push(entry);
      }
    });

    // If we had a log of manual price changes, we would add them here.
    // For now, we only have the current lastPurchasePrice on the product, 
    // but no history of manual changes unless we implement an audit log for it.
    // We will stick to receipt history for now as that's the primary source of truth for "updates via import".

    return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [allInventoryReceipts, productSystemId, product?.unit, priceHistoryBranchFilter]);

  const stockHistoryColumns = React.useMemo(() => 
    getStockHistoryColumns(allPurchaseOrders, allInventoryReceipts, allOrders, allWarranties, allInventoryChecks, allStockTransfers),
    [allPurchaseOrders, allInventoryReceipts, allOrders, allWarranties, allInventoryChecks, allStockTransfers]
  );

  const imageStore = useImageStore();
  const [isImageLoading, setIsImageLoading] = React.useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const [previewImages, setPreviewImages] = React.useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = React.useState(0);
  
  // Subscribe to store changes properly
  const permanentImagesState = useImageStore(state => state.permanentImages);
  const _permanentMetaState = useImageStore(state => state.permanentMeta);
  
  const permanentFiles = React.useMemo(() => ({
    thumbnail: productSystemId ? (permanentImagesState[productSystemId]?.thumbnail || []) : [],
    gallery: productSystemId ? (permanentImagesState[productSystemId]?.gallery || []) : []
  }), [productSystemId, permanentImagesState]);

  // Use ref to prevent infinite loop - imageStore reference is stable
  const imageStoreRef = React.useRef(imageStore);
  imageStoreRef.current = imageStore;
  
  const loadPermanentFiles = React.useCallback(async (productId: string, options?: { silent?: boolean }): Promise<void> => {
    const silent = options?.silent ?? false;
    if (!silent) {
      setIsImageLoading(true);
    }
    try {
      const files = await FileUploadAPI.getProductFiles(productId);
      const fetchedAt = Date.now();
      ['thumbnail' as const, 'gallery' as const].forEach(type => {
        const typeFiles = files.filter(f => f.documentName === type);
        imageStoreRef.current.updatePermanentImages(
          productId,
          type,
          typeFiles.map(f => ({
            id: f.id,
            sessionId: '',
            name: f.name,
            originalName: f.originalName,
            slug: f.slug,
            filename: f.filename,
            size: f.size,
            type: f.type,
            url: f.url,
            status: 'permanent' as const,
            uploadedAt: f.uploadedAt,
            metadata: f.metadata
          })),
          fetchedAt
        );
      });
    } catch (error) {
      console.error('Failed to load images:', error);
    } finally {
      // Always set loading to false when done
      setIsImageLoading(false);
    }
  }, []); // Empty deps - uses imageStoreRef which is always current

  // Track if we've already fetched for this product to prevent double-fetch
  const fetchedProductRef = React.useRef<string | null>(null);
  // Track if fetch completed (even if no images found)
  const [hasFetched, setHasFetched] = React.useState(false);
  
  const hasCachedImages = (permanentFiles.thumbnail.length + permanentFiles.gallery.length) > 0;

  React.useEffect(() => {
    if (!productSystemId) {
      return;
    }

    // Reset when product changes
    if (fetchedProductRef.current !== productSystemId) {
      setHasFetched(false);
    }

    // Already fetched for this product - don't fetch again
    if (fetchedProductRef.current === productSystemId && hasFetched) {
      setIsImageLoading(false);
      return;
    }

    // Need to fetch - silent if we already have cached images
    const silent = hasCachedImages;
    fetchedProductRef.current = productSystemId;
    loadPermanentFiles(productSystemId, { silent }).then(() => {
      setHasFetched(true);
    });
  }, [productSystemId, hasCachedImages, hasFetched, loadPermanentFiles]); // Add proper deps

  const managedThumbnail = permanentFiles.thumbnail[0]?.url ?? null;
  const managedGallery = React.useMemo(() => permanentFiles.gallery.map(file => file.url), [permanentFiles.gallery]);

  const thumbnailImage = managedThumbnail;
  const galleryImages = managedGallery;
  const hasImages = Boolean(thumbnailImage) || galleryImages.length > 0;

  const previewSources = React.useMemo(() => {
    const sources: string[] = [];
    const seen = new Set<string>();
    if (thumbnailImage && !seen.has(thumbnailImage)) {
      seen.add(thumbnailImage);
      sources.push(thumbnailImage);
    }
    galleryImages.forEach((url) => {
      if (url && !seen.has(url)) {
        seen.add(url);
        sources.push(url);
      }
    });
    return sources;
  }, [thumbnailImage, galleryImages]);

  const handleOpenPreview = React.useCallback((targetUrl: string) => {
    if (!targetUrl) return;
    const index = previewSources.findIndex(url => url === targetUrl);
    if (index === -1) return;
    setPreviewImages(previewSources);
    setPreviewIndex(index);
    setIsPreviewOpen(true);
  }, [previewSources]);

  const { print: printLabel } = usePrint();
  const { info: storeInfo } = useStoreInfoData();
  const storeSettings = React.useMemo(() => ({
    name: storeInfo?.brandName || storeInfo?.companyName || '',
    address: storeInfo?.headquartersAddress,
    phone: storeInfo?.hotline,
    email: storeInfo?.email,
  }), [storeInfo]);

  // Default selling policy for price lookup
  const defaultSellingPolicy = React.useMemo(
    () => pricingPolicies.find(p => p.type === 'Bán hàng' && p.isDefault),
    [pricingPolicies]
  );

  const handlePrintLabel = React.useCallback(async () => {
    if (!product) return;
    // ✅ Lazy load print mapper
    const { mapProductToLabelPrintData } = await import('@/lib/print-mappers/product-label.mapper');
    // Resolve category & brand name for label
    const categoryName = product.categorySystemId
      ? findCategoryById(product.categorySystemId)?.name || product.category
      : product.category;
    const brandName = product.brandSystemId
      ? findBrandById(product.brandSystemId)?.name || ''
      : '';
    const defaultPrice = defaultSellingPolicy
      ? product.prices?.[defaultSellingPolicy.systemId]
      : undefined;
    const printData = mapProductToLabelPrintData(product, storeSettings, {
      category: categoryName,
      brand: brandName,
      price: defaultPrice ?? product.sellingPrice,
    });
    printLabel('product-label', { data: printData });
  }, [product, printLabel, storeSettings, defaultSellingPolicy, findBrandById, findCategoryById]);

  const handleMoveToTrash = React.useCallback(() => {
    if (!product) return;
    remove(product.systemId);
    toast.success('Đã chuyển sản phẩm vào thùng rác', {
      description: `${product.name} (${product.id})`,
      action: {
        label: 'Xem thùng rác',
        onClick: () => router.push('/products/trash'),
      },
    });
    router.push('/products');
  }, [product, remove, router]);

  const headerActions = React.useMemo(() => {
    if (!product) return [];
    return [
      <Button
        key="edit"
        variant="default"
        size="sm"
        className="h-9"
        onClick={() => router.push(`/products/${product.systemId}/edit`)}
      >
        <Edit className="mr-2 h-4 w-4" />
        Chỉnh sửa
      </Button>,
      <Button
        key="print"
        variant="outline"
        size="sm"
        className="h-9"
        onClick={handlePrintLabel}
      >
        <Printer className="mr-2 h-4 w-4" />
        In tem phụ
      </Button>,
      <AlertDialog key="trash">
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-9 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Chuyển vào thùng rác
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận chuyển vào thùng rác</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn chuyển sản phẩm "{product.name}" ({product.id}) vào thùng rác?
              <br />
              <span className="text-muted-foreground">Sản phẩm có thể được khôi phục từ thùng rác.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleMoveToTrash}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Chuyển vào thùng rác
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ];
  }, [product, router, handlePrintLabel, handleMoveToTrash]);

  // Calculate combo stock for low stock warning in header
  const comboTotalStock = React.useMemo(() => {
    if (!product || !isComboProduct(product)) return 0;
    let total = 0;
    branches.forEach(branch => {
      total += calculateComboStock(product.comboItems || [], allProducts, branch.systemId);
    });
    return total;
  }, [product, allProducts, branches]);

  // Determine stock alerts for header
  const stockAlerts = React.useMemo(() => {
    if (!product) return { isLow: false, isCritical: false, message: '' };
    
    const reorderLevel = product.reorderLevel ?? 0;
    const safetyStock = product.safetyStock ?? 0;
    
    // For combo products, use calculated combo stock
    const currentStock = isComboProduct(product) 
      ? comboTotalStock 
      : getTotalOnHandStock(product);
    
    const isCritical = safetyStock > 0 && currentStock <= safetyStock;
    const isLow = reorderLevel > 0 && currentStock <= reorderLevel;
    
    let message = '';
    if (isCritical) {
      message = `Tồn kho: ${currentStock} (dưới mức an toàn ${safetyStock})`;
    } else if (isLow) {
      message = `Tồn kho: ${currentStock} (cần đặt hàng, mức đặt lại ${reorderLevel})`;
    }
    
    return { isLow, isCritical, message };
  }, [product, comboTotalStock]);

  // Header badges including status and stock alerts
  const headerBadges = React.useMemo(() => {
    if (!product) return undefined;
    
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant={getStatusBadgeVariant(product.status) as 'default' | 'secondary' | 'destructive' | 'outline' | 'warning' | 'success'}>
          {getStatusLabel(product.status)}
        </Badge>
        {stockAlerts.isCritical && (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            Dưới mức an toàn
          </Badge>
        )}
        {!stockAlerts.isCritical && stockAlerts.isLow && (
          <Badge variant="outline" className="gap-1 border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/30">
            <AlertTriangle className="h-3 w-3" />
            Cần đặt hàng
          </Badge>
        )}
      </div>
    );
  }, [product, stockAlerts]);

  usePageHeader({
    title: product?.name || 'Chi tiết sản phẩm',
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Sản phẩm', href: '/products', isCurrent: false },
      { label: product?.name ?? 'Chi tiết', href: product ? `/products/${product.systemId}` : '/products', isCurrent: true }
    ],
    badge: headerBadges,
    showBackButton: true,
    backPath: '/products',
    actions: headerActions,
  });

  if (!product) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-h2">Không tìm thấy sản phẩm</h2>
          <p className="text-muted-foreground mt-2">Sản phẩm bạn đang tìm kiếm không tồn tại.</p>
          <Button onClick={() => router.push('/products')} className="mt-4 h-9">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay về danh sách
          </Button>
        </div>
      </div>
    );
  }
  
  const salesPolicies = pricingPolicies.filter(p => p.type === 'Bán hàng');
  const totalInventory = Object.values(product.inventoryByBranch || {}).reduce<number>((sum, qty) => sum + Number(qty || 0), 0);

  return (
    <div className="space-y-4 md:space-y-6">
        {/* Header Summary Card with Image and Basic Info */}
        <Card>
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Product Image */}
              <div className="flex-shrink-0 lg:w-48">
                {thumbnailImage ? (
                  <div
                    className="relative aspect-square rounded-lg overflow-hidden border bg-muted cursor-pointer"
                    onClick={() => handleOpenPreview(thumbnailImage)}
                  >
                    <LazyImage
                      src={thumbnailImage}
                      alt={`${product.name} - Ảnh thumbnail`}
                      className="w-full h-full object-cover"
                      rootMargin="400px"
                      skeletonClassName="rounded-none"
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                      <Eye className="h-6 w-6 text-white opacity-0 hover:opacity-100 drop-shadow-lg" />
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square rounded-lg border border-dashed bg-muted/40 flex items-center justify-center">
                    <Package className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                )}
              </div>

              {/* Quick Info */}
              <div className="flex-1 min-w-0 space-y-3">
                <div>
                  <p className="text-body-sm text-muted-foreground">Mã SKU: <span className="font-medium text-foreground">{product.id}</span></p>
                  <h2 className="text-h2 font-semibold">{product.name}</h2>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant={getStatusBadgeVariant(product.status) as 'default' | 'secondary' | 'destructive' | 'outline' | 'warning' | 'success'}>
                    {getStatusLabel(product.status)}
                  </Badge>
                  <Badge variant="outline">{getTypeLabel(product.type)}</Badge>
                  {productType && <Badge variant="secondary">{productType.name}</Badge>}
                  {category && <Badge variant="secondary">{category.name}</Badge>}
                  {brand && <Badge variant="secondary">{brand.name}</Badge>}
                </div>

                {/* E-commerce Status Badges */}
                <div className="flex flex-wrap gap-2">
                  {product.isPublished ? (
                    <Badge variant="success" className="gap-1">
                      <Globe className="h-3 w-3" />
                      Đã đăng web
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1">
                      <Globe className="h-3 w-3" />
                      Chưa đăng
                    </Badge>
                  )}
                  {product.isFeatured && (
                    <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">Nổi bật</Badge>
                  )}
                  {product.isNewArrival && (
                    <Badge variant="outline" className="border-green-500 text-green-600">Mới về</Badge>
                  )}
                  {product.isBestSeller && (
                    <Badge variant="destructive">Bán chạy</Badge>
                  )}
                  {product.isOnSale && (
                    <Badge variant="default" className="bg-rose-500 hover:bg-rose-600">Đang giảm giá</Badge>
                  )}
                </div>

                {/* Stock Alerts */}
                {stockAlerts.isCritical && (
                  <div className="flex items-center gap-2 text-body-sm text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{stockAlerts.message}</span>
                  </div>
                )}
                {!stockAlerts.isCritical && stockAlerts.isLow && (
                  <div className="flex items-center gap-2 text-body-sm text-amber-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{stockAlerts.message}</span>
                  </div>
                )}

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t">
                  <div>
                    <p className="text-body-xs text-muted-foreground">Giá vốn</p>
                    <p className="font-semibold">{formatCurrency(product.costPrice)}</p>
                  </div>
                  <div>
                    <p className="text-body-xs text-muted-foreground">Giá bán (Mặc định)</p>
                    <p className="font-semibold text-primary">
                      {defaultSellingPolicy && product.prices?.[defaultSellingPolicy.systemId] 
                        ? formatCurrency(product.prices[defaultSellingPolicy.systemId]) 
                        : formatCurrency(product.sellingPrice || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-body-xs text-muted-foreground">Tồn kho</p>
                    <p className="font-semibold">
                      {product.type === 'combo' ? comboTotalStock : totalInventory} {product.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-body-xs text-muted-foreground">Đã bán</p>
                    <p className="font-semibold">{product.totalSold ?? 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs defaultValue="info" className="w-full">
            <TabsList className="flex-wrap h-auto gap-1">
                <TabsTrigger value="info">Thông tin</TabsTrigger>
                <TabsTrigger value="images">Hình ảnh</TabsTrigger>
                <TabsTrigger value="pricing">Giá & Kho</TabsTrigger>
                <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
                <TabsTrigger value="seo-default">SEO Chung</TabsTrigger>
                <TabsTrigger value="seo-pkgx">SEO PKGX</TabsTrigger>
                <TabsTrigger value="seo-trendtech">SEO Trendtech</TabsTrigger>
                <TabsTrigger value="logistics">Vận chuyển</TabsTrigger>
                {isComboProduct(product) && <TabsTrigger value="combo">Combo</TabsTrigger>}
                <TabsTrigger value="history">Lịch sử</TabsTrigger>
            </TabsList>

            {/* Tab: Thông tin cơ bản */}
            <TabsContent value="info" className="mt-4 space-y-4">
              <Card>
                <CardHeader><CardTitle className="text-h3">Thông tin cơ bản</CardTitle></CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2">
                  <DetailField label="Mã SKU" value={product.id} />
                  <DetailField label="Tên sản phẩm" value={product.name} />
                  <DetailField label="Loại hình" value={getTypeLabel(product.type)} />
                  {productType && <DetailField label="Loại sản phẩm" value={productType.name} />}
                  {(category || product.category) && <DetailField label="Danh mục" value={category ? (category.path || category.name) : product.category} />}
                  {product.subCategory && <DetailField label="Danh mục con" value={product.subCategory} />}
                  <DetailField label="Thương hiệu" value={brand?.name || '-'} />
                  <DetailField label="Đơn vị tính" value={product.unit} />
                  <DetailField label="Mã vạch" value={product.barcode || '-'} />
                  {product.pkgxId && <DetailField label="ID PKGX" value={product.pkgxId} />}
                  {typeof product.warrantyPeriodMonths === 'number' && product.warrantyPeriodMonths > 0 && (
                    <DetailField label="Bảo hành" value={`${product.warrantyPeriodMonths} tháng`} />
                  )}
                  <DetailField label="Tags" value={product.tags?.length ? (
                    <div className="flex flex-wrap gap-1">{product.tags.map(tag => <Badge key={tag} variant="outline" className="text-body-xs">{tag}</Badge>)}</div>
                  ) : '-'} />
                  {product.sellerNote && (
                    <div className="md:col-span-2">
                      <DetailField label="Ghi chú nội bộ" value={product.sellerNote} />
                    </div>
                  )}
                </CardContent>
              </Card>
              {/* Tem phụ */}
              {(product.nameVat || product.origin || product.usageGuide || product.importerName) && (
                <Card>
                  <CardHeader><CardTitle className="text-h3">Thông tin Tem phụ</CardTitle></CardHeader>
                  <CardContent className="grid gap-3 md:grid-cols-2">
                    {product.nameVat && <DetailField label="Tên VAT" value={product.nameVat} />}
                    {product.origin && <DetailField label="Xuất xứ" value={product.origin} />}
                    {product.usageGuide && <DetailField label="Hướng dẫn sử dụng" value={product.usageGuide} />}
                    {product.importerName && <DetailField label="Đơn vị nhập khẩu" value={product.importerName} />}
                    {product.importerAddress && <DetailField label="Địa chỉ nhập khẩu" value={product.importerAddress} />}
                  </CardContent>
                </Card>
              )}
              {/* Hệ thống */}
              <Card>
                <CardHeader><CardTitle className="text-h3">Thông tin hệ thống</CardTitle></CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2">
                  {product.launchedDate && <DetailField label="Ngày ra mắt" value={formatDateForDisplay(product.launchedDate)} />}
                  {product.discontinuedDate && <DetailField label="Ngày ngừng KD" value={formatDateForDisplay(product.discontinuedDate)} />}
                  {product.createdAt && <DetailField label="Ngày tạo" value={formatDateTimeForDisplay(product.createdAt)} />}
                  {createdByEmployee && <DetailField label="Người tạo" value={<Link href={`/employees/${createdByEmployee.systemId}`} className="text-primary hover:underline">{createdByEmployee.fullName}</Link>} />}
                  {product.updatedAt && <DetailField label="Cập nhật" value={formatDateTimeForDisplay(product.updatedAt)} />}
                  {updatedByEmployee && <DetailField label="Người cập nhật" value={<Link href={`/employees/${updatedByEmployee.systemId}`} className="text-primary hover:underline">{updatedByEmployee.fullName}</Link>} />}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Hình ảnh */}
            <TabsContent value="images" className="mt-4">
              <Card>
                <CardHeader><CardTitle className="text-h3">Hình ảnh sản phẩm</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {hasImages ? (
                    <div className="grid gap-4 lg:grid-cols-10">
                      <div className="space-y-3 lg:col-span-3">
                        <p className="text-body-sm font-medium text-muted-foreground">Ảnh thumbnail</p>
                        {thumbnailImage ? (
                          <div className="relative aspect-square rounded-lg overflow-hidden border bg-muted cursor-pointer" onClick={() => handleOpenPreview(thumbnailImage)}>
                            <LazyImage src={thumbnailImage} alt={`${product.name} - Thumbnail`} className="w-full h-full object-cover" rootMargin="400px" />
                          </div>
                        ) : <div className="rounded-lg border border-dashed bg-muted/40 text-center text-body-xs text-muted-foreground py-10">Chưa có ảnh</div>}
                      </div>
                      <div className="space-y-3 lg:col-span-7">
                        <p className="text-body-sm font-medium text-muted-foreground">Thư viện ({galleryImages.length})</p>
                        {galleryImages.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                            {galleryImages.map((url, i) => (
                              <div key={`${url}-${i}`} className="aspect-square rounded-lg overflow-hidden border bg-muted cursor-pointer" onClick={() => handleOpenPreview(url)}>
                                <LazyImage src={url} alt={`${product.name} - ${i + 1}`} className="w-full h-full object-cover" rootMargin="400px" />
                              </div>
                            ))}
                          </div>
                        ) : <div className="rounded-lg border border-dashed bg-muted/40 text-center text-body-xs text-muted-foreground py-10">Chưa có ảnh</div>}
                      </div>
                    </div>
                  ) : <div className="text-center text-body-sm text-muted-foreground border border-dashed rounded-md py-8">{isImageLoading ? 'Đang tải...' : 'Chưa có hình ảnh'}</div>}
                  {product.videoLinks && product.videoLinks.length > 0 && (
                    <div className="space-y-3 pt-4 border-t">
                      <p className="text-body-sm font-medium text-muted-foreground flex items-center gap-2"><Video className="h-4 w-4" />Video ({product.videoLinks.length})</p>
                      <div className="space-y-2">{product.videoLinks.map((link, i) => <a key={`${link}-${i}`} href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-body-sm text-primary hover:underline truncate">{link}</a>)}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: SEO Chung (Default) */}
            <TabsContent value="seo-default" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-h3 flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    SEO Mặc định
                  </CardTitle>
                  <p className="text-body-sm text-muted-foreground">
                    Thông tin SEO chung - sẽ được dùng nếu không có SEO riêng cho từng website
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <DetailField label="Tiêu đề SEO (ktitle)" value={product.ktitle || '-'} />
                  <DetailField label="Meta Description" value={product.seoDescription || '-'} />
                  <DetailField label="Keywords" value={product.seoKeywords || '-'} />
                  <div>
                    <p className="text-body-sm font-medium text-muted-foreground mb-2">Mô tả ngắn</p>
                    {product.shortDescription ? (
                      <div className="prose prose-sm max-w-none text-body-sm border rounded-md p-3 bg-muted/30" dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.shortDescription) }} />
                    ) : <p className="text-body-sm text-muted-foreground">-</p>}
                  </div>
                  <div>
                    <p className="text-body-sm font-medium text-muted-foreground mb-2">Mô tả chi tiết</p>
                    {product.description ? (
                      <div className="prose prose-sm max-w-none text-body-sm border rounded-md p-3 bg-muted/30" dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }} />
                    ) : <p className="text-body-sm text-muted-foreground">-</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: SEO PKGX */}
            <TabsContent value="seo-pkgx" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-h3 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    SEO - PKGX
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <DetailField label="Slug PKGX" value={product.pkgxSlug || '-'} />
                  <DetailField label="Tiêu đề SEO" value={product.seoPkgx?.seoTitle || '-'} />
                  <DetailField label="Meta Description" value={product.seoPkgx?.metaDescription || '-'} />
                  <DetailField label="Keywords" value={product.seoPkgx?.seoKeywords || '-'} />
                  <div>
                    <p className="text-body-sm font-medium text-muted-foreground mb-2">Mô tả ngắn</p>
                    {product.seoPkgx?.shortDescription ? (
                      <div className="prose prose-sm max-w-none text-body-sm border rounded-md p-3 bg-muted/30" dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.seoPkgx.shortDescription) }} />
                    ) : <p className="text-body-sm text-muted-foreground">-</p>}
                  </div>
                  <div>
                    <p className="text-body-sm font-medium text-muted-foreground mb-2">Mô tả dài</p>
                    {product.seoPkgx?.longDescription ? (
                      <div className="prose prose-sm max-w-none text-body-sm border rounded-md p-3 bg-muted/30" dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.seoPkgx.longDescription) }} />
                    ) : <p className="text-body-sm text-muted-foreground">-</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: SEO Trendtech */}
            <TabsContent value="seo-trendtech" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-h3 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-green-600" />
                    SEO - Trendtech
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <DetailField label="Slug Trendtech" value={product.trendtechSlug || '-'} />
                  <DetailField label="Tiêu đề SEO" value={product.seoTrendtech?.seoTitle || '-'} />
                  <DetailField label="Meta Description" value={product.seoTrendtech?.metaDescription || '-'} />
                  <DetailField label="Keywords" value={product.seoTrendtech?.seoKeywords || '-'} />
                  <div>
                    <p className="text-body-sm font-medium text-muted-foreground mb-2">Mô tả ngắn</p>
                    {product.seoTrendtech?.shortDescription ? (
                      <div className="prose prose-sm max-w-none text-body-sm border rounded-md p-3 bg-muted/30" dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.seoTrendtech.shortDescription) }} />
                    ) : <p className="text-body-sm text-muted-foreground">-</p>}
                  </div>
                  <div>
                    <p className="text-body-sm font-medium text-muted-foreground mb-2">Mô tả dài</p>
                    {product.seoTrendtech?.longDescription ? (
                      <div className="prose prose-sm max-w-none text-body-sm border rounded-md p-3 bg-muted/30" dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.seoTrendtech.longDescription) }} />
                    ) : <p className="text-body-sm text-muted-foreground">-</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Giá & Kho */}
            <TabsContent value="pricing" className="mt-4 space-y-4">
              {/* Cảnh báo tồn kho */}
              {getProductStockAlerts(product).length > 0 && (
                <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
                  <CardHeader className="pb-2"><CardTitle className="text-h3 flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-600" />Cảnh báo tồn kho</CardTitle></CardHeader>
                  <CardContent>
                    <StockAlertBadges product={product} showDescription />
                    {getSuggestedOrderQuantity(product) > 0 && <p className="text-body-sm mt-2">Đề xuất đặt thêm: <span className="font-semibold text-amber-700">{getSuggestedOrderQuantity(product)} {product.unit}</span></p>}
                  </CardContent>
                </Card>
              )}
              <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                  <CardHeader><CardTitle className="text-h3">Giá</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <DetailField label="Giá vốn" value={formatCurrency(product.costPrice)} />
                    {product.type !== 'combo' && <DetailField label="Giá nhập gần nhất" value={product.lastPurchasePrice ? formatCurrency(product.lastPurchasePrice) : '-'} />}
                    {product.type !== 'combo' && supplier && <DetailField label="NCC chính" value={<Link href={`/suppliers/${supplier.systemId}`} className="text-primary hover:underline">{supplier.name}</Link>} />}
                    {product.type !== 'combo' && <DetailField label="Ngày nhập gần nhất" value={product.lastPurchaseDate ? formatDateForDisplay(product.lastPurchaseDate) : '-'} />}
                    <DetailField label="Giá tối thiểu" value={product.minPrice ? formatCurrency(product.minPrice) : '-'} />
                    {product.taxRate !== undefined && <DetailField label="Thuế suất" value={`${product.taxRate}%`} />}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle className="text-h3">Bảng giá bán</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {salesPolicies.map(p => <DetailField key={p.systemId} label={`${p.name}${p.isDefault ? ' (Mặc định)' : ''}`} value={formatCurrency(product.prices[p.systemId])} />)}
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader><CardTitle className="text-h3">Quản lý tồn kho</CardTitle></CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                  <DetailField label="Theo dõi tồn kho" value={product.isStockTracked ? 'Có' : 'Không'} />
                  <DetailField label="Tổng tồn kho" value={<span className="font-semibold">{product.type === 'combo' ? comboTotalStock : totalInventory}</span>} />
                  {product.type !== 'combo' && <DetailField label="Đang giao dịch" value={Object.values(product.committedByBranch || {}).reduce((s, q) => s + q, 0)} />}
                  {product.type !== 'combo' && <DetailField label="Đang về" value={Object.values(product.inTransitByBranch || {}).reduce((s, q) => s + q, 0)} />}
                  <DetailField label="Mức đặt hàng lại" value={product.reorderLevel ?? 0} />
                  <DetailField label="Tồn kho an toàn" value={product.safetyStock ?? 0} />
                  <DetailField label="Mức tồn tối đa" value={product.maxStock ?? 0} />
                  {storageLocation && <DetailField label="Điểm lưu kho" value={storageLocation.name} />}
                </CardContent>
              </Card>

              {/* Tồn kho theo chi nhánh */}
              {product.type === 'combo' ? (
                <ComboInventoryCard product={product} branches={branches} allProducts={allProducts}
                  onCommittedClick={(b) => { setSelectedBranch({ systemId: b.systemId, name: b.name }); setCommittedDialogOpen(true); }}
                  onInTransitClick={(b) => { setInTransitBranch({ systemId: b.systemId, name: b.name }); setInTransitDialogOpen(true); }}
                />
              ) : (
                <Card>
                  <CardHeader><CardTitle className="text-h3">Tồn kho theo chi nhánh</CardTitle></CardHeader>
                  <CardContent className="p-0 overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Chi nhánh</TableHead>
                          <TableHead>Tồn kho</TableHead>
                          <TableHead>Giá trị</TableHead>
                          <TableHead>Có thể bán</TableHead>
                          <TableHead>Đang GD</TableHead>
                          <TableHead>Đang về</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {branches.map(branch => {
                          const onHand = product.inventoryByBranch[branch.systemId] || 0;
                          const committed = product.committedByBranch[branch.systemId] || 0;
                          const inTransit = product.inTransitByBranch[branch.systemId] || 0;
                          return (
                            <TableRow key={branch.systemId}>
                              <TableCell className="font-medium">{branch.name}</TableCell>
                              <TableCell className="font-semibold">{onHand}</TableCell>
                              <TableCell>{formatCurrency(onHand * (product.costPrice || 0))}</TableCell>
                              <TableCell>{Math.max(0, onHand - committed)}</TableCell>
                              <TableCell className={committed > 0 ? 'text-primary cursor-pointer hover:underline' : ''} onClick={() => committed > 0 && (setSelectedBranch({ systemId: branch.systemId, name: branch.name }), setCommittedDialogOpen(true))}>{committed}</TableCell>
                              <TableCell className={inTransit > 0 ? 'text-primary cursor-pointer hover:underline' : ''} onClick={() => inTransit > 0 && (setInTransitBranch({ systemId: branch.systemId, name: branch.name }), setInTransitDialogOpen(true))}>{inTransit}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Tab: E-commerce */}
            <TabsContent value="ecommerce" className="mt-4">
              <EcommerceTab product={product} />
            </TabsContent>

            {/* Tab: Vận chuyển & Logistics */}
            <TabsContent value="logistics" className="mt-4">
              <Card>
                <CardHeader><CardTitle className="text-h3">Thông tin vận chuyển</CardTitle></CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2">
                  {product.weight !== undefined && <DetailField label="Khối lượng" value={`${product.weight} ${product.weightUnit || 'g'}`} />}
                  {product.dimensions && <DetailField label="Kích thước (D×R×C)" value={`${product.dimensions.length || 0}×${product.dimensions.width || 0}×${product.dimensions.height || 0} cm`} />}
                  {product.barcode && <DetailField label="Mã vạch" value={product.barcode} />}
                </CardContent>
              </Card>
              {/* Analytics */}
              <Card className="mt-4">
                <CardHeader><CardTitle className="text-h3">Phân tích bán hàng</CardTitle></CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                  <DetailField label="Tổng đã bán" value={product.totalSold ?? 0} />
                  {product.totalRevenue && <DetailField label="Tổng doanh thu" value={formatCurrency(product.totalRevenue)} />}
                  {product.viewCount && <DetailField label="Lượt xem" value={product.viewCount} />}
                  {product.lastSoldDate && <DetailField label="Bán gần nhất" value={formatDateForDisplay(product.lastSoldDate)} />}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Combo */}
            {isComboProduct(product) && (
              <TabsContent value="combo" className="mt-4">
                <ComboItemsCard product={product} pricingPolicies={pricingPolicies} onImagePreview={(url) => { setPreviewImages([url]); setPreviewIndex(0); setIsPreviewOpen(true); }} />
                <ComboLowStockWarning product={product} allProducts={allProducts} />
              </TabsContent>
            )}

            {/* Tab: Lịch sử */}
            <TabsContent value="history" className="mt-4 space-y-4">
              {/* Lịch sử kho */}
              <Card>
                <CardHeader><CardTitle className="text-h3">Lịch sử xuất nhập kho</CardTitle></CardHeader>
                <CardContent className="p-4">
                  <RelatedDataTable data={productHistory} columns={stockHistoryColumns} searchKeys={['action', 'documentId', 'employeeName']} searchPlaceholder="Tìm kiếm..." dateFilterColumn="date" dateFilterTitle="Ngày" exportFileName={`Lich_su_kho_${product.id}`}>
                    <Select value={historyBranchFilter} onValueChange={(v) => setHistoryBranchFilter(v === 'all' ? 'all' : asSystemId(v))}>
                      <SelectTrigger className="h-8 w-full sm:w-[200px]"><SelectValue placeholder="Lọc chi nhánh" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả chi nhánh</SelectItem>
                        {branches.map(b => <SelectItem key={b.systemId} value={b.systemId}>{b.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </RelatedDataTable>
                </CardContent>
              </Card>
              {/* Lịch sử giá nhập */}
              {product.type !== 'combo' && (
                <Card>
                  <CardHeader><CardTitle className="text-h3">Lịch sử giá nhập</CardTitle></CardHeader>
                  <CardContent className="p-4">
                    <RelatedDataTable data={purchasePriceHistory} columns={purchasePriceHistoryColumns} searchKeys={['supplierName', 'reference', 'note']} searchPlaceholder="Tìm kiếm..." dateFilterColumn="date" dateFilterTitle="Ngày" exportFileName={`Lich_su_gia_${product.id}`}>
                      <Select value={priceHistoryBranchFilter} onValueChange={(v) => setPriceHistoryBranchFilter(v === 'all' ? 'all' : asSystemId(v))}>
                        <SelectTrigger className="h-8 w-full sm:w-[200px]"><SelectValue placeholder="Lọc chi nhánh" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tất cả chi nhánh</SelectItem>
                          {branches.map(b => <SelectItem key={b.systemId} value={b.systemId}>{b.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </RelatedDataTable>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
        </Tabs>

        {/* Comments */}
        <Comments
            entityType="product"
            entityId={product.systemId}
            comments={comments}
            onAddComment={handleAddComment}
            onUpdateComment={handleUpdateComment}
            onDeleteComment={handleDeleteComment}
            currentUser={commentCurrentUser}
            title="Bình luận"
            placeholder="Thêm bình luận về sản phẩm..."
        />

        {/* Activity History */}
        <ActivityHistory
            history={activityHistory}
            title="Lịch sử hoạt động"
            emptyMessage="Chưa có lịch sử hoạt động"
            groupByDate
            maxHeight="600px"
        />

        {/* Committed Stock Dialog */}
        {selectedBranch && (
          <CommittedStockDialog
            open={committedDialogOpen}
            onOpenChange={setCommittedDialogOpen}
            productSystemId={product.systemId}
            branchSystemId={selectedBranch.systemId}
            branchName={selectedBranch.name}
            productName={product.name}
          />
        )}
        {inTransitBranch && (
          <InTransitStockDialog
            open={inTransitDialogOpen}
            onOpenChange={setInTransitDialogOpen}
            productSystemId={product.systemId}
            branchSystemId={inTransitBranch.systemId}
            branchName={inTransitBranch.name}
            productName={product.name}
          />
        )}
        <ImagePreviewDialog
          images={previewImages}
          initialIndex={previewIndex}
          open={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
          title={`Hình ảnh sản phẩm - ${product.name}`}
        />
    </div>
  );
}
