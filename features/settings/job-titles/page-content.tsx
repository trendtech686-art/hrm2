import * as React from "react"
import { useAllJobTitles } from "./hooks/use-all-job-titles"
import { useJobTitleMutations } from "./hooks/use-job-titles"
import { getColumns } from "./columns"
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
} from "../../../components/ui/dialog"
import { JobTitleForm, type JobTitleFormValues } from "./job-title-form"
import type { JobTitle } from '@/lib/types/prisma-extended'
import { Button } from "../../../components/ui/button"
import { PlusCircle } from "lucide-react"
import { useFuseFilter } from "../../../hooks/use-fuse-search"
import { asBusinessId, type SystemId } from "@/lib/id-types"
import { Input } from "../../../components/ui/input"
import { SimpleSettingsTable } from "../../../components/settings/SimpleSettingsTable"
import { Skeleton } from "../../../components/ui/skeleton"
import { toast } from "sonner"

export function JobTitlesPageContent() {
  // React Query hooks
  const { data: jobTitles, isLoading } = useAllJobTitles();
  const { create, update, remove } = useJobTitleMutations({
    onCreateSuccess: () => toast.success('Đã thêm chức vụ mới'),
    onUpdateSuccess: () => toast.success('Đã cập nhật chức vụ'),
    onDeleteSuccess: () => toast.success('Đã xóa chức vụ'),
    onError: (err) => toast.error(err.message || 'Có lỗi xảy ra'),
  });
  
  const [isAlertOpen, setIsAlertOpen] = React.useState(false)
  const [idToDelete, setIdToDelete] = React.useState<SystemId | null>(null)
  const [isFormOpen, setIsFormOpen] = React.useState(false)
  const [editingJobTitle, setEditingJobTitle] = React.useState<JobTitle | null>(null)
  
  const [globalFilter, setGlobalFilter] = React.useState('');

  const handleDelete = React.useCallback((systemId: SystemId) => {
    setIdToDelete(systemId)
    setIsAlertOpen(true)
  }, [])

  const handleEdit = React.useCallback((jobTitle: JobTitle) => {
    setEditingJobTitle(jobTitle)
    setIsFormOpen(true)
  }, [])

  const columns = React.useMemo(() => getColumns(handleDelete, handleEdit), [handleDelete, handleEdit]);
  
  const fuseOptions = React.useMemo(() => ({ keys: ["id", "name", "description"] }), []);
  const searchedData = useFuseFilter(jobTitles, globalFilter, fuseOptions);
  
  const confirmDelete = () => {
    if (idToDelete) {
      remove.mutate(idToDelete)
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
      update.mutate({
        systemId: editingJobTitle.systemId,
        data: {
          ...values,
          id: asBusinessId(values.id),
        }
      });
    } else {
      create.mutate({
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
  
  const filteredData = React.useMemo(() => globalFilter ? searchedData : jobTitles, [jobTitles, globalFilter, searchedData]);
  
  const sortedData = React.useMemo(() => {
    return [...filteredData].sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredData]);

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
          placeholder="Tìm kiếm chức vụ..."
          className="sm:max-w-sm"
        />
        <Button onClick={handleAddNew} size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          Thêm chức vụ
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <SimpleSettingsTable
            data={sortedData}
            columns={columns}
            emptyTitle="Chưa có chức vụ"
            emptyDescription="Tạo chức vụ đầu tiên để phân quyền nhân sự"
            emptyAction={
              <Button size="sm" onClick={handleAddNew}>
                Thêm chức vụ
              </Button>
            }
          />
        </CardContent>
      </Card>
      
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>Hành động này không thể được hoàn tác. Dữ liệu chức vụ sẽ bị xóa vĩnh viễn.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={remove.isPending}>
              {remove.isPending ? 'Đang xóa...' : 'Tiếp tục'}
            </AlertDialogAction>
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
