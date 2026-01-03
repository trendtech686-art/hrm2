'use client';

import * as React from 'react';
import { Button } from '../../../../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../../../../components/ui/dialog';
import { Unlink } from 'lucide-react';
import type { UnlinkDialogProps } from './types';

// ========================================
// Unlink Dialog Component
// ========================================

export function UnlinkDialog({
  open,
  onOpenChange,
  productToUnlink,
  onConfirmUnlink,
}: UnlinkDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xác nhận hủy liên kết</DialogTitle>
          <DialogDescription>
            Bạn có chắc muốn hủy liên kết sản phẩm này?
          </DialogDescription>
        </DialogHeader>
        
        {productToUnlink && (
          <div className="space-y-2 py-4">
            <p className="text-sm">
              <span className="font-medium">PKGX:</span> {productToUnlink.pkgxProduct.goods_name}
            </p>
            <p className="text-sm">
              <span className="font-medium">HRM:</span> {productToUnlink.hrmProduct.name}
            </p>
            <p className="text-sm text-muted-foreground">
              Sau khi hủy, sản phẩm sẽ không còn được đồng bộ với PKGX.
            </p>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={onConfirmUnlink}>
            <Unlink className="h-4 w-4 mr-2" />
            Hủy liên kết
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
