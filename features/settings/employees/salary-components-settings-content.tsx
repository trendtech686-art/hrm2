'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { SimpleSettingsTable } from '@/components/settings/SimpleSettingsTable';
import type { ColumnDef } from '@/components/data-table/types';
import { SalaryComponentForm, type SalaryComponentFormValues } from './salary-component-form';
import type { SalaryComponent } from '@/lib/types/prisma-extended';
import { asBusinessId } from '@/lib/id-types';
import * as api from './api/employee-settings-api';
import { formatCurrency } from '@/lib/format-utils';

// Query key factory
const salaryComponentKeys = {
  all: ['settings', 'salary-components'] as const,
  detail: (id: string) => [...salaryComponentKeys.all, id] as const,
};

// ============================================================================
// CONSTANTS
// ============================================================================
const CATEGORY_CONFIG: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  earning: { label: 'Thu nhập', variant: 'default' },
  deduction: { label: 'Khấu trừ', variant: 'destructive' },
  contribution: { label: 'Đóng góp', variant: 'secondary' },
};

const TYPE_LABELS: Record<string, string> = {
  fixed: 'Cố định',
  formula: 'Công thức',
};

// ============================================================================
// COLUMNS DEFINITION
// ============================================================================
interface SalaryComponentColumnHandlers {
  onEdit: (item: SalaryComponent) => void;
  onDelete: (item: SalaryComponent) => void;
  onToggleTaxable: (item: SalaryComponent) => void;
  onToggleBHXH: (item: SalaryComponent) => void;
  onToggleActive: (item: SalaryComponent) => void;
  isPending: boolean;
}

function getSalaryComponentColumns(handlers: SalaryComponentColumnHandlers): ColumnDef<SalaryComponent>[] {
  return [
    {
      id: 'name',
      header: 'Tên thành phần',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.name}</div>
          {row.description && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[200px]">{row.description}</p>
          )}
          {row.type === 'fixed' && row.amount && (
            <p className="text-xs text-primary mt-0.5">{formatCurrency(row.amount)}</p>
          )}
        </div>
      ),
    },
    {
      id: 'category',
      header: 'Phân loại',
      size: 100,
      cell: ({ row }) => {
        const config = CATEGORY_CONFIG[row.category] ?? { label: row.category, variant: 'outline' as const };
        return (
          <div className="text-center">
            <Badge variant={config.variant}>{config.label}</Badge>
          </div>
        );
      },
    },
    {
      id: 'type',
      header: 'Loại',
      size: 80,
      cell: ({ row }) => (
        <div className="text-center text-sm">{TYPE_LABELS[row.type] ?? row.type}</div>
      ),
    },
    {
      id: 'taxable',
      header: 'Tính thuế',
      size: 90,
      cell: ({ row }) => (
        <div className="text-center">
          <Switch
            checked={row.taxable}
            onCheckedChange={() => handlers.onToggleTaxable(row)}
            disabled={handlers.isPending}
          />
        </div>
      ),
    },
    {
      id: 'partOfSocialInsurance',
      header: 'Tính BHXH',
      size: 90,
      cell: ({ row }) => (
        <div className="text-center">
          <Switch
            checked={row.partOfSocialInsurance}
            onCheckedChange={() => handlers.onToggleBHXH(row)}
            disabled={handlers.isPending}
          />
        </div>
      ),
    },
    {
      id: 'isActive',
      header: 'Kích hoạt',
      size: 90,
      cell: ({ row }) => (
        <div className="text-center">
          <Switch
            checked={row.isActive}
            onCheckedChange={() => handlers.onToggleActive(row)}
            disabled={handlers.isPending}
          />
        </div>
      ),
    },
    {
      id: 'actions',
      header: () => <div className="text-right">Hành động</div>,
      size: 100,
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
export function SalaryComponentsSettingsContent() {
  const queryClient = useQueryClient();
  
  // ========== DATA FETCHING ==========
  const { data: components = [], isLoading } = useQuery({
    queryKey: salaryComponentKeys.all,
    queryFn: api.fetchSalaryComponents,
    staleTime: 5 * 60 * 1000,
  });
  
  // ========== UI STATE ==========
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<SalaryComponent | null>(null);
  const [deletingItem, setDeletingItem] = React.useState<SalaryComponent | null>(null);
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = React.useState(false);
  
  // ========== MUTATIONS với optimistic updates ==========
  const createMutation = useMutation({
    mutationFn: api.createSalaryComponent,
    onSuccess: (newItem) => {
      queryClient.setQueryData<SalaryComponent[]>(salaryComponentKeys.all, (old = []) => [...old, newItem]);
      toast.success('Đã thêm thành phần lương');
      setIsFormOpen(false);
    },
    onError: (error: Error) => {
      toast.error('Lỗi khi thêm', { description: error.message });
    },
  });
  
  const updateMutation = useMutation({
    mutationFn: ({ systemId, data }: { systemId: string; data: Partial<SalaryComponent> }) =>
      api.updateSalaryComponent(systemId, data),
    onMutate: async ({ systemId, data }) => {
      await queryClient.cancelQueries({ queryKey: salaryComponentKeys.all });
      const previous = queryClient.getQueryData<SalaryComponent[]>(salaryComponentKeys.all);
      
      queryClient.setQueryData<SalaryComponent[]>(salaryComponentKeys.all, (old = []) =>
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
      if (context?.previous) {
        queryClient.setQueryData(salaryComponentKeys.all, context.previous);
      }
      toast.error('Lỗi khi cập nhật', { description: error.message });
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: api.deleteSalaryComponent,
    onMutate: async (systemId) => {
      await queryClient.cancelQueries({ queryKey: salaryComponentKeys.all });
      const previous = queryClient.getQueryData<SalaryComponent[]>(salaryComponentKeys.all);
      
      queryClient.setQueryData<SalaryComponent[]>(salaryComponentKeys.all, (old = []) =>
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
        queryClient.setQueryData(salaryComponentKeys.all, context.previous);
      }
      toast.error('Lỗi khi xóa', { description: error.message });
    },
  });
  
  // ========== HANDLERS ==========
  const handleAdd = React.useCallback(() => {
    setEditingItem(null);
    setIsFormOpen(true);
  }, []);
  
  const handleEdit = React.useCallback((item: SalaryComponent) => {
    setEditingItem(item);
    setIsFormOpen(true);
  }, []);
  
  const handleDelete = React.useCallback((item: SalaryComponent) => {
    setDeletingItem(item);
  }, []);
  
  const handleToggleTaxable = React.useCallback((item: SalaryComponent) => {
    updateMutation.mutate({
      systemId: String(item.systemId),
      data: { taxable: !item.taxable },
    });
  }, [updateMutation]);
  
  const handleToggleBHXH = React.useCallback((item: SalaryComponent) => {
    updateMutation.mutate({
      systemId: String(item.systemId),
      data: { partOfSocialInsurance: !item.partOfSocialInsurance },
    });
  }, [updateMutation]);
  
  const handleToggleActive = React.useCallback((item: SalaryComponent) => {
    updateMutation.mutate({
      systemId: String(item.systemId),
      data: { isActive: !item.isActive },
    });
  }, [updateMutation]);
  
  const handleFormSubmit = React.useCallback((values: SalaryComponentFormValues) => {
    if (editingItem) {
      updateMutation.mutate({
        systemId: String(editingItem.systemId),
        data: {
          name: values.name,
          description: values.description,
          category: values.category,
          type: values.type,
          amount: values.amount,
          formula: values.formula,
          taxable: values.taxable,
          partOfSocialInsurance: values.partOfSocialInsurance,
        },
      });
    } else {
      createMutation.mutate({
        id: asBusinessId(values.name.toUpperCase().replace(/\s+/g, '_')),
        name: values.name,
        description: values.description,
        category: values.category,
        type: values.type,
        amount: values.amount,
        formula: values.formula,
        taxable: values.taxable,
        partOfSocialInsurance: values.partOfSocialInsurance,
        isActive: true,
        sortOrder: 0,
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
  
  // ========== COLUMNS (memo) ==========
  const columns = React.useMemo(
    () =>
      getSalaryComponentColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        onToggleTaxable: handleToggleTaxable,
        onToggleBHXH: handleToggleBHXH,
        onToggleActive: handleToggleActive,
        isPending: updateMutation.isPending,
      }),
    [handleEdit, handleDelete, handleToggleTaxable, handleToggleBHXH, handleToggleActive, updateMutation.isPending]
  );
  
  // ========== RENDER ==========
  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium text-base">Danh sách các thành phần lương & phụ cấp</h4>
          <Button type="button" size="sm" onClick={handleAdd}>
            <PlusCircle className="mr-2 h-4 w-4" /> Thêm thành phần
          </Button>
        </div>
        
        <SimpleSettingsTable
          data={components}
          columns={columns}
          isLoading={isLoading}
          emptyTitle="Chưa có thành phần lương nào"
          emptyDescription="Thêm các thành phần lương để cấu hình bảng lương"
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Sửa thành phần lương' : 'Thêm thành phần lương'}</DialogTitle>
            <DialogDescription>
              {editingItem ? 'Chỉnh sửa thông tin thành phần lương.' : 'Thêm mới một thành phần lương hoặc phụ cấp.'}
            </DialogDescription>
          </DialogHeader>
          <SalaryComponentForm
            initialData={editingItem ? {
              name: editingItem.name,
              description: editingItem.description,
              category: editingItem.category,
              type: editingItem.type,
              amount: editingItem.amount,
              formula: editingItem.formula,
              taxable: editingItem.taxable,
              partOfSocialInsurance: editingItem.partOfSocialInsurance,
              isActive: editingItem.isActive,
              sortOrder: editingItem.sortOrder,
              applicableDepartmentSystemIds: editingItem.applicableDepartmentSystemIds ?? [],
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
              Bạn có chắc muốn xóa thành phần &quot;{deletingItem?.name}&quot;? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation */}
      <AlertDialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa {Object.keys(rowSelection).length} thành phần lương?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa các thành phần lương đã chọn? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmBulkDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa tất cả
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
