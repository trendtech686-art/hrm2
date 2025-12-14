import * as React from "react";
import { useSalesChannelStore } from "./store.ts";
import type { SalesChannel } from "./types.ts";
import { SalesChannelForm, type SalesChannelFormValues } from "./form.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { SettingsActionButton } from "../../../components/settings/SettingsActionButton.tsx";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog.tsx";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../../components/ui/alert-dialog.tsx";
import { asBusinessId, type SystemId } from "@/lib/id-types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table.tsx";
import { Switch } from "../../../components/ui/switch.tsx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu.tsx";
import type { RegisterTabActions } from "../use-tab-action-registry.ts";
import { toast } from "sonner";

type SalesChannelsPageContentProps = {
  isActive?: boolean;
  onRegisterActions?: RegisterTabActions;
};

export function SalesChannelsPageContent({ isActive, onRegisterActions }: SalesChannelsPageContentProps) {
  const { data, add, update, remove } = useSalesChannelStore();
  
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<SalesChannel | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);
  
  const handleAddNew = React.useCallback(() => { setEditingItem(null); setIsFormOpen(true); }, []);
  const handleEdit = React.useCallback((item: SalesChannel) => { setEditingItem(item); setIsFormOpen(true); }, []);
  const handleDeleteRequest = React.useCallback((id: SystemId) => { setIdToDelete(id); setIsAlertOpen(true); }, []);
  
  const handleToggleStatus = React.useCallback((channel: SalesChannel, isApplied: boolean) => {
    const updated: SalesChannel = { ...channel, isApplied };
    update(channel.systemId, updated);
    toast.success(isApplied ? `Đã bật "${channel.name}"` : `Đã tắt "${channel.name}"`);
  }, [update]);

  const handleToggleDefault = React.useCallback((channel: SalesChannel, isDefault: boolean) => {
    const updated: SalesChannel = { ...channel, isDefault };
    update(channel.systemId, updated);
    toast.success(isDefault ? `Đã đặt "${channel.name}" làm mặc định` : `Đã bỏ mặc định "${channel.name}"`);
  }, [update]);
  
  const confirmDelete = React.useCallback(() => {
    if (idToDelete) {
      const channel = data.find(c => c.systemId === idToDelete);
      remove(idToDelete);
      toast.success(`Đã xóa nguồn bán hàng "${channel?.name ?? ''}"`);
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
      const updated: SalesChannel = {
        ...editingItem,
        ...payload,
      };
      update(editingItem.systemId, updated);
      toast.success(`Đã cập nhật nguồn bán hàng "${payload.name}"`);
    } else {
      add(payload);
      toast.success(`Đã thêm nguồn bán hàng "${payload.name}"`);
    }
    setIsFormOpen(false);
  };

  const sortedChannels = React.useMemo(() => {
    return [...data].sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

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
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Mã nguồn</TableHead>
              <TableHead>Tên nguồn</TableHead>
              <TableHead className="w-[140px]">Trạng thái</TableHead>
              <TableHead className="w-[140px]">Mặc định</TableHead>
              <TableHead className="w-[80px] text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedChannels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-sm text-muted-foreground">
                  Chưa có nguồn bán hàng nào
                </TableCell>
              </TableRow>
            ) : (
              sortedChannels.map((channel) => (
                <TableRow key={channel.systemId}>
                  <TableCell className="font-mono text-xs uppercase text-muted-foreground">
                    {channel.id ?? '—'}
                  </TableCell>
                  <TableCell className="font-medium">{channel.name}</TableCell>
                  <TableCell>
                    <Switch 
                      checked={channel.isApplied} 
                      onCheckedChange={(checked) => handleToggleStatus(channel, checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch 
                      checked={channel.isDefault} 
                      onCheckedChange={(checked) => handleToggleDefault(channel, checked)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Mở menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(channel)}>
                          Sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteRequest(channel.systemId)}
                          className="text-destructive focus:text-destructive"
                        >
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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
