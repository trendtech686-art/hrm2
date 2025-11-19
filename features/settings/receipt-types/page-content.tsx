import * as React from "react";
import { asBusinessId, asSystemId, type SystemId } from "@/lib/id-types";
import { useReceiptTypeStore } from "./store.ts";
import type { ReceiptType } from "./types.ts";
import { ReceiptTypeForm, type ReceiptTypeFormValues } from "./form.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { MoreHorizontal, Pencil, Trash2, PowerOff, Power } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog.tsx";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../../components/ui/alert-dialog.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table.tsx";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu.tsx";
import { Badge } from "../../../components/ui/badge.tsx";
import { toast } from "sonner";

export function ReceiptTypesPageContent() {
  const { data, add, update, hardDelete } = useReceiptTypeStore();
  
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<ReceiptType | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);
  
  const handleEdit = (item: ReceiptType) => { setEditingItem(item); setIsFormOpen(true); };
  const handleDeleteRequest = (systemId: SystemId) => { 
    setIdToDelete(systemId);
    setIsAlertOpen(true);
  };
  
  const handleToggleStatus = (item: ReceiptType) => {
    update(item.systemId, { ...item, isActive: !item.isActive });
    toast.success(item.isActive ? "Đã ngừng hoạt động" : "Đã kích hoạt");
  };
  
  const confirmDelete = () => {
    if (idToDelete) {
      hardDelete(idToDelete);
      toast.success("Đã xóa thành công");
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

  return (
    <div className="space-y-4">

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã loại</TableHead>
              <TableHead>Tên loại</TableHead>
              <TableHead>Mô tả</TableHead>
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
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {item.color && (
                        <div
                          className="h-3 w-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                      )}
                      <span>{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.description || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.isActive ? 'default' : 'secondary'}>
                      {item.isActive ? 'Hoạt động' : 'Ngừng'}
                    </Badge>
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
                ))
              )}
            </TableBody>
          </Table>
        </div>      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
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
