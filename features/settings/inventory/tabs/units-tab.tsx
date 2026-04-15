'use client'

import * as React from "react";
import { Plus } from "lucide-react";
import { asBusinessId, type SystemId } from "@/lib/id-types";
import { toast } from "sonner";

import { useUnitMutations } from "../../units/hooks/use-units";
import { useAllUnits } from "../../units/hooks/use-all-units";
import { UnitForm, type UnitFormValues } from "../../units/form";
import { getUnitColumns } from "../../units/columns";
import type { Unit } from "../../units/types";
import type { RegisterTabActions } from "../../use-tab-action-registry";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { SimpleSettingsTable } from "@/components/settings/SimpleSettingsTable";
import { SettingsActionButton } from "@/components/settings/SettingsActionButton";

type TabContentProps = { isActive: boolean; onRegisterActions: RegisterTabActions };

export function UnitsTabContent({ isActive, onRegisterActions }: TabContentProps) {
  const { data } = useAllUnits();
  const { create, update, remove } = useUnitMutations({
    onError: (err) => toast.error(err.message)
  });
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingUnit, setEditingUnit] = React.useState<Unit | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = React.useState(false);

  const handleAddNew = React.useCallback(() => { setEditingUnit(null); setIsFormOpen(true); }, []);
  const handleEdit = React.useCallback((unit: Unit) => { setEditingUnit(unit); setIsFormOpen(true); }, []);
  const handleDeleteRequest = React.useCallback((systemId: SystemId) => { setIdToDelete(systemId); setIsAlertOpen(true); }, []);
  
  const handleToggleDefault = React.useCallback((unit: Unit, checked: boolean) => {
    if (checked) {
      data.forEach(u => { if (u.isDefault && u.systemId !== unit.systemId) update.mutate({ systemId: u.systemId, data: { ...u, isDefault: false } }); });
      update.mutate({ systemId: unit.systemId, data: { ...unit, isDefault: true } }, {
        onSuccess: () => toast.success(`Đã đặt "${unit.name}" làm mặc định`),
      });
    } else {
      const otherUnits = data.filter(u => u.systemId !== unit.systemId && u.isActive !== false);
      if (otherUnits.length > 0) { const nd = otherUnits[0]; update.mutate({ systemId: unit.systemId, data: { ...unit, isDefault: false } }); update.mutate({ systemId: nd.systemId, data: { ...nd, isDefault: true } }, { onSuccess: () => toast.success(`Đã chuyển mặc định sang "${nd.name}"`), }); }
      else toast.error('Phải có ít nhất một đơn vị tính mặc định');
    }
  }, [data, update]);

  const handleToggleActive = React.useCallback((unit: Unit) => { const na = unit.isActive === false ? true : false; update.mutate({ systemId: unit.systemId, data: { ...unit, isActive: na } }, { onSuccess: () => toast.success(na ? 'Đã kích hoạt' : 'Đã tắt'), }); }, [update]);

  // Stabilize onRegisterActions with ref to prevent infinite loop
  const onRegisterActionsRef = React.useRef(onRegisterActions);
  React.useEffect(() => { onRegisterActionsRef.current = onRegisterActions; }, [onRegisterActions]);
  const confirmDelete = () => { if (idToDelete) { remove.mutate(idToDelete); } setIsAlertOpen(false); setIdToDelete(null); };

  const handleBulkDelete = React.useCallback((selectedItems: { systemId: string }[]) => { if (selectedItems.length === 0) return; setIsBulkDeleteOpen(true); }, []);
  const confirmBulkDelete = () => { const selectedIds = Object.keys(rowSelection); const count = selectedIds.length; selectedIds.forEach((id, i) => { remove.mutate(id as SystemId, i === count - 1 ? { onSuccess: () => toast.success(`Đã xóa ${count} đơn vị tính`), } : undefined); }); setRowSelection({}); setIsBulkDeleteOpen(false); };
  
  const handleFormSubmit = (values: UnitFormValues) => {
    const payload = { ...values, id: asBusinessId(values.id) };
    if (editingUnit) {
      update.mutate({ systemId: editingUnit.systemId, data: { ...editingUnit, ...payload } }, {
        onSuccess: () => toast.success('Đã cập nhật đơn vị tính'),
      });
    }
    else {
      create.mutate(payload, {
        onSuccess: () => toast.success('Đã thêm đơn vị tính mới'),
      });
    }
    setIsFormOpen(false);
  };

  const columns = React.useMemo(() => getUnitColumns({ onEdit: handleEdit, onDelete: handleDeleteRequest, onToggleDefault: handleToggleDefault, onToggleActive: handleToggleActive }), [handleDeleteRequest, handleEdit, handleToggleDefault, handleToggleActive]);
  const sortedData = React.useMemo(() => [...data].sort((a, b) => a.name.localeCompare(b.name)), [data]);
  
  const actionButton = React.useMemo(() => [
    <SettingsActionButton key="add-unit" onClick={handleAddNew}>
      <Plus className="mr-2 h-4 w-4" /> Thêm đơn vị tính
    </SettingsActionButton>
  ], [handleAddNew]);

  React.useEffect(() => { 
    if (!isActive) return; 
    onRegisterActionsRef.current(actionButton); 
  }, [actionButton, isActive]);

  return (
    <>
      <Card><CardHeader><div className="flex items-center justify-between"><div><CardTitle>Danh sách Đơn vị tính</CardTitle><CardDescription>Quản lý các đơn vị tính được sử dụng cho sản phẩm.</CardDescription></div></div></CardHeader><CardContent><SimpleSettingsTable data={sortedData} columns={columns} emptyTitle="Chưa có đơn vị tính" emptyDescription="Thêm đơn vị đầu tiên để chuẩn hóa quy đổi sản phẩm" emptyAction={<Button size="sm" onClick={handleAddNew}>Thêm đơn vị tính</Button>} enableSelection rowSelection={rowSelection} setRowSelection={setRowSelection} onBulkDelete={handleBulkDelete} enablePagination pagination={{ pageSize: 10, showInfo: true }} /></CardContent></Card>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}><DialogContent><DialogHeader><DialogTitle>{editingUnit ? 'Chỉnh sửa Đơn vị tính' : 'Thêm Đơn vị tính'}</DialogTitle></DialogHeader><UnitForm initialData={editingUnit} onSubmit={handleFormSubmit} /><DialogFooter><Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Hủy</Button><Button type="submit" form="unit-form">Lưu</Button></DialogFooter></DialogContent></Dialog>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle><AlertDialogDescription>Hành động này không thể được hoàn tác.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Hủy</AlertDialogCancel><AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
      <AlertDialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Xóa {Object.keys(rowSelection).length} đơn vị tính?</AlertDialogTitle><AlertDialogDescription>Hành động này không thể được hoàn tác.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Hủy</AlertDialogCancel><AlertDialogAction onClick={confirmBulkDelete}>Xóa</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </>
  );
}
