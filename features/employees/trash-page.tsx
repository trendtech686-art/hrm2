'use client'

import * as React from "react"
import { useRouter } from 'next/navigation';
import { formatDate, formatDateCustom, toISODate, toISODateTime } from '../../lib/date-utils';
import { toast } from "sonner"
import { usePageHeader } from "../../contexts/page-header-context";
import { useEmployeeStore } from "./store"
import { useBranchStore } from "../settings/branches/store";
import { getColumns } from "./trash-columns"
import { GenericTrashPage } from "../../components/shared/generic-trash-page"
import { Card, CardContent } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { getApiUrl } from "../../lib/api-config"
import type { Employee } from '@/lib/types/prisma-extended'
import type { SystemId } from '@/lib/id-types';

export function EmployeesTrashPage() {
  const { data, getDeleted, restore, permanentDelete } = useEmployeeStore();
  const { data: branchesRaw } = useBranchStore();
  const router = useRouter();
  
  usePageHeader({
    title: 'Thùng rác nhân viên',
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Nhân viên', href: '/employees', isCurrent: false },
      { label: 'Thùng rác', href: '', isCurrent: true },
    ],
    showBackButton: false,
    actions: [
      <Button key="back" variant="outline" size="sm" className="h-9" onClick={() => router.push('/employees')}>
        Quay lại danh sách
      </Button>,
    ],
  });
  
  const branches = React.useMemo(() => branchesRaw, [branchesRaw]);
  // React to store changes by depending on data array
  const deletedEmployees = React.useMemo(() => getDeleted(), [data]);
  
  // Helper: Delete employee files from server
  const deleteEmployeeFiles = async (employee: Employee) => {
    try {
      // ✅ CRITICAL FIX: Use systemId (immutable) instead of id (business ID, mutable)
      // Files are stored under systemId, not business ID
      const response = await fetch(getApiUrl(`/files/employee/${employee.systemId}`), {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete files');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting employee files:', error);
      throw error;
    }
  }

  // Handlers for column actions (these will be called from column buttons)
  const handleRestoreFromColumn = React.useCallback((systemId: SystemId) => {
    restore(systemId);
    toast.success("Đã khôi phục nhân viên");
  }, [restore]);

  const handleDeleteFromColumn = React.useCallback(async (systemId: SystemId) => {
    try {
      const employee = deletedEmployees.find(e => e.systemId === systemId);
      
      // Delete from store first (critical operation)
      permanentDelete(systemId);
      toast.success("Đã xóa vĩnh viễn nhân viên");
      
      // Try to delete files (optional, non-blocking)
      if (employee) {
        try {
          await deleteEmployeeFiles(employee);
          console.log('Employee files deleted successfully');
        } catch (fileError) {
          // Non-critical: Log error but don't show to user
          console.warn('Failed to delete employee files (non-critical):', fileError);
        }
      }
    } catch (error) {
      toast.error("Có lỗi khi xóa nhân viên");
      console.error(error);
    }
  }, [deletedEmployees, permanentDelete]);

  const columns = React.useMemo(
    () => {
      // Pass real handlers to columns for button clicks
      return getColumns(router, handleRestoreFromColumn, handleDeleteFromColumn, branches);
    },
    [router, handleRestoreFromColumn, handleDeleteFromColumn, branches, data] // Add data to re-create columns on store update
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Custom mobile card for employees
  const renderMobileCard = (employee: Employee) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12">
              {employee.avatarUrl && <AvatarImage src={employee.avatarUrl} alt={employee.fullName} />}
              <AvatarFallback>{getInitials(employee.fullName)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{employee.fullName}</h3>
              <p className="text-body-sm text-muted-foreground">{employee.id}</p>
              <div className="text-body-sm text-muted-foreground mt-1">
                {employee.department} • {employee.jobTitle}
              </div>
            </div>
          </div>
          {employee.deletedAt && (
            <div className="text-body-xs text-muted-foreground">
              Xóa: {formatDateCustom(new Date(employee.deletedAt), 'dd/MM/yyyy HH:mm')}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <GenericTrashPage<Employee>
      deletedItems={deletedEmployees}
      onRestore={restore}
      onPermanentDelete={async (systemId) => {
        permanentDelete(systemId);
      }}
      title="Thùng rác nhân viên"
      entityName="nhân viên"
      backUrl="/employees"
      columns={columns}
      renderMobileCard={renderMobileCard}
      deleteRelatedFiles={deleteEmployeeFiles}
      getItemDisplayName={(emp) => emp.fullName}
    />
  );
}
