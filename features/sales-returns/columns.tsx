import * as React from "react";
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate } from '@/lib/date-utils';
import type { SalesReturn } from '@/lib/types/prisma-extended';
import type { ColumnDef } from '../../components/data-table/types';
import Link from 'next/link';
import { Checkbox } from "../../components/ui/checkbox";
import { Button } from "../../components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
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
        displayName: "Ch?n",
        sticky: "left",
      },
    },
    {
        id: "id",
        accessorKey: "id",
        header: "M� don tr? h�ng",
        cell: ({ row }) => <Link href={`/returns/${row.systemId}`} className="font-medium text-primary hover:underline">{row.id}</Link>,
        meta: { displayName: "M� don tr? h�ng" },
        size: 120,
    },
    {
        id: "status",
        accessorKey: "isReceived",
        header: "Tr?ng th�i",
        cell: ({ row }) => (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-body-xs font-medium ${
                row.isReceived 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-amber-100 text-amber-800'
            }`}>
                {row.isReceived ? '�� nh?n' : 'Chua nh?n'}
            </span>
        ),
        meta: { displayName: "Tr?ng th�i" },
        size: 100,
    },
    {
        id: "returnDate",
        accessorKey: "returnDate",
        header: "Ng�y tr?",
        cell: ({ row }) => formatDate(row.returnDate),
        meta: { displayName: "Ng�y tr?" },
        size: 100,
    },
    {
        id: "returnQuantity",
        accessorKey: "items",
        header: "S? lu?ng h�ng tr?",
        cell: ({ row }) => {
            const totalQty = row.items.reduce((sum, item) => sum + item.returnQuantity, 0);
            return <span className="text-center block">{totalQty}</span>;
        },
        meta: { displayName: "S? lu?ng h�ng tr?" },
        size: 140,
    },
    {
        id: "totalReturnValue",
        accessorKey: "totalReturnValue",
        header: "Gi� tr? h�ng tr?",
        cell: ({ row }) => <span className="font-semibold">{formatCurrency(row.totalReturnValue)}</span>,
        meta: { displayName: "Gi� tr? h�ng tr?" },
        size: 140,
    },
    {
        id: "exchangeOrderId",
        accessorKey: "exchangeOrderSystemId",
        header: "M� don d?i",
        cell: ({ row }) => row.exchangeOrderSystemId ? (
            <Link href={`/orders/${row.exchangeOrderSystemId}`} className="text-primary hover:underline">
                {/* We need to get the order ID from systemId - will show systemId for now */}
                {row.exchangeOrderSystemId.replace('ORD', 'DH')}
            </Link>
        ) : (
            <span className="text-muted-foreground">-</span>
        ),
        meta: { displayName: "M� don d?i" },
        size: 120,
    },
    {
        id: "exchangeQuantity",
        accessorKey: "exchangeItems",
        header: "S? lu?ng h�ng d?i",
        cell: ({ row }) => {
            const totalQty = row.exchangeItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
            return totalQty > 0 ? <span className="text-center block">{totalQty}</span> : <span className="text-muted-foreground text-center block">-</span>;
        },
        meta: { displayName: "S? lu?ng h�ng d?i" },
        size: 150,
    },
    {
        id: "exchangeValue",
        accessorKey: "grandTotalNew",
        header: "Gi� tr? h�ng d?i",
        cell: ({ row }) => row.grandTotalNew > 0 ? (
            <span className="font-semibold">{formatCurrency(row.grandTotalNew)}</span>
        ) : (
            <span className="text-muted-foreground">-</span>
        ),
        meta: { displayName: "Gi� tr? h�ng d?i" },
        size: 140,
    },
    {
        id: "finalAmount",
        accessorKey: "finalAmount",
        header: "Ch�nh l?ch",
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
        meta: { displayName: "Ch�nh l?ch" },
        size: 120,
    },
    {
        id: "actions",
        header: "H�nh d?ng",
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">M? menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onPrint?.(row.systemId)}>
                        <Printer className="mr-2 h-4 w-4" />
                        In Phi?u Tr? H�ng
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
        meta: { displayName: "H�nh d?ng", sticky: "right" },
        size: 80,
    },
];

