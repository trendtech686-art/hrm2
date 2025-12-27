import { formatDate as formatDateUtil, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate } from '../../../lib/date-utils';
import type { ColumnDef } from '../../../components/data-table/types';
import type { OrderWithProfit } from '@/lib/types/prisma-extended';
import { Badge } from "../../../components/ui/badge";

const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN').format(value);
const formatDate = (dateString: string) => formatDateUtil(dateString);

export const getColumns = (): ColumnDef<OrderWithProfit>[] => [
    { 
        id: 'id', 
        accessorKey: 'id', 
        header: 'Mã ĐH', 
        cell: ({ row }) => <span className="font-medium">{row.id}</span>, 
        meta: { displayName: 'Mã Đơn hàng' } 
    },
    { 
        id: 'orderDate', 
        accessorKey: 'orderDate', 
        header: 'Ngày đặt', 
        cell: ({ row }) => formatDate(row.orderDate), 
        meta: { displayName: 'Ngày đặt' } 
    },
    { 
        id: 'customerName', 
        accessorKey: 'customerName', 
        header: 'Khách hàng', 
        cell: ({ row }) => row.customerName, 
        meta: { displayName: 'Khách hàng' } 
    },
    {
        id: 'grandTotal',
        accessorKey: 'grandTotal',
        header: 'Tổng tiền',
        cell: ({ row }) => formatCurrency(row.grandTotal),
        meta: { displayName: 'Tổng tiền' }
    },
    {
        id: 'profit',
        accessorKey: 'profit',
        header: 'Lợi nhuận',
        cell: ({ row }) => <span className="font-semibold text-green-600">{formatCurrency(row.profit)}</span>,
        meta: { displayName: 'Lợi nhuận' }
    },
    {
        id: 'status',
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: ({ row }) => <Badge variant="success">{row.status}</Badge>,
        meta: { displayName: 'Trạng thái' }
    }
];
