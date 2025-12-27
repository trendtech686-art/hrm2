'use client'

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Printer, FileSpreadsheet, Trash2, AlertTriangle, Search } from 'lucide-react';
import { ResponsiveDataTable } from '../../../components/data-table/responsive-data-table';
import { DataTableColumnCustomizer } from '../../../components/data-table/data-table-column-toggle';
import { DataTableExportDialog } from '../../../components/data-table/data-table-export-dialog';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { useBreakpoint } from '../../../contexts/breakpoint-context';
import { getPayslipColumns, type PayslipRow, type PayslipActions } from './payslip-columns';
import { PayslipDetailDialog } from './payslip-detail-dialog';
import { cn } from '../../../lib/utils';
import { ROUTES } from '../../../lib/router';

// =============================================
// TYPES
// =============================================

export type { PayslipRow, PayslipActions };

type PayslipDataTableProps = {
  data: PayslipRow[];
  isLoading?: boolean;
  isLocked?: boolean;
  actions?: PayslipActions;
  onBulkPrint?: (rows: PayslipRow[]) => void;
  onBulkPrintBatch?: () => void; // In bảng lương tổng hợp
  onBulkPrintPenalties?: (rows: PayslipRow[]) => void; // In phiếu phạt
  onBulkDelete?: (rows: PayslipRow[]) => void;
  onBulkExport?: (rows: PayslipRow[]) => void;
  className?: string;
};

// =============================================
// MOBILE CARD
// =============================================

const formatCurrency = (value?: number) =>
  typeof value === 'number'
    ? value.toLocaleString('vi-VN', { maximumFractionDigits: 0 }) + ' đ'
    : '—';

function PayslipCard({ row, actions, isLocked }: { row: PayslipRow; actions?: PayslipActions; isLocked?: boolean }) {
  return (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className="font-mono text-xs text-muted-foreground block">{row.employeeId}</span>
            <span className="font-semibold">{row.employeeName}</span>
            {row.departmentName && (
              <span className="text-sm text-muted-foreground block">{row.departmentName}</span>
            )}
          </div>
          <div className="flex gap-1">
            {actions?.onPrint && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => actions.onPrint?.(row)}
              >
                <Printer className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Thu nhập:</span>
            <span className="font-semibold text-emerald-600 ml-2">
              {formatCurrency(row.totals.earnings)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Khấu trừ:</span>
            <span className="text-red-500 ml-2">
              {formatCurrency(row.totals.deductions)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Đóng góp:</span>
            <span className="text-blue-500 ml-2">
              {formatCurrency(row.totals.contributions)}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Thực lĩnh:</span>
            <span className="font-bold text-primary ml-2">
              {formatCurrency(row.totals.netPay)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// =============================================
// MAIN COMPONENT
// =============================================

export function PayslipDataTable({
  data,
  isLoading,
  isLocked = false,
  actions,
  onBulkPrint,
  onBulkPrintBatch,
  onBulkPrintPenalties,
  onBulkDelete,
  onBulkExport,
  className,
}: PayslipDataTableProps) {
  const router = useRouter();
  const { isMobile } = useBreakpoint();

  // Detail dialog state
  const [selectedPayslip, setSelectedPayslip] = React.useState<PayslipRow | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = React.useState(false);

  // Column state
  const columns = React.useMemo(
    () => getPayslipColumns(actions, isLocked),
    [actions, isLocked]
  );

  // Column visibility - hiển thị đầy đủ để có sticky scrollbar
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>(['select', 'employeeId']);

  // Row selection
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});

  // Pagination
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });

  // Sorting (disabled for payslip table but required by ResponsiveDataTable)
  const [sorting, setSorting] = React.useState<{ id: string; desc: boolean }>({ id: '', desc: false });

  // Search filter
  const [searchQuery, setSearchQuery] = React.useState('');

  // Mobile infinite scroll
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);

  // Set default visibility - 12+ cột để có sticky scrollbar
  React.useEffect(() => {
    const defaultVisibleColumns = [
      'select',
      'employeeId',
      'employeeName',
      'departmentName',
      'positionName',
      'workDays',      // Cột Công
      'otWeekday',     // OT Ngày thường
      'otWeekend',     // OT Cuối tuần
      'otHoliday',     // OT Ngày lễ
      'earnings',
      'insurance',
      'taxableIncome',
      'personalIncomeTax',
      'otherDeductions',
      'netPay',
      'actions',
    ];
    const visibility: Record<string, boolean> = {};
    columns.forEach((col) => {
      const colId = col.id || (typeof col.accessorKey === 'string' ? col.accessorKey : '');
      if (colId) {
        visibility[colId] = defaultVisibleColumns.includes(colId);
      }
    });
    setColumnVisibility(visibility);
    setColumnOrder(columns.map((c) => c.id).filter(Boolean) as string[]);
  }, [columns]);

  // Reset mobile count when data changes
  React.useEffect(() => {
    setMobileLoadedCount(20);
  }, [data.length]);

  // Mobile infinite scroll
  React.useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight * 0.8) {
        setMobileLoadedCount((prev) => Math.min(prev + 20, data.length));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, data.length]);

  // Filter data by search query
  const filteredData = React.useMemo(() => {
    if (!searchQuery.trim()) return data;
    const query = searchQuery.toLowerCase().trim();
    return data.filter((row) => {
      return (
        row.employeeId?.toLowerCase().includes(query) ||
        row.employeeName?.toLowerCase().includes(query) ||
        row.departmentName?.toLowerCase().includes(query) ||
        row.positionName?.toLowerCase().includes(query)
      );
    });
  }, [data, searchQuery]);

  // Calculate pagination for desktop
  const pageCount = Math.ceil(filteredData.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, pagination.pageIndex, pagination.pageSize]);

  // Display data based on device
  const displayData = isMobile ? filteredData.slice(0, mobileLoadedCount) : paginatedData;

  // Get selected rows
  const allSelectedRows = React.useMemo(
    () =>
      Object.keys(rowSelection)
        .filter((key) => rowSelection[key])
        .map((key) => data.find((row) => row.systemId === key))
        .filter(Boolean) as PayslipRow[],
    [rowSelection, data]
  );

  // Bulk actions
  const bulkActions = React.useMemo(
    () => [
      ...(onBulkPrintBatch
        ? [
            {
              label: 'In bảng lương',
              icon: FileSpreadsheet,
              onSelect: () => onBulkPrintBatch(),
            },
          ]
        : []),
      ...(onBulkPrint
        ? [
            {
              label: 'In phiếu lương',
              icon: Printer,
              onSelect: () => onBulkPrint(allSelectedRows),
            },
          ]
        : []),
      ...(onBulkPrintPenalties
        ? [
            {
              label: 'In phiếu phạt',
              icon: AlertTriangle,
              onSelect: () => onBulkPrintPenalties(allSelectedRows),
            },
          ]
        : []),
      ...(onBulkDelete && !isLocked
        ? [
            {
              label: 'Xóa khỏi bảng lương',
              icon: Trash2,
              onSelect: () => onBulkDelete(allSelectedRows),
              variant: 'destructive' as const,
            },
          ]
        : []),
      ...(onBulkExport
        ? [
            {
              label: 'Xuất Excel',
              icon: FileSpreadsheet,
              onSelect: () => onBulkExport(allSelectedRows),
            },
          ]
        : []),
    ],
    [onBulkPrintBatch, onBulkPrint, onBulkPrintPenalties, onBulkDelete, onBulkExport, allSelectedRows, isLocked]
  );

  // Navigate to employee
  const handleViewEmployee = React.useCallback(
    (row: PayslipRow) => {
      if (row.employeeSystemId) {
        router.push(ROUTES.HRM.EMPLOYEE_VIEW.replace(':systemId', row.employeeSystemId));
      }
    },
    [router]
  );

  // Handle row click - open detail dialog
  const handleRowClick = React.useCallback((row: PayslipRow) => {
    setSelectedPayslip(row);
    setIsDetailDialogOpen(true);
  }, []);

  // Handle edit from detail dialog
  const handleEditFromDetail = React.useCallback(() => {
    if (selectedPayslip && actions?.onEdit) {
      setIsDetailDialogOpen(false);
      actions.onEdit(selectedPayslip);
    }
  }, [selectedPayslip, actions]);

  // Handle print from detail dialog
  const handlePrintFromDetail = React.useCallback(() => {
    if (selectedPayslip && actions?.onPrint) {
      actions.onPrint(selectedPayslip);
    }
  }, [selectedPayslip, actions]);

  // Enhanced actions with view employee
  const enhancedActions = React.useMemo(
    () => ({
      ...actions,
      onViewEmployee: handleViewEmployee,
    }),
    [actions, handleViewEmployee]
  );

  // Export config
  const exportConfig = React.useMemo(
    () => ({
      fileName: 'danh-sach-phieu-luong',
      columns: columns,
    }),
    [columns]
  );

  // Render mobile card
  const renderMobileCard = React.useCallback(
    (row: PayslipRow) => (
      <PayslipCard key={row.systemId} row={row} actions={enhancedActions} isLocked={isLocked} />
    ),
    [enhancedActions, isLocked]
  );

  return (
    <div className={cn('space-y-4', className)}>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:flex-none sm:w-64">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm theo mã, tên, phòng ban..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPagination((prev) => ({ ...prev, pageIndex: 0 }));
              }}
              className="h-9 pl-8 w-full"
            />
          </div>
          <div className="text-sm text-muted-foreground whitespace-nowrap">
            {filteredData.length !== data.length ? (
              <span>{filteredData.length}/{data.length} phiếu lương</span>
            ) : (
              <span>{data.length} phiếu lương</span>
            )}
            {allSelectedRows.length > 0 && (
              <span className="ml-2 font-medium text-primary">
                ({allSelectedRows.length} đã chọn)
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DataTableExportDialog
            allData={data}
            filteredData={filteredData}
            pageData={paginatedData}
            config={exportConfig}
          />
          <DataTableColumnCustomizer
            columns={columns}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
            columnOrder={columnOrder}
            setColumnOrder={setColumnOrder}
            pinnedColumns={pinnedColumns}
            setPinnedColumns={setPinnedColumns}
          />
        </div>
      </div>

      {/* Table */}
      <ResponsiveDataTable
        columns={columns}
        data={displayData}
        isLoading={isLoading}
        renderMobileCard={(row, _index) => renderMobileCard(row)}
        // Selection
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        allSelectedRows={allSelectedRows}
        // Column control
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        columnOrder={columnOrder}
        setColumnOrder={setColumnOrder}
        pinnedColumns={pinnedColumns}
        setPinnedColumns={setPinnedColumns}
        // Sorting
        sorting={sorting}
        setSorting={setSorting}
        // Pagination (desktop only)
        pageCount={pageCount}
        pagination={pagination}
        setPagination={setPagination}
        rowCount={filteredData.length}
        // Bulk actions
        bulkActions={bulkActions}
        showBulkDeleteButton={false}
        // Row click
        onRowClick={handleRowClick}
        // Empty state
        emptyTitle="Chưa có phiếu lương"
        emptyDescription="Bảng lương chưa có phiếu lương nào. Chạy lương để tạo phiếu."
      />

      {/* Payslip Detail Dialog */}
      <PayslipDetailDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        payslip={selectedPayslip}
        isLocked={isLocked}
        onEdit={actions?.onEdit ? handleEditFromDetail : undefined}
        onPrint={actions?.onPrint ? handlePrintFromDetail : undefined}
      />

      {/* Mobile loading indicator */}
      {isMobile && (
        <div className="py-4 text-center">
          {mobileLoadedCount < data.length ? (
            <span className="text-sm text-muted-foreground">
              Đang tải... ({mobileLoadedCount}/{data.length})
            </span>
          ) : data.length > 0 ? (
            <span className="text-sm text-muted-foreground">
              Đã hiển thị tất cả {data.length} phiếu lương
            </span>
          ) : null}
        </div>
      )}
    </div>
  );
}
