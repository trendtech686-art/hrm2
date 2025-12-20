/**
 * Tasks Dashboard Page
 * Analytics and insights for task management
 */

import * as React from 'react';
import { useTaskStore } from './store';
import { useEmployeeStore } from '../employees/store';
import { useAuth } from '../../contexts/auth-context';
import { usePageHeader } from '../../contexts/page-header-context';
import { formatDateForDisplay } from '@/lib/date-utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart3,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
  Users,
  Calendar,
  Download,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task, TaskStatus } from './types';

type DateRange = '7d' | '30d' | '90d' | 'all';

export function TasksDashboardPage() {
  const { data: tasks } = useTaskStore();
  const { data: employees } = useEmployeeStore();
  const { isAdmin } = useAuth();
  const [dateRange, setDateRange] = React.useState<DateRange>('30d');

  // Filter tasks by date range
  const filteredTasks = React.useMemo(() => {
    if (dateRange === 'all') return tasks;

    const days = parseInt(dateRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return tasks.filter(
      task => new Date(task.createdAt) >= cutoffDate
    );
  }, [tasks, dateRange]);

  // Calculate metrics
  const metrics = React.useMemo(() => {
    const total = filteredTasks.length;
    const notStarted = filteredTasks.filter(t => t.status === 'Chưa bắt đầu').length;
    const inProgress = filteredTasks.filter(t => t.status === 'Đang thực hiện').length;
    const waiting = filteredTasks.filter(t => t.status === 'Đang chờ').length;
    const completed = filteredTasks.filter(t => t.status === 'Hoàn thành').length;
    const cancelled = filteredTasks.filter(t => t.status === 'Đã hủy').length;

    // Overdue tasks
    const now = new Date();
    const overdue = filteredTasks.filter(
      t => t.dueDate && 
           new Date(t.dueDate) < now && 
           t.status !== 'Hoàn thành' && 
           t.status !== 'Đã hủy'
    ).length;

    // On-time completion rate
    const completedWithDueDate = filteredTasks.filter(
      t => t.status === 'Hoàn thành' && t.dueDate && t.completedDate
    );
    const completedOnTime = completedWithDueDate.filter(
      t => new Date(t.completedDate!) <= new Date(t.dueDate!)
    ).length;
    const onTimeRate = completedWithDueDate.length > 0
      ? Math.round((completedOnTime / completedWithDueDate.length) * 100)
      : 0;

    // Average completion time
    const completedTasksWithDates = filteredTasks.filter(
      t => t.status === 'Hoàn thành' && t.startDate && t.completedDate
    );
    const avgCompletionDays = completedTasksWithDates.length > 0
      ? Math.round(
          completedTasksWithDates.reduce((sum, t) => {
            const start = new Date(t.startDate!);
            const end = new Date(t.completedDate!);
            const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
            return sum + days;
          }, 0) / completedTasksWithDates.length
        )
      : 0;

    // Priority distribution
    const highPriority = filteredTasks.filter(
      t => (t.priority === 'Cao' || t.priority === 'Khẩn cấp') &&
           t.status !== 'Hoàn thành' &&
           t.status !== 'Đã hủy'
    ).length;

    return {
      total,
      notStarted,
      inProgress,
      waiting,
      completed,
      cancelled,
      overdue,
      onTimeRate,
      avgCompletionDays,
      highPriority,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [filteredTasks]);

  // Workload by assignee
  const workloadByAssignee = React.useMemo(() => {
    const workload: Record<string, {
      name: string;
      total: number;
      inProgress: number;
      completed: number;
      overdue: number;
    }> = {};

    employees.forEach(emp => {
      workload[emp.systemId] = {
        name: emp.fullName,
        total: 0,
        inProgress: 0,
        completed: 0,
        overdue: 0,
      };
    });

    const now = new Date();
    filteredTasks.forEach(task => {
      if (!task.assigneeId || !workload[task.assigneeId]) return;

      workload[task.assigneeId].total++;
      
      if (task.status === 'Đang thực hiện') {
        workload[task.assigneeId].inProgress++;
      }
      
      if (task.status === 'Hoàn thành') {
        workload[task.assigneeId].completed++;
      }
      
      if (task.dueDate && 
          new Date(task.dueDate) < now && 
          task.status !== 'Hoàn thành' && 
          task.status !== 'Đã hủy') {
        workload[task.assigneeId].overdue++;
      }
    });

    return Object.values(workload)
      .filter(w => w.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [filteredTasks, employees]);

  // Set page header
  usePageHeader({
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Công việc', href: '/tasks', isCurrent: false },
      { label: 'Dashboard', href: '/tasks/dashboard', isCurrent: true },
    ],
  });

  const handleExportCSV = () => {
    const csv = generateCSV(filteredTasks);
    downloadCSV(csv, `tasks-export-${dateRange}.csv`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h2 font-bold">Dashboard</h1>
          <p className="text-body-sm text-muted-foreground">
            Phân tích và báo cáo công việc
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 ngày qua</SelectItem>
              <SelectItem value="30d">30 ngày qua</SelectItem>
              <SelectItem value="90d">90 ngày qua</SelectItem>
              <SelectItem value="all">Tất cả thời gian</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportCSV} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Xuất CSV
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Tổng công việc"
          value={metrics.total}
          icon={BarChart3}
          description={`${metrics.completionRate}% hoàn thành`}
          trend={metrics.completionRate >= 70 ? 'up' : 'down'}
        />
        <MetricCard
          title="Đang thực hiện"
          value={metrics.inProgress}
          icon={Clock}
          description={`${metrics.waiting} đang chờ`}
          trend="neutral"
          color="blue"
        />
        <MetricCard
          title="Quá hạn"
          value={metrics.overdue}
          icon={AlertCircle}
          description={`${metrics.highPriority} ưu tiên cao`}
          trend={metrics.overdue > 0 ? 'down' : 'up'}
          color={metrics.overdue > 0 ? 'red' : 'green'}
        />
        <MetricCard
          title="Hoàn thành đúng hạn"
          value={`${metrics.onTimeRate}%`}
          icon={CheckCircle2}
          description={`TB ${metrics.avgCompletionDays} ngày`}
          trend={metrics.onTimeRate >= 80 ? 'up' : 'down'}
          color="green"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Phân bổ trạng thái</CardTitle>
            <CardDescription>Tổng quan công việc theo trạng thái</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <StatusBar
                label="Chưa bắt đầu"
                value={metrics.notStarted}
                total={metrics.total}
                color="gray"
              />
              <StatusBar
                label="Đang thực hiện"
                value={metrics.inProgress}
                total={metrics.total}
                color="blue"
              />
              <StatusBar
                label="Đang chờ"
                value={metrics.waiting}
                total={metrics.total}
                color="yellow"
              />
              <StatusBar
                label="Hoàn thành"
                value={metrics.completed}
                total={metrics.total}
                color="green"
              />
              <StatusBar
                label="Đã hủy"
                value={metrics.cancelled}
                total={metrics.total}
                color="red"
              />
            </div>
          </CardContent>
        </Card>

        {/* Workload by Assignee */}
        <Card>
          <CardHeader>
            <CardTitle>Khối lượng công việc</CardTitle>
            <CardDescription>Top người thực hiện nhiều nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workloadByAssignee.slice(0, 5).map(person => (
                <div key={person.name} className="space-y-1">
                  <div className="flex items-center justify-between text-body-sm">
                    <span className="font-medium">{person.name}</span>
                    <span className="text-muted-foreground">
                      {person.total} công việc
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <div
                      className="h-2 rounded-full bg-blue-500"
                      style={{
                        width: `${(person.inProgress / person.total) * 100}%`,
                      }}
                      title={`${person.inProgress} đang thực hiện`}
                    />
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{
                        width: `${(person.completed / person.total) * 100}%`,
                      }}
                      title={`${person.completed} hoàn thành`}
                    />
                    {person.overdue > 0 && (
                      <div
                        className="h-2 rounded-full bg-red-500"
                        style={{
                          width: `${(person.overdue / person.total) * 100}%`,
                        }}
                        title={`${person.overdue} quá hạn`}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tasks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Công việc gần đây</CardTitle>
          <CardDescription>10 công việc mới nhất</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentTasksTable tasks={filteredTasks.slice(0, 10)} />
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Metric Card Component
 */
interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'green' | 'red' | 'blue' | 'yellow';
}

function MetricCard({
  title,
  value,
  icon: Icon,
  description,
  trend = 'neutral',
  color = 'blue',
}: MetricCardProps) {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-muted-foreground',
  };

  const iconColors = {
    green: 'text-green-600 bg-green-100 dark:bg-green-900/20',
    red: 'text-red-600 bg-red-100 dark:bg-red-900/20',
    blue: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
    yellow: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20',
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-body-sm font-medium">{title}</CardTitle>
        <div className={cn('p-2 rounded-lg', iconColors[color])}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-h3 font-bold">{value}</div>
        <p className={cn('text-body-xs', trendColors[trend])}>{description}</p>
      </CardContent>
    </Card>
  );
}

/**
 * Status Bar Component
 */
interface StatusBarProps {
  label: string;
  value: number;
  total: number;
  color: string;
}

function StatusBar({ label, value, total, color }: StatusBarProps) {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  const colorClasses: Record<string, string> = {
    gray: 'bg-gray-500',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-body-sm">
        <span>{label}</span>
        <span className="font-medium">
          {value} ({percentage.toFixed(0)}%)
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all', colorClasses[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Recent Tasks Table Component
 */
function RecentTasksTable({ tasks }: { tasks: Task[] }) {
  return (
    <div className="space-y-2">
      {tasks.map(task => (
        <div
          key={task.systemId}
          className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-body-sm font-medium truncate">{task.id}</span>
              <Badge variant="outline" className="text-body-xs">
                {task.status}
              </Badge>
            </div>
            <p className="text-body-sm text-muted-foreground truncate">{task.title}</p>
          </div>
          <div className="flex items-center gap-2 text-body-xs text-muted-foreground">
            <span>{task.assigneeName || 'Chưa gán'}</span>
            {task.dueDate && (
              <span>• {formatDateForDisplay(task.dueDate)}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * CSV Export Helpers
 */
function generateCSV(tasks: Task[]): string {
  const headers = [
    'ID',
    'Tiêu đề',
    'Trạng thái',
    'Độ ưu tiên',
    'Người thực hiện',
    'Phòng ban',
    'Ngày bắt đầu',
    'Ngày hết hạn',
    'Ngày hoàn thành',
    'Tiến độ (%)',
    'Giờ dự kiến',
    'Giờ thực tế',
  ];

  const rows = tasks.map(task => [
    task.id,
    task.title,
    task.status,
    task.priority,
    task.assigneeName || '',
    '', // department (not available in Task type)
    task.startDate || '',
    task.dueDate || '',
    task.completedDate || '',
    task.progress,
    task.estimatedHours || '',
    task.totalTrackedSeconds ? (task.totalTrackedSeconds / 3600).toFixed(2) : '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  return csvContent;
}

function downloadCSV(content: string, filename: string) {
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
