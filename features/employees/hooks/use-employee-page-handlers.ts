/**
 * Hook cho page handlers của EmployeesPage
 * Tách logic từ page.tsx để giảm kích thước file
 */
import React from 'react';
import { toast } from 'sonner';
import type { Employee } from '@/lib/types/prisma-extended';
import { asSystemId, type SystemId } from '@/lib/id-types';
import { useEmployeeStore } from '../store';
import { useActiveEmployees } from './use-all-employees';

export interface DeleteEmployeeState {
  isDialogOpen: boolean;
  idToDelete: string | null;
}

export interface BulkDeleteState {
  isDialogOpen: boolean;
}

const initialDeleteState: DeleteEmployeeState = {
  isDialogOpen: false,
  idToDelete: null,
};

export function useEmployeeDeleteWorkflow() {
  const { data: employees, remove, restore, getDeleted } = useEmployeeStore();
  const [deleteState, setDeleteState] = React.useState<DeleteEmployeeState>(initialDeleteState);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = React.useState(false);

  // Calculate deleted count reactively
  const deletedCount = React.useMemo(() => 
    employees.filter((e: { isDeleted?: boolean }) => e.isDeleted).length, 
    [employees]
  );

  // Get deleted employees - employees changes will trigger re-render which reruns getDeleted
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const deletedEmployees = React.useMemo(() => getDeleted(), [getDeleted, employees]);

  const handleDelete = React.useCallback((systemId: string) => {
    setDeleteState({
      isDialogOpen: true,
      idToDelete: systemId,
    });
  }, []);

  const handleDeleteDialogClose = React.useCallback(() => {
    setDeleteState(initialDeleteState);
  }, []);

  // ✅ Use ref to keep restore function stable
  const restoreRef = React.useRef(restore);
  restoreRef.current = restore;

  const handleRestore = React.useCallback((systemId: string) => {
    restoreRef.current(asSystemId(systemId));
    toast.success("Đã khôi phục nhân viên");
  }, []);

  const confirmDelete = React.useCallback(() => {
    const { idToDelete } = deleteState;
    if (idToDelete) {
      const employee = employees.find(e => e.systemId === idToDelete);
      remove(asSystemId(idToDelete));
      toast.success("Đã xóa nhân viên vào thùng rác", {
        description: `Nhân viên ${employee?.fullName || ''} đã được chuyển vào thùng rác.`,
      });
    }
    setDeleteState(initialDeleteState);
  }, [deleteState, employees, remove]);

  const openBulkDeleteDialog = React.useCallback(() => {
    setIsBulkDeleteOpen(true);
  }, []);

  const closeBulkDeleteDialog = React.useCallback(() => {
    setIsBulkDeleteOpen(false);
  }, []);

  const confirmBulkDelete = React.useCallback((selectedIds: string[]) => {
    selectedIds.forEach(systemId => remove(asSystemId(systemId)));
    toast.success("Đã xóa nhân viên vào thùng rác", {
      description: `Đã chuyển ${selectedIds.length} nhân viên vào thùng rác.`,
    });
    setIsBulkDeleteOpen(false);
  }, [remove]);

  return {
    deleteState,
    isBulkDeleteOpen,
    deletedCount,
    deletedEmployees,
    handleDelete,
    handleDeleteDialogClose,
    handleRestore,
    confirmDelete,
    openBulkDeleteDialog,
    closeBulkDeleteDialog,
    confirmBulkDelete,
  };
}

export function useEmployeeBulkActions() {
  const { update } = useEmployeeStore();

  const bulkActions = React.useMemo(() => [
    {
      label: "Đang làm việc",
      onSelect: (selectedRows: Employee[], clearSelection: () => void) => {
        selectedRows.forEach(emp => {
          update(emp.systemId, { ...emp, employmentStatus: "Đang làm việc" });
        });
        toast.success("Đã cập nhật trạng thái", {
          description: `${selectedRows.length} nhân viên đã chuyển sang "Đang làm việc"`,
        });
        clearSelection();
      }
    },
    {
      label: "Nghỉ việc",
      onSelect: (selectedRows: Employee[], clearSelection: () => void) => {
        selectedRows.forEach(emp => {
          update(emp.systemId, { ...emp, employmentStatus: "Đã nghỉ việc" });
        });
        toast.success("Đã cập nhật trạng thái", {
          description: `${selectedRows.length} nhân viên đã chuyển sang "Đã nghỉ việc"`,
        });
        clearSelection();
      }
    }
  ], [update]);

  return { bulkActions };
}

export function useEmployeeImportHandler() {
  const { data: activeEmployees } = useActiveEmployees();
  const { update, addMultiple } = useEmployeeStore();

  const handleImport = React.useCallback(async (
    data: Partial<Employee>[],
    mode: 'insert-only' | 'update-only' | 'upsert',
    _branchId?: string
  ) => {
    let inserted = 0;
    let updated = 0;
    let skipped = 0;
    let failed = 0;
    const errors: Array<{ row: number; message: string }> = [];

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      try {
        // Find existing by business ID (id field like NV000001)
        const existingEmployee = item.id 
          ? activeEmployees.find(e => e.id === item.id)
          : null;

        if (existingEmployee) {
          if (mode === 'insert-only') {
            skipped++;
            continue;
          }
          // Update existing
          update(existingEmployee.systemId, { ...existingEmployee, ...item } as Employee);
          updated++;
        } else {
          if (mode === 'update-only') {
            errors.push({ row: i + 2, message: `Không tìm thấy nhân viên với mã ${item.id}` });
            failed++;
            continue;
          }
          // Insert new - remove systemId if present
          const { systemId: _systemId, ...newEmployeeData } = item as Partial<Employee> & { systemId?: string };
          addMultiple([newEmployeeData as Omit<Employee, 'systemId'>]);
          inserted++;
        }
      } catch (error) {
        errors.push({ row: i + 2, message: String(error) });
        failed++;
      }
    }

    return {
      success: inserted + updated,
      failed,
      inserted,
      updated,
      skipped,
      errors,
    };
  }, [activeEmployees, update, addMultiple]);

  return { handleImport };
}

// Helper hooks for extracting values from nested objects
export function useEmployeeFieldExtractors() {
  const getDeptName = React.useCallback((dept: unknown): string | undefined => {
    if (typeof dept === 'object' && dept !== null) {
      return (dept as { name?: string }).name;
    }
    return dept as string | undefined;
  }, []);
  
  const getJobTitleName = React.useCallback((jt: unknown): string | undefined => {
    if (typeof jt === 'object' && jt !== null) {
      return (jt as { name?: string }).name;
    }
    return jt as string | undefined;
  }, []);

  return { getDeptName, getJobTitleName };
}

// Helper to build filter options
export function useEmployeeFilterOptions() {
  const { data: activeEmployees } = useActiveEmployees();
  const { getDeptName, getJobTitleName } = useEmployeeFieldExtractors();

  const departmentOptions = React.useMemo(() => {
    const departments = new Set<string>();
    activeEmployees.forEach(emp => {
      const deptName = getDeptName(emp.department);
      if (deptName) departments.add(deptName);
    });
    return Array.from(departments).sort().map(d => ({ label: d, value: d }));
  }, [activeEmployees, getDeptName]);

  const jobTitleOptions = React.useMemo(() => {
    const jobTitles = new Set<string>();
    activeEmployees.forEach(emp => {
      const jtName = getJobTitleName(emp.jobTitle);
      if (jtName) jobTitles.add(jtName);
    });
    return Array.from(jobTitles).sort().map(j => ({ label: j, value: j }));
  }, [activeEmployees, getJobTitleName]);

  const statusOptions = React.useMemo(() => [
    { label: 'Đang làm việc', value: 'Đang làm việc' },
    { label: 'Đã nghỉ việc', value: 'Đã nghỉ việc' },
    { label: 'Tạm nghỉ', value: 'Tạm nghỉ' },
  ], []);

  return { departmentOptions, jobTitleOptions, statusOptions };
}

// Combined current user for logging
export function useCurrentUser() {
  return React.useMemo(() => ({
    name: 'Admin',
    systemId: 'USR000001' as SystemId,
  }), []);
}
