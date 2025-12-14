import * as React from "react";
import { Button } from "../../../components/ui/button";
import { Switch } from "../../../components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import type { ColumnDef } from "../../../components/data-table/types";
import type {
  BaseSetting,
  CustomerType,
  CustomerGroup,
  CustomerSource,
  PaymentTerm,
  CreditRating,
  LifecycleStage,
  CustomerSlaSetting,
} from "./types";
import { SLA_TYPE_LABELS } from "./sla-settings-data";

interface ColumnFactoryOptions<TItem extends BaseSetting> {
  onEdit: (item: TItem) => void;
  onDelete: (item: TItem) => void;
  onToggleActive?: (item: TItem, value: boolean) => void;
  onToggleDefault?: (item: TItem, value: boolean) => void;
}

const createActionColumn = <TItem extends BaseSetting>({ onEdit, onDelete }: ColumnFactoryOptions<TItem>): ColumnDef<TItem> => ({
  id: "actions",
  header: () => <div className="text-right">Thao tác</div>,
  cell: ({ row }) => (
    <div className="text-right">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Mở menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => onEdit(row)}>
            Chỉnh sửa
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive" onSelect={() => onDelete(row)}>
            Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
  meta: { displayName: "Thao tác" },
  size: 80,
});

// Inline Switch for isActive
const createActiveColumn = <TItem extends BaseSetting>(onToggleActive?: (item: TItem, value: boolean) => void): ColumnDef<TItem> => ({
  id: "isActive",
  header: "Trạng thái",
  cell: ({ row }) => (
    <Switch
      checked={row.isActive}
      onCheckedChange={(value) => onToggleActive?.(row, value)}
      aria-label="Toggle active"
    />
  ),
  meta: { displayName: "Trạng thái" },
  size: 100,
});

// Inline Switch for isDefault
const createDefaultColumn = <TItem extends BaseSetting & { isDefault?: boolean }>(onToggleDefault?: (item: TItem, value: boolean) => void): ColumnDef<TItem> => ({
  id: "isDefault",
  header: "Mặc định",
  cell: ({ row }) => (
    <Switch
      checked={row.isDefault ?? false}
      onCheckedChange={(value) => onToggleDefault?.(row, value)}
      aria-label="Toggle default"
    />
  ),
  meta: { displayName: "Mặc định" },
  size: 100,
});

const baseColumns = <TItem extends BaseSetting>() => ([
  {
    id: "id",
    header: "Mã",
    cell: ({ row }: { row: TItem }) => <span className="font-semibold uppercase">{row.id}</span>,
    meta: { displayName: "Mã" },
  },
  {
    id: "name",
    header: "Tên",
    cell: ({ row }: { row: TItem }) => <span className="font-medium">{row.name}</span>,
    meta: { displayName: "Tên" },
  },
  {
    id: "description",
    header: "Mô tả",
    cell: ({ row }: { row: TItem }) => (
      <span className="text-sm text-muted-foreground">{row.description || "—"}</span>
    ),
    meta: { displayName: "Mô tả" },
  },
] satisfies ColumnDef<TItem>[]);

export const getCustomerTypeColumns = (options: ColumnFactoryOptions<CustomerType>): ColumnDef<CustomerType>[] => [
  ...baseColumns<CustomerType>(),
  createDefaultColumn<CustomerType>(options.onToggleDefault),
  createActiveColumn<CustomerType>(options.onToggleActive),
  createActionColumn(options),
];

export const getCustomerGroupColumns = (options: ColumnFactoryOptions<CustomerGroup>): ColumnDef<CustomerGroup>[] => [
  ...baseColumns<CustomerGroup>(),
  createDefaultColumn<CustomerGroup>(options.onToggleDefault),
  createActiveColumn<CustomerGroup>(options.onToggleActive),
  createActionColumn(options),
];

export const getCustomerSourceColumns = (options: ColumnFactoryOptions<CustomerSource>): ColumnDef<CustomerSource>[] => [
  ...baseColumns<CustomerSource>(),
  {
    id: "type",
    header: "Kênh",
    cell: ({ row }) => row.type ? <span className="text-sm">{row.type}</span> : <span>—</span>,
    meta: { displayName: "Kênh" },
    size: 100,
  },
  createDefaultColumn<CustomerSource>(options.onToggleDefault),
  createActiveColumn<CustomerSource>(options.onToggleActive),
  createActionColumn(options),
];

export const getPaymentTermColumns = (options: ColumnFactoryOptions<PaymentTerm>): ColumnDef<PaymentTerm>[] => [
  ...baseColumns<PaymentTerm>(),
  {
    id: "days",
    header: "Số ngày",
    cell: ({ row }) => <span className="text-sm">{row.days} ngày</span>,
    meta: { displayName: "Số ngày" },
    size: 100,
  },
  createDefaultColumn<PaymentTerm>(options.onToggleDefault),
  createActiveColumn<PaymentTerm>(options.onToggleActive),
  createActionColumn(options),
];

export const getCreditRatingColumns = (options: ColumnFactoryOptions<CreditRating>): ColumnDef<CreditRating>[] => [
  ...baseColumns<CreditRating>(),
  {
    id: "level",
    header: "Level",
    cell: ({ row }) => <span className="font-medium">{row.level}</span>,
    meta: { displayName: "Level" },
    size: 80,
  },
  {
    id: "maxCreditLimit",
    header: "Hạn mức",
    cell: ({ row }) => (
      row.maxCreditLimit !== undefined && row.maxCreditLimit > 0 ? (
        <span className="text-sm">{(row.maxCreditLimit / 1000000).toLocaleString('vi-VN')}tr</span>
      ) : (
        <span>—</span>
      )
    ),
    meta: { displayName: "Hạn mức" },
    size: 100,
  },
  createDefaultColumn<CreditRating>(options.onToggleDefault),
  createActiveColumn<CreditRating>(options.onToggleActive),
  createActionColumn(options),
];

export const getLifecycleStageColumns = (options: ColumnFactoryOptions<LifecycleStage>): ColumnDef<LifecycleStage>[] => [
  ...baseColumns<LifecycleStage>(),
  {
    id: "orderIndex",
    header: "Thứ tự",
    cell: ({ row }) => <span className="font-medium">{row.orderIndex}</span>,
    meta: { displayName: "Thứ tự" },
    size: 80,
  },
  {
    id: "probability",
    header: "Xác suất",
    cell: ({ row }) => (
      row.probability !== undefined ? (
        <span className="text-sm">{row.probability}%</span>
      ) : (
        <span>—</span>
      )
    ),
    meta: { displayName: "Xác suất" },
    size: 90,
  },
  createDefaultColumn<LifecycleStage>(options.onToggleDefault),
  createActiveColumn<LifecycleStage>(options.onToggleActive),
  createActionColumn(options),
];

// SLA columns - đơn giản hóa: không có Mặc định, không có Trạng thái, không có Xóa
// Chỉ có 3 loại SLA cố định, user chỉ có thể edit
export const getCustomerSlaColumns = (options: ColumnFactoryOptions<CustomerSlaSetting>): ColumnDef<CustomerSlaSetting>[] => [
  {
    id: "slaType",
    header: "Loại SLA",
    cell: ({ row }) => (
      <span className="font-medium whitespace-nowrap">
        {SLA_TYPE_LABELS[row.slaType] || row.slaType}
      </span>
    ),
    meta: { displayName: "Loại SLA" },
    size: 130,
  },
  {
    id: "name",
    header: "Tên",
    cell: ({ row }) => <span className="font-medium">{row.name}</span>,
    meta: { displayName: "Tên" },
    size: 150,
  },
  {
    id: "targetDays",
    header: "Mục tiêu",
    cell: ({ row }) => (
      <span className="text-sm">
        {row.targetDays} ngày
      </span>
    ),
    meta: { displayName: "Mục tiêu" },
    size: 100,
  },
  {
    id: "warningDays",
    header: "Cảnh báo",
    cell: ({ row }) => (
      <span className="text-sm text-yellow-700">
        Trước {row.warningDays} ngày
      </span>
    ),
    meta: { displayName: "Ngưỡng cảnh báo" },
    size: 120,
  },
  {
    id: "criticalDays",
    header: "Nghiêm trọng",
    cell: ({ row }) => (
      <span className="text-sm text-red-700">
        Quá {row.criticalDays} ngày
      </span>
    ),
    meta: { displayName: "Ngưỡng nghiêm trọng" },
    size: 120,
  },
  {
    id: "actions",
    header: () => <div className="text-right">Thao tác</div>,
    cell: ({ row }) => (
      <div className="text-right">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => options.onEdit(row)}
        >
          Sửa
        </Button>
      </div>
    ),
    meta: { displayName: "Thao tác" },
    size: 100,
  },
];
