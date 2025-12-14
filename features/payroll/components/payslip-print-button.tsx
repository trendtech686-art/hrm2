import * as React from 'react';
import { Printer } from 'lucide-react';
import { Button } from '../../../components/ui/button.tsx';
import { toast } from 'sonner';
import { usePrint } from '../../../lib/use-print.ts';
import { useStoreInfoStore } from '../../settings/store-info/store-info-store.ts';
import { usePayrollBatchStore } from '../payroll-batch-store.ts';
import { useEmployeeStore } from '../../employees/store.ts';
import { useDepartmentStore } from '../../settings/departments/store.ts';
import {
  convertPayrollBatchForPrint,
  convertPayslipForPrint,
  mapPayrollBatchToPrintData,
  mapPayrollBatchLineItems,
  mapPayslipToPrintData,
  mapPayslipComponentLineItems,
  createStoreSettings,
} from '../../../lib/print/payroll-print-helper.ts';
import type { SystemId } from '../../../lib/id-types.ts';
import type { Payslip, PayrollBatch } from '../../../lib/payroll-types.ts';

// =============================================
// TYPES
// =============================================

type PayslipPrintButtonProps = {
  payslipSystemId?: SystemId;
  /** Truyền trực tiếp payslip data (ưu tiên hơn payslipSystemId) */
  payslipData?: Payslip;
  /** Truyền trực tiếp batch data */
  batchData?: PayrollBatch;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'icon';
  className?: string;
  showText?: boolean;
};

// =============================================
// COMPONENT
// =============================================

/**
 * PayslipPrintButton - In phiếu lương cá nhân
 * 
 * Sử dụng:
 * ```tsx
 * <PayslipPrintButton payslipSystemId={payslip.systemId} />
 * <PayslipPrintButton payslipData={payslip} batchData={batch} />
 * <PayslipPrintButton payslipSystemId={payslip.systemId} variant="ghost" size="icon" />
 * ```
 */
export function PayslipPrintButton({
  payslipSystemId,
  payslipData,
  batchData,
  variant = 'outline',
  size = 'sm',
  className,
  showText = true,
}: PayslipPrintButtonProps) {
  // Stores - chỉ query nếu không có data truyền vào
  const storePayslip = usePayrollBatchStore((state) => 
    payslipSystemId ? state.payslips.find((p) => p.systemId === payslipSystemId) : undefined
  );
  const storeBatch = usePayrollBatchStore((state) => {
    const slip = payslipData || storePayslip;
    return slip ? state.batches.find((b) => b.systemId === slip.batchSystemId) : undefined;
  });
  
  // Ưu tiên data truyền vào
  const payslip = payslipData || storePayslip;
  const batch = batchData || storeBatch;
  
  const { data: employees } = useEmployeeStore();
  const { data: departments } = useDepartmentStore();
  const { info: storeInfo } = useStoreInfoStore();
  
  // Print hook
  const { print } = usePrint();

  // Lookups
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

  // Handler
  const handlePrint = React.useCallback(() => {
    if (!payslip || !batch) {
      toast.error('Không thể in', { description: 'Không tìm thấy dữ liệu phiếu lương.' });
      return;
    }

    // Get employee info
    const employee = employeeLookup[payslip.employeeSystemId];
    const departmentName = payslip.departmentSystemId
      ? departmentLookup[payslip.departmentSystemId as SystemId]?.name
      : employee?.department;

    const storeSettings = createStoreSettings(storeInfo);
    const payslipForPrint = convertPayslipForPrint(
      payslip,
      batch,
      {
        employee: employee ? {
          fullName: employee.fullName,
          id: employee.id,
          department: employee.department,
          position: employee.positionName,
        } : undefined,
        departmentName,
      }
    );

    // In phiếu lương cá nhân (template 'payslip')
    print('payslip', {
      data: mapPayslipToPrintData(payslipForPrint, storeSettings),
      lineItems: mapPayslipComponentLineItems(payslipForPrint.components),
    });

    toast.success('Đang chuẩn bị in...', { description: 'Phiếu lương sẽ được in ra.' });
  }, [payslip, batch, storeInfo, employeeLookup, departmentLookup, print]);

  if (!payslip) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handlePrint}
    >
      <Printer className={showText ? 'h-4 w-4 mr-2' : 'h-4 w-4'} />
      {showText && 'In phiếu lương'}
    </Button>
  );
}

// =============================================
// BATCH PRINT BUTTON
// =============================================

type BatchPrintButtonProps = {
  batchSystemId: SystemId;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'icon';
  className?: string;
  showText?: boolean;
};

/**
 * BatchPrintButton - In toàn bộ bảng lương
 */
export function BatchPrintButton({
  batchSystemId,
  variant = 'outline',
  size = 'sm',
  className,
  showText = true,
}: BatchPrintButtonProps) {
  // Stores
  const batch = usePayrollBatchStore((state) =>
    state.batches.find((b) => b.systemId === batchSystemId)
  );
  const payslips = usePayrollBatchStore((state) =>
    batch ? state.payslips.filter((p) => p.batchSystemId === batch.systemId) : []
  );
  const { data: employees } = useEmployeeStore();
  const { data: departments } = useDepartmentStore();
  const { info: storeInfo } = useStoreInfoStore();
  
  const { print } = usePrint();

  // Lookups
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

  // Handler
  const handlePrint = React.useCallback(() => {
    if (!batch || payslips.length === 0) {
      toast.error('Không thể in', { description: 'Không tìm thấy dữ liệu bảng lương.' });
      return;
    }

    const storeSettings = createStoreSettings(storeInfo);
    const batchForPrint = convertPayrollBatchForPrint(
      batch,
      payslips,
      {
        employeeLookup: employeeLookup as Record<SystemId, { fullName?: string; id?: string; department?: string }>,
        departmentLookup: departmentLookup as Record<SystemId, { name?: string }>,
      }
    );

    print('payroll', {
      data: mapPayrollBatchToPrintData(batchForPrint, storeSettings),
      lineItems: mapPayrollBatchLineItems(batchForPrint.payslips),
    });

    toast.success('Đang chuẩn bị in...', { description: `In ${payslips.length} phiếu lương.` });
  }, [batch, payslips, storeInfo, employeeLookup, departmentLookup, print]);

  if (!batch) {
    return null;
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handlePrint}
      disabled={payslips.length === 0}
    >
      <Printer className={showText ? 'h-4 w-4 mr-2' : 'h-4 w-4'} />
      {showText && `In bảng lương (${payslips.length})`}
    </Button>
  );
}
