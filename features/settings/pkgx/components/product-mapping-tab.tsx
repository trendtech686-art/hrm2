import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card.tsx';
import { Button } from '../../../../components/ui/button.tsx';
import { Input } from '../../../../components/ui/input.tsx';
import { Badge } from '../../../../components/ui/badge.tsx';
import { Switch } from '../../../../components/ui/switch.tsx';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../../components/ui/dialog.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select.tsx';
import { Label } from '../../../../components/ui/label.tsx';
import { ScrollArea } from '../../../../components/ui/scroll-area.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs.tsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../../../components/ui/dropdown-menu.tsx';
import { Search, ExternalLink, Link, Unlink, RefreshCw, Loader2, CheckCircle2, Upload, ArrowRight, Settings2, MoreHorizontal, Eye, TriangleAlert, Package, DollarSign, FileText, Link2 } from 'lucide-react';
import { toast } from 'sonner';
import { useProductStore } from '../../../products/store';
import { usePkgxSettingsStore } from '../store';
import { getProducts as fetchPkgxProducts, updateProduct as updatePkgxProduct, getProductById as fetchPkgxProductById } from '../../../../lib/pkgx/api-service';
import type { PkgxProduct } from '../types';
import type { SystemId } from '../../../../lib/id-types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../../components/ui/tooltip.tsx';
import { ResponsiveDataTable } from '../../../../components/data-table/responsive-data-table.tsx';
import type { ColumnDef } from '../../../../components/data-table/types';

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
    suggestedRetailPrice?: number;
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
  const productStore = useProductStore();
  const { settings, addLog, getPkgxCatIdByHrmCategory, getPkgxBrandIdByHrmBrand } = usePkgxSettingsStore();
  
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isSyncing, setIsSyncing] = React.useState(false);
  
  // Load pkgxProducts from localStorage on mount (limit 100)
  const [pkgxProducts, setPkgxProducts] = React.useState<PkgxProduct[]>(() => {
    try {
      const saved = localStorage.getItem('pkgx-products-cache');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.slice(0, 100) : [];
      }
    } catch {
      // ignore
    }
    return [];
  });
  
  // Save to localStorage when pkgxProducts changes (limit 100)
  React.useEffect(() => {
    if (pkgxProducts.length > 0) {
      try {
        localStorage.setItem('pkgx-products-cache', JSON.stringify(pkgxProducts.slice(0, 100)));
      } catch {
        // quota exceeded - ignore
      }
    }
  }, [pkgxProducts]);
  
  // Product detail dialog state
  const [isDetailDialogOpen, setIsDetailDialogOpen] = React.useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = React.useState<PkgxProductRow | null>(null);
  const [isLoadingProductDetail, setIsLoadingProductDetail] = React.useState(false);
  
  // Link dialog state
  const [selectedPkgxProduct, setSelectedPkgxProduct] = React.useState<PkgxProduct | null>(null);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = React.useState(false);
  const [selectedHrmProductId, setSelectedHrmProductId] = React.useState('');
  
  // Unlink dialog state
  const [isUnlinkDialogOpen, setIsUnlinkDialogOpen] = React.useState(false);
  const [productToUnlink, setProductToUnlink] = React.useState<{ pkgxProduct: PkgxProduct; hrmProduct: any } | null>(null);
  
  // Sync dialog state - Push (HRM to PKGX) - Default basic fields + prices
  const [isPushDialogOpen, setIsPushDialogOpen] = React.useState(false);
  const [productToPush, setProductToPush] = React.useState<PkgxProductRow | null>(null);
  const [selectedPushFields, setSelectedPushFields] = React.useState<PushSyncFieldKey[]>(['goods_name', 'sync_prices', 'goods_number']);
  const [isPushingProduct, setIsPushingProduct] = React.useState(false);
  
  // Sync settings dialog - Only for Push settings
  const [isSyncSettingsOpen, setIsSyncSettingsOpen] = React.useState(false);
  const [defaultPushFields, setDefaultPushFields] = React.useState<PushSyncFieldKey[]>(['goods_name', 'sync_prices', 'goods_number']);
  
  // HRM products
  const hrmProducts = React.useMemo(
    () => productStore.getActive().sort((a, b) => a.name.localeCompare(b.name)),
    [productStore]
  );
  
  // Count of linked HRM products
  const linkedCount = React.useMemo(
    () => hrmProducts.filter((p) => p.pkgxId).length,
    [hrmProducts]
  );
  
  // Find HRM product linked to a PKGX product
  const findLinkedHrmProduct = React.useCallback((pkgxId: number) => {
    return hrmProducts.find((p) => p.pkgxId === pkgxId);
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
          suggestedRetailPrice: linked.suggestedRetailPrice,
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
          <span className="text-sm truncate block max-w-[190px]" title={row.linkedHrmProduct.name}>
            {row.linkedHrmProduct.name}
          </span>
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
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleOpenDetailDialog(row)}>
              <Eye className="h-4 w-4 mr-2" />
              Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleViewOnPkgx(row.goods_id)}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Xem trên PKGX
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {row.linkedHrmProduct ? (
              <>
                <DropdownMenuItem onClick={() => handleOpenPushDialog(row)} className="text-green-600">
                  <Upload className="h-4 w-4 mr-2" />
                  Đẩy từ HRM → PKGX
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleOpenUnlinkDialog(row)} className="text-orange-600">
                  <Unlink className="h-4 w-4 mr-2" />
                  Hủy liên kết
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem onClick={() => handleOpenLinkDialog(row)} className="text-green-600">
                <Link className="h-4 w-4 mr-2" />
                Liên kết với HRM
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      meta: { displayName: '', excludeFromExport: true },
    },
  ], []);
  
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleOpenDetailDialog(row)}>
                <Eye className="h-4 w-4 mr-2" />
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleViewOnPkgx(row.goods_id)}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Xem trên PKGX
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {row.linkedHrmProduct ? (
                <>
                  <DropdownMenuItem onClick={() => handleOpenPushDialog(row)} className="text-green-600">
                    <Upload className="h-4 w-4 mr-2" />
                    Đẩy từ HRM → PKGX
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleOpenUnlinkDialog(row)} className="text-orange-600">
                    <Unlink className="h-4 w-4 mr-2" />
                    Hủy liên kết
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={() => handleOpenLinkDialog(row)} className="text-green-600">
                  <Link className="h-4 w-4 mr-2" />
                  Liên kết với HRM
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {row.linkedHrmProduct && (
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">HRM:</span> {row.linkedHrmProduct.name}
        </div>
      )}
    </div>
  ), []);
  
  // Handlers
  const handleOpenDetailDialog = React.useCallback((row: PkgxProductRow) => {
    setSelectedProductForDetail(row);
    setIsDetailDialogOpen(true);
  }, []);
  
  const handleViewOnPkgx = React.useCallback((goodsId: number) => {
    window.open(`https://phukiengiaxuong.com.vn/admin/goods.php?act=edit&goods_id=${goodsId}`, '_blank');
  }, []);
  
  const handleOpenLinkDialog = React.useCallback((pkgxProduct: PkgxProduct) => {
    setSelectedPkgxProduct(pkgxProduct);
    const matchedProduct = hrmProducts.find(
      (p) => p.id === pkgxProduct.goods_sn || p.name === pkgxProduct.goods_name
    );
    setSelectedHrmProductId(matchedProduct?.systemId || '');
    setIsLinkDialogOpen(true);
  }, [hrmProducts]);
  
  const handleOpenUnlinkDialog = React.useCallback((pkgxProduct: PkgxProduct) => {
    const hrmProduct = findLinkedHrmProduct(pkgxProduct.goods_id);
    if (hrmProduct) {
      setProductToUnlink({ pkgxProduct, hrmProduct });
      setIsUnlinkDialogOpen(true);
    }
  }, [findLinkedHrmProduct]);
  
  const handleOpenPushDialog = React.useCallback((row: PkgxProductRow) => {
    setProductToPush(row);
    setSelectedPushFields([...defaultPushFields]);
    setIsPushDialogOpen(true);
  }, [defaultPushFields]);
  
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
  
  const handleSaveDefaultSettings = () => {
    setDefaultPushFields([...selectedPushFields]);
    toast.success('Đã lưu cài đặt trường đẩy lên PKGX');
    setIsSyncSettingsOpen(false);
  };
  
  // Sync products from PKGX (limit 500 to avoid localStorage quota)
  const handleSyncFromPkgx = async () => {
    setIsSyncing(true);
    const startTime = Date.now();
    try {
      toast.info('Đang tải sản phẩm từ PKGX...');
      const response = await fetchPkgxProducts(1, 500);
      if (response.success && response.data && !response.data.error) {
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
              suggestedRetailPrice: linked.suggestedRetailPrice,
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
  
  // Confirm link
  const handleConfirmLink = () => {
    if (!selectedPkgxProduct || !selectedHrmProductId) {
      toast.error('Vui lòng chọn sản phẩm HRM');
      return;
    }
    
    const hrmProduct = hrmProducts.find((p) => p.systemId === selectedHrmProductId);
    if (hrmProduct?.pkgxId && hrmProduct.pkgxId !== selectedPkgxProduct.goods_id) {
      toast.error(`Sản phẩm "${hrmProduct.name}" đã được liên kết với PKGX ID ${hrmProduct.pkgxId}`);
      return;
    }
    
    productStore.update(selectedHrmProductId as any, { pkgxId: selectedPkgxProduct.goods_id });
    toast.success(`Đã liên kết "${selectedPkgxProduct.goods_name}" với sản phẩm HRM`);
    
    addLog({
      action: 'link_product',
      status: 'success',
      message: `Đã liên kết: ${hrmProduct?.name} ↔ ${selectedPkgxProduct.goods_name}`,
      details: { 
        pkgxId: selectedPkgxProduct.goods_id, 
        productId: selectedHrmProductId, 
        productName: hrmProduct?.name,
      },
    });
    
    setIsLinkDialogOpen(false);
    setSelectedPkgxProduct(null);
    setSelectedHrmProductId('');
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
              if (priceMapping.marketPrice && hrm.suggestedRetailPrice) {
                pushData.market_price = hrm.suggestedRetailPrice;
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
              <Button variant="outline" onClick={() => setIsSyncSettingsOpen(true)}>
                <Settings2 className="h-4 w-4 mr-2" />
                Cài đặt
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
            
            {/* Warning if not enabled */}
            {!settings.enabled && (
              <div className="flex items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
                <TriangleAlert className="h-4 w-4 flex-shrink-0" />
                <p>Tích hợp PKGX chưa được bật. Vui lòng bật trong tab "Cấu hình chung".</p>
              </div>
            )}
            
            {/* ResponsiveDataTable */}
            <ResponsiveDataTable<PkgxProductRow>
              columns={columns}
              data={paginatedData}
              pageCount={pageCount}
              pagination={pagination}
              setPagination={setPagination}
              rowCount={tableData.length}
              sorting={sorting}
              setSorting={setSorting}
              renderMobileCard={renderMobileCard}
              isLoading={isSyncing}
              emptyTitle="Chưa có dữ liệu sản phẩm"
              emptyDescription="Bấm 'Đồng bộ từ PKGX' để lấy danh sách sản phẩm"
              emptyAction={
                <Button onClick={handleSyncFromPkgx} disabled={isSyncing}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Đồng bộ từ PKGX
                </Button>
              }
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Link Dialog */}
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Liên kết sản phẩm</DialogTitle>
            <DialogDescription>
              Chọn sản phẩm HRM để liên kết với sản phẩm PKGX
            </DialogDescription>
          </DialogHeader>
          
          {selectedPkgxProduct && (
            <div className="space-y-4 py-4">
              <div className="rounded-lg bg-muted p-3">
                <p className="text-sm font-medium">Sản phẩm PKGX:</p>
                <p className="text-sm">{selectedPkgxProduct.goods_name}</p>
                <p className="text-xs text-muted-foreground">
                  ID: {selectedPkgxProduct.goods_id} | Mã: {selectedPkgxProduct.goods_sn || '-'}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label>Chọn sản phẩm HRM</Label>
                <Select value={selectedHrmProductId} onValueChange={setSelectedHrmProductId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn sản phẩm HRM..." />
                  </SelectTrigger>
                  <SelectContent>
                    {hrmProducts
                      .filter((p) => !p.pkgxId || p.pkgxId === selectedPkgxProduct.goods_id)
                      .map((product) => (
                        <SelectItem key={product.systemId} value={product.systemId}>
                          {product.name} ({product.id})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleConfirmLink}>
              <Link className="h-4 w-4 mr-2" />
              Liên kết
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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
      
      {/* Sync Settings Dialog */}
      <Dialog open={isSyncSettingsOpen} onOpenChange={setIsSyncSettingsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              Cài đặt đồng bộ mặc định
            </DialogTitle>
            <DialogDescription>
              Cấu hình các trường mặc định khi đẩy dữ liệu từ HRM → PKGX
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            {/* Push settings - only this needs config */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                  <Upload className="h-4 w-4" />
                  Đẩy từ HRM → PKGX ({selectedPushFields.length}/{PUSH_SYNC_FIELDS.length})
                </div>
                <Button variant="ghost" size="sm" className="text-xs h-6" onClick={handleSelectAllPushFields}>
                  {selectedPushFields.length === PUSH_SYNC_FIELDS.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                </Button>
              </div>
              <ScrollArea className="h-[350px] pr-2">
                <TooltipProvider delayDuration={200}>
                  <div className="grid grid-cols-4 gap-2">
                    {PUSH_SYNC_FIELDS.map((field) => {
                      const isSpecialField = (field as any).isSpecial === true;
                      return (
                        <Tooltip key={field.key}>
                          <TooltipTrigger asChild>
                            <div className={`flex items-center justify-between p-2 rounded border hover:bg-muted/50 ${
                              isSpecialField ? 'col-span-2 bg-blue-50 border-blue-200' : ''
                            }`}>
                              <div className="flex items-center gap-1 min-w-0 flex-1">
                                <span className="text-xs truncate">{field.label}</span>
                                {isSpecialField && <Settings2 className="h-3 w-3 text-blue-500 shrink-0" />}
                              </div>
                              <Switch 
                                checked={selectedPushFields.includes(field.key)} 
                                onCheckedChange={() => {
                                  setSelectedPushFields(prev => 
                                    prev.includes(field.key) 
                                      ? prev.filter(f => f !== field.key)
                                      : [...prev, field.key]
                                  );
                                }}
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <div className="text-xs">
                              <div className="font-medium">{field.label}</div>
                              {isSpecialField ? (
                                <div className="text-blue-600">Sử dụng cấu hình từ tab "Mapping giá"</div>
                              ) : (
                                <div className="text-muted-foreground">PKGX: {field.key} ↔ HRM: {field.hrmField}</div>
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
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSyncSettingsOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveDefaultSettings}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Lưu cài đặt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Product Detail Dialog - Tabbed design */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedProductForDetail?.goods_thumb && (
                <img 
                  src={selectedProductForDetail.goods_thumb.startsWith('http') 
                    ? selectedProductForDetail.goods_thumb 
                    : `https://phukiengiaxuong.com.vn/${selectedProductForDetail.goods_thumb.replace(/^\//, '')}`}
                  alt=""
                  className="w-10 h-10 object-contain rounded border"
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
                <TabsTrigger value="link" className="text-xs">
                  <Link2 className="h-3 w-3 mr-1" />
                  Liên kết
                </TabsTrigger>
              </TabsList>
              
              {/* Tab: Thông tin cơ bản */}
              <TabsContent value="basic" className="flex-1 overflow-auto mt-4">
                <div className="space-y-4">
                  {/* Status badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={selectedProductForDetail.is_on_sale === 1 ? 'default' : 'secondary'}>
                      {selectedProductForDetail.is_on_sale === 1 ? 'Đang bán' : 'Ngừng bán'}
                    </Badge>
                    {selectedProductForDetail.is_best === 1 && <Badge>Best</Badge>}
                    {selectedProductForDetail.is_hot === 1 && <Badge variant="destructive">Hot</Badge>}
                    {selectedProductForDetail.is_new === 1 && <Badge variant="secondary">New</Badge>}
                    {selectedProductForDetail.is_home === 1 && <Badge variant="outline">Home</Badge>}
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
              </TabsContent>
              
              {/* Tab: Giá & Tồn kho */}
              <TabsContent value="price" className="flex-1 overflow-auto mt-4">
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
              
              {/* Tab: Liên kết HRM */}
              <TabsContent value="link" className="flex-1 overflow-auto mt-4">
                <div className="space-y-4">
                  {selectedProductForDetail.linkedHrmProduct ? (
                    <>
                      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-700">Đã liên kết với sản phẩm HRM</span>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="p-3 border rounded space-y-2">
                          <div className="font-medium">{selectedProductForDetail.linkedHrmProduct.name}</div>
                          <div className="text-sm text-muted-foreground">
                            SKU: {selectedProductForDetail.linkedHrmProduct.sku || '-'}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="p-2 border rounded">
                            <div className="text-xs text-muted-foreground">Giá bán HRM</div>
                            <div className="font-medium">{Number(selectedProductForDetail.linkedHrmProduct.sellingPrice || 0).toLocaleString('vi-VN')}đ</div>
                          </div>
                          <div className="p-2 border rounded">
                            <div className="text-xs text-muted-foreground">Tồn kho HRM</div>
                            <div className="font-medium">{selectedProductForDetail.linkedHrmProduct.quantity || 0}</div>
                          </div>
                        </div>
                        
                        {/* Compare prices */}
                        <div className="p-3 border rounded bg-muted/30">
                          <Label className="text-xs text-muted-foreground">So sánh giá</Label>
                          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">PKGX Shop: </span>
                              <span className="font-medium">{Number(selectedProductForDetail.shop_price || 0).toLocaleString('vi-VN')}đ</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">HRM: </span>
                              <span className="font-medium">{Number(selectedProductForDetail.linkedHrmProduct.sellingPrice || 0).toLocaleString('vi-VN')}đ</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Link2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">Sản phẩm chưa được liên kết với HRM</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4"
                        onClick={() => {
                          setIsDetailDialogOpen(false);
                          handleOpenLinkDialog(selectedProductForDetail);
                        }}
                      >
                        <Link className="h-4 w-4 mr-2" />
                        Liên kết ngay
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
          
          <DialogFooter className="mt-4 flex-wrap gap-2">
            {selectedProductForDetail && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleRefreshSingleProduct(selectedProductForDetail.goods_id)}
                  disabled={isLoadingProductDetail}
                >
                  {isLoadingProductDetail ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  <span className="ml-2">Tải lại</span>
                </Button>
                {selectedProductForDetail.linkedHrmProduct && (
                  <Button variant="outline" size="sm" onClick={() => {
                    setIsDetailDialogOpen(false);
                    handleOpenPushDialog(selectedProductForDetail);
                  }}>
                    <Upload className="h-4 w-4 mr-2" />
                    Đẩy lên PKGX
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => handleViewOnPkgx(selectedProductForDetail.goods_id)}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Xem trên PKGX
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
