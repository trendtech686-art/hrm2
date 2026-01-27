import * as React from "react";
import { Plus } from "lucide-react";
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
      // Tắt mặc định của tất cả các loại khác
      data.forEach(d => {
        if (d.systemId !== item.systemId && d.isDefault) {
          update.mutate({ systemId: d.systemId, data: { ...d, isDefault: false } });
        }
      });
      update.mutate({ systemId: item.systemId, data: { ...item, isDefault: true } });
      toast.success(`Đã đặt "${item.name}" làm mặc định`);
    } else {
      const other = data.find(d => d.systemId !== item.systemId && d.isActive);
      if (other) {
        update.mutate({ systemId: item.systemId, data: { ...item, isDefault: false } });
        update.mutate({ systemId: other.systemId, data: { ...other, isDefault: true } });
        toast.success(`Đã chuyển mặc định sang "${other.name}"`);
      } else {
        toast.error("Phải có ít nhất một loại phiếu chi mặc định");
      }
    }
  }, [data, update]);

  const handleToggleStatus = React.useCallback((item: PaymentType, isActive: boolean) => {
    update.mutate({ systemId: item.systemId, data: { ...item, isActive } });
    toast.success(isActive ? `Đã kích hoạt "${item.name}"` : `Đã tắt "${item.name}"`);
  }, [update]);
  
  const confirmDelete = () => {
    if (idToDelete) {
      const item = data.find(d => d.systemId === idToDelete);
      remove.mutate(idToDelete);
      toast.success(`Đã xóa "${item?.name}"`);
    }
    setIsAlertOpen(false);
    setIdToDelete(null);
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
        color: values.color?.trim() || undefined,
      } satisfies Omit<PaymentType, 'systemId' | 'createdAt'>;

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

  React.useEffect(() => {
    if (!isActive) {
      return;
    }

    onRegisterActions([
      <SettingsActionButton key="add-payment-type" onClick={handleAddNew}>
        <Plus className="mr-2 h-4 w-4" /> Thêm loại phiếu chi
      </SettingsActionButton>,
    ]);
  }, [handleAddNew, isActive, onRegisterActions]);

  const columns = React.useMemo(
    () => getPaymentTypeColumns({
      onEdit: handleEdit,
      onDelete: handleDeleteRequest,
      onToggleStatus: handleToggleStatus,
      onToggleDefault: handleToggleDefault,
    }),
    [handleEdit, handleDeleteRequest, handleToggleStatus, handleToggleDefault]
  );

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
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
        />
      </div>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Cập nhật loại phiếu chi' : 'Thêm loại phiếu chi'}</DialogTitle>
          </DialogHeader>
          <PaymentTypeForm initialData={editingItem} onSubmit={handleFormSubmit} />
          <DialogFooter>
            <Button type="button" variant="outline" className="h-9" onClick={() => setIsFormOpen(false)}>Đóng</Button>
            <Button type="submit" form="payment-type-form" className="h-9">Lưu</Button>
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
            <AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
