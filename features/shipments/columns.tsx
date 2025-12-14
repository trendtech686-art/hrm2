import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate } from '@/lib/date-utils';
import type { ShipmentView } from './types.ts';
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
): ColumnDef<ShipmentView>[] => [
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
    { id: 'trackingCode', accessorKey: 'trackingCode', header: 'Mã vận đơn', cell: ({ row }) => <span className="font-mono">{row.trackingCode || '-'}</span>, meta: { displayName: 'Mã vận đơn' } },
    { id: 'id', accessorKey: 'id', header: 'Mã vận chuyển', cell: ({ row }) => <span className="font-mono text-primary">{row.id}</span>, meta: { displayName: 'Mã vận chuyển' } },
    { id: 'packagingDate', accessorKey: 'packagingDate', header: 'Ngày đóng gói', cell: ({ row }) => formatDate(row.packagingDate), meta: { displayName: 'Ngày đóng gói' } },
    { id: 'customerName', accessorKey: 'customerName', header: 'Người nhận', cell: ({ row }) => row.customerName, meta: { displayName: 'Người nhận' } },
    { id: 'customerPhone', accessorKey: 'customerPhone', header: 'SĐT người nhận', cell: ({ row }) => row.customerPhone, meta: { displayName: 'SĐT người nhận' } },
    { id: 'carrier', accessorKey: 'carrier', header: 'Đối tác vận chuyển', cell: ({ row }) => row.carrier || '-', meta: { displayName: 'Đối tác vận chuyển' } },
    { id: 'deliveryStatus', accessorKey: 'deliveryStatus', header: 'Trạng thái giao hàng', cell: ({ row }) => row.deliveryStatus ? <Badge variant={deliveryStatusVariants[row.deliveryStatus]}>{row.deliveryStatus}</Badge> : '-', meta: { displayName: 'Trạng thái giao hàng' } },
    { id: 'shippingFeeToPartner', accessorKey: 'shippingFeeToPartner', header: 'Phí trả ĐTVC', cell: ({ row }) => formatCurrency(row.shippingFeeToPartner), meta: { displayName: 'Phí trả ĐTVC' } },
    { id: 'codAmount', accessorKey: 'codAmount', header: 'Cần thu hộ COD', cell: ({ row }) => formatCurrency(row.codAmount), meta: { displayName: 'Cần thu hộ COD' } },
    { id: 'reconciliationStatus', accessorKey: 'reconciliationStatus', header: 'Trạng thái đối soát', cell: ({ row }) => row.reconciliationStatus || '-', meta: { displayName: 'Trạng thái đối soát' } },
    { id: 'createdAt', accessorKey: 'createdAt', header: 'Ngày tạo', cell: ({ row }) => formatDate(row.createdAt), meta: { displayName: 'Ngày tạo' } },
    { id: 'cancelledAt', accessorKey: 'cancelledAt', header: 'Ngày hủy giao', cell: ({ row }) => formatDate(row.cancelledAt), meta: { displayName: 'Ngày hủy giao' } },
    { id: 'partnerStatus', accessorKey: 'partnerStatus', header: 'Trạng thái đối tác', cell: ({ row }) => row.partnerStatus || '-', meta: { displayName: 'Trạng thái đối tác' } },
    { id: 'payer', accessorKey: 'payer', header: 'Người trả phí', cell: ({ row }) => row.payer || '-', meta: { displayName: 'Người trả phí' } },
    { id: 'packagingSystemId', accessorKey: 'packagingSystemId', header: 'Mã đóng gói', cell: ({ row }) => <Link to={`/packaging/${row.packagingSystemId}`} className="font-mono text-primary hover:underline">{row.packagingSystemId}</Link>, meta: { displayName: 'Mã đóng gói' } },
    { id: 'orderId', accessorKey: 'orderId', header: 'Mã đơn hàng', cell: ({ row }) => <Link to={`/orders/${row.orderSystemId}`} className="text-primary hover:underline">{row.orderId}</Link>, meta: { displayName: 'Mã đơn hàng' } },
    { id: 'printStatus', accessorKey: 'printStatus', header: 'Trạng thái in', cell: ({ row }) => <Badge variant={printStatusVariants[row.printStatus]}>{row.printStatus}</Badge>, meta: { displayName: 'Trạng thái in' } },
    { id: 'dispatchedAt', accessorKey: 'dispatchedAt', header: 'Ngày xuất kho', cell: ({ row }) => formatDate(row.dispatchedAt), meta: { displayName: 'Ngày xuất kho' } },
    { id: 'totalProductQuantity', accessorKey: 'totalProductQuantity', header: 'Tổng SL SP', cell: ({ row }) => row.totalProductQuantity, meta: { displayName: 'Tổng số lượng sản phẩm' } },
    { id: 'customerDue', accessorKey: 'customerDue', header: 'Khách phải trả', cell: ({ row }) => formatCurrency(row.customerDue), meta: { displayName: 'Khách phải trả' } },
    { id: 'customerAddress', accessorKey: 'customerAddress', header: 'Địa chỉ người nhận', cell: ({ row }) => row.customerAddress, meta: { displayName: 'Địa chỉ người nhận' } },
    { id: 'dispatchEmployeeName', accessorKey: 'dispatchEmployeeName', header: 'NV xuất kho', cell: ({ row }) => row.dispatchEmployeeName || '-', meta: { displayName: 'Nhân viên xuất kho' } },
    { id: 'creatorEmployeeName', accessorKey: 'creatorEmployeeName', header: 'NV tạo phiếu', cell: ({ row }) => row.creatorEmployeeName, meta: { displayName: 'Nhân viên tạo phiếu' } },
    { id: 'cancelingEmployeeName', accessorKey: 'cancelingEmployeeName', header: 'NV hủy phiếu', cell: ({ row }) => row.cancelingEmployeeName || '-', meta: { displayName: 'Nhân viên hủy phiếu' } },
    { id: 'branchName', accessorKey: 'branchName', header: 'Chi nhánh', cell: ({ row }) => row.branchName, meta: { displayName: 'Chi nhánh' } },
    { id: 'noteToShipper', accessorKey: 'noteToShipper', header: 'Ghi chú', cell: ({ row }) => row.noteToShipper || '-', meta: { displayName: 'Ghi chú' } },
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

