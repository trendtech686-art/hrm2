import * as React from 'react';
import { usePageHeader } from '../../../contexts/page-header-context.tsx';
import { useOrderStore } from '../../orders/store.ts';
import { useProductStore } from '../../products/store.ts';
import type { OrderWithProfit } from './types.ts';
import { getColumns } from './columns.tsx';
import { DataTable } from '../../../components/data-table/data-table.tsx';
import { DataTableToolbar } from '../../../components/data-table/data-table-toolbar.tsx';
import { Card, CardContent } from '../../../components/ui/card.tsx';
import Fuse from 'fuse.js';

export function SalesReportPage() {
    usePageHeader();
    
    const { data: orders } = useOrderStore();
    const { findById: findProductById } = useProductStore();
    
    const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'orderDate', desc: true });
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
    
    const filteredData = React.useMemo(() => globalFilter ? fuse.search(globalFilter).map(r => r.item) : reportData, [reportData, globalFilter, fuse]);
    
    const sortedData = React.useMemo(() => {
        const sorted = [...filteredData];
        if (sorting.id) {
          sorted.sort((a, b) => {
            const aValue = (a as any)[sorting.id];
            const bValue = (b as any)[sorting.id];
            if (!aValue) return 1;
            if (!bValue) return -1;
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

    return (
        <div className="h-full flex flex-col space-y-4">
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
            <DataTable
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
