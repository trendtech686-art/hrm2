import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { formatDate as formatDateUtil, formatDateTime, formatDateTimeSeconds, formatDateCustom, getCurrentDate, getDaysDiff } from '@/lib/date-utils';
import { asSystemId } from '@/lib/id-types';
import { useCustomerStore } from './store.ts';
import { useOrderStore } from '../orders/store.ts';
import { useWarrantyStore } from '../warranty/store.ts';
// REMOVED: import { useComplaintStore } from '../complaints/store.ts';
import { useReceiptStore } from '../receipts/store.ts';
import { useEmployeeStore } from '../employees/store.ts';
import { useCustomerTypeStore } from '../settings/customers/customer-types-store';
import { useCustomerGroupStore } from '../settings/customers/customer-groups-store';
import { useCustomerSourceStore } from '../settings/customers/customer-sources-store';
import { usePaymentTermStore } from '../settings/customers/payment-terms-store';
import { useCreditRatingStore } from '../settings/customers/credit-ratings-store';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Button } from '../../components/ui/button.tsx';
import { ArrowLeft, Edit, Building2, Phone, Mail, MapPin, CreditCard, ShoppingBag, FileText, Wrench, MessageSquare, User, Calendar, Tag, Globe, TrendingUp, DollarSign, Image, Award, Target, Activity, Users, Briefcase, ExternalLink } from 'lucide-react';
import { Badge } from '../../components/ui/badge.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs.tsx';
import { ProgressiveImage } from '../../components/ui/progressive-image.tsx';
import { RelatedDataTable } from '../../components/data-table/related-data-table.tsx';
import { StatsCard } from '../../components/ui/stats-card.tsx';
import { InfoItem } from '../../components/ui/info-card.tsx';
import { SectionHeader } from '../../components/ui/section-header.tsx';
import { CustomerAddresses } from './customer-addresses.tsx';
import type { ColumnDef } from '../../components/data-table/types.ts';
import type { Order, OrderMainStatus } from '../orders/types.ts';
import type { WarrantyTicket } from '../warranty/types.ts';
// REMOVED: import type { Complaint, ComplaintStatus } from '../complaints/types.ts';
const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const formatAddress = (street?: string, ward?: string, province?: string) => {
    const address = [street, ward, province].filter(Boolean).join(', ');
    return address || '-';
};

const orderStatusVariants: Record<OrderMainStatus, "success" | "default" | "secondary" | "warning" | "destructive"> = {
    "Đặt hàng": "secondary",
    "Đang giao dịch": "warning",
    "Hoàn thành": "success",
    "Đã hủy": "destructive",
};

// REMOVED: Complaint status variants
// const complaintStatusVariants: Record<ComplaintStatus, "default" | "secondary" | "warning" | "success"> = {
//     "Mới": "secondary", "Đang xử lý": "warning", "Đã giải quyết": "success", "Đã đóng": "default",
// };

// Column Definitions
const orderColumns: ColumnDef<Order>[] = [
    { id: 'id', accessorKey: 'id', header: 'Mã ĐH', cell: ({ row }) => <span className="font-medium">{row.id}</span>, meta: { displayName: 'Mã ĐH'} },
    { id: 'orderDate', accessorKey: 'orderDate', header: 'Ngày đặt', cell: ({ row }) => formatDateUtil(row.orderDate), meta: { displayName: 'Ngày đặt'} },
    { id: 'status', accessorKey: 'status', header: 'Trạng thái', cell: ({ row }) => <Badge variant={orderStatusVariants[row.status]}>{row.status}</Badge>, meta: { displayName: 'Trạng thái'} },
    { id: 'grandTotal', accessorKey: 'grandTotal', header: 'Tổng tiền', cell: ({ row }) => formatCurrency(row.grandTotal), meta: { displayName: 'Tổng tiền'} },
];
const productColumns: ColumnDef<{ systemId: string, name: string; quantity: number }>[] = [
    { id: 'name', accessorKey: 'name', header: 'Tên sản phẩm', cell: ({ row }) => <span className="font-medium">{row.name}</span>, meta: { displayName: 'Tên sản phẩm'} },
    { id: 'quantity', accessorKey: 'quantity', header: 'Tổng số lượng', cell: ({ row }) => row.quantity, meta: { displayName: 'Tổng số lượng'} },
];

// REMOVED: Complaint columns
// const complaintColumns: ColumnDef<Complaint>[] = [
//     { id: 'id', accessorKey: 'id', header: 'Mã KN', cell: ({ row }) => <span className="font-medium">{row.id}</span>, meta: { displayName: 'Mã KN'} },
//     { id: 'title', accessorKey: 'title', header: 'Tiêu đề', cell: ({ row }) => row.title, meta: { displayName: 'Tiêu đề'} },
//     { id: 'createdDate', accessorKey: 'createdDate', header: 'Ngày tạo', cell: ({ row }) => formatDateUtil(row.createdDate), meta: { displayName: 'Ngày tạo'} },
//     { id: 'status', accessorKey: 'status', header: 'Trạng thái', cell: ({ row }) => <Badge variant={complaintStatusVariants[row.status] as any}>{row.status}</Badge>, meta: { displayName: 'Trạng thái'} },
// ];

const debtColumns: ColumnDef<any>[] = [
    { id: 'voucherId', accessorKey: 'voucherId', header: 'Mã phiếu', cell: ({ row }) => <span className="font-medium text-primary">{row.voucherId}</span>, meta: { displayName: 'Mã phiếu' } },
    { id: 'creator', accessorKey: 'creator', header: 'Người tạo', cell: ({ row }) => row.creator, meta: { displayName: 'Người tạo' } },
    { id: 'date', accessorKey: 'date', header: 'Ngày Ghi nhận', cell: ({ row }) => formatDateUtil(row.date), meta: { displayName: 'Ngày Ghi nhận' } },
    { id: 'description', accessorKey: 'description', header: 'Ghi chú', cell: ({ row }) => row.description, meta: { displayName: 'Ghi chú' } },
    { id: 'change', accessorKey: 'change', header: 'Giá trị thay đổi', cell: ({ row }) => <span className={row.change > 0 ? 'text-blue-600' : 'text-green-600'}>{formatCurrency(row.change)}</span>, meta: { displayName: 'Giá trị thay đổi' } },
    { id: 'balance', accessorKey: 'balance', header: 'Công nợ', cell: ({ row }) => <span className="font-semibold">{formatCurrency(row.balance)}</span>, meta: { displayName: 'Công nợ' } },
];


export function CustomerDetailPage() {
  const { systemId } = ReactRouterDOM.useParams<{ systemId: string }>();
  const navigate = ReactRouterDOM.useNavigate();
  const { findById, update, data } = useCustomerStore();
  const customer = React.useMemo(() => (systemId ? findById(asSystemId(systemId)) : null), [systemId, findById, data]);

  const { data: allOrders } = useOrderStore();
  const { data: allWarrantyTickets } = useWarrantyStore();
  // REMOVED: const { data: allComplaints } = useComplaintStore();
  const { data: allReceipts } = useReceiptStore();
  const { findById: findEmployeeById } = useEmployeeStore();
  
  // Settings stores
  const customerTypes = useCustomerTypeStore();
  const customerGroups = useCustomerGroupStore();
  const customerSources = useCustomerSourceStore();
  const paymentTerms = usePaymentTermStore();
  const creditRatings = useCreditRatingStore();

  // Lookup names
  const getTypeName = (id?: string) => id ? customerTypes.findById(asSystemId(id))?.name : undefined;
  const getGroupName = (id?: string) => id ? customerGroups.findById(asSystemId(id))?.name : undefined;
  const getSourceName = (id?: string) => id ? customerSources.findById(asSystemId(id))?.name : undefined;
  const getPaymentTermName = (id?: string) => id ? paymentTerms.findById(asSystemId(id))?.name : undefined;
  const getCreditRatingName = (id?: string) => id ? creditRatings.findById(asSystemId(id))?.name : undefined;
  const getEmployeeName = (id?: string) => id ? findEmployeeById(asSystemId(id))?.fullName : undefined;

  const customerOrders = React.useMemo(() => allOrders.filter(o => o.customerSystemId === customer?.systemId), [allOrders, customer?.systemId]);
  
  // Note: Warranty tickets don't have customerId field - they store customer info directly
  // Filter by customer phone number instead
  const customerWarrantyTickets = React.useMemo(() => 
    allWarrantyTickets.filter(t => t.customerPhone === customer?.phone), 
    [allWarrantyTickets, customer?.phone]
  );
  
  // REMOVED: Complaints functionality
  // const customerComplaints = React.useMemo(() => allComplaints.filter(c => c.customerId === customer?.systemId), [allComplaints, customer?.systemId]);

  const purchasedProducts = React.useMemo(() => {
    const productMap = new Map<string, { systemId: string, name: string; quantity: number }>();
    customerOrders.forEach(order => {
      order.lineItems.forEach(item => {
        if (productMap.has(item.productId)) {
          productMap.get(item.productId)!.quantity += item.quantity;
        } else {
          productMap.set(item.productId, { systemId: item.productId, name: item.productName, quantity: item.quantity });
        }
      });
    });
    return Array.from(productMap.values());
  }, [customerOrders]);
  
  const customerDebtTransactions = React.useMemo(() => {
    if (!customer) return [];

    const orderTransactions = customerOrders.map(order => ({
        systemId: `order-${order.systemId}`,
        voucherId: order.id,
        creator: order.salesperson,
        date: order.orderDate,
        description: `Đơn hàng #${order.id}`,
        change: order.grandTotal,
    }));

    const receiptTransactions = allReceipts
        .filter(r => r.payerTypeName === 'Khách hàng' && r.payerName === customer.name)
        .map(receipt => ({
            systemId: `receipt-${receipt.systemId}`,
            voucherId: receipt.id,
            creator: receipt.createdBy,
            date: receipt.date,
            description: receipt.description,
            change: -receipt.amount,
        }));

    const allTransactions = [...orderTransactions, ...receiptTransactions];
    allTransactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    let runningDebt = 0;
    const transactionsWithBalance = allTransactions.map(t => {
        runningDebt += t.change;
        return { ...t, balance: runningDebt };
    });

    return transactionsWithBalance.reverse();
  }, [customer, customerOrders, allReceipts]);

  const headerActions = React.useMemo(() => [
    <Button key="back" variant="outline" onClick={() => navigate('/customers')}>
      <ArrowLeft className="mr-2 h-4 w-4" />
      Quay lại
    </Button>,
    <Button key="edit" onClick={() => navigate(`/customers/${systemId}/edit`)}>
      <Edit className="mr-2 h-4 w-4" />
      Chỉnh sửa
    </Button>
  ], [navigate, systemId]);

  const headerContext = React.useMemo(() => ({
    name: customer?.name,
  }), [customer?.name]);

  usePageHeader({
    title: customer ? `Chi tiết khách hàng: ${customer.name}` : 'Chi tiết khách hàng',
    subtitle: customer ? `Mã: ${customer.id}` : undefined,
    context: headerContext,
    actions: headerActions,
  });

  if (!customer) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Không tìm thấy khách hàng</h2>
          <Button onClick={() => navigate('/customers')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay về danh sách
          </Button>
        </div>
      </div>
    );
  }

  const totalSpent = React.useMemo(() => 
    customerOrders.reduce((sum, order) => sum + (order.grandTotal || 0), 0), 
    [customerOrders]
  );

  const currentDebt = React.useMemo(() => 
    customerDebtTransactions.length > 0 ? customerDebtTransactions[0].balance : 0,
    [customerDebtTransactions]
  );

  return (
    <div className="w-full h-full">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Tổng chi tiêu"
            value={formatCurrency(totalSpent)}
            icon={ShoppingBag}
          />
          <StatsCard
            title="Đơn hàng"
            value={customerOrders.length.toString()}
            icon={FileText}
          />
          <StatsCard
            title="Công nợ hiện tại"
            value={formatCurrency(currentDebt)}
            icon={CreditCard}
            description={customer.maxDebt ? `Hạn mức: ${formatCurrency(customer.maxDebt)}` : undefined}
          />
          {/* REMOVED: Complaints stats card */}
          {/* <StatsCard
            title="Khiếu nại"
            value={customerComplaints.length.toString()}
            icon={MessageSquare}
          /> */}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="info" className="w-full">
          <TabsList>
            <TabsTrigger value="info">Thông tin chung</TabsTrigger>
            <TabsTrigger value="business">Thông tin doanh nghiệp</TabsTrigger>
            <TabsTrigger value="payment">Thanh toán & Tín dụng</TabsTrigger>
            <TabsTrigger value="purchase-history">Lịch sử mua hàng</TabsTrigger>
            <TabsTrigger value="debt">Công nợ</TabsTrigger>
            <TabsTrigger value="addresses">Địa chỉ</TabsTrigger>
            <TabsTrigger value="products">Sản phẩm đã mua</TabsTrigger>
            <TabsTrigger value="warranty">Bảo hành</TabsTrigger>
            {/* REMOVED: <TabsTrigger value="complaints">Khiếu nại</TabsTrigger> */}
          </TabsList>

          {/* Tab: Thông tin chung */}
          <TabsContent value="info" className="space-y-4 mt-4">
            {/* Images Section */}
            {customer.images && customer.images.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5" />
                    Hình ảnh
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                          <Badge className="absolute top-2 left-2" variant="secondary">
                            Ảnh chính
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Thông tin cơ bản */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Thông tin chung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <InfoItem icon={CreditCard} label="Mã khách hàng" value={customer.id} />
                  <InfoItem icon={User} label="Tên khách hàng" value={customer.name} />
                  <InfoItem icon={Mail} label="Email" value={customer.email} />
                  <InfoItem icon={Phone} label="Số điện thoại" value={customer.phone} />
                  <InfoItem icon={Phone} label="Zalo" value={customer.zaloPhone} />
                  <div className="flex items-start gap-3">
                    <Tag className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground mb-1">Trạng thái</div>
                      <Badge variant={customer.status === 'Đang giao dịch' ? 'success' : 'secondary'}>{customer.status}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phân loại khách hàng */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Phân loại khách hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <InfoItem icon={Tag} label="Loại khách hàng" value={getTypeName(customer.type)} />
                  <InfoItem icon={Users} label="Nhóm khách hàng" value={getGroupName(customer.customerGroup)} />
                  <InfoItem icon={TrendingUp} label="Nguồn khách hàng" value={getSourceName(customer.source)} />
                  <InfoItem icon={Target} label="Chiến dịch" value={customer.campaign} />
                  <InfoItem 
                    icon={User} 
                    label="Người giới thiệu" 
                    value={customer.referredBy ? findById(asSystemId(customer.referredBy))?.name : undefined}
                    onClick={customer.referredBy ? () => navigate(`/customers/${customer.referredBy}`) : undefined}
                    isClickable={!!customer.referredBy}
                  />
                  <InfoItem icon={Briefcase} label="Bảng giá áp dụng" value={customer.pricingLevel} />
                </div>
              </CardContent>
            </Card>

            {/* Chỉ số khách hàng */}
            {(customer.lifecycleStage || customer.segment || customer.rfmScores || customer.healthScore !== undefined || customer.churnRisk) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Chỉ số khách hàng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {customer.lifecycleStage && (
                      <div className="flex items-start gap-3">
                        <Target className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground mb-1">Giai đoạn vòng đời</div>
                          <Badge variant="default">{customer.lifecycleStage}</Badge>
                        </div>
                      </div>
                    )}
                    {customer.segment && (
                      <div className="flex items-start gap-3">
                        <Award className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground mb-1">Phân khúc RFM</div>
                          <Badge variant="secondary">{customer.segment}</Badge>
                        </div>
                      </div>
                    )}
                    {customer.rfmScores && (
                      <InfoItem 
                        icon={TrendingUp} 
                        label="Điểm RFM" 
                        value={`R:${customer.rfmScores.recency} F:${customer.rfmScores.frequency} M:${customer.rfmScores.monetary}`}
                      />
                    )}
                    {customer.healthScore !== undefined && (
                      <InfoItem 
                        icon={Activity} 
                        label="Điểm sức khỏe" 
                        value={`${customer.healthScore}/100`}
                      />
                    )}
                    {customer.churnRisk && (
                      <div className="flex items-start gap-3">
                        <TrendingUp className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground mb-1">Nguy cơ rời bỏ</div>
                          <Badge 
                            variant={
                              customer.churnRisk === 'low' ? 'success' : 
                              customer.churnRisk === 'medium' ? 'warning' : 
                              'destructive'
                            }
                          >
                            {customer.churnRisk === 'low' ? 'Thấp' : customer.churnRisk === 'medium' ? 'Trung bình' : 'Cao'}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ngân hàng & Mạng xã hội */}
            {(customer.bankName || customer.bankAccount || customer.social?.website || customer.social?.facebook || customer.social?.linkedin) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Ngân hàng & Mạng xã hội
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <InfoItem icon={Building2} label="Ngân hàng" value={customer.bankName} />
                    <InfoItem icon={CreditCard} label="Số tài khoản" value={customer.bankAccount} />
                    {customer.social?.website && (
                      <div className="flex items-start gap-3">
                        <Globe className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground mb-1">Website</div>
                          <a 
                            href={customer.social.website.startsWith('http') ? customer.social.website : `https://${customer.social.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                          >
                            {customer.social.website}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    )}
                    {customer.social?.facebook && (
                      <div className="flex items-start gap-3">
                        <Globe className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground mb-1">Facebook</div>
                          <a 
                            href={customer.social.facebook.startsWith('http') ? customer.social.facebook : `https://facebook.com/${customer.social.facebook}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                          >
                            {customer.social.facebook}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    )}
                    {customer.social?.linkedin && (
                      <InfoItem icon={Globe} label="Instagram" value={customer.social.linkedin} />
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {customer.tags && customer.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Nhãn
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {customer.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Thống kê mua hàng */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Thống kê mua hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <InfoItem icon={ShoppingBag} label="Tổng đơn hàng" value={customer.totalOrders?.toString()} />
                  <InfoItem icon={DollarSign} label="Tổng chi tiêu" value={formatCurrency(customer.totalSpent)} />
                  <InfoItem icon={ShoppingBag} label="Số lượng đã mua" value={customer.totalQuantityPurchased?.toString()} />
                  <InfoItem icon={ShoppingBag} label="Số lượng trả lại" value={customer.totalQuantityReturned?.toString()} />
                  <InfoItem icon={Calendar} label="Lần mua gần nhất" value={formatDateUtil(customer.lastPurchaseDate)} />
                  <InfoItem icon={MessageSquare} label="Giao hàng thất bại" value={customer.failedDeliveries?.toString()} />
                </div>
              </CardContent>
            </Card>

            {/* Quản lý */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Quản lý
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <InfoItem 
                    icon={User} 
                    label="NV phụ trách" 
                    value={customer.accountManagerName || getEmployeeName(customer.accountManagerId)}
                    onClick={customer.accountManagerId ? () => navigate(`/employees/${customer.accountManagerId}`) : undefined}
                    isClickable={!!customer.accountManagerId}
                  />
                  <InfoItem icon={Calendar} label="Ngày khởi tạo" value={formatDateUtil(customer.createdAt)} />
                  <InfoItem 
                    icon={User} 
                    label="Người tạo" 
                    value={getEmployeeName(customer.createdBy)}
                    onClick={customer.createdBy ? () => navigate(`/employees/${customer.createdBy}`) : undefined}
                    isClickable={!!customer.createdBy}
                  />
                  <InfoItem icon={Calendar} label="Cập nhật lần cuối" value={formatDateUtil(customer.updatedAt)} />
                  <InfoItem 
                    icon={User} 
                    label="Người cập nhật" 
                    value={getEmployeeName(customer.updatedBy)}
                    onClick={customer.updatedBy ? () => navigate(`/employees/${customer.updatedBy}`) : undefined}
                    isClickable={!!customer.updatedBy}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Ghi chú */}
            {customer.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Ghi chú
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{customer.notes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Thông tin doanh nghiệp */}
          <TabsContent value="business" className="space-y-4 mt-4">
            {(customer.company || customer.taxCode || customer.representative || customer.position) ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Thông tin doanh nghiệp
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <InfoItem icon={Building2} label="Công ty" value={customer.company} />
                    <InfoItem icon={CreditCard} label="Mã số thuế" value={customer.taxCode} />
                    <InfoItem icon={User} label="Người đại diện" value={customer.representative} />
                    <InfoItem icon={Briefcase} label="Chức vụ" value={customer.position} />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-muted-foreground">
                    <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Chưa có thông tin doanh nghiệp</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Hợp đồng */}
            {customer.contract && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Hợp đồng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <InfoItem icon={FileText} label="Số hợp đồng" value={customer.contract.number} />
                    <InfoItem icon={Calendar} label="Ngày bắt đầu" value={formatDateUtil(customer.contract.startDate)} />
                    <InfoItem icon={Calendar} label="Ngày kết thúc" value={formatDateUtil(customer.contract.endDate)} />
                    <InfoItem icon={DollarSign} label="Giá trị hợp đồng" value={formatCurrency(customer.contract.value)} />
                    {customer.contract.status && (
                      <div className="flex items-start gap-3">
                        <Tag className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <div className="flex-1">
                          <div className="text-sm text-muted-foreground mb-1">Trạng thái hợp đồng</div>
                          <Badge variant={
                            customer.contract.status === 'Active' ? 'success' :
                            customer.contract.status === 'Expired' ? 'destructive' :
                            customer.contract.status === 'Pending' ? 'warning' :
                            'secondary'
                          }>
                            {customer.contract.status}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Thanh toán & Tín dụng */}
          <TabsContent value="payment" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Thanh toán & Tín dụng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <InfoItem icon={Calendar} label="Hạn thanh toán" value={getPaymentTermName(customer.paymentTerms)} />
                  <InfoItem icon={Award} label="Xếp hạng tín dụng" value={getCreditRatingName(customer.creditRating)} />
                  <InfoItem 
                    icon={CreditCard} 
                    label="Cho phép công nợ" 
                    value={customer.allowCredit ? 'Có' : 'Không'}
                  />
                  <InfoItem icon={DollarSign} label="Giảm giá mặc định" value={customer.defaultDiscount ? `${customer.defaultDiscount}%` : undefined} />
                  <InfoItem icon={DollarSign} label="Công nợ hiện tại" value={formatCurrency(customer.currentDebt)} />
                  <InfoItem icon={DollarSign} label="Hạn mức công nợ" value={formatCurrency(customer.maxDebt)} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Lịch sử mua hàng */}
          <TabsContent value="purchase-history" className="mt-4">
            <RelatedDataTable 
              data={customerOrders} 
              columns={orderColumns} 
              searchKeys={['id', 'status']} 
              searchPlaceholder="Tìm theo mã ĐH..." 
              dateFilterColumn="orderDate" 
              dateFilterTitle="Ngày đặt" 
              exportFileName={`Don_hang_${customer.id}`} 
              onRowClick={(row) => navigate(`/orders/${row.systemId}`)} 
            />
          </TabsContent>

          {/* Tab: Công nợ */}
          <TabsContent value="debt" className="mt-4">
            <RelatedDataTable 
              data={customerDebtTransactions} 
              columns={debtColumns} 
              searchKeys={['voucherId', 'description', 'creator']} 
              searchPlaceholder="Tìm giao dịch..."
              dateFilterColumn="date"
              dateFilterTitle="Ngày giao dịch"
              exportFileName={`Cong_no_${customer.id}`}
            />
          </TabsContent>

          {/* Tab: Địa chỉ */}
          <TabsContent value="addresses" className="mt-4">
            <CustomerAddresses 
              addresses={customer.addresses || []} 
              onUpdate={(newAddresses) => {
                console.log('[DetailPage] onUpdate called with:', newAddresses);
                console.log('[DetailPage] Current customer:', customer);
                const updatedCustomer = { ...customer, addresses: newAddresses };
                console.log('[DetailPage] Updated customer:', updatedCustomer);
                update(asSystemId(customer.systemId), updatedCustomer);
              }}
            />
          </TabsContent>

          {/* Tab: Sản phẩm đã mua */}
          <TabsContent value="products" className="mt-4">
            <RelatedDataTable 
              data={purchasedProducts} 
              columns={productColumns} 
              searchKeys={['name']} 
              searchPlaceholder="Tìm sản phẩm..." 
              exportFileName={`SP_da_mua_${customer.id}`} 
            />
          </TabsContent>

          {/* Tab: Bảo hành */}
          <TabsContent value="warranty" className="mt-4">
            <Card>
              <CardContent className="p-4">
                {customerWarrantyTickets.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Wrench className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Chưa có phiếu bảo hành nào</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {customerWarrantyTickets.map((ticket) => (
                      <Card 
                        key={ticket.systemId}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => navigate(`/warranty/${ticket.systemId}`)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{ticket.id}</span>
                            <Badge>{ticket.status}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div>MVĐ: {ticket.trackingCode}</div>
                            <div>Ngày tạo: {formatDateUtil(ticket.createdAt)}</div>
                            {ticket.products.length > 0 && (
                              <div>Sản phẩm: {ticket.products.length}</div>
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

          {/* REMOVED: Tab Khiếu nại */}
          {/* <TabsContent value="complaints" className="mt-4">
            <RelatedDataTable 
              data={customerComplaints} 
              columns={complaintColumns} 
              searchKeys={['id', 'title']} 
              searchPlaceholder="Tìm khiếu nại..." 
              dateFilterColumn="createdDate" 
              dateFilterTitle="Ngày tạo" 
              exportFileName={`Khieu_nai_${customer.id}`} 
              onRowClick={(row) => navigate(`/complaints/${row.systemId}`)} 
            />
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  );
}
