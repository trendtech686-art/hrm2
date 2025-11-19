import * as React from "react";
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, getCurrentDate, isValidDate, getDaysDiff } from '@/lib/date-utils';
import type { Product } from './types.ts'
import type { SystemId } from "@/lib/id-types";
import { Checkbox } from "../../components/ui/checkbox.tsx"
import { DataTableColumnHeader } from "../../components/data-table/data-table-column-header.tsx"
import { Badge } from "../../components/ui/badge.tsx"
import type { ColumnDef } from '../../components/data-table/types.ts';
import { Button } from "../../components/ui/button.tsx";
import { Trash2, RotateCcw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip.tsx";


const getStatusBadgeVariant = (status?: string) => {
  if (!status) return 'secondary';
  switch (status) {
    case 'active':
      return 'success';
    case 'discontinued':
      return 'destructive';
    default:
      return 'secondary';
  }
};

const getStatusLabel = (status?: string) => {
  if (!status) return '-';
  switch (status) {
    case 'active':
      return 'Hoạt động';
    case 'inactive':
      return 'Tạm ngừng';
    case 'discontinued':
      return 'Ngừng kinh doanh';
    default:
      return status;
  }
};

export const getColumns = (
  navigate: (path: string) => void,
  onRestore: (systemId: SystemId) => void,
  onPermanentDelete: (systemId: SystemId) => void
): ColumnDef<Product>[] => [
  {
    id: "select",
    header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll }) => (
        <Checkbox
          checked={isAllPageRowsSelected ? true : isSomePageRowsSelected ? "indeterminate" : false}
          onCheckedChange={(value) => onToggleAll(!!value)}
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
  {
    id: "id",
    accessorKey: "id",
    header: ({ sorting, setSorting }) => (
      <DataTableColumnHeader 
        title="Mã SP"
        sortKey="id"
        isSorted={sorting.id === 'id'}
        sortDirection={sorting.desc ? 'desc' : 'asc'}
        onSort={() => setSorting((s: any) => ({ id: 'id', desc: s.id === 'id' ? !s.desc : false }))}
       />
    ),
    cell: ({ row }) => <span className="font-mono">{row.id}</span>,
    meta: {
      displayName: "Mã SP",
      group: "Thông tin cơ bản"
    },
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ sorting, setSorting }) => (
      <DataTableColumnHeader 
        title="Tên sản phẩm"
        sortKey="name"
        isSorted={sorting.id === 'name'}
        sortDirection={sorting.desc ? 'desc' : 'asc'}
        onSort={() => setSorting((s: any) => ({ id: 'name', desc: s.id === 'name' ? !s.desc : false }))}
       />
    ),
    cell: ({ row }) => (
      <div className="max-w-[250px]">
        <div className="truncate font-medium" title={row.name}>
          {row.name}
        </div>
        {row.shortDescription && (
          <div className="text-xs text-muted-foreground truncate" title={row.shortDescription}>
            {row.shortDescription}
          </div>
        )}
      </div>
    ),
    meta: {
      displayName: "Tên sản phẩm",
      group: "Thông tin cơ bản"
    },
  },
  {
    id: "categorySystemId",
    accessorKey: "categorySystemId",
    header: "Danh mục",
    cell: ({ row }) => row.categorySystemId || '-',
    meta: {
      displayName: "Danh mục",
      group: "Phân loại"
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const variant = getStatusBadgeVariant(row.status);
      const label = getStatusLabel(row.status);
      
      return (
        <Badge variant={variant as any}>
          {label}
        </Badge>
      );
    },
    meta: {
      displayName: "Trạng thái",
      group: "Phân loại"
    },
  },
  {
    id: "deletedAt",
    accessorKey: "deletedAt",
    header: ({ sorting, setSorting }) => (
      <DataTableColumnHeader 
        title="Ngày xóa"
        sortKey="deletedAt"
        isSorted={sorting.id === 'deletedAt'}
        sortDirection={sorting.desc ? 'desc' : 'asc'}
        onSort={() => setSorting((s: any) => ({ id: 'deletedAt', desc: s.id === 'deletedAt' ? !s.desc : false }))}
       />
    ),
    cell: ({ row }) => {
      const deletedAt = row.deletedAt as string | undefined;
      if (!deletedAt) return '-';
      
      const now = getCurrentDate();
      const deleted = new Date(deletedAt);
      const daysAgo = getDaysDiff(now, deleted);
      
      return (
        <div className="text-sm">
          <div>{formatDate(deletedAt)}</div>
          <div className="text-xs text-muted-foreground">
            {daysAgo === 0 ? 'Hôm nay' : `${daysAgo} ngày trước`}
          </div>
        </div>
      );
    },
    meta: {
      displayName: "Ngày xóa",
      group: "Thông tin xóa"
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Hành động</div>,
    cell: ({ row }) => {
      const product = row;
      
      return (
       <div className="flex items-center justify-center gap-0.5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-7 w-7 p-0 text-green-600 hover:text-green-600 hover:bg-green-600/10" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRestore(product.systemId);
                  }}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Khôi phục</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onPermanentDelete(product.systemId);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Xóa vĩnh viễn</TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
