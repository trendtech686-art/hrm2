/**
 * QuickAddOtherRecipientDialog - Dialog for adding custom recipient (Đối tượng khác)
 */

'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';

interface QuickAddOtherRecipientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (name: string) => void;
}

export function QuickAddOtherRecipientDialog({
  open,
  onOpenChange,
  onSuccess,
}: QuickAddOtherRecipientDialogProps) {
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Auto-focus when dialog opens
  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      setName('');
      setError('');
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Vui lòng nhập tên người nhận');
      return;
    }
    
    onSuccess(name.trim());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-100">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Thêm đối tượng khác</DialogTitle>
            <DialogDescription>
              Nhập tên người nhận/chi cho đối tượng không có trong danh sách
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="recipient-name">
                Tên người nhận <span className="text-red-500">*</span>
              </Label>
              <Input
                id="recipient-name"
                ref={inputRef}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder="Nhập tên người nhận..."
                className={error ? 'border-red-500' : ''}
              />
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit">
              Xác nhận
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
