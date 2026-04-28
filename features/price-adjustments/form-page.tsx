'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePriceAdjustmentMutations, usePriceAdjustmentById } from './hooks/use-price-adjustments';
import { useProductFinder } from '../products/hooks/use-all-products';
import { ProductImage } from '../products/components/product-image';
import { useEmployeeFinder } from '../employees/hooks/use-all-employees';
import { useAllPricingPolicies } from '../settings/pricing/hooks/use-all-pricing-policies';
import { useAuth } from '../../contexts/auth-context';
import { usePageHeader } from '../../contexts/page-header-context';
import { ROUTES } from '../../lib/router';
import { FormPageShell, mobileBleedCardClass } from '../../components/layout/page-section';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { CurrencyInput } from '../../components/ui/currency-input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { ProductSelectionDialog } from '../shared/product-selection-dialog';
import { UnifiedProductSearch } from '../../components/shared/unified-product-search';
import { BarcodeScannerButton } from '../../components/shared/barcode-scanner-button';
import { Plus, X, Save, Trash2, Package, Settings2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { asSystemId } from '../../lib/id-types';
import type { Product } from '@/lib/types/prisma-extended';
import { formatDateTimeForDisplay } from '@/lib/date-utils';
import type { PriceAdjustmentItem, PriceAdjustmentCreateInput } from './types';

const formatCurrency = (value: number | undefined | null) => {
  if (value == null || isNaN(value)) return '0 đ';
  return value.toLocaleString('vi-VN') + ' đ';
};

// Auto-fill adjustment types
const ADJUSTMENT_TYPES = [
  { value: 'percent_increase', label: 'Tăng %' },
  { value: 'percent_decrease', label: 'Giảm %' },
  { value: 'fixed_increase', label: 'Cộng tiền' },
  { value: 'fixed_decrease', label: 'Trừ tiền' },
];

// Debounced input component for performance
const DebouncedCurrencyInput = React.memo(function DebouncedCurrencyInput({
  value: initialValue,
  onChange,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}) {
  const [localValue, setLocalValue] = React.useState(initialValue);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);

  const handleChange = React.useCallback((newValue: number) => {
    setLocalValue(newValue);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onChange(newValue);
    }, 200);
  }, [onChange]);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <CurrencyInput
      value={localValue}
      onChange={handleChange}
      className={className}
    />
  );
});

const formSchema = z.object({
  customId: z.string().optional(),
  pricingPolicyId: z.string().min(1, 'Vui lòng chọn bảng giá'),
  reason: z.string().optional(),
  note: z.string().optional(),
  referenceCode: z.string().optional(),
  items: z.array(z.object({
    productSystemId: z.string(),
    productId: z.string(),
    productName: z.string(),
    productImage: z.string().optional(),
    oldPrice: z.number(),
    newPrice: z.number().min(0, 'Giá mới phải >= 0'),
  })).min(1, 'Vui lòng thêm ít nhất 1 sản phẩm'),
});

type FormData = z.infer<typeof formSchema>;

interface PriceAdjustmentFormPageProps {
  systemId?: string;
}

export function PriceAdjustmentFormPage({ systemId }: PriceAdjustmentFormPageProps) {
  const router = useRouter();
  const isEditMode = !!systemId;
  const { setPageHeader, clearPageHeader } = usePageHeader();
  const { user } = useAuth();
  const { findById: findEmployeeById } = useEmployeeFinder();
  const { findById: findProductById } = useProductFinder();
  const { data: pricingPolicies } = useAllPricingPolicies();
  
  // Fetch existing adjustment for edit mode
  const { data: existingAdjustment, isLoading: isLoadingAdjustment } = usePriceAdjustmentById(systemId);
  
  const { create, update } = usePriceAdjustmentMutations({
    onSuccess: () => {
      toast.success(isEditMode ? 'Đã cập nhật phiếu điều chỉnh giá bán' : 'Đã tạo phiếu điều chỉnh giá bán');
    },
    onError: (error) => {
      toast.error(error.message || 'Có lỗi xảy ra');
    },
  });
  
  const [isProductDialogOpen, setIsProductDialogOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  // Auto-fill states
  const [adjustmentType, setAdjustmentType] = React.useState('percent_increase');
  const [adjustmentValue, setAdjustmentValue] = React.useState<number>(0);
  
  const currentEmployee = user?.employeeId ? findEmployeeById(asSystemId(user.employeeId)) : null;
  const nextId = 'AUTO';
  const customIdError = null;
  
  // Filter only selling policies
  const sellingPolicies = React.useMemo(() => 
    pricingPolicies.filter(p => p.type === 'Bán hàng' && p.isActive !== false),
    [pricingPolicies]
  );
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customId: '',
      pricingPolicyId: '',
      reason: '',
      note: '',
      referenceCode: '',
      items: [],
    },
  });
  
  const { fields, append, remove, update: _update } = useFieldArray({
    control: form.control,
    name: 'items',
  });
  
  const watchItems = form.watch('items');
  const watchCustomId = form.watch('customId');
  const watchPricingPolicyId = form.watch('pricingPolicyId');
  
  // Load existing data in edit mode
  React.useEffect(() => {
    if (isEditMode && existingAdjustment && !isLoadingAdjustment) {
      form.reset({
        customId: existingAdjustment.id || '',
        pricingPolicyId: existingAdjustment.pricingPolicyId || '',
        reason: existingAdjustment.reason || '',
        note: existingAdjustment.note || '',
        referenceCode: existingAdjustment.referenceCode || '',
        items: existingAdjustment.items?.map((item: PriceAdjustmentItem) => ({
          productSystemId: item.productSystemId || '',
          productId: item.productId || '',
          productName: item.productName || '',
          productImage: item.productImage || '',
          oldPrice: Number(item.oldPrice) || 0,
          newPrice: Number(item.newPrice) || 0,
        })) || [],
      });
    }
  }, [isEditMode, existingAdjustment, isLoadingAdjustment, form]);
  
  // Get selected pricing policy
  const selectedPolicy = React.useMemo(() => 
    pricingPolicies.find(p => p.systemId === watchPricingPolicyId),
    [pricingPolicies, watchPricingPolicyId]
  );
  
  // Calculate totals
  const totalOldValue = watchItems.reduce((sum, item) => sum + item.oldPrice, 0);
  const totalNewValue = watchItems.reduce((sum, item) => sum + item.newPrice, 0);
  const totalDifference = totalNewValue - totalOldValue;

  // Get product's current price for selected pricing policy
  const getProductPrice = React.useCallback((product: Product) => {
    if (!watchPricingPolicyId) return 0;
    // Check product's prices object for the selected policy
    const prices = product.prices as Record<string, number> | undefined;
    if (prices && prices[watchPricingPolicyId] !== undefined) {
      return prices[watchPricingPolicyId];
    }
    // Fallback to sellingPrice
    return (product as { sellingPrice?: number }).sellingPrice || 0;
  }, [watchPricingPolicyId]);

  const handleAddProducts = React.useCallback((selectedProducts: Product[]) => {
    if (!watchPricingPolicyId) {
      toast.error('Vui lòng chọn bảng giá trước khi thêm sản phẩm');
      return;
    }
    
    selectedProducts.forEach(product => {
      // Check if already added
      const existingIndex = fields.findIndex(f => f.productSystemId === product.systemId);
      if (existingIndex >= 0) {
        toast.warning(`${product.name} đã có trong danh sách`);
        return;
      }
      
      const currentPrice = getProductPrice(product);
      
      append({
        productSystemId: product.systemId,
        productId: product.id,
        productName: product.name,
        productImage: product.thumbnailImage || (product as any).imageUrl || product.galleryImages?.[0] || product.images?.[0] || '',
        oldPrice: currentPrice,
        newPrice: currentPrice, // Default to same as old
      });
    });
    setIsProductDialogOpen(false);
  }, [watchPricingPolicyId, fields, getProductPrice, append]);
  
  // When pricing policy changes, update all items' oldPrice (skip in edit mode with existing data)
  const prevPolicyRef = React.useRef<string | null>(null);
  React.useEffect(() => {
    // Skip the first run in edit mode (when loading existing data)
    if (isEditMode && !prevPolicyRef.current && existingAdjustment) {
      prevPolicyRef.current = watchPricingPolicyId;
      return;
    }
    
    if (watchPricingPolicyId && watchPricingPolicyId !== prevPolicyRef.current && fields.length > 0) {
      prevPolicyRef.current = watchPricingPolicyId;
      
      // Batch updates for better performance
      const updates: { index: number; oldPrice: number }[] = [];
      fields.forEach((field, index) => {
        const product = findProductById(field.productSystemId);
        if (product) {
          updates.push({ index, oldPrice: getProductPrice(product) });
        }
      });
      
      // Apply updates in single batch
      updates.forEach(({ index, oldPrice }) => {
        form.setValue(`items.${index}.oldPrice`, oldPrice, { shouldDirty: false });
        form.setValue(`items.${index}.newPrice`, oldPrice, { shouldDirty: false });
      });
    }
  }, [watchPricingPolicyId, findProductById, fields, form, getProductPrice, isEditMode, existingAdjustment]);
  
  const onSubmit = React.useCallback(async (data: FormData) => {
    if (!currentEmployee) {
      toast.error('Không tìm thấy thông tin nhân viên');
      return;
    }
    
    // Check if any price changed
    const hasChanges = data.items.some(item => item.newPrice !== item.oldPrice);
    if (!hasChanges) {
      toast.error('Vui lòng thay đổi giá ít nhất 1 sản phẩm');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const payload = {
        pricingPolicyId: data.pricingPolicyId,
        pricingPolicyName: selectedPolicy?.name,
        items: data.items.map(item => ({
          productSystemId: asSystemId(item.productSystemId),
          productId: item.productId,
          productName: item.productName,
          productImage: item.productImage,
          oldPrice: item.oldPrice,
          newPrice: item.newPrice,
          adjustmentAmount: item.newPrice - item.oldPrice,
          adjustmentPercent: item.oldPrice > 0 ? ((item.newPrice - item.oldPrice) / item.oldPrice * 100) : 0,
        })),
        type: 'manual',
        reason: data.reason,
        note: data.note,
        referenceCode: data.referenceCode,
        businessId: data.customId,
        createdBy: currentEmployee.systemId,
        createdByName: currentEmployee.fullName,
      };
      
      if (isEditMode && systemId) {
        await update.mutateAsync({ systemId, data: payload as unknown as Parameters<typeof update.mutateAsync>[0]['data'] });
        router.push(`/price-adjustments/${systemId}`);
      } else {
        const result = await create.mutateAsync(payload as PriceAdjustmentCreateInput);
        router.push(`/price-adjustments/${result.systemId}`);
      }
    } catch (_error) {
      // Error handled by mutation callbacks
    } finally {
      setIsSubmitting(false);
    }
  }, [currentEmployee, selectedPolicy?.name, isEditMode, systemId, update, router, create]);
  
  // Handle apply adjustment to all items
  const handleApplyAdjustment = React.useCallback(() => {
    if (!adjustmentValue || adjustmentValue === 0) {
      toast.error('Vui lòng nhập giá trị điều chỉnh');
      return;
    }
    
    fields.forEach((field, index) => {
      const oldPrice = field.oldPrice;
      let newPrice: number;
      
      switch (adjustmentType) {
        case 'percent_increase':
          newPrice = Math.round(oldPrice * (1 + adjustmentValue / 100));
          break;
        case 'percent_decrease':
          newPrice = Math.round(oldPrice * (1 - adjustmentValue / 100));
          break;
        case 'fixed_increase':
          newPrice = oldPrice + adjustmentValue;
          break;
        case 'fixed_decrease':
          newPrice = Math.max(0, oldPrice - adjustmentValue);
          break;
        default:
          newPrice = oldPrice;
      }
      
      form.setValue(`items.${index}.newPrice`, newPrice);
    });
    
    const typeLabel = ADJUSTMENT_TYPES.find(t => t.value === adjustmentType)?.label || '';
    const valueLabel = adjustmentType.includes('percent') 
      ? `${adjustmentValue}%` 
      : formatCurrency(adjustmentValue);
    toast.success(`Đã áp dụng: ${typeLabel} ${valueLabel}`);
  }, [fields, adjustmentType, adjustmentValue, form]);
  
  // Handle form submit via button click
  const handleSubmitClick = React.useCallback(() => {
    form.handleSubmit(onSubmit)();
  }, [form, onSubmit]);
  
  const headerActions = React.useMemo(() => (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        onClick={() => router.push('/price-adjustments')}
        disabled={isSubmitting}
      >
        <X className="mr-2 h-4 w-4" />
        Hủy
      </Button>
      <Button 
        type="button"
        disabled={isSubmitting || fields.length === 0 || !watchPricingPolicyId}
        onClick={handleSubmitClick}
      >
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
        {isSubmitting ? 'Đang lưu...' : (isEditMode ? 'Cập nhật' : 'Tạo phiếu')}
      </Button>
    </div>
  ), [router, isSubmitting, fields.length, watchPricingPolicyId, handleSubmitClick, isEditMode]);
  
  const breadcrumb = React.useMemo(() => [
    { label: 'Trang chủ', href: ROUTES.ROOT },
    { label: 'Điều chỉnh giá bán', href: '/price-adjustments' },
    { label: isEditMode ? 'Sửa phiếu' : 'Tạo phiếu', href: '' },
  ], [isEditMode]);
  
  React.useEffect(() => {
    setPageHeader({
      title: isEditMode ? 'Sửa phiếu điều chỉnh giá bán' : 'Tạo phiếu điều chỉnh giá bán',
      subtitle: `Mã phiếu: ${watchCustomId || nextId} • Điều chỉnh giá bán theo bảng giá`,
      breadcrumb,
      showBackButton: true,
      backPath: '/price-adjustments',
      actions: headerActions,
    });
    return () => clearPageHeader();
  }, [setPageHeader, clearPageHeader, breadcrumb, headerActions, watchCustomId, nextId, isEditMode]);
  
  // Show loading when fetching existing adjustment in edit mode
  if (isEditMode && isLoadingAdjustment) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <FormPageShell gap="lg">
      <form id="adjustment-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <Card className={mobileBleedCardClass}>
          <CardHeader>
            <CardTitle>Thông tin phiếu điều chỉnh</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Bảng giá <span className="text-destructive">*</span></Label>
                <Select 
                  value={watchPricingPolicyId} 
                  onValueChange={(value) => form.setValue('pricingPolicyId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn bảng giá..." />
                  </SelectTrigger>
                  <SelectContent>
                    {sellingPolicies.map(policy => (
                      <SelectItem key={policy.systemId} value={policy.systemId}>
                        {policy.name} {policy.isDefault && '(Mặc định)'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.pricingPolicyId && (
                  <p className="text-sm text-destructive">{form.formState.errors.pricingPolicyId.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label>Mã phiếu</Label>
                <Input 
                  {...form.register('customId')}
                  placeholder={nextId}
                />
                {customIdError ? (
                  <p className="text-sm text-destructive">{customIdError}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Để trống để tự động tạo mã
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Mã tham chiếu</Label>
                <Input 
                  {...form.register('referenceCode')}
                  placeholder="Mã tham chiếu (nếu có)..."
                />
              </div>
              
              <div className="space-y-2">
                <Label>Người tạo</Label>
                <Input 
                  value={currentEmployee?.fullName || user?.name || 'Không xác định'}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  {formatDateTimeForDisplay(new Date())}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Lý do điều chỉnh</Label>
              <Input 
                {...form.register('reason')}
                placeholder="Ví dụ: Điều chỉnh giá theo thị trường, Khuyến mãi mùa hè..."
              />
            </div>

            <div className="space-y-2">
              <Label>Ghi chú</Label>
              <Textarea
                {...form.register('note')}
                placeholder="Ghi chú thêm..."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Product List */}
        <Card className={mobileBleedCardClass}>
          <CardHeader>
            <CardTitle>
              Danh sách sản phẩm
              {selectedPolicy && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  - Bảng giá: {selectedPolicy.name}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!watchPricingPolicyId ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="mx-auto h-12 w-12 mb-2 opacity-50" />
                <p>Vui lòng chọn bảng giá trước</p>
                <p className="text-xs mt-1">Sau khi chọn bảng giá, bạn có thể thêm sản phẩm để điều chỉnh</p>
              </div>
            ) : (
              <>
                {/* Product search row */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex-1">
                    <UnifiedProductSearch
                      onSelectProduct={(product) => handleAddProducts([product])}
                      placeholder="Tìm sản phẩm nhanh theo tên, mã sản phẩm..."
                      pricingPolicyId={watchPricingPolicyId}
                    />
                  </div>
                  <BarcodeScannerButton
                    onDetect={async (code) => {
                      try {
                        const res = await fetch(`/api/search/products?q=${encodeURIComponent(code)}&limit=5&offset=0`);
                        if (!res.ok) throw new Error('search failed');
                        const json = await res.json() as { data: Product[] };
                        const match = json.data?.[0];
                        if (!match) {
                          toast.error(`Không tìm thấy sản phẩm cho mã "${code}"`);
                          return;
                        }
                        handleAddProducts([match]);
                        toast.success(`Đã thêm: ${match.name}`);
                      } catch {
                        toast.error('Không thể tra cứu mã vạch. Thử lại.');
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                    onClick={() => setIsProductDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm SP
                  </Button>
                </div>

                {/* Auto-fill adjustment row */}
                {fields.length > 0 && (
                  <div className="flex items-center gap-2 mb-4 p-3 bg-muted/50 rounded-lg">
                    <Settings2 className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-muted-foreground shrink-0">Điều chỉnh tất cả:</span>
                    <Select value={adjustmentType} onValueChange={setAdjustmentType}>
                      <SelectTrigger className="h-8 w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ADJUSTMENT_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {adjustmentType.includes('percent') ? (
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          value={adjustmentValue || ''}
                          onChange={(e) => setAdjustmentValue(Number(e.target.value))}
                          placeholder="0"
                          className="h-8 w-20"
                        />
                        <span className="text-sm text-muted-foreground">%</span>
                      </div>
                    ) : (
                      <CurrencyInput
                        value={adjustmentValue}
                        onChange={setAdjustmentValue}
                        className="h-8 w-32"
                      />
                    )}
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="h-8"
                      onClick={handleApplyAdjustment}
                      disabled={!adjustmentValue || adjustmentValue === 0}
                    >
                      Áp dụng
                    </Button>
                  </div>
                )}

                {fields.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="mx-auto h-12 w-12 mb-2 opacity-50" />
                    <p>Chưa có sản phẩm nào</p>
                    <p className="text-xs mt-1">Sử dụng ô tìm kiếm phía trên hoặc click nút Thêm SP</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">Ảnh</TableHead>
                          <TableHead>Sản phẩm</TableHead>
                          <TableHead className="w-32 text-right">Giá hiện tại</TableHead>
                          <TableHead className="w-36 text-center">Giá mới</TableHead>
                          <TableHead className="w-28 text-right">Chênh lệch</TableHead>
                          <TableHead className="w-12"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {fields.map((field, index) => {
                          const linkedProduct = findProductById(asSystemId(field.productSystemId));
                          const newPrice = watchItems[index]?.newPrice || 0;
                          const oldPrice = field.oldPrice;
                          const difference = newPrice - oldPrice;
                          const productHref = `/products/${field.productSystemId}`;
                          
                          return (
                            <TableRow key={field.id}>
                              <TableCell>
                                <Link href={productHref} className="block hover:opacity-80 transition-opacity">
                                  <ProductImage
                                    productSystemId={field.productSystemId}
                                    productData={linkedProduct}
                                    alt={field.productName}
                                    size="md"
                                  />
                                </Link>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col gap-0.5">
                                  <Link href={productHref} className="text-primary hover:underline font-medium">
                                    {field.productName}
                                  </Link>
                                  <span className="text-sm text-muted-foreground">
                                    {field.productId}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {formatCurrency(oldPrice)}
                              </TableCell>
                              <TableCell>
                                <DebouncedCurrencyInput
                                  value={watchItems[index]?.newPrice || 0}
                                  onChange={(value) => form.setValue(`items.${index}.newPrice`, value)}
                                  className="h-9 w-full text-center"
                                />
                              </TableCell>
                              <TableCell className={`text-right font-semibold ${
                                difference > 0 ? 'text-green-600' : 
                                difference < 0 ? 'text-red-600' : 
                                'text-muted-foreground'
                              }`}>
                                {difference >= 0 ? '+' : ''}{formatCurrency(difference)}
                              </TableCell>
                              <TableCell>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => remove(index)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                    
                    <div className="mt-4 flex justify-end">
                      <div className="text-right space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Tổng số sản phẩm: {fields.length}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Tổng giá hiện tại: {formatCurrency(totalOldValue)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Tổng giá mới: {formatCurrency(totalNewValue)}
                        </p>
                        <p className={`font-semibold ${
                          totalDifference > 0 ? 'text-green-600' : 
                          totalDifference < 0 ? 'text-red-600' : ''
                        }`}>
                          Chênh lệch: {totalDifference >= 0 ? '+' : ''}{formatCurrency(totalDifference)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            
            {form.formState.errors.items && (
              <p className="text-sm text-destructive mt-2">{form.formState.errors.items.message}</p>
            )}
          </CardContent>
        </Card>
      </form>

      {/* Product Selection Dialog */}
      <ProductSelectionDialog
        isOpen={isProductDialogOpen}
        onOpenChange={setIsProductDialogOpen}
        onSelect={handleAddProducts}
        pricingPolicyId={watchPricingPolicyId}
        showQuantityInput={false}
      />
    </FormPageShell>
  );
}
