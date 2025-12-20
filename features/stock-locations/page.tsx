import * as React from 'react';
import { useSettingsPageHeader } from '../settings/use-settings-page-header';
import { useStockLocationStore } from './store';
import { useBranchStore } from '../settings/branches/store';
import type { StockLocation } from './types';
import { asSystemId } from '../../lib/id-types';
import type { SystemId } from '../../lib/id-types';
import { StockLocationForm, type StockLocationFormValues } from './form';
import { getColumns } from './columns';
import { ResponsiveDataTable } from '../../components/data-table/responsive-data-table';
import { Button } from '../../components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { SettingsActionButton } from '../../components/settings/SettingsActionButton';

export function StockLocationsPage() {
  const { data, add, update, remove } = useStockLocationStore();
  const { data: branches } = useBranchStore();
  
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<StockLocation | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);
  
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
  const handleDeleteRequest = React.useCallback((id: string) => { setIdToDelete(asSystemId(id)); setIsAlertOpen(true); }, []);
  
  const locationSummary = React.useMemo(() => {
    if (!data.length) {
      return 'Chưa có điểm lưu kho nào, hãy tạo điểm đầu tiên để gán cho chi nhánh.';
    }
    const uniqueBranches = new Set(data.map((item) => item.branchSystemId)).size;
    const defaultBranchName = branches.find((b) => b.isDefault)?.name;
    const branchLabel = uniqueBranches ? `${uniqueBranches} chi nhánh` : 'Chưa gán chi nhánh';
    const defaultBranchLabel = defaultBranchName ? ` • Chi nhánh mặc định: ${defaultBranchName}` : '';
    return `${data.length} điểm lưu kho • ${branchLabel}${defaultBranchLabel}`;
  }, [data, branches]);

  const headerActions = React.useMemo(() => ([
    <SettingsActionButton key="add" onClick={handleAddNew}>
      <PlusCircle className="h-4 w-4" />
      Thêm điểm lưu kho
    </SettingsActionButton>
  ]), [handleAddNew]);

  useSettingsPageHeader({
    title: 'Vị trí kho',
    actions: headerActions,
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
        <CardHeader className="pb-4">
          <CardTitle>Danh sách điểm lưu kho</CardTitle>
          <CardDescription>Theo dõi mapping vị trí giữa chi nhánh và khu vực lưu trữ.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveDataTable
            columns={columns}
            data={paginatedData}
            pageCount={pageCount}
            pagination={pagination}
            setPagination={setPagination}
            rowCount={data.length}
            rowSelection={{}}
            setRowSelection={() => {}}
            sorting={{id: 'createdAt', desc: true}}
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
            autoGenerateMobileCards
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
