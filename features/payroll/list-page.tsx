import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ClipboardList, PlusCircle, ShieldCheck, Wallet } from 'lucide-react';
import { Button } from '../../components/ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.tsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table.tsx';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { ROUTES } from '../../lib/router.ts';
import { usePayrollBatchStore } from './payroll-batch-store.ts';
import { PayrollSummaryCards, type PayrollSummaryCard } from './components/summary-cards.tsx';
import {
  PayrollBatchFilters,
  type PayrollBatchFiltersValue,
} from './components/batch-filters.tsx';
import { PayrollStatusBadge } from './components/status-badge.tsx';
import type { PayrollBatch } from '../../lib/payroll-types.ts';

const defaultFilters: PayrollBatchFiltersValue = {
  status: 'all',
  keyword: '',
  monthKey: undefined,
};

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

const formatCurrency = (value?: number) =>
  typeof value === 'number' ? currencyFormatter.format(value) : '—';

const formatMonthKey = (monthKey: string) => {
  if (!monthKey) {
    return '—';
  }
  const [year, month] = monthKey.split('-');
  return `Tháng ${month}/${year}`;
};

const formatDate = (value: string) => {
  if (!value) {
    return '—';
  }
  return new Date(value).toLocaleDateString('vi-VN');
};

const getMonthKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

const matchesKeyword = (batch: PayrollBatch, keyword: string) => {
  if (!keyword) return true;
  const normalized = keyword.trim().toLowerCase();
  return (
    batch.id.toLowerCase().includes(normalized) ||
    batch.title.toLowerCase().includes(normalized)
  );
};

const matchesMonthFilter = (batch: PayrollBatch, monthKey?: string) => {
  if (!monthKey) return true;
  return batch.referenceAttendanceMonthKeys.includes(monthKey);
};

const matchesStatusFilter = (
  batch: PayrollBatch,
  status: PayrollBatchFiltersValue['status']
) => {
  if (status === 'all') {
    return true;
  }
  return batch.status === status;
};

export function PayrollListPage() {
  const navigate = useNavigate();
  const { batches } = usePayrollBatchStore();
  const [filters, setFilters] = React.useState<PayrollBatchFiltersValue>(defaultFilters);

  const filteredBatches = React.useMemo(() => {
    return batches
      .filter((batch) => matchesStatusFilter(batch, filters.status))
      .filter((batch) => matchesMonthFilter(batch, filters.monthKey))
      .filter((batch) => matchesKeyword(batch, filters.keyword))
      .sort((a, b) => new Date(b.payrollDate).getTime() - new Date(a.payrollDate).getTime());
  }, [batches, filters]);

  const summaryCards = React.useMemo<PayrollSummaryCard[]>(() => {
    const now = new Date();
    const currentMonthKey = getMonthKey(now);
    const previousMonthKey = getMonthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1));

    const currentMonthTotal = batches
      .filter((batch) => batch.referenceAttendanceMonthKeys.includes(currentMonthKey))
      .reduce((sum, batch) => sum + batch.totalNet, 0);

    const draftCount = batches.filter((batch) => batch.status === 'draft').length;
    const reviewedCount = batches.filter((batch) => batch.status === 'reviewed').length;

    const previousMonthLocked = batches.some(
      (batch) =>
        batch.referenceAttendanceMonthKeys.includes(previousMonthKey) && batch.status === 'locked'
    );

    const cards: PayrollSummaryCard[] = [
      {
        id: 'current-month-total',
        title: 'Tổng chi phí kỳ hiện tại',
        value: formatCurrency(currentMonthTotal),
        description: `Theo ${formatMonthKey(currentMonthKey)}`,
        icon: Wallet,
      },
      {
        id: 'pending-review',
        title: 'Batch cần duyệt',
        value: draftCount,
        description: 'Đang ở trạng thái Nháp',
        icon: ClipboardList,
      },
      {
        id: 'awaiting-lock',
        title: 'Chờ khóa',
        value: reviewedCount,
        description: 'Đã duyệt, chờ khóa',
        icon: ShieldCheck,
      },
      previousMonthLocked
        ? {
            id: 'previous-month-locked',
            title: 'Kỳ trước đã khóa',
            value: 'Đã hoàn tất',
            description: formatMonthKey(previousMonthKey),
            icon: ShieldCheck,
          }
        : {
            id: 'previous-month-warning',
            title: 'Cảnh báo: chưa khóa kỳ trước',
            value: 'Chưa khóa',
            description: formatMonthKey(previousMonthKey),
            icon: AlertTriangle,
            className: 'border-amber-300 bg-amber-50 dark:bg-amber-950/40',
          },
    ];

    return cards;
  }, [batches]);

  const headerActions = React.useMemo(
    () => [
      <Button
        key="run"
        className="h-9"
        size="sm"
        onClick={() => navigate(ROUTES.PAYROLL.RUN)}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Chạy bảng lương
      </Button>,
    ],
    [navigate]
  );

  usePageHeader({
    title: 'Danh sách bảng lương',
    breadcrumb: [
      { label: 'Trang chủ', href: ROUTES.DASHBOARD },
      { label: 'Bảng lương', href: ROUTES.PAYROLL.LIST },
    ],
    actions: headerActions,
  });

  return (
    <div className="space-y-6">
      <PayrollSummaryCards items={summaryCards} />
      <PayrollBatchFilters
        value={filters}
        onChange={setFilters}
        onClear={() => setFilters(defaultFilters)}
      />

      <Card>
        <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base font-semibold">Danh sách batch</CardTitle>
          <p className="text-sm text-muted-foreground">
            {filteredBatches.length} / {batches.length} bảng lương
          </p>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {filteredBatches.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center text-center text-sm text-muted-foreground">
              <p>Chưa có bảng lương nào phù hợp điều kiện lọc.</p>
              <Button
                variant="link"
                className="mt-2 h-9 px-0"
                onClick={() => setFilters(defaultFilters)}
              >
                Xóa bộ lọc
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã bảng lương</TableHead>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Tháng tham chiếu</TableHead>
                  <TableHead>Ngày trả</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Tổng thực lĩnh</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBatches.map((batch) => (
                  <TableRow
                    key={batch.systemId}
                    className="cursor-pointer"
                    onClick={() => navigate(ROUTES.PAYROLL.DETAIL.replace(':systemId', batch.systemId))}
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">{batch.id}</TableCell>
                    <TableCell className="font-medium">{batch.title}</TableCell>
                    <TableCell>{formatMonthKey(batch.referenceAttendanceMonthKeys[0])}</TableCell>
                    <TableCell>{formatDate(batch.payrollDate)}</TableCell>
                    <TableCell>
                      <PayrollStatusBadge status={batch.status} />
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(batch.totalNet)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
