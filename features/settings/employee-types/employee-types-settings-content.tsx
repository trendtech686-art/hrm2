'use client'

import * as React from "react"
import { useAllEmployeeTypes } from "./hooks/use-all-employee-types"
import { useEmployeeTypeMutations } from "./hooks/use-employee-types"
import { Card, CardContent } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { EmployeeTypeForm, type EmployeeTypeFormValues } from "./employee-type-form"
import type { EmployeeTypeSetting } from '@/lib/types/prisma-extended'
import { Button } from "@/components/ui/button"
import { PlusCircle, MoreHorizontal } from "lucide-react"
import { simpleSearch } from "@/lib/simple-search"
import { asBusinessId, type SystemId } from "@/lib/id-types"
import { Input } from "@/components/ui/input"
import { SimpleSettingsTable } from "@/components/settings/SimpleSettingsTable"
import type { ColumnDef } from "@/components/data-table/types"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function EmployeeTypesSettingsContent() {
  // React Query hooks
  const { data: employeeTypes, isLoading } = useAllEmployeeTypes();
  const { create, update, remove } = useEmployeeTypeMutations({
    onCreateSuccess: () => toast.success('Đã thêm loại nhân viên mới'),
    onUpdateSuccess: () => toast.success('Đã cập nhật loại nhân viên'),
    onDeleteSuccess: () => toast.success('Đã xóa loại nhân viên'),
    onError: (err) => toast.error(err.message || 'Có lỗi xảy ra'),
  });
  
  const [isAlertOpen, setIsAlertOpen] = React.useState(false)
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null)
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [editingType, setEditingType] = React.useState<EmployeeTypeSetting | null>(null)
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = React.useState(false)
  
  const [globalFilter, setGlobalFilter] = React.useState('');

  const handleDelete = React.useCallback((systemId: SystemId) => {
    setIdToDelete(systemId)
    setIsAlertOpen(true)
  }, [])

  const handleEdit = React.useCallback((type: EmployeeTypeSetting) => {
    setEditingType(type)
    setIsFormOpen(true)
  }, [])

  const handleToggleDefault = React.useCallback((type: EmployeeTypeSetting) => {
    update.mutate({
      systemId: type.systemId,
      data: { isDefault: !type.isDefault }
    })
  }, [update])

  const columns: ColumnDef<EmployeeTypeSetting>[] = React.useMemo(() => [
    {
      id: "id",
      accessorKey: "id",
      header: "Mã",
      cell: ({ row }) => <span className="font-medium">{row.id}</span>,
    },
    {
      id: "name",
      accessorKey: "name",
      header: "Tên loại nhân viên",
      cell: ({ row }) => <span>{row.name}</span>,
    },
    {
      id: "description",
      accessorKey: "description",
      header: "Mô tả",
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">{row.description || '-'}</span>
      ),
    },
    {
      id: "isDefault",
      header: "Mặc định",
      cell: ({ row }) => (
        <Switch 
          checked={row.isDefault || false} 
          onCheckedChange={() => handleToggleDefault(row)}
        />
      ),
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
  ], [handleDelete, handleEdit, handleToggleDefault]);
  
  const searchedData = React.useMemo(() => 
    simpleSearch(employeeTypes, globalFilter, { keys: ['id', 'name', 'description'] }), 
    [employeeTypes, globalFilter]
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
    setRowSelection({})
    setIsBulkDeleteOpen(false)
  }

  const handleAddNew = () => {
    setEditingType(null);
    setIsFormOpen(true);
  }

  const handleSubmit = (values: EmployeeTypeFormValues) => {
    if (editingType) {
      update.mutate({
        systemId: editingType.systemId,
        data: {
          ...values,
          id: asBusinessId(values.id),
        }
      });
    } else {
      create.mutate({
        ...values,
        id: asBusinessId(values.id),
      } as Omit<EmployeeTypeSetting, 'systemId'>);
    }
    setIsFormOpen(false);
    setEditingType(null);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingType(null);
  };
  
const sortedData = React.useMemo(() => {
    return [...searchedData].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0) || a.name.localeCompare(b.name));
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
          placeholder="Tìm kiếm loại nhân viên..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="sm:max-w-sm"
        />
        <Button onClick={handleAddNew} size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Thêm loại nhân viên
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <SimpleSettingsTable
            data={sortedData}
            columns={columns}
            isLoading={isLoading}
            emptyTitle="Chưa có loại nhân viên"
            emptyDescription="Tạo loại nhân viên đầu tiên để phân loại nhân sự"
            emptyAction={
              <Button size="sm" onClick={handleAddNew}>
                Thêm loại nhân viên
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

      {/* Delete confirmation */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể được hoàn tác. Dữ liệu loại nhân viên sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
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
            <AlertDialogTitle>Xóa {Object.keys(rowSelection).length} loại nhân viên?</AlertDialogTitle>
            <AlertDialogDescription>Hành động này không thể hoàn tác. Các loại nhân viên đã chọn sẽ bị xóa vĩnh viễn.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Xóa tất cả</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Form dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingType ? 'Sửa loại nhân viên' : 'Thêm loại nhân viên mới'}</DialogTitle>
            <DialogDescription>
              {editingType ? 'Cập nhật thông tin loại nhân viên' : 'Điền thông tin để tạo loại nhân viên mới'}
            </DialogDescription>
          </DialogHeader>
          <EmployeeTypeForm
            initialData={editingType}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={create.isPending || update.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
