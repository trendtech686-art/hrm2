import type { ColumnDef } from '../../../components/data-table/types';
import type { StockAlertReportRow } from './types';
import { Badge } from '../../../components/ui/badge';
import { Link } from '@/lib/next-compat';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../../../components/ui/tooltip';
import { PackageX, AlertTriangle, TrendingUp, ShoppingCart } from 'lucide-react';
import { formatDateForDisplay } from '@/lib/date-utils';

const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN').format(value);
const formatDate = (date?: string) => date ? formatDateForDisplay(date) : '-';

const alertBadgeConfig = {
  out_of_stock: { variant: 'destructive' as const, icon: PackageX, label: 'Hết hàng' },
  low_stock: { variant: 'warning' as const, icon: AlertTriangle, label: 'Sắp hết' },
  below_safety: { variant: 'warning' as const, icon: AlertTriangle, label: 'Dưới an toàn' },
  over_stock: { variant: 'secondary' as const, icon: TrendingUp, label: 'Tồn cao' },
};

export const getColumns = (): ColumnDef<StockAlertReportRow>[] => [
    { 
        id: 'productName', 
        accessorKey: 'productName', 
        header: 'Sản phẩm', 
        cell: ({ row }) => (
            <div>
                <Link 
                    to={`/products/${row.productSystemId}`} 
                    className="font-medium hover:underline text-primary"
                >
                    {row.productName}
                </Link>
                <div className="text-xs text-muted-foreground">{row.sku}</div>
            </div>
        ), 
        meta: { displayName: 'Tên sản phẩm' } 
    },
    { 
        id: 'alertType', 
        accessorKey: 'alertType', 
        header: 'Cảnh báo', 
        cell: ({ row }) => {
            const config = alertBadgeConfig[row.alertType];
            const Icon = config.icon;
            return (
                <Badge variant={config.variant} className="gap-1">
                    <Icon className="h-3.5 w-3.5" />
                    {config.label}
                </Badge>
            );
        }, 
        meta: { displayName: 'Loại cảnh báo' } 
    },
    {
        id: 'totalOnHand',
        accessorKey: 'totalOnHand',
        header: 'Tồn kho',
        cell: ({ row }) => (
            <span className={row.totalOnHand === 0 ? 'text-destructive font-semibold' : ''}>
                {row.totalOnHand} {row.unit}
            </span>
        ),
        meta: { displayName: 'Tồn kho' }
    },
    {
        id: 'totalAvailable',
        accessorKey: 'totalAvailable',
        header: 'Có thể bán',
        cell: ({ row }) => (
            <span className={row.totalAvailable <= 0 ? 'text-destructive font-semibold' : 'text-green-600 font-semibold'}>
                {row.totalAvailable} {row.unit}
            </span>
        ),
        meta: { displayName: 'Có thể bán' }
    },
    {
        id: 'reorderLevel',
        accessorKey: 'reorderLevel',
        header: 'Mức đặt lại',
        cell: ({ row }) => row.reorderLevel ?? '-',
        meta: { displayName: 'Mức đặt hàng lại' }
    },
    {
        id: 'safetyStock',
        accessorKey: 'safetyStock',
        header: 'Tồn an toàn',
        cell: ({ row }) => row.safetyStock ?? '-',
        meta: { displayName: 'Tồn kho an toàn' }
    },
    {
        id: 'suggestedOrder',
        accessorKey: 'suggestedOrder',
        header: 'Đề xuất đặt',
        cell: ({ row }) => {
            if (row.suggestedOrder <= 0) return '-';
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span className="font-semibold text-amber-600 cursor-help flex items-center gap-1">
                                <ShoppingCart className="h-3.5 w-3.5" />
                                +{row.suggestedOrder}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Đề xuất nhập thêm {row.suggestedOrder} {row.unit} để đạt mức an toàn</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        },
        meta: { displayName: 'Đề xuất đặt hàng' }
    },
    {
        id: 'costPrice',
        accessorKey: 'costPrice',
        header: 'Giá vốn',
        cell: ({ row }) => formatCurrency(row.costPrice),
        meta: { displayName: 'Giá vốn' }
    },
    {
        id: 'primarySupplierName',
        accessorKey: 'primarySupplierName',
        header: 'Nhà cung cấp',
        cell: ({ row }) => row.primarySupplierName || '-',
        meta: { displayName: 'Nhà cung cấp chính' }
    },
    {
        id: 'lastPurchaseDate',
        accessorKey: 'lastPurchaseDate',
        header: 'Nhập lần cuối',
        cell: ({ row }) => formatDate(row.lastPurchaseDate),
        meta: { displayName: 'Ngày nhập cuối' }
    },
];
