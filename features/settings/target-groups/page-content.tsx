import * as React from "react";
import { Plus, MoreHorizontal } from "lucide-react";
import { useTargetGroupStore } from "./store";
import type { TargetGroup } from "./types";
import { TargetGroupForm, type TargetGroupFormValues } from "./form";
import { asBusinessId, type SystemId } from "@/lib/id-types";
import { Button } from "../../../components/ui/button";
import { Switch } from "../../../components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../../components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu";
import { toast } from "sonner";
import { SettingsActionButton } from "../../../components/settings/SettingsActionButton";
import type { RegisterTabActions } from "../use-tab-action-registry";

type TargetGroupsPageContentProps = {
  isActive: boolean;
  onRegisterActions: RegisterTabActions;
};

export function TargetGroupsPageContent({ isActive, onRegisterActions }: TargetGroupsPageContentProps) {
  const { data, add, update, hardDelete } = useTargetGroupStore();
  
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<TargetGroup | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);
  
  const handleAddNew = React.useCallback(() => {
    setEditingItem(null);
    setIsFormOpen(true);
  }, []);

  const handleEdit = React.useCallback((item: TargetGroup) => { setEditingItem(item); setIsFormOpen(true); }, []);
  const handleDeleteRequest = (systemId: SystemId) => { 
    setIdToDelete(systemId);
    setIsAlertOpen(true);
  };
  
  const handleToggleDefault = (item: TargetGroup, isDefault: boolean) => {
    if (isDefault) {
      // Tắt mặc định của tất cả các nhóm khác
      data.forEach(d => {
        if (d.systemId !== item.systemId && d.isDefault) {
          update(d.systemId, { ...d, isDefault: false });
        }
      });
      update(item.systemId, { ...item, isDefault: true });
      toast.success(`Đã đặt "${item.name}" làm mặc định`);
    } else {
      const other = data.find(d => d.systemId !== item.systemId && d.isActive !== false);
      if (other) {
        update(item.systemId, { ...item, isDefault: false });
        update(other.systemId, { ...other, isDefault: true });
        toast.success(`Đã chuyển mặc định sang "${other.name}"`);
      } else {
        toast.error("Phải có ít nhất một nhóm đối tượng mặc định");
      }
    }
  };

  const handleToggleStatus = (item: TargetGroup, isActive: boolean) => {
    update(item.systemId, { ...item, isActive });
    toast.success(isActive ? "Đã kích hoạt" : "Đã ngừng hoạt động");
  };
  
  const confirmDelete = () => {
    if (idToDelete) {
      hardDelete(idToDelete);
      toast.success("Đã xóa thành công");
    }
    setIsAlertOpen(false);
    setIdToDelete(null);
  };
  
  const handleFormSubmit = (values: TargetGroupFormValues) => {
    try {
      const name = values.name.trim();
      const normalizedId = values.id?.trim().toUpperCase();
      if (editingItem) {
        const payload: TargetGroup = {
          ...editingItem,
          name,
          id: normalizedId ? asBusinessId(normalizedId) : editingItem.id,
        };
        update(editingItem.systemId, payload);
        toast.success("Cập nhật thành công");
      } else {
        add({
          id: normalizedId ? asBusinessId(normalizedId) : asBusinessId(""),
          name,
          isActive: true,
        });
        toast.success("Thêm mới thành công");
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

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã nhóm</TableHead>
              <TableHead>Tên nhóm</TableHead>
              <TableHead>Mặc định</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Chưa có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.systemId}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Switch 
                      checked={item.isDefault ?? false} 
                      onCheckedChange={(checked) => handleToggleDefault(item, checked)} 
                    />
                  </TableCell>
                  <TableCell>
                    <Switch 
                      checked={item.isActive ?? true} 
                      onCheckedChange={(checked) => handleToggleStatus(item, checked)} 
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Mở menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEdit(item)}>
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteRequest(item.systemId)}
                          className="text-destructive"
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
