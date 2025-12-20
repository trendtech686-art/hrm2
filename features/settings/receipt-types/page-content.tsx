import * as React from "react";
import { Plus } from "lucide-react";
import { asBusinessId, asSystemId, type SystemId } from "@/lib/id-types";
import { useReceiptTypeStore } from "./store";
import type { ReceiptType } from "./types";
import { ReceiptTypeForm, type ReceiptTypeFormValues } from "./form";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";
import { getReceiptTypeColumns } from "./columns";
import { toast } from "sonner";
import { SimpleSettingsTable } from "../../../components/settings/SimpleSettingsTable";
import { SettingsActionButton } from "../../../components/settings/SettingsActionButton";
import type { RegisterTabActions } from "../use-tab-action-registry";

type ReceiptTypesPageContentProps = {
  isActive: boolean;
  onRegisterActions: RegisterTabActions;
};

export function ReceiptTypesPageContent({ isActive, onRegisterActions }: ReceiptTypesPageContentProps) {
  const { data, add, update, hardDelete } = useReceiptTypeStore();
  
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<ReceiptType | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);

  const handleAddNew = React.useCallback(() => {
    setEditingItem(null);
    setIsFormOpen(true);
  }, []);
  
  const handleEdit = React.useCallback((item: ReceiptType) => {
    setEditingItem(item);
    setIsFormOpen(true);
  }, []);

  const handleDeleteRequest = React.useCallback((systemId: SystemId) => {
    setIdToDelete(systemId);
    setIsAlertOpen(true);
  }, []);
  
  const handleToggleDefault = React.useCallback((item: ReceiptType, isDefault: boolean) => {
    if (isDefault) {
      // Tắt mặc định của tất cả các loại khác
      data.forEach(d => {
        if (d.systemId !== item.systemId && d.isDefault) {
          update(d.systemId, { ...d, isDefault: false });
        }
      });
      update(item.systemId, { ...item, isDefault: true });
      toast.success(`Đã đặt "${item.name}" làm mặc định`);
    } else {
      const other = data.find(d => d.systemId !== item.systemId && d.isActive);
      if (other) {
        update(item.systemId, { ...item, isDefault: false });
        update(other.systemId, { ...other, isDefault: true });
        toast.success(`Đã chuyển mặc định sang "${other.name}"`);
      } else {
        toast.error("Phải có ít nhất một loại phiếu thu mặc định");
      }
    }
  }, [data, update]);

  const handleToggleStatus = React.useCallback((item: ReceiptType, isActive: boolean) => {
    update(item.systemId, { ...item, isActive });
    toast.success(isActive ? `Đã kích hoạt "${item.name}"` : `Đã tắt "${item.name}"`);
  }, [update]);
  
  const confirmDelete = () => {
    if (idToDelete) {
      const item = data.find(d => d.systemId === idToDelete);
      hardDelete(idToDelete);
      toast.success(`Đã xóa "${item?.name}"`);
    }
    setIsAlertOpen(false);
    setIdToDelete(null);
  };
  
  const handleFormSubmit = (values: ReceiptTypeFormValues) => {
    try {
      const now = new Date().toISOString();
      const normalized = {
        id: asBusinessId(values.id.trim().toUpperCase()),
        name: values.name.trim(),
        description: values.description?.trim() || undefined,
        isBusinessResult: values.isBusinessResult,
        isActive: values.isActive,
        color: values.color?.trim() || undefined,
      } satisfies Omit<ReceiptType, 'systemId' | 'createdAt'>;

      if (editingItem) {
        update(editingItem.systemId, {
          ...editingItem,
          ...normalized,
        });
        toast.success(`Đã cập nhật "${normalized.name}"`);
      } else {
        add({
          ...normalized,
          createdAt: now,
        });
        toast.success(`Đã thêm "${normalized.name}"`);
      }
      setIsFormOpen(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra", {
        description: error instanceof Error ? error.message : "Lỗi không xác định",
      });
    }
  };

  const columns = React.useMemo(
    () =>
      getReceiptTypeColumns({
        onEdit: handleEdit,
        onToggleDefault: handleToggleDefault,
        onToggleStatus: handleToggleStatus,
        onDelete: handleDeleteRequest,
      }),
    [handleEdit, handleToggleDefault, handleToggleStatus, handleDeleteRequest]
  );

  React.useEffect(() => {
    if (!isActive) {
      return;
    }

    onRegisterActions([
      <SettingsActionButton key="add-receipt-type" onClick={handleAddNew}>
        <Plus className="mr-2 h-4 w-4" /> Thêm loại phiếu thu
      </SettingsActionButton>,
    ]);
  }, [handleAddNew, isActive, onRegisterActions]);

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-background">
        <SimpleSettingsTable
          data={data}
          columns={columns}
          emptyTitle="Chưa có dữ liệu"
          emptyDescription="Thêm loại phiếu thu đầu tiên để bắt đầu cấu hình"
          emptyAction={
            <Button size="sm" onClick={handleAddNew}>
              Thêm loại mới
            </Button>
          }
        />
      </div>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Cập nhật loại phiếu thu' : 'Thêm loại phiếu thu'}</DialogTitle>
          </DialogHeader>
          <ReceiptTypeForm initialData={editingItem} onSubmit={handleFormSubmit} />
          <DialogFooter>
            <Button type="button" variant="outline" className="h-9" onClick={() => setIsFormOpen(false)}>Đóng</Button>
            <Button type="submit" form="receipt-type-form" className="h-9">Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Loại phiếu thu sẽ bị xóa vĩnh viễn.
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
