'use client'

import * as React from 'react';
import * as ReactRouterDOM from '@/lib/next-compat';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate, getDaysDiff } from '../../lib/date-utils';
import { useForm, FormProvider } from 'react-hook-form';
import { useOrderStore } from './store';
import type { Order, OrderMainStatus, OrderPayment, Packaging, PackagingStatus, OrderDeliveryStatus } from './types';
import { formatOrderAddress } from './address-utils';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '../../components/ui/table';
import { Separator } from '../../components/ui/separator';
import { useCustomerStore } from '../customers/store';
import { useCustomerTypeStore } from '../settings/customers/customer-types-store';
import { useCustomerGroupStore } from '../settings/customers/customer-groups-store';
import { useCustomerSourceStore } from '../settings/customers/customer-sources-store';
import { ArrowLeft, Edit, Printer, Check, Copy, Settings, ChevronDown, Users, Truck, CheckCircle2, FileWarning, PackageSearch, Package, PackageCheck, MoreHorizontal, Ban, File, Calendar, User, Info, MessageSquare, Banknote, PlusCircle, ThumbsUp, PackageX, ChevronRight, Undo2, Store, Clock, Eye, StickyNote, ArrowDownLeft } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useEmployeeStore } from '../employees/store';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../../components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { CurrencyInput } from '../../components/ui/currency-input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { DetailField } from '../../components/ui/detail-field';
import { ImagePreviewDialog } from '../../components/ui/image-preview-dialog';
import { Textarea } from '../../components/ui/textarea';
import { useShippingPartnerStore } from '../settings/shipping/store';
import { useProductStore } from '../products/store';
import { ProductImage, useProductImage } from '../products/components/product-image';
import { useWarrantyStore } from '../warranty/store';
import { useComplaintStore } from '../complaints/store';
import { Link } from '@/lib/next-compat';
import { Spinner } from '../../components/ui/spinner';
import { usePageHeader } from '../../contexts/page-header-context';
import { usePaymentMethodStore } from '../settings/payments/methods/store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Timeline, TimelineItem } from '../../components/ui/timeline';
import { Combobox, type ComboboxOption } from '../../components/ui/combobox';
import { PackagingInfo } from './components/packaging-info';
import { CancelShipmentDialog } from './components/cancel-shipment-dialog';
import { CancelPackagingDialog } from './components/cancel-packaging-dialog';
import { DeliveryFailureDialog } from './components/delivery-failure-dialog';
import { PaymentInfo } from './components/payment-info';

import { ShippingTrackingTab } from './components/shipping-tracking-tab';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../components/ui/collapsible';
import { useSalesReturnStore } from '../sales-returns/store';
import type { SalesReturn } from '../sales-returns/types';
import { useReceiptStore } from '../receipts/store';
import { usePaymentStore } from '../payments/store';
import type { Receipt } from '../receipts/types';
import type { Payment } from '../payments/types';
import { useShippingSettingsStore } from '../settings/shipping/shipping-settings-store';
import { PartnerShipmentForm } from './components/partner-shipment-form';
import { ShippingIntegration } from './components/shipping-integration';
import type { OrderFormValues } from './order-form-page';
import { useAuth } from '../../contexts/auth-context';
import { asSystemId, type SystemId } from '../../lib/id-types';
import { OrderWorkflowCard } from './components/order-workflow-card';
import { getWorkflowTemplates } from '../settings/printer/workflow-templates-page';
import { ActivityHistory, type HistoryEntry } from '../../components/ActivityHistory';
import { Comments, type Comment as CommentType } from '../../components/Comments';
import { useProductTypeStore } from '../settings/inventory/product-type-store';
import { usePricingPolicyStore } from '../settings/pricing/store';
import { useCustomerSlaEvaluation } from '../customers/sla/hooks';
import { ReadOnlyProductsTable } from '../../components/shared/read-only-products-table';
import { OrderPrintButton } from './components/order-print-button';
import { useBranchStore } from '../settings/branches/store';
import { useBranding, getFullLogoUrl } from '../../hooks/use-branding';
import { mapSalesReturnToPrintData, SalesReturnForPrint } from '../../lib/print-mappers/sales-return.mapper';
import { mapPaymentToPrintData, PaymentForPrint } from '../../lib/print-mappers/payment.mapper';
import { useStoreInfoStore } from '../settings/store-info/store-info-store';
import { usePrint } from '../../lib/use-print';
import { StoreSettings, numberToWords, formatTime } from '../../lib/print-service';

// Component hiển thị ảnh sản phẩm với preview - sử dụng server image priority
// Nhận product trực tiếp từ parent để tránh re-call useProductStore trong mỗi row
const ProductThumbnailCell = ({ 
    productSystemId, 
    product,
    productName, 
    size = 'md',
    onPreview 
}: { 
    productSystemId: string; 
    product?: { thumbnailImage?: string; galleryImages?: string[]; images?: string[]; name?: string } | null;
    productName: string;
    size?: 'sm' | 'md';
    onPreview?: (image: string, title: string) => void;
}) => {
    const imageUrl = useProductImage(productSystemId, product);
    
    const sizeClasses = size === 'sm' 
        ? 'w-10 h-9' 
        : 'w-12 h-10';
    const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-4 w-4';
    
    if (imageUrl) {
        return (
            <div
                className={`group/thumbnail relative ${sizeClasses} rounded border overflow-hidden bg-muted ${onPreview ? 'cursor-pointer' : ''}`}
                onClick={() => onPreview?.(imageUrl, productName)}
            >
                <img src={imageUrl} alt={productName} className="w-full h-full object-cover transition-all group-hover/thumbnail:brightness-75" />
                {onPreview && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumbnail:opacity-100 transition-opacity">
                        <Eye className="w-4 h-4 text-white drop-shadow-md" />
                    </div>
                )}
            </div>
        );
    }
    
    return (
        <div className={`${sizeClasses} bg-muted rounded flex items-center justify-center`}>
            <Package className={`${iconSize} text-muted-foreground`} />
        </div>
    );
};

const normalizeCurrencyValue = (value?: number) => {
    if (typeof value !== 'number' || Number.isNaN(value)) return 0;
    return Math.abs(value) < 0.005 ? 0 : value;
};

const formatCurrency = (value?: number) => {
    const normalized = normalizeCurrencyValue(value);
    return new Intl.NumberFormat('vi-VN').format(normalized);
};

const formatNumber = (value?: number) => {
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
const formatAddressObject = (address: any): string => formatOrderAddress(address);

const statusVariants: Record<OrderMainStatus, "success" | "default" | "secondary" | "warning" | "destructive"> = {
    "Đặt hàng": "secondary",
    "Đang giao dịch": "warning",
    "Hoàn thành": "success",
    "Đã hủy": "destructive",
};

const productTypeFallbackLabels: Record<string, string> = {
    physical: 'Hàng hóa',
    service: 'Dịch vụ',
    digital: 'Sản phẩm số',
    combo: 'Combo',
};

type OrderComment = CommentType<SystemId>;

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
                                "flex items-center justify-center w-8 h-8 rounded-full border-2 font-semibold text-body-sm",
                                isCancelled ? "bg-red-100 border-red-500 text-red-500" :
                                isCompleted ? "bg-primary border-primary text-primary-foreground" :
                                isCurrent ? "border-primary text-primary" :
                                "border-gray-300 bg-gray-100 text-gray-400"
                            )}>
                                {isCompleted ? <Icon className="h-4 w-4" /> : index + 1}
                            </div>
                            <p className={cn("text-body-sm mt-2 font-medium", isCompleted || isCurrent ? "text-foreground" : "text-foreground")}>{step.name}</p>
                            <p className="text-body-xs text-foreground mt-1">{step.date ? formatDateTime(step.date) : '-'}</p>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={cn(
                                "flex-1 mt-4 h-0.5",
                                index < currentStepIndex ? "bg-primary" : "bg-gray-300",
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
                        <p className="text-body-sm text-destructive">{fieldState.error.message}</p>
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
                <p className="text-body-sm font-medium">Thông tin tài khoản nhận</p>
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
    existingPackerSystemId,
}: {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (packerId?: SystemId) => void;
    existingPackerSystemId?: SystemId;
}) {
  const { searchEmployees } = useEmployeeStore();
  const [selectedEmployee, setSelectedEmployee] = React.useState<ComboboxOption | null>(null);

    const handleSubmit = () => {
        onSubmit(selectedEmployee ? asSystemId(selectedEmployee.value) : undefined);
    onOpenChange(false);
  };

  // Preload existing packer if set in order
  React.useEffect(() => {
      if (isOpen && existingPackerSystemId) {
          // Find employee and set as selected
          searchEmployees('', 0, 100).then(result => {
              const existing = result.items.find(e => e.value === existingPackerSystemId);
              if (existing) {
                  setSelectedEmployee(existing);
              }
          });
      } else if (isOpen) {
          setSelectedEmployee(null);
      }
  }, [isOpen, existingPackerSystemId, searchEmployees]);

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

const OrderHistoryTab = ({ order, salesReturnsForOrder, orderComments }: { order: Order; salesReturnsForOrder: SalesReturn[]; orderComments: OrderComment[] }) => {
    const { data: receipts } = useReceiptStore();
    const { data: payments } = usePaymentStore();
    const { data: warranties } = useWarrantyStore();
    const { findById: findEmployeeById } = useEmployeeStore();
    const allTransactions = React.useMemo(() => [...receipts, ...payments], [receipts, payments]);

    const parseTimestamp = React.useCallback((value?: string) => {
        if (!value) return undefined;
        return new Date(value.includes('T') ? value : value.replace(' ', 'T'));
    }, []);

    const buildUser = React.useCallback((systemId?: SystemId | string, fallbackName?: string) => {
        if (systemId && typeof systemId === 'string') {
            const employee = findEmployeeById(asSystemId(systemId));
            if (employee) {
                return { systemId: employee.systemId, name: employee.fullName };
            }
        }

        if (fallbackName) {
            return { systemId: typeof systemId === 'string' ? systemId : 'SYSTEM', name: fallbackName };
        }

        return { systemId: typeof systemId === 'string' ? systemId : 'SYSTEM', name: 'Hệ thống' };
    }, [findEmployeeById]);

    const historyEntries = React.useMemo<HistoryEntry[]>(() => {
        if (!order) return [];
        const entries: HistoryEntry[] = [];

        const pushEntry = (entry: HistoryEntry | null | undefined) => {
            if (entry && entry.timestamp) {
                entries.push(entry);
            }
        };

        const createdAt = parseTimestamp(order.orderDate);
        if (createdAt) {
            pushEntry({
                id: `${order.systemId}-created`,
                action: 'created',
                timestamp: createdAt,
                user: buildUser(order.salespersonSystemId, order.salesperson),
                description: `Tạo đơn hàng ${order.id}`,
            });
        }

        const approvedAt = parseTimestamp(order.approvedDate);
        if (approvedAt) {
            pushEntry({
                id: `${order.systemId}-approved`,
                action: 'status_changed',
                timestamp: approvedAt,
                user: buildUser(undefined, 'Hệ thống'),
                description: 'Đã duyệt đơn hàng',
            });
        }

        const dispatchedAt = parseTimestamp(order.dispatchedDate);
        if (dispatchedAt) {
            pushEntry({
                id: `${order.systemId}-dispatched`,
                action: 'status_changed',
                timestamp: dispatchedAt,
                user: buildUser(order.dispatchedByEmployeeId, order.dispatchedByEmployeeName),
                description: 'Xuất kho cho đơn hàng',
            });
        }

        const completedAt = parseTimestamp(order.completedDate);
        if (completedAt) {
            pushEntry({
                id: `${order.systemId}-completed`,
                action: 'status_changed',
                timestamp: completedAt,
                user: buildUser(undefined, 'Hệ thống'),
                description: 'Hoàn thành đơn hàng',
            });
        }

        const cancelledAt = parseTimestamp(order.cancelledDate);
        if (cancelledAt) {
            pushEntry({
                id: `${order.systemId}-cancelled`,
                action: 'cancelled',
                timestamp: cancelledAt,
                user: buildUser(undefined, 'Hệ thống'),
                description: 'Hủy đơn hàng',
                content: (
                    <div className="text-body-sm">
                        <span>Lý do: </span>
                        <span className="font-medium">{order.cancellationReason || 'Không rõ'}</span>
                        {order.cancellationMetadata && (
                            <p className="mt-1 text-body-xs text-muted-foreground">
                                {order.cancellationMetadata.restockItems ? 'Đã hoàn kho' : 'Không hoàn kho'} ·{' '}
                                {order.cancellationMetadata.notifyCustomer ? 'Đã gửi email cho khách' : 'Không gửi email cho khách'}
                            </p>
                        )}
                    </div>
                ),
            });
        }

        order.payments.forEach(payment => {
            const timestamp = parseTimestamp(payment.date);
            if (!timestamp) return;
            const isRefund = payment.amount < 0;
            const absAmount = formatCurrency(Math.abs(payment.amount));
            const voucherPath = isRefund ? 'payments' : 'receipts';
            const paymentLink = (
                <Link to={`/${voucherPath}/${payment.systemId}`} className="font-semibold text-primary hover:underline">
                    {payment.id}
                </Link>
            );
            const warrantyLink = payment.linkedWarrantySystemId ? (
                <>
                    {' '}từ bảo hành{' '}
                    <Link
                        to={`/warranty/${payment.linkedWarrantySystemId}`}
                        className="font-semibold text-primary hover:underline"
                    >
                        {warranties.find(w => w.systemId === payment.linkedWarrantySystemId)?.id || 'N/A'}
                    </Link>
                </>
            ) : null;

            pushEntry({
                id: `${order.systemId}-payment-${payment.systemId}`,
                action: 'payment_made',
                timestamp,
                user: buildUser(payment.createdBy),
                description: `${isRefund ? 'Hoàn tiền' : 'Thanh toán'} ${absAmount} qua ${payment.method}`,
                content: (
                    <>
                        {isRefund ? 'Hoàn tiền' : 'Thanh toán'}{' '}
                        <span className="font-semibold">{absAmount}</span> qua {payment.method} ({paymentLink}){warrantyLink}.
                    </>
                ),
            });
        });

        order.packagings.forEach(pkg => {
            const requestDate = parseTimestamp(pkg.requestDate);
            if (requestDate) {
                pushEntry({
                    id: `${pkg.systemId}-request`,
                    action: 'product_added',
                    timestamp: requestDate,
                    user: buildUser(pkg.requestingEmployeeId, pkg.requestingEmployeeName),
                    description: 'Yêu cầu đóng gói',
                    content: (
                        <>
                            Yêu cầu đóng gói{' '}
                            <Link to={`/packaging/${pkg.systemId}`} className="text-primary hover:underline">
                                {pkg.id}
                            </Link>
                            .
                        </>
                    ),
                });
            }

            const confirmDate = parseTimestamp(pkg.confirmDate);
            if (confirmDate) {
                pushEntry({
                    id: `${pkg.systemId}-confirm`,
                    action: 'status_changed',
                    timestamp: confirmDate,
                    user: buildUser(pkg.confirmingEmployeeId, pkg.confirmingEmployeeName),
                    description: 'Xác nhận đóng gói',
                    content: (
                        <>
                            Xác nhận đóng gói{' '}
                            <Link to={`/packaging/${pkg.systemId}`} className="text-primary hover:underline">
                                {pkg.id}
                            </Link>
                            .
                        </>
                    ),
                });
            }

            const cancelDate = parseTimestamp(pkg.cancelDate);
            if (cancelDate) {
                pushEntry({
                    id: `${pkg.systemId}-cancel`,
                    action: 'cancelled',
                    timestamp: cancelDate,
                    user: buildUser(pkg.cancelingEmployeeId, pkg.cancelingEmployeeName),
                    description: 'Hủy yêu cầu đóng gói',
                    content: (
                        <>
                            Hủy đóng gói{' '}
                            <Link to={`/packaging/${pkg.systemId}`} className="text-primary hover:underline">
                                {pkg.id}
                            </Link>
                            . Lý do: <span className="italic">{pkg.cancelReason || 'Không rõ'}</span>
                        </>
                    ),
                });
            }
        });

        salesReturnsForOrder.forEach(returnSlip => {
            const timestamp = parseTimestamp(returnSlip.returnDate);
            if (!timestamp) return;
            const transactionSystemId = returnSlip.paymentVoucherSystemId || returnSlip.receiptVoucherSystemIds?.[0];
            const transaction = transactionSystemId ? allTransactions.find(t => t.systemId === transactionSystemId) : null;
            const transactionLink = transaction ? (
                <>
                    {' '}và chứng từ{' '}
                    <Link
                        to={`/${returnSlip.paymentVoucherSystemId ? 'payments' : 'receipts'}/${transaction.systemId}`}
                        className="font-semibold text-primary hover:underline"
                    >
                        {transaction.id}
                    </Link>
                </>
            ) : null;
            const exchangeOrderLink = returnSlip.exchangeOrderSystemId ? (
                <>
                    {' '}và tạo đơn đổi{' '}
                    <Link to={`/orders/${returnSlip.exchangeOrderSystemId}`} className="font-semibold text-primary hover:underline">
                        Xem đơn đổi
                    </Link>
                </>
            ) : null;

            pushEntry({
                id: `${order.systemId}-return-${returnSlip.systemId}`,
                action: 'custom',
                timestamp,
                user: buildUser(returnSlip.creatorSystemId, returnSlip.creatorName),
                description: `Tạo phiếu trả hàng ${returnSlip.id}`,
                content: (
                    <>
                        Tạo phiếu trả hàng{' '}
                        <Link to={`/returns/${returnSlip.systemId}`} className="font-semibold text-primary hover:underline">
                            {returnSlip.id}
                        </Link>
                        {transactionLink}
                        {exchangeOrderLink}.
                    </>
                ),
            });
        });

        if (order.notes && createdAt) {
            pushEntry({
                id: `${order.systemId}-note`,
                action: 'comment_added',
                timestamp: createdAt,
                user: buildUser(order.salespersonSystemId, order.salesperson),
                description: 'Thêm ghi chú đơn hàng',
                content: (
                    <>
                        Ghi chú: <span className="italic">{order.notes}</span>
                    </>
                ),
            });
        }

        // NOTE: Comments are displayed in separate Comments section, not in history
        
        return entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }, [order, salesReturnsForOrder, allTransactions, warranties, buildUser, parseTimestamp]);

    return (
        <ActivityHistory
            history={historyEntries}
            title="Lịch sử & Ghi chú"
            showFilters={false}
            showMetadata={false}
        />
    );
};

const ProductInfoCard = ({ order, costOfGoods, profit, totalDiscount, salesReturns, getProductTypeLabel }: { order: Order; costOfGoods: number; profit: number; totalDiscount: number; salesReturns: SalesReturn[]; getProductTypeLabel: (productSystemId: SystemId) => string; }) => {
    // Calculate warranty payments (negative amounts linked to warranty)
    const warrantyPayments = (order?.payments || []).filter(p => p.amount < 0 && (p as any).linkedWarrantySystemId);
    const totalWarrantyDeduction = warrantyPayments.reduce((sum, p) => sum + Math.abs(p.amount), 0);
    
    // Check if any line item has tax
    const hasTax = order.lineItems.some(item => item.tax && item.tax > 0);
    
    // Convert order lineItems to ReadOnlyProductsTable format
    const lineItems = order.lineItems.map(item => {
        // Calculate line total with tax
        const lineGross = item.unitPrice * item.quantity;
        const taxAmount = item.tax ? lineGross * (item.tax / 100) : 0;
        let discountValue = 0;
        if (item.discount && item.discount > 0) {
            discountValue = item.discountType === 'fixed' ? item.discount : (lineGross + taxAmount) * (item.discount / 100);
        }
        const lineTotal = lineGross + taxAmount - discountValue;
        
        return {
            productSystemId: item.productSystemId,
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount,
            discountType: item.discountType,
            tax: item.tax, // Tax rate (%)
            taxId: item.taxId, // Tax systemId
            total: lineTotal,
            note: item.note,
        };
    });
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-h4">Thông tin sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
                <ReadOnlyProductsTable
                    lineItems={lineItems}
                    showStorageLocation={false}
                    showUnit={false}
                    showDiscount={true}
                    showTax={hasTax}
                />
                <div className="flex justify-end mt-4">
                    <div className="w-full max-w-sm space-y-2 text-body-sm">
                        <div className="flex justify-between"><span className="text-muted-foreground">Tổng tiền ({order.lineItems.length} sản phẩm)</span> <span>{formatCurrency(order.subtotal)}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Giá vốn</span> <span>{formatCurrency(costOfGoods)}</span></div>
                        <div className="flex justify-between font-semibold"><span>Lợi nhuận tạm tính</span> <span>{formatCurrency(profit)}</span></div>
                        <Separator className="!my-2" />
                        <div className="flex justify-between"><span className="text-muted-foreground">Chiết khấu</span> <span>{formatCurrency(-totalDiscount)}</span></div>
                        {hasTax && order.tax > 0 && (
                            <div className="flex justify-between"><span className="text-muted-foreground">Thuế (VAT)</span> <span>{formatCurrency(order.tax)}</span></div>
                        )}
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
                                <span className="text-red-600">{formatCurrency(-(order.linkedSalesReturnValue ?? 0))}</span>
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
                                <span className="text-red-600">{formatCurrency(-totalWarrantyDeduction)}</span>
                            </div>
                        )}
                        <Separator className="!my-2" />
                        <div className="flex justify-between font-bold text-h4"><span>Khách phải trả</span> <span>{formatCurrency(order.grandTotal)}</span></div>
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

const ReturnHistoryTab = ({ order, salesReturnsForOrder, getProductTypeLabel, onPreview }: { 
    order: Order, 
    salesReturnsForOrder: SalesReturn[],
    getProductTypeLabel?: (productSystemId: string) => string,
    onPreview?: (image: string, title: string) => void 
}) => {
    const [expandedReturnId, setExpandedReturnId] = React.useState<string | null>(null);
    const [expandedCombos, setExpandedCombos] = React.useState<Record<string, boolean>>({});
    const { data: orders } = useOrderStore();
    const { data: allProducts } = useProductStore();
    const { findById: findBranchById } = useBranchStore();
    const { info: storeInfo } = useStoreInfoStore();
    const { print } = usePrint(order.branchSystemId);
    const { findById: findCustomerById } = useCustomerStore();

    const toggleComboRow = React.useCallback((key: string) => {
        setExpandedCombos(prev => ({ ...prev, [key]: !prev[key] }));
    }, []);

    const handlePrintReturn = React.useCallback((e: React.MouseEvent, salesReturn: SalesReturn) => {
        e.stopPropagation();
        if (!salesReturn) return;

        const branch = findBranchById(salesReturn.branchSystemId);
        const customer = findCustomerById(salesReturn.customerSystemId);
        const storeSettings: StoreSettings = {
            name: storeInfo.brandName || storeInfo.companyName,
            address: storeInfo.headquartersAddress,
            phone: storeInfo.hotline,
            email: storeInfo.email,
            province: storeInfo.province,
        };

        const printData: SalesReturnForPrint = {
            code: salesReturn.id,
            orderCode: salesReturn.orderId,
            createdAt: salesReturn.returnDate,
            createdBy: salesReturn.creatorName,
            
            // Customer
            customerName: salesReturn.customerName,
            customerPhone: customer?.phone,
            shippingAddress: customer?.addresses?.[0] ? 
                [customer.addresses[0].street, customer.addresses[0].ward, customer.addresses[0].district, customer.addresses[0].province].filter(Boolean).join(', ') 
                : undefined,
            
            // Branch
            location: branch ? {
                name: branch.name,
                address: branch.address,
                province: branch.province
            } : undefined,

            // Items (Exchange items - kept for reference in mapper)
            items: salesReturn.exchangeItems.map(item => ({
                productName: item.productName,
                quantity: item.quantity,
                price: item.unitPrice,
                amount: item.quantity * item.unitPrice,
                unit: 'Cái', // Default
            })),
            
            returnItems: salesReturn.items.map(item => ({
                productName: item.productName,
                quantity: item.returnQuantity,
                price: item.unitPrice,
                amount: item.totalValue,
                unit: 'Cái', // Default
            })),
            
            // Totals
            total: salesReturn.grandTotalNew, // Tổng giá trị hàng đổi
            returnTotalAmount: salesReturn.totalReturnValue, // Tổng giá trị hàng trả
            totalAmount: Math.abs(salesReturn.finalAmount), // Số tiền chênh lệch
            
            note: salesReturn.note,
        };

        const mappedData = mapSalesReturnToPrintData(printData, storeSettings);
        
        // Inject missing fields based on user feedback/template
        mappedData['{reason_return}'] = salesReturn.reason || '';
        mappedData['{reason}'] = salesReturn.reason || '';
        mappedData['{note}'] = salesReturn.note || '';
        
        // Calculate refund status
        let refundStatus = 'Chưa hoàn tiền';
        const totalRefunded = (salesReturn.refunds || []).reduce((sum, r) => sum + (r.amount || 0), 0) || salesReturn.refundAmount || 0;
        const totalPaid = (salesReturn.payments || []).reduce((sum, p) => sum + (p.amount || 0), 0);
        
        if (salesReturn.finalAmount < 0) { // Company needs to refund
             if (totalRefunded >= Math.abs(salesReturn.finalAmount)) {
                 refundStatus = 'Đã hoàn tiền';
             } else if (totalRefunded > 0) {
                 refundStatus = 'Hoàn tiền một phần';
             }
        } else if (salesReturn.finalAmount > 0) { // Customer needs to pay
             if (totalPaid >= salesReturn.finalAmount) {
                 refundStatus = 'Đã thanh toán';
             } else if (totalPaid > 0) {
                 refundStatus = 'Thanh toán một phần';
             } else {
                 refundStatus = 'Chưa thanh toán';
             }
        } else {
            refundStatus = 'Đã hoàn thành';
        }
        mappedData['refund_status'] = refundStatus;

        // Map return items for the main table (since template shows "SL Trả")
        const lineItems = salesReturn.items.map((item, index) => ({
            '{line_stt}': (index + 1).toString(),
            '{line_product_name}': item.productName,
            '{line_variant_code}': item.productId, // Map SKU/ID to variant code
            '{line_variant}': '', // Variant name not available in return items, leave empty to remove placeholder
            '{line_unit}': 'Cái',
            '{line_quantity}': item.returnQuantity.toString(),
            '{line_price}': formatCurrency(item.unitPrice),
            '{line_total}': formatCurrency(item.totalValue), // Matches {line_total} in screenshot
            '{line_amount}': formatCurrency(item.totalValue), // Standard fallback
        }));

        print('sales-return', {
            data: mappedData,
            lineItems: lineItems
        });
    }, [findBranchById, storeInfo, print, findCustomerById]);

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
                            <TableHead className="w-10"></TableHead>
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
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-body-xs font-medium ${
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
                                        <TableCell className="text-right font-semibold">
                                            {(() => {
                                                // Tính số tiền thực tế đã hoàn/thu
                                                const totalRefunded = (returnSlip.refunds || []).reduce((sum, r) => sum + (r.amount || 0), 0) || returnSlip.refundAmount || 0;
                                                const totalPaid = (returnSlip.payments || []).reduce((sum, p) => sum + (p.amount || 0), 0);
                                                const actualAmount = totalPaid - totalRefunded;
                                                
                                                // Nếu không có hoàn tiền và không có thanh toán → hiển thị dấu "-"
                                                if (totalRefunded === 0 && totalPaid === 0) {
                                                    return <span className="text-muted-foreground">-</span>;
                                                }
                                                
                                                // Có hoàn tiền → hiển thị số âm (màu xanh)
                                                if (totalRefunded > 0) {
                                                    return <span className="text-green-600">-{formatCurrency(totalRefunded)}</span>;
                                                }
                                                
                                                // Có thanh toán từ khách → hiển thị số dương (màu vàng)
                                                if (totalPaid > 0) {
                                                    return <span className="text-amber-600">{formatCurrency(totalPaid)}</span>;
                                                }
                                                
                                                return <span className="text-muted-foreground">-</span>;
                                            })()}
                                        </TableCell>
                                        <TableCell>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8"
                                                onClick={(e) => handlePrintReturn(e, returnSlip)}
                                                title="In phiếu trả hàng"
                                            >
                                                <Printer className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                    {isExpanded && (
                                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                                            <TableCell colSpan={11} className="p-4">
                                                <div className="space-y-4">
                                                    <div>
                                                        <h4 className="font-semibold mb-2">Chi tiết hàng trả</h4>
                                                        <div className="border rounded-md bg-background">
                                                            <Table>
                                                                <TableHeader>
                                                                    <TableRow>
                                                                        <TableHead className="w-12">STT</TableHead>
                                                                        <TableHead className="w-16 text-center">Ảnh</TableHead>
                                                                        <TableHead>Tên sản phẩm</TableHead>
                                                                        <TableHead className="text-center">Số lượng</TableHead>
                                                                        <TableHead className="text-right">Đơn giá trả</TableHead>
                                                                        <TableHead className="text-right">Thành tiền</TableHead>
                                                                    </TableRow>
                                                                </TableHeader>
                                                                <TableBody>
                                                                    {returnSlip.items.map((item: any, index: number) => {
                                                                        const product = allProducts.find((p: any) => p.systemId === item.productSystemId);
                                                                        const productType = getProductTypeLabel?.(item.productSystemId) || '---';
                                                                        const isCombo = product?.type === 'combo';
                                                                        const comboKey = `return-${returnSlip.systemId}-${item.productSystemId}`;
                                                                        const isComboExpanded = expandedCombos[comboKey] ?? false;
                                                                        const comboChildren = isCombo && product?.comboItems ? product.comboItems : [];
                                                                        
                                                                        return (
                                                                            <React.Fragment key={item.productSystemId}>
                                                                                <TableRow>
                                                                                    <TableCell className="text-center text-muted-foreground">
                                                                                        <div className="flex items-center justify-center gap-1">
                                                                                            {isCombo && (
                                                                                                <Button
                                                                                                    type="button"
                                                                                                    variant="ghost"
                                                                                                    size="icon"
                                                                                                    className="h-6 w-6 p-0"
                                                                                                    onClick={(e) => {
                                                                                                        e.stopPropagation();
                                                                                                        toggleComboRow(comboKey);
                                                                                                    }}
                                                                                                >
                                                                                                    {isComboExpanded ? (
                                                                                                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                                                                                    ) : (
                                                                                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                                                                    )}
                                                                                                </Button>
                                                                                            )}
                                                                                            <span>{index + 1}</span>
                                                                                        </div>
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <ProductThumbnailCell 
                                                                                            productSystemId={item.productSystemId} 
                                                                                            product={product}
                                                                                            productName={item.productName} 
                                                                                            size="sm"
                                                                                            onPreview={onPreview}
                                                                                        />
                                                                                    </TableCell>
                                                                                    <TableCell>
                                                                                        <div className="flex flex-col gap-0.5">
                                                                                            <div className="flex items-center gap-2">
                                                                                                <Link 
                                                                                                    to={`/products/${item.productSystemId}`}
                                                                                                    className="font-medium text-primary hover:underline"
                                                                                                >
                                                                                                    {item.productName}
                                                                                                </Link>
                                                                                                {isCombo && (
                                                                                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-semibold">
                                                                                                        COMBO
                                                                                                    </span>
                                                                                                )}n                                                                                            </div>
                                                                                            <div className="flex items-center gap-1 text-body-xs text-muted-foreground flex-wrap">
                                                                                                <span>{productType}</span>
                                                                                                <span>-</span>
                                                                                                <Link 
                                                                                                    to={`/products/${item.productSystemId}`}
                                                                                                    className="text-primary hover:underline"
                                                                                                >
                                                                                                    {item.productId}
                                                                                                </Link>
                                                                                                {item.note && (
                                                                                                    <>
                                                                                                        <StickyNote className="h-3 w-3 text-amber-600 ml-1" />
                                                                                                        <span className="text-amber-600 italic">{item.note}</span>
                                                                                                    </>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                    </TableCell>
                                                                                    <TableCell className="text-center">{item.returnQuantity}</TableCell>
                                                                                    <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                                                                                    <TableCell className="text-right font-medium">{formatCurrency(item.totalValue)}</TableCell>
                                                                                </TableRow>
                                                                                {/* Combo children rows */}
                                                                                {isCombo && isComboExpanded && comboChildren.map((comboItem: any, childIndex: number) => {
                                                                                    const childProduct = allProducts.find((p: any) => p.systemId === comboItem.productSystemId);
                                                                                    return (
                                                                                        <TableRow key={`${comboKey}-child-${childIndex}`} className="bg-muted/40">
                                                                                            <TableCell className="text-center text-muted-foreground pl-8">
                                                                                                <span className="text-muted-foreground/60">└</span>
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                <ProductThumbnailCell 
                                                                                                    productSystemId={comboItem.productSystemId}
                                                                                                    product={childProduct}
                                                                                                    productName={childProduct?.name || comboItem.productName || 'Sản phẩm'}
                                                                                                    size="sm"
                                                                                                    onPreview={onPreview}
                                                                                                />
                                                                                            </TableCell>
                                                                                            <TableCell>
                                                                                                <div className="flex flex-col gap-0.5">
                                                                                                    <span className="font-medium text-foreground">
                                                                                                        {childProduct?.name || 'Sản phẩm không tồn tại'}
                                                                                                    </span>
                                                                                                    {childProduct && (
                                                                                                        <Link
                                                                                                            to={`/products/${childProduct.systemId}`}
                                                                                                            className="text-body-xs text-primary hover:underline"
                                                                                                        >
                                                                                                            {childProduct.id}
                                                                                                        </Link>
                                                                                                    )}
                                                                                                </div>
                                                                                            </TableCell>
                                                                                            <TableCell className="text-center text-muted-foreground">
                                                                                                x{comboItem.quantity * item.returnQuantity}
                                                                                            </TableCell>
                                                                                            <TableCell className="text-right text-muted-foreground">-</TableCell>
                                                                                            <TableCell className="text-right text-muted-foreground">-</TableCell>
                                                                                        </TableRow>
                                                                                    );
                                                                                })}
                                                                            </React.Fragment>
                                                                        );
                                                                    })}
                                                                </TableBody>
                                                                <TableFooter>
                                                                    <TableRow>
                                                                        <TableCell colSpan={5} className="text-right font-semibold">Tổng cộng</TableCell>
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
                                                                            <TableHead className="w-12">STT</TableHead>
                                                                            <TableHead className="w-16 text-center">Ảnh</TableHead>
                                                                            <TableHead>Tên sản phẩm</TableHead>
                                                                            <TableHead className="text-center">Số lượng</TableHead>
                                                                            <TableHead className="text-right">Đơn giá</TableHead>
                                                                            <TableHead className="text-right">Thành tiền</TableHead>
                                                                        </TableRow>
                                                                    </TableHeader>
                                                                    <TableBody>
                                                                        {returnSlip.exchangeItems.map((item: any, index: number) => {
                                                                            const lineTotal = item.quantity * item.unitPrice - (item.discountType === 'percentage' ? (item.quantity * item.unitPrice * item.discount / 100) : item.discount);
                                                                            const product = allProducts.find((p: any) => p.systemId === item.productSystemId);
                                                                            const productType = getProductTypeLabel?.(item.productSystemId) || '---';
                                                                            const isCombo = product?.type === 'combo';
                                                                            const comboKey = `exchange-${returnSlip.systemId}-${item.productSystemId}`;
                                                                            const isComboExpanded = expandedCombos[comboKey] ?? false;
                                                                            const comboChildren = isCombo && product?.comboItems ? product.comboItems : [];
                                                                            
                                                                            return (
                                                                                <React.Fragment key={item.productSystemId}>
                                                                                    <TableRow>
                                                                                        <TableCell className="text-center text-muted-foreground">
                                                                                            <div className="flex items-center justify-center gap-1">
                                                                                                {isCombo && (
                                                                                                    <Button
                                                                                                        type="button"
                                                                                                        variant="ghost"
                                                                                                        size="icon"
                                                                                                        className="h-6 w-6 p-0"
                                                                                                        onClick={(e) => {
                                                                                                            e.stopPropagation();
                                                                                                            toggleComboRow(comboKey);
                                                                                                        }}
                                                                                                    >
                                                                                                        {isComboExpanded ? (
                                                                                                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                                                                                        ) : (
                                                                                                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                                                                        )}
                                                                                                    </Button>
                                                                                                )}
                                                                                                <span>{index + 1}</span>
                                                                                            </div>
                                                                                        </TableCell>
                                                                                        <TableCell>
                                                                                            <ProductThumbnailCell 
                                                                                                productSystemId={item.productSystemId} 
                                                                                                product={product}
                                                                                                productName={item.productName} 
                                                                                                size="sm"
                                                                                                onPreview={onPreview}
                                                                                            />
                                                                                        </TableCell>
                                                                                        <TableCell>
                                                                                            <div className="flex flex-col gap-0.5">
                                                                                                <div className="flex items-center gap-2">
                                                                                                    <Link 
                                                                                                        to={`/products/${item.productSystemId}`}
                                                                                                        className="font-medium text-primary hover:underline"
                                                                                                    >
                                                                                                        {item.productName}
                                                                                                    </Link>
                                                                                                    {isCombo && (
                                                                                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-semibold">
                                                                                                            COMBO
                                                                                                        </span>
                                                                                                    )}
                                                                                                </div>
                                                                                                <div className="flex items-center gap-1 text-body-xs text-muted-foreground flex-wrap">
                                                                                                    <span>{productType}</span>
                                                                                                    <span>-</span>
                                                                                                    <Link 
                                                                                                        to={`/products/${item.productSystemId}`}
                                                                                                        className="text-primary hover:underline"
                                                                                                    >
                                                                                                        {item.productId}
                                                                                                    </Link>
                                                                                                    {item.note && (
                                                                                                        <>
                                                                                                            <StickyNote className="h-3 w-3 text-amber-600 ml-1" />
                                                                                                            <span className="text-amber-600 italic">{item.note}</span>
                                                                                                        </>
                                                                                                    )}
                                                                                                </div>
                                                                                            </div>
                                                                                        </TableCell>
                                                                                        <TableCell className="text-center">{item.quantity}</TableCell>
                                                                                        <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                                                                                        <TableCell className="text-right font-medium">{formatCurrency(lineTotal)}</TableCell>
                                                                                    </TableRow>
                                                                                    {/* Combo children rows */}
                                                                                    {isCombo && isComboExpanded && comboChildren.map((comboItem: any, childIndex: number) => {
                                                                                        const childProduct = allProducts.find((p: any) => p.systemId === comboItem.productSystemId);
                                                                                        return (
                                                                                            <TableRow key={`${comboKey}-child-${childIndex}`} className="bg-muted/40">
                                                                                                <TableCell className="text-center text-muted-foreground pl-8">
                                                                                                    <span className="text-muted-foreground/60">└</span>
                                                                                                </TableCell>
                                                                                                <TableCell>
                                                                                                    <ProductThumbnailCell 
                                                                                                        productSystemId={comboItem.productSystemId}
                                                                                                        product={childProduct}
                                                                                                        productName={childProduct?.name || comboItem.productName || 'Sản phẩm'}
                                                                                                        size="sm"
                                                                                                        onPreview={onPreview}
                                                                                                    />
                                                                                                </TableCell>
                                                                                                <TableCell>
                                                                                                    <div className="flex flex-col gap-0.5">
                                                                                                        <span className="font-medium text-foreground">
                                                                                                            {childProduct?.name || 'Sản phẩm không tồn tại'}
                                                                                                        </span>
                                                                                                        {childProduct && (
                                                                                                            <Link
                                                                                                                to={`/products/${childProduct.systemId}`}
                                                                                                                className="text-body-xs text-primary hover:underline"
                                                                                                            >
                                                                                                                {childProduct.id}
                                                                                                            </Link>
                                                                                                        )}
                                                                                                    </div>
                                                                                                </TableCell>
                                                                                                <TableCell className="text-center text-muted-foreground">
                                                                                                    x{comboItem.quantity * item.quantity}
                                                                                                </TableCell>
                                                                                                <TableCell className="text-right text-muted-foreground">-</TableCell>
                                                                                                <TableCell className="text-right text-muted-foreground">-</TableCell>
                                                                                            </TableRow>
                                                                                        );
                                                                                    })}
                                                                                </React.Fragment>
                                                                            );
                                                                        })}
                                                                    </TableBody>
                                                                    <TableFooter>
                                                                        <TableRow>
                                                                            <TableCell colSpan={5} className="text-right font-semibold">Tổng cộng</TableCell>
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
    const { findById: findProductTypeById } = useProductTypeStore();
    const { data: allSalesReturns } = useSalesReturnStore();
    const { data: pricingPolicies } = usePricingPolicyStore();
    const defaultPricingPolicy = React.useMemo(
        () => (pricingPolicies ?? []).find(policy => policy.type === 'Bán hàng' && policy.isDefault),
        [pricingPolicies]
    );
    const { data: warranties } = useWarrantyStore();
    const { data: allReceipts } = useReceiptStore();
    const { data: allPayments } = usePaymentStore();
    const complaints = useComplaintStore((state) => state.complaints);
    const slaEngine = useCustomerSlaEvaluation();
    const { data: branches, findById: findBranchById } = useBranchStore();
    const { info: storeInfo } = useStoreInfoStore();
    const { print } = usePrint();
    
    const { data: customers } = useCustomerStore();
    const customer = order ? customers.find(c => c.systemId === order.customerSystemId) : null;
    const orderBranch = order ? findBranchById?.(order.branchSystemId) : null;
    const { employee: authEmployee } = useAuth();
    const currentEmployeeSystemId: SystemId = authEmployee?.systemId ?? asSystemId('SYSTEM');
    const [isCopying, setIsCopying] = React.useState(false);

    // State for image preview in ReturnHistoryTab
    const [returnHistoryPreviewState, setReturnHistoryPreviewState] = React.useState<{ open: boolean; image: string; title: string }>({
        open: false,
        image: '',
        title: ''
    });
    const handlePreview = React.useCallback((image: string, title: string) => {
        setReturnHistoryPreviewState({ open: true, image, title });
    }, []);

    const customerOrders = React.useMemo(() => {
        if (!customer) return [];
        return orders.filter(o => o.customerSystemId === customer.systemId);
    }, [customer?.systemId, orders]);
    // Orders that create debt: status='Hoàn thành' OR deliveryStatus='Đã giao hàng' OR stockOutStatus='Xuất kho toàn bộ'
    const deliveredCustomerOrders = React.useMemo(
        () => customerOrders.filter(o => 
            o.status !== 'Đã hủy' &&
            (o.status === 'Hoàn thành' || 
             o.deliveryStatus === 'Đã giao hàng' || 
             o.stockOutStatus === 'Xuất kho toàn bộ')
        ),
        [customerOrders]
    );

    const customerOrderStats = React.useMemo(() => {
        if (!customer) {
            return {
                totalSpent: order?.grandTotal || 0,
                totalOrders: order ? 1 : 0,
                lastOrderDate: order?.orderDate ?? null,
            };
        }

        if (!customerOrders.length) {
            return {
                totalSpent: customer.totalSpent ?? 0,
                totalOrders: customer.totalOrders ?? 0,
                lastOrderDate: customer.lastPurchaseDate ?? order?.orderDate ?? null,
            };
        }

        let totalSpent = 0;
        let lastOrderDate: string | null = null;

        deliveredCustomerOrders.forEach(o => {
            totalSpent += o.grandTotal || 0;
        });

        const recencySource = deliveredCustomerOrders.length ? deliveredCustomerOrders : customerOrders;

        recencySource.forEach(o => {
            if (!lastOrderDate || new Date(o.orderDate).getTime() > new Date(lastOrderDate).getTime()) {
                lastOrderDate = o.orderDate;
            }
        });

        return {
            totalSpent,
            totalOrders: customerOrders.length,
            lastOrderDate: lastOrderDate ?? customer.lastPurchaseDate ?? order?.orderDate ?? null,
        };
    }, [customer, customerOrders, deliveredCustomerOrders, order?.grandTotal, order?.orderDate]);

    const customerDebtBalance = React.useMemo(() => {
        if (!customer) return 0;

        const transactions: Array<{ date: string; change: number }> = [];

        deliveredCustomerOrders.forEach(o => {
            // ✅ Use grandTotal (không trừ paidAmount) vì phiếu thu đã được tính riêng
            transactions.push({ date: o.orderDate, change: o.grandTotal || 0 });
        });

        allReceipts
            .filter(r => r.payerTypeName === 'Khách hàng' && r.payerName === customer.name)
            .forEach(receipt => {
                transactions.push({ date: receipt.date, change: -receipt.amount });
            });

        allPayments
            .filter(p => p.recipientTypeName === 'Khách hàng' && p.recipientName === customer.name)
            .forEach(payment => {
                transactions.push({ date: payment.date, change: payment.amount });
            });

        if (!transactions.length) {
            return customer.currentDebt ?? 0;
        }

        transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        let balance = 0;
        transactions.forEach(entry => {
            balance += entry.change;
        });

        return balance;
    }, [customer, deliveredCustomerOrders, allReceipts, allPayments]);

    const customerWarranties = React.useMemo(() => {
        if (!customer) return [];
        return warranties.filter(ticket => ticket.customerPhone === customer.phone);
    }, [customer?.phone, warranties]);

    const customerWarrantyCount = customerWarranties.length;

    const activeWarrantyCount = React.useMemo(() => {
        return customerWarranties.filter(ticket => !['returned', 'completed', 'cancelled'].includes(ticket.status)).length;
    }, [customerWarranties]);

    const customerComplaints = React.useMemo(() => {
        if (!customer) return [];
        return complaints.filter(complaint => complaint.customerSystemId === customer.systemId);
    }, [customer?.systemId, complaints]);

    const customerComplaintCount = customerComplaints.length;

    const activeComplaintCount = React.useMemo(() => {
        return customerComplaints.filter(complaint => complaint.status === 'pending' || complaint.status === 'investigating').length;
    }, [customerComplaints]);

    const slaDisplay = React.useMemo(() => {
        if (!customer) {
            return {
                title: 'Đúng hạn',
                detail: 'Chưa có dữ liệu SLA',
                tone: 'secondary' as const,
            };
        }

        const entry = slaEngine.index?.entries?.[customer.systemId];
        const alerts = entry?.alerts ?? [];
        if (!alerts.length) {
            return {
                title: 'Đúng hạn',
                detail: 'Không có cảnh báo',
                tone: 'success' as const,
            };
        }

        const sortedAlerts = [...alerts].sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime());
        const nextAlert = sortedAlerts[0];
        const remaining = nextAlert.daysRemaining;
        const timeText = remaining === 0
            ? 'Hôm nay'
            : remaining > 0
                ? `Còn ${remaining} ngày`
                : `Trễ ${Math.abs(remaining)} ngày`;
        const tone = remaining < 0
            ? 'destructive'
            : nextAlert.alertLevel === 'warning'
                ? 'warning'
                : 'secondary';

        return {
            title: nextAlert.slaName,
            detail: `${timeText}${nextAlert.targetDate ? ` • hạn ${formatDate(nextAlert.targetDate)}` : ''}`,
            tone,
        } as const;
    }, [customer, slaEngine.index]);

    // Order breakdown by status
    const orderBreakdown = React.useMemo(() => {
        const pending = customerOrders.filter(o => o.status === 'Đặt hàng').length;
        const inProgress = customerOrders.filter(o => o.status === 'Đang giao dịch').length;
        const completed = customerOrders.filter(o => o.status === 'Hoàn thành').length;
        const cancelled = customerOrders.filter(o => o.status === 'Đã hủy').length;
        return { pending, inProgress, completed, cancelled };
    }, [customerOrders]);

    const customerMetrics = React.useMemo(() => {
        const lastOrderDate = customerOrderStats.lastOrderDate;
        return [
            {
                key: 'orders',
                label: 'Tổng số đơn đặt',
                value: formatNumber(customerOrderStats.totalOrders),
                subValue: `${orderBreakdown.pending} đặt hàng, ${orderBreakdown.inProgress} đang giao dịch, ${orderBreakdown.completed} hoàn thành, ${orderBreakdown.cancelled} đã hủy`,
            },
            {
                key: 'warranty',
                label: 'Tổng số lần bảo hành',
                value: formatNumber(customerWarrantyCount),
                badge: activeWarrantyCount > 0 ? { label: `${activeWarrantyCount} chưa trả`, tone: 'warning' as const } : undefined,
                link: customer ? `/warranty?customer=${encodeURIComponent(customer.systemId)}` : undefined,
            },
            {
                key: 'complaints',
                label: 'Tổng số lần khiếu nại',
                value: formatNumber(customerComplaintCount),
                badge: activeComplaintCount > 0 ? { label: `${activeComplaintCount} chưa xử lý`, tone: 'destructive' as const } : undefined,
                link: customer ? `/complaints?customer=${encodeURIComponent(customer.systemId)}` : undefined,
            },
            {
                key: 'last-order',
                label: 'Lần đặt đơn gần nhất',
                value: lastOrderDate ? formatDate(lastOrderDate) : '---',
            },
            {
                key: 'failed-delivery',
                label: 'Giao hàng thất bại',
                value: formatNumber(customer?.failedDeliveries ?? 0),
            },
            {
                key: 'sla',
                label: 'SLA',
                value: slaDisplay.title,
                subValue: slaDisplay.detail,
                tone: slaDisplay.tone,
            },
        ];
    }, [customerOrderStats.totalOrders, customerOrderStats.lastOrderDate, customer, orderBreakdown, customerWarrantyCount, customerComplaintCount, activeWarrantyCount, activeComplaintCount, slaDisplay]);

    const handleCopyOrder = React.useCallback(() => {
        if (!order || isCopying) {
            return;
        }

        setIsCopying(true);
        try {
            navigate(`/orders/new?copy=${order.systemId}`);
        } finally {
            // Component will unmount after navigation, but keep defensive reset to be safe when navigation fails
            setTimeout(() => setIsCopying(false), 300);
        }
    }, [order, isCopying, navigate]);

    // Customer Settings Stores
    const customerTypes = useCustomerTypeStore();
    const customerGroups = useCustomerGroupStore();
    const customerSources = useCustomerSourceStore();
    const { findById: findEmployeeById } = useEmployeeStore();

    // Branding for print
    const { logoUrl } = useBranding();

    const getTypeName = (id?: string) => id ? customerTypes.findById(asSystemId(id))?.name : undefined;
    const getGroupName = (id?: string) => id ? customerGroups.findById(asSystemId(id))?.name : undefined;
    const getSourceName = (id?: string) => id ? customerSources.findById(asSystemId(id))?.name : undefined;
    const getEmployeeName = (id?: string) => id ? findEmployeeById(asSystemId(id))?.fullName : undefined;

    // Get salesperson employee for print
    const salespersonEmployee = React.useMemo(() => {
        if (!order?.salespersonSystemId) return null;
        return findEmployeeById(asSystemId(order.salespersonSystemId));
    }, [order?.salespersonSystemId, findEmployeeById]);

    const [isCancelAlertOpen, setIsCancelAlertOpen] = React.useState(false);
    const [cancelReasonText, setCancelReasonText] = React.useState('');
    const [restockItems, setRestockItems] = React.useState(true);
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = React.useState(false);
    const [isCreateShipmentDialogOpen, setIsCreateShipmentDialogOpen] = React.useState(false);
    const [isPackerSelectionOpen, setIsPackerSelectionOpen] = React.useState(false);
    const [cancelPackagingState, setCancelPackagingState] = React.useState<{ packagingSystemId: SystemId } | null>(null);
    const [cancelShipmentState, setCancelShipmentState] = React.useState<{ packagingSystemId: SystemId; type: 'fail' | 'cancel' } | null>(null);
    const [orderComments, setOrderComments] = React.useState<OrderComment[]>([]);
    const commentStorageKey = order ? `order-comments-${order.systemId}` : null;
    const [hasOrderWorkflowTemplate, setHasOrderWorkflowTemplate] = React.useState(true);

    React.useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            const templates = getWorkflowTemplates('orders');
            setHasOrderWorkflowTemplate(templates.length > 0);
        } catch (error) {
            console.error('[OrderDetail] Failed to load workflow templates', error);
            setHasOrderWorkflowTemplate(true);
        }
    }, []);

    const resetCancelForm = React.useCallback(() => {
        setCancelReasonText('');
        setRestockItems(true);
    }, []);

    React.useEffect(() => {
        if (!isCancelAlertOpen) {
            resetCancelForm();
        }
    }, [isCancelAlertOpen, resetCancelForm]);

    React.useEffect(() => {
        if (!commentStorageKey || typeof window === 'undefined') {
            setOrderComments([]);
            return;
        }

        try {
            const stored = window.localStorage.getItem(commentStorageKey);
            if (!stored) {
                setOrderComments([]);
                return;
            }

            const parsed = JSON.parse(stored) as Array<{
                id: string;
                content: string;
                author: OrderComment['author'];
                parentId?: string;
                createdAt: string;
                updatedAt?: string;
            }>;
            setOrderComments(
                parsed.map(comment => ({
                    ...comment,
                    createdAt: new Date(comment.createdAt),
                    updatedAt: comment.updatedAt ? new Date(comment.updatedAt) : undefined,
                }))
            );
        } catch (error) {
            console.error('[OrderDetail] Failed to load order comments', error);
            setOrderComments([]);
        }
    }, [commentStorageKey]);

    const persistOrderComments = React.useCallback((comments: OrderComment[]) => {
        if (!commentStorageKey || typeof window === 'undefined') return;
        const serializable = comments.map(comment => ({
            ...comment,
            createdAt: new Date(comment.createdAt).toISOString(),
            updatedAt: comment.updatedAt ? new Date(comment.updatedAt).toISOString() : undefined,
        }));
        window.localStorage.setItem(commentStorageKey, JSON.stringify(serializable));
    }, [commentStorageKey]);

    const handleAddOrderComment = React.useCallback((content: string, parentId?: string) => {
        if (!order) return;
        const trimmed = content.trim();
        if (!trimmed) return;

        const randomId = typeof window !== 'undefined' && window.crypto?.randomUUID
            ? window.crypto.randomUUID()
            : `order-comment-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

        const newComment: OrderComment = {
            id: randomId,
            content: trimmed,
            author: {
                systemId: currentEmployeeSystemId,
                name: authEmployee?.fullName || 'Nhân viên',
                avatar: authEmployee?.avatarUrl,
            },
            createdAt: new Date(),
            parentId,
        };

        setOrderComments(prev => {
            const updated = [...prev, newComment];
            persistOrderComments(updated);
            return updated;
        });
    }, [order, currentEmployeeSystemId, authEmployee?.fullName, authEmployee?.avatarUrl, persistOrderComments]);

    const handleUpdateOrderComment = React.useCallback((commentId: string, content: string) => {
        const trimmed = content.trim();
        if (!trimmed) return;

        setOrderComments(prev => {
            const updated = prev.map(comment =>
                comment.id === commentId
                    ? { ...comment, content: trimmed, updatedAt: new Date() }
                    : comment
            );
            persistOrderComments(updated);
            return updated;
        });
    }, [persistOrderComments]);

    const handleDeleteOrderComment = React.useCallback((commentId: string) => {
        setOrderComments(prev => {
            const idsToRemove = new Set<string>([commentId]);
            const queue = [commentId];

            while (queue.length > 0) {
                const current = queue.shift()!;
                prev.forEach(comment => {
                    if (comment.parentId === current && !idsToRemove.has(comment.id)) {
                        idsToRemove.add(comment.id);
                        queue.push(comment.id);
                    }
                });
            }

            const updated = prev.filter(comment => !idsToRemove.has(comment.id));
            persistOrderComments(updated);
            return updated;
        });
    }, [persistOrderComments]);

    const commentCurrentUser = React.useMemo(() => {
        if (!authEmployee) return undefined;
        return {
            systemId: currentEmployeeSystemId,
            name: authEmployee.fullName || authEmployee.workEmail || 'Nhân viên',
            ...(authEmployee.avatarUrl ? { avatar: authEmployee.avatarUrl } : {}),
        };
    }, [authEmployee, currentEmployeeSystemId]);

    // Get all employees for @mention in comments
    const { data: allEmployees } = useEmployeeStore();
    const employeeMentions = React.useMemo(() => {
        return allEmployees
            .filter(e => !e.isDeleted)
            .map(e => ({
                id: e.systemId,
                label: e.fullName,
                avatar: e.avatarUrl,
            }));
    }, [allEmployees]);

    const salesReturnsForOrder = React.useMemo(() => {
        if (!order) return [];
        return allSalesReturns.filter(sr => sr.orderSystemId === order.systemId);
    }, [order, allSalesReturns]);
    
    const totalReturnedValue = React.useMemo(() => 
        salesReturnsForOrder.reduce((sum, sr) => sum + sr.totalReturnValue, 0),
    [salesReturnsForOrder]);

    // Tính tổng số tiền đã hoàn cho khách từ các phiếu trả hàng
    const totalRefundedFromReturns = React.useMemo(() => 
        salesReturnsForOrder.reduce((sum, sr) => {
            const refundFromArray = (sr.refunds || []).reduce((s, r) => s + (r.amount || 0), 0);
            return sum + (refundFromArray || sr.refundAmount || 0);
        }, 0),
    [salesReturnsForOrder]);

    // Lấy các phiếu chi hoàn tiền liên quan đến đơn hàng này (từ sales returns)
    const refundPaymentsForOrder = React.useMemo(() => {
        if (!order) return [];
        return allPayments.filter(p => 
            p.status !== 'cancelled' &&
            (p.linkedOrderSystemId === order.systemId || 
             salesReturnsForOrder.some(sr => sr.paymentVoucherSystemIds?.includes(p.systemId)))
        );
    }, [order, allPayments, salesReturnsForOrder]);

    const totalPaid = React.useMemo(() => (order?.payments || []).reduce((sum, p) => sum + p.amount, 0), [order?.payments]);
    // totalPaid: số tiền khách đã thanh toán
    // totalRefundedFromReturns: số tiền đã hoàn lại cho khách (từ sales returns)
    // netGrandTotal: công nợ thực tế sau khi trừ hàng trả
    // amountRemaining = netGrandTotal - totalPaid + totalRefundedFromReturns
    const netGrandTotal = Math.max(0, (order?.grandTotal || 0) - totalReturnedValue);
    const amountRemaining = netGrandTotal - totalPaid + totalRefundedFromReturns;

    const totalLineQuantity = React.useMemo(() => {
        if (!order) return 0;
        return order.lineItems.reduce((sum, item) => sum + item.quantity, 0);
    }, [order]);

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

    const getProductTypeLabel = React.useCallback((productSystemId: SystemId) => {
        const product = findProductById(productSystemId);
        if (!product) return '---';

        if (product.productTypeSystemId) {
            const productType = findProductTypeById(product.productTypeSystemId);
            if (productType?.name) {
                return productType.name;
            }
        }

        if (product.type && productTypeFallbackLabels[product.type]) {
            return productTypeFallbackLabels[product.type];
        }

        return 'Hàng hóa';
    }, [findProductById, findProductTypeById]);
    
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

    const existingPackerSystemId = React.useMemo<SystemId | undefined>(() => {
        if (!order) {
            return undefined;
        }

        const explicitPacker = order.assignedPackerSystemId || (order as any).assignedPackerSystemId || (order as any).packerId;
        if (explicitPacker) {
            return asSystemId(explicitPacker);
        }

        if (activePackaging?.assignedEmployeeId) {
            return activePackaging.assignedEmployeeId;
        }

        const fallbackPackaging = [...(order.packagings ?? [])]
            .reverse()
            .find(pkg => pkg.assignedEmployeeId);

        return fallbackPackaging?.assignedEmployeeId;
    }, [order, activePackaging]);

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
        const finalReason = cancelReasonText.trim();
        if (!finalReason) {
            toast.error('Vui lòng nhập lý do hủy đơn hàng.');
            return;
        }
        const cancelOptions = {
            reason: finalReason,
            restock: restockItems,
        };
        
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
                                    cancelOrder(order.systemId, currentEmployeeSystemId, cancelOptions);
                                    resetCancelForm();
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
                                cancelOrder(order.systemId, currentEmployeeSystemId, cancelOptions);
                                resetCancelForm();
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
        cancelOrder(order.systemId, currentEmployeeSystemId, cancelOptions); 
        resetCancelForm();
        setIsCancelAlertOpen(false); 
    };
    const handleAddPayment = (paymentData: PaymentFormValues) => { if (order) { addPayment(order.systemId, paymentData, currentEmployeeSystemId); setIsPaymentDialogOpen(false); } };
    const handleRequestPackaging = React.useCallback((assignedEmployeeId?: SystemId) => {
        if (order) {
            requestPackaging(order.systemId, currentEmployeeSystemId, assignedEmployeeId);
        }
    }, [order, requestPackaging, currentEmployeeSystemId]);
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


    const handleRequestPackagingClick = React.useCallback(() => {
        if (existingPackerSystemId) {
            handleRequestPackaging(existingPackerSystemId);
            return;
        }
        setIsPackerSelectionOpen(true);
    }, [existingPackerSystemId, handleRequestPackaging, setIsPackerSelectionOpen]);

    const headerActions = React.useMemo(() => {
        if (!order) {
            return [];
        }

        const canReturn = order.status !== 'Đã hủy' && 
            order.returnStatus !== 'Trả hàng toàn bộ' &&
            order.stockOutStatus !== 'Chưa xuất kho';
        
        const canRequestPackaging = isActionable && (!activePackaging || activePackaging.deliveryStatus === 'Chờ giao lại');
        const canConfirmPackaging = activePackaging?.status === 'Chờ đóng gói';
        const canShip = activePackaging?.status === 'Đã đóng gói' && 
                        activePackaging?.deliveryStatus === 'Chờ lấy hàng' &&
                        order.stockOutStatus !== 'Chưa xuất kho';
        
        // ✅ Chỉ hiện nút Xuất kho khi đã đóng gói xong VÀ đã chọn hình thức giao hàng (theo yêu cầu user)
        const canStockOut = order.stockOutStatus === 'Chưa xuất kho' && 
                            order.status !== 'Đã hủy' && 
                            activePackaging?.status === 'Đã đóng gói' &&
                            !!activePackaging?.deliveryMethod;

        const actions: React.ReactNode[] = [];

        if (canStockOut) {
            actions.push(
                <Button 
                    key="stockout" 
                    size="sm" 
                    className="h-9" 
                    onClick={() => {
                        if (activePackaging) {
                            handleDispatch(activePackaging.systemId);
                        } else {
                            toast.error('Vui lòng tạo yêu cầu đóng gói trước khi xuất kho');
                        }
                    }}
                >
                    Xác nhận xuất kho
                </Button>
            );
        }

        if (canRequestPackaging) {
            actions.push(
                <Button key="request-packaging" size="sm" className="h-9" onClick={handleRequestPackagingClick}>
                    Yêu cầu đóng gói
                </Button>
            );
        }

        if (canConfirmPackaging) {
            actions.push(
                <Button 
                    key="confirm-packaging" 
                    size="sm" 
                    className="h-9" 
                    onClick={() => {
                        if (activePackaging) {
                            handleConfirmPackaging(activePackaging.systemId);
                        } else {
                            toast.error('Không tìm thấy gói hàng cần đóng gói');
                        }
                    }}
                >
                    Xác nhận đóng gói
                </Button>
            );
        }

        if (canShip) {
            actions.push(
                <Button 
                    key="ship" 
                    size="sm" 
                    className="h-9" 
                    onClick={() => {
                        if (activePackaging) {
                            handleDispatch(activePackaging.systemId);
                        } else {
                            toast.error('Không tìm thấy gói hàng để giao');
                        }
                    }}
                >
                    Giao hàng
                </Button>
            );
        }

        if (canReturn) {
            actions.push(
                <Button
                    key="return"
                    variant="outline"
                    size="sm"
                    className="h-9"
                    onClick={() => navigate(`/orders/${order.systemId}/return`)}
                >
                    Hoàn trả hàng
                </Button>
            );
        }

        // Cho phép hủy đơn nếu:
        // - Chưa hủy
        // - Chưa có phiếu trả hàng (nếu đã trả hàng thì không được hủy vì sẽ gây rối stock và công nợ)
        const canCancelOrder = order.status !== 'Đã hủy' && 
            (!order.returnStatus || order.returnStatus === 'Chưa trả hàng');
        
        if (canCancelOrder) {
            actions.push(
                <Button
                    key="cancel"
                    variant="outline"
                    size="sm"
                    className="h-9 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => setIsCancelAlertOpen(true)}
                >
                    Hủy đơn hàng
                </Button>
            );
        }

        if (order.status !== 'Đã hủy') {
            actions.push(
                <Button
                    key="edit"
                    variant="outline"
                    size="sm"
                    className="h-9"
                    onClick={() => navigate(`/orders/${order.systemId}/edit`)}
                >
                    Sửa
                </Button>
            );
        }

        return actions;
    }, [order, isActionable, navigate, setIsCancelAlertOpen, activePackaging, handleRequestPackagingClick]);

    const displayStatus = React.useMemo(() => {
        if (!order) return undefined;
        // Fix for existing orders that are stuck in 'Đặt hàng' but have been dispatched
        if (order.status === 'Đặt hàng' && (order.stockOutStatus === 'Xuất kho toàn bộ' || order.deliveryStatus === 'Đang giao hàng' || order.deliveryStatus === 'Đã giao hàng')) {
            return 'Đang giao dịch';
        }
        return order.status;
    }, [order]);

    const headerBadge = React.useMemo(() => {
        if (!order || !displayStatus) {
            return undefined;
        }
        return (
            <div className="flex items-center gap-2">
                <OrderPrintButton
                    order={order}
                    customer={customer}
                    branch={orderBranch}
                    createdByEmployee={salespersonEmployee}
                    logoUrl={getFullLogoUrl(logoUrl)}
                />
                <Button
                    variant="outline"
                    size="sm"
                    className="h-7"
                    onClick={handleCopyOrder}
                    disabled={isCopying}
                >
                    {isCopying ? (
                        <Spinner className="mr-2 h-4 w-4" />
                    ) : (
                        <Copy className="mr-2 h-4 w-4" />
                    )}
                    Sao chép
                </Button>
                <Badge variant={statusVariants[displayStatus]} className="uppercase tracking-wide">
                    {displayStatus}
                </Badge>
                {order.returnStatus === 'Trả hàng một phần' && (
                    <Badge variant="outline" className="border-orange-500 text-orange-600 bg-orange-50">
                        Trả hàng một phần
                    </Badge>
                )}
                {order.returnStatus === 'Trả hàng toàn bộ' && (
                    <Badge variant="outline" className="border-red-500 text-red-600 bg-red-50">
                        Trả hàng toàn bộ
                    </Badge>
                )}
            </div>
        );
    }, [order, displayStatus, handleCopyOrder, isCopying, customer, orderBranch, salespersonEmployee, logoUrl]);

    const breadcrumb = React.useMemo(() => ([
        { label: 'Trang chủ', href: '/', isCurrent: false },
        { label: 'Đơn hàng', href: '/orders', isCurrent: false },
        { label: order?.id ? `Đơn ${order.id}` : 'Chi tiết', href: order ? `/orders/${order.systemId}` : '/orders', isCurrent: true },
    ]), [order]);

    usePageHeader({ 
        title: order ? `Đơn hàng ${order.id}` : 'Chi tiết đơn hàng',
        breadcrumb,
        badge: headerBadge,
        actions: headerActions,
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
            return <Button size="sm" onClick={handleRequestPackagingClick}>Yêu cầu đóng gói</Button>;
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
                        <StatusStepper order={order} />
                    </CardContent>
                </Card>

                {/* Row 1: Thông tin khách hàng (40%) + Quy trình xử lý (30%) + Thông tin đơn hàng (30%) */}
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
                    {/* Thông tin khách hàng - 40% width on desktop */}
                    <Card className="lg:col-span-4 flex flex-col">
                        <CardHeader className="flex-shrink-0">
                            <CardTitle className="text-base font-semibold">Thông tin khách hàng</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="space-y-3">
                                {/* Tên và thông tin liên hệ */}
                                <div>
                                    <p className="font-semibold text-primary cursor-pointer hover:underline text-lg" onClick={() => navigate(`/customers/${customer?.systemId}`)}>{order.customerName}</p>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                                        {customer?.phone && (
                                            <span className="font-medium text-foreground inline-flex items-center gap-1">
                                                {customer.phone}
                                                <Copy 
                                                    className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground" 
                                                    onClick={() => { navigator.clipboard.writeText(customer.phone); toast.success('Đã sao chép số điện thoại'); }}
                                                />
                                            </span>
                                        )}
                                        {customer?.email && (
                                            <span className="inline-flex items-center gap-1">
                                                {customer.email}
                                                <Copy 
                                                    className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground" 
                                                    onClick={() => { navigator.clipboard.writeText(customer.email!); toast.success('Đã sao chép email'); }}
                                                />
                                            </span>
                                        )}
                                        {customer?.taxCode && (
                                            <span className="inline-flex items-center gap-1">
                                                MST: {customer.taxCode}
                                                <Copy 
                                                    className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground" 
                                                    onClick={() => { navigator.clipboard.writeText(customer.taxCode!); toast.success('Đã sao chép mã số thuế'); }}
                                                />
                                            </span>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Địa chỉ giao hàng - 1 hàng */}
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Địa chỉ giao hàng</p>
                                    <div className="flex items-start gap-1">
                                        <p className="text-sm flex-1">{shippingAddress || 'Chưa có thông tin giao hàng'}</p>
                                        {shippingAddress && (
                                            <Copy 
                                                className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground flex-shrink-0 mt-0.5" 
                                                onClick={() => { navigator.clipboard.writeText(shippingAddress); toast.success('Đã sao chép địa chỉ giao hàng'); }}
                                            />
                                        )}
                                    </div>
                                </div>
                                
                                {/* Địa chỉ nhận hóa đơn - 1 hàng */}
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Địa chỉ nhận hóa đơn</p>
                                    <div className="flex items-start gap-1">
                                        <p className="text-sm flex-1">{billingAddress || '-'}</p>
                                        {billingAddress && (
                                            <Copy 
                                                className="h-3 w-3 cursor-pointer text-muted-foreground hover:text-foreground flex-shrink-0 mt-0.5" 
                                                onClick={() => { navigator.clipboard.writeText(billingAddress); toast.success('Đã sao chép địa chỉ hóa đơn'); }}
                                            />
                                        )}
                                    </div>
                                </div>
                                
                                {/* Tags */}
                                {customer?.tags && customer.tags.length > 0 && (
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Tags</p>
                                        <div className="flex flex-wrap gap-1">
                                            {customer.tags.map((tag, idx) => (
                                                <Badge key={idx} variant="outline" className="text-xs font-normal">{tag}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Thống kê khách hàng */}
                                <div className="text-sm space-y-1.5 border-t pt-3">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Nhóm KH:</span>
                                        <span className="font-medium">{getGroupName(customer?.customerGroup) || '---'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">NV phụ trách:</span>
                                        <span className="font-medium">{getEmployeeName(customer?.accountManagerId) || '---'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Công nợ/Hạn mức:</span>
                                        <div className="text-right">
                                            <Link 
                                                to={`/customers/${customer?.systemId}?tab=debt`} 
                                                className="font-medium text-red-500 hover:underline cursor-pointer"
                                            >
                                                {formatCurrency(customerDebtBalance)}
                                            </Link>
                                            <span className="text-muted-foreground mx-1">/</span>
                                            <span className="font-medium">{formatCurrency(customer?.maxDebt)}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Tổng chi tiêu:</span>
                                        <span className="font-medium">{formatCurrency(customerOrderStats.totalSpent)}</span>
                                    </div>
                                    <div className="border-t border-dashed my-2" />
                                    {customerMetrics.map(metric => {
                                        const toneClass = metric.tone === 'destructive'
                                            ? 'text-red-600'
                                            : metric.tone === 'warning'
                                                ? 'text-amber-600'
                                                : metric.tone === 'success'
                                                    ? 'text-green-600'
                                                    : 'text-foreground';
                                        const ValueContent = (
                                            <div className="flex items-center gap-2 justify-end">
                                                <span className={cn('font-medium', toneClass, metric.link && 'hover:underline cursor-pointer')}>{metric.value}</span>
                                                {metric.badge && (
                                                    <Badge
                                                        variant="secondary"
                                                        className={cn(
                                                            'text-[11px] uppercase tracking-tight',
                                                            metric.badge.tone === 'destructive'
                                                                ? 'bg-red-100 text-red-700 border-red-200'
                                                                : 'bg-amber-100 text-amber-700 border-amber-200'
                                                        )}
                                                    >
                                                        {metric.badge.label}
                                                    </Badge>
                                                )}
                                            </div>
                                        );
                                        return (
                                            <div key={metric.key} className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:justify-between">
                                                <span className="text-muted-foreground">{metric.label}:</span>
                                                <div className="text-right space-y-0.5">
                                                    {metric.link ? (
                                                        <Link to={metric.link} className="block">
                                                            {ValueContent}
                                                        </Link>
                                                    ) : (
                                                        ValueContent
                                                    )}
                                                    {metric.subValue && (
                                                        <p className="text-xs text-muted-foreground">{metric.subValue}</p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quy trình xử lý - 30% width on desktop */}
                    <div className="lg:col-span-3 space-y-3">
                        {!hasOrderWorkflowTemplate && (
                            <Alert className="border-amber-200 bg-amber-50 text-amber-900">
                                <Info className="h-4 w-4 text-amber-600" />
                                <AlertTitle>Chưa cấu hình quy trình xử lý đơn hàng</AlertTitle>
                                <AlertDescription>
                                    Thiết lập quy trình mặc định tại{' '}
                                    <Link to="/settings/workflow-templates" className="font-semibold text-primary underline">
                                        Cài đặt &gt; Quy trình
                                    </Link>{' '}
                                    để đội vận hành có checklist thống nhất.
                                </AlertDescription>
                            </Alert>
                        )}
                        <OrderWorkflowCard 
                            order={order} 
                            onUpdateOrder={(systemId, updates) => {
                                orderStore.update(asSystemId(systemId), updates);
                            }} 
                        />
                    </div>

                    {/* Thông tin đơn hàng - 30% width on desktop */}
                    <Card className="lg:col-span-3 flex flex-col h-full lg:h-auto">
                        <CardHeader className="flex-shrink-0">
                            <CardTitle className="text-base font-semibold">Thông tin đơn hàng</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-3 overflow-y-auto flex-1 max-h-[400px] lg:max-h-none"
                            style={{ 
                                scrollbarWidth: 'thin',
                                scrollbarColor: 'rgb(203 213 225) transparent'
                            }}
                        >
                            <DetailField label="Chính sách giá" value={defaultPricingPolicy?.name || 'Giá bán lẻ'} />
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
                                            <Badge key={idx} variant="secondary" className="text-xs">{tag}</Badge>
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
                                    <span className="font-medium text-amber-600">-{formatCurrency(totalReturnedValue)}</span>
                                </div>
                            )}
                            {totalReturnedValue > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground font-semibold">Công nợ thực tế:</span>
                                    <span className="font-semibold">{formatCurrency(netGrandTotal)}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Đã trả:</span>
                                <span className="font-medium">{totalPaid > 0 ? formatCurrency(totalPaid) : '0'}</span>
                            </div>
                            {totalRefundedFromReturns > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Đã hoàn tiền (trả hàng):</span>
                                    <span className="font-medium text-green-600">-{formatCurrency(totalRefundedFromReturns)}</span>
                                </div>
                            )}
                            
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
                                    amountRemaining > 0 ? 'text-red-500' : amountRemaining < 0 ? 'text-green-600' : 'text-foreground'
                                )}>{amountRemaining >= 0 ? formatCurrency(amountRemaining) : formatCurrency(0)}</span>
                            </div>
                            {amountRemaining < 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span className="font-medium">Thừa tiền (cần hoàn thêm):</span>
                                    <span className="font-bold">{formatCurrency(Math.abs(amountRemaining))}</span>
                                </div>
                            )}
                        </div>

                        {directPayments.length > 0 && (
                            <div className="space-y-2 pt-2">
                                {[...directPayments].reverse().map((payment, index) => (
                                    <React.Fragment key={`direct-${payment.systemId}-${index}`}>
                                        <PaymentInfo payment={payment} order={order} />
                                    </React.Fragment>
                                ))}
                            </div>
                        )}
                        
                        {(totalActiveCod > 0 || codPayments.length > 0) && (
                            <div className="space-y-2 pt-2">
                                {codPayments.length > 0 && [...codPayments].reverse().map((payment, index) => (
                                    <React.Fragment key={`cod-${payment.systemId}-${index}`}>
                                        <PaymentInfo payment={payment} order={order} />
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

                        {/* Phiếu chi hoàn tiền từ trả hàng */}
                        {refundPaymentsForOrder.length > 0 && (
                            <div className="space-y-2 pt-2 border-t">
                                <p className="text-sm font-medium text-muted-foreground pt-2">Phiếu chi hoàn tiền</p>
                                {[...refundPaymentsForOrder].reverse().map((refund, index) => (
                                    <div key={`refund-${refund.systemId}-${index}`} className="border rounded-md text-sm">
                                        <Collapsible>
                                            <CollapsibleTrigger asChild>
                                                <div className="w-full p-3 flex items-center justify-between hover:bg-muted/50 rounded-md transition-colors cursor-pointer">
                                                <div className="flex items-center gap-2">
                                                    <ArrowDownLeft className="h-4 w-4 text-green-600" />
                                                    <Link 
                                                        to={`/payments/${refund.systemId}`} 
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="font-medium text-primary hover:underline"
                                                    >
                                                        {refund.id}
                                                    </Link>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-muted-foreground">{formatDate(refund.date)}</span>
                                                    <span className="font-semibold text-green-600">-{formatCurrency(refund.amount)}</span>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="h-6 w-6"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            // Reuse handlePrintTransaction logic or similar
                                                            // Since we don't have handlePrintTransaction here, we need to implement it or pass it
                                                            // But wait, we are inside OrderDetailPage, we can access print function
                                                            // Let's implement inline or call a helper
                                                            
                                                            const branch = findBranchById(order.branchSystemId);
                                                            const storeSettings: StoreSettings = {
                                                                name: storeInfo.brandName || storeInfo.companyName,
                                                                address: storeInfo.headquartersAddress,
                                                                phone: storeInfo.hotline,
                                                                email: storeInfo.email,
                                                                province: storeInfo.province,
                                                            };
                                                            
                                                            const paymentData: PaymentForPrint = {
                                                                code: refund.id,
                                                                createdAt: refund.date,
                                                                issuedAt: refund.date,
                                                                createdBy: findEmployeeById(refund.createdBy)?.fullName || refund.createdBy,
                                                                recipientName: order.customerName,
                                                                recipientPhone: order.customerPhone,
                                                                recipientAddress: order.customerAddress,
                                                                recipientType: 'Khách hàng',
                                                                amount: refund.amount,
                                                                description: refund.description,
                                                                paymentMethod: refund.paymentMethodName,
                                                                documentRootCode: order.id,
                                                                note: refund.description,
                                                                location: branch ? {
                                                                    name: branch.name,
                                                                    address: branch.address,
                                                                    province: branch.province
                                                                } : undefined
                                                            };
                                                            
                                                            const printData = mapPaymentToPrintData(paymentData, storeSettings);
                                                            printData['amount_text'] = numberToWords(refund.amount);
                                                            printData['print_date'] = formatDateTime(new Date());
                                                            printData['print_time'] = formatTime(new Date());
                                                            
                                                            print('payment', { data: printData });
                                                        }}
                                                        title="In phiếu"
                                                    >
                                                        <Printer className="h-4 w-4" />
                                                    </Button>
                                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                                </div>
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="px-3 pb-3">
                                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm pt-2 border-t">
                                                    <div>
                                                        <span className="text-muted-foreground">Phương thức</span>
                                                        <p className="font-medium">{refund.paymentMethodName}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground">Người tạo</span>
                                                        <p className="font-medium">{findEmployeeById(refund.createdBy)?.fullName || refund.createdBy}</p>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <span className="text-muted-foreground">Diễn giải</span>
                                                        <p className="font-medium">{refund.description}</p>
                                                    </div>
                                                </div>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    </div>
                                ))}
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
                <ProductInfoCard 
                    order={order} 
                    costOfGoods={costOfGoods} 
                    profit={profit} 
                    totalDiscount={totalDiscount} 
                    salesReturns={allSalesReturns} 
                    getProductTypeLabel={getProductTypeLabel}
                />
                
                {/* Return History Card - Show only if there are returns */}
                {salesReturnsForOrder.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">
                                Lịch sử trả hàng ({salesReturnsForOrder.length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ReturnHistoryTab 
                                order={order} 
                                salesReturnsForOrder={salesReturnsForOrder}
                                getProductTypeLabel={getProductTypeLabel}
                                onPreview={handlePreview}
                            />
                        </CardContent>
                    </Card>
                )}

                <Comments
                    entityType="order"
                    entityId={order.systemId}
                    comments={orderComments}
                    onAddComment={handleAddOrderComment}
                    onUpdateComment={handleUpdateOrderComment}
                    onDeleteComment={handleDeleteOrderComment}
                    currentUser={commentCurrentUser}
                    title="Bình luận nội bộ"
                    placeholder="Nhập bình luận cho đơn hàng..."
                    mentions={employeeMentions}
                />
                
                {/* Order History & Notes */}
                <OrderHistoryTab order={order} salesReturnsForOrder={salesReturnsForOrder} orderComments={orderComments} />

                {/* Shipping Tracking - Show if order has shipping partner delivery */}
                {order.packagings.some(p => p.deliveryMethod === 'Dịch vụ giao hàng' && p.status !== 'Hủy đóng gói') && (
                    <ShippingTrackingTab order={order} />
                )}
            </div>

            <AlertDialog open={isCancelAlertOpen} onOpenChange={setIsCancelAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận hủy đơn hàng</AlertDialogTitle>
                        <AlertDialogDescription className="space-y-4">
                            <div className="space-y-3">
                                <p>Bạn có chắc chắn muốn hủy đơn hàng này không?</p>
                                <p className="text-sm">Khi hủy đơn hàng, hệ thống sẽ thực hiện các thay đổi sau:</p>
                                <ul className="text-sm space-y-1 ml-4 list-disc">
                                    <li>Trả hàng về kho và cập nhật số lượng tồn kho</li>
                                    <li>Hủy các vận đơn liên quan (nếu có)</li>
                                    <li>Hủy các phiếu thu thanh toán đơn hàng</li>
                                    <li>Hủy các phiếu thu đặt cọc shipper (nếu có)</li>
                                    <li>Cập nhật công nợ khách hàng</li>
                                    <li>Cập nhật công nợ đối tác vận chuyển</li>
                                    <li>Hoàn lại khuyến mại và điểm tích lũy (nếu có)</li>
                                </ul>
                                {order && order.payments && order.payments.length > 0 && (
                                    <p className="text-amber-600 font-medium">
                                        Lưu ý: Đơn hàng đã có thanh toán. Một phiếu chi hoàn tiền sẽ được tạo tự động.
                                    </p>
                                )}
                                <p className="font-semibold text-destructive">Hành động này không thể hoàn tác!</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="cancel-reason-textarea" className="text-sm font-semibold">
                                    Lý do hủy đơn hàng
                                </Label>
                                <Textarea
                                    id="cancel-reason-textarea"
                                    value={cancelReasonText}
                                    onChange={(event) => setCancelReasonText(event.target.value)}
                                    placeholder="Nhập rõ lý do hủy để đội vận hành nắm được..."
                                    rows={3}
                                />
                            </div>

                            <div className="space-y-3">
                                <Label className="text-sm font-semibold">Tùy chọn bổ sung</Label>
                                <div className="space-y-2">
                                    <div className="flex items-start gap-3 rounded-md border p-3">
                                        <Checkbox
                                            id="cancel-restock-option"
                                            checked={restockItems}
                                            onCheckedChange={(checked) => setRestockItems(checked === true)}
                                        />
                                        <div className="space-y-1">
                                            <Label htmlFor="cancel-restock-option" className="text-sm font-medium">
                                                Hoàn kho {totalLineQuantity} sản phẩm
                                            </Label>
                                            <p className="text-xs text-muted-foreground">
                                                Giữ tồn kho và số liệu chi phí chính xác sau khi hủy.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Không, giữ đơn hàng</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmCancel} className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
                            Có, hủy đơn hàng
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

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
                {...(existingPackerSystemId ? { existingPackerSystemId } : {})}
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

            {/* Image Preview Dialog for ReturnHistoryTab */}
            <ImagePreviewDialog 
                open={returnHistoryPreviewState.open} 
                onOpenChange={(open) => setReturnHistoryPreviewState(prev => ({ ...prev, open }))} 
                images={[returnHistoryPreviewState.image]} 
                title={returnHistoryPreviewState.title}
            />
        </>
    );
}
