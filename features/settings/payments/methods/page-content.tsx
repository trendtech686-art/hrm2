/**
 * Payment Methods Page Content
 * 
 * @see docs/SETTINGS-ACTION-PATTERN.md
 */

import * as React from "react";
import { Plus } from "lucide-react";
import { usePaymentMethods, usePaymentMethodMutations } from "./hooks/use-payment-methods";
import type { PaymentMethod } from "@/lib/types/prisma-extended";
import { PaymentMethodForm, type PaymentMethodFormValues } from "./form";
import { getPaymentMethodColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { asBusinessId, type SystemId } from "@/lib/id-types";
import { SimpleSettingsTable } from "@/components/settings/SimpleSettingsTable";
import { SettingsActionButton } from "@/components/settings/SettingsActionButton";
import type { RegisterTabActions } from "../../use-tab-action-registry";

type Props = {
  isActive: boolean;
  onRegisterActions: RegisterTabActions;
};

export function PaymentMethodsPageContent({ isActive, onRegisterActions }: Props) {
  // === STATE ===
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<PaymentMethod | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = React.useState(false);

  // === DATA ===
  const { data: queryData } = usePaymentMethods({});
  const data = React.useMemo(() => queryData?.data ?? [], [queryData?.data]);
  const { create, update, remove } = usePaymentMethodMutations({
    onSuccess: () => toast.success("Thao tác thành công"),
    onError: (err) => toast.error(err.message),
  });

  // === ACTIONS REF (để tránh stale closure) ===
  // Handler cần được định nghĩa TRƯỚC để có thể assign vào ref
  const openAddForm = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };
  
  // Ref được update MỖI RENDER để luôn có handler mới nhất
  const actionsRef = React.useRef({ openAddForm });
  actionsRef.current.openAddForm = openAddForm;

  // === REGISTER HEADER ACTIONS ===
  React.useLayoutEffect(() => {
    if (!isActive) return;
    onRegisterActions([
      <SettingsActionButton key="add" onClick={() => actionsRef.current.openAddForm()}>
        <Plus className="mr-2 h-4 w-4" /> Thêm hình thức thanh toán
      </SettingsActionButton>,
    ]);
  }, [isActive, onRegisterActions]);

  // === HANDLERS ===
  const handleEdit = (item: PaymentMethod) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDeleteRequest = (systemId: SystemId) => {
    setIdToDelete(systemId);
    setIsAlertOpen(true);
  };

  const handleToggleStatus = (item: PaymentMethod, isActive: boolean) => {
    update.mutate({ systemId: item.systemId, data: { isActive } });
  };

  const handleToggleDefault = (item: PaymentMethod, isDefault: boolean) => {
    if (isDefault) {
      // API sẽ tự động tắt mặc định của các item khác
      update.mutate({ systemId: item.systemId, data: { isDefault: true } });
    } else {
      // Không cho phép tắt mặc định - phải chọn item khác làm mặc định
      const other = data.find((d) => d.systemId !== item.systemId && d.isActive);
      if (other) {
        update.mutate({ systemId: other.systemId, data: { isDefault: true } });
      } else {
        toast.error("Phải có ít nhất một hình thức thanh toán mặc định");
      }
    }
  };

  const handleSetDefault = (systemId: SystemId) => {
    update.mutate({ systemId, data: { isDefault: true } });
  };

  const confirmDelete = () => {
    if (idToDelete) {
      remove.mutate(idToDelete);
    }
    setIsAlertOpen(false);
    setIdToDelete(null);
  };

  const handleBulkDelete = (selectedItems: { systemId: string }[]) => {
    if (selectedItems.length === 0) return;
    setIsBulkDeleteOpen(true);
  };

  const confirmBulkDelete = () => {
    Object.keys(rowSelection).forEach((id) => remove.mutate(id as SystemId));
    setRowSelection({});
    setIsBulkDeleteOpen(false);
  };

  const handleFormSubmit = (values: PaymentMethodFormValues) => {
    const payload = {
      id: asBusinessId(values.id?.trim().toUpperCase() || values.name.trim().toUpperCase().replace(/\s+/g, "_")),
      name: values.name.trim(),
      isActive: values.isActive,
      description: values.description?.trim() || undefined,
    };

    if (editingItem) {
      update.mutate({ systemId: editingItem.systemId, data: payload });
    } else {
      create.mutate({ ...payload, isDefault: false });
    }
    setIsFormOpen(false);
  };

  // === COLUMNS ===
  const columns = React.useMemo(
    () =>
      getPaymentMethodColumns({
        onEdit: handleEdit,
        onDelete: handleDeleteRequest,
        onToggleStatus: handleToggleStatus,
        onToggleDefault: handleToggleDefault,
        onSetDefault: handleSetDefault,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  );

  const selectedCount = Object.keys(rowSelection).length;

  // === RENDER ===
  return (
    <div className="space-y-4">
      <SimpleSettingsTable
        data={data}
        columns={columns}
        emptyTitle="Chưa có hình thức thanh toán"
        emptyDescription="Thêm hình thức thanh toán đầu tiên"
        emptyAction={
          <Button size="sm" onClick={() => actionsRef.current.openAddForm()}>
            Thêm hình thức thanh toán
          </Button>
        }
        enableSelection
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        onBulkDelete={handleBulkDelete}
        enablePagination
        pagination={{ pageSize: 10, showInfo: true }}
      />

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? "Cập nhật" : "Thêm mới"}</DialogTitle>
          </DialogHeader>
          <PaymentMethodForm initialData={editingItem} onSubmit={handleFormSubmit} formRef={formRef} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Đóng
            </Button>
            <Button type="submit" form="payment-method-form">
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa?</AlertDialogTitle>
            <AlertDialogDescription>Hành động này không thể hoàn tác.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete */}
      <AlertDialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa {selectedCount} mục?</AlertDialogTitle>
            <AlertDialogDescription>Hành động này không thể hoàn tác.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkDelete} className="bg-destructive text-destructive-foreground">
              Xóa tất cả
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
