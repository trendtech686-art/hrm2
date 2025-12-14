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
} from '../../../components/ui/alert-dialog';
import type { Customer } from '../types';

export interface BulkActionConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  customers: Customer[];
  onConfirm: () => void;
  onCancel: () => void;
}

export function BulkActionConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Xác nhận',
  customers,
  onConfirm,
  onCancel,
}: BulkActionConfirmDialogProps) {
  const previewCustomers = customers.slice(0, 3);

  return (
    <AlertDialog open={open} onOpenChange={(value) => !value && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
            {previewCustomers.length > 0 && (
              <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                {previewCustomers.map((customer) => (
                  <li key={customer.systemId}>• {customer.name} ({customer.id})</li>
                ))}
                {customers.length > previewCustomers.length && (
                  <li className="text-xs">+ {customers.length - previewCustomers.length} khách hàng khác</li>
                )}
              </ul>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{confirmLabel}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
