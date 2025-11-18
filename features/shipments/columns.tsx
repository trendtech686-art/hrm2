import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate } from '@/lib/date-utils';
import type { Shipment } from './types.ts';
import type { OrderDeliveryStatus, OrderPrintStatus } from '../orders/types.ts';
import type { ColumnDef } from '../../components/data-table/types.ts';
import { Badge } from '../../components/ui/badge.tsx';
import { Button } from '../../components/ui/button.tsx';
import { Checkbox } from '../../components/ui/checkbox.tsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu.tsx';
import { MoreHorizontal, Printer, FileText } from 'lucide-react';
const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '-';
    return new Intl.NumberFormat('vi-VN').format(value);
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

export const getColumns = (
  onPrintDelivery?: (shipmentId: string) => void,
  onPrintHandover?: (shipmentId: string) => void,
  navigate?: (path: string) => void,
): ColumnDef<Shipment>[] => [
    {
      id: "select",
      header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={isAllPageRowsSelected ? true : isSomePageRowsSelected ? "indeterminate" : false}
            onCheckedChange={(value) => onToggleAll(!!value)}
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
    { id: 'trackingCode', accessorKey: 'trackingCode', header: 'Mã vận đơn', cell: ({ row }) => <span className="font-mono">{row.trackingCode || '-'}</span>, meta: { displayName: 'Mã vận đơn' } },
    { id: 'packagingDate', accessorKey: 'packagingDate', header: 'Ngày đóng gói', cell: ({ row }) => formatDate(row.packagingDate), meta: { displayName: 'Ngày đóng gói' } },
    { id: 'recipientName', accessorKey: 'recipientName', header: 'Người nhận', cell: ({ row }) => row.recipientName, meta: { displayName: 'Người nhận' } },
    { id: 'recipientPhone', accessorKey: 'recipientPhone', header: 'SĐT người nhận', cell: ({ row }) => row.recipientPhone, meta: { displayName: 'SĐT người nhận' } },
    { id: 'shippingPartner', accessorKey: 'shippingPartner', header: 'Đối tác vận chuyển', cell: ({ row }) => row.shippingPartner || '-', meta: { displayName: 'Đối tác vận chuyển' } },
    { id: 'deliveryStatus', accessorKey: 'deliveryStatus', header: 'Trạng thái giao hàng', cell: ({ row }) => row.deliveryStatus ? <Badge variant={deliveryStatusVariants[row.deliveryStatus]}>{row.deliveryStatus}</Badge> : '-', meta: { displayName: 'Trạng thái giao hàng' } },
    { id: 'shippingFeeToPartner', accessorKey: 'shippingFeeToPartner', header: 'Phí trả ĐTVC', cell: ({ row }) => formatCurrency(row.shippingFeeToPartner), meta: { displayName: 'Phí trả ĐTVC' } },
    { id: 'codAmount', accessorKey: 'codAmount', header: 'Cần thu hộ COD', cell: ({ row }) => formatCurrency(row.codAmount), meta: { displayName: 'Cần thu hộ COD' } },
    { id: 'reconciliationStatus', accessorKey: 'reconciliationStatus', header: 'Trạng thái đối soát', cell: ({ row }) => row.reconciliationStatus || '-', meta: { displayName: 'Trạng thái đối soát' } },
    { id: 'creationDate', accessorKey: 'creationDate', header: 'Ngày tạo', cell: ({ row }) => formatDate(row.creationDate), meta: { displayName: 'Ngày tạo' } },
    { id: 'cancellationDate', accessorKey: 'cancellationDate', header: 'Ngày hủy giao', cell: ({ row }) => formatDate(row.cancellationDate), meta: { displayName: 'Ngày hủy giao' } },
    { id: 'cancellationReason', accessorKey: 'cancellationReason', header: 'Lý do hủy', cell: ({ row }) => row.cancellationReason || '-', meta: { displayName: 'Lý do hủy vận đơn' } },
    { id: 'partnerStatus', accessorKey: 'partnerStatus', header: 'Trạng thái đối tác', cell: ({ row }) => row.partnerStatus || '-', meta: { displayName: 'Trạng thái đối tác' } },
    { id: 'payer', accessorKey: 'payer', header: 'Người trả phí', cell: ({ row }) => row.payer || '-', meta: { displayName: 'Người trả phí' } },
    { id: 'packagingId', accessorKey: 'packagingId', header: 'Mã đóng gói', cell: ({ row }) => <Link to={`/packaging/${row.systemId}`} className="font-mono text-primary hover:underline">{row.packagingId}</Link>, meta: { displayName: 'Mã đóng gói' } },
    { id: 'orderId', accessorKey: 'orderId', header: 'Mã đơn hàng', cell: ({ row }) => <Link to={`/orders/${row.orderSystemId}`} className="text-primary hover:underline">{row.orderId}</Link>, meta: { displayName: 'Mã đơn hàng' } },
    { id: 'printStatus', accessorKey: 'printStatus', header: 'Trạng thái in', cell: ({ row }) => <Badge variant={printStatusVariants[row.printStatus]}>{row.printStatus}</Badge>, meta: { displayName: 'Trạng thái in' } },
    { id: 'dispatchDate', accessorKey: 'dispatchDate', header: 'Ngày xuất kho', cell: ({ row }) => formatDate(row.dispatchDate), meta: { displayName: 'Ngày xuất kho' } },
    { id: 'totalProductQuantity', accessorKey: 'totalProductQuantity', header: 'Tổng SL SP', cell: ({ row }) => row.totalProductQuantity, meta: { displayName: 'Tổng số lượng sản phẩm' } },
    { id: 'customerDue', accessorKey: 'customerDue', header: 'Khách phải trả', cell: ({ row }) => formatCurrency(row.customerDue), meta: { displayName: 'Khách phải trả' } },
    { id: 'recipientAddress', accessorKey: 'recipientAddress', header: 'Địa chỉ người nhận', cell: ({ row }) => row.recipientAddress, meta: { displayName: 'Địa chỉ người nhận' } },
    { id: 'deliveryMethod', accessorKey: 'deliveryMethod', header: 'Hình thức giao hàng', cell: ({ row }) => row.deliveryMethod || '-', meta: { displayName: 'Hình thức giao hàng' } },
    { id: 'dispatchEmployeeName', accessorKey: 'dispatchEmployeeName', header: 'NV xuất kho', cell: ({ row }) => row.dispatchEmployeeName || '-', meta: { displayName: 'Nhân viên xuất kho' } },
    { id: 'creatorEmployeeName', accessorKey: 'creatorEmployeeName', header: 'NV tạo phiếu', cell: ({ row }) => row.creatorEmployeeName, meta: { displayName: 'Nhân viên tạo phiếu' } },
    { id: 'cancelingEmployeeName', accessorKey: 'cancelingEmployeeName', header: 'NV hủy phiếu', cell: ({ row }) => row.cancelingEmployeeName || '-', meta: { displayName: 'Nhân viên hủy phiếu' } },
    { id: 'branchName', accessorKey: 'branchName', header: 'Chi nhánh', cell: ({ row }) => row.branchName, meta: { displayName: 'Chi nhánh' } },
    { id: 'notes', accessorKey: 'notes', header: 'Ghi chú', cell: ({ row }) => row.notes || '-', meta: { displayName: 'Ghi chú' } },
    {
        id: 'actions',
        header: () => <div className="text-right">Hành động</div>,
        cell: ({ row }) => (
            <div className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Mở menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate ? navigate(`/orders/${row.orderSystemId}`) : (window.location.href = `/orders/${row.orderSystemId}`)}>
                            Xem đơn hàng
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onPrintDelivery?.(row.systemId)}>
                            <Printer className="mr-2 h-4 w-4" />
                            In Phiếu Giao Hàng
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onPrintHandover?.(row.systemId)}>
                            <FileText className="mr-2 h-4 w-4" />
                            In Phiếu Bàn Giao
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        ),
        meta: { displayName: 'Hành động', sticky: 'right' },
        size: 100,
    },
];

