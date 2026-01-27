/**
 * Hook cho page handlers của EmployeesPage
 * Tách logic từ page.tsx để giảm kích thước file
 */
import React from 'react';
import { toast } from 'sonner';
import type { Employee } from '@/lib/types/prisma-extended';
import { type SystemId } from '@/lib/id-types';
import { useEmployeeMutations, useDeletedEmployees, useTrashMutations } from './use-employees';
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
  const { data: activeEmployees } = useActiveEmployees();
  const { data: deletedEmployeesData } = useDeletedEmployees();
  const { remove } = useEmployeeMutations({
    onDeleteSuccess: () => {},
    onError: (error) => toast.error("Có lỗi: " + error.message),
  });
  const { restore: restoreMutation } = useTrashMutations();
  const [deleteState, setDeleteState] = React.useState<DeleteEmployeeState>(initialDeleteState);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = React.useState(false);

  // Calculate deleted count reactively
  const deletedCount = React.useMemo(() => 
    (deletedEmployeesData || []).length, 
    [deletedEmployeesData]
  );

  // Get deleted employees
  const deletedEmployees = React.useMemo(() => deletedEmployeesData || [], [deletedEmployeesData]);

  const handleDelete = React.useCallback((systemId: string) => {
    setDeleteState({
      isDialogOpen: true,
      idToDelete: systemId,
    });
  }, []);

  const handleDeleteDialogClose = React.useCallback(() => {
    setDeleteState(initialDeleteState);
  }, []);

  const handleRestore = React.useCallback((systemId: string) => {
    restoreMutation.mutate(systemId, {
      onSuccess: () => toast.success("Đã khôi phục nhân viên"),
      onError: () => toast.error("Có lỗi khi khôi phục nhân viên"),
    });
  }, [restoreMutation]);

  const confirmDelete = React.useCallback(() => {
    const { idToDelete } = deleteState;
    if (idToDelete) {
      const employee = activeEmployees.find(e => e.systemId === idToDelete);
      remove.mutate(idToDelete, {
        onSuccess: () => {
          toast.success("Đã xóa nhân viên vào thùng rác", {
            description: `Nhân viên ${employee?.fullName || ''} đã được chuyển vào thùng rác.`,
          });
        },
        onError: () => toast.error("Có lỗi khi xóa nhân viên"),
      });
    }
    setDeleteState(initialDeleteState);
  }, [deleteState, activeEmployees, remove]);

  const openBulkDeleteDialog = React.useCallback(() => {
    setIsBulkDeleteOpen(true);
  }, []);

  const closeBulkDeleteDialog = React.useCallback(() => {
    setIsBulkDeleteOpen(false);
  }, []);

  const confirmBulkDelete = React.useCallback((selectedIds: string[]) => {
    Promise.all(selectedIds.map(systemId => remove.mutateAsync(systemId)))
      .then(() => {
        toast.success("Đã xóa nhân viên vào thùng rác", {
          description: `Đã chuyển ${selectedIds.length} nhân viên vào thùng rác.`,
        });
      })
      .catch(() => toast.error("Có lỗi khi xóa nhân viên"));
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
  const { update } = useEmployeeMutations({
    onUpdateSuccess: () => {},
    onError: (error) => toast.error("Có lỗi: " + error.message),
  });

  const bulkActions = React.useMemo(() => [
    {
      label: "Đang làm việc",
      onSelect: (selectedRows: Employee[], clearSelection: () => void) => {
        Promise.all(selectedRows.map(emp =>
          update.mutateAsync({ systemId: emp.systemId, employmentStatus: "Đang làm việc" } as any)
        )).then(() => {
          toast.success("Đã cập nhật trạng thái", {
            description: `${selectedRows.length} nhân viên đã chuyển sang "Đang làm việc"`,
          });
          clearSelection();
        }).catch(() => toast.error("Có lỗi khi cập nhật"));
      }
    },
    {
      label: "Nghỉ việc",
      onSelect: (selectedRows: Employee[], clearSelection: () => void) => {
        Promise.all(selectedRows.map(emp =>
          update.mutateAsync({ systemId: emp.systemId, employmentStatus: "Đã nghỉ việc" } as any)
        )).then(() => {
          toast.success("Đã cập nhật trạng thái", {
            description: `${selectedRows.length} nhân viên đã chuyển sang "Đã nghỉ việc"`,
          });
          clearSelection();
        }).catch(() => toast.error("Có lỗi khi cập nhật"));
      }
    }
  ], [update]);

  return { bulkActions };
}

export function useEmployeeImportHandler() {
  const { data: activeEmployees } = useActiveEmployees();
  const { update, create } = useEmployeeMutations({
    onCreateSuccess: () => {},
    onUpdateSuccess: () => {},
    onError: () => {},
  });

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
          await update.mutateAsync({ systemId: existingEmployee.systemId, ...item } as any);
          updated++;
        } else {
          if (mode === 'update-only') {
            errors.push({ row: i + 2, message: `Không tìm thấy nhân viên với mã ${item.id}` });
            failed++;
            continue;
          }
          // Insert new - remove systemId if present
          const { systemId: _systemId, ...newEmployeeData } = item as Partial<Employee> & { systemId?: string };
          await create.mutateAsync(newEmployeeData as Omit<Employee, 'systemId'>);
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
  }, [activeEmployees, update, create]);

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
