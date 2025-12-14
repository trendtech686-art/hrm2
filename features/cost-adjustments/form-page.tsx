import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCostAdjustmentStore } from './store.ts';
import { useProductStore } from '../products/store.ts';
import { ProductImage } from '../products/components/product-image.tsx';
import { useEmployeeStore } from '../employees/store.ts';
import { useAuth } from '../../contexts/auth-context.tsx';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { ROUTES } from '../../lib/router.ts';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Button } from '../../components/ui/button.tsx';
import { Input } from '../../components/ui/input.tsx';
import { CurrencyInput } from '../../components/ui/currency-input.tsx';
import { Label } from '../../components/ui/label.tsx';
import { Textarea } from '../../components/ui/textarea.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table.tsx';
import { ProductSelectionDialog } from '../shared/product-selection-dialog.tsx';
import { Plus, X, Save, Trash2, Package, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';
import { asSystemId } from '../../lib/id-types.ts';
import { formatDateTimeForDisplay } from '@/lib/date-utils';

const formatCurrency = (value: number) => value.toLocaleString('vi-VN') + ' đ';

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
  const navigate = ReactRouterDOM.useNavigate();
  const { setPageHeader, clearPageHeader } = usePageHeader();
  const { user } = useAuth();
  const { findById: findEmployeeById } = useEmployeeStore();
  const { data: allProducts, findById: findProductById } = useProductStore();
  const { create, generateNextId, isBusinessIdExists } = useCostAdjustmentStore();
  
  const [isProductDialogOpen, setIsProductDialogOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const currentEmployee = user?.employeeId ? findEmployeeById(asSystemId(user.employeeId)) : null;
  const nextId = React.useMemo(() => generateNextId(), [generateNextId]);
  
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
  
  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: 'items',
  });
  
  const watchItems = form.watch('items');
  const watchCustomId = form.watch('customId');
  
  // Calculate totals
  const totalOldValue = watchItems.reduce((sum, item) => sum + item.oldCostPrice, 0);
  const totalNewValue = watchItems.reduce((sum, item) => sum + item.newCostPrice, 0);
  const totalDifference = totalNewValue - totalOldValue;
  
  // Validate custom ID
  const customIdError = React.useMemo(() => {
    if (!watchCustomId) return null;
    if (isBusinessIdExists(watchCustomId)) {
      return 'Mã phiếu đã tồn tại';
    }
    return null;
  }, [watchCustomId, isBusinessIdExists]);
  
  const handleAddProducts = (selectedProducts: typeof allProducts) => {
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
  
  const onSubmit = (data: FormData) => {
    if (!currentEmployee) {
      toast.error('Không tìm thấy thông tin nhân viên');
      return;
    }
    
    if (customIdError) {
      toast.error(customIdError);
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
      const adjustmentOptions: Parameters<typeof create>[4] = {};
      if (data.customId) {
        adjustmentOptions.customId = data.customId;
      }
      if (typeof data.reason === 'string') {
        adjustmentOptions.reason = data.reason;
      }
      if (typeof data.note === 'string') {
        adjustmentOptions.note = data.note;
      }
      if (typeof data.referenceCode === 'string') {
        adjustmentOptions.referenceCode = data.referenceCode;
      }

      const adjustment = create(
        data.items.map(item => ({
          productSystemId: asSystemId(item.productSystemId),
          productId: item.productId,
          productName: item.productName,
          productImage: item.productImage ?? '',
          oldCostPrice: item.oldCostPrice,
          newCostPrice: item.newCostPrice,
        })),
        'manual',
        currentEmployee.systemId,
        currentEmployee.fullName,
        Object.keys(adjustmentOptions).length ? adjustmentOptions : undefined
      );
      
      toast.success('Đã tạo phiếu điều chỉnh giá vốn');
      navigate(`/cost-adjustments/${adjustment.systemId}`);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tạo phiếu');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const headerActions = React.useMemo(() => (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        className="h-9"
        onClick={() => navigate('/cost-adjustments')}
        disabled={isSubmitting}
      >
        <X className="mr-2 h-4 w-4" />
        Hủy
      </Button>
      <Button 
        type="submit" 
        form="adjustment-form"
        className="h-9"
        disabled={isSubmitting || fields.length === 0 || !!customIdError}
      >
        <Save className="mr-2 h-4 w-4" />
        {isSubmitting ? 'Đang lưu...' : 'Tạo phiếu'}
      </Button>
    </div>
  ), [navigate, isSubmitting, fields.length, customIdError]);
  
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
    <div className="space-y-6">
      <form id="adjustment-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Thông tin phiếu điều chỉnh</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Mã phiếu</Label>
                <Input 
                  {...form.register('customId')}
                  placeholder={nextId}
                  className="h-9"
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
                  className="h-9"
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
                  className="h-9 bg-muted"
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
                className="h-9"
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Danh sách sản phẩm</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsProductDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Thêm sản phẩm
            </Button>
          </CardHeader>
          <CardContent>
            {fields.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="mx-auto h-12 w-12 mb-2 opacity-50" />
                <p>Chưa có sản phẩm nào</p>
                <Button
                  type="button"
                  variant="link"
                  onClick={() => setIsProductDialogOpen(true)}
                >
                  Thêm sản phẩm
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead className="w-[60px]">Ảnh</TableHead>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead className="w-[150px] text-right">Giá vốn cũ</TableHead>
                      <TableHead className="w-[150px] text-right">Giá vốn mới</TableHead>
                      <TableHead className="w-[150px] text-right">Chênh lệch</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => {
                      const linkedProduct = findProductById(asSystemId(field.productSystemId));
                      const newPrice = watchItems[index]?.newCostPrice || 0;
                      const oldPrice = field.oldCostPrice;
                      const difference = newPrice - oldPrice;
                      const percentChange = oldPrice > 0 ? (difference / oldPrice) * 100 : 0;
                      
                      return (
                        <TableRow key={field.id}>
                          <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                          <TableCell>
                            <ProductImage
                              productSystemId={field.productSystemId}
                              productData={linkedProduct}
                              alt={field.productName}
                              size="md"
                            />
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{field.productName}</p>
                              <p className="text-sm text-muted-foreground">{field.productId}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {formatCurrency(oldPrice)}
                          </TableCell>
                          <TableCell>
                            <CurrencyInput
                              value={watchItems[index]?.newCostPrice || 0}
                              onChange={(value) => form.setValue(`items.${index}.newCostPrice`, value)}
                              className="h-9 w-[150px]"
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              {difference !== 0 && (
                                difference > 0 ? (
                                  <TrendingUp className="h-4 w-4 text-green-600" />
                                ) : (
                                  <TrendingDown className="h-4 w-4 text-red-600" />
                                )
                              )}
                              <span className={`font-medium ${
                                difference > 0 ? 'text-green-600' : 
                                difference < 0 ? 'text-red-600' : 
                                'text-muted-foreground'
                              }`}>
                                {difference >= 0 ? '+' : ''}{formatCurrency(difference)}
                              </span>
                            </div>
                            {difference !== 0 && (
                              <p className={`text-xs ${
                                difference > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {difference >= 0 ? '+' : ''}{percentChange.toFixed(1)}%
                              </p>
                            )}
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
      />
    </div>
  );
}
