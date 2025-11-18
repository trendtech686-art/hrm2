import * as React from "react";
import { useSalesChannelStore } from "./store.ts";
import { getColumns } from "./columns.tsx";
import type { SalesChannel } from "./types.ts";
import { SalesChannelForm, type SalesChannelFormValues } from "./form.tsx";
import { DataTable } from "../../../components/data-table/data-table.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../../components/ui/dialog.tsx";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../../components/ui/alert-dialog.tsx";

export function SalesChannelsPageContent() {
  const { data, add, update, remove } = useSalesChannelStore();
  
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<SalesChannel | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<string | null>(null);
  
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  
  const handleAddNew = () => { setEditingItem(null); setIsFormOpen(true); };
  const handleEdit = (item: SalesChannel) => { setEditingItem(item); setIsFormOpen(true); };
  const handleDeleteRequest = (id: string) => { setIdToDelete(id); setIsAlertOpen(true); };
  
  const confirmDelete = () => { if (idToDelete) remove(idToDelete); setIsAlertOpen(false); };
  
  const handleFormSubmit = (values: SalesChannelFormValues) => {
    if (editingItem) {
      update(editingItem.systemId, values);
    } else {
      add(values);
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
        <Button size="sm" onClick={handleAddNew}><PlusCircle className="mr-2 h-4 w-4" /> Thêm nguồn bán hàng</Button>
      </div>
        <DataTable
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
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Thoát</Button>
            <Button type="submit" form="sales-channel-form">{editingItem ? 'Lưu' : 'Thêm'}</Button>
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
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
