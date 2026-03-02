/**
 * PkgxBulkSyncConfirmDialog - Shared confirmation dialog for bulk PKGX sync actions
 */

import * as React from 'react';
import { Loader2, CheckCircle2, XCircle, CloudUpload } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../../components/ui/alert-dialog';
import { Progress } from '../../../../components/ui/progress';
import { cn } from '../../../../lib/utils';
import type { BulkConfirmState, BulkSyncProgress } from '../hooks/use-pkgx-bulk-sync';

interface PkgxBulkSyncConfirmDialogProps {
  confirmAction: BulkConfirmState;
  progress: BulkSyncProgress;
  onConfirm: () => void;
  onCancel: () => void;
}

export function PkgxBulkSyncConfirmDialog({
  confirmAction,
  progress,
  onConfirm,
  onCancel,
}: PkgxBulkSyncConfirmDialogProps) {
  const progressPercent = progress.total > 0 
    ? Math.round((progress.completed / progress.total) * 100) 
    : 0;
  
  const isComplete = progress.completed === progress.total && progress.total > 0;
  
  return (
    <AlertDialog 
      open={confirmAction.open || progress.isRunning} 
      onOpenChange={(open) => !open && !progress.isRunning && onCancel()}
    >
      <AlertDialogContent className="sm:max-w-md" onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader className="text-center sm:text-center">
          {progress.isRunning ? (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                {isComplete ? (
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                ) : (
                  <CloudUpload className="h-8 w-8 text-primary animate-pulse" />
                )}
              </div>
              <AlertDialogTitle className="text-xl">
                {isComplete ? 'Hoàn tất đồng bộ' : 'Đang đồng bộ...'}
              </AlertDialogTitle>
              <div className="space-y-4 pt-4">
                <Progress value={progressPercent} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span className="font-medium">{progress.completed} / {progress.total}</span>
                  <span className="font-medium">{progressPercent}%</span>
                </div>
                <div className="flex justify-center gap-6 text-sm font-medium">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-green-600">{progress.success} thành công</span>
                  </div>
                  {progress.error > 0 && (
                    <div className="flex items-center gap-1.5">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="text-red-600">{progress.error} lỗi</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CloudUpload className="h-8 w-8 text-primary" />
              </div>
              <AlertDialogTitle className="text-xl">{confirmAction.title}</AlertDialogTitle>
              <AlertDialogDescription className="whitespace-pre-line text-center pt-2">
                {confirmAction.description}
              </AlertDialogDescription>
            </>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter className={cn(
          "sm:justify-center gap-2 pt-4",
          progress.isRunning && "sm:justify-center"
        )}>
          {!progress.isRunning && (
            <>
              <AlertDialogCancel 
                onClick={(e) => { e.stopPropagation(); onCancel(); }}
                className="sm:w-32"
              >
                Hủy
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={(e) => { e.stopPropagation(); onConfirm(); }}
                className="sm:w-32"
              >
                Xác nhận ({confirmAction.itemCount})
              </AlertDialogAction>
            </>
          )}
          {progress.isRunning && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground py-2">
              {isComplete ? (
                <span className="text-sm font-medium text-primary">Đang hoàn tất...</span>
              ) : (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Đang xử lý, vui lòng chờ...</span>
                </>
              )}
            </div>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
