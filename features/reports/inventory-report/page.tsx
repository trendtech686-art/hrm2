import * as React from 'react';
import { usePageHeader } from '../../../contexts/page-header-context.tsx';
import { useProductStore } from '../../products/store.ts';
import { useBranchStore } from '../../settings/branches/store.ts';
import type { InventoryReportRow } from './types.ts';
import { getColumns } from './columns.tsx';
import { ResponsiveDataTable } from '../../../components/data-table/responsive-data-table.tsx';
import { DataTableToolbar } from '../../../components/data-table/data-table-toolbar.tsx';
import { Card, CardContent } from '../../../components/ui/card.tsx';
import Fuse from 'fuse.js';

export function InventoryReportPage() {
    usePageHeader();
    
    const { data: products } = useProductStore();
    const { data: branches } = useBranchStore();
    
    const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'productName', desc: false });
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
    
    const reportData = React.useMemo<InventoryReportRow[]>(() => {
        const rows: InventoryReportRow[] = [];
        products.forEach(product => {
            branches.forEach(branch => {
                const onHand = product.inventoryByBranch[branch.systemId] || 0;
                const committed = product.committedByBranch[branch.systemId] || 0;
                
                // Only show rows that have some inventory history or current stock
                if (onHand > 0 || committed > 0) {
                    rows.push({
                        systemId: `${product.systemId}-${branch.systemId}`,
                        productName: product.name,
                        sku: product.id,
                        branchName: branch.name,
                        onHand: onHand,
                        committed: committed,
                        available: onHand - committed,
                        costPrice: product.costPrice,
                    });
                }
            });
        });
        return rows;
    }, [products, branches]);

    const fuse = React.useMemo(() => new Fuse(reportData, { keys: ['productName', 'sku', 'branchName'], threshold: 0.4 }), [reportData]);
    
    const filteredData = React.useMemo(() => globalFilter ? fuse.search(globalFilter).map(r => r.item) : reportData, [reportData, globalFilter, fuse]);
    
    const sortedData = React.useMemo(() => {
        const sorted = [...filteredData];
        if (sorting.id) {
          sorted.sort((a, b) => {
            const aValue = (a as any)[sorting.id];
            const bValue = (b as any)[sorting.id];
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
                        searchPlaceholder="Tìm sản phẩm, SKU, chi nhánh..."
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
