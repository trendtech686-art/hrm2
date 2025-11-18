import * as React from "react";
import * as ReactRouterDOM from "react-router-dom";
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, getCurrentDate, isValidDate, getDaysDiff } from '@/lib/date-utils';
import type { Customer } from './types.ts'
import { calculateLifecycleStage, getLifecycleStageVariant } from './lifecycle-utils.ts';
import { getCreditAlertLevel, getCreditAlertBadgeVariant, getCreditAlertText } from './credit-utils.ts';
import { 
  calculateHealthScore, 
  getHealthScoreLevel,
  calculateRFMScores,
  getCustomerSegment,
  getSegmentLabel,
  getSegmentBadgeVariant
} from './intelligence-utils.ts';
import { 
  calculateDebtTrackingInfo, 
  getDebtStatusVariant,
  formatDebtDate 
} from './debt-tracking-utils.ts';
import { Checkbox } from "../../components/ui/checkbox.tsx"
import { DataTableColumnHeader } from "../../components/data-table/data-table-column-header.tsx"
import { Badge } from "../../components/ui/badge.tsx"
import { Progress } from "../../components/ui/progress.tsx"
import type { ColumnDef } from '../../components/data-table/types.ts';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu.tsx";
import { Button } from "../../components/ui/button.tsx";
import { MoreHorizontal, RotateCcw, AlertTriangle, Phone, Mail, ShoppingBag } from "lucide-react";
const formatCurrency = (value?: number) => {
    if (typeof value !== 'number') return '';
    return new Intl.NumberFormat('vi-VN').format(value);
};

export const getColumns = (
  onDelete: (systemId: string) => void,
  onRestore: (systemId: string) => void,
  navigate: (path: string) => void
): ColumnDef<Customer>[] => [
  {
    id: "select",
    header: ({ isAllPageRowsSelected, isSomePageRowsSelected, onToggleAll }) => (
        <Checkbox
          checked={isAllPageRowsSelected ? true : isSomePageRowsSelected ? "indeterminate" : false}
          onCheckedChange={(value) => onToggleAll(!!value)}
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
        isSorted={sorting.id === 'id'}
        sortDirection={sorting.desc ? 'desc' : 'asc'}
        onSort={() => setSorting((s: any) => ({ id: 'id', desc: s.id === 'id' ? !s.desc : false }))}
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
        isSorted={sorting.id === 'name'}
        sortDirection={sorting.desc ? 'desc' : 'asc'}
        onSort={() => setSorting((s: any) => ({ id: 'name', desc: s.id === 'name' ? !s.desc : false }))}
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
    id: "accountManagerName",
    accessorKey: "accountManagerName",
    header: "NV phụ trách",
    cell: ({ row }) => row.accountManagerName,
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
            <span className="text-xs text-muted-foreground">
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
            <span className="text-sm font-medium">{score}</span>
            <Badge variant={variant} className="text-xs">{label}</Badge>
          </div>
        );
    },
    meta: {
      displayName: "Điểm sức khỏe KH",
    },
    size: 200,
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
      if (days > 180) colorClass = 'text-destructive font-semibold';
      else if (days > 90) colorClass = 'text-orange-600';
      else if (days > 30) colorClass = 'text-yellow-600';
      else colorClass = 'text-green-600';
      
      return <span className={colorClass}>{days} ngày trước</span>;
    },
    meta: { displayName: "Số ngày từ lần mua cuối" },
  },
  {
    id: "debtRatio",
    header: "Công nợ/Hạn mức",
    cell: ({ row }) => {
      if (!row.maxDebt || row.maxDebt === 0) {
        return <span className="text-muted-foreground text-xs">Chưa cấp hạn mức</span>;
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
          <span className="text-xs font-medium tabular-nums">{ratio.toFixed(0)}%</span>
          <span className="text-xs text-muted-foreground">
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
      
      // ✅ Show quick actions + dropdown for active items
      return (
        <div className="flex items-center gap-1">
          {/* Quick Actions */}
          {row.phone && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `tel:${row.phone}`;
              }}
              title="Gọi điện"
            >
              <Phone className="h-4 w-4" />
            </Button>
          )}
          {row.email && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `mailto:${row.email}`;
              }}
              title="Gửi email"
            >
              <Mail className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/orders?customer=${row.systemId}`);
            }}
            title="Xem đơn hàng"
          >
            <ShoppingBag className="h-4 w-4" />
          </Button>
          
          {/* More Actions Dropdown */}
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
        </div>
      );
    },
    meta: {
      displayName: "Hành động",
      sticky: "right",
    },
    size: 120,
  },
];
