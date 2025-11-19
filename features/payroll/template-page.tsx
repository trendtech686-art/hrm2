import * as React from 'react';
import { Plus, Star, Trash2, Pencil, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog.tsx';
import { Input } from '../../components/ui/input.tsx';
import { Textarea } from '../../components/ui/textarea.tsx';
import { Checkbox } from '../../components/ui/checkbox.tsx';
import { Label } from '../../components/ui/label.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table.tsx';
import { Badge } from '../../components/ui/badge.tsx';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { ROUTES } from '../../lib/router.ts';
import { usePayrollTemplateStore } from './payroll-template-store.ts';
import { useEmployeeSettingsStore } from '../settings/employees/employee-settings-store.ts';
import { useToast } from '../../hooks/use-toast.ts';
import { asSystemId, type SystemId } from '../../lib/id-types.ts';

const formatComponentCount = (count: number) => `${count} thành phần`;

export function PayrollTemplatePage() {
  const { toast } = useToast();
  const templateStore = usePayrollTemplateStore();
  const salaryComponents = useEmployeeSettingsStore((state) => state.getSalaryComponents());
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingTemplateId, setEditingTemplateId] = React.useState<SystemId | null>(null);
  const [formState, setFormState] = React.useState({
    name: '',
    description: '',
    componentSystemIds: salaryComponents.map((component) => asSystemId(component.systemId)),
    isDefault: false,
  });

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

  const headerActions = React.useMemo(
    () => [
      <Button
        key="new"
        className="h-9"
        size="sm"
        onClick={handleOpenCreateDialog}
      >
        <Plus className="mr-2 h-4 w-4" />
        Thêm mẫu
      </Button>,
    ],
    [handleOpenCreateDialog]
  );

  usePageHeader({
    title: 'Mẫu bảng lương',
    breadcrumb: [
      { label: 'Trang chủ', href: ROUTES.DASHBOARD },
      { label: 'Bảng lương', href: ROUTES.PAYROLL.LIST },
      { label: 'Mẫu bảng lương', href: ROUTES.PAYROLL.TEMPLATES },
    ],
    actions: headerActions,
  });

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
      toast({ title: 'Vui lòng nhập tên mẫu', description: 'Tên mẫu bảng lương là bắt buộc.' });
      return;
    }

    if (editingTemplateId) {
      templateStore.updateTemplate(editingTemplateId, {
        name: formState.name.trim(),
        description: formState.description.trim(),
        componentSystemIds: formState.componentSystemIds,
        isDefault: formState.isDefault,
      });
      toast({ title: 'Đã cập nhật mẫu', description: 'Thông tin mẫu bảng lương đã được lưu.' });
    } else {
      templateStore.createTemplate({
        name: formState.name.trim(),
        description: formState.description.trim(),
        componentSystemIds: formState.componentSystemIds,
        isDefault: formState.isDefault,
      });
      toast({ title: 'Đã tạo mẫu mới', description: 'Bạn có thể dùng mẫu này trong wizard chạy lương.' });
    }

    resetDialog();
  };

  const handleEdit = (systemId: SystemId) => {
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
  };

  const handleDelete = (systemId: SystemId) => {
    templateStore.deleteTemplate(systemId);
    toast({ title: 'Đã xóa mẫu', description: 'Mẫu bảng lương đã được gỡ bỏ.' });
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

  const templates = templateStore.templates;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Danh sách mẫu</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã mẫu</TableHead>
                <TableHead>Tên mẫu</TableHead>
                <TableHead>Số thành phần</TableHead>
                <TableHead>Mặc định</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.systemId}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{template.id}</TableCell>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>{formatComponentCount(template.componentSystemIds.length)}</TableCell>
                  <TableCell>
                    {template.isDefault ? (
                      <Badge variant="success" className="gap-1">
                        <Star className="h-3 w-3" /> Mặc định
                      </Badge>
                    ) : (
                      <Button
                        variant="ghost"
                        className="h-9 px-3 text-xs"
                        onClick={() => templateStore.setDefaultTemplate(template.systemId)}
                      >
                        Đặt mặc định
                      </Button>
                    )}
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9"
                      onClick={() => handleEdit(template.systemId)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Sửa
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 text-red-500 hover:text-red-500"
                      onClick={() => handleDelete(template.systemId)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {templates.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                    Chưa có mẫu nào. Nhấn “Thêm mẫu” để tạo cấu hình đầu tiên.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
                {salaryComponents.map((component) => {
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
                      <div>
                        <p className="font-medium">{component.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {component.type === 'fixed' ? 'Cố định' : component.formula ?? 'Theo công thức'}
                        </p>
                      </div>
                    </label>
                  );
                })}
                {salaryComponents.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Chưa có thành phần lương trong Cài đặt &gt; Nhân viên.
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ghi chú triển khai</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Mỗi mẫu sẽ đồng bộ với wizard chạy lương trong các bước tiếp theo.
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Khi backend sẵn sàng, các mẫu này sẽ được map sang API `/payroll/templates` mà không cần thay đổi UI.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
