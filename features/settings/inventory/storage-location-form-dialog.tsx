import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../components/ui/form';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Button } from '../../../components/ui/button';
import { Checkbox } from '../../../components/ui/checkbox';
import type { StorageLocation } from './storage-location-types';

// StorageLocation Form Schema
const storageLocationSchema = z.object({
  id: z.string().min(1, 'Mã điểm lưu kho là bắt buộc'),
  name: z.string().min(1, 'Tên điểm lưu kho là bắt buộc'),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type StorageLocationFormValues = z.infer<typeof storageLocationSchema>;

interface StorageLocationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: StorageLocation | null;
  onSubmit: (data: StorageLocationFormValues) => void;
  existingIds: string[];
}

export function StorageLocationFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  existingIds,
}: StorageLocationFormDialogProps) {
  const form = useForm<StorageLocationFormValues>({
    resolver: zodResolver(storageLocationSchema),
    defaultValues: {
      id: initialData?.id || '',
      name: initialData?.name || '',
      description: initialData?.description || '',
      isActive: initialData?.isActive ?? true,
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        id: initialData?.id || '',
        name: initialData?.name || '',
        description: initialData?.description || '',
        isActive: initialData?.isActive ?? true,
      });
    }
  }, [open, initialData, form]);

  // Validate unique ID
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'id' && value.id) {
        const isDuplicate = existingIds.includes(value.id) && value.id !== initialData?.id;
        if (isDuplicate) {
          form.setError('id', { type: 'manual', message: 'Mã điểm lưu kho đã tồn tại' });
        } else {
          form.clearErrors('id');
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, existingIds, initialData]);

  const handleSubmit = (data: StorageLocationFormValues) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Chỉnh sửa điểm lưu kho' : 'Thêm điểm lưu kho mới'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã điểm lưu kho <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} placeholder="VD: KHO-A" className="h-9" />
                  </FormControl>
                  <FormDescription>
                    Chỉ chứa chữ in hoa và số, tối đa 20 ký tự
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên điểm lưu kho <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} placeholder="VD: Kho A" className="h-9" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value ?? ''} placeholder="Mô tả chi tiết..." rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="!mt-0 cursor-pointer">
                    Kích hoạt
                  </FormLabel>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Thoát
              </Button>
              <Button type="submit">
                Xác nhận
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
