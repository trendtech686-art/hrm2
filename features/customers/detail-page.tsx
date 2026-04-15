'use client'

import * as React from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useParams } from 'next/navigation';
import { formatDate as formatDateUtil, getCurrentDate, getDaysDiff } from '@/lib/date-utils';
import { asSystemId, type SystemId } from '@/lib/id-types';
import { generateSubEntityId } from '@/lib/id-utils';
import { useCustomer, useCustomerMutations } from './hooks/use-customers';
import type { Customer } from '@/lib/types/prisma-extended';
import { 
  useCustomerOrdersPaginated, 
  useCustomerSalesReturnsPaginated,
  useCustomerWarrantiesPaginated, 
  useCustomerComplaintsPaginated,
  useCustomerProductsPaginated,
  useCustomerDebtPaginated,
} from './hooks/use-customer-related-data';
import { useCustomerStats as useCustomerProfileStats } from './hooks/use-customer-stats';

import { useAllCustomerSettings } from '../settings/customers/hooks/use-customer-settings';
import { usePageHeader } from '../../contexts/page-header-context';
import { useBreakpoint } from '../../contexts/breakpoint-context';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
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
import { ArrowLeft, Edit, Trash2, Phone, Mail, ExternalLink, Copy, Plus, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { ReceiptForm, type ReceiptFormValues } from '../receipts/receipt-form';
import { PaymentForm, type PaymentFormValues } from '../payments/payment-form';
import { useReceiptMutations } from '../receipts/hooks/use-receipts';
import { usePaymentMutations } from '../payments/hooks/use-payments';
import type { ReceiptInput } from '../receipts/types';
import type { Payment } from '../payments/types';
import { asBusinessId } from '@/lib/id-types';
import { Badge } from '../../components/ui/badge';
import { Skeleton } from '../../components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { RelatedDataTable } from '../../components/data-table/related-data-table';
import { ProgressiveImage } from '../../components/ui/progressive-image';
import { CopyableText } from '../../components/shared/copy-button';

import { sanitizeToText } from '@/lib/sanitize';
import { useProductFinder } from '../products/hooks/use-all-products';
import { useAllPricingPolicies } from '../settings/pricing/hooks/use-all-pricing-policies';
import { calculateDaysRemaining } from '../warranty/utils/warranty-checker';
import type { OrderMainStatus } from '../orders/types';
import type { ColumnDef } from '../../components/data-table/types';
import type { WarrantyTicket } from '../warranty/types';
import { useComments } from '@/hooks/use-comments';
// ✅ Heavy components - lazy loaded
const Comments = dynamic(
  () => import('../../components/Comments').then(m => ({ default: m.Comments })),
  { ssr: false }
);
const EntityActivityTable = dynamic(
  () => import('@/components/shared/entity-activity-table').then(m => ({ default: m.EntityActivityTable })),
  { ssr: false }
);
import { useAuth } from '../../contexts/auth-context';
// Import extracted components from detail/
import {
  formatCurrency,
  productColumns,
  warrantyColumns,
  complaintColumns,
  debtColumns,
  createOrderColumnsWithReturns,
  addressColumns,
  salesReturnColumns,
  type DrilldownSearch,
  type OrderWithReturns,
  type ComplaintRow,
  type AddressRow,
} from './detail';

// Simple detail item component - no icons for cleaner look
const DetailItem = ({ label, value, onClick, className = '' }: { 
  label: string; 
  value?: React.ReactNode; 
  onClick?: (() => void) | undefined;
  className?: string;
}) => (
  <div className={`space-y-1 ${className}`}>
    <dt className="text-sm text-muted-foreground">{label}</dt>
    <dd 
      className={`text-sm font-medium ${onClick ? 'text-primary hover:underline cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {value !== null && value !== undefined && value !== '' ? value : '—'}
    </dd>
  </div>
);

const customerStatusVariants: Partial<Record<Customer["status"], "default" | "secondary" | "destructive">> = {
  "Đang giao dịch": "default",
  "Ngừng Giao Dịch": "secondary",
  active: "default",
  inactive: "secondary",
  ACTIVE: "default",
  INACTIVE: "secondary",
};

const customerStatusLabels: Partial<Record<Customer["status"], string>> = {
  ACTIVE: "Đang giao dịch",
  INACTIVE: "Ngừng Giao Dịch",
  active: "Đang giao dịch",
  inactive: "Ngừng Giao Dịch",
};

const _renderCustomerStatusBadge = (status?: Customer["status"]) => {
  if (!status) return undefined;
  return (
    <Badge variant={customerStatusVariants[status] ?? "secondary"}>
      {customerStatusLabels[status] ?? status}
    </Badge>
  );
};


export function CustomerDetailPage() {
  const { systemId } = useParams<{ systemId: string }>();
  const router = useRouter();
  
  // React Query hooks
  const { data: customer, isLoading } = useCustomer(systemId);
  const { update, remove } = useCustomerMutations({
    onDeleteSuccess: () => {
      toast.success(`Đã chuyển khách hàng vào thùng rác`);
      router.push('/customers');
    },
  });
  
  const [activeTab, setActiveTab] = React.useState('info');
  const [visitedTabs, setVisitedTabs] = React.useState<Set<string>>(() => new Set(['info']));
  const handleTabChange = React.useCallback((tab: string) => {
    setActiveTab(tab);
    setVisitedTabs(prev => {
      if (prev.has(tab)) return prev;
      const next = new Set(prev);
      next.add(tab);
      return next;
    });
  }, []);
  const [orderDrilldownSearch, setOrderDrilldownSearch] = React.useState<DrilldownSearch | null>(null);
  const [warrantyDrilldownSearch, setWarrantyDrilldownSearch] = React.useState<DrilldownSearch | null>(null);
  const [complaintDrilldownSearch, setComplaintDrilldownSearch] = React.useState<DrilldownSearch | null>(null);

  // ⚡ Server-side stats: single API call for stats cards (orders, warranty, complaint counts, debt)
  const { data: customerStats, isLoaded: customerStatsLoaded } = useCustomerProfileStats(systemId);

  // ⚡ Server-side paginated data - lazy loaded when respective tabs are visited
  const ordersResult = useCustomerOrdersPaginated(systemId, { enabled: visitedTabs.has('purchase-history') });
  const salesReturnsResult = useCustomerSalesReturnsPaginated(systemId, { enabled: visitedTabs.has('sales-returns') });
  const warrantiesResult = useCustomerWarrantiesPaginated(systemId, { enabled: visitedTabs.has('warranty') });
  const complaintsResult = useCustomerComplaintsPaginated(systemId, { enabled: visitedTabs.has('complaints') });
  const productsResult = useCustomerProductsPaginated(systemId, { enabled: visitedTabs.has('products') });
  const debtResult = useCustomerDebtPaginated(systemId, customer?.name, { enabled: visitedTabs.has('debt') });

  const { data: pricingPolicies } = useAllPricingPolicies();

  const { employee: authEmployee, can, isAdmin } = useAuth();
  const { isMobile } = useBreakpoint();

  // Comments from database
  const { 
    comments: dbComments, 
    addComment: dbAddComment, 
    deleteComment: dbDeleteComment 
  } = useComments('customer', systemId || '');

  const comments = React.useMemo(() => 
    dbComments.map(c => ({
      id: c.systemId as unknown as SystemId,
      content: c.content,
      author: {
        systemId: (c.createdBy || 'system') as unknown as SystemId,
        name: c.createdByName || 'Hệ thống',
      },
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      attachments: c.attachments,
    })), 
    [dbComments]
  );

  const handleAddComment = React.useCallback((content: string, attachments?: string[], _parentId?: string) => {
    dbAddComment(content, attachments || []);
  }, [dbAddComment]);

  const handleUpdateComment = React.useCallback((_commentId: string, _content: string) => {
  }, []);

  const handleDeleteComment = React.useCallback((commentId: string) => {
    dbDeleteComment(commentId);
  }, [dbDeleteComment]);

  const commentCurrentUser = React.useMemo(() => ({
    systemId: authEmployee?.systemId ? asSystemId(authEmployee.systemId) : asSystemId('system'),
    name: authEmployee?.fullName || 'Hệ thống',
  }), [authEmployee]);

  const focusTab = React.useCallback((tab: string, scrollToSection = false) => {
    handleTabChange(tab);
    if (!scrollToSection || typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') {
      return;
    }

    window.requestAnimationFrame(() => {
      if (typeof document === 'undefined') return;
      const anchor = document.getElementById(`customer-tab-${tab}`);
      if (anchor) {
        anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }, [handleTabChange]);

  const buildDrilldownSearch = React.useCallback((query: string): DrilldownSearch => ({
    query,
    token: generateSubEntityId('token'),
  }), []);

  const handleOrderSearchApplied = React.useCallback(() => setOrderDrilldownSearch(null), []);
  const handleWarrantySearchApplied = React.useCallback(() => setWarrantyDrilldownSearch(null), []);
  const handleComplaintSearchApplied = React.useCallback(() => setComplaintDrilldownSearch(null), []);
  const handleOrderStatusFilter = React.useCallback((status?: OrderMainStatus | 'failed') => {
    focusTab('purchase-history', true);
    if (!status) return;
    if (status === 'failed') {
      setOrderDrilldownSearch(buildDrilldownSearch('Chờ giao lại'));
      return;
    }
    setOrderDrilldownSearch(buildDrilldownSearch(status));
  }, [focusTab, buildDrilldownSearch]);
  const handleDebtCardClick = React.useCallback(() => focusTab('debt', true), [focusTab]);
  const handleWarrantyCardClick = React.useCallback((filterActive?: boolean) => {
    focusTab('warranty', true);
    if (filterActive) {
      setWarrantyDrilldownSearch(buildDrilldownSearch('pending'));
    }
  }, [focusTab, buildDrilldownSearch]);
  const handleComplaintCardClick = React.useCallback((filterActive?: boolean) => {
    focusTab('complaints', true);
    if (filterActive) {
      setComplaintDrilldownSearch(buildDrilldownSearch('pending'));
    }
  }, [focusTab, buildDrilldownSearch]);
  
  // Settings data from React Query (single consolidated API call)
  const { data: allSettingsData } = useAllCustomerSettings();

  // Helper type for settings data that could be array or object with data property
  type SettingsDataResult<T> = T[] | { data: T[] } | undefined;
  const extractData = React.useCallback(<T,>(data: SettingsDataResult<T>): T[] => 
    Array.isArray(data) ? data : (data as { data: T[] } | undefined)?.data ?? [], []);
    
  const customerTypes = React.useMemo(() => extractData(allSettingsData?.types), [extractData, allSettingsData?.types]);
  const customerGroups = React.useMemo(() => extractData(allSettingsData?.groups), [extractData, allSettingsData?.groups]);
  const customerSources = React.useMemo(() => extractData(allSettingsData?.sources), [extractData, allSettingsData?.sources]);
  const paymentTerms = React.useMemo(() => extractData(allSettingsData?.paymentTerms), [extractData, allSettingsData?.paymentTerms]);
  const creditRatings = React.useMemo(() => extractData(allSettingsData?.creditRatings), [extractData, allSettingsData?.creditRatings]);

  // Lookup names (match by both systemId and business id since form stores business id)
  const getTypeName = React.useCallback((id?: string) => id ? customerTypes.find(t => t.systemId === id || t.id === id)?.name : undefined, [customerTypes]);
  const getGroupName = React.useCallback((id?: string) => id ? customerGroups.find(g => g.systemId === id || g.id === id)?.name : undefined, [customerGroups]);
  const getSourceName = React.useCallback((id?: string) => id ? customerSources.find(s => s.systemId === id || s.id === id)?.name : undefined, [customerSources]);
  const getPaymentTermName = React.useCallback((id?: string) => id ? paymentTerms.find(p => p.systemId === id || p.id === id)?.name : undefined, [paymentTerms]);
  const getCreditRatingName = React.useCallback((id?: string) => id ? creditRatings.find(c => c.systemId === id || c.id === id)?.name : undefined, [creditRatings]);

  // ⚡ Data from paginated API — use result.data for tables
  const customerOrders = ordersResult.data;
  
  // Sales returns from paginated API
  const customerSalesReturns = salesReturnsResult.data;
  
  // Combine orders with their return info (for display only)
  const customerOrdersWithReturns = React.useMemo<OrderWithReturns[]>(() => {
    return customerOrders.map(order => {
      const returnsForOrder = customerSalesReturns.filter(sr => sr.orderSystemId === order.systemId);
      const totalReturnValue = returnsForOrder.reduce((sum, sr) => sum + sr.totalReturnValue, 0);
      return {
        ...order,
        returnCount: returnsForOrder.length,
        totalReturnValue,
        returnIds: returnsForOrder.map(sr => sr.id),
      };
    });
  }, [customerOrders, customerSalesReturns]);
  
  // Dynamic columns with return info - use extracted function from types
  const orderColumnsWithReturns = React.useMemo<ColumnDef<OrderWithReturns>[]>(() => createOrderColumnsWithReturns(), []);
  
  // Orders that create debt: status='Hoàn thành' OR deliveryStatus='Đã giao hàng' OR stockOutStatus='Xuất kho toàn bộ'
  const deliveredCustomerOrders = React.useMemo(
    () => customerOrders.filter(order => 
      order.status !== 'Đã hủy' &&
      (order.status === 'Hoàn thành' || 
       order.deliveryStatus === 'Đã giao hàng' || 
       order.stockOutStatus === 'Xuất kho toàn bộ')
    ),
    [customerOrders]
  );
  const failedDeliveryOrders = React.useMemo(
    () => customerOrders.filter(order => order.deliveryStatus === 'Chờ giao lại'),
    [customerOrders]
  );
  const _orderStatusBreakdown = React.useMemo(() => {
    return customerOrders.reduce(
      (acc, order) => {
        if (order.status === 'Hoàn thành') acc.hoanThanh += 1;
        else if (order.status === 'Đang giao dịch') acc.dangGiaoDich += 1;
        else if (order.status === 'Đặt hàng') acc.datHang += 1;
        else if (order.status === 'Đã hủy') acc.daHuy += 1;
        return acc;
      },
      { dangGiaoDich: 0, hoanThanh: 0, datHang: 0, daHuy: 0 }
    );
  }, [customerOrders]);
  
  // Warranty tickets from paginated API
  const customerWarrantyTickets = warrantiesResult.data as WarrantyTicket[];
  const _customerWarrantyCount = warrantiesResult.pagination.total;
  const _activeWarrantyCount = React.useMemo(
    () => customerWarrantyTickets.filter(ticket => !['returned', 'completed', 'cancelled'].includes(ticket.status)).length,
    [customerWarrantyTickets]
  );
  
  // ⚡ Complaints from paginated API
  const customerComplaints = complaintsResult.data;
  const _customerComplaintCount = complaintsResult.pagination.total;
  const _activeComplaintCount = React.useMemo(
    () => customerComplaints.filter(complaint => complaint.status === 'pending' || complaint.status === 'investigating').length,
    [customerComplaints]
  );

  // ============================================
  // Get products store for warranty info
  const { findById: _findProductById } = useProductFinder();

  // ⚡ Products from server-side paginated API with computed daysRemaining
  const purchasedProducts = React.useMemo(() => {
    return productsResult.data.map(item => ({
      ...item,
      daysRemaining: item.warrantyExpiry ? calculateDaysRemaining(item.warrantyExpiry) : 0,
    }));
  }, [productsResult.data]);

  // ⚡ Lazy: only compute when addresses tab is active
  const addressTableData: AddressRow[] = React.useMemo(() => {
    if (!customer || activeTab !== 'addresses') return [];
    return (customer.addresses || []).map((addr) => ({
      id: addr.id,
      systemId: addr.id,
      street: addr.street,
      province: addr.province,
      district: addr.district,
      ward: addr.ward,
      inputLevel: addr.inputLevel,
      contactName: addr.contactName,
      contactPhone: addr.contactPhone,
      isDefaultShipping: addr.isDefaultShipping,
    }));
  }, [customer, activeTab]);
  
  // ⚡ Debt transactions from server-side paginated API
  const customerDebtTransactions = debtResult.data;

  // ⚡ Lazy: only compute when warranty tab is active
  const warrantyTableData = React.useMemo(() => {
    if (activeTab !== 'warranty') return [] as WarrantyTicket[];
    return [...customerWarrantyTickets].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [activeTab, customerWarrantyTickets]);

  // ⚡ Lazy: only compute when complaints tab is active
  const complaintTableData = React.useMemo<ComplaintRow[]>(() => {
    if (activeTab !== 'complaints') return [];
    return customerComplaints
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map(complaint => ({
        ...complaint,
        assignedName: complaint.assignedTo ? ((complaint as unknown as Record<string, unknown>).assignedToName as string || complaint.assignedTo) : '',
      }));
  }, [activeTab, customerComplaints]);

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [receiptDialogOpen, setReceiptDialogOpen] = React.useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = React.useState(false);
  const receiptFormRef = React.useRef<HTMLFormElement>(null);
  const paymentFormRef = React.useRef<HTMLFormElement>(null);

  const { create: createReceipt } = useReceiptMutations({
    onCreateSuccess: () => {
      toast.success("Tạo phiếu thu thành công");
      setReceiptDialogOpen(false);
    },
    onError: (error) => toast.error(error.message || "Tạo phiếu thu thất bại"),
  });

  const { create: createPayment } = usePaymentMutations({
    onCreateSuccess: () => {
      toast.success("Tạo phiếu chi thành công");
      setPaymentDialogOpen(false);
    },
    onError: (error) => toast.error(error.message || "Tạo phiếu chi thất bại"),
  });

  const handleReceiptSubmit = React.useCallback((values: ReceiptFormValues) => {
    const name = values.payerTypeName?.toLowerCase() || '';
    const category = name.includes('khách hàng') || name.includes('customer') ? 'sale' as const : 'other' as const;
    const { id, payerTypeSystemId, payerSystemId, paymentMethodSystemId, accountSystemId, paymentReceiptTypeSystemId, branchSystemId, ...rest } = values;
    createReceipt.mutate({
      ...rest,
      ...(id ? { id: asBusinessId(id) } : {}),
      payerTypeSystemId: asSystemId(payerTypeSystemId),
      payerSystemId: payerSystemId ? asSystemId(payerSystemId) : undefined,
      paymentMethodSystemId: asSystemId(paymentMethodSystemId),
      accountSystemId: asSystemId(accountSystemId),
      paymentReceiptTypeSystemId: asSystemId(paymentReceiptTypeSystemId),
      branchSystemId: asSystemId(branchSystemId),
      createdBy: authEmployee?.systemId ?? asSystemId('SYSTEM'),
      category,
      createdAt: new Date().toISOString(),
    } as ReceiptInput);
  }, [createReceipt, authEmployee]);

  const handlePaymentSubmit = React.useCallback((values: PaymentFormValues) => {
    const name = values.recipientTypeName?.toLowerCase() || '';
    let category: string = 'other';
    if (name.includes('khách hàng') || name.includes('customer')) category = 'customer_payment';
    else if (name.includes('nhà cung cấp') || name.includes('supplier')) category = 'supplier_payment';
    createPayment.mutate({
      ...values,
      category,
      branchId: values.branchSystemId,
      createdBy: authEmployee?.systemId ?? asSystemId('SYSTEM'),
      createdAt: new Date().toISOString(),
    } as Omit<Payment, 'systemId' | 'id' | 'createdAt' | 'updatedAt'>);
  }, [createPayment, authEmployee]);
  
  const handleDeleteCustomer = React.useCallback(() => {
    if (customer) {
      remove.mutate(customer.systemId);
    }
  }, [customer, remove]);

  const headerActions = React.useMemo(() => {
    const actions: React.ReactNode[] = [];
    if (isAdmin || can('edit_customers')) {
      actions.push(
        <Button key="receipt" variant="outline" size="sm" className="h-9" onClick={() => setReceiptDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo phiếu thu
        </Button>,
        <Button key="payment" variant="outline" size="sm" className="h-9" onClick={() => setPaymentDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo phiếu chi
        </Button>,
        <Button key="delete" variant="outline" size="sm" className="h-9 text-destructive hover:text-destructive" onClick={() => setDeleteDialogOpen(true)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Chuyển vào thùng rác
        </Button>,
        <Button key="edit" size="sm" className="h-9" onClick={() => router.push(`/customers/${systemId}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Chỉnh sửa
        </Button>
      );
    }
    return actions;
  }, [router, systemId, isAdmin, can]);

  const mobileHeaderActions = React.useMemo(() => {
    if (!isMobile || !(isAdmin || can('edit_customers'))) return [];
    return [
      <DropdownMenu key="mobile-actions">
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-9">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setReceiptDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo phiếu thu
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setPaymentDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo phiếu chi
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Chuyển vào thùng rác
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push(`/customers/${systemId}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    ];
  }, [isMobile, router, systemId, isAdmin, can]);

  // Build header badges
  const headerBadges = React.useMemo(() => {
    const badges: React.ReactNode[] = [];
    
    // Customer status badge
    if (customer?.status) {
      badges.push(
        <Badge key="status" variant={customerStatusVariants[customer.status] ?? "secondary"}>
          {customerStatusLabels[customer.status] ?? customer.status}
        </Badge>
      );
    }
    
    return badges.length > 0 ? (
      <div className="flex items-center gap-2 flex-wrap">
        {badges}
      </div>
    ) : undefined;
  }, [customer?.status]);

  usePageHeader({
    title: customer?.name || 'Chi tiết Khách hàng',
    subtitle: customer?.tags?.length ? customer.tags.join(', ') : undefined,
    badge: headerBadges,
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Khách hàng', href: '/customers', isCurrent: false },
      { label: customer?.name || 'Chi tiết', href: '', isCurrent: true },
    ],
    actions: isMobile ? mobileHeaderActions : headerActions,
  });

  // All hooks must be called before any early returns (React hooks rules)
  // Tính tổng giá trị hàng đã trả
  const totalReturnedValue = React.useMemo(
    () => customerSalesReturns.reduce((sum, sr) => sum + sr.totalReturnValue, 0),
    [customerSalesReturns]
  );

  // Chi tiêu = Tổng đơn hàng - Giá trị hàng trả
  const totalSpent = React.useMemo(
    () => deliveredCustomerOrders.reduce((sum, order) => sum + (order.grandTotal || 0), 0) - totalReturnedValue,
    [deliveredCustomerOrders, totalReturnedValue]
  );

  // ⚡ Current debt from server-side computation
  const currentDebt = debtResult.summary.currentDebt;

  // Sync DB currentDebt immediately if it differs from live calculation
  // Uses stats API (always loaded) as source of truth for server-computed debt
  React.useEffect(() => {
    if (!customer || !customerStatsLoaded) return;
    const dbDebt = Number(customer.currentDebt) || 0;
    const calculatedDebt = customerStats.financial.currentDebt;
    if (Math.abs(dbDebt - calculatedDebt) > 0.01) {
      update.mutate({ systemId: customer.systemId, currentDebt: calculatedDebt } as Partial<Customer> & { systemId: string });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerStatsLoaded, customerStats?.financial.currentDebt, customer?.systemId, customer?.currentDebt]);

  const unresolvedFailedDeliveries = failedDeliveryOrders.length;
  const totalFailedDeliveries = React.useMemo(
    () => (customer?.failedDeliveries ?? unresolvedFailedDeliveries),
    [customer?.failedDeliveries, unresolvedFailedDeliveries]
  );

  // ✅ Compute purchase statistics from live order/return data
  const computedTotalQuantityPurchased = React.useMemo(
    () => deliveredCustomerOrders.reduce(
      (sum, order) => sum + (order.lineItems?.reduce((s, li) => s + (li.quantity || 0), 0) || 0), 0
    ),
    [deliveredCustomerOrders]
  );
  const computedTotalQuantityReturned = React.useMemo(
    () => customerSalesReturns.reduce(
      (sum, sr) => sum + (sr.items?.reduce((s, item) => s + (item.returnQuantity || 0), 0) || 0), 0
    ),
    [customerSalesReturns]
  );
  const computedLastPurchaseDate = React.useMemo(() => {
    if (deliveredCustomerOrders.length === 0) return undefined;
    const sorted = [...deliveredCustomerOrders].sort((a, b) =>
      new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    );
    return sorted[0]?.orderDate;
  }, [deliveredCustomerOrders]);

  // ============================================
  // REALTIME Customer Intelligence Calculations
  // Use live computed values from orders instead of stale DB fields
  // ============================================
  const liveCustomer = React.useMemo(() => {
    if (!customer) return customer;
    return {
      ...customer,
      totalOrders: customerOrders.length,
      totalSpent: totalSpent,
      lastPurchaseDate: computedLastPurchaseDate || customer.lastPurchaseDate,
    };
  }, [customer, customerOrders.length, totalSpent, computedLastPurchaseDate]);

  const daysSinceLastPurchase = React.useMemo(() => {
    const lastDate = computedLastPurchaseDate || customer?.lastPurchaseDate;
    if (!lastDate) return null;
    return getDaysDiff(getCurrentDate(), new Date(lastDate));
  }, [computedLastPurchaseDate, customer?.lastPurchaseDate]);

  // Early return after all hooks have been called
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-2/3" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Không tìm thấy khách hàng</h2>
          <Button onClick={() => router.push('/customers')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay về danh sách
          </Button>
        </div>
      </div>
    );
  }

  // DEBUG: Check if values are calculated
  // 
  return (
    <>
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Chuyển vào thùng rác</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn chuyển khách hàng <strong>{customer.name}</strong> ({customer.id}) vào thùng rác?
              Bạn có thể khôi phục lại sau trong mục Thùng rác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCustomer} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Chuyển vào thùng rác
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Receipt Create Dialog */}
      <Dialog open={receiptDialogOpen} onOpenChange={setReceiptDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo phiếu thu - {customer.name}</DialogTitle>
          </DialogHeader>
          <ReceiptForm
            ref={receiptFormRef}
            initialData={null}
            onSubmit={handleReceiptSubmit}
            defaultPayer={{
              systemId: customer.systemId,
              name: customer.name,
              typeId: 'KHACHHANG',
            }}
            defaultAmount={(() => {
              const debt = customerStats?.financial.currentDebt || Number(customer.currentDebt) || 0;
              return debt > 0 ? debt : undefined;
            })()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setReceiptDialogOpen(false)}>Hủy</Button>
            <Button onClick={() => receiptFormRef.current?.requestSubmit()}>Lưu phiếu thu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Create Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tạo phiếu chi - {customer.name}</DialogTitle>
          </DialogHeader>
          <PaymentForm
            ref={paymentFormRef}
            initialData={null}
            onSubmit={handlePaymentSubmit}
            defaultRecipient={{
              systemId: customer.systemId,
              name: customer.name,
              typeId: 'KHACHHANG',
            }}
            defaultAmount={(() => {
              const debt = customerStats?.financial.currentDebt || Number(customer.currentDebt) || 0;
              return debt < 0 ? Math.abs(debt) : undefined;
            })()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>Hủy</Button>
            <Button onClick={() => paymentFormRef.current?.requestSubmit()}>Lưu phiếu chi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="w-full h-full">
        <div className="space-y-6">
          {/* Stats Summary - Always from stats API */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {/* Tổng chi tiêu */}
            <Card
              role="button"
              tabIndex={0}
              onClick={() => handleOrderStatusFilter('Hoàn thành')}
              className="cursor-pointer transition hover:border-primary/50"
            >
              <CardContent className="p-3">
                <div className="text-xs text-muted-foreground">Chi tiêu</div>
                <div className="text-base font-bold">{formatCurrency(customerStats.financial.totalSpent)}</div>
              </CardContent>
            </Card>

            {/* Đơn hàng */}
            <Card
              role="button"
              tabIndex={0}
              onClick={() => handleOrderStatusFilter()}
              className="cursor-pointer transition hover:border-primary/50"
            >
              <CardContent className="p-3">
                <div className="text-xs text-muted-foreground">Đơn hàng</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-bold">{customerStats.orders.total}</span>
                  {customerStats.orders.completed > 0 && (
                    <span className="text-xs text-green-600">Hoàn thành: {customerStats.orders.completed}</span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Công nợ */}
            <Card
              role="button"
              tabIndex={0}
              onClick={handleDebtCardClick}
              className="cursor-pointer transition hover:border-primary/50"
            >
              <CardContent className="p-3">
                <div className="text-xs text-muted-foreground">Công nợ</div>
                <div className="text-base font-bold">{formatCurrency(customerStats.financial.currentDebt)}</div>
              </CardContent>
            </Card>

            {/* Bảo hành */}
            <Card
              role="button"
              tabIndex={0}
              onClick={() => handleWarrantyCardClick(false)}
              className="cursor-pointer transition hover:border-primary/50"
            >
              <CardContent className="p-3">
                <div className="text-xs text-muted-foreground">Bảo hành</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-bold">{customerStats.warranties.total}</span>
                  {customerStats.warranties.active > 0 && (
                    <span className="text-xs text-orange-600">Chưa xử lý: {customerStats.warranties.active}</span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Khiếu nại */}
            <Card
              role="button"
              tabIndex={0}
              onClick={() => handleComplaintCardClick(false)}
              className="cursor-pointer transition hover:border-primary/50"
            >
              <CardContent className="p-3">
                <div className="text-xs text-muted-foreground">Khiếu nại</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-bold">{customerStats.complaints.total}</span>
                  {customerStats.complaints.active > 0 && (
                    <span className="text-xs text-red-600">Đang xử lý: {customerStats.complaints.active}</span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Giao hàng thất bại */}
            <Card
              role="button"
              tabIndex={0}
              onClick={() => handleOrderStatusFilter('failed')}
              className="cursor-pointer transition hover:border-primary/50"
            >
              <CardContent className="p-3">
                <div className="text-xs text-muted-foreground">GH lỗi</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-bold">{totalFailedDeliveries}</span>
                  {unresolvedFailedDeliveries > 0 && (
                    <span className="text-xs text-orange-600">chờ giao lại: {unresolvedFailedDeliveries}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="inline-flex w-auto gap-1 p-1 h-auto justify-start overflow-x-auto">
            <TabsTrigger value="info" className="shrink-0 px-3 h-10 text-sm font-normal whitespace-nowrap">Thông tin</TabsTrigger>
            <TabsTrigger value="business" className="shrink-0 px-3 h-10 text-sm font-normal whitespace-nowrap">Doanh nghiệp</TabsTrigger>
            <TabsTrigger value="payment" className="shrink-0 px-3 h-10 text-sm font-normal whitespace-nowrap">Thanh toán</TabsTrigger>
            <TabsTrigger value="purchase-history" className="shrink-0 px-3 h-10 text-sm font-normal whitespace-nowrap">Đơn hàng</TabsTrigger>
            <TabsTrigger value="sales-returns" className="shrink-0 px-3 h-10 text-sm font-normal whitespace-nowrap">Đơn hàng trả</TabsTrigger>
            <TabsTrigger value="debt" className="shrink-0 px-3 h-10 text-sm font-normal whitespace-nowrap">Công nợ</TabsTrigger>
            <TabsTrigger value="contacts" className="shrink-0 px-3 h-10 text-sm font-normal whitespace-nowrap">Liên hệ</TabsTrigger>
            <TabsTrigger value="addresses" className="shrink-0 px-3 h-10 text-sm font-normal whitespace-nowrap">Địa chỉ</TabsTrigger>
            <TabsTrigger value="products" className="shrink-0 px-3 h-10 text-sm font-normal whitespace-nowrap">Sản phẩm</TabsTrigger>
            <TabsTrigger value="warranty" className="shrink-0 px-3 h-10 text-sm font-normal whitespace-nowrap">Bảo hành</TabsTrigger>
            <TabsTrigger value="complaints" className="shrink-0 px-3 h-10 text-sm font-normal whitespace-nowrap">Khiếu nại</TabsTrigger>
          </TabsList>

          {/* Tab: Thông tin chung */}
          <TabsContent value="info" id="customer-tab-info" className="space-y-6 mt-6">
            {/* Images Section */}
            {customer.images && customer.images.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle size="sm" className="font-medium">Hình ảnh</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {customer.images.map((url, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden border bg-muted cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(url, '_blank')}
                      >
                        <ProgressiveImage
                          src={url}
                          alt={`${customer.name} - ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {index === 0 && (
                          <Badge className="absolute top-1.5 left-1.5 text-xs" variant="secondary">
                            Chính
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Thông tin cơ bản - Grid layout clean với icon copy */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle size="sm" className="font-medium">Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
                  <CopyableText label="Mã khách hàng" value={customer.id} />
                  <CopyableText label="Tên khách hàng" value={customer.name} />
                  <CopyableText label="Số điện thoại" value={customer.phone} />
                  <CopyableText label="Zalo" value={customer.zaloPhone} />
                  
                  {/* Tỷ lệ công nợ/Hạn mức */}
                  {customer.maxDebt && customer.maxDebt > 0 && (
                    <div className="space-y-1">
                      <dt className="text-sm text-muted-foreground">Tỷ lệ công nợ/Hạn mức</dt>
                      <dd>
                        {(() => {
                          const debtRatio = ((customerStats.financial.currentDebt || 0) / customer.maxDebt) * 100;
                          const variant = debtRatio >= 90 ? 'destructive' : debtRatio >= 70 ? 'warning' : 'success';
                          return (
                            <>
                              <span className={`text-h4 font-bold ${variant === 'destructive' ? 'text-red-600' : variant === 'warning' ? 'text-yellow-600' : 'text-green-600'}`}>
                                {debtRatio.toFixed(0)}%
                              </span>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatCurrency(customerStats.financial.currentDebt)} / {formatCurrency(customer.maxDebt)}
                              </p>
                            </>
                          );
                        })()}
                      </dd>
                    </div>
                  )}

                  {/* Mạng xã hội */}
                  {customer.social?.website && (
                    <div className="space-y-1">
                      <dt className="text-sm text-muted-foreground">Website</dt>
                      <dd>
                        <a 
                          href={customer.social.website.startsWith('http') ? customer.social.website : `https://${customer.social.website}`}
                          target="_blank" rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                        >
                          {customer.social.website}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </dd>
                    </div>
                  )}
                  {customer.social?.facebook && (
                    <div className="space-y-1">
                      <dt className="text-sm text-muted-foreground">Facebook</dt>
                      <dd>
                        <a 
                          href={customer.social.facebook.startsWith('http') ? customer.social.facebook : `https://facebook.com/${customer.social.facebook}`}
                          target="_blank" rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                        >
                          {customer.social.facebook}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </dd>
                    </div>
                  )}
                  {customer.social?.instagram && (
                    <DetailItem label="Instagram" value={customer.social.instagram} />
                  )}
                  {customer.social?.tiktok && (
                    <DetailItem label="TikTok" value={customer.social.tiktok} />
                  )}
                  {customer.social?.youtube && (
                    <DetailItem label="YouTube" value={customer.social.youtube} />
                  )}
                  {customer.social?.linkedin && (
                    <DetailItem label="LinkedIn" value={customer.social.linkedin} />
                  )}
                  {customer.social?.twitter && (
                    <DetailItem label="Twitter/X" value={customer.social.twitter} />
                  )}
                  {customer.social?.shopee && (
                    <DetailItem label="Shopee" value={customer.social.shopee} />
                  )}
                  {customer.social?.lazada && (
                    <DetailItem label="Lazada" value={customer.social.lazada} />
                  )}
                  {customer.social?.other && (
                    <DetailItem label="Khác" value={customer.social.other} />
                  )}
                </dl>
              </CardContent>
            </Card>

            {/* Phân loại */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle size="sm" className="font-medium">Phân loại</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
                  <DetailItem label="Loại khách hàng" value={getTypeName(customer.type)} />
                  <DetailItem label="Nhóm khách hàng" value={getGroupName(customer.customerGroup)} />
                  <DetailItem label="Nguồn" value={getSourceName(customer.source)} />
                  <DetailItem label="Chiến dịch" value={customer.campaign} />
                  <DetailItem 
                    label="Người giới thiệu" 
                    value={customer.referredByName || customer.referredBy}
                    onClick={customer.referredBy ? () => router.push(`/customers/${customer.referredBy}`) : undefined}
                  />
                  <DetailItem label="Bảng giá" value={
                    (() => {
                      const policyId = (customer as unknown as Record<string, unknown>).pricingPolicyId as string | undefined || customer.pricingLevel;
                      if (!policyId) return undefined;
                      const policy = pricingPolicies.find(p => p.systemId === policyId || p.id === policyId);
                      return policy?.name;
                    })()
                  } />
                </dl>
              </CardContent>
            </Card>

            {/* Thống kê mua hàng */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle size="sm" className="font-medium">Thống kê mua hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
                  <DetailItem label="Tổng đơn hàng" value={customerStats.orders.total.toString()} />
                  <DetailItem label="Tổng chi tiêu" value={formatCurrency(customerStats.financial.totalSpent)} />
                  <DetailItem label="SL đã mua" value={(customer.totalProductsBought ?? 0).toString()} />
                  <DetailItem label="SL trả lại" value={computedTotalQuantityReturned.toString()} />
                  <DetailItem label="Lần mua gần nhất" value={formatDateUtil(customerStats.orders.lastOrderDate)} />
                  <DetailItem label="Giao hàng thất bại" value={totalFailedDeliveries.toString()} />
                </dl>
              </CardContent>
            </Card>

            {/* Quản lý */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle size="sm" className="font-medium">Quản lý</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
                  <DetailItem 
                    label="NV phụ trách" 
                    value={customer.accountManagerName}
                    onClick={customer.accountManagerId ? () => router.push(`/employees/${customer.accountManagerId}`) : undefined}
                  />
                  <DetailItem label="Ngày tạo" value={formatDateUtil(customer.createdAt)} />
                  <DetailItem 
                    label="Người tạo" 
                    value={customer.createdByName}
                    onClick={customer.createdBy ? () => router.push(`/employees/${customer.createdBy}`) : undefined}
                  />
                  <DetailItem label="Cập nhật" value={formatDateUtil(customer.updatedAt)} />
                </dl>
              </CardContent>
            </Card>

            {/* Ghi chú */}
            {customer.notes && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle size="sm" className="font-medium">Ghi chú</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{sanitizeToText(customer.notes)}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Thông tin doanh nghiệp */}
          <TabsContent value="business" id="customer-tab-business" className="space-y-6 mt-6">
            {(customer.businessProfiles && customer.businessProfiles.length > 0) ? (
              customer.businessProfiles.map((profile, idx) => {
                const linkedAddress = profile.addressId 
                  ? (customer.addresses || []).find(a => a.id === profile.addressId)
                  : null;
                const copyAllInfo = () => {
                  const lines = [
                    profile.company && `Công ty: ${profile.company}`,
                    profile.taxCode && `MST: ${profile.taxCode}`,
                    profile.representative && `Người đại diện: ${profile.representative}`,
                    profile.position && `Chức vụ: ${profile.position}`,
                    profile.phone && `SĐT: ${profile.phone}`,
                    profile.bankName && `Ngân hàng: ${profile.bankName}`,
                    profile.bankAccount && `STK: ${profile.bankAccount}`,
                    profile.email && `Email: ${profile.email}`,
                    linkedAddress && `Địa chỉ: ${linkedAddress.street || ''}${linkedAddress.province ? `, ${linkedAddress.province}` : ''}`,
                  ].filter(Boolean).join('\n');
                  navigator.clipboard.writeText(lines);
                  toast.success('Đã sao chép thông tin doanh nghiệp');
                };
                return (
                  <Card key={profile.id || idx}>
                    <CardHeader className="pb-3 flex flex-row items-center justify-between">
                      <CardTitle size="sm" className="font-medium">
                        {profile.company || `Doanh nghiệp #${idx + 1}`}
                      </CardTitle>
                      <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground" onClick={copyAllInfo}>
                        <Copy className="h-3.5 w-3.5" />
                        Sao chép
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
                        <DetailItem label="Công ty" value={profile.company} />
                        <DetailItem label="Mã số thuế" value={profile.taxCode} />
                        <DetailItem label="Người đại diện" value={profile.representative} />
                        <DetailItem label="Chức vụ" value={profile.position} />
                        <DetailItem label="Số điện thoại" value={profile.phone} />
                        <DetailItem label="Ngân hàng" value={profile.bankName} />
                        <DetailItem label="Số tài khoản" value={profile.bankAccount} />
                        <DetailItem label="Email" value={profile.email} />
                        {linkedAddress && (
                          <DetailItem label="Địa chỉ" value={`${linkedAddress.street || ''}${linkedAddress.province ? `, ${linkedAddress.province}` : ''}`} />
                        )}
                      </dl>
                    </CardContent>
                  </Card>
                );
              })
            ) : (customer.company || customer.taxCode || customer.representative || customer.position) ? (
              <Card>
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle size="sm" className="font-medium">Thông tin doanh nghiệp</CardTitle>
                  <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground" onClick={() => {
                    const lines = [
                      customer.company && `Công ty: ${customer.company}`,
                      customer.taxCode && `MST: ${customer.taxCode}`,
                      customer.representative && `Người đại diện: ${customer.representative}`,
                      customer.position && `Chức vụ: ${customer.position}`,
                    ].filter(Boolean).join('\n');
                    navigator.clipboard.writeText(lines);
                    toast.success('Đã sao chép thông tin doanh nghiệp');
                  }}>
                    <Copy className="h-3.5 w-3.5" />
                    Sao chép
                  </Button>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
                    <DetailItem label="Công ty" value={customer.company} />
                    <DetailItem label="Mã số thuế" value={customer.taxCode} />
                    <DetailItem label="Người đại diện" value={customer.representative} />
                    <DetailItem label="Chức vụ" value={customer.position} />
                  </dl>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-muted-foreground">
                    <p>Chưa có thông tin doanh nghiệp</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Thanh toán */}
          <TabsContent value="payment" id="customer-tab-payment" className="space-y-6 mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle size="sm" className="font-medium">Thanh toán & Tín dụng</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
                  <DetailItem label="Hạn thanh toán" value={getPaymentTermName(customer.paymentTerms)} />
                  <DetailItem label="Xếp hạng tín dụng" value={getCreditRatingName(customer.creditRating)} />
                  <DetailItem label="Cho phép công nợ" value={customer.allowCredit ? 'Có' : 'Không'} />
                  <DetailItem label="Giảm giá mặc định" value={customer.defaultDiscount ? `${customer.defaultDiscount}%` : undefined} />
                  <DetailItem label="Công nợ hiện tại" value={formatCurrency(customerStats.financial.currentDebt)} />
                  <DetailItem label="Hạn mức công nợ" value={formatCurrency(customer.maxDebt)} />
                </dl>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Đơn hàng */}
          <TabsContent value="purchase-history" id="customer-tab-purchase-history" className="mt-4">
            <RelatedDataTable 
              data={customerOrdersWithReturns} 
              columns={orderColumnsWithReturns} 
              searchKeys={['id', 'status', 'deliveryStatus', 'paymentStatus', 'salesperson', 'createdByName']} 
              searchPlaceholder="Tìm theo mã ĐH..." 
              dateFilterColumn="orderDate" 
              dateFilterTitle="Ngày đặt" 
              exportFileName={`Don_hang_${customer.id}`} 
              onRowClick={(row) => router.push(`/orders/${row.systemId}`)} 
              controlledSearch={orderDrilldownSearch}
              onControlledSearchApplied={handleOrderSearchApplied}
              showCheckbox
              defaultSorting={{ id: 'orderDate', desc: true }}
              serverPagination={{
                page: ordersResult.pagination.page,
                pageSize: ordersResult.pagination.pageSize,
                totalItems: ordersResult.pagination.total,
                onPageChange: ordersResult.setPage,
                onPageSizeChange: ordersResult.setPageSize,
              }}
            />
          </TabsContent>

          {/* Tab: Đơn hàng trả */}
          <TabsContent value="sales-returns" id="customer-tab-sales-returns" className="mt-4">
            <RelatedDataTable 
              data={customerSalesReturns} 
              columns={salesReturnColumns} 
              searchKeys={['id', 'orderId', 'reason', 'creatorName']} 
              searchPlaceholder="Tìm phiếu trả hàng..." 
              dateFilterColumn="returnDate" 
              dateFilterTitle="Ngày trả" 
              exportFileName={`Tra_hang_${customer.id}`} 
              onRowClick={(row) => router.push(`/returns/${row.systemId}`)} 
              showCheckbox
              defaultSorting={{ id: 'returnDate', desc: true }}
              serverPagination={{
                page: salesReturnsResult.pagination.page,
                pageSize: salesReturnsResult.pagination.pageSize,
                totalItems: salesReturnsResult.pagination.total,
                onPageChange: salesReturnsResult.setPage,
                onPageSizeChange: salesReturnsResult.setPageSize,
              }}
            />
          </TabsContent>

          {/* Tab: Công nợ */}
          <TabsContent value="debt" id="customer-tab-debt" className="mt-4">
            <RelatedDataTable 
              data={customerDebtTransactions} 
              columns={debtColumns} 
              searchKeys={['voucherId', 'description', 'creator']} 
              searchPlaceholder="Tìm giao dịch..."
              dateFilterColumn="createdAt"
              dateFilterTitle="Ngày Ghi nhận"
              exportFileName={`Cong_no_${customer.id}`}
              showCheckbox
              serverPagination={{
                page: debtResult.pagination.page,
                pageSize: debtResult.pagination.pageSize,
                totalItems: debtResult.pagination.total,
                onPageChange: debtResult.setPage,
                onPageSizeChange: debtResult.setPageSize,
              }}
            />
          </TabsContent>

          {/* Tab: Địa chỉ */}
          <TabsContent value="addresses" id="customer-tab-addresses" className="mt-4">
            <RelatedDataTable
              data={addressTableData}
              columns={addressColumns}
              searchKeys={['label', 'street', 'province', 'district', 'ward', 'contactName', 'contactPhone']}
              searchPlaceholder="Tìm địa chỉ..."
              exportFileName={`Dia_chi_${customer.id}`}
              showCheckbox
            />
          </TabsContent>

          {/* Tab: Sản phẩm đã mua */}
          <TabsContent value="products" id="customer-tab-products" className="mt-4">
            <RelatedDataTable 
              data={purchasedProducts} 
              columns={productColumns} 
              searchKeys={['name', 'orderId']} 
              searchPlaceholder="Tìm sản phẩm, mã đơn..." 
              exportFileName={`SP_da_mua_${customer.id}`}
              showCheckbox
              defaultSorting={{ id: 'orderDate', desc: true }}
              serverPagination={{
                page: productsResult.pagination.page,
                pageSize: productsResult.pagination.pageSize,
                totalItems: productsResult.pagination.total,
                onPageChange: productsResult.setPage,
                onPageSizeChange: productsResult.setPageSize,
              }}
            />
          </TabsContent>

          {/* Tab: Bảo hành */}
          <TabsContent value="warranty" id="customer-tab-warranty" className="mt-4">
            <RelatedDataTable
              data={warrantyTableData}
              columns={warrantyColumns}
              searchKeys={['id', 'status', 'trackingCode', 'branchName']}
              searchPlaceholder="Tìm phiếu bảo hành..."
              dateFilterColumn="createdAt"
              dateFilterTitle="Ngày tạo"
              exportFileName={`Bao_hanh_${customer.id}`}
              onRowClick={(row) => router.push(`/warranty/${row.systemId}`)}
              controlledSearch={warrantyDrilldownSearch}
              onControlledSearchApplied={handleWarrantySearchApplied}
              showCheckbox
              defaultSorting={{ id: 'createdAt', desc: true }}
              serverPagination={{
                page: warrantiesResult.pagination.page,
                pageSize: warrantiesResult.pagination.pageSize,
                totalItems: warrantiesResult.pagination.total,
                onPageChange: warrantiesResult.setPage,
                onPageSizeChange: warrantiesResult.setPageSize,
              }}
            />
          </TabsContent>

          {/* Tab: Liên hệ */}
          <TabsContent value="contacts" id="customer-tab-contacts" className="mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle size="sm" className="font-medium">Danh sách liên hệ</CardTitle>
              </CardHeader>
              <CardContent>
                {!customer.contacts || customer.contacts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Chưa có thông tin liên hệ nào</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {customer.contacts.map((contact, index) => (
                      <Card key={index} className="relative overflow-hidden">
                        {contact.isPrimary && (
                          <Badge className="absolute top-2 right-2 text-xs" variant="success">
                            Chính
                          </Badge>
                        )}
                        <CardContent className="p-4 pt-5">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-lg font-semibold text-muted-foreground shrink-0">
                              {contact.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium truncate">{contact.name}</div>
                              <div className="text-sm text-muted-foreground truncate">{contact.role}</div>
                            </div>
                          </div>
                          <div className="space-y-1.5 text-sm">
                            {contact.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                <a href={`tel:${contact.phone}`} className="hover:underline truncate">{contact.phone}</a>
                              </div>
                            )}
                            {contact.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                <a href={`mailto:${contact.email}`} className="hover:underline truncate">{contact.email}</a>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Khiếu nại */}
          <TabsContent value="complaints" id="customer-tab-complaints" className="mt-4">
            <RelatedDataTable
              data={complaintTableData}
              columns={complaintColumns}
              searchKeys={['id', 'type', 'assignedName', 'orderCode', 'description']}
              searchPlaceholder="Tìm khiếu nại..."
              dateFilterColumn="createdAt"
              dateFilterTitle="Ngày tạo"
              exportFileName={`Khieu_nai_${customer.id}`}
              onRowClick={(row) => router.push(`/complaints/${row.systemId}`)}
              controlledSearch={complaintDrilldownSearch}
              onControlledSearchApplied={handleComplaintSearchApplied}
              showCheckbox
              defaultSorting={{ id: 'createdAt', desc: true }}
              serverPagination={{
                page: complaintsResult.pagination.page,
                pageSize: complaintsResult.pagination.pageSize,
                totalItems: complaintsResult.pagination.total,
                onPageChange: complaintsResult.setPage,
                onPageSizeChange: complaintsResult.setPageSize,
              }}
            />
          </TabsContent>
        </Tabs>

        {/* Comments */}
        <Comments
          entityType="customer"
          entityId={customer.systemId}
          comments={comments}
          onAddComment={handleAddComment}
          onUpdateComment={handleUpdateComment}
          onDeleteComment={handleDeleteComment}
          currentUser={commentCurrentUser}
          title="Bình luận"
          placeholder="Thêm bình luận về khách hàng..."
        />

        {/* Activity History */}
        <EntityActivityTable entityType="customer" entityId={customer.systemId} />
      </div>
    </div>
    </>
  );
}
