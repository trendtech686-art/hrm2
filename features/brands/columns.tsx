import * as React from "react";
import type { Brand } from '../settings/inventory/types';
import { Checkbox } from "../../components/ui/checkbox";
import { DataTableColumnHeader } from "../../components/data-table/data-table-column-header";
import { Badge } from "../../components/ui/badge";
import type { ColumnDef } from '../../components/data-table/types';
import { Button } from "../../components/ui/button";
import { MoreHorizontal, Globe, Image as ImageIcon, Eye, Trash2, Package, Pencil, CheckCircle, AlertTriangle, XCircle, ExternalLink } from "lucide-react";
import { Switch } from "../../components/ui/switch";
import { PkgxBrandActionsCell } from './pkgx-brand-actions-cell';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { InlineEditableCell } from '../../components/shared/inline-editable-cell';
import { useProductStore } from '../products/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { ScrollArea } from "../../components/ui/scroll-area";

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

// SEO Score calculation for Brand
const calculateSeoScore = (brand: Brand, website: 'pkgx' | 'trendtech'): number => {
  const seo = brand.websiteSeo?.[website];
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

export const getColumns = (
  onDelete: (systemId: string) => void,
  onToggleActive: (systemId: string, isActive: boolean) => void,
  navigate: (path: string) => void,
  onUpdateName?: (systemId: string, name: string) => void,
  // PKGX handlers - used by PkgxBrandActionsCell
  hasPkgxMapping?: (brand: Brand) => boolean,
  getPkgxBrandId?: (brand: Brand) => number | undefined,
  onPkgxLink?: (brand: Brand) => void,
  onPkgxUnlink?: (brand: Brand) => void,
  onPkgxViewDetail?: (brand: Brand, pkgxBrandId: number) => void,
): ColumnDef<Brand>[] => {
  // Get product counts per brand
  const productStore = useProductStore.getState();
  const productCountByBrand: Record<string, number> = {};
  productStore.data.forEach(p => {
    if (p.brandSystemId && !p.isDeleted) {
      productCountByBrand[String(p.brandSystemId)] = (productCountByBrand[String(p.brandSystemId)] || 0) + 1;
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
  // Logo
  {
    id: "logo",
    accessorKey: "logo",
    header: "Logo",
    cell: ({ row }) => {
      const brand = row as Brand;
      return (
        <Avatar className="h-10 w-10">
          {brand.logo ? (
            <AvatarImage src={brand.logo} alt={brand.name} />
          ) : null}
          <AvatarFallback className="bg-muted">
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
      );
    },
    size: 60,
    meta: {
      displayName: "Logo",
      group: "Thông tin cơ bản"
    },
  },
  // Tên thương hiệu với inline editing
  {
    id: "name",
    accessorKey: "name",
    header: ({ sorting, setSorting }) => (
      <DataTableColumnHeader 
        title="Tên thương hiệu"
        sortKey="name"
        isSorted={sorting?.id === 'name'}
        sortDirection={sorting?.desc ? 'desc' : 'asc'}
        onSort={() => setSorting?.((s: any) => ({ id: 'name', desc: s.id === 'name' ? !s.desc : false }))}
      />
    ),
    cell: ({ row }) => {
      const brand = row as Brand;
      const hasMapping = hasPkgxMapping?.(brand) ?? false;
      const pkgxId = getPkgxBrandId?.(brand);
      
      if (onUpdateName) {
        return (
          <InlineEditableCell
            value={brand.name}
            onSave={(newName) => onUpdateName(String(brand.systemId), newName)}
            inputClassName="h-7 text-sm w-48"
            renderDisplay={(value, onEdit) => (
              <div className="flex flex-col group">
                <div className="flex items-center gap-2">
                  <span 
                    className="font-medium cursor-pointer hover:text-primary"
                    onClick={() => navigate(`/brands/${brand.systemId}`)}
                  >
                    {value}
                  </span>
                  {hasMapping && (
                    <Badge variant="secondary" className="text-xs">
                      <Globe className="h-3 w-3 mr-1" />
                      PKGX
                    </Badge>
                  )}
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
                {brand.description && (
                  <span className="text-xs text-muted-foreground truncate max-w-[200px]" title={brand.description}>
                    {brand.description}
                  </span>
                )}
              </div>
            )}
          />
        );
      }
      
      return (
        <div 
          className="flex flex-col cursor-pointer hover:text-primary"
          onClick={() => navigate(`/brands/${brand.systemId}`)}
        >
          <div className="flex items-center gap-2">
            <span className="font-medium">{brand.name}</span>
            {hasMapping && (
              <Badge variant="secondary" className="text-xs">
                <Globe className="h-3 w-3 mr-1" />
                PKGX
              </Badge>
            )}
          </div>
          {brand.description && (
            <span className="text-xs text-muted-foreground truncate max-w-[200px]" title={brand.description}>
              {brand.description}
            </span>
          )}
        </div>
      );
    },
    meta: {
      displayName: "Tên thương hiệu",
      group: "Thông tin cơ bản"
    },
  },
  // Mã thương hiệu
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
      const brand = row as Brand;
      return (
        <span className="font-mono text-xs text-muted-foreground">
          {brand.id}
        </span>
      );
    },
    size: 100,
    meta: {
      displayName: "Mã thương hiệu",
      group: "Thông tin cơ bản"
    },
  },
  // Số sản phẩm
  {
    id: "productCount",
    header: "SP",
    cell: ({ row }) => {
      const brand = row as Brand;
      const count = productCountByBrand[String(brand.systemId)] || 0;
      return (
        <Badge variant="outline" className="font-mono text-xs gap-1">
          <Package className="h-3 w-3" />
          {count}
        </Badge>
      );
    },
    size: 70,
    meta: {
      displayName: "Số sản phẩm",
      group: "Thống kê"
    },
  },
  // Website
  {
    id: "website",
    accessorKey: "website",
    header: "Website",
    cell: ({ row }) => {
      const brand = row as Brand;
      if (!brand.website) return <span className="text-muted-foreground">—</span>;
      return (
        <a 
          href={brand.website} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-primary hover:underline text-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <Globe className="h-3 w-3" />
          <span className="truncate max-w-[150px]">{brand.website.replace(/^https?:\/\//, '')}</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      );
    },
    meta: {
      displayName: "Website",
      group: "Thông tin cơ bản"
    },
  },
  // SEO PKGX với điểm số
  {
    id: "seoPkgx",
    accessorKey: "websiteSeo",
    header: "SEO PKGX",
    cell: ({ row }) => {
      const brand = row as Brand;
      const score = calculateSeoScore(brand, 'pkgx');
      return getSeoStatusBadge(score);
    },
    size: 100,
    meta: {
      displayName: "SEO PKGX",
      group: "SEO"
    },
  },
  // SEO Trendtech với điểm số
  {
    id: "seoTrendtech",
    accessorKey: "websiteSeo",
    header: "SEO Trendtech",
    cell: ({ row }) => {
      const brand = row as Brand;
      const score = calculateSeoScore(brand, 'trendtech');
      return getSeoStatusBadge(score);
    },
    size: 100,
    meta: {
      displayName: "SEO Trendtech",
      group: "SEO"
    },
  },
  // PKGX Status - Hiển thị trạng thái liên kết
  {
    id: "pkgxStatus",
    header: "Liên kết PKGX",
    cell: ({ row }) => {
      const brand = row as Brand;
      const hasMapping = hasPkgxMapping?.(brand) ?? false;
      const pkgxId = getPkgxBrandId?.(brand);
      
      return hasMapping ? (
        <Badge variant="default" className="bg-green-500 text-xs">
          <Globe className="h-3 w-3 mr-1" />
          {pkgxId}
        </Badge>
      ) : (
        <Badge variant="secondary" className="text-xs">Chưa liên kết</Badge>
      );
    },
    size: 110,
    meta: {
      displayName: "Liên kết PKGX",
      group: "PKGX"
    },
  },
  // Trạng thái
  {
    id: "isActive",
    accessorKey: "isActive",
    header: "Trạng thái",
    cell: ({ row }) => {
      const brand = row as Brand;
      return (
        <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
          <Switch
            checked={brand.isActive !== false}
            onCheckedChange={(checked) => onToggleActive(brand.systemId, checked)}
            aria-label="Toggle status"
          />
        </div>
      );
    },
    size: 80,
    meta: {
      displayName: "Trạng thái",
      group: "Hệ thống"
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
      const brand = row as Brand;
      return (
        <span className="text-sm text-muted-foreground">
          {formatDate(brand.createdAt)}
        </span>
      );
    },
    meta: {
      displayName: "Ngày tạo",
      group: "Hệ thống"
    },
  },
  // Ngày cập nhật
  {
    id: "updatedAt",
    accessorKey: "updatedAt",
    header: ({ sorting, setSorting }) => (
      <DataTableColumnHeader 
        title="Cập nhật"
        sortKey="updatedAt"
        isSorted={sorting?.id === 'updatedAt'}
        sortDirection={sorting?.desc ? 'desc' : 'asc'}
        onSort={() => setSorting?.((s: any) => ({ id: 'updatedAt', desc: s.id === 'updatedAt' ? !s.desc : false }))}
      />
    ),
    cell: ({ row }) => {
      const brand = row as Brand;
      return (
        <span className="text-sm text-muted-foreground">
          {formatDate(brand.updatedAt)}
        </span>
      );
    },
    meta: {
      displayName: "Ngày cập nhật",
      group: "Hệ thống"
    },
  },
  // PKGX Actions Column
  {
    id: "pkgx",
    header: "PKGX",
    cell: ({ row }) => {
      const brand = row as Brand;
      const hasMapping = hasPkgxMapping?.(brand) ?? false;
      const pkgxId = getPkgxBrandId?.(brand);
      
      return (
        <PkgxBrandActionsCell
          brand={brand}
          hasPkgxMapping={hasMapping}
          pkgxBrandId={pkgxId}
          onPkgxLink={onPkgxLink}
          onPkgxUnlink={onPkgxUnlink}
          onPkgxViewDetail={onPkgxViewDetail}
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
    header: "Hành động",
    cell: ({ row }) => {
      const brand = row as Brand;
      
      return (
        <div className="flex items-center justify-end gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-7 w-7 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/brands/${brand.systemId}`);
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/brands/${brand.systemId}/edit`);
                }}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(brand.systemId);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa thương hiệu
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    size: 80,
    meta: {
      displayName: "Hành động",
      sticky: "right",
    },
  },
];
};
