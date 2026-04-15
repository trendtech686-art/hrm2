'use client'

import * as React from "react";
import { Plus } from "lucide-react";
import { asBusinessId, type SystemId } from "@/lib/id-types";
import { toast } from "sonner";

import { useProductTypeMutations } from "../hooks/use-product-types";
import { useAllProductTypes } from "../hooks/use-all-product-types";
import { ProductTypeFormDialog, type ProductTypeFormValues } from "../setting-form-dialogs";
import { getProductTypeColumns } from "../product-type-columns";
import type { ProductType } from "../types";
import type { RegisterTabActions } from "../../use-tab-action-registry";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { SimpleSettingsTable } from "@/components/settings/SimpleSettingsTable";
import { SettingsActionButton } from "@/components/settings/SettingsActionButton";

type TabContentProps = { isActive: boolean; onRegisterActions: RegisterTabActions };

export function ProductTypesTabContent({ isActive, onRegisterActions }: TabContentProps) {
  const { data } = useAllProductTypes();
  const { create, update, remove } = useProductTypeMutations();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<ProductType | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = React.useState(false);

  const activeProductTypes = React.useMemo(() => data.filter(t => !t.isDeleted), [data]);
  const existingIds = React.useMemo(() => activeProductTypes.map(t => t.id), [activeProductTypes]);

  const handleAdd = React.useCallback(() => { setEditingItem(null); setDialogOpen(true); }, []);
  const handleEdit = React.useCallback((item: ProductType) => { setEditingItem(item); setDialogOpen(true); }, []);
  const handleDeleteRequest = React.useCallback((systemId: SystemId) => { setIdToDelete(systemId); setIsAlertOpen(true); }, []);

  const handleToggleDefault = React.useCallback((item: ProductType) => {
    data.forEach(t => { if (t.isDefault && t.systemId !== item.systemId && !t.isDeleted) update.mutate({ systemId: t.systemId, data: { isDefault: false } }); });
    update.mutate({ systemId: item.systemId, data: { isDefault: !item.isDefault } }, {
      onSuccess: () => toast.success(item.isDefault ? 'Đã bỏ mặc định' : 'Đã đặt làm mặc định'),
    });
  }, [data, update]);

  const handleToggleActive = React.useCallback((item: ProductType) => { const na = item.isActive === false ? true : false; update.mutate({ systemId: item.systemId, data: { isActive: na } }, { onSuccess: () => toast.success(na ? 'Đã kích hoạt' : 'Đã tắt'), onError: (err) => toast.error(err.message) }); }, [update]);
  const confirmDelete = () => { if (idToDelete) { remove.mutate(idToDelete, { onSuccess: () => toast.success('Đã xóa loại sản phẩm'), onError: (err) => toast.error(err.message) }); } setIsAlertOpen(false); setIdToDelete(null); };

  const handleBulkDelete = React.useCallback((selectedItems: { systemId: string }[]) => { if (selectedItems.length === 0) return; setIsBulkDeleteOpen(true); }, []);
  const confirmBulkDelete = () => { const selectedIds = Object.keys(rowSelection); const count = selectedIds.length; selectedIds.forEach((id, i) => { remove.mutate(id as SystemId, i === count - 1 ? { onSuccess: () => toast.success(`Đã xóa ${count} loại sản phẩm`) } : undefined); }); setRowSelection({}); setIsBulkDeleteOpen(false); };

  const handleSubmit = (values: ProductTypeFormValues) => {
    const payload = { ...values, id: asBusinessId(values.id) };
    if (editingItem) { update.mutate({ systemId: editingItem.systemId, data: payload }, { onSuccess: () => toast.success('Đã cập nhật loại sản phẩm'), onError: (err) => toast.error(err.message) }); }
    else { create.mutate(payload, { onSuccess: () => toast.success('Đã thêm loại sản phẩm mới'), onError: (err) => toast.error(err.message) }); }
    setDialogOpen(false);
  };

  const columns = React.useMemo(() => getProductTypeColumns({ onEdit: handleEdit, onDelete: handleDeleteRequest, onToggleDefault: handleToggleDefault, onToggleActive: handleToggleActive }), [handleDeleteRequest, handleEdit, handleToggleDefault, handleToggleActive]);

  const onRegisterActionsRef = React.useRef(onRegisterActions);
  React.useEffect(() => { onRegisterActionsRef.current = onRegisterActions; }, [onRegisterActions]);

  React.useEffect(() => { if (!isActive) return; onRegisterActionsRef.current([<SettingsActionButton key="add-product-type" onClick={handleAdd}><Plus className="mr-2 h-4 w-4" /> Thêm loại sản phẩm</SettingsActionButton>]); }, [handleAdd, isActive]);

  return (
    <>
      <Card><CardHeader><div className="flex items-center justify-between"><div><CardTitle>Loại sản phẩm</CardTitle><CardDescription>Quản lý các loại sản phẩm: Hàng hóa, Dịch vụ, Digital</CardDescription></div></div></CardHeader><CardContent><SimpleSettingsTable data={activeProductTypes} columns={columns} emptyTitle="Chưa có loại sản phẩm" emptyDescription="Thêm loại sản phẩm đầu tiên để cấu hình tồn kho" emptyAction={<Button size="sm" onClick={handleAdd}>Thêm loại sản phẩm</Button>} enableSelection rowSelection={rowSelection} setRowSelection={setRowSelection} onBulkDelete={handleBulkDelete} enablePagination pagination={{ pageSize: 10, showInfo: true }} /></CardContent></Card>
      <ProductTypeFormDialog open={dialogOpen} onOpenChange={setDialogOpen} initialData={editingItem} onSubmit={handleSubmit} existingIds={existingIds} />
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle><AlertDialogDescription>Hành động này không thể được hoàn tác.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Hủy</AlertDialogCancel><AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <AlertDialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Xóa {Object.keys(rowSelection).length} loại sản phẩm?</AlertDialogTitle><AlertDialogDescription>Hành động này không thể được hoàn tác.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Hủy</AlertDialogCancel><AlertDialogAction onClick={confirmBulkDelete}>Xóa</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </>
  );
}
