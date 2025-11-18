import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useTaskStore } from './store.ts';
import { useAuth } from '../../contexts/auth-context.tsx';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { formatDate, formatDateTime } from '@/lib/date-utils';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Button } from '../../components/ui/button.tsx';
import { Badge } from '../../components/ui/badge.tsx';
import { Progress } from '../../components/ui/progress.tsx';
import { Separator } from '../../components/ui/separator.tsx';
import { Comments } from '../../components/Comments.tsx';
import { SubtaskList } from '../../components/shared/subtask-list.tsx';
import { TimeTracker } from '../../components/TimeTracker.tsx';
import { ActivityTimeline } from '../../components/ActivityTimeline.tsx';
import { ApprovalDialog } from './components/ApprovalDialog.tsx';
import { EvidenceViewer } from './components/EvidenceViewer.tsx';
import { EvidenceThumbnailGrid } from './components/EvidenceThumbnailGrid.tsx';
import { SlaTimer } from '../../components/SlaTimer.tsx';
import { loadSLASettings } from '../../features/settings/tasks/tasks-settings-page.tsx';
import { createSystemId } from '../../lib/id-config.ts';
import { ArrowLeft, Edit, Trash2, Calendar, Clock, User, Flag, CheckCircle, XCircle, Eye, AlertCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog.tsx';
import { toast } from 'sonner';
import type { TaskPriority, TaskStatus } from './types.ts';

export function TaskDetailPage() {
  const { systemId } = ReactRouterDOM.useParams<{ systemId: string }>();
  const navigate = ReactRouterDOM.useNavigate();
  const store = useTaskStore();
  const { remove, update, approveTask, rejectTask } = store;
  const { isAdmin, employee } = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = React.useState(false);
  const [showEvidenceViewer, setShowEvidenceViewer] = React.useState(false);

  // Subscribe to store.data to trigger re-render on updates
  const task = React.useMemo(() => {
    const allTasks = store.data; // This subscribes to store changes
    return allTasks.find(t => t.systemId === createSystemId(systemId!));
  }, [store.data, systemId]);
  
  // Check if current user can edit this task
  const canEdit = React.useMemo(() => {
    if (isAdmin) return true;
    if (!task || !employee) return false;
    return task.assigneeId === employee.systemId;
  }, [isAdmin, task?.systemId, employee?.systemId]);

  const actions = React.useMemo(() => {
    if (!task) return [];
    
    const actionButtons = [
      <Button key="back" variant="outline" size="sm" className="h-9" onClick={() => navigate('/tasks')}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Quay lại
      </Button>,
    ];
    
    // Admin approval buttons for pending tasks
    if (isAdmin && task.approvalStatus === 'pending' && task.completionEvidence) {
      actionButtons.push(
        <Button 
          key="view-evidence" 
          variant="outline"
          size="sm" 
          className="h-9" 
          onClick={() => setShowEvidenceViewer(true)}
        >
          <Eye className="mr-2 h-4 w-4" />
          Xem bằng chứng
        </Button>,
        <Button 
          key="approve-reject" 
          size="sm" 
          className="h-9 bg-yellow-600 hover:bg-yellow-700" 
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
        <Button key="edit" size="sm" className="h-9" onClick={() => navigate(`/tasks/${systemId}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Chỉnh sửa
        </Button>
      );
    }
    
    if (isAdmin) {
      actionButtons.push(
        <Button key="delete" size="sm" variant="destructive" className="h-9" onClick={() => setIsDeleteDialogOpen(true)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Xóa
        </Button>
      );
    }
    
    return actionButtons;
  }, [task?.systemId, task?.approvalStatus, task?.completionEvidence, systemId, navigate, canEdit, isAdmin]);

  usePageHeader({
    actions,
    breadcrumb: task ? [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Công việc', href: '/tasks', isCurrent: false },
      { label: task.id, href: '', isCurrent: true }
    ] : []
  });

  const handleDelete = () => {
    if (task) {
      remove(createSystemId(task.systemId));
      toast.success('Đã xóa công việc');
      navigate('/tasks');
    }
  };

  if (!task) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold">Không tìm thấy công việc</h2>
        <Button onClick={() => navigate('/tasks')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay về danh sách
        </Button>
      </div>
    );
  }

  const getPriorityVariant = (priority: TaskPriority): "default" | "secondary" | "warning" | "destructive" => {
    const map = { 'Thấp': 'secondary', 'Trung bình': 'default', 'Cao': 'warning', 'Khẩn cấp': 'destructive' } as const;
    return map[priority];
  };

  const getStatusVariant = (status: TaskStatus): "default" | "secondary" | "warning" | "success" | "outline" => {
    const map = { 
      'Chưa bắt đầu': 'outline', 
      'Đang thực hiện': 'warning', 
      'Đang chờ': 'secondary', 
      'Hoàn thành': 'success', 
      'Đã hủy': 'default' 
    } as const;
    return map[status];
  };

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Hoàn thành';

  // SLA calculation
  const slaSettings = React.useMemo(() => loadSLASettings(), []);
  
  const slaDeadlines = React.useMemo(() => {
    // Check all required conditions
    if (!task?.priority || !task?.startDate) return null;
    
    const slaConfig = slaSettings[task.priority];
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

  return (
    <div className="space-y-4">
      {/* Evidence Preview - Show prominently at top if exists */}
      {task.completionEvidence && (
        <EvidenceThumbnailGrid
          evidence={task.completionEvidence}
          approvalStatus={task.approvalStatus}
          onViewFullEvidence={() => setShowEvidenceViewer(true)}
        />
      )}

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold text-muted-foreground">{task.id}</span>
                <Badge variant={getPriorityVariant(task.priority)}>
                  <Flag className="mr-1 h-3 w-3" />
                  {task.priority}
                </Badge>
                <Badge variant={getStatusVariant(task.status)}>
                  {task.status}
                </Badge>
                {task.requiresEvidence && (
                  <Badge variant="outline" className="border-blue-500 text-blue-600">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Yêu cầu bằng chứng
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl">{task.title}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
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
            taskId={task.systemId}
            isRunning={task.timerRunning || false}
            totalSeconds={task.totalTrackedSeconds || 0}
            estimatedHours={task.estimatedHours}
          />

          {/* SLA Timer */}
          {slaDeadlines && task.status !== 'Hoàn thành' && task.status !== 'Đã hủy' && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">SLA Tracking</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5">Thời gian phản hồi</p>
                    <SlaTimer
                      startTime={task.startDate}
                      targetMinutes={slaSettings[task.priority!].responseTime}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5">Thời gian hoàn thành</p>
                    <SlaTimer
                      startTime={task.startDate}
                      targetMinutes={slaSettings[task.priority!].completeTime * 60}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Mô tả công việc</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {task.description || 'Không có mô tả'}
            </p>
          </div>

          <Separator />

          {/* Rejection Reason - Show if rejected */}
          {task.approvalStatus === 'rejected' && task.rejectionReason && (
            <>
              <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/5">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 mt-0.5 text-destructive" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-destructive mb-1">Yêu cầu làm lại</h3>
                    <p className="text-sm text-muted-foreground">{task.rejectionReason}</p>
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

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
                  <div className="text-sm text-muted-foreground">{formatDate(task.startDate)}</div>
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
                    <div className="text-2xl font-bold">{task.estimatedHours}h</div>
                  </div>
                )}
                {task.actualHours && (
                  <div>
                    <div className="text-sm font-medium">Giờ thực tế</div>
                    <div className="text-2xl font-bold">
                      {(() => {
                        const totalHours = task.actualHours;
                        const hours = Math.floor(totalHours);
                        const minutes = Math.floor((totalHours % 1) * 60);
                        const seconds = Math.floor((((totalHours % 1) * 60) % 1) * 60);
                        
                        const parts = [];
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
            <h3 className="font-semibold mb-3">Danh sách công việc con</h3>
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
                console.log('[DEBUG] Adding subtask:', title);
                const currentSubtasks = task.subtasks || [];
                const newSubtask = {
                  id: `subtask-${Date.now()}`,
                  title,
                  completed: false,
                  order: currentSubtasks.length,
                  createdAt: new Date().toISOString(),
                };
                const updatedSubtasks = [...currentSubtasks, newSubtask];
                console.log('[DEBUG] Current subtasks:', currentSubtasks.length);
                console.log('[DEBUG] Updated subtasks:', updatedSubtasks.length);
                
                // Call update with just subtasks field
                update(task.systemId, { 
                  subtasks: updatedSubtasks
                });
                console.log('[DEBUG] Update called');
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
                update(createSystemId(task.systemId), { 
                  ...task, 
                  subtasks: updatedSubtasks
                });
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
                update(createSystemId(task.systemId), { 
                  ...task, 
                  subtasks: updatedSubtasks,
                  progress: newProgress
                });
                toast.success('Đã xóa subtask');
              }}
              onReorder={(reorderedSubtasks) => {
                if (!canEdit) return;
                const updatedSubtasks = reorderedSubtasks.map(({ id, title, completed }) => ({ id, title, completed }));
                update(createSystemId(task.systemId), { 
                  ...task, 
                  subtasks: updatedSubtasks
                });
              }}
              onToggleComplete={(subtaskId, completed) => {
                if (!canEdit) {
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
                
                update(createSystemId(task.systemId), { 
                  ...task, 
                  subtasks: updatedSubtasks,
                  progress: newProgress
                });
              }}
              readonly={!canEdit || task.status === 'Hoàn thành' || task.status === 'Đã hủy'}
            />
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardContent className="p-6">
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
            onAddComment={(content) => {
              if (!canEdit) {
                toast.error('Bạn không có quyền thêm comment cho công việc này');
                return;
              }
              
              const newComment = {
                id: `comment-${Date.now()}`,
                taskId: task.systemId,
                userId: employee?.systemId || 'current-user',
                userName: employee?.fullName || 'User',
                content,
                createdAt: new Date().toISOString(),
              };
              update(createSystemId(task.systemId), {
                ...task,
                comments: [...(task.comments || []), newComment]
              });
              toast.success('Đã thêm bình luận');
            }}
            onUpdateComment={(commentId, content) => {
              const updatedComments = (task.comments || []).map(c =>
                c.id === commentId ? { ...c, content } : c
              );
              update(createSystemId(task.systemId), {
                ...task,
                comments: updatedComments
              });
            }}
            onDeleteComment={(commentId) => {
              const updatedComments = (task.comments || []).filter(c => c.id !== commentId);
              update(createSystemId(task.systemId), {
                ...task,
                comments: updatedComments
              });
            }}
          />
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <ActivityTimeline activities={task.activities || []} maxVisible={5} />

      {/* Metadata Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Thông tin hệ thống</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Tạo bởi:</span>
              <span className="ml-2 font-medium">{task.createdBy}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Tạo lúc:</span>
              <span className="ml-2 font-medium">{new Date(task.createdAt).toLocaleString('vi-VN')}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Cập nhật bởi:</span>
              <span className="ml-2 font-medium">{task.updatedBy}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Cập nhật lúc:</span>
              <span className="ml-2 font-medium">{new Date(task.updatedAt).toLocaleString('vi-VN')}</span>
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
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Xóa
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
    </div>
  );
}
