import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate, getDaysDiff } from '../../lib/date-utils.ts';
import { useForm, FormProvider } from 'react-hook-form';
import { useOrderStore } from './store.ts';
import type { Order, OrderMainStatus, OrderPayment, Packaging, PackagingStatus, OrderDeliveryStatus } from './types.ts';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../components/ui/card.tsx';
import { Button } from '../../components/ui/button.tsx';
import { Badge } from '../../components/ui/badge.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '../../components/ui/table.tsx';
import { Separator } from '../../components/ui/separator.tsx';
import { useCustomerStore } from '../customers/store.ts';
import { ArrowLeft, Edit, Printer, Check, Copy, Settings, ChevronDown, Users, Truck, CheckCircle2, FileWarning, PackageSearch, Package, PackageCheck, MoreHorizontal, Ban, File, Calendar, User, Info, MessageSquare, Banknote, PlusCircle, ThumbsUp, PackageX, ChevronRight, Undo2, Store, Clock } from 'lucide-react';
import { cn } from '../../lib/utils.ts';
import { useEmployeeStore } from '../employees/store.ts';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog.tsx';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog.tsx';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form.tsx';
import { Input } from '../../components/ui/input.tsx';
import { Label } from '../../components/ui/label.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select.tsx';
import { CurrencyInput } from '../../components/ui/currency-input.tsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu.tsx';
import { DetailField } from '../../components/ui/detail-field.tsx';
import { Textarea } from '../../components/ui/textarea.tsx';
import { useShippingPartnerStore } from '../settings/shipping/store.ts';
import { useProductStore } from '../products/store.ts';
import { useWarrantyStore } from '../warranty/store.ts';
import { Link } from 'react-router-dom';
import { Spinner } from '../../components/ui/spinner.tsx';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { usePaymentMethodStore } from '../settings/payments/methods/store.ts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs.tsx';
import { Timeline, TimelineItem } from '../../components/ui/timeline.tsx';
import { Combobox, type ComboboxOption } from '../../components/ui/combobox.tsx';
import { PackagingInfo } from './components/packaging-info.tsx';
import { CancelShipmentDialog } from './components/cancel-shipment-dialog.tsx';
import { CancelPackagingDialog } from './components/cancel-packaging-dialog.tsx';
import { DeliveryFailureDialog } from './components/delivery-failure-dialog.tsx';
import { PaymentInfo } from './components/payment-info.tsx';
import { ShippingTrackingTab } from './components/shipping-tracking-tab.tsx';
import { useSalesReturnStore } from '../sales-returns/store.ts';
import type { SalesReturn } from '../sales-returns/types.ts';
import { useReceiptStore } from '../receipts/store.ts';
import { usePaymentStore } from '../payments/store.ts';
import type { Receipt } from '../receipts/types.ts';
import type { Payment } from '../payments/types.ts';
import { useShippingSettingsStore } from '../settings/shipping/shipping-settings-store.ts';
import { PartnerShipmentForm } from './components/partner-shipment-form.tsx';
import { ShippingIntegration } from './components/shipping-integration.tsx';
import type { OrderFormValues } from './order-form-page.tsx';
import { useAuth } from '../../contexts/auth-context.tsx';
import { asSystemId, type SystemId } from '../../lib/id-types.ts';
const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};



const formatAddress = (street?: string, ward?: string, province?: string) => {
    return [street, ward, province].filter(Boolean).join(', ');
};

const getCustomerAddress = (customer: any, type: 'shipping' | 'billing'): string => {
    if (!customer?.addresses || customer.addresses.length === 0) return '';
    
    // Find address by type, or use default if type not found
    let address = customer.addresses.find((addr: any) => addr.type === type);
    
    // Fallback to default address if specific type not found
    if (!address) {
        address = customer.addresses.find((addr: any) => addr.isDefault);
    }
    
    // Fallback to first address
    if (!address) {
        address = customer.addresses[0];
    }
    
    if (!address) return '';
    
    // Format: street, ward, district, province
    return [
        address.street,
        address.ward,
        address.district,
        address.province
    ].filter(Boolean).join(', ');
};

// ✅ Helper to format address object or string
const formatAddressObject = (address: any): string => {
    if (!address) return '';
    if (typeof address === 'string') return address;
    
    // If address is an object, format it
    return [
        address.street,
        address.ward,
        address.district,
        address.province
    ].filter(Boolean).join(', ');
};

const statusVariants: Record<OrderMainStatus, "success" | "default" | "secondary" | "warning" | "destructive"> = {
    "Đặt hàng": "secondary",
    "Đang giao dịch": "warning",
    "Hoàn thành": "success",
    "Đã hủy": "destructive",
};

// A simple deterministic hash function to generate stable mock prices
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}


const StatusStepper = ({ order }: { order: Order }) => {
    const isPackaged = order.packagings.some(p => p.status === 'Đã đóng gói');
    const steps = [
        { name: 'Đặt hàng', date: order.orderDate },
        { name: 'Duyệt', date: order.approvedDate },
        { name: 'Đóng gói', date: isPackaged ? order.packagings.find(p=>p.status === 'Đã đóng gói')?.confirmDate : undefined },
        { name: 'Xuất kho', date: order.dispatchedDate },
        { name: 'Hoàn thành', date: order.completedDate }
    ];

    let currentStepIndex = 0; // Default to 'Đặt hàng'
    if (order.status === 'Hoàn thành') {
        currentStepIndex = 5; // All 5 steps (0-4) are completed.
    } else if (order.dispatchedDate || ['Đang giao hàng', 'Đã giao hàng'].includes(order.deliveryStatus)) {
        currentStepIndex = 4; // Current step is 'Hoàn thành' (index 4)
    } else if (isPackaged || order.deliveryStatus === 'Đã đóng gói') {
        currentStepIndex = 3; // Current step is 'Xuất kho' (index 3)
    } else if (order.approvedDate) {
        currentStepIndex = 2; // Current step is 'Đóng gói' (index 2)
    } else if (order.orderDate) {
        currentStepIndex = 1; // Current step is 'Duyệt' (index 1)
    }

    if (order.status === 'Đã hủy') {
        let lastValidStep = -1;
        if (order.dispatchedDate) lastValidStep = 3;
        else if (isPackaged) lastValidStep = 2;
        else if (order.approvedDate) lastValidStep = 1;
        else if (order.orderDate) lastValidStep = 0;
        currentStepIndex = lastValidStep;
    }

    return (
        <div className="flex items-start justify-between w-full px-4 pt-4">
            {steps.map((step, index) => {
                const isCompleted = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                const isCancelled = order.status === 'Đã hủy' && isCurrent;
                const Icon = Check;

                return (
                    <React.Fragment key={step.name}>
                        <div className="flex flex-col items-center text-center w-24">
                            <div className={cn(
                                "flex items-center justify-center w-8 h-8 rounded-full border-2 font-semibold text-sm",
                                isCancelled ? "bg-red-100 border-red-500 text-red-500" :
                                isCompleted ? "bg-blue-600 border-blue-600 text-white" :
                                isCurrent ? "border-blue-600 text-blue-600" :
                                "border-gray-300 bg-gray-100 text-gray-400"
                            )}>
                                {isCompleted ? <Icon className="h-4 w-4" /> : index + 1}
                            </div>
                            <p className={cn("text-sm mt-2 font-medium", isCompleted || isCurrent ? "text-foreground" : "text-muted-foreground")}>{step.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{step.date ? formatDateTime(step.date) : '-'}</p>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={cn(
                                "flex-1 mt-4 h-0.5",
                                index < currentStepIndex ? "bg-blue-600" : "bg-gray-300",
                            )} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

type PaymentFormValues = {
  method: string;
  amount: number;
  reference?: string;
  accountNumber?: string;
  accountName?: string;
  bankName?: string;
};

function PaymentDialog({
  isOpen,
  onOpenChange,
  amountDue,
  onSubmit,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  amountDue: number;
  onSubmit: (data: PaymentFormValues) => void;
}) {
  const { data: paymentMethods } = usePaymentMethodStore();
  const defaultPaymentMethod = React.useMemo(
    () => paymentMethods.find(pm => pm.isDefault),
    [paymentMethods]
  );
  
  const form = useForm<PaymentFormValues>({
    defaultValues: {
      method: 'Tiền mặt',
      amount: amountDue,
      reference: '',
      accountNumber: '',
      accountName: '',
      bankName: '',
    },
  });

  const selectedMethod = form.watch('method');

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        method: 'Tiền mặt',
        amount: amountDue > 0 ? amountDue : 0,
        reference: '',
        accountNumber: '',
        accountName: '',
        bankName: '',
      });
    }
  }, [isOpen, amountDue, form]);

  // Auto-fill bank account info when selecting "Chuyển khoản"
  React.useEffect(() => {
    if (selectedMethod === 'Chuyển khoản' && defaultPaymentMethod) {
      form.setValue('accountNumber', defaultPaymentMethod.accountNumber || '');
      form.setValue('accountName', defaultPaymentMethod.accountName || '');
      form.setValue('bankName', defaultPaymentMethod.bankName || '');
    }
  }, [selectedMethod, defaultPaymentMethod, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thanh toán đơn hàng</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form id="payment-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField control={form.control} name="method" render={({ field }) => (
                <FormItem>
                    <FormLabel>Phương thức</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="Tiền mặt">Tiền mặt</SelectItem><SelectItem value="Chuyển khoản">Chuyển khoản</SelectItem><SelectItem value="Quẹt thẻ">Quẹt thẻ</SelectItem></SelectContent>
                    </Select>
                </FormItem>
            )} />
            <FormField 
                control={form.control} 
                name="amount" 
                rules={{
                    required: 'Vui lòng nhập số tiền',
                    min: { value: 1, message: 'Số tiền phải lớn hơn 0' },
                    max: { value: amountDue, message: `Số tiền không được vượt quá ${new Intl.NumberFormat('vi-VN').format(amountDue)} ₫` }
                }}
                render={({ field, fieldState }) => (
                <FormItem>
                    <FormLabel>Số tiền</FormLabel>
                    <FormControl>
                        <CurrencyInput 
                            value={field.value as number} 
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                            className={fieldState.error ? 'border-destructive' : ''}
                        />
                    </FormControl>
                    {fieldState.error && (
                        <p className="text-sm text-destructive">{fieldState.error.message}</p>
                    )}
                </FormItem>
            )} />
            <FormField control={form.control} name="reference" render={({ field }) => (
                <FormItem>
                    <FormLabel>Tham chiếu</FormLabel>
                    <FormControl><Input {...field} placeholder="VD: Mã giao dịch ngân hàng" /></FormControl>
                </FormItem>
            )} />
            
            {/* Bank account info - only show when method is "Chuyển khoản" */}
            {selectedMethod === 'Chuyển khoản' && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
                <p className="text-sm font-medium">Thông tin tài khoản nhận</p>
                <FormField control={form.control} name="accountNumber" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số tài khoản</FormLabel>
                    <FormControl><Input {...field} placeholder="VD: 1234567890" /></FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="accountName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên chủ tài khoản</FormLabel>
                    <FormControl><Input {...field} placeholder="VD: NGUYEN VAN A" /></FormControl>
                  </FormItem>
                )} />
                <FormField control={form.control} name="bankName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngân hàng</FormLabel>
                    <FormControl><Input {...field} placeholder="VD: Vietcombank - CN HCM" /></FormControl>
                  </FormItem>
                )} />
              </div>
            )}
          </form>
        </Form>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button type="submit" form="payment-form">Xác nhận thanh toán</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CreateShipmentDialog({
    isOpen, onOpenChange, 
    onSubmit, 
    order,
    customer,
}: { 
    isOpen: boolean; 
    onOpenChange: (open: boolean) => void; 
    onSubmit: (data: Partial<OrderFormValues>) => Promise<any>;
    order: Order | null;
    customer: any;
}) {
    const [isLoading, setIsLoading] = React.useState(false);
    const form = useForm<OrderFormValues>();
    const { handleSubmit, reset } = form;

    React.useEffect(() => {
        if (isOpen && order && customer) {
            reset({
                customer: customer,
                lineItems: order.lineItems,
                grandTotal: order.grandTotal,
                payments: order.payments,
                branchSystemId: order.branchSystemId, // ✅ Use systemId only
                deliveryMethod: 'shipping-partner', // ✅ Force shipping-partner mode
            });
        }
    }, [isOpen, order, customer, reset]);

    const handleFormSubmit = async (data: Partial<OrderFormValues>) => {
        if (!order) return;
        setIsLoading(true);
        try {
            const result = await onSubmit(data);
            if (result && result.success) {
                toast.success('Thành công', { description: result.message });
                onOpenChange(false);
            } else {
                toast.error('Lỗi', { description: result?.message || 'Không thể tạo đơn vận chuyển' });
            }
        } catch (error) {
            console.error('[CreateShipmentDialog] Error:', error);
            toast.error('Lỗi', { description: 'Có lỗi xảy ra khi tạo đơn vận chuyển' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Đẩy qua hãng vận chuyển</DialogTitle>
                    <DialogDescription>Cấu hình và tạo đơn vận chuyển qua đối tác.</DialogDescription>
                </DialogHeader>
                <FormProvider {...form}>
                    <form id="create-shipping-form-dialog" onSubmit={handleSubmit(handleFormSubmit)} className="flex-grow overflow-hidden flex flex-col">
                        <div className="flex-grow overflow-auto p-1">
                          {/* ✅ Use ShippingIntegration with hideTabs - same component, different rendering */}
                          <ShippingIntegration hideTabs />
                        </div>
                         <DialogFooter className="mt-4 flex-shrink-0">
                            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Hủy</Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Spinner className="mr-2 h-4 w-4" />}
                                Tạo đơn vận chuyển
                            </Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}

function PackerSelectionDialog({
    isOpen,
    onOpenChange,
    onSubmit,
}: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (packerId?: SystemId) => void;
}) {
  const { searchEmployees } = useEmployeeStore();
  const [selectedEmployee, setSelectedEmployee] = React.useState<ComboboxOption | null>(null);

    const handleSubmit = () => {
        onSubmit(selectedEmployee ? asSystemId(selectedEmployee.value) : undefined);
    onOpenChange(false);
  };

  React.useEffect(() => {
      if (isOpen) {
          setSelectedEmployee(null);
      }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chọn nhân viên đóng gói</DialogTitle>
          <DialogDescription>
            Chỉ định một nhân viên để thực hiện đóng gói cho đơn hàng này. Bạn có thể bỏ qua để yêu cầu chung.
          </DialogDescription>
        </DialogHeader>
        <div className="pt-4">
          <Combobox
            value={selectedEmployee}
            onChange={setSelectedEmployee}
            onSearch={searchEmployees as any}
            placeholder="Tìm nhân viên..."
            searchPlaceholder="Tìm kiếm..."
            emptyPlaceholder="Không tìm thấy nhân viên."
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit}>Yêu cầu đóng gói</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const OrderHistoryTab = ({ order, salesReturnsForOrder }: { order: Order, salesReturnsForOrder: SalesReturn[] }) => {
    const { data: receipts } = useReceiptStore();
    const { data: payments } = usePaymentStore();
    const { data: warranties } = useWarrantyStore();
    const allTransactions = React.useMemo(() => [...receipts, ...payments], [receipts, payments]);

    const historyItems = React.useMemo(() => {
        if (!order) return [];
        
        type HistoryItem = { date: string; userName?: string; details: React.ReactNode; icon: React.ElementType };
        let items: HistoryItem[] = [];

        items.push({ date: order.orderDate, userName: order.salesperson, details: <>đã tạo đơn hàng.</>, icon: PlusCircle });

        if (order.approvedDate) items.push({ date: order.approvedDate, userName: 'Hệ thống', details: 'đã duyệt đơn hàng.', icon: CheckCircle2 });
        if (order.dispatchedDate) items.push({ date: order.dispatchedDate, userName: order.dispatchedByEmployeeName, details: 'đã xuất kho.', icon: Truck });
        if (order.completedDate) items.push({ date: order.completedDate, userName: 'Hệ thống', details: 'đã hoàn thành đơn hàng.', icon: ThumbsUp });
        if (order.cancelledDate) items.push({ date: order.cancelledDate, userName: '...', details: <>đã hủy đơn hàng. Lý do: <span className="italic">{order.cancellationReason}</span></>, icon: Ban });

        order.payments.forEach(p => {
            // ✨ Build warranty link if payment is from warranty
            const warrantyLink = p.linkedWarrantySystemId ? (
                <>
                    {' '}từ bảo hành <Link to={`/warranty/${p.linkedWarrantySystemId}`} className="text-primary hover:underline font-semibold">
                        {warranties.find(w => w.systemId === p.linkedWarrantySystemId)?.id || 'N/A'}
                    </Link>
                </>
            ) : null;
            
            items.push({ 
                date: p.date, 
                userName: p.createdBy, 
                details: <>đã thanh toán <span className="font-semibold">{formatCurrency(p.amount)}</span> qua {p.method} (<Link to={`/receipts/${p.systemId}`} className="text-primary hover:underline">{p.id}</Link>){warrantyLink}.</>, 
                icon: Banknote 
            });
        });

        order.packagings.forEach(p => {
            items.push({ date: p.requestDate, userName: p.requestingEmployeeName, details: <>đã yêu cầu đóng gói (<Link to={`/packaging/${p.systemId}`} className="text-primary hover:underline">{p.id}</Link>).</>, icon: PackageSearch });
            if (p.confirmDate) items.push({ date: p.confirmDate, userName: p.confirmingEmployeeName, details: <>đã xác nhận đóng gói (<Link to={`/packaging/${p.systemId}`} className="text-primary hover:underline">{p.id}</Link>).</>, icon: PackageCheck });
            if (p.cancelDate) items.push({ date: p.cancelDate, userName: p.cancelingEmployeeName, details: <>đã hủy yêu cầu đóng gói (<Link to={`/packaging/${p.systemId}`} className="text-primary hover:underline">{p.id}</Link>). Lý do: <span className="italic">{p.cancelReason}</span></>, icon: PackageX });
        });
        
        salesReturnsForOrder.forEach(returnSlip => {
            // Check both payment and receipt
            const transactionSystemId = returnSlip.paymentVoucherSystemId || returnSlip.receiptVoucherSystemIds?.[0];
            const transaction = transactionSystemId ? allTransactions.find(t => t.systemId === transactionSystemId) : null;
            const transactionLink = transaction ? (
                <>
                    {' '}và tạo chứng từ <Link to={`/${returnSlip.paymentVoucherSystemId ? 'payments' : 'receipts'}/${transaction.systemId}`} className="font-semibold text-primary hover:underline">{transaction.id}</Link>
                </>
            ) : null;

            const exchangeOrderLink = returnSlip.exchangeOrderSystemId ? (
                <>
                    {' '}và tạo đơn đổi <Link to={`/orders/${returnSlip.exchangeOrderSystemId}`} className="font-semibold text-primary hover:underline">{order.lineItems.length > 0 ? 'xem chi tiết' : ''}</Link>
                </>
            ) : null;

            items.push({
                date: returnSlip.returnDate,
                userName: returnSlip.creatorName,
                details: <>đã tạo phiếu trả hàng <Link to={`/returns/${returnSlip.systemId}`} className="font-semibold text-primary hover:underline">{returnSlip.id}</Link>{transactionLink}{exchangeOrderLink}.</>,
                icon: Undo2
            });
        });

        if(order.notes) items.push({ date: order.orderDate, userName: order.salesperson, details: <>đã thêm ghi chú: <span className="italic">"{order.notes}"</span></>, icon: MessageSquare });
        
        // ✅ Sort by date descending (newest first) - ISO string comparison works directly
        return items.sort((a, b) => {
            // ISO date strings can be compared directly (YYYY-MM-DD HH:mm:ss)
            if (!a.date || !b.date) return 0;
            return b.date.localeCompare(a.date); // Descending: b > a means b comes first
        });

    }, [order, salesReturnsForOrder, allTransactions]);
    
    return (
        <Card>
            <CardContent className="p-4">
                <Timeline>
                    {historyItems.map((item, index) => (
                        <TimelineItem key={index} time={item.date} icon={<item.icon className="h-4 w-4" />}>
                           <div>
                               <p>
                                   <span className="font-semibold">{item.userName}</span> {item.details}
                               </p>
                               <p className="text-xs text-muted-foreground mt-0.5">
                                   {formatDateTime(item.date)}
                               </p>
                           </div>
                        </TimelineItem>
                    ))}
                </Timeline>
            </CardContent>
        </Card>
    );
};

const ProductInfoCard = ({ order, costOfGoods, profit, totalDiscount, salesReturns }: { order: Order; costOfGoods: number; profit: number; totalDiscount: number; salesReturns: SalesReturn[]; }) => {
    // Calculate warranty payments (negative amounts linked to warranty)
    const warrantyPayments = (order?.payments || []).filter(p => p.amount < 0 && (p as any).linkedWarrantySystemId);
    const totalWarrantyDeduction = warrantyPayments.reduce((sum, p) => sum + Math.abs(p.amount), 0);
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base font-semibold">Thông tin sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="border rounded-md bg-background">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">STT</TableHead>
                                <TableHead>Tên sản phẩm</TableHead>
                                <TableHead className="text-center">Số lượng</TableHead>
                                <TableHead className="text-right">Đơn giá</TableHead>
                                <TableHead className="text-right">Chiết khấu</TableHead>
                                <TableHead className="text-right">Thành tiền</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.lineItems.map((item, index) => {
                                let discountValue = 0;
                                if (item.discount > 0) {
                                if (item.discountType === 'fixed') {
                                    discountValue = item.discount;
                                } else {
                                    discountValue = item.unitPrice * (item.discount / 100);
                                }
                                }
                                const finalLineTotal = (item.unitPrice * item.quantity) - (discountValue * item.quantity);
                                return (
                                <TableRow key={item.productSystemId}>
                                    <TableCell className="text-center text-muted-foreground">{index + 1}</TableCell>
                                    <TableCell>
                                        <Link to={`/products/${item.productSystemId}`} className="font-medium text-primary hover:underline">{item.productName}</Link>
                                        <div className="text-xs text-muted-foreground">Mặc định</div>
                                        <div className="text-xs text-muted-foreground">
                                            <Link to={`/products/${item.productSystemId}`} className="hover:underline">{item.productId}</Link>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">{item.quantity}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(discountValue * item.quantity)}</TableCell>
                                    <TableCell className="text-right font-semibold">{formatCurrency(finalLineTotal)}</TableCell>
                                </TableRow>
                            )})}
                        </TableBody>
                    </Table>
                </div>
                <div className="flex justify-end mt-4">
                    <div className="w-full max-w-sm space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-muted-foreground">Tổng tiền ({order.lineItems.length} sản phẩm)</span> <span>{formatCurrency(order.subtotal)}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Giá vốn</span> <span>{formatCurrency(costOfGoods)}</span></div>
                        <div className="flex justify-between font-semibold text-green-600"><span className="text-green-600">Lợi nhuận tạm tính</span> <span>{formatCurrency(profit)}</span></div>
                        <Separator className="!my-2" />
                        <div className="flex justify-between"><span className="text-muted-foreground">Chiết khấu</span> <span>-{formatCurrency(totalDiscount)}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Phí giao hàng</span> <span>{formatCurrency(order.shippingFee)}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Mã giảm giá</span> <span>{formatCurrency(0)}</span></div>
                        {/* ✅ Show linked sales return value if this is an exchange order */}
                        {order.linkedSalesReturnValue && order.linkedSalesReturnValue > 0 && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Giá trị trả hàng {order.linkedSalesReturnSystemId && (
                                        <Link to={`/returns/${order.linkedSalesReturnSystemId}`} className="text-primary hover:underline">
                                            ({salesReturns.find(r => r.systemId === order.linkedSalesReturnSystemId)?.id || 'N/A'})
                                        </Link>
                                    )}
                                </span>
                                <span className="text-red-600">-{formatCurrency(order.linkedSalesReturnValue)}</span>
                            </div>
                        )}
                        {totalWarrantyDeduction > 0 && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Trừ tiền bảo hành
                                    {warrantyPayments.map((payment, idx) => (
                                        <React.Fragment key={payment.systemId}>
                                            {idx === 0 && ' ('}
                                            <Link 
                                                to={`/payments/${payment.systemId}`} 
                                                className="text-primary hover:underline font-medium"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {payment.id}
                                            </Link>
                                            {idx < warrantyPayments.length - 1 ? ', ' : ')'}
                                        </React.Fragment>
                                    ))}:
                                </span>
                                <span className="text-red-600">-{formatCurrency(totalWarrantyDeduction)}</span>
                            </div>
                        )}
                        <Separator className="!my-2" />
                        <div className="flex justify-between font-bold text-base"><span>Khách phải trả</span> <span>{formatCurrency(order.grandTotal)}</span></div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

const getFinancialResolutionText = (returnSlip: SalesReturn, allTransactions: (Receipt | Payment)[]) => {
    const transactionSystemId = returnSlip.paymentVoucherSystemId || returnSlip.receiptVoucherSystemIds?.[0];
    const transaction = transactionSystemId ? allTransactions.find(t => t.systemId === transactionSystemId) : null;
    const transactionLink = transaction ? (
      <Link to={`/${returnSlip.paymentVoucherSystemId ? 'payments' : 'receipts'}/${transaction.systemId}`} onClick={(e) => e.stopPropagation()} className="ml-1 font-medium text-primary hover:underline">({transaction.id})</Link>
    ) : null;

    if (returnSlip.finalAmount < 0) {
        return <>{`Hoàn tiền ${formatCurrency(Math.abs(returnSlip.finalAmount))} (${returnSlip.refundMethod})`} {transactionLink}</>;
    }
    if (returnSlip.finalAmount > 0) {
        return <>{`Khách trả thêm ${formatCurrency(returnSlip.finalAmount)}`} {transactionLink}</>;
    }
    if (returnSlip.totalReturnValue > 0 && returnSlip.grandTotalNew === 0) {
        return `Cấn trừ công nợ: ${formatCurrency(returnSlip.totalReturnValue)}`;
    }
    if (returnSlip.totalReturnValue > 0 && returnSlip.finalAmount === 0) {
        return `Đổi ngang giá`;
    }
    return 'Không thay đổi tài chính';
};

const ReturnHistoryTab = ({ order, salesReturnsForOrder }: { order: Order, salesReturnsForOrder: SalesReturn[] }) => {
    const [expandedReturnId, setExpandedReturnId] = React.useState<string | null>(null);
    const { data: orders } = useOrderStore();

    return (
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12"></TableHead>
                            <TableHead>Mã đơn trả hàng</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Ngày trả hàng</TableHead>
                            <TableHead className="text-center">Số lượng hàng trả</TableHead>
                            <TableHead className="text-right">Giá trị hàng trả</TableHead>
                            <TableHead>Mã đơn đổi</TableHead>
                            <TableHead className="text-center">Số lượng hàng đổi</TableHead>
                            <TableHead className="text-right">Giá trị hàng đổi</TableHead>
                            <TableHead className="text-right">Chênh lệch</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {salesReturnsForOrder.map(returnSlip => {
                            const isExpanded = expandedReturnId === returnSlip.systemId;
                            const totalReturnQty = returnSlip.items.reduce((sum, item) => sum + item.returnQuantity, 0);
                            const totalExchangeQty = returnSlip.exchangeItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;
                            const exchangeOrder = returnSlip.exchangeOrderSystemId ? orders.find(o => o.systemId === returnSlip.exchangeOrderSystemId) : null;

                            return (
                                <React.Fragment key={returnSlip.systemId}>
                                    <TableRow onClick={() => setExpandedReturnId(isExpanded ? null : returnSlip.systemId)} className="cursor-pointer hover:bg-muted/50">
                                        <TableCell>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Link 
                                                to={`/returns/${returnSlip.systemId}`} 
                                                onClick={e => e.stopPropagation()} 
                                                className="font-medium text-primary hover:underline"
                                            >
                                                {returnSlip.id}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                returnSlip.isReceived 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-amber-100 text-amber-800'
                                            }`}>
                                                {returnSlip.isReceived ? 'Đã nhận' : 'Chưa nhận'}
                                            </span>
                                        </TableCell>
                                        <TableCell>{formatDate(returnSlip.returnDate)}</TableCell>
                                        <TableCell className="text-center">{totalReturnQty}</TableCell>
                                        <TableCell className="text-right font-medium">{formatCurrency(returnSlip.totalReturnValue)}</TableCell>
                                        <TableCell>
                                            {exchangeOrder ? (
                                                <Link 
                                                    to={`/orders/${exchangeOrder.systemId}`} 
                                                    onClick={e => e.stopPropagation()} 
                                                    className="text-primary hover:underline"
                                                >
                                                    {exchangeOrder.id}
                                                </Link>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {totalExchangeQty > 0 ? totalExchangeQty : <span className="text-muted-foreground">-</span>}
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {returnSlip.grandTotalNew > 0 ? formatCurrency(returnSlip.grandTotalNew) : <span className="text-muted-foreground">-</span>}
                                        </TableCell>
                                        <TableCell className={`text-right font-semibold ${
                                            returnSlip.finalAmount < 0 ? 'text-green-600' : 
                                            returnSlip.finalAmount > 0 ? 'text-amber-600' : 
                                            'text-muted-foreground'
                                        }`}>
                                            {returnSlip.finalAmount < 0 && '-'}{formatCurrency(Math.abs(returnSlip.finalAmount))}
                                        </TableCell>
                                    </TableRow>
                                    {isExpanded && (
                                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                                            <TableCell colSpan={10} className="p-4">
                                                <div className="space-y-4">
                                                    <div>
                                                        <h4 className="font-semibold mb-2">Chi tiết hàng trả</h4>
                                                        <div className="border rounded-md bg-background">
                                                            <Table>
                                                                <TableHeader>
                                                                    <TableRow>
                                                                        <TableHead>STT</TableHead>
                                                                        <TableHead>Tên sản phẩm</TableHead>
                                                                        <TableHead className="text-center">Số lượng</TableHead>
                                                                        <TableHead className="text-right">Đơn giá trả</TableHead>
                                                                        <TableHead className="text-right">Thành tiền</TableHead>
                                                                    </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                    {returnSlip.items.map((item: any, index: number) => (
                                                                        <TableRow key={item.productSystemId}>
                                                                            <TableCell>{index + 1}</TableCell>
                                                                            <TableCell>
                                                                                <p className="font-medium">{item.productName}</p>
                                                                                <p className="text-xs text-muted-foreground">{item.productId}</p>
                                                                            </TableCell>
                                                                            <TableCell className="text-center">{item.returnQuantity}</TableCell>
                                                                            <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                                                                            <TableCell className="text-right font-medium">{formatCurrency(item.totalValue)}</TableCell>
                                                                        </TableRow>
                                                                    ))}
                                                                </TableBody>
                                                                <TableFooter>
                                                                    <TableRow>
                                                                        <TableCell colSpan={4} className="text-right font-semibold">Tổng cộng</TableCell>
                                                                        <TableCell className="text-right font-bold">{formatCurrency(returnSlip.totalReturnValue)}</TableCell>
                                                                    </TableRow>
                                                                </TableFooter>
                                                            </Table>
                                                        </div>
                                                    </div>
                                                    
                                                    {returnSlip.exchangeItems && returnSlip.exchangeItems.length > 0 && (
                                                        <div>
                                                            <h4 className="font-semibold mb-2">Chi tiết hàng đổi</h4>
                                                            <div className="border rounded-md bg-background">
                                                                <Table>
                                                                    <TableHeader>
                                                                        <TableRow>
                                                                            <TableHead>STT</TableHead>
                                                                            <TableHead>Tên sản phẩm</TableHead>
                                                                            <TableHead className="text-center">Số lượng</TableHead>
                                                                            <TableHead className="text-right">Đơn giá</TableHead>
                                                                            <TableHead className="text-right">Thành tiền</TableHead>
                                                                        </TableRow>
                                                                    </TableHeader>
                                                                    <TableBody>
                                                                        {returnSlip.exchangeItems.map((item: any, index: number) => {
                                                                            const lineTotal = item.quantity * item.unitPrice - (item.discountType === 'percentage' ? (item.quantity * item.unitPrice * item.discount / 100) : item.discount);
                                                                            return (
                                                                                <TableRow key={item.productSystemId}>
                                                                                    <TableCell>{index + 1}</TableCell>
                                                                                    <TableCell>
                                                                                        <p className="font-medium">{item.productName}</p>
                                                                                        <p className="text-xs text-muted-foreground">{item.productId}</p>
                                                                                    </TableCell>
                                                                                    <TableCell className="text-center">{item.quantity}</TableCell>
                                                                                    <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                                                                                    <TableCell className="text-right font-medium">{formatCurrency(lineTotal)}</TableCell>
                                                                                </TableRow>
                                                                            );
                                                                        })}
                                                                    </TableBody>
                                                                    <TableFooter>
                                                                        <TableRow>
                                                                            <TableCell colSpan={4} className="text-right font-semibold">Tổng cộng</TableCell>
                                                                            <TableCell className="text-right font-bold">{formatCurrency(returnSlip.grandTotalNew)}</TableCell>
                                                                        </TableRow>
                                                                    </TableFooter>
                                                                </Table>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
};


export function OrderDetailPage() {
    const params = ReactRouterDOM.useParams<{ systemId?: string; id?: string }>();
    const navigate = ReactRouterDOM.useNavigate();

    const orderStore = useOrderStore();
    const orders: Order[] = orderStore.data ?? [];
    const order = React.useMemo(() => {
        if (params.systemId) {
            const systemIdParam = asSystemId(params.systemId);
            const bySystemId = orderStore.findById?.(systemIdParam);
            if (bySystemId) {
                return bySystemId;
            }
        }

        if (params.id) {
            return orders.find(o => o.id === params.id) ?? null;
        }

        return null;
    }, [orderStore, orders, params.id, params.systemId]);

    console.log('🔍 [OrderDetail] lookup param:', params.systemId || params.id, 'foundOrder:', !!order, order ? { systemId: order.systemId, id: order.id } : null);
    const { cancelOrder, addPayment, requestPackaging, confirmPackaging, cancelPackagingRequest, processInStorePickup, confirmPartnerShipment, dispatchFromWarehouse, completeDelivery, failDelivery, cancelDelivery, cancelDeliveryOnly, confirmInStorePickup, cancelGHTKShipment } = orderStore;
    const { findById: findProductById } = useProductStore();
    const { data: allSalesReturns } = useSalesReturnStore();
    const { data: warranties } = useWarrantyStore();
    
    const { data: customers } = useCustomerStore();
    const customer = order ? customers.find(c => c.systemId === order.customerSystemId) : null;
    const { employee: authEmployee } = useAuth();
    const currentEmployeeSystemId: SystemId = authEmployee?.systemId ?? asSystemId('SYSTEM');

    const [isCancelAlertOpen, setIsCancelAlertOpen] = React.useState(false);
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = React.useState(false);
    const [isCreateShipmentDialogOpen, setIsCreateShipmentDialogOpen] = React.useState(false);
    const [isPackerSelectionOpen, setIsPackerSelectionOpen] = React.useState(false);
    const [cancelPackagingState, setCancelPackagingState] = React.useState<{ packagingSystemId: SystemId } | null>(null);
    const [cancelShipmentState, setCancelShipmentState] = React.useState<{ packagingSystemId: SystemId; type: 'fail' | 'cancel' } | null>(null);

    const totalPaid = React.useMemo(() => (order?.payments || []).reduce((sum, p) => sum + p.amount, 0), [order?.payments]);
    // totalPaid có thể âm (nếu có warranty payment), dương (nếu khách trả tiền), hoặc 0
    // amountRemaining = grandTotal + totalPaid (vì totalPaid âm khi có warranty)
    // VD: 3.775.000 + (-2.000.000) = 1.775.000
    const amountRemaining = (order?.grandTotal || 0) + totalPaid;
    
    const salesReturnsForOrder = React.useMemo(() => {
        if (!order) return [];
        return allSalesReturns.filter(sr => sr.orderSystemId === order.systemId);
    }, [order, allSalesReturns]);
    
    const totalReturnedValue = React.useMemo(() => 
        salesReturnsForOrder.reduce((sum, sr) => sum + sr.totalReturnValue, 0),
    [salesReturnsForOrder]);

    const codPayments = React.useMemo(() => (order?.payments || []).filter(p => p.method === 'Đối soát COD'), [order?.payments]);
    const directPayments = React.useMemo(() => (order?.payments || []).filter(p => p.method !== 'Đối soát COD'), [order?.payments]);

    const totalActiveCod = React.useMemo(() => {
        if (!order?.packagings) return 0;
    
        return order.packagings.reduce((sum, pkg) => {
            const activeCodStatuses: OrderDeliveryStatus[] = ['Chờ lấy hàng', 'Đang giao hàng', 'Đã giao hàng'];
            if (pkg.status !== 'Hủy đóng gói' && pkg.reconciliationStatus !== 'Đã đối soát' && pkg.deliveryStatus && activeCodStatuses.includes(pkg.deliveryStatus)) {
                return sum + (pkg.codAmount || 0);
            }
            return sum;
        }, 0);
    }, [order]);
    
    const totalCodAmount = totalActiveCod + codPayments.reduce((s, p) => s + p.amount, 0);
    const payableAmount = Math.max(0, amountRemaining);
    
    const { costOfGoods, profit, totalDiscount } = React.useMemo(() => {
        if (!order) return { costOfGoods: 0, profit: 0, totalDiscount: 0 };
        const cost = order.lineItems.reduce((sum, item) => {
            const product = findProductById(item.productSystemId);
            return sum + ((product?.costPrice || 0) * item.quantity);
        }, 0);
        const discount = order.lineItems.reduce((sum, item) => {
            const lineGross = item.unitPrice * item.quantity;
            const discountAmount = item.discountType === 'percentage' ? lineGross * (item.discount / 100) : item.discount;
            return sum + (discountAmount * item.quantity);
        }, 0);
        const profit = order.subtotal - cost;
        return { costOfGoods: cost, profit: profit, totalDiscount: discount };
    }, [order, findProductById]);
    
    const isActionable = order?.status !== 'Hoàn thành' && order?.status !== 'Đã hủy';

    const activePackaging = React.useMemo(() => {
        if (!order || !order.packagings || order.packagings.length === 0) {
            return null;
        }
        return [...order.packagings].reverse().find(p => p.status !== 'Hủy đóng gói') || null;
    }, [order]);

    // Auto-sync GHTK status on page load
    const [isSyncing, setIsSyncing] = React.useState(false);
    React.useEffect(() => {
        if (!order) return;
        
        const ghtkPackagings = order.packagings.filter(
            p => p.carrier === 'GHTK' && p.trackingCode
        );
        
        if (ghtkPackagings.length === 0) return;
        
        setIsSyncing(true);
        
        // Dynamically import to avoid circular dependencies
        import('../../lib/ghtk-sync-service').then(({ ghtkSyncService }) => {
            ghtkSyncService.syncOrder(order.systemId)
                .catch(error => {
                    console.error('[Order Detail] GHTK sync failed:', error);
                })
                .finally(() => {
                    setIsSyncing(false);
                });
        });
    }, [order?.systemId]);

    const handleConfirmCancel = async () => { 
        if (!order) return;
        
        // Check if order has active GHTK shipment that needs to be cancelled
        const ghtkPackaging = order.packagings.find(p => 
            p.carrier === 'GHTK' && 
            p.trackingCode && 
            p.status !== 'Hủy đóng gói' &&
            p.deliveryStatus !== 'Đã giao hàng' &&
            p.deliveryStatus !== 'Hoàn tất giao hàng'
        );
        
        if (ghtkPackaging && ghtkPackaging.trackingCode) {
            try {
                console.log('[Cancel Order] Attempting to cancel GHTK shipment first:', ghtkPackaging.trackingCode);
                const { cancelGHTKShipment } = useOrderStore.getState();
                const result = await cancelGHTKShipment(
                    order.systemId, 
                    ghtkPackaging.systemId, 
                    ghtkPackaging.trackingCode
                );
                
                if (!result.success) {
                    // GHTK cancel failed, show toast with action to continue
                    toast.error(
                        `Không thể hủy vận đơn GHTK: ${result.message}`,
                        {
                            description: 'Bạn có muốn tiếp tục hủy đơn hàng không?',
                            action: {
                                label: 'Tiếp tục',
                                onClick: () => {
                                    cancelOrder(order.systemId, currentEmployeeSystemId);
                                    setIsCancelAlertOpen(false);
                                }
                            },
                            cancel: {
                                label: 'Hủy bỏ',
                                onClick: () => {
                                    setIsCancelAlertOpen(false);
                                }
                            }
                        }
                    );
                    return;
                }
            } catch (error: any) {
                console.error('[Cancel Order] GHTK cancel error:', error);
                toast.error(
                    `Lỗi khi hủy vận đơn GHTK: ${error.message}`,
                    {
                        description: 'Bạn có muốn tiếp tục hủy đơn hàng không?',
                        action: {
                            label: 'Tiếp tục',
                            onClick: () => {
                                cancelOrder(order.systemId, currentEmployeeSystemId);
                                setIsCancelAlertOpen(false);
                            }
                        },
                        cancel: {
                            label: 'Hủy bỏ',
                            onClick: () => {
                                setIsCancelAlertOpen(false);
                            }
                        }
                    }
                );
                return;
            }
        }
        
        // Proceed with order cancellation
        cancelOrder(order.systemId, currentEmployeeSystemId); 
        setIsCancelAlertOpen(false); 
    };
    const handleAddPayment = (paymentData: PaymentFormValues) => { if (order) { addPayment(order.systemId, paymentData, currentEmployeeSystemId); setIsPaymentDialogOpen(false); } };
    const handleRequestPackaging = (assignedEmployeeId?: SystemId) => { if (order) { requestPackaging(order.systemId, currentEmployeeSystemId, assignedEmployeeId); } };
    const handleConfirmPackaging = (packagingSystemId: SystemId) => { if (order) { confirmPackaging(order.systemId, packagingSystemId, currentEmployeeSystemId); } };
    const handleCancelPackagingSubmit = (reason: string) => { if (order && cancelPackagingState) { cancelPackagingRequest(order.systemId, cancelPackagingState.packagingSystemId, currentEmployeeSystemId, reason); setCancelPackagingState(null); }};
    const handleInStorePickup = (packagingSystemId: SystemId) => { if (order) { processInStorePickup(order.systemId, packagingSystemId); } };
    const handleShippingSubmit = (data: any) => { if (order && activePackaging) { return confirmPartnerShipment(order.systemId, activePackaging.systemId, data); } return Promise.resolve({success: false, message: 'Đơn hàng không hợp lệ'}); };
    
    const handleDispatch = (packagingSystemId: SystemId) => { 
        if (order) { 
            const pkg = order.packagings.find(p => p.systemId === packagingSystemId);
            if (pkg?.deliveryMethod === 'Nhận tại cửa hàng') {
                confirmInStorePickup(order.systemId, packagingSystemId, currentEmployeeSystemId);
            } else {
                dispatchFromWarehouse(order.systemId, packagingSystemId, currentEmployeeSystemId); 
            }
        } 
    };

    const handleCompleteDelivery = (packagingSystemId: SystemId) => { if (order) { completeDelivery(order.systemId, packagingSystemId, currentEmployeeSystemId); }};
    const handleFailDeliverySubmit = (reason: string) => { if (order && cancelShipmentState) { failDelivery(order.systemId, cancelShipmentState.packagingSystemId, currentEmployeeSystemId, reason); setCancelShipmentState(null); }};
    
    // ✅ Hủy giao hàng - KHÔNG trả hàng về kho (hàng bị thất tung/shipper giữ)
    const handleCancelDeliveryOnly = async () => { 
        if (order && cancelShipmentState) { 
            const packaging = order.packagings.find(p => p.systemId === cancelShipmentState.packagingSystemId);
            const trackingCode = packaging?.trackingCode;
            
            // Nếu có tracking code GHTK, gọi API hủy trước
            if (trackingCode && trackingCode.startsWith('S')) {
                try {
                    const result = await cancelGHTKShipment(order.systemId, cancelShipmentState.packagingSystemId, trackingCode);
                    
                    if (!result.success) {
                        toast.error(`⚠️ Không thể hủy vận đơn GHTK: ${result.message}\n\nVui lòng hủy trên hệ thống đối tác.`);
                        setCancelShipmentState(null);
                        return;
                    }
                } catch (error: any) {
                    toast.error(`⚠️ Lỗi khi hủy vận đơn GHTK: ${error.message || 'Không rõ lỗi'}\n\nVui lòng hủy trên hệ thống đối tác.`);
                    setCancelShipmentState(null);
                    return;
                }
            }
            
            // ✅ Chỉ update trạng thái, KHÔNG trả hàng về kho
            cancelDeliveryOnly(order.systemId, cancelShipmentState.packagingSystemId, currentEmployeeSystemId, "Hủy giao hàng"); 
            setCancelShipmentState(null); 
        }
    };
    
    // ✅ Hủy giao và nhận lại hàng - TRẢ hàng về kho (đã nhận lại từ shipper)
    const handleCancelDeliveryAndRestock = async () => { 
        if (order && cancelShipmentState) { 
            const packaging = order.packagings.find(p => p.systemId === cancelShipmentState.packagingSystemId);
            const trackingCode = packaging?.trackingCode;
            
            // Nếu có tracking code GHTK, gọi API hủy trước
            if (trackingCode && trackingCode.startsWith('S')) {
                try {
                    const result = await cancelGHTKShipment(order.systemId, cancelShipmentState.packagingSystemId, trackingCode);
                    
                    if (!result.success) {
                        toast.error(`⚠️ Không thể hủy vận đơn GHTK: ${result.message}\n\nVui lòng hủy trên hệ thống đối tác.`);
                        setCancelShipmentState(null);
                        return;
                    }
                } catch (error: any) {
                    toast.error(`⚠️ Lỗi khi hủy vận đơn GHTK: ${error.message || 'Không rõ lỗi'}\n\nVui lòng hủy trên hệ thống đối tác.`);
                    setCancelShipmentState(null);
                    return;
                }
            }
            
            // ✅ Update trạng thái + TRẢ hàng về kho
            cancelDelivery(order.systemId, cancelShipmentState.packagingSystemId, currentEmployeeSystemId, "Hủy giao và nhận lại hàng"); 
            setCancelShipmentState(null); 
        }
    };
    
    const handleCancelGHTKShipment = async (packagingSystemId: SystemId, trackingCode: string) => {
        if (!order) return;
        
        toast.info('Đang hủy vận đơn GHTK...', { description: 'Lưu ý: Chỉ có thể hủy khi đơn chưa được lấy hàng.' });
        
        try {
            const result = await cancelGHTKShipment(order.systemId, packagingSystemId, trackingCode);
            
            if (result.success) {
                toast.success('Đã hủy vận đơn GHTK thành công!');
            } else {
                toast.error(`Lỗi: ${result.message}`);
            }
        } catch (error: any) {
            toast.error(`Lỗi: ${error.message || 'Không thể hủy vận đơn'}`);
        }
    };


    const pageActions = React.useMemo(() => {
        const canReturn = order && 
            (order.status === 'Hoàn thành' || order.status === 'Đang giao dịch') && 
            order.returnStatus !== 'Trả hàng toàn bộ' &&
            order.stockOutStatus !== 'Chưa xuất kho';
        
        // Check packaging status
        const activePackaging = order?.packagings?.find(p => p.status !== 'Hủy đóng gói');
        const canRequestPackaging = isActionable && (!activePackaging || activePackaging.deliveryStatus === 'Chờ giao lại');
        const canConfirmPackaging = activePackaging?.status === 'Chờ đóng gói';
        const canShip = activePackaging?.status === 'Đã đóng gói' && activePackaging?.deliveryStatus === 'Chờ lấy hàng';
        const canStockOut = order?.stockOutStatus === 'Chưa xuất kho' && order?.status !== 'Đã hủy';
            
        return (
            <div className="flex items-center gap-2 flex-wrap">
                <Button variant="outline" size="sm" onClick={() => navigate('/orders')}>
                    Quay lại
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast.info('Chức năng đang phát triển')}>
                    In
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast.info('Chức năng đang phát triển')}>
                    Sao chép
                </Button>
                {canStockOut && (
                    <Button size="sm" onClick={() => toast.info('Xác nhận xuất kho')}>
                        Xác nhận xuất kho
                    </Button>
                )}
                {canRequestPackaging && (
                    <Button size="sm" onClick={() => setIsPackerSelectionOpen(true)}>
                        Yêu cầu đóng gói
                    </Button>
                )}
                {canConfirmPackaging && (
                    <Button size="sm" onClick={() => toast.info('Xác nhận đóng gói')}>
                        Xác nhận đóng gói
                    </Button>
                )}
                {canShip && (
                    <Button size="sm" onClick={() => toast.info('Giao hàng')}>
                        Giao hàng
                    </Button>
                )}
                {canReturn && (
                    <Button variant="outline" size="sm" onClick={() => navigate(`/orders/${order.systemId}/return`)}>
                        Hoàn trả hàng
                    </Button>
                )}
                {isActionable && (
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setIsCancelAlertOpen(true)} 
                        className="border-destructive text-destructive hover:bg-destructive/5 hover:text-destructive"
                    >
                        Hủy đơn hàng
                    </Button>
                )}
                {order?.status !== 'Hoàn thành' && order?.status !== 'Đã hủy' && (
                    <Button variant="outline" size="sm" onClick={() => navigate(`/orders/${order.systemId}/edit`)}>
                        Sửa
                    </Button>
                )}
            </div>
        );
    }, [navigate, order, isActionable]);

    const pageTitle = React.useMemo(() => (
        <span>Đơn hàng {order?.id}</span>
    ), [order?.id]);

    usePageHeader({ 
        title: pageTitle,
        actions: [pageActions] 
    });

    if (!order) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">Không tìm thấy đơn hàng.</h2>
                    <Button onClick={() => navigate('/orders')} className="mt-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Quay về danh sách đơn hàng
                    </Button>
                </div>
            </div>
        );
    }
    
    // ✅ Ưu tiên địa chỉ đã lưu trong đơn hàng, fallback về địa chỉ mặc định của khách hàng
    const shippingAddress = formatAddressObject(order.shippingAddress) || (customer ? getCustomerAddress(customer, 'shipping') : '');
    const billingAddress = formatAddressObject(order.billingAddress) || (customer ? getCustomerAddress(customer, 'billing') : '');
    const isBillingSameAsShipping = shippingAddress === billingAddress || !billingAddress;


    const renderMainPackagingActionButtons = () => {
        if (!isActionable) return null;
    
        const canRequestPackaging = !activePackaging || activePackaging.deliveryStatus === 'Chờ giao lại';
        
        if (canRequestPackaging) {
            return <Button size="sm" onClick={() => setIsPackerSelectionOpen(true)}>Yêu cầu đóng gói</Button>;
        }
        
        return null;
    };
    
    return (
        <>
            <div className="space-y-4 md:space-y-6">
                {/* GHTK Sync Indicator */}
                {isSyncing && (
                    <Card className="border-blue-200 bg-blue-50">
                        <CardContent className="p-3">
                            <div className="flex items-center gap-2 text-sm">
                                <Spinner className="h-4 w-4 text-blue-600" />
                                <span className="text-blue-900">Đang đồng bộ trạng thái vận chuyển GHTK...</span>
                            </div>
                        </CardContent>
                    </Card>
                )}
                
                {/* Status Card - Full width */}
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Badge variant={statusVariants[order.status]}>{order.status}</Badge>
                        </div>
                        <StatusStepper order={order} />
                    </CardContent>
                </Card>

                {/* Row 1: Thông tin đơn hàng + Thông tin khách hàng */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Thông tin khách hàng - 2/3 width on desktop */}
                    <Card className="lg:col-span-2 flex flex-col">
                        <CardHeader className="flex-shrink-0">
                            <CardTitle className="text-base font-semibold">Thông tin khách hàng</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2 space-y-4">
                                    <p className="font-semibold text-primary cursor-pointer hover:underline" onClick={() => navigate(`/customers/${customer?.systemId}`)}>{order.customerName}</p>
                                    <div>
                                        <p className="text-sm text-muted-foreground font-semibold">
                                            ĐỊA CHỈ GIAO HÀNG
                                        </p>
                                        <p className="text-sm text-muted-foreground">{shippingAddress || 'Chưa có thông tin giao hàng'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground font-semibold">
                                            ĐỊA CHỈ NHẬN HÓA ĐƠN
                                        </p>
                                        <p className="text-sm text-muted-foreground">{billingAddress || '-'}</p>
                                    </div>
                                </div>
                                <div className="text-sm space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Nợ phải thu:</span>
                                        <span className="font-medium text-red-500">{formatCurrency(customer?.currentDebt)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Tổng chi tiêu:</span>
                                        <span className="font-medium">{formatCurrency(customer?.totalSpent)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Trả hàng:</span>
                                        <span className="font-medium">0</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Giao thất bại:</span>
                                        <span className="font-medium">0</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Thông tin đơn hàng - 1/3 width on desktop */}
                    <Card className="flex flex-col h-full lg:h-auto">
                        <CardHeader className="flex-shrink-0">
                            <CardTitle className="text-base font-semibold">Thông tin đơn hàng</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-3 overflow-y-auto flex-1 max-h-[400px] lg:max-h-none"
                            style={{ 
                                scrollbarWidth: 'thin',
                                scrollbarColor: 'rgb(203 213 225) transparent'
                            }}
                        >
                            <DetailField label="Chính sách giá" value="Giá bán lẻ" />
                            <DetailField label="Bán tại" value={order.branchName} />
                            <div className="flex">
                                <span className="text-muted-foreground min-w-[140px]">Bán bởi:</span>
                                <Link to={`/employees/${order.salespersonSystemId}`} className="text-primary hover:underline font-medium">
                                    {order.salesperson}
                                </Link>
                            </div>
                            <DetailField label="Hẹn giao hàng" value={order.expectedDeliveryDate || '---'} />
                            <DetailField label="Nguồn" value={order.source || '---'} />
                            <DetailField label="Kênh bán hàng" value="Khác" />
                            <DetailField label="Ngày bán" value={formatDate(order.orderDate)} />
                            {order.expectedPaymentMethod && (
                                <DetailField label="Hình thức thanh toán" value={order.expectedPaymentMethod} />
                            )}
                            {order.referenceUrl && (
                                <div>
                                    <span className="text-muted-foreground">Link đơn hàng:</span>{' '}
                                    <a href={order.referenceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                        {order.referenceUrl}
                                    </a>
                                </div>
                            )}
                            {order.externalReference && (
                                <DetailField label="Mã tham chiếu" value={order.externalReference} />
                            )}
                            {order.tags && order.tags.length > 0 && (
                                <div>
                                    <span className="text-muted-foreground">Tags:</span>{' '}
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {order.tags.map((tag, idx) => (
                                            <Badge key={idx} variant="secondary" className="text-xs">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {order.serviceFees && order.serviceFees.length > 0 && (
                                <div>
                                    <span className="text-muted-foreground">Phí dịch vụ:</span>
                                    {order.serviceFees.map((fee) => (
                                        <div key={fee.id} className="ml-4 text-sm">
                                            {fee.name}: {fee.amount.toLocaleString()}đ
                                        </div>
                                    ))}
                                </div>
                            )}
                            {order.notes && (
                                <div>
                                    <span className="text-muted-foreground">Ghi chú:</span>
                                    <p className="mt-1 text-sm whitespace-pre-wrap">{order.notes}</p>
                                </div>
                            )}
                            <Button 
                                variant="link" 
                                className="p-0 h-auto text-sm" 
                                onClick={() => {
                                    // Scroll to history tab
                                    const historyTab = document.querySelector('[value="history"]');
                                    if (historyTab) {
                                        (historyTab as HTMLElement).click();
                                        setTimeout(() => {
                                            historyTab.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }, 100);
                                    }
                                }}
                            >
                                <Link to={`/customers/${customer?.systemId}`} className="hover:underline">
                                    Xem lịch sử đơn hàng
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Row 2: Đơn hàng chờ thanh toán - Full width */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-2">
                                {order.paymentStatus === 'Thanh toán toàn bộ' ? (
                                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                                ) : (
                                    <FileWarning className="h-5 w-5 text-amber-500 flex-shrink-0" />
                                )}
                                <CardTitle className="text-base font-semibold">
                                    {order.paymentStatus === 'Chưa thanh toán' 
                                        ? 'Đơn hàng chờ thanh toán' 
                                        : `Đơn hàng thanh toán ${order.paymentStatus.toLowerCase()}`}
                                </CardTitle>
                            </div>
                            {isActionable && payableAmount > 0 && (
                                <Button size="sm" onClick={() => setIsPaymentDialogOpen(true)}>
                                    Thanh toán
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="grid grid-cols-1 gap-2 bg-muted/50 p-3 sm:p-4 rounded-md text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tổng tiền ĐH:</span>
                                <span className="font-medium">{formatCurrency(order.grandTotal)}</span>
                            </div>
                            {totalReturnedValue > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Giá trị hàng bị trả lại:</span>
                                    <span className="font-medium">-{formatCurrency(totalReturnedValue)}</span>
                                </div>
                            )}
                            {totalReturnedValue > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground font-semibold">Công nợ thực tế:</span>
                                    <span className="font-semibold">{formatCurrency(order.grandTotal - totalReturnedValue)}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Đã trả:</span>
                                <span className="font-medium">{totalPaid >= 0 ? '-' : ''}{formatCurrency(Math.abs(totalPaid))}</span>
                            </div>
                            
                            {totalCodAmount > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Thu hộ COD:</span>
                                    <span className="font-medium text-blue-600">
                                        {formatCurrency(totalCodAmount)}
                                    </span>
                                </div>
                            )}
                            
                            <div className="border-t my-1" />
                            
                            <div className="flex justify-between">
                                <span className="text-muted-foreground font-bold">Còn phải trả:</span>
                                <span className={cn(
                                    "font-bold text-lg",
                                    amountRemaining > 0 ? 'text-red-500' : 'text-foreground'
                                )}>{formatCurrency(amountRemaining)}</span>
                            </div>
                        </div>

                        {directPayments.length > 0 && (
                            <div className="space-y-2 pt-2">
                                {[...directPayments].reverse().map((payment, index) => (
                                    <React.Fragment key={`direct-${payment.systemId}-${index}`}>
                                        <PaymentInfo payment={payment} />
                                    </React.Fragment>
                                ))}
                            </div>
                        )}
                        
                        {(totalActiveCod > 0 || codPayments.length > 0) && (
                            <div className="space-y-2 pt-2">
                                {codPayments.length > 0 && [...codPayments].reverse().map((payment, index) => (
                                    <React.Fragment key={`cod-${payment.systemId}-${index}`}>
                                        <PaymentInfo payment={payment} />
                                    </React.Fragment>
                                ))}
                                {totalActiveCod > 0 && (
                                    <div className="border rounded-md bg-background text-sm p-3 flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Chờ đối soát</p>
                                            <p className="text-muted-foreground text-xs">Đối tác vận chuyển sẽ hoàn tiền sau khi đối soát</p>
                                        </div>
                                        <div className="font-semibold">{formatCurrency(totalActiveCod)}</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Row 3: Đóng gói và Giao hàng - Full width */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                <CardTitle className="text-base font-semibold">Đóng gói và Giao hàng</CardTitle>
                            </div>
                            {renderMainPackagingActionButtons()}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {order.packagings.length === 0 && (
                            <div className="text-center text-muted-foreground py-4">
                                Chưa có yêu cầu đóng gói.
                            </div>
                        )}
                        {[...order.packagings].reverse().map(pkg => (
                            <React.Fragment key={pkg.systemId}>
                                <PackagingInfo
                                    order={order}
                                    packaging={pkg}
                                    isActionable={isActionable}
                                    onConfirmPackaging={() => handleConfirmPackaging(pkg.systemId)}
                                    onCancelPackaging={() => setCancelPackagingState({ packagingSystemId: pkg.systemId })}
                                    onDispatch={() => handleDispatch(pkg.systemId)}
                                    onCompleteDelivery={() => handleCompleteDelivery(pkg.systemId)}
                                    onOpenShipmentDialog={() => setIsCreateShipmentDialogOpen(true)}
                                    onFailDelivery={() => setCancelShipmentState({ packagingSystemId: pkg.systemId, type: 'fail'})}
                                    onCancelDelivery={() => setCancelShipmentState({ packagingSystemId: pkg.systemId, type: 'cancel' })}
                                    onInStorePickup={() => handleInStorePickup(pkg.systemId)}
                                    onCancelGHTKShipment={pkg.trackingCode ? () => handleCancelGHTKShipment(pkg.systemId, pkg.trackingCode!) : undefined}
                                />
                            </React.Fragment>
                        ))}
                    </CardContent>
                </Card>

                {/* Product Info Card - Always visible */}
                <ProductInfoCard order={order} costOfGoods={costOfGoods} profit={profit} totalDiscount={totalDiscount} salesReturns={allSalesReturns} />
                
                {/* Return History Card - Show only if there are returns */}
                {salesReturnsForOrder.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">
                                Lịch sử trả hàng ({salesReturnsForOrder.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ReturnHistoryTab order={order} salesReturnsForOrder={salesReturnsForOrder} />
                        </CardContent>
                    </Card>
                )}
                
                {/* Tabs - Order History, Shipping Tracking & Notes */}
                <Tabs defaultValue="history" className="w-full">
                    <TabsList className="w-full sm:w-auto">
                        <TabsTrigger value="history" className="flex-1 sm:flex-none">Lịch sử & Ghi chú</TabsTrigger>
                        {/* Show Vận chuyển tab if order has shipping partner delivery */}
                        {order.packagings.some(p => p.deliveryMethod === 'Dịch vụ giao hàng' && p.status !== 'Hủy đóng gói') && (
                            <TabsTrigger value="shipping" className="flex-1 sm:flex-none">
                                <Truck className="h-4 w-4 mr-1" />
                                Vận chuyển
                            </TabsTrigger>
                        )}
                    </TabsList>
                    <TabsContent value="history" className="mt-4">
                        <OrderHistoryTab order={order} salesReturnsForOrder={salesReturnsForOrder}/>
                    </TabsContent>
                    <TabsContent value="shipping" className="mt-4">
                        <ShippingTrackingTab order={order} />
                    </TabsContent>
                </Tabs>
            </div>

            <Dialog open={isCancelAlertOpen} onOpenChange={setIsCancelAlertOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-9 w-10 rounded-full bg-red-100 flex items-center justify-center">
                                <Ban className="h-5 w-5 text-red-600" />
                            </div>
                            <DialogTitle className="text-lg">Hủy đơn hàng</DialogTitle>
                        </div>
                        <DialogDescription className="text-sm leading-relaxed">
                            Bạn có chắc chắn muốn hủy đơn hàng này không? Đơn hàng sẽ chuyển sang trạng thái "Đã hủy" và không thể khôi phục.
                            {order && order.payments && order.payments.length > 0 && (
                                <span className="block mt-2 text-amber-600 font-medium">
                                    Lưu ý: Đơn hàng đã có thanh toán. Một phiếu chi hoàn tiền sẽ được tạo tự động.
                                </span>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setIsCancelAlertOpen(false)} className="flex-1 sm:flex-none">
                            Quay lại
                        </Button>
                        <Button variant="destructive" onClick={handleConfirmCancel} className="flex-1 sm:flex-none">
                            Xác nhận hủy
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

             <PaymentDialog 
                isOpen={isPaymentDialogOpen}
                onOpenChange={setIsPaymentDialogOpen}
                onSubmit={handleAddPayment}
                amountDue={payableAmount}
            />
            
            <CreateShipmentDialog
                isOpen={isCreateShipmentDialogOpen}
                onOpenChange={setIsCreateShipmentDialogOpen}
                onSubmit={handleShippingSubmit}
                order={order}
                customer={customer}
            />

            <PackerSelectionDialog
                isOpen={isPackerSelectionOpen}
                onOpenChange={setIsPackerSelectionOpen}
                onSubmit={handleRequestPackaging}
            />
            
            <CancelPackagingDialog
                isOpen={!!cancelPackagingState}
                onOpenChange={(open) => !open && setCancelPackagingState(null)}
                onConfirm={handleCancelPackagingSubmit}
            />

            {cancelShipmentState?.type === 'fail' && (
                <DeliveryFailureDialog
                    isOpen={true}
                    onOpenChange={(open) => !open && setCancelShipmentState(null)}
                    onConfirm={handleFailDeliverySubmit}
                />
            )}
            {cancelShipmentState?.type === 'cancel' && (
                <CancelShipmentDialog
                    isOpen={true}
                    onOpenChange={(open) => !open && setCancelShipmentState(null)}
                    onCancelShipment={handleCancelDeliveryOnly}
                    onCancelAndRestock={handleCancelDeliveryAndRestock}
                />
            )}
        </>
    );
}
