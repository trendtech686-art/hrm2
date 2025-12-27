import * as React from 'react';
import { usePageHeader } from '../../../contexts/page-header-context';
import { useOrderStore } from '../../orders/store';
import { useProductStore } from '../../products/store';
import type { OrderWithProfit } from '@/lib/types/prisma-extended';
import { getColumns } from './columns';
import { ResponsiveDataTable } from '../../../components/data-table/responsive-data-table';
import { DataTableToolbar } from '../../../components/data-table/data-table-toolbar';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import Fuse from 'fuse.js';
import { Download } from 'lucide-react';
import { ROUTES } from '../../../lib/router';

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || Number.isNaN(value)) return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};

export function SalesReportPage() {
    const { data: orders } = useOrderStore();
    const { findById: findProductById } = useProductStore();
    
    const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'createdAt', desc: true });
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
    
    const reportData = React.useMemo<OrderWithProfit[]>(() => {
        return orders
            .filter(o => o.status === 'Hoàn thành')
            .map(order => {
                const costOfGoods = order.lineItems.reduce((sum, item) => {
                    const product = findProductById(item.productSystemId);
                    return sum + ((product?.costPrice || 0) * item.quantity);
                }, 0);
                const profit = order.subtotal - costOfGoods;
                return { ...order, costOfGoods, profit };
            });
    }, [orders, findProductById]);

    const fuse = React.useMemo(() => new Fuse(reportData, { keys: ['id', 'customerName', 'salesperson'], threshold: 0.4 }), [reportData]);
    const summaryStats = React.useMemo(() => {
        const totalOrders = reportData.length;
        const revenue = reportData.reduce((sum, order) => sum + order.grandTotal, 0);
        const profit = reportData.reduce((sum, order) => sum + order.profit, 0);
        return { totalOrders, revenue, profit };
    }, [reportData]);
    
    const filteredData = React.useMemo(() => globalFilter ? fuse.search(globalFilter).map(r => r.item) : reportData, [reportData, globalFilter, fuse]);
    
    const sortedData = React.useMemo(() => {
        const sorted = [...filteredData];
        if (sorting.id) {
          sorted.sort((a, b) => {
            const aValue = (a as any)[sorting.id];
            const bValue = (b as any)[sorting.id];
            if (!aValue) return 1;
            if (!bValue) return -1;
            // Special handling for date columns
            if (sorting.id === 'createdAt' || sorting.id === 'orderDate') {
              const aTime = aValue ? new Date(aValue).getTime() : 0;
              const bTime = bValue ? new Date(bValue).getTime() : 0;
              return sorting.desc ? bTime - aTime : aTime - bTime;
            }
            if (aValue < bValue) return sorting.desc ? 1 : -1;
            if (aValue > bValue) return sorting.desc ? -1 : 1;
            return 0;
          });
        }
        return sorted;
    }, [filteredData, sorting]);

    const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
    const paginatedData = sortedData.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize);

    const columns = React.useMemo(() => getColumns(), []);
    const handleExport = React.useCallback(() => window.print(), []);
    const headerActions = React.useMemo(() => [
        <Button
            key="export"
            size="sm"
            className="h-9 px-4"
            onClick={handleExport}
        >
            <Download className="mr-2 h-4 w-4" />
            Xuất báo cáo
        </Button>
    ], [handleExport]);

    usePageHeader(React.useMemo(() => ({
        title: 'Báo cáo doanh thu',
        breadcrumb: [
            { label: 'Trang chủ', href: ROUTES.ROOT, isCurrent: false },
            { label: 'Báo cáo doanh thu', href: ROUTES.REPORTS.SALES, isCurrent: true }
        ],
        showBackButton: false,
        actions: headerActions,
    }), [summaryStats, headerActions]));

    return (
        <div className="h-full flex flex-col space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng đơn hàng</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-h4 font-bold">{summaryStats.totalOrders}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-h4 font-bold">{formatCurrency(summaryStats.revenue)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Lợi nhuận</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-h4 font-bold">{formatCurrency(summaryStats.profit)}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="p-4">
                    <DataTableToolbar
                        search={globalFilter}
                        onSearchChange={setGlobalFilter}
                        searchPlaceholder="Tìm kiếm báo cáo..."
                        numResults={filteredData.length}
                    />
                </CardContent>
            </Card>
            <ResponsiveDataTable
                className="flex-grow"
                columns={columns}
                data={paginatedData}
                rowCount={filteredData.length}
                pageCount={pageCount}
                pagination={pagination}
                setPagination={setPagination}
                sorting={sorting}
                setSorting={setSorting}
                rowSelection={{}}
                setRowSelection={() => {}}
                allSelectedRows={[]}
                expanded={{}}
                setExpanded={() => {}}
                columnVisibility={{}}
                setColumnVisibility={() => {}}
                columnOrder={[]}
                setColumnOrder={() => {}}
                pinnedColumns={[]}
                setPinnedColumns={() => {}}
            />
        </div>
    );
}
