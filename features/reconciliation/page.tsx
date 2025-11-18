import * as React from 'react';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { useOrderStore } from '../orders/store.ts';
import { useEmployeeStore } from '../employees/store.ts';
import type { Order, Packaging } from '../orders/types.ts';
import { ResponsiveDataTable } from '../../components/data-table/responsive-data-table.tsx';
import { getColumns } from './columns.tsx';
import { Card, CardContent } from '../../components/ui/card.tsx';
import { DataTableToolbar } from '../../components/data-table/data-table-toolbar.tsx';
import { Button } from '../../components/ui/button.tsx';
import { CheckCircle2 } from 'lucide-react';
import Fuse from 'fuse.js';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog.tsx';
import { DataTableColumnCustomizer } from '../../components/data-table/data-table-column-toggle.tsx';
import { Badge } from '../../components/ui/badge.tsx';
import { formatDate } from '../../lib/date-utils.ts';

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '-';
    return new Intl.NumberFormat('vi-VN').format(value);
};

export type ReconciliationItem = Packaging & {
    orderSystemId: string;
    orderId: string;
    customerName: string;
};

export function ReconciliationPage() {
    const { data: allOrders, confirmCodReconciliation } = useOrderStore();
    const loggedInUser = useEmployeeStore().data[0];
    const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
    const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
    const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'deliveredDate', desc: true });
    
    const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>(() => {
        const storageKey = 'reconciliation-column-visibility';
        const stored = localStorage.getItem(storageKey);
        const cols = getColumns();
        const allColumnIds = cols.map(c => c.id).filter(Boolean);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (allColumnIds.every(id => id in parsed)) return parsed;
            } catch (e) {}
        }
        const initial: Record<string, boolean> = {};
        cols.forEach(c => { if (c.id) initial[c.id] = true; });
        return initial;
    });
    
    React.useEffect(() => {
        localStorage.setItem('reconciliation-column-visibility', JSON.stringify(columnVisibility));
    }, [columnVisibility]);
    
    const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
    const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);


    const reconciliationList = React.useMemo<ReconciliationItem[]>(() => {
        const items: ReconciliationItem[] = [];
        allOrders.forEach(order => {
            order.packagings.forEach(pkg => {
                if (pkg.deliveryStatus === 'Đã giao hàng' && pkg.codAmount && pkg.codAmount > 0 && pkg.reconciliationStatus !== 'Đã đối soát') {
                    items.push({
                        ...pkg,
                        orderSystemId: order.systemId,
                        orderId: order.id,
                        customerName: order.customerName,
                    });
                }
            });
        });
        return items;
    }, [allOrders]);

    const fuse = React.useMemo(() => new Fuse(reconciliationList, { 
        keys: ['trackingCode', 'orderId', 'customerName', 'carrier'],
        threshold: 0.4 
    }), [reconciliationList]);

    const filteredData = React.useMemo(() => {
        if (globalFilter) {
            return fuse.search(globalFilter).map(result => result.item);
        }
        return reconciliationList;
    }, [reconciliationList, globalFilter, fuse]);

    const sortedData = React.useMemo(() => {
        return [...filteredData].sort((a, b) => {
            const aVal = (a as any)[sorting.id];
            const bVal = (b as any)[sorting.id];
            if (!aVal) return 1;
            if (!bVal) return -1;
            if (aVal < bVal) return sorting.desc ? 1 : -1;
            if (aVal > bVal) return sorting.desc ? -1 : 1;
            return 0;
        });
    }, [filteredData, sorting]);

    const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
    const paginatedData = sortedData.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize);

    const allSelectedRows = React.useMemo(() =>
        reconciliationList.filter(item => rowSelection[item.systemId]),
    [reconciliationList, rowSelection]);

    const handleConfirm = () => {
        const selectedItems = reconciliationList.filter(item => rowSelection[item.systemId]);
        if (selectedItems.length > 0) {
            confirmCodReconciliation(selectedItems, loggedInUser.systemId);
            setRowSelection({});
        }
        setIsConfirmOpen(false);
    };
    
    // Page header configuration
    const pageHeaderConfig = React.useMemo(() => ({
        actions: [
            <Button 
                key="confirm"
                size="sm" 
                onClick={() => setIsConfirmOpen(true)}
                disabled={Object.keys(rowSelection).length === 0}
            >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Xác nhận đã nhận tiền ({Object.keys(rowSelection).length})
            </Button>
        ]
    }), [rowSelection]);

    usePageHeader(pageHeaderConfig);
    
    const columns = React.useMemo(() => getColumns(), []);
    
    React.useEffect(() => {
        const initialVisibility: Record<string, boolean> = {};
        columns.forEach(c => {
            if (c.id) {
                initialVisibility[c.id] = true;
            }
        });
        setColumnVisibility(initialVisibility);
        setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
        setPinnedColumns(['select']);
    }, [columns]);


    return (
        <div className="h-full flex flex-col space-y-4">
            <Card>
                <CardContent className="p-4">
                     <DataTableToolbar
                        search={globalFilter}
                        onSearchChange={setGlobalFilter}
                        searchPlaceholder="Tìm mã vận đơn, mã đơn hàng..."
                        numResults={filteredData.length}
                    >
                        <div className="flex items-center gap-2">
                            <Button 
                                size="sm" 
                                onClick={() => setIsConfirmOpen(true)}
                                disabled={Object.keys(rowSelection).length === 0}
                            >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Xác nhận đã nhận tiền ({Object.keys(rowSelection).length})
                            </Button>
                             <DataTableColumnCustomizer
                                columns={columns}
                                columnVisibility={columnVisibility}
                                setColumnVisibility={setColumnVisibility}
                                columnOrder={columnOrder}
                                setColumnOrder={setColumnOrder}
                                pinnedColumns={pinnedColumns}
                                setPinnedColumns={setPinnedColumns}
                            />
                        </div>
                    </DataTableToolbar>
                </CardContent>
            </Card>
            <ResponsiveDataTable<ReconciliationItem>
                className="flex-grow"
                columns={columns}
                data={paginatedData}
                rowCount={filteredData.length}
                pageCount={pageCount}
                pagination={pagination}
                setPagination={setPagination}
                sorting={sorting}
                setSorting={setSorting}
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
                allSelectedRows={allSelectedRows}
                columnVisibility={columnVisibility}
                setColumnVisibility={setColumnVisibility}
                columnOrder={columnOrder}
                setColumnOrder={setColumnOrder}
                pinnedColumns={pinnedColumns}
                setPinnedColumns={setPinnedColumns}
                expanded={{}}
                setExpanded={() => {}}
                renderMobileCard={(item) => (
                    <Card>
                        <CardContent className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="font-semibold">{item.orderId}</div>
                                    <div className="text-sm text-muted-foreground">{item.customerName}</div>
                                </div>
                                <Badge variant="secondary">{item.reconciliationStatus || 'Chưa đối soát'}</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <div className="text-muted-foreground">Mã vận đơn</div>
                                    <div className="font-mono">{item.trackingCode || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-muted-foreground">Đối tác</div>
                                    <div>{item.carrier || '-'}</div>
                                </div>
                                <div>
                                    <div className="text-muted-foreground">Ngày giao</div>
                                    <div>{formatDate(item.deliveredDate)}</div>
                                </div>
                                <div>
                                    <div className="text-muted-foreground">Tiền COD</div>
                                    <div className="font-semibold">{formatCurrency(item.codAmount)}</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            />
             <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận đối soát?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Hành động này sẽ tự động tạo phiếu thu cho {allSelectedRows.length} vận đơn đã chọn và đánh dấu chúng là "Đã đối soát". Bạn có chắc chắn muốn tiếp tục?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm}>Xác nhận</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
