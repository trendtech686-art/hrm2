import * as React from "react";
import { usePaymentMethodStore } from "./store.ts";
import type { PaymentMethod } from "./types.ts";
import { PaymentMethodForm, type PaymentMethodFormValues } from "./form.tsx";
import { Button } from "../../../../components/ui/button.tsx";
import { MoreHorizontal, Pencil, Trash2, Star, PowerOff, Power } from "lucide-react";
import * as Icons from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../../components/ui/dialog.tsx";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../../../components/ui/alert-dialog.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table.tsx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../../components/ui/dropdown-menu.tsx";
import { Badge } from "../../../../components/ui/badge.tsx";
import { toast } from "sonner";

export function PaymentMethodsPageContent() {
  const { data, add, update, remove, setDefault } = usePaymentMethodStore();
  
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<PaymentMethod | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<string | null>(null);
  
  const handleEdit = (item: PaymentMethod) => { setEditingItem(item); setIsFormOpen(true); };
  const handleDeleteRequest = (systemId: string) => { 
    setIdToDelete(systemId);
    setIsAlertOpen(true);
  };
  
  const handleToggleStatus = (item: PaymentMethod) => {
    update(item.systemId, { ...item, isActive: !item.isActive });
    toast.success(item.isActive ? "Đã ngừng hoạt động" : "Đã kích hoạt");
  };
  
  const confirmDelete = () => {
    if (idToDelete) {
      remove(idToDelete);
      toast.success("Đã xóa thành công");
    }
    setIsAlertOpen(false);
    setIdToDelete(null);
  };
  
  const handleSetDefault = (systemId: string) => {
    setDefault(systemId);
    toast.success("Đã đặt làm phương thức mặc định");
  };
  
  const handleFormSubmit = (values: PaymentMethodFormValues) => {
    try {
      if (editingItem) {
        update(editingItem.systemId, values);
        toast.success("Cập nhật thành công");
      } else {
        add(values);
        toast.success("Thêm mới thành công");
      }
      setIsFormOpen(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra", {
        description: error instanceof Error ? error.message : "Lỗi không xác định",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên hình thức</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Mặc định</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Chưa có dữ liệu
                </TableCell>
              </TableRow>
            ) : (
              data.map((item) => {
                const IconComponent = item.icon && (Icons as any)[item.icon] ? (Icons as any)[item.icon] : null;
                return (
                  <TableRow key={item.systemId}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {IconComponent && (
                          <div
                            className="flex h-8 w-8 items-center justify-center rounded"
                            style={{ backgroundColor: item.color || '#6b7280' }}
                          >
                            <IconComponent className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <span>{item.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.isActive ? 'default' : 'secondary'}>
                        {item.isActive ? 'Hoạt động' : 'Ngừng'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.isDefault ? (
                        <Badge variant="outline">Mặc định</Badge>
                      ) : null}
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
                          <Pencil className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleStatus(item)}>
                          {item.isActive ? (
                            <>
                              <PowerOff className="mr-2 h-4 w-4" />
                              Ngừng hoạt động
                            </>
                          ) : (
                            <>
                              <Power className="mr-2 h-4 w-4" />
                              Kích hoạt
                            </>
                          )}
                        </DropdownMenuItem>
                        {!item.isDefault && (
                          <DropdownMenuItem onClick={() => handleSetDefault(item.systemId)}>
                            <Star className="mr-2 h-4 w-4" />
                            Đặt làm mặc định
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleDeleteRequest(item.systemId)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Cập nhật hình thức thanh toán' : 'Thêm hình thức thanh toán'}</DialogTitle>
          </DialogHeader>
          <PaymentMethodForm initialData={editingItem} onSubmit={handleFormSubmit} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Hủy</Button>
            <Button type="submit" form="payment-method-form">Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Hình thức thanh toán sẽ bị xóa vĩnh viễn.
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
