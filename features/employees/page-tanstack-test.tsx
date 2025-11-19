// TanStack Test Page - Employees
// File: features/employees/page-tanstack-test.tsx
// Route: /employees/test (temporary)

import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { TanStackDataTable } from '../../components/data-table/tanstack-data-table';
import { createEmployeeColumns } from './tanstack-columns';
import { useEmployeeStore } from './store';
import { useBranchStore } from '../settings/branches/store';
import { usePageHeader } from '../../contexts/page-header-context';
import { asSystemId } from '@/lib/id-types';
import { Button } from '../../components/ui/button';
import { PlusCircle, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
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
import type { Employee } from './types';

export function EmployeesPageTanStackTest() {
  const navigate = useNavigate();
  const { data: employees, remove, getActive } = useEmployeeStore();
  const { data: branches } = useBranchStore();

  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<string | null>(null);
  const [selectedRows, setSelectedRows] = React.useState<Employee[]>([]);

  // Get active employees only
  const activeEmployees = React.useMemo(
    () => getActive(),
    [employees]
  );

  const deletedCount = React.useMemo(
    () => employees.filter((e: any) => e.isDeleted).length,
    [employees]
  );

  // Handle delete
  const handleDelete = (systemId: string) => {
    setIdToDelete(systemId);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    if (idToDelete) {
      remove(asSystemId(idToDelete));
      toast.success('Đã xóa nhân viên');
      setIsAlertOpen(false);
      setIdToDelete(null);
    }
  };

  // Memoize columns
  const columns = React.useMemo(
    () => createEmployeeColumns(navigate, handleDelete, branches),
    [navigate, branches]
  );

  // Page header
  const headerActions = React.useMemo(
    () => [
      <Button
        key="back"
        variant="outline"
        size="sm"
        onClick={() => navigate('/employees')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Quay lại (Old Version)
      </Button>,
      <Button
        key="trash"
        variant="outline"
        size="sm"
        onClick={() => navigate('/employees/trash')}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Thùng rác ({deletedCount})
      </Button>,
      <Button
        key="add"
        size="sm"
        onClick={() => navigate('/employees/new')}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Thêm nhân viên
      </Button>,
    ],
    [navigate, deletedCount]
  );

  usePageHeader({
    actions: headerActions,
  });

  // Handle bulk actions
  const handleRowSelectionChange = React.useCallback((rows: Employee[]) => {
    setSelectedRows(rows);
    console.log('Selected:', rows.length, 'employees');
  }, []);

  return (
    <div className="space-y-4">
      {/* Test Banner */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <div className="text-blue-600">ℹ️</div>
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900">
              TanStack React Table - Test Mode
            </h4>
            <p className="text-sm text-blue-700 mt-1">
              Đây là trang test sử dụng TanStack React Table thay vì custom system.
              So sánh performance và features với trang cũ.
            </p>
            <div className="mt-2 text-xs text-blue-600">
              <strong>URL:</strong> /employees/test
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Tổng nhân viên</div>
          <div className="text-2xl font-bold">{activeEmployees.length}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Đã chọn</div>
          <div className="text-2xl font-bold text-blue-600">
            {selectedRows.length}
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Chi nhánh</div>
          <div className="text-2xl font-bold">{branches.length}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Đã xóa</div>
          <div className="text-2xl font-bold text-red-600">{deletedCount}</div>
        </div>
      </div>

      {/* TanStack DataTable */}
      <TanStackDataTable
        data={activeEmployees}
        columns={columns}
        searchable
        searchPlaceholder="Tìm kiếm nhân viên (tên, email, mã NV...)"
        pageSize={50}
        enableRowSelection
        onRowSelectionChange={handleRowSelectionChange}
      />

      {/* Bulk Actions */}
      {selectedRows.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="rounded-lg border bg-background shadow-lg p-4 flex items-center gap-4">
            <span className="text-sm font-medium">
              {selectedRows.length} nhân viên đã chọn
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  console.log('Export:', selectedRows);
                  toast.info('Xuất Excel: ' + selectedRows.length + ' nhân viên');
                }}
              >
                Xuất Excel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (
                    confirm(
                      `Xác nhận xóa ${selectedRows.length} nhân viên đã chọn?`
                    )
                  ) {
                    selectedRows.forEach(emp => remove(emp.systemId));
                    toast.success(`Đã xóa ${selectedRows.length} nhân viên`);
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Xóa tất cả
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa nhân viên này? Dữ liệu sẽ được chuyển
              vào thùng rác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
