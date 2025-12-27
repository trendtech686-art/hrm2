'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ClipboardList, PlusCircle, ShieldCheck, Wallet, Printer, XCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { usePageHeader } from '../../contexts/page-header-context';
import { ROUTES } from '../../lib/router';
import { usePayrollBatchStore } from './payroll-batch-store';
import { PayrollSummaryCards, type PayrollSummaryCard } from './components/summary-cards';
import type { PayrollBatch } from '../../lib/payroll-types';
import { ResponsiveDataTable } from '../../components/data-table/responsive-data-table';
import { PageFilters } from '../../components/layout/page-filters';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { getBatchColumns } from './components/batch-columns';
import { BatchCard } from './components/batch-card';
import { useDefaultPageSize } from '../settings/global-settings-store';
import { asSystemId, type SystemId } from '@/lib/id-types';
import { toast } from 'sonner';
import { usePaymentStore } from '../payments/store';
import { usePenaltyStore } from '../settings/penalties/store';
import { usePrint } from '../../lib/use-print';
import { useEmployeeStore } from '../employees/store';
import { useDepartmentStore } from '../settings/departments/store';
import { useStoreInfoStore } from '../settings/store-info/store-info-store';
import {
  convertPayrollBatchForPrint,
  createStoreSettings,
  mapPayrollBatchToPrintData,
  mapPayrollBatchLineItems,
} from '../../lib/print/payroll-print-helper';
import { SimplePrintOptionsDialog, SimplePrintOptionsResult, PaperSize } from '../../components/shared/simple-print-options-dialog';
import { formatDateForDisplay } from '@/lib/date-utils';

type FilterValues = {
  status: 'all' | 'draft' | 'reviewed' | 'locked' | 'cancelled';
  keyword: string;
  monthKey?: string;
};

const defaultFilters: FilterValues = {
  status: 'all',
  keyword: '',
  monthKey: undefined,
};

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

const formatCurrency = (value?: number) =>
  typeof value === 'number' ? currencyFormatter.format(value) : '—';

const formatMonthKey = (monthKey: string) => {
  if (!monthKey) {
    return '—';
  }
  const [year, month] = monthKey.split('-');
  return `Tháng ${month}/${year}`;
};

const formatDate = (value: string) => {
  if (!value) {
    return '—';
  }
  return formatDateForDisplay(value);
};

const getMonthKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

const matchesKeyword = (batch: PayrollBatch, keyword: string) => {
  if (!keyword) return true;
  const normalized = keyword.trim().toLowerCase();
  return (
    batch.id.toLowerCase().includes(normalized) ||
    batch.title.toLowerCase().includes(normalized)
  );
};

const matchesMonthFilter = (batch: PayrollBatch, monthKey?: string) => {
  if (!monthKey) return true;
  return batch.referenceAttendanceMonthKeys.includes(monthKey);
};

const matchesStatusFilter = (
  batch: PayrollBatch,
  status: FilterValues['status']
) => {
  if (status === 'all') {
    return true;
  }
  return batch.status === status;
};

export function PayrollListPage() {
  const router = useRouter();
  const { batches, updateBatchStatus, payslips } = usePayrollBatchStore();
  const defaultPageSize = useDefaultPageSize();
  const { print } = usePrint();
  const { data: employees } = useEmployeeStore();
  const { data: departments } = useDepartmentStore();
  const { info: storeInfo } = useStoreInfoStore();
  
  // Filters state
  const [filters, setFilters] = React.useState<FilterValues>(defaultFilters);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = React.useState('');
  
  // Table state
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'createdAt', desc: true });
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: defaultPageSize });
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);
  
  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedGlobalFilter(globalFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [globalFilter]);
  
  // Actions for columns
  const handleLock = React.useCallback((systemId: string) => {
    updateBatchStatus(asSystemId(systemId), 'locked');
    toast.success('Đã khóa bảng lương');
  }, [updateBatchStatus]);
  
  const handleUnlock = React.useCallback((systemId: string) => {
    updateBatchStatus(asSystemId(systemId), 'reviewed');
    toast.success('Đã mở khóa bảng lương');
  }, [updateBatchStatus]);

  const cancelBatch = usePayrollBatchStore((state) => state.cancelBatch);
  const allPayments = usePaymentStore((state) => state.data);
  const cancelPayment = usePaymentStore((state) => state.cancel);
  const penaltyStore = usePenaltyStore();
  
  const handleCancel = React.useCallback((systemId: string) => {
    const batchSystemId = asSystemId(systemId);
    const batch = batches.find(b => b.systemId === batchSystemId);
    
    // Cancel related payments first
    const relatedPayments = allPayments.filter(
      (p) => p.linkedPayrollBatchSystemId === batchSystemId && p.status !== 'cancelled'
    );
    
    relatedPayments.forEach((payment) => {
      cancelPayment(payment.systemId, 'Hủy do bảng lương bị hủy');
    });
    
    // Rollback penalties linked to this batch
    // Get all payslips in this batch
    const batchPayslipIds = batch?.payslipSystemIds || [];
    const batchPayslips = payslips.filter(p => batchPayslipIds.includes(p.systemId));
    
    // Collect all penalty IDs that were deducted in this batch
    const penaltyIdsToRollback: SystemId[] = [];
    batchPayslips.forEach(payslip => {
      if (payslip.deductedPenaltySystemIds?.length) {
        penaltyIdsToRollback.push(...payslip.deductedPenaltySystemIds);
      }
    });
    
    // Also check penalties linked via deductedInPayrollId
    const linkedPenalties = penaltyStore.data.filter(
      p => p.deductedInPayrollId === batchSystemId
    );
    linkedPenalties.forEach(p => {
      if (!penaltyIdsToRollback.includes(p.systemId)) {
        penaltyIdsToRollback.push(p.systemId);
      }
    });
    
    // Rollback each penalty
    const now = new Date().toISOString();
    penaltyIdsToRollback.forEach(penaltyId => {
      const penalty = penaltyStore.data.find(p => p.systemId === penaltyId);
      if (penalty) {
        penaltyStore.update(penalty.systemId, {
          ...penalty,
          status: 'Chưa thanh toán',
          deductedInPayrollId: undefined,
          deductedAt: undefined,
          updatedAt: now,
        });
      }
    });
    
    // Then cancel the batch
    const result = cancelBatch(batchSystemId);
    if (result.success) {
      const paymentMsg = relatedPayments.length > 0 
        ? ` (đã hủy ${relatedPayments.length} phiếu thu liên quan)` 
        : '';
      const penaltyMsg = penaltyIdsToRollback.length > 0
        ? ` Đã khôi phục ${penaltyIdsToRollback.length} phiếu phạt về trạng thái chưa thanh toán.`
        : '';
      toast.success(`Đã hủy bảng lương${paymentMsg}`, {
        description: penaltyMsg || undefined,
      });
    } else {
      toast.error(result.error ?? 'Không thể hủy bảng lương');
    }
  }, [cancelBatch, batches, payslips, allPayments, cancelPayment, penaltyStore]);
  
  const columns = React.useMemo(() => getBatchColumns({
    navigate: router.push,
    onLock: handleLock,
    onUnlock: handleUnlock,
    onCancel: handleCancel,
  }), [router.push, handleLock, handleUnlock, handleCancel]);

  const filteredBatches = React.useMemo(() => {
    return batches
      .filter((batch) => matchesStatusFilter(batch, filters.status))
      .filter((batch) => matchesMonthFilter(batch, filters.monthKey))
      .filter((batch) => matchesKeyword(batch, debouncedGlobalFilter))
      .sort((a, b) => new Date(b.payrollDate).getTime() - new Date(a.payrollDate).getTime());
  }, [batches, filters, debouncedGlobalFilter]);

  const summaryCards = React.useMemo<PayrollSummaryCard[]>(() => {
    const now = new Date();
    const currentMonthKey = getMonthKey(now);
    const previousMonthKey = getMonthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1));

    const currentMonthTotal = batches
      .filter((batch) => batch.referenceAttendanceMonthKeys.includes(currentMonthKey))
      .reduce((sum, batch) => sum + batch.totalNet, 0);

    const draftCount = batches.filter((batch) => batch.status === 'draft').length;
    const reviewedCount = batches.filter((batch) => batch.status === 'reviewed').length;

    const previousMonthLocked = batches.some(
      (batch) =>
        batch.referenceAttendanceMonthKeys.includes(previousMonthKey) && batch.status === 'locked'
    );

    const cards: PayrollSummaryCard[] = [
      {
        id: 'current-month-total',
        title: 'Tổng chi phí kỳ hiện tại',
        value: formatCurrency(currentMonthTotal),
        description: `Theo ${formatMonthKey(currentMonthKey)}`,
        icon: Wallet,
      },
      {
        id: 'pending-review',
        title: 'Batch cần duyệt',
        value: draftCount,
        description: 'Đang ở trạng thái Nháp',
        icon: ClipboardList,
      },
      {
        id: 'awaiting-lock',
        title: 'Chờ khóa',
        value: reviewedCount,
        description: 'Đã duyệt, chờ khóa',
        icon: ShieldCheck,
      },
      previousMonthLocked
        ? {
            id: 'previous-month-locked',
            title: 'Kỳ trước đã khóa',
            value: 'Đã hoàn tất',
            description: formatMonthKey(previousMonthKey),
            icon: ShieldCheck,
          }
        : {
            id: 'previous-month-warning',
            title: 'Cảnh báo: chưa khóa kỳ trước',
            value: 'Chưa khóa',
            description: formatMonthKey(previousMonthKey),
            icon: AlertTriangle,
            className: 'border-amber-300 bg-amber-50 dark:bg-amber-950/40',
          },
    ];

    return cards;
  }, [batches]);

  const headerActions = React.useMemo(
    () => [
      <Button
        key="run"
        className="h-9"
        size="sm"
        onClick={() => router.push(ROUTES.PAYROLL.RUN)}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Chạy bảng lương
      </Button>,
    ],
    [router]
  );
  
  // Filter + search + sort the data
  const processedBatches = React.useMemo(() => {
    let result = batches
      .filter((batch) => matchesStatusFilter(batch, filters.status))
      .filter((batch) => matchesMonthFilter(batch, filters.monthKey));
    
    // Apply text search
    if (debouncedGlobalFilter) {
      result = result.filter((batch) => matchesKeyword(batch, debouncedGlobalFilter));
    }
    
    // Apply sorting
    if (sorting.id) {
      result = [...result].sort((a, b) => {
        const aValue = (a as any)[sorting.id];
        const bValue = (b as any)[sorting.id];
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        // Special handling for date columns
        if (sorting.id === 'createdAt' || sorting.id === 'payrollDate') {
          const aTime = aValue ? new Date(aValue).getTime() : 0;
          const bTime = bValue ? new Date(bValue).getTime() : 0;
          return sorting.desc ? bTime - aTime : aTime - bTime;
        }
        if (aValue < bValue) return sorting.desc ? 1 : -1;
        if (aValue > bValue) return sorting.desc ? -1 : 1;
        return 0;
      });
    }
    
    return result;
  }, [batches, filters.status, filters.monthKey, debouncedGlobalFilter, sorting]);
  
  // Reset pagination when filters change
  React.useEffect(() => {
    setPagination(p => ({ ...p, pageIndex: 0 }));
  }, [debouncedGlobalFilter, filters.status, filters.monthKey]);
  
  // Pagination
  const pageCount = Math.ceil(processedBatches.length / pagination.pageSize);
  const paginatedBatches = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return processedBatches.slice(start, end);
  }, [processedBatches, pagination]);
  
  const allSelectedRows = React.useMemo(() =>
    batches.filter(batch => rowSelection[batch.systemId]),
    [batches, rowSelection]
  );

  // Bulk actions
  const handleBulkCancel = React.useCallback(() => {
    const cancellableBatches = allSelectedRows.filter(b => b.status !== 'locked' && b.status !== 'cancelled');
    if (cancellableBatches.length === 0) {
      toast.error('Không có bảng lương nào có thể hủy');
      return;
    }
    
    let totalPaymentsCancelled = 0;
    let totalPenaltiesRolledBack = 0;
    const now = new Date().toISOString();
    
    cancellableBatches.forEach((batch) => {
      // Cancel related payments
      const relatedPayments = allPayments.filter(
        (p) => p.linkedPayrollBatchSystemId === batch.systemId && p.status !== 'cancelled'
      );
      relatedPayments.forEach((payment) => {
        cancelPayment(payment.systemId, 'Hủy do bảng lương bị hủy');
        totalPaymentsCancelled++;
      });
      
      // Rollback penalties linked to this batch
      const batchPayslipIds = batch.payslipSystemIds || [];
      const batchPayslips = payslips.filter(p => batchPayslipIds.includes(p.systemId));
      
      // Collect all penalty IDs that were deducted in this batch
      const penaltyIdsToRollback: SystemId[] = [];
      batchPayslips.forEach(payslip => {
        if (payslip.deductedPenaltySystemIds?.length) {
          penaltyIdsToRollback.push(...payslip.deductedPenaltySystemIds);
        }
      });
      
      // Also check penalties linked via deductedInPayrollId
      const linkedPenalties = penaltyStore.data.filter(
        p => p.deductedInPayrollId === batch.systemId
      );
      linkedPenalties.forEach(p => {
        if (!penaltyIdsToRollback.includes(p.systemId)) {
          penaltyIdsToRollback.push(p.systemId);
        }
      });
      
      // Rollback each penalty
      penaltyIdsToRollback.forEach(penaltyId => {
        const penalty = penaltyStore.data.find(p => p.systemId === penaltyId);
        if (penalty) {
          penaltyStore.update(penalty.systemId, {
            ...penalty,
            status: 'Chưa thanh toán',
            deductedInPayrollId: undefined,
            deductedAt: undefined,
            updatedAt: now,
          });
          totalPenaltiesRolledBack++;
        }
      });
      
      cancelBatch(batch.systemId);
    });
    
    const paymentMsg = totalPaymentsCancelled > 0 ? ` (đã hủy ${totalPaymentsCancelled} phiếu thu liên quan)` : '';
    const penaltyMsg = totalPenaltiesRolledBack > 0 ? ` Đã khôi phục ${totalPenaltiesRolledBack} phiếu phạt.` : '';
    toast.success(`Đã hủy ${cancellableBatches.length} bảng lương${paymentMsg}`, {
      description: penaltyMsg || undefined,
    });
    setRowSelection({});
  }, [allSelectedRows, allPayments, payslips, cancelBatch, cancelPayment, penaltyStore]);

  // Lookups for printing
  const employeeLookup = React.useMemo(() => {
    return employees.reduce<Record<SystemId, (typeof employees)[number]>>(
      (acc, emp) => {
        acc[emp.systemId] = emp;
        return acc;
      },
      {} as Record<SystemId, (typeof employees)[number]>
    );
  }, [employees]);

  const departmentLookup = React.useMemo(() => {
    return departments.reduce<Record<SystemId, (typeof departments)[number]>>(
      (acc, dept) => {
        acc[dept.systemId] = dept;
        return acc;
      },
      {} as Record<SystemId, (typeof departments)[number]>
    );
  }, [departments]);

  // Print dialog state
  const [isPrintDialogOpen, setIsPrintDialogOpen] = React.useState(false);
  const [pendingPrintBatches, setPendingPrintBatches] = React.useState<PayrollBatch[]>([]);
  const { printMultiple } = usePrint();

  const handleBulkPrint = React.useCallback(() => {
    if (allSelectedRows.length === 0) {
      toast.error('Vui lòng chọn bảng lương để in');
      return;
    }
    setPendingPrintBatches(allSelectedRows);
    setIsPrintDialogOpen(true);
  }, [allSelectedRows]);

  // Handle print confirm from dialog
  const handlePrintConfirm = React.useCallback((options: SimplePrintOptionsResult) => {
    const { paperSize } = options;
    const storeSettings = createStoreSettings(storeInfo);
    
    const printOptionsList: Array<{
      data: ReturnType<typeof mapPayrollBatchToPrintData>;
      lineItems: ReturnType<typeof mapPayrollBatchLineItems>;
      paperSize: PaperSize;
    }> = [];
    
    // Prepare print data for each batch
    pendingPrintBatches.forEach((batch) => {
      const batchPayslips = payslips.filter((p) => p.batchSystemId === batch.systemId);
      if (batchPayslips.length === 0) return;
      
      const batchForPrint = convertPayrollBatchForPrint(
        batch,
        batchPayslips,
        {
          employeeLookup: employeeLookup as Record<SystemId, { fullName?: string; id?: string; department?: string }>,
          departmentLookup: departmentLookup as Record<SystemId, { name?: string }>,
        }
      );

      printOptionsList.push({
        data: mapPayrollBatchToPrintData(batchForPrint, storeSettings),
        lineItems: mapPayrollBatchLineItems(batchForPrint.payslips),
        paperSize,
      });
    });
    
    if (printOptionsList.length > 0) {
      printMultiple('payroll', printOptionsList);
      toast.success(`Đã gửi lệnh in ${printOptionsList.length} bảng lương`);
    }
    
    setRowSelection({});
    setPendingPrintBatches([]);
  }, [pendingPrintBatches, payslips, storeInfo, employeeLookup, departmentLookup, printMultiple]);

  const bulkActions = React.useMemo(() => [
    {
      label: 'In bảng lương',
      icon: Printer,
      onSelect: handleBulkPrint,
    },
    {
      label: 'Hủy bảng lương',
      icon: XCircle,
      onSelect: handleBulkCancel,
      variant: 'destructive' as const,
    },
  ], [handleBulkPrint, handleBulkCancel]);
  
  // Generate month options for filter
  const monthOptions = React.useMemo(() => {
    const months = new Set<string>();
    batches.forEach(batch => {
      batch.referenceAttendanceMonthKeys.forEach(mk => months.add(mk));
    });
    return Array.from(months).sort().reverse();
  }, [batches]);
  
  const handleRowClick = (row: PayrollBatch) => {
    router.push(ROUTES.PAYROLL.DETAIL.replace(':systemId', row.systemId));
  };

  usePageHeader({
    title: 'Danh sách bảng lương',
    subtitle: 'Theo dõi trạng thái batch, khóa kỳ trước và điều phối chạy lương mỗi tháng',
    breadcrumb: [
      { label: 'Trang chủ', href: ROUTES.DASHBOARD },
      { label: 'Bảng lương', href: ROUTES.PAYROLL.LIST },
    ],
    showBackButton: false,
    actions: headerActions,
  });

  return (
    <div className="flex flex-col w-full h-full">
      {/* Summary Cards */}
      <PayrollSummaryCards items={summaryCards} />
      
      {/* Filters */}
      <PageFilters
        searchValue={globalFilter}
        onSearchChange={setGlobalFilter}
        searchPlaceholder="Tìm kiếm bảng lương (mã, tiêu đề)..."
      >
        {/* Status Filter */}
        <Select
          value={filters.status}
          onValueChange={(value) => setFilters(f => ({ ...f, status: value as FilterValues['status'] }))}
        >
          <SelectTrigger className="w-full sm:w-[160px] h-9">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="draft">Nháp</SelectItem>
            <SelectItem value="reviewed">Đã duyệt</SelectItem>
            <SelectItem value="locked">Đã khóa</SelectItem>
            <SelectItem value="cancelled">Đã hủy</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Month Filter */}
        <Select
          value={filters.monthKey ?? 'all'}
          onValueChange={(value) => setFilters(f => ({ ...f, monthKey: value === 'all' ? undefined : value }))}
        >
          <SelectTrigger className="w-full sm:w-[160px] h-9">
            <SelectValue placeholder="Tháng tham chiếu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả tháng</SelectItem>
            {monthOptions.map(mk => (
              <SelectItem key={mk} value={mk}>
                {formatMonthKey(mk)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PageFilters>

      {/* Data Table */}
      <div className="w-full py-4">
        <ResponsiveDataTable
          columns={columns}
          data={paginatedBatches}
          renderMobileCard={(batch) => (
            <BatchCard
              batch={batch}
              actions={{
                onLock: handleLock,
                onUnlock: handleUnlock,
                onCancel: handleCancel,
              }}
            />
          )}
          pageCount={pageCount}
          pagination={pagination}
          setPagination={setPagination}
          rowCount={processedBatches.length}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          allSelectedRows={allSelectedRows}
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
          bulkActions={bulkActions}
          emptyTitle="Chưa có bảng lương nào"
          emptyDescription="Bắt đầu chạy bảng lương để tạo batch mới"
        />
      </div>

      {/* Print Options Dialog */}
      <SimplePrintOptionsDialog
        open={isPrintDialogOpen}
        onOpenChange={setIsPrintDialogOpen}
        onConfirm={handlePrintConfirm}
        selectedCount={pendingPrintBatches.length}
        title="In bảng lương"
      />
    </div>
  );
}
