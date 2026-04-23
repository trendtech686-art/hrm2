'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import { useStockTransferMutations } from '../hooks/use-stock-transfers';
import { useAllBranches } from '@/features/settings/branches/hooks/use-all-branches';
import { useProductFinder } from '@/features/products/hooks/use-all-products';
import { useStorageLocationFinder } from '@/features/settings/inventory/hooks/use-storage-locations';
import { useEmployeeFinder } from '@/features/employees/hooks/use-all-employees';
import { useAuth } from '@/contexts/auth-context';
import { usePageHeader } from '@/contexts/page-header-context';
import { ROUTES } from '@/lib/router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormPageShell, mobileBleedCardClass } from '@/components/layout/page-section';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Package, Save, X, ChevronDown, ChevronRight, PackageOpen } from 'lucide-react';
import { ProductThumbnailCell } from '@/components/shared/read-only-products-table';
import { ImagePreviewDialog } from '@/components/ui/image-preview-dialog';
import { toast } from 'sonner';
import { asSystemId, asBusinessId } from '@/lib/id-types';
import { formatDateCustom, getCurrentDate } from '@/lib/date-utils';
import { ProductSelectionDialog } from '@/features/shared/product-selection-dialog';
import { UnifiedProductSearch } from '@/components/shared/unified-product-search';
import { BarcodeScannerButton } from '@/components/shared/barcode-scanner-button';
import { StockTransferWorkflowCard } from '../components/stock-transfer-workflow-card';
import type { Subtask } from '@/components/shared/subtask-list';
import type { Product } from '@/features/products/types';

interface ComboItem {
  productSystemId: string;
  quantity: number;
  product?: Product;
}

const formSchema = z.object({
  customId: z.string().optional(),
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

type FormData = z.infer<typeof formSchema>;

export function StockTransferFormPage() {
  const router = useRouter();
  const { create: createMutation } = useStockTransferMutations({
    onCreateSuccess: (transfer) => {
      toast.success('Đã tạo phiếu chuyển kho', { description: `Mã: ${transfer.id}` });
      router.push(`/stock-transfers/${transfer.systemId}`);
    },
    onError: (error) => {
      toast.error('Lỗi', { description: error.message });
    }
  });
  const { data: branches } = useAllBranches();
  const { findById: findProductById } = useProductFinder();
  const { findById: findEmployeeById } = useEmployeeFinder();
  const { user } = useAuth();
  const { setPageHeader, clearPageHeader } = usePageHeader();
  
  const { findBySystemId: findStorageLocationBySystemId } = useStorageLocationFinder();
  
  const [isProductDialogOpen, setIsProductDialogOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [customIdError, setCustomIdError] = React.useState<string | null>(null);
  const [subtasks, setSubtasks] = React.useState<Subtask[]>([]);
  const [expandedCombos, setExpandedCombos] = React.useState<Record<string, boolean>>({});
  const [previewState, setPreviewState] = React.useState<{ open: boolean; image: string; title: string }>({
    open: false, image: '', title: ''
  });

  const toggleComboRow = React.useCallback((key: string) => {
    setExpandedCombos(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handlePreview = React.useCallback((image: string, title: string) => {
    setPreviewState({ open: true, image, title });
  }, []);

  const getStorageLocationName = React.useCallback((product: Product | undefined) => {
    if (!product?.storageLocationSystemId) return '---';
    const loc = findStorageLocationBySystemId(product.storageLocationSystemId);
    return loc?.name || '---';
  }, [findStorageLocationBySystemId]);

  // Auto-generated ID will be handled by API
  const nextTransferId = '';

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customId: '',
      fromBranchSystemId: '',
      toBranchSystemId: '',
      referenceCode: '',
      items: [],
      note: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const fromBranchId = form.watch('fromBranchSystemId');
  const toBranchId = form.watch('toBranchSystemId');
  const customId = form.watch('customId');
  const items = form.watch('items');

  // Get branch names for display
  const fromBranch = React.useMemo(() => branches.find(b => b.systemId === fromBranchId), [branches, fromBranchId]);
  const toBranch = React.useMemo(() => branches.find(b => b.systemId === toBranchId), [branches, toBranchId]);

  // Check if any item has invalid quantity (exceeds stock)
  const hasInvalidItems = React.useMemo(() => {
    return items.some(item => {
      const product = findProductById(asSystemId(item.productSystemId));
      const fromBranchStock = product?.inventoryByBranch?.[asSystemId(fromBranchId)] || 0;
      return item.quantity > fromBranchStock || fromBranchStock <= 0;
    });
  }, [items, fromBranchId, findProductById]);

  // Validate custom ID when it changes
  React.useEffect(() => {
    if (customId?.trim()) {
      // Note: isBusinessIdExists needs to be implemented in hook
      // For now, skip validation
      setCustomIdError(null);
    } else {
      setCustomIdError(null);
    }
  }, [customId]);

  // Header actions
  const headerActions = React.useMemo(() => (
    <div className="flex items-center gap-2">
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => router.push(ROUTES.INVENTORY.STOCK_TRANSFERS)}
        disabled={isSubmitting}
      >
        <X className="mr-2 h-4 w-4" />
        Hủy
      </Button>
        <Button 
        type="button" 
        disabled={fields.length === 0 || isSubmitting || !!customIdError || hasInvalidItems}
        onClick={() => {
          const formEl = document.getElementById('stock-transfer-form') as HTMLFormElement | null;
          if (formEl) {
            formEl.requestSubmit();
          } else {
            toast.error('Lỗi: Không tìm thấy form');
          }
        }}
      >
        <Save className="mr-2 h-4 w-4" />
        {isSubmitting ? 'Đang tạo...' : 'Tạo phiếu'}
      </Button>
    </div>
  ), [router, fields.length, isSubmitting, customIdError, hasInvalidItems]);

  // Breadcrumb
  const breadcrumb = React.useMemo(() => {
    return [
      { label: 'Trang chủ', href: ROUTES.ROOT },
      { label: 'Chuyển kho', href: ROUTES.INVENTORY.STOCK_TRANSFERS },
      { label: 'Tạo phiếu', href: '' },
    ];
  }, []);

  React.useEffect(() => {
    setPageHeader({
      title: 'Tạo phiếu chuyển kho',
      breadcrumb,
      showBackButton: true,
      backPath: ROUTES.INVENTORY.STOCK_TRANSFERS,
      actions: headerActions,
    });
    return () => clearPageHeader();
  }, [setPageHeader, clearPageHeader, breadcrumb, headerActions, nextTransferId, customId]);

  // Get current user info
  const currentEmployee = React.useMemo(() => {
    if (!user?.employeeId) return null;
    return findEmployeeById(asSystemId(user.employeeId));
  }, [user, findEmployeeById]);

  // Filter products that have stock in fromBranch - handled by ProductSelectionDialog
  // Removed: _availableProducts was unused

  // Update stock when branch changes
  React.useEffect(() => {
    if (!fromBranchId) return;
    
    const currentItems = form.getValues('items');
    const updatedItems = currentItems.map(item => {
      const product = findProductById(asSystemId(item.productSystemId));
      const fromBranchStock = product?.inventoryByBranch?.[asSystemId(fromBranchId)] || 0;
      const toBranchStock = toBranchId ? (product?.inventoryByBranch?.[asSystemId(toBranchId)] || 0) : 0;
      return { ...item, fromBranchStock, toBranchStock };
    });
    
    form.setValue('items', updatedItems);
  }, [fromBranchId, toBranchId, findProductById, form]);

  const handleAddProducts = (selectedProducts: Product[]) => {
    selectedProducts.forEach(product => {
      handleAddSingleProduct(product);
    });
    setIsProductDialogOpen(false);
  };

  const handleAddSingleProduct = (product: Product) => {
    // Check if already added
    const existingIndex = fields.findIndex(f => f.productSystemId === product.systemId);
    if (existingIndex >= 0) {
      toast.warning(`${product.name} đã có trong danh sách`);
      return;
    }

    const fromBranchStock = product.inventoryByBranch?.[asSystemId(fromBranchId)] || 0;
    const toBranchStock = toBranchId ? (product.inventoryByBranch?.[asSystemId(toBranchId)] || 0) : 0;
    const unitPrice = product.costPrice || 0;

    // Cảnh báo nếu sản phẩm hết hàng
    if (fromBranchStock <= 0) {
      toast.warning(`${product.name} không có tồn kho tại chi nhánh chuyển`);
    }
    
    append({
      productSystemId: product.systemId,
      productId: product.id,
      productName: product.name,
      productImage: '',
      quantity: 1,
      fromBranchStock,
      toBranchStock,
      unitPrice,
      note: '',
    });
  };

  const onSubmit = async (data: FormData) => {
    if (!currentEmployee) {
      toast.error('Không tìm thấy thông tin nhân viên');
      return;
    }

    // Validate quantities
    const invalidItems = data.items.filter(item => {
      const product = findProductById(asSystemId(item.productSystemId));
      const fromBranchStock = product?.inventoryByBranch?.[asSystemId(data.fromBranchSystemId)] || 0;
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

    const now = formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm');
    const referenceCode = data.referenceCode?.trim();
    const transferNote = data.note?.trim();

    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync({
        id: asBusinessId(data.customId?.trim() || nextTransferId),
        fromBranchSystemId: asSystemId(data.fromBranchSystemId),
        fromBranchName: fromBranch.name,
        toBranchSystemId: asSystemId(data.toBranchSystemId),
        toBranchName: toBranch.name,
        ...(referenceCode ? { referenceCode } : {}),
        status: 'pending', // API will convert to uppercase for Prisma
        items: data.items.map(item => ({
          productSystemId: asSystemId(item.productSystemId),
          productId: asBusinessId(item.productId),
          productName: item.productName,
          quantity: item.quantity,
          ...(item.note?.trim() ? { note: item.note.trim() } : {}),
        })),
        createdDate: now,
        createdBySystemId: currentEmployee.systemId,
        createdByName: currentEmployee.fullName,
        ...(transferNote ? { note: transferNote } : {}),
        createdBy: currentEmployee.systemId,
        updatedBy: currentEmployee.systemId,
      });

      // Note: toast and redirect are handled in onCreateSuccess callback
    } catch (error) {
      console.error('[StockTransfer] Create error:', error);
      // Error toast is handled in onError callback
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalQuantity = fields.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalValue = items.reduce((sum, item) => sum + ((item.quantity || 0) * (item.unitPrice || 0)), 0);
  
  const formatCurrency = (value: number) => value.toLocaleString('vi-VN') + ' đ';

  // Handle form validation errors
  const onFormError = (errors: Record<string, unknown>) => {
    console.error('[StockTransfer Form] Validation errors:', errors);
    const errorMessages = Object.entries(errors)
      .map(([key, value]) => `${key}: ${(value as { message?: string })?.message || 'Lỗi không xác định'}`)
      .join(', ');
    toast.error('Vui lòng kiểm tra lại thông tin', { description: errorMessages });
  };

  return (
    <FormPageShell gap="lg">
      <form id="stock-transfer-form" onSubmit={form.handleSubmit(onSubmit, onFormError)} className="space-y-6">
        {/* Row 1: Thông tin chuyển kho (70%) + Quy trình xử lý (30%) */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
          {/* Thông tin chuyển kho - 70% */}
          <Card className={cn(mobileBleedCardClass, 'lg:col-span-7')}>
            <CardHeader>
              <CardTitle size="lg">Thông tin chuyển kho</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Mã phiếu</Label>
                  <Input 
                    {...form.register('customId')}
                    placeholder={nextTransferId}
                  />
                  {customIdError ? (
                    <p className="text-xs text-destructive">{customIdError}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Để trống để tự động tạo mã: {nextTransferId}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Mã tham chiếu</Label>
                  <Input 
                    {...form.register('referenceCode')}
                    placeholder="Nhập mã tham chiếu (nếu có)..."
                  />
                  <p className="text-xs text-muted-foreground">Mã từ hệ thống khác hoặc mã nội bộ</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Chi nhánh chuyển <span className="text-destructive">*</span></Label>
                  <Select
                    value={fromBranchId}
                    onValueChange={(value) => {
                      form.setValue('fromBranchSystemId', value);
                      form.setValue('items', []); // Clear items when branch changes
                      // Nếu chi nhánh chuyển mới trùng với chi nhánh nhận, reset chi nhánh nhận
                      if (value === toBranchId) {
                        form.setValue('toBranchSystemId', '');
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn chi nhánh chuyển" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map(b => (
                        <SelectItem 
                          key={b.systemId} 
                          value={b.systemId}
                        >
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.fromBranchSystemId && (
                    <p className="text-sm text-destructive">{form.formState.errors.fromBranchSystemId.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Chi nhánh nhận <span className="text-destructive">*</span></Label>
                  <Select
                    value={toBranchId}
                    onValueChange={(value) => {
                      form.setValue('toBranchSystemId', value);
                      // Nếu chi nhánh nhận mới trùng với chi nhánh chuyển, reset chi nhánh chuyển và items
                      if (value === fromBranchId) {
                        form.setValue('fromBranchSystemId', '');
                        form.setValue('items', []);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn chi nhánh nhận" />
                    </SelectTrigger>
                    <SelectContent>
                      {branches.map(b => (
                        <SelectItem 
                          key={b.systemId} 
                          value={b.systemId}
                        >
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.toBranchSystemId && (
                    <p className="text-sm text-destructive">{form.formState.errors.toBranchSystemId.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Ghi chú</Label>
                <Textarea
                  {...form.register('note')}
                  placeholder="Ghi chú cho phiếu chuyển kho..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Quy trình xử lý - 30% */}
          <div className="lg:col-span-3">
            <StockTransferWorkflowCard
              subtasks={subtasks}
              onSubtasksChange={setSubtasks}
              readonly={false}
            />
          </div>
        </div>

        {/* Product List */}
        <Card className={mobileBleedCardClass}>
          <CardHeader>
            <CardTitle size="lg">Danh sách sản phẩm</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Search bar like order form */}
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <UnifiedProductSearch
                    onSelectProduct={handleAddSingleProduct}
                    disabled={!fromBranchId}
                    placeholder="Thêm sản phẩm (F3)"
                    searchPlaceholder="Tìm kiếm theo tên, mã SKU, barcode..."
                    excludeTypes={['combo', 'service']}
                    branchSystemId={fromBranchId}
                    showCostPrice={true}
                  />
                </div>
                <BarcodeScannerButton
                  disabled={!fromBranchId}
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
                      handleAddSingleProduct(match);
                      toast.success(`Đã thêm: ${match.name}`);
                    } catch {
                      toast.error('Không thể tra cứu mã vạch. Thử lại.');
                    }
                  }}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  className="shrink-0" 
                  onClick={() => setIsProductDialogOpen(true)} 
                  disabled={!fromBranchId}
                >
                  Chọn nhanh
                </Button>
              </div>
            </div>

            {!fromBranchId && (
              <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-md">
                <Package className="mx-auto h-12 w-12 mb-2 opacity-50" />
                <p>Vui lòng chọn chi nhánh chuyển trước</p>
              </div>
            )}
            
            {fromBranchId && fields.length === 0 && (
              <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-md">
                <PackageOpen className="mx-auto h-12 w-12 text-muted-foreground/40" />
                <p className="mt-4 text-sm">Chưa có sản phẩm nào</p>
                <Button
                  type="button"
                  variant="link"
                  className="mt-2"
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
                      <TableHead className="w-12.5">#</TableHead>
                      <TableHead className="w-15">Ảnh</TableHead>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead className="w-22.5 text-center">SL chuyển</TableHead>
                      <TableHead>Điểm lưu kho</TableHead>
                      <TableHead className="w-37.5 text-center">
                        <div className="flex flex-col">
                          <span>{fromBranch?.name || 'CN Chuyển'}</span>
                          <span className="text-xs font-normal text-muted-foreground">(Trước → Sau)</span>
                        </div>
                      </TableHead>
                      <TableHead className="w-37.5 text-center">
                        <div className="flex flex-col">
                          <span>{toBranch?.name || 'CN Nhận'}</span>
                          <span className="text-xs font-normal text-muted-foreground">(Trước → Sau)</span>
                        </div>
                      </TableHead>
                      <TableHead className="w-25 text-right">Đơn giá</TableHead>
                      <TableHead className="w-27.5 text-right">Thành tiền</TableHead>
                      <TableHead className="w-30">Ghi chú</TableHead>
                      <TableHead className="w-12.5"></TableHead>
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
                      
                      // Check if combo
                      const isCombo = !!(linkedProduct?.type === 'combo' && linkedProduct.comboItems?.length);
                      const comboKey = `${field.productSystemId}-${index}`;
                      const isComboExpanded = !!expandedCombos[comboKey];
                      const comboItems = isCombo
                        ? (linkedProduct?.comboItems ?? []).map((comboItem: ComboItem) => {
                            const childProduct = findProductById(asSystemId(comboItem.productSystemId));
                            return { ...comboItem, product: childProduct };
                          })
                        : [];
                      
                      return (
                        <React.Fragment key={field.id}>
                          <TableRow className={isCombo ? 'bg-muted/30' : ''}>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                {isCombo && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 p-0"
                                    onClick={() => toggleComboRow(comboKey)}
                                  >
                                    {isComboExpanded ? (
                                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                    )}
                                  </Button>
                                )}
                                <span className="text-muted-foreground">{index + 1}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <ProductThumbnailCell
                                productSystemId={field.productSystemId}
                                product={linkedProduct}
                                productName={field.productName}
                                size="sm"
                                onPreview={handlePreview}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-2">
                                  <Link href={`/products/${field.productSystemId}`}
                                    className="font-medium text-primary hover:underline"
                                  >
                                    {field.productName}
                                  </Link>
                                  {isCombo && (
                                    <span className="text-xs px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-semibold">
                                      COMBO
                                    </span>
                                  )}
                                </div>
                                <span className="text-sm text-muted-foreground">{field.productId}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <Input
                                  type="number"
                                  min={1}
                                  max={fromBefore > 0 ? fromBefore : 1}
                                  {...form.register(`items.${index}.quantity`, { valueAsNumber: true })}
                                  className={`w-full text-center ${fromAfter < 0 ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                />
                                {fromAfter < 0 && (
                                  <p className="text-xs text-red-600 text-center">Vượt tồn kho!</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{getStorageLocationName(linkedProduct)}</TableCell>
                            <TableCell className="text-center">
                              {fromBefore <= 0 ? (
                                <span className="text-red-600 font-medium">Hết hàng</span>
                              ) : (
                                <>
                                  <span className="text-muted-foreground">{fromBefore}</span>
                                  <span className="mx-1">→</span>
                                  <span className={`font-medium ${fromAfter < 0 ? 'text-red-600' : 'text-orange-600'}`}>{fromAfter}</span>
                                </>
                              )}
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
                                {...form.register(`items.${index}.note`)}
                                placeholder="Ghi chú..."
                                className="w-full"
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

                          {/* Combo child items */}
                          {isCombo && isComboExpanded && comboItems.length > 0 && (
                            comboItems.map((comboItem: ComboItem & { product?: Product }, childIndex: number) => {
                              const totalChildQuantity = comboItem.quantity * quantity;
                              const childStorageLocationName = getStorageLocationName(comboItem.product);
                              return (
                                <TableRow
                                  key={`${comboKey}-child-${comboItem.productSystemId}-${childIndex}`}
                                  className="bg-muted/40"
                                >
                                  <TableCell className="text-center text-muted-foreground pl-8">
                                    <span className="text-muted-foreground/60">└</span>
                                  </TableCell>
                                  <TableCell>
                                    {comboItem.product?.systemId ? (
                                      <ProductThumbnailCell 
                                        productSystemId={comboItem.product.systemId}
                                        product={comboItem.product}
                                        productName={comboItem.product?.name || field.productName}
                                        size="sm"
                                        onPreview={handlePreview}
                                      />
                                    ) : (
                                      <div className="w-10 h-9 bg-muted rounded flex items-center justify-center">
                                        <Package className="h-4 w-4 text-muted-foreground" />
                                      </div>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex flex-col gap-0.5 text-sm">
                                      <span className="font-medium text-foreground">
                                        {comboItem.product?.name || 'Sản phẩm không tồn tại'}
                                      </span>
                                      {comboItem.product && (
                                        <Link href={`/products/${comboItem.product.systemId}`}
                                          className="text-xs text-muted-foreground hover:text-primary hover:underline"
                                        >
                                          {comboItem.product.id}
                                        </Link>
                                      )}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-center text-muted-foreground">{totalChildQuantity}</TableCell>
                                  <TableCell className="text-muted-foreground">{childStorageLocationName}</TableCell>
                                  <TableCell className="text-center text-muted-foreground">---</TableCell>
                                  <TableCell className="text-center text-muted-foreground">---</TableCell>
                                  <TableCell className="text-right text-muted-foreground">---</TableCell>
                                  <TableCell className="text-right text-muted-foreground">---</TableCell>
                                  <TableCell></TableCell>
                                  <TableCell></TableCell>
                                </TableRow>
                              );
                            })
                          )}
                        </React.Fragment>
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
        branchSystemId={fromBranchId}
      />

      {/* Image Preview Dialog */}
      <ImagePreviewDialog 
        open={previewState.open} 
        onOpenChange={(open) => setPreviewState(prev => ({ ...prev, open }))} 
        images={[previewState.image]} 
        title={previewState.title}
      />
    </FormPageShell>
  );
}
