import * as React from "react";
import { Plus } from "lucide-react";
import { useTargetGroupMutations } from "./hooks/use-target-groups";
import { useAllTargetGroups } from "./hooks/use-all-target-groups";
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
  const { data } = useAllTargetGroups();
  const { create, update, remove } = useTargetGroupMutations({
    onSuccess: () => {},
    onError: (err) => toast.error(err.message)
  });
  
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<TargetGroup | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = React.useState(false);
  
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
      // Backend sẽ tự động tắt mặc định của các nhóm khác
      update.mutate({ systemId: item.systemId, data: { isDefault: true } });
      toast.success(`Đã đặt "${item.name}" làm mặc định`);
    } else {
      // Không cho phép tắt mặc định nếu chỉ còn 1 item
      const activeItems = data.filter(d => d.isActive !== false);
      if (activeItems.length <= 1) {
        toast.error("Phải có ít nhất một nhóm đối tượng mặc định");
        return;
      }
      // Chuyển mặc định sang item active khác
      const other = activeItems.find(d => d.systemId !== item.systemId);
      if (other) {
        update.mutate({ systemId: other.systemId, data: { isDefault: true } });
        toast.success(`Đã chuyển mặc định sang "${other.name}"`);
      }
    }
  }, [data, update]);

  const handleToggleStatus = React.useCallback((item: TargetGroup, isActive: boolean) => {
    update.mutate({ systemId: item.systemId, data: { isActive } });
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

  const handleBulkDelete = React.useCallback((selectedItems: { systemId: string }[]) => {
    if (selectedItems.length === 0) return;
    setIsBulkDeleteOpen(true);
  }, []);

  const confirmBulkDelete = () => {
    const selectedIds = Object.keys(rowSelection);
    selectedIds.forEach(id => {
      remove.mutate(id as SystemId);
    });
    toast.success(`Đã xóa ${selectedIds.length} nhóm đối tượng`);
    setRowSelection({});
    setIsBulkDeleteOpen(false);
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

  // Register header actions - use ref to avoid stale closures
  const handleAddNewRef = React.useRef(handleAddNew);
  handleAddNewRef.current = handleAddNew;
  
  React.useLayoutEffect(() => {
    if (!isActive) return;
    onRegisterActions([
      <SettingsActionButton key="add-target-group" onClick={() => handleAddNewRef.current()}>
        <Plus className="mr-2 h-4 w-4" /> Thêm nhóm đối tượng
      </SettingsActionButton>,
    ]);
  }, [isActive, onRegisterActions]);

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

      <AlertDialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa {Object.keys(rowSelection).length} nhóm đối tượng?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Các nhóm đối tượng đã chọn sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Xóa tất cả</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
