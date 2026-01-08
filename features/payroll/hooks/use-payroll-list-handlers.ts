/**
 * Payroll List Page Handlers Hook
 * Extracted to reduce list-page.tsx size
 */
import * as React from 'react';
import { toast } from 'sonner';
import { usePayrollBatchStore } from '../payroll-batch-store';
import { usePaymentStore } from '@/features/payments/store';
import { usePenaltyStore } from '@/features/settings/penalties/store';
import { useAllEmployees } from '@/features/employees/hooks/use-all-employees';
import { useAllDepartments } from '@/features/settings/departments/hooks/use-all-departments';
import { useStoreInfoData } from '@/features/settings/store-info/hooks/use-store-info';
import { usePrint } from '@/lib/use-print';
import { asSystemId, type SystemId } from '@/lib/id-types';
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
  const { updateBatchStatus, batches, payslips, cancelBatch } = usePayrollBatchStore();
  const allPayments = usePaymentStore((state) => state.data);
  const cancelPayment = usePaymentStore((state) => state.cancel);
  const penaltyStore = usePenaltyStore();

  const handleLock = React.useCallback((systemId: string) => {
    updateBatchStatus(asSystemId(systemId), 'locked');
    toast.success('Đã khóa bảng lương');
  }, [updateBatchStatus]);
  
  const handleUnlock = React.useCallback((systemId: string) => {
    updateBatchStatus(asSystemId(systemId), 'reviewed');
    toast.success('Đã mở khóa bảng lương');
  }, [updateBatchStatus]);

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
    
    // Rollback penalties
    const batchPayslipIds = batch?.payslipSystemIds || [];
    const batchPayslips = payslips.filter(p => batchPayslipIds.includes(p.systemId));
    
    const penaltyIdsToRollback: SystemId[] = [];
    batchPayslips.forEach(payslip => {
      if (payslip.deductedPenaltySystemIds?.length) {
        penaltyIdsToRollback.push(...payslip.deductedPenaltySystemIds);
      }
    });
    
    const linkedPenalties = penaltyStore.data.filter(
      p => p.deductedInPayrollId === batchSystemId
    );
    linkedPenalties.forEach(p => {
      if (!penaltyIdsToRollback.includes(p.systemId)) {
        penaltyIdsToRollback.push(p.systemId);
      }
    });
    
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
  }, [batches, payslips, allPayments, cancelPayment, cancelBatch, penaltyStore]);

  const handleBulkCancel = React.useCallback((selectedBatches: PayrollBatch[]) => {
    const cancellableBatches = selectedBatches.filter(b => b.status !== 'locked' && b.status !== 'cancelled');
    if (cancellableBatches.length === 0) {
      toast.error('Không có bảng lương nào có thể hủy');
      return;
    }
    
    let totalPaymentsCancelled = 0;
    let totalPenaltiesRolledBack = 0;
    const now = new Date().toISOString();
    
    cancellableBatches.forEach((batch) => {
      const relatedPayments = allPayments.filter(
        (p) => p.linkedPayrollBatchSystemId === batch.systemId && p.status !== 'cancelled'
      );
      relatedPayments.forEach((payment) => {
        cancelPayment(payment.systemId, 'Hủy do bảng lương bị hủy');
        totalPaymentsCancelled++;
      });
      
      const batchPayslipIds = batch.payslipSystemIds || [];
      const batchPayslips = payslips.filter(p => batchPayslipIds.includes(p.systemId));
      
      const penaltyIdsToRollback: SystemId[] = [];
      batchPayslips.forEach(payslip => {
        if (payslip.deductedPenaltySystemIds?.length) {
          penaltyIdsToRollback.push(...payslip.deductedPenaltySystemIds);
        }
      });
      
      const linkedPenalties = penaltyStore.data.filter(
        p => p.deductedInPayrollId === batch.systemId
      );
      linkedPenalties.forEach(p => {
        if (!penaltyIdsToRollback.includes(p.systemId)) {
          penaltyIdsToRollback.push(p.systemId);
        }
      });
      
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
  }, [allPayments, payslips, cancelBatch, cancelPayment, penaltyStore]);

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
  const { payslips } = usePayrollBatchStore();
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
