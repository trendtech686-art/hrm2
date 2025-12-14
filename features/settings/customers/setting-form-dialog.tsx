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
import { usePricingPolicyStore } from '../pricing/store';
import {
  customerTypeSchema,
  customerGroupSchema,
  customerSourceSchema,
  paymentTermSchema,
  creditRatingSchema,
  lifecycleStageSchema,
  customerSlaSettingSchema,
  type CustomerTypeFormData,
  type CustomerGroupFormData,
  type CustomerSourceFormData,
  type PaymentTermFormData,
  type CreditRatingFormData,
  type LifecycleStageFormData,
  type CustomerSlaSettingFormData,
} from './validation';
import type {
  CustomerType,
  CustomerGroup,
  CustomerSource,
  PaymentTerm,
  CreditRating,
  LifecycleStage,
  CustomerSlaSetting,
} from './types';
import { SLA_TYPE_LABELS } from './sla-settings-data';

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
        isDefault: false,
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
                    <Input placeholder="VD: CT001" {...field} value={field.value ?? ''} />
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
                    <Input placeholder="VD: Cá nhân" {...field} value={field.value ?? ''} />
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
                    <Textarea placeholder="Mô tả chi tiết..." {...field} value={field.value ?? ''} rows={3} />
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
                    <FormDescription>Tự động chọn khi tạo khách hàng mới</FormDescription>
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
  const { getActive: getActivePriceLists } = usePricingPolicyStore();
  const activePriceLists = getActivePriceLists();

  const form = useForm<CustomerGroupFormData>({
    resolver: zodResolver(customerGroupSchema) as any,
    defaultValues: initialData as any || {
      id: '',
      name: '',
      description: '',
      defaultCreditLimit: 0,
      defaultPriceListId: '',
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
        defaultCreditLimit: 0,
        defaultPriceListId: '',
        isDefault: false,
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
                    <Input placeholder="VD: VIP001" {...field} value={field.value ?? ''} />
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
                    <Input placeholder="VD: Khách hàng VIP" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="defaultCreditLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hạn mức công nợ mặc định</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        placeholder="VD: 50,000,000"
                        value={field.value ?? 0}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="defaultPriceListId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bảng giá áp dụng mặc định</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ''}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn bảng giá" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {activePriceLists.map((policy) => (
                        <SelectItem key={policy.id} value={policy.id}>
                          {policy.name}
                        </SelectItem>
                      ))}
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
                    <Textarea placeholder="Mô tả chi tiết..." {...field} value={field.value ?? ''} rows={3} />
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
                    <FormDescription>Tự động chọn khi tạo khách hàng mới</FormDescription>
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
        type: 'Online',
        isDefault: false,
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
                    <Input placeholder="VD: FB001" {...field} value={field.value ?? ''} />
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
                    <Input placeholder="VD: Facebook" {...field} value={field.value ?? ''} />
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
                  <Select onValueChange={field.onChange} value={field.value ?? ''}>
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
                    <Textarea placeholder="Mô tả chi tiết..." {...field} value={field.value ?? ''} rows={3} />
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
                    <FormDescription>Tự động chọn khi tạo khách hàng mới</FormDescription>
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
                    <Input placeholder="VD: NET30" {...field} value={field.value ?? ''} />
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
                    <Input placeholder="VD: Thanh toán trong 30 ngày" {...field} value={field.value ?? ''} />
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
                      value={field.value ?? 0}
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
                    <Textarea placeholder="Mô tả chi tiết..." {...field} value={field.value ?? ''} rows={3} />
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
        level: 5,
        maxCreditLimit: 0,
        isDefault: false,
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
                    <Input placeholder="VD: AAA" {...field} value={field.value ?? ''} />
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
                    <Input placeholder="VD: Xuất sắc" {...field} value={field.value ?? ''} />
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
                        value={field.value ?? 1}
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
                name="maxCreditLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hạn mức tín dụng tối đa</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        placeholder="VD: 100,000,000"
                        value={field.value ?? 0}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>Số tiền tối đa khách hàng được phép nợ</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Mô tả chi tiết..." {...field} value={field.value ?? ''} rows={3} />
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
                    <FormDescription>Tự động chọn khi tạo khách hàng mới</FormDescription>
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
// Lifecycle Stage Form Dialog
// ============================================
export function LifecycleStageFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  existingIds,
}: BaseFormDialogProps<LifecycleStage>) {
  const isEdit = !!initialData;

  const form = useForm<LifecycleStageFormData>({
    resolver: zodResolver(lifecycleStageSchema) as any,
    defaultValues: initialData as any || {
      id: '',
      name: '',
      description: '',
      orderIndex: 0,
      probability: 0,
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
        orderIndex: 0,
        probability: 0,
        isDefault: false,
        isActive: true,
      });
    }
  }, [open, initialData]);

  const handleSubmit = (values: LifecycleStageFormData) => {
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
          <DialogTitle>{isEdit ? 'Chỉnh sửa' : 'Thêm mới'} Giai đoạn khách hàng</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã giai đoạn <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="VD: LEAD" {...field} value={field.value ?? ''} />
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
                    <Input placeholder="VD: Tiềm năng" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="orderIndex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thứ tự hiển thị</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="VD: 1"
                        {...field}
                        value={field.value ?? 0}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="probability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Xác suất thành công (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="VD: 10"
                        {...field}
                        value={field.value ?? 0}
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Mô tả chi tiết..." {...field} value={field.value ?? ''} rows={3} />
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
                    <FormDescription>Tự động chọn khi tạo khách hàng mới</FormDescription>
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
// Customer SLA Setting Form Dialog
// Đơn giản hóa: chỉ cho EDIT, không thêm mới
// Mỗi loại SLA chỉ có 1 record cố định
// ============================================
export function CustomerSlaSettingFormDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
}: BaseFormDialogProps<CustomerSlaSetting>) {
  // SLA chỉ cho phép edit, không thêm mới
  if (!initialData) {
    return null;
  }

  const form = useForm<CustomerSlaSettingFormData>({
    resolver: zodResolver(customerSlaSettingSchema) as any,
    defaultValues: initialData as any,
  });

  React.useEffect(() => {
    if (open && initialData) {
      form.reset(initialData as any);
    }
  }, [open, initialData]);

  const handleSubmit = (values: CustomerSlaSettingFormData) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa {SLA_TYPE_LABELS[initialData.slaType]}</DialogTitle>
          <DialogDescription>
            Thiết lập thời gian và ngưỡng cảnh báo
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên hiển thị</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="targetDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mục tiêu</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        {...field}
                        value={field.value ?? 7}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">ngày</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="warningDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cảnh báo</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        value={field.value ?? 2}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">trước mục tiêu</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="criticalDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nghiêm trọng</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        value={field.value ?? 3}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">quá mục tiêu</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Mô tả chi tiết..." {...field} value={field.value ?? ''} rows={2} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit">Cập nhật</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
