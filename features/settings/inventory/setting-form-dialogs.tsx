import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AlertTriangle } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Alert, AlertDescription } from '../../../components/ui/alert';
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
                    <Input placeholder="VD: PT001" {...field} value={field.value ?? ''} disabled={!!initialData} />
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
                    <Input placeholder="VD: Hàng hóa" {...field} value={field.value ?? ''} />
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
                      value={field.value ?? ''}
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

// ProductCategory Form Schema - Upgraded with SEO fields like WordPress
const productCategorySchema = z.object({
  id: z.string().min(1, 'Mã danh mục là bắt buộc'),
  name: z.string().min(1, 'Tên danh mục là bắt buộc'),
  slug: z.string().optional(),
  // SEO Fields
  seoTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  // Hierarchy
  parentId: z.string().optional(),
  // Display
  color: z.string().optional(),
  icon: z.string().optional(),
  thumbnailImage: z.string().optional(),
  // Settings
  sortOrder: z.number().optional(),
  isActive: z.boolean().optional(),
});

export type ProductCategoryFormValues = z.infer<typeof productCategorySchema>;

interface ProductCategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: ProductCategory | null;
  parentId?: string | undefined; // For adding child categories
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
  const [activeTab, setActiveTab] = React.useState<'basic' | 'seo'>('basic');
  
  const form = useForm<ProductCategoryFormValues>({
    resolver: zodResolver(productCategorySchema),
    defaultValues: {
      id: initialData?.id || '',
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      seoTitle: initialData?.seoTitle || '',
      metaDescription: initialData?.metaDescription || '',
      shortDescription: initialData?.shortDescription || '',
      longDescription: initialData?.longDescription || '',
      parentId: initialData?.parentId || parentId || undefined,
      color: initialData?.color || '#3b82f6',
      icon: initialData?.icon || '',
      sortOrder: initialData?.sortOrder || 0,
      isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
    },
  });

  // Auto-generate slug from name
  const watchName = form.watch('name');
  React.useEffect(() => {
    if (watchName && !initialData) {
      const slug = watchName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      form.setValue('slug', slug);
    }
  }, [watchName, initialData, form]);

  React.useEffect(() => {
    if (open) {
      setActiveTab('basic');
      form.reset({
        id: initialData?.id || '',
        name: initialData?.name || '',
        slug: initialData?.slug || '',
        seoTitle: initialData?.seoTitle || '',
        metaDescription: initialData?.metaDescription || '',
        shortDescription: initialData?.shortDescription || '',
        longDescription: initialData?.longDescription || '',
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

  // Check max level (3 levels: 0, 1, 2)
  const selectedParent = categories.find(c => c.systemId === form.watch('parentId'));
  const parentLevel = selectedParent?.level ?? -1;
  const willExceedMaxLevel = parentLevel >= 2;

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
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
          </DialogTitle>
        </DialogHeader>
        
        {willExceedMaxLevel && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Không thể tạo danh mục con cho "{selectedParent?.name}" vì đã đạt giới hạn 3 cấp (gốc → cấp 2 → cấp 3).
            </AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form id="product-category-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'basic' | 'seo')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
                <TabsTrigger value="seo">SEO & Mô tả</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4 mt-4">
                {/* Row 1: ID and Sort Order */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mã danh mục <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="VD: CAT001" {...field} value={field.value ?? ''} disabled={!!initialData} />
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
                            value={field.value ?? 0}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Row 2: Name and Slug */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên danh mục <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="VD: Điện tử" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug (URL)</FormLabel>
                        <FormControl>
                          <Input placeholder="dien-tu" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormDescription>
                          Tự động tạo từ tên
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="parentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Danh mục cha</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => field.onChange(e.target.value || undefined)}
                          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="">-- Không có (Danh mục gốc) --</option>
                          {categories
                            .filter(c => c.systemId !== initialData?.systemId && (c.level ?? 0) < 2) // Only allow parent with level < 2
                            .map(cat => (
                              <option key={cat.systemId} value={cat.systemId}>
                                {'—'.repeat(cat.level || 0)} {cat.name} {cat.level === 1 ? '(cấp 2)' : ''}
                              </option>
                            ))}
                        </select>
                      </FormControl>
                      <FormDescription>
                        Hệ thống hỗ trợ tối đa 3 cấp danh mục
                      </FormDescription>
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
              </TabsContent>
              
              <TabsContent value="seo" className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="seoTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề SEO</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Tiêu đề hiển thị trên kết quả tìm kiếm" 
                          {...field} 
                          value={field.value ?? ''} 
                        />
                      </FormControl>
                      <FormDescription>
                        Để trống sẽ sử dụng tên danh mục. Nên từ 50-60 ký tự.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="metaDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Mô tả ngắn hiển thị trên kết quả tìm kiếm"
                          {...field}
                          value={field.value ?? ''}
                          rows={2}
                        />
                      </FormControl>
                      <FormDescription>
                        Nên từ 150-160 ký tự để hiển thị tốt trên Google.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả ngắn</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Mô tả ngắn gọn về danh mục"
                          {...field}
                          value={field.value ?? ''}
                          rows={2}
                        />
                      </FormControl>
                      <FormDescription>
                        Hiển thị ở đầu trang danh mục
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="longDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả chi tiết</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Mô tả đầy đủ về danh mục, có thể bao gồm thông tin về sản phẩm trong danh mục"
                          {...field}
                          value={field.value ?? ''}
                          rows={4}
                        />
                      </FormControl>
                      <FormDescription>
                        Hiển thị ở cuối trang danh mục, giúp SEO tốt hơn
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
          </form>
        </Form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button type="submit" form="product-category-form" disabled={willExceedMaxLevel}>
            {initialData ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
