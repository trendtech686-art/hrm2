'use client'

import * as React from 'react';
import { useNavigate } from '@/lib/next-compat';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Badge } from '../../../../components/ui/badge';
import { Switch } from '../../../../components/ui/switch';
import { Checkbox } from '../../../../components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../../../components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Label } from '../../../../components/ui/label';
import { ScrollArea } from '../../../../components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../../../components/ui/dropdown-menu';
import { Search, ExternalLink, Link, Unlink, RefreshCw, Loader2, CheckCircle2, Upload, ArrowRight, Settings2, MoreHorizontal, Eye, TriangleAlert, Package, DollarSign, FileText, Link2, ImageIcon, Flame, Sparkles, Home, Star, ShoppingBag, Circle, XCircle, Trash2, AlertCircle, Lightbulb, AlertTriangle, AlignLeft, Tag, Image } from 'lucide-react';
import { toast } from 'sonner';
import { useProductStore } from '../../../products/store';
import { usePkgxSettingsStore } from '../store';
import { getProducts as fetchPkgxProducts, updateProduct as updatePkgxProduct, getProductById as fetchPkgxProductById, getProductGallery as fetchPkgxGallery } from '../../../../lib/pkgx/api-service';
import type { PkgxProduct, PkgxGalleryImage } from '../types';
import type { SystemId } from '../../../../lib/id-types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../../components/ui/tooltip';
import { ResponsiveDataTable } from '../../../../components/data-table/responsive-data-table';
import { useAuth, getCurrentUserName } from '../../../../contexts/auth-context';
import { Alert, AlertDescription, AlertTitle } from '../../../../components/ui/alert';
import { useProductMappingValidation } from '../hooks/use-product-mapping-validation';
import { usePkgxEntitySync } from '../hooks';
import type { HrmProductData } from '../hooks';
import type { ProductMappingInput } from '../validation/product-mapping-validation';
import { PkgxMappingDialog } from '../../../../components/shared/pkgx-mapping-dialog';
import { PkgxSyncConfirmDialog } from './pkgx-sync-confirm-dialog';
import type { ColumnDef } from '../../../../components/data-table/types';

// ========================================
// Mobile Dropdown Helper Component
// ========================================
interface MobileProductDropdownProps {
  row: PkgxProductRow;
  entitySync: ReturnType<typeof usePkgxEntitySync>;
  onViewOnPkgx: (goodsId: number) => void;
  onOpenLinkDialog: (row: PkgxProduct) => void;
  onOpenUnlinkDialog: (row: PkgxProduct) => void;
}

function MobileProductDropdown({ row, entitySync, onViewOnPkgx, onOpenLinkDialog, onOpenUnlinkDialog }: MobileProductDropdownProps) {
  // Helper to build HRM product data for sync
  const buildHrmData = (): HrmProductData | null => {
    if (!row.linkedHrmProduct) return null;
    return {
      systemId: row.linkedHrmProduct.systemId,
      name: row.linkedHrmProduct.name,
      sku: row.linkedHrmProduct.sku,
      sellingPrice: row.linkedHrmProduct.sellingPrice,
      costPrice: row.linkedHrmProduct.costPrice,
      dealPrice: row.linkedHrmProduct.dealPrice,
      quantity: row.linkedHrmProduct.quantity,
      seoKeywords: row.linkedHrmProduct.seoKeywords,
      ktitle: row.linkedHrmProduct.ktitle,
      seoDescription: row.linkedHrmProduct.seoDescription,
      shortDescription: row.linkedHrmProduct.shortDescription,
      description: row.linkedHrmProduct.description,
      isBest: row.linkedHrmProduct.isBest,
      isNew: row.linkedHrmProduct.isNew,
      isHot: row.linkedHrmProduct.isHot,
      isHome: row.linkedHrmProduct.isHome,
      categorySystemId: row.linkedHrmProduct.categorySystemId,
      brandSystemId: row.linkedHrmProduct.brandSystemId,
    };
  };
  
  // Helper to trigger sync with proper HRM data
  const triggerSync = (actionKey: 'sync_all' | 'sync_basic' | 'sync_seo' | 'sync_description' | 'sync_price' | 'sync_inventory' | 'sync_flags') => {
    const hrmData = buildHrmData();
    if (!hrmData) {
      toast.error('Sản phẩm chưa được liên kết với HRM');
      return;
    }
    entitySync.triggerSyncAction(actionKey, row.goods_id, hrmData, row.goods_name);
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {row.linkedHrmProduct ? (
          <>
            {/* Sync All */}
            <DropdownMenuItem 
              onClick={() => triggerSync('sync_all')}
              className="font-medium"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Đồng bộ tất cả
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => triggerSync('sync_basic')}>
              <FileText className="h-4 w-4 mr-2" />
              Thông tin cơ bản
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => triggerSync('sync_price')}>
              <DollarSign className="h-4 w-4 mr-2" />
              Giá
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => triggerSync('sync_inventory')}>
              <Package className="h-4 w-4 mr-2" />
              Tồn kho
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => triggerSync('sync_seo')}>
              <Search className="h-4 w-4 mr-2" />
              SEO
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => triggerSync('sync_description')}>
              <AlignLeft className="h-4 w-4 mr-2" />
              Mô tả
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => triggerSync('sync_flags')}>
              <Tag className="h-4 w-4 mr-2" />
              Flags
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onViewOnPkgx(row.goods_id)}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Xem trên PKGX
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onOpenUnlinkDialog(row)}
              className="text-destructive focus:text-destructive"
            >
              <Unlink className="h-4 w-4 mr-2" />
              Hủy liên kết
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={() => onOpenLinkDialog(row)}>
              <Link2 className="h-4 w-4 mr-2" />
              Liên kết với HRM
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ========================================
// PKGX Sync Fields Configuration
// ========================================
// 
// QUAN TRỌNG - Cấu trúc ID:
// - goods_id (PKGX): PRIMARY KEY - Dùng cho TẤT CẢ API calls (update, delete, link)
// - goods_sn (PKGX) = sku (HRM): Mã SKU sản phẩm, có thể sync 2 chiều
// - pkgxId (HRM Product): Lưu trữ goods_id để link sản phẩm
//
// Sync fields configuration - HRM to PKGX (push only)
// Giá sử dụng cấu hình từ tab "Mapping giá" (không chọn từng trường)
const PUSH_SYNC_FIELDS = [
  // Thông tin cơ bản
  { key: 'goods_name', label: 'Tên sản phẩm', hrmField: 'name', group: 'basic' },
  { key: 'goods_sn', label: 'Mã SKU', hrmField: 'sku', group: 'basic' },
  { key: 'goods_brief', label: 'Mô tả ngắn', hrmField: 'shortDescription', group: 'basic' },
  { key: 'goods_desc', label: 'Mô tả chi tiết', hrmField: 'description', group: 'basic' },
  
  // Giá cả - Một toggle cho tất cả, sử dụng mapping từ tab Mapping giá
  { key: 'sync_prices', label: 'Đồng bộ giá (theo cấu hình Mapping giá)', hrmField: 'prices', group: 'price', isSpecial: true },
  
  // Tồn kho
  { key: 'goods_number', label: 'Số lượng tồn', hrmField: 'quantity', group: 'inventory' },
  
  // Phân loại
  { key: 'cat_id', label: 'Danh mục', hrmField: 'categoryId', group: 'classification' },
  { key: 'brand_id', label: 'Thương hiệu', hrmField: 'brandId', group: 'classification' },
  
  // SEO
  { key: 'keywords', label: 'Từ khóa SEO', hrmField: 'seoKeywords', group: 'seo' },
  { key: 'meta_title', label: 'Tiêu đề SEO', hrmField: 'ktitle', group: 'seo' },
  { key: 'meta_desc', label: 'Mô tả SEO', hrmField: 'seoDescription', group: 'seo' },
  
  // Trạng thái hiển thị
  { key: 'best', label: 'SP tốt nhất', hrmField: 'isBest', group: 'display' },
  { key: 'hot', label: 'SP hot', hrmField: 'isHot', group: 'display' },
  { key: 'new', label: 'SP mới', hrmField: 'isNew', group: 'display' },
  { key: 'ishome', label: 'Hiển thị trang chủ', hrmField: 'isHome', group: 'display' },
  
  // Ghi chú
  { key: 'seller_note', label: 'Ghi chú người bán', hrmField: 'sellerNote', group: 'other' },
] as const;

type PushSyncFieldKey = typeof PUSH_SYNC_FIELDS[number]['key'];

// Extended type for table display - MUST have systemId for ResponsiveDataTable
interface PkgxProductRow extends PkgxProduct {
  systemId: string; // Required by ResponsiveDataTable - use goods_id.toString()
  linkedHrmProduct?: {
    systemId: string;
    name: string;
    id: string;
    sku?: string;
    // Giá cả
    sellingPrice?: number;
    costPrice?: number;
    partnerPrice?: number;
    acePrice?: number;
    dealPrice?: number;
    // Tồn kho
    quantity?: number;
    // Nội dung
    description?: string;
    shortDescription?: string;
    // SEO
    seoDescription?: string;
    seoKeywords?: string;
    ktitle?: string;
    // Phân loại
    categorySystemId?: SystemId;
    brandSystemId?: SystemId;
    // Trạng thái
    isBest?: boolean;
    isHot?: boolean;
    isNew?: boolean;
    isHome?: boolean;
    // Khác
    sellerNote?: string;
  };
}

export function ProductMappingTab() {
  // Router & Auth
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Stores
  const { settings, addLog, getPkgxCatIdByHrmCategory, getPkgxBrandIdByHrmBrand, setPkgxProducts } = usePkgxSettingsStore();
  const productStore = useProductStore();
  
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isSyncing, setIsSyncing] = React.useState(false);
  
  // Sử dụng pkgxProducts từ store (dùng chung với Link Dialog)
  const pkgxProducts = settings.pkgxProducts || [];
  
  // Auto-fetch khi vào tab nếu chưa có data và PKGX đã được cấu hình
  const hasAutoFetched = React.useRef(false);
  
  // Helper function để build URL ảnh PKGX
  const buildPkgxImageUrl = React.useCallback((imagePath: string | undefined | null): string => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    // Xóa / ở đầu nếu có và build URL đầy đủ với /cdn/
    const cleanPath = imagePath.replace(/^\/+/, '');
    return `https://phukiengiaxuong.com.vn/cdn/${cleanPath}`;
  }, []);
  
  // Product detail dialog state
  const [isDetailDialogOpen, setIsDetailDialogOpen] = React.useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = React.useState<PkgxProductRow | null>(null);
  const [isLoadingProductDetail, setIsLoadingProductDetail] = React.useState(false);
  
  // Gallery state
  const [galleryImages, setGalleryImages] = React.useState<PkgxGalleryImage[]>([]);
  const [isLoadingGallery, setIsLoadingGallery] = React.useState(false);
  
  // Link dialog state
  const [selectedPkgxProduct, setSelectedPkgxProduct] = React.useState<PkgxProduct | null>(null);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = React.useState(false);
  const [selectedHrmProductId, setSelectedHrmProductId] = React.useState('');
  const [showWarningConfirm, setShowWarningConfirm] = React.useState(false);
  
  // Unlink dialog state
  const [isUnlinkDialogOpen, setIsUnlinkDialogOpen] = React.useState(false);
  const [productToUnlink, setProductToUnlink] = React.useState<{ pkgxProduct: PkgxProduct; hrmProduct: any } | null>(null);
  
  // Row selection state
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  
  // Bulk unlink dialog state
  const [isBulkUnlinkDialogOpen, setIsBulkUnlinkDialogOpen] = React.useState(false);
  
  // Use shared PKGX entity sync hook
  const entitySync = usePkgxEntitySync({
    entityType: 'product',
    onLog: addLog,
    getPkgxCatIdByHrmCategory,
    getPkgxBrandIdByHrmBrand,
  });
  
  // Sync dialog state - Push (HRM to PKGX) - Default basic fields + prices
  const [isPushDialogOpen, setIsPushDialogOpen] = React.useState(false);
  const [productToPush, setProductToPush] = React.useState<PkgxProductRow | null>(null);
  const [selectedPushFields, setSelectedPushFields] = React.useState<PushSyncFieldKey[]>(['goods_name', 'sync_prices', 'goods_number']);
  const [isPushingProduct, setIsPushingProduct] = React.useState(false);
  
  // HRM products - sử dụng productStore.data trực tiếp để đảm bảo reactive
  const hrmProducts = React.useMemo(
    () => productStore.data.filter(p => !p.isDeleted).sort((a, b) => a.name.localeCompare(b.name)),
    [productStore.data]
  );
  
  // Validation hook
  const validation = useProductMappingValidation({
    hrmProducts: hrmProducts.map(p => ({
      systemId: p.systemId,
      name: p.name,
      id: p.id,
      pkgxId: p.pkgxId,
      status: p.status,
    })),
    pkgxProducts: pkgxProducts,
    editingProductId: undefined,
    debounceMs: 300,
  });
  
  // Count of linked HRM products
  const linkedCount = React.useMemo(
    () => hrmProducts.filter((p) => p.pkgxId).length,
    [hrmProducts]
  );
  
  // Find HRM product linked to a PKGX product
  // FIX: Sử dụng == thay vì === để handle cả string và number (localStorage có thể lưu string)
  const findLinkedHrmProduct = React.useCallback((pkgxId: number) => {
    return hrmProducts.find((p) => p.pkgxId == pkgxId);
  }, [hrmProducts]);
  
  // Filter and transform PKGX products
  const tableData = React.useMemo((): PkgxProductRow[] => {
    let filtered = pkgxProducts;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = pkgxProducts.filter(
        (p) =>
          p.goods_name.toLowerCase().includes(term) ||
          p.goods_sn?.toLowerCase().includes(term) ||
          p.goods_id.toString().includes(term)
      );
    }
    
    return filtered.map((p) => {
      const linked = findLinkedHrmProduct(p.goods_id);
      // Calculate total inventory from all branches
      const totalInventory = linked 
        ? Object.values(linked.inventoryByBranch || {}).reduce((sum, qty) => sum + qty, 0)
        : 0;
      
      return {
        ...p,
        linkedHrmProduct: linked ? {
          systemId: linked.systemId,
          name: linked.name,
          id: linked.id,
          sku: (linked as any).sku,
          // Giá cả
          sellingPrice: linked.sellingPrice,
          costPrice: linked.costPrice,
          partnerPrice: (linked as any).partnerPrice,
          acePrice: (linked as any).acePrice,
          dealPrice: (linked as any).dealPrice,
          // Tồn kho
          quantity: totalInventory,
          // Nội dung
          description: linked.description,
          shortDescription: linked.shortDescription,
          // SEO
          seoDescription: linked.seoDescription,
          seoKeywords: (linked as any).seoKeywords,
          ktitle: linked.ktitle,
          // Phân loại
          categorySystemId: linked.categorySystemId,
          brandSystemId: linked.brandSystemId,
          // Trạng thái
          isBest: (linked as any).isBest,
          isHot: (linked as any).isHot,
          isNew: (linked as any).isNew,
          isHome: (linked as any).isHome,
          // Khác
          sellerNote: (linked as any).sellerNote,
        } : undefined,
        // Required by ResponsiveDataTable
        systemId: p.goods_id.toString(),
      };
    });
  }, [pkgxProducts, searchTerm, findLinkedHrmProduct]);
  
  // Pagination state for ResponsiveDataTable
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'goods_id', desc: true });
  
  // Paginated data for ResponsiveDataTable
  const pageCount = Math.ceil(tableData.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    return tableData.slice(start, start + pagination.pageSize);
  }, [tableData, pagination]);
  
  // Reset page when search changes
  React.useEffect(() => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, [searchTerm]);
  
  // Column definitions for ResponsiveDataTable
  const columns = React.useMemo((): ColumnDef<PkgxProductRow>[] => [
    // Checkbox column
    {
      id: 'select',
      header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll }) => (
        <Checkbox
          checked={isAllPageRowsSelected ? true : isSomePageRowsSelected ? "indeterminate" : false}
          onCheckedChange={(value) => onToggleAll?.(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ onToggleSelect, isSelected }) => (
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggleSelect}
          aria-label="Select row"
        />
      ),
      size: 40,
      meta: { displayName: 'Chọn', excludeFromExport: true },
    },
    {
      id: 'goods_id',
      accessorKey: 'goods_id',
      header: 'ID',
      size: 70,
      cell: ({ row }) => (
        <span className="font-mono text-sm text-muted-foreground">{row.goods_id}</span>
      ),
      meta: { displayName: 'ID' },
    },
    {
      id: 'goods_sn',
      accessorKey: 'goods_sn',
      header: 'Mã SP',
      size: 100,
      cell: ({ row }) => (
        <span className="font-mono text-xs truncate block max-w-[90px]" title={row.goods_sn || '-'}>
          {row.goods_sn || '-'}
        </span>
      ),
      meta: { displayName: 'Mã SP' },
    },
    {
      id: 'goods_name',
      accessorKey: 'goods_name',
      header: 'Tên sản phẩm PKGX',
      size: 300,
      cell: ({ row }) => (
        <button
          className="font-medium line-clamp-2 text-left hover:text-primary hover:underline cursor-pointer"
          title={`Click để xem chi tiết: ${row.goods_name}`}
          onClick={() => handleOpenDetailDialog(row)}
        >
          {row.goods_name}
        </button>
      ),
      meta: { displayName: 'Tên sản phẩm PKGX' },
    },
    {
      id: 'linkedHrmProduct',
      header: 'Sản phẩm HRM',
      size: 200,
      cell: ({ row }) => (
        row.linkedHrmProduct ? (
          <button 
            className="text-sm truncate block max-w-[190px] text-left hover:text-primary hover:underline cursor-pointer transition-colors" 
            title={`Click để xem chi tiết: ${row.linkedHrmProduct.name}`}
            onClick={(e) => {
              e.stopPropagation();
              // Mở trang sản phẩm trong tab mới
              window.open(`/products?id=${row.linkedHrmProduct.id}`, '_blank');
            }}
          >
            {row.linkedHrmProduct.name}
          </button>
        ) : (
          <span className="text-sm text-muted-foreground">Chưa liên kết</span>
        )
      ),
      meta: { displayName: 'Sản phẩm HRM' },
    },
    {
      id: 'status',
      header: 'Trạng thái',
      size: 110,
      cell: ({ row }) => (
        <div className="text-center">
          {row.linkedHrmProduct ? (
            <Badge variant="default" className="bg-green-500 text-xs">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Đã liên kết
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs">
              Chưa liên kết
            </Badge>
          )}
        </div>
      ),
      meta: { displayName: 'Trạng thái' },
    },
    {
      id: 'actions',
      header: '',
      size: 50,
      cell: ({ row }) => {
        // Helper to build HRM product data for sync
        const buildHrmData = (): HrmProductData | null => {
          if (!row.linkedHrmProduct) return null;
          return {
            systemId: row.linkedHrmProduct.systemId,
            name: row.linkedHrmProduct.name,
            sku: row.linkedHrmProduct.sku,
            sellingPrice: row.linkedHrmProduct.sellingPrice,
            costPrice: row.linkedHrmProduct.costPrice,
            dealPrice: row.linkedHrmProduct.dealPrice,
            quantity: row.linkedHrmProduct.quantity,
            seoKeywords: row.linkedHrmProduct.seoKeywords,
            ktitle: row.linkedHrmProduct.ktitle,
            seoDescription: row.linkedHrmProduct.seoDescription,
            shortDescription: row.linkedHrmProduct.shortDescription,
            description: row.linkedHrmProduct.description,
            isBest: row.linkedHrmProduct.isBest,
            isNew: row.linkedHrmProduct.isNew,
            isHot: row.linkedHrmProduct.isHot,
            isHome: row.linkedHrmProduct.isHome,
            categorySystemId: row.linkedHrmProduct.categorySystemId,
            brandSystemId: row.linkedHrmProduct.brandSystemId,
          };
        };
        
        // Helper to trigger sync with proper HRM data
        const triggerSync = (actionKey: 'sync_all' | 'sync_basic' | 'sync_seo' | 'sync_description' | 'sync_price' | 'sync_inventory' | 'sync_flags') => {
          const hrmData = buildHrmData();
          if (!hrmData) {
            toast.error('Sản phẩm chưa được liên kết với HRM');
            return;
          }
          entitySync.triggerSyncAction(actionKey, row.goods_id, hrmData, row.goods_name);
        };
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {row.linkedHrmProduct ? (
                <>
                  {/* Sync All - Most important action */}
                  <DropdownMenuItem 
                    onClick={() => triggerSync('sync_all')}
                    className="font-medium"
                    title="Đồng bộ tên, SKU, giá, tồn kho, SEO, mô tả, flags"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Đồng bộ tất cả
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  
                  {/* Individual sync actions */}
                  <DropdownMenuItem 
                    onClick={() => triggerSync('sync_basic')}
                    title="Tên sản phẩm, mã SKU, danh mục, thương hiệu"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Thông tin cơ bản
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => triggerSync('sync_price')}
                    title="Giá bán, giá thị trường, giá khuyến mãi"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Giá
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => triggerSync('sync_inventory')}
                    title="Tổng số lượng tồn kho từ tất cả chi nhánh"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Tồn kho
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => triggerSync('sync_seo')}
                    title="Keywords, Meta Title, Meta Description"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    SEO
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => triggerSync('sync_description')}
                    title="Mô tả ngắn (goods_brief), mô tả chi tiết (goods_desc)"
                  >
                    <AlignLeft className="h-4 w-4 mr-2" />
                    Mô tả
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => triggerSync('sync_flags')}
                    title="Nổi bật (best), Hot, Mới (new), Trang chủ"
                  >
                    <Tag className="h-4 w-4 mr-2" />
                    Flags
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleViewOnPkgx(row.goods_id)}>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Xem trên PKGX
                  </DropdownMenuItem>
                  
                  {/* Hủy liên kết */}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => entitySync.handleConfirm(
                      'Hủy liên kết PKGX',
                      `Bạn có chắc muốn hủy liên kết sản phẩm "${row.goods_name}" với HRM?`,
                      () => handleOpenUnlinkDialog(row)
                    )}
                    className="text-destructive focus:text-destructive"
                  >
                    <Unlink className="h-4 w-4 mr-2" />
                    Hủy liên kết
                  </DropdownMenuItem>
                </>
              ) : (
                /* Not linked - show link option */
                <>
                  <DropdownMenuItem onClick={() => handleOpenLinkDialog(row)}>
                    <Link2 className="h-4 w-4 mr-2" />
                    Liên kết với HRM
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      meta: { displayName: '', excludeFromExport: true },
    },
  ], [hrmProducts, getPkgxCatIdByHrmCategory, getPkgxBrandIdByHrmBrand, entitySync]);
  
  // Mobile card renderer
  const renderMobileCard = React.useCallback((row: PkgxProductRow, index: number) => (
    <div className="p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <button 
          className="flex-1 min-w-0 text-left"
          onClick={() => handleOpenDetailDialog(row)}
        >
          <div className="font-medium line-clamp-2 hover:text-primary hover:underline">{row.goods_name}</div>
          <div className="text-xs text-muted-foreground mt-1">
            ID: {row.goods_id} | Mã: {row.goods_sn || '-'}
          </div>
        </button>
        <div className="flex items-center gap-2">
          {row.linkedHrmProduct ? (
            <Badge variant="default" className="bg-green-500 text-xs shrink-0">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Đã liên kết
            </Badge>
          ) : (
            <Badge variant="secondary" className="text-xs shrink-0">Chưa liên kết</Badge>
          )}
          <MobileProductDropdown 
            row={row} 
            entitySync={entitySync}
            onViewOnPkgx={handleViewOnPkgx}
            onOpenLinkDialog={handleOpenLinkDialog}
            onOpenUnlinkDialog={handleOpenUnlinkDialog}
          />
        </div>
      </div>
      
      {row.linkedHrmProduct && (
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">HRM:</span>{' '}
          <button
            className="hover:text-primary hover:underline cursor-pointer transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              window.open(`/products?id=${row.linkedHrmProduct.id}`, '_blank');
            }}
          >
            {row.linkedHrmProduct.name}
          </button>
        </div>
      )}
    </div>
  ), [hrmProducts, getPkgxCatIdByHrmCategory, getPkgxBrandIdByHrmBrand]);
  
  // Handlers
  const handleOpenDetailDialog = React.useCallback(async (row: PkgxProductRow) => {
    setSelectedProductForDetail(row);
    setIsDetailDialogOpen(true);
    setGalleryImages([]); // Reset gallery
    
    // Fetch gallery ảnh
    setIsLoadingGallery(true);
    try {
      const result = await fetchPkgxGallery(row.goods_id);
      if (result.success && result.data) {
        setGalleryImages(result.data);
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setIsLoadingGallery(false);
    }
  }, []);
  
  const handleViewOnPkgx = React.useCallback((goodsId: number) => {
    window.open(`https://phukiengiaxuong.com.vn/admin/goods.php?act=edit&goods_id=${goodsId}`, '_blank');
  }, []);
  
  const handleOpenLinkDialog = React.useCallback((pkgxProduct: PkgxProduct) => {
    setSelectedPkgxProduct(pkgxProduct);
    // Auto-suggest matching products
    validation.updateSuggestions(pkgxProduct);
    // Try to find exact match by SKU first, then by name
    const matchedProduct = hrmProducts.find(
      (p) => p.id === pkgxProduct.goods_sn || p.name === pkgxProduct.goods_name
    );
    setSelectedHrmProductId(matchedProduct?.systemId || '');
    setShowWarningConfirm(false);
    validation.clearValidation();
    setIsLinkDialogOpen(true);
  }, [hrmProducts, validation]);
  
  const handleCloseLinkDialog = React.useCallback(() => {
    setIsLinkDialogOpen(false);
    setSelectedPkgxProduct(null);
    setSelectedHrmProductId('');
    setShowWarningConfirm(false);
    validation.clearValidation();
  }, [validation]);
  
  const handleOpenUnlinkDialog = React.useCallback((pkgxProduct: PkgxProduct) => {
    const hrmProduct = findLinkedHrmProduct(pkgxProduct.goods_id);
    if (hrmProduct) {
      setProductToUnlink({ pkgxProduct, hrmProduct });
      setIsUnlinkDialogOpen(true);
    }
  }, [findLinkedHrmProduct]);
  
  // Get selected products that are linked (for bulk unlink)
  const selectedLinkedProducts = React.useMemo(() => {
    const selectedIds = Object.keys(rowSelection).filter(id => rowSelection[id]);
    return paginatedData.filter(p => selectedIds.includes(p.systemId) && p.linkedHrmProduct);
  }, [rowSelection, paginatedData]);
  
  // All selected rows for bulk actions
  const allSelectedRows = React.useMemo(() => 
    paginatedData.filter(p => rowSelection[p.systemId]),
  [paginatedData, rowSelection]);
  
  // Bulk actions for ResponsiveDataTable
  const bulkActions = React.useMemo(() => [
    {
      label: 'Hủy liên kết',
      icon: Unlink,
      variant: 'destructive' as const,
      disabled: selectedLinkedProducts.length === 0,
      onSelect: () => {
        if (selectedLinkedProducts.length === 0) {
          toast.error('Không có sản phẩm đã liên kết nào được chọn');
          return;
        }
        setIsBulkUnlinkDialogOpen(true);
      },
    },
  ], [selectedLinkedProducts]);
  
  const handleConfirmBulkUnlink = React.useCallback(() => {
    let successCount = 0;
    selectedLinkedProducts.forEach(product => {
      if (product.linkedHrmProduct) {
        productStore.update(product.linkedHrmProduct.systemId as SystemId, { pkgxId: undefined });
        successCount++;
      }
    });
    
    setIsBulkUnlinkDialogOpen(false);
    setRowSelection({});
    toast.success(`Đã hủy liên kết ${successCount} sản phẩm`);
    
    addLog({
      action: 'batch_unlink',
      status: 'success',
      message: `Đã hủy liên kết ${successCount} sản phẩm`,
      details: { total: successCount },
    });
  }, [selectedLinkedProducts, productStore, addLog]);
  
  const handleOpenPushDialog = React.useCallback((row: PkgxProductRow) => {
    setProductToPush(row);
    // Reset to default fields when opening dialog
    setSelectedPushFields(['goods_name', 'sync_prices', 'goods_number']);
    setIsPushDialogOpen(true);
  }, []);
  
  const handleTogglePushField = (field: PushSyncFieldKey) => {
    setSelectedPushFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };
  
  const handleSelectAllPushFields = () => {
    if (selectedPushFields.length === PUSH_SYNC_FIELDS.length) {
      setSelectedPushFields([]);
    } else {
      setSelectedPushFields(PUSH_SYNC_FIELDS.map(f => f.key));
    }
  };
  
  // Sync products from PKGX (limit 100 to fit localStorage)
  const handleSyncFromPkgx = async () => {
    setIsSyncing(true);
    const startTime = Date.now();
    try {
      toast.info('Đang tải sản phẩm từ PKGX...');
      const response = await fetchPkgxProducts(1, 100);
      if (response.success && response.data && !response.data.error) {
        // Lưu vào store để dùng chung với Link Dialog
        setPkgxProducts(response.data.data);
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
        
        addLog({
          action: 'get_products',
          status: 'success',
          message: `Đã lấy ${response.data.data.length}/${response.data.pagination.total_items} sản phẩm từ PKGX`,
          details: { 
            total: response.data.pagination.total_items,
            responseTime: Date.now() - startTime,
          },
        });
        toast.success(`Đã lấy ${response.data.data.length}/${response.data.pagination.total_items} sản phẩm từ PKGX`);
      } else {
        throw new Error(response.error || 'Không thể lấy danh sách sản phẩm');
      }
    } catch (error) {
      addLog({
        action: 'get_products',
        status: 'error',
        message: 'Lỗi khi lấy sản phẩm từ PKGX',
        details: { 
          error: error instanceof Error ? error.message : String(error),
          responseTime: Date.now() - startTime,
        },
      });
      toast.error(error instanceof Error ? error.message : 'Lỗi khi lấy sản phẩm từ PKGX');
    } finally {
      setIsSyncing(false);
    }
  };
  
  // Refresh single product from PKGX
  const handleRefreshSingleProduct = async (goodsId: number) => {
    setIsLoadingProductDetail(true);
    try {
      const response = await fetchPkgxProductById(goodsId);
      if (response.success && response.data) {
        // Update the product in the list
        const updatedProducts = pkgxProducts.map(p => 
          p.goods_id === goodsId ? response.data! : p
        );
        setPkgxProducts(updatedProducts);
        
        // Also update the selected product for detail if it's open
        if (selectedProductForDetail?.goods_id === goodsId) {
          const linked = findLinkedHrmProduct(goodsId);
          const totalInventory = linked 
            ? Object.values(linked.inventoryByBranch || {}).reduce((sum, qty) => sum + qty, 0)
            : 0;
          
          setSelectedProductForDetail({
            ...response.data,
            linkedHrmProduct: linked ? {
              systemId: linked.systemId,
              name: linked.name,
              id: linked.id,
              sku: (linked as any).sku,
              sellingPrice: linked.sellingPrice,
              costPrice: linked.costPrice,
              partnerPrice: (linked as any).partnerPrice,
              acePrice: (linked as any).acePrice,
              dealPrice: (linked as any).dealPrice,
              quantity: totalInventory,
              description: linked.description,
              shortDescription: linked.shortDescription,
              seoDescription: linked.seoDescription,
              seoKeywords: (linked as any).seoKeywords,
              ktitle: linked.ktitle,
              categorySystemId: linked.categorySystemId,
              brandSystemId: linked.brandSystemId,
              isBest: (linked as any).isBest,
              isHot: (linked as any).isHot,
              isNew: (linked as any).isNew,
              isHome: (linked as any).isHome,
              sellerNote: (linked as any).sellerNote,
            } : undefined,
            systemId: response.data.goods_id.toString(),
          });
        }
        
        toast.success('Đã cập nhật thông tin sản phẩm');
        return true;
      } else {
        toast.error(response.error || 'Không thể lấy thông tin sản phẩm');
        return false;
      }
    } catch (error) {
      toast.error('Lỗi khi lấy thông tin sản phẩm');
      return false;
    } finally {
      setIsLoadingProductDetail(false);
    }
  };
  
  // Validate when form values change
  React.useEffect(() => {
    if (isLinkDialogOpen && selectedPkgxProduct && selectedHrmProductId) {
      const hrmProduct = hrmProducts.find(p => p.systemId === selectedHrmProductId);
      const input: ProductMappingInput = {
        hrmProductSystemId: selectedHrmProductId || '',
        hrmProductName: hrmProduct?.name || '',
        hrmProductSku: hrmProduct?.id,
        pkgxProductId: selectedPkgxProduct.goods_id,
        pkgxProductName: selectedPkgxProduct.goods_name,
        pkgxProductSku: selectedPkgxProduct.goods_sn,
      };
      validation.validateAsync(input);
    }
  }, [selectedHrmProductId, selectedPkgxProduct, isLinkDialogOpen, hrmProducts, validation]);
  
  // Confirm link
  const handleConfirmLink = () => {
    if (!selectedPkgxProduct) {
      toast.error('Vui lòng chọn sản phẩm PKGX');
      return;
    }
    
    // Build input for validation
    const hrmProduct = hrmProducts.find(p => p.systemId === selectedHrmProductId);
    const input: ProductMappingInput = {
      hrmProductSystemId: selectedHrmProductId || '',
      hrmProductName: hrmProduct?.name || '',
      hrmProductSku: hrmProduct?.id,
      pkgxProductId: selectedPkgxProduct.goods_id,
      pkgxProductName: selectedPkgxProduct.goods_name,
      pkgxProductSku: selectedPkgxProduct.goods_sn,
    };
    
    // Run final validation
    const result = validation.validate(input);
    
    // Block if there are errors
    if (!result.isValid) {
      toast.error(result.errors[0]?.message || 'Vui lòng kiểm tra lại thông tin');
      return;
    }
    
    // Show warning confirmation if there are warnings and not yet confirmed
    if (result.warnings.length > 0 && !showWarningConfirm) {
      setShowWarningConfirm(true);
      return;
    }
    
    if (!hrmProduct) {
      toast.error('Không tìm thấy sản phẩm HRM');
      return;
    }
    
    productStore.update(selectedHrmProductId as any, { pkgxId: selectedPkgxProduct.goods_id });
    toast.success(`Đã liên kết "${selectedPkgxProduct.goods_name}" với sản phẩm HRM`);
    
    addLog({
      action: 'link_product',
      status: 'success',
      message: `Đã liên kết: ${hrmProduct.name} ↔ ${selectedPkgxProduct.goods_name}`,
      details: { 
        pkgxId: selectedPkgxProduct.goods_id, 
        productId: selectedHrmProductId, 
        productName: hrmProduct.name,
      },
    });
    
    handleCloseLinkDialog();
  };
  
  // Confirm unlink
  const handleConfirmUnlink = () => {
    if (productToUnlink?.hrmProduct) {
      productStore.update(productToUnlink.hrmProduct.systemId, { pkgxId: undefined });
      toast.success(`Đã hủy liên kết sản phẩm`);
      
      addLog({
        action: 'unlink_product',
        status: 'success',
        message: `Đã hủy liên kết: ${productToUnlink.hrmProduct.name}`,
        details: { 
          pkgxId: productToUnlink.pkgxProduct.goods_id, 
          productId: productToUnlink.hrmProduct.systemId,
          productName: productToUnlink.hrmProduct.name,
        },
      });
    }
    setIsUnlinkDialogOpen(false);
    setProductToUnlink(null);
  };
  
  // Confirm push (Push: HRM → PKGX)
  const handleConfirmPush = async () => {
    if (!productToPush || !productToPush.linkedHrmProduct || selectedPushFields.length === 0) {
      toast.error('Vui lòng chọn ít nhất một trường để đồng bộ');
      return;
    }
    
    setIsPushingProduct(true);
    
    try {
      const hrm = productToPush.linkedHrmProduct;
      const pushData: Record<string, any> = {};
      
      for (const field of selectedPushFields) {
        switch (field) {
          // Thông tin cơ bản
          case 'goods_name':
            pushData.goods_name = hrm.name;
            break;
          case 'goods_sn':
            if (hrm.sku) pushData.goods_sn = hrm.sku;
            break;
          case 'goods_brief':
            pushData.goods_brief = hrm.shortDescription || '';
            break;
          case 'goods_desc':
            pushData.goods_desc = hrm.description || '';
            break;
            
          // Giá cả - CHỈ đồng bộ nếu đã cấu hình mapping giá
          case 'sync_prices': {
            const { priceMapping } = settings;
            const hasPriceMapping = priceMapping.shopPrice || priceMapping.marketPrice || priceMapping.partnerPrice || priceMapping.acePrice || priceMapping.dealPrice;
            
            if (!hasPriceMapping) {
              toast.warning('Chưa cấu hình Mapping giá. Vui lòng vào tab "Mapping giá" để thiết lập trước khi đồng bộ giá.');
            } else {
              // Chỉ push giá nếu có mapping tương ứng
              if (priceMapping.shopPrice && hrm.sellingPrice) {
                pushData.shop_price = hrm.sellingPrice;
              }
              if (priceMapping.partnerPrice && hrm.partnerPrice) {
                pushData.partner_price = hrm.partnerPrice;
              }
              if (priceMapping.acePrice && hrm.acePrice) {
                pushData.ace_price = hrm.acePrice;
              }
              if (priceMapping.dealPrice && hrm.dealPrice) {
                pushData.deal_price = hrm.dealPrice;
              }
            }
            break;
          }
            
          // Tồn kho
          case 'goods_number':
            pushData.goods_number = hrm.quantity || 0;
            break;
            
          // Phân loại
          case 'cat_id':
            if (hrm.categorySystemId) {
              const pkgxCatId = getPkgxCatIdByHrmCategory(hrm.categorySystemId);
              if (pkgxCatId) {
                pushData.cat_id = pkgxCatId;
              }
            }
            break;
          case 'brand_id':
            if (hrm.brandSystemId) {
              const pkgxBrandId = getPkgxBrandIdByHrmBrand(hrm.brandSystemId);
              if (pkgxBrandId) {
                pushData.brand_id = pkgxBrandId;
              }
            }
            break;
            
          // SEO
          case 'keywords':
            pushData.keywords = hrm.seoKeywords || hrm.seoDescription || '';
            break;
          case 'meta_title':
            pushData.meta_title = hrm.ktitle || hrm.name || '';
            break;
          case 'meta_desc':
            pushData.meta_desc = hrm.seoDescription || '';
            break;
            
          // Trạng thái hiển thị
          case 'best':
            pushData.best = hrm.isBest ? 1 : 0;
            break;
          case 'hot':
            pushData.hot = hrm.isHot ? 1 : 0;
            break;
          case 'new':
            pushData.new = hrm.isNew ? 1 : 0;
            break;
          case 'ishome':
            pushData.ishome = hrm.isHome ? 1 : 0;
            break;
            
          // Ghi chú
          case 'seller_note':
            pushData.seller_note = hrm.sellerNote || '';
            break;
        }
      }
      
      // Call API to update PKGX
      const response = await updatePkgxProduct(productToPush.goods_id, pushData);
      
      if (response.success) {
        addLog({
          action: 'update_product',
          status: 'success',
          message: `Đã đẩy ${selectedPushFields.length} trường từ HRM → PKGX`,
          details: {
            pkgxId: productToPush.goods_id,
            productId: hrm.systemId,
            productName: hrm.name,
          },
        });
        
        toast.success(`Đã đẩy ${selectedPushFields.length} trường lên PKGX`);
        
        // Only refresh the single product
        await handleRefreshSingleProduct(productToPush.goods_id);
        
        setIsPushDialogOpen(false);
        setProductToPush(null);
      } else {
        throw new Error(response.error || 'Không thể cập nhật sản phẩm trên PKGX');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Lỗi khi đẩy dữ liệu lên PKGX');
      addLog({
        action: 'update_product',
        status: 'error',
        message: 'Lỗi khi đẩy dữ liệu lên PKGX',
        details: { error: error instanceof Error ? error.message : String(error) },
      });
    } finally {
      setIsPushingProduct(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Sản phẩm đã liên kết</CardTitle>
              <CardDescription>
                Đồng bộ và liên kết sản phẩm PKGX với sản phẩm HRM
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSyncFromPkgx} disabled={isSyncing}>
                {isSyncing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                Đồng bộ từ PKGX
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and stats */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm sản phẩm PKGX..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="text-sm text-muted-foreground whitespace-nowrap text-center sm:text-right">
                {pkgxProducts.length} SP | {linkedCount} đã liên kết
                {settings.pkgxProductsLastFetch && (
                  <span className="ml-2 text-xs opacity-70">
                    ({new Date(settings.pkgxProductsLastFetch).toLocaleString('vi-VN')})
                  </span>
                )}
              </div>
            </div>
            
            {/* Tabs - PKGX Products and Linked/Mapping */}
            <Tabs defaultValue="pkgx-products" className="w-full">
              <TabsList>
                <TabsTrigger value="pkgx-products">
                  <Package className="h-4 w-4 mr-2" />
                  Sản phẩm PKGX ({pkgxProducts.length})
                </TabsTrigger>
                <TabsTrigger value="linked">
                  <Link className="h-4 w-4 mr-2" />
                  Đã liên kết ({linkedCount})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="pkgx-products" className="mt-4">
                {/* Warning if not enabled */}
                {!settings.enabled && (
                  <div className="flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800 mb-4">
                    <TriangleAlert className="h-4 w-4 flex-shrink-0" />
                    <p>Tích hợp PKGX chưa được bật. Vui lòng bật trong tab "Cấu hình chung".</p>
                  </div>
                )}
                
                {pkgxProducts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Chưa có sản phẩm từ PKGX.</p>
                    <p className="text-sm mt-1">Bấm "Đồng bộ từ PKGX" để lấy danh sách.</p>
                  </div>
                ) : (
                  <ResponsiveDataTable<PkgxProductRow>
                    columns={columns}
                    data={paginatedData}
                    pageCount={pageCount}
                    pagination={pagination}
                    setPagination={setPagination}
                    rowCount={tableData.length}
                    sorting={sorting}
                    setSorting={setSorting}
                    rowSelection={rowSelection}
                    setRowSelection={setRowSelection}
                    renderMobileCard={renderMobileCard}
                    isLoading={isSyncing}
                    bulkActions={bulkActions}
                    allSelectedRows={allSelectedRows}
                    emptyTitle="Không tìm thấy sản phẩm"
                  />
                )}
              </TabsContent>
              
              <TabsContent value="linked" className="mt-4">
                {linkedCount === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Link className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Chưa có sản phẩm nào được liên kết.</p>
                    <p className="text-sm mt-1">Chọn sản phẩm trong tab "Sản phẩm PKGX" và liên kết với HRM.</p>
                  </div>
                ) : (
                  <ResponsiveDataTable<PkgxProductRow>
                    columns={columns}
                    data={paginatedData.filter(p => p.linkedHrmProduct)}
                    pageCount={Math.ceil(tableData.filter(p => p.linkedHrmProduct).length / pagination.pageSize)}
                    pagination={pagination}
                    setPagination={setPagination}
                    rowCount={tableData.filter(p => p.linkedHrmProduct).length}
                    sorting={sorting}
                    setSorting={setSorting}
                    rowSelection={rowSelection}
                    setRowSelection={setRowSelection}
                    renderMobileCard={renderMobileCard}
                    isLoading={isSyncing}
                    bulkActions={bulkActions}
                    allSelectedRows={allSelectedRows.filter(p => p.linkedHrmProduct)}
                    emptyTitle="Không tìm thấy sản phẩm đã liên kết"
                  />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
      
      {/* Link Dialog - Using shared PkgxMappingDialog component */}
      <PkgxMappingDialog
        open={isLinkDialogOpen}
        onOpenChange={handleCloseLinkDialog}
        type="product"
        hrmItems={hrmProducts
          .filter((p) => !p.pkgxId || (selectedPkgxProduct && p.pkgxId === selectedPkgxProduct.goods_id))
          .map((p) => ({
            id: p.systemId,
            name: p.name,
            subText: p.id,
          }))}
        selectedHrmId={selectedHrmProductId}
        onSelectHrmId={setSelectedHrmProductId}
        pkgxItems={pkgxProducts.map((p) => ({
          id: p.goods_id.toString(),
          name: p.goods_name,
          subText: `ID: ${p.goods_id}`,
        }))}
        selectedPkgxId={selectedPkgxProduct?.goods_id.toString() || ''}
        onSelectPkgxId={(id) => {
          const pkgx = pkgxProducts.find(p => p.goods_id.toString() === id);
          if (pkgx) {
            setSelectedPkgxProduct(pkgx);
            validation.updateSuggestions(pkgx);
          }
        }}
        pkgxSuggestions={validation.suggestions.map(s => ({
          item: { id: s.product.systemId, name: s.product.name, subText: s.product.id },
          score: s.score,
          matchType: s.matchType,
        }))}
        validation={validation.validationResult}
        hasErrors={validation.hasErrors}
        isValidating={validation.isValidating}
        showWarningConfirm={showWarningConfirm}
        onConfirm={handleConfirmLink}
        onCancel={handleCloseLinkDialog}
      />
      
      {/* Unlink Dialog */}
      <Dialog open={isUnlinkDialogOpen} onOpenChange={setIsUnlinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận hủy liên kết</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn hủy liên kết sản phẩm này?
            </DialogDescription>
          </DialogHeader>
          
          {productToUnlink && (
            <div className="space-y-2 py-4">
              <p className="text-sm">
                <span className="font-medium">PKGX:</span> {productToUnlink.pkgxProduct.goods_name}
              </p>
              <p className="text-sm">
                <span className="font-medium">HRM:</span> {productToUnlink.hrmProduct.name}
              </p>
              <p className="text-sm text-muted-foreground">
                Sau khi hủy, sản phẩm sẽ không còn được đồng bộ với PKGX.
              </p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUnlinkDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleConfirmUnlink}>
              <Unlink className="h-4 w-4 mr-2" />
              Hủy liên kết
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Push Dialog - Push (HRM → PKGX) */}
      <Dialog open={isPushDialogOpen} onOpenChange={setIsPushDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-green-600" />
              Đẩy dữ liệu từ HRM → PKGX
            </DialogTitle>
            <DialogDescription>
              Chọn các trường cần đẩy từ HRM lên cập nhật PKGX
            </DialogDescription>
          </DialogHeader>
          
          {productToPush && (
            <div className="space-y-4 py-4">
              {/* Product info */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                <div className="flex-1">
                  <div className="text-sm font-medium text-green-600">HRM (Nguồn)</div>
                  <div className="text-sm truncate">{productToPush.linkedHrmProduct?.name}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-green-600 shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-muted-foreground">PKGX (Đích)</div>
                  <div className="text-sm truncate">{productToPush.goods_name}</div>
                </div>
              </div>
              
              {/* Field selection - Flat grid with tooltip and validation */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Chọn trường cần đẩy lên:</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSelectAllPushFields}
                    className="text-xs h-7"
                  >
                    {selectedPushFields.length === PUSH_SYNC_FIELDS.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                  </Button>
                </div>
                
                <ScrollArea className="h-[350px] pr-4">
                  <TooltipProvider delayDuration={200}>
                    <div className="grid grid-cols-4 gap-2">
                      {PUSH_SYNC_FIELDS.map((field) => {
                        // Check if this is a special field (sync_prices)
                        const isSpecialField = (field as any).isSpecial === true;
                        
                        // Get HRM value for this field
                        const hrmValue = isSpecialField 
                          ? 'Sử dụng cấu hình từ tab Mapping giá'
                          : productToPush?.linkedHrmProduct?.[field.hrmField as keyof typeof productToPush.linkedHrmProduct];
                        const hasValue = isSpecialField || (hrmValue !== undefined && hrmValue !== null && hrmValue !== '');
                        
                        // Format display value
                        const displayValue = (() => {
                          if (isSpecialField) return 'Theo cấu hình Mapping giá';
                          if (!hasValue) return 'Chưa có dữ liệu';
                          if (typeof hrmValue === 'boolean') return hrmValue ? 'Có' : 'Không';
                          if (typeof hrmValue === 'number') {
                            return hrmValue.toLocaleString('vi-VN');
                          }
                          if (typeof hrmValue === 'string') {
                            return hrmValue.length > 50 ? hrmValue.substring(0, 50) + '...' : hrmValue;
                          }
                          return String(hrmValue);
                        })();
                        
                        return (
                          <Tooltip key={field.key}>
                            <TooltipTrigger asChild>
                              <div 
                                className={`flex items-center justify-between p-2 rounded border hover:bg-muted/50 ${
                                  isSpecialField ? 'col-span-2 bg-blue-50 border-blue-200' :
                                  !hasValue ? 'border-dashed opacity-60' : ''
                                }`}
                              >
                                <div className="flex items-center gap-1 min-w-0 flex-1">
                                  <span className="text-xs truncate">{field.label}</span>
                                  {isSpecialField && <Settings2 className="h-3 w-3 text-blue-500 shrink-0" />}
                                </div>
                                <Switch 
                                  checked={selectedPushFields.includes(field.key)} 
                                  onCheckedChange={() => handleTogglePushField(field.key)} 
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs">
                              <div className="text-xs space-y-1">
                                <div className="font-medium">{field.label}</div>
                                {isSpecialField ? (
                                  <div className="text-blue-600">
                                    Giá sẽ được đồng bộ theo cấu hình trong tab "Mapping giá"
                                    <br />
                                    (shop_price, market_price, partner_price, ace_price, deal_price)
                                  </div>
                                ) : (
                                  <div className="text-muted-foreground">
                                    HRM ({field.hrmField}): <span className={hasValue ? 'text-green-600' : 'text-orange-500'}>{displayValue}</span>
                                  </div>
                                )}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </TooltipProvider>
                </ScrollArea>
              </div>
              
              {/* Selected count */}
              <div className="text-sm text-muted-foreground text-center">
                Đã chọn {selectedPushFields.length} / {PUSH_SYNC_FIELDS.length} trường
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPushDialogOpen(false)}>
              Hủy
            </Button>
            <Button 
              onClick={handleConfirmPush} 
              disabled={selectedPushFields.length === 0 || isPushingProduct}
              className="bg-green-600 hover:bg-green-700"
            >
              {isPushingProduct ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Đẩy lên PKGX ({selectedPushFields.length} trường)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Product Detail Dialog - Tabbed design */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedProductForDetail?.goods_thumb && (
                <img 
                  src={buildPkgxImageUrl(selectedProductForDetail.goods_thumb)}
                  alt=""
                  className="w-12 h-12 object-contain rounded border"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              )}
              <div>
                <span className="line-clamp-1">{selectedProductForDetail?.goods_name}</span>
                <DialogDescription className="font-normal">
                  ID: {selectedProductForDetail?.goods_id} | SKU: {selectedProductForDetail?.goods_sn || '-'} | Slug: {selectedProductForDetail?.slug || '-'}
                </DialogDescription>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedProductForDetail && (
            <Tabs defaultValue="basic" className="flex-1 flex flex-col overflow-hidden">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic" className="text-xs">
                  <Package className="h-3 w-3 mr-1" />
                  Cơ bản
                </TabsTrigger>
                <TabsTrigger value="price" className="text-xs">
                  <DollarSign className="h-3 w-3 mr-1" />
                  Giá & Kho
                </TabsTrigger>
                <TabsTrigger value="seo" className="text-xs">
                  <FileText className="h-3 w-3 mr-1" />
                  Nội dung & SEO
                </TabsTrigger>
                <TabsTrigger value="images" className="text-xs">
                  <ImageIcon className="h-3 w-3 mr-1" />
                  Hình ảnh
                </TabsTrigger>
              </TabsList>
              
              {/* Tab: Thông tin cơ bản */}
              <TabsContent value="basic" className="flex-1 overflow-auto mt-4">
                <ScrollArea className="h-[350px] pr-4">
                <div className="space-y-4">
                  {/* Status flags + HRM Link - Cùng hàng */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Trạng thái hiển thị */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Trạng thái hiển thị</Label>
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant={selectedProductForDetail.is_on_sale == 1 ? 'default' : 'secondary'} className="gap-1">
                          {selectedProductForDetail.is_on_sale == 1 ? <CheckCircle2 className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
                          Đăng bán
                        </Badge>
                        <Badge variant={selectedProductForDetail.is_best == 1 ? 'default' : 'secondary'} className="gap-1">
                          {selectedProductForDetail.is_best == 1 ? <Star className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
                          Best
                        </Badge>
                        <Badge variant={selectedProductForDetail.is_hot == 1 ? 'destructive' : 'secondary'} className="gap-1">
                          {selectedProductForDetail.is_hot == 1 ? <Flame className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
                          Hot
                        </Badge>
                        <Badge variant={selectedProductForDetail.is_new == 1 ? 'default' : 'secondary'} className={`gap-1 ${selectedProductForDetail.is_new == 1 ? 'bg-purple-500 hover:bg-purple-600' : ''}`}>
                          {selectedProductForDetail.is_new == 1 ? <Sparkles className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
                          New
                        </Badge>
                        <Badge variant={selectedProductForDetail.is_home == 1 ? 'outline' : 'secondary'} className={`gap-1 ${selectedProductForDetail.is_home == 1 ? 'border-orange-500 text-orange-600' : ''}`}>
                          {selectedProductForDetail.is_home == 1 ? <Home className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
                          Home
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Liên kết HRM */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Liên kết HRM</Label>
                      {selectedProductForDetail.linkedHrmProduct ? (
                        <button
                          onClick={() => {
                            setIsDetailDialogOpen(false);
                            navigate(`/products?id=${selectedProductForDetail.linkedHrmProduct!.id}`);
                          }}
                          className="w-full p-2 border rounded bg-green-50 border-green-200 hover:bg-green-100 transition-colors text-left"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span className="font-medium text-green-700 truncate text-sm">{selectedProductForDetail.linkedHrmProduct.name}</span>
                            <ArrowRight className="h-3 w-3 text-green-600 flex-shrink-0 ml-auto" />
                          </div>
                          <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                            <span>SKU: {selectedProductForDetail.linkedHrmProduct.sku || '-'}</span>
                            <span>Tồn: {selectedProductForDetail.linkedHrmProduct.quantity || 0}</span>
                          </div>
                        </button>
                      ) : (
                        <div className="p-2 border rounded text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                          <XCircle className="h-4 w-4" />
                          Chưa liên kết
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Classification */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Danh mục</Label>
                      <div className="p-2 border rounded text-sm">
                        ID: {selectedProductForDetail.cat_id || '-'}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Thương hiệu</Label>
                      <div className="p-2 border rounded text-sm">
                        ID: {selectedProductForDetail.brand_id || '-'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Timestamps */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Ngày tạo</Label>
                      <div className="p-2 border rounded">
                        {selectedProductForDetail.add_time 
                          ? new Date(selectedProductForDetail.add_time * 1000).toLocaleString('vi-VN')
                          : '-'}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Cập nhật</Label>
                      <div className="p-2 border rounded">
                        {selectedProductForDetail.last_update 
                          ? new Date(selectedProductForDetail.last_update * 1000).toLocaleString('vi-VN')
                          : '-'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Seller note */}
                  {selectedProductForDetail.seller_note && (
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Ghi chú người bán</Label>
                      <div className="p-2 border rounded text-sm">{selectedProductForDetail.seller_note}</div>
                    </div>
                  )}
                </div>
                </ScrollArea>
              </TabsContent>
              
              {/* Tab: Giá & Tồn kho */}
              <TabsContent value="price" className="flex-1 overflow-auto mt-4">
                <ScrollArea className="h-[350px] pr-4">
                <div className="space-y-4">
                  {/* Prices */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Giá bán PKGX</Label>
                    <div className="grid grid-cols-5 gap-2 text-sm">
                      <div className="p-3 border rounded text-center">
                        <div className="text-xs text-muted-foreground">Shop</div>
                        <div className="font-bold text-green-600">{Number(selectedProductForDetail.shop_price || 0).toLocaleString('vi-VN')}đ</div>
                      </div>
                      <div className="p-3 border rounded text-center">
                        <div className="text-xs text-muted-foreground">Thị trường</div>
                        <div>{Number(selectedProductForDetail.market_price || 0).toLocaleString('vi-VN')}đ</div>
                      </div>
                      <div className="p-3 border rounded text-center">
                        <div className="text-xs text-muted-foreground">Đối tác</div>
                        <div>{Number(selectedProductForDetail.partner_price || 0).toLocaleString('vi-VN')}đ</div>
                      </div>
                      <div className="p-3 border rounded text-center">
                        <div className="text-xs text-muted-foreground">ACE</div>
                        <div>{Number(selectedProductForDetail.ace_price || 0).toLocaleString('vi-VN')}đ</div>
                      </div>
                      <div className="p-3 border rounded text-center">
                        <div className="text-xs text-muted-foreground">Deal</div>
                        <div>{Number(selectedProductForDetail.deal_price || 0).toLocaleString('vi-VN')}đ</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Inventory */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Tồn kho</Label>
                    <div className="p-4 border rounded">
                      <div className="text-3xl font-bold">{selectedProductForDetail.goods_number || 0}</div>
                      <div className="text-xs text-muted-foreground">sản phẩm trong kho PKGX</div>
                    </div>
                  </div>
                </div>
                </ScrollArea>
              </TabsContent>
              
              {/* Tab: Nội dung & SEO */}
              <TabsContent value="seo" className="flex-1 overflow-auto mt-4">
                <ScrollArea className="h-[350px] pr-4">
                  <div className="space-y-4">
                    {/* SEO Fields */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Thông tin SEO</Label>
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Meta Title</Label>
                          <div className="p-2 border rounded text-sm">{selectedProductForDetail.meta_title || '-'}</div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Keywords</Label>
                          <div className="p-2 border rounded text-sm">{selectedProductForDetail.keywords || '-'}</div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-muted-foreground">Meta Description</Label>
                          <div className="p-2 border rounded text-sm max-h-20 overflow-y-auto">{selectedProductForDetail.meta_desc || '-'}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Short description */}
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Mô tả ngắn</Label>
                      <div className="p-2 border rounded text-sm max-h-24 overflow-y-auto">
                        {selectedProductForDetail.goods_brief || '-'}
                      </div>
                    </div>
                    
                    {/* Long description */}
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Mô tả chi tiết</Label>
                      <div 
                        className="p-3 border rounded text-sm max-h-60 overflow-y-auto bg-muted/30"
                        dangerouslySetInnerHTML={{ __html: selectedProductForDetail.goods_desc || '<span class="text-muted-foreground">Không có mô tả</span>' }}
                      />
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
              
              {/* Tab: Hình ảnh */}
              <TabsContent value="images" className="flex-1 overflow-auto mt-4">
                <ScrollArea className="h-[350px] pr-4">
                  <div className="space-y-4">
                    {/* Ảnh đại diện - dùng iframe để bypass CORS */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Ảnh sản phẩm</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {selectedProductForDetail.original_img && (
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Ảnh gốc</Label>
                            <a 
                              href={buildPkgxImageUrl(selectedProductForDetail.original_img)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block border rounded p-2 hover:border-primary transition-colors bg-white"
                            >
                              <div className="w-full h-28 flex items-center justify-center overflow-hidden">
                                <img 
                                  src={buildPkgxImageUrl(selectedProductForDetail.original_img)}
                                  alt="Original"
                                  className="max-w-full max-h-full object-contain"
                                  loading="lazy"
                                  referrerPolicy="no-referrer"
                                  onError={(e) => { 
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    target.parentElement!.innerHTML = '<div class="text-xs text-muted-foreground text-center py-8">Click để xem</div>';
                                  }}
                                />
                              </div>
                              <div className="text-xs text-center text-primary mt-1">Xem ảnh gốc</div>
                            </a>
                          </div>
                        )}
                        {selectedProductForDetail.goods_img && (
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Ảnh SP</Label>
                            <a 
                              href={buildPkgxImageUrl(selectedProductForDetail.goods_img)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block border rounded p-2 hover:border-primary transition-colors bg-white"
                            >
                              <div className="w-full h-28 flex items-center justify-center overflow-hidden">
                                <img 
                                  src={buildPkgxImageUrl(selectedProductForDetail.goods_img)}
                                  alt="Goods"
                                  className="max-w-full max-h-full object-contain"
                                  loading="lazy"
                                  referrerPolicy="no-referrer"
                                  onError={(e) => { 
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    target.parentElement!.innerHTML = '<div class="text-xs text-muted-foreground text-center py-8">Click để xem</div>';
                                  }}
                                />
                              </div>
                              <div className="text-xs text-center text-primary mt-1">Xem ảnh SP</div>
                            </a>
                          </div>
                        )}
                        {selectedProductForDetail.goods_thumb && (
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Thumbnail</Label>
                            <a 
                              href={buildPkgxImageUrl(selectedProductForDetail.goods_thumb)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block border rounded p-2 hover:border-primary transition-colors bg-white"
                            >
                              <div className="w-full h-28 flex items-center justify-center overflow-hidden">
                                <img 
                                  src={buildPkgxImageUrl(selectedProductForDetail.goods_thumb)}
                                  alt="Thumbnail"
                                  className="max-w-full max-h-full object-contain"
                                  loading="lazy"
                                  referrerPolicy="no-referrer"
                                  onError={(e) => { 
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    target.parentElement!.innerHTML = '<div class="text-xs text-muted-foreground text-center py-8">Click để xem</div>';
                                  }}
                                />
                              </div>
                              <div className="text-xs text-center text-primary mt-1">Xem thumbnail</div>
                            </a>
                          </div>
                        )}
                      </div>
                      {!selectedProductForDetail.original_img && !selectedProductForDetail.goods_img && !selectedProductForDetail.goods_thumb && (
                        <div className="text-sm text-muted-foreground p-4 border rounded text-center">
                          Chưa có ảnh sản phẩm
                        </div>
                      )}
                    </div>
                    
                    {/* Đường dẫn ảnh - có thể copy */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Đường dẫn ảnh (click để mở)</Label>
                      <div className="space-y-2 text-xs">
                        {selectedProductForDetail.original_img && (
                          <a 
                            href={buildPkgxImageUrl(selectedProductForDetail.original_img)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 border rounded bg-muted/30 hover:bg-muted transition-colors break-all"
                          >
                            <ExternalLink className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                            <span className="text-muted-foreground font-medium">Original:</span>
                            <span className="text-primary underline">{selectedProductForDetail.original_img}</span>
                          </a>
                        )}
                        {selectedProductForDetail.goods_img && (
                          <a 
                            href={buildPkgxImageUrl(selectedProductForDetail.goods_img)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 border rounded bg-muted/30 hover:bg-muted transition-colors break-all"
                          >
                            <ExternalLink className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                            <span className="text-muted-foreground font-medium">Goods:</span>
                            <span className="text-primary underline">{selectedProductForDetail.goods_img}</span>
                          </a>
                        )}
                        {selectedProductForDetail.goods_thumb && (
                          <a 
                            href={buildPkgxImageUrl(selectedProductForDetail.goods_thumb)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 border rounded bg-muted/30 hover:bg-muted transition-colors break-all"
                          >
                            <ExternalLink className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                            <span className="text-muted-foreground font-medium">Thumb:</span>
                            <span className="text-primary underline">{selectedProductForDetail.goods_thumb}</span>
                          </a>
                        )}
                      </div>
                    </div>
                    
                    {/* Album ảnh */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Album ảnh {galleryImages.length > 0 && `(${galleryImages.length})`}
                      </Label>
                      {isLoadingGallery ? (
                        <div className="flex items-center justify-center p-4 border rounded">
                          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                          <span className="ml-2 text-sm text-muted-foreground">Đang tải gallery...</span>
                        </div>
                      ) : galleryImages.length > 0 ? (
                        <div className="grid grid-cols-4 gap-2">
                          {galleryImages.map((img, index) => (
                            <a
                              key={img.img_id || index}
                              href={buildPkgxImageUrl(img.img_url || img.img_original)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block border rounded p-1 hover:border-primary transition-colors bg-white"
                            >
                              <div className="w-full h-20 flex items-center justify-center overflow-hidden">
                                <img
                                  src={buildPkgxImageUrl(img.thumb_url || img.img_url)}
                                  alt={img.img_desc || `Gallery ${index + 1}`}
                                  className="max-w-full max-h-full object-contain"
                                  loading="lazy"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    target.parentElement!.innerHTML = '<div class="text-xs text-muted-foreground text-center py-4">Lỗi</div>';
                                  }}
                                />
                              </div>
                            </a>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground p-4 border rounded text-center">
                          <p>Chưa có ảnh trong album</p>
                          <p className="text-xs mt-1 opacity-70">
                            Sản phẩm này chưa có ảnh gallery hoặc gallery trống
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          )}
          
          <DialogFooter className="mt-4 flex-wrap gap-2">
            {selectedProductForDetail && (
              <>
                <Button variant="outline" size="sm" onClick={() => handleViewOnPkgx(selectedProductForDetail.goods_id)}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Xem trên PKGX
                </Button>
                {selectedProductForDetail.linkedHrmProduct && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      setIsDetailDialogOpen(false);
                      handleOpenUnlinkDialog(selectedProductForDetail);
                    }}
                  >
                    <Unlink className="h-4 w-4 mr-2" />
                    Hủy liên kết
                  </Button>
                )}
              </>
            )}
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Bulk Unlink Confirm Dialog */}
      <AlertDialog open={isBulkUnlinkDialogOpen} onOpenChange={setIsBulkUnlinkDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hủy liên kết {selectedLinkedProducts.length} sản phẩm?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn hủy liên kết {selectedLinkedProducts.length} sản phẩm đã chọn với HRM? 
              Hành động này sẽ xóa liên kết giữa sản phẩm PKGX và HRM, không xóa dữ liệu sản phẩm.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmBulkUnlink} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Xác nhận hủy liên kết
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Confirmation Dialog for sync actions - using shared component */}
      <PkgxSyncConfirmDialog
        confirmAction={entitySync.confirmAction}
        isSyncing={entitySync.isSyncing}
        onConfirm={entitySync.executeAction}
        onCancel={entitySync.cancelConfirm}
      />
    </div>
  );
}
