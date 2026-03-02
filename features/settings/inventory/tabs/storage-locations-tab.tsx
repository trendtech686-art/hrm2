'use client'

import * as React from "react";
import { Plus } from "lucide-react";
import { asBusinessId, type SystemId } from "@/lib/id-types";
import { toast } from "sonner";

import { useStorageLocationMutations, useAllStorageLocations } from "../hooks/use-storage-locations";
import { StorageLocationFormDialog, type StorageLocationFormValues } from "../storage-location-form-dialog";
import { getStorageLocationColumns } from "../storage-location-columns";
import type { StorageLocation } from "../storage-location-types";
import type { RegisterTabActions } from "../../use-tab-action-registry";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { SimpleSettingsTable } from "@/components/settings/SimpleSettingsTable";
import { SettingsActionButton } from "@/components/settings/SettingsActionButton";

type TabContentProps = { isActive: boolean; onRegisterActions: RegisterTabActions };

export function StorageLocationsTabContent({ isActive, onRegisterActions }: TabContentProps) {
  const { data: queryData } = useAllStorageLocations();
  const data = React.useMemo(() => queryData?.data ?? [], [queryData?.data]);
  const { create, update, remove } = useStorageLocationMutations();
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingLocation, setEditingLocation] = React.useState<StorageLocation | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = React.useState(false);

  const activeLocations = React.useMemo(() => data.filter(loc => !loc.isDeleted), [data]);
  const existingIds = React.useMemo(() => activeLocations.map(loc => loc.id), [activeLocations]);

  const handleAddNew = React.useCallback(() => { setEditingLocation(null); setIsFormOpen(true); }, []);
  const handleEdit = React.useCallback((loc: StorageLocation) => { setEditingLocation(loc); setIsFormOpen(true); }, []);
  const handleDeleteRequest = React.useCallback((systemId: SystemId) => { setIdToDelete(systemId); setIsAlertOpen(true); }, []);

  const handleToggleDefault = React.useCallback((loc: StorageLocation) => {
    data.forEach(l => { if (l.isDefault && l.systemId !== loc.systemId && !l.isDeleted) update.mutate({ systemId: l.systemId, data: { isDefault: false } }); });
    update.mutate({ systemId: loc.systemId, data: { isDefault: !loc.isDefault } });
    toast.success(loc.isDefault ? 'Đã bỏ mặc định' : 'Đã đặt làm mặc định');
  }, [data, update]);

  const handleToggleActive = React.useCallback((loc: StorageLocation) => { const na = !loc.isActive; update.mutate({ systemId: loc.systemId, data: { isActive: na } }, { onSuccess: () => toast.success(na ? 'Đã kích hoạt' : 'Đã tắt'), onError: (err) => toast.error(err.message) }); }, [update]);
  const confirmDelete = () => { if (idToDelete) { remove.mutate(idToDelete, { onSuccess: () => toast.success('Đã xóa điểm lưu kho'), onError: (err) => toast.error(err.message) }); } setIsAlertOpen(false); setIdToDelete(null); };

  const handleBulkDelete = React.useCallback((selectedItems: { systemId: string }[]) => { if (selectedItems.length === 0) return; setIsBulkDeleteOpen(true); }, []);
  const confirmBulkDelete = () => { const selectedIds = Object.keys(rowSelection); selectedIds.forEach(id => { remove.mutate(id as SystemId); }); toast.success(`Đã xóa ${selectedIds.length} điểm lưu kho`); setRowSelection({}); setIsBulkDeleteOpen(false); };

  const handleFormSubmit = (values: StorageLocationFormValues) => {
    const payload = { ...values, id: asBusinessId(values.id), isActive: values.isActive ?? true };
    if (editingLocation) { update.mutate({ systemId: editingLocation.systemId, data: payload }, { onSuccess: () => toast.success('Đã cập nhật điểm lưu kho'), onError: (err) => toast.error(err.message) }); }
    else { create.mutate({ ...payload, isActive: values.isActive ?? true, isDeleted: false }, { onSuccess: () => toast.success('Đã thêm điểm lưu kho mới'), onError: (err) => toast.error(err.message) }); }
    setIsFormOpen(false);
  };

  const columns = React.useMemo(() => getStorageLocationColumns({ onEdit: handleEdit, onDelete: handleDeleteRequest, onToggleDefault: handleToggleDefault, onToggleActive: handleToggleActive }), [handleDeleteRequest, handleEdit, handleToggleDefault, handleToggleActive]);

  const onRegisterActionsRef = React.useRef(onRegisterActions);
  React.useEffect(() => { onRegisterActionsRef.current = onRegisterActions; }, [onRegisterActions]);

  React.useEffect(() => { if (!isActive) return; onRegisterActionsRef.current([<SettingsActionButton key="add-storage-location" onClick={handleAddNew}><Plus className="mr-2 h-4 w-4" /> Thêm điểm lưu kho</SettingsActionButton>]); }, [handleAddNew, isActive]);

  return (
    <>
      <Card><CardHeader className="flex flex-row items-center justify-between"><div><CardTitle>Điểm lưu kho</CardTitle><CardDescription>Quản lý các điểm lưu kho trong kho hàng</CardDescription></div></CardHeader><CardContent><SimpleSettingsTable data={activeLocations} columns={columns} emptyTitle="Chưa có điểm lưu kho" emptyDescription="Thêm điểm lưu kho đầu tiên để quản lý vị trí hàng hóa" emptyAction={<Button size="sm" onClick={handleAddNew}>Thêm điểm lưu kho</Button>} enableSelection rowSelection={rowSelection} setRowSelection={setRowSelection} onBulkDelete={handleBulkDelete} enablePagination pagination={{ pageSize: 10, showInfo: true }} /></CardContent></Card>
      <StorageLocationFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} initialData={editingLocation} onSubmit={handleFormSubmit} existingIds={existingIds} />
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Xác nhận xóa</AlertDialogTitle><AlertDialogDescription>Bạn có chắc chắn muốn xóa điểm lưu kho này?</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel onClick={() => setIsAlertOpen(false)}>Hủy</AlertDialogCancel><AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <AlertDialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Xóa {Object.keys(rowSelection).length} điểm lưu kho?</AlertDialogTitle><AlertDialogDescription>Hành động này không thể được hoàn tác.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Hủy</AlertDialogCancel><AlertDialogAction onClick={confirmBulkDelete}>Xóa</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </>
  );
}
