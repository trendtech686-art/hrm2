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
import type { ProductType, ProductCategory } from './types';

// ProductType Form Schema
const productTypeSchema = z.object({
  id: z.string().min(1, 'Mã loại sản phẩm là bắt buộc'),
  name: z.string().min(1, 'Tên loại sản phẩm là bắt buộc'),
  description: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export type ProductTypeFormValues = z.infer<typeof productTypeSchema>;

interface ProductTypeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: ProductType | null;
  onSubmit: (data: ProductTypeFormValues) => void;
  existingIds: string[];
}

export function ProductTypeFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  existingIds,
}: ProductTypeFormDialogProps) {
  const form = useForm<ProductTypeFormValues>({
    resolver: zodResolver(productTypeSchema),
    defaultValues: {
      id: initialData?.id || '',
      name: initialData?.name || '',
      description: initialData?.description || '',
      isDefault: initialData?.isDefault || false,
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        id: initialData?.id || '',
        name: initialData?.name || '',
        description: initialData?.description || '',
        isDefault: initialData?.isDefault || false,
      });
    }
  }, [open, initialData, form]);

  // Validate unique ID
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'id' && value.id) {
        const isDuplicate = existingIds.includes(value.id) && value.id !== initialData?.id;
        if (isDuplicate) {
          form.setError('id', { type: 'manual', message: 'Mã loại sản phẩm đã tồn tại' });
        } else {
          form.clearErrors('id');
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, existingIds, initialData]);

  const handleSubmit = (data: ProductTypeFormValues) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Chỉnh sửa loại sản phẩm' : 'Thêm loại sản phẩm mới'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form id="product-type-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã loại sản phẩm <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="VD: PT001" {...field} disabled={!!initialData} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên loại sản phẩm <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Hàng hóa" {...field} />
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
                    <Textarea
                      placeholder="Mô tả chi tiết về loại sản phẩm"
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Đặt làm mặc định</FormLabel>
                    <FormDescription>
                      Loại sản phẩm này sẽ được chọn mặc định khi tạo sản phẩm mới
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button type="submit" form="product-type-form">
            {initialData ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ProductCategory Form Schema
const productCategorySchema = z.object({
  id: z.string().min(1, 'Mã danh mục là bắt buộc'),
  name: z.string().min(1, 'Tên danh mục là bắt buộc'),
  description: z.string().optional(),
  parentId: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  sortOrder: z.number().optional(),
  isActive: z.boolean().optional(),
});

export type ProductCategoryFormValues = z.infer<typeof productCategorySchema>;

interface ProductCategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: ProductCategory | null;
  parentId?: string; // For adding child categories
  categories: ProductCategory[]; // All categories for parent selection
  onSubmit: (data: ProductCategoryFormValues) => void;
  existingIds: string[];
}

export function ProductCategoryFormDialog({
  open,
  onOpenChange,
  initialData,
  parentId,
  categories,
  onSubmit,
  existingIds,
}: ProductCategoryFormDialogProps) {
  const form = useForm<ProductCategoryFormValues>({
    resolver: zodResolver(productCategorySchema),
    defaultValues: {
      id: initialData?.id || '',
      name: initialData?.name || '',
      description: initialData?.description || '',
      parentId: initialData?.parentId || parentId || undefined,
      color: initialData?.color || '#3b82f6',
      icon: initialData?.icon || '',
      sortOrder: initialData?.sortOrder || 0,
      isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        id: initialData?.id || '',
        name: initialData?.name || '',
        description: initialData?.description || '',
        parentId: initialData?.parentId || parentId || undefined,
        color: initialData?.color || '#3b82f6',
        icon: initialData?.icon || '',
        sortOrder: initialData?.sortOrder || 0,
        isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
      });
    }
  }, [open, initialData, parentId, form]);

  // Validate unique ID
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'id' && value.id) {
        const isDuplicate = existingIds.includes(value.id) && value.id !== initialData?.id;
        if (isDuplicate) {
          form.setError('id', { type: 'manual', message: 'Mã danh mục đã tồn tại' });
        } else {
          form.clearErrors('id');
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form, existingIds, initialData]);

  const handleSubmit = (data: ProductCategoryFormValues) => {
    onSubmit(data);
    form.reset();
  };

  const colorOptions = [
    { value: '#3b82f6', label: 'Xanh dương' },
    { value: '#10b981', label: 'Xanh lá' },
    { value: '#f59e0b', label: 'Vàng' },
    { value: '#ef4444', label: 'Đỏ' },
    { value: '#8b5cf6', label: 'Tím' },
    { value: '#ec4899', label: 'Hồng' },
    { value: '#6366f1', label: 'Indigo' },
    { value: '#14b8a6', label: 'Xanh ngọc' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form id="product-category-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã danh mục <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="VD: CAT001" {...field} disabled={!!initialData} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sortOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thứ tự</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên danh mục <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Điện tử" {...field} className="h-9" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Danh mục cha</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value || undefined)}
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">-- Không có (Danh mục gốc) --</option>
                      {categories
                        .filter(c => c.systemId !== initialData?.systemId) // Can't be parent of itself
                        .map(cat => (
                          <option key={cat.systemId} value={cat.systemId}>
                            {cat.path || cat.name}
                          </option>
                        ))}
                    </select>
                  </FormControl>
                  <FormDescription>
                    Để trống nếu là danh mục gốc
                  </FormDescription>
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
                    <Textarea
                      placeholder="Mô tả chi tiết về danh mục"
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Màu sắc</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 flex-wrap">
                      {colorOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          className={`w-10 h-9 rounded-md border-2 transition-all ${
                            field.value === option.value
                              ? 'border-primary ring-2 ring-primary/20'
                              : 'border-border hover:border-primary/50'
                          }`}
                          style={{ backgroundColor: option.value }}
                          onClick={() => field.onChange(option.value)}
                          title={option.label}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Kích hoạt</FormLabel>
                    <FormDescription>
                      Danh mục này sẽ hiển thị trong danh sách lựa chọn
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button type="submit" form="product-category-form">
            {initialData ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
