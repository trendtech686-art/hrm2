import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Button } from '../../../components/ui/button';
import { Textarea } from '../../../components/ui/textarea';
import { Switch } from '../../../components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { CurrencyInput } from '../../../components/ui/currency-input';
import {
  customerTypeSchema,
  customerGroupSchema,
  customerSourceSchema,
  paymentTermSchema,
  creditRatingSchema,
  type CustomerTypeFormData,
  type CustomerGroupFormData,
  type CustomerSourceFormData,
  type PaymentTermFormData,
  type CreditRatingFormData,
} from './validation';
import type {
  CustomerType,
  CustomerGroup,
  CustomerSource,
  PaymentTerm,
  CreditRating,
} from './types';

// Base props interface
interface BaseFormDialogProps<T> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: T | null;
  onSubmit: (data: any) => void;
  existingIds: string[];
}

// Customer Type Form Dialog
export function CustomerTypeFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  existingIds,
}: BaseFormDialogProps<CustomerType>) {
  const isEdit = !!initialData;

  const form = useForm<CustomerTypeFormData>({
    resolver: zodResolver(customerTypeSchema) as any,
    defaultValues: initialData as any || {
      id: '',
      name: '',
      description: '',
      isActive: true,
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset((initialData as any) || {
        id: '',
        name: '',
        description: '',
        isActive: true,
      });
    }
  }, [open, initialData]);

  const handleSubmit = (values: CustomerTypeFormData) => {
    // Validate unique ID
    if (!isEdit || values.id !== initialData?.id) {
      if (existingIds.includes(values.id)) {
        form.setError('id', { type: 'manual', message: `Mã ${values.id} đã tồn tại!` });
        return;
      }
    }
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Chỉnh sửa' : 'Thêm mới'} Loại khách hàng</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã loại khách hàng <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="VD: CT001" {...field} />
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
                  <FormLabel>Tên <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Cá nhân" {...field} />
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
                    <Textarea placeholder="Mô tả chi tiết..." {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Trạng thái</FormLabel>
                    <FormDescription>Bật để cho phép sử dụng</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit">{isEdit ? 'Cập nhật' : 'Thêm mới'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// Customer Group Form Dialog
// ============================================
export function CustomerGroupFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  existingIds,
}: BaseFormDialogProps<CustomerGroup>) {
  const isEdit = !!initialData;

  const form = useForm<CustomerGroupFormData>({
    resolver: zodResolver(customerGroupSchema) as any,
    defaultValues: initialData as any || {
      id: '',
      name: '',
      description: '',
      color: '#3b82f6',
      isActive: true,
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset((initialData as any) || {
        id: '',
        name: '',
        description: '',
        color: '#3b82f6',
        isActive: true,
      });
    }
  }, [open, initialData]);

  const handleSubmit = (values: CustomerGroupFormData) => {
    if (!isEdit || values.id !== initialData?.id) {
      if (existingIds.includes(values.id)) {
        form.setError('id', { type: 'manual', message: `Mã ${values.id} đã tồn tại!` });
        return;
      }
    }
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Chỉnh sửa' : 'Thêm mới'} Nhóm khách hàng</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã nhóm <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="VD: VIP001" {...field} />
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
                  <FormLabel>Tên <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Khách hàng VIP" {...field} />
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
                  <FormLabel>Màu nhóm</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 items-center">
                      <Input type="color" className="w-20 h-9" {...field} />
                      <Input type="text" placeholder="#3b82f6" {...field} />
                    </div>
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
                    <Textarea placeholder="Mô tả chi tiết..." {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Trạng thái</FormLabel>
                    <FormDescription>Bật để cho phép sử dụng</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit">{isEdit ? 'Cập nhật' : 'Thêm mới'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// Customer Source Form Dialog
// ============================================
export function CustomerSourceFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  existingIds,
}: BaseFormDialogProps<CustomerSource>) {
  const isEdit = !!initialData;

  const form = useForm<CustomerSourceFormData>({
    resolver: zodResolver(customerSourceSchema) as any,
    defaultValues: initialData as any || {
      id: '',
      name: '',
      description: '',
      type: 'Online',
      isActive: true,
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset((initialData as any) || {
        id: '',
        name: '',
        description: '',
        type: 'Online',
        isActive: true,
      });
    }
  }, [open, initialData]);

  const handleSubmit = (values: CustomerSourceFormData) => {
    if (!isEdit || values.id !== initialData?.id) {
      if (existingIds.includes(values.id)) {
        form.setError('id', { type: 'manual', message: `Mã ${values.id} đã tồn tại!` });
        return;
      }
    }
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Chỉnh sửa' : 'Thêm mới'} Nguồn khách hàng</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã nguồn <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="VD: FB001" {...field} />
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
                  <FormLabel>Tên <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Facebook" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại nguồn</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại nguồn" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Online">Online</SelectItem>
                      <SelectItem value="Offline">Offline</SelectItem>
                      <SelectItem value="Referral">Giới thiệu</SelectItem>
                      <SelectItem value="Other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <Textarea placeholder="Mô tả chi tiết..." {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Trạng thái</FormLabel>
                    <FormDescription>Bật để cho phép sử dụng</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit">{isEdit ? 'Cập nhật' : 'Thêm mới'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// Payment Term Form Dialog
// ============================================
export function PaymentTermFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  existingIds,
}: BaseFormDialogProps<PaymentTerm>) {
  const isEdit = !!initialData;

  const form = useForm<PaymentTermFormData>({
    resolver: zodResolver(paymentTermSchema) as any,
    defaultValues: initialData as any || {
      id: '',
      name: '',
      description: '',
      days: 0,
      isDefault: false,
      isActive: true,
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset((initialData as any) || {
        id: '',
        name: '',
        description: '',
        days: 0,
        isDefault: false,
        isActive: true,
      });
    }
  }, [open, initialData]);

  const handleSubmit = (values: PaymentTermFormData) => {
    if (!isEdit || values.id !== initialData?.id) {
      if (existingIds.includes(values.id)) {
        form.setError('id', { type: 'manual', message: `Mã ${values.id} đã tồn tại!` });
        return;
      }
    }
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Chỉnh sửa' : 'Thêm mới'} Hạn thanh toán</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã hạn thanh toán <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="VD: NET30" {...field} />
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
                  <FormLabel>Tên <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Thanh toán trong 30 ngày" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số ngày <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="VD: 30"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>Số ngày khách hàng được phép trả chậm</FormDescription>
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
                    <Textarea placeholder="Mô tả chi tiết..." {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Mặc định</FormLabel>
                    <FormDescription>Tự động chọn khi tạo đơn hàng mới</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Trạng thái</FormLabel>
                    <FormDescription>Bật để cho phép sử dụng</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit">{isEdit ? 'Cập nhật' : 'Thêm mới'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// Credit Rating Form Dialog
// ============================================
export function CreditRatingFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  existingIds,
}: BaseFormDialogProps<CreditRating>) {
  const isEdit = !!initialData;

  const form = useForm<CreditRatingFormData>({
    resolver: zodResolver(creditRatingSchema) as any,
    defaultValues: initialData as any || {
      id: '',
      name: '',
      description: '',
      level: 5,
      maxCreditLimit: 0,
      color: '#3b82f6',
      isActive: true,
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset((initialData as any) || {
        id: '',
        name: '',
        description: '',
        level: 5,
        maxCreditLimit: 0,
        color: '#3b82f6',
        isActive: true,
      });
    }
  }, [open, initialData]);

  const handleSubmit = (values: CreditRatingFormData) => {
    if (!isEdit || values.id !== initialData?.id) {
      if (existingIds.includes(values.id)) {
        form.setError('id', { type: 'manual', message: `Mã ${values.id} đã tồn tại!` });
        return;
      }
    }
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Chỉnh sửa' : 'Thêm mới'} Xếp hạng tín dụng</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã xếp hạng <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="VD: AAA" {...field} />
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
                  <FormLabel>Tên <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="VD: Xuất sắc" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cấp độ (1-10) <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        placeholder="VD: 10"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormDescription>1 = Thấp nhất, 10 = Cao nhất</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Màu hiển thị</FormLabel>
                    <FormControl>
                      <div className="flex gap-2 items-center">
                        <Input type="color" className="w-20 h-9" {...field} />
                        <Input type="text" placeholder="#3b82f6" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="maxCreditLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hạn mức tín dụng tối đa</FormLabel>
                  <FormControl>
                    <CurrencyInput
                      placeholder="VD: 100,000,000"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>Số tiền tối đa khách hàng được phép nợ</FormDescription>
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
                    <Textarea placeholder="Mô tả chi tiết..." {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Trạng thái</FormLabel>
                    <FormDescription>Bật để cho phép sử dụng</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit">{isEdit ? 'Cập nhật' : 'Thêm mới'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
