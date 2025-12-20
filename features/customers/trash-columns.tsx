import * as React from "react";
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate, getDaysDiff } from '@/lib/date-utils';
import type { Customer } from './types'
import { Checkbox } from "../../components/ui/checkbox"
import { DataTableColumnHeader } from "../../components/data-table/data-table-column-header"
import { Badge } from "../../components/ui/badge"
import type { ColumnDef } from '../../components/data-table/types';
import { Button } from "../../components/ui/button";
import { Trash2, RotateCcw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";


export const getColumns = (
  navigate: (path: string) => void,
  onRestore: (systemId: string) => void,
  onPermanentDelete: (systemId: string) => void
): ColumnDef<Customer>[] => [
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
        title="Mã KH"
        sortKey="id"
        isSorted={sorting?.id === 'id'}
        sortDirection={sorting?.desc ? 'desc' : 'asc'}
        onSort={() => setSorting?.((s: any) => ({ id: 'id', desc: s.id === 'id' ? !s.desc : false }))}
       />
    ),
    cell: ({ row }) => <span className="font-mono">{row.id}</span>,
    meta: {
      displayName: "Mã KH",
      group: "Thông tin cơ bản"
    },
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ sorting, setSorting }) => (
      <DataTableColumnHeader 
        title="Tên khách hàng"
        sortKey="name"
        isSorted={sorting?.id === 'name'}
        sortDirection={sorting?.desc ? 'desc' : 'asc'}
        onSort={() => setSorting?.((s: any) => ({ id: 'name', desc: s.id === 'name' ? !s.desc : false }))}
       />
    ),
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate" title={row.name}>
        {row.name}
      </div>
    ),
    meta: {
      displayName: "Tên khách hàng",
      group: "Thông tin cá nhân"
    },
  },
  {
    id: "company",
    accessorKey: "company",
    header: "Công ty",
    cell: ({ row }) => row.company || '-',
    meta: {
      displayName: "Công ty",
      group: "Thông tin doanh nghiệp"
    },
  },
  {
    id: "taxCode",
    accessorKey: "taxCode",
    header: "Mã số thuế",
    cell: ({ row }) => row.taxCode || '-',
    meta: {
      displayName: "Mã số thuế",
      group: "Thông tin doanh nghiệp"
    },
  },
  {
    id: "phone",
    accessorKey: "phone",
    header: "Số điện thoại",
    cell: ({ row }) => row.phone || '-',
    meta: {
      displayName: "Số điện thoại",
      group: "Thông tin liên hệ"
    },
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.email || '-',
    meta: {
      displayName: "Email",
      group: "Thông tin liên hệ"
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      if (!row.status) return '-';
      
      const colorMap: Record<string, string> = {
        'Đang giao dịch': 'bg-green-500',
        'Ngừng Giao Dịch': 'bg-red-500',
      };
      
      return (
        <Badge className={colorMap[row.status] || 'bg-gray-500'}>
          {row.status}
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
        isSorted={sorting?.id === 'deletedAt'}
        sortDirection={sorting?.desc ? 'desc' : 'asc'}
        onSort={() => setSorting?.((s: any) => ({ id: 'deletedAt', desc: s.id === 'deletedAt' ? !s.desc : false }))}
       />
    ),
    cell: ({ row }) => {
      const deletedAt = row.deletedAt as string | undefined;
      if (!deletedAt) return '-';
      
      const now = getCurrentDate();
      const deleted = parseDate(deletedAt);
      const daysAgo = deleted ? getDaysDiff(now, deleted) : 0;
      
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
      const customer = row as unknown as Customer;
      
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
                    onRestore(customer.systemId);
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
                    onPermanentDelete(customer.systemId);
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
