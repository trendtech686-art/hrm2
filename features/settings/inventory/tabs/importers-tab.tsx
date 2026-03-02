'use client'

import * as React from "react";
import { Plus } from "lucide-react";
import { asBusinessId, type SystemId } from "@/lib/id-types";
import { toast } from "sonner";

import { useImporters, useImporterMutations } from "../hooks/use-inventory-settings";
import { ImporterFormDialog, type ImporterFormValues } from "../importer-form-dialog";
import { getImporterColumns } from "../importer-columns";
import type { Importer } from "../types";
import type { RegisterTabActions } from "../../use-tab-action-registry";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { SimpleSettingsTable } from "@/components/settings/SimpleSettingsTable";
import { SettingsActionButton } from "@/components/settings/SettingsActionButton";

type TabContentProps = { isActive: boolean; onRegisterActions: RegisterTabActions };

export function ImportersTabContent({ isActive, onRegisterActions }: TabContentProps) {
  const { data: importersData } = useImporters();
  const data = React.useMemo(() => (importersData ?? []) as unknown as Importer[], [importersData]);
  const { create, update, remove } = useImporterMutations();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<Importer | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = React.useState(false);

  const activeImporters = React.useMemo(() => data.filter(b => !b.isDeleted), [data]);
  const existingIds = React.useMemo(() => activeImporters.map(b => b.id as string), [activeImporters]);

  const handleAdd = React.useCallback(() => { setEditingItem(null); setDialogOpen(true); }, []);
  const handleEdit = React.useCallback((item: Importer) => { setEditingItem(item); setDialogOpen(true); }, []);
  const handleDeleteRequest = React.useCallback((systemId: SystemId) => { setIdToDelete(systemId); setIsAlertOpen(true); }, []);
  const handleToggleActive = React.useCallback((item: Importer) => { const na = !item.isActive; update.mutate({ systemId: item.systemId, data: { isActive: na } }, { onSuccess: () => toast.success(na ? 'Đã kích hoạt' : 'Đã tắt'), onError: (err) => toast.error(err.message) }); }, [update]);
  const handleToggleDefault = React.useCallback((item: Importer) => { if (!item.isDefault) { update.mutate({ systemId: item.systemId, data: { isDefault: true } }, { onSuccess: () => toast.success('Đã đặt làm mặc định'), onError: (err) => toast.error(err.message) }); } }, [update]);
  const confirmDelete = () => { if (idToDelete) { remove.mutate(idToDelete, { onSuccess: () => toast.success('Đã xóa đơn vị nhập khẩu'), onError: (err) => toast.error(err.message) }); } setIsAlertOpen(false); setIdToDelete(null); };

  const handleBulkDelete = React.useCallback((selectedItems: { systemId: string }[]) => { if (selectedItems.length === 0) return; setIsBulkDeleteOpen(true); }, []);
  const confirmBulkDelete = () => { const selectedIds = Object.keys(rowSelection); selectedIds.forEach(id => { remove.mutate(id as SystemId); }); toast.success(`Đã xóa ${selectedIds.length} đơn vị nhập khẩu`); setRowSelection({}); setIsBulkDeleteOpen(false); };

  const handleSubmit = (values: ImporterFormValues) => {
    const payload = { ...values, id: asBusinessId(values.id) };
    if (editingItem) { update.mutate({ systemId: editingItem.systemId, data: payload }, { onSuccess: () => toast.success('Đã cập nhật đơn vị nhập khẩu'), onError: (err) => toast.error(err.message) }); }
    else { create.mutate(payload, { onSuccess: () => toast.success('Đã thêm đơn vị nhập khẩu mới'), onError: (err) => toast.error(err.message) }); }
    setDialogOpen(false);
  };

  const columns = React.useMemo(() => getImporterColumns({ onEdit: handleEdit, onDelete: handleDeleteRequest, onToggleActive: handleToggleActive, onToggleDefault: handleToggleDefault }), [handleDeleteRequest, handleEdit, handleToggleActive, handleToggleDefault]);

  const onRegisterActionsRef = React.useRef(onRegisterActions);
  React.useEffect(() => { onRegisterActionsRef.current = onRegisterActions; }, [onRegisterActions]);

  React.useEffect(() => { if (!isActive) return; onRegisterActionsRef.current([<SettingsActionButton key="add-importer" onClick={handleAdd}><Plus className="mr-2 h-4 w-4" /> Thêm đơn vị nhập khẩu</SettingsActionButton>]); }, [handleAdd, isActive]);

  return (
    <>
      <Card><CardHeader><div className="flex items-center justify-between"><div><CardTitle>Đơn vị nhập khẩu</CardTitle><CardDescription>Quản lý các đơn vị nhập khẩu để in tem phụ sản phẩm</CardDescription></div></div></CardHeader><CardContent><SimpleSettingsTable data={activeImporters} columns={columns} emptyTitle="Chưa có đơn vị nhập khẩu" emptyDescription="Thêm đơn vị nhập khẩu đầu tiên để in tem phụ sản phẩm" emptyAction={<Button size="sm" onClick={handleAdd}>Thêm đơn vị nhập khẩu</Button>} enableSelection rowSelection={rowSelection} setRowSelection={setRowSelection} onBulkDelete={handleBulkDelete} enablePagination pagination={{ pageSize: 10, showInfo: true }} /></CardContent></Card>
      <ImporterFormDialog open={dialogOpen} onOpenChange={setDialogOpen} initialData={editingItem} onSubmit={handleSubmit} existingIds={existingIds} />
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle><AlertDialogDescription>Hành động này không thể được hoàn tác.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Hủy</AlertDialogCancel><AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <AlertDialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Xóa {Object.keys(rowSelection).length} đơn vị nhập khẩu?</AlertDialogTitle><AlertDialogDescription>Hành động này không thể được hoàn tác.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Hủy</AlertDialogCancel><AlertDialogAction onClick={confirmBulkDelete}>Xóa</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </>
  );
}
