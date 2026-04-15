import * as React from 'react';
import { formatDate } from '@/lib/date-utils';
import type { ReconciliationSheet } from './api/reconciliation-sheets-api';
import type { ColumnDef } from '../../components/data-table/types';
import { Badge } from '../../components/ui/badge';
import { Checkbox } from '../../components/ui/checkbox';

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '-';
    return new Intl.NumberFormat('vi-VN').format(value);
};

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    DRAFT: { label: 'Nháp', variant: 'secondary' },
    CONFIRMED: { label: 'Đã xác nhận', variant: 'default' },
    CANCELLED: { label: 'Đã hủy', variant: 'destructive' },
};

export const getSheetColumns = (): ColumnDef<ReconciliationSheet>[] => [
    {
        id: 'select',
        header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll }) => (
            <Checkbox
                checked={isAllPageRowsSelected ? true : isSomePageRowsSelected ? 'indeterminate' : false}
                onCheckedChange={(v) => onToggleAll?.(!!v)}
            />
        ),
        cell: ({ onToggleSelect, isSelected }) => (
            <Checkbox checked={isSelected} onCheckedChange={onToggleSelect} />
        ),
        size: 48,
        meta: { displayName: 'Chọn', sticky: 'left' },
    },
    {
        id: 'id',
        accessorKey: 'id',
        header: 'Mã phiếu',
        cell: ({ row }) => <span className="font-mono font-medium text-primary">{row.id}</span>,
        meta: { displayName: 'Mã phiếu' },
    },
    {
        id: 'carrier',
        accessorKey: 'carrier',
        header: 'Đối tác vận chuyển',
        cell: ({ row }) => row.carrier || '-',
        meta: { displayName: 'Đối tác vận chuyển' },
    },
    {
        id: 'itemCount',
        accessorKey: '_count',
        header: 'Số vận đơn',
        cell: ({ row }) => <span className="font-semibold">{row._count?.items ?? 0}</span>,
        meta: { displayName: 'Số vận đơn' },
    },
    {
        id: 'totalCodSystem',
        accessorKey: 'totalCodSystem',
        header: 'COD hệ thống',
        cell: ({ row }) => formatCurrency(row.totalCodSystem),
        meta: { displayName: 'COD hệ thống' },
    },
    {
        id: 'totalCodPartner',
        accessorKey: 'totalCodPartner',
        header: 'COD đối tác',
        cell: ({ row }) => formatCurrency(row.totalCodPartner),
        meta: { displayName: 'COD đối tác' },
    },
    {
        id: 'codDifference',
        accessorKey: 'codDifference',
        header: 'Lệch COD',
        cell: ({ row }) => {
            const diff = row.codDifference ?? 0;
            return <span className={diff !== 0 ? 'text-destructive font-semibold' : 'text-green-600'}>{formatCurrency(diff)}</span>;
        },
        meta: { displayName: 'Lệch COD' },
    },
    {
        id: 'status',
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: ({ row }) => {
            const config = statusConfig[row.status] || statusConfig.DRAFT;
            return <Badge variant={config.variant}>{config.label}</Badge>;
        },
        meta: { displayName: 'Trạng thái' },
    },
    {
        id: 'createdByName',
        accessorKey: 'createdByName',
        header: 'Người tạo',
        cell: ({ row }) => row.createdByName || '-',
        meta: { displayName: 'Người tạo' },
    },
    {
        id: 'createdAt',
        accessorKey: 'createdAt',
        header: 'Ngày tạo',
        cell: ({ row }) => formatDate(row.createdAt),
        meta: { displayName: 'Ngày tạo' },
    },
    {
        id: 'confirmedAt',
        accessorKey: 'confirmedAt',
        header: 'Ngày xác nhận',
        cell: ({ row }) => row.confirmedAt ? formatDate(row.confirmedAt) : '-',
        meta: { displayName: 'Ngày xác nhận' },
    },
];
