import * as React from "react";
import { useSalesChannels, useSalesChannelMutations } from "./hooks/use-sales-channels";
import type { SalesChannel } from '@/lib/types/prisma-extended';
import { SalesChannelForm, type SalesChannelFormValues } from "./form";
import { Button } from "../../../components/ui/button";
import { SettingsActionButton } from "../../../components/settings/SettingsActionButton";
import { PlusCircle } from "lucide-react";
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
  const { data: queryData } = useSalesChannels({ limit: 1000 });
  const data = React.useMemo(() => queryData?.data ?? [], [queryData?.data]);
  const { create, update, remove } = useSalesChannelMutations({
    onSuccess: () => {},
    onError: (err) => toast.error(err.message)
  });
  
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<SalesChannel | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);
  
  const handleAddNew = React.useCallback(() => { setEditingItem(null); setIsFormOpen(true); }, []);
  const handleEdit = React.useCallback((item: SalesChannel) => { setEditingItem(item); setIsFormOpen(true); }, []);
  const handleDeleteRequest = React.useCallback((id: SystemId) => { setIdToDelete(id); setIsAlertOpen(true); }, []);
  
  const handleToggleStatus = React.useCallback((channel: SalesChannel, isApplied: boolean) => {
    update.mutate({ systemId: channel.systemId, data: { isApplied } }, {
      onSuccess: () => toast.success(isApplied ? `Đã bật "${channel.name}"` : `Đã tắt "${channel.name}"`),
      onError: (err) => toast.error(err.message)
    });
  }, [update]);

  const handleToggleDefault = React.useCallback((channel: SalesChannel, isDefault: boolean) => {
    update.mutate({ systemId: channel.systemId, data: { isDefault } }, {
      onSuccess: () => toast.success(isDefault ? `Đã đặt "${channel.name}" làm mặc định` : `Đã bỏ mặc định "${channel.name}"`),
      onError: (err) => toast.error(err.message)
    });
  }, [update]);
  
  const confirmDelete = React.useCallback(() => {
    if (idToDelete) {
      const channel = data.find(c => c.systemId === idToDelete);
      remove.mutate(idToDelete, {
        onSuccess: () => toast.success(`Đã xóa nguồn bán hàng "${channel?.name ?? ""}"`),
        onError: (err) => toast.error(err.message)
      });
    }
    setIsAlertOpen(false);
    setIdToDelete(null);
  }, [idToDelete, remove, data]);
  
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
      update.mutate({ systemId: editingItem.systemId, data: payload }, {
        onSuccess: () => toast.success(`Đã cập nhật nguồn bán hàng "${payload.name}"`),
        onError: (err) => toast.error(err.message)
      });
    } else {
      create.mutate(payload, {
        onSuccess: () => toast.success(`Đã thêm nguồn bán hàng "${payload.name}"`),
        onError: (err) => toast.error(err.message)
      });
    }
    setIsFormOpen(false);
  };

  const sortedChannels = React.useMemo(() => {
    return [...data].sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

  const columns = React.useMemo(
    () => getSalesChannelColumns({
      onEdit: handleEdit,
      onDelete: handleDeleteRequest,
      onToggleStatus: handleToggleStatus,
      onToggleDefault: handleToggleDefault,
    }),
    [handleEdit, handleDeleteRequest, handleToggleStatus, handleToggleDefault]
  );

  const headerActions = React.useMemo(() => [
    <SettingsActionButton key="add" onClick={handleAddNew}>
      <PlusCircle className="mr-2 h-4 w-4" />
      Thêm nguồn bán hàng
    </SettingsActionButton>,
  ], [handleAddNew]);

  React.useEffect(() => {
    if (!isActive || !onRegisterActions) return;
    onRegisterActions(headerActions);
  }, [headerActions, isActive, onRegisterActions]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Bên cạnh một số nguồn phổ biến nhất mà Sapo đã có sẵn, bạn có thể cập nhật hoặc thêm mới các nguồn tạo ra đơn hàng của cửa hàng bạn.</p>
      <div className="rounded-md border-border border bg-card">
        <SimpleSettingsTable
          data={sortedChannels}
          columns={columns}
          emptyTitle="Chưa có nguồn bán hàng"
          emptyDescription="Thêm nguồn bán hàng đầu tiên để theo dõi nguồn gốc đơn hàng"
          emptyAction={
            <Button size="sm" onClick={handleAddNew}>
              Thêm nguồn bán hàng
            </Button>
          }
        />
      </div>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Cập nhật nguồn bán hàng' : 'Thêm nguồn bán hàng'}</DialogTitle>
          </DialogHeader>
          <SalesChannelForm initialData={editingItem} onSubmit={handleFormSubmit} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} className="h-9">Thoát</Button>
            <Button type="submit" form="sales-channel-form" className="h-9">{editingItem ? 'Lưu' : 'Thêm'}</Button>
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
            <AlertDialogAction onClick={confirmDelete} className="h-9">Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
