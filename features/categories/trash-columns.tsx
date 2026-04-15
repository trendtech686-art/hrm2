import * as React from "react";
import { formatDate, getDaysDiff, getCurrentDate } from '@/lib/date-utils';
import type { Category } from './api/categories-api'
import type { SystemId } from "@/lib/id-types";
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import type { ColumnDef } from '@/components/data-table/types';
import { Button } from "@/components/ui/button";
import { Trash2, RotateCcw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type TrashCategory = Omit<Category, 'systemId' | 'deletedAt'> & { 
  systemId: SystemId; 
  deletedAt?: string | null;
};

export const getColumns = (
  onRestore: (systemId: SystemId) => void,
  onPermanentDelete: (systemId: SystemId) => void
): ColumnDef<TrashCategory>[] => [
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
  {
    id: "id",
    accessorKey: "id",
    header: ({ sorting, setSorting }) => (
      <DataTableColumnHeader 
        title="Mã"
        sortKey="id"
        isSorted={sorting?.id === 'id'}
        sortDirection={sorting?.desc ? 'desc' : 'asc'}
        onSort={() => setSorting?.((s: { id: string; desc: boolean }) => ({ id: 'id', desc: s.id === 'id' ? !s.desc : false }))}
       />
    ),
    cell: ({ row }) => <span className="font-mono">{row.id}</span>,
    meta: {
      displayName: "Mã danh mục",
      group: "Thông tin cơ bản"
    },
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ sorting, setSorting }) => (
      <DataTableColumnHeader 
        title="Tên danh mục"
        sortKey="name"
        isSorted={sorting?.id === 'name'}
        sortDirection={sorting?.desc ? 'desc' : 'asc'}
        onSort={() => setSorting?.((s: { id: string; desc: boolean }) => ({ id: 'name', desc: s.id === 'name' ? !s.desc : false }))}
       />
    ),
    cell: ({ row }) => (
      <div className="max-w-63">
        <div className="truncate text-sm font-medium" title={row.name}>
          {row.name}
        </div>
        {row.path && (
          <div className="text-xs text-muted-foreground truncate" title={row.path}>
            {row.path}
          </div>
        )}
      </div>
    ),
    meta: {
      displayName: "Tên danh mục",
      group: "Thông tin cơ bản"
    },
  },
  {
    id: "deletedAt",
    accessorKey: "deletedAt",
    header: ({ sorting, setSorting }) => (
      <DataTableColumnHeader 
        title="Ngày xóa"
        sortKey="deletedAt"
        isSorted={sorting?.id === 'deletedAt'}
        sortDirection={sorting?.desc ? 'desc' : 'asc'}
        onSort={() => setSorting?.((s: { id: string; desc: boolean }) => ({ id: 'deletedAt', desc: s.id === 'deletedAt' ? !s.desc : false }))}
       />
    ),
    cell: ({ row }) => {
      const deletedAt = row.deletedAt as unknown as string | undefined;
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
      const category = row;
      
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
                    onRestore(category.systemId as SystemId);
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
                    onPermanentDelete(category.systemId as SystemId);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Lưu trữ vĩnh viễn</TooltipContent>
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
