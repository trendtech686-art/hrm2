'use client'

import * as React from "react"
import { useRouter } from 'next/navigation';
import { formatDateCustom } from '../../lib/date-utils';
import { toast } from "sonner"
import { usePageHeader } from "../../contexts/page-header-context";
import { useDeletedEmployees, useTrashMutations } from "./hooks/use-employees";
import { useAllBranches } from "@/features/settings/branches/hooks/use-all-branches";
import { getColumns } from "./trash-columns"
import { GenericTrashPage } from "../../components/shared/generic-trash-page"
import { Card, CardContent } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { getApiUrl } from "../../lib/api-config"
import type { Employee } from '@/lib/types/prisma-extended'
import type { SystemId } from '@/lib/id-types';
import { logError } from '@/lib/logger'

export function EmployeeTrashPage() {
  const { data: deletedEmployees = [], isLoading } = useDeletedEmployees();
  const { restore, permanentDelete } = useTrashMutations();
  const { data: branchesRaw } = useAllBranches();
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
      logError('Error deleting employee files', error);
      throw error;
    }
  }

  // Handlers for column actions (these will be called from column buttons)
  const handleRestoreFromColumn = React.useCallback((systemId: SystemId) => {
    restore.mutate(systemId, {
      onSuccess: () => {
        toast.success("Đã khôi phục nhân viên");
      },
      onError: () => {
        toast.error("Có lỗi khi khôi phục nhân viên");
      }
    });
  }, [restore]);

  const handleDeleteFromColumn = React.useCallback(async (systemId: SystemId) => {
    const employee = deletedEmployees.find(e => e.systemId === systemId);
    
    // Delete from database
    permanentDelete.mutate(systemId, {
      onSuccess: async () => {
        toast.success("Đã lưu trữ vĩnh viễn nhân viên", {
          description: "Thông tin cá nhân đã được xóa. Tên nhân viên vẫn hiển thị trong đơn hàng, công việc.",
        });
        
        // Try to delete files (optional, non-blocking)
        if (employee) {
          try {
            await deleteEmployeeFiles(employee);
          } catch (_fileError) {
            // Non-critical: Log error but don't show to user
          }
        }
      },
      onError: (error) => {
        toast.error(error.message || "Có lỗi khi lưu trữ nhân viên");
      }
    });
  }, [deletedEmployees, permanentDelete]);

  const columns = React.useMemo(
    () => {
      // Pass real handlers to columns for button clicks
      return getColumns(router, handleRestoreFromColumn, handleDeleteFromColumn, branches);
    },
    [router, handleRestoreFromColumn, handleDeleteFromColumn, branches]
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Custom mobile card for employees
  const renderMobileCard = (employee: Employee) => (
    <div className="rounded-xl border border-border/50 bg-card p-4">
      <div className="flex items-start gap-3">
        <Avatar className="h-11 w-11">
          {employee.avatarUrl && <AvatarImage src={employee.avatarUrl} alt={employee.fullName} />}
          <AvatarFallback>{getInitials(employee.fullName)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">{employee.fullName}</h3>
          <p className="text-xs text-muted-foreground">{employee.id}</p>
          <div className="text-xs text-muted-foreground mt-0.5">
            {typeof employee.department === 'object' ? (employee.department as { name?: string })?.name : employee.department}
            {' • '}
            {typeof employee.jobTitle === 'object' ? (employee.jobTitle as { name?: string })?.name : employee.jobTitle}
          </div>
        </div>
      </div>
      {employee.deletedAt && (
        <div className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/50">
          Xóa: {formatDateCustom(new Date(employee.deletedAt), 'dd/MM/yyyy HH:mm')}
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Đang tải...</div>;
  }

  return (
    <GenericTrashPage<Employee>
      deletedItems={deletedEmployees}
      onRestore={(systemId) => restore.mutate(systemId)}
      onPermanentDelete={async (systemId) => {
        permanentDelete.mutate(systemId);
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
