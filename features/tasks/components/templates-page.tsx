'use client'

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { generateSubEntityId } from '@/lib/id-utils';
import { useTaskTemplates, useTaskTemplateMutations } from '../hooks/use-task-templates';
import { useMeiliEmployeeSearch } from '@/hooks/use-meilisearch';
import { useTasks, useTaskMutations } from '../hooks/use-tasks';
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
import { Pagination } from '@/components/shared/pagination';
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
import type { TaskTemplate } from '../template-types';
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
  const searchParams = useSearchParams();
  
  // Pagination state from URL
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  
  // Filters
  const [searchQuery, setSearchQuery] = React.useState(searchParams.get('search') || '');
  const [categoryFilter, setCategoryFilter] = React.useState<string>(searchParams.get('category') || 'all');
  
  // ✅ Use API Filter with server-side pagination
  const { data: templatesResult, isLoading } = useTaskTemplates({
    search: searchQuery || undefined,
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
    page,
    limit,
  });
  
  const templates = React.useMemo(() => templatesResult?.data || [], [templatesResult?.data]);
  const pagination = templatesResult?.pagination;

  const { incrementUsage } = useTaskTemplateMutations();
  
  // Employee search for assignee selection
  const [employeeSearch, setEmployeeSearch] = React.useState('');
  const [debouncedEmployeeSearch, setDebouncedEmployeeSearch] = React.useState('');
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedEmployeeSearch(employeeSearch), 300);
    return () => clearTimeout(timer);
  }, [employeeSearch]);
  const { data: employeesResult } = useMeiliEmployeeSearch({ query: debouncedEmployeeSearch, limit: 100 });
  const employees = React.useMemo(() => employeesResult?.data ?? [], [employeesResult?.data]);
  const { data: tasksData } = useTasks();
  const _tasks = tasksData?.data ?? [];
  const { create: createTaskMutation } = useTaskMutations({
    onSuccess: () => {
      toast.success('Đã tạo công việc từ mẫu');
      router.push('/tasks');
    },
    onError: (error) => {
      toast.error('Lỗi', { description: error.message });
    }
  });

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

  // Filter templates - server-side handles search, client-side handles isActive
  const filteredTemplates = React.useMemo(() => {
    return templates.filter(t => t.isActive);
  }, [templates]);

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

  // Calculate most used for stats
  const mostUsedTemplates = React.useMemo(() => {
    return [...templates]
      .filter(t => t.isActive)
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 3);
  }, [templates]);

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
      // Build description with checklist
      let description = selectedTemplate.description;
      if (selectedTemplate.checklistItems && selectedTemplate.checklistItems.length > 0) {
        description += '\n\n**Checklist:**\n';
        selectedTemplate.checklistItems.forEach(item => {
          description += `- [ ] ${item}\n`;
        });
      }

      // Convert template subtasks to task subtasks
      const subtasks = selectedTemplate.subtasks.map((st, _idx) => ({
        id: generateSubEntityId('SUBTASK'),
        title: st.title,
        completed: false,
      }));

      // Get owner for backward compatibility
      const owner = useFormData.assignees.find(a => a.role === 'owner') || useFormData.assignees[0];

      // Create task object
      const newTask = {
        title: useFormData.title,
        description,
        assignees: useFormData.assignees,
        assigneeId: owner?.employeeSystemId,
        assigneeName: owner?.employeeName || '',
        priority: selectedTemplate.priority,
        status: 'Chưa bắt đầu' as const,
        startDate: new Date().toISOString().split('T')[0],
        dueDate: useFormData.dueDate,
        estimatedHours: selectedTemplate.estimatedHours,
        progress: 0,
        subtasks,
        activities: [],
      };

      createTaskMutation.mutate(newTask);
      incrementUsage.mutate(selectedTemplate.systemId);

      setShowUseDialog(false);
    } catch (_error) {
      toast.error('Không thể tạo công việc từ mẫu');
    }
  };

  // Handle search with debounce
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    // Update URL params for shareable links
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    params.set('page', '1');
    router.replace(`?${params.toString()}`);
  };

  // Handle category filter
  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (value && value !== 'all') {
      params.set('category', value);
    } else {
      params.delete('category');
    }
    params.set('page', '1');
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle size="sm">Tổng mẫu</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination?.total || templates.filter(t => t.isActive).length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle size="sm">Danh mục</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(templates.filter(t => t.isActive).map(t => t.category)).size}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle size="sm">Dùng nhiều nhất</CardTitle>
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
            <CardTitle size="sm">Tổng lượt dùng</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {templates.reduce((sum, t) => sum + t.usageCount, 0)}
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
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full md:w-50">
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
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-full mt-2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : Object.keys(groupedTemplates).length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Không tìm thấy mẫu công việc nào
          </CardContent>
        </Card>
      ) : (
        Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
          <div key={category} className="space-y-4">
            <h2 className="text-xl font-semibold">{category}</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categoryTemplates.map(template => (
                <Card key={template.systemId} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <CardTitle>{template.name}</CardTitle>
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
                        <span>{(template.assigneeRoles as unknown[] | null)?.length ?? 0} roles</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>{(template.subtasks as unknown[] | null)?.length ?? 0} steps</span>
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
                        onClick={() => router.push(`/tasks/templates/new?duplicate=${template.systemId}`)}
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

      {/* Pagination */}
      {pagination && (
        <Pagination
          page={pagination.page}
          limit={pagination.limit}
          total={pagination.total}
          totalPages={pagination.totalPages}
          hasNext={pagination.page < pagination.totalPages}
          hasPrev={pagination.page > 1}
          onPageChange={(newPage) => {
            const params = new URLSearchParams(searchParams?.toString() || '');
            params.set('page', String(newPage));
            router.replace(`?${params.toString()}`);
          }}
          onPageSizeChange={(newSize) => {
            const params = new URLSearchParams(searchParams?.toString() || '');
            params.set('limit', String(newSize));
            params.set('page', '1');
            router.replace(`?${params.toString()}`);
          }}
        />
      )}

      {/* Use Template Dialog */}
      <Dialog open={showUseDialog} onOpenChange={setShowUseDialog}>
        <DialogContent mobileFullScreen className="max-w-2xl">
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
              {selectedTemplate && selectedTemplate.assigneeRoles && (selectedTemplate.assigneeRoles as Array<{role: string; description: string}>).length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Gợi ý vai trò: {(selectedTemplate.assigneeRoles as Array<{role: string; description: string}>).map(r => r.description).join(', ')}
                </p>
              )}
            </div>

            {/* Template Preview */}
            {selectedTemplate && (
              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="text-sm font-medium mb-2">Mẫu bao gồm:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ {(selectedTemplate.subtasks as unknown[] | null)?.length ?? 0} công việc con</li>
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
