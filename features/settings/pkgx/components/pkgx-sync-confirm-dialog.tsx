import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../../../components/ui/alert-dialog.tsx';
import type { ConfirmActionState } from '../hooks/use-pkgx-entity-sync';

interface PkgxSyncConfirmDialogProps {
  confirmAction: ConfirmActionState;
  isSyncing: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Shared confirmation dialog for PKGX sync actions
 * Used by category-mapping-tab, brand-mapping-tab, product-mapping-tab
 */
export function PkgxSyncConfirmDialog({
  confirmAction,
  isSyncing,
  onConfirm,
  onCancel,
}: PkgxSyncConfirmDialogProps) {
  return (
    <AlertDialog open={confirmAction.open} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{confirmAction.title}</AlertDialogTitle>
          <AlertDialogDescription>{confirmAction.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isSyncing}>
            {isSyncing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Xác nhận
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
