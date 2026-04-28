'use client'

import * as React from 'react'
import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { format, formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import {
  AlertCircle,
  AlertTriangle,
  Camera,
  CheckCircle2,
  Clock,
  Image as ImageIcon,
  ListTodo,
  Loader2,
  Play,
  Search,
} from 'lucide-react'

import { generateSubEntityId } from '@/lib/id-utils'
import { invalidateRelated } from '@/lib/query-invalidation-map'
import { FileUploadAPI, type UploadedAsset } from '@/lib/file-upload-api'
import { logError } from '@/lib/logger'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/auth-context'
import { usePageHeader } from '@/contexts/page-header-context'

import { useTasks, useTaskMutations, taskKeys } from '../hooks/use-tasks'
import { PullToRefresh } from '@/components/shared/pull-to-refresh'
import type { Task } from '../types'
import { CompletionDialog } from './CompletionDialog'
import { EvidenceViewer } from './EvidenceViewer'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  MobilePageShell,
  StickyToolbar,
  MobileListContainer,
  MobileListGrid,
  underlineTabsListClass,
  underlineTabsTriggerClass,
  hiddenScrollbarClass,
} from '@/components/layout/page-section'
import { toast } from 'sonner'

// ============================================
// Tab config — icon + label; không có màu sắc tự chọn
// ============================================
const TAB_CONFIG = [
  { key: 'not-started', label: 'Mới', icon: ListTodo },
  { key: 'in-progress', label: 'Đang làm', icon: Clock },
  { key: 'overdue', label: 'Quá hạn', icon: AlertTriangle },
  { key: 'pending', label: 'Chờ duyệt', icon: Clock },
  { key: 'completed', label: 'Xong', icon: CheckCircle2 },
] as const

type TabKey = (typeof TAB_CONFIG)[number]['key']

const PRIORITY_BADGE: Record<
  string,
  { label: string; variant: 'secondary' | 'default' | 'warning' | 'destructive' }
> = {
  Khẩn_cấp: { label: 'Khẩn cấp', variant: 'destructive' },
  'Khẩn cấp': { label: 'Khẩn cấp', variant: 'destructive' },
  Cao: { label: 'Cao', variant: 'warning' },
  'Trung bình': { label: 'Trung bình', variant: 'default' },
  Thấp: { label: 'Thấp', variant: 'secondary' },
}

// ============================================
// Swipeable wrapper (mobile only)
// ============================================
function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  leftLabel,
  rightLabel,
}: {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  leftLabel?: string
  rightLabel?: string
}) {
  const cardRef = React.useRef<HTMLDivElement>(null)
  const startX = React.useRef(0)
  const currentX = React.useRef(0)
  const isDragging = React.useRef(false)
  const THRESHOLD = 80

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
    isDragging.current = true
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || !cardRef.current) return
    const diff = e.touches[0].clientX - startX.current
    if (diff > 0 && !onSwipeRight) return
    if (diff < 0 && !onSwipeLeft) return
    const clamped = Math.max(-120, Math.min(120, diff))
    currentX.current = clamped
    cardRef.current.style.transform = `translateX(${clamped}px)`
    cardRef.current.style.transition = 'none'
  }

  const handleTouchEnd = () => {
    if (!cardRef.current) return
    isDragging.current = false
    const diff = currentX.current
    cardRef.current.style.transition = 'transform 0.2s ease-out'
    cardRef.current.style.transform = 'translateX(0)'
    currentX.current = 0
    if (diff < -THRESHOLD && onSwipeLeft) onSwipeLeft()
    if (diff > THRESHOLD && onSwipeRight) onSwipeRight()
  }

  return (
    <div className="relative overflow-hidden rounded-none md:rounded-md">
      {onSwipeRight && (
        <div className="absolute inset-y-0 left-0 w-24 flex items-center justify-center md:rounded-l-md bg-primary text-primary-foreground">
          <span className="text-xs font-medium">{rightLabel}</span>
        </div>
      )}
      {onSwipeLeft && (
        <div className="absolute inset-y-0 right-0 w-24 flex items-center justify-center md:rounded-r-md bg-primary text-primary-foreground">
          <span className="text-xs font-medium">{leftLabel}</span>
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
  )
}

// ============================================
// Pull-to-Refresh
// ============================================
function usePullToRefresh(
  onRefresh: () => Promise<void>,
  containerRef: React.RefObject<HTMLDivElement | null>,
) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const startY = React.useRef(0)
  const pulling = React.useRef(false)
  const PULL_THRESHOLD = 60

  React.useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onTouchStart = (e: TouchEvent) => {
      if (el.scrollTop === 0) {
        startY.current = e.touches[0].clientY
        pulling.current = true
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      if (!pulling.current) return
      const diff = e.touches[0].clientY - startY.current
      if (diff > 0 && el.scrollTop === 0) {
        setPullDistance(Math.min(diff * 0.5, 100))
      }
    }

    const onTouchEnd = async () => {
      if (!pulling.current) return
      pulling.current = false
      if (pullDistance >= PULL_THRESHOLD) {
        setIsRefreshing(true)
        try {
          await onRefresh()
        } finally {
          setIsRefreshing(false)
        }
      }
      setPullDistance(0)
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: true })
    el.addEventListener('touchend', onTouchEnd)
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [containerRef, onRefresh, pullDistance])

  return { isRefreshing, pullDistance }
}

// ============================================
// Task Card — responsive, shadcn-ish
// ============================================
interface TaskCardProps {
  task: Task
  onComplete: (t: Task) => void
  onStart?: (t: Task) => void
  onViewDetails: (t: Task) => void
  onCameraCapture?: (t: Task) => void
}

function TaskCardItem({ task, onComplete, onStart, onViewDetails, onCameraCapture }: TaskCardProps) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const isOverdue = useMemo(() => {
    if (!task.dueDate || !now) return false;
    return new Date(task.dueDate) < now && task.status !== 'Hoàn thành';
  }, [task.dueDate, task.status, now]);
  const isCompleted = task.status === 'Hoàn thành'
  const isPendingApproval = task.approvalStatus === 'pending'
  const isRejected = task.approvalStatus === 'rejected'
  const priorityCfg = PRIORITY_BADGE[task.priority] ?? PRIORITY_BADGE['Trung bình']

  const dueDate = new Date(task.dueDate)
  const dueDateStr = format(dueDate, 'dd/MM', { locale: vi })
  const dueTimeRelative = isOverdue
    ? `Trễ ${formatDistanceToNow(dueDate, { locale: vi })}`
    : formatDistanceToNow(dueDate, { locale: vi, addSuffix: true })

  const canMarkComplete = !isCompleted && !isPendingApproval
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (canMarkComplete) onComplete(task)
  }
  const handleCheckboxKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.stopPropagation()
      e.preventDefault()
      if (canMarkComplete) onComplete(task)
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onViewDetails(task)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onViewDetails(task)
        }
      }}
      className={cn(
        'group flex flex-col gap-2.5 bg-card p-3 text-card-foreground',
        'border-b border-x-0 border-t-0 rounded-none',
        'md:gap-3 md:p-4 md:rounded-md md:border',
        'transition-colors cursor-pointer touch-manipulation',
        'hover:bg-muted/30 md:hover:border-foreground/20 md:hover:bg-card active:bg-muted/50',
        isOverdue && 'md:border-destructive/30',
      )}
    >
      {/* Row 1: Checkbox + Title + ID */}
      <div className="flex items-start gap-3">
        <div
          role="button"
          tabIndex={canMarkComplete ? 0 : -1}
          className="pt-0.5 shrink-0 outline-none"
          onClick={handleCheckboxClick}
          onKeyDown={handleCheckboxKeyDown}
        >
          <Checkbox
            checked={isCompleted || isPendingApproval}
            disabled={isCompleted || isPendingApproval}
            className="h-5 w-5 rounded-full pointer-events-none"
            aria-label={isCompleted ? 'Đã hoàn thành' : 'Đánh dấu hoàn thành'}
            tabIndex={-1}
          />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <h3
            className={cn(
              'text-sm font-medium leading-snug line-clamp-2',
              isCompleted && 'line-through text-muted-foreground',
            )}
          >
            {task.title}
          </h3>
          {task.id && (
            <p className="text-[11px] text-muted-foreground font-mono">{task.id}</p>
          )}
        </div>
        <Badge variant={priorityCfg.variant} className="shrink-0">
          {priorityCfg.label}
        </Badge>
      </div>

      {/* Row 2: Meta chips — chỉ dùng text + icon, muted */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        <span
          className={cn('inline-flex items-center gap-1', isOverdue && 'text-destructive font-medium')}
        >
          <Clock className="h-3 w-3" />
          {dueDateStr} · {dueTimeRelative}
        </span>
        {task.subtasks && task.subtasks.length > 0 && (
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length}
          </span>
        )}
        {task.completionEvidence && (
          <span className="inline-flex items-center gap-1">
            <ImageIcon className="h-3 w-3" />
            {task.completionEvidence.images.length}
          </span>
        )}
      </div>

      {/* Row 3: Approval status */}
      {(isPendingApproval || isRejected || (isCompleted && task.approvalStatus === 'approved')) && (
        <div className="flex flex-wrap gap-1.5">
          {isPendingApproval && (
            <Badge variant="warning">
              <Clock className="h-3 w-3 mr-1" />
              Chờ duyệt
            </Badge>
          )}
          {isRejected && (
            <Badge variant="destructive">
              <AlertCircle className="h-3 w-3 mr-1" />
              Cần làm lại
            </Badge>
          )}
          {isCompleted && task.approvalStatus === 'approved' && (
            <Badge variant="success">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Đã duyệt
            </Badge>
          )}
        </div>
      )}

      {/* Rejection reason */}
      {isRejected && task.rejectionReason && (
        <div className="rounded-md border border-destructive/30 bg-destructive/5 p-2 text-xs">
          <span className="font-medium text-destructive">Lý do: </span>
          <span className="text-muted-foreground">{task.rejectionReason}</span>
        </div>
      )}

      {/* Progress bar */}
      {task.progress > 0 && task.progress < 100 && (
        <div className="flex items-center gap-2">
          <Progress value={task.progress} className="h-1.5 flex-1" />
          <span className="text-xs text-muted-foreground tabular-nums w-10 text-right">
            {task.progress}%
          </span>
        </div>
      )}

      {/* Quick actions */}
      {(task.status === 'Chưa bắt đầu' || task.status === 'Đang thực hiện') && !isPendingApproval && (
        <div className="flex flex-wrap gap-2 pt-1">
          {task.status === 'Chưa bắt đầu' && onStart && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-8 gap-1.5"
              onClick={(e) => {
                e.stopPropagation()
                onStart(task)
              }}
            >
              <Play className="h-3.5 w-3.5" />
              Bắt đầu
            </Button>
          )}
          {task.status === 'Đang thực hiện' && onCameraCapture && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-8 gap-1.5"
              onClick={(e) => {
                e.stopPropagation()
                onCameraCapture(task)
              }}
            >
              <Camera className="h-3.5 w-3.5" />
              Chụp bằng chứng
            </Button>
          )}
          {task.status === 'Đang thực hiện' && (
            <Button
              type="button"
              size="sm"
              className="h-8 gap-1.5"
              onClick={(e) => {
                e.stopPropagation()
                onComplete(task)
              }}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Hoàn thành
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================
// Main Page
// ============================================
export function UserTasksPage() {
  const router = useRouter()
  const { employee } = useAuth()
  const { data: tasksData } = useTasks()
  const allTasks = React.useMemo(() => tasksData?.data ?? [], [tasksData?.data])
  const { update: updateMutation } = useTaskMutations()
  const queryClient = useQueryClient()
  const taskListRef = React.useRef<HTMLDivElement>(null)

  // Client-only date for hydration safety
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
  }, []);

  const update = React.useCallback(
    (systemId: string, data: Partial<Task>) => {
      updateMutation.mutate({ systemId, data })
    },
    [updateMutation],
  )

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTab, setSelectedTab] = useState<TabKey>('not-started')
  const [completionTask, setCompletionTask] = useState<Task | null>(null)
  const [evidenceTask, setEvidenceTask] = useState<Task | null>(null)
  const [showSearch, setShowSearch] = useState(false)
  const [cameraInitialImages, setCameraInitialImages] = useState<UploadedAsset[]>([])
  const cameraInputRef = React.useRef<HTMLInputElement>(null)
  const cameraTaskRef = React.useRef<Task | null>(null)

  usePageHeader({
    title: 'Công việc của tôi',
    breadcrumb: [
      { label: 'Trang chủ', href: '/' },
      { label: 'Công việc của tôi', href: '/my-tasks' },
    ],
  })

  // Filter tasks assigned to current user
  const myTasks = useMemo(() => {
    if (!employee) return []
    return allTasks.filter((task) => {
      const isAssigned = task.assignees?.some(
        (assignee) => assignee.employeeSystemId === employee.systemId,
      )
      const isLegacyAssigned = task.assigneeId === employee.systemId
      return isAssigned || isLegacyAssigned
    })
  }, [allTasks, employee])

  // Categorize
  const categorizedTasks = useMemo(() => {
    return {
      'not-started': myTasks.filter(
        (task) => task.status === 'Chưa bắt đầu' && task.approvalStatus !== 'pending',
      ),
      'in-progress': myTasks.filter(
        (task) =>
          (task.status === 'Đang thực hiện' && task.approvalStatus !== 'pending') ||
          task.approvalStatus === 'rejected',
      ),
      overdue: myTasks.filter((task) => {
        return (
          new Date(task.dueDate) < (now ?? new Date()) &&
          task.status !== 'Hoàn thành' &&
          task.approvalStatus !== 'pending'
        )
      }),
      completed: myTasks.filter(
        (task) => task.status === 'Hoàn thành' && task.approvalStatus === 'approved',
      ),
      pending: myTasks.filter((task) => task.approvalStatus === 'pending'),
    } as Record<TabKey, Task[]>
  }, [myTasks, now])

  const filterTasks = (tasks: Task[]) => {
    if (!searchQuery.trim()) return tasks
    const query = searchQuery.toLowerCase()
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.id.toLowerCase().includes(query),
    )
  }

  const currentTabTasks = filterTasks(categorizedTasks[selectedTab])

  // ============================================
  // Handlers
  // ============================================
  const handleCompleteTask = async (
    taskId: string,
    evidence: { images: string[]; note: string },
  ) => {
    if (!employee) return
    try {
      const task = myTasks.find((t) => t.systemId === taskId)
      if (!task) throw new Error('Không tìm thấy công việc')

      let newTotalSeconds = task.totalTrackedSeconds || 0
      if (task.timerRunning && task.timerStartedAt) {
        const elapsed = Math.floor(
          (Date.now() - new Date(task.timerStartedAt).getTime()) / 1000,
        )
        newTotalSeconds += Math.max(0, elapsed)
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
      })

      toast.success('Đã gửi bằng chứng hoàn thành', {
        description: 'Vui lòng đợi admin phê duyệt',
      })

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
      }).catch(() => {})

      setCompletionTask(null)
    } catch (error) {
      logError('Error completing task', error)
      throw error
    }
  }

  const handleStartTask = React.useCallback(
    (task: Task) => {
      update(task.systemId, {
        status: 'Đang thực hiện',
        startDate: new Date().toISOString().split('T')[0],
        timerRunning: true,
        timerStartedAt: new Date().toISOString(),
      })
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
      }).catch(() => {})
      toast.success('Đã bắt đầu công việc')
    },
    [update, employee],
  )

  const handleViewDetails = (task: Task) => {
    router.push(`/tasks/${task.systemId}`)
  }

  const handleCameraCapture = React.useCallback((task: Task) => {
    cameraTaskRef.current = task
    cameraInputRef.current?.click()
  }, [])

  const handleCameraFileChange = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      if (files.length === 0 || !cameraTaskRef.current) return
      const task = cameraTaskRef.current

      try {
        toast.loading('Đang tải ảnh lên...', { id: 'camera-upload' })
        const uploaded = await FileUploadAPI.uploadTaskEvidence(task.systemId, files)
        toast.dismiss('camera-upload')
        toast.success('Đã chụp ảnh bằng chứng')
        setCameraInitialImages(uploaded)
        setCompletionTask(task)
      } catch (err) {
        toast.dismiss('camera-upload')
        toast.error('Không thể tải ảnh lên. Vui lòng thử lại.')
        logError('Camera capture upload failed', err)
      }
      e.target.value = ''
    },
    [],
  )

  const handleRefresh = React.useCallback(async () => {
    await invalidateRelated(queryClient, 'tasks')
  }, [queryClient])

  const { isRefreshing, pullDistance } = usePullToRefresh(handleRefresh, taskListRef)

  const totalTasks = myTasks.length

  // ============================================
  // Render
  // ============================================
  const handlePullRefresh = React.useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: taskKeys.all })
  }, [queryClient])

  return (
    <PullToRefresh onRefresh={handlePullRefresh}>
    <MobilePageShell>
      <StickyToolbar>
        <div className="flex items-center gap-3 px-3 py-2 md:px-6">
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            Tổng: <span className="font-semibold text-foreground tabular-nums">{totalTasks}</span>
          </span>
          <div className="flex-1" />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setShowSearch((s) => !s)}
            aria-label="Tìm kiếm"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {showSearch && (
          <div className="px-3 pb-2 md:px-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm công việc..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                autoFocus
              />
            </div>
          </div>
        )}

        <Tabs
          value={selectedTab}
          onValueChange={(v) => setSelectedTab(v as TabKey)}
          className="w-full"
        >
          <div className={hiddenScrollbarClass}>
            <TabsList className={underlineTabsListClass}>
              {TAB_CONFIG.map((tab) => {
                const count = categorizedTasks[tab.key].length
                const Icon = tab.icon
                return (
                  <TabsTrigger
                    key={tab.key}
                    value={tab.key}
                    className={underlineTabsTriggerClass}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tab.label}
                    {count > 0 && (
                      <span className="ml-0.5 min-w-5 h-5 inline-flex items-center justify-center rounded-full bg-muted text-foreground text-[10px] font-semibold px-1.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                        {count}
                      </span>
                    )}
                  </TabsTrigger>
                )
              })}
            </TabsList>
          </div>
          <TabsContent value={selectedTab} className="sr-only">
            {selectedTab}
          </TabsContent>
        </Tabs>
      </StickyToolbar>

      <MobileListContainer ref={taskListRef}>
        {(pullDistance > 0 || isRefreshing) && (
          <div
            className="flex items-center justify-center transition-all"
            style={{ height: isRefreshing ? 40 : pullDistance * 0.6 }}
          >
            <div
              className={cn(
                'flex items-center gap-2 text-xs text-muted-foreground',
                isRefreshing && 'animate-pulse',
              )}
            >
              <Loader2 className={cn('h-4 w-4', isRefreshing && 'animate-spin')} />
              {isRefreshing
                ? 'Đang tải lại...'
                : pullDistance >= 60
                  ? 'Thả để làm mới'
                  : 'Kéo xuống để làm mới'}
            </div>
          </div>
        )}

        {currentTabTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
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
          <MobileListGrid cols={3}>
            {currentTabTasks.map((task) => {
              const canSwipeComplete =
                task.status === 'Đang thực hiện' && task.approvalStatus !== 'pending'
              const canSwipeStart =
                task.status === 'Chưa bắt đầu' && task.approvalStatus !== 'pending'
              return (
                <SwipeableCard
                  key={task.systemId}
                  onSwipeLeft={canSwipeComplete ? () => setCompletionTask(task) : undefined}
                  onSwipeRight={canSwipeStart ? () => handleStartTask(task) : undefined}
                  leftLabel="Hoàn thành"
                  rightLabel="Bắt đầu"
                >
                  <TaskCardItem
                    task={task}
                    onComplete={setCompletionTask}
                    onStart={handleStartTask}
                    onViewDetails={handleViewDetails}
                    onCameraCapture={handleCameraCapture}
                  />
                </SwipeableCard>
              )
            })}
          </MobileListGrid>
        )}
      </MobileListContainer>

      {/* Camera input ẩn */}
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
          onClose={() => {
            setCompletionTask(null)
            setCameraInitialImages([])
          }}
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
    </MobilePageShell>
    </PullToRefresh>
  )
}
