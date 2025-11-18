import * as React from 'react';
import { useForm } from 'react-hook-form';
import type { Branch } from '../types.ts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../../components/ui/dialog.tsx';
import { Button } from '../../../../components/ui/button.tsx';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../../components/ui/form.tsx';
import { Input } from '../../../../components/ui/input.tsx';

type FormValues = {
  phone: string;
  address: string;
};

interface BranchAddressDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  branch: Branch | null;
  onSave: (branchId: string, values: FormValues) => void;
}

export function BranchAddressDialog({ isOpen, onOpenChange, branch, onSave }: BranchAddressDialogProps) {
  const form = useForm<FormValues>();

  React.useEffect(() => {
    if (branch) {
      form.reset({
        phone: branch.phone,
        address: branch.address,
      });
    }
  }, [branch, form]);

  const handleSubmit = (values: FormValues) => {
    if (branch) {
      onSave(branch.systemId, values);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sửa địa chỉ lấy hàng</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form id="branch-address-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ lấy hàng</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button form="branch-address-form" type="submit">Lưu thay đổi</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
