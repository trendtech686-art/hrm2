import * as React from "react";
import { Plus, MoreHorizontal } from "lucide-react";
import { usePaymentMethodStore } from "./store";
import type { PaymentMethod } from '@/lib/types/prisma-extended';
import { PaymentMethodForm, type PaymentMethodFormValues } from "./form";
import { Button } from "../../../../components/ui/button";
import { Switch } from "../../../../components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../../components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import { toast } from "sonner";
import { asBusinessId, type SystemId } from "@/lib/id-types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { SettingsActionButton } from "../../../../components/settings/SettingsActionButton";
import type { RegisterTabActions } from "../../use-tab-action-registry";

type PaymentMethodsPageContentProps = {
  isActive: boolean;
  onRegisterActions: RegisterTabActions;
};

export function PaymentMethodsPageContent({ isActive, onRegisterActions }: PaymentMethodsPageContentProps) {
  const { data, add, update, remove, setDefault } = usePaymentMethodStore();
  
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<PaymentMethod | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);
  
  const handleAddNew = React.useCallback(() => {
    setEditingItem(null);
    setIsFormOpen(true);
  }, []);

  const handleEdit = React.useCallback((item: PaymentMethod) => {
    setEditingItem(item);
    setIsFormOpen(true);
  }, []);

  const handleDeleteRequest = React.useCallback((systemId: SystemId) => {
    setIdToDelete(systemId);
    setIsAlertOpen(true);
  }, []);
  
  const handleToggleStatus = React.useCallback((item: PaymentMethod, isActive: boolean) => {
    update(item.systemId, { ...item, isActive });
    toast.success(isActive ? `Đã kích hoạt "${item.name}"` : `Đã tắt "${item.name}"`);
  }, [update]);
  
  const confirmDelete = () => {
    if (idToDelete) {
      const method = data.find(m => m.systemId === idToDelete);
      remove(idToDelete);
      toast.success(`Đã xóa "${method?.name}"`);
    }
    setIsAlertOpen(false);
    setIdToDelete(null);
  };
  
  const handleToggleDefault = React.useCallback((item: PaymentMethod, checked: boolean) => {
    if (checked) {
      setDefault(item.systemId);
      toast.success(`Đã đặt "${item.name}" làm mặc định`);
    } else {
      // Find another method to set as default
      const otherMethods = data.filter(m => m.systemId !== item.systemId);
      if (otherMethods.length > 0) {
        setDefault(otherMethods[0].systemId);
        toast.success(`Đã đặt "${otherMethods[0].name}" làm mặc định`);
      } else {
        toast.error('Phải có ít nhất một phương thức thanh toán mặc định');
      }
    }
  }, [data, setDefault]);
  
  const handleSetDefault = React.useCallback((systemId: SystemId) => {
    const method = data.find(m => m.systemId === systemId);
    setDefault(systemId);
    toast.success(`Đã đặt "${method?.name}" làm mặc định`);
  }, [data, setDefault]);
  
  const normalizeValues = (
    values: PaymentMethodFormValues,
    fallbackId?: string
  ): Omit<PaymentMethod, 'systemId' | 'isDefault'> => {
    const candidateId = fallbackId
      || values.name.trim().toUpperCase().replace(/\s+/g, '_')
      || `PM_${Date.now()}`;

    return {
      id: asBusinessId(candidateId),
      name: values.name.trim(),
      isActive: values.isActive,
      color: values.color?.trim() || undefined,
      icon: values.icon?.trim() || undefined,
      description: values.description?.trim() || undefined,
      accountNumber: values.accountNumber?.trim() || undefined,
      accountName: values.accountName?.trim() || undefined,
      bankName: values.bankName?.trim() || undefined,
    };
  };

  const handleFormSubmit = (values: PaymentMethodFormValues) => {
    try {
      const payload = normalizeValues(values, editingItem?.id);
      if (editingItem) {
        update(editingItem.systemId, payload);
        toast.success("Cập nhật thành công");
      } else {
        add(payload);
        toast.success("Thêm mới thành công");
      }
      setIsFormOpen(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra", {
        description: error instanceof Error ? error.message : "Lỗi không xác định",
      });
    }
  };

  const sortedMethods = React.useMemo(() => {
    return [...data].sort((a, b) => a.name.localeCompare(b.name));
  }, [data]);

  React.useEffect(() => {
    if (!isActive) {
      return;
    }

    onRegisterActions([
      <SettingsActionButton key="add-payment-method" onClick={handleAddNew}>
        <Plus className="mr-2 h-4 w-4" /> Thêm hình thức thanh toán
      </SettingsActionButton>,
    ]);
  }, [handleAddNew, isActive, onRegisterActions]);

  return (
    <div className="space-y-4">
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[110px]">Mã</TableHead>
              <TableHead>Tên & mô tả</TableHead>
              <TableHead className="w-[220px]">Thông tin tài khoản</TableHead>
              <TableHead className="w-[100px]">Mặc định</TableHead>
              <TableHead className="w-[100px]">Trạng thái</TableHead>
              <TableHead className="w-[80px] text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedMethods.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-sm text-muted-foreground">
                  Hãy thêm hình thức thanh toán đầu tiên
                </TableCell>
              </TableRow>
            ) : (
              sortedMethods.map((method) => {
                return (
                  <TableRow key={method.systemId}>
                    <TableCell className="font-mono text-xs uppercase text-muted-foreground">
                      {method.id ?? '—'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-3">
                        <div>
                          <p className="font-medium">{method.name}</p>
                          {method.description ? (
                            <p className="text-sm text-muted-foreground">{method.description}</p>
                          ) : null}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {method.accountName || method.accountNumber || method.bankName ? (
                        <div className="text-sm leading-relaxed">
                          {method.accountName && <p className="font-medium">{method.accountName}</p>}
                          {method.accountNumber && (
                            <p className="font-mono text-xs text-muted-foreground">{method.accountNumber}</p>
                          )}
                          {method.bankName && <p className="text-muted-foreground">{method.bankName}</p>}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch 
                        checked={method.isDefault} 
                        onCheckedChange={(checked) => handleToggleDefault(method, checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch 
                        checked={method.isActive} 
                        onCheckedChange={(checked) => handleToggleStatus(method, checked)}
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
                          <DropdownMenuItem onClick={() => handleEdit(method)}>
                            Chỉnh sửa
                          </DropdownMenuItem>
                          {!method.isDefault && (
                            <DropdownMenuItem onClick={() => handleSetDefault(method.systemId)}>
                              Đặt làm mặc định
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleDeleteRequest(method.systemId)}
                            className="text-destructive"
                          >
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
      </div>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
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
