'use client'

import * as React from 'react';
import { toast } from 'sonner';
import { useSettingsPageHeader } from '../settings/use-settings-page-header';
import { useStockLocations, useStockLocationMutations } from './hooks/use-stock-locations';
import { useAllBranches } from '../settings/branches/hooks/use-all-branches';
import type { StockLocation } from '@/lib/types/prisma-extended';
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
import { useColumnVisibility } from '../../hooks/use-column-visibility';
import { useAuth } from "@/contexts/auth-context";
import { usePaginationWithGlobalDefault } from '@/features/settings/global/hooks/use-global-settings';
import { mobileBleedCardClass } from '@/components/layout/page-section';

export function StockLocationsPage() {
  // Permission checks
  const { can } = useAuth();
  const canCreate = can('create_stock_locations');
  // Note: canDelete and canEdit may be used for future bulk actions

  // Server-side pagination state
  const [searchQuery] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');
  const [pagination, setPagination] = usePaginationWithGlobalDefault();

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, setPagination]);

  // Server-side paginated query
  const { data: stockLocationsData, isLoading: isLoadingStockLocations } = useStockLocations({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch || undefined,
  });

  const stockLocations = React.useMemo(() => stockLocationsData?.data ?? [], [stockLocationsData?.data]);
  const totalRows = stockLocationsData?.pagination?.total ?? 0;
  const pageCount = stockLocationsData?.pagination?.totalPages ?? 1;

  const { create, update, remove } = useStockLocationMutations({
    onSuccess: () => toast.success('Thành công'),
    onError: (err) => toast.error(err.message)
  });
  const { data: branches } = useAllBranches();

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<StockLocation | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null);
  
  // ✅ Sử dụng useColumnVisibility hook thay vì localStorage trực tiếp
  const defaultColumnVisibility = React.useMemo(() => {
    const cols = getColumns(() => {}, () => {}, branches);
    const initial: Record<string, boolean> = {};
    cols.forEach(c => { if (c.id) initial[c.id] = true; });
    return initial;
  }, [branches]);
  const [columnVisibility, setColumnVisibility] = useColumnVisibility('stock-locations', defaultColumnVisibility);
  
  const handleAddNew = React.useCallback(() => { setEditingItem(null); setIsFormOpen(true); }, []);
  const handleEdit = React.useCallback((item: StockLocation) => { setEditingItem(item); setIsFormOpen(true); }, []);
  const handleDeleteRequest = React.useCallback((id: string) => { setIdToDelete(asSystemId(id)); setIsAlertOpen(true); }, []);
  
  const headerActions = React.useMemo(() => ([
    canCreate && <SettingsActionButton key="add" onClick={handleAddNew}>
      <PlusCircle className="h-4 w-4" />
      Thêm điểm lưu kho
    </SettingsActionButton>
  ].filter(Boolean)), [handleAddNew, canCreate]);

  useSettingsPageHeader({
    title: 'Vị trí kho',
    actions: headerActions,
  });
  
  const confirmDelete = () => { if (idToDelete) remove.mutate(idToDelete); setIsAlertOpen(false); };
  
  const handleFormSubmit = (values: StockLocationFormValues) => {
    if (editingItem) {
      update.mutate({ systemId: editingItem.systemId, data: values });
    } else {
      create.mutate(values);
    }
    setIsFormOpen(false);
  };
  
  const columns = React.useMemo(() => getColumns(handleEdit, handleDeleteRequest, branches), [handleEdit, handleDeleteRequest, branches]);

  return (
    <div className="space-y-4">
      <Card className={mobileBleedCardClass}>
        <CardHeader className="pb-4">
          <CardTitle>Danh sách điểm lưu kho</CardTitle>
          <CardDescription>Theo dõi mapping vị trí giữa chi nhánh và khu vực lưu trữ.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveDataTable
            columns={columns}
            data={stockLocations}
            pageCount={pageCount}
            pagination={pagination}
            setPagination={setPagination}
            rowCount={totalRows}
            isLoading={isLoadingStockLocations}
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
