/**
 * Payroll List Page Handlers Hook
 * Extracted to reduce list-page.tsx size
 */
import * as React from 'react';
import { toast } from 'sonner';
import { useAllPayrollBatches, useAllPayslips, usePayrollBatchMutations } from '../hooks/use-payroll';
import { useAllPayments } from '@/features/payments/hooks/use-all-payments';
import { usePaymentMutations } from '@/features/payments/hooks/use-payments';
import { usePenalties } from '@/features/settings/penalties/hooks/use-penalties';
import { usePenaltyMutations } from '@/features/settings/penalties/hooks/use-penalties';
import { useAllEmployees } from '@/features/employees/hooks/use-all-employees';
import { useAllDepartments } from '@/features/settings/departments/hooks/use-all-departments';
import { useStoreInfoData } from '@/features/settings/store-info/hooks/use-store-info';
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
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
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
 */
export function usePayrollBatchActions() {
  const { data: batches = [] } = useAllPayrollBatches();
  const { data: payslips = [] } = useAllPayslips();
  const { updateStatus, cancel: cancelBatch } = usePayrollBatchMutations({
    onSuccess: () => {},
    onError: (err) => toast.error('Đã xảy ra lỗi', { description: err.message }),
  });
  const { data: allPayments = [] } = useAllPayments();
  const { cancel: cancelPayment } = usePaymentMutations();
  const { data: penaltiesData } = usePenalties({});
  const penalties = React.useMemo(() => penaltiesData?.data ?? [], [penaltiesData?.data]);
  const { update: updatePenalty } = usePenaltyMutations({
    onSuccess: () => {},
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
    const batchSystemId = systemId as any;
    const batch = batches.find(b => b.systemId === batchSystemId);
    
    // Cancel related payments first
    const relatedPayments = allPayments.filter(
      (p: any) => p.linkedPayrollBatchSystemId === batchSystemId && p.status !== 'cancelled'
    );
    
    relatedPayments.forEach((payment: any) => {
      cancelPayment.mutate(
        { systemId: payment.systemId, reason: 'Hủy do bảng lương bị hủy' },
        { onSuccess: () => {} }
      );
    });
    
    // Rollback penalties
    const batchPayslipIds = batch?.payslipSystemIds || [];
    const batchPayslips = payslips.filter((p: any) => batchPayslipIds.includes(p.systemId));
    
    const penaltyIdsToRollback: any[] = [];
    batchPayslips.forEach((payslip: any) => {
      if (payslip.deductedPenaltySystemIds?.length) {
        penaltyIdsToRollback.push(...payslip.deductedPenaltySystemIds);
      }
    });
    
    const linkedPenalties = penalties.filter(
      (p: any) => p.deductedInPayrollId === batchSystemId
    );
    linkedPenalties.forEach((p: any) => {
      if (!penaltyIdsToRollback.includes(p.systemId)) {
        penaltyIdsToRollback.push(p.systemId);
      }
    });
    
    const now = new Date().toISOString();
    penaltyIdsToRollback.forEach((penaltyId: any) => {
      const penalty = penalties.find((p: any) => p.systemId === penaltyId);
      if (penalty) {
        updatePenalty.mutate({
          systemId: penalty.systemId,
          data: {
            status: 'Chưa thanh toán',
            deductedInPayrollId: undefined,
            deductedAt: undefined,
            updatedAt: now,
          },
        });
      }
    });
    
    cancelBatch.mutate(
      { systemId, data: { reason: 'Hủy bởi quản trị viên' } },
      {
        onSuccess: () => {
          const paymentMsg = relatedPayments.length > 0 
            ? ` (đã hủy ${relatedPayments.length} phiếu thu liên quan)` 
            : '';
          const penaltyMsg = penaltyIdsToRollback.length > 0
            ? ` Đã khôi phục ${penaltyIdsToRollback.length} phiếu phạt về trạng thái chưa thanh toán.`
            : '';
          toast.success(`Đã hủy bảng lương${paymentMsg}`, {
            description: penaltyMsg || undefined,
          });
        },
      }
    );
  }, [batches, payslips, allPayments, cancelPayment, cancelBatch, penalties, updatePenalty]);

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
 */
export function usePayrollPrint() {
  const { data: payslips = [] } = useAllPayslips();
  const { data: employees } = useAllEmployees();
  const { data: departments } = useAllDepartments();
  const { info: storeInfo } = useStoreInfoData();
  const { printMultiple } = usePrint();
  
  const [isPrintDialogOpen, setIsPrintDialogOpen] = React.useState(false);
  const [pendingPrintBatches, setPendingPrintBatches] = React.useState<PayrollBatch[]>([]);

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

  const handleBulkPrint = React.useCallback((selectedBatches: PayrollBatch[]) => {
    if (selectedBatches.length === 0) {
      toast.error('Vui lòng chọn bảng lương để in');
      return;
    }
    setPendingPrintBatches(selectedBatches);
    setIsPrintDialogOpen(true);
  }, []);

  const handlePrintConfirm = React.useCallback((options: SimplePrintOptionsResult) => {
    const { paperSize } = options;
    const storeSettings = createStoreSettings(storeInfo);
    
    const printOptionsList: Array<{
      data: ReturnType<typeof mapPayrollBatchToPrintData>;
      lineItems: ReturnType<typeof mapPayrollBatchLineItems>;
      paperSize: PaperSize;
    }> = [];
    
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
    
    setPendingPrintBatches([]);
  }, [pendingPrintBatches, payslips, storeInfo, employeeLookup, departmentLookup, printMultiple]);

  return {
    isPrintDialogOpen,
    setIsPrintDialogOpen,
    pendingPrintBatches,
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
