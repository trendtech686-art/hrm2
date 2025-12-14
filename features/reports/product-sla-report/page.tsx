import * as React from 'react';
import { usePageHeader } from '../../../contexts/page-header-context.tsx';
import { useProductStore } from '../../products/store.ts';
import { useSupplierStore } from '../../suppliers/store.ts';
import type { StockAlertReportRow, StockAlertFilter } from './types.ts';
import { getColumns } from './columns.tsx';
import { ResponsiveDataTable } from '../../../components/data-table/responsive-data-table.tsx';
import { DataTableToolbar } from '../../../components/data-table/data-table-toolbar.tsx';
import { Card, CardContent } from '../../../components/ui/card.tsx';
import { Button } from '../../../components/ui/button.tsx';
import { Tabs, TabsList, TabsTrigger } from '../../../components/ui/tabs.tsx';
import Fuse from 'fuse.js';
import { Download, PackageX, AlertTriangle, TrendingUp, AlertCircle } from 'lucide-react';
import { ROUTES } from '../../../lib/router.ts';
import { 
    getProductStockAlerts, 
    getTotalOnHandStock, 
    getTotalAvailableStock,
    getSuggestedOrderQuantity,
    STOCK_ALERT_CONFIG 
} from '../../products/stock-alert-utils.ts';

const formatNumber = (value?: number) => new Intl.NumberFormat('vi-VN').format(value ?? 0);

export function ProductSlaReportPage() {
    const { data: products } = useProductStore();
    const { data: suppliers } = useSupplierStore();
    
    const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'createdAt', desc: true });
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
    const [alertFilter, setAlertFilter] = React.useState<StockAlertFilter>('all');
    
    const reportData = React.useMemo<StockAlertReportRow[]>(() => {
        const rows: StockAlertReportRow[] = [];
        
        products.forEach(product => {
            // Skip inactive/discontinued products
            if (product.status === 'discontinued') return;
            
            // Get alerts for this product
            const alerts = getProductStockAlerts(product);
            if (alerts.length === 0) return;
            
            // Get supplier name
            const supplier = product.primarySupplierSystemId 
                ? suppliers.find(s => s.systemId === product.primarySupplierSystemId)
                : null;
            
            // Create one row per alert type
            alerts.forEach(alert => {
                rows.push({
                    systemId: `${product.systemId}-${alert.type}`,
                    productSystemId: product.systemId,
                    productName: product.name,
                    sku: product.id,
                    alertType: alert.type,
                    alertLabel: alert.label,
                    severity: alert.severity,
                    totalOnHand: getTotalOnHandStock(product),
                    totalAvailable: getTotalAvailableStock(product),
                    reorderLevel: product.reorderLevel ?? null,
                    safetyStock: product.safetyStock ?? null,
                    maxStock: product.maxStock ?? null,
                    suggestedOrder: getSuggestedOrderQuantity(product),
                    costPrice: product.costPrice || 0,
                    unit: product.unit || 'cái',
                    ...(supplier?.name ? { primarySupplierName: supplier.name } : {}),
                    ...(product.lastPurchaseDate ? { lastPurchaseDate: product.lastPurchaseDate } : {}),
                });
            });
        });
        
        // Sort by severity (critical first, then warning, then info)
        rows.sort((a, b) => {
            const severityOrder = { critical: 0, warning: 1, info: 2 };
            return severityOrder[a.severity] - severityOrder[b.severity];
        });
        
        return rows;
    }, [products, suppliers]);

    // Filter by alert type
    const filteredByType = React.useMemo(() => {
        if (alertFilter === 'all') return reportData;
        return reportData.filter(row => row.alertType === alertFilter);
    }, [reportData, alertFilter]);

    const fuse = React.useMemo(() => new Fuse(filteredByType, { 
        keys: ['productName', 'sku', 'primarySupplierName'], 
        threshold: 0.4 
    }), [filteredByType]);
    
    // Count by alert type
    const alertCounts = React.useMemo(() => ({
        all: reportData.length,
        out_of_stock: reportData.filter(r => r.alertType === 'out_of_stock').length,
        low_stock: reportData.filter(r => r.alertType === 'low_stock').length,
        below_safety: reportData.filter(r => r.alertType === 'below_safety').length,
        over_stock: reportData.filter(r => r.alertType === 'over_stock').length,
    }), [reportData]);
    
    const filteredData = React.useMemo(() => 
        globalFilter ? fuse.search(globalFilter).map(r => r.item) : filteredByType, 
        [filteredByType, globalFilter, fuse]
    );
    
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
    const paginatedData = sortedData.slice(
        pagination.pageIndex * pagination.pageSize, 
        (pagination.pageIndex + 1) * pagination.pageSize
    );

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
        title: 'Cảnh báo tồn kho (Product SLA)',
        breadcrumb: [
            { label: 'Trang chủ', href: ROUTES.ROOT, isCurrent: false },
            { label: 'Báo cáo', href: ROUTES.REPORTS.INVENTORY, isCurrent: false },
            { label: 'Cảnh báo tồn kho', href: ROUTES.REPORTS.PRODUCT_SLA, isCurrent: true }
        ],
        showBackButton: false,
        actions: headerActions,
    }), [alertCounts, alertFilter, headerActions]));

    return (
        <div className="h-full flex flex-col space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className={alertCounts.out_of_stock > 0 ? 'border-destructive/20 bg-destructive/10 dark:border-destructive/30 dark:bg-destructive/20' : ''}>
                    <CardContent className="p-4 flex items-center gap-3">
                        <PackageX className={`h-8 w-8 ${alertCounts.out_of_stock > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
                        <div>
                            <p className="text-h4 font-bold">{alertCounts.out_of_stock}</p>
                            <p className="text-sm text-muted-foreground">Hết hàng</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className={alertCounts.low_stock > 0 ? 'border-amber-500/20 bg-amber-500/10 dark:border-amber-500/30 dark:bg-amber-500/20' : ''}>
                    <CardContent className="p-4 flex items-center gap-3">
                        <AlertTriangle className={`h-8 w-8 ${alertCounts.low_stock > 0 ? 'text-amber-500' : 'text-muted-foreground'}`} />
                        <div>
                            <p className="text-h4 font-bold">{alertCounts.low_stock}</p>
                            <p className="text-sm text-muted-foreground">Sắp hết</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className={alertCounts.below_safety > 0 ? 'border-orange-500/20 bg-orange-500/10 dark:border-orange-500/30 dark:bg-orange-500/20' : ''}>
                    <CardContent className="p-4 flex items-center gap-3">
                        <AlertCircle className={`h-8 w-8 ${alertCounts.below_safety > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
                        <div>
                            <p className="text-h4 font-bold">{alertCounts.below_safety}</p>
                            <p className="text-sm text-muted-foreground">Dưới an toàn</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex items-center gap-3">
                        <TrendingUp className={`h-8 w-8 ${alertCounts.over_stock > 0 ? 'text-blue-500' : 'text-muted-foreground'}`} />
                        <div>
                            <p className="text-h4 font-bold">{alertCounts.over_stock}</p>
                            <p className="text-sm text-muted-foreground">Tồn cao</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="p-4 space-y-4">
                    {/* Alert Type Filter Tabs */}
                    <Tabs value={alertFilter} onValueChange={(v) => setAlertFilter(v as StockAlertFilter)}>
                        <TabsList>
                            <TabsTrigger value="all" className="gap-2">
                                Tất cả ({alertCounts.all})
                            </TabsTrigger>
                            <TabsTrigger value="out_of_stock" className="gap-2">
                                <PackageX className="h-4 w-4" />
                                Hết hàng ({alertCounts.out_of_stock})
                            </TabsTrigger>
                            <TabsTrigger value="low_stock" className="gap-2">
                                <AlertTriangle className="h-4 w-4" />
                                Sắp hết ({alertCounts.low_stock})
                            </TabsTrigger>
                            <TabsTrigger value="below_safety" className="gap-2">
                                Dưới an toàn ({alertCounts.below_safety})
                            </TabsTrigger>
                            <TabsTrigger value="over_stock" className="gap-2">
                                <TrendingUp className="h-4 w-4" />
                                Tồn cao ({alertCounts.over_stock})
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                    
                    <DataTableToolbar
                        search={globalFilter}
                        onSearchChange={setGlobalFilter}
                        searchPlaceholder="Tìm sản phẩm, SKU, nhà cung cấp..."
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
