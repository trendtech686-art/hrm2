'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { generateSubEntityId } from '@/lib/id-utils';
import { useTaskById, useTaskMutations } from '../hooks/use-tasks';
import { useAllEmployees } from '@/features/employees/hooks/use-all-employees';
import { useAuth } from '@/contexts/auth-context';
import { usePageHeader } from '@/contexts/page-header-context';
import { formatDate, formatDateTimeForDisplay } from '@/lib/date-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DetailPageShell, mobileBleedCardClass } from '@/components/layout/page-section';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Comments } from '@/components/Comments';
import { SubtaskList } from '@/components/shared/subtask-list';
import { TimeTracker } from '@/components/TimeTracker';
import { EntityActivityTable } from '@/components/shared/entity-activity-table';
import { ApprovalDialog } from './ApprovalDialog';
import { CompletionDialog } from './CompletionDialog';
import { EvidenceViewer } from './EvidenceViewer';
import { EvidenceThumbnailGrid } from './EvidenceThumbnailGrid';
import { SlaTimer } from '@/components/SlaTimer';
import { useTasksSettings } from '@/features/settings/tasks/hooks/use-tasks-settings';
import { asSystemId } from '@/lib/id-types';
import { SectionHeading } from '@/components/shared/section-heading';
import { ArrowLeft, Edit, Trash2, Calendar, Clock, User, Flag, CheckCircle, Eye, AlertCircle, Play, Loader2, MoreHorizontal } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import type { Task } from '@/lib/types/prisma-extended';
import type { TaskPriority, TaskStatus } from '../types';
import { normalizeTaskPriority } from '../types';
import { useBreakpoint } from '@/contexts/breakpoint-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Helper functions - defined outside component to avoid hoisting issues
const getPriorityVariant = (priority: TaskPriority): "default" | "secondary" | "warning" | "destructive" => {
  const map = { 'Thấp': 'secondary', 'Trung bình': 'default', 'Cao': 'warning', 'Khẩn cấp': 'destructive' } as const;
  return map[normalizeTaskPriority(priority)];
};

const getStatusVariant = (status: TaskStatus): "default" | "secondary" | "warning" | "success" | "outline" => {
  const map: Record<string, "default" | "secondary" | "warning" | "success" | "outline"> = { 
    'Chưa bắt đầu': 'outline', 
    'Đang thực hiện': 'warning', 
    'Chờ duyệt': 'secondary',
    'Hoàn thành': 'success', 
    'Đã hủy': 'default' 
  };
  return map[status] || 'default';
};

export function TaskDetailPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const routeSystemId = React.useMemo(() => (systemId ? asSystemId(systemId) : undefined), [systemId]);
  const router = useRouter();
  
  const { data: task, isLoading } = useTaskById(routeSystemId);
  const { remove: removeMutation, update: updateMutation } = useTaskMutations();
  
  // Wrapper functions for legacy interface
  const remove = React.useCallback((systemId: string) => {
    removeMutation.mutate(systemId);
  }, [removeMutation]);
  
  const update = React.useCallback(async (systemId: string, data: Partial<Task>) => {
    await updateMutation.mutateAsync({ systemId, data });
  }, [updateMutation]);
  
  const approveTask = React.useCallback(async (systemId: string, _comment?: string) => {
    await updateMutation.mutateAsync({ systemId, data: { 
      status: 'Hoàn thành', 
      approvalStatus: 'approved',
      completedDate: new Date().toISOString(),
      progress: 100,
    } });
  }, [updateMutation]);
  
  const rejectTask = React.useCallback(async (systemId: string, reason: string) => {
    await updateMutation.mutateAsync({ systemId, data: { 
      status: 'Đang thực hiện', 
      approvalStatus: 'rejected', 
      rejectionReason: reason,
    } });
  }, [updateMutation]);
  
  const { isAdmin, employee, can } = useAuth();
  const { isMobile } = useBreakpoint();
  const { data: allEmployees } = useAllEmployees();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = React.useState(false);
  const [showEvidenceViewer, setShowEvidenceViewer] = React.useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = React.useState(false);

  // Get all employees for @mention in comments
  const employeeMentions = React.useMemo(() => {
    return allEmployees
      .filter(e => !e.isDeleted)
      .map(e => ({
        id: e.systemId,
        label: e.fullName,
        avatar: e.avatarUrl,
      }));
  }, [allEmployees]);

  // Check if current user can edit this task
  const canEdit = React.useMemo(() => {
    if (isAdmin) return true;
    if (!task || !employee) return false;
    // Must have edit_tasks permission AND be assigned
    if (!can('edit_tasks')) return false;
    return task.assigneeId === employee.systemId ||
      task.assignees?.some(a => a.employeeSystemId === employee.systemId);
  }, [isAdmin, task, employee, can]);

  // Where to go back: employees go to /my-tasks, admins go to /tasks
  const tasksListPath = isAdmin ? '/tasks' : '/my-tasks';

  // Check if current user is an assignee of this task
  const isAssignee = React.useMemo(() => {
    if (!task || !employee) return false;
    return task.assigneeId === employee.systemId ||
      task.assignees?.some(a => a.employeeSystemId === employee.systemId);
  }, [task, employee]);

  // Start task handler — also starts timer
  const handleStartTask = React.useCallback(async () => {
    if (!task) return;
    await update(task.systemId, {
      status: 'Đang thực hiện',
      startDate: new Date().toISOString().split('T')[0],
      timerRunning: true,
      timerStartedAt: new Date().toISOString(),
    });
    // Log activity
    fetch('/api/activity-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        entityType: 'task',
        entityId: task.systemId,
        action: 'status_changed',
        actionType: 'update',
        note: `${employee?.fullName || 'Nhân viên'} đã bắt đầu công việc`,
        changes: { status: { from: task.status, to: 'Đang thực hiện' } },
        metadata: { userName: employee?.fullName },
      }),
    }).catch(() => {});
    toast.success('Đã bắt đầu công việc');
  }, [task, update, employee]);

  // Complete task handler - submit evidence for approval
  const handleCompleteTask = React.useCallback(async (taskId: string, evidence: { images: string[]; note: string }) => {
    if (!task || !employee) return;
    // Calculate elapsed seconds from timer
    let newTotalSeconds = task.totalTrackedSeconds || 0;
    if (task.timerRunning && task.timerStartedAt) {
      const elapsed = Math.floor((Date.now() - new Date(task.timerStartedAt).getTime()) / 1000);
      newTotalSeconds += Math.max(0, elapsed);
    }
    await update(taskId, {
      approvalStatus: 'pending',
      timerRunning: false,
      timerStartedAt: undefined,
      totalTrackedSeconds: newTotalSeconds,
      completionEvidence: {
        images: evidence.images,
        note: evidence.note,
        submittedAt: new Date().toISOString(),
        submittedBy: employee.systemId,
        submittedByName: employee.fullName,
      },
      activities: [
        ...(task.activities || []),
        {
          id: generateSubEntityId('ACTIVITY'),
          taskId: task.systemId,
          userId: employee.systemId,
          userName: employee.fullName,
          action: 'evidence_submitted',
          description: 'Đã gửi bằng chứng hoàn thành công việc',
          timestamp: new Date().toISOString(),
        },
      ],
    });
    // Log activity
    fetch('/api/activity-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        entityType: 'task',
        entityId: task.systemId,
        action: 'evidence_submitted',
        actionType: 'update',
        note: `${employee.fullName} đã gửi bằng chứng hoàn thành`,
        metadata: { userName: employee.fullName, imageCount: evidence.images.length },
      }),
    }).catch(() => {});
    toast.success('Đã gửi bằng chứng hoàn thành', { description: 'Vui lòng đợi admin phê duyệt' });
    setShowCompletionDialog(false);
  }, [task, employee, update]);

  const actions = React.useMemo(() => {
    if (!task) return [];
    
    const actionButtons: React.ReactNode[] = [];

    // "Bắt đầu" button for assignees when task is not started
    if (isAssignee && task.status === 'Chưa bắt đầu') {
      actionButtons.push(
        <Button key="start" size="sm" onClick={handleStartTask}>
          <Play className="mr-2 h-4 w-4" />
          Bắt đầu
        </Button>
      );
    }

    // Admin approval button for pending tasks (single button, opens dialog with evidence inside)
    if (isAdmin && task.approvalStatus === 'pending' && task.completionEvidence) {
      actionButtons.push(
        <Button 
          key="approve-reject" 
          size="sm" 
          className="bg-yellow-600 hover:bg-yellow-700" 
          onClick={() => setShowApprovalDialog(true)}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Phê duyệt / Từ chối
        </Button>
      );
    }
    
    // Only show edit/delete for admin or task owner
    if (canEdit) {
      actionButtons.push(
        <Button key="edit" size="sm" onClick={() => router.push(`/tasks/${task.systemId}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Chỉnh sửa
        </Button>
      );
    }
    
    if (isAdmin) {
      actionButtons.push(
        <Button key="delete" size="sm" variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Xóa
        </Button>
      );
    }
    
    return actionButtons;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally use specific task fields for stability
  }, [task?.systemId, task?.status, task?.approvalStatus, task?.completionEvidence, systemId, router, canEdit, isAdmin, isAssignee, handleStartTask]);

  const statusBadge = React.useMemo(() => {
    if (!task) return undefined;
    return (
      <div className="flex items-center gap-2">
        <Badge variant={getStatusVariant(task.status)}>{task.status}</Badge>
        <Badge variant={getPriorityVariant(task.priority)}>
          <Flag className="mr-1 h-3 w-3" />
          {task.priority}
        </Badge>
      </div>
    );
  }, [task]);

  const mobileHeaderActions = React.useMemo(() => {
    if (!isMobile || !task) return [];
    return [
      <DropdownMenu key="mobile-actions">
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isAssignee && task.status === 'Chưa bắt đầu' && (
            <DropdownMenuItem onClick={handleStartTask}>
              <Play className="mr-2 h-4 w-4" />
              Bắt đầu
            </DropdownMenuItem>
          )}
          {isAdmin && task.approvalStatus === 'pending' && task.completionEvidence && (
            <DropdownMenuItem onClick={() => setShowApprovalDialog(true)}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Phê duyệt / Từ chối
            </DropdownMenuItem>
          )}
          {canEdit && (
            <DropdownMenuItem onClick={() => router.push(`/tasks/${task.systemId}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </DropdownMenuItem>
          )}
          {isAdmin && (
            <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>,
    ];
  }, [isMobile, task, isAssignee, isAdmin, canEdit, handleStartTask, router]);

  usePageHeader({
    title: task ? task.title : 'Chi tiết công việc',
    badge: statusBadge,
    showBackButton: true,
    backPath: tasksListPath,
    breadcrumb: task ? [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: isAdmin ? 'Quản lý công việc' : 'Công việc của tôi', href: tasksListPath, isCurrent: false },
      { label: task.title, href: `/tasks/${task.systemId}`, isCurrent: true }
    ] : undefined,
    actions: isMobile ? mobileHeaderActions : actions,
  });

  // All hooks must be called before any early returns (React hooks rules)
  // SLA calculation
  const { data: tasksSettings } = useTasksSettings();
  const slaSettings = tasksSettings.sla;
  
  const slaDeadlines = React.useMemo(() => {
    // Check all required conditions
    if (!task?.priority || !task?.startDate) return null;
    
    const slaConfig = slaSettings[normalizeTaskPriority(task.priority)];
    if (!slaConfig) return null;
    
    // Safely parse startDate - validate before calling getTime()
    const startDate = new Date(task.startDate);
    if (!startDate || isNaN(startDate.getTime())) return null;
    
    const startTime = startDate.getTime();
    const responseDeadline = new Date(startTime + slaConfig.responseTime * 60 * 1000);
    const completeDeadline = new Date(startTime + slaConfig.completeTime * 60 * 60 * 1000);
    
    return {
      response: responseDeadline,
      complete: completeDeadline,
    };
  }, [task?.priority, task?.startDate, slaSettings]);

  const handleDelete = () => {
    if (task) {
      remove(task.systemId);
      toast.success('Đã xóa công việc');
      router.push(tasksListPath);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card className={mobileBleedCardClass}>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold">Không tìm thấy công việc</h2>
        <Button onClick={() => router.push('/tasks')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay về danh sách
        </Button>
      </div>
    );
  }

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Hoàn thành';

  return (
    <DetailPageShell gap="md">
      {/* Completion Action Card - shown at the very top */}
      {isAssignee && task.status === 'Đang thực hiện' && !task.completionEvidence && task.approvalStatus !== 'pending' && (
        <Card className={cn("border-2 border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-950/20", mobileBleedCardClass)}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="shrink-0 p-2 rounded-full bg-green-100 dark:bg-green-900">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm">Hoàn thành công việc</p>
                  <p className="text-xs text-muted-foreground">Chụp ảnh bằng chứng và gửi để admin phê duyệt</p>
                </div>
              </div>
              <Button size="sm" className="shrink-0 bg-green-600 hover:bg-green-700" onClick={() => setShowCompletionDialog(true)}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Hoàn thành
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rejection + Resubmit Card */}
      {isAssignee && task.approvalStatus === 'rejected' && task.rejectionReason && (
        <Card className={cn("border-2 border-red-300 dark:border-red-700 bg-red-50/50 dark:bg-red-950/20", mobileBleedCardClass)}>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 mt-0.5 text-destructive shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-sm text-destructive">Admin yêu cầu làm lại</p>
                <p className="text-sm text-muted-foreground mt-1">{task.rejectionReason}</p>
              </div>
            </div>
            <Button size="sm" className="w-full bg-green-600 hover:bg-green-700" onClick={() => setShowCompletionDialog(true)}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Gửi lại bằng chứng
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Evidence Card - compact when approved, full when pending */}
      {task.completionEvidence && task.approvalStatus !== 'approved' && (
        <EvidenceThumbnailGrid
          evidence={task.completionEvidence}
          approvalStatus={task.approvalStatus}
          onViewFullEvidence={() => setShowEvidenceViewer(true)}
        />
      )}

      <Card className={mobileBleedCardClass}>
        <CardContent className="pt-4 md:pt-6 space-y-6">
          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Tiến độ</span>
              <span className="text-sm text-muted-foreground">{task.progress}%</span>
            </div>
            <Progress value={task.progress} className="h-3" />
          </div>

          <Separator />

          {/* Time Tracker - Auto start/stop */}
          <TimeTracker
            _taskId={task.systemId}
            isRunning={task.timerRunning || false}
            totalSeconds={task.totalTrackedSeconds || 0}
            estimatedHours={task.estimatedHours}
            startedAt={task.timerStartedAt}
            createdAt={task.createdAt}
          />

          {/* SLA Timer */}
          {slaDeadlines && task.status !== 'Hoàn thành' && task.status !== 'Đã hủy' && (
            <>
              <Separator />
              <div className="space-y-3">
                <SectionHeading className="mb-0">SLA Tracking</SectionHeading>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5">Thời gian phản hồi</p>
                    <SlaTimer
                      startTime={task.startDate}
                      targetMinutes={slaSettings[normalizeTaskPriority(task.priority!)].responseTime}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5">Thời gian hoàn thành</p>
                    <SlaTimer
                      startTime={task.startDate}
                      targetMinutes={slaSettings[normalizeTaskPriority(task.priority!)].completeTime * 60}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Description */}
          <div>
            <SectionHeading className="mb-2">Mô tả công việc</SectionHeading>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {task.description || 'Không có mô tả'}
            </p>
          </div>

          <Separator />

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Single Assignee */}
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Người thực hiện</div>
                  <div className="text-sm text-muted-foreground">{task.assigneeName || 'Chưa giao'}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Người giao việc</div>
                  <div className="text-sm text-muted-foreground">{task.assignerName}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Ngày bắt đầu</div>
                  <div className="text-sm text-muted-foreground">{formatDate(task.startDate) || 'Chưa có'}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className={`h-5 w-5 mt-0.5 ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`} />
                <div>
                  <div className={`text-sm font-medium ${isOverdue ? 'text-destructive' : ''}`}>
                    Deadline {isOverdue && '(Quá hạn)'}
                  </div>
                  <div className={`text-sm ${isOverdue ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>
                    {formatDate(task.dueDate)}
                  </div>
                </div>
              </div>
              {task.completedDate && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 mt-0.5 text-green-600" />
                  <div>
                    <div className="text-sm font-medium text-green-600">Ngày hoàn thành</div>
                    <div className="text-sm text-muted-foreground">{formatDate(task.completedDate)}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Effort */}
          {(task.estimatedHours || task.actualHours) && (
            <>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                {task.estimatedHours && (
                  <div>
                    <div className="text-sm font-medium">Giờ ước tính</div>
                    <div className="text-h3 font-bold">{task.estimatedHours}h</div>
                  </div>
                )}
                {task.actualHours && (
                  <div>
                    <div className="text-sm font-medium">Giờ thực tế</div>
                    <div className="text-h3 font-bold">
                      {(() => {
                        const totalHours = task.actualHours;
                        const hours = Math.floor(totalHours);
                        const minutes = Math.floor((totalHours % 1) * 60);
                        const seconds = Math.floor((((totalHours % 1) * 60) % 1) * 60);
                        
                        const parts: string[] = [];
                        if (hours > 0) parts.push(`${hours} giờ`);
                        if (minutes > 0) parts.push(`${minutes} phút`);
                        if (seconds > 0) parts.push(`${seconds} giây`);
                        
                        return parts.length > 0 ? parts.join(' ') : '0 giây';
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Subtasks */}
          <Separator />
          <div>
            <SectionHeading className="mb-3">Danh sách công việc con</SectionHeading>
            <SubtaskList
              subtasks={(task.subtasks || []).map((st, idx) => ({
                ...st,
                order: idx,
                createdAt: new Date(task.createdAt || new Date().toISOString()),
              }))}
              onAdd={(title) => {
                if (!canEdit) {
                  toast.error('Bạn không có quyền chỉnh sửa công việc này');
                  return;
                }
                const currentSubtasks = task.subtasks || [];
                const newSubtask = {
                  id: generateSubEntityId('SUBTASK'),
                  title,
                  completed: false,
                  order: currentSubtasks.length,
                  createdAt: new Date().toISOString(),
                };
                const updatedSubtasks = [...currentSubtasks, newSubtask];
                
                // Call update with just subtasks field
                update(task.systemId, { 
                  subtasks: updatedSubtasks
                });
                toast.success('Đã thêm subtask');
              }}
              onUpdate={(subtaskId, updates) => {
                if (!canEdit) {
                  toast.error('Bạn không có quyền chỉnh sửa công việc này');
                  return;
                }
                const updatedSubtasks = (task.subtasks || []).map(s =>
                  s.id === subtaskId ? { ...s, ...updates } : s
                );
                update(task.systemId, { subtasks: updatedSubtasks });
              }}
              onDelete={(subtaskId) => {
                if (!canEdit) {
                  toast.error('Bạn không có quyền chỉnh sửa công việc này');
                  return;
                }
                const updatedSubtasks = (task.subtasks || []).filter(s => s.id !== subtaskId);
                const completedCount = updatedSubtasks.filter(s => s.completed).length;
                const newProgress = updatedSubtasks.length > 0 
                  ? Math.round((completedCount / updatedSubtasks.length) * 100)
                  : 0;
                update(task.systemId, { 
                  subtasks: updatedSubtasks,
                  progress: newProgress
                });
                toast.success('Đã xóa subtask');
              }}
              onReorder={(reorderedSubtasks) => {
                if (!canEdit) return;
                const updatedSubtasks = reorderedSubtasks.map(({ id, title, completed }) => ({ id, title, completed }));
                update(task.systemId, { subtasks: updatedSubtasks });
              }}
              onToggleComplete={(subtaskId, completed) => {
                if (!canEdit && !isAssignee) {
                  toast.error('Bạn không có quyền chỉnh sửa công việc này');
                  return;
                }
                
                const updatedSubtasks = (task.subtasks || []).map(s =>
                  s.id === subtaskId ? { ...s, completed } : s
                );
                // Calculate new progress based on completed subtasks
                const completedCount = updatedSubtasks.filter(s => s.completed).length;
                const newProgress = updatedSubtasks.length > 0 
                  ? Math.round((completedCount / updatedSubtasks.length) * 100)
                  : 0;
                
                update(task.systemId, { 
                  subtasks: updatedSubtasks,
                  progress: newProgress
                });
              }}
              readonly={!canEdit || task.status === 'Hoàn thành' || task.status === 'Đã hủy'}
            />
          </div>

          {/* Comments Section */}
          <Separator />
          <Comments
            entityType="tasks"
            entityId={task.systemId}
            comments={(task.comments || []).map(c => ({
              ...c,
              author: {
                systemId: c.userId,
                name: c.userName,
              },
              createdAt: new Date(c.createdAt),
            }))}
            currentUser={employee ? {
              systemId: employee.systemId,
              name: employee.fullName,
            } : undefined}
            onAddComment={async (content) => {
              const newComment = {
                id: generateSubEntityId('COMMENT'),
                taskId: task.systemId,
                userId: employee?.systemId || 'current-user',
                userName: employee?.fullName || 'User',
                content,
                createdAt: new Date().toISOString(),
              };
              try {
                await update(task.systemId, {
                  comments: [...(task.comments || []), newComment]
                });
                toast.success('Đã thêm bình luận');
              } catch {
                toast.error('Không thể thêm bình luận');
              }
            }}
            onUpdateComment={async (commentId, content) => {
              const updatedComments = (task.comments || []).map(c =>
                c.id === commentId ? { ...c, content } : c
              );
              try {
                await update(task.systemId, { comments: updatedComments });
                toast.success('Đã cập nhật bình luận');
              } catch {
                toast.error('Không thể cập nhật bình luận');
              }
            }}
            onDeleteComment={async (commentId) => {
              const updatedComments = (task.comments || []).filter(c => c.id !== commentId);
              try {
                await update(task.systemId, { comments: updatedComments });
                toast.success('Đã xóa bình luận');
              } catch {
                toast.error('Không thể xóa bình luận');
              }
            }}
            mentions={employeeMentions}
          />
        </CardContent>
      </Card>

      {/* Activity History */}
      <EntityActivityTable entityType="task" entityId={task.systemId} />

      {/* Metadata Section */}
      <Card className={mobileBleedCardClass}>
        <CardHeader>
          <CardTitle size="default">Thông tin hệ thống</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Tạo bởi:</span>
              <span className="ml-2 font-medium">{allEmployees.find(e => e.systemId === task.createdBy)?.fullName || task.createdBy}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Tạo lúc:</span>
              <span className="ml-2 font-medium">{formatDateTimeForDisplay(task.createdAt)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Cập nhật bởi:</span>
              <span className="ml-2 font-medium">{task.assignerName || allEmployees.find(e => e.systemId === task.updatedBy)?.fullName || task.updatedBy}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Cập nhật lúc:</span>
              <span className="ml-2 font-medium">{formatDateTimeForDisplay(task.updatedAt)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">System ID:</span>
              <span className="ml-2 font-mono text-xs">{task.systemId}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa công việc?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa công việc "{task.title}"? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={removeMutation.isPending}>
              {removeMutation.isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang xóa...</> : 'Xóa'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Approval Dialog for Admin */}
      {task.completionEvidence && showApprovalDialog && (
        <ApprovalDialog
          task={task}
          open={showApprovalDialog}
          onClose={() => setShowApprovalDialog(false)}
          onApprove={async (taskId) => {
            approveTask(taskId);
            toast.success('Đã phê duyệt công việc');
            setShowApprovalDialog(false);
          }}
          onReject={async (taskId, reason) => {
            rejectTask(taskId, reason);
            toast.success('Đã yêu cầu làm lại công việc');
            setShowApprovalDialog(false);
          }}
        />
      )}

      {/* Evidence Viewer */}
      {task.completionEvidence && showEvidenceViewer && (
        <EvidenceViewer
          evidence={task.completionEvidence}
          open={showEvidenceViewer}
          onClose={() => setShowEvidenceViewer(false)}
        />
      )}

      {/* Completion Dialog for Assignees */}
      {showCompletionDialog && (
        <CompletionDialog
          task={task}
          open={showCompletionDialog}
          onClose={() => setShowCompletionDialog(false)}
          onSubmit={handleCompleteTask}
        />
      )}
    </DetailPageShell>
  );
}
