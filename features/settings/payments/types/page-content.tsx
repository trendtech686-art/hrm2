import * as React from "react";
import { Plus, MoreHorizontal } from "lucide-react";
import { asBusinessId, asSystemId, type SystemId } from "@/lib/id-types";
import { usePaymentTypeStore } from "./store.ts";
import type { PaymentType } from "./types.ts";
import { PaymentTypeForm, type PaymentTypeFormValues } from "./form.tsx";
import { Button } from "../../../../components/ui/button.tsx";
import { Switch } from "../../../../components/ui/switch.tsx";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../../components/ui/dialog.tsx";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../../../components/ui/alert-dialog.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table.tsx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../../components/ui/dropdown-menu.tsx";
import { toast } from "sonner";
import { SettingsActionButton } from "../../../../components/settings/SettingsActionButton.tsx";
import type { RegisterTabActions } from "../../use-tab-action-registry.ts";

type PaymentTypesPageContentProps = {
  isActive: boolean;
  onRegisterActions: RegisterTabActions;
};

export function PaymentTypesPageContent({ isActive, onRegisterActions }: PaymentTypesPageContentProps) {
  const { data, add, update, hardDelete } = usePaymentTypeStore();
  
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<PaymentType | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);

  const handleAddNew = React.useCallback(() => {
    setEditingItem(null);
    setIsFormOpen(true);
  }, []);

  const handleEdit = (item: PaymentType) => { setEditingItem(item); setIsFormOpen(true); };
  const handleDeleteRequest = (systemId: SystemId) => { 
    setIdToDelete(systemId);
    setIsAlertOpen(true);
  };
  
  const handleToggleDefault = (item: PaymentType, isDefault: boolean) => {
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
        toast.error("Phải có ít nhất một loại phiếu chi mặc định");
      }
    }
  };

  const handleToggleStatus = (item: PaymentType, isActive: boolean) => {
    update(item.systemId, { ...item, isActive });
    toast.success(isActive ? `Đã kích hoạt "${item.name}"` : `Đã tắt "${item.name}"`);
  };
  
  const confirmDelete = () => {
    if (idToDelete) {
      const item = data.find(d => d.systemId === idToDelete);
      hardDelete(idToDelete);
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
        update(editingItem.systemId, {
          ...editingItem,
          ...normalized,
        });
        toast.success("Cập nhật thành công");
      } else {
        add({
          ...normalized,
          createdAt: now,
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
      <SettingsActionButton key="add-payment-type" onClick={handleAddNew}>
        <Plus className="mr-2 h-4 w-4" /> Thêm loại phiếu chi
      </SettingsActionButton>,
    ]);
  }, [handleAddNew, isActive, onRegisterActions]);

  return (
    <div className="space-y-4">

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã loại</TableHead>
              <TableHead>Tên loại</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Mặc định</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Chưa có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.systemId}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.description || "—"}
                  </TableCell>
                  <TableCell>
                    <Switch 
                      checked={item.isDefault ?? false} 
                      onCheckedChange={(checked) => handleToggleDefault(item, checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch 
                      checked={item.isActive} 
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
        </div>      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
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
