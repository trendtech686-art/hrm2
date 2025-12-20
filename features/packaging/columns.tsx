import * as React from 'react';
import { Link } from '@/lib/next-compat';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate } from '@/lib/date-utils';
import type { PackagingSlip } from './types';
import type { PackagingStatus } from '../orders/types';
import type { ColumnDef } from '../../components/data-table/types';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Checkbox } from '../../components/ui/checkbox';
import { MoreHorizontal, PackageCheck, Printer, Ban } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';


const statusVariants: Record<PackagingStatus, "warning" | "success" | "destructive"> = {
    "Chờ đóng gói": "warning",
    "Đã đóng gói": "success",
    "Hủy đóng gói": "destructive",
};

export const getColumns = (
  onConfirm: (orderSystemId: string, packagingSystemId: string) => void,
  onCancel: (orderSystemId: string, packagingSystemId: string) => void,
  onPrint?: (packagingId: string) => void,
): ColumnDef<PackagingSlip>[] => [
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
        displayName: "Chọn",
        sticky: "left",
      },
    },
    { 
        id: 'id', 
        accessorKey: 'id', 
        header: 'Mã đóng gói', 
        cell: ({ row }) => (
            <Link to={`/packaging/${row.systemId}`} className="font-medium font-mono text-primary hover:underline">
                {row.id}
            </Link>
        ), 
        meta: { displayName: 'Mã đóng gói' } 
    },
    { 
        id: 'orderId', 
        accessorKey: 'orderId', 
        header: 'Mã đơn hàng', 
        cell: ({ row }) => (
            <Link to={`/orders/${row.orderSystemId}`} className="text-primary hover:underline">
                {row.orderId}
            </Link>
        ),
        meta: { displayName: 'Mã đơn hàng' } 
    },
    { 
        id: 'requestDate', 
        accessorKey: 'requestDate', 
        header: 'Ngày YC', 
        cell: ({ row }) => formatDate(row.requestDate),
        meta: { displayName: 'Ngày yêu cầu' } 
    },
    { 
        id: 'confirmDate', 
        accessorKey: 'confirmDate', 
        header: 'Ngày XN', 
        cell: ({ row }) => formatDate(row.confirmDate),
        meta: { displayName: 'Ngày xác nhận' } 
    },
     { 
        id: 'cancelDate', 
        accessorKey: 'cancelDate', 
        header: 'Ngày hủy', 
        cell: ({ row }) => formatDate(row.cancelDate),
        meta: { displayName: 'Ngày hủy' } 
    },
    { 
        id: 'requestingEmployeeName', 
        accessorKey: 'requestingEmployeeName', 
        header: 'NV Yêu cầu', 
        cell: ({ row }) => row.requestingEmployeeName,
        meta: { displayName: 'NV Yêu cầu' } 
    },
    { 
        id: 'confirmingEmployeeName', 
        accessorKey: 'confirmingEmployeeName', 
        header: 'NV Xác nhận', 
        cell: ({ row }) => row.confirmingEmployeeName || '-',
        meta: { displayName: 'NV Xác nhận' } 
    },
     { 
        id: 'cancelingEmployeeName', 
        accessorKey: 'cancelingEmployeeName', 
        header: 'NV Hủy', 
        cell: ({ row }) => row.cancelingEmployeeName || '-',
        meta: { displayName: 'NV Hủy' } 
    },
    { 
        id: 'assignedEmployeeName', 
        accessorKey: 'assignedEmployeeName', 
        header: 'NV được gán', 
        cell: ({ row }) => row.assignedEmployeeName || 'Chưa chỉ định',
        meta: { displayName: 'NV được gán' } 
    },
    {
        id: 'status',
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: ({ row }) => <Badge variant={statusVariants[row.status]}>{row.status}</Badge>,
        meta: { displayName: 'Trạng thái' }
    },
    {
        id: 'printStatus',
        accessorKey: 'printStatus',
        header: 'Trạng thái in',
        cell: ({ row }) => <Badge variant={row.printStatus === 'Đã in' ? 'success' : 'secondary'}>{row.printStatus}</Badge>,
        meta: { displayName: 'Trạng thái in' }
    },
    { 
        id: 'branchName', 
        accessorKey: 'branchName', 
        header: 'Chi nhánh', 
        cell: ({ row }) => row.branchName,
        meta: { displayName: 'Chi nhánh' } 
    },
    { 
        id: 'cancelReason', 
        accessorKey: 'cancelReason', 
        header: 'Lý do hủy', 
        cell: ({ row }) => row.cancelReason || '-',
        meta: { displayName: 'Lý do hủy' } 
    },
    {
        id: 'actions',
        header: () => <div className="text-right">Hành động</div>,
        cell: ({ row }) => (
            <div className="text-right">
                {row.status === 'Chờ đóng gói' && (
                    <Button variant="outline" size="sm" className="h-8" onClick={() => onConfirm(row.orderSystemId, row.systemId)}>
                        <PackageCheck className="mr-2 h-4 w-4" />
                        Xác nhận
                    </Button>
                )}
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 ml-2">
                            <span className="sr-only">Mở menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onPrint?.(row.systemId)}>
                            <Printer className="mr-2 h-4 w-4" /> In Phiếu Đóng Gói
                        </DropdownMenuItem>
                        {row.status !== 'Hủy đóng gói' && (
                            <DropdownMenuItem className="text-destructive" onSelect={() => onCancel(row.orderSystemId, row.systemId)}>
                                <Ban className="mr-2 h-4 w-4" /> Hủy yêu cầu
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        ),
        meta: { displayName: 'Hành động', sticky: 'right' },
    }
];
