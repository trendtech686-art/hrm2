import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Link } from 'react-router-dom';
import { formatDate as formatDateUtil, formatDateTime, formatDateTimeSeconds, formatDateCustom, getCurrentDate, getDaysDiff, parseDate } from '@/lib/date-utils';
import { asSystemId, type SystemId } from '@/lib/id-types';
import { sanitizeToText } from '@/lib/sanitize';
import { 
  calculateHealthScore, 
  calculateChurnRisk, 
  calculateRFMScores, 
  getCustomerSegment,
  getSegmentLabel,
  getSegmentBadgeVariant,
  getHealthScoreLevel
} from './intelligence-utils';
import { calculateLifecycleStage, getLifecycleStageVariant } from './lifecycle-utils';
import { useCustomerStore } from './store.ts';
import type { Customer, CustomerAddress } from './types.ts';
import { useOrderStore } from '../orders/store.ts';
import { useWarrantyStore } from '../warranty/store.ts';
import { useComplaintStore } from '../complaints/store.ts';
import { useReceiptStore } from '../receipts/store.ts';
import { usePaymentStore } from '../payments/store.ts';
import { useEmployeeStore } from '../employees/store.ts';
import { useCustomerTypeStore } from '../settings/customers/customer-types-store';
import { useCustomerGroupStore } from '../settings/customers/customer-groups-store';
import { useCustomerSourceStore } from '../settings/customers/customer-sources-store';
import { usePaymentTermStore } from '../settings/customers/payment-terms-store';
import { useCreditRatingStore } from '../settings/customers/credit-ratings-store';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import { Button } from '../../components/ui/button.tsx';
import { Switch } from '../../components/ui/switch.tsx';
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
  AlertDialogTrigger,
} from '../../components/ui/alert-dialog.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu.tsx';
import { ArrowLeft, Edit, Phone, Mail, ExternalLink, Trash2, AlertTriangle, Clock, CreditCard, TrendingDown, Plus, Eye, MoreHorizontal, Printer, FileSpreadsheet, FileText, HelpCircle, Copy, Link as LinkIcon } from 'lucide-react';
import { Badge } from '../../components/ui/badge.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs.tsx';
import { ProgressiveImage } from '../../components/ui/progressive-image.tsx';
import { RelatedDataTable } from '../../components/data-table/related-data-table.tsx';
import { CustomerAddresses } from './customer-addresses.tsx';
import { CopyableText } from '../../components/shared/copy-button.tsx';
import { useProductStore } from '../products/store.ts';
import { useSalesReturnStore } from '../sales-returns/store.ts';
import { calculateWarrantyExpiry, calculateDaysRemaining, getWarrantyStatusBadge } from '../warranty/utils/warranty-checker.ts';
import type { ColumnDef } from '../../components/data-table/types.ts';
import type { Order, OrderMainStatus } from '../orders/types.ts';
import type { WarrantyTicket } from '../warranty/types.ts';
import type { Complaint } from '../complaints/types.ts';
import { CustomerSlaStatusCard } from './components/sla-status-card';
import { useCustomerSlaEvaluation } from './sla/hooks';
import { useCustomerSlaEngineStore } from './sla/store';
import { getActivityLogs, SLA_LOG_UPDATED_EVENT } from './sla/ack-storage';
import { WARRANTY_STATUS_LABELS, WARRANTY_STATUS_COLORS } from '../warranty/types.ts';
import { complaintStatusLabels, complaintStatusColors, complaintTypeLabels } from '../complaints/types.ts';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import { Comments, type Comment as CommentType } from '../../components/Comments.tsx';
import { ActivityHistory, type HistoryEntry } from '../../components/ActivityHistory.tsx';
import { useAuth } from '../../contexts/auth-context.tsx';

const normalizeCurrencyValue = (value?: number) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return 0;
  return Math.abs(value) < 0.005 ? 0 : value;
};

const formatCurrency = (value?: number) => {
  const normalized = normalizeCurrencyValue(value);
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(normalized);
};

const formatAddress = (street?: string, ward?: string, province?: string) => {
    const address = [street, ward, province].filter(Boolean).join(', ');
    return address || '-';
};

// Simple detail item component - no icons for cleaner look
const DetailItem = ({ label, value, onClick, className = '' }: { 
  label: string; 
  value?: React.ReactNode; 
  onClick?: (() => void) | undefined;
  className?: string;
}) => (
  <div className={`space-y-1 ${className}`}>
    <dt className="text-body-sm text-muted-foreground">{label}</dt>
    <dd 
      className={`text-body-sm font-medium ${onClick ? 'text-primary hover:underline cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {value !== null && value !== undefined && value !== '' ? value : '—'}
    </dd>
  </div>
);

// Stats summary item
const StatItem = ({ label, value, subtext }: { label: string; value: string; subtext?: string }) => (
  <div className="text-center p-4 rounded-lg bg-muted/50">
    <div className="text-h3 font-bold">{value}</div>
    <div className="text-body-sm text-muted-foreground">{label}</div>
    {subtext && <div className="text-body-xs text-muted-foreground mt-1">{subtext}</div>}
  </div>
);

type DrilldownSearch = {
  query: string;
  token: string;
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
    { id: 'status', accessorKey: 'status', header: 'Trạng thái', cell: ({ row }) => {
        let displayStatus = row.status;
        if (row.status === 'Đặt hàng' && (row.stockOutStatus === 'Xuất kho toàn bộ' || row.deliveryStatus === 'Đang giao hàng' || row.deliveryStatus === 'Đã giao hàng')) {
            displayStatus = 'Đang giao dịch';
        }
        return <Badge variant={orderStatusVariants[displayStatus] || orderStatusVariants[row.status]}>{displayStatus}</Badge>;
    }, meta: { displayName: 'Trạng thái'} },
    { id: 'grandTotal', accessorKey: 'grandTotal', header: 'Tổng tiền', cell: ({ row }) => formatCurrency(row.grandTotal), meta: { displayName: 'Tổng tiền'} },
    { id: 'actions', header: 'Hành động', cell: ({ row }) => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Mở menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link to={`/orders/${row.systemId}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        Xem chi tiết
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.print()}>
                    <Printer className="mr-2 h-4 w-4" />
                    In
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.info('Chức năng xuất PDF đang phát triển')}>
                    <FileText className="mr-2 h-4 w-4" />
                    Xuất PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.info('Chức năng xuất Excel đang phát triển')}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Xuất Excel
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ), meta: { displayName: 'Hành động', excludeFromExport: true } },
];

// Extended order type with return info
type OrderWithReturns = Order & {
    returnCount?: number;
    totalReturnValue?: number;
    returnIds?: string[];
};

const productColumns: ColumnDef<{ systemId: string, name: string; quantity: number; orderId: string; orderDate: string; orderSystemId: string; productSystemId: string; warrantyMonths: number; warrantyExpiry: string; daysRemaining: number }>[] = [
    { id: 'orderId', accessorKey: 'orderId', header: 'Mã ĐH', cell: ({ row }) => <Link to={`/orders/${row.orderSystemId}`} className="font-medium text-primary hover:underline">{row.orderId}</Link>, meta: { displayName: 'Mã ĐH'} },
    { id: 'orderDate', accessorKey: 'orderDate', header: 'Ngày mua', cell: ({ row }) => formatDateUtil(row.orderDate), meta: { displayName: 'Ngày mua'} },
    { id: 'name', accessorKey: 'name', header: 'Tên sản phẩm', cell: ({ row }) => <Link to={`/products/${row.productSystemId}`} className="font-medium text-primary hover:underline">{row.name}</Link>, meta: { displayName: 'Tên sản phẩm'} },
    { id: 'quantity', accessorKey: 'quantity', header: 'SL', cell: ({ row }) => row.quantity, meta: { displayName: 'Số lượng'} },
    { id: 'warrantyMonths', accessorKey: 'warrantyMonths', header: 'Bảo hành', cell: ({ row }) => row.warrantyMonths ? `${row.warrantyMonths} tháng` : '—', meta: { displayName: 'Bảo hành'} },
    { id: 'warrantyExpiry', accessorKey: 'warrantyExpiry', header: 'Hết hạn BH', cell: ({ row }) => row.warrantyExpiry ? formatDateUtil(row.warrantyExpiry) : '—', meta: { displayName: 'Hết hạn BH'} },
    { id: 'daysRemaining', accessorKey: 'daysRemaining', header: 'Thời gian còn lại', cell: ({ row }) => {
        if (!row.warrantyMonths) return '—';
        const badge = getWarrantyStatusBadge(row.daysRemaining);
        return <Badge variant={badge.variant}>{badge.label}</Badge>;
    }, meta: { displayName: 'Thời gian còn lại'} },
    { id: 'actions', header: 'Hành động', cell: ({ row }) => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Mở menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link to={`/products/${row.productSystemId}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        Xem sản phẩm
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link to={`/orders/${row.orderSystemId}`}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Xem đơn hàng
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ), meta: { displayName: 'Hành động', excludeFromExport: true } },
];

const warrantyColumns: ColumnDef<WarrantyTicket>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: 'Mã BH',
    cell: ({ row }) => (
      <Link to={`/warranty/${row.systemId}`} className="font-medium text-primary hover:underline">
        {row.id}
      </Link>
    ),
    meta: { displayName: 'Mã BH' },
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => (
      <Badge className={WARRANTY_STATUS_COLORS[row.status] || ''}>
        {WARRANTY_STATUS_LABELS[row.status] || row.status}
      </Badge>
    ),
    meta: { displayName: 'Trạng thái' },
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: 'Ngày tạo',
    cell: ({ row }) => formatDateUtil(row.createdAt),
    meta: { displayName: 'Ngày tạo' },
  },
  {
    id: 'branchName',
    accessorKey: 'branchName',
    header: 'Chi nhánh',
    cell: ({ row }) => row.branchName,
    meta: { displayName: 'Chi nhánh' },
  },
  {
    id: 'trackingCode',
    accessorKey: 'trackingCode',
    header: 'Mã vận đơn',
    cell: ({ row }) => row.trackingCode || '---',
    meta: { displayName: 'Mã vận đơn' },
  },
  {
    id: 'totalProducts',
    header: 'Sản phẩm',
    cell: ({ row }) => row.summary?.totalProducts ?? row.products.length,
    meta: { displayName: 'Sản phẩm' },
  },
  {
    id: 'actions',
    header: 'Hành động',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Mở menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link to={`/warranty/${row.systemId}`}>
              <Eye className="mr-2 h-4 w-4" />
              Xem chi tiết
            </Link>
          </DropdownMenuItem>
          {row.publicTrackingCode && (
            <DropdownMenuItem onClick={() => {
              const trackingUrl = `${window.location.origin}/tracking/warranty/${row.publicTrackingCode}`;
              navigator.clipboard.writeText(trackingUrl);
              toast.success('Đã copy link tracking');
            }}>
              <LinkIcon className="mr-2 h-4 w-4" />
              Copy link tracking
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    meta: { displayName: 'Hành động', excludeFromExport: true },
  },
];

type ComplaintRow = Complaint & { assignedName: string };

const complaintColumns: ColumnDef<ComplaintRow>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: 'Mã KN',
    cell: ({ row }) => (
      <Link to={`/complaints/${row.systemId}`} className="font-medium text-primary hover:underline">
        {row.id}
      </Link>
    ),
    meta: { displayName: 'Mã KN' },
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Trạng thái',
    cell: ({ row }) => (
      <Badge className={complaintStatusColors[row.status] || ''}>
        {complaintStatusLabels[row.status] || row.status}
      </Badge>
    ),
    meta: { displayName: 'Trạng thái' },
  },
  {
    id: 'type',
    accessorKey: 'type',
    header: 'Loại',
    cell: ({ row }) => complaintTypeLabels[row.type] || row.type,
    meta: { displayName: 'Loại' },
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: 'Ngày tạo',
    cell: ({ row }) => formatDateUtil(row.createdAt),
    meta: { displayName: 'Ngày tạo' },
  },
  {
    id: 'assignedName',
    accessorKey: 'assignedName',
    header: 'Nhân viên xử lý',
    cell: ({ row }) => row.assignedTo ? (
      <Link to={`/employees/${row.assignedTo}`} className="text-primary hover:underline">
        {row.assignedName}
      </Link>
    ) : 'Chưa giao',
    meta: { displayName: 'Nhân viên xử lý' },
  },
  {
    id: 'orderCode',
    accessorKey: 'orderCode',
    header: 'Đơn liên quan',
    cell: ({ row }) => (
      <Link to={`/orders/${row.orderSystemId}`} className="text-primary hover:underline">
        {row.orderCode || row.orderSystemId}
      </Link>
    ),
    meta: { displayName: 'Đơn liên quan' },
  },
  {
    id: 'actions',
    header: 'Hành động',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Mở menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link to={`/complaints/${row.systemId}`}>
              <Eye className="mr-2 h-4 w-4" />
              Xem chi tiết
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={`/orders/${row.orderSystemId}`}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Xem đơn hàng
            </Link>
          </DropdownMenuItem>
          {row.publicTrackingCode && (
            <DropdownMenuItem onClick={() => {
              const trackingUrl = `${window.location.origin}/tracking/complaint/${row.publicTrackingCode}`;
              navigator.clipboard.writeText(trackingUrl);
              toast.success('Đã copy link tracking');
            }}>
              <LinkIcon className="mr-2 h-4 w-4" />
              Copy link tracking
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    meta: { displayName: 'Hành động', excludeFromExport: true },
  },
];

// REMOVED: Complaint columns
// const complaintColumns: ColumnDef<Complaint>[] = [
//     { id: 'id', accessorKey: 'id', header: 'Mã KN', cell: ({ row }) => <span className="font-medium">{row.id}</span>, meta: { displayName: 'Mã KN'} },
//     { id: 'title', accessorKey: 'title', header: 'Tiêu đề', cell: ({ row }) => row.title, meta: { displayName: 'Tiêu đề'} },
//     { id: 'createdDate', accessorKey: 'createdDate', header: 'Ngày tạo', cell: ({ row }) => formatDateUtil(row.createdDate), meta: { displayName: 'Ngày tạo'} },
//     { id: 'status', accessorKey: 'status', header: 'Trạng thái', cell: ({ row }) => <Badge variant={complaintStatusVariants[row.status] as any}>{row.status}</Badge>, meta: { displayName: 'Trạng thái'} },
// ];

const debtColumns: ColumnDef<any>[] = [
    { id: 'voucherId', accessorKey: 'voucherId', header: 'Mã phiếu', cell: ({ row }) => {
        const path = row.type === 'order' ? `/orders/${row.originalSystemId}` 
            : row.type === 'receipt' ? `/receipts/${row.originalSystemId}` 
            : row.type === 'sales-return' ? `/returns/${row.originalSystemId}`
            : row.type === 'complaint-payment' ? `/payments/${row.originalSystemId}`
            : `/payments/${row.originalSystemId}`;
        return <Link to={path} className="font-medium text-primary hover:underline">{row.voucherId}</Link>;
    }, meta: { displayName: 'Mã phiếu' } },
    { id: 'creator', accessorKey: 'creator', header: 'Người tạo', cell: ({ row }) => {
        return row.creatorId ? (
            <Link to={`/employees/${row.creatorId}`} className="text-primary hover:underline">{row.creator}</Link>
        ) : (
            <span>{row.creator}</span>
        );
    }, meta: { displayName: 'Người tạo' } },
    { id: 'createdAt', accessorKey: 'createdAt', header: 'Ngày Ghi nhận', cell: ({ row }) => formatDateUtil(row.createdAt), meta: { displayName: 'Ngày Ghi nhận' } },
    { id: 'description', accessorKey: 'description', header: 'Ghi chú', cell: ({ row }) => {
        // Hiển thị badge cho complaint payment
        if (row.type === 'complaint-payment') {
            return (
                <span className="flex items-center gap-1">
                    <span>{row.description}</span>
                    <Badge variant="outline" className="text-[10px] px-1 py-0">Khiếu nại</Badge>
                </span>
            );
        }
        return row.description;
    }, meta: { displayName: 'Ghi chú' } },
    { id: 'change', accessorKey: 'change', header: 'Giá trị thay đổi', cell: ({ row }) => {
        // Hiển thị displayAmount nếu có (cho phiếu chi hoàn tiền từ trả hàng/khiếu nại)
        const displayValue = row.displayAmount !== undefined ? row.displayAmount : row.change;
        const isRefundFromReturn = row.type === 'payment' && row.displayAmount !== undefined;
        const isRefundFromComplaint = row.type === 'complaint-payment';
        return (
            <span className={displayValue > 0 ? 'text-blue-600' : 'text-green-600'}>
                {formatCurrency(displayValue)}
                {(isRefundFromReturn || isRefundFromComplaint) && <span className="text-xs text-muted-foreground ml-1">(tiền mặt)</span>}
            </span>
        );
    }, meta: { displayName: 'Giá trị thay đổi' } },
    { id: 'balance', accessorKey: 'balance', header: 'Công nợ', cell: ({ row }) => <span className="font-semibold">{formatCurrency(row.balance)}</span>, meta: { displayName: 'Công nợ' } },
    { id: 'actions', header: 'Hành động', cell: ({ row }) => {
        const path = row.type === 'order' ? `/orders/${row.originalSystemId}` 
            : row.type === 'receipt' ? `/receipts/${row.originalSystemId}` 
            : row.type === 'sales-return' ? `/returns/${row.originalSystemId}`
            : row.type === 'complaint-payment' ? `/payments/${row.originalSystemId}`
            : `/payments/${row.originalSystemId}`;
        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Mở menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                        <Link to={path}>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => window.print()}>
                        <Printer className="mr-2 h-4 w-4" />
                        In
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.info('Chức năng xuất PDF đang phát triển')}>
                        <FileText className="mr-2 h-4 w-4" />
                        Xuất PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.info('Chức năng xuất Excel đang phát triển')}>
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        Xuất Excel
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }, meta: { displayName: 'Hành động', excludeFromExport: true } },
];

const customerStatusVariants: Partial<Record<Customer["status"], "default" | "secondary" | "destructive">> = {
  "Đang giao dịch": "default",
  "Ngừng Giao Dịch": "secondary",
  active: "default",
  inactive: "secondary",
};

const renderCustomerStatusBadge = (status?: Customer["status"]) => {
  if (!status) return undefined;
  return (
    <Badge variant={customerStatusVariants[status] ?? "secondary"}>
      {status}
    </Badge>
  );
};


export function CustomerDetailPage() {
  const { systemId } = ReactRouterDOM.useParams<{ systemId: string }>();
  const navigate = ReactRouterDOM.useNavigate();
  const { findById, update, data, removeMany } = useCustomerStore();
  const customer = React.useMemo(() => (systemId ? findById(asSystemId(systemId)) : null), [systemId, findById, data]);
  const [activeTab, setActiveTab] = React.useState('info');
  const [orderDrilldownSearch, setOrderDrilldownSearch] = React.useState<DrilldownSearch | null>(null);
  const [warrantyDrilldownSearch, setWarrantyDrilldownSearch] = React.useState<DrilldownSearch | null>(null);
  const [complaintDrilldownSearch, setComplaintDrilldownSearch] = React.useState<DrilldownSearch | null>(null);

  useCustomerSlaEvaluation();

  const { data: allOrders } = useOrderStore();
  const { data: allSalesReturns } = useSalesReturnStore();
  const { data: allWarrantyTickets } = useWarrantyStore();
  const allComplaints = useComplaintStore((state) => state.complaints);
  const { data: allReceipts } = useReceiptStore();
  const { data: allPayments } = usePaymentStore();
  const { findById: findEmployeeById } = useEmployeeStore();
  const { employee: authEmployee } = useAuth();

  // Comments state with localStorage persistence
  type CustomerComment = CommentType<SystemId>;
  const [comments, setComments] = React.useState<CustomerComment[]>(() => {
    const saved = localStorage.getItem(`customer-comments-${systemId}`);
    return saved ? JSON.parse(saved) : [];
  });

  React.useEffect(() => {
    if (systemId) {
      localStorage.setItem(`customer-comments-${systemId}`, JSON.stringify(comments));
    }
  }, [comments, systemId]);

  const handleAddComment = React.useCallback((content: string, parentId?: string) => {
    const newComment: CustomerComment = {
      id: asSystemId(`comment-${Date.now()}`),
      content,
      author: {
        systemId: authEmployee?.systemId ? asSystemId(authEmployee.systemId) : asSystemId('system'),
        name: authEmployee?.fullName || 'Hệ thống',
      },
      createdAt: new Date(),
      parentId: parentId as SystemId | undefined,
    };
    setComments(prev => [...prev, newComment]);
  }, [authEmployee]);

  const handleUpdateComment = React.useCallback((commentId: string, content: string) => {
    setComments(prev => prev.map(c => 
      c.id === commentId ? { ...c, content, updatedAt: new Date() } : c
    ));
  }, []);

  const handleDeleteComment = React.useCallback((commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
  }, []);

  const commentCurrentUser = React.useMemo(() => ({
    systemId: authEmployee?.systemId ? asSystemId(authEmployee.systemId) : asSystemId('system'),
    name: authEmployee?.fullName || 'Hệ thống',
  }), [authEmployee]);

  // Force update logs when SLA action happens
  const [logUpdateTrigger, setLogUpdateTrigger] = React.useState(0);

  React.useEffect(() => {
    const handleLogUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.customerId === customer?.systemId) {
        setLogUpdateTrigger(prev => prev + 1);
      }
    };

    window.addEventListener(SLA_LOG_UPDATED_EVENT, handleLogUpdate);
    return () => window.removeEventListener(SLA_LOG_UPDATED_EVENT, handleLogUpdate);
  }, [customer?.systemId]);

  // Build activity history from customer data
  const activityHistory = React.useMemo((): HistoryEntry[] => {
    if (!customer) return [];
    const entries: HistoryEntry[] = [];
    
    // Created entry
    if (customer.createdAt) {
      entries.push({
        id: `${customer.systemId}-created`,
        action: 'created',
        timestamp: new Date(customer.createdAt),
        user: {
          systemId: customer.createdBy || '',
          name: findEmployeeById(customer.createdBy ? asSystemId(customer.createdBy) : asSystemId(''))?.fullName || 'Hệ thống',
        },
        description: `Tạo hồ sơ khách hàng ${customer.name}`,
      });
    }
    
    // Updated entry
    if (customer.updatedAt && customer.updatedAt !== customer.createdAt) {
      entries.push({
        id: `${customer.systemId}-updated`,
        action: 'updated',
        timestamp: new Date(customer.updatedAt),
        user: {
          systemId: customer.updatedBy || '',
          name: findEmployeeById(customer.updatedBy ? asSystemId(customer.updatedBy) : asSystemId(''))?.fullName || 'Hệ thống',
        },
        description: 'Cập nhật thông tin khách hàng',
      });
    }

    // SLA Activity Logs
    const slaLogs = getActivityLogs(customer.systemId);
    
    const getSlaTypeLabel = (type: string) => {
      switch (type) {
        case 'follow-up': return 'Liên hệ định kỳ';
        case 're-engagement': return 'Kích hoạt lại';
        case 'debt-payment': return 'Thanh toán công nợ';
        case 'warranty-expiry': return 'Hết hạn bảo hành';
        default: return type;
      }
    };

    slaLogs.forEach(log => {
      let actionLabel = 'updated';
      let description = '';
      const slaTypeLabel = getSlaTypeLabel(log.slaType);
      
      switch (log.actionType) {
        case 'acknowledged':
          actionLabel = 'status_changed';
          description = `Đã xác nhận xử lý SLA (${slaTypeLabel})`;
          break;
        case 'snoozed':
          actionLabel = 'status_changed';
          description = `Tạm hoãn SLA (${slaTypeLabel})`;
          break;
        default:
          description = `Cập nhật SLA (${slaTypeLabel})`;
      }

      if (log.notes) {
        description += `: ${log.notes}`;
      }

      entries.push({
        id: log.id,
        action: actionLabel as any,
        timestamp: new Date(log.performedAt),
        user: {
          systemId: 'system', // We don't have user ID in simple log yet, or it's just name
          name: log.performedBy || 'Hệ thống',
        },
        description,
      });
    });
    
    return entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [customer, findEmployeeById, logUpdateTrigger]);

  const focusTab = React.useCallback((tab: string, scrollToSection = false) => {
    setActiveTab(tab);
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
  }, []);

  const buildDrilldownSearch = React.useCallback((query: string): DrilldownSearch => ({
    query,
    token: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
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
  
  // Sales returns for this customer
  const customerSalesReturns = React.useMemo(() => 
    allSalesReturns.filter(sr => sr.customerSystemId === customer?.systemId),
    [allSalesReturns, customer?.systemId]
  );
  
  // Combine orders with their return info
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
  
  // Dynamic columns with return info
  const orderColumnsWithReturns = React.useMemo<ColumnDef<OrderWithReturns>[]>(() => [
    { id: 'id', accessorKey: 'id', header: 'Mã ĐH', cell: ({ row }) => <span className="font-medium">{row.id}</span>, meta: { displayName: 'Mã ĐH'} },
    { id: 'orderDate', accessorKey: 'orderDate', header: 'Ngày đặt', cell: ({ row }) => formatDateUtil(row.orderDate), meta: { displayName: 'Ngày đặt'} },
    { id: 'status', accessorKey: 'status', header: 'Trạng thái', cell: ({ row }) => {
        let displayStatus = row.status;
        if (row.status === 'Đặt hàng' && (row.stockOutStatus === 'Xuất kho toàn bộ' || row.deliveryStatus === 'Đang giao hàng' || row.deliveryStatus === 'Đã giao hàng')) {
            displayStatus = 'Đang giao dịch';
        }
        return <Badge variant={orderStatusVariants[displayStatus] || orderStatusVariants[row.status]}>{displayStatus}</Badge>;
    }, meta: { displayName: 'Trạng thái'} },
    { id: 'grandTotal', accessorKey: 'grandTotal', header: 'Tổng tiền', cell: ({ row }) => formatCurrency(row.grandTotal), meta: { displayName: 'Tổng tiền'} },
    { id: 'returns', header: 'Hoàn trả', cell: ({ row }) => {
        if (!row.returnCount || row.returnCount === 0) {
            return <span className="text-muted-foreground">-</span>;
        }
        return (
            <div className="flex flex-col">
                <span className="text-amber-600 font-medium">{row.returnCount} phiếu</span>
                <span className="text-xs text-muted-foreground">{formatCurrency(row.totalReturnValue || 0)}</span>
            </div>
        );
    }, meta: { displayName: 'Hoàn trả'} },
    { id: 'actions', header: 'Hành động', cell: ({ row }) => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link to={`/orders/${row.systemId}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        Xem chi tiết
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => window.print()}>
                    <Printer className="mr-2 h-4 w-4" />
                    In
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.info('Chức năng xuất PDF đang phát triển')}>
                    <FileText className="mr-2 h-4 w-4" />
                    Xuất PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast.info('Chức năng xuất Excel đang phát triển')}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Xuất Excel
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    ), meta: { displayName: 'Hành động', excludeFromExport: true } },
  ], []);
  
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
  const orderStatusBreakdown = React.useMemo(() => {
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
  
  // Note: Warranty tickets don't have customerId field - they store customer info directly
  // Filter by customer phone number instead
  const customerWarrantyTickets = React.useMemo(() => {
    if (!customer?.phone) return [] as WarrantyTicket[];
    return allWarrantyTickets.filter(t => t.customerPhone === customer.phone);
  }, [allWarrantyTickets, customer?.phone]);
  const customerWarrantyCount = customerWarrantyTickets.length;
  const activeWarrantyCount = React.useMemo(
    () => customerWarrantyTickets.filter(ticket => !['returned', 'completed', 'cancelled'].includes(ticket.status)).length,
    [customerWarrantyTickets]
  );
  
  const customerComplaints = React.useMemo(() => {
    if (!customer) return [] as Complaint[];
    return allComplaints.filter(c => c.customerSystemId === customer.systemId);
  }, [allComplaints, customer?.systemId]);
  const customerComplaintCount = customerComplaints.length;
  const activeComplaintCount = React.useMemo(
    () => customerComplaints.filter(complaint => complaint.status === 'pending' || complaint.status === 'investigating').length,
    [customerComplaints]
  );

  // ============================================
  // REALTIME Customer Intelligence Calculations
  // ============================================
  const realtimeHealthScore = React.useMemo(() => {
    if (!customer) return 0;
    return calculateHealthScore(customer);
  }, [customer]);
  
  const realtimeChurnRisk = React.useMemo(() => {
    if (!customer) return null;
    return calculateChurnRisk(customer);
  }, [customer]);
  
  const realtimeRFMScores = React.useMemo(() => {
    if (!customer) return null;
    // Need all customers for percentile calculation
    return calculateRFMScores(customer, data);
  }, [customer, data]);
  
  const realtimeSegment = React.useMemo(() => {
    if (!realtimeRFMScores) return null;
    return getCustomerSegment(realtimeRFMScores);
  }, [realtimeRFMScores]);
  
  const realtimeLifecycleStage = React.useMemo(() => {
    if (!customer) return null;
    return calculateLifecycleStage(customer);
  }, [customer]);

  const daysSinceLastPurchase = React.useMemo(() => {
    if (!customer?.lastPurchaseDate) return null;
    return getDaysDiff(getCurrentDate(), new Date(customer.lastPurchaseDate));
  }, [customer?.lastPurchaseDate]);

  // Get products store for warranty info
  const { findById: findProductById } = useProductStore();

  const purchasedProducts = React.useMemo(() => {
    const items: Array<{ systemId: string, name: string; quantity: number; orderId: string; orderDate: string; orderSystemId: string; productSystemId: string; warrantyMonths: number; warrantyExpiry: string; daysRemaining: number }> = [];
    customerOrders.forEach(order => {
      order.lineItems.forEach(item => {
        // Lấy thông tin bảo hành từ sản phẩm hoặc mặc định 12 tháng
        const product = item.productSystemId ? findProductById(asSystemId(item.productSystemId)) : null;
        const warrantyMonths = (item as any).warrantyPeriodMonths || product?.warrantyPeriodMonths || 0;
        const warrantyExpiry = warrantyMonths > 0 ? calculateWarrantyExpiry(order.orderDate, warrantyMonths) : '';
        const daysRemaining = warrantyExpiry ? calculateDaysRemaining(warrantyExpiry) : 0;
        
        items.push({
          systemId: `${order.systemId}-${item.productId}-${Math.random()}`, // Ensure uniqueness
          name: item.productName,
          quantity: item.quantity,
          orderId: order.id,
          orderDate: order.orderDate,
          orderSystemId: order.systemId,
          productSystemId: item.productSystemId,
          warrantyMonths,
          warrantyExpiry,
          daysRemaining,
        });
      });
    });
    return items.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());
  }, [customerOrders, findProductById]);
  
  const customerDebtTransactions = React.useMemo(() => {
    if (!customer) return [];

    // Helper: get timestamp for sorting - prefer createdAt, fallback to date field
    const getTimestamp = (createdAt: string | undefined, fallbackDate: string): number => {
        const parsed = parseDate(createdAt || fallbackDate);
        return parsed?.getTime() || 0;
    };

    const orderTransactions = deliveredCustomerOrders.map(order => ({
        systemId: `order-${order.systemId}`,
        voucherId: order.id,
        originalSystemId: order.systemId,
        type: 'order',
        creator: order.salesperson,
        creatorId: order.salespersonSystemId,
        date: order.orderDate,
        createdAt: order.createdAt || order.orderDate, // Ưu tiên createdAt, fallback orderDate
        _sortTimestamp: getTimestamp(order.createdAt, order.orderDate),
        description: `Đơn hàng #${order.id}`,
        // ✅ Use grandTotal (không trừ paidAmount) vì phiếu thu đã được tính riêng ở receiptTransactions
        // Nếu dùng grandTotal - paidAmount sẽ bị tính trùng khi phiếu thu đã auto-allocate vào order
        change: order.grandTotal || 0,
    }));

    // ✅ Chỉ tính phiếu thu có affectsDebt=true, chưa hủy, và đúng khách hàng (theo systemId)
    const receiptTransactions = allReceipts
        .filter(r => 
            r.status !== 'cancelled' && 
            r.affectsDebt === true && 
            (r.customerSystemId === customer.systemId || r.payerSystemId === customer.systemId || 
             (r.payerTypeName === 'Khách hàng' && r.payerName === customer.name))
        )
        .map(receipt => ({
            systemId: `receipt-${receipt.systemId}`,
            voucherId: receipt.id,
            originalSystemId: receipt.systemId,
            type: 'receipt',
            creator: getEmployeeName(receipt.createdBy) || receipt.createdBy,
            creatorId: receipt.createdBy,
            date: receipt.date,
            createdAt: receipt.createdAt || receipt.date, // Fallback to date if createdAt not set
            _sortTimestamp: getTimestamp(receipt.createdAt, receipt.date),
            description: receipt.description,
            change: -receipt.amount,
        }));

    // ✅ Phiếu chi có ảnh hưởng công nợ (KHÔNG phải hoàn tiền từ trả hàng)
    const paymentTransactionsWithDebt = allPayments
        .filter(p => 
            p.status !== 'cancelled' && 
            p.affectsDebt === true && 
            !p.linkedSalesReturnSystemId &&
            (p.customerSystemId === customer.systemId || p.recipientSystemId === customer.systemId ||
             (p.recipientTypeName === 'Khách hàng' && p.recipientName === customer.name))
        )
        .map(payment => {
            const isRefundToCustomer = payment.paymentReceiptTypeName === 'Hoàn tiền khách hàng' || 
                                       payment.category === 'complaint_refund';
            return {
                systemId: `payment-${payment.systemId}`,
                voucherId: payment.id,
                originalSystemId: payment.systemId,
                type: 'payment',
                creator: getEmployeeName(payment.createdBy) || payment.createdBy,
                creatorId: payment.createdBy,
                date: payment.date,
                createdAt: payment.createdAt || payment.date,
                _sortTimestamp: getTimestamp(payment.createdAt, payment.date),
                description: payment.description,
                change: isRefundToCustomer ? -payment.amount : payment.amount,
            };
        });

    // ✅ Phiếu chi hoàn tiền từ trả hàng - hiển thị nhưng KHÔNG ảnh hưởng công nợ (change = 0)
    const refundPaymentTransactions = allPayments
        .filter(p => 
            p.status !== 'cancelled' && 
            p.linkedSalesReturnSystemId &&
            (p.customerSystemId === customer.systemId || p.recipientSystemId === customer.systemId ||
             (p.recipientTypeName === 'Khách hàng' && p.recipientName === customer.name))
        )
        .map(payment => ({
            systemId: `payment-${payment.systemId}`,
            voucherId: payment.id,
            originalSystemId: payment.systemId,
            type: 'payment',
            creator: getEmployeeName(payment.createdBy) || payment.createdBy,
            creatorId: payment.createdBy,
            date: payment.date,
            createdAt: payment.createdAt || payment.date,
            _sortTimestamp: getTimestamp(payment.createdAt, payment.date),
            description: payment.description,
            // Hiển thị số tiền hoàn nhưng KHÔNG ảnh hưởng công nợ
            displayAmount: -payment.amount,
            change: 0,
        }));
    
    // ✅ Phiếu chi hoàn tiền từ khiếu nại - hiển thị nhưng KHÔNG ảnh hưởng công nợ (change = 0)
    const complaintRefundPaymentTransactions = allPayments
        .filter(p => 
            p.status !== 'cancelled' && 
            p.linkedComplaintSystemId &&
            !p.linkedSalesReturnSystemId && // Exclude if already in refundPaymentTransactions
            (p.customerSystemId === customer.systemId || p.recipientSystemId === customer.systemId ||
             (p.recipientTypeName === 'Khách hàng' && p.recipientName === customer.name))
        )
        .map(payment => ({
            systemId: `complaint-payment-${payment.systemId}`,
            voucherId: payment.id,
            originalSystemId: payment.systemId,
            type: 'complaint-payment',
            creator: getEmployeeName(payment.createdBy) || payment.createdBy,
            creatorId: payment.createdBy,
            date: payment.date,
            createdAt: payment.createdAt || payment.date,
            _sortTimestamp: getTimestamp(payment.createdAt, payment.date),
            description: payment.description || 'Hoàn tiền khiếu nại',
            // Hiển thị số tiền hoàn nhưng KHÔNG ảnh hưởng công nợ
            displayAmount: -payment.amount,
            change: 0,
        }));

    // Combine tất cả transactions
    const allTransactions = [...orderTransactions, ...receiptTransactions, ...paymentTransactionsWithDebt, ...refundPaymentTransactions, ...complaintRefundPaymentTransactions];
    // ✅ Sort theo _sortTimestamp (thời điểm tạo đã parse)
    allTransactions.sort((a, b) => a._sortTimestamp - b._sortTimestamp);
    
    let runningDebt = 0;
    const transactionsWithBalance = allTransactions.map(t => {
        runningDebt += t.change;
        return { ...t, balance: runningDebt };
    });

    return transactionsWithBalance.reverse();
  }, [customer, deliveredCustomerOrders, allReceipts, allPayments, getEmployeeName]);

  const warrantyTableData = React.useMemo(() => {
    return [...customerWarrantyTickets].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [customerWarrantyTickets]);

  const complaintTableData = React.useMemo<ComplaintRow[]>(() => {
    return customerComplaints
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map(complaint => ({
        ...complaint,
        assignedName: complaint.assignedTo ? (getEmployeeName(complaint.assignedTo) || complaint.assignedTo) : '',
      }));
  }, [customerComplaints, getEmployeeName]);

  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  
  // Get SLA entry for header badges
  const slaEntry = useCustomerSlaEngineStore((state) => customer ? state.index?.entries[customer.systemId] : null);
  
  const handleDeleteCustomer = React.useCallback(() => {
    if (customer) {
      removeMany([customer.systemId]);
      toast.success(`Đã chuyển khách hàng ${customer.name} vào thùng rác`);
      navigate('/customers');
    }
  }, [customer, removeMany, navigate]);

  const headerActions = React.useMemo(() => [
    <Button key="delete" variant="outline" size="sm" className="h-9 text-destructive hover:text-destructive" onClick={() => setDeleteDialogOpen(true)}>
      <Trash2 className="mr-2 h-4 w-4" />
      Chuyển vào thùng rác
    </Button>,
    <Button key="edit" size="sm" className="h-9" onClick={() => navigate(`/customers/${systemId}/edit`)}>
      <Edit className="mr-2 h-4 w-4" />
      Chỉnh sửa
    </Button>
  ], [navigate, systemId]);

  // ✅ Build header badges with SLA alerts
  const headerBadges = React.useMemo(() => {
    const badges: React.ReactNode[] = [];
    
    // Customer status badge
    if (customer?.status) {
      badges.push(
        <Badge key="status" variant={customerStatusVariants[customer.status] ?? "secondary"}>
          {customer.status}
        </Badge>
      );
    }
    
    // SLA alert badges
    if (slaEntry) {
      // Overdue SLA alerts
      const overdueAlerts = slaEntry.alerts?.filter(a => a.alertLevel === 'overdue') || [];
      if (overdueAlerts.length > 0) {
        badges.push(
          <Badge key="sla-overdue" variant="destructive" className="gap-1">
            <Clock className="h-3 w-3" />
            {overdueAlerts.length} SLA quá hạn
          </Badge>
        );
      }
      
      // Debt alert
      if (slaEntry.debtAlert) {
        badges.push(
          <Badge key="debt-alert" variant="destructive" className="gap-1">
            <CreditCard className="h-3 w-3" />
            Nợ quá hạn
          </Badge>
        );
      }
      
      // Churn risk alert
      if (slaEntry.healthAlert && slaEntry.healthAlert.churnRisk === 'high') {
        badges.push(
          <Badge key="churn-alert" className="gap-1 bg-purple-600 hover:bg-purple-700">
            <TrendingDown className="h-3 w-3" />
            Rủi ro cao
          </Badge>
        );
      }
    }
    
    return badges.length > 0 ? (
      <div className="flex items-center gap-2 flex-wrap">
        {badges}
      </div>
    ) : undefined;
  }, [customer?.status, slaEntry]);

  usePageHeader({
    title: customer?.name || 'Chi tiết Khách hàng',
    subtitle: customer?.tags?.length ? customer.tags.join(', ') : undefined,
    badge: headerBadges,
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Khách hàng', href: '/customers', isCurrent: false },
      { label: customer?.name || 'Chi tiết', href: '', isCurrent: true },
    ],
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

  const currentDebt = React.useMemo(() => 
    customerDebtTransactions.length > 0 ? customerDebtTransactions[0].balance : 0,
    [customerDebtTransactions]
  );
  const unresolvedFailedDeliveries = failedDeliveryOrders.length;
  const totalFailedDeliveries = React.useMemo(
    () => (customer?.failedDeliveries ?? unresolvedFailedDeliveries),
    [customer?.failedDeliveries, unresolvedFailedDeliveries]
  );
  const orderStatusEntries = React.useMemo(
    () => ([
      { key: 'hoanThanh', label: 'Hoàn thành', count: orderStatusBreakdown.hoanThanh, status: 'Hoàn thành' as OrderMainStatus },
      { key: 'dangGiaoDich', label: 'Đang giao dịch', count: orderStatusBreakdown.dangGiaoDich, status: 'Đang giao dịch' as OrderMainStatus },
      { key: 'datHang', label: 'Đặt hàng', count: orderStatusBreakdown.datHang, status: 'Đặt hàng' as OrderMainStatus },
      { key: 'daHuy', label: 'Đã hủy', count: orderStatusBreakdown.daHuy, status: 'Đã hủy' as OrderMainStatus },
    ]),
    [orderStatusBreakdown]
  );

  // DEBUG: Check if values are calculated
  // console.log('CustomerDetail Debug:', { 
  //   realtimeChurnRisk, 
  //   realtimeHealthScore,
  //   slaLogsCount: getActivityLogs(customer?.systemId).length 
  // });

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

      <div className="w-full h-full">
        <div className="space-y-6">
          {/* Stats Summary - Compact layout */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
            {/* Tổng chi tiêu */}
            <Card
              role="button"
              tabIndex={0}
              onClick={() => handleOrderStatusFilter('Hoàn thành')}
              className="cursor-pointer transition hover:border-primary/50"
            >
              <CardContent className="p-3">
                <div className="text-[11px] text-muted-foreground">Chi tiêu</div>
                <div className="text-body-base font-bold">{formatCurrency(totalSpent)}</div>
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
                <div className="text-[11px] text-muted-foreground">Đơn hàng</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-body-base font-bold">{customerOrders.length}</span>
                  {orderStatusBreakdown.hoanThanh > 0 && (
                    <span className="text-[10px] text-green-600">Hoàn thành: {orderStatusBreakdown.hoanThanh}</span>
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
                <div className="text-[11px] text-muted-foreground">Công nợ</div>
                <div className="text-body-base font-bold">{formatCurrency(currentDebt)}</div>
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
                <div className="text-[11px] text-muted-foreground">Bảo hành</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-body-base font-bold">{customerWarrantyTickets.length}</span>
                  {activeWarrantyCount > 0 && (
                    <span className="text-[10px] text-orange-600">Chưa xử lý: {activeWarrantyCount}</span>
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
                <div className="text-[11px] text-muted-foreground">Khiếu nại</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-body-base font-bold">{customerComplaints.length}</span>
                  {activeComplaintCount > 0 && (
                    <span className="text-[10px] text-red-600">Đang xử lý: {activeComplaintCount}</span>
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
                <div className="text-[11px] text-muted-foreground">GH lỗi</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-body-base font-bold">{totalFailedDeliveries}</span>
                  {unresolvedFailedDeliveries > 0 && (
                    <span className="text-[10px] text-orange-600">chờ giao lại: {unresolvedFailedDeliveries}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="info">Thông tin</TabsTrigger>
            <TabsTrigger value="business">Doanh nghiệp</TabsTrigger>
            <TabsTrigger value="payment">Thanh toán</TabsTrigger>
            <TabsTrigger value="purchase-history">Đơn hàng</TabsTrigger>
            <TabsTrigger value="debt">Công nợ</TabsTrigger>
            <TabsTrigger value="sla">SLA</TabsTrigger>
            <TabsTrigger value="contacts">Liên hệ</TabsTrigger>
            <TabsTrigger value="addresses">Địa chỉ</TabsTrigger>
            <TabsTrigger value="products">Sản phẩm</TabsTrigger>
            <TabsTrigger value="warranty">Bảo hành</TabsTrigger>
            <TabsTrigger value="complaints">Khiếu nại</TabsTrigger>
          </TabsList>

          {/* Tab: Thông tin chung */}
          <TabsContent value="info" id="customer-tab-info" className="space-y-6 mt-6">
            {/* Images Section */}
            {customer.images && customer.images.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-body-base font-medium">Hình ảnh</CardTitle>
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
                          <Badge className="absolute top-1.5 left-1.5 text-body-xs" variant="secondary">
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
                <CardTitle className="text-body-base font-medium">Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
                  <CopyableText label="Mã khách hàng" value={customer.id} />
                  <CopyableText label="Tên khách hàng" value={customer.name} />
                  <CopyableText label="Email" value={customer.email} />
                  <CopyableText label="Số điện thoại" value={customer.phone} />
                  <CopyableText label="Zalo" value={customer.zaloPhone} />
                </dl>
              </CardContent>
            </Card>

            {/* Phân loại */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-body-base font-medium">Phân loại</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
                  <DetailItem label="Loại khách hàng" value={getTypeName(customer.type)} />
                  <DetailItem label="Nhóm khách hàng" value={getGroupName(customer.customerGroup)} />
                  <DetailItem label="Nguồn" value={getSourceName(customer.source)} />
                  <DetailItem label="Chiến dịch" value={customer.campaign} />
                  <DetailItem 
                    label="Người giới thiệu" 
                    value={customer.referredBy ? findById(asSystemId(customer.referredBy))?.name : undefined}
                    onClick={customer.referredBy ? () => navigate(`/customers/${customer.referredBy}`) : undefined}
                  />
                  <DetailItem label="Bảng giá" value={customer.pricingLevel} />
                </dl>
              </CardContent>
            </Card>

            {/* Chỉ số khách hàng - Tính toán REALTIME */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-body-base font-medium">Chỉ số khách hàng</CardTitle>
                <p className="text-body-xs text-muted-foreground mt-1">Phân tích hành vi mua hàng để đánh giá mức độ trung thành và rủi ro (tính toán realtime)</p>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-4">
                  {/* Điểm sức khỏe KH - với Tooltip */}
                  <div className="space-y-1">
                    <dt className="text-body-sm text-muted-foreground flex items-center gap-1">
                      Điểm sức khỏe KH
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <div className="text-body-xs space-y-1">
                              <p className="font-semibold">Cách tính điểm (tổng 100):</p>
                              <ul className="list-disc list-inside space-y-0.5">
                                <li><strong>Recency (30đ):</strong> Thời gian từ lần mua gần nhất</li>
                                <li><strong>Frequency (25đ):</strong> Tổng số đơn hàng</li>
                                <li><strong>Monetary (30đ):</strong> Tổng chi tiêu</li>
                                <li><strong>Payment (15đ):</strong> Tỷ lệ sử dụng hạn mức công nợ</li>
                              </ul>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </dt>
                    <dd>
                      <span className={`text-h4 font-bold ${realtimeHealthScore >= 70 ? 'text-green-600' : realtimeHealthScore >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {realtimeHealthScore}/100
                      </span>
                      <p className="text-body-xs text-muted-foreground mt-1">
                        {getHealthScoreLevel(realtimeHealthScore).label}
                      </p>
                    </dd>
                  </div>

                  {/* Vòng đời khách hàng */}
                  <div className="space-y-1">
                    <dt className="text-body-sm text-muted-foreground">Vòng đời</dt>
                    <dd>
                      <Badge variant={getLifecycleStageVariant(realtimeLifecycleStage || undefined)}>{realtimeLifecycleStage}</Badge>
                      <p className="text-body-xs text-muted-foreground mt-1">
                        {daysSinceLastPurchase !== null 
                          ? `Mua cách đây ${daysSinceLastPurchase} ngày`
                          : 'Chưa mua hàng'}
                      </p>
                    </dd>
                  </div>

                  {/* Phân khúc RFM */}
                  {realtimeSegment && (
                    <div className="space-y-1">
                      <dt className="text-body-sm text-muted-foreground">Phân khúc RFM</dt>
                      <dd>
                        <Badge variant={getSegmentBadgeVariant(realtimeSegment)}>{getSegmentLabel(realtimeSegment)}</Badge>
                        <p className="text-body-xs text-muted-foreground mt-1">{realtimeSegment}</p>
                      </dd>
                    </div>
                  )}

                  {/* Điểm RFM */}
                  {realtimeRFMScores && (
                    <div className="space-y-1">
                      <dt className="text-body-sm text-muted-foreground">Điểm RFM</dt>
                      <dd>
                        <div className="flex flex-wrap gap-1">
                          <Badge variant="outline" title="Recency - Thời gian từ lần mua gần nhất (1-5, cao = mua gần đây)">R: {realtimeRFMScores.recency}</Badge>
                          <Badge variant="outline" title="Frequency - Tần suất mua hàng (1-5, cao = mua thường xuyên)">F: {realtimeRFMScores.frequency}</Badge>
                          <Badge variant="outline" title="Monetary - Giá trị đơn hàng (1-5, cao = chi tiêu nhiều)">M: {realtimeRFMScores.monetary}</Badge>
                        </div>
                      </dd>
                    </div>
                  )}

                  {/* Rủi ro rời bỏ */}
                  {realtimeChurnRisk && (
                    <div className="space-y-1">
                      <dt className="text-body-sm text-muted-foreground flex items-center gap-1">
                        Rủi ro rời bỏ
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-sm p-4">
                              <div className="text-body-xs space-y-3">
                                <p className="font-semibold text-base">Cách tính điểm sức khỏe (Health Score):</p>
                                
                                <div className="space-y-1">
                                  <p className="font-medium">1. Recency (Thời gian mua gần nhất) - Tối đa 30đ:</p>
                                  <ul className="list-disc list-inside pl-1 text-muted-foreground">
                                    <li>Mua trong 7 ngày: +30đ</li>
                                    <li>Mua trong 30 ngày: +25đ</li>
                                    <li>...giảm dần...</li>
                                    <li>Trên 1 năm: +5đ</li>
                                  </ul>
                                </div>

                                <div className="space-y-1">
                                  <p className="font-medium">2. Frequency (Tần suất mua) - Tối đa 25đ:</p>
                                  <ul className="list-disc list-inside pl-1 text-muted-foreground">
                                    <li>Trên 20 đơn: +25đ</li>
                                    <li>Trên 10 đơn: +20đ</li>
                                    <li>...giảm dần...</li>
                                  </ul>
                                </div>

                                <div className="space-y-1">
                                  <p className="font-medium">3. Monetary (Tổng chi tiêu) - Tối đa 30đ:</p>
                                  <ul className="list-disc list-inside pl-1 text-muted-foreground">
                                    <li>Trên 500 triệu: +30đ</li>
                                    <li>Trên 200 triệu: +25đ</li>
                                    <li>...giảm dần...</li>
                                  </ul>
                                </div>

                                <div className="space-y-1">
                                  <p className="font-medium">4. Payment Behavior (Hành vi thanh toán) - Tối đa 15đ:</p>
                                  <p className="text-muted-foreground mb-1">Dựa trên tỷ lệ nợ hiện tại / hạn mức tín dụng.</p>
                                  <ul className="list-disc list-inside pl-1 text-muted-foreground">
                                    <li>Dùng &lt; 20% hạn mức: +15đ (Tốt)</li>
                                    <li>Dùng &gt; 80% hạn mức: 0đ (Rủi ro)</li>
                                    <li>Nếu không có hạn mức nợ: Mặc định +15đ</li>
                                  </ul>
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </dt>
                      <dd>
                        <Badge variant={realtimeChurnRisk.variant}>
                          {realtimeChurnRisk.label}
                        </Badge>
                        <p className="text-body-xs text-muted-foreground mt-1">
                          {realtimeChurnRisk.reason}
                        </p>
                      </dd>
                    </div>
                  )}

                  {/* Tỷ lệ công nợ/Hạn mức */}
                  {customer.maxDebt && customer.maxDebt > 0 && (
                    <div className="space-y-1">
                      <dt className="text-body-sm text-muted-foreground">Tỷ lệ công nợ/Hạn mức</dt>
                      <dd>
                        {(() => {
                          const debtRatio = ((currentDebt || 0) / customer.maxDebt) * 100;
                          const variant = debtRatio >= 90 ? 'destructive' : debtRatio >= 70 ? 'warning' : 'success';
                          return (
                            <>
                              <span className={`text-h4 font-bold ${variant === 'destructive' ? 'text-red-600' : variant === 'warning' ? 'text-yellow-600' : 'text-green-600'}`}>
                                {debtRatio.toFixed(0)}%
                              </span>
                              <p className="text-body-xs text-muted-foreground mt-1">
                                {formatCurrency(currentDebt)} / {formatCurrency(customer.maxDebt)}
                              </p>
                            </>
                          );
                        })()}
                      </dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>

            {/* Ngân hàng & Mạng xã hội */}
            {(customer.bankName || customer.bankAccount || customer.social?.website || customer.social?.facebook || customer.social?.linkedin) && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-body-base font-medium">Ngân hàng & Mạng xã hội</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
                    <DetailItem label="Ngân hàng" value={customer.bankName} />
                    <CopyableText label="Số tài khoản" value={customer.bankAccount} />
                    {customer.social?.website && (
                      <div className="space-y-1">
                        <dt className="text-body-sm text-muted-foreground">Website</dt>
                        <dd>
                          <a 
                            href={customer.social.website.startsWith('http') ? customer.social.website : `https://${customer.social.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-body-sm text-primary hover:underline inline-flex items-center gap-1"
                          >
                            {customer.social.website}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </dd>
                      </div>
                    )}
                    {customer.social?.facebook && (
                      <div className="space-y-1">
                        <dt className="text-body-sm text-muted-foreground">Facebook</dt>
                        <dd>
                          <a 
                            href={customer.social.facebook.startsWith('http') ? customer.social.facebook : `https://facebook.com/${customer.social.facebook}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-body-sm text-primary hover:underline inline-flex items-center gap-1"
                          >
                            {customer.social.facebook}
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </dd>
                      </div>
                    )}
                    {customer.social?.linkedin && (
                      <DetailItem label="Instagram" value={customer.social.linkedin} />
                    )}
                  </dl>
                </CardContent>
              </Card>
            )}

            {/* Thống kê mua hàng */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-body-base font-medium">Thống kê mua hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
                  <DetailItem label="Tổng đơn hàng" value={customer.totalOrders?.toString()} />
                  <DetailItem label="Tổng chi tiêu" value={formatCurrency(customer.totalSpent)} />
                  <DetailItem label="SL đã mua" value={customer.totalQuantityPurchased?.toString()} />
                  <DetailItem label="SL trả lại" value={customer.totalQuantityReturned?.toString()} />
                  <DetailItem label="Lần mua gần nhất" value={formatDateUtil(customer.lastPurchaseDate)} />
                  <DetailItem label="Giao hàng thất bại" value={customer.failedDeliveries?.toString()} />
                </dl>
              </CardContent>
            </Card>

            {/* Quản lý */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-body-base font-medium">Quản lý</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
                  <DetailItem 
                    label="NV phụ trách" 
                    value={customer.accountManagerName || getEmployeeName(customer.accountManagerId)}
                    onClick={customer.accountManagerId ? () => navigate(`/employees/${customer.accountManagerId}`) : undefined}
                  />
                  <DetailItem label="Ngày tạo" value={formatDateUtil(customer.createdAt)} />
                  <DetailItem 
                    label="Người tạo" 
                    value={getEmployeeName(customer.createdBy)}
                    onClick={customer.createdBy ? () => navigate(`/employees/${customer.createdBy}`) : undefined}
                  />
                  <DetailItem label="Cập nhật" value={formatDateUtil(customer.updatedAt)} />
                  <DetailItem 
                    label="Người cập nhật" 
                    value={getEmployeeName(customer.updatedBy)}
                    onClick={customer.updatedBy ? () => navigate(`/employees/${customer.updatedBy}`) : undefined}
                  />
                </dl>
              </CardContent>
            </Card>

            {/* Ghi chú */}
            {customer.notes && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-body-base font-medium">Ghi chú</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-body-sm text-muted-foreground whitespace-pre-wrap">{sanitizeToText(customer.notes)}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Thông tin doanh nghiệp */}
          <TabsContent value="business" id="customer-tab-business" className="space-y-6 mt-6">
            {(customer.company || customer.taxCode || customer.representative || customer.position) ? (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-body-base font-medium">Thông tin doanh nghiệp</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
                    <CopyableText label="Công ty" value={customer.company} />
                    <CopyableText label="Mã số thuế" value={customer.taxCode} />
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

            {/* Hợp đồng */}
            {customer.contract && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-body-base font-medium">Hợp đồng</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
                    <DetailItem label="Số hợp đồng" value={customer.contract.number} />
                    <DetailItem label="Ngày bắt đầu" value={formatDateUtil(customer.contract.startDate)} />
                    <DetailItem label="Ngày kết thúc" value={formatDateUtil(customer.contract.endDate)} />
                    <DetailItem label="Giá trị" value={formatCurrency(customer.contract.value)} />
                    {customer.contract.fileUrl && (
                      <div className="space-y-1">
                        <dt className="text-body-sm text-muted-foreground">File hợp đồng</dt>
                        <dd>
                          <a 
                            href={customer.contract.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-body-sm text-primary hover:underline inline-flex items-center gap-1"
                          >
                            Xem tài liệu <ExternalLink className="h-3 w-3" />
                          </a>
                        </dd>
                      </div>
                    )}
                    {customer.contract.status && (
                      <div className="space-y-1">
                        <dt className="text-body-sm text-muted-foreground">Trạng thái</dt>
                        <dd>
                          <Badge variant={
                            customer.contract.status === 'Active' ? 'success' :
                            customer.contract.status === 'Expired' ? 'destructive' :
                            customer.contract.status === 'Pending' ? 'warning' :
                            'secondary'
                          }>
                            {customer.contract.status === 'Active' ? 'Đang hiệu lực' : 
                             customer.contract.status === 'Expired' ? 'Hết hạn' :
                             customer.contract.status === 'Pending' ? 'Chờ duyệt' :
                             customer.contract.status === 'Cancelled' ? 'Đã hủy' : customer.contract.status}
                          </Badge>
                        </dd>
                      </div>
                    )}
                  </dl>
                  {customer.contract.details && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="text-body-sm text-muted-foreground mb-1">Chi tiết điều khoản</div>
                      <p className="text-body-sm whitespace-pre-wrap">{customer.contract.details}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Tab: Thanh toán */}
          <TabsContent value="payment" id="customer-tab-payment" className="space-y-6 mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-body-base font-medium">Thanh toán & Tín dụng</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-4">
                  <DetailItem label="Hạn thanh toán" value={getPaymentTermName(customer.paymentTerms)} />
                  <DetailItem label="Xếp hạng tín dụng" value={getCreditRatingName(customer.creditRating)} />
                  <DetailItem label="Cho phép công nợ" value={customer.allowCredit ? 'Có' : 'Không'} />
                  <DetailItem label="Giảm giá mặc định" value={customer.defaultDiscount ? `${customer.defaultDiscount}%` : undefined} />
                  <DetailItem label="Công nợ hiện tại" value={formatCurrency(currentDebt)} />
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
              searchKeys={['id', 'status', 'deliveryStatus']} 
              searchPlaceholder="Tìm theo mã ĐH..." 
              dateFilterColumn="orderDate" 
              dateFilterTitle="Ngày đặt" 
              exportFileName={`Don_hang_${customer.id}`} 
              onRowClick={(row) => navigate(`/orders/${row.systemId}`)} 
              controlledSearch={orderDrilldownSearch}
              onControlledSearchApplied={handleOrderSearchApplied}
              showCheckbox
              defaultSorting={{ id: 'orderDate', desc: true }}
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
            />
          </TabsContent>

          {/* Tab: Địa chỉ */}
          <TabsContent value="addresses" id="customer-tab-addresses" className="mt-4">
            <CustomerAddresses 
              addresses={customer.addresses || []} 
              onUpdate={(newAddresses) => {
                const updatedCustomer = { ...customer, addresses: newAddresses };
                update(asSystemId(customer.systemId), updatedCustomer);
              }}
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
              onRowClick={(row) => navigate(`/warranty/${row.systemId}`)}
              controlledSearch={warrantyDrilldownSearch}
              onControlledSearchApplied={handleWarrantySearchApplied}
              showCheckbox
              defaultSorting={{ id: 'createdAt', desc: true }}
            />
          </TabsContent>

          {/* Tab: SLA */}
          <TabsContent value="sla" id="customer-tab-sla" className="mt-4">
            <CustomerSlaStatusCard customer={customer} />
          </TabsContent>

          {/* Tab: Liên hệ */}
          <TabsContent value="contacts" id="customer-tab-contacts" className="mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-body-base font-medium">Danh sách liên hệ</CardTitle>
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
                          <Badge className="absolute top-2 right-2 text-body-xs" variant="success">
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
                              <div className="text-body-sm text-muted-foreground truncate">{contact.role}</div>
                            </div>
                          </div>
                          <div className="space-y-1.5 text-body-sm">
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
              onRowClick={(row) => navigate(`/complaints/${row.systemId}`)}
              controlledSearch={complaintDrilldownSearch}
              onControlledSearchApplied={handleComplaintSearchApplied}
              showCheckbox
              defaultSorting={{ id: 'createdAt', desc: true }}
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
        <ActivityHistory
          history={activityHistory}
          title="Lịch sử hoạt động"
          emptyMessage="Chưa có lịch sử hoạt động"
          groupByDate
          maxHeight="600px"
        />
      </div>
    </div>
    </>
  );
}
