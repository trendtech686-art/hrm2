import * as React from "react";
import * as ReactRouterDOM from "react-router-dom";
import type { Product } from './types.ts'
import { Checkbox } from "../../components/ui/checkbox.tsx"
import { DataTableColumnHeader } from "../../components/data-table/data-table-column-header.tsx"
import { Badge } from "../../components/ui/badge.tsx"
import { Switch } from "../../components/ui/switch.tsx"
import { DatePicker } from "../../components/ui/date-picker.tsx"
import type { ColumnDef } from '../../components/data-table/types.ts';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../../components/ui/dropdown-menu.tsx";
import { Button } from "../../components/ui/button.tsx";
import { MoreHorizontal, RotateCcw, Globe, RefreshCw, FileText, DollarSign, Package, Search, AlignLeft, Tag, Image, ExternalLink, Upload, Link2, Unlink, ShoppingCart, Wrench, FileDigit, Layers, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { usePricingPolicyStore } from '../settings/pricing/store.ts';
import { useProductCategoryStore } from '../settings/inventory/product-category-store.ts';
import { useProductTypeStore } from '../settings/inventory/product-type-store.ts';
import { useBrandStore } from '../settings/inventory/brand-store.ts';
import { useSupplierStore } from '../suppliers/store.ts';
import { useEmployeeStore } from '../employees/store.ts';
import { StockAlertBadge } from './components/stock-alert-badges.tsx';
import { formatDateForDisplay } from '@/lib/date-utils';
import { InlineEditableCell, InlineEditableNumberCell } from '../../components/shared/inline-editable-cell.tsx';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog.tsx";

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '-';
    return new Intl.NumberFormat('vi-VN').format(value);
};

const formatDateTime = (dateStr?: string | null) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
};

const getStatusBadgeVariant = (status?: 'active' | 'inactive' | 'discontinued'): "success" | "secondary" | "destructive" => {
  switch (status) {
    case 'active': return 'success';
    case 'inactive': return 'secondary';
    case 'discontinued': return 'destructive';
    default: return 'secondary';
  }
};

const getStatusLabel = (status?: 'active' | 'inactive' | 'discontinued'): string => {
  switch (status) {
    case 'active': return 'Đang bán';
    case 'inactive': return 'Ngừng bán';
    case 'discontinued': return 'Ngừng SX';
    default: return 'Không rõ';
  }
};

// ═══════════════════════════════════════════════════════════════
// SEO SCORE HELPERS - Tính điểm SEO cho từng website
// ═══════════════════════════════════════════════════════════════
import type { WebsiteSeoData } from './types.ts';

const calculateSeoScore = (seo: WebsiteSeoData | undefined): number => {
  if (!seo) return 0;
  
  let score = 0;
  if (seo.seoTitle && seo.seoTitle.length >= 30) score += 25;
  if (seo.metaDescription && seo.metaDescription.length >= 100) score += 25;
  if (seo.seoKeywords) score += 15;
  if (seo.shortDescription) score += 15;
  if (seo.longDescription && seo.longDescription.length >= 200) score += 20;
  
  return score;
};

const getSeoStatusBadge = (score: number) => {
  if (score >= 80) return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="h-3 w-3 mr-1" /> {score}%</Badge>;
  if (score >= 50) return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><AlertTriangle className="h-3 w-3 mr-1" /> {score}%</Badge>;
  if (score > 0) return <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100"><XCircle className="h-3 w-3 mr-1" /> {score}%</Badge>;
  return <Badge variant="outline" className="text-muted-foreground">—</Badge>;
};

// ═══════════════════════════════════════════════════════════════
// PKGX Actions Cell Component - Tách riêng để dùng hooks
// ═══════════════════════════════════════════════════════════════
type PkgxActionsCellProps = {
  row: Product;
  onPkgxUpdatePrice?: (product: Product) => void;
  onPkgxPublish?: (product: Product) => void;
  onPkgxUpdateSeo?: (product: Product) => void;
  onPkgxSyncInventory?: (product: Product) => void;
  onPkgxSyncDescription?: (product: Product) => void;
  onPkgxSyncFlags?: (product: Product) => void;
  onPkgxSyncBasicInfo?: (product: Product) => void;
  onPkgxSyncImages?: (product: Product) => void;
  onPkgxSyncAll?: (product: Product) => void;
  onPkgxLink?: (product: Product) => void;
  onPkgxUnlink?: (product: Product) => void;
};

function PkgxActionsCell({
  row,
  onPkgxUpdatePrice,
  onPkgxPublish,
  onPkgxUpdateSeo,
  onPkgxSyncInventory,
  onPkgxSyncDescription,
  onPkgxSyncFlags,
  onPkgxSyncBasicInfo,
  onPkgxSyncImages,
  onPkgxSyncAll,
  onPkgxLink,
  onPkgxUnlink,
}: PkgxActionsCellProps) {
  // State for confirmation dialog - MUST be called before any early returns
  const [confirmAction, setConfirmAction] = React.useState<{
    open: boolean;
    title: string;
    description: string;
    action: (() => void) | null;
  }>({ open: false, title: '', description: '', action: null });

  // Don't show for deleted items
  if (row.deletedAt) return null;
  
  const hasPkgxId = !!row.pkgxId;

  const handleConfirm = (title: string, description: string, action: () => void) => {
    setConfirmAction({ open: true, title, description, action });
  };

  const executeAction = () => {
    if (confirmAction.action) {
      confirmAction.action();
    }
    setConfirmAction({ open: false, title: '', description: '', action: null });
  };
  
  return (
    <>
      <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button 
              variant="ghost" 
              className={`h-8 w-8 p-0 ${hasPkgxId ? "text-primary" : "text-muted-foreground"}`}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="sr-only">PKGX menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            {hasPkgxId ? (
              <>
                {/* Sync All - Most important action */}
                {onPkgxSyncAll && (
                  <DropdownMenuItem 
                    onSelect={() => handleConfirm(
                      'Đồng bộ tất cả',
                      `Bạn có chắc muốn đồng bộ TẤT CẢ thông tin sản phẩm "${row.name}" lên PKGX?`,
                      () => onPkgxSyncAll(row)
                    )}
                    className="font-medium"
                    title="Đồng bộ tên, SKU, giá, tồn kho, SEO, mô tả, flags, hình ảnh đại diện + album"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Đồng bộ tất cả
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                
                {/* Individual sync actions */}
                {onPkgxSyncBasicInfo && (
                  <DropdownMenuItem 
                    onSelect={() => handleConfirm(
                      'Đồng bộ thông tin cơ bản',
                      `Đồng bộ tên, SKU, danh mục, thương hiệu của "${row.name}" lên PKGX?`,
                      () => onPkgxSyncBasicInfo(row)
                    )}
                    title="Tên sản phẩm, mã SKU, danh mục, thương hiệu"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Thông tin cơ bản
                  </DropdownMenuItem>
                )}
                {onPkgxUpdatePrice && (
                  <DropdownMenuItem 
                    onSelect={() => handleConfirm(
                      'Đồng bộ giá',
                      `Đồng bộ giá sản phẩm "${row.name}" lên PKGX? (bao gồm giá ace thành viên)`,
                      () => onPkgxUpdatePrice(row)
                    )}
                    title="Giá bán, giá thị trường, giá đối tác + giá ace thành viên"
                  >
                    <DollarSign className="mr-2 h-4 w-4" />
                    Giá
                  </DropdownMenuItem>
                )}
                {onPkgxSyncInventory && (
                  <DropdownMenuItem 
                    onSelect={() => handleConfirm(
                      'Đồng bộ tồn kho',
                      `Đồng bộ tồn kho sản phẩm "${row.name}" lên PKGX?`,
                      () => onPkgxSyncInventory(row)
                    )}
                    title="Tổng số lượng tồn kho từ tất cả chi nhánh"
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Tồn kho
                  </DropdownMenuItem>
                )}
                {onPkgxUpdateSeo && (
                  <DropdownMenuItem 
                    onSelect={() => handleConfirm(
                      'Đồng bộ SEO',
                      `Đồng bộ SEO (keywords, meta title, meta description) của "${row.name}" lên PKGX?`,
                      () => onPkgxUpdateSeo(row)
                    )}
                    title="Keywords, Meta Title, Meta Description"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    SEO
                  </DropdownMenuItem>
                )}
                {onPkgxSyncDescription && (
                  <DropdownMenuItem 
                    onSelect={() => handleConfirm(
                      'Đồng bộ mô tả',
                      `Đồng bộ mô tả ngắn và mô tả chi tiết của "${row.name}" lên PKGX?`,
                      () => onPkgxSyncDescription(row)
                    )}
                    title="Mô tả ngắn (goods_brief), mô tả chi tiết (goods_desc)"
                  >
                    <AlignLeft className="mr-2 h-4 w-4" />
                    Mô tả
                  </DropdownMenuItem>
                )}
                {onPkgxSyncFlags && (
                  <DropdownMenuItem 
                    onSelect={() => handleConfirm(
                      'Đồng bộ flags',
                      `Đồng bộ flags (nổi bật, mới, hot, hiển thị) của "${row.name}" lên PKGX?`,
                      () => onPkgxSyncFlags(row)
                    )}
                    title="Nổi bật (best), Hot, Mới (new), Trang chủ, Đang bán"
                  >
                    <Tag className="mr-2 h-4 w-4" />
                    Flags
                  </DropdownMenuItem>
                )}
                {onPkgxSyncImages && (
                  <DropdownMenuItem 
                    onSelect={() => handleConfirm(
                      'Đồng bộ hình ảnh',
                      `Đồng bộ hình ảnh đại diện và album ảnh của "${row.name}" lên PKGX?`,
                      () => onPkgxSyncImages(row)
                    )}
                    title="Hình ảnh đại diện (original_img) + Album ảnh (goods_gallery)"
                  >
                    <Image className="mr-2 h-4 w-4" />
                    Hình ảnh
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onSelect={() => window.open(`https://phukiengiaxuong.com.vn/admin/goods.php?act=edit&goods_id=${row.pkgxId}`, '_blank')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Xem trên PKGX
                </DropdownMenuItem>
                
                {/* Hủy liên kết PKGX */}
                {onPkgxUnlink && (
                  <DropdownMenuItem 
                    onSelect={() => handleConfirm(
                      'Hủy liên kết PKGX',
                      `Bạn có chắc muốn hủy liên kết sản phẩm "${row.name}" với PKGX? (Sản phẩm vẫn tồn tại trên PKGX)`,
                      () => onPkgxUnlink(row)
                    )}
                    className="text-destructive"
                  >
                    <Unlink className="mr-2 h-4 w-4" />
                    Hủy liên kết
                  </DropdownMenuItem>
                )}
              </>
            ) : (
              /* Actions for products WITHOUT pkgxId */
              <>
                {/* Publish to PKGX - Tạo mới sản phẩm trên PKGX */}
                {onPkgxPublish && (
                  <DropdownMenuItem onSelect={() => handleConfirm(
                    'Đăng lên PKGX',
                    `Bạn có chắc muốn đăng sản phẩm "${row.name}" lên PKGX?`,
                    () => onPkgxPublish(row)
                  )}>
                    <Upload className="mr-2 h-4 w-4" />
                    Đăng lên PKGX
                  </DropdownMenuItem>
                )}
                
                {/* Link to existing PKGX product */}
                {onPkgxLink && (
                  <DropdownMenuItem onSelect={() => onPkgxLink(row)}>
                    <Link2 className="mr-2 h-4 w-4" />
                    Liên kết với PKGX
                  </DropdownMenuItem>
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Confirmation Dialog */}
      <AlertDialog open={confirmAction.open} onOpenChange={(open) => !open && setConfirmAction({ open: false, title: '', description: '', action: null })}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmAction.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirmAction.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={(e) => { e.stopPropagation(); executeAction(); }}>Xác nhận</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export const getColumns = (
  onDelete: (systemId: string) => void,
  onRestore: (systemId: string) => void,
  navigate: (path: string) => void,
  onPrintLabel?: (product: Product) => void,
  // PKGX handlers
  onPkgxUpdatePrice?: (product: Product) => void,
  onPkgxPublish?: (product: Product) => void,
  onPkgxUpdateSeo?: (product: Product) => void,
  onPkgxSyncInventory?: (product: Product) => void,
  onPkgxSyncDescription?: (product: Product) => void,
  onPkgxSyncFlags?: (product: Product) => void,
  onPkgxSyncBasicInfo?: (product: Product) => void,
  onPkgxSyncImages?: (product: Product) => void,
  onPkgxSyncAll?: (product: Product) => void,
  onPkgxLink?: (product: Product) => void,
  onPkgxUnlink?: (product: Product) => void,
  // Status & Inline edit handlers
  onStatusChange?: (product: Product, newStatus: 'active' | 'inactive') => void,
  onInventoryChange?: (product: Product, newQuantity: number) => void,
  // Field update handler for inline editing
  onFieldUpdate?: (product: Product, field: string, value: string | number | boolean) => void,
): ColumnDef<Product>[] => {
  
  const { data: pricingPolicies } = usePricingPolicyStore.getState();
  const activePricingPolicies = pricingPolicies.filter(p => p.isActive);
  const defaultSellingPolicy = pricingPolicies.find(p => p.type === 'Bán hàng' && p.isDefault);

  return [
    {
      id: "select",
      header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={isAllPageRowsSelected ? true : isSomePageRowsSelected ? "indeterminate" : false}
            onCheckedChange={(value) => onToggleAll?.(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ isSelected, onToggleSelect }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onToggleSelect}
            aria-label="Select row"
          />
        </div>
      ),
      size: 48,
      meta: {
        displayName: "Select",
        sticky: "left",
      },
    },
    {
      id: "id",
      accessorKey: "id",
      header: "Mã SP (SKU)",
      cell: ({ row }) => <div className="text-body-sm font-medium">{row.id}</div>,
      meta: { displayName: "Mã SP (SKU)" },
      size: 150,
    },
    {
      id: "name",
      accessorKey: "name",
      header: "Tên sản phẩm/dịch vụ",
      cell: ({ row }) => (
        <div>
          <div className="text-body-sm font-medium flex items-center gap-2 flex-wrap">
            {row.name}
            {row.type === 'combo' && (
              <Badge variant="secondary" className="text-body-xs">Combo</Badge>
            )}
            {row.pkgxId && (
              <Badge variant="secondary" className="text-body-xs">
                <Globe className="h-3 w-3" />
                PKGX
              </Badge>
            )}
            <StockAlertBadge product={row} />
          </div>
        </div>
      ),
      meta: { displayName: "Tên sản phẩm/dịch vụ" },
    },
    {
      id: "category",
      accessorKey: "categorySystemId",
      header: "Danh mục",
      cell: ({ row }) => {
        const categoryId = row.categorySystemId;
        if (!categoryId) return row.category || '-';
        const category = useProductCategoryStore.getState().findById(categoryId);
        return category ? (category.path || category.name) : (row.category || '-');
      },
      meta: { displayName: "Danh mục" },
    },
    {
      id: "type",
      accessorKey: "type",
      header: "Loại",
      cell: ({ row }) => {
        const typeConfig = {
          physical: { label: 'Hàng hóa', icon: ShoppingCart, variant: 'secondary' as const },
          service: { label: 'Dịch vụ', icon: Wrench, variant: 'secondary' as const },
          digital: { label: 'Sản phẩm số', icon: FileDigit, variant: 'secondary' as const },
          combo: { label: 'Combo', icon: Layers, variant: 'secondary' as const }
        };
        const type = (row.type || 'physical') as keyof typeof typeConfig;
        const config = typeConfig[type] || typeConfig.physical;
        const Icon = config.icon;
        return (
          <Badge variant={config.variant} className="gap-1">
            <Icon className="h-3 w-3" />
            {config.label}
          </Badge>
        );
      },
      meta: { displayName: "Loại" },
    },
    {
      id: "barcode",
      accessorKey: "barcode",
      header: "Mã vạch",
      cell: ({ row }) => row.barcode || '-',
      meta: { displayName: "Mã vạch" },
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => {
        const isActive = row.status === 'active';
        return (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Switch
              checked={isActive}
              onCheckedChange={(checked) => {
                onStatusChange?.(row, checked ? 'active' : 'inactive');
              }}
            />
            <span className={`text-xs ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
              {isActive}
            </span>
          </div>
        );
      },
      meta: { displayName: "Trạng thái" },
    },
    {
      id: "costPrice",
      accessorKey: "costPrice",
      header: "Giá vốn",
      cell: ({ row }) => {
        if (onFieldUpdate) {
          return (
            <div onClick={(e) => e.stopPropagation()}>
              <InlineEditableNumberCell
                value={row.costPrice || 0}
                onSave={(newValue) => onFieldUpdate(row, 'costPrice', newValue)}
              />
            </div>
          );
        }
        return formatCurrency(row.costPrice);
      },
      meta: { displayName: "Giá vốn" },
    },
    {
      id: "inventory",
      // FIX: Correct accessorKey to match the property in the Product type.
      accessorKey: "inventoryByBranch",
      header: "Tồn kho",
      // FIX: Correctly calculate the total inventory from the inventoryByBranch object.
      cell: ({ row }) => {
        // Combo không có tồn kho thực tế
        if (row.type === 'combo') {
          return <span className="text-muted-foreground italic">Ảo</span>;
        }
        const totalInventory = Object.values(row.inventoryByBranch).reduce((sum, qty) => sum + qty, 0);
        
        if (onInventoryChange) {
          return (
            <div onClick={(e) => e.stopPropagation()}>
              <InlineEditableNumberCell
                value={totalInventory}
                onSave={(newValue) => onInventoryChange(row, newValue)}
              />
            </div>
          );
        }
        
        return totalInventory;
      },
      meta: { displayName: "Tồn kho" },
    },
    {
      id: "unit",
      accessorKey: "unit",
      header: "Đơn vị tính",
      cell: ({ row }) => row.unit,
      meta: { displayName: "Đơn vị tính" },
    },
    {
      id: "tags",
      accessorKey: "tags",
      header: "Tags",
      cell: ({ row }) => {
        if (!row.tags || row.tags.length === 0) return '-';
        return (
          <div className="flex flex-wrap gap-1">
            {row.tags.slice(0, 2).map(tag => (
              <Badge key={tag} variant="outline" className="text-body-xs">{tag}</Badge>
            ))}
            {row.tags.length > 2 && (
              <span className="text-body-xs text-muted-foreground">+{row.tags.length - 2}</span>
            )}
          </div>
        );
      },
      meta: { displayName: "Tags" },
    },
    {
      id: "committed",
      header: "Đang giao dịch",
      cell: ({ row }) => Object.values(row.committedByBranch || {}).reduce((sum, qty) => sum + qty, 0),
      meta: { displayName: "Đang giao dịch" },
    },
    {
      id: "inTransit",
      header: "Đang về",
      cell: ({ row }) => Object.values(row.inTransitByBranch || {}).reduce((sum, qty) => sum + qty, 0),
      meta: { displayName: "Đang về" },
    },
    {
      id: "totalSold",
      accessorKey: "totalSold",
      header: "Đã bán",
      cell: ({ row }) => row.totalSold || 0,
      meta: { displayName: "Đã bán" },
    },
    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: "Ngày tạo",
      cell: ({ row }) => {
        if (!row.createdAt) return '-';
        return formatDateForDisplay(row.createdAt);
      },
      meta: { displayName: "Ngày tạo" },
    },
    // ═══════════════════════════════════════════════════════════════
    // THÊM CÁC CỘT MỚI - Thương hiệu
    // ═══════════════════════════════════════════════════════════════
    {
      id: "brand",
      accessorKey: "brandSystemId",
      header: "Thương hiệu",
      cell: ({ row }) => {
        const brandId = row.brandSystemId;
        if (!brandId) return '-';
        const brand = useBrandStore.getState().findById(brandId);
        return brand ? brand.name : '-';
      },
      meta: { displayName: "Thương hiệu" },
    },
    {
      id: "pkgxId",
      accessorKey: "pkgxId",
      header: "ID PKGX",
      cell: ({ row }) => {
        if (onFieldUpdate) {
          return (
            <div onClick={(e) => e.stopPropagation()}>
              <InlineEditableNumberCell
                value={row.pkgxId || 0}
                onSave={(newValue) => onFieldUpdate(row, 'pkgxId', newValue)}
              />
            </div>
          );
        }
        return row.pkgxId || '-';
      },
      meta: { displayName: "ID PKGX" },
    },
    // SEO PKGX Score
    {
      id: "seoPkgx",
      accessorKey: "seoPkgx",
      header: "SEO PKGX",
      cell: ({ row }) => {
        const score = calculateSeoScore(row.seoPkgx);
        return getSeoStatusBadge(score);
      },
      size: 100,
      meta: { displayName: "SEO PKGX", group: "SEO" },
    },
    {
      id: "warrantyPeriodMonths",
      accessorKey: "warrantyPeriodMonths",
      header: "Bảo hành",
      cell: ({ row }) => {
        if (!row.warrantyPeriodMonths) return '-';
        return `${row.warrantyPeriodMonths} tháng`;
      },
      meta: { displayName: "Bảo hành" },
    },
    // ═══════════════════════════════════════════════════════════════
    // SEO & MÔ TẢ
    // ═══════════════════════════════════════════════════════════════
    {
      id: "ktitle",
      accessorKey: "ktitle",
      header: "Tiêu đề SEO",
      cell: ({ row }) => row.ktitle || '-',
      meta: { displayName: "Tiêu đề SEO" },
    },
    {
      id: "seoDescription",
      accessorKey: "seoDescription",
      header: "Mô tả SEO",
      cell: ({ row }) => {
        if (!row.seoDescription) return '-';
        return <span className="line-clamp-1">{row.seoDescription}</span>;
      },
      meta: { displayName: "Mô tả SEO" },
    },
    {
      id: "shortDescription",
      accessorKey: "shortDescription",
      header: "Mô tả ngắn",
      cell: ({ row }) => {
        if (!row.shortDescription) return '-';
        // Strip HTML tags for display
        const text = row.shortDescription.replace(/<[^>]*>/g, '');
        return <span className="line-clamp-1">{text}</span>;
      },
      meta: { displayName: "Mô tả ngắn" },
    },
    {
      id: "description",
      accessorKey: "description",
      header: "Mô tả chi tiết",
      cell: ({ row }) => {
        if (!row.description) return '-';
        // Strip HTML tags for display
        const text = row.description.replace(/<[^>]*>/g, '');
        return <span className="line-clamp-1">{text}</span>;
      },
      meta: { displayName: "Mô tả chi tiết" },
    },
    // ═══════════════════════════════════════════════════════════════
    // GIÁ & NHẬP HÀNG
    // ═══════════════════════════════════════════════════════════════
    {
      id: "lastPurchasePrice",
      accessorKey: "lastPurchasePrice",
      header: "Giá nhập gần nhất",
      cell: ({ row }) => formatCurrency(row.lastPurchasePrice),
      meta: { displayName: "Giá nhập gần nhất" },
    },
    {
      id: "primarySupplier",
      accessorKey: "primarySupplierSystemId",
      header: "Nhà cung cấp chính",
      cell: ({ row }) => {
        const supplierId = row.primarySupplierSystemId;
        if (!supplierId) return '-';
        const supplier = useSupplierStore.getState().findById(supplierId);
        return supplier ? supplier.name : '-';
      },
      meta: { displayName: "Nhà cung cấp chính" },
    },
    {
      id: "lastPurchaseDate",
      accessorKey: "lastPurchaseDate",
      header: "Ngày nhập gần nhất",
      cell: ({ row }) => {
        if (!row.lastPurchaseDate) return '-';
        return formatDateForDisplay(row.lastPurchaseDate);
      },
      meta: { displayName: "Ngày nhập gần nhất" },
    },
    {
      id: "minPrice",
      accessorKey: "minPrice",
      header: "Giá tối thiểu",
      cell: ({ row }) => formatCurrency(row.minPrice),
      meta: { displayName: "Giá tối thiểu" },
    },
    // ═══════════════════════════════════════════════════════════════
    // KHO - Mức đặt hàng, tồn kho an toàn, tối đa
    // ═══════════════════════════════════════════════════════════════
    {
      id: "reorderLevel",
      accessorKey: "reorderLevel",
      header: "Mức đặt hàng lại",
      cell: ({ row }) => {
        if (onFieldUpdate) {
          return (
            <div onClick={(e) => e.stopPropagation()}>
              <InlineEditableNumberCell
                value={row.reorderLevel ?? 0}
                onSave={(newValue) => onFieldUpdate(row, 'reorderLevel', newValue)}
              />
            </div>
          );
        }
        return row.reorderLevel ?? 0;
      },
      meta: { displayName: "Mức đặt hàng lại" },
    },
    {
      id: "safetyStock",
      accessorKey: "safetyStock",
      header: "Tồn kho an toàn",
      cell: ({ row }) => {
        if (onFieldUpdate) {
          return (
            <div onClick={(e) => e.stopPropagation()}>
              <InlineEditableNumberCell
                value={row.safetyStock ?? 0}
                onSave={(newValue) => onFieldUpdate(row, 'safetyStock', newValue)}
              />
            </div>
          );
        }
        return row.safetyStock ?? 0;
      },
      meta: { displayName: "Tồn kho an toàn" },
    },
    {
      id: "maxStock",
      accessorKey: "maxStock",
      header: "Mức tồn tối đa",
      cell: ({ row }) => {
        if (onFieldUpdate) {
          return (
            <div onClick={(e) => e.stopPropagation()}>
              <InlineEditableNumberCell
                value={row.maxStock ?? 0}
                onSave={(newValue) => onFieldUpdate(row, 'maxStock', newValue)}
              />
            </div>
          );
        }
        return row.maxStock ?? 0;
      },
      meta: { displayName: "Mức tồn tối đa" },
    },
    // ═══════════════════════════════════════════════════════════════
    // LOGISTICS - Khối lượng, Kích thước
    // ═══════════════════════════════════════════════════════════════
    {
      id: "weight",
      accessorKey: "weight",
      header: "Khối lượng",
      cell: ({ row }) => {
        if (row.weight === undefined) return '-';
        return `${row.weight} ${row.weightUnit || 'g'}`;
      },
      meta: { displayName: "Khối lượng" },
    },
    {
      id: "dimensions",
      accessorKey: "dimensions",
      header: "Kích thước (D×R×C)",
      cell: ({ row }) => {
        if (!row.dimensions) return '-';
        const { length = 0, width = 0, height = 0 } = row.dimensions;
        return `${length}×${width}×${height} cm`;
      },
      meta: { displayName: "Kích thước (D×R×C)" },
    },
    // ═══════════════════════════════════════════════════════════════
    // E-COMMERCE - Bán hàng online
    // ═══════════════════════════════════════════════════════════════
    {
      id: "pkgxStatus",
      header: "PKGX",
      cell: ({ row }) => (
        row.pkgxId ? (
          <Badge variant="default" className="bg-green-500 text-xs">
            <Globe className="h-3 w-3 mr-1" />
            {row.pkgxId}
          </Badge>
        ) : (
          <Badge variant="secondary" className="text-xs">Chưa liên kết</Badge>
        )
      ),
      meta: { displayName: "Trạng thái PKGX" },
    },
    {
      id: "pkgxSlug",
      accessorKey: "pkgxSlug",
      header: "Slug PKGX",
      cell: ({ row }) => row.pkgxSlug || '-',
      meta: { displayName: "Slug PKGX" },
    },
    {
      id: "isPublished",
      accessorKey: "isPublished",
      header: "Đăng web",
      cell: ({ row }) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Switch
            checked={row.isPublished ?? false}
            onCheckedChange={(checked) => onFieldUpdate?.(row, 'isPublished', checked)}
          />
        </div>
      ),
      meta: { displayName: "Đăng web" },
    },
    {
      id: "isFeatured",
      accessorKey: "isFeatured",
      header: "Nổi bật",
      cell: ({ row }) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Switch
            checked={row.isFeatured ?? false}
            onCheckedChange={(checked) => onFieldUpdate?.(row, 'isFeatured', checked)}
          />
        </div>
      ),
      meta: { displayName: "Nổi bật" },
    },
    {
      id: "isNewArrival",
      accessorKey: "isNewArrival",
      header: "Mới về",
      cell: ({ row }) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Switch
            checked={row.isNewArrival ?? false}
            onCheckedChange={(checked) => onFieldUpdate?.(row, 'isNewArrival', checked)}
          />
        </div>
      ),
      meta: { displayName: "Mới về" },
    },
    {
      id: "isBestSeller",
      accessorKey: "isBestSeller",
      header: "Bán chạy",
      cell: ({ row }) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Switch
            checked={row.isBestSeller ?? false}
            onCheckedChange={(checked) => onFieldUpdate?.(row, 'isBestSeller', checked)}
          />
        </div>
      ),
      meta: { displayName: "Bán chạy" },
    },
    {
      id: "isOnSale",
      accessorKey: "isOnSale",
      header: "Đang giảm giá",
      cell: ({ row }) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Switch
            checked={row.isOnSale ?? false}
            onCheckedChange={(checked) => onFieldUpdate?.(row, 'isOnSale', checked)}
          />
        </div>
      ),
      meta: { displayName: "Đang giảm giá" },
    },
    {
      id: "sortOrder",
      accessorKey: "sortOrder",
      header: "Thứ tự",
      cell: ({ row }) => {
        if (onFieldUpdate) {
          return (
            <div onClick={(e) => e.stopPropagation()}>
              <InlineEditableNumberCell
                value={row.sortOrder ?? 0}
                onSave={(newValue) => onFieldUpdate(row, 'sortOrder', newValue)}
              />
            </div>
          );
        }
        return row.sortOrder ?? '-';
      },
      meta: { displayName: "Thứ tự" },
    },
    {
      id: "publishedAt",
      accessorKey: "publishedAt",
      header: "Ngày đăng web",
      cell: ({ row }) => row.publishedAt ? formatDateForDisplay(row.publishedAt) : '-',
      meta: { displayName: "Ngày đăng web" },
    },
    // ═══════════════════════════════════════════════════════════════
    // MEDIA - Hình ảnh & Video
    // ═══════════════════════════════════════════════════════════════
    {
      id: "thumbnailImage",
      accessorKey: "thumbnailImage",
      header: "Ảnh đại diện",
      cell: ({ row }) => {
        if (!row.thumbnailImage) return '-';
        return (
          <img 
            src={row.thumbnailImage} 
            alt={row.name} 
            className="w-10 h-10 object-cover rounded"
          />
        );
      },
      meta: { displayName: "Ảnh đại diện" },
      size: 80,
    },
    {
      id: "galleryImages",
      accessorKey: "galleryImages",
      header: "Album ảnh",
      cell: ({ row }) => {
        const images = row.galleryImages;
        if (!images || images.length === 0) return '-';
        return <Badge variant="outline">{images.length} ảnh</Badge>;
      },
      meta: { displayName: "Album ảnh" },
    },
    {
      id: "videoLinks",
      accessorKey: "videoLinks",
      header: "Video",
      cell: ({ row }) => {
        const videos = row.videoLinks;
        if (!videos || videos.length === 0) return '-';
        return <Badge variant="outline">{videos.length} video</Badge>;
      },
      meta: { displayName: "Video" },
    },
    // ═══════════════════════════════════════════════════════════════
    // THUẾ
    // ═══════════════════════════════════════════════════════════════
    {
      id: "taxRate",
      accessorKey: "taxRate",
      header: "Thuế suất",
      cell: ({ row }) => {
        if (row.taxRate === undefined) return '-';
        return `${row.taxRate}%`;
      },
      meta: { displayName: "Thuế suất" },
    },
    // ═══════════════════════════════════════════════════════════════
    // KHO - Theo dõi tồn kho & Vị trí
    // ═══════════════════════════════════════════════════════════════
    {
      id: "isStockTracked",
      accessorKey: "isStockTracked",
      header: "Theo dõi kho",
      cell: ({ row }) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Switch
            checked={row.isStockTracked !== false}
            onCheckedChange={(checked) => onFieldUpdate?.(row, 'isStockTracked', checked)}
          />
        </div>
      ),
      meta: { displayName: "Theo dõi kho" },
    },
    {
      id: "warehouseLocation",
      accessorKey: "warehouseLocation",
      header: "Vị trí kho",
      cell: ({ row }) => row.warehouseLocation || '-',
      meta: { displayName: "Vị trí kho" },
    },
    // ═══════════════════════════════════════════════════════════════
    // TEM PHỤ - Thông tin in tem
    // ═══════════════════════════════════════════════════════════════
    {
      id: "nameVat",
      accessorKey: "nameVat",
      header: "Tên VAT",
      cell: ({ row }) => row.nameVat || '-',
      meta: { displayName: "Tên VAT" },
    },
    {
      id: "origin",
      accessorKey: "origin",
      header: "Xuất xứ",
      cell: ({ row }) => row.origin || '-',
      meta: { displayName: "Xuất xứ" },
    },
    {
      id: "usageGuide",
      accessorKey: "usageGuide",
      header: "HDSD",
      cell: ({ row }) => {
        if (!row.usageGuide) return '-';
        return <span className="line-clamp-1">{row.usageGuide}</span>;
      },
      meta: { displayName: "HDSD" },
    },
    {
      id: "sellerNote",
      accessorKey: "sellerNote",
      header: "Ghi chú",
      cell: ({ row }) => {
        if (onFieldUpdate) {
          return (
            <div onClick={(e) => e.stopPropagation()}>
              <InlineEditableCell
                value={row.sellerNote || ''}
                onSave={(newValue) => onFieldUpdate(row, 'sellerNote', newValue)}
              />
            </div>
          );
        }
        if (!row.sellerNote) return '-';
        return <span className="line-clamp-1">{row.sellerNote}</span>;
      },
      meta: { displayName: "Ghi chú" },
    },
    // ═══════════════════════════════════════════════════════════════
    // SEO - Keywords
    // ═══════════════════════════════════════════════════════════════
    {
      id: "seoKeywords",
      accessorKey: "seoKeywords",
      header: "Keywords SEO",
      cell: ({ row }) => {
        if (!row.seoKeywords) return '-';
        return <span className="line-clamp-1">{row.seoKeywords}</span>;
      },
      meta: { displayName: "Keywords SEO" },
    },
    // ═══════════════════════════════════════════════════════════════
    // VARIANTS - Biến thể sản phẩm
    // ═══════════════════════════════════════════════════════════════
    {
      id: "hasVariants",
      accessorKey: "hasVariants",
      header: "Có biến thể",
      cell: ({ row }) => row.hasVariants ? <Badge variant="default">Có</Badge> : '-',
      meta: { displayName: "Có biến thể" },
    },
    {
      id: "variantsCount",
      header: "Số biến thể",
      cell: ({ row }) => {
        if (!row.variants || row.variants.length === 0) return '-';
        return <Badge variant="outline">{row.variants.length} biến thể</Badge>;
      },
      meta: { displayName: "Số biến thể" },
    },
    // ═══════════════════════════════════════════════════════════════
    // COMBO - Thông tin combo
    // ═══════════════════════════════════════════════════════════════
    {
      id: "comboItemsCount",
      header: "SP trong combo",
      cell: ({ row }) => {
        if (row.type !== 'combo' || !row.comboItems || row.comboItems.length === 0) return '-';
        return <Badge variant="secondary">{row.comboItems.length} SP</Badge>;
      },
      meta: { displayName: "SP trong combo" },
    },
    // ═══════════════════════════════════════════════════════════════
    // SALES ANALYTICS - Phân tích bán hàng
    // ═══════════════════════════════════════════════════════════════
    {
      id: "totalRevenue",
      accessorKey: "totalRevenue",
      header: "Tổng doanh thu",
      cell: ({ row }) => formatCurrency(row.totalRevenue),
      meta: { displayName: "Tổng doanh thu" },
    },
    {
      id: "lastSoldDate",
      accessorKey: "lastSoldDate",
      header: "Ngày bán cuối",
      cell: ({ row }) => {
        if (!row.lastSoldDate) return '-';
        return formatDateForDisplay(row.lastSoldDate);
      },
      meta: { displayName: "Ngày bán cuối" },
    },
    {
      id: "viewCount",
      accessorKey: "viewCount",
      header: "Lượt xem",
      cell: ({ row }) => row.viewCount ?? '-',
      meta: { displayName: "Lượt xem" },
    },
    // ═══════════════════════════════════════════════════════════════
    // LIFECYCLE - Vòng đời sản phẩm
    // ═══════════════════════════════════════════════════════════════
    {
      id: "launchedDate",
      accessorKey: "launchedDate",
      header: "Ngày ra mắt",
      cell: ({ row }) => {
        if (!row.launchedDate) return '-';
        return formatDateForDisplay(row.launchedDate);
      },
      meta: { displayName: "Ngày ra mắt" },
    },
    {
      id: "discontinuedDate",
      accessorKey: "discontinuedDate",
      header: "Ngày ngừng KD",
      cell: ({ row }) => {
        if (!row.discontinuedDate) return '-';
        return formatDateForDisplay(row.discontinuedDate);
      },
      meta: { displayName: "Ngày ngừng KD" },
    },
    // ═══════════════════════════════════════════════════════════════
    // TRENDTECH - Website Trendtech
    // ═══════════════════════════════════════════════════════════════
    {
      id: "trendtechId",
      accessorKey: "trendtechId",
      header: "ID Trendtech",
      cell: ({ row }) => {
        if (onFieldUpdate) {
          return (
            <div onClick={(e) => e.stopPropagation()}>
              <InlineEditableNumberCell
                value={row.trendtechId || 0}
                onSave={(newValue) => onFieldUpdate(row, 'trendtechId', newValue)}
              />
            </div>
          );
        }
        return row.trendtechId || '-';
      },
      meta: { displayName: "ID Trendtech" },
    },
    // SEO Trendtech Score
    {
      id: "seoTrendtech",
      accessorKey: "seoTrendtech",
      header: "SEO Trendtech",
      cell: ({ row }) => {
        const score = calculateSeoScore(row.seoTrendtech);
        return getSeoStatusBadge(score);
      },
      size: 100,
      meta: { displayName: "SEO Trendtech", group: "SEO" },
    },
    {
      id: "trendtechSlug",
      accessorKey: "trendtechSlug",
      header: "Slug Trendtech",
      cell: ({ row }) => row.trendtechSlug || '-',
      meta: { displayName: "Slug Trendtech" },
    },
    // ═══════════════════════════════════════════════════════════════
    // THÔNG TIN HỆ THỐNG - Người tạo, cập nhật
    // ═══════════════════════════════════════════════════════════════
    {
      id: "updatedAt",
      accessorKey: "updatedAt",
      header: "Cập nhật lần cuối",
      cell: ({ row }) => formatDateTime(row.updatedAt),
      meta: { displayName: "Cập nhật lần cuối" },
    },
    {
      id: "createdBy",
      accessorKey: "createdBy",
      header: "Người tạo",
      cell: ({ row }) => {
        const employeeId = row.createdBy;
        if (!employeeId) return '-';
        const employee = useEmployeeStore.getState().findById(employeeId);
        return employee ? employee.fullName : '-';
      },
      meta: { displayName: "Người tạo" },
    },
    {
      id: "updatedBy",
      accessorKey: "updatedBy",
      header: "Người cập nhật",
      cell: ({ row }) => {
        const employeeId = row.updatedBy;
        if (!employeeId) return '-';
        const employee = useEmployeeStore.getState().findById(employeeId);
        return employee ? employee.fullName : '-';
      },
      meta: { displayName: "Người cập nhật" },
    },
    // ═══════════════════════════════════════════════════════════════
    // CỘT PKGX - Riêng cho đồng bộ PKGX
    // ═══════════════════════════════════════════════════════════════
    {
      id: "pkgxActions",
      header: () => <div className="text-center">PKGX</div>,
      cell: ({ row }) => (
        <PkgxActionsCell
          row={row}
          onPkgxUpdatePrice={onPkgxUpdatePrice}
          onPkgxPublish={onPkgxPublish}
          onPkgxUpdateSeo={onPkgxUpdateSeo}
          onPkgxSyncInventory={onPkgxSyncInventory}
          onPkgxSyncDescription={onPkgxSyncDescription}
          onPkgxSyncFlags={onPkgxSyncFlags}
          onPkgxSyncBasicInfo={onPkgxSyncBasicInfo}
          onPkgxSyncImages={onPkgxSyncImages}
          onPkgxSyncAll={onPkgxSyncAll}
          onPkgxLink={onPkgxLink}
          onPkgxUnlink={onPkgxUnlink}
        />
      ),
      meta: {
        displayName: "PKGX",
        sticky: "right",
      },
      size: 70,
    },
    // ═══════════════════════════════════════════════════════════════
    // CỘT HÀNH ĐỘNG - Các thao tác chung
    // ═══════════════════════════════════════════════════════════════
    {
      id: "actions",
      header: () => <div className="text-center">Hành động</div>,
      cell: ({ row }) => {
        // ✅ Show restore button for deleted items
        if (row.deletedAt) {
          return (
            <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => { e.stopPropagation(); onRestore(row.systemId); }}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Khôi phục
              </Button>
            </div>
          );
        }
        
        // ✅ Show edit/delete for active items
        return (
          <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                    <span className="sr-only">Mở menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenuItem onSelect={() => navigate(`/products/${row.systemId}/edit`)}>
                    Sửa
                  </DropdownMenuItem>
                  {onPrintLabel && (
                    <DropdownMenuItem onSelect={() => onPrintLabel(row)}>
                      In tem phụ
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onSelect={() => onDelete(row.systemId)}>
                    Chuyển vào thùng rác
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
          </div>
        );
      },
      meta: {
        displayName: "Hành động",
        sticky: "right",
      },
      size: 90,
    },
    // ═══════════════════════════════════════════════════════════════
    // DYNAMIC PRICE COLUMNS - Tự động tạo cột cho mỗi bảng giá
    // ═══════════════════════════════════════════════════════════════
    ...activePricingPolicies.map((policy) => ({
      id: `price_${policy.systemId}`,
      header: `Giá: ${policy.name}`,
      cell: ({ row }: { row: Product }) => {
        const price = row.prices?.[policy.systemId];
        if (onFieldUpdate) {
          return (
            <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
              <InlineEditableNumberCell
                value={price || 0}
                onSave={(newValue: number) => onFieldUpdate(row, `prices.${policy.systemId}`, newValue)}
              />
            </div>
          );
        }
        return formatCurrency(price);
      },
      meta: { displayName: `Giá: ${policy.name}` },
    } as ColumnDef<Product>)),
  ];
}
