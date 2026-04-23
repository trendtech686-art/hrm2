'use client'

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTaskTemplateById, useTaskTemplateMutations } from '../hooks/use-task-templates';
import { useAuth } from '@/contexts/auth-context';
import { usePageHeader } from '@/contexts/page-header-context';
import type { TemplateCategory } from '../template-types';
import type { TaskPriority } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormPageShell, mobileBleedCardClass } from '@/components/layout/page-section';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Save, Plus, Trash2, GripVertical, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES: { value: TemplateCategory; label: string }[] = [
  { value: 'Development', label: 'Development' },
  { value: 'Design', label: 'Design' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Sales', label: 'Sales' },
  { value: 'Support', label: 'Support' },
  { value: 'HR', label: 'HR' },
  { value: 'Operations', label: 'Operations' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Other', label: 'Other' },
];

interface SubtaskItem {
  title: string;
  description: string;
  estimatedHours: number;
  order: number;
}

interface AssigneeRoleItem {
  role: 'owner' | 'contributor' | 'reviewer';
  description: string;
}

interface TemplateFormPageProps {
  systemId?: string;
}

export function TemplateFormPage({ systemId }: TemplateFormPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const duplicateId = searchParams.get('duplicate');

  const { data: existingTemplate } = useTaskTemplateById(systemId);
  const { data: duplicateTemplate } = useTaskTemplateById(duplicateId || undefined);

  const { employee, can } = useAuth();
  const isEdit = !!systemId;

  const { create: createMutation, update: updateMutation } = useTaskTemplateMutations({
    onSuccess: () => {
      toast.success(isEdit ? 'Đã cập nhật mẫu công việc' : 'Đã tạo mẫu công việc mới');
      router.push('/tasks/templates');
    },
    onError: (error) => {
      toast.error('Lỗi', { description: error.message });
    },
  });

  // Redirect without permission
  React.useEffect(() => {
    if (!can('create_tasks')) {
      toast.error('Bạn không có quyền tạo mẫu công việc');
      router.push('/tasks/templates');
    }
  }, [can, router]);

  const [formData, setFormData] = React.useState({
    name: '',
    description: '',
    category: 'Other' as TemplateCategory,
    priority: 'Trung bình' as TaskPriority,
    estimatedHours: 0,
    isActive: true,
  });

  const [subtasks, setSubtasks] = React.useState<SubtaskItem[]>([]);
  const [checklistItems, setChecklistItems] = React.useState<string[]>([]);
  const [assigneeRoles, setAssigneeRoles] = React.useState<AssigneeRoleItem[]>([]);

  // Sync form when template loads (edit or duplicate)
  const sourceTemplate = isEdit ? existingTemplate : duplicateTemplate;
  const syncRef = React.useRef(false);
  React.useEffect(() => {
    if (!sourceTemplate || syncRef.current) return;
    syncRef.current = true;

    setFormData({
      name: isEdit ? sourceTemplate.name : `${sourceTemplate.name} (Copy)`,
      description: sourceTemplate.description || '',
      category: (sourceTemplate.category as TemplateCategory) || 'Other',
      priority: sourceTemplate.priority as TaskPriority,
      estimatedHours: sourceTemplate.estimatedHours ? Number(sourceTemplate.estimatedHours) : 0,
      isActive: sourceTemplate.isActive ?? true,
    });

    if (Array.isArray(sourceTemplate.subtasks)) {
      setSubtasks(
        (sourceTemplate.subtasks as SubtaskItem[]).map((s, i) => ({
          title: s.title || '',
          description: s.description || '',
          estimatedHours: s.estimatedHours || 0,
          order: s.order ?? i,
        }))
      );
    }

    if (Array.isArray(sourceTemplate.checklistItems)) {
      setChecklistItems(sourceTemplate.checklistItems as string[]);
    }

    if (Array.isArray(sourceTemplate.assigneeRoles)) {
      setAssigneeRoles(sourceTemplate.assigneeRoles as AssigneeRoleItem[]);
    }
  }, [sourceTemplate, isEdit]);

  const handleCancel = React.useCallback(() => {
    router.push('/tasks/templates');
  }, [router]);

  const headerActions = React.useMemo(
    () => [
      <Button key="cancel" type="button" variant="outline" size="sm" onClick={handleCancel}>
        Hủy
      </Button>,
      <Button key="save" type="submit" form="template-form" size="sm" disabled={createMutation.isPending || updateMutation.isPending}>
        {(createMutation.isPending || updateMutation.isPending) ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang lưu...</>
        ) : (
          <><Save className="mr-2 h-4 w-4" />{isEdit ? 'Cập nhật' : 'Tạo mới'}</>
        )}
      </Button>,
    ],
    [handleCancel, isEdit, createMutation.isPending, updateMutation.isPending]
  );

  usePageHeader({
    title: isEdit ? 'Chỉnh sửa mẫu công việc' : 'Tạo mẫu công việc mới',
    backPath: '/tasks/templates',
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Quản lý công việc', href: '/tasks', isCurrent: false },
      { label: 'Mẫu công việc', href: '/tasks/templates', isCurrent: false },
      { label: isEdit ? 'Chỉnh sửa' : 'Tạo mới', href: '', isCurrent: true },
    ],
    actions: headerActions,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Vui lòng nhập tên mẫu');
      return;
    }

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category,
      priority: formData.priority,
      estimatedHours: formData.estimatedHours || undefined,
      isActive: formData.isActive,
      assigneeRoles: assigneeRoles.length > 0 ? assigneeRoles : undefined,
      subtasks: subtasks.length > 0 ? subtasks.map((s, i) => ({ ...s, order: i })) : undefined,
      checklistItems: checklistItems.filter(Boolean).length > 0 ? checklistItems.filter(Boolean) : undefined,
      createdBy: employee?.fullName || employee?.id || undefined,
    };

    if (isEdit && systemId) {
      updateMutation.mutate({ systemId, data: payload });
    } else {
      createMutation.mutate(payload as Parameters<typeof createMutation.mutate>[0]);
    }
  };

  // --- Subtask helpers ---
  const addSubtask = () => setSubtasks((prev) => [...prev, { title: '', description: '', estimatedHours: 0, order: prev.length }]);
  const removeSubtask = (index: number) => setSubtasks((prev) => prev.filter((_, i) => i !== index));
  const updateSubtask = (index: number, field: keyof SubtaskItem, value: string | number) =>
    setSubtasks((prev) => prev.map((s, i) => (i === index ? { ...s, [field]: value } : s)));

  // --- Checklist helpers ---
  const addChecklistItem = () => setChecklistItems((prev) => [...prev, '']);
  const removeChecklistItem = (index: number) => setChecklistItems((prev) => prev.filter((_, i) => i !== index));
  const updateChecklistItem = (index: number, value: string) =>
    setChecklistItems((prev) => prev.map((item, i) => (i === index ? value : item)));

  // --- Assignee role helpers ---
  const addAssigneeRole = () => setAssigneeRoles((prev) => [...prev, { role: 'contributor', description: '' }]);
  const removeAssigneeRole = (index: number) => setAssigneeRoles((prev) => prev.filter((_, i) => i !== index));
  const updateAssigneeRole = (index: number, field: keyof AssigneeRoleItem, value: string) =>
    setAssigneeRoles((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));

  if (isEdit && !existingTemplate) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold">Không tìm thấy mẫu công việc</h2>
        <Button onClick={() => router.push('/tasks/templates')} className="mt-4">
          Quay về danh sách
        </Button>
      </div>
    );
  }

  return (
    <FormPageShell gap="lg">
      {/* Section 1: Thông tin cơ bản */}
      <Card className={mobileBleedCardClass}>
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="template-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Tên mẫu *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nhập tên mẫu công việc"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả mẫu công việc..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="category">Danh mục</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v as TemplateCategory })}>
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">Độ ưu tiên mặc định</Label>
                <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v as TaskPriority })}>
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Thấp">Thấp</SelectItem>
                    <SelectItem value="Trung bình">Trung bình</SelectItem>
                    <SelectItem value="Cao">Cao</SelectItem>
                    <SelectItem value="Khẩn cấp">Khẩn cấp</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="estimatedHours">Giờ ước tính</Label>
                <Input
                  id="estimatedHours"
                  type="number"
                  min={0}
                  step={0.5}
                  value={formData.estimatedHours || ''}
                  onChange={(e) => setFormData({ ...formData, estimatedHours: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked as boolean })}
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Kích hoạt mẫu (hiển thị trong danh sách)
              </Label>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Section 2: Vai trò người thực hiện */}
      <Card className={mobileBleedCardClass}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Vai trò người thực hiện</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addAssigneeRole}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm vai trò
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {assigneeRoles.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Chưa có vai trò nào. Thêm vai trò để gợi ý khi sử dụng mẫu.
            </p>
          ) : (
            <div className="space-y-3">
              {assigneeRoles.map((role, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                  <Select
                    value={role.role}
                    onValueChange={(v) => updateAssigneeRole(index, 'role', v)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Chủ trì</SelectItem>
                      <SelectItem value="contributor">Thực hiện</SelectItem>
                      <SelectItem value="reviewer">Kiểm tra</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    className="flex-1"
                    value={role.description}
                    onChange={(e) => updateAssigneeRole(index, 'description', e.target.value)}
                    placeholder="Ví dụ: Backend Developer, UX Designer..."
                  />
                  <Button type="button" variant="ghost" size="icon" className="shrink-0" onClick={() => removeAssigneeRole(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 3: Công việc con */}
      <Card className={mobileBleedCardClass}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Công việc con</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addSubtask}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm công việc con
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {subtasks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Chưa có công việc con. Thêm để tạo danh sách bước thực hiện.
            </p>
          ) : (
            <div className="space-y-3">
              {subtasks.map((subtask, index) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <GripVertical className="h-4 w-4 text-muted-foreground mt-2.5 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Input
                      value={subtask.title}
                      onChange={(e) => updateSubtask(index, 'title', e.target.value)}
                      placeholder="Tiêu đề công việc con"
                    />
                    <div className="flex gap-2">
                      <Input
                        className="flex-1"
                        value={subtask.description}
                        onChange={(e) => updateSubtask(index, 'description', e.target.value)}
                        placeholder="Mô tả (tùy chọn)"
                      />
                      <Input
                        type="number"
                        min={0}
                        step={0.5}
                        className="w-24"
                        value={subtask.estimatedHours || ''}
                        onChange={(e) => updateSubtask(index, 'estimatedHours', parseFloat(e.target.value) || 0)}
                        placeholder="Giờ"
                      />
                    </div>
                  </div>
                  <Button type="button" variant="ghost" size="icon" className="shrink-0" onClick={() => removeSubtask(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 4: Checklist */}
      <Card className={mobileBleedCardClass}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Checklist</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addChecklistItem}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm mục
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {checklistItems.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Chưa có mục checklist. Thêm để tạo danh sách kiểm tra.
            </p>
          ) : (
            <div className="space-y-2">
              {checklistItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground w-6 text-center">{index + 1}.</span>
                  <Input
                    className="flex-1"
                    value={item}
                    onChange={(e) => updateChecklistItem(index, e.target.value)}
                    placeholder="Nội dung checklist..."
                  />
                  <Button type="button" variant="ghost" size="icon" className="shrink-0" onClick={() => removeChecklistItem(index)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </FormPageShell>
  );
}
