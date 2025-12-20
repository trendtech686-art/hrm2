/**
 * PkgxBulkSyncConfirmDialog - Shared confirmation dialog for bulk PKGX sync actions
 */

import * as React from 'react';
import { Loader2 } from 'lucide-react';
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
  
  return (
    <AlertDialog 
      open={confirmAction.open || progress.isRunning} 
      onOpenChange={(open) => !open && !progress.isRunning && onCancel()}
    >
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {progress.isRunning ? 'Đang đồng bộ...' : confirmAction.title}
          </AlertDialogTitle>
          <AlertDialogDescription className="whitespace-pre-line">
            {progress.isRunning ? (
              <div className="space-y-3 pt-2">
                <Progress value={progressPercent} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span>{progress.completed}/{progress.total}</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-600">✓ {progress.success}</span>
                  {progress.error > 0 && (
                    <span className="text-red-600">✗ {progress.error}</span>
                  )}
                </div>
              </div>
            ) : (
              confirmAction.description
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {!progress.isRunning && (
            <>
              <AlertDialogCancel onClick={(e) => { e.stopPropagation(); onCancel(); }}>
                Hủy
              </AlertDialogCancel>
              <AlertDialogAction onClick={(e) => { e.stopPropagation(); onConfirm(); }}>
                Xác nhận ({confirmAction.itemCount})
              </AlertDialogAction>
            </>
          )}
          {progress.isRunning && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Đang xử lý...</span>
            </div>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
