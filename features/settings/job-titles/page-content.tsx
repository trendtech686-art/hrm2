import * as React from "react"
import { useJobTitleStore } from "./store"
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
import type { JobTitle } from "./types"
import { Button } from "../../../components/ui/button"
import { PlusCircle } from "lucide-react"
import Fuse from "fuse.js"
import { asBusinessId, asSystemId, type SystemId } from "@/lib/id-types"
import { Input } from "../../../components/ui/input"
import { SimpleSettingsTable } from "../../../components/settings/SimpleSettingsTable"

export function JobTitlesPageContent() {
  const { data: jobTitles, remove, add, update } = useJobTitleStore();
  
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
    return [...filteredData].sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredData]);


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
