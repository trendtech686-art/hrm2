'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { SimpleSettingsTable } from '@/components/settings/SimpleSettingsTable';
import type { ColumnDef } from '@/components/data-table/types';
import { LeaveTypeForm, type LeaveTypeFormValues } from './leave-type-form';
import type { LeaveType } from '@/lib/types/prisma-extended';
import { asBusinessId } from '@/lib/id-types';
import * as api from './api/employee-settings-api';

// Query key factory - chuẩn React Query
const leaveTypeKeys = {
  all: ['settings', 'leave-types'] as const,
  detail: (id: string) => [...leaveTypeKeys.all, id] as const,
};

// ============================================================================
// COLUMNS DEFINITION - Tách riêng, memo hóa
// ============================================================================
interface LeaveTypeColumnHandlers {
  onEdit: (item: LeaveType) => void;
  onDelete: (item: LeaveType) => void;
  onTogglePaid: (item: LeaveType) => void;
  onToggleAttachment: (item: LeaveType) => void;
  isPending: boolean;
}

function getLeaveTypeColumns(handlers: LeaveTypeColumnHandlers): ColumnDef<LeaveType>[] {
  return [
    {
      id: 'name',
      header: 'Tên loại phép',
      cell: ({ row }) => (
        <span className="font-medium">{row.name}</span>
      ),
    },
    {
      id: 'numberOfDays',
      header: 'Số ngày',
      size: 100,
      cell: ({ row }) => (
        <div className="text-center">{row.numberOfDays ?? '—'}</div>
      ),
    },
    {
      id: 'isPaid',
      header: 'Hưởng lương',
      size: 120,
      cell: ({ row }) => (
        <div className="text-center">
          <Switch
            checked={row.isPaid}
            onCheckedChange={() => handlers.onTogglePaid(row)}
            disabled={handlers.isPending}
          />
        </div>
      ),
    },
    {
      id: 'requiresAttachment',
      header: 'Y/C File',
      size: 100,
      cell: ({ row }) => (
        <div className="text-center">
          <Switch
            checked={row.requiresAttachment}
            onCheckedChange={() => handlers.onToggleAttachment(row)}
            disabled={handlers.isPending}
          />
        </div>
      ),
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Hành động</div>,
      size: 120,
      cell: ({ row }) => (
        <div className="text-right">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => handlers.onEdit(row)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => handlers.onDelete(row)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export function LeaveTypesSettingsContent() {
  const queryClient = useQueryClient();
  
  // ========== DATA FETCHING ==========
  const { data: leaveTypes = [], isLoading } = useQuery({
    queryKey: leaveTypeKeys.all,
    queryFn: api.fetchLeaveTypes,
    staleTime: 5 * 60 * 1000, // 5 minutes - chuẩn cho settings data
  });
  
  // ========== UI STATE ==========
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<LeaveType | null>(null);
  const [deletingItem, setDeletingItem] = React.useState<LeaveType | null>(null);
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = React.useState(false);
  
  // ========== MUTATIONS với setQueryData (không dùng invalidate) ==========
  const createMutation = useMutation({
    mutationFn: api.createLeaveType,
    onSuccess: (newItem) => {
      // Cập nhật cache trực tiếp - instant UI update
      queryClient.setQueryData<LeaveType[]>(leaveTypeKeys.all, (old = []) => [...old, newItem]);
      toast.success('Đã thêm loại nghỉ phép');
      setIsFormOpen(false);
    },
    onError: (error: Error) => {
      toast.error('Lỗi khi thêm', { description: error.message });
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<LeaveType> }) =>
      api.updateLeaveType(systemId, data),
    onMutate: async ({ systemId, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: leaveTypeKeys.all });
      
      // Snapshot previous value
      const previous = queryClient.getQueryData<LeaveType[]>(leaveTypeKeys.all);
      
      // Optimistic update
      queryClient.setQueryData<LeaveType[]>(leaveTypeKeys.all, (old = []) =>
        old.map((item) =>
          String(item.systemId) === systemId ? { ...item, ...data } : item
        )
      );
      
      return { previous };
    },
    onSuccess: () => {
      toast.success('Đã cập nhật');
      setIsFormOpen(false);
      setEditingItem(null);
    },
    onError: (error: Error, _vars, context) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(leaveTypeKeys.all, context.previous);
      }
      toast.error('Lỗi khi cập nhật', { description: error.message });
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: api.deleteLeaveType,
    onMutate: async (systemId) => {
      await queryClient.cancelQueries({ queryKey: leaveTypeKeys.all });
      const previous = queryClient.getQueryData<LeaveType[]>(leaveTypeKeys.all);
      
      // Optimistic remove
      queryClient.setQueryData<LeaveType[]>(leaveTypeKeys.all, (old = []) =>
        old.filter((item) => String(item.systemId) !== systemId)
      );
      
      return { previous };
    },
    onSuccess: () => {
      toast.success('Đã xóa');
      setDeletingItem(null);
    },
    onError: (error: Error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(leaveTypeKeys.all, context.previous);
      }
      toast.error('Lỗi khi xóa', { description: error.message });
    },
  });
  
  // ========== HANDLERS (useCallback để tránh re-render) ==========
  const handleAdd = React.useCallback(() => {
    setEditingItem(null);
    setIsFormOpen(true);
  }, []);
  
  const handleEdit = React.useCallback((item: LeaveType) => {
    setEditingItem(item);
    setIsFormOpen(true);
  }, []);
  
  const handleDelete = React.useCallback((item: LeaveType) => {
    setDeletingItem(item);
  }, []);
  
  const handleTogglePaid = React.useCallback((item: LeaveType) => {
    updateMutation.mutate({
      systemId: String(item.systemId),
      data: { isPaid: !item.isPaid },
    });
  }, [updateMutation]);
  
  const handleToggleAttachment = React.useCallback((item: LeaveType) => {
    updateMutation.mutate({
      systemId: String(item.systemId),
      data: { requiresAttachment: !item.requiresAttachment },
    });
  }, [updateMutation]);
  
  const handleFormSubmit = React.useCallback((values: LeaveTypeFormValues) => {
    if (editingItem) {
      updateMutation.mutate({
        systemId: String(editingItem.systemId),
        data: {
          name: values.name,
          numberOfDays: values.numberOfDays,
          isPaid: values.isPaid,
          requiresAttachment: values.requiresAttachment,
        },
      });
    } else {
      createMutation.mutate({
        id: asBusinessId(values.name.toUpperCase().replace(/\s+/g, '_')),
        name: values.name,
        numberOfDays: values.numberOfDays,
        isPaid: values.isPaid,
        requiresAttachment: values.requiresAttachment,
        applicableGender: 'All',
        applicableDepartmentSystemIds: [],
      });
    }
  }, [editingItem, updateMutation, createMutation]);
  
  const handleConfirmDelete = React.useCallback(() => {
    if (deletingItem) {
      deleteMutation.mutate(String(deletingItem.systemId));
    }
  }, [deletingItem, deleteMutation]);

  const handleBulkDelete = React.useCallback((selectedItems: { systemId: string }[]) => {
    if (selectedItems.length === 0) return;
    setIsBulkDeleteOpen(true);
  }, []);

  const confirmBulkDelete = React.useCallback(() => {
    const selectedIds = Object.keys(rowSelection);
    selectedIds.forEach(id => {
      deleteMutation.mutate(id);
    });
    setRowSelection({});
    setIsBulkDeleteOpen(false);
  }, [rowSelection, deleteMutation]);
  
  // ========== COLUMNS (memo để tránh re-create) ==========
  const columns = React.useMemo(
    () =>
      getLeaveTypeColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        onTogglePaid: handleTogglePaid,
        onToggleAttachment: handleToggleAttachment,
        isPending: updateMutation.isPending,
      }),
    [handleEdit, handleDelete, handleTogglePaid, handleToggleAttachment, updateMutation.isPending]
  );
  
  // ========== RENDER ==========
  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium text-base">Danh sách các loại nghỉ phép</h4>
          <Button type="button" size="sm" onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" /> Thêm loại phép
          </Button>
        </div>
        
        <SimpleSettingsTable
          data={leaveTypes}
          columns={columns}
          isLoading={isLoading}
          emptyTitle="Chưa có loại nghỉ phép nào"
          emptyDescription="Thêm loại nghỉ phép để quản lý chế độ nghỉ cho nhân viên"
          enableSelection
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          onBulkDelete={handleBulkDelete}
          enablePagination
          pagination={{ pageSize: 10, showInfo: true }}
        />
      </div>
      
      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Sửa loại nghỉ phép' : 'Thêm loại nghỉ phép'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Chỉnh sửa thông tin loại nghỉ phép.' : 'Thêm mới một loại nghỉ phép.'}
            </DialogDescription>
          </DialogHeader>
          <LeaveTypeForm
            initialData={editingItem ? {
              name: editingItem.name,
              numberOfDays: editingItem.numberOfDays,
              isPaid: editingItem.isPaid,
              requiresAttachment: editingItem.requiresAttachment,
            } : undefined}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingItem} onOpenChange={(open) => !open && setDeletingItem(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa loại nghỉ phép &quot;{deletingItem?.name}&quot;? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation */}
      <AlertDialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa {Object.keys(rowSelection).length} loại nghỉ phép?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa các loại nghỉ phép đã chọn? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmBulkDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xóa tất cả
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
