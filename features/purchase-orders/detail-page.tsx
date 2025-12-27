'use client'

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ROUTES } from '../../lib/router';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate, getDaysDiff, toISODate, toISODateTime } from '@/lib/date-utils';
import { useForm } from 'react-hook-form';
import { usePurchaseOrderStore } from './store';
import { useSupplierStore } from '../suppliers/store';
import { usePaymentStore } from '../payments/store';
import { useReceiptStore } from '../receipts/store';
import { usePageHeader } from '../../contexts/page-header-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '../../components/ui/table';
import { Separator } from '../../components/ui/separator';
import { ArrowLeft, Users, FileWarning, Package, Truck, CheckCircle2, Edit, Printer, Undo2, History, Plus, Edit2, ChevronDown, ChevronRight, Banknote, Landmark, Lock, Trash2, MoreVertical, Wallet, CreditCard, AlertCircle, Eye } from 'lucide-react';
import { useProductImage } from '../products/components/product-image';
import { cn } from '../../lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogFooter as FormDialogFooter } from '../../components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '../../components/ui/dropdown-menu';
import { useInventoryReceiptStore } from '../inventory-receipts/store';
import { useProductStore } from '../products/store';
import { useStockHistoryStore } from '../stock-history/store';
import { usePaymentTypeStore } from '../settings/payments/types/store';
import { useCashbookStore } from '../cashbook/store';
import { useBranchStore } from '../settings/branches/store';
import { asBusinessId, asSystemId } from '@/lib/id-types';
import type { Payment } from '../payments/types';
import type { Receipt } from '../receipts/types';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../../components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Input } from '../../components/ui/input';
import { NumberInput } from '../../components/ui/number-input';
import { DetailField } from '../../components/ui/detail-field';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { RelatedDataTable } from '../../components/data-table/related-data-table';
import type { ColumnDef } from '../../components/data-table/types';
import type { InventoryReceipt } from '../inventory-receipts/types';
import { ActivityHistory } from '../../components/ActivityHistory';
import { Comments, type Comment as CommentType } from '../../components/Comments';
import { Timeline, TimelineItem } from '../../components/ui/timeline';
import { usePurchaseReturnStore } from '../purchase-returns/store';
import type { PurchaseReturn, PurchaseReturnLineItem } from '../purchase-returns/types';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../contexts/auth-context';
import type { PurchaseOrder, PurchaseOrderPaymentStatus as PaymentStatus } from '@/lib/types/prisma-extended';
import { getPaymentsForPurchaseOrder, getReceiptsForPurchaseOrder, sumPaymentsForPurchaseOrder } from './payment-utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';
import { toast } from 'sonner';
import { ProductThumbnailCell } from '../../components/shared/read-only-products-table';
import { ImagePreviewDialog } from '../../components/ui/image-preview-dialog';
import { useProductTypeStore } from '../settings/inventory/product-type-store';
import { usePrint } from '../../lib/use-print';
import { 
  convertPurchaseOrderForPrint,
  mapPurchaseOrderToPrintData, 
  mapPurchaseOrderLineItems,
  createStoreSettings,
} from '../../lib/print/purchase-order-print-helper';
import { useStoreInfoStore } from '../settings/store-info/store-info-store';
import { 
  PrintData, 
  PrintLineItem,
  formatCurrency,
  formatTime,
  numberToWords,
  getStoreData,
  StoreSettings
} from '../../lib/print-mappers/types';
import { createPaymentDocument } from '../finance/document-helpers';
import { PurchaseOrderPaymentItem } from './components/payment-item';
import { useEmployeeStore } from '../employees/store';
import { mapPaymentToPrintData, PaymentForPrint } from '../../lib/print-mappers/payment.mapper';
import { mapReceiptToPrintData, ReceiptForPrint } from '../../lib/print-mappers/receipt.mapper';
import { 
  convertSupplierReturnForPrint,
  mapSupplierReturnToPrintData, 
  mapSupplierReturnLineItems,
  createStoreSettings as createSupplierReturnStoreSettings,
} from '../../lib/print/supplier-return-print-helper';



const StatusTimeline = ({ status, deliveryStatus, orderDate }: { status: string; deliveryStatus: string, orderDate: string }) => {
    let currentStep = 0;
    if (status === 'Hoàn thành' || status === 'Kết thúc' || status === 'Đã trả hàng') {
        currentStep = 2;
    } else if (deliveryStatus === 'Đã nhập' || deliveryStatus === 'Đã nhập một phần') {
        currentStep = 1;
    }

    const steps = [
        { name: 'Tạo đơn', date: formatDateCustom(orderDate, "dd/MM/yyyy HH:mm") }, 
        { name: 'Nhập hàng' }, 
        { name: 'Hoàn thành' }
    ];

    return (
        <div className="flex items-start justify-center pt-2">
            {steps.map((step, index) => (
                <React.Fragment key={index}>
                    <div className="flex flex-col items-center text-center w-28">
                        <div className={cn(
                            "flex items-center justify-center w-10 h-9 rounded-full border-2 text-body-sm font-bold",
                            index <= currentStep ? "bg-primary border-primary text-primary-foreground" : "border-border bg-muted text-muted-foreground"
                        )}>
                            <span>{index + 1}</span>
                        </div>
                        <p className={cn("text-body-sm mt-2 font-medium", index <= currentStep ? "text-foreground" : "text-muted-foreground")}>{step.name}</p>
                        {step.date && <p className="text-body-xs text-muted-foreground">{step.date}</p>}
                    </div>
                    {index < steps.length - 1 && (
                        <div className={cn("flex-1 mt-5 border-t-2", index < currentStep ? "border-primary" : "border-border")} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

type PaymentConfirmationFormValues = {
  paymentMethod: string;
  accountSystemId: string;
  amount: number;
  paymentDate: string;
  reference?: string;
};

function PaymentConfirmationDialog({
  isOpen,
  onOpenChange,
  amountRemaining,
  onSubmit,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  amountRemaining: number;
  onSubmit: (values: PaymentConfirmationFormValues) => void;
}) {
  const { accounts } = useCashbookStore();
  
  // Get default account for current payment method
  const getDefaultAccount = React.useCallback((type: 'cash' | 'bank') => {
    const filtered = accounts.filter(acc => acc.type === type && acc.isActive);
    const defaultAcc = filtered.find(acc => acc.isDefault);
    return defaultAcc?.systemId || filtered[0]?.systemId || '';
  }, [accounts]);
  
  const form = useForm<PaymentConfirmationFormValues>({
    defaultValues: {
      paymentMethod: 'Tiền mặt',
      accountSystemId: getDefaultAccount('cash'),
      amount: amountRemaining > 0 ? amountRemaining : 0,
      paymentDate: formatDateTime(getCurrentDate()),
      reference: '',
    },
  });

  const { control, handleSubmit, reset, watch, setValue } = form;
  const paymentMethod = watch('paymentMethod');

  // Filter accounts based on payment method
  const filteredAccounts = React.useMemo(() => {
    if (paymentMethod === 'Tiền mặt') {
      return accounts.filter(acc => acc.type === 'cash' && acc.isActive);
    } else if (paymentMethod === 'Chuyển khoản') {
      return accounts.filter(acc => acc.type === 'bank' && acc.isActive);
    }
    return [];
  }, [accounts, paymentMethod]);

  // Update accountSystemId when payment method changes
  React.useEffect(() => {
    const accountType = paymentMethod === 'Tiền mặt' ? 'cash' : 'bank';
    const defaultAccount = getDefaultAccount(accountType);
    if (defaultAccount) {
      setValue('accountSystemId', defaultAccount);
    }
  }, [paymentMethod, getDefaultAccount, setValue]);

  React.useEffect(() => {
    if (isOpen) {
        const defaultAccount = getDefaultAccount('cash');
        reset({
            paymentMethod: 'Tiền mặt',
            accountSystemId: defaultAccount,
            amount: amountRemaining > 0 ? amountRemaining : 0,
            paymentDate: formatDateTime(getCurrentDate()),
            reference: '',
        });
    }
  }, [isOpen, amountRemaining, reset, getDefaultAccount]);


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" open={isOpen}>
        <DialogHeader>
          <DialogTitle>Xác nhận thanh toán</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form id="payment-confirmation-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField control={control} name="paymentMethod" render={({ field }) => (
              <FormItem>
                <FormLabel>Phương thức thanh toán</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="Tiền mặt">Tiền mặt</SelectItem>
                    <SelectItem value="Chuyển khoản">Chuyển khoản</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}/>
            <FormField control={control} name="accountSystemId" render={({ field }) => (
              <FormItem>
                <FormLabel>Tài khoản</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value}
                >
                  <FormControl><SelectTrigger><SelectValue placeholder="Chọn tài khoản" /></SelectTrigger></FormControl>
                  <SelectContent>
                    {filteredAccounts.length === 0 ? (
                      <SelectItem value="no-account" disabled>
                        Không có tài khoản {paymentMethod === 'Tiền mặt' ? 'tiền mặt' : 'ngân hàng'}
                      </SelectItem>
                    ) : (
                      filteredAccounts.map((account) => (
                        <SelectItem key={account.systemId} value={account.systemId}>
                          {account.name} {account.bankAccountNumber ? `(${account.bankAccountNumber})` : ''}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </FormItem>
            )}/>
            <FormField control={control} name="amount" render={({ field }) => (
              <FormItem>
                <FormLabel>Số tiền</FormLabel>
                {/* FIX: Explicitly cast `field.value` to `number` to match the expected prop type of `NumberInput`. */}
                <FormControl><NumberInput {...field} value={field.value as number} /></FormControl>
              </FormItem>
            )}/>
            <FormField control={control} name="paymentDate" render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày thanh toán</FormLabel>
                <FormControl><Input {...field} /></FormControl>
              </FormItem>
            )}/>
             <FormField control={control} name="reference" render={({ field }) => (
              <FormItem>
                <FormLabel>Tham chiếu</FormLabel>
                <FormControl><Input {...field} placeholder="VD: Số hóa đơn, mã giao dịch..." /></FormControl>
              </FormItem>
            )}/>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Thoát</Button>
              <Button type="submit">Thanh toán</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// ChangeHistoryTab component removed - now using ActivityHistory component directly

import { 
  convertStockInForPrint,
  mapStockInToPrintData,
  mapStockInLineItems,
  createStoreSettings as createStockInStoreSettings,
} from '../../lib/print/stock-in-print-helper';

function InventoryReceiptDetailView({ 
  receipt, 
}: { 
  receipt: InventoryReceipt;
}) {
  const totalQuantity = receipt.items.reduce((sum, item) => sum + Number(item.receivedQuantity), 0);
  const totalValue = receipt.items.reduce((sum, item) => sum + (Number(item.receivedQuantity) * Number(item.unitPrice)), 0);

  return (
    <div className="p-6 bg-slate-100 dark:bg-slate-800/20">
      <div className="space-y-1 text-body-sm mb-6">
        <h3 className="text-h3">Thông tin phiếu nhập kho</h3>
        <p className="text-muted-foreground">Người nhập: {receipt.receiverName}</p>
        <p className="text-muted-foreground">Ghi chú: {receipt.notes || '-'}</p>
      </div>

      <div className="space-y-2">
        <h3 className="text-h3">Sản phẩm đã nhập</h3>
        <div className="border rounded-md bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã SP</TableHead>
                <TableHead>Tên sản phẩm</TableHead>
                <TableHead className="text-center">SL đặt</TableHead>
                <TableHead className="text-center">SL thực nhập</TableHead>
                <TableHead className="text-right">Đơn giá</TableHead>
                <TableHead className="text-right">Thành tiền</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receipt.items.map(item => (
                <TableRow key={item.productSystemId}>
                  <TableCell>
                    <Link href={`/products/${item.productSystemId}`}
                      className="text-body-sm font-medium text-primary hover:underline"
                    >
                      {item.productId}
                    </Link>
                  </TableCell>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell className="text-center">{item.orderedQuantity}</TableCell>
                  <TableCell className="text-body-sm font-semibold text-center">{item.receivedQuantity}</TableCell>
                  <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                  <TableCell className="text-body-sm font-semibold text-right">{formatCurrency(item.receivedQuantity * item.unitPrice)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3} className="text-body-sm font-bold text-right">Tổng cộng</TableCell>
                <TableCell className="text-body-sm font-bold text-center">{totalQuantity}</TableCell>
                <TableCell />
                <TableCell className="text-body-sm font-bold text-right">{formatCurrency(totalValue)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </div>
    </div>
  );
}


// Updated to use combined transactions
function PurchaseReturnDetailView({ purchaseReturn, allTransactions, onPrintReturn }: { purchaseReturn: PurchaseReturn, allTransactions: (Payment | Receipt)[], onPrintReturn?: () => void }) {
    const totalReturnValue = purchaseReturn.items.reduce((sum, item) => sum + (item.returnQuantity * item.unitPrice), 0);
  
    const refundReceipt = React.useMemo(() => {
      if (purchaseReturn.refundAmount <= 0) return null;
      // Find receipt where supplier refunded money to us
      return allTransactions.find((transaction): transaction is Receipt => {
        if (!('payerTypeName' in transaction)) {
          return false;
        }
        const receipt = transaction as Receipt;
        return receipt.payerTypeName === 'Nhà cung cấp' && receipt.payerName === purchaseReturn.supplierName;
      }) ?? null;
    }, [purchaseReturn, allTransactions]);

    return (
      <div className="p-6 bg-slate-100 dark:bg-slate-800/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2 space-y-4 text-body-sm">
            <h3 className="text-h3">Thông tin đơn trả hàng nhà cung cấp</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              <div className="text-body-sm font-medium text-muted-foreground">Chi nhánh:</div>
              <div className="text-body-sm font-medium">{purchaseReturn.branchName}</div>
              <div className="text-body-sm font-medium text-muted-foreground">Nhà cung cấp:</div>
              <div className="text-body-sm font-medium">{purchaseReturn.supplierName}</div>
              <div className="text-body-sm font-medium text-muted-foreground">Lý do hoàn trả:</div>
              <div className="text-body-sm font-medium">{purchaseReturn.reason || '-'}</div>
              <div className="text-body-sm font-medium text-muted-foreground">Nhận hoàn tiền:</div>
                <div className="text-body-sm font-medium">
                {purchaseReturn.refundAmount > 0 ? (
                    <>
                    <span>{formatCurrency(purchaseReturn.refundAmount)} - {purchaseReturn.refundMethod}</span>
                    {refundReceipt && (
                        <Link href={`/receipts/${refundReceipt.systemId}`} className="ml-2 text-body-sm font-medium text-primary hover:underline">
                        ({refundReceipt.id})
                        </Link>
                    )}
                    </>
                ) : 'Không'}
                </div>
            </div>
          </div>
          <div className="flex items-start justify-end">
            <Button variant="outline" onClick={onPrintReturn}>
              <Printer className="mr-2 h-4 w-4" />
              In đơn trả
            </Button>
          </div>
        </div>
  
        <div className="space-y-2">
          <h3 className="text-h3">Thông tin sản phẩm trả</h3>
          <div className="border rounded-md bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã SKU</TableHead>
                  <TableHead>Tên sản phẩm</TableHead>
                  <TableHead className="text-center">SL Trả</TableHead>
                  <TableHead className="text-right">Đơn giá trả</TableHead>
                  <TableHead className="text-right">Thành tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchaseReturn.items.map((item, index) => (
                  <TableRow key={item.productSystemId}>
                    <TableCell>
                      <Link href={`/products/${item.productSystemId}`}
                        className="text-body-sm font-medium text-primary hover:underline"
                      >
                        {item.productId}
                      </Link>
                    </TableCell>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell className="text-center">{item.returnQuantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                    <TableCell className="text-body-sm font-semibold text-right">{formatCurrency(item.returnQuantity * item.unitPrice)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
               <TableFooter>
                <TableRow>
                    <TableCell colSpan={4} className="text-body-sm font-bold text-right">Tổng giá trị trả</TableCell>
                    <TableCell className="text-body-sm font-bold text-right">{formatCurrency(purchaseReturn.totalReturnValue)}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </div>
      </div>
    );
  }

// Updated to use combined transactions (Payment + Receipt)
function StockHistoryTab({ 
  poReceipts, 
  purchaseReturns, 
  allTransactions,
  onPrintReceipt,
  onPrintReturn,
}: { 
  poReceipts: InventoryReceipt[];
  purchaseReturns: PurchaseReturn[];
  allTransactions: (Payment | Receipt)[];
  onPrintReceipt?: (receipt: InventoryReceipt) => void;
  onPrintReturn?: (purchaseReturn: PurchaseReturn) => void;
}) {
    const [expandedRowId, setExpandedRowId] = React.useState<string | null>(null);

    const stockMovements = React.useMemo(() => {
        const receipts = poReceipts.map(r => ({
            type: 'receipt' as const,
            data: r,
            sortDate: r.receivedDate,
        }));
        const returns = purchaseReturns.map(pr => ({
            type: 'return' as const,
            data: pr,
            sortDate: pr.returnDate,
        }));
        return [...receipts, ...returns].sort((a, b) => getDaysDiff(parseDate(b.sortDate) || getCurrentDate(), parseDate(a.sortDate) || getCurrentDate()))
    }, [poReceipts, purchaseReturns]);

    const toggleRow = (systemId: string) => {
        setExpandedRowId(currentId => (currentId === systemId ? null : systemId));
    };

    return (
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12"></TableHead>
                            <TableHead>Mã phiếu</TableHead>
                            <TableHead>Loại phiếu</TableHead>
                            <TableHead>Ngày tạo</TableHead>
                            <TableHead>Nhân viên tạo</TableHead>
                            <TableHead className="text-center">Tổng SL</TableHead>
                            <TableHead className="w-[100px] text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {stockMovements.map(movement => {
                            const isReceipt = movement.type === 'receipt';
                            const data = movement.data;
                            const totalQty = isReceipt 
                                ? (data as InventoryReceipt).items.reduce((sum, i) => sum + Number(i.receivedQuantity), 0)
                                : (data as PurchaseReturn).items.reduce((sum, i) => sum + i.returnQuantity, 0);

                            return (
                                <React.Fragment key={data.systemId}>
                                    <TableRow onClick={() => toggleRow(data.systemId)} className="cursor-pointer">
                                        <TableCell>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500">
                                                {expandedRowId === data.systemId ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                                            </Button>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            <Link href={isReceipt ? `/inventory-receipts/${data.systemId}` : `/purchase-returns/${data.systemId}`}
                                                className="text-body-sm font-medium text-primary hover:underline"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {data.id}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            {isReceipt 
                                                ? <Badge variant="success" className="bg-green-100 text-green-700">Nhập hàng</Badge> 
                                                : <Badge variant="destructive" className="bg-red-100 text-red-700">Xuất trả NCC</Badge>
                                            }
                                        </TableCell>
                                        {/* FIX: Use type guard `isReceipt` to access correct properties */}
                                        <TableCell>{formatDateCustom(parseDate(isReceipt ? (data as InventoryReceipt).receivedDate : (data as PurchaseReturn).returnDate) || getCurrentDate(), 'dd/MM/yyyy HH:mm')}</TableCell>
                                        <TableCell>{isReceipt ? (data as InventoryReceipt).receiverName : (data as PurchaseReturn).creatorName}</TableCell>
                                        <TableCell className="text-center">{totalQty}</TableCell>
                                        <TableCell className="text-right">
                                            {isReceipt ? (
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onPrintReceipt?.(data as InventoryReceipt);
                                                    }}
                                                >
                                                    <Printer className="h-4 w-4" />
                                                </Button>
                                            ) : (
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onPrintReturn?.(data as PurchaseReturn);
                                                    }}
                                                >
                                                    <Printer className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    {expandedRowId === data.systemId && (
                                        <TableRow className="bg-slate-50 dark:bg-slate-900/20 hover:bg-slate-50 dark:hover:bg-slate-900/20">
                                            <TableCell colSpan={7} className="p-0">
                                                {isReceipt 
                                                    ? <InventoryReceiptDetailView 
                                                        receipt={data as InventoryReceipt} 
                                                      />
                                                    : <PurchaseReturnDetailView 
                                        purchaseReturn={data as PurchaseReturn} 
                                        allTransactions={allTransactions} 
                                        onPrintReturn={() => onPrintReturn?.(data as PurchaseReturn)}
                                      />
                                                }
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            )
                        })}
                        {stockMovements.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">Chưa có lịch sử xuất nhập kho.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

export function PurchaseOrderDetailPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const router = useRouter();
  const { findById, processInventoryReceipt, finishOrder, cancelOrder } = usePurchaseOrderStore();
  const purchaseOrder = findById(systemId!);
  
  // Early return if purchase order not found
  if (!purchaseOrder) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-h2 mb-4">Không tìm thấy đơn hàng</h2>
          <p className="text-body-sm text-muted-foreground mb-6">Đơn hàng với mã {systemId} không tồn tại hoặc đã bị xóa.</p>
          <Button onClick={() => router.push('/purchase-orders')}>
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  const { data: suppliers } = useSupplierStore();
  const { data: allPurchaseOrders } = usePurchaseOrderStore();
  const { data: allPayments } = usePaymentStore();
  const { data: allReceiptsFinancial } = useReceiptStore();
  const allTransactions = React.useMemo(() => [...allPayments, ...allReceiptsFinancial], [allPayments, allReceiptsFinancial]);
  const { data: allReceipts, add: addInventoryReceipt } = useInventoryReceiptStore();
  const { data: products, updateInventory, findById: findProductById } = useProductStore();
  const { addEntry: addStockHistoryEntry } = useStockHistoryStore();
  const { data: paymentTypes } = usePaymentTypeStore();
  const { accounts } = useCashbookStore();
  const branches = useBranchStore();
  const { findByPurchaseOrderSystemId, add: addPurchaseReturn, data: allPurchaseReturns } = usePurchaseReturnStore();
  const { employee: authEmployee } = useAuth();
  const currentUserSystemId = asSystemId(authEmployee?.systemId ?? 'SYSTEM');
  const currentUserName = authEmployee?.fullName ?? 'Hệ thống';
  const { findById: findProductTypeById } = useProductTypeStore();
  const { findById: findEmployeeById, data: employees } = useEmployeeStore();

  const getProductTypeName = React.useCallback((productTypeSystemId: string) => {
    const productType = findProductTypeById(productTypeSystemId as any);
    return productType?.name || 'Hàng hóa';
  }, [findProductTypeById]);

  const [isPaymentConfirmationOpen, setIsPaymentConfirmationOpen] = React.useState(false);
  const [isReceiveConfirmationOpen, setIsReceiveConfirmationOpen] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState<{ url: string; title: string } | null>(null);
  const [cancelDialogState, setCancelDialogState] = React.useState<{
    isOpen: boolean;
    po: PurchaseOrder | null;
    willCreateReturn?: boolean;
    totalPaid?: number;
  }>({ isOpen: false, po: null });

  // Comments state with localStorage persistence
  type POComment = CommentType<string>;
  const [comments, setComments] = React.useState<POComment[]>(() => {
    const saved = localStorage.getItem(`purchase-order-comments-${systemId}`);
    return saved ? JSON.parse(saved) : [];
  });

  React.useEffect(() => {
    if (systemId) {
      localStorage.setItem(`purchase-order-comments-${systemId}`, JSON.stringify(comments));
    }
  }, [comments, systemId]);

  const handleAddComment = (content: string, attachments?: string[], parentId?: string) => {
    const newComment: POComment = {
      id: `comment-${Date.now()}`,
      content,
      author: {
        systemId: currentUserSystemId,
        name: currentUserName,
        avatar: authEmployee?.avatar,
      },
      createdAt: new Date().toISOString(),
      attachments,
      parentId: parentId || undefined,
    };
    setComments(prev => [...prev, newComment]);
  };

  const handleUpdateComment = (commentId: string, content: string) => {
    setComments(prev => prev.map(c => 
      c.id === commentId ? { ...c, content, updatedAt: new Date().toISOString() } : c
    ));
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  const commentCurrentUser = React.useMemo(() => ({
    systemId: currentUserSystemId,
    name: currentUserName,
    avatar: authEmployee?.avatar,
  }), [currentUserSystemId, currentUserName, authEmployee?.avatar]);

  const purchaseReturns = React.useMemo(() => {
    if (!purchaseOrder) return [];
    return findByPurchaseOrderSystemId(asSystemId(purchaseOrder.systemId));
  }, [purchaseOrder, findByPurchaseOrderSystemId]);
  const poReceipts = React.useMemo(
    () => (purchaseOrder ? allReceipts.filter(r => r.purchaseOrderSystemId === purchaseOrder.systemId) : []),
    [purchaseOrder, allReceipts]
  );
  
  const canReturn = React.useMemo(() => {
    if (!purchaseOrder) return false;

    const totalReceived = purchaseOrder.lineItems.reduce((acc, item) => {
      const receivedQty = poReceipts.reduce((sum, receipt) => {
        const receiptItem = receipt.items.find(i => i.productSystemId === item.productSystemId);
        return sum + (receiptItem ? Number(receiptItem.receivedQuantity) : 0);
      }, 0);
      return acc + receivedQty;
    }, 0);

    const totalReturned = allPurchaseReturns
      .filter(pr => pr.purchaseOrderSystemId === purchaseOrder.systemId) // ✅ Fixed: Use systemId
      .reduce((acc, pr) => acc + pr.items.reduce((sum, item) => sum + item.returnQuantity, 0), 0);

    return totalReceived > totalReturned;
  }, [purchaseOrder, poReceipts, allPurchaseReturns]);

  // Tính xem còn sản phẩm nào cần nhập thêm không (sau khi đã nhập và trả hàng)
  const hasRemainingItemsToReceive = React.useMemo(() => {
    if (!purchaseOrder) return false;
    
    // Tính số lượng đã nhập cho mỗi sản phẩm
    const getAlreadyReceivedQty = (productSystemId: string) => {
      return poReceipts.reduce((total, receipt) => {
        const item = receipt.items.find(i => i.productSystemId === productSystemId);
        return total + (item ? Number(item.receivedQuantity) : 0);
      }, 0);
    };
    
    // Kiểm tra xem còn sản phẩm nào cần nhập không
    return purchaseOrder.lineItems.some(item => {
      const alreadyReceived = getAlreadyReceivedQty(item.productSystemId);
      const remaining = item.quantity - alreadyReceived;
      return remaining > 0;
    });
  }, [purchaseOrder, poReceipts]);
  
  const canBeFinished = React.useMemo(() => {
    if (!purchaseOrder) return false;
    const isFinanciallySettled = purchaseOrder.paymentStatus === 'Đã thanh toán';
    const isLogisticallySettled = purchaseOrder.deliveryStatus === 'Đã nhập';
    const isFullyReturned = purchaseOrder.returnStatus === 'Hoàn hàng toàn bộ';
    const isTerminal = purchaseOrder.status === 'Kết thúc' || purchaseOrder.status === 'Đã hủy';
    
    return !isTerminal && ((isFinanciallySettled && isLogisticallySettled) || isFullyReturned);
  }, [purchaseOrder]);
  
  const handleCancelRequest = React.useCallback((po: PurchaseOrder) => {
    const totalPaid = sumPaymentsForPurchaseOrder(allPayments, po);

    const hasBeenDelivered = po.deliveryStatus !== 'Chưa nhập';

    setCancelDialogState({ 
        isOpen: true, 
        po: po, 
        totalPaid: totalPaid,
        willCreateReturn: hasBeenDelivered 
    });
  }, [allPayments]);

  const confirmCancel = () => {
    if (!cancelDialogState.po) return;
    const po = cancelDialogState.po;

    if (cancelDialogState.willCreateReturn) {
        const poSystemId = asSystemId(po.systemId);
        const receiptsForPO = allReceipts.filter(r => r.purchaseOrderSystemId === poSystemId);
        const returnsForPO = allPurchaseReturns.filter(pr => pr.purchaseOrderSystemId === poSystemId);

        const returnItems = po.lineItems
          .map<PurchaseReturnLineItem | null>(item => {
            const totalReceived = receiptsForPO.reduce((sum, receipt) => {
              const receiptItem = receipt.items.find(i => i.productSystemId === item.productSystemId);
              return sum + (receiptItem ? Number(receiptItem.receivedQuantity) : 0);
            }, 0);
            const totalReturned = returnsForPO.reduce((sum, pr) => {
              const returnItem = pr.items.find(i => i.productSystemId === item.productSystemId);
              return sum + (returnItem ? returnItem.returnQuantity : 0);
            }, 0);
            const returnableQuantity = totalReceived - totalReturned;

            if (returnableQuantity <= 0) {
              return null;
            }

            return {
              productSystemId: asSystemId(item.productSystemId),
              productId: asBusinessId(item.productId),
              productName: item.productName,
              orderedQuantity: item.quantity,
              returnQuantity: returnableQuantity,
              unitPrice: item.unitPrice,
            } satisfies PurchaseReturnLineItem;
          })
          .filter((item): item is PurchaseReturnLineItem => Boolean(item));

        if (returnItems.length > 0) {
            const totalReturnValue = returnItems.reduce((sum, item) => sum + (item.returnQuantity * item.unitPrice), 0);
            
            addPurchaseReturn({
              id: asBusinessId(''),
              purchaseOrderSystemId: asSystemId(po.systemId),
              purchaseOrderId: asBusinessId(po.id),
              supplierSystemId: asSystemId(po.supplierSystemId),
              supplierName: po.supplierName,
              branchSystemId: asSystemId(po.branchSystemId),
              branchName: po.branchName,
              returnDate: toISODate(getCurrentDate()),
              reason: `Tự động tạo khi hủy đơn nhập hàng ${po.id}`,
              items: returnItems,
              totalReturnValue,
              refundAmount: 0, 
              refundMethod: '',
              creatorName: currentUserName,
            });
        }
    }

    cancelOrder(po.systemId, currentUserSystemId, currentUserName);
    setCancelDialogState({ isOpen: false, po: null });
  };

  const { findById: findBranchById } = useBranchStore();
  const { info: storeInfo } = useStoreInfoStore();
  const { print } = usePrint(purchaseOrder?.branchSystemId);

  const handlePrint = React.useCallback(() => {
    if (!purchaseOrder) return;

    const branch = findBranchById(purchaseOrder.branchSystemId);
    const supplier = suppliers.find(s => s.systemId === purchaseOrder.supplierSystemId);

    // Use helper to prepare print data
    const storeSettings = createStoreSettings(storeInfo);
    const poForPrint = convertPurchaseOrderForPrint(purchaseOrder, { 
      branch: branch || undefined, 
      supplier: supplier || undefined,
    });

    // Calculate payment totals
    const totalPaid = sumPaymentsForPurchaseOrder(allPayments, purchaseOrder);
    poForPrint.totalTransactionAmount = totalPaid;
    poForPrint.totalRemain = purchaseOrder.grandTotal - totalPaid;

    const printData = mapPurchaseOrderToPrintData(poForPrint, storeSettings);
    const lineItems = mapPurchaseOrderLineItems(poForPrint.items);

    // Inject extra fields
    printData['amount_text'] = numberToWords(purchaseOrder.grandTotal);

    print('purchase-order', {
      data: printData,
      lineItems: lineItems
    });
  }, [purchaseOrder, findBranchById, storeInfo, print, suppliers, allPayments]);

  // Handle print for inventory receipt (phiếu nhập kho)
  const handlePrintReceipt = React.useCallback((receipt: InventoryReceipt) => {
    if (!purchaseOrder) return;

    const branch = findBranchById(purchaseOrder.branchSystemId);
    const supplierData = suppliers.find(s => s.systemId === purchaseOrder.supplierSystemId);

    // Use stock-in print helper to prepare data
    const storeSettings = createStockInStoreSettings(storeInfo);
    const stockInForPrint = convertStockInForPrint(receipt, {
      branch: branch || undefined,
      supplier: supplierData ? { 
        id: supplierData.id, 
        name: supplierData.name, 
        phone: supplierData.phone,
        email: supplierData.email,
      } : undefined,
      purchaseOrder: purchaseOrder ? {
        id: purchaseOrder.id,
        code: purchaseOrder.id,
      } : undefined,
    });

    const printData = mapStockInToPrintData(stockInForPrint, storeSettings);
    const lineItems = mapStockInLineItems(stockInForPrint.items);

    // Inject extra fields
    const totalValue = receipt.items.reduce((sum, item) => sum + (Number(item.receivedQuantity) * Number(item.unitPrice)), 0);
    printData['amount_text'] = numberToWords(totalValue);

    print('stock-in', {
      data: printData,
      lineItems: lineItems
    });
  }, [purchaseOrder, findBranchById, storeInfo, print, suppliers]);

  // Handle print for purchase return (phiếu trả hàng NCC)
  const handlePrintPurchaseReturn = React.useCallback((purchaseReturn: PurchaseReturn) => {
    if (!purchaseOrder) return;

    const branch = findBranchById(purchaseOrder.branchSystemId);
    const supplierData = suppliers.find(s => s.systemId === purchaseOrder.supplierSystemId);

    // Use supplier-return print helper to prepare data
    const storeSettings = createSupplierReturnStoreSettings(storeInfo);
    const returnForPrint = convertSupplierReturnForPrint(purchaseReturn, {
      branch: branch || undefined,
      supplier: supplierData || undefined,
      purchaseOrder: purchaseOrder || undefined,
    });

    const printData = mapSupplierReturnToPrintData(returnForPrint, storeSettings);
    const lineItems = mapSupplierReturnLineItems(returnForPrint.items);

    // Inject extra fields
    printData['amount_text'] = numberToWords(purchaseReturn.totalReturnValue);

    print('supplier-return', {
      data: printData,
      lineItems: lineItems
    });
  }, [purchaseOrder, findBranchById, storeInfo, print, suppliers]);

  const printButton = React.useMemo(() => (
    <Button variant="outline" size="sm" onClick={handlePrint}>
      <Printer className="mr-2 h-4 w-4" /> In
    </Button>
  ), [handlePrint]);

  const statusBadgeVariant = React.useMemo(() => {
    if (!purchaseOrder) return 'secondary' as const;
    switch (purchaseOrder.status) {
      case 'Hoàn thành':
      case 'Kết thúc':
        return 'success' as const;
      case 'Đã hủy':
      case 'Đã trả hàng':
        return 'destructive' as const;
      case 'Đang giao dịch':
        return 'warning' as const;
      default:
        return 'secondary' as const;
    }
  }, [purchaseOrder]);

  const actions = React.useMemo(() => {
    if (!purchaseOrder) return [];
    const isTerminalStatus = purchaseOrder.status === 'Kết thúc' || purchaseOrder.status === 'Đã hủy';
    const isCompleted = purchaseOrder.status === 'Hoàn thành';
    
    // Theo chuẩn Sapo: Chỉ cho phép sửa/hủy đơn CHƯA nhập kho
    const canEdit = !isTerminalStatus && purchaseOrder.deliveryStatus === 'Chưa nhập';
    const canCancel = !isTerminalStatus && purchaseOrder.deliveryStatus === 'Chưa nhập';

    // Nhóm nút bên trái (Thoát, Sao chép, In đơn)
    const leftButtons = [
      <Button key="exit" variant="outline" size="sm" onClick={() => router.push(ROUTES.PROCUREMENT.PURCHASE_ORDERS)} className="h-9">
        Thoát
      </Button>
    ];

    if (!isTerminalStatus) {
      leftButtons.push(
        <Button key="copy" variant="outline" size="sm" onClick={() => {
          // Copy order logic - navigate to new order with pre-filled data
          router.push(`${ROUTES.PROCUREMENT.PURCHASE_ORDER_NEW}?copy=${purchaseOrder.systemId}`);
        }} className="h-9">
          Sao chép
        </Button>
      );
    }

    leftButtons.push(
      <Button key="print" variant="outline" size="sm" onClick={handlePrint} className="h-9">
        <Printer className="mr-2 h-4 w-4" />
        In đơn
      </Button>
    );

    // Nhóm nút bên phải (Sửa, Hoàn trả, Hoàn tất, Hủy)
    const actionButtons = [...leftButtons];

    if (!isTerminalStatus && canBeFinished) {
      actionButtons.push(
        <Button key="finish" size="sm" onClick={() => finishOrder(purchaseOrder.systemId, currentUserSystemId, currentUserName)} className="h-9">
          Hoàn tất
        </Button>
      );
    }

    if (canEdit) {
      actionButtons.push(
        <Button key="edit" variant="outline" size="sm" onClick={() => router.push(`${ROUTES.PROCUREMENT.PURCHASE_ORDERS}/${purchaseOrder.systemId}/edit`)} className="h-9">
          <Edit className="mr-2 h-4 w-4" />
          Sửa
        </Button>
      );
    }

    if (canReturn) {
      actionButtons.push(
        <Button key="return" variant="outline" size="sm" onClick={() => router.push(`${ROUTES.PROCUREMENT.PURCHASE_ORDERS}/${purchaseOrder.systemId}/return`)} className="h-9">
          <Undo2 className="mr-2 h-4 w-4" />
          Hoàn trả
        </Button>
      );
    }

    if (canCancel) {
      actionButtons.push(
        <Button key="cancel" variant="destructive" size="sm" onClick={() => handleCancelRequest(purchaseOrder)} className="h-9">
          <Trash2 className="mr-2 h-4 w-4" />
          Hủy đơn
        </Button>
      );
    }

    return actionButtons;
  }, [router, purchaseOrder, canBeFinished, canReturn, finishOrder, currentUserSystemId, currentUserName, handleCancelRequest, handlePrint]);

  usePageHeader({ 
    actions,
    title: purchaseOrder.id ? `Đơn nhập hàng ${purchaseOrder.id}` : 'Chi tiết đơn nhập hàng',
    badge: <Badge variant={statusBadgeVariant}>{purchaseOrder.status}</Badge>,
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Đơn nhập hàng', href: ROUTES.PROCUREMENT.PURCHASE_ORDERS, isCurrent: false },
      { label: purchaseOrder.id || 'Chi tiết', href: `${ROUTES.PROCUREMENT.PURCHASE_ORDERS}/${purchaseOrder.systemId}`, isCurrent: true }
    ],
    showBackButton: true,
    backPath: ROUTES.PROCUREMENT.PURCHASE_ORDERS
  });
  
  const supplier = React.useMemo(() => {
    if (!purchaseOrder) return null;
    return suppliers.find(s => s.systemId === purchaseOrder.supplierSystemId);
  }, [purchaseOrder, suppliers]);

  const handlePrintPayment = React.useCallback((e: React.MouseEvent, item: any) => {
      e.stopPropagation();
      
      const isPayment = item.type === 'payment';
      const amount = Math.abs(item.amount);
      
      // Get branch info
      const branch = findBranchById(purchaseOrder.branchSystemId);

      // Prepare store settings
      const storeSettings: StoreSettings = {
          name: storeInfo.brandName || storeInfo.companyName,
          address: storeInfo.headquartersAddress,
          phone: storeInfo.hotline,
          email: storeInfo.email,
          province: storeInfo.province,
      };

      const creator = (() => {
          const bySystemId = findEmployeeById(item.creator);
          if (bySystemId) return bySystemId;
          return employees.find(e => e.id === (item.creator as unknown as string));
      })();

      let printData;

      if (isPayment) {
          const paymentData: PaymentForPrint = {
              code: item.id,
              createdAt: item.date,
              issuedAt: item.date,
              createdBy: creator?.fullName || item.creator,
              recipientName: supplier?.name || 'Nhà cung cấp',
              recipientPhone: supplier?.phone || '',
              recipientAddress: supplier?.address || '',
              recipientType: 'Nhà cung cấp',
              amount: amount,
              description: item.description,
              paymentMethod: item.method,
              documentRootCode: purchaseOrder.id,
              note: item.description,
              location: branch ? {
                  name: branch.name,
                  address: branch.address,
                  province: branch.province
              } : undefined
          };
          
          printData = mapPaymentToPrintData(paymentData, storeSettings);
      } else {
          // Refund (Receipt)
           const receiptData: ReceiptForPrint = {
              code: item.id,
              createdAt: item.date,
              issuedAt: item.date,
              createdBy: creator?.fullName || item.creator,
              payerName: supplier?.name || 'Nhà cung cấp',
              payerPhone: supplier?.phone || '',
              payerAddress: supplier?.address || '',
              payerType: 'Nhà cung cấp',
              amount: amount,
              description: item.description,
              paymentMethod: item.method,
              documentRootCode: purchaseOrder.id,
              note: item.description,
              location: branch ? {
                  name: branch.name,
                  address: branch.address,
                  province: branch.province
              } : undefined
          };
          
          printData = mapReceiptToPrintData(receiptData, storeSettings);
      }

      printData['amount_text'] = numberToWords(amount);
      printData['print_date'] = formatDateTime(new Date());
      printData['print_time'] = formatTime(new Date());
      
      print(isPayment ? 'payment' : 'receipt', { data: printData });
  }, [purchaseOrder, supplier, findBranchById, storeInfo, print, findEmployeeById, employees]);

  const supplierPurchaseOrders = React.useMemo(() => {
    if (!supplier) return [];
    return allPurchaseOrders.filter(po => po.supplierSystemId === supplier.systemId);
  }, [supplier, allPurchaseOrders]);

  const { calculatedDebt, totalReturnValueForSupplier } = React.useMemo(() => {
    if (!supplier) return { calculatedDebt: 0, totalReturnValueForSupplier: 0 };
    
    const supplierReturns = allPurchaseReturns.filter(pr => pr.supplierSystemId === supplier.systemId);
    const totalReturnValue = supplierReturns.reduce((sum, pr) => sum + pr.totalReturnValue, 0);

    const totalPurchases = supplierPurchaseOrders.reduce((sum, po) => sum + po.grandTotal, 0);
    const totalPayments = supplierPurchaseOrders.reduce(
      (sum, po) => sum + sumPaymentsForPurchaseOrder(allPayments, po),
      0
    );
    
    // Debt calculation should factor in returns
    const calculatedDebt = totalPurchases - totalPayments - totalReturnValue;
      
    return { calculatedDebt, totalReturnValueForSupplier: totalReturnValue };
  }, [supplier, supplierPurchaseOrders, allPayments, allPurchaseReturns]);
  
    const { totalPaidOnThisOrder, financialHistory } = React.useMemo(() => {
    if (!purchaseOrder) return { totalPaidOnThisOrder: 0, financialHistory: [] };

    const paymentsForOrder = getPaymentsForPurchaseOrder(allPayments, purchaseOrder);
    const paymentTransactions = paymentsForOrder.map(p => ({
      type: 'payment' as const,
      systemId: p.systemId,
      id: p.id,
      date: p.date,
      amount: p.amount,
      method: p.paymentMethodName || (p as any).paymentMethod || 'Không xác định',
      creator: p.createdBy,
      description: p.description,
    }));

    const receiptsForOrder = getReceiptsForPurchaseOrder(allReceiptsFinancial, purchaseOrder);
    const refundTransactions = receiptsForOrder.map(r => ({
      type: 'refund' as const,
      systemId: r.systemId,
      id: r.id,
      date: r.date,
      amount: r.amount,
      method: r.paymentMethodName || (r as any).paymentMethod || 'Không xác định',
      creator: r.createdBy,
      description: r.description,
    }));

    const combinedHistory = [...paymentTransactions, ...refundTransactions].sort((a, b) => getDaysDiff(parseDate(b.date), parseDate(a.date)));
    const totalPaid = sumPaymentsForPurchaseOrder(allPayments, purchaseOrder);
    
    return { totalPaidOnThisOrder: totalPaid, financialHistory: combinedHistory };
    }, [purchaseOrder, allPayments, allReceiptsFinancial]);
  
  const totalReturnedValue = React.useMemo(() => 
    purchaseReturns.reduce((sum, pr) => sum + pr.totalReturnValue, 0),
  [purchaseReturns]);

  const actualDebt = (purchaseOrder?.grandTotal || 0) - totalReturnedValue;
  const amountRemainingOnThisOrder = actualDebt - totalPaidOnThisOrder;

  const localPaymentStatus: PaymentStatus = React.useMemo(() => {
    if (!purchaseOrder) return 'Chưa thanh toán';
    if (totalPaidOnThisOrder >= actualDebt) {
        return 'Đã thanh toán';
    } else if (totalPaidOnThisOrder > 0) {
        return 'Thanh toán một phần';
    } else {
        return 'Chưa thanh toán';
    }
  }, [purchaseOrder, totalPaidOnThisOrder, actualDebt]);

  const canPay = amountRemainingOnThisOrder > 0 && purchaseOrder?.status !== 'Đã hủy' && purchaseOrder?.status !== 'Kết thúc';

  if (!purchaseOrder) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Không tìm thấy đơn nhập hàng</h2>
          <Button onClick={() => router.push(ROUTES.PROCUREMENT.PURCHASE_ORDERS)} className="mt-4"><ArrowLeft className="mr-2 h-4 w-4" />Quay về danh sách</Button>
        </div>
      </div>
    );
  }
  
  const handleSupplierClick = () => {
    if (supplier) {
      router.push(`${ROUTES.PROCUREMENT.SUPPLIERS}/${supplier.systemId}`);
    }
  };
  
   const handleReceiveAllItems = () => {
    if (!purchaseOrder) {
      toast.error('Không tìm thấy đơn nhập hàng để nhận.');
      return;
    }

    if (purchaseOrder.deliveryStatus === 'Đã nhập') {
      toast.info('Đơn hàng đã được nhập kho đầy đủ.');
      return;
    }

    if (!purchaseOrder.branchSystemId || !purchaseOrder.branchName) {
      toast.error('Đơn hàng này chưa được gán cho chi nhánh. Vui lòng cập nhật thông tin chi nhánh trước khi nhập.');
      return;
    }

    // Mở dialog xác nhận
    setIsReceiveConfirmationOpen(true);
  };

  const handleConfirmReceive = () => {
    if (!purchaseOrder) return;

    const getAlreadyReceivedQty = (productSystemId: string) => {
      const receiptsForPO = allReceipts.filter(r => r.purchaseOrderSystemId === purchaseOrder.systemId);
      return receiptsForPO.reduce((total, receipt) => {
        const item = receipt.items.find(i => i.productSystemId === productSystemId);
        return total + (item ? Number(item.receivedQuantity) : 0);
      }, 0);
    };

    const itemsToReceive = purchaseOrder.lineItems.map(item => {
      const alreadyReceived = getAlreadyReceivedQty(item.productSystemId);
      const remaining = item.quantity - alreadyReceived;
      return {
        productSystemId: asSystemId(item.productSystemId),
        productId: asBusinessId(item.productId),
        productName: item.productName,
        orderedQuantity: item.quantity,
        receivedQuantity: remaining > 0 ? remaining : 0,
        unitPrice: item.unitPrice,
      };
    }).filter(item => item.receivedQuantity > 0);

    if (itemsToReceive.length === 0) {
      toast.info('Không có sản phẩm nào cần nhập thêm.');
      setIsReceiveConfirmationOpen(false);
      return;
    }
    
    const receiptData: Omit<InventoryReceipt, 'systemId'> = {
      id: asBusinessId(''),
      purchaseOrderSystemId: asSystemId(purchaseOrder.systemId),
      purchaseOrderId: asBusinessId(purchaseOrder.id || purchaseOrder.systemId),
      supplierSystemId: asSystemId(purchaseOrder.supplierSystemId),
      supplierName: purchaseOrder.supplierName,
      receivedDate: formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm'),
      receiverSystemId: currentUserSystemId,
      receiverName: currentUserName,
      branchSystemId: asSystemId(purchaseOrder.branchSystemId),
      branchName: purchaseOrder.branchName,
      warehouseName: purchaseOrder.branchName ? `Kho ${purchaseOrder.branchName}` : undefined,
      items: itemsToReceive,
      notes: 'Nhập kho tự động toàn bộ sản phẩm còn lại.',
    };

    addInventoryReceipt(receiptData);

    itemsToReceive.forEach(item => {
      const productData = products.find(p => p.systemId === item.productSystemId || p.id === item.productId);
      // Products now store on-hand inventory in `inventoryByBranch` (Record<branchId, number>)
      const branchSystemId = asSystemId(purchaseOrder.branchSystemId);
      const oldStock = productData?.inventoryByBranch?.[branchSystemId] || 0;
      
      // Cập nhật tồn kho
      updateInventory(asSystemId(item.productSystemId), branchSystemId, item.receivedQuantity);
      
      // Ghi lịch sử kho
      addStockHistoryEntry({
        productId: asSystemId(item.productSystemId),
        action: 'Nhập hàng từ NCC',
        employeeName: currentUserName,
        date: formatDateCustom(getCurrentDate(), 'yyyy-MM-dd HH:mm'),
        quantityChange: item.receivedQuantity,
        newStockLevel: oldStock + item.receivedQuantity,
        documentId: asBusinessId(purchaseOrder.id || purchaseOrder.systemId),
        branch: purchaseOrder.branchName,
        branchSystemId,
      });
    });
    
    processInventoryReceipt(asSystemId(purchaseOrder.systemId)); // ✅ Fixed: Use systemId

    setIsReceiveConfirmationOpen(false);
    toast.success(`Đã nhập kho thành công ${itemsToReceive.length} sản phẩm còn lại.`);
  };

  const handlePaymentConfirmationSubmit = (values: PaymentConfirmationFormValues) => {
    if (!purchaseOrder || !supplier) return;

    // Create payment document using standard helper (same as order)
    const { document: createdPayment, error } = createPaymentDocument({
      amount: values.amount,
      description: `Thanh toán cho đơn nhập hàng ${purchaseOrder.id}${values.reference ? ` - ${values.reference}` : ''}`,
      recipientName: supplier.name,
      recipientSystemId: supplier.systemId,
      branchSystemId: asSystemId(purchaseOrder.branchSystemId),
      branchName: purchaseOrder.branchName,
      createdBy: currentUserSystemId,
      paymentMethodName: values.paymentMethod,
      accountSystemId: values.accountSystemId ? asSystemId(values.accountSystemId) : undefined,
      paymentTypeName: 'Thanh toán cho đơn nhập hàng',
      recipientTargetGroupName: 'Nhà cung cấp',
      originalDocumentId: purchaseOrder.id,
      affectsDebt: true,
      date: values.paymentDate,
    });

    if (!createdPayment) {
      toast.error(error || 'Không thể tạo phiếu chi. Vui lòng kiểm tra cấu hình chứng từ.');
      return;
    }
    
    // Sync payment status after payment
    const { syncAllPurchaseOrderStatuses } = usePurchaseOrderStore.getState();
    syncAllPurchaseOrderStatuses();
    
    setIsPaymentConfirmationOpen(false);
    toast.success(`Đã tạo phiếu chi ${createdPayment.id} - ${formatCurrency(values.amount)} cho đơn nhập hàng ${purchaseOrder.id}.`);
  };
  
  const canReceiveItems = purchaseOrder.deliveryStatus !== 'Đã nhập' && purchaseOrder.status !== 'Đã hủy' && purchaseOrder.status !== 'Kết thúc' && hasRemainingItemsToReceive;
  
  let paymentSection;
  
  const paymentDetails = (
      <div className="grid grid-cols-1 gap-2 bg-muted/50 p-3 sm:p-4 rounded-md text-sm">
          {purchaseOrder.grandTotal === 0 ? (
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                <AlertCircle className="h-5 w-5" />
                <p className="font-medium">Đơn hàng chưa có sản phẩm hoặc tổng tiền bằng 0</p>
              </div>
              <p className="mt-2 text-body-sm text-amber-700 dark:text-amber-400">
                Vui lòng kiểm tra lại danh sách sản phẩm trong đơn hàng.
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between">
                  <span className="text-muted-foreground">Tổng tiền ĐH:</span>
                  <span className="font-medium">{formatCurrency(purchaseOrder.grandTotal)}</span>
              </div>
              
              {totalReturnedValue > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Giá trị hàng đã trả:</span>
                  <span className="font-medium text-amber-600">-{formatCurrency(totalReturnedValue)}</span>
                </div>
              )}
              
              {totalReturnedValue > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-semibold">Công nợ thực tế:</span>
                  <span className="font-semibold">{formatCurrency(actualDebt)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                  <span className="text-muted-foreground">Đã trả:</span>
                  <span className="font-medium">{totalPaidOnThisOrder > 0 ? formatCurrency(totalPaidOnThisOrder) : '0'}</span>
              </div>
              
              <div className="border-t my-1" />
              
              <div className="flex justify-between">
                  <span className="text-muted-foreground font-bold">Còn phải trả:</span>
                  <span className={cn(
                      "font-bold text-lg",
                      amountRemainingOnThisOrder > 0 ? 'text-red-500' : amountRemainingOnThisOrder < 0 ? 'text-green-600' : 'text-foreground'
                  )}>{amountRemainingOnThisOrder >= 0 ? formatCurrency(amountRemainingOnThisOrder) : formatCurrency(0)}</span>
              </div>
              {amountRemainingOnThisOrder < 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="font-medium">NCC cần hoàn lại:</span>
                  <span className="font-bold">{formatCurrency(Math.abs(amountRemainingOnThisOrder))}</span>
                </div>
              )}
            </>
          )}
      </div>
  );

  switch(localPaymentStatus) {
      case 'Chưa thanh toán':
      case 'Thanh toán một phần':
          paymentSection = (
              <Card>
                  <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center gap-2">
                              <FileWarning className="h-5 w-5 text-amber-500 flex-shrink-0" />
                              <CardTitle className="text-base font-semibold">
                                {localPaymentStatus === 'Chưa thanh toán' 
                                  ? 'Đơn hàng chờ thanh toán' 
                                  : `Đơn hàng thanh toán ${localPaymentStatus.toLowerCase()}`}
                              </CardTitle>
                          </div>
                          {canPay && amountRemainingOnThisOrder > 0 && (
                            <Button size="sm" onClick={() => setIsPaymentConfirmationOpen(true)}>
                              Thanh toán
                            </Button>
                          )}
                      </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                      {paymentDetails}
                      {financialHistory.length > 0 && (
                        <div className="space-y-2 pt-2">
                          {[...financialHistory].reverse().map((item, index) => (
                            <PurchaseOrderPaymentItem 
                                key={`${item.systemId}-${index}`} 
                                item={item} 
                                onPrint={handlePrintPayment} 
                            />
                          ))}
                        </div>
                      )}
                  </CardContent>
              </Card>
          );
          break;
      case 'Đã thanh toán':
          paymentSection = (
              <Card>
                  <CardHeader>
                      <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <CardTitle className="text-base font-semibold">
                            Đơn hàng thanh toán thanh toán toàn bộ
                          </CardTitle>
                      </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                      {paymentDetails}
                      {financialHistory.length > 0 && (
                        <div className="space-y-2 pt-2">
                          {[...financialHistory].reverse().map((item, index) => (
                            <PurchaseOrderPaymentItem 
                                key={`${item.systemId}-${index}`} 
                                item={item} 
                                onPrint={handlePrintPayment} 
                            />
                          ))}
                        </div>
                      )}
                  </CardContent>
              </Card>
          );
          break;
  }
  
  let receivingSection;

  // Nếu đã nhập đủ (không còn sản phẩm cần nhập) thì coi như đã nhập kho
  const isEffectivelyReceived = purchaseOrder.deliveryStatus === 'Đã nhập' || !hasRemainingItemsToReceive;

  if (isEffectivelyReceived) {
      receivingSection = (
          <Card>
              <CardHeader>
                  <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="h-5 w-5" />
                      <CardTitle className="text-h3">Nhập hàng: Đã nhập kho</CardTitle>
                  </div>
              </CardHeader>
          </Card>
      );
  } else { // 'Chưa nhập' or 'Đã nhập một phần'
      const title = purchaseOrder.deliveryStatus === 'Chưa nhập'
          ? 'Nhập hàng: Chưa nhập kho'
          : 'Nhập hàng: Đã nhập một phần';
      
      receivingSection = (
          <Card>
              <CardHeader>
                  <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                          <Package className="h-5 w-5 text-amber-500" />
                          <CardTitle className="text-h3">{title}</CardTitle>
                      </div>
                      {canReceiveItems && (
                        <Button size="sm" onClick={handleReceiveAllItems}>
                          <Truck className="mr-2 h-4 w-4" />
                          Nhập hàng
                        </Button>
                      )}
                  </div>
              </CardHeader>
          </Card>
      );
  }
  
  const statusVariants = {
    "Đặt hàng": "secondary", "Đang giao dịch": "warning", "Hoàn thành": "success", "Đã hủy": "destructive", "Kết thúc": "default", "Đã trả hàng": "destructive"
  }
  const paymentStatusVariants = {
    "Chưa thanh toán": "warning", "Thanh toán một phần": "warning", "Đã thanh toán": "success"
  }

  return (
      <div className="space-y-6">
          <StatusTimeline status={purchaseOrder.status} deliveryStatus={purchaseOrder.deliveryStatus} orderDate={purchaseOrder.orderDate} />

          {/* Thông tin NCC và Đơn hàng */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                  <Card className="h-[300px]">
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-muted-foreground" />
                          <CardTitle className="text-h3">Thông tin nhà cung cấp</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="overflow-y-auto" style={{maxHeight: 'calc(300px - 80px)'}}>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-1">
                              <p className="font-semibold text-h3 text-primary cursor-pointer hover:underline" onClick={handleSupplierClick}>
                                {purchaseOrder.supplierName}
                              </p>
                              <div className="mt-2 space-y-1 text-body-sm text-muted-foreground">
                                <p>Địa chỉ: {supplier?.address || '-'}</p>
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3 bg-muted/30 rounded-lg">
                            <div className="space-y-1">
                              <p className="text-body-xs text-muted-foreground">Nợ hiện tại</p>
                              <p className="text-body-sm font-semibold text-destructive">
                                {formatCurrency(calculatedDebt)}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-body-xs text-muted-foreground">Tổng đơn nhập</p>
                              <p className="text-body-sm font-semibold">
                                {formatCurrency(supplierPurchaseOrders.reduce((sum, po) => sum + po.grandTotal, 0))}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-body-xs text-muted-foreground">Trả hàng</p>
                              <p className="text-body-sm font-semibold text-orange-600">
                                {formatCurrency(totalReturnValueForSupplier)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                  </Card>
              </div>

              <div className="lg:col-span-1">
                  <Card className="h-[300px] flex flex-col">
                      <CardHeader>
                        <CardTitle className="text-h3">Thông tin đơn nhập hàng</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 overflow-y-auto text-body-sm space-y-3">
                          <DetailField label="Chi nhánh" value={purchaseOrder.branchName} />
                          <DetailField label="Chính sách giá" value="Giá nhập" />
                          <DetailField label="Nhân viên phụ trách" value={purchaseOrder.buyer} />
                          <DetailField label="Ngày đặt" value={formatDateCustom(parseDate(purchaseOrder.orderDate) || getCurrentDate(), 'dd/MM/yyyy')} />
                          <DetailField label="Ngày giao" value={formatDateCustom(parseDate(purchaseOrder.deliveryDate ?? '') || getCurrentDate(), 'dd/MM/yyyy')} />
                          <DetailField label="Tham chiếu" value={purchaseOrder.reference || '-'} />
                          <Button variant="link" className="p-0 h-auto text-body-sm" onClick={handleSupplierClick}>Xem lịch sử đơn nhập hàng</Button>
                      </CardContent>
                  </Card>
              </div>
          </div>

          {/* Trạng thái hàng và thanh toán - Full width mỗi hàng */}
          <div className="space-y-4">
              {receivingSection}
              {paymentSection}
          </div>

          <Card>
              <CardHeader>
                  <CardTitle className="text-h3">Thông tin sản phẩm</CardTitle>
              </CardHeader>
              <CardContent>
                  <div className="border rounded-md overflow-x-auto">
                      <Table>
                          <TableHeader>
                              <TableRow>
                                  <TableHead className="w-[50px] text-center">STT</TableHead>
                                  <TableHead className="w-[60px]">Ảnh</TableHead>
                                  <TableHead className="min-w-[200px]">Tên sản phẩm</TableHead>
                                  <TableHead className="w-[100px]">Loại SP</TableHead>
                                  <TableHead className="w-[80px]">Đơn vị</TableHead>
                                  <TableHead className="w-[80px] text-center">SL nhập</TableHead>
                                  <TableHead className="w-[130px] text-right">Đơn giá</TableHead>
                                  <TableHead className="w-[80px] text-right">Thuế</TableHead>
                                  <TableHead className="w-[100px] text-right">Chiết khấu</TableHead>
                                  <TableHead className="w-[130px] text-right">Thành tiền</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {purchaseOrder.lineItems.map((item, index) => {
                                  const lineGross = item.quantity * item.unitPrice;
                                  const discountAmount = item.discountType === 'percentage'
                                    ? lineGross * (item.discount / 100)
                                    : item.discount;
                                  const lineTotal = lineGross - discountAmount;
                                  const product = findProductById(item.productSystemId);
                                  const productTypeName = product?.productTypeSystemId 
                                    ? getProductTypeName(product.productTypeSystemId)
                                    : 'Hàng hóa';
                                  return (
                                  <TableRow key={item.productSystemId}>
                                      <TableCell className="text-center">{index + 1}</TableCell>
                                      <TableCell>
                                        <ProductThumbnailCell
                                          productSystemId={item.productSystemId}
                                          product={product}
                                          productName={item.productName}
                                          onPreview={(url, title) => setPreviewImage({ url, title })}
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <div className="flex flex-col gap-1">
                                          <Link href={`/products/${item.productSystemId}`} 
                                            className="text-body-sm font-medium text-primary hover:underline"
                                          >
                                            {item.productName}
                                          </Link>
                                          <div className="flex items-center gap-1 text-body-xs text-muted-foreground">
                                            <Link href={`/products/${item.productSystemId}`} 
                                              className="text-primary hover:underline"
                                            >
                                              {item.sku || item.productId}
                                            </Link>
                                          </div>
                                          {item.note && (
                                            <p className="text-body-xs text-muted-foreground italic">• {item.note}</p>
                                          )}
                                        </div>
                                      </TableCell>
                                      <TableCell className="text-body-sm text-muted-foreground">{productTypeName}</TableCell>
                                      <TableCell>{item.unit || '-'}</TableCell>
                                      <TableCell className="text-center">{item.quantity}</TableCell>
                                      <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                                      <TableCell className="text-right">{item.taxRate}%</TableCell>
                                      <TableCell className="text-right">
                                        {item.discountType === 'percentage' ? `${item.discount || 0}%` : formatCurrency(item.discount || 0)}
                                      </TableCell>
                                      <TableCell className="text-body-sm font-semibold text-right">{formatCurrency(lineTotal)}</TableCell>
                                  </TableRow>
                              )})}
                          </TableBody>
                          <TableFooter>
                              <TableRow>
                                  <TableCell colSpan={5} className="text-right font-bold">Tổng cộng</TableCell>
                                  <TableCell className="text-center font-bold">
                                    {purchaseOrder.lineItems.reduce((sum, item) => sum + item.quantity, 0)}
                                  </TableCell>
                                  <TableCell colSpan={3} />
                                  <TableCell className="text-body-sm font-bold text-right">
                                    {formatCurrency(
                                      purchaseOrder.lineItems.reduce((sum, item) => {
                                        const lineGross = item.quantity * item.unitPrice;
                                        const discountAmount = item.discountType === 'percentage'
                                          ? lineGross * (item.discount / 100)
                                          : item.discount;
                                        return sum + (lineGross - discountAmount);
                                      }, 0)
                                    )}
                                  </TableCell>
                              </TableRow>
                              
                              <TableRow>
                                  <TableCell colSpan={9} className="text-right text-muted-foreground">Tổng tiền hàng</TableCell>
                                  <TableCell className="text-right">
                                    {formatCurrency(
                                      purchaseOrder.lineItems.reduce((sum, item) => {
                                        const lineGross = item.quantity * item.unitPrice;
                                        const discountAmount = item.discountType === 'percentage'
                                          ? lineGross * (item.discount / 100)
                                          : item.discount;
                                        return sum + (lineGross - discountAmount);
                                      }, 0)
                                    )}
                                  </TableCell>
                              </TableRow>

                              <TableRow>
                                  <TableCell colSpan={9} className="text-right text-muted-foreground">
                                    Chiết khấu {purchaseOrder.discountType === 'percentage' && purchaseOrder.discount > 0 ? `(${purchaseOrder.discount}%)` : ''}
                                  </TableCell>
                                  <TableCell className="text-right text-red-600">
                                    -{formatCurrency(
                                      purchaseOrder.discountType === 'percentage'
                                        ? ((purchaseOrder.subtotal || 0) * purchaseOrder.discount / 100)
                                        : purchaseOrder.discount
                                    )}
                                  </TableCell>
                              </TableRow>

                              <TableRow>
                                  <TableCell colSpan={9} className="text-right text-muted-foreground">Thuế</TableCell>
                                  <TableCell className="text-right">{formatCurrency(purchaseOrder.tax)}</TableCell>
                              </TableRow>

                              <TableRow>
                                  <TableCell colSpan={9} className="text-right text-muted-foreground">Phí vận chuyển</TableCell>
                                  <TableCell className="text-right">{formatCurrency(purchaseOrder.shippingFee)}</TableCell>
                              </TableRow>

                              <TableRow>
                                  <TableCell colSpan={9} className="text-h3 font-bold text-right">Thành tiền</TableCell>
                                  <TableCell className="text-h3 font-bold text-right">
                                    {formatCurrency(purchaseOrder.grandTotal)}
                                  </TableCell>
                              </TableRow>
                          </TableFooter>
                      </Table>
                  </div>
              </CardContent>
          </Card>

          <Tabs defaultValue="stock_history">
              <TabsList>
                  <TabsTrigger value="stock_history">Lịch sử kho ({poReceipts.length + purchaseReturns.length})</TabsTrigger>
              </TabsList>
              <TabsContent value="stock_history" className="mt-4">
                 <StockHistoryTab 
                   poReceipts={poReceipts} 
                   purchaseReturns={purchaseReturns} 
                   allTransactions={allTransactions}
                   onPrintReceipt={handlePrintReceipt}
                   onPrintReturn={handlePrintPurchaseReturn}
                 />
              </TabsContent>
          </Tabs>

          {/* Comments */}
          <Comments
            entityType="purchase-order"
            entityId={purchaseOrder.systemId}
            comments={comments}
            onAddComment={handleAddComment}
            onUpdateComment={handleUpdateComment}
            onDeleteComment={handleDeleteComment}
            currentUser={commentCurrentUser}
            title="Bình luận"
            placeholder="Thêm bình luận về đơn nhập hàng..."
          />

          {/* Activity History */}
          <ActivityHistory 
            history={purchaseOrder.activityHistory || []}
            title="Lịch sử thao tác"
            emptyMessage="Chưa có lịch sử thay đổi"
            showMetadata
          />

           <PaymentConfirmationDialog
              isOpen={isPaymentConfirmationOpen}
              onOpenChange={setIsPaymentConfirmationOpen}
              amountRemaining={amountRemainingOnThisOrder}
              onSubmit={handlePaymentConfirmationSubmit}
          />
          
          <AlertDialog open={isReceiveConfirmationOpen} onOpenChange={setIsReceiveConfirmationOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xác nhận nhập hàng</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn nhập kho <strong>toàn bộ sản phẩm</strong> còn lại trong đơn hàng này không?
                  <br /><br />
                  Hệ thống sẽ tạo phiếu nhập kho (PNK) và cập nhật tồn kho tự động.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmReceive}>
                  Xác nhận nhập hàng
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={cancelDialogState.isOpen} onOpenChange={(open) => setCancelDialogState(s => ({ ...s, isOpen: open }))}>
            <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Bạn có chắc chắn muốn hủy đơn hàng này?</AlertDialogTitle>
                <AlertDialogDescription>
                {cancelDialogState.willCreateReturn ? (
                    <>
                    Đơn hàng này đã có sản phẩm được nhập kho. Hủy đơn sẽ tự động tạo một <strong>Phiếu Xuất trả hàng</strong> cho các sản phẩm đã nhận.
                    {cancelDialogState.totalPaid && cancelDialogState.totalPaid > 0 ? (
                        ` Đồng thời, một Phiếu Thu hoàn tiền ${formatCurrency(cancelDialogState.totalPaid)} sẽ được tạo.`
                    ) : ''}
                    {' '}Hành động này không thể hoàn tác.
                    </>
                ) : cancelDialogState.totalPaid && cancelDialogState.totalPaid > 0 ? (
                    <>
                    Đơn hàng này đã được thanh toán <strong>{formatCurrency(cancelDialogState.totalPaid)}</strong>. 
                    Việc hủy đơn sẽ tự động tạo một <strong>Phiếu Thu</strong> ghi nhận khoản tiền này là "Nhà cung cấp cần hoàn lại". 
                    Hành động này không thể hoàn tác.
                    </>
                ) : (
                    'Hành động này sẽ chuyển trạng thái đơn hàng thành "Đã hủy" và không thể hoàn tác.'
                )}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setCancelDialogState({ isOpen: false, po: null })}>Thoát</AlertDialogCancel>
                <AlertDialogAction onClick={confirmCancel}>Xác nhận hủy</AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <ImagePreviewDialog
          images={previewImage ? [previewImage.url] : []}
          open={!!previewImage}
          onOpenChange={(open) => !open && setPreviewImage(null)}
          title={previewImage?.title}
        />
      </div>
  );
}
