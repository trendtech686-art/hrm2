'use client'

import * as React from 'react';
import { useState, useMemo } from 'react';
import { generateSubEntityId } from '@/lib/id-utils';
import { useRouter } from 'next/navigation';
import { useTasks, useTaskMutations } from '../hooks/use-tasks';
import { useAuth } from '@/contexts/auth-context';
import { usePageHeader } from '@/contexts/page-header-context';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, CheckCircle2, Clock, AlertTriangle, ListTodo, AlertCircle, Calendar, Image, Play, Camera, Loader2 } from 'lucide-react';
import { CompletionDialog } from './CompletionDialog';
import { EvidenceViewer } from './EvidenceViewer';
import type { Task } from '../types';
import { toast } from 'sonner';
import { logError } from '@/lib/logger';
import { FileUploadAPI, type UploadedAsset } from '@/lib/file-upload-api';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useQueryClient } from '@tanstack/react-query';
import { invalidateRelated } from '@/lib/query-invalidation-map';

// ============================================
// Tab config
// ============================================
const TAB_CONFIG = [
  { key: 'not-started', label: 'Chưa bắt đầu', shortLabel: 'Mới', icon: ListTodo, color: 'text-slate-600', bg: 'bg-slate-100', activeBg: 'bg-slate-600', activeText: 'text-white' },
  { key: 'in-progress', label: 'Đang làm', shortLabel: 'Đang làm', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', activeBg: 'bg-blue-600', activeText: 'text-white' },
  { key: 'overdue', label: 'Quá hạn', shortLabel: 'Quá hạn', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', activeBg: 'bg-red-600', activeText: 'text-white' },
  { key: 'pending', label: 'Chờ duyệt', shortLabel: 'Chờ duyệt', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', activeBg: 'bg-yellow-600', activeText: 'text-white' },
  { key: 'completed', label: 'Hoàn thành', shortLabel: 'Xong', icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', activeBg: 'bg-green-600', activeText: 'text-white' },
] as const;

const PRIORITY_CONFIG: Record<string, { color: string; border: string; dot: string }> = {
  'Khẩn cấp': { color: 'text-red-700', border: 'border-l-red-500', dot: 'bg-red-500' },
  'Cao': { color: 'text-orange-700', border: 'border-l-orange-500', dot: 'bg-orange-500' },
  'Trung bình': { color: 'text-yellow-700', border: 'border-l-yellow-500', dot: 'bg-yellow-400' },
  'Thấp': { color: 'text-blue-700', border: 'border-l-blue-400', dot: 'bg-blue-400' },
};

// ============================================
// Swipeable Task Card Wrapper
// ============================================
function SwipeableCard({ children, onSwipeLeft, onSwipeRight, leftLabel, rightLabel, leftColor = 'bg-green-500', rightColor = 'bg-blue-500' }: {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftLabel?: string;
  rightLabel?: string;
  leftColor?: string;
  rightColor?: string;
}) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const startX = React.useRef(0);
  const currentX = React.useRef(0);
  const isDragging = React.useRef(false);
  const THRESHOLD = 80;

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || !cardRef.current) return;
    const diff = e.touches[0].clientX - startX.current;
    // Only allow swipe in direction that has a handler
    if (diff > 0 && !onSwipeRight) return;
    if (diff < 0 && !onSwipeLeft) return;
    const clamped = Math.max(-120, Math.min(120, diff));
    currentX.current = clamped;
    cardRef.current.style.transform = `translateX(${clamped}px)`;
    cardRef.current.style.transition = 'none';
  };

  const handleTouchEnd = () => {
    if (!cardRef.current) return;
    isDragging.current = false;
    const diff = currentX.current;
    cardRef.current.style.transition = 'transform 0.25s ease-out';
    cardRef.current.style.transform = 'translateX(0)';
    currentX.current = 0;
    if (diff < -THRESHOLD && onSwipeLeft) onSwipeLeft();
    if (diff > THRESHOLD && onSwipeRight) onSwipeRight();
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Left action (swipe right reveals) */}
      {onSwipeRight && (
        <div className={`absolute inset-y-0 left-0 w-24 ${rightColor} flex items-center justify-center rounded-l-lg`}>
          <span className="text-white text-xs font-medium">{rightLabel}</span>
        </div>
      )}
      {/* Right action (swipe left reveals) */}
      {onSwipeLeft && (
        <div className={`absolute inset-y-0 right-0 w-24 ${leftColor} flex items-center justify-center rounded-r-lg`}>
          <span className="text-white text-xs font-medium">{leftLabel}</span>
        </div>
      )}
      <div
        ref={cardRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative z-10"
      >
        {children}
      </div>
    </div>
  );
}

// ============================================
// Pull-to-Refresh Hook
// ============================================
function usePullToRefresh(onRefresh: () => Promise<void>, containerRef: React.RefObject<HTMLDivElement | null>) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = React.useRef(0);
  const pulling = React.useRef(false);
  const PULL_THRESHOLD = 60;

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      if (el.scrollTop === 0) {
        startY.current = e.touches[0].clientY;
        pulling.current = true;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!pulling.current) return;
      const diff = e.touches[0].clientY - startY.current;
      if (diff > 0 && el.scrollTop === 0) {
        setPullDistance(Math.min(diff * 0.5, 100));
      }
    };

    const onTouchEnd = async () => {
      if (!pulling.current) return;
      pulling.current = false;
      if (pullDistance >= PULL_THRESHOLD) {
        setIsRefreshing(true);
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
        }
      }
      setPullDistance(0);
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend', onTouchEnd);
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [containerRef, onRefresh, pullDistance]);

  return { isRefreshing, pullDistance };
}

// ============================================
// Mobile Task Card (ClickUp-inspired)
// ============================================
function MobileTaskCard({ task, onComplete, onStart, onViewDetails, onCameraCapture }: { task: Task; onComplete: (t: Task) => void; onStart?: (t: Task) => void; onViewDetails: (t: Task) => void; onCameraCapture?: (t: Task) => void }) {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Hoàn thành';
  const isCompleted = task.status === 'Hoàn thành';
  const isPendingApproval = task.approvalStatus === 'pending';
  const isRejected = task.approvalStatus === 'rejected';
  const priorityCfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG['Trung bình'];

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isCompleted && !isPendingApproval) {
      onComplete(task);
    }
  };

  const dueDate = new Date(task.dueDate);
  const dueDateStr = format(dueDate, 'dd/MM', { locale: vi });
  const dueTimeRelative = isOverdue 
    ? `Trễ ${formatDistanceToNow(dueDate, { locale: vi })}`
    : formatDistanceToNow(dueDate, { locale: vi, addSuffix: true });

  return (
    <div
      className={cn(
        "border-l-[3px] rounded-xl bg-card border border-border/50 p-4 active:scale-[0.98] transition-transform touch-manipulation cursor-pointer",
        priorityCfg.border,
        isOverdue && "bg-red-50/50",
        isPendingApproval && "bg-yellow-50/50",
        isRejected && "bg-orange-50/50",
      )}
      onClick={() => onViewDetails(task)}
    >
      <div>
        {/* Row 1: Checkbox + Title + Priority dot */}
        <div className="flex items-start gap-2.5">
          <div className="pt-0.5 shrink-0 touch-target" onClick={handleCheckboxClick}>
            <Checkbox
              checked={isCompleted || isPendingApproval}
              disabled={isCompleted || isPendingApproval}
              className={cn(
                "h-5 w-5 rounded-full",
                isPendingApproval && "border-yellow-500",
              )}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "text-xs font-medium leading-snug line-clamp-2",
              isCompleted && "line-through text-muted-foreground",
            )}>
              {task.title}
            </h3>
          </div>
          <div className={cn("h-2.5 w-2.5 rounded-full shrink-0 mt-1.5", priorityCfg.dot)} title={task.priority} />
        </div>

        {/* Row 2: Meta chips */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2 ml-7.5">
          {/* Due date chip */}
          <span className={cn(
            "inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full",
            isOverdue ? "bg-red-100 text-red-700 font-medium" : "bg-muted text-muted-foreground"
          )}>
            <Calendar className="h-3 w-3" />
            {dueDateStr}
          </span>

          {/* Relative time */}
          <span className={cn(
            "text-xs",
            isOverdue ? "text-red-600 font-medium" : "text-muted-foreground",
          )}>
            {dueTimeRelative}
          </span>

          {/* Subtasks progress */}
          {task.subtasks && task.subtasks.length > 0 && (
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
            </span>
          )}

          {/* Evidence */}
          {task.completionEvidence && (
            <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
              <Image className="h-3 w-3" />
              {task.completionEvidence.images.length}
            </span>
          )}
        </div>

        {/* Row 3: Status badges */}
        {(isPendingApproval || isRejected || (isCompleted && task.approvalStatus === 'approved')) && (
          <div className="flex flex-wrap gap-1.5 mt-2 ml-7.5">
            {isPendingApproval && (
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs h-5">
                <Clock className="h-3 w-3 mr-1" />
                Chờ duyệt
              </Badge>
            )}
            {isRejected && (
              <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300 text-xs h-5">
                <AlertCircle className="h-3 w-3 mr-1" />
                Cần làm lại
              </Badge>
            )}
            {isCompleted && task.approvalStatus === 'approved' && (
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 text-xs h-5">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Đã duyệt
              </Badge>
            )}
          </div>
        )}

        {/* Rejection reason */}
        {isRejected && task.rejectionReason && (
          <div className="mt-2 ml-7.5 p-2 bg-orange-50 border border-orange-200 rounded text-xs">
            <span className="font-medium text-orange-800">Lý do: </span>
            <span className="text-orange-700">{task.rejectionReason}</span>
          </div>
        )}

        {/* Start button for not-started tasks */}
        {task.status === 'Chưa bắt đầu' && !isPendingApproval && onStart && (
          <div className="mt-2 ml-7.5">
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
              onClick={(e) => { e.stopPropagation(); onStart(task); }}
            >
              <Play className="h-3 w-3" />
              Bắt đầu
            </Button>
          </div>
        )}

        {/* Camera capture for in-progress tasks */}
        {task.status === 'Đang thực hiện' && !isPendingApproval && onCameraCapture && (
          <div className="mt-2 ml-7.5">
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs gap-1 text-green-600 border-green-200 hover:bg-green-50"
              onClick={(e) => { e.stopPropagation(); onCameraCapture(task); }}
            >
              <Camera className="h-3 w-3" />
              Chụp bằng chứng
            </Button>
          </div>
        )}

        {/* Progress bar */}
        {task.progress > 0 && task.progress < 100 && (
          <div className="mt-2 ml-7.5">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${task.progress}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{task.progress}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// Main Page
// ============================================
export function UserTasksPage() {
  const router = useRouter();
  const { employee } = useAuth();
  const { data: tasksData } = useTasks();
  const allTasks = React.useMemo(() => tasksData?.data ?? [], [tasksData?.data]);
  const { update: updateMutation } = useTaskMutations();
  const queryClient = useQueryClient();
  const taskListRef = React.useRef<HTMLDivElement>(null);
  
  const update = React.useCallback((systemId: string, data: Partial<Task>) => {
    updateMutation.mutate({ systemId, data });
  }, [updateMutation]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('not-started');
  const [completionTask, setCompletionTask] = useState<Task | null>(null);
  const [evidenceTask, setEvidenceTask] = useState<Task | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [cameraInitialImages, setCameraInitialImages] = useState<UploadedAsset[]>([]);
  const cameraInputRef = React.useRef<HTMLInputElement>(null);
  const cameraTaskRef = React.useRef<Task | null>(null);

  usePageHeader({
    title: 'Công việc của tôi',
    breadcrumb: [
      { label: 'Trang chủ', href: '/' },
      { label: 'Công việc của tôi', href: '/my-tasks' },
    ],
  });

  // Filter tasks assigned to current user
  const myTasks = useMemo(() => {
    if (!employee) return [];
    
    return allTasks.filter(task => {
      const isAssigned = task.assignees?.some(
        assignee => assignee.employeeSystemId === employee.systemId
      );
      const isLegacyAssigned = task.assigneeId === employee.systemId;
      return isAssigned || isLegacyAssigned;
    });
  }, [allTasks, employee]);

  // Categorize tasks
  const categorizedTasks = useMemo(() => {
    const now = new Date();
    
    return {
      'not-started': myTasks.filter(
        task => task.status === 'Chưa bắt đầu' && task.approvalStatus !== 'pending'
      ),
      'in-progress': myTasks.filter(
        task => (task.status === 'Đang thực hiện' && task.approvalStatus !== 'pending') || task.approvalStatus === 'rejected'
      ),
      overdue: myTasks.filter(task => {
        return new Date(task.dueDate) < now && task.status !== 'Hoàn thành' && task.approvalStatus !== 'pending';
      }),
      completed: myTasks.filter(
        task => task.status === 'Hoàn thành' && task.approvalStatus === 'approved'
      ),
      pending: myTasks.filter(
        task => task.approvalStatus === 'pending'
      ),
    };
  }, [myTasks]);

  // Search filter
  const filterTasks = (tasks: Task[]) => {
    if (!searchQuery.trim()) return tasks;
    const query = searchQuery.toLowerCase();
    return tasks.filter(task =>
      task.title.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query) ||
      task.id.toLowerCase().includes(query)
    );
  };

  const currentTabTasks = filterTasks(categorizedTasks[selectedTab as keyof typeof categorizedTasks] || []);

  const handleCompleteTask = async (taskId: string, evidence: { images: string[]; note: string }) => {
    if (!employee) return;

    try {
      const task = myTasks.find(t => t.systemId === taskId);
      if (!task) throw new Error('Không tìm thấy công việc');

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

      toast.success('Đã gửi bằng chứng hoàn thành', {
        description: 'Vui lòng đợi admin phê duyệt',
      });

      // Log activity
      fetch('/api/activity-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityType: 'task',
          entityId: taskId,
          action: 'evidence_submitted',
          actionType: 'update',
          note: `${employee.fullName} đã gửi bằng chứng hoàn thành`,
          metadata: { userName: employee.fullName, imageCount: evidence.images.length },
        }),
      }).catch(() => {});

      setCompletionTask(null);
    } catch (error) {
      logError('Error completing task', error);
      throw error;
    }
  };

  const handleStartTask = React.useCallback((task: Task) => {
    update(task.systemId, {
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
  }, [update, employee]);

  const handleViewDetails = (task: Task) => {
    router.push(`/tasks/${task.systemId}`);
  };

  // Camera capture handler — opens native camera, uploads photo, then opens completion dialog
  const handleCameraCapture = React.useCallback((task: Task) => {
    cameraTaskRef.current = task;
    cameraInputRef.current?.click();
  }, []);

  const handleCameraFileChange = React.useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !cameraTaskRef.current) return;
    const task = cameraTaskRef.current;

    try {
      toast.loading('Đang tải ảnh lên...', { id: 'camera-upload' });
      const uploaded = await FileUploadAPI.uploadTaskEvidence(task.systemId, files);
      toast.dismiss('camera-upload');
      toast.success('Đã chụp ảnh bằng chứng');
      setCameraInitialImages(uploaded);
      setCompletionTask(task);
    } catch (err) {
      toast.dismiss('camera-upload');
      toast.error('Không thể tải ảnh lên. Vui lòng thử lại.');
      logError('Camera capture upload failed', err);
    }
    // Reset input so same file can be re-selected
    e.target.value = '';
  }, []);

  // Pull-to-refresh
  const handleRefresh = React.useCallback(async () => {
    await invalidateRelated(queryClient, 'tasks');
  }, [queryClient]);

  const { isRefreshing, pullDistance } = usePullToRefresh(handleRefresh, taskListRef);

  const totalTasks = myTasks.length;

  return (
    <div className="flex flex-col h-full">
      {/* ======== Sticky top bar: Stats + Search ======== */}
      <div className="sticky top-0 z-10 bg-background border-b">
        {/* Mini stats row */}
        <div className="flex items-center gap-3 px-3 sm:px-6 py-2 overflow-x-auto scrollbar-hide">
          <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
            Tổng: <span className="font-semibold text-foreground">{totalTasks}</span>
          </span>
          <span className="text-border">|</span>
          {TAB_CONFIG.map(tab => {
            const count = (categorizedTasks[tab.key as keyof typeof categorizedTasks] || []).length;
            if (count === 0) return null;
            const Icon = tab.icon;
            return (
              <span key={tab.key} className={cn("inline-flex items-center gap-1 text-xs whitespace-nowrap shrink-0", tab.color)}>
                <Icon className="h-3 w-3" />
                {count}
              </span>
            );
          })}
          <div className="flex-1" />
          <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => setShowSearch(!showSearch)}>
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Search bar (collapsible) */}
        {showSearch && (
          <div className="px-3 sm:px-6 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm công việc..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Horizontal scrollable tabs (ClickUp-style pill tabs) */}
        <div className="flex items-center gap-2 px-3 sm:px-6 pb-2 overflow-x-auto scrollbar-hide">
          {TAB_CONFIG.map((tab) => {
            const count = (categorizedTasks[tab.key as keyof typeof categorizedTasks] || []).length;
            const isActive = selectedTab === tab.key;
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors touch-manipulation shrink-0",
                  isActive ? cn(tab.activeBg, tab.activeText) : cn(tab.bg, tab.color, "hover:opacity-80")
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.shortLabel}
                {count > 0 && (
                  <span className={cn(
                    "min-w-4.5 h-4.5 flex items-center justify-center rounded-full text-xs font-bold",
                    isActive ? "bg-white/25" : "bg-black/10"
                  )}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ======== Task list with pull-to-refresh ======== */}
      <div ref={taskListRef} className="flex-1 overflow-y-auto px-3 sm:px-6 py-3">
        {/* Pull-to-refresh indicator */}
        {(pullDistance > 0 || isRefreshing) && (
          <div
            className="flex items-center justify-center transition-all"
            style={{ height: isRefreshing ? 40 : pullDistance * 0.6 }}
          >
            <div className={cn(
              "flex items-center gap-2 text-xs text-muted-foreground",
              isRefreshing && "animate-pulse"
            )}>
              <Loader2 className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
              {isRefreshing ? 'Đang tải lại...' : pullDistance >= 60 ? 'Thả để làm mới' : 'Kéo xuống để làm mới'}
            </div>
          </div>
        )}
        {currentTabTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            {selectedTab === 'not-started' && <ListTodo className="h-12 w-12 mb-3 opacity-30" />}
            {selectedTab === 'in-progress' && <Clock className="h-12 w-12 mb-3 opacity-30" />}
            {selectedTab === 'overdue' && <AlertTriangle className="h-12 w-12 mb-3 opacity-30" />}
            {selectedTab === 'completed' && <CheckCircle2 className="h-12 w-12 mb-3 opacity-30" />}
            {selectedTab === 'pending' && <Clock className="h-12 w-12 mb-3 opacity-30" />}
            <p className="text-sm">
              {searchQuery ? 'Không tìm thấy công việc phù hợp' : 'Không có công việc nào'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {currentTabTasks.map((task) => {
              const canSwipeComplete = task.status === 'Đang thực hiện' && task.approvalStatus !== 'pending';
              const canSwipeStart = task.status === 'Chưa bắt đầu' && task.approvalStatus !== 'pending';
              return (
                <SwipeableCard
                  key={task.systemId}
                  onSwipeLeft={canSwipeComplete ? () => setCompletionTask(task) : undefined}
                  onSwipeRight={canSwipeStart ? () => handleStartTask(task) : undefined}
                  leftLabel="Hoàn thành"
                  rightLabel="Bắt đầu"
                  leftColor="bg-green-500"
                  rightColor="bg-blue-500"
                >
                  <MobileTaskCard
                    task={task}
                    onComplete={setCompletionTask}
                    onStart={handleStartTask}
                    onViewDetails={handleViewDetails}
                    onCameraCapture={handleCameraCapture}
                  />
                </SwipeableCard>
              );
            })}
          </div>
        )}
      </div>

      {/* ======== Dialogs ======== */}
      {/* Hidden camera input for direct capture */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleCameraFileChange}
      />

      {completionTask && (
        <CompletionDialog
          task={completionTask}
          open={!!completionTask}
          onClose={() => { setCompletionTask(null); setCameraInitialImages([]); }}
          onSubmit={handleCompleteTask}
          initialImages={cameraInitialImages.length > 0 ? cameraInitialImages : undefined}
        />
      )}

      {evidenceTask?.completionEvidence && (
        <EvidenceViewer
          evidence={evidenceTask.completionEvidence}
          open={!!evidenceTask}
          onClose={() => setEvidenceTask(null)}
        />
      )}
    </div>
  );
}
