import type { ColumnDef } from '../../../components/data-table/types.ts';
import type { InventoryReportRow } from './types.ts';

const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN').format(value);

export const getColumns = (): ColumnDef<InventoryReportRow>[] => [
    { 
        id: 'productName', 
        accessorKey: 'productName', 
        header: 'Sản phẩm', 
        cell: ({ row }) => <span className="font-medium">{row.productName}</span>, 
        meta: { displayName: 'Tên sản phẩm' } 
    },
    { 
        id: 'sku', 
        accessorKey: 'sku', 
        header: 'Mã SKU', 
        cell: ({ row }) => row.sku, 
        meta: { displayName: 'Mã SKU' } 
    },
    { 
        id: 'branchName', 
        accessorKey: 'branchName', 
        header: 'Chi nhánh', 
        cell: ({ row }) => row.branchName, 
        meta: { displayName: 'Chi nhánh' } 
    },
    {
        id: 'onHand',
        accessorKey: 'onHand',
        header: 'Tồn kho',
        cell: ({ row }) => row.onHand,
        meta: { displayName: 'Tồn kho' }
    },
    {
        id: 'committed',
        accessorKey: 'committed',
        header: 'Đang giao dịch',
        cell: ({ row }) => row.committed,
        meta: { displayName: 'Đang giao dịch' }
    },
    {
        id: 'available',
        accessorKey: 'available',
        header: 'Có thể bán',
        cell: ({ row }) => <span className="font-semibold text-green-600">{row.available}</span>,
        meta: { displayName: 'Có thể bán' }
    },
    {
        id: 'totalValue',
        header: 'Giá trị tồn',
        cell: ({ row }) => formatCurrency(row.onHand * row.costPrice),
        meta: { displayName: 'Giá trị tồn' }
    },
];
