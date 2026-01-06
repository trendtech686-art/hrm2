'use client'

import * as React from "react";
import { Plus } from "lucide-react";
import { asBusinessId, type SystemId } from "@/lib/id-types";
import { toast } from "sonner";

import { useStorageLocationStore } from "../storage-location-store";
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
  const { data, add, update, remove } = useStorageLocationStore();
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingLocation, setEditingLocation] = React.useState<StorageLocation | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);

  const activeLocations = React.useMemo(() => data.filter(loc => !loc.isDeleted), [data]);
  const existingIds = React.useMemo(() => activeLocations.map(loc => loc.id), [activeLocations]);

  const handleAddNew = React.useCallback(() => { setEditingLocation(null); setIsFormOpen(true); }, []);
  const handleEdit = React.useCallback((loc: StorageLocation) => { setEditingLocation(loc); setIsFormOpen(true); }, []);
  const handleDeleteRequest = React.useCallback((systemId: SystemId) => { setIdToDelete(systemId); setIsAlertOpen(true); }, []);

  const handleToggleDefault = React.useCallback((loc: StorageLocation) => {
    data.forEach(l => { if (l.isDefault && l.systemId !== loc.systemId && !l.isDeleted) update(l.systemId, { ...l, isDefault: false }); });
    update(loc.systemId, { ...loc, isDefault: !loc.isDefault });
    toast.success(loc.isDefault ? 'Đã bỏ mặc định' : 'Đã đặt làm mặc định');
  }, [data, update]);

  const handleToggleActive = React.useCallback((loc: StorageLocation) => { const na = !loc.isActive; update(loc.systemId, { ...loc, isActive: na }); toast.success(na ? 'Đã kích hoạt' : 'Đã tắt'); }, [update]);
  const confirmDelete = () => { if (idToDelete) { remove(idToDelete); toast.success('Đã xóa điểm lưu kho'); } setIsAlertOpen(false); setIdToDelete(null); };

  const handleFormSubmit = (values: StorageLocationFormValues) => {
    const payload = { ...values, id: asBusinessId(values.id), isActive: values.isActive ?? true };
    if (editingLocation) { update(editingLocation.systemId, payload); toast.success('Đã cập nhật điểm lưu kho'); }
    else { add({ ...payload, isActive: values.isActive ?? true, isDeleted: false }); toast.success('Đã thêm điểm lưu kho mới'); }
    setIsFormOpen(false);
  };

  const columns = React.useMemo(() => getStorageLocationColumns({ onEdit: handleEdit, onDelete: handleDeleteRequest, onToggleDefault: handleToggleDefault, onToggleActive: handleToggleActive }), [handleDeleteRequest, handleEdit, handleToggleDefault, handleToggleActive]);

  React.useEffect(() => { if (!isActive) return; onRegisterActions([<SettingsActionButton key="add-storage-location" onClick={handleAddNew}><Plus className="mr-2 h-4 w-4" /> Thêm điểm lưu kho</SettingsActionButton>]); }, [handleAddNew, isActive, onRegisterActions]);

  return (
    <>
      <Card><CardHeader className="flex flex-row items-center justify-between"><div><CardTitle>Điểm lưu kho</CardTitle><CardDescription>Quản lý các điểm lưu kho trong kho hàng</CardDescription></div></CardHeader><CardContent><SimpleSettingsTable data={activeLocations} columns={columns} emptyTitle="Chưa có điểm lưu kho" emptyDescription="Thêm điểm lưu kho đầu tiên để quản lý vị trí hàng hóa" emptyAction={<Button size="sm" onClick={handleAddNew}>Thêm điểm lưu kho</Button>} /></CardContent></Card>
      <StorageLocationFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} initialData={editingLocation} onSubmit={handleFormSubmit} existingIds={existingIds} />
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Xác nhận xóa</AlertDialogTitle><AlertDialogDescription>Bạn có chắc chắn muốn xóa điểm lưu kho này?</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel onClick={() => setIsAlertOpen(false)}>Hủy</AlertDialogCancel><AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </>
  );
}
