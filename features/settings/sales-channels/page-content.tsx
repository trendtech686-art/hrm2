import * as React from "react";
import { useSalesChannelMutations } from "./hooks/use-sales-channels";
import { useAllSalesChannels } from "./hooks/use-all-sales-channels";
import type { SalesChannel } from '@/lib/types/prisma-extended';
import { SalesChannelForm, type SalesChannelFormValues } from "./form";
import { Button } from "../../../components/ui/button";
import { SettingsActionButton } from "../../../components/settings/SettingsActionButton";
import { PlusCircle, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../../components/ui/alert-dialog";
import { asBusinessId, type SystemId } from "@/lib/id-types";
import { SimpleSettingsTable } from "../../../components/settings/SimpleSettingsTable";
import { getSalesChannelColumns } from "./columns";
import type { RegisterTabActions } from "../use-tab-action-registry";
import { toast } from "sonner";

type SalesChannelsPageContentProps = {
  isActive?: boolean;
  onRegisterActions?: RegisterTabActions;
};

export function SalesChannelsPageContent({ isActive, onRegisterActions }: SalesChannelsPageContentProps) {
  const { data } = useAllSalesChannels();
  const { create, update, remove } = useSalesChannelMutations({
    onSuccess: () => toast.success("Thao tác thành công"),
    onError: (err) => toast.error(err.message)
  });
  
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<SalesChannel | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = React.useState(false);
  
  const handleAddNew = React.useCallback(() => { setEditingItem(null); setIsFormOpen(true); }, []);
  const handleEdit = React.useCallback((item: SalesChannel) => { setEditingItem(item); setIsFormOpen(true); }, []);
  const handleDeleteRequest = React.useCallback((id: SystemId) => { setIdToDelete(id); setIsAlertOpen(true); }, []);
  
  const handleToggleStatus = React.useCallback((channel: SalesChannel, isApplied: boolean) => {
    update.mutate({ systemId: channel.systemId, data: { isApplied } });
  }, [update]);

  const handleToggleDefault = React.useCallback((channel: SalesChannel, isDefault: boolean) => {
    update.mutate({ systemId: channel.systemId, data: { isDefault } });
  }, [update]);
  
  const confirmDelete = () => {
    if (idToDelete) {
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
  const handleFormSubmit = (values: SalesChannelFormValues) => {
    const normalizedId = values.id?.trim().toUpperCase();
    const businessId = normalizedId
      ? asBusinessId(normalizedId)
      : editingItem
        ? editingItem.id
        : asBusinessId("");

    const payload = {
      id: businessId,
      name: values.name.trim(),
      isApplied: values.isApplied ?? false,
      isDefault: values.isDefault ?? false,
    };

    if (editingItem) {
      update.mutate({ systemId: editingItem.systemId, data: payload });
    } else {
      create.mutate(payload);
    }
    setIsFormOpen(false);
  };

  const columns = React.useMemo(
    () => getSalesChannelColumns({
      onEdit: handleEdit,
      onDelete: handleDeleteRequest,
      onToggleStatus: handleToggleStatus,
      onToggleDefault: handleToggleDefault,
    }),
    [handleEdit, handleDeleteRequest, handleToggleStatus, handleToggleDefault]
  );

  const handleAddNewRef = React.useRef(handleAddNew);
  handleAddNewRef.current = handleAddNew;

  React.useLayoutEffect(() => {
    if (!isActive || !onRegisterActions) return;
    onRegisterActions([
      <SettingsActionButton key="add" onClick={() => handleAddNewRef.current()}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Thêm nguồn bán hàng
      </SettingsActionButton>,
    ]);
  }, [isActive, onRegisterActions]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Bên cạnh một số nguồn phổ biến nhất mà Sapo đã có sẵn, bạn có thể cập nhật hoặc thêm mới các nguồn tạo ra đơn hàng của cửa hàng bạn.</p>
      <SimpleSettingsTable
        data={data}
        columns={columns}
        emptyTitle="Chưa có nguồn bán hàng"
        emptyDescription="Thêm nguồn bán hàng đầu tiên để theo dõi nguồn gốc đơn hàng"
        emptyAction={
          <Button size="sm" onClick={handleAddNew}>
            Thêm nguồn bán hàng
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
            <DialogTitle>{editingItem ? 'Cập nhật nguồn bán hàng' : 'Thêm nguồn bán hàng'}</DialogTitle>
          </DialogHeader>
          <SalesChannelForm initialData={editingItem} onSubmit={handleFormSubmit} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} className="h-9">Thoát</Button>
            <Button type="submit" form="sales-channel-form" className="h-9" disabled={create.isPending || update.isPending}>
              {(create.isPending || update.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingItem ? 'Lưu' : 'Thêm'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>Hành động này không thể được hoàn tác.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-9">Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="h-9" disabled={remove.isPending}>
              {remove.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa {Object.keys(rowSelection).length} nguồn bán hàng?</AlertDialogTitle>
            <AlertDialogDescription>Hành động này không thể hoàn tác. Các nguồn bán hàng đã chọn sẽ bị xóa vĩnh viễn.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-9">Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkDelete} className="h-9 bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={remove.isPending}>
              {remove.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xóa tất cả
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
