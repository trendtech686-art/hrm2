'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, LayoutGrid, Table, Settings, BarChart3, RefreshCw } from 'lucide-react';
import { useFuseFilter } from '../../hooks/use-fuse-search';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';
import {
  type ColumnFiltersState,
  type VisibilityState,
  type ColumnOrderState,
  type RowSelectionState,
} from '@tanstack/react-table';

// Types & Store
import type { WarrantyTicket, WarrantyStatus } from './types';
import { useWarrantyStore } from './store';
import { useAllOrders } from '../orders/hooks/use-all-orders';
import { WARRANTY_STATUS_LABELS } from './types';
import { asSystemId } from '@/lib/id-types';

// Column definitions & Components
import { getColumns } from './columns';
import { WarrantyCard } from './warranty-card';
import { KanbanColumn } from './components/warranty-kanban-column';
import { WarrantyReminderDialog } from './components/dialogs/warranty-reminder-dialog';
import { WarrantyCancelDialog } from './components/dialogs/warranty-cancel-dialog';
import { useWarrantyReminders } from './hooks/use-warranty-reminders';
import { useRealtimeUpdates, getWarrantyDataVersion } from './use-realtime-updates';

// UI Components
import { Button } from '../../components/ui/button';
import { ResponsiveDataTable } from '../../components/data-table/responsive-data-table';
import { DataTableFacetedFilter } from '../../components/data-table/data-table-faceted-filter';
import { DynamicDataTableColumnCustomizer as DataTableColumnCustomizer } from '../../components/data-table/dynamic-column-customizer';
import { PageFilters } from '../../components/layout/page-filters';
import { PageToolbar } from '../../components/layout/page-toolbar';
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
import { useDebounce } from '../../hooks/use-debounce';
import { loadCardColorSettings } from '../settings/warranty/warranty-settings-page';
import { checkWarrantyOverdue } from './warranty-sla-utils';
import { ROUTES, generatePath } from '../../lib/router';
import { usePrint } from '../../lib/use-print';
import { useAllBranches } from '../settings/branches/hooks/use-all-branches';
import { useStoreInfoData } from '../settings/store-info/hooks/use-store-info';
import {
  convertWarrantyForPrint,
  mapWarrantyToPrintData,
  mapWarrantyLineItems,
  createStoreSettings
} from '../../lib/print/warranty-print-helper';
import { SimplePrintOptionsDialog, SimplePrintOptionsResult } from '../../components/shared/simple-print-options-dialog';

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
export function WarrantyListPage() {
  const router = useRouter();
  const { isMobile } = useBreakpoint();
  const { data: tickets, hardDelete: deleteWarrantyTicket, _migrate } = useWarrantyStore();
  const { data: orders } = useAllOrders(); // ✅ Use React Query hook

  // Load card color settings
  const cardColors = React.useMemo(() => loadCardColorSettings(), []);

  // Get row style based on overdue/status (same logic as card)
  const getRowStyle = React.useCallback((ticket: WarrantyTicket): React.CSSProperties => {
    // Check if overdue and overdue color is enabled (Priority 1)
    const overdueStatus = checkWarrantyOverdue(ticket);
    const isOverdue = overdueStatus.isOverdueResponse || 
                      overdueStatus.isOverdueProcessing || 
                      overdueStatus.isOverdueReturn;
    
    if (cardColors.enableOverdueColor && isOverdue) {
      const colorClass = cardColors.overdueColor;
      return parseColorClass(colorClass);
    }
    
    // Check status color if enabled (Priority 2)
    if (cardColors.enableStatusColors) {
      const colorClass = cardColors.statusColors[ticket.status];
      if (colorClass) {
        return parseColorClass(colorClass);
      }
    }
    
    return {};
  }, [cardColors]);

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
  React.useEffect(() => {
    _migrate?.();
  }, [_migrate]);

  // ==========================================
  // State Management
  // ==========================================
  const [searchQuery, setSearchQuery] = React.useState('');
  // ✅ OPTIMIZATION: Use debounce hook instead of manual setTimeout
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'createdAt', desc: true });
  const [_columnFilters, _setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [statusFilter, setStatusFilter] = React.useState<Set<string>>(new Set());
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

  // Column visibility: 15+ columns for better UX
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(() => defaultVisibleColumns);
  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>(['select', 'actions']);

  // Pagination state
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });

  // Dialogs
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = React.useState(false);
  const [cancelQueue, setCancelQueue] = React.useState<WarrantyTicket[]>([]);
  const bulkCancelRef = React.useRef(false);
  const bulkCancelTicketIdsRef = React.useRef<Set<string>>(new Set());
  const bulkCancelPendingRef = React.useRef(0);
  const bulkCancelCompletedRef = React.useRef(0);
  const currentCancelTicket = cancelQueue[0] ?? null;

  // View mode: kanban or table
  const [viewMode, setViewMode] = React.useState<'kanban' | 'table'>('table');

  // Reminder system
  const {
    isReminderModalOpen,
    openReminderModal,
    closeReminderModal,
    selectedTicket,
    templates,
    sendReminder,
  } = useWarrantyReminders();

  // Real-time updates
  const [dataVersion, setDataVersion] = React.useState(() => getWarrantyDataVersion());
  const { isPolling, togglePolling, refresh: _refresh } = useRealtimeUpdates(
    dataVersion,
    () => {
      // Reload warranty data
      setDataVersion(getWarrantyDataVersion());
      // Force re-render
      window.location.reload();
    },
    30000 // 30 seconds
  );


  // ==========================================
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
      .filter((ticket) => ticket.status !== 'cancelled' && !ticket.cancelledAt);

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

    useWarrantyStore.getState().updateStatus(normalizedId, 'pending', 'Bắt đầu xử lý từ danh sách');
    toast.success('Đã chuyển sang trạng thái Chưa xử lý');
  }, [tickets]);

  const handleMarkProcessed = React.useCallback((systemId: string) => {
    const normalizedId = asSystemId(systemId);
    const ticket = tickets.find(t => t.systemId === normalizedId);
    if (!ticket) {
      toast.error('Không tìm thấy phiếu bảo hành');
      return;
    }

    useWarrantyStore.getState().updateStatus(normalizedId, 'processed', 'Hoàn thành xử lý từ danh sách');
    toast.success('Đã hoàn thành xử lý');
  }, [tickets]);

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

  const handleRemind = React.useCallback((systemId: string) => {
    const ticket = tickets.find(t => t.systemId === asSystemId(systemId));
    if (ticket) {
      openReminderModal(ticket);
    }
  }, [tickets, openReminderModal]);

  // Generate columns
  const columns = React.useMemo(
    () => {
      const cols = getColumns(handleCancel, handleEdit, router.push, orders); // ✅ Pass orders
      return cols;
    },
    [handleCancel, handleEdit, router, orders] // ✅ Add orders dependency
  );

  const hasInitializedColumns = React.useRef(false);

  React.useEffect(() => {
    if (hasInitializedColumns.current) return;
    const allColumnIds = columns.map((c) => c.id).filter(Boolean) as string[];
    setColumnOrder(allColumnIds);
    hasInitializedColumns.current = true;
  }, [columns]);

  // ==========================================
  // Search with Fuse.js (lazy loaded)
  // ==========================================
  const fuseOptions = React.useMemo(() => ({
    keys: ['id', 'customerName', 'customerPhone', 'trackingCode'],
    threshold: 0.3,
    ignoreLocation: true,
  }), []);

  const searchedData = useFuseFilter(tickets, debouncedSearch.trim(), fuseOptions);

  // ==========================================
  // Filters
  // ==========================================
  const filteredData = React.useMemo(() => {
    let result = searchedData;

    // Status filter
    if (statusFilter.size > 0) {
      result = result.filter((ticket) => statusFilter.has(ticket.status));
    }

    return result;
  }, [searchedData, statusFilter]);

  // ==========================================
  // Sorting
  // ==========================================
  const sortedData = React.useMemo(() => {
    if (!sorting || !sorting.id) return filteredData;

    const sorted = [...filteredData];

    sorted.sort((a, b) => {
      const aValue = (a as Record<string, unknown>)[sorting.id] as string | number | null;
      const bValue = (b as Record<string, unknown>)[sorting.id] as string | number | null;

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sorting.desc
          ? bValue.localeCompare(aValue)
          : aValue.localeCompare(bValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sorting.desc ? bValue - aValue : aValue - bValue;
      }

      // Date comparison
      const aDate = new Date(aValue).getTime();
      const bDate = new Date(bValue).getTime();
      return sorting.desc ? bDate - aDate : aDate - bDate;
    });

    return sorted;
  }, [filteredData, sorting]);

  // ==========================================
  // Pagination
  // ==========================================
  const pageCount = React.useMemo(() => {
    return Math.ceil(sortedData.length / pagination.pageSize);
  }, [sortedData.length, pagination.pageSize]);

  const paginatedData = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, pagination]);

  // ==========================================
  // Bulk Actions
  // ==========================================
  const selectedTickets = React.useMemo(() => {
    return sortedData.filter((ticket) => rowSelection[ticket.systemId]);
  }, [sortedData, rowSelection]);

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

  // Print imports
  const { data: branches } = useAllBranches();
  const { info: storeInfo } = useStoreInfoData();
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

  const handlePrintConfirm = React.useCallback((options: SimplePrintOptionsResult) => {
    const { branchSystemId, paperSize } = options;
    
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
  }, [pendingPrintTickets, branches, storeInfo, printMultiple]);

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
    {
      label: "Hủy",
      onSelect: handleBulkCancel
    }
  ], [handleBulkPrint, handleBulkGetTrackingLink, handleBulkCancel]);

  // ==========================================
  // Kanban Data (Group by status)
  // ==========================================
  const ticketsByStatus = React.useMemo(() => {
    const statuses: WarrantyStatus[] = ['incomplete', 'pending', 'processed', 'returned', 'completed'];
    return statuses.reduce((acc, status) => {
      acc[status] = sortedData.filter((ticket) => ticket.status === status && !ticket.cancelledAt); // Exclude cancelled
      return acc;
    }, {} as Record<WarrantyStatus, WarrantyTicket[]>);
  }, [sortedData]);

  // ==========================================
  // Header Actions
  // ==========================================
  const actions = React.useMemo(
    () => [
      // Real-time toggle (LEFT)
      <Button
        key="realtime"
        variant={isPolling ? "default" : "outline"}
        onClick={togglePolling}
        size="sm"
        className="h-9"
      >
        <RefreshCw className={cn("h-4 w-4 mr-2", isPolling && "animate-spin")} />
        {isPolling ? "Live" : "Manual"}
      </Button>,
      // Statistics (LEFT)
      <Button
        key="statistics"
        onClick={() => router.push('/warranty/statistics')}
        variant="outline"
        size="sm"
        className="h-9"
      >
        <BarChart3 className="h-4 w-4 mr-2" />
        Thống kê
      </Button>,
      // View toggle (RIGHT)
      <Button
        key="view-toggle"
        onClick={() => setViewMode(viewMode === 'kanban' ? 'table' : 'kanban')}
        variant="outline"
        size="sm"
        className="h-9"
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
      <Button
        key="new"
        onClick={() => router.push('/warranty/new')}
        size="sm"
        className="h-9"
      >
        <Plus className="h-4 w-4 mr-2" />
        Tạo phiếu mới
      </Button>,
    ],
    [router, viewMode, isPolling, togglePolling]
  );
  const _warrantyStats = React.useMemo(() => {
    return tickets.reduce(
      (acc, ticket) => {
        acc.total += 1;
        if (ticket.status === 'incomplete') acc.incomplete += 1;
        if (ticket.status === 'pending') acc.pending += 1;
        if (ticket.status === 'processed') acc.processed += 1;
        if (ticket.status === 'returned') acc.returned += 1;
        if (ticket.status === 'completed') acc.completed += 1;
        if (ticket.status === 'cancelled') acc.cancelled += 1;
        const overdue = checkWarrantyOverdue(ticket);
        if (overdue.isOverdueResponse || overdue.isOverdueProcessing || overdue.isOverdueReturn) {
          acc.overdue += 1;
        }
        return acc;
      },
      { total: 0, incomplete: 0, pending: 0, processed: 0, returned: 0, completed: 0, cancelled: 0, overdue: 0 }
    );
  }, [tickets]);

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
    <div className="flex flex-col w-full h-full">
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
        {/* Status Filter */}
        <DataTableFacetedFilter
          title="Trạng thái"
          options={[
            { label: 'Chưa đầy đủ', value: 'incomplete' },
            { label: 'Chưa xử lý', value: 'pending' },
            { label: 'Đã xử lý', value: 'processed' },
            { label: 'Đã trả', value: 'returned' },
          ]}
          selectedValues={statusFilter}
          onSelectedValuesChange={setStatusFilter}
        />

        {/* Clear filters */}
        {(searchQuery || statusFilter.size > 0) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchQuery('');
              setStatusFilter(new Set());
            }}
          >
            <X className="h-4 w-4 mr-2" />
            Xóa bộ lọc
          </Button>
        )}
      </PageFilters>

      {/* Table - Desktop View */}
      <div className="w-full py-4">
        {viewMode === 'table' ? (
          <ResponsiveDataTable<WarrantyTicket>
            columns={columns}
            data={paginatedData}
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
            rowCount={sortedData.length}
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
            onRowClick={(ticket) => router.push(`/warranty/${ticket.systemId}`)}
            getRowStyle={getRowStyle}
          />
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-4">
            <KanbanColumn
              status="incomplete"
              tickets={ticketsByStatus.incomplete}
              onTicketClick={(ticket) => router.push(`/warranty/${ticket.systemId}`)}
              cardColors={cardColors}
              onEdit={(systemId) => router.push(`/warranty/${systemId}/edit`)}
              onGetLink={handleGetLink}
              onStartProcessing={handleStartProcessing}
              onMarkProcessed={handleMarkProcessed}
              onMarkReturned={handleMarkReturned}
              onCancel={handleCancel}
              onRemind={handleRemind}
            />
            <KanbanColumn
              status="pending"
              tickets={ticketsByStatus.pending}
              onTicketClick={(ticket) => router.push(`/warranty/${ticket.systemId}`)}
              cardColors={cardColors}
              onEdit={(systemId) => router.push(`/warranty/${systemId}/edit`)}
              onGetLink={handleGetLink}
              onStartProcessing={handleStartProcessing}
              onMarkProcessed={handleMarkProcessed}
              onMarkReturned={handleMarkReturned}
              onCancel={handleCancel}
              onRemind={handleRemind}
            />
            <KanbanColumn
              status="processed"
              tickets={ticketsByStatus.processed}
              onTicketClick={(ticket) => router.push(`/warranty/${ticket.systemId}`)}
              cardColors={cardColors}
              onEdit={(systemId) => router.push(`/warranty/${systemId}/edit`)}
              onGetLink={handleGetLink}
              onStartProcessing={handleStartProcessing}
              onMarkProcessed={handleMarkProcessed}
              onMarkReturned={handleMarkReturned}
              onCancel={handleCancel}
              onRemind={handleRemind}
            />
            <KanbanColumn
              status="returned"
              tickets={ticketsByStatus.returned}
              onTicketClick={(ticket) => router.push(`/warranty/${ticket.systemId}`)}
              cardColors={cardColors}
              onEdit={(systemId) => router.push(`/warranty/${systemId}/edit`)}
              onGetLink={handleGetLink}
              onStartProcessing={handleStartProcessing}
              onMarkProcessed={handleMarkProcessed}
              onMarkReturned={handleMarkReturned}
              onCancel={handleCancel}
              onRemind={handleRemind}
            />
            <KanbanColumn
              status="completed"
              tickets={ticketsByStatus.completed}
              onTicketClick={(ticket) => router.push(`/warranty/${ticket.systemId}`)}
              cardColors={cardColors}
              onEdit={(systemId) => router.push(`/warranty/${systemId}/edit`)}
              onGetLink={handleGetLink}
              onStartProcessing={handleStartProcessing}
              onMarkProcessed={handleMarkProcessed}
              onMarkReturned={handleMarkReturned}
              onCancel={handleCancel}
              onRemind={handleRemind}
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

      {/* Reminder Dialog */}
      <WarrantyReminderDialog
        open={isReminderModalOpen}
        onOpenChange={closeReminderModal}
        ticket={selectedTicket}
        templates={templates}
        onSendReminder={sendReminder}
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
            <AlertDialogAction onClick={handleBulkDelete}>Xóa</AlertDialogAction>
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
    </div>
  );
}
