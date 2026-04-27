'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCostAdjustmentMutations } from './hooks/use-cost-adjustments';
import { useProductFinder } from '../products/hooks/use-all-products';
import { ProductImage } from '../products/components/product-image';
import { useEmployeeFinder } from '../employees/hooks/use-all-employees';
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
import type { CreateCostAdjustmentInput } from '@/app/actions/cost-adjustments';
import { formatDateTimeForDisplay } from '@/lib/date-utils';

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
  reason: z.string().optional(),
  note: z.string().optional(),
  referenceCode: z.string().optional(),
  items: z.array(z.object({
    productSystemId: z.string(),
    productId: z.string(),
    productName: z.string(),
    productImage: z.string().optional(),
    oldCostPrice: z.number(),
    newCostPrice: z.number().min(0, 'Giá vốn mới phải >= 0'),
  })).min(1, 'Vui lòng thêm ít nhất 1 sản phẩm'),
});

type FormData = z.infer<typeof formSchema>;

export function CostAdjustmentFormPage() {
  const router = useRouter();
  const { setPageHeader, clearPageHeader } = usePageHeader();
  const { user } = useAuth();
  const { findById: findEmployeeById } = useEmployeeFinder();
  const { findById: findProductById } = useProductFinder();
  const { create } = useCostAdjustmentMutations({
    onSuccess: () => {
      toast.success('Đã tạo phiếu điều chỉnh giá vốn');
    },
    onError: (error) => {
      toast.error(error.message || 'Có lỗi xảy ra khi tạo phiếu');
    },
  });
  
  const [isProductDialogOpen, setIsProductDialogOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  // Auto-fill states
  const [adjustmentType, setAdjustmentType] = React.useState('percent_increase');
  const [adjustmentValue, setAdjustmentValue] = React.useState<number>(0);
  
  const currentEmployee = user?.employeeId ? findEmployeeById(asSystemId(user.employeeId)) : null;
  
  /**
   * Next ID generation uses 'AUTO' to let server auto-generate businessId.
   * Server generates sequential ID (e.g., 'DGGV-00001') on insert.
   * 
   * TODO: If manual ID entry is required, implement API endpoint:
   * GET /api/cost-adjustments/next-id → { nextId: "DGGV-00002" }
   */
  const nextId = 'AUTO';
  
  /**
   * ID validation placeholder — custom ID is optional.
   * If validation is needed, implement API endpoint:
   * POST /api/cost-adjustments/validate-id { businessId: string } → { valid: boolean, error?: string }
   */
  const customIdError = null;
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customId: '',
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

  // Calculate totals
  const totalOldValue = watchItems.reduce((sum, item) => sum + item.oldCostPrice, 0);
  const totalNewValue = watchItems.reduce((sum, item) => sum + item.newCostPrice, 0);
  const totalDifference = totalNewValue - totalOldValue;

  const handleAddProducts = (selectedProducts: Product[]) => {
    selectedProducts.forEach(product => {
      // Check if already added
      const existingIndex = fields.findIndex(f => f.productSystemId === product.systemId);
      if (existingIndex >= 0) {
        toast.warning(`${product.name} đã có trong danh sách`);
        return;
      }
      
      append({
        productSystemId: product.systemId,
        productId: product.id,
        productName: product.name,
        productImage: product.thumbnailImage || product.galleryImages?.[0] || product.images?.[0] || '',
        oldCostPrice: product.costPrice || 0,
        newCostPrice: product.costPrice || 0, // Default to same as old
      });
    });
    setIsProductDialogOpen(false);
  };
  
  const onSubmit = React.useCallback(async (data: FormData) => {
    if (!currentEmployee) {
      toast.error('Không tìm thấy thông tin nhân viên');
      return;
    }
    
    // Check if any price changed
    const hasChanges = data.items.some(item => item.newCostPrice !== item.oldCostPrice);
    if (!hasChanges) {
      toast.error('Vui lòng thay đổi giá vốn ít nhất 1 sản phẩm');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const createInput = {
        items: data.items.map(item => ({
          productSystemId: asSystemId(item.productSystemId),
          productId: item.productId,
          productName: item.productName,
          productImage: item.productImage,
          oldCostPrice: item.oldCostPrice,
          newCostPrice: item.newCostPrice,
          adjustmentAmount: item.newCostPrice - item.oldCostPrice,
          adjustmentPercent: item.oldCostPrice > 0 ? ((item.newCostPrice - item.oldCostPrice) / item.oldCostPrice * 100) : 0,
        })),
        type: 'manual',
        reason: data.reason,
        note: data.note,
        referenceCode: data.referenceCode,
        businessId: data.customId,
        createdBy: currentEmployee.systemId,
        createdByName: currentEmployee.fullName,
      } as unknown as CreateCostAdjustmentInput;
      const result = await create.mutateAsync(createInput);
      
      router.push(`/cost-adjustments/${result.systemId}`);
    } catch (_error) {
      // Error handled by mutation callbacks
    } finally {
      setIsSubmitting(false);
    }
  }, [currentEmployee, create, router]);
  
  // Handle apply adjustment to all items
  const handleApplyAdjustment = React.useCallback(() => {
    if (!adjustmentValue || adjustmentValue === 0) {
      toast.error('Vui lòng nhập giá trị điều chỉnh');
      return;
    }
    
    fields.forEach((field, index) => {
      const oldPrice = field.oldCostPrice;
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
      
      form.setValue(`items.${index}.newCostPrice`, newPrice);
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
        onClick={() => router.push('/cost-adjustments')}
        disabled={isSubmitting}
      >
        <X className="mr-2 h-4 w-4" />
        Hủy
      </Button>
      <Button
        type="button"
        disabled={isSubmitting || fields.length === 0}
        onClick={handleSubmitClick}
      >
        {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang lưu...</> : <><Save className="mr-2 h-4 w-4" />Tạo phiếu</>}
      </Button>
    </div>
  ), [router, isSubmitting, fields.length, handleSubmitClick]);
  
  const breadcrumb = React.useMemo(() => [
    { label: 'Trang chủ', href: ROUTES.ROOT },
    { label: 'Điều chỉnh giá vốn', href: '/cost-adjustments' },
    { label: 'Tạo phiếu', href: '' },
  ], []);
  
  React.useEffect(() => {
    setPageHeader({
      title: 'Tạo phiếu điều chỉnh giá vốn',
      subtitle: `Mã phiếu: ${watchCustomId || nextId} • Điều chỉnh giá vốn sản phẩm`,
      breadcrumb,
      showBackButton: true,
      backPath: '/cost-adjustments',
      actions: headerActions,
    });
    return () => clearPageHeader();
  }, [setPageHeader, clearPageHeader, breadcrumb, headerActions, watchCustomId, nextId]);
  
  return (
    <FormPageShell gap="lg">
      <form id="adjustment-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <Card className={mobileBleedCardClass}>
          <CardHeader>
            <CardTitle>Thông tin phiếu điều chỉnh</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    Để trống để tự động tạo mã: {nextId}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Mã tham chiếu</Label>
                <Input 
                  {...form.register('referenceCode')}
                  placeholder="Nhập mã tham chiếu (nếu có)..."
                />
                <p className="text-xs text-muted-foreground">
                  Mã từ hệ thống khác hoặc mã nội bộ
                </p>
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
                placeholder="Ví dụ: Cập nhật giá theo đơn nhập mới, Điều chỉnh giá theo thị trường..."
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
            <CardTitle>Danh sách sản phẩm</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Product search row - combobox full width, button on right */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1">
                <UnifiedProductSearch
                  onSelectProduct={(product) => handleAddProducts([product])}
                  placeholder="Tìm sản phẩm nhanh theo tên, mã sản phẩm..."
                  showCostPrice={true}
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

            {/* Auto-fill adjustment row - only show when has items */}
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
                      <TableHead className="w-32 text-right">Giá vốn cũ</TableHead>
                      <TableHead className="w-36 text-center">Giá vốn mới</TableHead>
                      <TableHead className="w-28 text-right">Chênh lệch</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => {
                      const linkedProduct = findProductById(asSystemId(field.productSystemId));
                      const newPrice = watchItems[index]?.newCostPrice || 0;
                      const oldPrice = field.oldCostPrice;
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
                              value={watchItems[index]?.newCostPrice || 0}
                              onChange={(value) => form.setValue(`items.${index}.newCostPrice`, value)}
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
                      Tổng giá vốn cũ: {formatCurrency(totalOldValue)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Tổng giá vốn mới: {formatCurrency(totalNewValue)}
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
        showCostPrice={true}
        showQuantityInput={false}
      />
    </FormPageShell>
  );
}
