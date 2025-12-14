import * as React from "react";
import * as ReactRouterDOM from "react-router-dom";
import { Link } from "react-router-dom";
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate } from '@/lib/date-utils';
import type { Order, OrderMainStatus, OrderPaymentStatus, OrderDeliveryStatus, OrderPrintStatus, OrderStockOutStatus, OrderReturnStatus, Packaging } from './types.ts';
import { Checkbox } from "../../components/ui/checkbox.tsx";
import { DataTableColumnHeader } from "../../components/data-table/data-table-column-header.tsx";
import { Badge } from "../../components/ui/badge.tsx";
import type { ColumnDef } from '../../components/data-table/types.ts';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../../components/ui/dropdown-menu.tsx";
import { Button } from "../../components/ui/button.tsx";
import { MoreHorizontal } from "lucide-react";

// This is a temporary type for the column until the Order type is fully updated.
type OrderPackagingStatus_DEPRECATED = 'Chưa đóng gói' | 'Chờ xác nhận đóng gói' | 'Đóng gói toàn bộ';

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number') return '';
    return new Intl.NumberFormat('vi-VN').format(value);
};

const mainStatusVariants: Record<OrderMainStatus, "success" | "default" | "secondary" | "warning" | "destructive"> = {
    "Đặt hàng": "secondary",
    "Đang giao dịch": "warning",
    "Hoàn thành": "success",
    "Đã hủy": "destructive",
};

const paymentStatusVariants: Record<OrderPaymentStatus, "success" | "warning" | "secondary"> = {
  'Chưa thanh toán': 'warning',
  'Thanh toán 1 phần': 'warning',
  'Thanh toán toàn bộ': 'success',
};

const packagingStatusVariants: Record<OrderPackagingStatus_DEPRECATED, "success" | "warning" | "secondary"> = {
  'Chưa đóng gói': 'secondary',
  'Chờ xác nhận đóng gói': 'warning',
  'Đóng gói toàn bộ': 'success',
};

const deliveryStatusVariants: Record<OrderDeliveryStatus, "success" | "warning" | "secondary" | "default" | "destructive"> = {
  'Chờ đóng gói': 'secondary',
  'Đã đóng gói': 'default',
  'Chờ lấy hàng': 'warning',
  'Đang giao hàng': 'warning',
  'Đã giao hàng': 'success',
  'Chờ giao lại': 'destructive',
  'Đã hủy': 'destructive',
};

const printStatusVariants: Record<OrderPrintStatus, "success" | "secondary"> = {
  'Đã in': 'success',
  'Chưa in': 'secondary',
};

const stockOutStatusVariants: Record<OrderStockOutStatus, "success" | "secondary"> = {
  'Chưa xuất kho': 'secondary',
  'Xuất kho toàn bộ': 'success',
};

const returnStatusVariants: Record<OrderReturnStatus, "warning" | "destructive" | "secondary"> = {
  'Chưa trả hàng': 'secondary',
  'Trả hàng một phần': 'warning',
  'Trả hàng toàn bộ': 'destructive',
};


export interface OrderColumnActions {
  onCancel: (systemId: string) => void;
  navigate: (path: string) => void;
  onPrintOrder?: (order: Order) => void;
  onPrintPacking?: (order: Order) => void;
  onPrintShippingLabel?: (order: Order) => void;
  onPrintDelivery?: (order: Order) => void;
}

export const getColumns = (
  onCancel: (systemId: string) => void,
  navigate: (path: string) => void,
  printActions?: {
    onPrintOrder?: (order: Order) => void;
    onPrintPacking?: (order: Order) => void;
    onPrintShippingLabel?: (order: Order) => void;
    onPrintDelivery?: (order: Order) => void;
  }
): ColumnDef<Order>[] => [
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
    header: "Mã ĐH",
    cell: ({ row }) => (
      <Link 
        to={`/orders/${row.systemId}`} 
        className="text-body-sm font-medium text-primary hover:underline"
      >
        {row.id}
      </Link>
    ),
    meta: { displayName: "Mã ĐH", group: "Thông tin chung" },
    size: 120,
  },
  {
    id: "customerName",
    accessorKey: "customerName",
    header: "Tên khách hàng",
    cell: ({ row }) => row.customerName,
    meta: { displayName: "Tên khách hàng", group: "Thông tin chung" },
  },
  {
    id: "orderDate",
    accessorKey: "orderDate",
    header: "Ngày tạo",
    cell: ({ row }) => formatDate(row.orderDate),
    meta: { displayName: "Ngày tạo", group: "Thông tin chung" },
  },
  {
    id: 'branchName',
    accessorKey: 'branchName',
    header: 'Chi nhánh',
    cell: ({ row }) => row.branchName,
    meta: { displayName: 'Chi nhánh', group: "Thông tin chung" }
  },
  {
    id: "salesperson",
    accessorKey: "salesperson",
    header: "NV Bán",
    cell: ({ row }) => row.salesperson,
    meta: { displayName: "NV Bán", group: "Nhân viên" },
  },
  {
    id: "grandTotal",
    accessorKey: "grandTotal",
    header: "Tổng tiền",
    cell: ({ row }) => formatCurrency(row.grandTotal),
    meta: { displayName: "Tổng tiền", group: "Tài chính" },
  },
  {
    id: 'totalPaid',
    header: 'Đã thanh toán',
    cell: ({ row }) => {
        const totalPaid = (row.payments || []).reduce((sum, p) => sum + p.amount, 0);
        return formatCurrency(totalPaid);
    },
    meta: { displayName: 'Đã thanh toán', group: "Tài chính" }
  },
  {
    id: 'debt',
    header: 'Còn lại',
    cell: ({ row }) => {
        const totalPaid = (row.payments || []).reduce((sum, p) => sum + p.amount, 0);
        const remaining = row.grandTotal - totalPaid;
        return <span className={remaining > 0 ? 'text-body-sm text-destructive font-semibold' : ''}>{formatCurrency(remaining)}</span>;
    },
    meta: { displayName: 'Còn lại', group: "Tài chính" }
  },
  {
    id: "codAmount",
    accessorKey: "codAmount",
    header: "Thu hộ (COD)",
    cell: ({ row }) => formatCurrency(row.codAmount),
    meta: { displayName: "Thu hộ (COD)", group: "Tài chính" },
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => <Badge variant={mainStatusVariants[row.status]}>{row.status}</Badge>,
    meta: { displayName: "Trạng thái", group: "Trạng thái" },
  },
  {
    id: "paymentStatus",
    accessorKey: "paymentStatus",
    header: "TT Thanh toán",
    cell: ({ row }) => <Badge variant={paymentStatusVariants[row.paymentStatus]}>{row.paymentStatus}</Badge>,
    meta: { displayName: "TT Thanh toán", group: "Trạng thái" },
  },
  {
    id: "packagingStatus",
    accessorKey: "packagings",
    header: "TT Đóng gói",
    cell: ({ row }) => {
      const packagings = row.packagings || [];
      let status: OrderPackagingStatus_DEPRECATED = 'Chưa đóng gói';
      if (packagings.some((p: Packaging) => p.status === 'Đã đóng gói')) {
        status = 'Đóng gói toàn bộ';
      } else if (packagings.some((p: Packaging) => p.status === 'Chờ đóng gói')) {
        status = 'Chờ xác nhận đóng gói';
      }
      return <Badge variant={packagingStatusVariants[status]}>{status}</Badge>;
    },
    meta: { displayName: "TT Đóng gói", group: "Trạng thái" },
  },
  {
    id: "deliveryStatus",
    accessorKey: "deliveryStatus",
    header: "TT Giao hàng",
    cell: ({ row }) => <Badge variant={deliveryStatusVariants[row.deliveryStatus]}>{row.deliveryStatus}</Badge>,
    meta: { displayName: "TT Giao hàng", group: "Trạng thái" },
  },
  {
    id: "printStatus",
    accessorKey: "printStatus",
    header: "TT In",
    cell: ({ row }) => <Badge variant={printStatusVariants[row.printStatus]}>{row.printStatus}</Badge>,
    meta: { displayName: "TT In", group: "Trạng thái" },
  },
  {
    id: "stockOutStatus",
    accessorKey: "stockOutStatus",
    header: "TT Xuất kho",
    cell: ({ row }) => <Badge variant={stockOutStatusVariants[row.stockOutStatus]}>{row.stockOutStatus}</Badge>,
    meta: { displayName: "TT Xuất kho", group: "Trạng thái" },
  },
  {
    id: "returnStatus",
    accessorKey: "returnStatus",
    header: "TT Trả hàng",
    cell: ({ row }) => <Badge variant={returnStatusVariants[row.returnStatus]}>{row.returnStatus}</Badge>,
    meta: { displayName: "TT Trả hàng", group: "Trạng thái" },
  },
  {
    id: 'packerName',
    accessorKey: 'packagings',
    header: 'NV Đóng gói',
    cell: ({ row }) => {
      const latestActive = [...(row.packagings || [])].reverse().find(p => p.status !== 'Hủy đóng gói');
      // FIX: Changed `packerName` to `assignedEmployeeName` to match the `Packaging` type definition.
      return latestActive?.assignedEmployeeName || '-';
    },
    meta: { displayName: 'NV Đóng gói', group: "Nhân viên" }
  },
  {
    id: 'source',
    accessorKey: 'source',
    header: 'Nguồn',
    cell: ({ row }) => row.source || '-',
    meta: { displayName: 'Nguồn', group: "Thông tin chung" }
  },
  {
    id: 'deliveryMethod',
    accessorKey: 'deliveryMethod',
    header: 'Hình thức giao',
    cell: ({ row }) => row.deliveryMethod || '-',
    meta: { displayName: 'Hình thức giao', group: "Thông tin chung" }
  },
   {
    id: "actions",
    header: () => <div className="text-center">Hành động</div>,
    cell: ({ row }) => {
      const hasPackaging = row.packagings && row.packagings.length > 0;
      const hasConfirmedPackaging = row.packagings?.some((p: Packaging) => p.status === 'Đã đóng gói');
      
      return (
       <div className="flex items-center justify-center">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Mở menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => navigate(`/orders/${row.systemId}`)}>
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => navigate(`/orders/${row.systemId}/edit`)}>
                Sửa
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onSelect={() => printActions?.onPrintOrder?.(row)}>
                In đơn hàng
              </DropdownMenuItem>
              <DropdownMenuItem 
                onSelect={() => printActions?.onPrintPacking?.(row)}
                disabled={!hasPackaging}
              >
                In phiếu đóng gói
              </DropdownMenuItem>
              <DropdownMenuItem 
                onSelect={() => printActions?.onPrintShippingLabel?.(row)}
                disabled={!hasConfirmedPackaging}
              >
                In nhãn giao hàng
              </DropdownMenuItem>
              <DropdownMenuItem 
                onSelect={() => printActions?.onPrintDelivery?.(row)}
                disabled={!hasConfirmedPackaging}
              >
                In phiếu giao hàng
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem className="text-destructive" onSelect={() => onCancel(row.systemId)}>
                Hủy đơn hàng
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
