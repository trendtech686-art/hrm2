import * as React from 'react';
import Link from 'next/link';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate } from '@/lib/date-utils';
import type { ReconciliationItem } from './page';
import type { ColumnDef } from '../../components/data-table/types';
import { Checkbox } from '../../components/ui/checkbox';
import { Badge } from '../../components/ui/badge';
const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '-';
    return new Intl.NumberFormat('vi-VN').format(value);
};



export const getColumns = (): ColumnDef<ReconciliationItem>[] => [
    {
      id: "select",
      header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll }) => (
        <Checkbox
          checked={isAllPageRowsSelected ? true : isSomePageRowsSelected ? "indeterminate" : false}
          onCheckedChange={(value) => onToggleAll?.(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ isSelected, onToggleSelect }) => (
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggleSelect}
          aria-label="Select row"
        />
      ),
      size: 60,
      meta: { displayName: "Ch?n", sticky: "left" },
    },
    { id: 'trackingCode', accessorKey: 'trackingCode', header: 'M� v?n don', cell: ({ row }) => <span className="font-mono">{row.trackingCode || '-'}</span>, meta: { displayName: 'M� v?n don' } },
    { id: 'orderId', accessorKey: 'orderId', header: 'M� don h�ng', cell: ({ row }) => <Link href={`/orders/${row.orderSystemId}`} className="text-primary hover:underline">{row.orderId}</Link>, meta: { displayName: 'M� don h�ng' } },
    { id: 'customerName', accessorKey: 'customerName', header: 'Kh�ch h�ng', cell: ({ row }) => row.customerName, meta: { displayName: 'Kh�ch h�ng' } },
    { id: 'deliveredDate', accessorKey: 'deliveredDate', header: 'Ng�y giao', cell: ({ row }) => formatDate(row.deliveredDate), meta: { displayName: 'Ng�y giao' } },
    { id: 'carrier', accessorKey: 'carrier', header: '�?i t�c v?n chuy?n', cell: ({ row }) => row.carrier || '-', meta: { displayName: '�?i t�c v?n chuy?n' } },
    { id: 'codAmount', accessorKey: 'codAmount', header: 'Ti?n thu h?', cell: ({ row }) => <span className="font-semibold">{formatCurrency(row.codAmount)}</span>, meta: { displayName: 'Ti?n thu h? (COD)' } },
    { id: 'reconciliationStatus', accessorKey: 'reconciliationStatus', header: 'Tr?ng th�i d?i so�t', cell: ({ row }) => <Badge variant="secondary">{row.reconciliationStatus || 'Chua d?i so�t'}</Badge>, meta: { displayName: 'Tr?ng th�i d?i so�t' } },
];
