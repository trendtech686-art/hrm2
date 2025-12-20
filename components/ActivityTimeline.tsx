import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  CheckCircle2, 
  XCircle, 
  Edit, 
  User, 
  Flag, 
  Play, 
  Pause, 
  MessageSquare,
  FileText,
  Clock,
  ChevronDown,
  ChevronUp,
  Upload,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import type { TaskActivity } from '../features/tasks/types';

interface ActivityTimelineProps {
  activities: TaskActivity[];
  maxVisible?: number;
}

const actionIcons: Record<TaskActivity['action'], React.ElementType> = {
  created: FileText,
  updated: Edit,
  status_changed: Edit,
  assigned: User,
  assignee_added: User,
  assignee_removed: User,
  priority_changed: Flag,
  progress_updated: Edit,
  timer_started: Play,
  timer_stopped: Pause,
  subtask_completed: CheckCircle2,
  subtask_uncompleted: XCircle,
  completed: CheckCircle2,
  commented: MessageSquare,
  evidence_submitted: Upload,
  evidence_approved: CheckCircle,
  evidence_rejected: AlertCircle,
};

const actionColors: Record<TaskActivity['action'], string> = {
  created: 'text-blue-600 bg-blue-50 dark:bg-blue-950',
  updated: 'text-gray-600 bg-gray-50 dark:bg-gray-900',
  status_changed: 'text-purple-600 bg-purple-50 dark:bg-purple-950',
  assigned: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950',
  assignee_added: 'text-green-600 bg-green-50 dark:bg-green-950',
  assignee_removed: 'text-red-600 bg-red-50 dark:bg-red-950',
  priority_changed: 'text-orange-600 bg-orange-50 dark:bg-orange-950',
  progress_updated: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950',
  timer_started: 'text-green-600 bg-green-50 dark:bg-green-950',
  timer_stopped: 'text-red-600 bg-red-50 dark:bg-red-950',
  subtask_completed: 'text-green-600 bg-green-50 dark:bg-green-950',
  subtask_uncompleted: 'text-gray-600 bg-gray-50 dark:bg-gray-900',
  completed: 'text-green-600 bg-green-50 dark:bg-green-950',
  commented: 'text-blue-600 bg-blue-50 dark:bg-blue-950',
  evidence_submitted: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950',
  evidence_approved: 'text-green-600 bg-green-50 dark:bg-green-950',
  evidence_rejected: 'text-red-600 bg-red-50 dark:bg-red-950',
};

export function ActivityTimeline({ activities = [], maxVisible = 5 }: ActivityTimelineProps) {
  const [showAll, setShowAll] = React.useState(false);
  
  // Sort activities by timestamp (newest first)
  const sortedActivities = React.useMemo(() => {
    return [...activities].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [activities]);
  
  const displayedActivities = showAll 
    ? sortedActivities 
    : sortedActivities.slice(0, maxVisible);
  
  const hasMore = sortedActivities.length > maxVisible;
  
  const formatTimestamp = (timestamp: string): string => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    
    return then.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-h5 font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Lịch sử hoạt động
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Chưa có hoạt động nào</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-h5 font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Lịch sử hoạt động
          <Badge variant="secondary" className="ml-auto">
            {sortedActivities.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timeline */}
        <div className="relative space-y-4">
          {displayedActivities.map((activity, idx) => {
            const Icon = actionIcons[activity.action];
            const colorClass = actionColors[activity.action];
            const isLast = idx === displayedActivities.length - 1;
            
            return (
              <div key={activity.id} className="relative flex gap-3 group">
                {/* Timeline line */}
                {!isLast && (
                  <div className="absolute left-[15px] top-8 bottom-0 w-[2px] bg-border" />
                )}
                
                {/* Icon */}
                <div className={cn(
                  "relative z-10 flex h-8 w-8 items-center justify-center rounded-full",
                  colorClass
                )}>
                  <Icon className="h-4 w-4" />
                </div>
                
                {/* Content */}
                <div className="flex-1 pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {activity.description || 'Hoạt động'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatTimestamp(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Details */}
                  {(activity.oldValue || activity.newValue) && (
                    <div className="mt-2 text-xs bg-muted/50 rounded p-2 space-y-1">
                      {activity.oldValue && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Từ:</span>
                          <Badge variant="outline" className="text-xs">
                            {activity.oldValue}
                          </Badge>
                        </div>
                      )}
                      {activity.newValue && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Thành:</span>
                          <Badge variant="outline" className="text-xs">
                            {activity.newValue}
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Show more/less button */}
        {hasMore && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
            className="w-full"
          >
            {showAll ? (
              <>
                <ChevronUp className="mr-2 h-4 w-4" />
                Thu gọn
              </>
            ) : (
              <>
                <ChevronDown className="mr-2 h-4 w-4" />
                Xem thêm {sortedActivities.length - maxVisible} hoạt động
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
