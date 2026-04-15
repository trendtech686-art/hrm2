'use client'

import * as React from "react";
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import Link from 'next/link';
import { formatDate } from '@/lib/date-utils';
import type { Order, Packaging } from '@/lib/types/prisma-extended';
import { Checkbox } from "../../components/ui/checkbox";
import { Badge } from "../../components/ui/badge";
import type { ColumnDef } from '../../components/data-table/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  ORDER_STATUS_LABELS,
  DELIVERY_METHOD_LABELS,
} from '@/lib/constants/order-enums';

// Source labels for Vietnamese display
const ORDER_SOURCE_LABELS: Record<string, string> = {
  'DOIHANG': 'Đổi hàng',
  'Bán sỉ': 'Bán sỉ',
  'Website': 'Website',
  'Facebook': 'Facebook',
  'Zalo': 'Zalo',
  'Shopee': 'Shopee',
  'Lazada': 'Lazada',
  'Tiki': 'Tiki',
  'TikTok': 'TikTok',
  'POS': 'POS',
  'Offline': 'Tại cửa hàng',
};

// This is a temporary type for the column until the Order type is fully updated.
type OrderPackagingStatus_DEPRECATED = 'Chưa đóng gói' | 'Chờ xác nhận đóng gói' | 'Đóng gói toàn bộ';

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number') return '';
    return new Intl.NumberFormat('vi-VN').format(value);
};

// ✅ Main status variants - support both English enum and Vietnamese display
const mainStatusVariants: Record<string, "success" | "default" | "secondary" | "warning" | "destructive"> = {
    // English enum values
    "PENDING": "secondary",
    "CONFIRMED": "default",
    "PROCESSING": "warning",
    "PACKING": "warning",
    "PACKED": "default",
    "READY_FOR_PICKUP": "warning",
    "SHIPPING": "warning",
    "DELIVERED": "success",
    "COMPLETED": "success",
    "FAILED_DELIVERY": "destructive",
    "RETURNED": "destructive",
    "CANCELLED": "destructive",
    // Vietnamese display values (fallback)
    "Đặt hàng": "secondary",
    "Đang giao dịch": "warning",
    "Hoàn thành": "success",
    "Đã hủy": "destructive",
};

// ✅ Payment status variants - support both English enum and Vietnamese display
const paymentStatusVariants: Record<string, "success" | "warning" | "secondary"> = {
  // English enum
  'UNPAID': 'warning',
  'PARTIAL': 'warning',
  'PAID': 'success',
  // Vietnamese
  'Chưa thanh toán': 'warning',
  'Thanh toán 1 phần': 'warning',
  'Thanh toán toàn bộ': 'success',
};

const packagingStatusVariants: Record<OrderPackagingStatus_DEPRECATED, "success" | "warning" | "secondary"> = {
  'Chưa đóng gói': 'secondary',
  'Chờ xác nhận đóng gói': 'warning',
  'Đóng gói toàn bộ': 'success',
};

// ✅ Delivery status variants - support both English enum and Vietnamese display
const deliveryStatusVariants: Record<string, "success" | "warning" | "secondary" | "default" | "destructive"> = {
  // English enum
  'PENDING_PACK': 'secondary',
  'PACKED': 'default',
  'PENDING_SHIP': 'warning',
  'SHIPPING': 'warning',
  'DELIVERED': 'success',
  'RESCHEDULED': 'destructive',
  'CANCELLED': 'destructive',
  // Vietnamese
  'Chờ đóng gói': 'secondary',
  'Đã đóng gói': 'default',
  'Chờ lấy hàng': 'warning',
  'Đang giao hàng': 'warning',
  'Đã giao hàng': 'success',
  'Chờ giao lại': 'destructive',
  'Đã hủy': 'destructive',
};

// ✅ Print status variants - support both English enum and Vietnamese display
const printStatusVariants: Record<string, "success" | "secondary"> = {
  // English enum
  'NOT_PRINTED': 'secondary',
  'PRINTED': 'success',
  // Vietnamese
  'Đã in': 'success',
  'Chưa in': 'secondary',
};

// ✅ Stock out status variants - support both English enum and Vietnamese display
const stockOutStatusVariants: Record<string, "success" | "secondary"> = {
  // English enum
  'NOT_STOCKED_OUT': 'secondary',
  'FULLY_STOCKED_OUT': 'success',
  // Vietnamese
  'Chưa xuất kho': 'secondary',
  'Xuất kho toàn bộ': 'success',
};

// ✅ Return status variants - support both English enum and Vietnamese display
const returnStatusVariants: Record<string, "warning" | "destructive" | "secondary"> = {
  // English enum
  'NO_RETURN': 'secondary',
  'PARTIAL_RETURN': 'warning',
  'FULL_RETURN': 'destructive',
  // Vietnamese
  'Chưa trả hàng': 'secondary',
  'Trả hàng một phần': 'warning',
  'Trả hàng toàn bộ': 'destructive',
};

// ✅ Helper to get Vietnamese label for status
const getLabel = (value: string, labels: Record<string, string>): string => {
  return labels[value] || value;
};


export interface OrderColumnActions {
  onCancel: (systemId: string) => void;
  router: AppRouterInstance;
  onPrintOrder?: (order: Order) => void;
  onPrintPacking?: (order: Order) => void;
  onPrintShippingLabel?: (order: Order) => void;
  onPrintDelivery?: (order: Order) => void;
  onPrintProductLabels?: (order: Order) => void;
}

export const getColumns = (
  onCancel: (systemId: string) => void,
  router: AppRouterInstance,
  printActions?: {
    onPrintOrder?: (order: Order) => void;
    onPrintPacking?: (order: Order) => void;
    onPrintShippingLabel?: (order: Order) => void;
    onPrintDelivery?: (order: Order) => void;
    onPrintProductLabels?: (order: Order) => void;
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
      <Link href={`/orders/${row.systemId}`} 
        className="text-sm font-medium text-primary hover:underline"
        prefetch={true}
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
    cell: ({ row }) => formatCurrency(Number(row.grandTotal) || 0),
    meta: { displayName: "Tổng tiền", group: "Tài chính" },
  },
  {
    id: 'totalPaid',
    header: 'Đã thanh toán',
    cell: ({ row }) => {
        // ✅ Use paidAmount from DB (source of truth, updated by addOrderPaymentAction)
        const totalPaid = Number(row.paidAmount) || 0;
        // ✅ For exchange orders, include linkedSalesReturnValue as effective payment
        const linkedReturnValue = Number(row.linkedSalesReturnValue) || 0;
        return formatCurrency(totalPaid + linkedReturnValue);
    },
    meta: { displayName: 'Đã thanh toán', group: "Tài chính" }
  },
  {
    id: 'debt',
    header: 'Còn lại',
    cell: ({ row }) => {
        // ✅ Use paidAmount from DB (source of truth)
        const totalPaid = Number(row.paidAmount) || 0;
        // ✅ For exchange orders, subtract linkedSalesReturnValue
        const linkedReturnValue = Number(row.linkedSalesReturnValue) || 0;
        const remaining = (Number(row.grandTotal) || 0) - linkedReturnValue - totalPaid;
        return <span className={remaining > 0 ? 'text-sm text-destructive font-semibold' : ''}>{formatCurrency(Math.max(0, remaining))}</span>;
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
    cell: ({ row }) => {
      const label = getLabel(row.status, ORDER_STATUS_LABELS);
      return <Badge variant={mainStatusVariants[row.status] || 'default'}>{label}</Badge>;
    },
    meta: { displayName: "Trạng thái", group: "Trạng thái" },
  },
  {
    id: "paymentStatus",
    accessorKey: "paymentStatus",
    header: "TT Thanh toán",
    cell: ({ row }) => {
      // ✅ Use paidAmount from DB (source of truth)
      const totalPaid = Number(row.paidAmount) || 0;
      const linkedReturnValue = Number(row.linkedSalesReturnValue) || 0;
      // ✅ Net total = grandTotal - linkedReturnValue (for exchange orders)
      const netTotal = Math.max(0, (Number(row.grandTotal) || 0) - linkedReturnValue);
      
      // Determine actual payment status based on paidAmount vs netTotal
      let actualStatus: string;
      let label: string;
      
      if (totalPaid >= netTotal && netTotal > 0) {
        actualStatus = 'PAID';
        label = 'Đã thanh toán';
      } else if (totalPaid > 0) {
        actualStatus = 'PARTIAL';
        label = 'Thanh toán 1 phần';
      } else {
        actualStatus = 'UNPAID';
        label = 'Chưa thanh toán';
      }
      
      return <Badge variant={paymentStatusVariants[actualStatus] || 'secondary'}>{label}</Badge>;
    },
    meta: { displayName: "TT Thanh toán", group: "Trạng thái" },
  },
  {
    id: "packagingStatus",
    accessorKey: "packagings",
    header: "TT Đóng gói",
    cell: ({ row }) => {
      const packagings = row.packagings || [];
      // ✅ API already returns Vietnamese labels for packaging status
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
    cell: ({ row }) => {
      // ✅ API already returns Vietnamese label, use directly
      const status = row.deliveryStatus || 'Chờ đóng gói';
      return <Badge variant={deliveryStatusVariants[status] || 'secondary'}>{status}</Badge>;
    },
    meta: { displayName: "TT Giao hàng", group: "Trạng thái" },
  },
  {
    id: "printStatus",
    accessorKey: "printStatus",
    header: "TT In",
    cell: ({ row }) => {
      // API already returns Vietnamese label
      const status = row.printStatus || 'Chưa in';
      return <Badge variant={printStatusVariants[status] || 'secondary'}>{status}</Badge>;
    },
    meta: { displayName: "TT In", group: "Trạng thái" },
  },
  {
    id: "stockOutStatus",
    accessorKey: "stockOutStatus",
    header: "TT Xuất kho",
    cell: ({ row }) => {
      // ✅ API already returns Vietnamese label, use directly
      const status = row.stockOutStatus || 'Chưa xuất kho';
      return <Badge variant={stockOutStatusVariants[status] || 'secondary'}>{status}</Badge>;
    },
    meta: { displayName: "TT Xuất kho", group: "Trạng thái" },
  },
  {
    id: "returnStatus",
    accessorKey: "returnStatus",
    header: "TT Trả hàng",
    cell: ({ row }) => {
      // API already returns Vietnamese label
      const status = row.returnStatus || 'Chưa trả hàng';
      return <Badge variant={returnStatusVariants[status] || 'secondary'}>{status}</Badge>;
    },
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
    cell: ({ row }) => ORDER_SOURCE_LABELS[row.source || ''] || row.source || '-',
    meta: { displayName: 'Nguồn', group: "Thông tin chung" }
  },
  {
    id: 'deliveryMethod',
    accessorKey: 'deliveryMethod',
    header: 'Hình thức giao',
    cell: ({ row }) => DELIVERY_METHOD_LABELS[row.deliveryMethod || ''] || row.deliveryMethod || '-',
    meta: { displayName: 'Hình thức giao', group: "Giao hàng" }
  },
  // ========== THÔNG TIN KHÁCH HÀNG ==========
  {
    id: 'customerPhone',
    accessorKey: 'customerPhone',
    header: 'SĐT khách',
    cell: ({ row }) => row.customerPhone || '-',
    meta: { displayName: 'SĐT khách', group: "Thông tin khách hàng" }
  },
  {
    id: 'customerEmail',
    accessorKey: 'customerEmail',
    header: 'Email khách',
    cell: ({ row }) => row.customerEmail || '-',
    meta: { displayName: 'Email khách', group: "Thông tin khách hàng" }
  },
  {
    id: 'customerId',
    accessorKey: 'customerId',
    header: 'Mã khách hàng',
    cell: ({ row }) => row.customerId || '-',
    meta: { displayName: 'Mã khách hàng', group: "Thông tin khách hàng" }
  },
  {
    id: 'customerArea',
    // Note: No accessorKey - this is computed from shippingAddress
    header: 'Khu vực',
    cell: ({ row }) => {
      // Try to get from shippingAddress
      const addr = row.shippingAddress;
      if (typeof addr === 'object' && addr) {
        return [addr.district, addr.province].filter(Boolean).join(', ') || '-';
      }
      return '-';
    },
    meta: { displayName: 'Khu vực', group: "Thông tin khách hàng" }
  },
  {
    id: 'shippingAddressDisplay',
    accessorKey: 'shippingAddress',
    header: 'Địa chỉ giao',
    cell: ({ row }) => {
      const addr = row.shippingAddress;
      if (typeof addr === 'object' && addr) {
        return [addr.address, addr.ward, addr.district, addr.province].filter(Boolean).join(', ') || '-';
      }
      return typeof addr === 'string' ? addr : '-';
    },
    meta: { displayName: 'Địa chỉ giao', group: "Thông tin khách hàng" }
  },
  // ========== THÔNG TIN GIAO HÀNG ==========
  {
    id: 'trackingCode',
    // Note: No accessorKey - this is computed from packagings
    header: 'Mã vận đơn',
    cell: ({ row }) => {
      const pkg = row.packagings?.find((p: Packaging) => p.trackingCode);
      return pkg?.trackingCode || '-';
    },
    meta: { displayName: 'Mã vận đơn', group: "Giao hàng" }
  },
  {
    id: 'carrier',
    // Note: No accessorKey - this is computed from packagings
    header: 'Đối tác VC',
    cell: ({ row }) => {
      const pkg = row.packagings?.find((p: Packaging) => p.carrier);
      return pkg?.carrier || '-';
    },
    meta: { displayName: 'Đối tác VC', group: "Giao hàng" }
  },
  {
    id: 'shippingFee',
    accessorKey: 'shippingFee',
    header: 'Phí GH thu khách',
    cell: ({ row }) => formatCurrency(row.shippingFee),
    meta: { displayName: 'Phí GH thu khách', group: "Giao hàng" }
  },
  {
    id: 'shippingFeeToPartner',
    // Note: No accessorKey - this is computed from packagings
    header: 'Phí trả ĐTVC',
    cell: ({ row }) => {
      const pkg = row.packagings?.find((p: Packaging) => p.shippingFeeToPartner);
      return formatCurrency(pkg?.shippingFeeToPartner);
    },
    meta: { displayName: 'Phí trả ĐTVC', group: "Giao hàng" }
  },
  // ========== THỜI GIAN ==========
  {
    id: 'expectedDeliveryDate',
    accessorKey: 'expectedDeliveryDate',
    header: 'Ngày hẹn giao',
    cell: ({ row }) => row.expectedDeliveryDate ? formatDate(row.expectedDeliveryDate) : '-',
    meta: { displayName: 'Ngày hẹn giao', group: "Thời gian" }
  },
  {
    id: 'approvedDate',
    accessorKey: 'approvedDate',
    header: 'Ngày duyệt',
    cell: ({ row }) => row.approvedDate ? formatDate(row.approvedDate) : '-',
    meta: { displayName: 'Ngày duyệt', group: "Thời gian" }
  },
  {
    id: 'completedDate',
    accessorKey: 'completedDate',
    header: 'Ngày hoàn thành',
    cell: ({ row }) => row.completedDate ? formatDate(row.completedDate) : '-',
    meta: { displayName: 'Ngày hoàn thành', group: "Thời gian" }
  },
  {
    id: 'cancelledDate',
    accessorKey: 'cancelledDate',
    header: 'Ngày hủy',
    cell: ({ row }) => row.cancelledDate ? formatDate(row.cancelledDate) : '-',
    meta: { displayName: 'Ngày hủy', group: "Thời gian" }
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: 'Ngày ghi nhận',
    cell: ({ row }) => row.createdAt ? formatDate(row.createdAt) : '-',
    meta: { displayName: 'Ngày ghi nhận', group: "Thời gian" }
  },
  // ========== THANH TOÁN ==========
  {
    id: 'expectedPaymentMethod',
    accessorKey: 'expectedPaymentMethod',
    header: 'PT thanh toán dự kiến',
    cell: ({ row }) => row.expectedPaymentMethod || '-',
    meta: { displayName: 'PT thanh toán dự kiến', group: "Thanh toán" }
  },
  {
    id: 'externalReference',
    accessorKey: 'externalReference',
    header: 'Tham chiếu TT',
    cell: ({ row }) => row.externalReference || '-',
    meta: { displayName: 'Tham chiếu TT', group: "Thanh toán" }
  },
  // ========== NHÂN VIÊN ==========
  {
    id: 'createdByName',
    accessorKey: 'createdByName',
    header: 'NV tạo đơn',
    cell: ({ row }) => row.createdByName || '-',
    meta: { displayName: 'NV tạo đơn', group: "Nhân viên" }
  },
  {
    id: 'assignedPackerName',
    accessorKey: 'assignedPackerName',
    header: 'NV được gán',
    cell: ({ row }) => row.assignedPackerName || '-',
    meta: { displayName: 'NV được gán', group: "Nhân viên" }
  },
  // ========== THÔNG TIN KHÁC ==========
  {
    id: 'tags',
    accessorKey: 'tags',
    header: 'Tags',
    cell: ({ row }) => {
      const tags = row.tags || [];
      if (!tags.length) return '-';
      return (
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 3).map((tag: string) => (
            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
          ))}
          {tags.length > 3 && <span className="text-xs text-muted-foreground">+{tags.length - 3}</span>}
        </div>
      );
    },
    meta: { displayName: 'Tags', group: "Thông tin khác" }
  },
  {
    id: 'notes',
    accessorKey: 'notes',
    header: 'Ghi chú',
    cell: ({ row }) => {
      const notes = row.notes || '';
      if (!notes) return '-';
      return <span className="truncate max-w-50 block" title={notes}>{notes}</span>;
    },
    meta: { displayName: 'Ghi chú', group: "Thông tin khác" }
  },
  {
    id: 'cancellationReason',
    accessorKey: 'cancellationReason',
    header: 'Lý do hủy',
    cell: ({ row }) => row.cancellationReason || '-',
    meta: { displayName: 'Lý do hủy', group: "Thông tin khác" }
  },
  {
    id: 'referenceUrl',
    accessorKey: 'referenceUrl',
    header: 'Link đơn kênh',
    cell: ({ row }) => {
      if (!row.referenceUrl) return '-';
      return (
        <a href={row.referenceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate max-w-37.5 block">
          Link
        </a>
      );
    },
    meta: { displayName: 'Link đơn kênh', group: "Thông tin khác" }
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
              <DropdownMenuItem onSelect={() => router.push(`/orders/${row.systemId}`)}>
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => router.push(`/orders/${row.systemId}/edit`)}>
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
              <DropdownMenuItem 
                onSelect={() => printActions?.onPrintProductLabels?.(row)}
              >
                In tem phụ
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
