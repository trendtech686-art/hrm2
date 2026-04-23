import * as React from "react";
import { Plus, Loader2 } from "lucide-react";
import { asBusinessId, type SystemId } from "@/lib/id-types";
import { usePaymentTypes, usePaymentTypeMutations } from "./hooks/use-payment-types";
import type { PaymentType } from '@/lib/types/prisma-extended';
import { PaymentTypeForm, type PaymentTypeFormValues } from "./form";
import { Button } from "../../../../components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../../components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../../../components/ui/alert-dialog";
import { SimpleSettingsTable } from "../../../../components/settings/SimpleSettingsTable";
import { getPaymentTypeColumns } from "./columns";
import { toast } from "sonner";
import { SettingsActionButton } from "../../../../components/settings/SettingsActionButton";
import type { RegisterTabActions } from "../../use-tab-action-registry";

type PaymentTypesPageContentProps = {
  isActive: boolean;
  onRegisterActions: RegisterTabActions;
};

export function PaymentTypesPageContent({ isActive, onRegisterActions }: PaymentTypesPageContentProps) {
  const { data: queryData } = usePaymentTypes({});
  const data = React.useMemo(() => queryData?.data ?? [], [queryData?.data]);
  const { create, update, remove } = usePaymentTypeMutations({
    onSuccess: () => toast.success("Thao tác thành công"),
    onError: (err) => toast.error(err.message)
  });
  
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<PaymentType | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = React.useState(false);

  const handleAddNew = React.useCallback(() => {
    setEditingItem(null);
    setIsFormOpen(true);
  }, []);

  const handleEdit = React.useCallback((item: PaymentType) => { 
    setEditingItem(item); 
    setIsFormOpen(true); 
  }, []);

  const handleDeleteRequest = React.useCallback((systemId: SystemId) => { 
    setIdToDelete(systemId);
    setIsAlertOpen(true);
  }, []);
  
  const handleToggleDefault = React.useCallback((item: PaymentType, isDefault: boolean) => {
    if (isDefault) {
      // Backend sẽ tự động tắt mặc định của các loại khác
      update.mutate({ systemId: item.systemId, data: { isDefault: true } });
    } else {
      // Không cho phép tắt mặc định nếu chỉ còn 1 item
      const activeItems = data.filter(d => d.isActive);
      if (activeItems.length <= 1) {
        toast.error("Phải có ít nhất một loại phiếu chi mặc định");
        return;
      }
      // Chuyển mặc định sang item active khác
      const other = activeItems.find(d => d.systemId !== item.systemId);
      if (other) {
        update.mutate({ systemId: other.systemId, data: { isDefault: true } });
      }
    }
  }, [data, update]);

  const handleToggleStatus = React.useCallback((item: PaymentType, isActive: boolean) => {
    update.mutate({ systemId: item.systemId, data: { ...item, isActive } });
  }, [update]);

  const handleToggleBusinessResult = React.useCallback((item: PaymentType, isBusinessResult: boolean) => {
    update.mutate({ systemId: item.systemId, data: { ...item, isBusinessResult } });
  }, [update]);
  
  const confirmDelete = () => {
    if (idToDelete) {
      const item = data.find(d => d.systemId === idToDelete);
      remove.mutate(idToDelete);
    }
    setIsAlertOpen(false);
    setIdToDelete(null);
  };

  const handleBulkDelete = React.useCallback((selectedItems: { systemId: string }[]) => {
    if (selectedItems.length === 0) return;
    setIsBulkDeleteOpen(true);
  }, []);

  const confirmBulkDelete = () => {
    const selectedIds = Object.keys(rowSelection);
    selectedIds.forEach(id => {
      remove.mutate(id as SystemId);
    });
    setRowSelection({});
    setIsBulkDeleteOpen(false);
  };
  
  const handleFormSubmit = (values: PaymentTypeFormValues) => {
    try {
      const now = new Date().toISOString();
      const normalized = {
        id: asBusinessId(values.id.trim().toUpperCase()),
        name: values.name.trim(),
        description: values.description?.trim() || undefined,
        isBusinessResult: values.isBusinessResult,
        isActive: values.isActive,
      } satisfies Omit<PaymentType, 'systemId' | 'createdAt' | 'color'>;

      if (editingItem) {
        update.mutate({
          systemId: editingItem.systemId,
          data: {
            ...editingItem,
            ...normalized,
          }
        });
      } else {
        create.mutate({
          ...normalized,
          createdAt: now,
        });
      }
      setIsFormOpen(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra", {
        description: error instanceof Error ? error.message : "Lỗi không xác định",
      });
    }
  };

  // Register header actions - use ref to avoid stale closures
  const handleAddNewRef = React.useRef(handleAddNew);
  handleAddNewRef.current = handleAddNew;
  
  React.useLayoutEffect(() => {
    if (!isActive) return;
    onRegisterActions([
      <SettingsActionButton key="add-payment-type" onClick={() => handleAddNewRef.current()}>
        <Plus className="mr-2 h-4 w-4" /> Thêm loại phiếu chi
      </SettingsActionButton>,
    ]);
  }, [isActive, onRegisterActions]);

  const columns = React.useMemo(
    () => getPaymentTypeColumns({
      onEdit: handleEdit,
      onDelete: handleDeleteRequest,
      onToggleStatus: handleToggleStatus,
      onToggleDefault: handleToggleDefault,
      onToggleBusinessResult: handleToggleBusinessResult,
    }),
    [handleEdit, handleDeleteRequest, handleToggleStatus, handleToggleDefault, handleToggleBusinessResult]
  );

  return (
    <div className="space-y-4">
      <SimpleSettingsTable
        data={data}
        columns={columns}
        emptyTitle="Chưa có loại phiếu chi"
        emptyDescription="Thêm loại phiếu chi đầu tiên để bắt đầu cấu hình"
        emptyAction={
          <Button size="sm" onClick={handleAddNew}>
            Thêm loại phiếu chi
          </Button>
        }
        enableSelection
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        onBulkDelete={handleBulkDelete}
        enablePagination
        pagination={{ pageSize: 10, showInfo: true }}
      />
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Cập nhật loại phiếu chi' : 'Thêm loại phiếu chi'}</DialogTitle>
          </DialogHeader>
          <PaymentTypeForm initialData={editingItem} onSubmit={handleFormSubmit} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Đóng</Button>
            <Button type="submit" form="payment-type-form" disabled={create.isPending || update.isPending}>
              {(create.isPending || update.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Loại phiếu chi sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={remove.isPending}>
              {remove.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa {Object.keys(rowSelection).length} loại phiếu chi?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Các loại phiếu chi đã chọn sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={remove.isPending}>
              {remove.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xóa tất cả
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
