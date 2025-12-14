import * as React from "react";
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate } from '@/lib/date-utils';
import type { SalesReturn } from './types.ts';
import type { ColumnDef } from '../../components/data-table/types.ts';
import { Link } from "react-router-dom";
import { Checkbox } from "../../components/ui/checkbox.tsx";
import { Button } from "../../components/ui/button.tsx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu.tsx";
import { MoreHorizontal, Printer } from "lucide-react";

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number') return '';
    return new Intl.NumberFormat('vi-VN').format(value);
};



export const getColumns = (onPrint?: (returnId: string) => void): ColumnDef<SalesReturn>[] => [
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
        id: "id",
        accessorKey: "id",
        header: "Mã đơn trả hàng",
        cell: ({ row }) => <Link to={`/returns/${row.systemId}`} className="font-medium text-primary hover:underline">{row.id}</Link>,
        meta: { displayName: "Mã đơn trả hàng" },
        size: 120,
    },
    {
        id: "status",
        accessorKey: "isReceived",
        header: "Trạng thái",
        cell: ({ row }) => (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-body-xs font-medium ${
                row.isReceived 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-amber-100 text-amber-800'
            }`}>
                {row.isReceived ? 'Đã nhận' : 'Chưa nhận'}
            </span>
        ),
        meta: { displayName: "Trạng thái" },
        size: 100,
    },
    {
        id: "returnDate",
        accessorKey: "returnDate",
        header: "Ngày trả",
        cell: ({ row }) => formatDate(row.returnDate),
        meta: { displayName: "Ngày trả" },
        size: 100,
    },
    {
        id: "returnQuantity",
        accessorKey: "items",
        header: "Số lượng hàng trả",
        cell: ({ row }) => {
            const totalQty = row.items.reduce((sum, item) => sum + item.returnQuantity, 0);
            return <span className="text-center block">{totalQty}</span>;
        },
        meta: { displayName: "Số lượng hàng trả" },
        size: 140,
    },
    {
        id: "totalReturnValue",
        accessorKey: "totalReturnValue",
        header: "Giá trị hàng trả",
        cell: ({ row }) => <span className="font-semibold">{formatCurrency(row.totalReturnValue)}</span>,
        meta: { displayName: "Giá trị hàng trả" },
        size: 140,
    },
    {
        id: "exchangeOrderId",
        accessorKey: "exchangeOrderSystemId",
        header: "Mã đơn đổi",
        cell: ({ row }) => row.exchangeOrderSystemId ? (
            <Link to={`/orders/${row.exchangeOrderSystemId}`} className="text-primary hover:underline">
                {/* We need to get the order ID from systemId - will show systemId for now */}
                {row.exchangeOrderSystemId.replace('ORD', 'DH')}
            </Link>
        ) : (
            <span className="text-muted-foreground">-</span>
        ),
        meta: { displayName: "Mã đơn đổi" },
        size: 120,
    },
    {
        id: "exchangeQuantity",
        accessorKey: "exchangeItems",
        header: "Số lượng hàng đổi",
        cell: ({ row }) => {
            const totalQty = row.exchangeItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
            return totalQty > 0 ? <span className="text-center block">{totalQty}</span> : <span className="text-muted-foreground text-center block">-</span>;
        },
        meta: { displayName: "Số lượng hàng đổi" },
        size: 150,
    },
    {
        id: "exchangeValue",
        accessorKey: "grandTotalNew",
        header: "Giá trị hàng đổi",
        cell: ({ row }) => row.grandTotalNew > 0 ? (
            <span className="font-semibold">{formatCurrency(row.grandTotalNew)}</span>
        ) : (
            <span className="text-muted-foreground">-</span>
        ),
        meta: { displayName: "Giá trị hàng đổi" },
        size: 140,
    },
    {
        id: "finalAmount",
        accessorKey: "finalAmount",
        header: "Chênh lệch",
        cell: ({ row }) => {
            const value = row.finalAmount;
            const isNegative = value < 0;
            const displayValue = formatCurrency(Math.abs(value));
            return (
                <span className={`font-semibold ${isNegative ? 'text-green-600' : value > 0 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                    {isNegative ? `-${displayValue}` : displayValue}
                </span>
            );
        },
        meta: { displayName: "Chênh lệch" },
        size: 120,
    },
    {
        id: "actions",
        header: "Hành động",
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Mở menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onPrint?.(row.systemId)}>
                        <Printer className="mr-2 h-4 w-4" />
                        In Phiếu Trả Hàng
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
        meta: { displayName: "Hành động", sticky: "right" },
        size: 80,
    },
];

