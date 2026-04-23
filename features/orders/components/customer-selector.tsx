import * as React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Users2, PlusCircle, X, Copy } from 'lucide-react';
import Link from 'next/link';
import type { Customer } from '../../customers/types';
import type { BusinessProfile, OrderInvoiceInfo } from '@/lib/types/prisma-extended';
import { useCustomerMutations, useCustomer } from '../../customers/hooks/use-customers';
import { useInfiniteMeiliCustomerSearch } from '@/hooks/use-meilisearch';
// ⚡ PERFORMANCE: Single stats API call instead of loading ALL orders/warranties/complaints
import { useCustomerStats } from '../../customers/hooks/use-customer-stats';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { mobileBleedCardClass } from '@/components/layout/page-section';
import { Button } from '../../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { VirtualizedCombobox, type ComboboxOption } from '../../../components/ui/virtualized-combobox';
import { CustomerForm, type CustomerFormSubmitPayload } from '../../customers/customer-form';
import { CustomerAddressSelector } from './customer-address-selector';
import { Badge } from '../../../components/ui/badge';
import { toast } from 'sonner';
// ✅ REMOVED: useCustomerGroups — now resolved server-side in stats API
import { formatDate } from '@/lib/date-utils';

const formatCurrency = (value?: number | unknown) => {
    // Handle Prisma Decimal objects (they have toNumber() method or toString())
    let num: number;
    if (typeof value === 'number') {
        num = value;
    } else if (value && typeof value === 'object' && 'toNumber' in value && typeof (value as { toNumber: () => number }).toNumber === 'function') {
        // Prisma Decimal object
        num = (value as { toNumber: () => number }).toNumber();
    } else if (value !== null && value !== undefined) {
        // Try to convert string or other to number
        num = Number(String(value));
    } else {
        num = 0;
    }
    if (isNaN(num)) return '0';
    return new Intl.NumberFormat('vi-VN').format(num);
};

const formatNumber = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0';
    return new Intl.NumberFormat('vi-VN').format(value);
};

const _formatAddress = (street?: string, ward?: string, province?: string) => {
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
    const [searchQuery, setSearchQuery] = React.useState('');
    const [selectedCustomerId, setSelectedCustomerId] = React.useState<string | null>(null);
    // ⚡ Track if user has interacted with combobox
    const [hasInteracted, setHasInteracted] = React.useState(false);
    
    // ✅ Use Meilisearch for fast search (< 50ms) - shows 30 default results when empty
    // ✅ Infinite scroll support - load more on scroll
    // ⚡ OPTIMIZED: Only fetch when user interacts or types (lazy load)
    const {
        data: searchData,
        isLoading: isLoadingSearch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteMeiliCustomerSearch({ 
        query: searchQuery,
        debounceMs: 150,
        enabled: hasInteracted,
    });
    
    // ✅ Fetch full customer data when selected (for addresses, debt, etc.)
    const { data: fullCustomerData } = useCustomer(selectedCustomerId);
    
    // ✅ Search results from Meilisearch - flatten all pages
    const searchResults = React.useMemo(() => {
        return searchData?.pages.flatMap(page => page.data) || [];
    }, [searchData]);
    
    const { create: createCustomer } = useCustomerMutations({});

    // ✅ PHASE 2: Convert watch to useWatch
    const selectedCustomer = useWatch({ control, name: 'customer' });

    // ⚡ PERFORMANCE: Single stats API call instead of loading ALL orders/warranties/complaints
    const { data: customerStats } = useCustomerStats(selectedCustomer?.systemId);
    
    // ✅ Update form when full customer data is loaded
    React.useEffect(() => {
        if (fullCustomerData && selectedCustomerId) {
            // Guard against stale/cached data from a previous query
            if (fullCustomerData.systemId !== selectedCustomerId) return;
            setValue('customer', fullCustomerData, { shouldValidate: true, shouldDirty: true });
            
            // ✅ Auto-load default addresses when selecting customer
            if (fullCustomerData.addresses) {
                const defaultShipping = fullCustomerData.addresses.find(a => a.isDefaultShipping);
                const defaultBilling = fullCustomerData.addresses.find(a => a.isDefaultBilling);
                
                if (defaultShipping) {
                    setValue('shippingAddress', defaultShipping, { shouldDirty: true });
                }
                if (defaultBilling) {
                    setValue('billingAddress', defaultBilling, { shouldDirty: true });
                }
            }
            
            // ✅ Auto-set invoiceInfo from first business profile (if available)
            const profiles = (fullCustomerData as Customer & { businessProfiles?: BusinessProfile[] }).businessProfiles;
            if (Array.isArray(profiles) && profiles.length > 0) {
                const first = profiles[0];
                const addr = first.addressId && fullCustomerData.addresses
                    ? fullCustomerData.addresses.find(a => a.id === first.addressId)
                    : null;
                const addressParts = addr ? [addr.street, addr.ward, addr.district, addr.province].filter(Boolean) : [];
                const invoiceInfo: OrderInvoiceInfo = {
                    company: first.company,
                    taxCode: first.taxCode,
                    representative: first.representative,
                    position: first.position,
                    phone: first.phone,
                    email: first.email,
                    bankName: first.bankName,
                    bankAccount: first.bankAccount,
                    address: addressParts.join(', ') || undefined,
                };
                setValue('invoiceInfo', invoiceInfo, { shouldDirty: true });
            }
            // Clear after setting
            setSelectedCustomerId(null);
        }
    }, [fullCustomerData, selectedCustomerId, setValue]);
    
    // ✅ Convert search results to options for VirtualizedCombobox
    const customerOptions: ComboboxOption[] = React.useMemo(() => {
        return searchResults.map(c => {
            return {
                value: c.systemId,
                label: c.name,
                subtitle: `${c.phone || ''} • ${c.address || c.id}`,
                metadata: {
                    phone: c.phone,
                    address: c.address,
                    totalSpent: c.totalSpent
                }
            };
        });
    }, [searchResults]);

    const handleSelect = (option: ComboboxOption | null) => {
        if (option) {
            // ✅ Trigger fetch of full customer data
            setSelectedCustomerId(option.value);
            // Clear search after selection
            setSearchQuery('');
        } else {
            setValue('customer', null, { shouldValidate: true, shouldDirty: true });
            setValue('shippingAddress', null);
            setValue('billingAddress', null);
            setValue('invoiceInfo', null);
        }
    };

    const handleCopy = React.useCallback((value: string, label: string) => {
        if (!value) return;
        navigator.clipboard.writeText(value);
        toast.success(`Đã sao chép ${label}`);
    }, []);

    // ⚡ PERFORMANCE: Stats come from server-side aggregation — no client-side filtering needed

    const customerOrderStats = React.useMemo(() => {
        if (!selectedCustomer) {
            return {
                totalOrders: 0,
                totalSpent: 0,
                lastOrderDate: null as string | null,
            };
        }

        // ✅ ALWAYS use totalSpent from database - it's the source of truth
        const totalSpent = Number(selectedCustomer.totalSpent) || 0;

        return {
            totalOrders: customerStats.orders.total || (selectedCustomer.totalOrders ?? 0),
            totalSpent,
            lastOrderDate: customerStats.orders.lastOrderDate ?? selectedCustomer.lastPurchaseDate ?? null,
        };
    }, [selectedCustomer, customerStats]);

    // ✅ Lấy công nợ trực tiếp từ customer - đã được tính sẵn trong DB
    const customerDebtBalance = React.useMemo(() => {
        if (!selectedCustomer) return 0;
        return Number(selectedCustomer.currentDebt) || 0;
    }, [selectedCustomer]);

    // ⚡ Stats from server-side aggregation
    const customerWarrantyCount = customerStats.warranties.total;
    const activeWarrantyCount = customerStats.warranties.active;

    const customerComplaintCount = customerStats.complaints.total;
    const activeComplaintCount = customerStats.complaints.active;

    const orderBreakdown = React.useMemo(() => ({
        pending: customerStats.orders.pending,
        inProgress: customerStats.orders.inProgress,
        completed: customerStats.orders.completed,
        cancelled: customerStats.orders.cancelled,
    }), [customerStats]);

    const slaDisplay = React.useMemo(() => {
        // SLA removed - use comments instead
        return {
            title: 'Bình thường',
            detail: 'Xem bình luận để theo dõi',
            tone: 'secondary' as const,
        };
    }, []);

    // ✅ Customer group name resolved server-side in stats API
    const customerGroupName = customerStats.customerGroupName;

    const getEmployeeName = React.useCallback((id?: string) => {
        if (!id) return undefined;
        return undefined; // accountManagerName is used directly from customer data
    }, []);

    const customerBaseInfo = React.useMemo(() => {
        if (!selectedCustomer) return [];
        
        // Debug log to check actual values
        
        return [
            { label: 'Nhóm KH', value: customerGroupName || '---' },
            { label: 'NV phụ trách', value: selectedCustomer.accountManagerName || getEmployeeName(selectedCustomer.accountManagerId) || '---' },
            { label: 'Công nợ/Hạn mức', value: `${formatCurrency(customerDebtBalance)}/${formatCurrency(selectedCustomer.maxDebt)}`, tone: customerDebtBalance < 0 ? 'destructive' as const : undefined },
            { label: 'Tổng chi tiêu', value: formatCurrency(customerOrderStats.totalSpent) },
            { 
                label: 'Tổng số đơn đặt', 
                value: formatNumber(customerOrderStats.totalOrders),
                subValue: `${orderBreakdown.pending} đặt hàng, ${orderBreakdown.inProgress} đang giao dịch, ${orderBreakdown.completed} hoàn thành, ${orderBreakdown.cancelled} đã hủy`
            },
        ];
    }, [selectedCustomer, customerGroupName, getEmployeeName, customerDebtBalance, customerOrderStats.totalSpent, customerOrderStats.totalOrders, orderBreakdown]);

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
            label: 'Bảo hành (đã trả/tổng)',
            value: customerWarrantyCount > 0 ? `${customerWarrantyCount - activeWarrantyCount}/${customerWarrantyCount}` : '0',
            badge: activeWarrantyCount > 0 ? { label: `${activeWarrantyCount} chưa trả`, tone: 'warning' } : undefined,
            link: customerWarrantyCount > 0 ? `/warranty?customer=${encodeURIComponent(selectedCustomer.systemId)}` : undefined,
        });
        
        // Khiếu nại
        metrics.push({
            key: 'complaints',
            label: 'Khiếu nại (đã xử lý/tổng)',
            value: customerComplaintCount > 0 ? `${customerComplaintCount - activeComplaintCount}/${customerComplaintCount}` : '0',
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
        createCustomer.mutate({
            ...values,
            id: values.id,
        } as Omit<Customer, 'systemId'>); 
        setIsFormOpen(false); 
    };

    return (
        // FIX: Wrapped component in a React.Fragment to resolve a TypeScript error related to JSX element types when using dialogs and other components together.
        <React.Fragment>
            <Card className={`flex flex-col ${mobileBleedCardClass}`}>
                <CardHeader className="shrink-0 pb-3"><CardTitle>Thông tin khách hàng</CardTitle></CardHeader>
                <CardContent className="flex-1 md:overflow-y-auto space-y-3">
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
                                                {selectedCustomer.tags.slice(0, 3).map((tag: string, idx: number) => (
                                                    <Badge key={idx} variant="secondary" className="text-xs px-1.5 py-0">{tag}</Badge>
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
                                                className="inline-flex items-center gap-1 hover:text-foreground truncate max-w-45"
                                                title="Sao chép email"
                                            >
                                                <span className="truncate">{selectedCustomer.email}</span>
                                                <Copy className="h-3 w-3 shrink-0" />
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
                                    <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" type="button" onClick={() => handleSelect(null)}>
                                        <X className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                )}
                            </div>

                            {/* Địa chỉ giao hàng & hóa đơn */}
                            <CustomerAddressSelector customer={selectedCustomer} disabled={disabled} />

                            {/* Thông tin bổ sung: dl grid 2 cột chuẩn mobile-first */}
                            {(customerBaseInfo.length > 0 || customerMetrics.length > 0) && (
                                <dl className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-sm border-t pt-3">
                                    {customerBaseInfo.map(row => (
                                        <div key={row.label} className="min-w-0">
                                            <dt className="text-xs text-muted-foreground">{row.label}</dt>
                                            <dd className={`mt-0.5 font-medium wrap-break-word ${row.tone ? getToneClass(row.tone) : 'text-foreground'}`}>
                                                {row.value}
                                                {row.subValue && (
                                                    <span className="mt-0.5 block text-[11px] font-normal text-muted-foreground wrap-break-word">
                                                        {row.subValue}
                                                    </span>
                                                )}
                                            </dd>
                                        </div>
                                    ))}
                                    {customerMetrics.map(metric => {
                                        const valueNode = (
                                            <span className="inline-flex flex-wrap items-center gap-1">
                                                <span className={`font-medium wrap-break-word ${metric.tone ? getToneClass(metric.tone) : 'text-foreground'}`}>
                                                    {metric.value}
                                                </span>
                                                {metric.badge && (
                                                    <Badge
                                                        variant="secondary"
                                                        className={`text-[11px] px-1 py-0 ${getBadgeToneClass(metric.badge.tone)}`}
                                                    >
                                                        {metric.badge.label}
                                                    </Badge>
                                                )}
                                            </span>
                                        );
                                        return (
                                            <div key={metric.key} className="min-w-0">
                                                <dt className="text-xs text-muted-foreground">{metric.label}</dt>
                                                <dd className="mt-0.5 wrap-break-word">
                                                    {metric.link ? (
                                                        <Link href={metric.link} className="inline-flex flex-wrap items-center gap-1 hover:underline">
                                                            {valueNode}
                                                        </Link>
                                                    ) : (
                                                        valueNode
                                                    )}
                                                    {metric.subValue && (
                                                        <span className="mt-0.5 block text-[11px] font-normal text-muted-foreground wrap-break-word">
                                                            {metric.subValue}
                                                        </span>
                                                    )}
                                                </dd>
                                            </div>
                                        );
                                    })}
                                </dl>
                            )}
                        </div>
                    ) : (
                        <>
                            <VirtualizedCombobox
                              options={customerOptions}
                              value={null}
                              onChange={(option) => handleSelect(option)}
                              onSearchChange={setSearchQuery}
                              onOpenChange={(open) => { if (open) setHasInteracted(true); }}
                              isLoading={isLoadingSearch}
                              placeholder="Tìm theo tên, SĐT, mã khách hàng... (F4)"
                              searchPlaceholder="Tìm kiếm..."
                              emptyPlaceholder={hasInteracted ? "Không tìm thấy khách hàng." : "Nhập để tìm kiếm..."}
                              disabled={disabled}
                              onLoadMore={() => fetchNextPage()}
                              hasMore={hasNextPage}
                              isLoadingMore={isFetchingNextPage}
                              renderHeader={() => (
                                <div className="p-1 border-b border-border">
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
                                    <div className="text-xs text-destructive font-semibold shrink-0">
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
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}><DialogContent mobileFullScreen className="sm:max-w-3xl"><DialogHeader><DialogTitle>Thêm khách hàng mới</DialogTitle></DialogHeader><CustomerForm initialData={null} onSubmit={handleFormSubmit} onCancel={() => setIsFormOpen(false)} /></DialogContent></Dialog>
        </React.Fragment>
    );
}
