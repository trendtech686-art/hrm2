'use client'

import { useState, useMemo } from 'react';
import { useNavigate } from '@/lib/next-compat';
import { useTaskStore } from './store';
import { useAuth } from '@/contexts/auth-context';
import { usePageHeader } from '@/contexts/page-header-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw, CheckCircle, Clock, AlertTriangle, ListTodo } from 'lucide-react';
import { TaskCheckboxItem } from './components/TaskCheckboxItem';
import { CompletionDialog } from './components/CompletionDialog';
import { EvidenceViewer } from './components/EvidenceViewer';
import type { Task } from './types';
import { toast } from 'sonner';

export function UserTasksPage() {
  const navigate = useNavigate();
  const { employee } = useAuth();
  const { data: allTasks, update } = useTaskStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('not-started');
  const [completionTask, setCompletionTask] = useState<Task | null>(null);
  const [evidenceTask, setEvidenceTask] = useState<Task | null>(null);

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
      // Check if user is in assignees
      const isAssigned = task.assignees?.some(
        assignee => assignee.employeeSystemId === employee.systemId
      );
      
      // Or check legacy assigneeId
      const isLegacyAssigned = task.assigneeId === employee.systemId;
      
      return isAssigned || isLegacyAssigned;
    });
  }, [allTasks, employee]);

  // Categorize tasks
  const categorizedTasks = useMemo(() => {
    const now = new Date();
    
    const notStarted = myTasks.filter(
      task => task.status === 'Chưa bắt đầu' && task.approvalStatus !== 'pending'
    );
    
    const inProgress = myTasks.filter(
      task => task.status === 'Đang thực hiện' && task.approvalStatus !== 'pending'
    );
    
    const overdue = myTasks.filter(task => {
      const isOverdue = new Date(task.dueDate) < now;
      const isNotCompleted = task.status !== 'Hoàn thành';
      const isNotPending = task.approvalStatus !== 'pending';
      return isOverdue && isNotCompleted && isNotPending;
    });
    
    const completed = myTasks.filter(
      task => task.status === 'Hoàn thành' && task.approvalStatus === 'approved'
    );

    const pendingApproval = myTasks.filter(
      task => task.approvalStatus === 'pending'
    );

    const rejected = myTasks.filter(
      task => task.approvalStatus === 'rejected'
    );

    return {
      notStarted,
      inProgress,
      overdue,
      completed,
      pendingApproval,
      rejected,
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

  const getTabTasks = (tab: string) => {
    switch (tab) {
      case 'not-started':
        return filterTasks(categorizedTasks.notStarted);
      case 'in-progress':
        return filterTasks([...categorizedTasks.inProgress, ...categorizedTasks.rejected]);
      case 'overdue':
        return filterTasks(categorizedTasks.overdue);
      case 'completed':
        return filterTasks(categorizedTasks.completed);
      case 'pending':
        return filterTasks(categorizedTasks.pendingApproval);
      default:
        return [];
    }
  };

  const handleCompleteTask = async (taskId: string, evidence: { images: string[]; note: string }) => {
    if (!employee) return;

    try {
      const task = myTasks.find(t => t.systemId === taskId);
      if (!task) throw new Error('Task not found');

      await update(taskId, {
        ...task,
        approvalStatus: 'pending',
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
            id: `activity_${Date.now()}`,
            taskId: task.systemId,
            userId: employee.systemId,
            userName: employee.fullName,
            action: 'evidence_submitted',
            description: 'Đã gửi bằng chứng hoàn thành công việc',
            timestamp: new Date().toISOString(),
          },
        ],
      });

      toast.success('Đã gửi bằng chứng hoàn thành công việc', {
        description: 'Vui lòng đợi admin phê duyệt',
      });

      setCompletionTask(null);
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  };

  const handleViewDetails = (task: Task) => {
    if (task.completionEvidence) {
      setEvidenceTask(task);
    } else {
      navigate(`/tasks/${task.systemId}`);
    }
  };

  const handleRefresh = () => {
    toast.info('Đã làm mới danh sách công việc');
  };

  const currentTabTasks = getTabTasks(selectedTab);

  return (
    <div className="p-6 space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ListTodo className="h-4 w-4" />
              Chưa bắt đầu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categorizedTasks.notStarted.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Đang làm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {categorizedTasks.inProgress.length + categorizedTasks.rejected.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Quá hạn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {categorizedTasks.overdue.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              Chờ duyệt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {categorizedTasks.pendingApproval.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Hoàn thành
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {categorizedTasks.completed.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm công việc..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="icon" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="w-full grid grid-cols-5">
          <TabsTrigger value="not-started" className="flex items-center gap-2">
            <ListTodo className="h-4 w-4" />
            <span className="hidden sm:inline">Chưa bắt đầu</span>
            <span className="sm:hidden">Mới</span>
            {categorizedTasks.notStarted.length > 0 && (
              <span className="ml-1 bg-muted px-1.5 py-0.5 rounded text-xs">
                {categorizedTasks.notStarted.length}
              </span>
            )}
          </TabsTrigger>

          <TabsTrigger value="in-progress" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Đang làm</span>
            <span className="sm:hidden">Làm</span>
            {(categorizedTasks.inProgress.length + categorizedTasks.rejected.length) > 0 && (
              <span className="ml-1 bg-muted px-1.5 py-0.5 rounded text-xs">
                {categorizedTasks.inProgress.length + categorizedTasks.rejected.length}
              </span>
            )}
          </TabsTrigger>

          <TabsTrigger value="overdue" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Quá hạn</span>
            <span className="sm:hidden">Hạn</span>
            {categorizedTasks.overdue.length > 0 && (
              <span className="ml-1 bg-red-100 text-red-800 px-1.5 py-0.5 rounded text-xs">
                {categorizedTasks.overdue.length}
              </span>
            )}
          </TabsTrigger>

          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Chờ duyệt</span>
            <span className="sm:hidden">Chờ</span>
            {categorizedTasks.pendingApproval.length > 0 && (
              <span className="ml-1 bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded text-xs">
                {categorizedTasks.pendingApproval.length}
              </span>
            )}
          </TabsTrigger>

          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Hoàn thành</span>
            <span className="sm:hidden">Xong</span>
            {categorizedTasks.completed.length > 0 && (
              <span className="ml-1 bg-green-100 text-green-800 px-1.5 py-0.5 rounded text-xs">
                {categorizedTasks.completed.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Tab contents */}
        {['not-started', 'in-progress', 'overdue', 'pending', 'completed'].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4">
            {currentTabTasks.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  {searchQuery ? (
                    <>Không tìm thấy công việc nào phù hợp</>
                  ) : (
                    <>Không có công việc nào trong mục này</>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {currentTabTasks.map((task) => (
                  <TaskCheckboxItem
                    key={task.systemId}
                    task={task}
                    onComplete={setCompletionTask}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Completion dialog */}
      {completionTask && (
        <CompletionDialog
          task={completionTask}
          open={!!completionTask}
          onClose={() => setCompletionTask(null)}
          onSubmit={handleCompleteTask}
        />
      )}

      {/* Evidence viewer */}
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
