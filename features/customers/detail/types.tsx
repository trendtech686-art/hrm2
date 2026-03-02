'use client';

import Link from 'next/link';
import { formatDate as formatDateUtil } from '@/lib/date-utils';
import { toast } from 'sonner';
import { Eye, MoreHorizontal, Printer, FileSpreadsheet, FileText, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import type { ColumnDef } from '../../../components/data-table/types';
import type { Order } from '../../orders/types';
import type { WarrantyTicket } from '../../warranty/types';
import type { Complaint } from '../../complaints/types';
import { WARRANTY_STATUS_LABELS, WARRANTY_STATUS_COLORS } from '../../warranty/types';
import { complaintStatusLabels, complaintStatusColors, complaintTypeLabels } from '../../complaints/types';
import { getWarrantyStatusBadge } from '../../warranty/utils/warranty-checker';

// ============================================
// Utility Functions
// ============================================

const normalizeCurrencyValue = (value?: number) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return 0;
  return Math.abs(value) < 0.005 ? 0 : value;
};

export const formatCurrency = (value?: number) => {
  const normalized = normalizeCurrencyValue(value);
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(normalized);
};

// ============================================
// Types
// ============================================

export type DrilldownSearch = {
  query: string;
  token: string;
};

// Extended order type with return info
export type OrderWithReturns = Order & {
  returnCount?: number;
  totalReturnValue?: number;
  returnIds?: string[];
};

export type ComplaintRow = Complaint & { assignedName: string };

// Product in customer's purchase history
export type PurchasedProduct = {
  systemId: string;
  name: string;
  quantity: number;
  orderId: string;
  orderDate: string;
  orderSystemId: string;
  productSystemId: string;
  warrantyMonths: number;
  warrantyExpiry: string;
  daysRemaining: number;
};

// Debt transaction type
export type DebtTransaction = {
  systemId: string;
  voucherId: string;
  originalSystemId: string;
  type: string;
  creator?: string;
  creatorId?: string;
  date: string;
  createdAt: string;
  description?: string;
  change: number;
  balance: number;
  displayAmount?: number;
  complaintSystemId?: string;
};

// ============================================
// Status Variants
// ============================================

export const orderStatusVariants: Record<string, "success" | "default" | "secondary" | "warning" | "destructive"> = {
  "Đặt hàng": "secondary",
  "Đang giao dịch": "warning",
  "Hoàn thành": "success",
  "Đã hủy": "destructive",
  // Prisma enum values
  "PENDING": "secondary",
  "CONFIRMED": "secondary",
  "PROCESSING": "warning",
  "PACKING": "warning",
  "PACKED": "warning",
  "READY_FOR_PICKUP": "warning",
  "SHIPPING": "warning",
  "DELIVERED": "success",
  "COMPLETED": "success",
  "FAILED_DELIVERY": "destructive",
  "RETURNED": "destructive",
  "CANCELLED": "destructive",
};

// ============================================
// Column Definitions
// ============================================

export const productColumns: ColumnDef<PurchasedProduct>[] = [
  { 
    id: 'orderId', 
    accessorKey: 'orderId', 
    header: 'Mã ĐH', 
    cell: ({ row }) => (
      <Link href={`/orders/${row.orderSystemId}`} className="font-medium text-primary hover:underline">
        {row.orderId}
      </Link>
    ), 
    meta: { displayName: 'Mã ĐH' } 
  },
  { 
    id: 'orderDate', 
    accessorKey: 'orderDate', 
    header: 'Ngày mua', 
    cell: ({ row }) => formatDateUtil(row.orderDate), 
    meta: { displayName: 'Ngày mua' } 
  },
  { 
    id: 'name', 
    accessorKey: 'name', 
    header: 'Tên sản phẩm', 
    cell: ({ row }) => (
      <Link href={`/products/${row.productSystemId}`} className="font-medium text-primary hover:underline">
        {row.name}
      </Link>
    ), 
    meta: { displayName: 'Tên sản phẩm' } 
  },
  { 
    id: 'quantity', 
    accessorKey: 'quantity', 
    header: 'SL', 
    cell: ({ row }) => row.quantity, 
    meta: { displayName: 'Số lượng' } 
  },
  { 
    id: 'warrantyMonths', 
    accessorKey: 'warrantyMonths', 
    header: 'Bảo hành', 
    cell: ({ row }) => row.warrantyMonths ? `${row.warrantyMonths} tháng` : '—', 
    meta: { displayName: 'Bảo hành' } 
  },
  { 
    id: 'warrantyExpiry', 
    accessorKey: 'warrantyExpiry', 
    header: 'Hết hạn BH', 
    cell: ({ row }) => row.warrantyExpiry ? formatDateUtil(row.warrantyExpiry) : '—', 
    meta: { displayName: 'Hết hạn BH' } 
  },
  { 
    id: 'daysRemaining', 
    accessorKey: 'daysRemaining', 
    header: 'Thời gian còn lại', 
    cell: ({ row }) => {
      if (!row.warrantyMonths) return '—';
      const badge = getWarrantyStatusBadge(row.daysRemaining);
      return <Badge variant={badge.variant}>{badge.label}</Badge>;
    }, 
    meta: { displayName: 'Thời gian còn lại' } 
  },
  { 
    id: 'actions', 
    header: 'Hành động', 
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Mở menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/products/${row.productSystemId}`}>
              <Eye className="mr-2 h-4 w-4" />
              Xem sản phẩm
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/orders/${row.orderSystemId}`}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Xem đơn hàng
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ), 
    meta: { displayName: 'Hành động', excludeFromExport: true } 
  },
];

export const warrantyColumns: ColumnDef<WarrantyTicket>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: 'Mã BH',
    cell: ({ row }) => (
      <Link href={`/warranty/${row.systemId}`} className="font-medium text-primary hover:underline">
        {row.id}
      </Link>
    ),
    meta: { displayName: 'Mã BH' },
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => (
      <Badge className={WARRANTY_STATUS_COLORS[row.status] || ''}>
        {WARRANTY_STATUS_LABELS[row.status] || row.status}
      </Badge>
    ),
    meta: { displayName: 'Trạng thái' },
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: 'Ngày tạo',
    cell: ({ row }) => formatDateUtil(row.createdAt),
    meta: { displayName: 'Ngày tạo' },
  },
  {
    id: 'branchName',
    accessorKey: 'branchName',
    header: 'Chi nhánh',
    cell: ({ row }) => row.branchName,
    meta: { displayName: 'Chi nhánh' },
  },
  {
    id: 'trackingCode',
    accessorKey: 'trackingCode',
    header: 'Mã vận đơn',
    cell: ({ row }) => row.trackingCode || '---',
    meta: { displayName: 'Mã vận đơn' },
  },
  {
    id: 'totalProducts',
    header: 'Sản phẩm',
    cell: ({ row }) => row.summary?.totalProducts ?? row.products.length,
    meta: { displayName: 'Sản phẩm' },
  },
  {
    id: 'actions',
    header: 'Hành động',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Mở menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/warranty/${row.systemId}`}>
              <Eye className="mr-2 h-4 w-4" />
              Xem chi tiết
            </Link>
          </DropdownMenuItem>
          {row.publicTrackingCode && (
            <DropdownMenuItem onClick={() => {
              const trackingUrl = `${window.location.origin}/tracking/warranty/${row.publicTrackingCode}`;
              navigator.clipboard.writeText(trackingUrl);
              toast.success('Đã copy link tracking');
            }}>
              <LinkIcon className="mr-2 h-4 w-4" />
              Copy link tracking
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    meta: { displayName: 'Hành động', excludeFromExport: true },
  },
];

export const complaintColumns: ColumnDef<ComplaintRow>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: 'Mã KN',
    cell: ({ row }) => (
      <Link href={`/complaints/${row.systemId}`} className="font-medium text-primary hover:underline">
        {row.id}
      </Link>
    ),
    meta: { displayName: 'Mã KN' },
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => (
      <Badge className={complaintStatusColors[row.status] || ''}>
        {complaintStatusLabels[row.status] || row.status}
      </Badge>
    ),
    meta: { displayName: 'Trạng thái' },
  },
  {
    id: 'type',
    accessorKey: 'type',
    header: 'Loại',
    cell: ({ row }) => complaintTypeLabels[row.type] || row.type,
    meta: { displayName: 'Loại' },
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: 'Ngày tạo',
    cell: ({ row }) => formatDateUtil(row.createdAt),
    meta: { displayName: 'Ngày tạo' },
  },
  {
    id: 'assignedName',
    accessorKey: 'assignedName',
    header: 'Nhân viên xử lý',
    cell: ({ row }) => row.assignedTo ? (
      <Link href={`/employees/${row.assignedTo}`} className="text-primary hover:underline">
        {row.assignedName}
      </Link>
    ) : 'Chưa giao',
    meta: { displayName: 'Nhân viên xử lý' },
  },
  {
    id: 'orderCode',
    accessorKey: 'orderCode',
    header: 'Đơn liên quan',
    cell: ({ row }) => (
      <Link href={`/orders/${row.orderSystemId}`} className="text-primary hover:underline">
        {row.orderCode || row.orderSystemId}
      </Link>
    ),
    meta: { displayName: 'Đơn liên quan' },
  },
  {
    id: 'actions',
    header: 'Hành động',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Mở menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/complaints/${row.systemId}`}>
              <Eye className="mr-2 h-4 w-4" />
              Xem chi tiết
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/orders/${row.orderSystemId}`}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Xem đơn hàng
            </Link>
          </DropdownMenuItem>
          {row.publicTrackingCode && (
            <DropdownMenuItem onClick={() => {
              const trackingUrl = `${window.location.origin}/tracking/complaint/${row.publicTrackingCode}`;
              navigator.clipboard.writeText(trackingUrl);
              toast.success('Đã copy link tracking');
            }}>
              <LinkIcon className="mr-2 h-4 w-4" />
              Copy link tracking
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    meta: { displayName: 'Hành động', excludeFromExport: true },
  },
];

export const debtColumns: ColumnDef<DebtTransaction>[] = [
  { 
    id: 'voucherId', 
    accessorKey: 'voucherId', 
    header: 'Mã phiếu', 
    cell: ({ row }) => {
      const path = row.type === 'order' ? `/orders/${row.originalSystemId}` 
        : row.type === 'receipt' ? `/receipts/${row.originalSystemId}` 
        : row.type === 'sales-return' ? `/returns/${row.originalSystemId}`
        : row.type === 'complaint-payment' ? `/payments/${row.originalSystemId}`
        : `/payments/${row.originalSystemId}`;
      return <Link href={path} className="font-medium text-primary hover:underline">{row.voucherId}</Link>;
    }, 
    meta: { displayName: 'Mã phiếu' } 
  },
  { 
    id: 'creator', 
    accessorKey: 'creator', 
    header: 'Người tạo', 
    cell: ({ row }) => {
      return row.creatorId ? (
        <Link href={`/employees/${row.creatorId}`} className="text-primary hover:underline">{row.creator}</Link>
      ) : (
        <span>{row.creator}</span>
      );
    }, 
    meta: { displayName: 'Người tạo' } 
  },
  { 
    id: 'createdAt', 
    accessorKey: 'createdAt', 
    header: 'Ngày Ghi nhận', 
    cell: ({ row }) => formatDateUtil(row.createdAt), 
    meta: { displayName: 'Ngày Ghi nhận' } 
  },
  { 
    id: 'description', 
    accessorKey: 'description', 
    header: 'Ghi chú', 
    cell: ({ row }) => {
      // Hiển thị badge cho complaint payment
      if (row.type === 'complaint-payment') {
        return (
          <span className="flex items-center gap-1">
            <span>{row.description}</span>
            <Badge variant="outline" className="text-[10px] px-1 py-0">Khiếu nại</Badge>
          </span>
        );
      }
      return row.description;
    }, 
    meta: { displayName: 'Ghi chú' } 
  },
  { 
    id: 'change', 
    accessorKey: 'change', 
    header: 'Giá trị thay đổi', 
    cell: ({ row }) => {
      // Hiển thị displayAmount nếu có (cho phiếu chi hoàn tiền từ trả hàng/khiếu nại)
      const displayValue = row.displayAmount !== undefined ? row.displayAmount : row.change;
      const isRefundFromReturn = row.type === 'payment' && row.displayAmount !== undefined;
      const isRefundFromComplaint = row.type === 'complaint-payment';
      
      // Positive = khách nợ thêm (đơn hàng) → màu đỏ (nợ tăng)
      // Negative = khách trả nợ (thanh toán) → màu xanh lá (nợ giảm)
      const isDebtIncrease = displayValue > 0;
      const prefix = isDebtIncrease ? '+' : '';
      
      return (
        <span className={isDebtIncrease ? 'text-red-600' : 'text-green-600'}>
          {prefix}{formatCurrency(displayValue)}
          {(isRefundFromReturn || isRefundFromComplaint) && <span className="text-xs text-muted-foreground ml-1">(tiền mặt)</span>}
        </span>
      );
    }, 
    meta: { displayName: 'Giá trị thay đổi' } 
  },
  { 
    id: 'balance', 
    accessorKey: 'balance', 
    header: 'Công nợ', 
    cell: ({ row }) => <span className="font-semibold">{formatCurrency(row.balance)}</span>, 
    meta: { displayName: 'Công nợ' } 
  },
  { 
    id: 'actions', 
    header: 'Hành động', 
    cell: ({ row }) => {
      const path = row.type === 'order' ? `/orders/${row.originalSystemId}` 
        : row.type === 'receipt' ? `/receipts/${row.originalSystemId}` 
        : row.type === 'sales-return' ? `/returns/${row.originalSystemId}`
        : row.type === 'complaint-payment' ? `/payments/${row.originalSystemId}`
        : `/payments/${row.originalSystemId}`;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Mở menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={path}>
                <Eye className="mr-2 h-4 w-4" />
                Xem chi tiết
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              In
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.info('Chức năng xuất PDF đang phát triển')}>
              <FileText className="mr-2 h-4 w-4" />
              Xuất PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.info('Chức năng xuất Excel đang phát triển')}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Xuất Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }, 
    meta: { displayName: 'Hành động', excludeFromExport: true } 
  },
];

// Helper to create order columns with returns info
export const createOrderColumnsWithReturns = (): ColumnDef<OrderWithReturns>[] => [
  { 
    id: 'id', 
    accessorKey: 'id', 
    header: 'Mã ĐH', 
    cell: ({ row }) => <span className="font-medium">{row.id}</span>, 
    meta: { displayName: 'Mã ĐH' } 
  },
  { 
    id: 'orderDate', 
    accessorKey: 'orderDate', 
    header: 'Ngày đặt', 
    cell: ({ row }) => formatDateUtil(row.orderDate), 
    meta: { displayName: 'Ngày đặt' } 
  },
  { 
    id: 'status', 
    accessorKey: 'status', 
    header: 'Trạng thái', 
    cell: ({ row }) => {
      let displayStatus = row.status;
      if (row.status === 'Đặt hàng' && (row.stockOutStatus === 'Xuất kho toàn bộ' || row.deliveryStatus === 'Đang giao hàng' || row.deliveryStatus === 'Đã giao hàng')) {
        displayStatus = 'Đang giao dịch';
      }
      return <Badge variant={orderStatusVariants[displayStatus] || orderStatusVariants[row.status]}>{displayStatus}</Badge>;
    }, 
    meta: { displayName: 'Trạng thái' } 
  },
  { 
    id: 'grandTotal', 
    accessorKey: 'grandTotal', 
    header: 'Tổng tiền', 
    cell: ({ row }) => formatCurrency(row.grandTotal), 
    meta: { displayName: 'Tổng tiền' } 
  },
  { 
    id: 'returns', 
    header: 'Hoàn trả', 
    cell: ({ row }) => {
      if (!row.returnCount || row.returnCount === 0) {
        return <span className="text-muted-foreground">-</span>;
      }
      return (
        <div className="flex flex-col">
          <span className="text-amber-600 font-medium">{row.returnCount} phiếu</span>
          <span className="text-xs text-muted-foreground">{formatCurrency(row.totalReturnValue || 0)}</span>
        </div>
      );
    }, 
    meta: { displayName: 'Hoàn trả' } 
  },
  { 
    id: 'actions', 
    header: 'Hành động', 
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/orders/${row.systemId}`}>
              <Eye className="mr-2 h-4 w-4" />
              Xem chi tiết
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            In
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toast.info('Chức năng xuất PDF đang phát triển')}>
            <FileText className="mr-2 h-4 w-4" />
            Xuất PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toast.info('Chức năng xuất Excel đang phát triển')}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Xuất Excel
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ), 
    meta: { displayName: 'Hành động', excludeFromExport: true } 
  },
];
