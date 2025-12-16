import * as React from "react";
import * as ReactRouterDOM from "react-router-dom";
import type { Product } from './types.ts'
import { Checkbox } from "../../components/ui/checkbox.tsx"
import { DataTableColumnHeader } from "../../components/data-table/data-table-column-header.tsx"
import { Badge } from "../../components/ui/badge.tsx"
import type { ColumnDef } from '../../components/data-table/types.ts';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../../components/ui/dropdown-menu.tsx";
import { Button } from "../../components/ui/button.tsx";
import { MoreHorizontal, RotateCcw, Globe, RefreshCw, FileText, DollarSign, Package, Search, AlignLeft, Tag, Image, ExternalLink, Upload } from "lucide-react";
import { usePricingPolicyStore } from '../settings/pricing/store.ts';
import { useProductCategoryStore } from '../settings/inventory/product-category-store.ts';
import { useProductTypeStore } from '../settings/inventory/product-type-store.ts';
import { useBrandStore } from '../settings/inventory/brand-store.ts';
import { useSupplierStore } from '../suppliers/store.ts';
import { useEmployeeStore } from '../employees/store.ts';
import { StockAlertBadge } from './components/stock-alert-badges.tsx';
import { formatDateForDisplay } from '@/lib/date-utils';
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
              </>
            ) : (
              /* Publish to PKGX - Only show for products WITHOUT pkgxId */
              onPkgxPublish && (
                <DropdownMenuItem onSelect={() => handleConfirm(
                  'Đăng lên PKGX',
                  `Bạn có chắc muốn đăng sản phẩm "${row.name}" lên PKGX?`,
                  () => onPkgxPublish(row)
                )}>
                  <Upload className="mr-2 h-4 w-4" />
                  Đăng lên PKGX
                </DropdownMenuItem>
              )
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
): ColumnDef<Product>[] => {
  
  const { data: pricingPolicies } = usePricingPolicyStore.getState();
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
              <Badge variant="outline" className="text-body-xs border-blue-500 text-blue-600">
                <Globe className="h-3 w-3 mr-1" />
                PKGX
              </Badge>
            )}
            <StockAlertBadge product={row} />
          </div>
          {row.shortDescription && (
            <div className="text-body-xs text-muted-foreground line-clamp-1">{row.shortDescription}</div>
          )}
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
        const typeLabels = {
          physical: 'Hàng hóa',
          service: 'Dịch vụ',
          digital: 'Sản phẩm số',
          combo: 'Combo'
        };
        const typeVariants: Record<string, "default" | "secondary" | "outline"> = {
          physical: 'default',
          service: 'secondary',
          digital: 'outline',
          combo: 'secondary'
        };
        const type = row.type as keyof typeof typeLabels;
        return (
          <Badge variant={typeVariants[type] || 'default'}>
            {typeLabels[type] || '-'}
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
      cell: ({ row }) => (
        <Badge variant={getStatusBadgeVariant(row.status)}>
          {getStatusLabel(row.status)}
        </Badge>
      ),
      meta: { displayName: "Trạng thái" },
    },
    {
      id: "defaultPrice",
      header: "Đơn giá (mặc định)",
      cell: ({ row }) => {
        const price = defaultSellingPolicy ? row.prices[defaultSellingPolicy.systemId] : undefined;
        return formatCurrency(price);
      },
      meta: { displayName: "Đơn giá (mặc định)" },
    },
    {
      id: "costPrice",
      accessorKey: "costPrice",
      header: "Giá vốn",
      cell: ({ row }) => formatCurrency(row.costPrice),
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
        return Object.values(row.inventoryByBranch).reduce((sum, qty) => sum + qty, 0);
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
    // THÊM CÁC CỘT MỚI - Loại sản phẩm, Thương hiệu, Danh mục con
    // ═══════════════════════════════════════════════════════════════
    {
      id: "productType",
      accessorKey: "productTypeSystemId",
      header: "Loại sản phẩm",
      cell: ({ row }) => {
        const productTypeId = row.productTypeSystemId;
        if (!productTypeId) return '-';
        const productType = useProductTypeStore.getState().findById(productTypeId);
        return productType ? productType.name : '-';
      },
      meta: { displayName: "Loại sản phẩm" },
    },
    {
      id: "subCategory",
      accessorKey: "subCategory",
      header: "Danh mục con",
      cell: ({ row }) => row.subCategory || '-',
      meta: { displayName: "Danh mục con" },
    },
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
      cell: ({ row }) => row.pkgxId || '-',
      meta: { displayName: "ID PKGX" },
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
      cell: ({ row }) => row.reorderLevel ?? 0,
      meta: { displayName: "Mức đặt hàng lại" },
    },
    {
      id: "safetyStock",
      accessorKey: "safetyStock",
      header: "Tồn kho an toàn",
      cell: ({ row }) => row.safetyStock ?? 0,
      meta: { displayName: "Tồn kho an toàn" },
    },
    {
      id: "maxStock",
      accessorKey: "maxStock",
      header: "Mức tồn tối đa",
      cell: ({ row }) => row.maxStock ?? 0,
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
        <Badge variant={row.isPublished ? 'success' : 'secondary'}>
          {row.isPublished ? 'Đã đăng' : 'Chưa đăng'}
        </Badge>
      ),
      meta: { displayName: "Đăng web" },
    },
    {
      id: "isFeatured",
      accessorKey: "isFeatured",
      header: "Nổi bật",
      cell: ({ row }) => row.isFeatured ? <Badge variant="default">Nổi bật</Badge> : '-',
      meta: { displayName: "Nổi bật" },
    },
    {
      id: "isNewArrival",
      accessorKey: "isNewArrival",
      header: "Mới về",
      cell: ({ row }) => row.isNewArrival ? <Badge variant="outline">Mới</Badge> : '-',
      meta: { displayName: "Mới về" },
    },
    {
      id: "isBestSeller",
      accessorKey: "isBestSeller",
      header: "Bán chạy",
      cell: ({ row }) => row.isBestSeller ? <Badge variant="destructive">Hot</Badge> : '-',
      meta: { displayName: "Bán chạy" },
    },
    {
      id: "isOnSale",
      accessorKey: "isOnSale",
      header: "Đang giảm giá",
      cell: ({ row }) => row.isOnSale ? <Badge variant="warning">Sale</Badge> : '-',
      meta: { displayName: "Đang giảm giá" },
    },
    {
      id: "sortOrder",
      accessorKey: "sortOrder",
      header: "Thứ tự",
      cell: ({ row }) => row.sortOrder ?? '-',
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
    // VIDEO LINKS
    // ═══════════════════════════════════════════════════════════════
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
  ];
}
