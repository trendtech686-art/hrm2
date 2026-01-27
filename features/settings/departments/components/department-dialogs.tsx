'use client'

import * as React from 'react';
import { useDepartments, useDepartmentMutations } from '../hooks/use-departments';
import { DepartmentForm, type DepartmentFormValues } from '../department-form';
import { JobTitlesPageContent } from '../../job-titles/page-content';
import { Button } from '../../../../components/ui/button';
import { ScrollArea } from '../../../../components/ui/scroll-area';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '../../../../components/ui/dialog';
import type { Department } from '@/lib/types/prisma-extended';
import { toast } from 'sonner';

// ==========================================
// ManageDepartmentsDialog Component
// ==========================================
export const ManageDepartmentsDialog = React.memo(function ManageDepartmentsDialog({ 
  isOpen, 
  onOpenChange 
}: { 
  isOpen: boolean; 
  onOpenChange: (open: boolean) => void; 
}) {
  const { data: departmentsData } = useDepartments({ limit: 1000 });
  const data = departmentsData?.data ?? [];
  const { create, update, remove } = useDepartmentMutations({
    onCreateSuccess: () => toast.success('Thêm mới thành công'),
    onUpdateSuccess: () => toast.success('Cập nhật thành công'),
    onDeleteSuccess: () => toast.success('Xóa thành công'),
    onError: (err) => toast.error(err.message)
  });
  const [editingDepartment, setEditingDepartment] = React.useState<Department | null>(null);

  const handleFormSubmit = (values: DepartmentFormValues) => {
    if (editingDepartment) {
      update.mutate({ systemId: editingDepartment.systemId, data: values });
    } else {
      create.mutate(values as Omit<Department, 'systemId'>);
    }
    setEditingDepartment(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Quản lý Phòng ban</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6 pt-4">
          <div>
            <h4 className="font-semibold mb-2">{editingDepartment ? 'Chỉnh sửa' : 'Thêm mới'}</h4>
            <React.Fragment key={editingDepartment?.systemId || 'new'}>
              <DepartmentForm
                initialData={editingDepartment ? { ...editingDepartment, jobTitleIds: [] } : null}
                onSubmit={handleFormSubmit}
              />
            </React.Fragment>
            <DialogFooter className="mt-4">
              {editingDepartment && <Button variant="outline" onClick={() => setEditingDepartment(null)}>Hủy sửa</Button>}
              <Button type="submit" form="department-form">Lưu</Button>
            </DialogFooter>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Danh sách phòng ban</h4>
            <ScrollArea className="h-72 border rounded-md">
              {data.map(dep => (
                <div key={dep.systemId} className="flex items-center p-2 border-b">
                  <span className="flex-grow">{dep.name}</span>
                  <Button variant="ghost" size="sm" onClick={() => setEditingDepartment(dep)}>Sửa</Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => (remove as any).mutate(dep.systemId)}>Xóa</Button>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

// ==========================================
// ManageJobTitlesDialog Component
// ==========================================
export const ManageJobTitlesDialog = React.memo(function ManageJobTitlesDialog({ 
  isOpen, 
  onOpenChange 
}: { 
  isOpen: boolean; 
  onOpenChange: (open: boolean) => void; 
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Quản lý Chức vụ</DialogTitle>
          <DialogDescription>Thêm, sửa, xóa các chức vụ trong công ty.</DialogDescription>
        </DialogHeader>
        <JobTitlesPageContent />
      </DialogContent>
    </Dialog>
  );
});
