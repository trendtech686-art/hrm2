import * as React from "react"
import { useJobTitleStore } from "./store.ts"
import { getColumns } from "./columns.tsx"
import { ResponsiveDataTable } from "../../../components/data-table/responsive-data-table.tsx"
import { DataTableToolbar } from "../../../components/data-table/data-table-toolbar.tsx"
import { Card, CardContent } from "../../../components/ui/card.tsx"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog.tsx"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog.tsx"
import { JobTitleForm, type JobTitleFormValues } from "./job-title-form.tsx"
import type { JobTitle } from "./types.ts"
import { Button } from "../../../components/ui/button.tsx"
import { PlusCircle } from "lucide-react"
import Fuse from "fuse.js"
import { DataTableColumnCustomizer } from "../../../components/data-table/data-table-column-toggle.tsx"
import { asBusinessId, asSystemId, type SystemId } from "@/lib/id-types"

export function JobTitlesPageContent() {
  const { data: jobTitles, remove, add, update } = useJobTitleStore();
  
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})
  const [isAlertOpen, setIsAlertOpen] = React.useState(false)
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null)
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [editingJobTitle, setEditingJobTitle] = React.useState<JobTitle | null>(null)
  
  const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'name', desc: false });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);

  const handleDelete = React.useCallback((systemId: SystemId) => {
    setIdToDelete(systemId)
    setIsAlertOpen(true)
  }, [])

  const handleEdit = React.useCallback((jobTitle: JobTitle) => {
    setEditingJobTitle(jobTitle)
    setIsFormOpen(true)
  }, [])

  const columns = React.useMemo(() => getColumns(handleDelete, handleEdit), [handleDelete, handleEdit]);
  
  React.useEffect(() => {
    const defaultVisibleColumns = ['name', 'description'];
    const initialVisibility: Record<string, boolean> = {};
    columns.forEach(c => {
      if (c.id === 'select' || c.id === 'actions') {
        initialVisibility[c.id!] = true;
      } else {
        initialVisibility[c.id!] = defaultVisibleColumns.includes(c.id!);
      }
    });
    setColumnVisibility(initialVisibility);
    setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
  }, [columns]);

  const fuse = React.useMemo(() => new Fuse(jobTitles, { keys: ["id", "name", "description"] }), [jobTitles]);
  
  const confirmDelete = () => {
    if (idToDelete) {
      remove(idToDelete)
    }
    setIsAlertOpen(false)
    setIdToDelete(null)
  }

  const handleAddNew = () => {
    setEditingJobTitle(null);
    setIsFormOpen(true);
  }

  const handleSubmit = (values: JobTitleFormValues) => {
    if (editingJobTitle) {
      update(editingJobTitle.systemId, {
        ...editingJobTitle,
        ...values,
        id: asBusinessId(values.id),
      });
    } else {
      add({
        ...values,
        id: asBusinessId(values.id),
      } as Omit<JobTitle, 'systemId'>);
    }
    setIsFormOpen(false);
    setEditingJobTitle(null);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingJobTitle(null);
  };
  
  const filteredData = React.useMemo(() => globalFilter ? fuse.search(globalFilter).map(result => result.item) : jobTitles, [jobTitles, globalFilter, fuse]);
  
  const sortedData = React.useMemo(() => {
    const sorted = [...filteredData];
    if (sorting.id) {
      sorted.sort((a, b) => {
        const aValue = (a as any)[sorting.id];
        const bValue = (b as any)[sorting.id];
        if (aValue < bValue) return sorting.desc ? 1 : -1;
        if (aValue > bValue) return sorting.desc ? -1 : 1;
        return 0;
      });
    }
    return sorted;
  }, [filteredData, sorting]);

  const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => sortedData.slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize), [sortedData, pagination]);
  
  const allSelectedRows = React.useMemo(() => 
    jobTitles.filter(jt => rowSelection[jt.systemId]),
  [jobTitles, rowSelection]);


  return (
    <div className="space-y-4">
       <div className="flex items-center justify-between">
            <div/>
            <Button onClick={handleAddNew} size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Thêm chức vụ
            </Button>
      </div>
      <Card>
        <CardContent className="p-6">
          <DataTableToolbar 
            search={globalFilter}
            onSearchChange={setGlobalFilter}
            searchPlaceholder="Tìm kiếm chức vụ..."
            numResults={filteredData.length}
          >
             <DataTableColumnCustomizer
                columns={columns}
                columnVisibility={columnVisibility}
                setColumnVisibility={setColumnVisibility}
                columnOrder={columnOrder}
                setColumnOrder={setColumnOrder}
                pinnedColumns={pinnedColumns}
                setPinnedColumns={setPinnedColumns}
              />
          </DataTableToolbar>
        </CardContent>
      </Card>
      
      <ResponsiveDataTable 
        columns={columns}
        data={paginatedData}
        pageCount={pageCount}
        pagination={pagination}
        setPagination={setPagination}
        rowCount={filteredData.length}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        sorting={sorting}
        setSorting={setSorting}
        allSelectedRows={allSelectedRows}
        expanded={{}}
        setExpanded={() => {}}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        columnOrder={columnOrder}
        setColumnOrder={setColumnOrder}
        pinnedColumns={pinnedColumns}
        setPinnedColumns={setPinnedColumns}
      />
      
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>Hành động này không thể được hoàn tác. Dữ liệu chức vụ sẽ bị xóa vĩnh viễn.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Tiếp tục</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingJobTitle ? 'Chỉnh sửa chức vụ' : 'Thêm chức vụ mới'}</DialogTitle>
              <DialogDescription>{editingJobTitle ? 'Cập nhật thông tin cho chức vụ.' : 'Điền thông tin để tạo mới.'}</DialogDescription>
            </DialogHeader>
            <JobTitleForm 
              initialData={editingJobTitle} 
              onSubmit={handleSubmit} 
              onCancel={handleCancel} 
            />
          </DialogContent>
      </Dialog>
    </div>
  )
}
