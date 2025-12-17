import * as React from "react";
import type { ProductCategory } from '../settings/inventory/types.ts';
import { Checkbox } from "../../components/ui/checkbox.tsx";
import { DataTableColumnHeader } from "../../components/data-table/data-table-column-header.tsx";
import { Badge } from "../../components/ui/badge.tsx";
import type { ColumnDef } from '../../components/data-table/types.ts';
import { Button } from "../../components/ui/button.tsx";
import { Switch } from "../../components/ui/switch.tsx";
import { MoreHorizontal, Image as ImageIcon, Package, Pencil, CheckCircle, AlertTriangle, XCircle, RefreshCw, Search, AlignLeft, ExternalLink, Unlink } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../../components/ui/dropdown-menu.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar.tsx";
import { useProductStore } from '../products/store.ts';
import { InlineEditableCell, InlineEditableNumberCell } from '../../components/shared/inline-editable-cell.tsx';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/alert-dialog.tsx";

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

// SEO Score calculation
const calculateSeoScore = (category: ProductCategory, website: 'pkgx' | 'trendtech'): number => {
  const seo = category.websiteSeo?.[website];
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
// PKGX Actions Cell Component
// ═══════════════════════════════════════════════════════════════
type PkgxActionsCellProps = {
  row: ProductCategory;
  hasPkgxMapping: boolean;
  pkgxCatId?: number;
  onPkgxSyncSeo?: (category: ProductCategory) => void;
  onPkgxSyncDescription?: (category: ProductCategory) => void;
  onPkgxSyncAll?: (category: ProductCategory) => void;
};

function PkgxActionsCell({
  row,
  hasPkgxMapping,
  pkgxCatId,
  onPkgxSyncSeo,
  onPkgxSyncDescription,
  onPkgxSyncAll,
}: PkgxActionsCellProps) {
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

  return (
    <>
      <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button 
              variant="ghost" 
              className={`h-8 w-8 p-0 ${hasPkgxMapping ? "text-primary" : "text-muted-foreground"}`}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="sr-only">PKGX menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            {hasPkgxMapping ? (
              <>
                {/* Sync All */}
                {onPkgxSyncAll && (
                  <DropdownMenuItem 
                    onSelect={() => handleConfirm(
                      'Đồng bộ tất cả',
                      `Bạn có chắc muốn đồng bộ TẤT CẢ thông tin danh mục "${row.name}" lên PKGX?`,
                      () => onPkgxSyncAll(row)
                    )}
                    className="font-medium"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Đồng bộ tất cả
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                
                {/* Individual sync actions */}
                {onPkgxSyncSeo && (
                  <DropdownMenuItem 
                    onSelect={() => handleConfirm(
                      'Đồng bộ SEO',
                      `Đồng bộ SEO (keywords, meta title, meta description) của "${row.name}" lên PKGX?`,
                      () => onPkgxSyncSeo(row)
                    )}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    SEO
                  </DropdownMenuItem>
                )}
                {onPkgxSyncDescription && (
                  <DropdownMenuItem 
                    onSelect={() => handleConfirm(
                      'Đồng bộ mô tả',
                      `Đồng bộ mô tả danh mục "${row.name}" lên PKGX?`,
                      () => onPkgxSyncDescription(row)
                    )}
                  >
                    <AlignLeft className="mr-2 h-4 w-4" />
                    Mô tả
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onSelect={() => window.open(`https://phukiengiaxuong.com.vn/admin/category.php?act=edit&cat_id=${pkgxCatId}`, '_blank')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Xem trên PKGX
                </DropdownMenuItem>
              </>
            ) : (
              /* Not linked - show info */
              <>
                <DropdownMenuItem 
                  className="text-muted-foreground"
                  onSelect={() => window.open('/settings/pkgx', '_self')}
                >
                  <Unlink className="mr-2 h-4 w-4" />
                  Chưa liên kết
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onSelect={() => window.open('/settings/pkgx', '_self')}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Cài đặt mapping PKGX
                </DropdownMenuItem>
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
  onToggleActive: (systemId: string, isActive: boolean) => void,
  navigate: (path: string) => void,
  allCategories: ProductCategory[], // Để tính số danh mục con
  onUpdateName?: (systemId: string, name: string) => void, // Inline edit handler
  onUpdateSortOrder?: (systemId: string, sortOrder: number) => void, // Sort order handler
  // PKGX handlers
  onPkgxSyncSeo?: (category: ProductCategory) => void,
  onPkgxSyncDescription?: (category: ProductCategory) => void,
  onPkgxSyncAll?: (category: ProductCategory) => void,
  hasPkgxMapping?: (category: ProductCategory) => boolean,
  getPkgxCatId?: (category: ProductCategory) => number | undefined,
): ColumnDef<ProductCategory>[] => {
  // Get product counts per category - không dùng useMemo vì đây không phải React component
  const productStore = useProductStore.getState();
  const productCountByCategory: Record<string, number> = {};
  productStore.data.forEach(p => {
    if (p.categorySystemId && !p.isDeleted) {
      productCountByCategory[String(p.categorySystemId)] = (productCountByCategory[String(p.categorySystemId)] || 0) + 1;
    }
  });

  return [
  {
    id: "select",
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
    size: 48,
    meta: {
      displayName: "Chọn",
      sticky: "left",
    }
  },
  // Thumbnail Image
  {
    id: "thumbnailImage",
    accessorKey: "thumbnailImage",
    header: "Ảnh",
    cell: ({ row }) => {
      const category = row as ProductCategory;
      return (
        <Avatar className="h-10 w-10 rounded-md">
          {category.thumbnailImage ? (
            <AvatarImage src={category.thumbnailImage} alt={category.name} className="object-cover" />
          ) : null}
          <AvatarFallback className="rounded-md bg-muted">
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
      );
    },
    size: 60,
    meta: {
      displayName: "Ảnh",
      group: "Thông tin cơ bản"
    },
  },
  // Mã danh mục
  {
    id: "id",
    accessorKey: "id",
    header: ({ sorting, setSorting }) => (
      <DataTableColumnHeader 
        title="Mã"
        sortKey="id"
        isSorted={sorting?.id === 'id'}
        sortDirection={sorting?.desc ? 'desc' : 'asc'}
        onSort={() => setSorting?.((s: any) => ({ id: 'id', desc: s.id === 'id' ? !s.desc : false }))}
      />
    ),
    cell: ({ row }) => {
      const category = row as ProductCategory;
      return (
        <span className="font-mono text-xs text-muted-foreground">
          {category.id}
        </span>
      );
    },
    size: 100,
    meta: {
      displayName: "Mã danh mục",
      group: "Thông tin cơ bản"
    },
  },
  // Tên danh mục với indent + inline editing
  {
    id: "name",
    accessorKey: "name",
    header: ({ sorting, setSorting }) => (
      <DataTableColumnHeader 
        title="Tên danh mục"
        sortKey="name"
        isSorted={sorting?.id === 'name'}
        sortDirection={sorting?.desc ? 'desc' : 'asc'}
        onSort={() => setSorting?.((s: any) => ({ id: 'name', desc: s.id === 'name' ? !s.desc : false }))}
      />
    ),
    cell: ({ row }) => {
      const category = row as ProductCategory;
      const level = category.level ?? 0;
      const indent = level * 24;
      
      if (onUpdateName) {
        return (
          <div style={{ paddingLeft: `${indent}px` }} className="flex items-center gap-1">
            {level > 0 && <span className="text-muted-foreground/50">└</span>}
            <InlineEditableCell
              value={category.name}
              onSave={(newName) => onUpdateName(String(category.systemId), newName)}
              inputClassName="h-7 text-sm w-48"
              renderDisplay={(value, onEdit) => (
                <div className="flex items-center gap-2 group">
                  <span 
                    className="font-medium truncate cursor-pointer hover:text-primary"
                    onClick={() => navigate(`/categories/${category.systemId}`)}
                  >
                    {value}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit();
                    }}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                </div>
              )}
            />
          </div>
        );
      }
      
      return (
        <div 
          className="flex items-center gap-2 cursor-pointer hover:text-primary"
          style={{ paddingLeft: `${indent}px` }}
          onClick={() => navigate(`/categories/${category.systemId}`)}
        >
          {level > 0 && <span className="text-muted-foreground/50">└</span>}
          <span className="font-medium truncate">{category.name}</span>
        </div>
      );
    },
    size: 300,
    meta: {
      displayName: "Tên danh mục",
      group: "Thông tin cơ bản"
    },
  },
  // Thứ tự sắp xếp
  {
    id: "sortOrder",
    accessorKey: "sortOrder",
    header: ({ sorting, setSorting }) => (
      <DataTableColumnHeader 
        title="STT"
        sortKey="sortOrder"
        isSorted={sorting?.id === 'sortOrder'}
        sortDirection={sorting?.desc ? 'desc' : 'asc'}
        onSort={() => setSorting?.((s: any) => ({ id: 'sortOrder', desc: s.id === 'sortOrder' ? !s.desc : false }))}
      />
    ),
    cell: ({ row }) => {
      const category = row as ProductCategory;
      
      if (onUpdateSortOrder) {
        return (
          <InlineEditableNumberCell
            value={category.sortOrder ?? 0}
            onSave={(newValue) => onUpdateSortOrder(String(category.systemId), newValue)}
            inputClassName="h-7 w-16 text-center text-sm"
            renderDisplay={(value, onEdit) => (
              <div 
                className="flex items-center justify-center cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
              >
                <Badge variant="outline" className="font-mono text-xs hover:bg-muted transition-colors">
                  {value}
                </Badge>
              </div>
            )}
          />
        );
      }
      
      return (
        <div className="flex items-center justify-center">
          <Badge variant="outline" className="font-mono text-xs">
            {category.sortOrder ?? 0}
          </Badge>
        </div>
      );
    },
    size: 70,
    meta: {
      displayName: "Thứ tự",
      group: "Thông tin cơ bản"
    },
  },
  // Cấp (Level)
  {
    id: "level",
    accessorKey: "level",
    header: ({ sorting, setSorting }) => (
      <DataTableColumnHeader 
        title="Cấp"
        sortKey="level"
        isSorted={sorting?.id === 'level'}
        sortDirection={sorting?.desc ? 'desc' : 'asc'}
        onSort={() => setSorting?.((s: any) => ({ id: 'level', desc: s.id === 'level' ? !s.desc : false }))}
      />
    ),
    cell: ({ row }) => {
      const category = row as ProductCategory;
      const level = category.level ?? 0;
      return (
        <Badge variant="outline" className="font-mono">
          {level}
        </Badge>
      );
    },
    size: 70,
    meta: {
      displayName: "Cấp",
      group: "Phân cấp"
    },
  },
  // Số danh mục con
  {
    id: "childCount",
    header: "DM con",
    cell: ({ row }) => {
      const category = row as ProductCategory;
      const childCount = allCategories.filter(c => c.parentId === category.systemId && !c.isDeleted).length;
      return childCount > 0 ? (
        <Badge variant="secondary">{childCount}</Badge>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
    size: 80,
    meta: {
      displayName: "DM con",
      group: "Phân cấp"
    },
  },
  // Số sản phẩm
  {
    id: "productCount",
    header: () => (
      <div className="flex items-center gap-1">
        <Package className="h-3.5 w-3.5" />
        <span>SP</span>
      </div>
    ),
    cell: ({ row }) => {
      const category = row as ProductCategory;
      const count = productCountByCategory[String(category.systemId)] || 0;
      return count > 0 ? (
        <Badge variant="outline" className="text-primary">
          {count}
        </Badge>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
    size: 70,
    meta: {
      displayName: "Sản phẩm",
      group: "Thống kê"
    },
  },
  // SEO PKGX Status
  {
    id: "seoPkgx",
    header: () => (
      <div className="flex items-center gap-1">
        <span className="text-red-500">●</span>
        <span>PKGX</span>
      </div>
    ),
    cell: ({ row }) => {
      const category = row as ProductCategory;
      const score = calculateSeoScore(category, 'pkgx');
      return getSeoStatusBadge(score);
    },
    size: 90,
    meta: {
      displayName: "SEO PKGX",
      group: "SEO"
    },
  },
  // SEO Trendtech Status
  {
    id: "seoTrendtech",
    header: () => (
      <div className="flex items-center gap-1">
        <span className="text-blue-500">●</span>
        <span>Trendtech</span>
      </div>
    ),
    cell: ({ row }) => {
      const category = row as ProductCategory;
      const score = calculateSeoScore(category, 'trendtech');
      return getSeoStatusBadge(score);
    },
    size: 100,
    meta: {
      displayName: "SEO Trendtech",
      group: "SEO"
    },
  },
  // Trạng thái - Switch
  {
    id: "isActive",
    accessorKey: "isActive",
    header: "Trạng thái",
    cell: ({ row }) => {
      const category = row as ProductCategory;
      const isActive = category.isActive !== false;
      return (
        <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
          <Switch
            checked={isActive}
            onCheckedChange={(checked) => onToggleActive(String(category.systemId), checked)}
          />
        </div>
      );
    },
    size: 80,
    meta: {
      displayName: "Trạng thái",
      group: "Trạng thái"
    },
  },
  // Ngày tạo
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: ({ sorting, setSorting }) => (
      <DataTableColumnHeader 
        title="Ngày tạo"
        sortKey="createdAt"
        isSorted={sorting?.id === 'createdAt'}
        sortDirection={sorting?.desc ? 'desc' : 'asc'}
        onSort={() => setSorting?.((s: any) => ({ id: 'createdAt', desc: s.id === 'createdAt' ? !s.desc : false }))}
      />
    ),
    cell: ({ row }) => {
      const category = row as ProductCategory;
      return (
        <span className="text-sm text-muted-foreground">
          {formatDate(category.createdAt)}
        </span>
      );
    },
    size: 110,
    meta: {
      displayName: "Ngày tạo",
      group: "Thời gian"
    },
  },
  // PKGX Actions Column
  {
    id: "pkgx",
    header: "PKGX",
    cell: ({ row }) => {
      const category = row as ProductCategory;
      const hasMapping = hasPkgxMapping?.(category) ?? false;
      const pkgxId = getPkgxCatId?.(category);
      
      return (
        <PkgxActionsCell
          row={category}
          hasPkgxMapping={hasMapping}
          pkgxCatId={pkgxId}
          onPkgxSyncSeo={onPkgxSyncSeo}
          onPkgxSyncDescription={onPkgxSyncDescription}
          onPkgxSyncAll={onPkgxSyncAll}
        />
      );
    },
    size: 70,
    meta: {
      displayName: "PKGX",
      group: "PKGX"
    },
  },
  // Actions
  {
    id: "actions",
    header: () => <span className="sr-only">Thao tác</span>,
    cell: ({ row }) => {
      const category = row as ProductCategory;
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/categories/${category.systemId}`)}>
              Xem chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/categories/${category.systemId}/edit`)}>
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive"
              onClick={() => onDelete(String(category.systemId))}
            >
              Xóa danh mục
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 60,
    meta: {
      displayName: "Thao tác",
      sticky: "right",
    }
  },
];
};