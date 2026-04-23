'use client'

/**
 * Tasks Dashboard Page
 * Analytics and insights for task management
 */

import * as React from 'react';
import { useTasks, useTaskDashboardStats } from '../hooks/use-tasks';
import type { TaskFilters } from '../api/tasks-api';
import { fetchTasks } from '../api/tasks-api';
import { useAuth } from '@/contexts/auth-context';
import { usePageHeader } from '@/contexts/page-header-context';
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
  Clock,
  AlertCircle,
  CheckCircle2,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Task } from '../types';

import { mobileBleedCardClass } from '@/components/layout/page-section';
type DateRange = '7d' | '30d' | '90d' | 'all';

export function TasksDashboardPage() {
  const { isAdmin: _isAdmin } = useAuth();
  const [dateRange, setDateRange] = React.useState<DateRange>('30d');

  // Compute server-side createdFrom based on date range
  const createdFrom = React.useMemo(() => {
    if (dateRange === 'all') return undefined;
    const days = parseInt(dateRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return cutoffDate.toISOString().split('T')[0];
  }, [dateRange]);

  // Server-side aggregated stats — no raw task data loaded for metrics
  const { data: stats } = useTaskDashboardStats(createdFrom);

  // Only fetch page 1 of recent tasks for the table (10 items)
  const recentTasksFilters: TaskFilters = React.useMemo(() => ({
    createdFrom,
    page: 1,
  }), [createdFrom]);
  const recentTasksQuery = useTasks(recentTasksFilters);
  const recentTasks = recentTasksQuery.data?.data || [];

  // Metrics from server-side stats
  const metrics = React.useMemo(() => {
    if (!stats) {
      return {
        total: 0, notStarted: 0, inProgress: 0, waiting: 0,
        completed: 0, cancelled: 0, overdue: 0, onTimeRate: 0,
        avgCompletionDays: 0, highPriority: 0, completionRate: 0,
      };
    }
    return {
      total: stats.total,
      notStarted: stats.byStatus.notStarted,
      inProgress: stats.byStatus.inProgress,
      waiting: stats.byStatus.review,
      completed: stats.byStatus.completed,
      cancelled: stats.byStatus.cancelled,
      overdue: stats.overdue,
      onTimeRate: stats.onTimeRate,
      avgCompletionDays: stats.avgCompletionDays,
      highPriority: stats.highPriority,
      completionRate: stats.completionRate,
    };
  }, [stats]);

  // Workload by assignee — from server-side stats
  const workloadByAssignee = React.useMemo(() => {
    return (stats?.byAssignee || []).slice(0, 5);
  }, [stats]);

  // CSV export — fetch all pages on demand
  const handleExportCSV = React.useCallback(async () => {
    try {
      // Fetch all tasks progressively for export
      const firstPage = await fetchTasks({ createdFrom, page: 1 });
      const totalPages = firstPage.pagination?.totalPages || 1;

      let allTasks = [...firstPage.data];
      if (totalPages > 1) {
        const remainingPages = await Promise.all(
          Array.from({ length: totalPages - 1 }, (_, i) =>
            fetchTasks({ createdFrom, page: i + 2 })
          )
        );
        remainingPages.forEach((page) => {
          allTasks = [...allTasks, ...page.data];
        });
      }

      const csv = generateCSV(allTasks);
      downloadCSV(csv, `tasks-export-${dateRange}.csv`);
    } catch (error) {
      console.error('Export failed:', error);
    }
  }, [createdFrom, dateRange]);

  // Set page header
  usePageHeader({
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Công việc', href: '/tasks', isCurrent: false },
      { label: 'Dashboard', href: '/tasks/dashboard', isCurrent: true },
    ],
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h2 font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Phân tích và báo cáo công việc
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={(v) => setDateRange(v as DateRange)}>
            <SelectTrigger className="w-45">
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
        <Card className={mobileBleedCardClass}>
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
        <Card className={mobileBleedCardClass}>
          <CardHeader>
            <CardTitle>Khối lượng công việc</CardTitle>
            <CardDescription>Top người thực hiện nhiều nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workloadByAssignee.slice(0, 5).map(person => (
                <div key={person.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
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
      <Card className={mobileBleedCardClass}>
        <CardHeader>
          <CardTitle>Công việc gần đây</CardTitle>
          <CardDescription>10 công việc mới nhất</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentTasksTable tasks={recentTasks.slice(0, 10)} />
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
    <Card className={mobileBleedCardClass}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle size="sm">{title}</CardTitle>
        <div className={cn('p-2 rounded-lg', iconColors[color])}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-h3 font-bold">{value}</div>
        <p className={cn('text-xs', trendColors[trend])}>{description}</p>
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
    gray: 'bg-muted-foreground',
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
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
              <span className="text-sm font-medium truncate">{task.id}</span>
              <Badge variant="outline" className="text-xs">
                {task.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground truncate">{task.title}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
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
