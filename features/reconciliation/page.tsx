'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { usePageHeader } from '../../contexts/page-header-context';
import { useAllReconciliationItems, type ReconciliationItemFromAPI } from './hooks/use-all-reconciliation-items';
import { useReconciliationActions } from '../orders/hooks/use-reconciliation-actions';
import { ResponsiveDataTable } from '../../components/data-table/responsive-data-table';
import { getColumns } from './columns';
import { Card, CardContent, CardTitle } from '../../components/ui/card';
import { PageToolbar } from '../../components/layout/page-toolbar';
import { PageFilters } from '../../components/layout/page-filters';
import { Button } from '../../components/ui/button';
import { CheckCircle2, Download, Settings } from 'lucide-react';
import { simpleSearch } from '../../lib/simple-search';
import dynamic from 'next/dynamic';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from '../../components/data-table/dynamic-column-customizer';
import { asSystemId, type SystemId } from '../../lib/id-types';

// ✅ Dynamic import for Export dialog - lazy loads XLSX library (~500KB) + config
const ReconciliationExportDialog = dynamic(
  () => import("./components/reconciliation-import-export-dialogs").then(mod => ({ default: mod.ReconciliationExportDialog })),
  { ssr: false }
);
import { Badge } from '../../components/ui/badge';
import { formatDate } from '../../lib/date-utils';
import { useAuth } from '../../contexts/auth-context';
import { useBreakpoint } from '../../contexts/breakpoint-context';
import { ROUTES } from '../../lib/router';
import { useColumnVisibility } from '../../hooks/use-column-visibility';

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '-';
    return new Intl.NumberFormat('vi-VN').format(value);
};

import type { ReconciliationStats } from '@/lib/data/reconciliation';

export type ReconciliationItem = ReconciliationItemFromAPI & {
    orderSystemId: SystemId;
    [key: string]: unknown;
};

export interface ReconciliationPageProps {
    initialStats?: ReconciliationStats;
}

export function ReconciliationPage({ initialStats: _initialStats }: ReconciliationPageProps = {}) {
    const router = useRouter();
    const { data: allReconciliationItems } = useAllReconciliationItems();
    const { confirmCodReconciliation, isReconciling: _isReconciling } = useReconciliationActions();
    const { employee: authEmployee } = useAuth();
    const { isMobile } = useBreakpoint();
    const currentEmployeeSystemId = authEmployee?.systemId ?? asSystemId('SYSTEM');
    const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
    const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
    const [exportDialogOpen, setExportDialogOpen] = React.useState(false);
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
    const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'createdAt', desc: true });
    
    // ✅ Sử dụng useColumnVisibility hook thay vì localStorage trực tiếp
    const defaultColumnVisibility = React.useMemo(() => {
        const cols = getColumns();
        const initial: Record<string, boolean> = {};
        cols.forEach(c => { if (c.id) initial[c.id] = true; });
        return initial;
    }, []);
    const [columnVisibility, setColumnVisibility] = useColumnVisibility('reconciliation', defaultColumnVisibility);
    
    const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
    const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);


    // ✅ Data from dedicated API - no longer loads ALL orders
    const reconciliationList = React.useMemo<ReconciliationItem[]>(() =>
        allReconciliationItems.map(item => ({
            ...item,
            orderSystemId: asSystemId(item.orderSystemId),
        })),
    [allReconciliationItems]);

    const searchedData = React.useMemo(() => 
        simpleSearch(reconciliationList, globalFilter, { keys: ['trackingCode', 'orderId', 'customerName', 'carrier'] }), 
        [reconciliationList, globalFilter]
    );

    const filteredData = React.useMemo(() => {
        return globalFilter ? searchedData : reconciliationList;
    }, [reconciliationList, globalFilter, searchedData]);

    const sortedData = React.useMemo(() => {
        return [...filteredData].sort((a, b) => {
            const aVal = (a as Record<string, unknown>)[sorting.id];
            const bVal = (b as Record<string, unknown>)[sorting.id];
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

    const handleConfirm = async () => {
        const selectedItems = reconciliationList.filter(item => rowSelection[item.systemId]);
        if (selectedItems.length > 0) {
            await confirmCodReconciliation(selectedItems, currentEmployeeSystemId);
            setRowSelection({});
        }
        setIsConfirmOpen(false);
    };
    
    // Page header configuration
    const _pendingCount = reconciliationList.length;
    const _pendingCodTotal = React.useMemo(() =>
        reconciliationList.reduce((total, item) => total + (item.codAmount ?? 0), 0),
    [reconciliationList]);
    const selectedCount = React.useMemo(() => Object.keys(rowSelection).length, [rowSelection]);

    usePageHeader(React.useMemo(() => ({
        title: 'Đối soát COD',
        breadcrumb: [
            { label: 'Trang chủ', href: ROUTES.ROOT },
            { label: 'Đối soát COD', href: ROUTES.INTERNAL.RECONCILIATION, isCurrent: true }
        ],
        showBackButton: false,
        actions: [
            <Button 
                key="confirm"
                size="sm"
                className="h-9 px-4"
                onClick={() => setIsConfirmOpen(true)}
                disabled={selectedCount === 0}
            >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Xác nhận đã nhận tiền ({selectedCount})
            </Button>
        ]
    }), [selectedCount]));
    
    const columns = React.useMemo(() => getColumns(), []);
    
    const columnDefaultsInitialized = React.useRef(false);
    React.useEffect(() => {
        if (columnDefaultsInitialized.current) return;
        if (columns.length === 0) return;
        
        const initialVisibility: Record<string, boolean> = {};
        columns.forEach(c => {
            if (c.id) {
                initialVisibility[c.id] = true;
            }
        });
        setColumnVisibility(initialVisibility);
        setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
        setPinnedColumns(['select']);
        columnDefaultsInitialized.current = true;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [columns]);


    return (
        <div className="h-full flex flex-col space-y-4">
            {/* PageToolbar - Desktop only */}
            {!isMobile && (
                <PageToolbar
                    leftActions={
                        <>
                        <Button variant="outline" size="sm" onClick={() => router.push('/settings/payments')}>
                            <Settings className="h-4 w-4 mr-2" />
                            Cài đặt
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setExportDialogOpen(true)}>
                            <Download className="h-4 w-4 mr-2" />
                            Xuất Excel
                        </Button>
                        </>
                    }
                    rightActions={
                        <DataTableColumnCustomizer
                            columns={columns}
                            columnVisibility={columnVisibility}
                            setColumnVisibility={setColumnVisibility}
                            columnOrder={columnOrder}
                            setColumnOrder={setColumnOrder}
                            pinnedColumns={pinnedColumns}
                            setPinnedColumns={setPinnedColumns}
                        />
                    }
                />
            )}

            {/* PageFilters */}
            <PageFilters
                searchValue={globalFilter}
                onSearchChange={setGlobalFilter}
                searchPlaceholder="Tìm mã vận đơn, mã đơn hàng..."
            />

            <ResponsiveDataTable<ReconciliationItem>
                className="row"
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
                                    <CardTitle size="sm">{item.orderId}</CardTitle>
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

            {/* Export Dialog */}
            <ReconciliationExportDialog
                open={exportDialogOpen}
                onOpenChange={setExportDialogOpen}
                allData={reconciliationList}
                filteredData={filteredData}
                currentPageData={paginatedData}
                selectedData={allSelectedRows}
                currentUser={{
                    name: authEmployee?.fullName || 'Hệ thống',
                    systemId: authEmployee?.systemId || asSystemId('SYSTEM'),
                }}
            />
        </div>
    );
}
