import type { ColumnDef } from '../../../components/data-table/types.ts';
import type { InventoryReportRow } from './types.ts';
import { Badge } from '../../../components/ui/badge.tsx';
import { Link } from 'react-router-dom';
import { ROUTES, generatePath } from '../../../lib/router.ts';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../../../components/ui/tooltip.tsx';
import { AlertTriangle } from 'lucide-react';

const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN').format(value);

export const getColumns = (): ColumnDef<InventoryReportRow>[] => [
    { 
        id: 'productName', 
        accessorKey: 'productName', 
        header: 'Sản phẩm', 
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <Link 
                    to={generatePath(ROUTES.SALES.PRODUCT_VIEW, { systemId: row.productSystemId })} 
                    className="font-medium hover:underline text-primary"
                >
                    {row.productName}
                </Link>
                {row.isCombo && (
                    <Badge variant="secondary" className="text-xs">Combo</Badge>
                )}
            </div>
        ), 
        meta: { displayName: 'Tên sản phẩm' } 
    },
    { 
        id: 'sku', 
        accessorKey: 'sku', 
        header: 'Mã SKU', 
        cell: ({ row }) => <span className="text-muted-foreground">{row.sku}</span>, 
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
        cell: ({ row }) => {
            if (row.isCombo) {
                return (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="italic text-muted-foreground cursor-help">
                                    Ảo ({row.comboAvailable ?? 0})
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Combo có tồn kho ảo dựa trên SP con</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                );
            }
            return row.onHand;
        },
        meta: { displayName: 'Tồn kho' }
    },
    {
        id: 'committed',
        accessorKey: 'committed',
        header: 'Đang giao dịch',
        cell: ({ row }) => row.isCombo ? '-' : row.committed,
        meta: { displayName: 'Đang giao dịch' }
    },
    {
        id: 'available',
        accessorKey: 'available',
        header: 'Có thể bán',
        cell: ({ row }) => {
            const available = row.isCombo ? (row.comboAvailable ?? 0) : row.available;
            const hasBottleneck = row.isCombo && row.bottleneckProducts && row.bottleneckProducts.length > 0;
            
            return (
                <div className="flex items-center gap-1">
                    <span className={`font-semibold ${available > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {available}
                    </span>
                    {hasBottleneck && available === 0 && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <AlertTriangle className="h-4 w-4 text-amber-500 cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="font-medium">SP hết hàng:</p>
                                    <ul className="text-sm">
                                        {row.bottleneckProducts?.slice(0, 3).map((name, i) => (
                                            <li key={i}>• {name}</li>
                                        ))}
                                        {(row.bottleneckProducts?.length ?? 0) > 3 && (
                                            <li>• và {(row.bottleneckProducts?.length ?? 0) - 3} SP khác...</li>
                                        )}
                                    </ul>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
            );
        },
        meta: { displayName: 'Có thể bán' }
    },
    {
        id: 'inTransit',
        accessorKey: 'inTransit',
        header: 'Đang vận chuyển',
        cell: ({ row }) => row.isCombo ? '-' : row.inTransit,
        meta: { displayName: 'Đang vận chuyển' }
    },
    {
        id: 'totalValue',
        header: 'Giá trị tồn',
        cell: ({ row }) => {
            if (row.isCombo) {
                // Combo giá trị = comboAvailable * costPrice (giá vốn combo)
                const comboValue = (row.comboAvailable ?? 0) * row.costPrice;
                return <span className="italic">{formatCurrency(comboValue)}</span>;
            }
            return formatCurrency(row.onHand * row.costPrice);
        },
        meta: { displayName: 'Giá trị tồn' }
    },
];
