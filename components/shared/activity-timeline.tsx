import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar.tsx';
import { Badge } from '../ui/badge.tsx';
import { ScrollArea } from '../ui/scroll-area.tsx';
import {
  FileText,
  MessageSquare,
  CheckCircle,
  UserPlus,
  AlertCircle,
  Trash2,
  Upload,
  Download,
  Edit,
  Plus,
  ArrowUpCircle,
  ArrowDownCircle,
} from 'lucide-react';
import { formatDistanceToNow, format, isToday, isYesterday, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

// ============================================================================
// Types
// ============================================================================

export type ActivityType =
  | 'created'
  | 'updated'
  | 'status_changed'
  | 'priority_changed'
  | 'assigned'
  | 'commented'
  | 'subtask_added'
  | 'subtask_completed'
  | 'file_attached'
  | 'file_removed'
  | 'due_date_changed'
  | 'description_changed';

export type Activity<T = any> = {
  id: string;
  type: ActivityType;
  userId: string;
  userName: string;
  userAvatar?: string;
  description: string;
  metadata?: T; // Additional data (old value, new value, etc.)
  createdAt: Date | string;
};

export interface ActivityTimelineProps<T = any> {
  activities: Activity<T>[];
  currentUserId?: string; // Highlight current user's activities
  maxHeight?: string; // ScrollArea max height
  showGrouping?: boolean; // Group by date
  compact?: boolean; // Compact mode
  emptyMessage?: string;
}

// ============================================================================
// Activity Icon & Color Configuration
// ============================================================================

const activityConfig: Record<
  ActivityType,
  {
    icon: React.ReactNode;
    color: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  created: {
    icon: <Plus className="h-3.5 w-3.5" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  updated: {
    icon: <Edit className="h-3.5 w-3.5" />,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
  },
  status_changed: {
    icon: <CheckCircle className="h-3.5 w-3.5" />,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  priority_changed: {
    icon: <AlertCircle className="h-3.5 w-3.5" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  assigned: {
    icon: <UserPlus className="h-3.5 w-3.5" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  commented: {
    icon: <MessageSquare className="h-3.5 w-3.5" />,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
  },
  subtask_added: {
    icon: <Plus className="h-3.5 w-3.5" />,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
  },
  subtask_completed: {
    icon: <CheckCircle className="h-3.5 w-3.5" />,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
  },
  file_attached: {
    icon: <Upload className="h-3.5 w-3.5" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  file_removed: {
    icon: <Trash2 className="h-3.5 w-3.5" />,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  due_date_changed: {
    icon: <AlertCircle className="h-3.5 w-3.5" />,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
  },
  description_changed: {
    icon: <FileText className="h-3.5 w-3.5" />,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
  },
};

// ============================================================================
// Helper Functions
// ============================================================================

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatActivityDate = (date: Date | string) => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;

  if (isToday(parsedDate)) {
    return 'Hôm nay';
  }
  if (isYesterday(parsedDate)) {
    return 'Hôm qua';
  }
  return format(parsedDate, 'dd/MM/yyyy', { locale: vi });
};

const formatActivityTime = (date: Date | string) => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, 'HH:mm', { locale: vi });
};

const getRelativeTime = (date: Date | string) => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(parsedDate, { addSuffix: true, locale: vi });
};

// ============================================================================
// Activity Item Component
// ============================================================================

interface ActivityItemProps<T> {
  activity: Activity<T>;
  isCurrentUser?: boolean;
  compact?: boolean;
  showTime?: boolean;
}

function ActivityItem<T>({
  activity,
  isCurrentUser,
  compact,
  showTime = true,
}: ActivityItemProps<T>) {
  const config = activityConfig[activity.type];

  return (
    <div className="flex gap-3 group">
      {/* Timeline Line & Icon */}
      <div className="flex flex-col items-center">
        <div
          className={`flex items-center justify-center ${
            compact ? 'h-7 w-7' : 'h-8 w-8'
          } rounded-full border-2 ${config.borderColor} ${config.bgColor}`}
        >
          <div className={config.color}>{config.icon}</div>
        </div>
        <div className="flex-1 w-px bg-border mt-2" />
      </div>

      {/* Content */}
      <div className={`flex-1 ${compact ? 'pb-3' : 'pb-4'} min-w-0`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {/* User Avatar */}
            <Avatar className={compact ? 'h-5 w-5' : 'h-6 w-6'}>
              {activity.userAvatar ? (
                <AvatarImage src={activity.userAvatar} alt={activity.userName} />
              ) : (
                <AvatarFallback
                  className={`text-[10px] font-medium ${
                    isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}
                >
                  {getInitials(activity.userName)}
                </AvatarFallback>
              )}
            </Avatar>

            {/* User Name & Description */}
            <div className="min-w-0 flex-1">
              <p className={compact ? 'text-sm' : 'text-sm'}>
                <span
                  className={`font-semibold ${
                    isCurrentUser ? 'text-primary' : ''
                  }`}
                >
                  {activity.userName}
                </span>{' '}
                <span className="text-muted-foreground">{activity.description}</span>
              </p>

              {/* Metadata Display */}
              {activity.metadata && typeof activity.metadata === 'object' && (
                <div className="mt-1 space-y-1">
                  {'oldValue' in activity.metadata && 'newValue' in activity.metadata && (
                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant="outline" className="font-mono">
                        {String((activity.metadata as any).oldValue)}
                      </Badge>
                      <span className="text-muted-foreground">→</span>
                      <Badge variant="outline" className="font-mono">
                        {String((activity.metadata as any).newValue)}
                      </Badge>
                    </div>
                  )}
                  {'comment' in activity.metadata && (
                    <div className="mt-2 p-2 rounded-lg bg-muted/50 border text-sm">
                      {String((activity.metadata as any).comment)}
                    </div>
                  )}
                  {'fileName' in activity.metadata && (
                    <Badge variant="secondary" className="text-xs">
                      {String((activity.metadata as any).fileName)}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Time */}
          {showTime && (
            <span
              className={`text-xs text-muted-foreground whitespace-nowrap ${
                compact ? 'text-[10px]' : ''
              }`}
              title={format(
                typeof activity.createdAt === 'string'
                  ? parseISO(activity.createdAt)
                  : activity.createdAt,
                'dd/MM/yyyy HH:mm:ss'
              )}
            >
              {getRelativeTime(activity.createdAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main ActivityTimeline Component
// ============================================================================

export function ActivityTimeline<T = any>({
  activities,
  currentUserId,
  maxHeight = '600px',
  showGrouping = true,
  compact = false,
  emptyMessage = 'Chưa có hoạt động nào',
}: ActivityTimelineProps<T>) {
  // Sort activities by date (newest first)
  const sortedActivities = React.useMemo(() => {
    return [...activities].sort((a, b) => {
      const dateA =
        typeof a.createdAt === 'string' ? parseISO(a.createdAt) : a.createdAt;
      const dateB =
        typeof b.createdAt === 'string' ? parseISO(b.createdAt) : b.createdAt;
      return dateB.getTime() - dateA.getTime();
    });
  }, [activities]);

  // Group activities by date
  const groupedActivities = React.useMemo(() => {
    if (!showGrouping) return null;

    const groups = new Map<string, Activity<T>[]>();

    sortedActivities.forEach((activity) => {
      const dateKey = formatActivityDate(activity.createdAt);
      if (!groups.has(dateKey)) {
        groups.set(dateKey, []);
      }
      groups.get(dateKey)!.push(activity);
    });

    return groups;
  }, [sortedActivities, showGrouping]);

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-12 w-12 text-muted-foreground/50 mb-3" />
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ScrollArea className="w-full" style={{ maxHeight }}>
      <div className={compact ? 'p-2' : 'p-4'}>
        {showGrouping && groupedActivities ? (
          // Grouped by date
          <div className="space-y-6">
            {Array.from(groupedActivities.entries()).map(([date, activities]) => (
              <div key={date}>
                {/* Date Header */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-px flex-1 bg-border" />
                  <Badge variant="outline" className="text-xs font-semibold">
                    {date}
                  </Badge>
                  <div className="h-px flex-1 bg-border" />
                </div>

                {/* Activities for this date */}
                <div className="space-y-0">
                  {activities.map((activity, index) => (
                    <ActivityItem
                      key={activity.id}
                      activity={activity}
                      isCurrentUser={activity.userId === currentUserId}
                      compact={compact}
                      showTime
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Ungrouped list
          <div className="space-y-0">
            {sortedActivities.map((activity) => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                isCurrentUser={activity.userId === currentUserId}
                compact={compact}
                showTime
              />
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
