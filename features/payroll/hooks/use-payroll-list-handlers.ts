/**
 * Payroll List Page Handlers Hook
 * Extracted to reduce list-page.tsx size
 */
import * as React from 'react';
import { toast } from 'sonner';
import { usePayrollBatchMutations } from '../hooks/use-payroll';
import { fetchPrintData } from '@/lib/lazy-print-data';
import { usePrint } from '@/lib/use-print';
import { type SystemId } from '@/lib/id-types';
import type { PayrollBatch } from '@/lib/payroll-types';
import {
  convertPayrollBatchForPrint,
  createStoreSettings,
  mapPayrollBatchToPrintData,
  mapPayrollBatchLineItems,
} from '@/lib/print/payroll-print-helper';
import type { SimplePrintOptionsResult, PaperSize } from '@/components/shared/simple-print-options-dialog';
import { usePaginationWithGlobalDefault } from '@/features/settings/global/hooks/use-global-settings';

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

/**
 * Hook for payroll page filters
 */
export function usePayrollFilters() {
  const [filters, setFilters] = React.useState<FilterValues>(defaultFilters);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = React.useState('');
  
  // Table state
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: 'createdAt', desc: true });
  const [pagination, setPagination] = usePaginationWithGlobalDefault();
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

  return {
    filters,
    setFilters,
    globalFilter,
    setGlobalFilter,
    debouncedGlobalFilter,
    rowSelection,
    setRowSelection,
    sorting,
    setSorting,
    pagination,
    setPagination,
    expanded,
    setExpanded,
    columnVisibility,
    setColumnVisibility,
    columnOrder,
    setColumnOrder,
    pinnedColumns,
    setPinnedColumns,
  };
}

/**
 * Hook for payroll batch actions
 * Cancel logic is handled entirely server-side via /api/payroll/[systemId]/cancel
 */
export function usePayrollBatchActions() {
  const { updateStatus, cancel: cancelBatch } = usePayrollBatchMutations({
    onSuccess: () => {},
    onError: (err) => toast.error('Đã xảy ra lỗi', { description: err.message }),
  });

  const handleLock = React.useCallback((systemId: string) => {
    updateStatus.mutate(
      { systemId, data: { status: 'locked' } },
      {
        onSuccess: () => {
          toast.success('Đã khóa bảng lương');
        },
      }
    );
  }, [updateStatus]);
  
  const handleUnlock = React.useCallback((systemId: string) => {
    updateStatus.mutate(
      { systemId, data: { status: 'reviewed' } },
      {
        onSuccess: () => {
          toast.success('Đã mở khóa bảng lương');
        },
      }
    );
  }, [updateStatus]);

  const handleCancel = React.useCallback((systemId: string) => {
    cancelBatch.mutate(
      { systemId, data: { reason: 'Hủy bởi quản trị viên' } },
      {
        onSuccess: (result) => {
          const paymentMsg = result.cancelledPayments
            ? ` (đã hủy ${result.cancelledPayments} phiếu thu liên quan)`
            : '';
          const penaltyMsg = result.rolledBackPenalties
            ? ` Đã khôi phục ${result.rolledBackPenalties} phiếu phạt về trạng thái chưa thanh toán.`
            : '';
          toast.success(`Đã hủy bảng lương${paymentMsg}`, {
            description: penaltyMsg || undefined,
          });
        },
      }
    );
  }, [cancelBatch]);

  const handleBulkCancel = React.useCallback((selectedBatches: PayrollBatch[]) => {
    const cancellableBatches = selectedBatches.filter(b => b.status !== 'locked' && b.status !== 'cancelled');
    if (cancellableBatches.length === 0) {
      toast.error('Không có bảng lương nào có thể hủy');
      return;
    }
    
    cancellableBatches.forEach((batch) => {
      handleCancel(batch.systemId);
    });
    
    toast.success(`Đã hủy ${cancellableBatches.length} bảng lương`, {
      description: 'Các phiếu thanh toán và phiếu phạt liên quan đã được xử lý.',
    });
  }, [handleCancel]);

  return {
    handleLock,
    handleUnlock,
    handleCancel,
    handleBulkCancel,
  };
}

/**
 * Hook for payroll print functionality
 * Data is fetched on-demand when print is confirmed (not eagerly)
 */
export function usePayrollPrint() {
  // ⚡ OPTIMIZED: storeInfo lazy loaded in handlePrintConfirm
  const { printMultiple } = usePrint();
  
  const [isPrintDialogOpen, setIsPrintDialogOpen] = React.useState(false);
  const [pendingPrintBatches, setPendingPrintBatches] = React.useState<PayrollBatch[]>([]);
  const [isPrintLoading, setIsPrintLoading] = React.useState(false);

  const handleBulkPrint = React.useCallback((selectedBatches: PayrollBatch[]) => {
    if (selectedBatches.length === 0) {
      toast.error('Vui lòng chọn bảng lương để in');
      return;
    }
    setPendingPrintBatches(selectedBatches);
    setIsPrintDialogOpen(true);
  }, []);

  const handlePrintConfirm = React.useCallback(async (options: SimplePrintOptionsResult) => {
    const { paperSize } = options;
    setIsPrintLoading(true);

    try {
      // Lazy-load all needed modules and data in parallel
      const [
        { fetchPayslips },
        { fetchAllPages },
        { fetchEmployees },
        { fetchDepartments },
      ] = await Promise.all([
        import('../api/payroll-api'),
        import('@/lib/fetch-all-pages'),
        import('@/features/employees/api/employees-api'),
        import('@/features/settings/departments/api/departments-api'),
      ]);

      // Fetch payslips for selected batches + employees + departments in parallel
      const batchIds = pendingPrintBatches.map((b) => b.systemId);
      const [payslipsByBatch, employees, departments] = await Promise.all([
        Promise.all(
          batchIds.map((batchId) =>
            fetchAllPages((p: { page?: number; limit?: number }) =>
              fetchPayslips({ ...p, batchId })
            )
          )
        ),
        fetchAllPages((p: { page?: number; limit?: number }) => fetchEmployees(p)),
        fetchAllPages((p: { page?: number; limit?: number }) => fetchDepartments(p)),
      ]);

      const employeeLookup = employees.reduce<Record<SystemId, (typeof employees)[number]>>(
        (acc, emp) => {
          acc[emp.systemId] = emp;
          return acc;
        },
        {} as Record<SystemId, (typeof employees)[number]>
      );

      const departmentLookup = departments.reduce<Record<SystemId, (typeof departments)[number]>>(
        (acc, dept) => {
          acc[dept.systemId] = dept;
          return acc;
        },
        {} as Record<SystemId, (typeof departments)[number]>
      );

      const { storeInfo } = await fetchPrintData();
      const storeSettings = createStoreSettings(storeInfo);

      const printOptionsList: Array<{
        data: ReturnType<typeof mapPayrollBatchToPrintData>;
        lineItems: ReturnType<typeof mapPayrollBatchLineItems>;
        paperSize: PaperSize;
      }> = [];

      pendingPrintBatches.forEach((batch, index) => {
        const batchPayslips = payslipsByBatch[index] || [];
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
    } catch (error) {
      toast.error('Lỗi khi tải dữ liệu in', {
        description: error instanceof Error ? error.message : 'Vui lòng thử lại',
      });
    } finally {
      setIsPrintLoading(false);
      setPendingPrintBatches([]);
    }
  }, [pendingPrintBatches, printMultiple]);

  return {
    isPrintDialogOpen,
    setIsPrintDialogOpen,
    pendingPrintBatches,
    isPrintLoading,
    handleBulkPrint,
    handlePrintConfirm,
  };
}

/**
 * Utility functions for payroll filtering
 */
export const matchesKeyword = (batch: PayrollBatch, keyword: string) => {
  if (!keyword) return true;
  const normalized = keyword.trim().toLowerCase();
  return (
    batch.id.toLowerCase().includes(normalized) ||
    batch.title.toLowerCase().includes(normalized)
  );
};

export const matchesMonthFilter = (batch: PayrollBatch, monthKey?: string) => {
  if (!monthKey) return true;
  return batch.referenceAttendanceMonthKeys.includes(monthKey);
};

export const matchesStatusFilter = (
  batch: PayrollBatch,
  status: FilterValues['status']
) => {
  if (status === 'all') return true;
  return batch.status === status;
};

export const getMonthKey = (date: Date) => 
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

export const formatMonthKey = (monthKey: string) => {
  if (!monthKey) return '—';
  const [year, month] = monthKey.split('-');
  return `Tháng ${month}/${year}`;
};
