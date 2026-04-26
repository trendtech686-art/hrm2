import * as React from 'react';
import { simpleSearch } from '@/lib/simple-search';
import { Plus, Search, X, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Checkbox } from '../../../components/ui/checkbox';
import { Label } from '../../../components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components/ui/alert-dialog';
import { SimpleSettingsTable } from '../../../components/settings/SimpleSettingsTable';
import { usePayrollTemplates, usePayrollTemplatesMutations } from './hooks/use-payroll-templates';
import { useSalaryComponents } from './hooks/use-employee-settings';
import { getPayrollTemplateColumns } from './payroll-templates-columns';
import { toast } from 'sonner';
import { asSystemId, type SystemId } from '../../../lib/id-types';
import type { PayrollTemplate } from '../../../lib/payroll-types';

export function PayrollTemplatesSettingsContent() {
  // React Query hooks
  const { data: templates = [], isLoading, isError } = usePayrollTemplates();
  const mutations = usePayrollTemplatesMutations({
    onError: (error) => {
      toast.error('Có lỗi xảy ra', { description: error.message });
    },
  });

  const { data: salaryComponents = [] } = useSalaryComponents();

  // Search state
  const [searchQuery, setSearchQuery] = React.useState('');

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingTemplateId, setEditingTemplateId] = React.useState<SystemId | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<SystemId | null>(null);

  // Form state
  const [formState, setFormState] = React.useState({
    name: '',
    description: '',
    componentSystemIds: [] as SystemId[],
    isDefault: false,
  });

  // Simple search for templates
  const filteredData = React.useMemo(() => 
    simpleSearch(templates as unknown as Record<string, unknown>[], searchQuery.trim(), { keys: ['id', 'name', 'description'] }) as unknown as PayrollTemplate[], 
    [templates, searchQuery]
  );

  // Handlers
  const handleOpenCreateDialog = React.useCallback(() => {
    setEditingTemplateId(null);
    setFormState({
      name: '',
      description: '',
      componentSystemIds: salaryComponents.map((component) => asSystemId(component.systemId)),
      isDefault: false,
    });
    setIsDialogOpen(true);
  }, [salaryComponents]);

  const handleEdit = React.useCallback((systemId: SystemId) => {
    const template = templates.find(t => t.systemId === systemId);
    if (!template) return;
    setEditingTemplateId(systemId);
    setFormState({
      name: template.name,
      description: template.description ?? '',
      componentSystemIds: template.componentSystemIds,
      isDefault: template.isDefault,
    });
    setIsDialogOpen(true);
  }, [templates]);

  const handleDelete = React.useCallback((systemId: SystemId) => {
    setDeleteConfirmId(systemId);
  }, []);

  const handleConfirmDelete = React.useCallback(() => {
    if (deleteConfirmId) {
      mutations.remove.mutate(
        { templates, systemId: deleteConfirmId },
        {
          onSuccess: () => {
            toast.success('Đã xóa mẫu', { description: 'Mẫu bảng lương đã được gỡ bỏ.' });
            setDeleteConfirmId(null);
          },
        }
      );
    }
  }, [templates, deleteConfirmId, mutations.remove]);

  const handleToggleDefault = React.useCallback((template: PayrollTemplate, isDefault: boolean) => {
    mutations.update.mutate(
      { templates, systemId: template.systemId, updates: { isDefault } },
      {
        onSuccess: () => {
          if (isDefault) {
            toast.success('Đã đặt mặc định', { description: `"${template.name}" sẽ được chọn sẵn khi chạy lương.` });
          } else {
            toast.success('Đã bỏ mặc định');
          }
        },
      }
    );
  }, [templates, mutations.update]);

  const resetDialog = () => {
    setIsDialogOpen(false);
    setEditingTemplateId(null);
    setFormState({
      name: '',
      description: '',
      componentSystemIds: salaryComponents.map((component) => asSystemId(component.systemId)),
      isDefault: false,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.name.trim()) {
      toast.error('Vui lòng nhập tên mẫu', { description: 'Tên mẫu bảng lương là bắt buộc.' });
      return;
    }

    if (editingTemplateId) {
      mutations.update.mutate(
        {
          templates,
          systemId: editingTemplateId,
          updates: {
            name: formState.name.trim(),
            description: formState.description.trim(),
            componentSystemIds: formState.componentSystemIds,
            isDefault: formState.isDefault,
          },
        },
        {
          onSuccess: () => {
            toast.success('Đã cập nhật mẫu', { description: 'Thông tin mẫu bảng lương đã được lưu.' });
            resetDialog();
          },
        }
      );
    } else {
      mutations.create.mutate(
        {
          templates,
          newTemplate: {
            name: formState.name.trim(),
            description: formState.description.trim(),
            componentSystemIds: formState.componentSystemIds,
            isDefault: formState.isDefault,
          },
        },
        {
          onSuccess: () => {
            toast.success('Đã tạo mẫu mới', { description: 'Bạn có thể dùng mẫu này trong wizard chạy lương.' });
            resetDialog();
          },
        }
      );
    }
  };

  const toggleComponentSelection = (componentId: SystemId) => {
    setFormState((prev) => {
      const exists = prev.componentSystemIds.includes(componentId);
      return {
        ...prev,
        componentSystemIds: exists
          ? prev.componentSystemIds.filter((id) => id !== componentId)
          : [...prev.componentSystemIds, componentId],
      };
    });
  };

  // Columns for SimpleSettingsTable
  const columns = React.useMemo(() => getPayrollTemplateColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onToggleDefault: handleToggleDefault,
    isPending: mutations.update.isPending,
  }), [handleEdit, handleDelete, handleToggleDefault, mutations.update.isPending]);

  // Row selection state
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = React.useState(false);

  const handleBulkDelete = React.useCallback((selectedItems: { systemId: string }[]) => {
    if (selectedItems.length === 0) return;
    setIsBulkDeleteOpen(true);
  }, []);

  const confirmBulkDelete = () => {
    const selectedIds = Object.keys(rowSelection);
    selectedIds.forEach(id => {
      mutations.remove.mutate({ templates, systemId: id as SystemId });
    });
    toast.success(`Đã xóa ${selectedIds.length} mẫu bảng lương`);
    setRowSelection({});
    setIsBulkDeleteOpen(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mẫu bảng lương</CardTitle>
          <CardDescription>Quản lý bộ thành phần lương chuẩn để tái sử dụng khi chạy bảng lương.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Đang tải...</span>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mẫu bảng lương</CardTitle>
          <CardDescription>Quản lý bộ thành phần lương chuẩn để tái sử dụng khi chạy bảng lương.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-10">
          <p className="text-destructive">Không thể tải dữ liệu. Vui lòng thử lại sau.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Mẫu bảng lương</CardTitle>
            <CardDescription>Quản lý bộ thành phần lương chuẩn để tái sử dụng khi chạy bảng lương.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" size="sm" onClick={handleOpenCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm mẫu
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên, mã mẫu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-11 w-11 -translate-y-1/2"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* SimpleSettingsTable */}
        <SimpleSettingsTable
          data={filteredData}
          columns={columns}
          emptyTitle="Chưa có mẫu bảng lương"
          emptyDescription="Tạo mẫu bảng lương đầu tiên để quản lý lương nhân viên"
          enableSelection
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          onBulkDelete={handleBulkDelete}
        />

        <p className="text-xs text-muted-foreground">Tổng cộng {templates.length} mẫu</p>
      </CardContent>

      {/* Bulk Delete Dialog */}
      <AlertDialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa {Object.keys(rowSelection).length} mẫu?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa các mẫu bảng lương đã chọn? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkDelete} disabled={mutations.remove.isPending} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {mutations.remove.isPending ? 'Đang xóa...' : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{editingTemplateId ? 'Chỉnh sửa mẫu bảng lương' : 'Tạo mẫu bảng lương mới'}</DialogTitle>
              <DialogDescription>
                {editingTemplateId
                  ? 'Cập nhật thông tin và thành phần của mẫu này.'
                  : 'Chọn các thành phần lương để tạo mẫu mới. Mẫu này có thể dùng khi chạy bảng lương.'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="template-name">
                  Tên mẫu <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="template-name"
                  placeholder="VD: Mẫu lương nhân viên văn phòng"
                  value={formState.name}
                  onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="template-description">Mô tả</Label>
                <Textarea
                  id="template-description"
                  placeholder="Mô tả ngắn về mẫu này..."
                  value={formState.description}
                  onChange={(e) => setFormState((prev) => ({ ...prev, description: e.target.value }))}
                  rows={2}
                />
              </div>

              {/* Default toggle */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="template-default"
                  checked={formState.isDefault}
                  onCheckedChange={(checked) => setFormState((prev) => ({ ...prev, isDefault: Boolean(checked) }))}
                />
                <Label htmlFor="template-default" className="text-sm font-normal cursor-pointer">
                  Đặt làm mẫu mặc định khi chạy lương
                </Label>
              </div>

              {/* Salary Components Selection */}
              <div className="space-y-2">
                <Label>Chọn thành phần lương</Label>
                <p className="text-xs text-muted-foreground">
                  Đã chọn {formState.componentSystemIds.length}/{salaryComponents.length} thành phần
                </p>

                <div className="border  border-border rounded-md p-4 max-h-75 overflow-y-auto space-y-3">
                  {/* Earnings */}
                  <div>
                    <p className="text-sm font-medium mb-2 text-green-600">Thu nhập</p>
                    <div className="grid grid-cols-2 gap-2">
                      {salaryComponents
                        .filter((c) => c.category === 'earning')
                        .map((component) => (
                          <div key={component.systemId} className="flex items-center gap-2">
                            <Checkbox
                              id={`comp-${component.systemId}`}
                              checked={formState.componentSystemIds.includes(asSystemId(component.systemId))}
                              onCheckedChange={() => toggleComponentSelection(asSystemId(component.systemId))}
                            />
                            <Label htmlFor={`comp-${component.systemId}`} className="text-sm font-normal cursor-pointer">
                              {component.name}
                            </Label>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Deductions */}
                  <div>
                    <p className="text-sm font-medium mb-2 text-red-600">Khấu trừ</p>
                    <div className="grid grid-cols-2 gap-2">
                      {salaryComponents
                        .filter((c) => c.category === 'deduction')
                        .map((component) => (
                          <div key={component.systemId} className="flex items-center gap-2">
                            <Checkbox
                              id={`comp-${component.systemId}`}
                              checked={formState.componentSystemIds.includes(asSystemId(component.systemId))}
                              onCheckedChange={() => toggleComponentSelection(asSystemId(component.systemId))}
                            />
                            <Label htmlFor={`comp-${component.systemId}`} className="text-sm font-normal cursor-pointer">
                              {component.name}
                            </Label>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Contributions */}
                  <div>
                    <p className="text-sm font-medium mb-2 text-blue-600">Đóng góp bảo hiểm</p>
                    <div className="grid grid-cols-2 gap-2">
                      {salaryComponents
                        .filter((c) => c.category === 'contribution')
                        .map((component) => (
                          <div key={component.systemId} className="flex items-center gap-2">
                            <Checkbox
                              id={`comp-${component.systemId}`}
                              checked={formState.componentSystemIds.includes(asSystemId(component.systemId))}
                              onCheckedChange={() => toggleComponentSelection(asSystemId(component.systemId))}
                            />
                            <Label htmlFor={`comp-${component.systemId}`} className="text-sm font-normal cursor-pointer">
                              {component.name}
                            </Label>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetDialog}>
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={mutations.create.isPending || mutations.update.isPending}
              >
                {(mutations.create.isPending || mutations.update.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingTemplateId ? 'Lưu thay đổi' : 'Tạo mẫu'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa mẫu?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa mẫu bảng lương này không? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={mutations.remove.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {mutations.remove.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xóa mẫu
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
