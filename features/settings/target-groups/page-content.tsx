import * as React from "react";
import { Plus } from "lucide-react";
import { useTargetGroups, useTargetGroupMutations } from "./hooks/use-target-groups";
import type { TargetGroup } from '@/lib/types/prisma-extended';
import { TargetGroupForm, type TargetGroupFormValues } from "./form";
import { asBusinessId, type SystemId } from "@/lib/id-types";
import { Button } from "../../../components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../../components/ui/alert-dialog";
import { SimpleSettingsTable } from "../../../components/settings/SimpleSettingsTable";
import { getTargetGroupColumns } from "./columns";
import { toast } from "sonner";
import { SettingsActionButton } from "../../../components/settings/SettingsActionButton";
import type { RegisterTabActions } from "../use-tab-action-registry";

type TargetGroupsPageContentProps = {
  isActive: boolean;
  onRegisterActions: RegisterTabActions;
};

export function TargetGroupsPageContent({ isActive, onRegisterActions }: TargetGroupsPageContentProps) {
  const { data: queryData } = useTargetGroups({ limit: 1000 });
  const data = React.useMemo(() => queryData?.data ?? [], [queryData?.data]);
  const { create, update, remove } = useTargetGroupMutations({
    onSuccess: () => {},
    onError: (err) => toast.error(err.message)
  });
  
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<TargetGroup | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);
  
  const handleAddNew = React.useCallback(() => {
    setEditingItem(null);
    setIsFormOpen(true);
  }, []);

  const handleEdit = React.useCallback((item: TargetGroup) => { setEditingItem(item); setIsFormOpen(true); }, []);
  const handleDeleteRequest = React.useCallback((systemId: SystemId) => { 
    setIdToDelete(systemId);
    setIsAlertOpen(true);
  }, []);
  
  const handleToggleDefault = React.useCallback((item: TargetGroup, isDefault: boolean) => {
    if (isDefault) {
      // Tắt mặc định của tất cả các nhóm khác
      data.forEach(d => {
        if (d.systemId !== item.systemId && d.isDefault) {
          (update as any).mutate({ systemId: d.systemId, isDefault: false });
        }
      });
      (update as any).mutate({ systemId: item.systemId, isDefault: true });
      toast.success(`Đã đặt "${item.name}" làm mặc định`);
    } else {
      const other = data.find(d => d.systemId !== item.systemId && d.isActive !== false);
      if (other) {
        (update as any).mutate({ systemId: item.systemId, isDefault: false });
        (update as any).mutate({ systemId: other.systemId, isDefault: true });
        toast.success(`Đã chuyển mặc định sang "${other.name}"`);
      } else {
        toast.error("Phải có ít nhất một nhóm đối tượng mặc định");
      }
    }
  }, [data, update]);

  const handleToggleStatus = React.useCallback((item: TargetGroup, isActive: boolean) => {
    (update as any).mutate({ systemId: item.systemId, isActive });
    toast.success(isActive ? "Đã kích hoạt" : "Đã ngừng hoạt động");
  }, [update]);
  
  const confirmDelete = () => {
    if (idToDelete) {
      remove.mutate(idToDelete, {
        onSuccess: () => toast.success("Đã xóa thành công"),
        onError: (err) => toast.error(err.message)
      });
    }
    setIsAlertOpen(false);
    setIdToDelete(null);
  };
  
  const handleFormSubmit = (values: TargetGroupFormValues) => {
    try {
      const name = values.name.trim();
      const normalizedId = values.id?.trim().toUpperCase();
      if (editingItem) {
        update.mutate({
          systemId: editingItem.systemId,
          data: {
            name,
            id: normalizedId ? asBusinessId(normalizedId) : editingItem.id,
          }
        }, {
          onSuccess: () => toast.success("Cập nhật thành công"),
          onError: (err) => toast.error(err.message)
        });
      } else {
        create.mutate({
          id: normalizedId ? asBusinessId(normalizedId) : asBusinessId(""),
          name,
          isActive: true,
        }, {
          onSuccess: () => toast.success("Thêm mới thành công"),
          onError: (err) => toast.error(err.message)
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
      <SettingsActionButton key="add-target-group" onClick={handleAddNew}>
        <Plus className="mr-2 h-4 w-4" /> Thêm nhóm đối tượng
      </SettingsActionButton>,
    ]);
  }, [handleAddNew, isActive, onRegisterActions]);

  const columns = React.useMemo(
    () => getTargetGroupColumns({
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
          emptyTitle="Chưa có nhóm đối tượng"
          emptyDescription="Thêm nhóm đối tượng đầu tiên để phân loại"
          emptyAction={
            <Button size="sm" onClick={handleAddNew}>
              Thêm nhóm đối tượng
            </Button>
          }
        />
      </div>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Cập nhật nhóm đối tượng' : 'Thêm nhóm đối tượng'}</DialogTitle>
          </DialogHeader>
          <TargetGroupForm initialData={editingItem} onSubmit={handleFormSubmit} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Hủy</Button>
            <Button type="submit" form="target-group-form">Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Nhóm đối tượng sẽ bị xóa vĩnh viễn.
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
