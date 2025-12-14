import * as React from 'react';
import { usePageHeader } from '../../../contexts/page-header-context.tsx';
import { useProductStore } from '../../products/store.ts';
import { useBranchStore } from '../../settings/branches/store.ts';
import type { InventoryReportRow, ProductTypeFilter } from './types.ts';
import { getColumns } from './columns.tsx';
import { ResponsiveDataTable } from '../../../components/data-table/responsive-data-table.tsx';
import { DataTableToolbar } from '../../../components/data-table/data-table-toolbar.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card.tsx';
import { Button } from '../../../components/ui/button.tsx';
import { Tabs, TabsList, TabsTrigger } from '../../../components/ui/tabs.tsx';
import Fuse from 'fuse.js';
import { Download, Package, Layers, PackageOpen } from 'lucide-react';
import { ROUTES } from '../../../lib/router.ts';
import { isComboProduct, calculateComboStock, getComboBottleneckProducts } from '../../products/combo-utils.ts';
import type { SystemId } from '@/lib/id-types';

const formatNumber = (value?: number) => new Intl.NumberFormat('vi-VN').format(value ?? 0);
const formatCurrency = (value?: number) => new Intl.NumberFormat('vi-VN').format(value ?? 0);

export function InventoryReportPage() {
    const { data: products } = useProductStore();
    const { data: branches } = useBranchStore();
    
    const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'createdAt', desc: true });
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
    const [productTypeFilter, setProductTypeFilter] = React.useState<ProductTypeFilter>('all');
    
    const reportData = React.useMemo<InventoryReportRow[]>(() => {
        const rows: InventoryReportRow[] = [];
        
        products.forEach(product => {
            const isCombo = isComboProduct(product);
            
            branches.forEach(branch => {
                const onHand = product.inventoryByBranch[branch.systemId] || 0;
                const committed = product.committedByBranch[branch.systemId] || 0;
                const inTransit = product.inTransitByBranch?.[branch.systemId] || 0;
                
                // For combo products, calculate virtual stock
                if (isCombo) {
                    const comboItems = product.comboItems ?? [];
                    const comboAvailable = comboItems.length > 0
                        ? calculateComboStock(comboItems, products, branch.systemId as SystemId)
                        : 0;
                    const bottleneckProducts = comboItems.length > 0
                        ? getComboBottleneckProducts(comboItems, products, branch.systemId as SystemId)
                            .map(entry => entry.product.name)
                        : [];
                    
                    // Always show combo in report (even if available = 0)
                    rows.push({
                        systemId: `${product.systemId}-${branch.systemId}`,
                        productSystemId: product.systemId,
                        productName: product.name,
                        sku: product.id,
                        branchName: branch.name,
                        branchSystemId: branch.systemId,
                        onHand: 0, // Combo has no physical stock
                        committed: 0,
                        available: 0,
                        inTransit: 0,
                        costPrice: product.costPrice || 0,
                        isCombo: true,
                        comboAvailable,
                        bottleneckProducts,
                    });
                } else {
                    // Only show rows that have some inventory
                    if (onHand > 0 || committed > 0 || inTransit > 0) {
                        rows.push({
                            systemId: `${product.systemId}-${branch.systemId}`,
                            productSystemId: product.systemId,
                            productName: product.name,
                            sku: product.id,
                            branchName: branch.name,
                            branchSystemId: branch.systemId,
                            onHand: onHand,
                            committed: committed,
                            available: onHand - committed,
                            inTransit: inTransit,
                            costPrice: product.costPrice || 0,
                            isCombo: false,
                        });
                    }
                }
            });
        });
        return rows;
    }, [products, branches]);

    // Filter by product type
    const typeFilteredData = React.useMemo(() => {
        switch (productTypeFilter) {
            case 'single':
                return reportData.filter(row => !row.isCombo);
            case 'combo':
                return reportData.filter(row => row.isCombo);
            default:
                return reportData;
        }
    }, [reportData, productTypeFilter]);

    const fuse = React.useMemo(() => new Fuse(typeFilteredData, { keys: ['productName', 'sku', 'branchName'], threshold: 0.4 }), [typeFilteredData]);
    
    const summaryStats = React.useMemo(() => {
        const singleRows = reportData.filter(r => !r.isCombo);
        const comboRows = reportData.filter(r => r.isCombo);
        
        const rowsCount = typeFilteredData.length;
        const onHand = singleRows.reduce((sum, row) => sum + row.onHand, 0);
        const available = singleRows.reduce((sum, row) => sum + row.available, 0);
        const stockValue = singleRows.reduce((sum, row) => sum + row.onHand * (row.costPrice || 0), 0);
        const comboCount = comboRows.length;
        const comboAvailable = comboRows.reduce((sum, row) => sum + (row.comboAvailable || 0), 0);
        
        return { rowsCount, onHand, available, stockValue, comboCount, comboAvailable };
    }, [reportData, typeFilteredData]);
    
    const filteredData = React.useMemo(() => globalFilter ? fuse.search(globalFilter).map(r => r.item) : typeFilteredData, [typeFilteredData, globalFilter, fuse]);
    
    const sortedData = React.useMemo(() => {
        const sorted = [...filteredData];
        if (sorting.id) {
          sorted.sort((a, b) => {
            const aValue = (a as any)[sorting.id];
            const bValue = (b as any)[sorting.id];
            // Special handling for date columns
            if (sorting.id === 'createdAt') {
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
        title: 'Báo cáo tồn kho',
        breadcrumb: [
            { label: 'Trang chủ', href: ROUTES.ROOT, isCurrent: false },
            { label: 'Báo cáo tồn kho', href: ROUTES.REPORTS.INVENTORY, isCurrent: true }
        ],
        showBackButton: false,
        actions: headerActions,
    }), [summaryStats, headerActions, productTypeFilter]));

    // Count for tabs
    const singleCount = reportData.filter(r => !r.isCombo).length;
    const comboCount = reportData.filter(r => r.isCombo).length;

    return (
        <div className="h-full flex flex-col space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng sản phẩm</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-h4 font-bold">{formatNumber(summaryStats.rowsCount)}</div>
                        <p className="text-xs text-muted-foreground">
                            {summaryStats.comboCount} combo
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng tồn kho</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-h4 font-bold">{formatNumber(summaryStats.onHand)}</div>
                        <p className="text-xs text-muted-foreground">
                            Khả dụng: {formatNumber(summaryStats.available)}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Giá trị tồn kho</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-h4 font-bold">{formatCurrency(summaryStats.stockValue)}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="p-4 space-y-4">
                    {/* Product Type Filter Tabs */}
                    <Tabs value={productTypeFilter} onValueChange={(v) => setProductTypeFilter(v as ProductTypeFilter)}>
                        <TabsList>
                            <TabsTrigger value="all" className="gap-2">
                                <Package className="h-4 w-4" />
                                Tất cả ({reportData.length})
                            </TabsTrigger>
                            <TabsTrigger value="single" className="gap-2">
                                <PackageOpen className="h-4 w-4" />
                                SP đơn ({singleCount})
                            </TabsTrigger>
                            <TabsTrigger value="combo" className="gap-2">
                                <Layers className="h-4 w-4" />
                                Combo ({comboCount})
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                    
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
