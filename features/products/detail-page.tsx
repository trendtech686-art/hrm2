'use client'

import * as React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useProduct, useProductMutations } from './hooks/use-products';
import { useAllProducts } from './hooks/use-all-products';
import { asSystemId, type SystemId } from '@/lib/id-types';
import { formatDateForDisplay, formatDateTimeForDisplay } from '@/lib/date-utils';
import { usePageHeader } from '../../contexts/page-header-context';
import { useBreakpoint } from '../../contexts/breakpoint-context';
import { useAuth } from '../../contexts/auth-context';
import { Skeleton } from '../../components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Edit, Printer, RefreshCw, AlertTriangle, Eye, Trash2, Package, ArrowLeft, Globe, Video, ChevronDown, DollarSign, Package2, FileText, Flag, ExternalLink, Unlink, Layers, Info, Image, Upload, MoreHorizontal } from 'lucide-react';
import { usePrint } from '@/lib/use-print';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../../components/ui/dropdown-menu';
// ✅ Print mapper - lazy loaded when print is triggered
import { useStoreInfoData } from '../settings/store-info/hooks/use-store-info';
import { DetailField } from '../../components/ui/detail-field';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent } from '../../components/ui/tabs';
import { MobileTabsList, MobileTabsTrigger, mobileBleedCardClass } from '@/components/layout/page-section';
import { cn } from '@/lib/utils';
import { LazyImage } from '../../components/ui/lazy-image';
import { useComments } from '@/hooks/use-comments';
import { EntityActivityTable } from '@/components/shared/entity-activity-table';
import { DetailPageShell } from '@/components/layout/page-section';
// ✅ Heavy components - lazy loaded
const Comments = dynamic(
  () => import('../../components/Comments').then(m => ({ default: m.Comments })),
  { ssr: false }
);

import { useAllPricingPolicies } from '../settings/pricing/hooks/use-all-pricing-policies';
import { useSupplierFinder } from '../suppliers/hooks/use-all-suppliers';
import { useProductStockHistory } from '../stock-history/hooks/use-stock-history';
import { getStockHistoryColumns } from '../stock-history/columns';
// StockHistoryEntry type now fetched from API
import { purchasePriceHistoryColumns, type PriceHistoryEntry } from './purchase-price-history-columns';
import { RelatedDataTable } from '../../components/data-table/related-data-table';
import { useAllBranches } from '../settings/branches/hooks/use-all-branches';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { MobileCard, MobileCardBody, MobileCardHeader } from '@/components/mobile/mobile-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useAllPurchaseOrders } from '../purchase-orders/hooks/use-all-purchase-orders';
import { useAllInventoryReceipts } from '../inventory-receipts/hooks/use-all-inventory-receipts';
import { useEmployeeFinder } from '../employees/hooks/use-all-employees';
import { useAllWarranties } from '../warranty/hooks/use-all-warranties';
import { useAllInventoryChecks } from '../inventory-checks/hooks/use-all-inventory-checks';
import { useAllStockTransfers } from '../stock-transfers/hooks/use-all-stock-transfers';
import { ImagePreviewDialog } from '../../components/ui/image-preview-dialog';
import { calculateComboStock, isComboProduct } from './combo-utils';
import { StockAlertBadges } from './components/stock-alert-badges';
import { ComboItemsCard, ComboLowStockWarning, ComboInventoryCard } from './components/combo-detail-cards';
import { getProductStockAlerts, getTotalOnHandStock, getSuggestedOrderQuantity } from './stock-alert-utils';

// Dynamic imports for dialogs (code-splitting)
const StockOrdersDialogWrapper = dynamic(() => import('./components/stock-orders-dialog-wrapper').then(mod => ({ default: mod.StockOrdersDialogWrapper })), { ssr: false });
import { useProductTypeFinder } from '../settings/inventory/hooks/use-all-product-types';
import { useCategoryFinder } from '../categories/hooks/use-all-categories';
import { useStorageLocationFinder } from '../settings/inventory/hooks/use-storage-locations';
import { useBrandFinder } from '../brands/hooks/use-all-brands';
import { sanitizeHtml, sanitizeToText } from '@/lib/sanitize';
import { toast } from 'sonner';
import { usePkgxLogMutations } from '@/features/settings/pkgx/hooks/use-pkgx-settings';
import { usePkgxSync } from './hooks/use-pkgx-sync';
import { useSoldByBranch } from './hooks/use-sold-by-branch';
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


const formatCurrency = (value?: number | null) => {
    if (value === null || value === undefined || (typeof value !== 'number') || isNaN(value)) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(0);
    }
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
  const s = status?.toLowerCase();
  switch (s) {
    case 'active': return 'Đang hoạt động';
    case 'inactive': return 'Tạm ngừng';
    case 'discontinued': return 'Ngừng kinh doanh';
    default: return 'Không xác định';
  }
};

const getTypeLabel = (type?: string) => {
  const t = type?.toLowerCase();
  switch (t) {
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
  
  // ✅ React Query hooks - fetch product first
  const { data: productFromQuery, isLoading } = useProduct(systemId);
  
  // ✅ OPTIMIZED: Only fetch all products when current product is a combo
  // This avoids loading 1000+ products for non-combo products
  const isCombo = productFromQuery?.type === 'combo';
  const { data: allProducts = [] } = useAllProducts({ enabled: isCombo });
  
  const { remove: removeMutation } = useProductMutations({
    onDeleteSuccess: () => {
      toast.success('Đã chuyển sản phẩm vào thùng rác', {
        action: {
          label: 'Xem thùng rác',
          onClick: () => router.push('/products/trash'),
        },
      });
      router.push('/products');
    },
    onError: (err) => toast.error(err.message || 'Xóa sản phẩm thất bại'),
  });
  
  const findProductById = React.useCallback((id: string) => 
    allProducts.find(p => p.systemId === id), 
  [allProducts]);
  
  const { findById: findSupplierById } = useSupplierFinder();
  const { data: pricingPolicies } = useAllPricingPolicies();
  // Stock history now fetched from API instead of Zustand store
  const { data: branches } = useAllBranches();
  const { data: allPurchaseOrders } = useAllPurchaseOrders();
  const { data: allInventoryReceipts } = useAllInventoryReceipts();
  const { findById: findEmployeeById } = useEmployeeFinder();
  const { data: allWarranties } = useAllWarranties();
  const { data: allInventoryChecks } = useAllInventoryChecks();
  const { data: allStockTransfers } = useAllStockTransfers();
  const { findById: findProductTypeById } = useProductTypeFinder();
  const { findById: findCategoryById } = useCategoryFinder();
  const { findBySystemId: findStorageLocationBySystemId } = useStorageLocationFinder();
  const { findById: findBrandById } = useBrandFinder();
  const { employee: authEmployee, can } = useAuth();
  const { isMobile } = useBreakpoint();
  
  // Hook to calculate sold quantity per branch from completed orders
  const { soldByBranch } = useSoldByBranch(productFromQuery?.systemId);
  
  // PKGX log mutations - use React Query to persist to database
  const { addLog } = usePkgxLogMutations();
  const addPkgxLog = React.useCallback((log: Parameters<typeof addLog.mutate>[0]) => addLog.mutate(log), [addLog]);
  
  // PKGX sync hook - same as list page for consistency
  const { 
    handlePkgxPublish,
    handlePkgxUpdatePrice,
    handlePkgxSyncInventory,
    handlePkgxUpdateSeo,
    handlePkgxSyncDescription,
    handlePkgxSyncFlags,
    handlePkgxSyncBasicInfo,
    handlePkgxSyncImages,
    handlePkgxSyncAll,
    handlePkgxUnlink,
  } = usePkgxSync({ addPkgxLog });
  
  // Confirm dialog state for PKGX sync actions
  const [confirmAction, setConfirmAction] = React.useState<{
    open: boolean;
    title: string;
    description: string;
    action: (() => void) | null;
  }>({ open: false, title: '', description: '', action: null });
  
  const handleConfirm = React.useCallback((title: string, description: string, action: () => void) => {
    setConfirmAction({ open: true, title, description, action });
  }, []);
  
  const executeAction = React.useCallback(() => {
    if (confirmAction.action) {
      confirmAction.action();
    }
    setConfirmAction({ open: false, title: '', description: '', action: null });
  }, [confirmAction]);
  
  const cancelConfirm = React.useCallback(() => {
    setConfirmAction({ open: false, title: '', description: '', action: null });
  }, []);
  
  const [historyBranchFilter, setHistoryBranchFilter] = React.useState<'all' | SystemId>('all');
  const [priceHistoryBranchFilter, setPriceHistoryBranchFilter] = React.useState<'all' | SystemId>('all');
  const [committedDialogOpen, setCommittedDialogOpen] = React.useState(false);
  const [selectedBranch, setSelectedBranch] = React.useState<{ systemId: SystemId; name: string } | null>(null);
  const [inTransitDialogOpen, setInTransitDialogOpen] = React.useState(false);
  const [inTransitBranch, setInTransitBranch] = React.useState<{ systemId: SystemId; name: string } | null>(null);
  const [inDeliveryDialogOpen, setInDeliveryDialogOpen] = React.useState(false);
  const [inDeliveryBranch, setInDeliveryBranch] = React.useState<{ systemId: SystemId; name: string } | null>(null);
  const [soldDialogOpen, setSoldDialogOpen] = React.useState(false);
  const [soldBranch, setSoldBranch] = React.useState<{ systemId: SystemId; name: string } | null>(null);

  // ✅ Ưu tiên React Query, fallback to store
  const product = React.useMemo(() => {
    if (systemId) {
      return productFromQuery || findProductById(asSystemId(systemId)) || null;
    }
    return null;
  }, [systemId, productFromQuery, findProductById]);
  
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

  // ✅ Fetch stock history từ API với server-side pagination để load toàn bộ dữ liệu + infinite scroll mobile
  const [stockHistoryPage, setStockHistoryPage] = React.useState(1);
  const [stockHistoryPageSize, setStockHistoryPageSize] = React.useState(20);
  const { data: stockHistoryResponse } = useProductStockHistory(product?.systemId, {
    page: stockHistoryPage,
    limit: stockHistoryPageSize,
    branchId: historyBranchFilter,
  });
  const stockHistoryData = stockHistoryResponse?.data ?? [];
  const stockHistoryTotal = stockHistoryResponse?.pagination?.total ?? stockHistoryData.length;

  // Reset về trang 1 khi đổi filter chi nhánh
  React.useEffect(() => {
    setStockHistoryPage(1);
  }, [historyBranchFilter]);

  // API đã trả về dữ liệu đã lọc theo branch + sort theo ngày giảm dần; không cần client-side filter thêm
  const productHistory = React.useMemo(() => {
    return [...stockHistoryData].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [stockHistoryData]);
  
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
          referenceSystemId: receipt.systemId, // For clickable link
          purchaseOrderId: receipt.purchaseOrderId, // For linking to PO
          type: 'receipt',
          note: receipt.notes || `Nhập ${item.receivedQuantity} ${product?.unit || ''}`,
          createdByName: receipt.createdByName || receipt.receiverName, // Người tạo phiếu
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

    // Helper to safely convert date to ISO string
    const toISOString = (date: unknown): string | null => {
      if (!date) return null;
      if (typeof date === 'string') return date;
      if (date instanceof Date) return date.toISOString();
      // Handle object with toISOString method
      if (typeof date === 'object' && 'toISOString' in date && typeof (date as Date).toISOString === 'function') {
        return (date as Date).toISOString();
      }
      // Try to create Date from the value
      const parsed = new Date(date as string | number);
      return isNaN(parsed.getTime()) ? null : parsed.toISOString();
    };

    // Add initial price entry for PKGX imports (products with pkgxId)
    // This shows the "Khởi tạo" entry similar to stock history
    // Add one entry for each branch
    if (product?.pkgxId && product?.createdAt) {
      // Get branches from the branches filter or use default
      const branchesForHistory = branches.length > 0 ? branches : [{ systemId: 'all', name: '-' }];
      
      // Convert createdAt to ISO string
      const createdAtStr = toISOString(product.createdAt);
      
      branchesForHistory.forEach(branch => {
        // Skip if filtering by specific branch and this is not it
        if (priceHistoryBranchFilter !== 'all' && branch.systemId !== priceHistoryBranchFilter) {
          return;
        }
        
        if (!createdAtStr) return; // Skip if date is invalid
        
        history.push({
          systemId: `pkgx-init-${productSystemId}-${branch.systemId}`,
          id: `pkgx-init-${productSystemId}-${branch.systemId}`,
          date: createdAtStr,
          price: 0,
          supplierName: 'Import từ PKGX',
          reference: product.id || product.name || `PKGX-${product.pkgxId}`,
          type: 'manual',
          note: 'Khởi tạo sản phẩm từ PKGX - Giá nhập ban đầu: 0đ',
          branchSystemId: branch.systemId,
          branchName: branch.name,
          createdByName: createdByEmployee?.fullName || 'Hệ thống',
        });
      });
    }
    
    // Add initial price entry for products created from HRM (no pkgxId)
    // Show the cost price set during product creation
    if (!product?.pkgxId && product?.createdAt) {
      const initialCostPrice = Number(product?.costPrice) || 0;
      const branchesForHistory = branches.length > 0 ? branches : [{ systemId: 'all', name: '-' }];
      
      // Convert createdAt to ISO string using helper
      const createdAtStr = toISOString(product.createdAt);
      
      branchesForHistory.forEach(branch => {
        // Skip if filtering by specific branch and this is not it
        if (priceHistoryBranchFilter !== 'all' && branch.systemId !== priceHistoryBranchFilter) {
          return;
        }
        
        if (!createdAtStr) return; // Skip if date is invalid
        
        history.push({
          systemId: `init-${productSystemId}-${branch.systemId}`,
          id: `init-${productSystemId}-${branch.systemId}`,
          date: createdAtStr,
          price: initialCostPrice,
          supplierName: 'Tạo mới sản phẩm',
          reference: product.id || product.name || '',
          type: 'manual',
          note: `Khởi tạo sản phẩm - Giá vốn ban đầu: ${initialCostPrice.toLocaleString('vi-VN')}đ`,
          branchSystemId: branch.systemId,
          branchName: branch.name,
          createdByName: createdByEmployee?.fullName || 'Hệ thống',
        });
      });
    }

    return history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [allInventoryReceipts, productSystemId, product?.unit, priceHistoryBranchFilter, product?.pkgxId, product?.createdAt, branches, product?.id, product?.name, product?.costPrice, createdByEmployee]);

  const stockHistoryColumns = React.useMemo(() => 
    getStockHistoryColumns(),
    []
  );

  // ═══════════════════════════════════════════════════════════════
  // IMAGE DISPLAY - Đơn giản: chỉ đọc từ product data (database)
  // Không dùng imageStore cho display - chỉ dùng cho form staging
  // ═══════════════════════════════════════════════════════════════
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const [previewImages, setPreviewImages] = React.useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = React.useState(0);
  
  // Đọc trực tiếp từ product data - source of truth từ database
  const thumbnailImage = product?.thumbnailImage || null;
  const galleryImages = React.useMemo(() => {
    return product?.galleryImages ?? product?.images ?? [];
  }, [product?.galleryImages, product?.images]);
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
      price: defaultPrice ?? 0,
    });
    printLabel('product-label', { data: printData });
  }, [product, printLabel, storeSettings, defaultSellingPolicy, findBrandById, findCategoryById]);

  const handleMoveToTrash = React.useCallback(() => {
    if (!product) return;
    removeMutation.mutate(product.systemId);
  }, [product, removeMutation]);

  const headerActions = React.useMemo(() => {
    if (!product) return [];
    if (!can('edit_products')) return [];
    
    const pkgxActions = product.pkgxId ? [
      <DropdownMenu key="pkgx-actions">
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9">
            <RefreshCw className="mr-2 h-4 w-4" />
            Cập nhật PKGX
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => handleConfirm(
            'Đồng bộ tất cả',
            `Bạn có chắc muốn đồng bộ TẤT CẢ thông tin của "${product.name}" lên PKGX?`,
            () => handlePkgxSyncAll(product)
          )}>
            <Layers className="mr-2 h-4 w-4" />
            Đồng bộ tất cả
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleConfirm(
            'Sync thông tin cơ bản',
            `Bạn có chắc muốn đồng bộ thông tin cơ bản (tên, SKU, danh mục, thương hiệu) của "${product.name}" lên PKGX?`,
            () => handlePkgxSyncBasicInfo(product)
          )}>
            <Info className="mr-2 h-4 w-4" />
            Thông tin cơ bản
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleConfirm(
            'Sync giá',
            `Bạn có chắc muốn đồng bộ giá bán của "${product.name}" lên PKGX?`,
            () => handlePkgxUpdatePrice(product)
          )}>
            <DollarSign className="mr-2 h-4 w-4" />
            Giá
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleConfirm(
            'Sync tồn kho',
            `Bạn có chắc muốn đồng bộ tồn kho của "${product.name}" lên PKGX?`,
            () => handlePkgxSyncInventory(product)
          )}>
            <Package2 className="mr-2 h-4 w-4" />
            Tồn kho
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleConfirm(
            'Sync SEO',
            `Bạn có chắc muốn đồng bộ SEO (Keywords, Meta Title, Meta Description) của "${product.name}" lên PKGX?`,
            () => handlePkgxUpdateSeo(product)
          )}>
            <Globe className="mr-2 h-4 w-4" />
            SEO
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleConfirm(
            'Sync mô tả',
            `Bạn có chắc muốn đồng bộ mô tả (Short, Long) của "${product.name}" lên PKGX?`,
            () => handlePkgxSyncDescription(product)
          )}>
            <FileText className="mr-2 h-4 w-4" />
            Mô tả
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleConfirm(
            'Sync flags',
            `Bạn có chắc muốn đồng bộ flags (Nổi bật, Mới, Bán chạy) của "${product.name}" lên PKGX?`,
            () => handlePkgxSyncFlags(product)
          )}>
            <Flag className="mr-2 h-4 w-4" />
            Flags
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleConfirm(
            'Sync hình ảnh',
            `Bạn có chắc muốn đồng bộ hình ảnh (thumbnail, gallery) của "${product.name}" lên PKGX?`,
            () => handlePkgxSyncImages(product)
          )}>
            <Image className="mr-2 h-4 w-4" />
            Hình ảnh
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => {
            if (product.pkgxId) {
              window.open(`https://phukiengiaxuong.com.vn/product/${product.pkgxId}`, '_blank');
            }
          }}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Xem trên web
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => handleConfirm(
              'Hủy liên kết PKGX',
              `Bạn có chắc muốn hủy liên kết sản phẩm "${product.name}" với PKGX? Lưu ý: Sản phẩm vẫn tồn tại trên PKGX, chỉ xóa liên kết trong HRM.`,
              () => handlePkgxUnlink(product)
            )}
          >
            <Unlink className="mr-2 h-4 w-4" />
            Hủy liên kết
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    ] : [
      // Actions for products WITHOUT pkgxId - Đăng lên PKGX
      <Button
        key="pkgx-publish"
        variant="outline"
        size="sm"
        className="h-9"
        onClick={() => handleConfirm(
          'Đăng lên PKGX',
          `Bạn có chắc muốn đăng sản phẩm "${product.name}" lên PKGX?`,
          () => handlePkgxPublish(product)
        )}
      >
        <Upload className="mr-2 h-4 w-4" />
        Đăng lên PKGX
      </Button>,
    ];
    
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
      </AlertDialog>,
      ...pkgxActions,
    ];
  }, [product, router, handlePrintLabel, handleMoveToTrash, handleConfirm, handlePkgxSyncAll, handlePkgxSyncBasicInfo, handlePkgxUpdatePrice, handlePkgxSyncInventory, handlePkgxUpdateSeo, handlePkgxSyncDescription, handlePkgxSyncFlags, handlePkgxSyncImages, handlePkgxPublish, handlePkgxUnlink, can]);

  // Mobile: gom tất cả actions vào 1 dropdown menu
  const mobileHeaderActions = React.useMemo(() => {
    if (!product || !isMobile || !can('edit_products')) return [];

    type MobileAction = { label: string; icon: React.ReactNode; onClick: () => void; destructive?: boolean; };
    const menuItems: MobileAction[] = [
      { label: 'Chỉnh sửa', icon: <Edit className="mr-2 h-4 w-4" />, onClick: () => router.push(`/products/${product.systemId}/edit`) },
      { label: 'In tem phụ', icon: <Printer className="mr-2 h-4 w-4" />, onClick: handlePrintLabel },
      { label: 'Chuyển vào thùng rác', icon: <Trash2 className="mr-2 h-4 w-4" />, onClick: handleMoveToTrash, destructive: true },
    ];

    // PKGX actions
    if (product.pkgxId) {
      menuItems.push(
        { label: 'Đồng bộ tất cả PKGX', icon: <Layers className="mr-2 h-4 w-4" />, onClick: () => handleConfirm('Đồng bộ tất cả', `Đồng bộ TẤT CẢ thông tin "${product.name}" lên PKGX?`, () => handlePkgxSyncAll(product)) },
        { label: 'Sync thông tin cơ bản', icon: <Info className="mr-2 h-4 w-4" />, onClick: () => handleConfirm('Sync thông tin cơ bản', `Đồng bộ thông tin cơ bản "${product.name}" lên PKGX?`, () => handlePkgxSyncBasicInfo(product)) },
        { label: 'Sync giá', icon: <DollarSign className="mr-2 h-4 w-4" />, onClick: () => handleConfirm('Sync giá', `Đồng bộ giá bán "${product.name}" lên PKGX?`, () => handlePkgxUpdatePrice(product)) },
        { label: 'Sync tồn kho', icon: <Package2 className="mr-2 h-4 w-4" />, onClick: () => handleConfirm('Sync tồn kho', `Đồng bộ tồn kho "${product.name}" lên PKGX?`, () => handlePkgxSyncInventory(product)) },
        { label: 'Sync SEO', icon: <Globe className="mr-2 h-4 w-4" />, onClick: () => handleConfirm('Sync SEO', `Đồng bộ SEO "${product.name}" lên PKGX?`, () => handlePkgxUpdateSeo(product)) },
        { label: 'Sync mô tả', icon: <FileText className="mr-2 h-4 w-4" />, onClick: () => handleConfirm('Sync mô tả', `Đồng bộ mô tả "${product.name}" lên PKGX?`, () => handlePkgxSyncDescription(product)) },
        { label: 'Sync flags', icon: <Flag className="mr-2 h-4 w-4" />, onClick: () => handleConfirm('Sync flags', `Đồng bộ flags "${product.name}" lên PKGX?`, () => handlePkgxSyncFlags(product)) },
        { label: 'Sync hình ảnh', icon: <Image className="mr-2 h-4 w-4" />, onClick: () => handleConfirm('Sync hình ảnh', `Đồng bộ hình ảnh "${product.name}" lên PKGX?`, () => handlePkgxSyncImages(product)) },
        { label: 'Xem trên web', icon: <ExternalLink className="mr-2 h-4 w-4" />, onClick: () => window.open(`https://phukiengiaxuong.com.vn/product/${product.pkgxId}`, '_blank') },
        { label: 'Hủy liên kết PKGX', icon: <Unlink className="mr-2 h-4 w-4" />, onClick: () => handleConfirm('Hủy liên kết PKGX', `Hủy liên kết sản phẩm "${product.name}" với PKGX?`, () => handlePkgxUnlink(product)), destructive: true },
      );
    } else {
      menuItems.push(
        { label: 'Đăng lên PKGX', icon: <Upload className="mr-2 h-4 w-4" />, onClick: () => handleConfirm('Đăng lên PKGX', `Đăng sản phẩm "${product.name}" lên PKGX?`, () => handlePkgxPublish(product)) },
      );
    }

    return [
      <DropdownMenu key="mobile-actions">
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          {menuItems.map((item, i) => (
            <React.Fragment key={item.label}>
              {i === 3 && <DropdownMenuSeparator />}
              <DropdownMenuItem
                onClick={item.onClick}
                className={item.destructive ? 'text-destructive focus:text-destructive' : ''}
              >
                {item.icon}
                {item.label}
              </DropdownMenuItem>
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>,
    ];
  }, [product, isMobile, can, router, handlePrintLabel, handleMoveToTrash, handleConfirm, handlePkgxSyncAll, handlePkgxSyncBasicInfo, handlePkgxUpdatePrice, handlePkgxSyncInventory, handlePkgxUpdateSeo, handlePkgxSyncDescription, handlePkgxSyncFlags, handlePkgxSyncImages, handlePkgxPublish, handlePkgxUnlink]);

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
    actions: isMobile ? mobileHeaderActions : headerActions,
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card className={mobileBleedCardClass}>
          <CardContent className="p-6">
            <div className="flex gap-6">
              <Skeleton className="w-32 h-32 rounded-lg" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className={mobileBleedCardClass}>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </CardContent>
        </Card>
      </div>
    );
  }

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
    <DetailPageShell gap="lg">
        {/* Header Summary Card with Image and Basic Info */}
        <Card className={mobileBleedCardClass}>
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Product Image */}
              <div className="shrink-0 lg:w-48">
                {thumbnailImage ? (
                  <div
                    className="relative aspect-square rounded-lg overflow-hidden border-border border bg-muted cursor-pointer"
                    onClick={() => handleOpenPreview(thumbnailImage)}
                  >
                    <LazyImage
                      src={thumbnailImage}
                      alt={`${product.name} - Ảnh thumbnail`}
                      className="w-full h-full object-cover"
                      rootMargin="400px"
                      skeletonClassName="rounded-none"
                    />
                    <div className="absolute inset-0 bg-black/0 md:hover:bg-black/10 transition-colors flex items-center justify-center">
                      <Eye className="h-6 w-6 text-white drop-shadow-lg md:opacity-0 md:hover:opacity-100" />
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
                  <p className="text-sm text-muted-foreground">Mã SKU: <span className="font-medium text-foreground">{product.id}</span></p>
                  <h2 className="text-h2 font-semibold">{product.name}</h2>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant={getStatusBadgeVariant(product.status) as 'default' | 'secondary' | 'destructive' | 'outline' | 'warning' | 'success'}>
                    {getStatusLabel(product.status)}
                  </Badge>
                  {/* Loại sản phẩm - ưu tiên productType từ Settings, fallback về product.type */}
                  <Badge variant="outline">{productType?.name || getTypeLabel(product.type)}</Badge>
                  {/* Đã xóa badge danh mục và thương hiệu vì đã hiện ở phần Thông tin cơ bản bên dưới */}
                </div>

                {/* E-commerce Status Badges */}
                <div className="flex flex-wrap gap-2">
                  {(product.isPublished || product.pkgxId) ? (
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
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{stockAlerts.message}</span>
                  </div>
                )}
                {!stockAlerts.isCritical && stockAlerts.isLow && (
                  <div className="flex items-center gap-2 text-sm text-amber-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{stockAlerts.message}</span>
                  </div>
                )}

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t">
                  {can('edit_products') && <div>
                    <p className="text-xs text-muted-foreground">Giá vốn</p>
                    <p className="font-semibold">{formatCurrency(product.costPrice ?? 0)}</p>
                  </div>}
                  <div>
                    <p className="text-xs text-muted-foreground">Giá bán (Mặc định)</p>
                    <p className="font-semibold text-primary">
                      {defaultSellingPolicy && product.prices?.[defaultSellingPolicy.systemId] 
                        ? formatCurrency(product.prices[defaultSellingPolicy.systemId]) 
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Tồn kho</p>
                    <p className="font-semibold">
                      {product.type === 'combo' ? comboTotalStock : totalInventory} {product.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Đã bán</p>
                    <p className="font-semibold">{product.totalSold ?? 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs defaultValue="info" className="w-full">
            <MobileTabsList>
                <MobileTabsTrigger value="info">Thông tin</MobileTabsTrigger>
                <MobileTabsTrigger value="images">Hình ảnh</MobileTabsTrigger>
                <MobileTabsTrigger value="pricing">Giá & Kho</MobileTabsTrigger>
                <MobileTabsTrigger value="logistics">Vận chuyển</MobileTabsTrigger>
                <MobileTabsTrigger value="label">Tem phụ</MobileTabsTrigger>
                <MobileTabsTrigger value="seo-default">SEO Chung</MobileTabsTrigger>
                <MobileTabsTrigger value="seo-pkgx">SEO PKGX</MobileTabsTrigger>
                <MobileTabsTrigger value="seo-trendtech">SEO Trendtech</MobileTabsTrigger>
                {isComboProduct(product) && <MobileTabsTrigger value="combo">Combo</MobileTabsTrigger>}
            </MobileTabsList>

            {/* Tab: Thông tin cơ bản */}
            <TabsContent value="info" className="mt-4 space-y-4">
              <Card className={mobileBleedCardClass}>
                <CardHeader><CardTitle size="lg">Thông tin cơ bản</CardTitle></CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2">
                  <DetailField label="Mã SKU" value={
                    product.pkgxId ? (
                      <div className="flex items-center gap-2">
                        <span>{product.id}</span>
                        <Badge variant="outline" className="text-xs">PKGX</Badge>
                      </div>
                    ) : product.id
                  } />
                  <DetailField label="Tên sản phẩm" value={product.name} />
                  <DetailField label="Loại sản phẩm" value={productType?.name || getTypeLabel(product.type)} />
                  {(category || product.category) && <DetailField label="Danh mục" value={category ? (category.path || category.name) : product.category} />}
                  {product.subCategory && <DetailField label="Danh mục con" value={product.subCategory} />}
                  <DetailField label="Thương hiệu" value={brand?.name || '-'} />
                  <DetailField label="Đơn vị tính" value={product.unit} />
                  <DetailField label="Mã vạch" value={product.barcode || '-'} />
                  {product.pkgxId && <DetailField label="ID PKGX" value={product.pkgxId} />}
                  {typeof product.warrantyPeriodMonths === 'number' && product.warrantyPeriodMonths > 0 && (
                    <DetailField label="Bảo hành" value={`${product.warrantyPeriodMonths} tháng`} />
                  )}
                  {supplier && <DetailField label="Nhà cung cấp chính" value={<Link href={`/suppliers/${supplier.systemId}`} className="text-primary hover:underline">{supplier.name}</Link>} />}
                  <DetailField label="Tags" value={product.tags?.length ? (
                    <div className="flex flex-wrap gap-1">{product.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}</div>
                  ) : '-'} />
                  {product.sellerNote && (
                    <div className="md:col-span-2">
                      <DetailField label="Ghi chú nội bộ" value={product.sellerNote} />
                    </div>
                  )}
                </CardContent>
              </Card>
              {/* Mô tả sản phẩm */}
              {(product.shortDescription || product.description) && (
                <Card className={mobileBleedCardClass}>
                  <CardHeader><CardTitle size="lg">Mô tả sản phẩm</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {product.shortDescription && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Mô tả ngắn</p>
                        <div 
                          className="prose prose-sm max-w-none text-sm" 
                          dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.shortDescription) }} 
                        />
                      </div>
                    )}
                    {product.description && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Mô tả chi tiết</p>
                        <div 
                          className="prose prose-sm max-w-none" 
                          dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }} 
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
              {/* Hệ thống */}
              <Card className={mobileBleedCardClass}>
                <CardHeader><CardTitle size="lg">Thông tin hệ thống</CardTitle></CardHeader>
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
              <Card className={mobileBleedCardClass}>
                <CardHeader><CardTitle size="lg">Hình ảnh sản phẩm</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {hasImages ? (
                    <div className="grid gap-4 lg:grid-cols-10">
                      <div className="space-y-3 lg:col-span-3">
                        <p className="text-sm font-medium text-muted-foreground">Ảnh thumbnail</p>
                        {thumbnailImage ? (
                          <div className="relative aspect-square rounded-lg overflow-hidden border bg-muted cursor-pointer" onClick={() => handleOpenPreview(thumbnailImage)}>
                            <LazyImage src={thumbnailImage} alt={`${product.name} - Thumbnail`} className="w-full h-full object-cover" rootMargin="400px" />
                          </div>
                        ) : <div className="rounded-lg border border-dashed bg-muted/40 text-center text-xs text-muted-foreground py-10">Chưa có ảnh</div>}
                      </div>
                      <div className="space-y-3 lg:col-span-7">
                        <p className="text-sm font-medium text-muted-foreground">Thư viện ({galleryImages.length})</p>
                        {galleryImages.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                            {galleryImages.map((url, i) => (
                              <div key={`${url}-${i}`} className="aspect-square rounded-lg overflow-hidden border bg-muted cursor-pointer" onClick={() => handleOpenPreview(url)}>
                                <LazyImage src={url} alt={`${product.name} - ${i + 1}`} className="w-full h-full object-cover" rootMargin="400px" />
                              </div>
                            ))}
                          </div>
                        ) : <div className="rounded-lg border border-dashed bg-muted/40 text-center text-xs text-muted-foreground py-10">Chưa có ảnh</div>}
                      </div>
                    </div>
                  ) : <div className="text-center text-sm text-muted-foreground border border-dashed rounded-md py-8">Chưa có hình ảnh</div>}
                  {product.videoLinks && product.videoLinks.length > 0 && (
                    <div className="space-y-3 pt-4 border-t">
                      <p className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Video className="h-4 w-4" />Video ({product.videoLinks.length})</p>
                      <div className="space-y-2">{product.videoLinks.map((link, i) => <a key={`${link}-${i}`} href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline truncate">{link}</a>)}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: SEO Chung (Default) */}
            <TabsContent value="seo-default" className="mt-4 space-y-4">
              <Card className={mobileBleedCardClass}>
                <CardHeader>
                  <CardTitle size="lg" className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    SEO Mặc định
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Thông tin SEO chung - sẽ được dùng nếu không có SEO riêng cho từng website
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <DetailField label="Tiêu đề SEO (ktitle)" value={product.ktitle || '-'} />
                  <DetailField label="Meta Description" value={product.seoDescription ? sanitizeToText(product.seoDescription) : '-'} />
                  <DetailField label="Keywords" value={product.seoKeywords || '-'} />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Mô tả ngắn</p>
                    {product.shortDescription ? (
                      <div className="prose prose-sm max-w-none text-sm border border-border rounded-md p-3 bg-muted/30" dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.shortDescription) }} />
                    ) : <p className="text-sm text-muted-foreground">-</p>}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Mô tả chi tiết</p>
                    {product.description ? (
                      <div className="prose prose-sm max-w-none text-sm border border-border rounded-md p-3 bg-muted/30" dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }} />
                    ) : <p className="text-sm text-muted-foreground">-</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: SEO PKGX */}
            <TabsContent value="seo-pkgx" className="mt-4 space-y-4">
              <Card className={mobileBleedCardClass}>
                <CardHeader>
                  <CardTitle size="lg" className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    SEO - PKGX
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <DetailField label="Tiêu đề SEO" value={product.seoPkgx?.seoTitle || '-'} />
                  <DetailField label="Meta Description" value={product.seoPkgx?.metaDescription ? sanitizeToText(product.seoPkgx.metaDescription) : '-'} />
                  <DetailField label="Keywords" value={product.seoPkgx?.seoKeywords || '-'} />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Mô tả ngắn</p>
                    {product.seoPkgx?.shortDescription ? (
                      <div className="prose prose-sm max-w-none text-sm border border-border rounded-md p-3 bg-muted/30" dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.seoPkgx.shortDescription) }} />
                    ) : <p className="text-sm text-muted-foreground">-</p>}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Mô tả dài</p>
                    {product.seoPkgx?.longDescription ? (
                      <div className="prose prose-sm max-w-none text-sm border border-borderrounded-md p-3 bg-muted/30" dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.seoPkgx.longDescription) }} />
                    ) : <p className="text-sm text-muted-foreground">-</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: SEO Trendtech */}
            <TabsContent value="seo-trendtech" className="mt-4 space-y-4">
              <Card className={mobileBleedCardClass}>
                <CardHeader>
                  <CardTitle size="lg" className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-green-600" />
                    SEO - Trendtech
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <DetailField label="Slug Trendtech" value={product.seoTrendtech?.slug || '-'} />
                  <DetailField label="Tiêu đề SEO" value={product.seoTrendtech?.seoTitle || '-'} />
                  <DetailField label="Meta Description" value={product.seoTrendtech?.metaDescription || '-'} />
                  <DetailField label="Keywords" value={product.seoTrendtech?.seoKeywords || '-'} />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Mô tả ngắn</p>
                    {product.seoTrendtech?.shortDescription ? (
                      <div className="prose prose-sm max-w-none text-sm border border-border rounded-md p-3 bg-muted/30" dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.seoTrendtech.shortDescription) }} />
                    ) : <p className="text-sm text-muted-foreground">-</p>}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Mô tả dài</p>
                    {product.seoTrendtech?.longDescription ? (
                      <div className="prose prose-sm max-w-none text-sm border border-border rounded-md p-3 bg-muted/30" dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.seoTrendtech.longDescription) }} />
                    ) : <p className="text-sm text-muted-foreground">-</p>}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Giá & Kho */}
            <TabsContent value="pricing" className="mt-4 space-y-4">
              {/* Cảnh báo tồn kho */}
              {getProductStockAlerts(product).length > 0 && (
                <Card className={cn("border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20", mobileBleedCardClass)}>
                  <CardHeader className="pb-2"><CardTitle size="lg" className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-amber-600" />Cảnh báo tồn kho</CardTitle></CardHeader>
                  <CardContent>
                    <StockAlertBadges product={product} showDescription />
                    {getSuggestedOrderQuantity(product) > 0 && <p className="text-sm mt-2">Đề xuất đặt thêm: <span className="font-semibold text-amber-700">{getSuggestedOrderQuantity(product)} {product.unit}</span></p>}
                  </CardContent>
                </Card>
              )}
              <div className="grid gap-4 lg:grid-cols-2">
                <Card className={mobileBleedCardClass}>
                  <CardHeader><CardTitle size="lg">Giá</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {can('edit_products') && <DetailField label="Giá vốn" value={formatCurrency(product.costPrice ?? 0)} />}
                    {product.type !== 'combo' && can('edit_products') && <DetailField label="Giá nhập gần nhất" value={formatCurrency(product.lastPurchasePrice ?? 0)} />}
                    {product.type !== 'combo' && can('edit_products') && supplier && <DetailField label="NCC chính" value={<Link href={`/suppliers/${supplier.systemId}`} className="text-primary hover:underline">{supplier.name}</Link>} />}
                    {product.type !== 'combo' && can('edit_products') && <DetailField label="Ngày nhập gần nhất" value={product.lastPurchaseDate ? formatDateForDisplay(product.lastPurchaseDate) : '-'} />}
                  </CardContent>
                </Card>
                <Card className={mobileBleedCardClass}>
                  <CardHeader><CardTitle size="lg">Bảng giá bán</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {salesPolicies.map(p => <DetailField key={p.systemId} label={`${p.name}${p.isDefault ? ' (Mặc định)' : ''}`} value={formatCurrency(product.prices[p.systemId])} />)}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Tab: Vận chuyển & Logistics */}
            <TabsContent value="logistics" className="mt-4">
              <Card className={mobileBleedCardClass}>
                <CardHeader><CardTitle size="lg">Thông tin vận chuyển</CardTitle></CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2">
                  {product.weight !== undefined && <DetailField label="Khối lượng" value={`${product.weight} ${product.weightUnit || 'g'}`} />}
                  {product.dimensions && <DetailField label="Kích thước (D×R×C)" value={`${product.dimensions.length || 0}×${product.dimensions.width || 0}×${product.dimensions.height || 0} cm`} />}
                  {product.barcode && <DetailField label="Mã vạch" value={product.barcode} />}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab: Tem phụ */}
            <TabsContent value="label" className="mt-4">
              <Card className={mobileBleedCardClass}>
                <CardHeader><CardTitle size="lg">Thông tin Tem phụ</CardTitle></CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2">
                  <DetailField label="Tên hàng hóa (VAT)" value={product.nameVat || '-'} />
                  <DetailField label="Xuất xứ" value={product.origin || '-'} />
                  <DetailField label="Tên nhà nhập khẩu" value={product.importerName || '-'} />
                  <DetailField label="Địa chỉ nhà nhập khẩu" value={product.importerAddress || '-'} />
                  <div className="md:col-span-2">
                    <DetailField label="Hướng dẫn sử dụng" value={product.usageGuide || '-'} />
                  </div>
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
        </Tabs>

        {/* Panel Tồn kho & Lịch sử - 3 sub-tabs */}
        <Card className={mobileBleedCardClass}>
          <CardContent className="p-4">
            <Tabs defaultValue="inventory" className="w-full">
              <MobileTabsList>
                <MobileTabsTrigger value="inventory">Tồn kho</MobileTabsTrigger>
                <MobileTabsTrigger value="stock-history">Lịch sử kho</MobileTabsTrigger>
                {product.type !== 'combo' && can('edit_products') && <MobileTabsTrigger value="price-history">Lịch sử giá nhập</MobileTabsTrigger>}
              </MobileTabsList>
              
              {/* Sub-tab: Tồn kho theo chi nhánh */}
              <TabsContent value="inventory" className="mt-4">
                {product.type === 'combo' ? (
                  <ComboInventoryCard product={product} branches={branches} allProducts={allProducts}
                    onCommittedClick={(b) => { setSelectedBranch({ systemId: b.systemId, name: b.name }); setCommittedDialogOpen(true); }}
                    onInTransitClick={(b) => { setInTransitBranch({ systemId: b.systemId, name: b.name }); setInTransitDialogOpen(true); }}
                  />
                ) : (
                  <>
                    {/* Desktop: Table layout */}
                    <div className="hidden md:block">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Chi nhánh</TableHead>
                            <TableHead>Tồn kho</TableHead>
                            {can('edit_products') && <TableHead>Giá vốn (đ/SP)</TableHead>}
                            {can('edit_products') && <TableHead>Giá trị tồn</TableHead>}
                            <TableHead>Có thể bán</TableHead>
                            <TableHead>Chờ xuất kho</TableHead>
                            <TableHead>Đang về</TableHead>
                            <TableHead>Đang giao</TableHead>
                            <TableHead>Tổng đã bán</TableHead>
                            <TableHead>Tồn tối thiểu</TableHead>
                            <TableHead>Tồn tối đa</TableHead>
                            <TableHead>Điểm lưu kho</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {branches.map(branch => {
                            const onHand = product.inventoryByBranch?.[branch.systemId] || 0;
                            const committed = product.committedByBranch?.[branch.systemId] || 0;
                            const inTransit = product.inTransitByBranch?.[branch.systemId] || 0;
                            const inDelivery = product.inDeliveryByBranch?.[branch.systemId] || 0;
                            const reorderLevel = product.reorderLevel ?? 0;
                            const maxStock = product.maxStock ?? 0;
                            const availableToSell = onHand - committed;
                            const getStockStatusClass = () => {
                              if (onHand < 0) return 'text-yellow-600 font-bold';
                              if (onHand === 0) return 'text-red-600 font-bold';
                              if (reorderLevel > 0 && onHand <= reorderLevel) return 'text-orange-500 font-semibold';
                              if (maxStock > 0 && onHand > maxStock) return 'text-blue-600 font-semibold';
                              return 'font-semibold';
                            };
                            const branchSold = soldByBranch[branch.systemId] || 0;
                            const inventoryValue = Math.abs(onHand) * (product.costPrice || 0);
                            return (
                              <TableRow key={branch.systemId}>
                                <TableCell className="font-medium">{branch.name}</TableCell>
                                <TableCell className={getStockStatusClass()}>{onHand}</TableCell>
                                {can('edit_products') && <TableCell>{formatCurrency(product.costPrice || 0)}</TableCell>}
                                {can('edit_products') && <TableCell>{formatCurrency(inventoryValue)}</TableCell>}
                                <TableCell className={availableToSell < 0 ? 'text-red-600 font-semibold' : ''}>{availableToSell}</TableCell>
                                <TableCell className={committed > 0 ? 'text-primary cursor-pointer hover:underline' : ''} onClick={() => committed > 0 && (setSelectedBranch({ systemId: branch.systemId, name: branch.name }), setCommittedDialogOpen(true))}>{committed}</TableCell>
                                <TableCell className={inTransit > 0 ? 'text-primary cursor-pointer hover:underline' : ''} onClick={() => inTransit > 0 && (setInTransitBranch({ systemId: branch.systemId, name: branch.name }), setInTransitDialogOpen(true))}>{inTransit}</TableCell>
                                <TableCell className={inDelivery > 0 ? 'text-primary cursor-pointer hover:underline' : ''} onClick={() => inDelivery > 0 && (setInDeliveryBranch({ systemId: branch.systemId, name: branch.name }), setInDeliveryDialogOpen(true))}>{inDelivery}</TableCell>
                                <TableCell className={branchSold > 0 ? 'text-primary cursor-pointer hover:underline' : ''} onClick={() => branchSold > 0 && (setSoldBranch({ systemId: branch.systemId, name: branch.name }), setSoldDialogOpen(true))}>{branchSold}</TableCell>
                                <TableCell>{reorderLevel}</TableCell>
                                <TableCell>{maxStock}</TableCell>
                                <TableCell>{product.warehouseLocation || storageLocation?.name || '-'}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Mobile: Card stack per branch */}
                    <div className="md:hidden space-y-3">
                      {branches.map(branch => {
                        const onHand = product.inventoryByBranch?.[branch.systemId] || 0;
                        const committed = product.committedByBranch?.[branch.systemId] || 0;
                        const inTransit = product.inTransitByBranch?.[branch.systemId] || 0;
                        const inDelivery = product.inDeliveryByBranch?.[branch.systemId] || 0;
                        const reorderLevel = product.reorderLevel ?? 0;
                        const maxStock = product.maxStock ?? 0;
                        const availableToSell = onHand - committed;
                        const stockColor =
                          onHand < 0 ? 'text-yellow-600' :
                          onHand === 0 ? 'text-red-600' :
                          reorderLevel > 0 && onHand <= reorderLevel ? 'text-orange-500' :
                          maxStock > 0 && onHand > maxStock ? 'text-blue-600' :
                          'text-foreground';
                        const branchSold = soldByBranch[branch.systemId] || 0;
                        const inventoryValue = Math.abs(onHand) * (product.costPrice || 0);

                        const handleCommittedClick = () => { if (committed > 0) { setSelectedBranch({ systemId: branch.systemId, name: branch.name }); setCommittedDialogOpen(true); } };
                        const handleInTransitClick = () => { if (inTransit > 0) { setInTransitBranch({ systemId: branch.systemId, name: branch.name }); setInTransitDialogOpen(true); } };
                        const handleInDeliveryClick = () => { if (inDelivery > 0) { setInDeliveryBranch({ systemId: branch.systemId, name: branch.name }); setInDeliveryDialogOpen(true); } };
                        const handleSoldClick = () => { if (branchSold > 0) { setSoldBranch({ systemId: branch.systemId, name: branch.name }); setSoldDialogOpen(true); } };

                        return (
                          <MobileCard key={branch.systemId} inert>
                            <MobileCardHeader className="items-center justify-between">
                              <div className="min-w-0 flex-1">
                                <div className="text-xs uppercase tracking-wide text-muted-foreground">Chi nhánh</div>
                                <div className="mt-0.5 text-sm font-semibold text-foreground truncate">{branch.name}</div>
                              </div>
                              <div className="text-right shrink-0">
                                <div className={cn('text-2xl font-bold leading-none', stockColor)}>{onHand}</div>
                                <div className="mt-1 text-xs text-muted-foreground">Tồn kho</div>
                              </div>
                            </MobileCardHeader>
                            <MobileCardBody>
                              <dl className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-sm">
                                {can('edit_products') && (
                                  <>
                                    <div>
                                      <dt className="text-xs text-muted-foreground">Giá vốn</dt>
                                      <dd className="font-medium">{formatCurrency(product.costPrice || 0)}</dd>
                                    </div>
                                    <div>
                                      <dt className="text-xs text-muted-foreground">Giá trị tồn</dt>
                                      <dd className="font-medium">{formatCurrency(inventoryValue)}</dd>
                                    </div>
                                  </>
                                )}
                                <div>
                                  <dt className="text-xs text-muted-foreground">Có thể bán</dt>
                                  <dd className={cn('font-medium', availableToSell < 0 && 'text-red-600')}>{availableToSell}</dd>
                                </div>
                                <div
                                  {...(committed > 0 ? { role: 'button', tabIndex: 0, onClick: handleCommittedClick, onKeyDown: (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCommittedClick(); } }, className: 'cursor-pointer' } : {})}
                                >
                                  <dt className="text-xs text-muted-foreground">Chờ xuất kho</dt>
                                  <dd className={cn('font-medium', committed > 0 && 'text-primary underline')}>{committed}</dd>
                                </div>
                                <div
                                  {...(inTransit > 0 ? { role: 'button', tabIndex: 0, onClick: handleInTransitClick, onKeyDown: (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleInTransitClick(); } }, className: 'cursor-pointer' } : {})}
                                >
                                  <dt className="text-xs text-muted-foreground">Đang về</dt>
                                  <dd className={cn('font-medium', inTransit > 0 && 'text-primary underline')}>{inTransit}</dd>
                                </div>
                                <div
                                  {...(inDelivery > 0 ? { role: 'button', tabIndex: 0, onClick: handleInDeliveryClick, onKeyDown: (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleInDeliveryClick(); } }, className: 'cursor-pointer' } : {})}
                                >
                                  <dt className="text-xs text-muted-foreground">Đang giao</dt>
                                  <dd className={cn('font-medium', inDelivery > 0 && 'text-primary underline')}>{inDelivery}</dd>
                                </div>
                                <div
                                  {...(branchSold > 0 ? { role: 'button', tabIndex: 0, onClick: handleSoldClick, onKeyDown: (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleSoldClick(); } }, className: 'cursor-pointer' } : {})}
                                >
                                  <dt className="text-xs text-muted-foreground">Tổng đã bán</dt>
                                  <dd className={cn('font-medium', branchSold > 0 && 'text-primary underline')}>{branchSold}</dd>
                                </div>
                                <div>
                                  <dt className="text-xs text-muted-foreground">Tồn tối thiểu</dt>
                                  <dd className="font-medium">{reorderLevel}</dd>
                                </div>
                                <div>
                                  <dt className="text-xs text-muted-foreground">Tồn tối đa</dt>
                                  <dd className="font-medium">{maxStock}</dd>
                                </div>
                                <div className="col-span-2">
                                  <dt className="text-xs text-muted-foreground">Điểm lưu kho</dt>
                                  <dd className="font-medium">{product.warehouseLocation || storageLocation?.name || '-'}</dd>
                                </div>
                              </dl>
                            </MobileCardBody>
                          </MobileCard>
                        );
                      })}
                    </div>
                  </>
                )}
              </TabsContent>
              
              {/* Sub-tab: Lịch sử xuất nhập kho */}
              <TabsContent value="stock-history" className="mt-4">
                <RelatedDataTable
                  data={productHistory}
                  columns={stockHistoryColumns}
                  searchKeys={['action', 'documentId', 'employeeName']}
                  searchPlaceholder="Tìm kiếm..."
                  dateFilterColumn="date"
                  dateFilterTitle="Ngày"
                  exportFileName={`Lich_su_kho_${product.id}`}
                  serverPagination={{
                    page: stockHistoryPage,
                    pageSize: stockHistoryPageSize,
                    totalItems: stockHistoryTotal,
                    onPageChange: setStockHistoryPage,
                    onPageSizeChange: setStockHistoryPageSize,
                  }}
                >
                  <Select value={historyBranchFilter} onValueChange={(v) => setHistoryBranchFilter(v === 'all' ? 'all' : asSystemId(v))}>
                    <SelectTrigger className="h-8 w-full sm:w-50"><SelectValue placeholder="Lọc chi nhánh" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả chi nhánh</SelectItem>
                      {branches.map(b => <SelectItem key={b.systemId} value={b.systemId}>{b.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </RelatedDataTable>
              </TabsContent>
              
              {/* Sub-tab: Lịch sử giá nhập */}
              {product.type !== 'combo' && can('edit_products') && (
                <TabsContent value="price-history" className="mt-4">
                  <RelatedDataTable data={purchasePriceHistory} columns={purchasePriceHistoryColumns} searchKeys={['supplierName', 'reference', 'note']} searchPlaceholder="Tìm kiếm..." dateFilterColumn="date" dateFilterTitle="Ngày" exportFileName={`Lich_su_gia_${product.id}`}>
                    <Select value={priceHistoryBranchFilter} onValueChange={(v) => setPriceHistoryBranchFilter(v === 'all' ? 'all' : asSystemId(v))}>
                      <SelectTrigger className="h-8 w-full sm:w-50"><SelectValue placeholder="Lọc chi nhánh" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả chi nhánh</SelectItem>
                        {branches.map(b => <SelectItem key={b.systemId} value={b.systemId}>{b.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </RelatedDataTable>
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>

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
        <EntityActivityTable entityType="product" entityId={product.systemId} />

        {/* Committed Stock Dialog */}
        {selectedBranch && (
          <StockOrdersDialogWrapper
            open={committedDialogOpen}
            onOpenChange={setCommittedDialogOpen}
            type="committed"
            productSystemId={product.systemId}
            branchSystemId={selectedBranch.systemId}
            branchName={selectedBranch.name}
            productName={product.name}
          />
        )}
        {inTransitBranch && (
          <StockOrdersDialogWrapper
            open={inTransitDialogOpen}
            onOpenChange={setInTransitDialogOpen}
            type="in-transit"
            productSystemId={product.systemId}
            branchSystemId={inTransitBranch.systemId}
            branchName={inTransitBranch.name}
            productName={product.name}
          />
        )}
        {inDeliveryBranch && (
          <StockOrdersDialogWrapper
            open={inDeliveryDialogOpen}
            onOpenChange={setInDeliveryDialogOpen}
            type="in-delivery"
            productSystemId={product.systemId}
            branchSystemId={inDeliveryBranch.systemId}
            branchName={inDeliveryBranch.name}
            productName={product.name}
          />
        )}
        {soldBranch && (
          <StockOrdersDialogWrapper
            open={soldDialogOpen}
            onOpenChange={setSoldDialogOpen}
            type="sold"
            productSystemId={product.systemId}
            branchSystemId={soldBranch.systemId}
            branchName={soldBranch.name}
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
        
        {/* PKGX Sync Confirm Dialog */}
        <AlertDialog open={confirmAction.open} onOpenChange={(open) => !open && cancelConfirm()}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{confirmAction.title}</AlertDialogTitle>
              <AlertDialogDescription>{confirmAction.description}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={cancelConfirm}>Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={executeAction}>Xác nhận</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
    </DetailPageShell>
  );
}
