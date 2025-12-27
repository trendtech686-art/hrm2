'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useStockTransferStore } from './store';
import { useBranchStore } from '../settings/branches/store';
import { useProductStore } from '../products/store';
import { ProductImage } from '../products/components/product-image';
import { useEmployeeStore } from '../employees/store';
import { useAuth } from '../../contexts/auth-context';
import { usePageHeader } from '../../contexts/page-header-context';
import { ROUTES } from '../../lib/router';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Plus, Trash2, Package, Save, X, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { toast } from 'sonner';
import { asSystemId, asBusinessId, type SystemId } from '../../lib/id-types';
import { formatDateCustom, getCurrentDate } from '@/lib/date-utils';
import { ProductSelectionDialog } from '../shared/product-selection-dialog';
import type { StockTransfer, StockTransferStatus } from '@/lib/types/prisma-extended';

const formatCurrency = (value: number) => value.toLocaleString('vi-VN') + ' đ';

const getStatusLabel = (status: StockTransferStatus): string => {
  switch (status) {
    case 'pending': return 'Chờ chuyển';
    case 'transferring': return 'Đang chuyển';
    case 'completed': return 'Hoàn thành';
    case 'cancelled': return 'Đã hủy';
    default: return status;
  }
};

const getStatusVariant = (status: StockTransferStatus): 'default' | 'secondary' | 'success' | 'destructive' | 'outline' => {
  switch (status) {
    case 'pending': return 'secondary';
    case 'transferring': return 'default';
    case 'completed': return 'success';
    case 'cancelled': return 'destructive';
    default: return 'outline';
  }
};

// Form schema for full edit (pending status)
const fullEditSchema = z.object({
  fromBranchSystemId: z.string().min(1, 'Vui lòng chọn chi nhánh chuyển'),
  toBranchSystemId: z.string().min(1, 'Vui lòng chọn chi nhánh nhận'),
  referenceCode: z.string().optional(),
  items: z.array(z.object({
    productSystemId: z.string(),
    productId: z.string(),
    productName: z.string(),
    productImage: z.string().optional(),
    quantity: z.number().min(1, 'Số lượng phải lớn hơn 0'),
    fromBranchStock: z.number().optional(),
    toBranchStock: z.number().optional(),
    unitPrice: z.number().optional(),
    note: z.string().optional(),
  })).min(1, 'Vui lòng thêm ít nhất 1 sản phẩm'),
  note: z.string().optional(),
}).refine(data => data.fromBranchSystemId !== data.toBranchSystemId, {
  message: 'Chi nhánh chuyển và chi nhánh nhận phải khác nhau',
  path: ['toBranchSystemId'],
});

// Form schema for limited edit (transferring status)
const limitedEditSchema = z.object({
  referenceCode: z.string().optional(),
  note: z.string().optional(),
});

type FullEditFormData = z.infer<typeof fullEditSchema>;
type LimitedEditFormData = z.infer<typeof limitedEditSchema>;

export function StockTransferEditPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const router = useRouter();
  const { findById, update } = useStockTransferStore();
  const { data: branches } = useBranchStore();
  const { data: allProducts, findById: findProductById } = useProductStore();
  const { findById: findEmployeeById } = useEmployeeStore();
  const { user } = useAuth();
  const { setPageHeader, clearPageHeader } = usePageHeader();
  
  const [isProductDialogOpen, setIsProductDialogOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const transfer = findById(asSystemId(systemId || ''));
  const canFullEdit = transfer?.status === 'pending';
  const canLimitedEdit = transfer?.status === 'transferring' || transfer?.status === 'completed';
  const canEdit = canFullEdit || canLimitedEdit;

  // Get current employee
  const currentEmployee = React.useMemo(() => {
    if (!user?.employeeId) return null;
    return findEmployeeById(asSystemId(user.employeeId));
  }, [user, findEmployeeById]);

  // Full edit form
  const fullEditForm = useForm<FullEditFormData>({
    resolver: zodResolver(fullEditSchema),
    defaultValues: {
      fromBranchSystemId: transfer?.fromBranchSystemId || '',
      toBranchSystemId: transfer?.toBranchSystemId || '',
      referenceCode: transfer?.referenceCode || '',
      items: transfer?.items.map(item => {
        const product = findProductById(item.productSystemId);
        return {
          productSystemId: item.productSystemId,
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          fromBranchStock: product?.inventoryByBranch?.[transfer.fromBranchSystemId] || 0,
          toBranchStock: product?.inventoryByBranch?.[transfer.toBranchSystemId] || 0,
          unitPrice: product?.costPrice || 0,
          note: item.note || '',
        };
      }) || [],
      note: transfer?.note || '',
    },
  });

  // Limited edit form
  const limitedEditForm = useForm<LimitedEditFormData>({
    resolver: zodResolver(limitedEditSchema),
    defaultValues: {
      referenceCode: transfer?.referenceCode || '',
      note: transfer?.note || '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: fullEditForm.control,
    name: 'items',
  });

  const fromBranchId = fullEditForm.watch('fromBranchSystemId');
  const toBranchId = fullEditForm.watch('toBranchSystemId');
  const items = fullEditForm.watch('items');

  // Header actions
  const headerActions = React.useMemo(() => (
    <div className="flex items-center gap-2">
      <Button 
        type="button" 
        variant="outline" 
        className="h-9"
        onClick={() => router.push(`/stock-transfers/${systemId}`)}
        disabled={isSubmitting}
      >
        <X className="mr-2 h-4 w-4" />
        Hủy
      </Button>
      <Button 
        type="submit" 
        form={canFullEdit ? 'full-edit-form' : 'limited-edit-form'}
        className="h-9"
        disabled={isSubmitting || (canFullEdit && fields.length === 0)}
      >
        <Save className="mr-2 h-4 w-4" />
        {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
      </Button>
    </div>
  ), [router, systemId, isSubmitting, canFullEdit, fields.length]);

  // Breadcrumb
  const breadcrumb = React.useMemo(() => {
    if (!transfer) return [];
    return [
      { label: 'Trang chủ', href: ROUTES.ROOT },
      { label: 'Chuyển kho', href: ROUTES.INVENTORY.STOCK_TRANSFERS },
      { label: transfer.id, href: `/stock-transfers/${systemId}` },
      { label: 'Chỉnh sửa', href: '' },
    ];
  }, [transfer, systemId]);

  React.useEffect(() => {
    if (transfer) {
      setPageHeader({
        title: `Chỉnh sửa phiếu ${transfer.id}`,
        breadcrumb,
        showBackButton: true,
        backPath: `/stock-transfers/${systemId}`,
        actions: headerActions,
        badge: (
          <Badge variant={getStatusVariant(transfer.status)}>
            {getStatusLabel(transfer.status)}
          </Badge>
        ),
      });
    }
    return () => clearPageHeader();
  }, [transfer, setPageHeader, clearPageHeader, breadcrumb, headerActions, canFullEdit, systemId]);

  // Update stock when branch changes
  React.useEffect(() => {
    if (!fromBranchId || !canFullEdit) return;
    
    const currentItems = fullEditForm.getValues('items');
    const updatedItems = currentItems.map(item => {
      const product = findProductById(asSystemId(item.productSystemId));
      const fromBranchStock = product?.inventoryByBranch?.[fromBranchId] || 0;
      const toBranchStock = toBranchId ? (product?.inventoryByBranch?.[toBranchId] || 0) : 0;
      return { ...item, fromBranchStock, toBranchStock };
    });
    
    fullEditForm.setValue('items', updatedItems);
  }, [fromBranchId, toBranchId, findProductById, fullEditForm, canFullEdit]);

  const handleAddProducts = (selectedProducts: typeof allProducts) => {
    selectedProducts.forEach(product => {
      // Check if already added
      const existingIndex = fields.findIndex(f => f.productSystemId === product.systemId);
      if (existingIndex >= 0) {
        toast.warning(`${product.name} đã có trong danh sách`);
        return;
      }

      const fromBranchStock = product.inventoryByBranch?.[fromBranchId] || 0;
      const toBranchStock = toBranchId ? (product.inventoryByBranch?.[toBranchId] || 0) : 0;
      const unitPrice = product.costPrice || 0;
      
      append({
        productSystemId: product.systemId,
        productId: product.id,
        productName: product.name,
        productImage: '', // Sẽ được load từ server khi render
        quantity: 1,
        fromBranchStock,
        toBranchStock,
        unitPrice,
        note: '',
      });
    });
    setIsProductDialogOpen(false);
  };

  const onFullEditSubmit = (data: FullEditFormData) => {
    if (!transfer || !currentEmployee) {
      toast.error('Không tìm thấy thông tin phiếu hoặc nhân viên');
      return;
    }

    // Validate quantities
    const invalidItems = data.items.filter(item => {
      const product = findProductById(asSystemId(item.productSystemId));
      const fromBranchStock = product?.inventoryByBranch?.[data.fromBranchSystemId] || 0;
      return item.quantity > fromBranchStock;
    });

    if (invalidItems.length > 0) {
      toast.error('Số lượng chuyển vượt quá tồn kho có sẵn');
      return;
    }

    const fromBranch = branches.find(b => b.systemId === data.fromBranchSystemId);
    const toBranch = branches.find(b => b.systemId === data.toBranchSystemId);

    if (!fromBranch || !toBranch) {
      toast.error('Chi nhánh không hợp lệ');
      return;
    }

    const referenceCode = data.referenceCode?.trim();
    const transferNote = data.note?.trim();

    setIsSubmitting(true);
    try {
      update(transfer.systemId, {
        fromBranchSystemId: asSystemId(data.fromBranchSystemId),
        fromBranchName: fromBranch.name,
        toBranchSystemId: asSystemId(data.toBranchSystemId),
        toBranchName: toBranch.name,
        ...(referenceCode ? { referenceCode } : {}),
        items: data.items.map(item => ({
          productSystemId: asSystemId(item.productSystemId),
          productId: asBusinessId(item.productId),
          productName: item.productName,
          quantity: item.quantity,
          ...(item.note?.trim() ? { note: item.note.trim() } : {}),
        })),
        ...(transferNote ? { note: transferNote } : {}),
        updatedBy: currentEmployee.systemId,
      });

      toast.success('Đã cập nhật phiếu chuyển kho');
      router.push(`/stock-transfers/${transfer.systemId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onLimitedEditSubmit = (data: LimitedEditFormData) => {
    if (!transfer || !currentEmployee) {
      toast.error('Không tìm thấy thông tin phiếu hoặc nhân viên');
      return;
    }

    const referenceCode = data.referenceCode?.trim();
    const transferNote = data.note?.trim();

    setIsSubmitting(true);
    try {
      const payload: Partial<StockTransfer> = {
        updatedBy: currentEmployee.systemId,
      };

      if (referenceCode) {
        payload.referenceCode = referenceCode;
      }

      if (transferNote) {
        payload.note = transferNote;
      }

      update(transfer.systemId, payload);

      toast.success('Đã cập nhật phiếu chuyển kho');
      router.push(`/stock-transfers/${transfer.systemId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Error states
  if (!transfer) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-lg font-semibold">Không tìm thấy phiếu chuyển kho</h2>
        <Button variant="link" onClick={() => router.push('/stock-transfers')}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-lg font-semibold">Không thể chỉnh sửa phiếu này</h2>
        <p className="text-muted-foreground mt-2">
          Phiếu có trạng thái "{getStatusLabel(transfer.status)}" không thể chỉnh sửa.
        </p>
        <Button variant="link" onClick={() => router.push(`/stock-transfers/${systemId}`)}>
          Quay lại chi tiết phiếu
        </Button>
      </div>
    );
  }

  // Calculate totals for full edit
  const totalQuantity = fields.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalValue = items.reduce((sum, item) => sum + ((item.quantity || 0) * (item.unitPrice || 0)), 0);

  // Render limited edit form
  if (canLimitedEdit) {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Phiếu đang trong trạng thái chuyển hàng. Chỉ có thể chỉnh sửa mã tham chiếu và ghi chú.
          </AlertDescription>
        </Alert>

        <form id="limited-edit-form" onSubmit={limitedEditForm.handleSubmit(onLimitedEditSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Thông tin có thể chỉnh sửa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Mã phiếu</Label>
                  <Input 
                    value={transfer.id} 
                    disabled 
                    className="h-9 bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Mã tham chiếu</Label>
                  <Input 
                    {...limitedEditForm.register('referenceCode')}
                    placeholder="Nhập mã tham chiếu (nếu có)..."
                    className="h-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Chi nhánh chuyển</Label>
                  <Input 
                    value={transfer.fromBranchName} 
                    disabled 
                    className="h-9 bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Chi nhánh nhận</Label>
                  <Input 
                    value={transfer.toBranchName} 
                    disabled 
                    className="h-9 bg-muted"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Ghi chú</Label>
                <Textarea
                  {...limitedEditForm.register('note')}
                  placeholder="Ghi chú cho phiếu chuyển kho..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Product List (read-only) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Danh sách sản phẩm (không thể chỉnh sửa)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead className="w-[60px]">Hình ảnh</TableHead>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead className="w-[90px] text-center">SL chuyển</TableHead>
                      <TableHead className="w-[130px] text-center">CN Chuyển (Trước → Sau)</TableHead>
                      <TableHead className="w-[130px] text-center">CN Nhận (Trước → Sau)</TableHead>
                      <TableHead className="w-[100px] text-right">Đơn giá</TableHead>
                      <TableHead className="w-[110px] text-right">Thành tiền</TableHead>
                      <TableHead className="w-[120px]">Ghi chú</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transfer.items.map((item, index) => {
                      const product = findProductById(item.productSystemId);
                      const currentFromStock = product?.inventoryByBranch?.[transfer.fromBranchSystemId] || 0;
                      const currentToStock = product?.inventoryByBranch?.[transfer.toBranchSystemId] || 0;
                      const unitPrice = product?.costPrice || 0;
                      const lineTotal = item.quantity * unitPrice;
                      
                      // Calculate before/after based on status
                      let fromBefore: number, fromAfter: number, toBefore: number, toAfter: number;
                      
                      if (transfer.status === 'completed') {
                        fromAfter = currentFromStock;
                        fromBefore = currentFromStock + item.quantity;
                        toAfter = currentToStock;
                        toBefore = currentToStock - item.quantity;
                      } else if (transfer.status === 'transferring') {
                        fromAfter = currentFromStock;
                        fromBefore = currentFromStock + item.quantity;
                        toBefore = currentToStock;
                        toAfter = currentToStock + item.quantity;
                      } else {
                        fromBefore = currentFromStock;
                        fromAfter = currentFromStock - item.quantity;
                        toBefore = currentToStock;
                        toAfter = currentToStock + item.quantity;
                      }
                      
                      return (
                        <TableRow key={index}>
                          <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                          <TableCell>
                            <ProductImage
                              productSystemId={item.productSystemId}
                              productData={product}
                              alt={item.productName}
                              size="md"
                            />
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{item.productName}</p>
                              <p className="text-sm text-muted-foreground">{item.productId}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-center font-medium">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-muted-foreground">{fromBefore}</span>
                            <span className="mx-1">→</span>
                            <span className={`font-medium ${fromAfter < fromBefore ? 'text-red-600' : 'text-muted-foreground'}`}>{fromAfter}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-muted-foreground">{toBefore}</span>
                            <span className="mx-1">→</span>
                            <span className="font-medium text-green-600">{toAfter}</span>
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {formatCurrency(unitPrice)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(lineTotal)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {item.note || '-'}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                
                <div className="mt-4 flex justify-end">
                  <div className="text-right space-y-1">
                    <p className="text-sm text-muted-foreground">Tổng số sản phẩm: {transfer.items.length}</p>
                    <p className="text-sm text-muted-foreground">Tổng số lượng: {transfer.items.reduce((sum, item) => sum + item.quantity, 0)}</p>
                    <p className="font-semibold">Tổng giá trị: {formatCurrency(transfer.items.reduce((sum, item) => {
                      const product = findProductById(item.productSystemId);
                      return sum + (item.quantity * (product?.costPrice || 0));
                    }, 0))}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    );
  }

  // Render full edit form (pending status)
  return (
    <div className="space-y-6">
      <form id="full-edit-form" onSubmit={fullEditForm.handleSubmit(onFullEditSubmit)} className="space-y-6">
        {/* Branch Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Thông tin chuyển kho</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mã phiếu</Label>
                <Input 
                  value={transfer.id} 
                  disabled 
                  className="h-9 bg-muted"
                />
                <p className="text-xs text-muted-foreground">Mã phiếu không thể thay đổi</p>
              </div>

              <div className="space-y-2">
                <Label>Mã tham chiếu</Label>
                <Input 
                  {...fullEditForm.register('referenceCode')}
                  placeholder="Nhập mã tham chiếu (nếu có)..."
                  className="h-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Chi nhánh chuyển <span className="text-destructive">*</span></Label>
                <Select
                  value={fromBranchId}
                  onValueChange={(value) => {
                    fullEditForm.setValue('fromBranchSystemId', value);
                    fullEditForm.setValue('items', []); // Clear items when branch changes
                  }}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Chọn chi nhánh chuyển" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map(b => (
                      <SelectItem 
                        key={b.systemId} 
                        value={b.systemId}
                        disabled={b.systemId === toBranchId}
                      >
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fullEditForm.formState.errors.fromBranchSystemId && (
                  <p className="text-sm text-destructive">{fullEditForm.formState.errors.fromBranchSystemId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Chi nhánh nhận <span className="text-destructive">*</span></Label>
                <Select
                  value={toBranchId}
                  onValueChange={(value) => fullEditForm.setValue('toBranchSystemId', value)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Chọn chi nhánh nhận" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map(b => (
                      <SelectItem 
                        key={b.systemId} 
                        value={b.systemId}
                        disabled={b.systemId === fromBranchId}
                      >
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fullEditForm.formState.errors.toBranchSystemId && (
                  <p className="text-sm text-destructive">{fullEditForm.formState.errors.toBranchSystemId.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Ghi chú</Label>
              <Textarea
                {...fullEditForm.register('note')}
                placeholder="Ghi chú cho phiếu chuyển kho..."
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
              disabled={!fromBranchId}
            >
              <Plus className="mr-2 h-4 w-4" />
              Thêm sản phẩm
            </Button>
          </CardHeader>
          <CardContent>
            {!fromBranchId && (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="mx-auto h-12 w-12 mb-2 opacity-50" />
                <p>Vui lòng chọn chi nhánh chuyển trước</p>
              </div>
            )}
            
            {fromBranchId && fields.length === 0 && (
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
            )}

            {fields.length > 0 && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">#</TableHead>
                      <TableHead className="w-[60px]">Hình ảnh</TableHead>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead className="w-[90px] text-center">SL chuyển</TableHead>
                      <TableHead className="w-[130px] text-center">CN Chuyển (Trước → Sau)</TableHead>
                      <TableHead className="w-[130px] text-center">CN Nhận (Trước → Sau)</TableHead>
                      <TableHead className="w-[100px] text-right">Đơn giá</TableHead>
                      <TableHead className="w-[110px] text-right">Thành tiền</TableHead>
                      <TableHead className="w-[120px]">Ghi chú</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => {
                      const linkedProduct = findProductById(asSystemId(field.productSystemId));
                      const quantity = items[index]?.quantity || 0;
                      const fromBefore = field.fromBranchStock || 0;
                      const fromAfter = fromBefore - quantity;
                      const toBefore = field.toBranchStock || 0;
                      const toAfter = toBefore + quantity;
                      const unitPrice = field.unitPrice || 0;
                      const lineTotal = quantity * unitPrice;
                      
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
                          <TableCell>
                            <Input
                              type="number"
                              min={1}
                              max={field.fromBranchStock || 999}
                              {...fullEditForm.register(`items.${index}.quantity`, { valueAsNumber: true })}
                              className="h-9 w-full text-center"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-muted-foreground">{fromBefore}</span>
                            <span className="mx-1">→</span>
                            <span className={`font-medium ${fromAfter < 0 ? 'text-red-600' : 'text-orange-600'}`}>{fromAfter}</span>
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-muted-foreground">{toBefore}</span>
                            <span className="mx-1">→</span>
                            <span className="font-medium text-green-600">{toAfter}</span>
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {formatCurrency(unitPrice)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(lineTotal)}
                          </TableCell>
                          <TableCell>
                            <Input
                              {...fullEditForm.register(`items.${index}.note`)}
                              placeholder="Ghi chú..."
                              className="h-9 w-full"
                            />
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
                    <p className="text-sm text-muted-foreground">Tổng số sản phẩm: {fields.length}</p>
                    <p className="text-sm text-muted-foreground">Tổng số lượng: {totalQuantity}</p>
                    <p className="font-semibold">Tổng giá trị: {formatCurrency(totalValue)}</p>
                  </div>
                </div>
              </div>
            )}
            
            {fullEditForm.formState.errors.items && (
              <p className="text-sm text-destructive mt-2">{fullEditForm.formState.errors.items.message}</p>
            )}
          </CardContent>
        </Card>
      </form>

      {/* Product Selection Dialog */}
      <ProductSelectionDialog
        isOpen={isProductDialogOpen}
        onOpenChange={setIsProductDialogOpen}
        onSelect={handleAddProducts}
        branchSystemId={fromBranchId}
      />
    </div>
  );
}
