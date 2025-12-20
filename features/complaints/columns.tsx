'use client'

import * as React from 'react';
import { useNavigate } from '@/lib/next-compat';
import { ColumnDef } from '../../components/data-table/types';
import { Checkbox } from '../../components/ui/checkbox';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { 
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Phone,
  Package,
  Calendar,
  User,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { formatDate } from '../../lib/date-utils';
import { Complaint, complaintStatusLabels, complaintStatusColors, complaintTypeLabels, complaintTypeColors } from './types';
import { checkOverdue, formatTimeLeft } from './sla-utils';
import { generateTrackingUrl, getTrackingCode, isTrackingEnabled } from './tracking-utils';
import { toast } from 'sonner';

export const getColumns = (
  onView: (systemId: string) => void,
  onEdit: (systemId: string) => void,
  onFinish: (systemId: string) => void,
  onOpen: (systemId: string) => void,
  onCancel: (systemId: string) => void,
  onGetLink: (systemId: string) => void,
  employees: Array<{ systemId: string; fullName: string }>,
  navigate: ReturnType<typeof useNavigate>
): ColumnDef<Complaint>[] => [
  // Select column
  {
    id: 'select',
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
      sticky: 'left',
      displayName: 'Chọn',
    },
  },

  // ID column - Clickable
  {
    id: 'complaintId',
    accessorKey: 'id',
    header: 'Mã khiếu nại',
    cell: ({ row }) => (
      <button
        onClick={() => onView(row.systemId)}
        className="text-primary hover:underline font-medium"
      >
        {row.id}
      </button>
    ),
    size: 140,
    meta: {
      displayName: 'Mã khiếu nại',
    },
  },

  // Order Code
  {
    id: 'orderCode',
    accessorKey: 'orderCode',
    header: 'Mã đơn hàng',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Package className="h-4 w-4 text-muted-foreground" />
        <button
          onClick={() => navigate(`/orders/${row.orderSystemId}`)}
          className="font-medium text-primary hover:underline"
        >
          {row.orderCode || row.orderSystemId}
        </button>
      </div>
    ),
    size: 140,
    meta: {
      displayName: 'Mã đơn hàng',
    },
  },

  // Customer Name
  {
    id: 'customerName',
    accessorKey: 'customerName',
    header: 'Khách hàng',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <button
          onClick={() => navigate(`/customers/${row.customerSystemId}`)}
          className="font-medium text-primary hover:underline text-left"
        >
          {row.customerName}
        </button>
        <span className="text-body-xs text-muted-foreground flex items-center gap-1">
          <Phone className="h-3 w-3" />
          {row.customerPhone}
        </span>
      </div>
    ),
    size: 180,
    meta: {
      displayName: 'Khách hàng',
    },
  },

  // Type
  {
    id: 'type',
    accessorKey: 'type',
    header: 'Loại khiếu nại',
    cell: ({ row }) => {
      const type = row.type;
      const typeLabels = {
        'wrong-product': 'Sai hàng',
        'missing-items': 'Thiếu hàng',
        'wrong-packaging': 'Đóng gói sai quy cách',
        'warehouse-defect': 'Trả hàng lỗi do kho',
        'product-condition': 'Khách phàn nàn về tình trạng hàng',
      };
      return <span>{typeLabels[type as keyof typeof typeLabels] || complaintTypeLabels[type]}</span>;
    },
    size: 180,
    meta: {
      displayName: 'Loại khiếu nại',
    },
  },

  // Priority
  {
    id: 'priority',
    accessorKey: 'priority',
    header: 'Mức độ',
    cell: ({ row }) => {
      const priority = row.priority;
      const priorityLabels = {
        low: 'Thấp',
        medium: 'Trung bình',
        high: 'Cao',
        urgent: 'Khẩn cấp',
      };
      return <span>{priorityLabels[priority as keyof typeof priorityLabels] || 'Trung bình'}</span>;
    },
    size: 130,
    meta: {
      displayName: 'Mức độ',
    },
  },

  // Status
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => {
      const status = row.status;
      const statusLabels = {
        pending: 'Chờ xử lý',
        investigating: 'Đang kiểm tra',
        resolved: 'Đã giải quyết',
        cancelled: 'Đã hủy',
        ended: 'Kết thúc',
      };
      return <span>{statusLabels[status as keyof typeof statusLabels] || status}</span>;
    },
    size: 140,
    meta: {
      displayName: 'Trạng thái',
    },
  },

  // SLA Status
  {
    id: 'slaStatus',
    header: 'SLA',
    cell: ({ row }) => {
      const overdueStatus = checkOverdue(row);
      
      if (!overdueStatus.isOverdueResponse && !overdueStatus.isOverdueResolve) {
        return <span>Trong hạn</span>;
      }

      if (row.status === 'resolved') {
        const hours = Math.abs(overdueStatus.resolveTimeLeft);
        return <span>Quá {Math.floor(hours)}h</span>;
      }

      const hours = Math.abs(overdueStatus.resolveTimeLeft);
      return <span>Quá {Math.floor(hours)}h</span>;
    },
    size: 140,
    meta: {
      displayName: 'SLA',
    },
  },

  // Assigned To
  {
    id: 'assignedTo',
    accessorKey: 'assignedTo',
    header: 'Người xử lý',
    cell: ({ row }) => {
      const assignedTo = row.assignedTo;
      if (!assignedTo) {
        return <span className="text-muted-foreground italic">Chưa phân công</span>;
      }
      const employee = employees.find(e => e.systemId === assignedTo);
      return (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span>{employee?.fullName || 'Không xác định'}</span>
        </div>
      );
    },
    size: 160,
    meta: {
      displayName: 'Người xử lý',
    },
  },

  // Created At
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: 'Ngày tạo',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span className="text-body-sm">{formatDate(row.createdAt)}</span>
      </div>
    ),
    size: 140,
    meta: {
      displayName: 'Ngày tạo',
    },
  },

  // Updated At
  {
    id: 'updatedAt',
    accessorKey: 'updatedAt',
    header: 'Cập nhật',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        {formatDate(row.updatedAt)}
      </div>
    ),
    size: 140,
    meta: {
      displayName: 'Cập nhật',
    },
  },

  // Verification Status
  {
    id: 'verification',
    accessorKey: 'verification',
    header: 'Xác minh',
    cell: ({ row }) => {
      const verification = row.verification;
      const verificationLabels = {
        'verified-correct': 'Đúng',
        'verified-incorrect': 'Sai',
        'pending-verification': 'Chưa xác minh',
      };
      return <span>{verificationLabels[verification as keyof typeof verificationLabels] || 'Chưa xác minh'}</span>;
    },
    size: 130,
    meta: {
      displayName: 'Xác minh',
    },
  },

  // Branch
  {
    id: 'branch',
    accessorKey: 'branchName',
    header: 'Chi nhánh',
    cell: ({ row }) => {
      const branchName = row.branchName;
      if (!branchName) {
        return <span className="text-muted-foreground italic">Chưa có</span>;
      }
      return <span>{branchName}</span>;
    },
    size: 150,
    meta: {
      displayName: 'Chi nhánh',
    },
  },

  // Affected Products Count
  {
    id: 'affectedProducts',
    header: 'SP ảnh hưởng',
    cell: ({ row }) => {
      const products = (row as any).affectedProducts || [];
      if (products.length === 0) {
        return <span className="text-muted-foreground">0</span>;
      }
      return (
        <div className="flex items-center gap-1">
          <Package className="h-4 w-4 text-orange-600" />
          <span className="font-medium">{products.length}</span>
        </div>
      );
    },
    size: 110,
    meta: {
      displayName: 'SP ảnh hưởng',
    },
  },

  // Resolved At
  {
    id: 'resolvedAt',
    accessorKey: 'resolvedAt',
    header: 'Ngày giải quyết',
    cell: ({ row }) => {
      if (!row.resolvedAt) {
        return <span className="text-muted-foreground italic">Chưa giải quyết</span>;
      }
      return (
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <span className="text-body-sm">{formatDate(row.resolvedAt)}</span>
        </div>
      );
    },
    size: 160,
    meta: {
      displayName: 'Ngày giải quyết',
    },
  },

  // Cancelled At
  {
    id: 'cancelledAt',
    accessorKey: 'cancelledAt',
    header: 'Ngày hủy',
    cell: ({ row }) => {
      if (!row.cancelledAt) {
        return <span className="text-muted-foreground">-</span>;
      }
      return (
        <div className="flex items-center gap-2">
          <XCircle className="h-4 w-4 text-destructive" />
          <span className="text-body-sm">{formatDate(row.cancelledAt)}</span>
        </div>
      );
    },
    size: 160,
    meta: {
      displayName: 'Ngày hủy',
    },
  },

  // Description
  {
    id: 'description',
    accessorKey: 'description',
    header: 'Mô tả',
    cell: ({ row }) => (
      <div className="max-w-[300px] line-clamp-2" title={row.description}>
        {row.description}
      </div>
    ),
    size: 300,
    meta: {
      displayName: 'Mô tả',
    },
  },

  // Resolution
  {
    id: 'resolution',
    accessorKey: 'resolutionNote',
    header: 'Giải pháp',
    cell: ({ row }) => {
      const resolutionNote = row.resolutionNote;
      if (!resolutionNote) {
        return <span className="text-muted-foreground italic">Chưa có</span>;
      }
      return (
        <div className="max-w-[300px] line-clamp-2" title={resolutionNote}>
          {resolutionNote}
        </div>
      );
    },
    size: 300,
    meta: {
      displayName: 'Giải pháp',
    },
  },

  // Actions column - sticky right
  {
    id: 'actions',
    header: () => <div className="text-right">Thao tác</div>,
    cell: ({ row }) => {
      const complaint = row;
      const isResolved = complaint.status === 'resolved';
      
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Mở menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(complaint.systemId)}>
                Sửa
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => {
                  // Check if tracking is enabled
                  if (!isTrackingEnabled()) {
                    toast.error('Chức năng tracking chưa được bật. Vui lòng bật trong Cài đặt.');
                    return;
                  }
                  onGetLink(complaint.systemId);
                }}
              >
                Get Tracking
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {!isResolved && (
                <DropdownMenuItem onClick={() => onFinish(complaint.systemId)}>
                  Kết thúc
                </DropdownMenuItem>
              )}
              {isResolved && (
                <DropdownMenuItem onClick={() => onOpen(complaint.systemId)}>
                  Mở
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onCancel(complaint.systemId)}
                className="text-destructive focus:text-destructive"
              >
                Hủy
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    size: 90,
    meta: {
      sticky: 'right',
      displayName: 'Thao tác',
    },
  },
];
