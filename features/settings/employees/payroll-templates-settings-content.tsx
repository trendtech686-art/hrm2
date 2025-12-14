import * as React from 'react';
import Fuse from 'fuse.js';
import { Plus, RotateCcw, Trash2, Search, X, Edit, MoreHorizontal } from 'lucide-react';
import { formatDateForDisplay } from '@/lib/date-utils';
import { Button } from '../../../components/ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog.tsx';
import { Input } from '../../../components/ui/input.tsx';
import { Textarea } from '../../../components/ui/textarea.tsx';
import { Checkbox } from '../../../components/ui/checkbox.tsx';
import { Label } from '../../../components/ui/label.tsx';
import { Badge } from '../../../components/ui/badge.tsx';
import { Switch } from '../../../components/ui/switch.tsx';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components/ui/alert-dialog.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table.tsx';
import { usePayrollTemplateStore } from '../../payroll/payroll-template-store.ts';
import { useEmployeeSettingsStore } from './employee-settings-store.ts';
import { toast } from 'sonner';
import { asSystemId, type SystemId } from '../../../lib/id-types.ts';
import type { PayrollTemplate } from '../../../lib/payroll-types.ts';

export function PayrollTemplatesSettingsContent() {
  const templateStore = usePayrollTemplateStore();
  const salaryComponents = useEmployeeSettingsStore((state) => state.getSalaryComponents());

  // Search state
  const [searchQuery, setSearchQuery] = React.useState('');

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = React.useState(false);
  const [editingTemplateId, setEditingTemplateId] = React.useState<SystemId | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = React.useState<SystemId | null>(null);

  // Form state
  const [formState, setFormState] = React.useState({
    name: '',
    description: '',
    componentSystemIds: salaryComponents.map((component) => asSystemId(component.systemId)),
    isDefault: false,
  });

  // Raw data
  const templates = templateStore.templates;

  // Fuse.js for search
  const fuse = React.useMemo(
    () =>
      new Fuse(templates, {
        keys: ['id', 'name', 'description'],
        threshold: 0.3,
        includeScore: true,
      }),
    [templates]
  );

  // Filtered data
  const filteredData = React.useMemo(() => {
    if (!searchQuery.trim()) return templates;
    const searchResults = fuse.search(searchQuery.trim());
    return searchResults.map((r) => r.item);
  }, [templates, searchQuery, fuse]);

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
    const template = templateStore.getTemplateBySystemId(systemId);
    if (!template) return;
    setEditingTemplateId(systemId);
    setFormState({
      name: template.name,
      description: template.description ?? '',
      componentSystemIds: template.componentSystemIds,
      isDefault: template.isDefault,
    });
    setIsDialogOpen(true);
  }, [templateStore]);

  const handleDelete = React.useCallback((systemId: SystemId) => {
    setDeleteConfirmId(systemId);
  }, []);

  const handleConfirmDelete = React.useCallback(() => {
    if (deleteConfirmId) {
      templateStore.deleteTemplate(deleteConfirmId);
      toast.success('Đã xóa mẫu', { description: 'Mẫu bảng lương đã được gỡ bỏ.' });
      setDeleteConfirmId(null);
    }
  }, [templateStore, deleteConfirmId]);

  const handleSetDefault = React.useCallback((systemId: SystemId) => {
    templateStore.setDefaultTemplate(systemId);
    toast.success('Đã đặt mặc định', { description: 'Mẫu này sẽ được chọn sẵn khi chạy lương.' });
  }, [templateStore]);

  const handleToggleDefault = React.useCallback((template: PayrollTemplate, isDefault: boolean) => {
    if (isDefault) {
      // Đặt làm mặc định
      templateStore.setDefaultTemplate(template.systemId);
      toast.success('Đã đặt mặc định', { description: `"${template.name}" sẽ được chọn sẵn khi chạy lương.` });
    } else {
      // Bỏ mặc định - hệ thống tự động chọn mẫu khác
      templateStore.updateTemplate(template.systemId, { isDefault: false });
      const newDefault = templateStore.getDefaultTemplate();
      if (newDefault && newDefault.systemId !== template.systemId) {
        toast.success('Đã bỏ mặc định', { description: `"${newDefault.name}" đã được đặt làm mặc định.` });
      }
    }
  }, [templateStore]);

  const handleResetToDefault = React.useCallback(() => {
    templateStore.resetToDefaultTemplates();
    toast.success('Đã khôi phục', { description: 'Đã khôi phục về danh sách mẫu mặc định.' });
    setIsResetDialogOpen(false);
  }, [templateStore]);

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
      templateStore.updateTemplate(editingTemplateId, {
        name: formState.name.trim(),
        description: formState.description.trim(),
        componentSystemIds: formState.componentSystemIds,
        isDefault: formState.isDefault,
      });
      toast.success('Đã cập nhật mẫu', { description: 'Thông tin mẫu bảng lương đã được lưu.' });
    } else {
      templateStore.createTemplate({
        name: formState.name.trim(),
        description: formState.description.trim(),
        componentSystemIds: formState.componentSystemIds,
        isDefault: formState.isDefault,
      });
      toast.success('Đã tạo mẫu mới', { description: 'Bạn có thể dùng mẫu này trong wizard chạy lương.' });
    }

    resetDialog();
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    return formatDateForDisplay(dateString);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Mẫu bảng lương</CardTitle>
            <CardDescription>Quản lý bộ thành phần lương chuẩn để tái sử dụng khi chạy bảng lương.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsResetDialogOpen(true)}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Khôi phục mặc định
            </Button>
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
            className="h-9 pl-9 pr-9"
          />
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Table */}
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Mã mẫu</TableHead>
                <TableHead>Tên mẫu</TableHead>
                <TableHead className="text-center w-[120px]">Số thành phần</TableHead>
                <TableHead className="text-center w-[100px]">Mặc định</TableHead>
                <TableHead className="w-[120px]">Ngày tạo</TableHead>
                <TableHead className="text-right w-[80px]">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((template) => (
                <TableRow key={template.systemId}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {template.id}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{template.name}</p>
                      {template.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1">{template.description}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {template.componentSystemIds.length} thành phần
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={template.isDefault}
                      onCheckedChange={(checked) => handleToggleDefault(template, checked)}
                      aria-label={template.isDefault ? 'Đang là mẫu mặc định' : 'Đặt làm mẫu mặc định'}
                    />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(template.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleEdit(template.systemId)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(template.systemId)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa mẫu
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    {searchQuery ? 'Không tìm thấy mẫu phù hợp.' : 'Chưa có mẫu bảng lương nào.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Summary */}
        <p className="text-xs text-muted-foreground">
          {searchQuery ? `Tìm thấy ${filteredData.length} / ${templates.length} mẫu` : `Tổng cộng ${templates.length} mẫu`}
        </p>
      </CardContent>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingTemplateId ? 'Chỉnh sửa mẫu' : 'Tạo mẫu bảng lương'}</DialogTitle>
            <DialogDescription>
              Lựa chọn thành phần lương mặc định để tái sử dụng khi chạy bảng lương.
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-3">
              <Label htmlFor="template-name">Tên mẫu</Label>
              <Input
                id="template-name"
                className="h-9"
                required
                value={formState.name}
                onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="template-description">Mô tả</Label>
              <Textarea
                id="template-description"
                placeholder="Mục đích sử dụng, phòng ban áp dụng..."
                value={formState.description}
                onChange={(event) => setFormState((prev) => ({ ...prev, description: event.target.value }))}
              />
            </div>

            <div className="grid gap-2">
              <Label>Thành phần lương</Label>
              <div className="max-h-60 space-y-2 overflow-y-auto rounded-lg border p-3">
                {salaryComponents
                  .filter((c) => c.isActive !== false)
                  .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
                  .map((component) => {
                    const componentSystemId = asSystemId(component.systemId);
                    const checked = formState.componentSystemIds.includes(componentSystemId);
                    return (
                      <label
                        key={component.systemId}
                        className="flex cursor-pointer items-center gap-3 text-sm"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggleComponentSelection(componentSystemId)}
                          className="h-4 w-4"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{component.name}</p>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                component.category === 'earning'
                                  ? 'border-green-200 bg-green-50 text-green-700'
                                  : component.category === 'deduction'
                                    ? 'border-red-200 bg-red-50 text-red-700'
                                    : 'border-blue-200 bg-blue-50 text-blue-700'
                              }`}
                            >
                              {component.category === 'earning'
                                ? 'Thu nhập'
                                : component.category === 'deduction'
                                  ? 'Khấu trừ'
                                  : 'Đóng góp'}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {component.type === 'fixed' ? 'Cố định' : component.formula ?? 'Theo công thức'}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                {salaryComponents.filter((c) => c.isActive !== false).length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Chưa có thành phần lương. Hãy thêm trong tab "Lương & Phúc lợi".
                  </p>
                )}
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-3 text-sm font-medium">
              <Checkbox
                checked={formState.isDefault}
                onCheckedChange={(checked) =>
                  setFormState((prev) => ({ ...prev, isDefault: Boolean(checked) }))
                }
                className="h-4 w-4"
              />
              Đặt làm mẫu mặc định
            </label>

            <DialogFooter className="flex flex-row items-center justify-between gap-2">
              <Button type="button" variant="outline" className="h-9" onClick={resetDialog}>
                Hủy
              </Button>
              <Button type="submit" className="h-9">
                {editingTemplateId ? 'Lưu thay đổi' : 'Tạo mẫu'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Khôi phục mẫu mặc định?</AlertDialogTitle>
            <AlertDialogDescription>
              Thao tác này sẽ xóa tất cả các mẫu hiện tại và thay thế bằng 5 mẫu mặc định theo chuẩn
              Việt Nam:
              <ul className="mt-2 list-inside list-disc space-y-1">
                <li>Mẫu lương cơ bản</li>
                <li>Mẫu lương nhân viên văn phòng</li>
                <li>Mẫu lương quản lý</li>
                <li>Mẫu lương kinh doanh</li>
                <li>Mẫu lương toàn bộ</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetToDefault}>Khôi phục</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa mẫu
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
