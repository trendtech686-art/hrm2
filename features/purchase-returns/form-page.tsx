import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form';
import { formatDateCustom, parseDate, getCurrentDate, toISODate } from '@/lib/date-utils';
import { ArrowLeft, InfoIcon, AlertCircle } from 'lucide-react';

import { usePurchaseOrderStore } from '../purchase-orders/store.ts';
import { useSupplierStore } from '../suppliers/store.ts';
import { useBranchStore } from '../settings/branches/store.ts';
import { usePurchaseReturnStore } from './store.ts';
import type { PurchaseReturnLineItem } from './types.ts';
import { useAuth } from '../../contexts/auth-context.tsx';
import { useCashbookStore } from '../cashbook/store.ts';
import { usePaymentStore } from '../payments/store.ts';

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Button } from '../../components/ui/button.tsx';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '../../components/ui/form.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table.tsx';
import { NumberInput } from '../../components/ui/number-input.tsx';
import { Checkbox } from '../../components/ui/checkbox.tsx';
import { Textarea } from '../../components/ui/textarea.tsx';
import { Input } from '../../components/ui/input.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select.tsx';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import type { Payment } from '../payments/types.ts';
import { asBusinessId, asSystemId } from '@/lib/id-types';
// REMOVED: Voucher store no longer exists
// import { useVoucherStore } from '../vouchers/store.ts';
import { useInventoryReceiptStore } from '../inventory-receipts/store.ts';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip.tsx';
import { Alert, AlertDescription } from '../../components/ui/alert.tsx';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog.tsx';
import { useToast } from '../../hooks/use-toast.ts';

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
  returnId: string;  // Mã hoàn trả do người dùng nhập
  items: FormLineItem[];
  returnAll: boolean;
  reason: string;
  refundAmount: number;
  refundMethod: string;
  accountSystemId: string;
};

export function PurchaseReturnFormPage() {
  const { systemId: systemIdParam } = ReactRouterDOM.useParams<{ systemId: string }>();
  const navigate = ReactRouterDOM.useNavigate();

  // Stores
  const { data: allPurchaseOrders, findById: findPO } = usePurchaseOrderStore();
  const poSystemId = systemIdParam ? asSystemId(systemIdParam) : null;
  const po = poSystemId ? findPO(poSystemId) : null;
  const { findById: findSupplier } = useSupplierStore();
  const { findById: findBranch } = useBranchStore();
  const supplier = po ? findSupplier(asSystemId(po.supplierSystemId)) : null;
  const branch = po ? findBranch(asSystemId(po.branchSystemId)) : null;
  const { add: addReturn, data: allPurchaseReturns } = usePurchaseReturnStore();
  const { employee: authEmployee } = useAuth();
  const creatorName = authEmployee?.fullName || 'Hệ thống';
  const { accounts } = useCashbookStore();
  const { data: allPayments } = usePaymentStore();
  const { data: allInventoryReceipts } = useInventoryReceiptStore();
  const { toast } = useToast();
  // State for confirmation dialog
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [pendingSubmit, setPendingSubmit] = React.useState<PurchaseReturnFormValues | null>(null);
  
  const form = useForm<PurchaseReturnFormValues>({
    defaultValues: {
      returnId: '',
      items: [],
      returnAll: false,
      reason: '',
      refundAmount: 0,
      refundMethod: 'Tiền mặt',
      accountSystemId: '',
    },
  });

  const { control, handleSubmit, setValue, reset, getValues } = form;

  const { fields } = useFieldArray({
    control,
    name: "items",
  });

  // Check nếu chưa có phiếu nhập kho
  const receipts = React.useMemo(
    () => (po ? allInventoryReceipts.filter(r => r.purchaseOrderSystemId === asSystemId(po.systemId)) : []),
    [allInventoryReceipts, po]
  );

  React.useEffect(() => {
    if (po && receipts.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Không thể tạo phiếu trả',
        description: 'Đơn nhập hàng này chưa có phiếu nhập kho nào.'
      });
      navigate(-1);
    }
  }, [po, receipts, navigate, toast]);

  // Tính số lượng có thể hoàn trả cho mỗi sản phẩm
  const returnableQuantities = React.useMemo(() => {
    if (!po || !poSystemId) return {};

    const returns = allPurchaseReturns.filter(pr => pr.purchaseOrderSystemId === poSystemId);

    const quantities: Record<string, number> = {};

    po.lineItems.forEach(item => {
      const totalReceived = receipts.reduce((sum, receipt) => {
        const receiptItem = receipt.items.find(i => i.productSystemId === item.productSystemId);
        return sum + (receiptItem ? Number(receiptItem.receivedQuantity) : 0);
      }, 0);

      const totalReturned = returns.reduce((sum, pr) => {
        const returnItem = pr.items.find(i => i.productSystemId === item.productSystemId);
        return sum + (returnItem ? returnItem.returnQuantity : 0);
      }, 0);

      quantities[item.productSystemId] = totalReceived - totalReturned;
    });

    return quantities;
  }, [po, poSystemId, receipts, allPurchaseReturns]);

  React.useEffect(() => {
    if (po && receipts.length > 0) {
      const initialItems: FormLineItem[] = po.lineItems.map(item => {
        const productSystemId = asSystemId(item.productSystemId);
        const productId = asBusinessId(item.productId);

        return {
          productSystemId,
          productId,
          productName: item.productName,
          orderedQuantity: item.quantity,
          returnQuantity: 0,
          unitPrice: item.unitPrice,
          note: '',
          total: 0,
          returnableQuantity: returnableQuantities[item.productSystemId] || 0,
        };
      });

      const autoReturnId = "";

      const defaultCashAccount = accounts.find(acc => acc.type === 'cash' && acc.branchSystemId === branch?.systemId) || accounts.find(acc => acc.type === 'cash');
      reset({
        returnId: autoReturnId,
        items: initialItems,
        returnAll: false,
        reason: '',
        refundAmount: 0,
        refundMethod: 'Tiền mặt',
        accountSystemId: defaultCashAccount?.systemId || '',
      });
    }
  }, [po, branch, reset, accounts, returnableQuantities, receipts]);
  
  const watchedItems = useWatch({ control, name: "items" }) || [];
  const refundAmountValue = useWatch({ control, name: "refundAmount" });
  
  // Tổng giá trị hàng trả lần này
  const totalReturnValue = React.useMemo(() => {
    return watchedItems.reduce((sum, item) => sum + (item.total || 0), 0);
  }, [watchedItems]);
  
  // Các lần hoàn trả trước đây
  const previousReturns = React.useMemo(() => {
    if (!poSystemId) return [];
    return allPurchaseReturns.filter(pr => pr.purchaseOrderSystemId === poSystemId);
  }, [poSystemId, allPurchaseReturns]);

  const totalReturnedValue_Previously = React.useMemo(() => {
      return previousReturns.reduce((sum, pr) => sum + pr.totalReturnValue, 0);
  }, [previousReturns]);

  const totalRefunded_Previously = React.useMemo(() => {
      return previousReturns.reduce((sum, pr) => sum + pr.refundAmount, 0);
  }, [previousReturns]);

  // Total amount paid to supplier (payments to this PO)
  const totalPaid = React.useMemo(() => {
    if (!po) return 0;
    // Filter payments to this supplier/PO (check if payment references this PO)
    return allPayments
      .filter((p: Payment) => 
        p.status === 'completed' && 
        p.recipientTypeName === 'Nhà cung cấp' &&
        p.recipientName === supplier?.name
      )
      .reduce((sum, p) => sum + p.amount, 0);
  }, [po, allPayments, supplier]);
  
  // Logic tính số tiền tối đa có thể yêu cầu NCC hoàn lại
  const maxRefundableAmount = React.useMemo(() => {
    if (!po) return 0;
    
    // Giá trị hàng còn giữ lại sau khi trả lần này
    const valueOfGoodsKept = po.grandTotal - totalReturnedValue_Previously - totalReturnValue;
    
    // Số tiền ròng đã trả cho NCC (đã trừ các lần nhận hoàn lại)
    const netPaid = totalPaid - totalRefunded_Previously;
    
    // Số tiền có thể yêu cầu hoàn = Số đã trả - Giá trị hàng còn giữ
    const potentialRefund = netPaid - valueOfGoodsKept;
    
    return Math.max(0, potentialRefund);
  }, [po, totalPaid, totalReturnValue, totalReturnedValue_Previously, totalRefunded_Previously]);
  
  React.useEffect(() => {
    setValue('refundAmount', maxRefundableAmount);
  }, [maxRefundableAmount, setValue]);

  usePageHeader();

  // If no PO selected, show PO selection screen
  if (!systemIdParam) {
    // Filter POs that have been received (can be returned)
    const returnablePOs = allPurchaseOrders.filter(po => {
      const receiptsForPO = allInventoryReceipts.filter(r => r.purchaseOrderSystemId === asSystemId(po.systemId));
      return receiptsForPO.length > 0 && po.status !== 'Đã hủy';
    });

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="h-9" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Chọn đơn nhập hàng để tạo phiếu trả</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                Chọn đơn nhập hàng đã có phiếu nhập kho để tạo phiếu trả hàng
              </AlertDescription>
            </Alert>

            {returnablePOs.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                <p>Không có đơn nhập hàng nào đã nhập kho.</p>
                <p className="text-sm mt-2">Vui lòng nhập kho cho đơn hàng trước khi tạo phiếu trả.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {returnablePOs.map(po => {
                  const receiptsForPO = allInventoryReceipts.filter(r => r.purchaseOrderSystemId === asSystemId(po.systemId));
                  const totalReceived = receiptsForPO.reduce((sum, r) => 
                    sum + r.items.reduce((s, i) => s + i.receivedQuantity, 0), 0
                  );

                  return (
                    <Card 
                      key={po.systemId} 
                      className="cursor-pointer hover:border-primary transition-colors"
                      onClick={() => navigate(`/purchase-orders/${po.systemId}/return`)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{po.id}</p>
                            <p className="text-sm text-muted-foreground">{po.supplierName}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Đã nhập: {totalReceived} sản phẩm từ {receiptsForPO.length} phiếu
                            </p>
                          </div>
                          <Button variant="outline" size="sm" className="h-9">
                            Chọn
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!po) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <div className="text-center">
          <p className="text-lg font-semibold">Không tìm thấy đơn nhập hàng</p>
          <p className="text-sm text-muted-foreground mt-1">
            ID: {systemIdParam || 'Chưa có'}
          </p>
        </div>
        <Button onClick={() => navigate(-1)} variant="outline" className="h-9">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </div>
    );
  }

  if (!supplier || !branch) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <div className="text-center">
          <p className="text-lg font-semibold">Thiếu thông tin</p>
          <p className="text-sm text-muted-foreground mt-1">
            {!supplier && 'Không tìm thấy nhà cung cấp. '}
            {!branch && 'Không tìm thấy chi nhánh.'}
          </p>
        </div>
        <Button onClick={() => navigate(-1)} variant="outline" className="h-9">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </div>
    );
  }

  if (receipts.length === 0) {
    return null; // Đã navigate(-1) ở useEffect
  }

  const handleFormSubmit = (data: PurchaseReturnFormValues) => {
    const returnItems = data.items.filter(item => item.returnQuantity > 0);
    if (returnItems.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Chưa chọn sản phẩm',
        description: 'Vui lòng chọn ít nhất một sản phẩm để hoàn trả.'
      });
      return;
    }

    if (data.refundAmount > maxRefundableAmount) {
        form.setError('refundAmount', { type: 'manual', message: `Số tiền hoàn lại không được vượt quá ${formatCurrency(maxRefundableAmount)} VNĐ` });
        return;
    }
    
    if (data.refundAmount > 0 && !data.accountSystemId) {
        form.setError('accountSystemId', { type: 'manual', message: 'Vui lòng chọn tài khoản quỹ để nhận tiền hoàn lại từ nhà cung cấp.' });
        return;
    }

    // Validate returnId format (6 digits after TH)
    if (!data.returnId || !/^TH\d{6}$/.test(data.returnId)) {
      form.setError('returnId', { type: 'manual', message: 'Mã hoàn trả phải có format THxxxxxx (6 chữ số)' });
      return;
    }

    // Check duplicate returnId
    const isDuplicate = allPurchaseReturns.some(pr => pr.id === data.returnId);
    if (isDuplicate) {
      form.setError('returnId', { type: 'manual', message: 'Mã hoàn trả đã tồn tại' });
      return;
    }

    // Show confirmation dialog
    setPendingSubmit(data);
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = () => {
    if (!pendingSubmit) return;

    const returnItems = pendingSubmit.items.filter(item => item.returnQuantity > 0);
    
    addReturn({
      id: asBusinessId(pendingSubmit.returnId),
      purchaseOrderSystemId: asSystemId(po.systemId),
      purchaseOrderId: asBusinessId(po.id),
      supplierSystemId: asSystemId(supplier.systemId),
      supplierName: supplier.name,
      branchSystemId: asSystemId(branch.systemId),
      branchName: branch.name,
      returnDate: toISODate(getCurrentDate()),
      reason: pendingSubmit.reason,
      items: returnItems.map(item => ({
        productSystemId: item.productSystemId,
        productId: item.productId,
        productName: item.productName,
        orderedQuantity: item.orderedQuantity,
        returnQuantity: item.returnQuantity,
        unitPrice: item.unitPrice,
        note: item.note,
      })),
      totalReturnValue: totalReturnValue,
      refundAmount: pendingSubmit.refundAmount,
      refundMethod: pendingSubmit.refundMethod,
      accountSystemId: pendingSubmit.accountSystemId ? asSystemId(pendingSubmit.accountSystemId) : undefined,
      creatorName,
    });
    
    setShowConfirmDialog(false);
    setPendingSubmit(null);
    toast({
      title: 'Đã tạo phiếu trả',
      description: pendingSubmit.returnId ? `Phiếu ${pendingSubmit.returnId} đã được lưu.` : 'Phiếu trả NCC đã được lưu.'
    });
    navigate(`/purchase-orders/${po.systemId}`);
  };

  const itemsWithQty = watchedItems.filter(item => item.returnQuantity > 0);

  return (
    <>
    <Form {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" type="button" onClick={() => navigate(-1)} className="h-9 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Đơn nhập hàng {po.id}
            </Button>
            <div className="flex items-center gap-2">
                <Button type="submit" variant="default" className="h-9">Xác nhận hoàn trả</Button>
            </div>
        </div>

        {/* Alert: Công nợ tổng quan */}
        {po && supplier && (
          <Card className="mb-6 border-blue-200 bg-blue-50/50">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground">Nhà cung cấp</p>
                  <p className="font-semibold text-base">{supplier.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Tổng đơn hàng</p>
                  <p className="font-semibold text-base">{formatCurrency(po.grandTotal)} VNĐ</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Đã thanh toán</p>
                  <p className="font-semibold text-base text-green-600">{formatCurrency(totalPaid)} VNĐ</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground">Còn phải trả NCC</p>
                  <p className="font-semibold text-base text-red-600">{formatCurrency(Math.max(0, po.grandTotal - totalPaid))} VNĐ</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Cột bên trái: Sản phẩm + Hoàn tiền */}
            <div className="lg:col-span-2 space-y-6">
                {/* Card: Danh sách sản phẩm hoàn trả */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Danh sách sản phẩm hoàn trả</CardTitle>
                        <FormField control={control} name="returnAll" render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value as boolean}
                                        onCheckedChange={(checked) => {
                                            field.onChange(checked);
                                            const currentItems = getValues('items');
                                            currentItems.forEach((item, index) => {
                                                const newQty = checked ? item.returnableQuantity : 0;
                                                setValue(`items.${index}.returnQuantity`, newQty);
                                                setValue(`items.${index}.total`, newQty * item.unitPrice);
                                            });
                                        }}
                                    />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">Hoàn trả toàn bộ</FormLabel>
                            </FormItem>
                        )} />
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Mã SKU</TableHead>
                                    <TableHead>Tên sản phẩm</TableHead>
                                    <TableHead className="w-40">Số lượng hoàn</TableHead>
                                    <TableHead className="text-right">Đơn giá</TableHead>
                                    <TableHead className="text-right">Thành tiền</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fields.map((field, index) => (
                                        <TableRow key={field.id}>
                                            <TableCell className="font-mono text-sm align-top">{field.productId}</TableCell>
                                            <TableCell className="align-top">
                                              <div>{field.productName}</div>
                                              <Controller
                                                control={control}
                                                name={`items.${index}.note`}
                                                render={({ field: noteField }) => (
                                                  <Input
                                                    {...noteField}
                                                    placeholder="Ghi chú (VD: Hàng lỗi, sai màu...)"
                                                    className="mt-2 h-9 text-xs"
                                                    value={noteField.value || ''}
                                                  />
                                                )}
                                              />
                                            </TableCell>
                                            <TableCell className="align-top">
                                                <div className="flex items-center gap-2">
                                                    <Controller control={control} name={`items.${index}.returnQuantity`} render={({ field: qtyField }) => (
                                                        <NumberInput 
                                                          {...qtyField} 
                                                          className="h-9 text-center" 
                                                          format={false} 
                                                          min={0} 
                                                          max={field.returnableQuantity}
                                                          onChange={(val) => {
                                                              qtyField.onChange(val);
                                                              setValue(`items.${index}.total`, val * field.unitPrice);
                                                              setValue('returnAll', false);
                                                          }}
                                                        />
                                                    )} />
                                                    <span className="text-muted-foreground text-sm">/ {field.returnableQuantity}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right align-top">{formatCurrency(field.unitPrice)} VNĐ</TableCell>
                                            <TableCell className="text-right font-semibold align-top">{formatCurrency(watchedItems[index]?.total || 0)} VNĐ</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                         <div className="flex justify-end mt-4">
                            <div className="w-full max-w-sm space-y-2">
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-muted-foreground">Tổng giá trị hàng hoàn trả</span>
                                  <span className="font-bold text-lg">{formatCurrency(totalReturnValue)} VNĐ</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Card: Nhận tiền hoàn lại từ NCC */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                      <CardTitle>Nhận tiền hoàn lại từ nhà cung cấp</CardTitle>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="h-4 w-4 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm">
                            <p className="text-xs">
                              Số tiền tối đa có thể nhận lại = (Tổng đã trả NCC - Tổng đã nhận lại trước đó) - Giá trị hàng còn giữ sau khi hoàn trả lần này
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                         <FormField control={control} name="refundAmount" rules={{ max: { value: maxRefundableAmount, message: `Không thể hoàn lại nhiều hơn ${formatCurrency(maxRefundableAmount)} VNĐ` } }} render={({ field }) => (
                            <FormItem>
                                <FormLabel>Số tiền nhận lại từ NCC</FormLabel>
                                <FormControl><NumberInput {...field} value={field.value as number} onChange={field.onChange} /></FormControl>
                                <FormDescription>Tối đa: {formatCurrency(maxRefundableAmount)} VNĐ</FormDescription>
                                <FormMessage />
                            </FormItem>
                         )} />
                         {refundAmountValue > 0 && (
                            <>
                            <FormField control={control} name="refundMethod" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Hình thức nhận tiền</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value as string}>
                                        <FormControl><SelectTrigger className="h-9"><SelectValue /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="Tiền mặt">Tiền mặt</SelectItem>
                                            <SelectItem value="Chuyển khoản">Chuyển khoản</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )} />
                            <FormField control={control} name="accountSystemId" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tài khoản quỹ nhận tiền</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value as string}>
                                        <FormControl><SelectTrigger className="h-9"><SelectValue placeholder="Chọn tài khoản" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            {accounts.map(acc => <SelectItem key={acc.systemId} value={acc.systemId}>{acc.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            </>
                         )}
                    </CardContent>
                </Card>
            </div>

            {/* Cột bên phải: Thông tin NCC, Chi nhánh, Lịch sử, Lý do */}
            <div className="space-y-6">
                <Card>
                    <CardHeader><CardTitle>Mã hoàn trả</CardTitle></CardHeader>
                    <CardContent>
                      <FormField control={control} name="returnId" render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="VD: TH000001"
                              className="font-mono h-9"
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Tự động tạo hoặc bạn có thể sửa (Format: THxxxxxx - 6 chữ số)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Nhà cung cấp</CardTitle></CardHeader>
                    <CardContent className="text-sm space-y-1">
                        <p className="font-semibold text-primary text-base">{supplier.name}</p>
                        {supplier.phone && <p className="text-muted-foreground">{supplier.phone}</p>}
                        {supplier.email && <p className="text-muted-foreground">{supplier.email}</p>}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Chi nhánh hoàn trả</CardTitle></CardHeader>
                    <CardContent className="text-sm">
                        <p className="font-medium">{branch.name}</p>
                    </CardContent>
                </Card>

                {/* Lịch sử hoàn trả trước đó */}
                {previousReturns.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Lịch sử hoàn trả ({previousReturns.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        {previousReturns.slice(0, 3).map(pr => (
                          <div key={pr.id} className="flex justify-between items-start pb-3 border-b last:border-0">
                            <div>
                              <p className="font-medium">{pr.id}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDateCustom(parseDate(pr.returnDate) || getCurrentDate(), 'dd/MM/yyyy')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{formatCurrency(pr.totalReturnValue)} VNĐ</p>
                              {pr.refundAmount > 0 && (
                                <p className="text-xs text-green-600">Hoàn: {formatCurrency(pr.refundAmount)} VNĐ</p>
                              )}
                            </div>
                          </div>
                        ))}
                        {previousReturns.length > 3 && (
                          <p className="text-xs text-muted-foreground text-center">
                            Còn {previousReturns.length - 3} phiếu khác...
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                    <CardHeader><CardTitle>Lý do hoàn trả chung</CardTitle></CardHeader>
                    <CardContent>
                        <FormField control={control} name="reason" render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  placeholder="Ví dụ: Hàng không đúng chất lượng, sai sót trong đơn hàng, thừa hàng..." 
                                  value={field.value as string}
                                  rows={4}
                                  className="resize-none"
                                />
                              </FormControl>
                              <FormDescription className="text-xs">
                                Ghi rõ lý do để dễ tra cứu sau này. Có thể thêm ghi chú riêng cho từng sản phẩm ở bảng trên.
                              </FormDescription>
                            </FormItem>
                        )} />
                    </CardContent>
                </Card>
            </div>
        </div>
      </form>
    </Form>

    {/* Confirmation Dialog */}
    <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận hoàn trả hàng</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3 text-sm">
              <p>Bạn có chắc chắn muốn hoàn trả với thông tin sau?</p>
              <div className="bg-muted p-3 rounded-md space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mã hoàn trả:</span>
                  <span className="font-semibold">{pendingSubmit?.returnId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Số sản phẩm:</span>
                  <span className="font-semibold">{itemsWithQty.length} loại</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tổng số lượng:</span>
                  <span className="font-semibold">{itemsWithQty.reduce((sum, item) => sum + item.returnQuantity, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Giá trị hàng trả:</span>
                  <span className="font-bold text-base">{formatCurrency(totalReturnValue)} VNĐ</span>
                </div>
                {pendingSubmit && pendingSubmit.refundAmount > 0 && (
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-muted-foreground">Tiền nhận lại:</span>
                    <span className="font-bold text-green-600">{formatCurrency(pendingSubmit.refundAmount)} VNĐ</span>
                  </div>
                )}
              </div>
              <Alert variant="default" className="bg-yellow-50 border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800 text-xs ml-2">
                  Sau khi hoàn trả, số lượng sản phẩm sẽ được cập nhật trong kho và không thể hoàn tác!
                </AlertDescription>
              </Alert>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="h-9" onClick={() => {
            setShowConfirmDialog(false);
            setPendingSubmit(null);
          }}>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction className="h-9" onClick={handleConfirmSubmit}>
            Xác nhận hoàn trả
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
