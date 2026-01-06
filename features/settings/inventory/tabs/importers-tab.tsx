'use client'

import * as React from "react";
import { Plus } from "lucide-react";
import { asBusinessId, type SystemId } from "@/lib/id-types";
import { toast } from "sonner";

import { useImporterStore } from "../importer-store";
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
  const { data, add, update, remove, setDefault } = useImporterStore();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<Importer | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);

  const activeImporters = React.useMemo(() => data.filter(b => !b.isDeleted), [data]);
  const existingIds = React.useMemo(() => activeImporters.map(b => b.id), [activeImporters]);

  const handleAdd = React.useCallback(() => { setEditingItem(null); setDialogOpen(true); }, []);
  const handleEdit = React.useCallback((item: Importer) => { setEditingItem(item); setDialogOpen(true); }, []);
  const handleDeleteRequest = React.useCallback((systemId: SystemId) => { setIdToDelete(systemId); setIsAlertOpen(true); }, []);
  const handleToggleActive = React.useCallback((item: Importer) => { const na = !item.isActive; update(item.systemId, { ...item, isActive: na }); toast.success(na ? 'Đã kích hoạt' : 'Đã tắt'); }, [update]);
  const handleToggleDefault = React.useCallback((item: Importer) => { if (!item.isDefault) { setDefault(item.systemId); toast.success('Đã đặt làm mặc định'); } }, [setDefault]);
  const confirmDelete = () => { if (idToDelete) { remove(idToDelete); toast.success('Đã xóa đơn vị nhập khẩu'); } setIsAlertOpen(false); setIdToDelete(null); };

  const handleSubmit = (values: ImporterFormValues) => {
    const payload = { ...values, id: asBusinessId(values.id) };
    if (editingItem) { update(editingItem.systemId, payload); toast.success('Đã cập nhật đơn vị nhập khẩu'); }
    else { add(payload); toast.success('Đã thêm đơn vị nhập khẩu mới'); }
    setDialogOpen(false);
  };

  const columns = React.useMemo(() => getImporterColumns({ onEdit: handleEdit, onDelete: handleDeleteRequest, onToggleActive: handleToggleActive, onToggleDefault: handleToggleDefault }), [handleDeleteRequest, handleEdit, handleToggleActive, handleToggleDefault]);

  React.useEffect(() => { if (!isActive) return; onRegisterActions([<SettingsActionButton key="add-importer" onClick={handleAdd}><Plus className="mr-2 h-4 w-4" /> Thêm đơn vị nhập khẩu</SettingsActionButton>]); }, [handleAdd, isActive, onRegisterActions]);

  return (
    <>
      <Card><CardHeader><div className="flex items-center justify-between"><div><CardTitle>Đơn vị nhập khẩu</CardTitle><CardDescription>Quản lý các đơn vị nhập khẩu để in tem phụ sản phẩm</CardDescription></div></div></CardHeader><CardContent><SimpleSettingsTable data={activeImporters} columns={columns} emptyTitle="Chưa có đơn vị nhập khẩu" emptyDescription="Thêm đơn vị nhập khẩu đầu tiên để in tem phụ sản phẩm" emptyAction={<Button size="sm" onClick={handleAdd}>Thêm đơn vị nhập khẩu</Button>} /></CardContent></Card>
      <ImporterFormDialog open={dialogOpen} onOpenChange={setDialogOpen} initialData={editingItem} onSubmit={handleSubmit} existingIds={existingIds} />
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle><AlertDialogDescription>Hành động này không thể được hoàn tác.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Hủy</AlertDialogCancel><AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </>
  );
}
