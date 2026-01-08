'use client'

import * as React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Province, Ward } from '@/lib/types/prisma-extended';

export type ImportPreviewState = {
  provinces: Array<Omit<Province, 'systemId'>>;
  wards: Array<Omit<Ward, 'systemId'>>;
  summary: { provinceCount: number; wardCount: number };
};

interface ImportPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preview: ImportPreviewState | null;
  isImporting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ImportPreviewDialog({
  open,
  onOpenChange,
  preview,
  isImporting,
  onConfirm,
  onCancel,
}: ImportPreviewDialogProps) {
  if (!preview) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => {
      if (!o && !isImporting) {
        onCancel();
      } else {
        onOpenChange(o);
      }
    }}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Xác nhận ghi đè dữ liệu địa giới</DialogTitle>
          <DialogDescription>
            File mới sẽ thay thế toàn bộ danh sách tỉnh/thành và phường/xã (2 cấp).
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="rounded-md border border-dashed bg-muted/40 p-4 text-sm">
            <p className="font-medium">Tóm tắt</p>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>• {preview.summary.provinceCount} tỉnh/thành phố</li>
              <li>• {preview.summary.wardCount} phường/xã</li>
            </ul>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-md border p-3">
              <p className="text-sm font-medium">Danh sách tỉnh/thành</p>
              <ScrollArea className="mt-2 h-40">
                <ul className="divide-y text-sm">
                  {preview.provinces.slice(0, 12).map((p) => (
                    <li key={p.id} className="flex items-center justify-between py-1.5">
                      <span>{p.name}</span>
                      <span className="font-mono text-xs text-muted-foreground">{p.id}</span>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
            
            <div className="rounded-md border p-3">
              <p className="text-sm font-medium">Một số phường/xã</p>
              <ScrollArea className="mt-2 h-40">
                <ul className="divide-y text-sm">
                  {preview.wards.slice(0, 12).map((w, i) => (
                    <li key={`${w.provinceId}-${w.id}-${i}`} className="py-1.5">
                      <div className="flex items-center justify-between">
                        <span>{w.name}</span>
                        <span className="font-mono text-xs text-muted-foreground">{w.id}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Thuộc: {w.provinceName}</p>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            className="h-9"
            onClick={onCancel}
            disabled={isImporting}
          >
            Hủy
          </Button>
          <Button
            className="h-9"
            onClick={onConfirm}
            disabled={isImporting}
          >
            {isImporting ? 'Đang ghi...' : 'Xác nhận'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
