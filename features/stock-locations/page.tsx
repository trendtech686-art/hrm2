import * as React from 'react';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { useStockLocationStore } from './store.ts';
import { useBranchStore } from '../settings/branches/store.ts';
import type { StockLocation } from './types.ts';
import { StockLocationForm, type StockLocationFormValues } from './form.tsx';
import { getColumns } from './columns.tsx';
import { DataTable } from '../../components/data-table/data-table.tsx';
import { Button } from '../../components/ui/button.tsx';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog.tsx';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.tsx';

export function StockLocationsPage() {
  const { data, add, update, remove } = useStockLocationStore();
  const { data: branches } = useBranchStore();
  
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<StockLocation | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<string | null>(null);
  
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>(() => {
    const storageKey = 'stock-locations-column-visibility';
    const stored = localStorage.getItem(storageKey);
    const cols = getColumns(() => {}, () => {}, branches);
    const allColumnIds = cols.map(c => c.id).filter(Boolean);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (allColumnIds.every(id => id in parsed)) return parsed;
      } catch (e) {}
    }
    const initial: Record<string, boolean> = {};
    cols.forEach(c => { if (c.id) initial[c.id] = true; });
    return initial;
  });
  
  React.useEffect(() => {
    localStorage.setItem('stock-locations-column-visibility', JSON.stringify(columnVisibility));
  }, [columnVisibility]);
  
  const handleAddNew = React.useCallback(() => { setEditingItem(null); setIsFormOpen(true); }, []);
  const handleEdit = React.useCallback((item: StockLocation) => { setEditingItem(item); setIsFormOpen(true); }, []);
  const handleDeleteRequest = React.useCallback((id: string) => { setIdToDelete(id); setIsAlertOpen(true); }, []);
  
  usePageHeader({
    actions: [
      <Button key="add" onClick={handleAddNew}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Thêm điểm lưu kho
      </Button>
    ]
  });
  
  const confirmDelete = () => { if (idToDelete) remove(idToDelete); setIsAlertOpen(false); };
  
  const handleFormSubmit = (values: StockLocationFormValues) => {
    if (editingItem) {
      update(editingItem.systemId, { ...editingItem, ...values });
    } else {
      add(values);
    }
    setIsFormOpen(false);
  };
  
  const columns = React.useMemo(() => getColumns(handleEdit, handleDeleteRequest, branches), [handleEdit, handleDeleteRequest, branches]);
  
  const pageCount = Math.ceil(data.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => data.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize), [data, pagination]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách Điểm lưu kho</CardTitle>
              <CardDescription>Quản lý các vị trí lưu trữ hàng hóa trong từng chi nhánh.</CardDescription>
            </div>
            <Button size="sm" onClick={handleAddNew}><PlusCircle className="mr-2 h-4 w-4" /> Thêm điểm lưu kho</Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={paginatedData}
            pageCount={pageCount}
            pagination={pagination}
            setPagination={setPagination}
            rowCount={data.length}
            rowSelection={{}}
            setRowSelection={() => {}}
            sorting={{id: 'name', desc: false}}
            setSorting={() => {}}
            allSelectedRows={[]}
            expanded={{}}
            setExpanded={() => {}} 
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility} 
            columnOrder={[]}
            setColumnOrder={()=>{}}
            pinnedColumns={[]}
            setPinnedColumns={()=>{}}
          />
        </CardContent>
      </Card>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Cập nhật điểm lưu kho' : 'Thêm điểm lưu kho'}</DialogTitle>
          </DialogHeader>
          <StockLocationForm initialData={editingItem} onSubmit={handleFormSubmit} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Thoát</Button>
            <Button type="submit" form="stock-location-form">Lưu</Button>
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
