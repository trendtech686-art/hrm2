import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useTaskStore } from './store.ts';
import { useEmployeeStore } from '../employees/store.ts';
import { useAuth } from '../../contexts/auth-context.tsx';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { useRouteMeta } from '../../hooks/use-route-meta';
import type { Task, TaskPriority, TaskStatus } from './types.ts';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Button } from '../../components/ui/button.tsx';
import { Label } from '../../components/ui/label.tsx';
import { Input } from '../../components/ui/input.tsx';
import { Textarea } from '../../components/ui/textarea.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select.tsx';
import { Checkbox } from '../../components/ui/checkbox.tsx';
import { DateTimePicker24h } from '../../components/ui/date-time-picker-24h.tsx';
import { Badge } from '../../components/ui/badge.tsx';
import { VirtualizedCombobox } from '../../components/ui/virtualized-combobox.tsx';
import { ArrowLeft, Save, FileText, Plus, X, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { loadTaskTemplates, loadTaskTypes } from '../../features/settings/tasks/tasks-settings-page.tsx';
import { asSystemId, asBusinessId } from '../../lib/id-types.ts';

export function TaskFormPage() {
  const { systemId } = ReactRouterDOM.useParams<{ systemId: string }>();
  const routeSystemId = React.useMemo(() => (systemId ? asSystemId(systemId) : undefined), [systemId]);
  const navigate = ReactRouterDOM.useNavigate();
  const routeMeta = useRouteMeta();
  const store = useTaskStore();
  const { findById, add, update } = store;
  const { data: employees } = useEmployeeStore();
  const { isAdmin, employee: authEmployee } = useAuth();
  
  // Redirect non-admin users
  React.useEffect(() => {
    if (!isAdmin) {
      toast.error('Bạn không có quyền tạo hoặc chỉnh sửa công việc');
      navigate('/tasks');
    }
  }, [isAdmin, navigate]);

  const task = React.useMemo(() => (routeSystemId ? findById(routeSystemId) : null), [routeSystemId, findById]);
  const isEdit = !!systemId;

  const [formData, setFormData] = React.useState(() => ({
    id: task?.id || '',
    title: task?.title || '',
    description: task?.description || '',
    type: task?.type || '',
    assigneeId: task?.assigneeId || '',
    assigneeName: task?.assigneeName || '',
    priority: task?.priority || 'Trung bình' as TaskPriority,
    startDate: task?.startDate || new Date().toISOString(),
    dueDate: task?.dueDate || '',
    requiresEvidence: task?.requiresEvidence || false,
  }));

  // Sync formData when task loads (edit mode only)
  React.useEffect(() => {
    if (task && isEdit) {
      setFormData({
        id: task.id || '',
        title: task.title || '',
        description: task.description || '',
        type: task.type || '',
        assigneeId: task.assigneeId || '',
        assigneeName: task.assigneeName || '',
        priority: task.priority || 'Trung bình' as TaskPriority,
        startDate: task.startDate || new Date().toISOString(),
        dueDate: task.dueDate || '',
        requiresEvidence: task.requiresEvidence || false,
      });
    }
  }, [task?.systemId, isEdit]); // Only re-run when task systemId changes

  const [showTemplates, setShowTemplates] = React.useState(false);
  const templates = React.useMemo(() => loadTaskTemplates(), []);
  const taskTypes = React.useMemo(() => loadTaskTypes(), []);

  const handleCancel = React.useCallback(() => {
    navigate('/tasks');
  }, [navigate]);

  const headerActions = React.useMemo(() => [
    <Button 
      key="cancel" 
      type="button"
      variant="outline" 
      size="sm"
      className="h-9"
      onClick={handleCancel}
    >
      Hủy
    </Button>,
    <Button 
      key="save" 
      type="submit"
      form="task-form"
      size="sm"
      className="h-9"
    >
      <Save className="mr-2 h-4 w-4" />
      {isEdit ? 'Cập nhật' : 'Tạo mới'}
    </Button>
  ], [handleCancel, isEdit]);

  usePageHeader({
    title: isEdit ? 'Chỉnh sửa công việc' : 'Tạo công việc mới',
    backPath: '/tasks',
    breadcrumb: isEdit ? [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Quản lý công việc', href: '/tasks', isCurrent: false },
      { label: task?.title || task?.id || 'Chi tiết', href: `/tasks/${systemId}`, isCurrent: false },
      { label: 'Chỉnh sửa', href: '', isCurrent: true }
    ] : [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Quản lý công việc', href: '/tasks', isCurrent: false },
      { label: 'Thêm mới', href: '', isCurrent: true }
    ],
    actions: headerActions,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Vui lòng nhập tiêu đề công việc');
      return;
    }
    if (!formData.assigneeId) {
      toast.error('Vui lòng chọn người thực hiện');
      return;
    }
    if (!formData.startDate) {
      toast.error('Vui lòng chọn ngày bắt đầu');
      return;
    }
    if (!formData.dueDate) {
      toast.error('Vui lòng chọn deadline');
      return;
    }
    
    const startDateTime = new Date(formData.startDate);
    const dueDateTime = new Date(formData.dueDate);
    
    if (startDateTime >= dueDateTime) {
      toast.error('Ngày bắt đầu phải trước deadline');
      return;
    }

    // Auto-calculate estimatedHours from deadline - startDate
    const diffMs = dueDateTime.getTime() - startDateTime.getTime();
    const estimatedHours = diffMs / (1000 * 60 * 60); // Convert ms to hours

    const taskData = {
      ...formData,
      id: formData.id ? asBusinessId(formData.id) : (task?.id ?? asBusinessId('')),
      assigneeId: formData.assigneeId ? asSystemId(formData.assigneeId) : (task?.assigneeId ?? asSystemId('SYSTEM')),
      estimatedHours: Math.round(estimatedHours * 100) / 100, // Round to 2 decimal places
      status: task?.status || 'Chưa bắt đầu' as TaskStatus,
      progress: task?.progress || 0,
      assignerId: authEmployee?.systemId || asSystemId('SYSTEM'),
      assignerName: authEmployee?.fullName || authEmployee?.id || 'Hệ thống',
    };

    if (isEdit && task) {
      update(task.systemId, { ...task, ...taskData });
      toast.success('Đã cập nhật công việc');
    } else {
      add(taskData as any);
      toast.success('Đã tạo công việc mới');
    }
    navigate('/tasks');
  };

  const handleApplyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setFormData({
        ...formData,
        title: template.title,
        description: template.description,
      });
      setShowTemplates(false);
      toast.success(`Đã áp dụng mẫu: ${template.name}`);
    }
  };

  if (isEdit && !task) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold">Không tìm thấy công việc</h2>
        <Button onClick={() => navigate('/tasks')} className="h-9 mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay về danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Template Selector */}
      {!isEdit && templates.length > 0 && (
        <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-h4 font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Sử dụng mẫu có sẵn
              </CardTitle>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-9"
                onClick={() => setShowTemplates(!showTemplates)}
              >
                {showTemplates ? 'Ẩn' : 'Hiện'} mẫu
              </Button>
            </div>
          </CardHeader>
          {showTemplates && (
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {templates.map(template => (
                  <Button
                    key={template.id}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-auto py-3 px-4 justify-start text-left"
                    onClick={() => handleApplyTemplate(template.id)}
                  >
                    <div className="flex flex-col gap-1 w-full">
                      <span className="font-medium text-body-sm">{template.name}</span>
                      <span className="text-body-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {template.estimatedHours}h
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Section 1: Thông tin cơ bản */}
      <Card>
        <CardHeader>
          <CardTitle className="text-h4 font-semibold">Thông tin cơ bản</CardTitle>
        </CardHeader>
        <CardContent>
          <form id="task-form" onSubmit={handleSubmit} className="space-y-4">
            {/* Business ID - Only for new tasks */}
            {!isEdit && (
              <div>
                <Label htmlFor="id">Mã công việc (tùy chọn)</Label>
                <Input
                  id="id"
                  className="h-9"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value.toUpperCase() })}
                  placeholder="Để trống = tự động (CVNB-000001, CVNB-000002...)"
                />
                <p className="text-body-xs text-muted-foreground mt-1.5">
                  Bỏ trống để hệ thống tự động tạo mã theo thứ tự
                </p>
              </div>
            )}

            {/* Title */}
            <div>
              <Label htmlFor="title">Tiêu đề công việc *</Label>
              <Input
                id="title"
                className="h-9"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Nhập tiêu đề công việc"
                required
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Mô tả chi tiết</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả chi tiết công việc..."
                rows={4}
              />
            </div>

          </form>
        </CardContent>
      </Card>

      {/* Section 2: Phân công & Thời gian */}
      <Card>
        <CardHeader>
          <CardTitle className="text-h4 font-semibold">Phân công & Thời gian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Assignee - VirtualizedCombobox */}
            <div>
              <Label htmlFor="assigneeId">Người thực hiện *</Label>
              <VirtualizedCombobox
                value={
                  formData.assigneeId
                    ? {
                        value: formData.assigneeId,
                        label: formData.assigneeName,
                        subtitle: employees.find(e => e.systemId === formData.assigneeId)?.id,
                      }
                    : null
                }
                onChange={(option) => {
                  if (option) {
                    setFormData({
                      ...formData,
                      assigneeId: option.value,
                      assigneeName: option.label,
                    });
                  } else {
                    setFormData({
                      ...formData,
                      assigneeId: '',
                      assigneeName: '',
                    });
                  }
                }}
                options={employees.map(emp => ({
                  value: emp.systemId,
                  label: emp.fullName,
                  subtitle: emp.id,
                }))}
                placeholder="Chọn người thực hiện"
                searchPlaceholder="Tìm kiếm nhân viên..."
                emptyPlaceholder="Không tìm thấy nhân viên"
              />
            </div>

            {/* Priority */}
            <div>
              <Label htmlFor="priority">Độ ưu tiên</Label>
              <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v as TaskPriority })}>
                <SelectTrigger id="priority" className="h-9">
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

            {/* Task Type */}
            {taskTypes.length > 0 && (
              <div>
                <Label htmlFor="type">Loại công việc</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                  <SelectTrigger id="type" className="h-9">
                    <SelectValue placeholder="Chọn loại công việc" />
                  </SelectTrigger>
                  <SelectContent>
                    {taskTypes.map(t => (
                      <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Start Date and Time */}
            <div>
              <Label htmlFor="startDate">Ngày bắt đầu *</Label>
              <DateTimePicker24h
                id="startDate"
                value={formData.startDate ? new Date(formData.startDate) : null}
                onChange={(date) => {
                  setFormData({ ...formData, startDate: date ? date.toISOString() : '' });
                }}
                placeholder="Chọn ngày và giờ bắt đầu"
              />
            </div>

            {/* Due Date and Time */}
            <div>
              <Label htmlFor="dueDate">Deadline *</Label>
              <DateTimePicker24h
                id="dueDate"
                value={formData.dueDate ? new Date(formData.dueDate) : null}
                onChange={(date) => {
                  setFormData({ ...formData, dueDate: date ? date.toISOString() : '' });
                }}
                placeholder="Chọn ngày và giờ deadline"
              />
            </div>
          </div>

          {/* Estimated Hours Display */}
          {formData.startDate && formData.dueDate && (
            <div className="mt-4 p-3 border rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-body-sm font-medium">Giờ ước tính:</span>
                <span className="text-body-sm font-bold text-blue-600">
                  {(() => {
                    const start = new Date(formData.startDate);
                    const end = new Date(formData.dueDate);
                    const diffMs = end.getTime() - start.getTime();
                    const hours = diffMs / (1000 * 60 * 60);
                    return hours > 0 ? `${Math.round(hours * 100) / 100} giờ` : '0 giờ';
                  })()}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 3: Cài đặt nâng cao */}
      <Card>
        <CardHeader>
          <CardTitle className="text-h4 font-semibold">Cài đặt nâng cao</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Requires Evidence */}
            <div className="flex items-start space-x-3 p-3 border rounded-lg bg-muted/30">
              <Checkbox
                id="requiresEvidence"
                checked={formData.requiresEvidence}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, requiresEvidence: checked as boolean })
                }
                className="mt-0.5"
              />
              <div className="flex-1">
                <Label 
                  htmlFor="requiresEvidence" 
                  className="text-body-sm font-medium cursor-pointer"
                >
                  Yêu cầu bằng chứng hoàn thành
                </Label>
                <p className="text-body-xs text-muted-foreground mt-1">
                  Khi bật, người thực hiện phải upload hình ảnh (tối đa 5 ảnh) và ghi chú (tối thiểu 10 ký tự) khi hoàn thành. Admin sẽ phê duyệt hoặc yêu cầu làm lại.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
