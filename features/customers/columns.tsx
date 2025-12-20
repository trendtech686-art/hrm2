import * as React from "react";
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, getCurrentDate, isValidDate, getDaysDiff } from '@/lib/date-utils';
import type { Customer } from './types'
import { calculateLifecycleStage, getLifecycleStageVariant } from './lifecycle-utils';
import { getCreditAlertLevel, getCreditAlertBadgeVariant, getCreditAlertText } from './credit-utils';
import { 
  calculateHealthScore, 
  getHealthScoreLevel,
  calculateRFMScores,
  getCustomerSegment,
  getSegmentLabel,
  getSegmentBadgeVariant,
  calculateChurnRisk
} from './intelligence-utils';
import { 
  calculateDebtTrackingInfo, 
  getDebtStatusVariant,
  formatDebtDate 
} from './debt-tracking-utils';
import { Checkbox } from "../../components/ui/checkbox"
import { DataTableColumnHeader } from "../../components/data-table/data-table-column-header"
import { Badge } from "../../components/ui/badge"
import { Progress } from "../../components/ui/progress"
import type { ColumnDef } from '../../components/data-table/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import { MoreHorizontal, RotateCcw, AlertTriangle } from "lucide-react";
import type { CustomerSlaIndex } from './sla/types';
import { SLA_TYPE_BADGES } from './sla/constants';
import { formatDaysRemaining, getAlertBadgeVariant } from '../reports/customer-sla-report/sla-utils';
const formatCurrency = (value?: number) => {
    if (typeof value !== 'number') return '';
    return new Intl.NumberFormat('vi-VN').format(value);
};

type ColumnOptions = {
  slaIndex?: CustomerSlaIndex | null;
};

export const getColumns = (
  onDelete: (systemId: string) => void,
  onRestore: (systemId: string) => void,
  navigate: (path: string) => void,
  options?: ColumnOptions,
): ColumnDef<Customer>[] => [
  {
    id: "select",
    header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll }) => (
        <Checkbox
          checked={isAllPageRowsSelected ? true : isSomePageRowsSelected ? "indeterminate" : false}
          onCheckedChange={(value) => onToggleAll?.(!!value)}
          aria-label="Select all"
        />
    ),
    cell: ({ isSelected, onToggleSelect }) => (
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggleSelect}
          aria-label="Select row"
        />
    ),
    size: 48,
    meta: {
      // FIX: Added missing 'displayName' property to satisfy the ColumnDef type.
      displayName: "Select",
      sticky: "left",
    },
  },
  {
    id: "id",
    accessorKey: "id",
    header: ({ sorting, setSorting }) => (
      <DataTableColumnHeader 
        title="Mã KH"
        sortKey="id"
        isSorted={sorting?.id === 'id'}
        sortDirection={sorting?.desc ? 'desc' : 'asc'}
        onSort={() => setSorting?.((s: any) => ({ id: 'id', desc: s.id === 'id' ? !s.desc : false }))}
       />
    ),
    cell: ({ row }) => <div className="font-medium">{row.id}</div>,
    meta: {
      displayName: "Mã KH",
    },
    size: 100,
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ sorting, setSorting }) => (
      <DataTableColumnHeader 
        title="Tên khách hàng"
        sortKey="name"
        isSorted={sorting?.id === 'name'}
        sortDirection={sorting?.desc ? 'desc' : 'asc'}
        onSort={() => setSorting?.((s: any) => ({ id: 'name', desc: s.id === 'name' ? !s.desc : false }))}
       />
    ),
    cell: ({ row }) => row.name,
    meta: {
      displayName: "Tên khách hàng",
    },
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.email,
    meta: {
      displayName: "Email",
    },
  },
  {
    id: "phone",
    accessorKey: "phone",
    header: "Số điện thoại",
    cell: ({ row }) => row.phone,
    meta: {
      displayName: "Số điện thoại",
    },
  },
  {
    id: "company",
    accessorKey: "company",
    header: "Công ty",
    cell: ({ row }) => row.company || '—',
    meta: { displayName: "Công ty" },
  },
  {
    id: "type",
    accessorKey: "type",
    header: "Loại KH",
    cell: ({ row }) => {
      if (!row.type) return '—';
      const variant = row.type === 'Cá nhân' ? 'secondary' : 'default';
      return <Badge variant={variant}>{row.type}</Badge>;
    },
    meta: { displayName: "Loại khách hàng" },
  },
  {
    id: "accountManagerName",
    accessorKey: "accountManagerName",
    header: "NV phụ trách",
    cell: ({ row }) => row.accountManagerName || '—',
    meta: { displayName: "NV phụ trách" },
  },
  {
    id: "currentDebt",
    accessorKey: "currentDebt",
    header: "Công nợ",
    cell: ({ row }) => {
      const alertLevel = getCreditAlertLevel(row);
      const showAlert = alertLevel === 'warning' || alertLevel === 'danger' || alertLevel === 'exceeded';
      
      return (
        <div className="flex items-center gap-2">
          <span>{formatCurrency(row.currentDebt)}</span>
          {showAlert && (
            <Badge variant={getCreditAlertBadgeVariant(alertLevel)} className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              {getCreditAlertText(alertLevel)}
            </Badge>
          )}
        </div>
      );
    },
    meta: { displayName: "Công nợ hiện tại" },
  },
  {
    id: "debtStatus",
    accessorKey: "debtStatus",
    header: "Trạng thái công nợ",
    cell: ({ row }) => {
      const info = calculateDebtTrackingInfo(row);
      
      if (!row.currentDebt || row.currentDebt === 0 || !info.debtStatus) {
        return <Badge variant="outline">Không có công nợ</Badge>;
      }
      
      return (
        <div className="flex flex-col gap-1">
          <Badge variant={getDebtStatusVariant(info.debtStatus)}>
            {info.debtStatus}
            {info.maxDaysOverdue > 0 && ` (${info.maxDaysOverdue} ngày)`}
          </Badge>
          {info.oldestDebtDueDate && (
            <span className="text-body-xs text-muted-foreground">
              Hạn: {formatDebtDate(info.oldestDebtDueDate)}
            </span>
          )}
        </div>
      );
    },
    meta: { displayName: "Trạng thái công nợ" },
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
        const status = row.status;
        const variant = status === "Đang giao dịch" ? "success" : "secondary";
        return <Badge variant={variant as any}>{status}</Badge>
    },
    meta: {
      displayName: "Trạng thái",
    },
  },
    {
    id: "slaStatus",
    header: "SLA",
    cell: ({ row }) => {
      const entry = options?.slaIndex?.entries[row.systemId];
      if (!entry || !entry.alerts.length) {
        return <Badge variant="outline" className="text-body-xs text-muted-foreground">Ổn định</Badge>;
      }

      const alerts = entry.alerts.slice(0, 2);
      return (
        <div className="space-y-1">
          {alerts.map((alert) => {
            const badgeMeta = SLA_TYPE_BADGES[alert.slaType];
            return (
              <div key={`${alert.slaType}-${alert.targetDate}`} className="flex items-center gap-2">
                <Badge variant="outline" className="text-[11px]">
                  {badgeMeta?.label || alert.slaName}
                </Badge>
                <Badge variant={getAlertBadgeVariant(alert.alertLevel)} className="text-[11px]">
                  {formatDaysRemaining(alert.daysRemaining)}
                </Badge>
              </div>
            );
          })}
          {entry.alerts.length > 2 && (
            <span className="text-[11px] text-muted-foreground">+{entry.alerts.length - 2} cảnh báo khác</span>
          )}
        </div>
      );
    },
    meta: {
      displayName: "SLA",
    },
    size: 220,
    },
  {
    id: "lifecycleStage",
    header: "Giai đoạn",
    cell: ({ row }) => {
        const stage = row.lifecycleStage || calculateLifecycleStage(row);
        const variant = getLifecycleStageVariant(stage);
        return <Badge variant={variant}>{stage}</Badge>
    },
    meta: {
      displayName: "Giai đoạn KH",
    },
  },
  {
    id: "healthScore",
    header: "Health Score",
    cell: ({ row }) => {
        const score = row.healthScore || calculateHealthScore(row);
        const { label, variant } = getHealthScoreLevel(score);
        return (
          <div className="flex items-center gap-2">
            <div className="w-16">
              <Progress value={score} className="h-2" />
            </div>
            <span className="text-body-sm font-medium">{score}</span>
            <Badge variant={variant} className="text-body-xs">{label}</Badge>
          </div>
        );
    },
    meta: {
      displayName: "Điểm sức khỏe KH",
    },
    size: 200,
  },
  {
    id: "churnRisk",
    header: "Rủi ro rời bỏ",
    cell: ({ row }) => {
        const churn = calculateChurnRisk(row);
        return <Badge variant={churn.variant}>{churn.label}</Badge>;
    },
    meta: {
      displayName: "Rủi ro rời bỏ",
    },
    size: 120,
  },
  {
    id: "segment",
    header: "Phân khúc",
    cell: ({ row }) => {
        // Sử dụng rfmScores đã lưu sẵn hoặc tính đơn giản nếu chưa có
        if (row.segment) {
          const segment = row.segment as import('./intelligence-utils').CustomerSegment;
          return (
            <Badge variant={getSegmentBadgeVariant(segment)} className="text-body-xs">
              {getSegmentLabel(segment)}
            </Badge>
          );
        }
        // Fallback: hiển thị dựa trên rfmScores nếu có
        if (row.rfmScores) {
          const segment = getCustomerSegment(row.rfmScores);
          return (
            <Badge variant={getSegmentBadgeVariant(segment)} className="text-body-xs">
              {getSegmentLabel(segment)}
            </Badge>
          );
        }
        return <span className="text-body-xs text-muted-foreground">—</span>;
    },
    meta: {
      displayName: "Phân khúc RFM",
    },
    size: 120,
  },
  {
    id: "taxCode",
    accessorKey: "taxCode",
    header: "Mã số thuế",
    cell: ({ row }) => row.taxCode,
    meta: { displayName: "Mã số thuế" },
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Ngày khởi tạo",
    cell: ({ row }) => formatDate(row.createdAt),
    meta: { displayName: "Ngày khởi tạo" },
  },
  {
    id: "totalOrders",
    accessorKey: "totalOrders",
    header: "Tổng đơn",
    cell: ({ row }) => row.totalOrders,
    meta: { displayName: "Tổng SL đơn hàng" },
  },
  {
    id: "totalSpent",
    accessorKey: "totalSpent",
    header: "Tổng chi tiêu",
    cell: ({ row }) => formatCurrency(row.totalSpent),
    meta: { displayName: "Tổng chi tiêu" },
  },
  {
    id: "lastPurchaseDate",
    accessorKey: "lastPurchaseDate",
    header: "Mua gần nhất",
    cell: ({ row }) => formatDate(row.lastPurchaseDate),
    meta: { displayName: "Ngày cuối cùng mua hàng" },
  },
  {
    id: "daysSinceLastPurchase",
    header: "Mua lần cuối",
    cell: ({ row }) => {
      if (!row.lastPurchaseDate) return <span className="text-muted-foreground">Chưa mua</span>;
      
      const days = getDaysDiff(getCurrentDate(), new Date(row.lastPurchaseDate));
      
      // Color coding based on recency
      let colorClass = 'text-foreground';
      if (days > 180) colorClass = 'text-destructive';
      else if (days > 90) colorClass = 'text-orange-600';
      else if (days > 30) colorClass = 'text-yellow-600';
      else colorClass = 'text-green-600';
      
      return (
        <div className="flex flex-col">
          <span className={colorClass}>{formatDate(row.lastPurchaseDate)}</span>
          <span className="text-body-xs text-muted-foreground">{days} ngày trước</span>
        </div>
      );
    },
    meta: { displayName: "Mua lần cuối" },
  },
  {
    id: "debtRatio",
    header: "Công nợ/Hạn mức",
    cell: ({ row }) => {
      if (!row.maxDebt || row.maxDebt === 0) {
        return <span className="text-muted-foreground text-body-xs">Chưa cấp hạn mức</span>;
      }
      
      const currentDebt = row.currentDebt || 0;
      const ratio = (currentDebt / row.maxDebt) * 100;
      
      // Color based on ratio
      let variant: 'default' | 'success' | 'warning' | 'destructive' = 'default';
      if (ratio >= 90) variant = 'destructive';
      else if (ratio >= 70) variant = 'warning';
      else variant = 'success';
      
      return (
        <div className="flex items-center gap-2 min-w-[180px]">
          <Progress value={ratio} className={`w-20 h-2 ${variant === 'destructive' ? 'bg-red-100' : variant === 'warning' ? 'bg-yellow-100' : 'bg-green-100'}`} />
          <span className="text-body-xs font-medium tabular-nums">{ratio.toFixed(0)}%</span>
          <span className="text-body-xs text-muted-foreground">
            {formatCurrency(currentDebt)}/{formatCurrency(row.maxDebt)}
          </span>
        </div>
      );
    },
    meta: { displayName: "Tỷ lệ công nợ/Hạn mức" },
    size: 250,
  },
   {
    id: "actions",
    header: () => "Hành động",
    cell: ({ row }) => {
      // ✅ Show restore button for deleted items
      if (row.deletedAt) {
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRestore(row.systemId)}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Khôi phục
          </Button>
        );
      }
      
      // ✅ Show dropdown menu only
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => navigate(`/customers/${row.systemId}/edit`)}>Sửa</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onSelect={() => onDelete(row.systemId)}>
              Chuyển vào thùng rác
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    meta: {
      displayName: "Hành động",
      sticky: "right",
    },
    size: 80,
  },
];
