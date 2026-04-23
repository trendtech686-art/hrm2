'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, XCircle, CheckCircle, Printer, Settings, Loader2 } from 'lucide-react';

import { usePriceAdjustments, usePriceAdjustmentMutations } from './hooks/use-price-adjustments';
import { useAllPricingPolicies } from '../settings/pricing/hooks/use-all-pricing-policies';
import { getColumns } from './columns';
import { ROUTES } from '@/lib/router';
import { cn } from '@/lib/utils';
import { usePageHeader } from '@/contexts/page-header-context';
import { useAuth } from '@/contexts/auth-context';
import { useColumnLayout } from '@/hooks/use-column-visibility';
import { useMediaQuery } from '@/lib/use-media-query';
import type { PriceAdjustment } from './types';

import { ResponsiveDataTable } from '@/components/data-table/responsive-data-table';
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from '@/components/data-table/dynamic-column-customizer';
import { Button } from '@/components/ui/button';
import { PageToolbar } from '@/components/layout/page-toolbar';
import { PageFilters } from '@/components/layout/page-filters';
import { AdvancedFilterPanel, FilterExtras, type FilterConfig } from '@/components/shared/advanced-filter-panel';
import { useFilterPresets } from '@/hooks/use-filter-presets';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { MobileCard, MobileCardBody, MobileCardHeader } from '@/components/mobile/mobile-card';
import { formatDate } from '@/lib/date-utils';
import { ListPageShell } from '@/components/layout/page-section';

// Simple card for mobile
function PriceAdjustmentCard({ 
  adjustment, 
  onConfirm: _onConfirm, 
  onCancel: _onCancel 
}: { 
  adjustment: PriceAdjustment; 
  onConfirm: (id: string) => void; 
  onCancel: (id: string) => void;
}) {
  const getStatusVariant = (status: string) => {
    const s = status?.toLowerCase?.() || status;
    switch (s) {
      case 'draft': return 'secondary';
      case 'confirmed': return 'success';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };
  
  const getStatusLabel = (status: string) => {
    const s = status?.toLowerCase?.() || status;
    switch (s) {
      case 'draft': return 'Nháp';
      case 'confirmed': return 'Đã xác nhận';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };
  
  const itemCount = adjustment.items?.length || 0;
  return (
    <MobileCard>
      <MobileCardHeader className="items-start justify-between">
        <div className="min-w-0 flex-1">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">Phiếu điều chỉnh giá</div>
          <div className="mt-0.5 flex items-center gap-2">
            <div className="text-sm font-semibold text-foreground truncate font-mono">{adjustment.id}</div>
            <Badge variant={getStatusVariant(adjustment.status) as 'default' | 'secondary' | 'destructive' | 'outline' | 'success'} className="text-xs shrink-0">
              {getStatusLabel(adjustment.status)}
            </Badge>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-2xl font-bold leading-none">{itemCount}</div>
          <div className="mt-1 text-xs text-muted-foreground">Sản phẩm</div>
        </div>
      </MobileCardHeader>
      <MobileCardBody>
        <dl className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-sm">
          <div className="col-span-2">
            <dt className="text-xs text-muted-foreground">Chính sách giá</dt>
            <dd className="font-medium truncate">{adjustment.pricingPolicyName || '—'}</dd>
          </div>
          {adjustment.createdDate && (
            <div>
              <dt className="text-xs text-muted-foreground">Ngày tạo</dt>
              <dd className="font-medium">{formatDate(adjustment.createdDate)}</dd>
            </div>
          )}
          {adjustment.createdByName && (
            <div>
              <dt className="text-xs text-muted-foreground">Người tạo</dt>
              <dd className="font-medium truncate">{adjustment.createdByName}</dd>
            </div>
          )}
        </dl>
      </MobileCardBody>
    </MobileCard>
  );
}

export function PriceAdjustmentListPage() {
  const router = useRouter();
  const { cancel, confirm } = usePriceAdjustmentMutations({
    onSuccess: () => toast.success('Cập nhật thành công'),
    onError: (error) => toast.error(error.message),
  });
  const {  employee, can } = useAuth();
  const canCreate = can('edit_products');
  const canApprove = can('edit_products');
  const canEditSettings = can('edit_settings');
  const isMobile = !useMediaQuery("(min-width: 768px)");
  const { data: pricingPolicies } = useAllPricingPolicies();

  // Filter presets
  const { presets, savePreset, deletePreset, updatePreset } = useFilterPresets('price-adjustments');

  const [confirmDialogState, setConfirmDialogState] = React.useState<{ type: 'bulk-cancel' | 'bulk-confirm'; items: PriceAdjustment[] } | null>(null);
  const [isConfirmLoading, setIsConfirmLoading] = React.useState(false);
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'createdAt', desc: true });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = React.useState('');
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 40 });
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const [advancedFilters, setAdvancedFilters] = React.useState<Record<string, unknown>>({});

  // Server-side pagination
  const serverFilters = React.useMemo(() => ({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedGlobalFilter || undefined,
    status: (advancedFilters.status as string) || undefined,
    pricingPolicyId: (advancedFilters.pricingPolicy as string) || undefined,
    sortBy: sorting.id || 'createdAt',
    sortOrder: sorting.desc ? 'desc' as const : 'asc' as const,
  }), [pagination.pageIndex, pagination.pageSize, debouncedGlobalFilter, advancedFilters, sorting]);
  const { data: response, isLoading, isFetching } = usePriceAdjustments(serverFilters);
  const tableData = React.useMemo(() => (response?.data ?? []) as PriceAdjustment[], [response]);
  const serverTotal = response?.pagination?.total ?? 0;
  const serverPageCount = response?.pagination?.totalPages ?? 0;

  const columnLayoutDefaults = React.useMemo(() => ({ visibility: {}, order: [] as string[], pinned: [] as string[] }), []);
  const [{ visibility: columnVisibility, order: columnOrder, pinned: pinnedColumns }, { setVisibility: setColumnVisibility, setOrder: setColumnOrder, setPinned: setPinnedColumns }] = useColumnLayout('price-adjustments', columnLayoutDefaults);

  React.useEffect(() => { const t = setTimeout(() => setDebouncedGlobalFilter(globalFilter), 300); return () => clearTimeout(t); }, [globalFilter]);

  const handleSinglePrint = React.useCallback((_adj: PriceAdjustment) => {
    toast.info('Tính năng in đang được phát triển');
  }, []);

  const columns = React.useMemo(() => getColumns(router.push, handleSinglePrint), [router, handleSinglePrint]);

  const headerActions = React.useMemo(() => [
    canCreate && <Button key="add" onClick={() => router.push('/price-adjustments/new')}>
      <Plus className="mr-2 h-4 w-4" />Tạo phiếu
    </Button>
  ], [router, canCreate]);
  
  usePageHeader({ 
    title: 'Danh sách điều chỉnh giá bán', 
    breadcrumb: [
      { label: 'Trang chủ', href: ROUTES.ROOT }, 
      { label: 'Điều chỉnh giá bán', href: '/price-adjustments', isCurrent: true }
    ], 
    actions: headerActions, 
    showBackButton: false 
  });

  const buildDefaultVisibility = React.useCallback(() => { 
    const def = new Set(['id', 'pricingPolicyName', 'createdDate', 'status', 'itemCount', 'totalOldValue', 'totalNewValue', 'createdByName', 'reason']); 
    const v: Record<string, boolean> = {}; 
    columns.forEach(c => { if (!c.id) return; v[c.id] = c.id === 'select' || c.id === 'actions' || def.has(c.id); }); 
    return v; 
  }, [columns]);
  
  const buildDefaultOrder = React.useCallback(() => columns.map(c => c.id).filter(Boolean) as string[], [columns]);

  const defaultsInitialized = React.useRef(false);
  React.useEffect(() => { 
    if (columns.length === 0 || defaultsInitialized.current) return; 
    defaultsInitialized.current = true; 
    setColumnVisibility(buildDefaultVisibility()); 
    setColumnOrder(buildDefaultOrder()); 
  }, [columns, buildDefaultVisibility, buildDefaultOrder, setColumnVisibility, setColumnOrder]);

  const resetColumnLayout = React.useCallback(() => { 
    setColumnVisibility(buildDefaultVisibility()); 
    setColumnOrder(buildDefaultOrder()); 
    setPinnedColumns([]); 
    toast.success('Đã khôi phục bố cục mặc định'); 
  }, [buildDefaultVisibility, buildDefaultOrder, setColumnVisibility, setColumnOrder, setPinnedColumns]);

  React.useEffect(() => { setPagination(p => ({ ...p, pageIndex: 0 })); }, [debouncedGlobalFilter, advancedFilters]);

  const allSelectedRows = React.useMemo(() => tableData.filter(a => rowSelection[a.systemId]), [tableData, rowSelection]);

  const handleBulkCancel = React.useCallback(() => { 
    const drafts = allSelectedRows.filter(a => a.status?.toLowerCase?.() === 'draft'); 
    if (drafts.length === 0) { toast.info('Không có phiếu nào có thể hủy'); return; } 
    setConfirmDialogState({ type: 'bulk-cancel', items: drafts }); 
  }, [allSelectedRows]);
  
  const handleBulkConfirm = React.useCallback(() => { 
    const drafts = allSelectedRows.filter(a => a.status?.toLowerCase?.() === 'draft'); 
    if (drafts.length === 0) { toast.info('Không có phiếu nào có thể xác nhận'); return; } 
    setConfirmDialogState({ type: 'bulk-confirm', items: drafts }); 
  }, [allSelectedRows]);

  const handleConfirmDialogAction = React.useCallback(async () => {
    if (!confirmDialogState || !employee) return; 
    setIsConfirmLoading(true);
    try {
      const promises = confirmDialogState.items.map(async (it) => {
        if (confirmDialogState.type === 'bulk-cancel') {
          await cancel.mutateAsync({
            systemId: it.systemId,
            cancelledBy: employee.systemId,
            cancelledByName: employee.fullName,
          });
        } else if (confirmDialogState.type === 'bulk-confirm') {
          await confirm.mutateAsync({
            systemId: it.systemId,
            confirmedBy: employee.systemId,
            confirmedByName: employee.fullName,
          });
        }
      });
      await Promise.all(promises);
      toast.success(`Đã ${confirmDialogState.type === 'bulk-cancel' ? 'hủy' : 'xác nhận'} ${confirmDialogState.items.length} phiếu`);
      setRowSelection({});
    } catch (error) {
      toast.error((error as Error).message);
    } finally { 
      setIsConfirmLoading(false); 
      setConfirmDialogState(null); 
    }
  }, [confirmDialogState, employee, cancel, confirm]);

  const handleBulkPrint = React.useCallback(() => { 
    if (allSelectedRows.length === 0) return; 
    toast.info('Tính năng in đang được phát triển'); 
  }, [allSelectedRows]);

  const bulkActions = React.useMemo(() => [
    { label: 'In phiếu', icon: Printer, onSelect: handleBulkPrint }, 
    { label: 'Xác nhận', icon: CheckCircle, onSelect: handleBulkConfirm }, 
    { label: 'Hủy phiếu', icon: XCircle, onSelect: handleBulkCancel, variant: 'destructive' as const }
  ], [handleBulkPrint, handleBulkConfirm, handleBulkCancel]);
  
  const confirmDialogCopy = React.useMemo(() => confirmDialogState ? confirmDialogState.type === 'bulk-cancel' 
    ? { title: 'Hủy nhiều phiếu', description: `Hủy ${confirmDialogState.items.length} phiếu?`, confirmLabel: 'Hủy' } 
    : { title: 'Xác nhận nhiều phiếu', description: `Xác nhận ${confirmDialogState.items.length} phiếu?`, confirmLabel: 'Xác nhận' } 
    : null, [confirmDialogState]);
    
  const statusOptions = React.useMemo(() => [
    { value: 'draft', label: 'Nháp' }, 
    { value: 'confirmed', label: 'Đã xác nhận' }, 
    { value: 'cancelled', label: 'Đã hủy' }
  ], []);
  
  const policyOptions = React.useMemo(() => 
    pricingPolicies.filter(p => p.type === 'Bán hàng').map(p => ({ value: p.systemId, label: p.name })),
    [pricingPolicies]
  );

  // Advanced filter configs
  const filterConfigs: FilterConfig[] = React.useMemo(() => [
    { id: 'status', label: 'Trạng thái', type: 'select' as const, options: statusOptions },
    ...(policyOptions.length > 0 ? [{ id: 'pricingPolicy', label: 'Bảng giá', type: 'select' as const, options: policyOptions }] : []),
    { id: 'dateRange', label: 'Ngày tạo', type: 'date-range' as const },
  ], [statusOptions, policyOptions]);

  const panelValues = React.useMemo(() => ({
    status: advancedFilters.status ?? null,
    pricingPolicy: advancedFilters.pricingPolicy ?? null,
    dateRange: advancedFilters.dateRange ?? null,
  }), [advancedFilters]);

  const handlePanelApply = React.useCallback((v: Record<string, unknown>) => {
    setAdvancedFilters(v);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, []);
  
  const handleRowClick = (r: PriceAdjustment) => router.push(`/price-adjustments/${r.systemId}`);
  const handleConfirmCard = React.useCallback((id: string) => { 
    router.push(`/price-adjustments/${id}`); 
    toast.info('Mở chi tiết để xác nhận'); 
  }, [router]);
  const handleCancelCard = React.useCallback((id: string) => { 
    router.push(`/price-adjustments/${id}`); 
    toast.info('Mở chi tiết để hủy'); 
  }, [router]);

  return (
    <ListPageShell>
      {!isMobile && (
        <PageToolbar 
          leftActions={
            <>{canEditSettings && <Button variant="outline" size="sm" onClick={() => router.push('/settings/pricing')}>
              <Settings className="h-4 w-4 mr-2" />Cài đặt
            </Button>}</>
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
              onResetToDefault={resetColumnLayout} 
            />
          } 
        />
      )}
      <PageFilters 
        searchValue={globalFilter} 
        onSearchChange={setGlobalFilter} 
        searchPlaceholder="Tìm kiếm phiếu điều chỉnh..."
      >
        <AdvancedFilterPanel
          filters={filterConfigs}
          values={panelValues}
          onApply={handlePanelApply}
          presets={presets.map(p => ({ ...p, filters: p.filters }))}
          onSavePreset={(preset) => savePreset(preset.name, panelValues)}
          onDeletePreset={deletePreset}
          onUpdatePreset={updatePreset}
        />
      </PageFilters>
      <FilterExtras presets={presets} filterConfigs={filterConfigs} values={panelValues} onApply={handlePanelApply} onDeletePreset={deletePreset} />
      <div className={cn('w-full py-4', isFetching && !isLoading && 'opacity-70 transition-opacity')}>
        <ResponsiveDataTable 
          columns={columns} 
          data={tableData} 
          isLoading={isLoading}
          renderMobileCard={adj => (
            <PriceAdjustmentCard 
              adjustment={adj} 
              onConfirm={handleConfirmCard} 
              onCancel={handleCancelCard} 
            />
          )} 
          pageCount={serverPageCount} 
          pagination={pagination} 
          setPagination={setPagination} 
          rowCount={serverTotal} 
          rowSelection={rowSelection} 
          setRowSelection={setRowSelection} 
          allSelectedRows={allSelectedRows} 
          bulkActions={bulkActions} 
          showBulkDeleteButton={false} 
          expanded={expanded} 
          setExpanded={setExpanded} 
          sorting={sorting} 
          setSorting={setSorting as React.Dispatch<React.SetStateAction<{ id: string; desc: boolean }>>} 
          columnVisibility={columnVisibility} 
          setColumnVisibility={setColumnVisibility} 
          columnOrder={columnOrder} 
          setColumnOrder={setColumnOrder} 
          pinnedColumns={pinnedColumns} 
          setPinnedColumns={setPinnedColumns} 
          onRowClick={handleRowClick} 
          mobileInfiniteScroll
        />
      </div>
      <AlertDialog open={!!confirmDialogState} onOpenChange={o => { if (!o && !isConfirmLoading) setConfirmDialogState(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialogCopy?.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirmDialogCopy?.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-9" disabled={isConfirmLoading}>Đóng</AlertDialogCancel>
            <AlertDialogAction className="h-9" disabled={isConfirmLoading} onClick={handleConfirmDialogAction}>
              {isConfirmLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isConfirmLoading ? 'Đang xử lý...' : confirmDialogCopy?.confirmLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ListPageShell>
  );
}
