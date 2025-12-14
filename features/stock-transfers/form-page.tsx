import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link } from 'react-router-dom';
import { useStockTransferStore } from './store.ts';
import { useBranchStore } from '../settings/branches/store.ts';
import { useProductStore } from '../products/store.ts';
import { useStorageLocationStore } from '../settings/inventory/storage-location-store.ts';
import { useEmployeeStore } from '../employees/store.ts';
import { useAuth } from '../../contexts/auth-context.tsx';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { useRouteMeta } from '../../hooks/use-route-meta.ts';
import { ROUTES } from '../../lib/router.ts';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Button } from '../../components/ui/button.tsx';
import { Input } from '../../components/ui/input.tsx';
import { Label } from '../../components/ui/label.tsx';
import { Textarea } from '../../components/ui/textarea.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table.tsx';
import { Plus, Trash2, Package, Save, X, ChevronDown, ChevronRight, Eye } from 'lucide-react';
import { ProductThumbnailCell } from '../../components/shared/read-only-products-table.tsx';
import { ImagePreviewDialog } from '../../components/ui/image-preview-dialog.tsx';
import { toast } from 'sonner';
import { asSystemId, asBusinessId, type SystemId } from '../../lib/id-types.ts';
import { formatDateCustom, getCurrentDate } from '@/lib/date-utils';
import { ProductSelectionDialog } from '../shared/product-selection-dialog.tsx';
import { StockTransferWorkflowCard } from './components/stock-transfer-workflow-card.tsx';
import type { Subtask } from '../../components/shared/subtask-list.tsx';

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
  const navigate = ReactRouterDOM.useNavigate();
  const { add, getNextId, isBusinessIdExists } = useStockTransferStore();
  const { data: branches } = useBranchStore();
  const { data: allProducts, findById: findProductById } = useProductStore();
  const { findById: findEmployeeById } = useEmployeeStore();
  const { user } = useAuth();
  const { setPageHeader, clearPageHeader } = usePageHeader();
  const routeMeta = useRouteMeta();
  
  const { findBySystemId: findStorageLocationBySystemId } = useStorageLocationStore();
  
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

  const getStorageLocationName = React.useCallback((product: any) => {
    if (!product?.storageLocationSystemId) return '---';
    const loc = findStorageLocationBySystemId(product.storageLocationSystemId);
    return loc?.name || '---';
  }, [findStorageLocationBySystemId]);

  // Get next transfer ID for display
  const nextTransferId = React.useMemo(() => getNextId(), [getNextId]);

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

  // Validate custom ID when it changes
  React.useEffect(() => {
    if (customId?.trim()) {
      if (isBusinessIdExists(customId.trim())) {
        setCustomIdError('Mã phiếu này đã tồn tại');
      } else {
        setCustomIdError(null);
      }
    } else {
      setCustomIdError(null);
    }
  }, [customId, isBusinessIdExists]);

  // Header actions
  const headerActions = React.useMemo(() => (
    <div className="flex items-center gap-2">
      <Button 
        type="button" 
        variant="outline" 
        className="h-9"
        onClick={() => navigate(ROUTES.INVENTORY.STOCK_TRANSFERS)}
        disabled={isSubmitting}
      >
        <X className="mr-2 h-4 w-4" />
        Hủy
      </Button>
        <Button 
        type="submit" 
        form="stock-transfer-form" 
        className="h-9"
        disabled={fields.length === 0 || isSubmitting || !!customIdError}
      >
        <Save className="mr-2 h-4 w-4" />
        {isSubmitting ? 'Đang tạo...' : 'Tạo phiếu'}
      </Button>
    </div>
  ), [navigate, fields.length, isSubmitting]);

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

  // Filter products that have stock in fromBranch
  const availableProducts = React.useMemo(() => {
    if (!fromBranchId) return [];
    return allProducts.filter(p => {
      if (p.type === 'combo' || p.type === 'service') return false;
      const stock = p.inventoryByBranch?.[fromBranchId] || 0;
      return stock > 0;
    });
  }, [allProducts, fromBranchId]);

  // Update stock when branch changes
  React.useEffect(() => {
    if (!fromBranchId) return;
    
    const currentItems = form.getValues('items');
    const updatedItems = currentItems.map(item => {
      const product = findProductById(asSystemId(item.productSystemId));
      const fromBranchStock = product?.inventoryByBranch?.[fromBranchId] || 0;
      const toBranchStock = toBranchId ? (product?.inventoryByBranch?.[toBranchId] || 0) : 0;
      return { ...item, fromBranchStock, toBranchStock };
    });
    
    form.setValue('items', updatedItems);
  }, [fromBranchId, toBranchId, findProductById, form]);

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

  const onSubmit = (data: FormData) => {
    if (!currentEmployee) {
      toast.error('Không tìm thấy thông tin nhân viên');
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

    const now = formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm');
    const referenceCode = data.referenceCode?.trim();
    const transferNote = data.note?.trim();

    setIsSubmitting(true);
    try {
      const newTransfer = add({
        id: (data.customId?.trim() || nextTransferId) as any,
        fromBranchSystemId: asSystemId(data.fromBranchSystemId),
        fromBranchName: fromBranch.name,
        toBranchSystemId: asSystemId(data.toBranchSystemId),
        toBranchName: toBranch.name,
        ...(referenceCode ? { referenceCode } : {}),
        status: 'pending',
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

      toast.success('Đã tạo phiếu chuyển kho');
      navigate(`/stock-transfers/${newTransfer.systemId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalQuantity = fields.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalValue = items.reduce((sum, item) => sum + ((item.quantity || 0) * (item.unitPrice || 0)), 0);
  
  const formatCurrency = (value: number) => value.toLocaleString('vi-VN') + ' đ';

  return (
    <div className="space-y-6">
      <form id="stock-transfer-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Row 1: Thông tin chuyển kho (70%) + Quy trình xử lý (30%) */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
          {/* Thông tin chuyển kho - 70% */}
          <Card className="lg:col-span-7">
            <CardHeader>
              <CardTitle className="text-h3">Thông tin chuyển kho</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Mã phiếu</Label>
                  <Input 
                    {...form.register('customId')}
                    placeholder={nextTransferId}
                    className="h-9"
                  />
                  {customIdError ? (
                    <p className="text-body-xs text-destructive">{customIdError}</p>
                  ) : (
                    <p className="text-body-xs text-muted-foreground">
                      Để trống để tự động tạo mã: {nextTransferId}
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
                  <p className="text-body-xs text-muted-foreground">Mã từ hệ thống khác hoặc mã nội bộ</p>
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
                  {form.formState.errors.fromBranchSystemId && (
                    <p className="text-body-sm text-destructive">{form.formState.errors.fromBranchSystemId.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Chi nhánh nhận <span className="text-destructive">*</span></Label>
                  <Select
                    value={toBranchId}
                    onValueChange={(value) => form.setValue('toBranchSystemId', value)}
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
                  {form.formState.errors.toBranchSystemId && (
                    <p className="text-body-sm text-destructive">{form.formState.errors.toBranchSystemId.message}</p>
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-h3">Danh sách sản phẩm</CardTitle>
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
                      <TableHead className="w-[60px]">Ảnh</TableHead>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead className="w-[90px] text-center">SL chuyển</TableHead>
                      <TableHead>Điểm lưu kho</TableHead>
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
                      
                      // Check if combo
                      const isCombo = !!(linkedProduct?.type === 'combo' && linkedProduct.comboItems?.length);
                      const comboKey = `${field.productSystemId}-${index}`;
                      const isComboExpanded = !!expandedCombos[comboKey];
                      const comboItems = isCombo
                        ? (linkedProduct?.comboItems ?? []).map((comboItem: any) => {
                            const childProduct = allProducts.find(p => p.systemId === comboItem.productSystemId);
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
                                  <Link 
                                    to={`/products/${field.productSystemId}`}
                                    className="font-medium text-primary hover:underline"
                                  >
                                    {field.productName}
                                  </Link>
                                  {isCombo && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-semibold">
                                      COMBO
                                    </span>
                                  )}
                                </div>
                                <span className="text-body-sm text-muted-foreground">{field.productId}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min={1}
                                max={field.fromBranchStock || 999}
                                {...form.register(`items.${index}.quantity`, { valueAsNumber: true })}
                                className="h-9 w-full text-center"
                              />
                            </TableCell>
                            <TableCell>{getStorageLocationName(linkedProduct)}</TableCell>
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
                                {...form.register(`items.${index}.note`)}
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

                          {/* Combo child items */}
                          {isCombo && isComboExpanded && comboItems.length > 0 && (
                            comboItems.map((comboItem: any, childIndex: number) => {
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
                                        <Link
                                          to={`/products/${comboItem.product.systemId}`}
                                          className="text-body-xs text-muted-foreground hover:text-primary hover:underline"
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
                    <p className="text-body-sm text-muted-foreground">Tổng số sản phẩm: {fields.length}</p>
                    <p className="text-body-sm text-muted-foreground">Tổng số lượng: {totalQuantity}</p>
                    <p className="font-semibold">Tổng giá trị: {formatCurrency(totalValue)}</p>
                  </div>
                </div>
              </div>
            )}
            
            {form.formState.errors.items && (
              <p className="text-body-sm text-destructive mt-2">{form.formState.errors.items.message}</p>
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
    </div>
  );
}
