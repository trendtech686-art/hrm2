'use client'

import * as React from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Plus, LayoutGrid, Table, Settings, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';
import {
  type ColumnFiltersState,
  type VisibilityState,
  type RowSelectionState,
} from '@tanstack/react-table';
import { useColumnLayout } from '../../hooks/use-column-visibility';

// Types & Store
import type { WarrantyTicket, WarrantyStatus } from './types';
import { useWarranties, useWarrantyMutations, useWarrantyStats, type WarrantyStats } from './hooks/use-warranties';
import { useAllWarranties } from './hooks/use-all-warranties';

import { WARRANTY_STATUS_LABELS } from './types';
import { asSystemId } from '@/lib/id-types';
import { getColumns } from './columns';

// Dynamic imports for heavy components
const WarrantyCard = dynamic(() => import('./warranty-card').then(mod => ({ default: mod.WarrantyCard })), { ssr: false });
const KanbanColumn = dynamic(() => import('./components/warranty-kanban-column').then(mod => ({ default: mod.KanbanColumn })), { ssr: false });
const WarrantyCancelDialog = dynamic(() => import('./components/dialogs/warranty-cancel-dialog').then(mod => ({ default: mod.WarrantyCancelDialog })), { ssr: false });

// UI Components
import { Button } from '../../components/ui/button';
import { ResponsiveDataTable } from '../../components/data-table/responsive-data-table';
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from '../../components/data-table/dynamic-column-customizer';
import { PageFilters } from '../../components/layout/page-filters';
import { PageToolbar } from '../../components/layout/page-toolbar';
import { StatsBar } from '../../components/shared/stats-bar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';

// Hooks & Utils
import { usePageHeader } from '../../contexts/page-header-context';
import { useBreakpoint } from '../../contexts/breakpoint-context';
import { useAuth } from '../../contexts/auth-context';
import { useWarrantySettings } from '../settings/warranty/hooks/use-warranty-settings';
import { checkWarrantyOverdue } from './warranty-sla-utils';
import { useWarrantySLATargets } from './hooks/use-warranty-sla-targets';
import { ROUTES, generatePath } from '../../lib/router';
import { usePrint } from '../../lib/use-print';
import { useAllBranches } from '../settings/branches/hooks/use-all-branches';
import { fetchPrintData } from '@/lib/lazy-print-data';
import {
  convertWarrantyForPrint,
  mapWarrantyToPrintData,
  mapWarrantyLineItems,
  createStoreSettings
} from '../../lib/print/warranty-print-helper';
import { SimplePrintOptionsDialog, SimplePrintOptionsResult } from '../../components/shared/simple-print-options-dialog';
import { usePaginationWithGlobalDefault } from '@/features/settings/global/hooks/use-global-settings';
import { AdvancedFilterPanel, FilterExtras, type FilterConfig } from '../../components/shared/advanced-filter-panel';
import { useFilterPresets } from '../../hooks/use-filter-presets';
import { ListPageShell } from '@/components/layout/page-section';

/**
 * Trang danh sách phiếu bảo hành - Nâng cấp với VirtualizedDataTable
 * 
 * Features:
 * ✅ Virtual Scrolling: Chỉ render visible rows, mượt mà với 10K+ records
 * ✅ Search: Fuse.js với threshold 0.3
 * ✅ Filters: Status, date range
 * ✅ Bulk actions: Delete, export selected
 * ✅ Import/Export: Dialogs
 * ✅ Column customizer: Show/hide/reorder
 * ✅ Header: Auto-generated title from breadcrumb
 */

export interface WarrantyListPageProps {
  initialStats?: WarrantyStats;
}

export function WarrantyListPage({ initialStats }: WarrantyListPageProps = {}) {
  const router = useRouter();
  const { isMobile } = useBreakpoint();
  const { can } = useAuth();
  const canCreate = can('create_warranty');
  const canEdit = can('edit_warranty');
  const canDelete = can('delete_warranty');
  
  // Stats from Server Component (instant, no loading)
  const { data: stats } = useWarrantyStats(initialStats);
  
  // Server-side pagination state
  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<Set<string>>(new Set());
  const [branchFilter, setBranchFilter] = React.useState('all');
  const [dateRange, setDateRange] = React.useState<{ from?: string; to?: string } | null>(null);
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'createdAt', desc: true });
  const [pagination, setPagination] = usePaginationWithGlobalDefault();

  // Advanced filter panel
  const { presets, savePreset, deletePreset, updatePreset } = useFilterPresets('warranty');
  const { data: branches } = useAllBranches();
  const warrantyStatusOpts = React.useMemo(() => [
    { value: 'incomplete', label: 'Chưa đầy đủ' }, { value: 'pending', label: 'Chưa xử lý' },
    { value: 'processed', label: 'Đã xử lý' }, { value: 'returned', label: 'Đã trả' },
  ], []);
  const filterConfigs: FilterConfig[] = React.useMemo(() => [
    { id: 'status', label: 'Trạng thái', type: 'multi-select' as const, options: warrantyStatusOpts },
    { id: 'branch', label: 'Chi nhánh', type: 'select' as const, options: [{ value: 'all', label: 'Tất cả' }, ...branches.map(b => ({ value: b.systemId, label: b.name }))] },
    { id: 'dateRange', label: 'Ngày tạo', type: 'date-range' as const },
  ], [warrantyStatusOpts, branches]);
  const panelValues = React.useMemo(() => ({
    status: Array.from(statusFilter),
    branch: branchFilter !== 'all' ? branchFilter : null,
    dateRange: dateRange,
  }), [statusFilter, branchFilter, dateRange]);
  const handlePanelApply = React.useCallback((v: Record<string, unknown>) => {
    setStatusFilter(new Set((v.status as string[]) ?? []));
    setBranchFilter((v.branch as string) || 'all');
    setDateRange((v.dateRange as { from?: string; to?: string } | null) ?? null);
  }, []);

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset pagination on filter change
  React.useEffect(() => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }, [statusFilter, branchFilter, dateRange]);

  // Server-side query
  const statusValue = statusFilter.size === 1 ? Array.from(statusFilter)[0] : undefined;
  const { data: warrantyData, isLoading: isLoadingWarranties, isFetching: isWarrantiesFetching, isError: isWarrantyError, error: warrantyError } = useWarranties({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch || undefined,
    status: statusValue,
    branchId: branchFilter !== 'all' ? branchFilter : undefined,
    startDate: dateRange?.from || undefined,
    endDate: dateRange?.to || undefined,
    sortBy: sorting.id,
    sortOrder: sorting.desc ? 'desc' : 'asc',
  });

  // Show toast when data fetch fails
  React.useEffect(() => {
    if (isWarrantyError && warrantyError) {
      toast.error(`Lỗi tải danh sách bảo hành: ${warrantyError.message}`);
    }
  }, [isWarrantyError, warrantyError]);

  const tickets = React.useMemo(() => warrantyData?.data ?? [], [warrantyData?.data]);
  const totalRows = warrantyData?.pagination?.total ?? 0;
  const pageCount = Math.ceil(totalRows / pagination.pageSize);

  // For export/kanban: fetch all data ONLY when in kanban mode (lazy-load)
  const [viewMode, setViewMode] = React.useState<'kanban' | 'table'>('table');
  const { data: allTickets } = useAllWarranties({ enabled: viewMode === 'kanban' });

  const { remove: deleteWarrantyMutation, update: updateWarrantyMutation } = useWarrantyMutations({});
  const deleteWarrantyTicket = React.useCallback((id: string | undefined) => id && deleteWarrantyMutation.mutate(id), [deleteWarrantyMutation]);
  
  // ✅ Order business IDs now come from API include (no need to load ALL orders)

  // Load card color settings from DB via React Query
  const { data: warrantySettings } = useWarrantySettings();
  const cardColors = warrantySettings.cardColors;
  const slaTargets = useWarrantySLATargets();

  // Get row style based on overdue/status (same logic as card)
  const getRowStyle = React.useCallback((ticket: WarrantyTicket): React.CSSProperties => {
    // Check if overdue and overdue color is enabled (Priority 1)
    const overdueStatus = checkWarrantyOverdue(ticket, slaTargets);
    const isOverdue = overdueStatus.isOverdueResponse || 
                      overdueStatus.isOverdueProcessing || 
                      overdueStatus.isOverdueReturn;
    
    if (cardColors.enableOverdueColor && isOverdue) {
      const colorClass = cardColors.overdueColor;
      return parseColorClass(colorClass || '');
    }
    
    // Check status color if enabled (Priority 2)
    if (cardColors.enableStatusColors) {
      const colorClass = cardColors.statusColors[ticket.status];
      if (colorClass) {
        return parseColorClass(colorClass);
      }
    }
    
    return {};
  }, [cardColors, slaTargets]);

  // Helper function to parse Tailwind color classes to CSS
  function parseColorClass(colorClass: string): React.CSSProperties {
    if (!colorClass || typeof colorClass !== 'string') {
      return {};
    }
    
    // Extract Tailwind color from class (e.g., 'bg-yellow-50 border-yellow-200')
    const colorMap: Record<string, string> = {
      'bg-yellow-50': '#fefce8',
      'bg-blue-50': '#eff6ff',
      'bg-green-50': '#f0fdf4',
      'bg-gray-50': '#f9fafb',
      'bg-amber-50': '#fffbeb',
      'bg-orange-50': '#fff7ed',
      'bg-red-50': '#fef2f2',
      'bg-red-100': '#fee2e2',
      'bg-slate-50': '#f8fafc',
    };
    
    // Find the bg color class
    const bgClass = colorClass.split(' ').find(c => c.startsWith('bg-'));
    const hexColor = bgClass ? colorMap[bgClass] : null;
    
    if (!hexColor) return {};
    
    return {
      backgroundColor: hexColor,
    };
  }

  // Run migration on mount to ensure all tickets have 'id' field
  // Commented out - _migrate function not defined
  // React.useEffect(() => {
  //   _migrate?.();
  // }, [_migrate]);

  // ==========================================
  // State Management
  // ==========================================
  const [_columnFilters, _setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});

  // ==========================================
  // Default visible columns (20+ columns visible for sticky scrollbar)
  // ==========================================
  const defaultVisibleColumns: VisibilityState = React.useMemo(
    () => ({
      select: true,
      id: true,
      branchName: true,
      employeeName: true,
      customerName: true,
      customerPhone: true,
      customerAddress: true,
      trackingCode: true,
      shippingFee: true,
      linkedOrderId: true, // ✅ Column ID (keep as is - matches column.id from columns)
      referenceUrl: true, // ✅ Show new columns
      externalReference: true, // ✅ Show new columns
      status: true,
      slaStatus: true,
      settlementStatus: true,
      productsCount: true,
      totalProducts: true,
      totalReplaced: true,
      totalReturned: true, // ✅ Show new columns
      totalOutOfStock: true, // ✅ Hết hàng (Khấu trừ) - gộp cả deduct + out_of_stock
      totalSettlement: true, // ✅ Show new columns
      receivedImagesCount: true,
      processedImagesCount: true,
      historyCount: true, // ✅ Show new columns
      commentsCount: true, // ✅ Show new columns
      subtasksCount: true, // ✅ Show new columns
      notes: true, // ✅ Show new columns
      returnedAt: true, // ✅ Show new columns
      completedAt: true,
      createdBy: true,
      createdAt: true,
      updatedAt: true, // ✅ Show new columns
      actions: true,
    }),
    []
  );

  // ✅ DB-persisted column layout
  const [columnLayout, columnLayoutSetters] = useColumnLayout('warranty', React.useMemo(() => ({ visibility: defaultVisibleColumns as Record<string, boolean>, order: [] as string[], pinned: ['select', 'actions'] as string[] }), [defaultVisibleColumns]));
  const { visibility: columnVisibility, order: columnOrder, pinned: pinnedColumns } = columnLayout;
  const { setVisibility: setColumnVisibility, setOrder: setColumnOrder, setPinned: setPinnedColumns } = columnLayoutSetters;

  // Dialogs
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false);
  const [cancelQueue, setCancelQueue] = React.useState<WarrantyTicket[]>([]);
  const bulkCancelRef = React.useRef(false);
  const bulkCancelTicketIdsRef = React.useRef<Set<string>>(new Set());
  const bulkCancelPendingRef = React.useRef(0);
  const bulkCancelCompletedRef = React.useRef(0);
  const currentCancelTicket = cancelQueue[0] ?? null;

  // View mode: kanban or table (moved above to enable lazy-load of allTickets)

  // View mode: kanban or table (moved above to enable lazy-load of allTickets)
  // Handlers
  // ==========================================
  const handleEdit = React.useCallback(
    (ticket: WarrantyTicket) => {
      router.push(`/warranty/${ticket.systemId}/edit`);
    },
    [router]
  );

  const startCancelWorkflow = React.useCallback((ticketsToCancel: WarrantyTicket[], options?: { bulk?: boolean }) => {
    if (!ticketsToCancel || ticketsToCancel.length === 0) {
      toast.error('Không có phiếu hợp lệ để hủy');
      return;
    }

    const normalized = ticketsToCancel
      .filter((ticket): ticket is WarrantyTicket => Boolean(ticket))
      .filter((ticket, index, self) => self.findIndex((item) => item.systemId === ticket.systemId) === index)
      .filter((ticket) => ticket.status !== 'CANCELLED' && !ticket.cancelledAt);

    const skipped = ticketsToCancel.length - normalized.length;

    if (normalized.length === 0) {
      toast.info('Các phiếu đã chọn đều đã bị hủy trước đó');
      return;
    }

    if (skipped > 0) {
      toast.info(`${skipped} phiếu đã được bỏ qua vì đã hủy trước đó.`);
    }

    const isBulk = Boolean(options?.bulk);
    if (isBulk && bulkCancelPendingRef.current === 0) {
      bulkCancelCompletedRef.current = 0;
    }

    setCancelQueue(prevQueue => {
      if (prevQueue.length === 0) {
        if (isBulk) {
          normalized.forEach(ticket => bulkCancelTicketIdsRef.current.add(ticket.systemId));
          bulkCancelPendingRef.current += normalized.length;
          bulkCancelRef.current = true;
        }
        return normalized;
      }

      const existingIds = new Set(prevQueue.map(ticket => ticket.systemId));
      const additionalTickets = normalized.filter(ticket => !existingIds.has(ticket.systemId));

      if (additionalTickets.length === 0) {
        toast.info('Các phiếu đã nằm trong hàng chờ hủy');
        return prevQueue;
      }

      if (isBulk) {
        additionalTickets.forEach(ticket => bulkCancelTicketIdsRef.current.add(ticket.systemId));
        bulkCancelPendingRef.current += additionalTickets.length;
        bulkCancelRef.current = true;
      }

      return [...prevQueue, ...additionalTickets];
    });
    setCancelDialogOpen(true);
  }, []);

  // Context menu handlers
  const handleGetLink = React.useCallback((systemId: string) => {
    const ticket = tickets.find(t => t.systemId === asSystemId(systemId));
    if (!ticket) {
      toast.error('Không tìm thấy phiếu bảo hành');
      return;
    }
    const trackingPath = generatePath(ROUTES.INTERNAL.WARRANTY_TRACKING, {
      trackingCode: ticket.publicTrackingCode || ticket.id,
    });
    const trackingUrl = `${window.location.origin}${trackingPath}`;
    navigator.clipboard.writeText(trackingUrl);
    toast.success('Đã copy link tracking vào clipboard');
  }, [tickets]);

  const handleStartProcessing = React.useCallback((systemId: string) => {
    const normalizedId = asSystemId(systemId);
    const ticket = tickets.find(t => t.systemId === normalizedId);
    if (!ticket) {
      toast.error('Không tìm thấy phiếu bảo hành');
      return;
    }

    // Use React Query mutation at component level
    updateWarrantyMutation.mutate({ systemId: normalizedId, data: { status: 'PROCESSING' } });
    toast.success('Đã chuyển sang trạng thái Đang xử lý');
  }, [tickets, updateWarrantyMutation]);

  const handleMarkProcessed = React.useCallback((systemId: string) => {
    const normalizedId = asSystemId(systemId);
    const ticket = tickets.find(t => t.systemId === normalizedId);
    if (!ticket) {
      toast.error('Không tìm thấy phiếu bảo hành');
      return;
    }

    // Use React Query mutation at component level
    updateWarrantyMutation.mutate({ systemId: normalizedId, data: { status: 'COMPLETED' } });
    toast.success('Đã hoàn thành xử lý');
  }, [tickets, updateWarrantyMutation]);

  const handleMarkReturned = React.useCallback((systemId: string) => {
    router.push(`/warranty/${systemId}`); // Go to detail page to link order
  }, [router]);

  const handleCancel = React.useCallback((systemId: string) => {
    const normalizedId = asSystemId(systemId);
    const ticket = tickets.find((t) => t.systemId === normalizedId);
    if (!ticket) {
      toast.error('Không tìm thấy phiếu bảo hành');
      return;
    }
    startCancelWorkflow([ticket]);
  }, [tickets, startCancelWorkflow]);

  const handleCancelSuccess = React.useCallback((ticket: WarrantyTicket) => {
    let queueBecameEmpty = false;

    setCancelQueue(prevQueue => {
      const [, ...rest] = prevQueue;
      queueBecameEmpty = rest.length === 0;
      return rest;
    });

    if (queueBecameEmpty) {
      setCancelDialogOpen(false);
    }

    if (bulkCancelTicketIdsRef.current.has(ticket.systemId)) {
      bulkCancelTicketIdsRef.current.delete(ticket.systemId);
      bulkCancelPendingRef.current = Math.max(0, bulkCancelPendingRef.current - 1);
      bulkCancelCompletedRef.current += 1;
    }

    if (bulkCancelRef.current && bulkCancelPendingRef.current === 0) {
      const completed = bulkCancelCompletedRef.current || 0;
      toast.success(`Đã hủy ${completed} phiếu bảo hành`);
      setRowSelection({});
      bulkCancelRef.current = false;
      bulkCancelPendingRef.current = 0;
      bulkCancelCompletedRef.current = 0;
      bulkCancelTicketIdsRef.current.clear();
    }

    if (queueBecameEmpty && !bulkCancelRef.current) {
      bulkCancelTicketIdsRef.current.clear();
    }
  }, [setRowSelection]);

  const handleCancelDialogOpenChange = React.useCallback((open: boolean) => {
    setCancelDialogOpen(open);
    if (!open) {
      setCancelQueue([]);
      bulkCancelTicketIdsRef.current.clear();
      bulkCancelPendingRef.current = 0;
      bulkCancelCompletedRef.current = 0;
      bulkCancelRef.current = false;
    }
  }, []);

  // Generate columns
  const columns = React.useMemo(
    () => {
      const cols = getColumns(handleCancel, handleEdit, router.push, slaTargets);
      return cols;
    },
    [handleCancel, handleEdit, router, slaTargets]
  );

  const hasInitializedColumns = React.useRef(false);

  React.useEffect(() => {
    if (hasInitializedColumns.current) return;
    const allColumnIds = columns.map((c) => c.id).filter(Boolean) as string[];
    setColumnOrder(allColumnIds);
    hasInitializedColumns.current = true;
  }, [columns, setColumnOrder]);

  // ==========================================
  // Bulk Actions (using server-side data)
  // ==========================================
  const selectedTickets = React.useMemo(() => {
    return tickets.filter((ticket) => rowSelection[ticket.systemId]);
  }, [tickets, rowSelection]);

  const handleBulkDelete = React.useCallback(() => {
    selectedTickets.forEach((ticket) => {
      deleteWarrantyTicket(ticket.systemId);
    });
    setRowSelection({});
    setDeleteDialogOpen(false);
  }, [selectedTickets, deleteWarrantyTicket]);

  const _handleExportSelected = React.useCallback(() => {
    // Export selected rows
    const dataToExport = selectedTickets.map((ticket) => ({
      'Mã phiếu': ticket.id,
      'Khách hàng': ticket.customerName,
      'SĐT': ticket.customerPhone,
      'Địa chỉ': ticket.customerAddress,
      'Mã vận đơn': ticket.trackingCode,
      'Phí vận chuyển': ticket.shippingFee,
      'Trạng thái': WARRANTY_STATUS_LABELS[ticket.status],
      'Số SP': ticket.summary.totalProducts,
      'SP đổi mới': ticket.summary.totalReplaced,
      'SP trả lại': ticket.summary.totalReturned,
      'SP hết hàng': ticket.summary.totalOutOfStock,
      'Tiền bù trừ': ticket.summary.totalDeduction,
      'Ngày tạo': ticket.createdAt,
    }));

    const csv = [
      Object.keys(dataToExport[0]).join(','),
      ...dataToExport.map((row) => Object.values(row).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `warranty-export-${new Date().toISOString()}.csv`;
    link.click();
  }, [selectedTickets]);

  // Print imports - ⚡ OPTIMIZED: storeInfo lazy loaded
  const { printMultiple } = usePrint();
  const [isPrintDialogOpen, setIsPrintDialogOpen] = React.useState(false);
  const [pendingPrintTickets, setPendingPrintTickets] = React.useState<WarrantyTicket[]>([]);

  const handleBulkPrint = React.useCallback(() => {
    if (selectedTickets.length === 0) {
      toast.error('Vui lòng chọn ít nhất một phiếu để in');
      return;
    }
    setPendingPrintTickets(selectedTickets);
    setIsPrintDialogOpen(true);
  }, [selectedTickets]);

  const handlePrintConfirm = React.useCallback(async (options: SimplePrintOptionsResult) => {
    const { branchSystemId, paperSize } = options;
    const { storeInfo } = await fetchPrintData();
    
    const printOptionsList = pendingPrintTickets.map(ticket => {
      const branch = branchSystemId 
        ? branches.find(b => b.systemId === branchSystemId)
        : branches.find(b => b.systemId === ticket.branchSystemId);
      const storeSettings = branch 
        ? createStoreSettings(branch)
        : createStoreSettings(storeInfo);
      const ticketData = convertWarrantyForPrint(ticket, { branch });
      
      return {
        data: mapWarrantyToPrintData(ticketData, storeSettings),
        lineItems: mapWarrantyLineItems(ticketData.items),
        paperSize,
      };
    });
    
    printMultiple('warranty', printOptionsList);
    
    toast.success('Đã gửi lệnh in', {
      description: `Đang in ${pendingPrintTickets.length} phiếu bảo hành`
    });
    setRowSelection({});
    setPendingPrintTickets([]);
  }, [pendingPrintTickets, branches, printMultiple]);

  const handleBulkGetTrackingLink = React.useCallback(() => {
    if (selectedTickets.length === 0) {
      toast.error('Vui lòng chọn ít nhất một phiếu');
      return;
    }

    try {
      const trackingLinks = selectedTickets.map(ticket => {
        const publicCode = ticket.publicTrackingCode || ticket.id;
        const trackingPath = generatePath(ROUTES.INTERNAL.WARRANTY_TRACKING, { trackingCode: publicCode });
        const trackingUrl = `${window.location.origin}${trackingPath}`;
        return `${publicCode}: ${trackingUrl}`;
      });
      
      navigator.clipboard.writeText(trackingLinks.join('\n'));
      toast.success(`Đã copy ${selectedTickets.length} link tracking vào clipboard`);
    } catch (_error) {
      toast.error('Không thể copy link tracking');
    }
  }, [selectedTickets]);

  const handleBulkCancel = React.useCallback(() => {
    if (selectedTickets.length === 0) {
      toast.error('Vui lòng chọn ít nhất một phiếu');
      return;
    }
    startCancelWorkflow([...selectedTickets], { bulk: true });
  }, [selectedTickets, startCancelWorkflow]);

  // Bulk actions array
  const bulkActions = React.useMemo(() => [
    {
      label: "In",
      onSelect: handleBulkPrint
    },
    {
      label: "Get Link Tracking",
      onSelect: handleBulkGetTrackingLink
    },
    ...(canDelete ? [{
      label: "Hủy",
      onSelect: handleBulkCancel
    }] : []),
  ], [handleBulkPrint, handleBulkGetTrackingLink, handleBulkCancel, canDelete]);

  // ==========================================
  // Kanban Data (Group by status) - uses allTickets for kanban view
  // ==========================================
  const ticketsByStatus = React.useMemo(() => {
    const statuses: WarrantyStatus[] = ['RECEIVED', 'PROCESSING', 'COMPLETED', 'RETURNED', 'WAITING_PARTS'];
    return statuses.reduce((acc, status) => {
      acc[status] = allTickets.filter((ticket) => ticket.status === status && !ticket.cancelledAt); // Exclude cancelled
      return acc;
    }, {} as Record<WarrantyStatus, WarrantyTicket[]>);
  }, [allTickets]);

  // ==========================================
  // Header Actions
  // ==========================================
  const actions = React.useMemo(
    () => [
      // View toggle (RIGHT)
      <Button
        key="view-toggle"
        onClick={() => setViewMode(viewMode === 'kanban' ? 'table' : 'kanban')}
        variant="outline"
        size="sm"
      >
        {viewMode === 'kanban' ? (
          <>
            <Table className="h-4 w-4 mr-2" />
            Chế độ bảng
          </>
        ) : (
          <>
            <LayoutGrid className="h-4 w-4 mr-2" />
            Chế độ Kanban
          </>
        )}
      </Button>,
      // Create button (RIGHT)
      canCreate && <Button
        key="new"
        onClick={() => router.push('/warranty/new')}
        size="sm"
      >
        <Plus className="h-4 w-4 mr-2" />
        Tạo phiếu mới
      </Button>,
    ].filter(Boolean),
    [router, viewMode, canCreate]
  );
  usePageHeader({
    title: 'Quản lý bảo hành',
    actions,
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Quản lý bảo hành', href: '/warranty', isCurrent: true }
    ]
  });

  // ==========================================
  // Render
  // ==========================================
  return (
    <ListPageShell>
      {/* Stats Bar - instant display from Server Component */}
      <StatsBar
        className="mb-4"
        items={[
          { key: 'total', label: 'Tổng số phiếu', value: stats?.total ?? 0 },
          { key: 'pending', label: 'Đang chờ xử lý', value: stats?.pending ?? 0 },
          { key: 'processed', label: 'Chờ linh kiện', value: stats?.processed ?? 0 },
          { key: 'completed', label: 'Hoàn thành', value: stats?.completed ?? 0 },
        ]}
      />

      {/* Toolbar - Import/Export & Column Customizer */}
      {!isMobile && (
        <PageToolbar
          leftActions={
            <>
              <Button
                onClick={() => router.push('/settings/warranty')}
                variant="outline"
                size="sm"
              >
                <Settings className="h-4 w-4 mr-2" />
                Cài đặt
              </Button>
              {/* TODO: Add Import/Export dialogs with proper config */}
            </>
          }
          rightActions={
            <>
              <DataTableColumnCustomizer
                columns={columns}
                columnVisibility={columnVisibility}
                setColumnVisibility={setColumnVisibility}
                columnOrder={columnOrder}
                setColumnOrder={setColumnOrder}
                pinnedColumns={pinnedColumns}
                setPinnedColumns={setPinnedColumns}
              />
            </>
          }
        />
      )}

      {/* Filters */}
      <PageFilters
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Tìm theo mã phiếu, tên KH, SĐT, mã vận đơn..."
      >
        <AdvancedFilterPanel filters={filterConfigs} values={panelValues} onApply={handlePanelApply} presets={presets.map(p => ({ ...p, filters: p.filters }))} onSavePreset={(preset) => savePreset(preset.name, panelValues)} onDeletePreset={deletePreset} onUpdatePreset={updatePreset} />
      </PageFilters>
      <FilterExtras presets={presets} filterConfigs={filterConfigs} values={panelValues} onApply={handlePanelApply} onDeletePreset={deletePreset} />

      {/* Table - Desktop View */}
      <div className={cn('w-full py-4', isWarrantiesFetching && !isLoadingWarranties && 'opacity-70 transition-opacity')}>
        {viewMode === 'table' ? (
          <ResponsiveDataTable<WarrantyTicket>
            columns={columns}
            data={tickets}
            renderMobileCard={(ticket) => (
              <WarrantyCard
                key={ticket.systemId}
                ticket={ticket}
                onClick={() => router.push(`/warranty/${ticket.systemId}`)}
              />
            )}
            pageCount={pageCount}
            pagination={pagination}
            setPagination={setPagination}
            rowCount={totalRows}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            onBulkDelete={() => setDeleteDialogOpen(true)}
            bulkActions={bulkActions}
            allSelectedRows={selectedTickets}
            expanded={expanded}
            setExpanded={setExpanded}
            sorting={sorting}
            setSorting={setSorting}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
            columnOrder={columnOrder}
            setColumnOrder={setColumnOrder}
            pinnedColumns={pinnedColumns}
            setPinnedColumns={setPinnedColumns}
            isLoading={isLoadingWarranties}
            onRowClick={(ticket) => router.push(`/warranty/${ticket.systemId}`)}
            getRowStyle={getRowStyle}
            mobileInfiniteScroll
          />
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            <KanbanColumn
              status="RECEIVED"
              tickets={ticketsByStatus.RECEIVED}
              onTicketClick={(ticket) => router.push(`/warranty/${ticket.systemId}`)}
              cardColors={cardColors}
              onEdit={(systemId) => router.push(`/warranty/${systemId}/edit`)}
              onGetLink={handleGetLink}
              onStartProcessing={handleStartProcessing}
              onMarkProcessed={handleMarkProcessed}
              onMarkReturned={handleMarkReturned}
              onCancel={handleCancel}
              canEdit={canEdit}
              canCancel={canDelete}
            />
            <KanbanColumn
              status="PROCESSING"
              tickets={ticketsByStatus.PROCESSING}
              onTicketClick={(ticket) => router.push(`/warranty/${ticket.systemId}`)}
              cardColors={cardColors}
              onEdit={(systemId) => router.push(`/warranty/${systemId}/edit`)}
              onGetLink={handleGetLink}
              onStartProcessing={handleStartProcessing}
              onMarkProcessed={handleMarkProcessed}
              onMarkReturned={handleMarkReturned}
              onCancel={handleCancel}
              canEdit={canEdit}
              canCancel={canDelete}
            />
            <KanbanColumn
              status="COMPLETED"
              tickets={ticketsByStatus.COMPLETED}
              onTicketClick={(ticket) => router.push(`/warranty/${ticket.systemId}`)}
              cardColors={cardColors}
              onEdit={(systemId) => router.push(`/warranty/${systemId}/edit`)}
              onGetLink={handleGetLink}
              onStartProcessing={handleStartProcessing}
              onMarkProcessed={handleMarkProcessed}
              onMarkReturned={handleMarkReturned}
              onCancel={handleCancel}
              canEdit={canEdit}
              canCancel={canDelete}
            />
            <KanbanColumn
              status="RETURNED"
              tickets={ticketsByStatus.RETURNED}
              onTicketClick={(ticket) => router.push(`/warranty/${ticket.systemId}`)}
              cardColors={cardColors}
              onEdit={(systemId) => router.push(`/warranty/${systemId}/edit`)}
              onGetLink={handleGetLink}
              onStartProcessing={handleStartProcessing}
              onMarkProcessed={handleMarkProcessed}
              onMarkReturned={handleMarkReturned}
              onCancel={handleCancel}
              canEdit={canEdit}
              canCancel={canDelete}
            />
            <KanbanColumn
              status="WAITING_PARTS"
              tickets={ticketsByStatus.WAITING_PARTS}
              onTicketClick={(ticket) => router.push(`/warranty/${ticket.systemId}`)}
              cardColors={cardColors}
              onEdit={(systemId) => router.push(`/warranty/${systemId}/edit`)}
              onGetLink={handleGetLink}
              onStartProcessing={handleStartProcessing}
              onMarkProcessed={handleMarkProcessed}
              onMarkReturned={handleMarkReturned}
              onCancel={handleCancel}
              canEdit={canEdit}
              canCancel={canDelete}
            />
          </div>
        )}
      </div>

      {/* Cancel Dialog */}
      <WarrantyCancelDialog
        open={cancelDialogOpen && Boolean(currentCancelTicket)}
        onOpenChange={handleCancelDialogOpenChange}
        ticket={currentCancelTicket}
        onCancelled={handleCancelSuccess}
      />

      {/* Bulk Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa {selectedTickets.length} phiếu bảo hành đã chọn?
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} disabled={deleteWarrantyMutation.isPending}>
              {deleteWarrantyMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang xóa...</> : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Print Options Dialog */}
      <SimplePrintOptionsDialog
        open={isPrintDialogOpen}
        onOpenChange={setIsPrintDialogOpen}
        onConfirm={handlePrintConfirm}
        selectedCount={pendingPrintTickets.length}
        title="In phiếu bảo hành"
      />
    </ListPageShell>
  );
}
