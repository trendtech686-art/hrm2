'use client';

import * as React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/format-utils';
import type { CancelPODialogState, ReceiveDialogState } from '../hooks/use-po-page-handlers';
import type { Branch } from '@/lib/types/prisma-extended';

interface CancelDialogProps {
  state: CancelPODialogState;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onClose: () => void;
}

export function POCancelDialog({ state, onOpenChange, onConfirm, onClose }: CancelDialogProps) {
  return (
    <AlertDialog open={state.isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắn muốn hủy đơn hàng này?</AlertDialogTitle>
          <AlertDialogDescription>
            {state.willCreateReturn ? (
              <>
                Đơn hàng này đã có sản phẩm được nhập kho. Hủy đơn sẽ tự động tạo một <strong>Phiếu Xuất trả hàng</strong> cho các sản phẩm đã nhận.
                {state.totalPaid && state.totalPaid > 0 ? (
                  ` Đồng thời, một Phiếu Thu hoàn tiền ${formatCurrency(state.totalPaid)} sẽ được tạo.`
                ) : ''}
                {' '}Hành động này không thể hoàn tác.
              </>
            ) : state.totalPaid && state.totalPaid > 0 ? (
              <>
                Đơn hàng này đã được thanh toán <strong>{formatCurrency(state.totalPaid)}</strong>. 
                Việc hủy đơn sẽ tự động tạo một <strong>Phiếu Thu</strong> ghi nhận khoản tiền này là "Nhà cung cấp cần hoàn lại". 
                Hành động này không thể hoàn tác.
              </>
            ) : (
              'Hành động này sẽ chuyển trạng thái đơn hàng thành "Đã hủy" và không thể hoàn tác.'
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="h-9" onClick={onClose}>Thoát</AlertDialogCancel>
          <AlertDialogAction className="h-9" onClick={onConfirm}>Xác nhận hủy</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface BulkPayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  numSelected: number;
  onConfirm: () => void;
}

export function POBulkPayDialog({ open, onOpenChange, numSelected, onConfirm }: BulkPayDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận thanh toán?</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn thanh toán toàn bộ cho {numSelected} đơn hàng đã chọn không?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="h-9">Hủy</AlertDialogCancel>
          <AlertDialogAction className="h-9" onClick={onConfirm}>Xác nhận</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface ReceiveDialogProps {
  state: ReceiveDialogState;
  branches: Branch[];
  pendingQueueLength: number;
  isSubmitting: boolean;
  hasValidQuantity: boolean;
  _onOpenChange?: (open: boolean) => void;
  onClose: () => void;
  onFieldChange: (field: 'documentCode' | 'receivedDate' | 'warehouseName' | 'notes', value: string) => void;
  onBranchChange: (branchId: string) => void;
  onQuantityChange: (productSystemId: string, quantity: number) => void;
  onSubmit: () => void;
}

export function POReceiveDialog({
  state,
  branches,
  pendingQueueLength,
  isSubmitting,
  hasValidQuantity,
  onClose,
  onFieldChange,
  onBranchChange,
  onQuantityChange,
  onSubmit,
}: ReceiveDialogProps) {
  return (
    <Dialog open={state.isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent mobileFullScreen className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Nhập hàng cho {state.purchaseOrder?.id || 'đơn hàng'}</DialogTitle>
          <DialogDescription>
            Chọn chi nhánh, kho nhận và nhập số lượng thực nhận cho từng sản phẩm theo guideline dual ID.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {pendingQueueLength > 0 && (
            <div className="rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700 dark:bg-blue-950/50 dark:text-blue-300">
              Còn {pendingQueueLength} đơn trong hàng đợi sẽ được mở tiếp sau khi lưu phiếu này.
            </div>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Mã phiếu nhập</Label>
              <Input
                placeholder="Ví dụ: PNK000123"
                className="h-9"
                value={state.documentCode}
                onChange={(e) => onFieldChange('documentCode', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Ngày nhận hàng</Label>
              <Input
                type="datetime-local"
                className="h-9"
                value={state.receivedDate}
                onChange={(e) => onFieldChange('receivedDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Chi nhánh nhận</Label>
              <Select value={state.targetBranchSystemId || undefined} onValueChange={onBranchChange}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Chọn chi nhánh" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map(branch => (
                    <SelectItem key={branch.systemId} value={branch.systemId}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Kho nhận</Label>
              <Input
                placeholder="Kho chính, Kho lẻ..."
                className="h-9"
                value={state.warehouseName}
                onChange={(e) => onFieldChange('warehouseName', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Ghi chú</Label>
            <Textarea
              placeholder="Ví dụ: Nhập đợt 1, bao gồm phiếu vận chuyển số..."
              value={state.notes}
              onChange={(e) => onFieldChange('notes', e.target.value)}
            />
          </div>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Số lượng đặt</TableHead>
                  <TableHead>Còn lại</TableHead>
                  <TableHead className="w-48">Nhập lần này</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {state.items.map(item => (
                  <TableRow key={item.productSystemId}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{item.productName}</span>
                        <span className="text-xs text-muted-foreground">{item.productId}</span>
                      </div>
                    </TableCell>
                    <TableCell>{item.orderedQuantity}</TableCell>
                    <TableCell>{item.remainingQuantity}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min={0}
                        max={item.remainingQuantity}
                        className="h-9"
                        value={item.receiveQuantity}
                        onChange={(e) => onQuantityChange(item.productSystemId, Number(e.target.value))}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {state.items.length === 0 && (
              <p className="p-4 text-sm text-muted-foreground">Tất cả sản phẩm trong đơn này đã được nhập đủ.</p>
            )}
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" className="h-9" onClick={onClose} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button
            type="button"
            className="h-9"
            onClick={onSubmit}
            disabled={isSubmitting || !hasValidQuantity || !state.targetBranchSystemId}
          >
            {isSubmitting
              ? 'Đang lưu...'
              : pendingQueueLength > 0
                ? 'Lưu & chuyển đơn tiếp theo'
                : 'Lưu phiếu nhập'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
