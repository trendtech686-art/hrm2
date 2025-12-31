'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useTaskTemplateStore } from '../template-store';
import { useEmployeeStore } from '@/features/employees/store';
import { useTaskStore } from '../store';
import { usePageHeader } from '@/contexts/page-header-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AssigneeMultiSelect } from './AssigneeMultiSelect';
import { 
  Plus, 
  Search, 
  Copy, 
  Eye,
  CheckCircle2,
  Clock,
  Users,
  ListChecks,
  Rocket,
} from 'lucide-react';
import type { TaskTemplate, UseTemplateOptions } from '../template-types';
import type { TaskAssignee } from '../types';
import { toast } from 'sonner';

const _categoryIcons: Record<string, React.ElementType> = {
  Development: Code,
  Design: Palette,
  Marketing: Megaphone,
  Sales: DollarSign,
  Support: Headphones,
  HR: Users,
  Operations: Settings,
  Finance: Wallet,
  Other: FileText,
};

function Code(props: React.HTMLAttributes<HTMLDivElement>) { return <div {...props}>💻</div>; }
function Palette(props: React.HTMLAttributes<HTMLDivElement>) { return <div {...props}>🎨</div>; }
function Megaphone(props: React.HTMLAttributes<HTMLDivElement>) { return <div {...props}>📣</div>; }
function DollarSign(props: React.HTMLAttributes<HTMLDivElement>) { return <div {...props}>💰</div>; }
function Headphones(props: React.HTMLAttributes<HTMLDivElement>) { return <div {...props}>🎧</div>; }
function Settings(props: React.HTMLAttributes<HTMLDivElement>) { return <div {...props}>⚙️</div>; }
function Wallet(props: React.HTMLAttributes<HTMLDivElement>) { return <div {...props}>💼</div>; }
function FileText(props: React.HTMLAttributes<HTMLDivElement>) { return <div {...props}>📄</div>; }

export function TaskTemplatesPage() {
  const router = useRouter();
  const templateStore = useTaskTemplateStore();
  const { data: employees } = useEmployeeStore();
  const taskStore = useTaskStore();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all');
  const [showUseDialog, setShowUseDialog] = React.useState(false);
  const [selectedTemplate, setSelectedTemplate] = React.useState<TaskTemplate | null>(null);
  
  // Use template form state
  const [useFormData, setUseFormData] = React.useState({
    title: '',
    dueDate: '',
    assignees: [] as TaskAssignee[],
  });

  usePageHeader({
    actions: [
      <Button key="create" onClick={() => router.push('/tasks/templates/new')}>
        <Plus className="mr-2 h-4 w-4" />
        Tạo mẫu mới
      </Button>
    ],
  });

  // Filter templates
  const filteredTemplates = React.useMemo(() => {
    let result = templateStore.data;

    if (categoryFilter !== 'all') {
      result = result.filter(t => t.category === categoryFilter);
    }

    if (searchQuery.trim()) {
      result = templateStore.search(searchQuery);
    }

    return result.filter(t => t.isActive);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- templateStore.data triggers recalculation, templateStore.search is stable
  }, [templateStore.data, searchQuery, categoryFilter]);

  // Group by category
  const groupedTemplates = React.useMemo(() => {
    const groups: Record<string, TaskTemplate[]> = {};
    filteredTemplates.forEach(template => {
      if (!groups[template.category]) {
        groups[template.category] = [];
      }
      groups[template.category].push(template);
    });
    return groups;
  }, [filteredTemplates]);

  const handleUseTemplate = (template: TaskTemplate) => {
    setSelectedTemplate(template);
    setUseFormData({
      title: '',
      dueDate: '',
      assignees: [],
    });
    setShowUseDialog(true);
  };

  const handleSubmitUseTemplate = () => {
    if (!selectedTemplate) return;

    if (!useFormData.title.trim()) {
      toast.error('Vui lòng nhập tiêu đề công việc');
      return;
    }
    if (!useFormData.dueDate) {
      toast.error('Vui lòng chọn deadline');
      return;
    }
    if (useFormData.assignees.length === 0) {
      toast.error('Vui lòng chọn người thực hiện');
      return;
    }

    try {
      const options: UseTemplateOptions = {
        templateId: selectedTemplate.systemId,
        title: useFormData.title,
        dueDate: useFormData.dueDate,
        assignees: useFormData.assignees,
      };

      const newTask = templateStore.createTaskFromTemplate(options);
      taskStore.add(newTask);

      toast.success(`Đã tạo công việc từ mẫu "${selectedTemplate.name}"`);
      setShowUseDialog(false);
      router.push('/tasks');
    } catch (_error) {
      toast.error('Không thể tạo công việc từ mẫu');
    }
  };

  const mostUsedTemplates = templateStore.getMostUsed(3);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng mẫu</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templateStore.data.filter(t => t.isActive).length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Danh mục</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(templateStore.data.filter(t => t.isActive).map(t => t.category)).size}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dùng nhiều nhất</CardTitle>
            <Rocket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mostUsedTemplates[0]?.usageCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {mostUsedTemplates[0]?.name || 'Chưa có'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng lượt dùng</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {templateStore.data.reduce((sum, t) => sum + t.usageCount, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm mẫu công việc..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Tất cả danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                <SelectItem value="Development">Development</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="Support">Support</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid by Category */}
      {Object.keys(groupedTemplates).length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Không tìm thấy mẫu công việc nào
          </CardContent>
        </Card>
      ) : (
        Object.entries(groupedTemplates).map(([category, templates]) => (
          <div key={category} className="space-y-4">
            <h2 className="text-xl font-semibold">{category}</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {templates.map(template => (
                <Card key={template.systemId} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {template.description}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {template.id}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{template.estimatedHours}h</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{template.assigneeRoles.length} roles</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>{template.subtasks.length} steps</span>
                      </div>
                    </div>

                    {/* Usage Count */}
                    <div className="text-xs text-muted-foreground">
                      Đã dùng {template.usageCount} lần
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleUseTemplate(template)}
                      >
                        <Rocket className="mr-1 h-3 w-3" />
                        Sử dụng
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/tasks/templates/${template.systemId}`)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => templateStore.duplicate(template.systemId)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Use Template Dialog */}
      <Dialog open={showUseDialog} onOpenChange={setShowUseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tạo công việc từ mẫu: {selectedTemplate?.name}</DialogTitle>
            <DialogDescription>
              Điền thông tin để tạo công việc mới từ mẫu này
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Title */}
            <div>
              <Label htmlFor="task-title">Tiêu đề công việc *</Label>
              <Input
                id="task-title"
                value={useFormData.title}
                onChange={(e) => setUseFormData({ ...useFormData, title: e.target.value })}
                placeholder="Nhập tiêu đề công việc..."
              />
            </div>

            {/* Due Date */}
            <div>
              <Label htmlFor="due-date">Deadline *</Label>
              <Input
                id="due-date"
                type="date"
                value={useFormData.dueDate}
                onChange={(e) => setUseFormData({ ...useFormData, dueDate: e.target.value })}
              />
            </div>

            {/* Assignees */}
            <div>
              <Label>Người thực hiện *</Label>
              <div className="mt-2 space-y-2">
                <AssigneeMultiSelect
                  assignees={useFormData.assignees}
                  availableEmployees={employees.map(e => ({
                    systemId: e.systemId,
                    name: e.fullName,
                  }))}
                  onChange={(assignees) => setUseFormData({ ...useFormData, assignees })}
                  showRoles={true}
                />
              </div>
              {selectedTemplate && selectedTemplate.assigneeRoles.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Gợi ý vai trò: {selectedTemplate.assigneeRoles.map(r => r.description).join(', ')}
                </p>
              )}
            </div>

            {/* Template Preview */}
            {selectedTemplate && (
              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="text-sm font-medium mb-2">Mẫu bao gồm:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ {selectedTemplate.subtasks.length} công việc con</li>
                  <li>✓ Ước tính: {selectedTemplate.estimatedHours} giờ</li>
                  <li>✓ Độ ưu tiên: {selectedTemplate.priority}</li>
                  {selectedTemplate.checklistItems && selectedTemplate.checklistItems.length > 0 && (
                    <li>✓ {selectedTemplate.checklistItems.length} checklist items</li>
                  )}
                </ul>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUseDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleSubmitUseTemplate}>
              <Rocket className="mr-2 h-4 w-4" />
              Tạo công việc
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
