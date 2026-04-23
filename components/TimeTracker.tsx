import * as React from 'react';
import { Card } from './ui/card';
import { Clock, Zap, Timer, CalendarClock } from 'lucide-react';
import { cn } from '../lib/utils';

interface TimeTrackerProps {
  _taskId: string;
  isRunning: boolean;
  totalSeconds: number;
  estimatedHours?: number | undefined;
  startedAt?: string;
  createdAt?: string;
}

const formatTime = (seconds: number): string => {
  if (seconds < 0) seconds = 0;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const formatDuration = (seconds: number): string => {
  if (seconds < 0) seconds = 0;
  if (seconds < 60) return `${seconds} giây`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} phút`;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return m > 0 ? `${h}h ${m}p` : `${h}h`;
};

export function TimeTracker({
  _taskId,
  isRunning,
  totalSeconds,
  estimatedHours,
  startedAt,
  createdAt,
}: TimeTrackerProps) {
  const [tick, setTick] = React.useState(0);

  // Tick every second when running
  React.useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  // Response time: createdAt → startedAt (fixed once started)
  const responseSeconds = React.useMemo(() => {
    if (!createdAt || !startedAt) return null;
    return Math.max(0, Math.floor((new Date(startedAt).getTime() - new Date(createdAt).getTime()) / 1000));
  }, [createdAt, startedAt]);

  // Working time: startedAt → now (live) or totalSeconds (stopped)
  const workingSeconds = React.useMemo(() => {
    if (isRunning && startedAt) {
      const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
      return totalSeconds + Math.max(0, elapsed);
    }
    return totalSeconds;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, startedAt, totalSeconds, tick]);

  // Total time: createdAt → now (live while not completed)
  const totalElapsedSeconds = React.useMemo(() => {
    if (!createdAt) return null;
    if (!isRunning && totalSeconds > 0 && responseSeconds !== null) {
      // Task completed: response + working
      return responseSeconds + totalSeconds;
    }
    // Still ongoing
    return Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdAt, isRunning, totalSeconds, responseSeconds, tick]);

  const workingHours = (workingSeconds / 3600).toFixed(2);
  const isOverEstimate = estimatedHours && parseFloat(workingHours) > estimatedHours;

  return (
    <Card className="p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className={cn(
            "h-4 w-4",
            isRunning ? "text-success animate-pulse" : "text-muted-foreground"
          )} />
          <span className="text-sm font-semibold">Thời gian</span>
        </div>
        {isRunning && (
          <div className="flex items-center gap-1.5 text-xs bg-success/10 text-success-foreground px-2 py-1 rounded-full">
            <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
            Đang đếm
          </div>
        )}
      </div>

      {/* 3 metric rows */}
      <div className="grid gap-2">
        {/* Response time: assigned → started */}
        {responseSeconds !== null && (
          <div className="flex items-center justify-between py-1.5 px-3 rounded-md bg-info/10">
            <div className="flex items-center gap-2 text-xs text-info-foreground">
              <Zap className="h-3.5 w-3.5" />
              <span>Phản hồi</span>
            </div>
            <span className="text-xs font-medium tabular-nums text-info-foreground">
              {formatDuration(responseSeconds)}
            </span>
          </div>
        )}

        {/* Working time: started → now/completed */}
        <div className={cn(
          "flex items-center justify-between py-1.5 px-3 rounded-md",
          isRunning ? "bg-success/10" : "bg-muted/50"
        )}>
          <div className={cn(
            "flex items-center gap-2 text-xs",
            isRunning ? "text-success-foreground" : "text-muted-foreground"
          )}>
            <Timer className="h-3.5 w-3.5" />
            <span>Thực hiện</span>
          </div>
          <div className="text-right">
            <span className={cn(
              "text-sm font-bold tabular-nums",
              isRunning && "text-success-foreground",
              isOverEstimate && "text-destructive"
            )}>
              {formatTime(workingSeconds)}
            </span>
            {estimatedHours && (
              <div className={cn(
                "text-xs text-muted-foreground",
                isOverEstimate && "text-destructive font-medium"
              )}>
                {workingHours}h / {estimatedHours}h
                {isOverEstimate && ' ⚠️'}
              </div>
            )}
          </div>
        </div>

        {/* Total time: assigned → now/completed */}
        {totalElapsedSeconds !== null && (
          <div className="flex items-center justify-between py-1.5 px-3 rounded-md bg-muted/30">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarClock className="h-3.5 w-3.5" />
              <span>Tổng</span>
            </div>
            <span className="text-xs font-medium tabular-nums text-muted-foreground">
              {formatDuration(totalElapsedSeconds)}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
