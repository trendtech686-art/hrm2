import * as React from "react";
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate, getDaysDiff } from '@/lib/date-utils';
import type { Employee } from '@/lib/types/prisma-extended'
import type { Branch } from "../settings/branches/types";
import { Checkbox } from "../../components/ui/checkbox"
import { DataTableColumnHeader } from "../../components/data-table/data-table-column-header"
import { Badge } from "../../components/ui/badge"
import type { ColumnDef } from '../../components/data-table/types';
import { Button } from "../../components/ui/button";
import { Trash2, RotateCcw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";


export const getColumns = (
  router: AppRouterInstance,
  onRestore: (systemId: string) => void,
  onPermanentDelete: (systemId: string) => void,
  branches: Branch[]
): ColumnDef<Employee>[] => [
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
        title="Mã NV"
        sortKey="id"
        isSorted={sorting?.id === 'id'}
        sortDirection={sorting?.desc ? 'desc' : 'asc'}
        onSort={() => setSorting?.((s: any) => ({ id: 'id', desc: s.id === 'id' ? !s.desc : false }))}
       />
    ),
    cell: ({ row }) => <span className="font-mono">{row.id}</span>,
    meta: {
      displayName: "Mã NV",
      group: "Thông tin cơ bản"
    },
  },
  {
    id: "fullName",
    accessorKey: "fullName",
    header: ({ sorting, setSorting }) => (
      <DataTableColumnHeader 
        title="Họ và tên"
        sortKey="fullName"
        isSorted={sorting?.id === 'fullName'}
        sortDirection={sorting?.desc ? 'desc' : 'asc'}
        onSort={() => setSorting?.((s: any) => ({ id: 'fullName', desc: s.id === 'fullName' ? !s.desc : false }))}
       />
    ),
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate" title={row.fullName}>
        {row.fullName}
      </div>
    ),
    meta: {
      displayName: "Họ và tên",
      group: "Thông tin cá nhân"
    },
  },
  {
    id: "department",
    accessorKey: "department",
    header: "Phòng ban",
    cell: ({ row }) => row.department || '-',
    meta: {
      displayName: "Phòng ban",
      group: "Thông tin công việc"
    },
  },
  {
    id: "jobTitle",
    accessorKey: "jobTitle",
    header: "Chức danh",
    cell: ({ row }) => row.jobTitle || '-',
    meta: {
      displayName: "Chức danh",
      group: "Thông tin công việc"
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
    id: "workEmail",
    accessorKey: "workEmail",
    header: "Email",
    cell: ({ row }) => row.workEmail || '-',
    meta: {
      displayName: "Email",
      group: "Thông tin liên hệ"
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
      
      const currentDate = getCurrentDate();
      const deleted = parseDate(deletedAt);
      const daysAgo = getDaysDiff(currentDate, deleted);
      
      return (
        <div className="text-body-sm">
          <div>{formatDate(deletedAt)}</div>
          <div className="text-body-xs text-muted-foreground">
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
      const employee = row as unknown as Employee;
      
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
                    onRestore(employee.systemId);
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
                    onPermanentDelete(employee.systemId);
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
