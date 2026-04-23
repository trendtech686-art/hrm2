'use client'

/**
 * PurchaseReturnForOrderPage - Direct return page for a specific purchase order
 * 
 * This page is accessed via /purchase-orders/[systemId]/return
 * UI matches the design with product table on left, info cards on right
 */

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { CreditCard, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { usePageHeader } from '../../contexts/page-header-context';
import { mobileBleedCardClass } from '@/components/layout/page-section';
import { cn } from '@/lib/utils';

import { usePurchaseOrder } from '../purchase-orders/hooks/use-purchase-orders';
import { useSupplierFinder } from '../suppliers/hooks/use-all-suppliers';
import { useBranchFinder } from '../settings/branches/hooks/use-all-branches';
import { usePurchaseReturnMutations } from './hooks/use-purchase-returns';
import { useAllPurchaseReturns } from './hooks/use-all-purchase-returns';
import type { PurchaseReturnLineItem } from '@/lib/types/prisma-extended';
import { useAuth } from '../../contexts/auth-context';
import { useAllCashAccounts } from '../cashbook/hooks/use-all-cash-accounts';
import { usePurchaseOrderInventoryReceipts, usePurchaseOrderPayments } from '../purchase-orders/hooks/use-po-related-data';
import { useAllPaymentMethods } from '../settings/payments/hooks/use-all-payment-methods';
import { sumPaymentsForPurchaseOrder } from '../purchase-orders/payment-utils';

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../../components/ui/form';
import { CurrencyInput } from '../../components/ui/currency-input';
import { Checkbox } from '../../components/ui/checkbox';
import { Textarea } from '../../components/ui/textarea';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { asBusinessId, asSystemId } from '@/lib/id-types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { getCurrentDate, toISODate } from '@/lib/date-utils';
import { ROUTES } from '../../lib/router';

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number' || isNaN(value)) return '0';
  return new Intl.NumberFormat('vi-VN').format(value);
};

type FormLineItem = PurchaseReturnLineItem & {
  total: number;
  returnableQuantity: number;
  note?: string;
};

type PurchaseReturnFormValues = {
  returnId: string;
  items: FormLineItem[];
  returnAll: boolean;
  reason: string;
  refundAmount: number;
  createReceipt: boolean;
  accountSystemId: string;
  paymentMethodSystemId: string;
};

export function PurchaseReturnForOrderPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const router = useRouter();

  // Load purchase order
  const { data: purchaseOrder, isLoading: isLoadingPO } = usePurchaseOrder(systemId);
  const { findById: findSupplier } = useSupplierFinder();
  const { findById: findBranch } = useBranchFinder();
  const supplier = purchaseOrder ? findSupplier(asSystemId(purchaseOrder.supplierSystemId)) : null;
  const branch = purchaseOrder ? findBranch(asSystemId(purchaseOrder.branchSystemId)) : null;
  
  const { data: allPurchaseReturns = [] } = useAllPurchaseReturns();
  
  // Ref to store pending receipt data for creation after purchase return succeeds
  const pendingReceiptRef = React.useRef<{
    amount: number;
    description: string;
    accountSystemId: string;
    branchSystemId: string;
    branchName: string;
    payerName: string;
    payerSystemId: string;
    paymentMethodSystemId: string;
    paymentMethodName: string;
  } | null>(null);

  const { create } = usePurchaseReturnMutations({
    onCreateSuccess: async () => {
      toast.success('Tạo phiếu hoàn trả thành công');
      
      // Create receipt after purchase return succeeds
      if (pendingReceiptRef.current) {
        try {
          const receiptData = pendingReceiptRef.current;
          const response = await fetch('/api/receipts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...receiptData,
              payerTypeSystemId: 'NHACUNGCAP',
              payerTypeName: 'Nhà cung cấp',
              paymentReceiptTypeSystemId: 'THUNCC',
              paymentReceiptTypeName: 'Thu tiền NCC hoàn trả',
              category: 'other',
              status: 'completed',
              createdBy: authEmployee?.systemId,
              date: toISODate(getCurrentDate()),
              affectsDebt: false,
            }),
          });

          if (response.ok) {
            const receipt = await response.json();
            toast.success(`Đã tạo phiếu thu ${receipt.data?.id || receipt.id}`);
          } else {
            const error = await response.json();
            toast.error(`Lỗi tạo phiếu thu: ${error.message || 'Không xác định'}`);
          }
        } catch (error) {
          console.error('Error creating receipt:', error);
          toast.error('Lỗi tạo phiếu thu');
        } finally {
          pendingReceiptRef.current = null;
        }
      }
      
      router.push(`${ROUTES.PROCUREMENT.PURCHASE_ORDERS}/${systemId}`);
    },
    onError: (err) => {
      toast.error(err.message);
      pendingReceiptRef.current = null; // Clear pending receipt on error
    }
  });
  
  const { employee: authEmployee } = useAuth();
  const creatorName = authEmployee?.fullName || 'Hệ thống';
  const { accounts } = useAllCashAccounts();
  const { data: paymentMethods } = useAllPaymentMethods();
  
  // ⚡ PERFORMANCE: Only fetch data for this specific PO
  const { data: poInventoryReceipts } = usePurchaseOrderInventoryReceipts(systemId);
  const { data: poPayments } = usePurchaseOrderPayments(systemId);
  
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [pendingSubmit, setPendingSubmit] = React.useState<PurchaseReturnFormValues | null>(null);

  // Check if PO has been paid (to allow refund)
  const totalPaidOnPO = React.useMemo(() => {
    if (!purchaseOrder || !poPayments) return 0;
    return sumPaymentsForPurchaseOrder(poPayments, purchaseOrder);
  }, [purchaseOrder, poPayments]);

  const hasPaidSomething = totalPaidOnPO > 0;

  const form = useForm<PurchaseReturnFormValues>({
    defaultValues: {
      returnId: '',
      items: [],
      returnAll: false,
      reason: '',
      refundAmount: 0,
      createReceipt: true, // Auto create receipt if amount > 0
      accountSystemId: '',
      paymentMethodSystemId: '',
    },
  });

  const { control, handleSubmit, setValue, reset, getValues, watch } = form;
  const { fields } = useFieldArray({ control, name: "items" });

  // Check inventory receipts for this PO - already filtered by API
  const receipts = poInventoryReceipts;

  // Check if order was received
  const hasReceivedGoods = React.useMemo(() => {
    if (receipts.length > 0) return true;
    if (purchaseOrder?.deliveryStatus === 'Đã nhập') return true;
    return false;
  }, [receipts, purchaseOrder]);

  // Calculate returnable quantities
  const returnableQuantities = React.useMemo(() => {
    if (!purchaseOrder) return {};

    const returns = allPurchaseReturns.filter(pr => pr.purchaseOrderSystemId === purchaseOrder.systemId);
    const quantities: Record<string, number> = {};

    purchaseOrder.lineItems.forEach(item => {
      let totalReceived = 0;
      if (receipts.length > 0) {
        totalReceived = receipts.reduce((sum, receipt) => {
          const receiptItem = receipt.items.find(i => i.productSystemId === item.productSystemId);
          return sum + (receiptItem ? Number(receiptItem.receivedQuantity) : 0);
        }, 0);
      } else if (purchaseOrder.deliveryStatus === 'Đã nhập') {
        totalReceived = item.quantity;
      }

      const totalReturned = returns.reduce((sum, pr) => {
        const returnItem = pr.items.find(i => i.productSystemId === item.productSystemId);
        return sum + (returnItem ? returnItem.returnQuantity : 0);
      }, 0);

      quantities[item.productSystemId] = totalReceived - totalReturned;
    });

    return quantities;
  }, [purchaseOrder, receipts, allPurchaseReturns]);

  // Initialize form when PO loads
  React.useEffect(() => {
    if (purchaseOrder && hasReceivedGoods) {
      const initialItems: FormLineItem[] = purchaseOrder.lineItems.map(item => ({
        productSystemId: asSystemId(item.productSystemId),
        productId: asBusinessId(item.productId),
        productName: item.productName,
        orderedQuantity: item.quantity,
        returnQuantity: 0,
        unitPrice: item.unitPrice,
        note: '',
        total: 0,
        returnableQuantity: returnableQuantities[item.productSystemId] || 0,
      }));

      const defaultCashAccount = accounts.find(acc => acc.type === 'cash' && acc.branchSystemId === branch?.systemId) || accounts.find(acc => acc.type === 'cash');
      reset({
        returnId: '',
        items: initialItems,
        returnAll: false,
        reason: '',
        refundAmount: 0,
        createReceipt: true,
        accountSystemId: defaultCashAccount?.systemId || '',
      });
    }
  }, [purchaseOrder, branch, reset, accounts, returnableQuantities, hasReceivedGoods]);

  const watchedItemsRaw = useWatch({ control, name: "items" });
  const watchedItems = React.useMemo(() => watchedItemsRaw || [], [watchedItemsRaw]);
  const _refundAmountValue = watch('refundAmount'); // Kept for potential future use

  // Calculate totals
  const totalReturnQty = React.useMemo(() => {
    return watchedItems.reduce((sum, item) => sum + (item.returnQuantity || 0), 0);
  }, [watchedItems]);

  const totalReturnValue = React.useMemo(() => {
    return watchedItems.reduce((sum, item) => sum + (item.returnQuantity * item.unitPrice), 0);
  }, [watchedItems]);

  const hasReturnItems = totalReturnQty > 0;

  // Handle return all toggle
  const handleReturnAllChange = (checked: boolean) => {
    setValue('returnAll', checked);
    if (checked) {
      const items = getValues('items');
      items.forEach((item, index) => {
        setValue(`items.${index}.returnQuantity`, item.returnableQuantity);
      });
    } else {
      const items = getValues('items');
      items.forEach((_, index) => {
        setValue(`items.${index}.returnQuantity`, 0);
      });
    }
  };

  // Submit handler
  const onSubmit = (data: PurchaseReturnFormValues) => {
    if (!hasReturnItems) {
      toast.error('Vui lòng nhập số lượng sản phẩm cần hoàn trả');
      return;
    }

    // Validate quantities
    for (const item of data.items) {
      if (item.returnQuantity > item.returnableQuantity) {
        toast.error(`Số lượng hoàn trả của ${item.productName} vượt quá số lượng có thể hoàn trả`);
        return;
      }
    }

    // Validate refund amount - only if amount > 0
    const maxRefundAmount = Math.min(totalReturnValue, totalPaidOnPO);
    if (data.refundAmount > 0) {
      if (data.refundAmount > maxRefundAmount) {
        toast.error(`Số tiền hoàn trả không được vượt quá ${formatCurrency(maxRefundAmount)} VNĐ`);
        return;
      }
      if (!data.accountSystemId) {
        toast.error('Vui lòng chọn tài khoản nhận');
        return;
      }
    }

    setPendingSubmit(data);
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    if (!pendingSubmit || !purchaseOrder) return;

    const returnItems = pendingSubmit.items
      .filter(item => item.returnQuantity > 0)
      .map(item => ({
        productSystemId: item.productSystemId,
        productId: item.productId,
        productName: item.productName,
        orderedQuantity: item.orderedQuantity,
        returnQuantity: item.returnQuantity,
        unitPrice: item.unitPrice,
        note: item.note || '',
      }));

    // Create purchase return
    create.mutate({
      purchaseOrderSystemId: asSystemId(purchaseOrder.systemId),
      purchaseOrderId: asBusinessId(purchaseOrder.id),
      supplierSystemId: asSystemId(purchaseOrder.supplierSystemId),
      supplierName: supplier?.name || purchaseOrder.supplierName || '',
      branchSystemId: asSystemId(purchaseOrder.branchSystemId),
      branchName: branch?.name || purchaseOrder.branchName || '',
      returnDate: toISODate(getCurrentDate()),
      items: returnItems,
      reason: pendingSubmit.reason,
      refundAmount: pendingSubmit.refundAmount,
      refundMethod: pendingSubmit.refundAmount > 0 ? 'Phiếu thu' : 'Công nợ',
      totalReturnValue: totalReturnValue,
      creatorName: creatorName,
      createdBy: authEmployee?.systemId ? asSystemId(authEmployee.systemId) : undefined,
    });

    // Store receipt data for creation after purchase return succeeds
    if (pendingSubmit.refundAmount > 0 && pendingSubmit.accountSystemId) {
      const selectedAccount = accounts.find(a => a.systemId === pendingSubmit.accountSystemId);
      const selectedPaymentMethod = paymentMethods?.find(pm => pm.systemId === pendingSubmit.paymentMethodSystemId);
      
      pendingReceiptRef.current = {
        amount: pendingSubmit.refundAmount,
        description: `Nhận hoàn tiền từ NCC ${supplier?.name || purchaseOrder.supplierName} - Đơn ${purchaseOrder.id}`,
        accountSystemId: pendingSubmit.accountSystemId,
        branchSystemId: purchaseOrder.branchSystemId,
        branchName: branch?.name || purchaseOrder.branchName || '',
        payerName: supplier?.name || purchaseOrder.supplierName || '',
        payerSystemId: purchaseOrder.supplierSystemId,
        paymentMethodSystemId: pendingSubmit.paymentMethodSystemId || (selectedAccount?.type === 'bank' ? 'CHUYENKHOAN' : 'TIENMAT'),
        paymentMethodName: selectedPaymentMethod?.name || (selectedAccount?.type === 'bank' ? 'Chuyển khoản' : 'Tiền mặt'),
      };
    } else {
      pendingReceiptRef.current = null;
    }

    setShowConfirmDialog(false);
    setPendingSubmit(null);
  };

  // Header actions - defined before usePageHeader
  const headerActions = purchaseOrder ? (
    <Button 
      onClick={handleSubmit(onSubmit)} 
      disabled={!hasReturnItems || create.isPending}
    >
      {create.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Hoàn trả
    </Button>
  ) : null;

  // Page header using context - must be called before any early returns
  usePageHeader({
    title: purchaseOrder ? `Tạo hoàn trả cho đơn nhập ${purchaseOrder.id}` : 'Tạo hoàn trả',
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Đơn nhập hàng', href: ROUTES.PROCUREMENT.PURCHASE_ORDERS, isCurrent: false },
      ...(purchaseOrder ? [
        { label: purchaseOrder.id, href: `${ROUTES.PROCUREMENT.PURCHASE_ORDERS}/${systemId}`, isCurrent: false },
        { label: 'Hoàn trả', href: `${ROUTES.PROCUREMENT.PURCHASE_ORDERS}/${systemId}/return`, isCurrent: true },
      ] : []),
    ],
    actions: headerActions,
    showBackButton: true,
    backPath: `${ROUTES.PROCUREMENT.PURCHASE_ORDERS}/${systemId}`,
  });

  // Loading state
  if (isLoadingPO) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Not found
  if (!purchaseOrder) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-h2 mb-4">Không tìm thấy đơn hàng</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Đơn hàng với mã {systemId} không tồn tại hoặc đã bị xóa.
          </p>
          <Button onClick={() => router.push(ROUTES.PROCUREMENT.PURCHASE_ORDERS)}>
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  // Not received
  if (!hasReceivedGoods) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-h2 mb-4">Không thể tạo phiếu trả</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Đơn nhập hàng này chưa được nhập kho. Vui lòng nhập kho trước khi hoàn trả.
          </p>
          <Button onClick={() => router.push(`${ROUTES.PROCUREMENT.PURCHASE_ORDERS}/${systemId}`)}>
            Quay lại đơn hàng
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left - Product table */}
            <div className="lg:col-span-2">
              <Card className={mobileBleedCardClass}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>Thông tin sản phẩm trả</CardTitle>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="returnAll"
                        checked={getValues('returnAll')}
                        onCheckedChange={handleReturnAllChange}
                      />
                      <label htmlFor="returnAll" className="text-sm cursor-pointer">
                        Trả toàn bộ sản phẩm
                      </label>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Table header */}
                  <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-gray-50 border-y text-sm font-medium text-muted-foreground">
                    <div className="col-span-2">Mã SKU</div>
                    <div className="col-span-4">Tên sản phẩm</div>
                    <div className="col-span-2 text-right">Số lượng</div>
                    <div className="col-span-2 text-right">Giá hàng trả</div>
                    <div className="col-span-2 text-right">Thành tiền</div>
                  </div>

                  {/* Table body */}
                  {fields.map((field, index) => {
                    const item = watchedItems[index];
                    const lineTotal = (item?.returnQuantity || 0) * (item?.unitPrice || 0);
                    
                    return (
                      <div key={field.id} className="grid grid-cols-12 gap-2 px-4 py-3 border-b items-center">
                        <div className="col-span-2">
                          <Link 
                            href={`/products/${field.productSystemId}`}
                            className="text-primary hover:underline text-sm"
                          >
                            {field.productId}
                          </Link>
                        </div>
                        <div className="col-span-4 text-sm">
                          {field.productName}
                        </div>
                        <div className="col-span-2 flex items-center justify-end gap-1">
                          <FormField
                            control={control}
                            name={`items.${index}.returnQuantity`}
                            render={({ field: formField }) => (
                              <FormItem className="mb-0">
                                <FormControl>
                                  <Input
                                    type="number"
                                    value={formField.value}
                                    onChange={(e) => formField.onChange(Number(e.target.value))}
                                    min={0}
                                    max={fields[index].returnableQuantity}
                                    className="w-16 h-8 text-right text-sm"
                                    disabled={fields[index].returnableQuantity <= 0}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <span className="text-muted-foreground text-sm">/ {field.returnableQuantity}</span>
                        </div>
                        <div className="col-span-2 text-right text-sm">
                          {formatCurrency(field.unitPrice)}
                        </div>
                        <div className="col-span-2 text-right text-sm font-medium">
                          {formatCurrency(lineTotal)}
                        </div>
                      </div>
                    );
                  })}

                  {/* Summary section */}
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Số lượng hàng trả</span>
                      <span className="font-medium">{totalReturnQty}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Giá trị hàng trả</span>
                      <span>{formatCurrency(totalReturnValue)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-primary">Chi phí</span>
                      <span>0</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-primary">VAT</span>
                      <span>0</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Chiết khấu</span>
                      <span>0</span>
                    </div>
                    <div className="flex justify-between text-sm pt-2 border-t">
                      <span className="text-primary font-medium">Tổng giá trị hàng trả</span>
                      <span className="font-medium">{formatCurrency(totalReturnValue)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Refund section */}
              <Card className={cn(mobileBleedCardClass, 'mt-6')}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="uppercase">
                      Nhận tiền hoàn lại từ nhà cung cấp
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {!hasPaidSomething ? (
                    <p className="text-sm text-muted-foreground">
                      Bạn không thể nhận tiền hoàn cho đơn nhập chưa có thanh toán
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {/* Display max refund amount */}
                      <div className="text-sm">
                        <span className="text-muted-foreground">Số tiền có thể nhận lại: </span>
                        <span className="font-medium text-primary">
                          {formatCurrency(Math.min(totalReturnValue, totalPaidOnPO))}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Refund amount input */}
                        <FormField
                          control={control}
                          name="refundAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nhập số tiền nhận lại</FormLabel>
                              <FormControl>
                                <CurrencyInput
                                  value={field.value}
                                  onChange={field.onChange}
                                  max={Math.min(totalReturnValue, totalPaidOnPO)}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />

                        {/* Payment method dropdown */}
                        <FormField
                          control={control}
                          name="paymentMethodSystemId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Chọn hình thức thanh toán</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn hình thức" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {paymentMethods?.map(pm => (
                                    <SelectItem key={pm.systemId} value={pm.systemId}>
                                      {pm.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />

                        {/* Cash account dropdown */}
                        <FormField
                          control={control}
                          name="accountSystemId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tài khoản nhận</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn tài khoản" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {accounts.map(acc => (
                                    <SelectItem key={acc.systemId} value={acc.systemId}>
                                      {acc.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right - Info cards */}
            <div className="space-y-6">
              {/* Supplier info */}
              <Card className={mobileBleedCardClass}>
                <CardHeader className="pb-2">
                  <CardTitle>Nhà cung cấp</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link 
                    href={`${ROUTES.PROCUREMENT.SUPPLIERS}/${purchaseOrder.supplierSystemId}`}
                    className="text-primary hover:underline"
                  >
                    {supplier?.name || purchaseOrder.supplierName || '-'}
                  </Link>
                </CardContent>
              </Card>

              {/* Branch info */}
              <Card className={mobileBleedCardClass}>
                <CardHeader className="pb-2">
                  <CardTitle>Chi nhánh hoàn trả</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    {branch?.name || purchaseOrder.branchName || '-'}
                  </p>
                </CardContent>
              </Card>

              {/* Return reason */}
              <Card className={mobileBleedCardClass}>
                <CardHeader className="pb-2">
                  <CardTitle>Lý do hoàn trả</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea 
                            placeholder="Nhập lý do hoàn trả..." 
                            className="min-h-20 resize-none"
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </Form>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận hoàn trả</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                <span>Bạn có chắc chắn muốn tạo phiếu hoàn trả?</span>
                <div className="bg-muted p-3 rounded-md space-y-1 text-sm text-foreground">
                  <div className="flex justify-between">
                    <span>Số lượng sản phẩm trả:</span>
                    <span className="font-medium">{totalReturnQty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tổng giá trị hàng trả:</span>
                    <span className="font-medium">{formatCurrency(totalReturnValue)}</span>
                  </div>
                  {pendingSubmit && pendingSubmit.refundAmount > 0 && (
                    <div className="flex justify-between text-primary">
                      <span>Tạo phiếu thu:</span>
                      <span className="font-medium">{formatCurrency(pendingSubmit.refundAmount)}</span>
                    </div>
                  )}
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit}>
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
