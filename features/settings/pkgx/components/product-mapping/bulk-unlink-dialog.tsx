'use client';

import * as React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../../../../components/ui/alert-dialog';
import type { BulkUnlinkDialogProps } from './types';

// ========================================
// Bulk Unlink Dialog Component
// ========================================

export function BulkUnlinkDialog({
  open,
  onOpenChange,
  selectedCount,
  onConfirmBulkUnlink,
}: BulkUnlinkDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hủy liên kết {selectedCount} sản phẩm?</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc muốn hủy liên kết {selectedCount} sản phẩm đã chọn với HRM? 
            Hành động này sẽ xóa liên kết giữa sản phẩm PKGX và HRM, không xóa dữ liệu sản phẩm.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirmBulkUnlink} 
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Xác nhận hủy liên kết
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
