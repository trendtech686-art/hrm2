import * as React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Users2, PlusCircle, X, Copy } from 'lucide-react';
import Link from 'next/link';
import type { Customer } from '../../customers/types';
import { useAllCustomers } from '../../customers/hooks/use-all-customers';
import { useCustomerStore } from '../../customers/store'; // Keep for add mutation
import { useOrderStore } from '../store';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { VirtualizedCombobox, type ComboboxOption } from '../../../components/ui/virtualized-combobox';
import { CustomerForm, type CustomerFormSubmitPayload } from '../../customers/customer-form';
import { CustomerAddressSelector } from './customer-address-selector';
import { Badge } from '../../../components/ui/badge';
import { toast } from 'sonner';
import { useCustomerGroupStore } from '../../settings/customers/customer-groups-store';
import { asSystemId } from '@/lib/id-types';
import { formatDate } from '@/lib/date-utils';
import { useEmployeeFinder } from '../../employees/hooks/use-all-employees';
import { useWarrantyStore } from '../../warranty/store';
import { useComplaintStore } from '../../complaints/store';
import { useReceiptStore } from '../../receipts/store';
import { usePaymentStore } from '../../payments/store';
import { useCustomerSlaEvaluation } from '../../customers/sla/hooks';

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};

const formatNumber = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};

const formatAddress = (street?: string, ward?: string, province?: string) => {
    return [street, ward, province].filter(Boolean).join(', ');
};

const getToneClass = (tone?: 'destructive' | 'warning' | 'success' | 'secondary') => {
    switch (tone) {
        case 'destructive':
            return 'text-red-600';
        case 'warning':
            return 'text-amber-600';
        case 'success':
            return 'text-green-600';
        case 'secondary':
            return 'text-muted-foreground';
        default:
            return 'text-foreground';
    }
};

const getBadgeToneClass = (tone?: 'destructive' | 'warning') => {
    switch (tone) {
        case 'destructive':
            return 'bg-red-100 text-red-700 border-red-200';
        case 'warning':
            return 'bg-amber-100 text-amber-700 border-amber-200';
        default:
            return '';
    }
};

export function CustomerSelector({ disabled }: { disabled: boolean }) {
    const { control, setValue } = useFormContext();
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const { data: allCustomers } = useAllCustomers();
    const { add: addCustomer } = useCustomerStore(); // Keep for mutation
    const { data: allOrders } = useOrderStore();
    const customerGroupsStore = useCustomerGroupStore();
    const { findById: findEmployeeById } = useEmployeeFinder();
    const { data: warranties = [] } = useWarrantyStore();
    const { data: allReceipts = [] } = useReceiptStore();
    const { data: allPayments = [] } = usePaymentStore();
    const complaints = useComplaintStore((state) => state.complaints || []);
    const slaEngine = useCustomerSlaEvaluation();

    // ✅ PHASE 2: Convert watch to useWatch
    const selectedCustomer = useWatch({ control, name: 'customer' });

    // ✅ Convert customers to options for VirtualizedCombobox
    const customerOptions: ComboboxOption[] = React.useMemo(() => {
        return allCustomers.map(c => {
            const defaultAddress = c.addresses?.[0];
            return {
                value: c.systemId,
                label: c.name,
                metadata: {
                    phone: c.phone,
                    address: defaultAddress ? formatAddress(defaultAddress.street, defaultAddress.ward, defaultAddress.province) : '',
                    debt: c.currentDebt,
                    totalSpent: c.totalSpent
                }
            };
        });
    }, [allCustomers]);

    const handleSelect = (option: ComboboxOption | null) => {
        if (option) {
            const fullCustomer = allCustomers.find(c => c.systemId === option.value);
            // console.log('🔍 [Customer Selector] Selected customer:', fullCustomer); // Removed to prevent circular reference error
            setValue('customer', fullCustomer || null, { shouldValidate: true, shouldDirty: true });
            
            // ✅ Auto-load default addresses when selecting customer
            if (fullCustomer?.addresses) {
                // console.log('🔍 [Customer Selector] Customer addresses:', fullCustomer.addresses); // Removed
                const defaultShipping = fullCustomer.addresses.find(a => a.isDefaultShipping);
                const defaultBilling = fullCustomer.addresses.find(a => a.isDefaultBilling);
                
                // console.log('🔍 [Customer Selector] Default shipping:', defaultShipping); // Removed
                // console.log('🔍 [Customer Selector] Default billing:', defaultBilling); // Removed
                
                if (defaultShipping) {
                    // console.log('✅ [Customer Selector] Setting shippingAddress:', defaultShipping); // Removed
                    setValue('shippingAddress', defaultShipping, { shouldDirty: true });
                }
                if (defaultBilling) {
                    // console.log('✅ [Customer Selector] Setting billingAddress:', defaultBilling); // Removed
                    setValue('billingAddress', defaultBilling, { shouldDirty: true });
                }
            } else {
                console.warn('⚠️ [Customer Selector] Customer has no addresses array');
            }
        } else {
            setValue('customer', null, { shouldValidate: true, shouldDirty: true });
            setValue('shippingAddress', null);
            setValue('billingAddress', null);
        }
    };

    const handleCopy = React.useCallback((value: string, label: string) => {
        if (!value) return;
        navigator.clipboard.writeText(value);
        toast.success(`Đã sao chép ${label}`);
    }, []);

    const customerOrders = React.useMemo(() => {
        if (!selectedCustomer) return [];
        return allOrders.filter(order => order.customerSystemId === selectedCustomer.systemId);
    }, [allOrders, selectedCustomer]);

    // Orders that create debt: status='Hoàn thành' OR deliveryStatus='Đã giao hàng' OR stockOutStatus='Xuất kho toàn bộ'
    const deliveredCustomerOrders = React.useMemo(() => {
        return customerOrders.filter(order => 
            order.status !== 'Đã hủy' &&
            (order.status === 'Hoàn thành' || 
             order.deliveryStatus === 'Đã giao hàng' || 
             order.stockOutStatus === 'Xuất kho toàn bộ')
        );
    }, [customerOrders]);

    const customerOrderStats = React.useMemo(() => {
        if (!selectedCustomer) {
            return {
                totalOrders: 0,
                totalSpent: 0,
                lastOrderDate: null as string | null,
            };
        }

        if (!customerOrders.length) {
            return {
                totalOrders: selectedCustomer.totalOrders ?? 0,
                totalSpent: selectedCustomer.totalSpent ?? 0,
                lastOrderDate: selectedCustomer.lastPurchaseDate ?? null,
            };
        }

        let totalSpent = 0;
        deliveredCustomerOrders.forEach(order => {
            totalSpent += order.grandTotal || 0;
        });

        const recencySource = deliveredCustomerOrders.length ? deliveredCustomerOrders : customerOrders;
        let latestDate: string | null = null;
        recencySource.forEach(order => {
            if (!latestDate || new Date(order.orderDate) > new Date(latestDate)) {
                latestDate = order.orderDate;
            }
        });

        return {
            totalOrders: customerOrders.length,
            totalSpent,
            lastOrderDate: latestDate ?? selectedCustomer.lastPurchaseDate ?? null,
        };
    }, [selectedCustomer, customerOrders, deliveredCustomerOrders]);

    const customerDebtBalance = React.useMemo(() => {
        if (!selectedCustomer) return 0;
        const transactions: Array<{ date: string; change: number }> = [];

        deliveredCustomerOrders.forEach(order => {
            // ✅ Use grandTotal (không trừ paidAmount) vì phiếu thu đã được tính riêng
            transactions.push({ date: order.orderDate, change: order.grandTotal || 0 });
        });

        allReceipts
            .filter(receipt => receipt.payerTypeName === 'Khách hàng' && receipt.payerName === selectedCustomer.name)
            .forEach(receipt => transactions.push({ date: receipt.date, change: -receipt.amount }));

        allPayments
            .filter(payment => payment.recipientTypeName === 'Khách hàng' && payment.recipientName === selectedCustomer.name)
            .forEach(payment => transactions.push({ date: payment.date, change: payment.amount }));

        if (!transactions.length) {
            return selectedCustomer.currentDebt ?? 0;
        }

        transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return transactions.reduce((balance, entry) => balance + entry.change, 0);
    }, [selectedCustomer, deliveredCustomerOrders, allReceipts, allPayments]);

    const customerWarranties = React.useMemo(() => {
        if (!selectedCustomer?.phone) return [];
        return warranties.filter(ticket => ticket.customerPhone === selectedCustomer.phone);
    }, [selectedCustomer?.phone, warranties]);

    const customerWarrantyCount = customerWarranties.length;

    const activeWarrantyCount = React.useMemo(() => {
        return customerWarranties.filter(ticket => !['returned', 'completed', 'cancelled'].includes(ticket.status)).length;
    }, [customerWarranties]);

    const customerComplaints = React.useMemo(() => {
        if (!selectedCustomer) return [];
        return complaints.filter(complaint => complaint.customerSystemId === selectedCustomer.systemId);
    }, [selectedCustomer, complaints]);

    const customerComplaintCount = customerComplaints.length;

    const activeComplaintCount = React.useMemo(() => {
        return customerComplaints.filter(complaint => complaint.status === 'pending' || complaint.status === 'investigating').length;
    }, [customerComplaints]);

    const orderBreakdown = React.useMemo(() => {
        const pending = customerOrders.filter(o => o.status === 'Đặt hàng').length;
        const inProgress = customerOrders.filter(o => o.status === 'Đang giao dịch').length;
        const completed = customerOrders.filter(o => o.status === 'Hoàn thành').length;
        const cancelled = customerOrders.filter(o => o.status === 'Đã hủy').length;
        return { pending, inProgress, completed, cancelled };
    }, [customerOrders]);

    const slaDisplay = React.useMemo(() => {
        if (!selectedCustomer) {
            return {
                title: 'Đúng hạn',
                detail: 'Chưa có dữ liệu SLA',
                tone: 'secondary' as const,
            };
        }

        const entry = slaEngine?.index?.entries?.[selectedCustomer.systemId];
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
    }, [selectedCustomer, slaEngine]);

    const getGroupName = React.useCallback((id?: string) => {
        if (!id) return undefined;
        return customerGroupsStore.findById?.(asSystemId(id))?.name;
    }, [customerGroupsStore]);

    const getEmployeeName = React.useCallback((id?: string) => {
        if (!id) return undefined;
        try {
            return findEmployeeById(asSystemId(id))?.fullName;
        } catch (_error) {
            return undefined;
        }
    }, [findEmployeeById]);

    const customerBaseInfo = React.useMemo(() => {
        if (!selectedCustomer) return [];
        return [
            { label: 'Nhóm KH', value: getGroupName(selectedCustomer.customerGroup) || '---' },
            { label: 'NV phụ trách', value: getEmployeeName(selectedCustomer.accountManagerId) || '---' },
            { label: 'Công nợ/Hạn mức', value: `${formatCurrency(customerDebtBalance)}/${formatCurrency(selectedCustomer.maxDebt)}`, tone: customerDebtBalance < 0 ? 'destructive' as const : undefined },
            { label: 'Tổng chi tiêu', value: formatCurrency(customerOrderStats.totalSpent) },
            { 
                label: 'Tổng số đơn đặt', 
                value: formatNumber(customerOrderStats.totalOrders),
                subValue: `${orderBreakdown.pending} đặt hàng, ${orderBreakdown.inProgress} đang giao dịch, ${orderBreakdown.completed} hoàn thành, ${orderBreakdown.cancelled} đã hủy`
            },
        ];
    }, [selectedCustomer, getGroupName, getEmployeeName, customerDebtBalance, customerOrderStats.totalSpent, customerOrderStats.totalOrders, orderBreakdown]);

    const customerMetrics = React.useMemo(() => {
        if (!selectedCustomer) return [];
        const metrics: Array<{
            key: string;
            label: string;
            value: string;
            subValue?: string;
            badge?: { label: string; tone: 'warning' | 'destructive' };
            link?: string;
            tone?: 'destructive' | 'warning' | 'success' | 'secondary';
        }> = [];
        
        // Bảo hành
        metrics.push({
            key: 'warranty',
            label: 'Tổng số lần bảo hành',
            value: formatNumber(customerWarrantyCount),
            badge: activeWarrantyCount > 0 ? { label: `${activeWarrantyCount} chưa trả`, tone: 'warning' } : undefined,
            link: customerWarrantyCount > 0 ? `/warranty?customer=${encodeURIComponent(selectedCustomer.systemId)}` : undefined,
        });
        
        // Khiếu nại
        metrics.push({
            key: 'complaints',
            label: 'Tổng số lần khiếu nại',
            value: formatNumber(customerComplaintCount),
            badge: activeComplaintCount > 0 ? { label: `${activeComplaintCount} chưa xử lý`, tone: 'destructive' } : undefined,
            link: customerComplaintCount > 0 ? `/complaints?customer=${encodeURIComponent(selectedCustomer.systemId)}` : undefined,
        });
        
        // Lần đặt đơn gần nhất
        metrics.push({
            key: 'last-order',
            label: 'Lần đặt đơn gần nhất',
            value: customerOrderStats.lastOrderDate ? formatDate(customerOrderStats.lastOrderDate) : '---',
        });
        
        // Giao hàng thất bại
        metrics.push({
            key: 'failed-delivery',
            label: 'Giao hàng thất bại',
            value: formatNumber(selectedCustomer.failedDeliveries ?? 0),
        });
        
        // SLA
        metrics.push({
            key: 'sla',
            label: 'SLA',
            value: slaDisplay.title,
            subValue: slaDisplay.detail,
            tone: slaDisplay.tone,
        });
        
        return metrics;
    }, [selectedCustomer, customerWarrantyCount, customerComplaintCount, activeWarrantyCount, activeComplaintCount, customerOrderStats.lastOrderDate, slaDisplay]);

    const handleFormSubmit = (values: CustomerFormSubmitPayload) => { 
        addCustomer({
            ...values,
            id: values.id,
        } as Omit<Customer, 'systemId'>); 
        setIsFormOpen(false); 
    };

    return (
        // FIX: Wrapped component in a React.Fragment to resolve a TypeScript error related to JSX element types when using dialogs and other components together.
        <React.Fragment>
            <Card className="flex flex-col">
                <CardHeader className="flex-shrink-0 pb-3"><CardTitle className="text-base font-semibold">Thông tin khách hàng</CardTitle></CardHeader>
                <CardContent className="flex-1 overflow-y-auto space-y-3">
                    {selectedCustomer ? (
                        <div className="space-y-3">
                            {/* Header: Tên + Liên hệ + Nút xóa */}
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Link href={`/customers/${selectedCustomer.systemId}`} className="font-semibold text-primary truncate">
                                            {selectedCustomer.name}
                                        </Link>
                                        {selectedCustomer.tags && selectedCustomer.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {selectedCustomer.tags.slice(0, 3).map((tag, idx) => (
                                                    <Badge key={idx} variant="secondary" className="text-[10px] px-1.5 py-0">{tag}</Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-muted-foreground mt-1">
                                        {selectedCustomer.phone && (
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(selectedCustomer.phone, 'số điện thoại')}
                                                className="inline-flex items-center gap-1 hover:text-foreground"
                                                title="Sao chép"
                                            >
                                                <span className="font-medium text-foreground">{selectedCustomer.phone}</span>
                                                <Copy className="h-3 w-3" />
                                            </button>
                                        )}
                                        {selectedCustomer.email && (
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(selectedCustomer.email, 'email')}
                                                className="inline-flex items-center gap-1 hover:text-foreground truncate max-w-[180px]"
                                                title="Sao chép email"
                                            >
                                                <span className="truncate">{selectedCustomer.email}</span>
                                                <Copy className="h-3 w-3 flex-shrink-0" />
                                            </button>
                                        )}
                                        {selectedCustomer.taxCode && (
                                            <button
                                                type="button"
                                                onClick={() => handleCopy(selectedCustomer.taxCode, 'mã số thuế')}
                                                className="inline-flex items-center gap-1 hover:text-foreground"
                                                title="Sao chép MST"
                                            >
                                                <span className="text-xs">MST: {selectedCustomer.taxCode}</span>
                                                <Copy className="h-3 w-3" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {!disabled && (
                                    <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" type="button" onClick={() => handleSelect(null)}>
                                        <X className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                )}
                            </div>

                            {/* Địa chỉ giao hàng & hóa đơn */}
                            <CustomerAddressSelector customer={selectedCustomer} disabled={disabled} />

                            {/* Thông tin bổ sung: 2 cột */}
                            {(customerBaseInfo.length > 0 || customerMetrics.length > 0) && (
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs border-t pt-3">
                                    {customerBaseInfo.map(row => (
                                        <div key={row.label} className="flex flex-col sm:flex-row sm:justify-between gap-0.5">
                                            <span className="text-muted-foreground">{row.label}:</span>
                                            <div className="text-right">
                                                <span className={`font-medium ${row.tone ? getToneClass(row.tone) : 'text-foreground'}`}>{row.value}</span>
                                                {row.subValue && <p className="text-[10px] text-muted-foreground">{row.subValue}</p>}
                                            </div>
                                        </div>
                                    ))}
                                    {customerMetrics.map(metric => (
                                        <div key={metric.key} className="flex flex-col sm:flex-row sm:justify-between gap-0.5">
                                            <span className="text-muted-foreground">{metric.label}:</span>
                                            <div className="text-right">
                                                {metric.link ? (
                                                    <Link href={metric.link} className="inline-flex items-center gap-1">
                                                        <span className={`font-medium ${getToneClass(metric.tone)}`}>{metric.value}</span>
                                                        {metric.badge && (
                                                            <Badge variant="secondary" className={`text-[10px] px-1 py-0 ${getBadgeToneClass(metric.badge.tone)}`}>
                                                                {metric.badge.label}
                                                            </Badge>
                                                        )}
                                                    </Link>
                                                ) : (
                                                    <div>
                                                        <div className="flex items-center gap-1 justify-end">
                                                            <span className={`font-medium ${getToneClass(metric.tone)}`}>{metric.value}</span>
                                                            {metric.badge && (
                                                                <Badge variant="secondary" className={`text-[10px] px-1 py-0 ${getBadgeToneClass(metric.badge.tone)}`}>
                                                                    {metric.badge.label}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        {metric.subValue && <p className="text-[10px] text-muted-foreground">{metric.subValue}</p>}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <VirtualizedCombobox
                              options={customerOptions}
                              value={null}
                              onChange={(option) => handleSelect(option)}
                              placeholder="Tìm theo tên, SĐT, mã khách hàng... (F4)"
                              searchPlaceholder="Tìm kiếm..."
                              emptyPlaceholder="Không tìm thấy."
                              disabled={disabled}
                              renderHeader={() => (
                                <div className="p-1 border-b">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    className="w-full justify-start text-primary"
                                    onClick={() => setIsFormOpen(true)}
                                  >
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Thêm mới khách hàng
                                  </Button>
                                </div>
                              )}
                              renderOption={(option) => (
                                <div className="flex items-center justify-between gap-2 py-1">
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">{option.label}</div>
                                    <div className="text-xs text-muted-foreground truncate">
                                      {(option.metadata as { phone?: string })?.phone} • {(option.metadata as { address?: string })?.address || 'Chưa có địa chỉ'}
                                    </div>
                                  </div>
                                  {((option.metadata as { debt?: number })?.debt ?? 0) > 0 && (
                                    <div className="text-xs text-destructive font-semibold flex-shrink-0">
                                      Nợ: {formatCurrency((option.metadata as { debt?: number }).debt)}
                                    </div>
                                  )}
                                </div>
                              )}
                            />
                            <div className="text-center text-muted-foreground py-6"><Users2 className="mx-auto h-8 w-8 text-gray-300" /><p className="mt-2 text-sm">Chưa có thông tin khách hàng</p></div>
                        </>
                    )}
                </CardContent>
            </Card>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}><DialogContent className="sm:max-w-3xl"><DialogHeader><DialogTitle>Thêm khách hàng mới</DialogTitle></DialogHeader><CustomerForm initialData={null} onSubmit={handleFormSubmit} onCancel={() => setIsFormOpen(false)} /></DialogContent></Dialog>
        </React.Fragment>
    );
}
