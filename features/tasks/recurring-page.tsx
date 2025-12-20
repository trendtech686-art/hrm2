'use client'

import * as React from 'react';
import { useNavigate } from '@/lib/next-compat';
import { useRecurringTaskStore } from './recurring-store';
import { useTaskStore } from './store';
import { useEmployeeStore } from '../employees/store';
import { usePageHeader } from '../../contexts/page-header-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { AssigneeMultiSelect } from './components/AssigneeMultiSelect';
import { 
  Plus, 
  Play, 
  Pause, 
  Trash2, 
  Calendar,
  Clock,
  Users,
  Repeat,
  CheckCircle2,
} from 'lucide-react';
import type { RecurringTask, RecurrencePattern, RecurrenceFrequency } from './recurring-types';
import type { TaskAssignee, TaskPriority } from './types';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';

const frequencyLabels: Record<RecurrenceFrequency, string> = {
  daily: 'Hàng ngày',
  weekly: 'Hàng tuần',
  monthly: 'Hàng tháng',
  yearly: 'Hàng năm',
};

export function RecurringTasksPage() {
  const navigate = useNavigate();
  const recurringStore = useRecurringTaskStore();
  const taskStore = useTaskStore();
  const { data: employees } = useEmployeeStore();

  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    priority: 'Trung bình' as TaskPriority,
    estimatedHours: 8,
    assignees: [] as TaskAssignee[],
    frequency: 'weekly' as RecurrenceFrequency,
    interval: 1,
    startDate: '',
    durationDays: 1,
    createDaysBefore: 0,
  });

  const handleProcessRecurring = () => {
    recurringStore.processRecurringTasks(taskStore);
    toast.success('Đã xử lý công việc lặp lại');
  };

  usePageHeader({
    actions: [
      <Button key="create" onClick={() => setShowCreateDialog(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Tạo công việc lặp lại
      </Button>,
      <Button 
        key="process" 
        variant="outline"
        onClick={handleProcessRecurring}
      >
        <Repeat className="mr-2 h-4 w-4" />
        Xử lý ngay
      </Button>
    ],
  });

  const activeTasks = recurringStore.getActive();
  const pausedTasks = recurringStore.getPaused();

  const handleCreateRecurring = () => {
    if (!formData.title.trim()) {
      toast.error('Vui lòng nhập tiêu đề');
      return;
    }
    if (!formData.startDate) {
      toast.error('Vui lòng chọn ngày bắt đầu');
      return;
    }
    if (formData.assignees.length === 0) {
      toast.error('Vui lòng chọn người thực hiện');
      return;
    }

    const pattern: RecurrencePattern = {
      frequency: formData.frequency,
      interval: formData.interval,
    };

    const owner = formData.assignees.find(a => a.role === 'owner') || formData.assignees[0];

    const recurringTask: Omit<RecurringTask, 'systemId'> = {
      id: '',
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      estimatedHours: formData.estimatedHours,
      assignees: formData.assignees,
      assignerId: owner.employeeSystemId,
      assignerName: owner.employeeName,
      recurrencePattern: pattern,
      startDate: formData.startDate,
      nextOccurrenceDate: formData.startDate,
      createDaysBefore: formData.createDaysBefore,
      durationDays: formData.durationDays,
      isActive: true,
      isPaused: false,
      createdTaskIds: [],
      occurrenceCount: 0,
      createdBy: 'CURRENT_USER',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    recurringStore.add(recurringTask as any);
    toast.success('Đã tạo công việc lặp lại');
    setShowCreateDialog(false);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      priority: 'Trung bình',
      estimatedHours: 8,
      assignees: [],
      frequency: 'weekly',
      interval: 1,
      startDate: '',
      durationDays: 1,
      createDaysBefore: 0,
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
            <Play className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTasks.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tạm dừng</CardTitle>
            <Pause className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pausedTasks.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng công việc đã tạo</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recurringStore.data.reduce((sum, rt) => sum + rt.occurrenceCount, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sắp tới hôm nay</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recurringStore.getTasksToCreateToday?.()?.length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Tasks */}
      {activeTasks.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Đang hoạt động</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeTasks.map(task => (
              <RecurringTaskCard
                key={task.systemId}
                task={task}
                onTogglePause={() => recurringStore.togglePause(task.systemId)}
                onDeactivate={() => recurringStore.deactivate(task.systemId)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Paused Tasks */}
      {pausedTasks.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Tạm dừng</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pausedTasks.map(task => (
              <RecurringTaskCard
                key={task.systemId}
                task={task}
                onTogglePause={() => recurringStore.togglePause(task.systemId)}
                onDeactivate={() => recurringStore.deactivate(task.systemId)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {activeTasks.length === 0 && pausedTasks.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Repeat className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có công việc lặp lại</h3>
            <p className="text-muted-foreground mb-4">
              Tạo công việc lặp lại để tự động hóa các tác vụ định kỳ
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Tạo công việc lặp lại
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo công việc lặp lại</DialogTitle>
            <DialogDescription>
              Thiết lập công việc sẽ tự động tạo theo lịch trình
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Tiêu đề *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Báo cáo tuần..."
              />
            </div>

            <div>
              <Label>Mô tả</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả công việc..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Độ ưu tiên</Label>
                <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v as TaskPriority })}>
                  <SelectTrigger>
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
                <Label>Ước tính (giờ)</Label>
                <Input
                  type="number"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData({ ...formData, estimatedHours: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <Label>Người thực hiện *</Label>
              <AssigneeMultiSelect
                assignees={formData.assignees}
                availableEmployees={employees.map(e => ({
                  systemId: e.systemId,
                  name: e.fullName,
                }))}
                onChange={(assignees) => setFormData({ ...formData, assignees })}
                showRoles={true}
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-4">Lịch lặp lại</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tần suất</Label>
                  <Select value={formData.frequency} onValueChange={(v) => setFormData({ ...formData, frequency: v as RecurrenceFrequency })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Hàng ngày</SelectItem>
                      <SelectItem value="weekly">Hàng tuần</SelectItem>
                      <SelectItem value="monthly">Hàng tháng</SelectItem>
                      <SelectItem value="yearly">Hàng năm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Mỗi</Label>
                  <Input
                    type="number"
                    min={1}
                    value={formData.interval}
                    onChange={(e) => setFormData({ ...formData, interval: parseInt(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.frequency === 'daily' && `ngày`}
                    {formData.frequency === 'weekly' && `tuần`}
                    {formData.frequency === 'monthly' && `tháng`}
                    {formData.frequency === 'yearly' && `năm`}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <Label>Ngày bắt đầu *</Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Thời lượng (ngày)</Label>
                  <Input
                    type="number"
                    min={1}
                    value={formData.durationDays}
                    onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value) })}
                  />
                </div>

                <div>
                  <Label>Tạo trước (ngày)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.createDaysBefore}
                    onChange={(e) => setFormData({ ...formData, createDaysBefore: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateRecurring}>
              <Plus className="mr-2 h-4 w-4" />
              Tạo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RecurringTaskCard({
  task,
  onTogglePause,
  onDeactivate,
}: {
  task: RecurringTask;
  onTogglePause: () => void;
  onDeactivate: () => void;
}) {
  return (
    <Card className={cn(task.isPaused && 'opacity-60')}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-base">{task.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {task.description || 'Không có mô tả'}
            </CardDescription>
          </div>
          <Badge variant="outline">
            {frequencyLabels[task.recurrencePattern.frequency]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Lần sau: {task.nextOccurrenceDate || 'N/A'}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>Đã tạo: {task.occurrenceCount} lần</span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant={task.isPaused ? 'default' : 'outline'}
            className="flex-1"
            onClick={onTogglePause}
          >
            {task.isPaused ? (
              <>
                <Play className="mr-1 h-3 w-3" />
                Tiếp tục
              </>
            ) : (
              <>
                <Pause className="mr-1 h-3 w-3" />
                Tạm dừng
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={onDeactivate}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
