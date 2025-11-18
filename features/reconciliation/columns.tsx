import * as React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate } from '@/lib/date-utils';
import type { ReconciliationItem } from './page.tsx';
import type { ColumnDef } from '../../components/data-table/types.ts';
import { Checkbox } from '../../components/ui/checkbox.tsx';
import { Badge } from '../../components/ui/badge.tsx';
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
          onCheckedChange={(value) => onToggleAll(!!value)}
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
      meta: { displayName: "Chọn", sticky: "left" },
    },
    { id: 'trackingCode', accessorKey: 'trackingCode', header: 'Mã vận đơn', cell: ({ row }) => <span className="font-mono">{row.trackingCode || '-'}</span>, meta: { displayName: 'Mã vận đơn' } },
    { id: 'orderId', accessorKey: 'orderId', header: 'Mã đơn hàng', cell: ({ row }) => <Link to={`/orders/${row.orderSystemId}`} className="text-primary hover:underline">{row.orderId}</Link>, meta: { displayName: 'Mã đơn hàng' } },
    { id: 'customerName', accessorKey: 'customerName', header: 'Khách hàng', cell: ({ row }) => row.customerName, meta: { displayName: 'Khách hàng' } },
    { id: 'deliveredDate', accessorKey: 'deliveredDate', header: 'Ngày giao', cell: ({ row }) => formatDate(row.deliveredDate), meta: { displayName: 'Ngày giao' } },
    { id: 'carrier', accessorKey: 'carrier', header: 'Đối tác vận chuyển', cell: ({ row }) => row.carrier || '-', meta: { displayName: 'Đối tác vận chuyển' } },
    { id: 'codAmount', accessorKey: 'codAmount', header: 'Tiền thu hộ', cell: ({ row }) => <span className="font-semibold">{formatCurrency(row.codAmount)}</span>, meta: { displayName: 'Tiền thu hộ (COD)' } },
    { id: 'reconciliationStatus', accessorKey: 'reconciliationStatus', header: 'Trạng thái đối soát', cell: ({ row }) => <Badge variant="secondary">{row.reconciliationStatus || 'Chưa đối soát'}</Badge>, meta: { displayName: 'Trạng thái đối soát' } },
];
