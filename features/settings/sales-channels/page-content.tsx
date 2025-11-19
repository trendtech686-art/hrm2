import * as React from "react";
import { useSalesChannelStore } from "./store.ts";
import { getColumns } from "./columns.tsx";
import type { SalesChannel } from "./types.ts";
import { SalesChannelForm, type SalesChannelFormValues } from "./form.tsx";
import { ResponsiveDataTable } from "../../../components/data-table/responsive-data-table.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog.tsx";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../../components/ui/alert-dialog.tsx";
import { asBusinessId, type SystemId } from "@/lib/id-types";

export function SalesChannelsPageContent() {
  const { data, add, update, remove } = useSalesChannelStore();
  
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<SalesChannel | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);
  
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  
  const handleAddNew = React.useCallback(() => { setEditingItem(null); setIsFormOpen(true); }, []);
  const handleEdit = React.useCallback((item: SalesChannel) => { setEditingItem(item); setIsFormOpen(true); }, []);
  const handleDeleteRequest = React.useCallback((id: SystemId) => { setIdToDelete(id); setIsAlertOpen(true); }, []);
  
  const confirmDelete = React.useCallback(() => {
    if (idToDelete) {
      remove(idToDelete);
    }
    setIsAlertOpen(false);
    setIdToDelete(null);
  }, [idToDelete, remove]);
  
  const handleFormSubmit = (values: SalesChannelFormValues) => {
    const normalizedId = values.id.trim().toUpperCase();
    const businessId = normalizedId
      ? asBusinessId(normalizedId)
      : editingItem
        ? editingItem.id
        : asBusinessId("");

    const payload = {
      id: businessId,
      name: values.name.trim(),
      isApplied: values.isApplied,
      isDefault: values.isDefault,
    };

    if (editingItem) {
      const updated: SalesChannel = {
        ...editingItem,
        ...payload,
      };
      update(editingItem.systemId, updated);
    } else {
      add(payload);
    }
    setIsFormOpen(false);
  };
  
  const columns = React.useMemo(() => getColumns(handleEdit, handleDeleteRequest), [handleEdit, handleDeleteRequest]);
  
  React.useEffect(() => {
    const initialVisibility: Record<string, boolean> = {};
    columns.forEach(c => {
        if (c.id) initialVisibility[c.id] = true;
    });
    setColumnVisibility(initialVisibility);
  }, [columns]);
  
  const pageCount = Math.ceil(data.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => data.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize), [data, pagination]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Bên cạnh một số nguồn phổ biến nhất mà Sapo đã có sẵn, bạn có thể cập nhật hoặc thêm mới các nguồn tạo ra đơn hàng của cửa hàng bạn.</p>
        <Button size="sm" onClick={handleAddNew} className="h-9"><PlusCircle className="mr-2 h-4 w-4" /> Thêm nguồn bán hàng</Button>
      </div>
        <ResponsiveDataTable
            columns={columns} data={paginatedData} pageCount={pageCount}
            pagination={pagination} setPagination={setPagination} rowCount={data.length}
            rowSelection={{}} setRowSelection={() => {}}
            sorting={{id: '', desc: false}} setSorting={() => {}}
            allSelectedRows={[]} expanded={{}} setExpanded={() => {}} 
            columnVisibility={columnVisibility} setColumnVisibility={setColumnVisibility} 
            columnOrder={[]} setColumnOrder={()=>{}} pinnedColumns={[]} setPinnedColumns={()=>{}}
        />
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Cập nhật nguồn bán hàng' : 'Thêm nguồn bán hàng'}</DialogTitle>
          </DialogHeader>
          <SalesChannelForm initialData={editingItem} onSubmit={handleFormSubmit} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} className="h-9">Thoát</Button>
            <Button type="submit" form="sales-channel-form" className="h-9">{editingItem ? 'Lưu' : 'Thêm'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>Hành động này không thể được hoàn tác.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-9">Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="h-9">Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
