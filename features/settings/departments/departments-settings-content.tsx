'use client'

import * as React from "react"
import { useAllDepartments } from "./hooks/use-all-departments"
import { useDepartmentMutations } from "./hooks/use-departments"
import { Card, CardContent } from "../../../components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../../components/ui/dialog"
import { DepartmentForm, type DepartmentFormValues } from "./department-form"
import type { Department } from '@/lib/types/prisma-extended'
import { Button } from "../../../components/ui/button"
import { PlusCircle, MoreHorizontal } from "lucide-react"
import { simpleSearch } from "@/lib/simple-search"
import { asBusinessId, type SystemId } from "@/lib/id-types"
import { Input } from "../../../components/ui/input"
import { SimpleSettingsTable } from "../../../components/settings/SimpleSettingsTable"
import type { ColumnDef } from "../../../components/data-table/types"
import { Skeleton } from "../../../components/ui/skeleton"
import { toast } from "sonner"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu"

export function DepartmentsSettingsContent() {
  // React Query hooks
  const { data: departments, isLoading } = useAllDepartments();
  const { create, update, remove } = useDepartmentMutations({
    onCreateSuccess: () => toast.success('Đã thêm phòng ban mới'),
    onUpdateSuccess: () => toast.success('Đã cập nhật phòng ban'),
    onDeleteSuccess: () => toast.success('Đã xóa phòng ban'),
    onError: (err) => toast.error(err.message || 'Có lỗi xảy ra'),
  });
  
  const [isAlertOpen, setIsAlertOpen] = React.useState(false)
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null)
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [editingDepartment, setEditingDepartment] = React.useState<Department | null>(null)
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = React.useState(false)
  
  const [globalFilter, setGlobalFilter] = React.useState('');

  const handleDelete = React.useCallback((systemId: SystemId) => {
    setIdToDelete(systemId)
    setIsAlertOpen(true)
  }, [])

  const handleEdit = React.useCallback((department: Department) => {
    setEditingDepartment(department)
    setIsFormOpen(true)
  }, [])

  const columns: ColumnDef<Department>[] = React.useMemo(() => ([
    {
      id: "id",
      accessorKey: "id",
      header: "Mã",
      cell: ({ row }) => <span>{row.id}</span>,
      meta: { displayName: "Mã phòng ban" },
    },
    {
      id: "name",
      accessorKey: "name",
      header: "Tên phòng ban",
      cell: ({ row }) => <span>{row.name}</span>,
      meta: { displayName: "Tên phòng ban" },
    },
    {
      id: "description",
      accessorKey: "description",
      header: "Mô tả",
      cell: ({ row }) => <span className="text-muted-foreground">{(row as Department & { description?: string }).description || '-'}</span>,
      meta: { displayName: "Mô tả" },
    },
    {
      id: "actions",
      header: () => <div className="text-center">Sửa</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Mở menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => handleEdit(row)}>
                Sửa
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onSelect={() => handleDelete(row.systemId)}
              >
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      meta: {
        displayName: "Sửa",
        sticky: "right",
      },
      size: 90,
    },
  ] as ColumnDef<Department>[]), [handleDelete, handleEdit]);
  
  const searchedData = React.useMemo(() => 
    simpleSearch(departments, globalFilter, { keys: ['id', 'name'] }), 
    [departments, globalFilter]
  );
  
  const confirmDelete = () => {
    if (idToDelete) {
      remove.mutate(idToDelete)
    }
    setIsAlertOpen(false)
    setIdToDelete(null)
  }

  const handleBulkDelete = React.useCallback((selectedItems: { systemId: string }[]) => {
    if (selectedItems.length === 0) return
    setIsBulkDeleteOpen(true)
  }, [])

  const confirmBulkDelete = () => {
    const selectedIds = Object.keys(rowSelection)
    selectedIds.forEach(id => {
      remove.mutate(id as SystemId)
    })
    toast.success(`Đã xóa ${selectedIds.length} phòng ban`)
    setRowSelection({})
    setIsBulkDeleteOpen(false)
  }

  const handleAddNew = () => {
    setEditingDepartment(null);
    setIsFormOpen(true);
  }

  const handleSubmit = (values: DepartmentFormValues) => {
    if (editingDepartment) {
      update.mutate({
        systemId: editingDepartment.systemId,
        data: {
          ...values,
          id: asBusinessId(values.id),
        }
      });
    } else {
      create.mutate({
        ...values,
        id: asBusinessId(values.id),
      } as Omit<Department, 'systemId'>);
    }
    setIsFormOpen(false);
    setEditingDepartment(null);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingDepartment(null);
  };
  
const sortedData = React.useMemo(() => {
    return [...searchedData].sort((a, b) => a.name.localeCompare(b.name));
  }, [searchedData]);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={globalFilter}
          onChange={(event) => setGlobalFilter(event.target.value)}
          placeholder="Tìm kiếm phòng ban..."
          className="sm:max-w-sm"
        />
        <Button onClick={handleAddNew} size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Thêm phòng ban
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <SimpleSettingsTable
            data={sortedData}
            columns={columns}
            isLoading={isLoading}
            emptyTitle="Chưa có phòng ban"
            emptyDescription="Tạo phòng ban đầu tiên để quản lý nhân sự"
            emptyAction={
              <Button size="sm" onClick={handleAddNew}>
                Thêm phòng ban
              </Button>
            }
            enableSelection
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            onBulkDelete={handleBulkDelete}
            enablePagination
            pagination={{ pageSize: 10, showInfo: true }}
          />
        </CardContent>
      </Card>
      
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>Hành động này không thể được hoàn tác. Dữ liệu phòng ban sẽ bị xóa vĩnh viễn.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={remove.isPending}>
              {remove.isPending ? 'Đang xóa...' : 'Tiếp tục'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa {Object.keys(rowSelection).length} phòng ban?</AlertDialogTitle>
            <AlertDialogDescription>Hành động này không thể hoàn tác. Các phòng ban đã chọn sẽ bị xóa vĩnh viễn.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Xóa tất cả</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingDepartment ? 'Chỉnh sửa phòng ban' : 'Thêm phòng ban mới'}</DialogTitle>
              <DialogDescription>{editingDepartment ? 'Cập nhật thông tin cho phòng ban.' : 'Điền thông tin để tạo mới.'}</DialogDescription>
            </DialogHeader>
            <DepartmentForm 
              initialData={editingDepartment} 
              onSubmit={handleSubmit} 
            />
            <DialogFooter>
              <Button variant="outline" onClick={handleCancel}>Hủy</Button>
              <Button type="submit" form="department-form">
                {editingDepartment ? 'Cập nhật' : 'Thêm mới'}
              </Button>
            </DialogFooter>
          </DialogContent>
      </Dialog>
    </div>
  )
}
