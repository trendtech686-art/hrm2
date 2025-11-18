import * as React from 'react';
import { Card } from './ui/card.tsx';
import { Clock } from 'lucide-react';
import { cn } from '../lib/utils.ts';

interface TimeTrackerProps {
  taskId: string;
  isRunning: boolean;
  totalSeconds: number;
  estimatedHours?: number;
}

/**
 * TimeTracker - Read-only display component
 * Timer tự động bắt đầu khi status = "Đang thực hiện"
 * Timer tự động dừng khi hoàn thành hết subtasks
 */
export function TimeTracker({
  taskId,
  isRunning,
  totalSeconds,
  estimatedHours,
}: TimeTrackerProps) {
  const [currentSeconds, setCurrentSeconds] = React.useState(totalSeconds);

  // Update when totalSeconds changes
  React.useEffect(() => {
    setCurrentSeconds(totalSeconds);
  }, [totalSeconds]);

  // Timer tick effect
  React.useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setCurrentSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const actualHours = (currentSeconds / 3600).toFixed(2);
  const isOverEstimate = estimatedHours && parseFloat(actualHours) > estimatedHours;

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <Clock className={cn(
          "h-5 w-5",
          isRunning ? "text-green-600 animate-pulse" : "text-muted-foreground"
        )} />
        <div className="flex-1">
          <div className="text-sm font-medium">Thời gian làm việc</div>
          <div className={cn(
            "text-2xl font-bold tabular-nums",
            isOverEstimate && "text-destructive"
          )}>
            {formatTime(currentSeconds)}
          </div>
          <div className="text-sm text-muted-foreground">
            {actualHours}h thực tế
            {estimatedHours && (
              <span className={isOverEstimate ? "text-destructive font-semibold" : ""}>
                {' '}/ {estimatedHours}h ước tính
                {isOverEstimate && ' ⚠️'}
              </span>
            )}
          </div>
        </div>
        {isRunning && (
          <div className="text-xs bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 px-3 py-2 rounded flex items-center gap-2">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
            <span className="font-medium">Đang đếm giờ</span>
          </div>
        )}
      </div>
    </Card>
  );
}
