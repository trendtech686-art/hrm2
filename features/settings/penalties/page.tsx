import * as React from "react"
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../../lib/date-utils.ts'
import { usePenaltyStore, usePenaltyTypeStore } from "./store.ts"
import { useEmployeeStore } from "../../employees/store.ts";
import { useBranchStore } from "../branches/store.ts";
import { useStoreInfoStore } from "../store-info/store-info-store.ts";
import { useDefaultPageSize } from "../global-settings-store.ts";
import { getColumns } from "./columns.tsx"
import { ResponsiveDataTable, type BulkAction } from "../../../components/data-table/responsive-data-table.tsx"
import { DataTableFacetedFilter } from "../../../components/data-table/data-table-faceted-filter.tsx"
import { toast } from "sonner"
import { 
  Card, 
  CardContent,
} from "../../../components/ui/card.tsx"
import { Button } from "../../../components/ui/button.tsx"
import { PlusCircle, User, Calendar, MoreHorizontal, FileText, AlertTriangle, Printer } from "lucide-react"
import type { Penalty, PenaltyStatus } from "./types.ts"
import { penaltyCategoryLabels } from "./types.ts"
import { DataTableExportDialog } from "../../../components/data-table/data-table-export-dialog.tsx";
import { DataTableImportDialog, type ImportConfig } from "../../../components/data-table/data-table-import-dialog.tsx";
import Fuse from "fuse.js"
import { usePageHeader } from "../../../contexts/page-header-context.tsx";
import { DataTableColumnCustomizer } from "../../../components/data-table/data-table-column-toggle.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select.tsx";
import { TouchButton } from "../../../components/mobile/touch-button.tsx";
import { Badge } from "../../../components/ui/badge.tsx";
import { useMediaQuery } from "../../../lib/use-media-query.ts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu.tsx";
import { PageToolbar } from "../../../components/layout/page-toolbar.tsx";
import { PageFilters } from "../../../components/layout/page-filters.tsx";
import { usePrint } from "../../../lib/use-print.ts";
import { 
  convertPenaltyForPrint,
  mapPenaltyToPrintData,
  createStoreSettings,
} from "../../../lib/print/penalty-print-helper.ts";
import { SimplePrintOptionsDialog, type SimplePrintOptionsResult } from "../../../components/shared/simple-print-options-dialog.tsx";

const COLUMN_LAYOUT_STORAGE_KEY = 'penalties-column-layout';

type StoredColumnLayout = {
  visibility?: Record<string, boolean>;
  order?: string[];
  pinned?: string[];
};

const readStoredColumnLayout = (): StoredColumnLayout | null => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(COLUMN_LAYOUT_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as StoredColumnLayout;
    }
  } catch (error) {
    console.warn('Failed to parse penalties column layout from storage:', error);
  }
  return null;
};

const formatCurrency = (value?: number) => {
  if (typeof value !== 'number') return '';
  return new Intl.NumberFormat('vi-VN').format(value);
};

export function PenaltiesPage() {
  const storedLayoutRef = React.useRef(readStoredColumnLayout());

  const { data: penalties, addMultiple, update } = usePenaltyStore();
  const { data: penaltyTypes } = usePenaltyTypeStore();
  const { data: employees } = useEmployeeStore();
  const { data: branches } = useBranchStore();
  const { info: storeInfo } = useStoreInfoStore();
  const navigate = useNavigate();
  const { print, printMultiple } = usePrint();
  
  // Print dialog state
  const [printDialogOpen, setPrintDialogOpen] = React.useState(false);
  const [itemsToPrint, setItemsToPrint] = React.useState<Penalty[]>([]);
  
  // ✅ Use global default page size from settings
  const defaultPageSize = useDefaultPageSize();
  
  // ✅ Memoize actions
  const headerActions = React.useMemo(() => [
    <Button key="add" size="sm" className="h-9" onClick={() => navigate('/penalties/new')}>
      <PlusCircle className="mr-2 h-4 w-4" />
      Tạo phiếu phạt
    </Button>
  ], [navigate]);
  
  // Set page header
  usePageHeader({
    actions: headerActions,
  });
  
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})
  
  // Table state - default sort by createdAt desc (newest first)
  const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'createdAt', desc: true });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<Set<string>>(new Set());
  const [employeeFilter, setEmployeeFilter] = React.useState('all');
  const [categoryFilter, setCategoryFilter] = React.useState<Set<string>>(new Set());
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: defaultPageSize });
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  
  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedGlobalFilter(globalFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [globalFilter]);
  
  // Column customization state
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>(
    () => storedLayoutRef.current?.visibility ?? {}
  );
  const [columnOrder, setColumnOrder] = React.useState<string[]>(
    () => storedLayoutRef.current?.order ?? []
  );
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>(
    () => storedLayoutRef.current?.pinned ?? []
  );

  // Save column layout to localStorage
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const payload = {
      visibility: columnVisibility,
      order: columnOrder,
      pinned: pinnedColumns,
    };
    window.localStorage.setItem(COLUMN_LAYOUT_STORAGE_KEY, JSON.stringify(payload));
  }, [columnVisibility, columnOrder, pinnedColumns]);

  // Row action handlers
  const handleMarkPaid = React.useCallback((penalty: Penalty) => {
    update(penalty.systemId, { 
      ...penalty, 
      status: "Đã thanh toán" as PenaltyStatus,
      updatedAt: new Date().toISOString()
    });
    toast.success("Đã cập nhật trạng thái", {
      description: `Phiếu phạt ${penalty.id} đã chuyển sang "Đã thanh toán"`,
    });
  }, [update]);

  const handleCancel = React.useCallback((penalty: Penalty) => {
    update(penalty.systemId, { 
      ...penalty, 
      status: "Đã hủy" as PenaltyStatus,
      updatedAt: new Date().toISOString()
    });
    toast.success("Đã hủy phiếu phạt", {
      description: `Phiếu phạt ${penalty.id} đã bị hủy`,
    });
  }, [update]);

  const columns = React.useMemo(() => getColumns(handleMarkPaid, handleCancel, navigate), [handleMarkPaid, handleCancel, navigate]);

  const buildDefaultVisibility = React.useCallback(() => {
    const defaultVisibleColumns = new Set([
      'select', 'id', 'employeeName', 'penaltyTypeName', 'reason', 'amount', 
      'issueDate', 'issuerName', 'status', 'category', 'linkedComplaintSystemId',
      'linkedOrderSystemId', 'deductedInPayrollId', 'createdAt', 'actions'
    ]);

    const initialVisibility: Record<string, boolean> = {};
    columns.forEach(c => {
      if (!c.id) return;
      if (c.id === 'select' || c.id === 'actions') {
        initialVisibility[c.id] = true;
        return;
      }
      initialVisibility[c.id] = defaultVisibleColumns.has(c.id);
    });
    return initialVisibility;
  }, [columns]);

  const buildDefaultOrder = React.useCallback(() => (
    columns.map(c => c.id).filter(Boolean) as string[]
  ), [columns]);

  React.useEffect(() => {
    if (columns.length === 0) return;

    setColumnVisibility(prev => {
      if (Object.keys(prev).length > 0) return prev;
      return buildDefaultVisibility();
    });

    setColumnOrder(prev => {
      if (prev.length > 0) return prev;
      return buildDefaultOrder();
    });

    setPinnedColumns(prev => prev ?? []);
  }, [columns, buildDefaultOrder, buildDefaultVisibility]);

  const resetColumnLayout = React.useCallback(() => {
    const defaultVisibility = buildDefaultVisibility();
    const defaultOrder = buildDefaultOrder();
    setColumnVisibility(defaultVisibility);
    setColumnOrder(defaultOrder);
    setPinnedColumns([]);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(COLUMN_LAYOUT_STORAGE_KEY);
    }
    toast.success('Đã khôi phục bố cục cột mặc định');
  }, [buildDefaultVisibility, buildDefaultOrder]);
  
  // ✅ Create Fuse instance for search
  const fuseInstance = React.useMemo(() => {
    return new Fuse(penalties, { 
      keys: ["id", "employeeName", "reason", "issuerName", "penaltyTypeName"],
      threshold: 0.3,
      ignoreLocation: true,
      useExtendedSearch: false
    });
  }, [penalties]);
  
  const filteredData = React.useMemo(() => {
    let filtered = penalties;

    // Employee filter
    if (employeeFilter !== 'all') {
      filtered = filtered.filter(p => p.employeeSystemId === employeeFilter);
    }
    
    // Status filter
    if (statusFilter.size > 0) {
      filtered = filtered.filter(p => p.status && statusFilter.has(p.status));
    }
    
    // Category filter
    if (categoryFilter.size > 0) {
      filtered = filtered.filter(p => p.category && categoryFilter.has(p.category));
    }
    
    // Search filter
    if (debouncedGlobalFilter && debouncedGlobalFilter.trim()) {
      fuseInstance.setCollection(filtered);
      filtered = fuseInstance.search(debouncedGlobalFilter.trim()).map(result => result.item);
    }

    return filtered;
  }, [penalties, debouncedGlobalFilter, fuseInstance, employeeFilter, statusFilter, categoryFilter]);
  
  // Reset pagination when filters change
  React.useEffect(() => {
    setPagination(p => ({ ...p, pageIndex: 0 }));
  }, [debouncedGlobalFilter, employeeFilter, statusFilter, categoryFilter]);
  
  const sortedData = React.useMemo(() => {
    const sorted = [...filteredData];
    if (sorting.id) {
      sorted.sort((a, b) => {
        const aValue = (a as any)[sorting.id];
        const bValue = (b as any)[sorting.id];
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        // Special handling for date columns
        if (sorting.id === 'issueDate' || sorting.id === 'createdAt') {
          const aTime = aValue ? new Date(aValue).getTime() : 0;
          const bTime = bValue ? new Date(bValue).getTime() : 0;
          return sorting.desc ? bTime - aTime : aTime - bTime;
        }
        if (aValue < bValue) return sorting.desc ? 1 : -1;
        if (aValue > bValue) return sorting.desc ? -1 : 1;
        return 0;
      });
    }
    return sorted;
  }, [filteredData, sorting]);

  const pageCount = Math.ceil(sortedData.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, pagination]);

  const numSelected = Object.keys(rowSelection).length;
  const allSelectedRows = React.useMemo(() => 
    penalties.filter(p => rowSelection[p.systemId]),
  [penalties, rowSelection]);

  const isMobile = !useMediaQuery("(min-width: 768px)");

  // Filter options
  const statusOptions = React.useMemo(() => [
    { label: 'Chưa thanh toán', value: 'Chưa thanh toán' },
    { label: 'Đã thanh toán', value: 'Đã thanh toán' },
    { label: 'Đã hủy', value: 'Đã hủy' },
  ], []);

  const categoryOptions = React.useMemo(() => [
    { label: 'Khiếu nại', value: 'complaint' },
    { label: 'Chấm công', value: 'attendance' },
    { label: 'Hiệu suất', value: 'performance' },
    { label: 'Khác', value: 'other' },
  ], []);

  const employeeOptions = React.useMemo(() => {
    const empIds = new Set(penalties.map(p => p.employeeSystemId));
    return employees
      .filter(e => empIds.has(e.systemId))
      .map(e => ({ value: e.systemId, label: e.fullName }));
  }, [penalties, employees]);

  const exportConfig = {
    fileName: 'Danh_sach_Phieu_phat',
    columns,
  }

  const importConfig: ImportConfig<Penalty> = {
    importer: (items) => {
      const itemsWithoutSystemId = items.map(item => {
        const { systemId, ...rest } = item as any;
        return rest as Omit<Penalty, 'systemId'>;
      });
      addMultiple(itemsWithoutSystemId);
    },
    fileName: 'Mau_Nhap_Phieu_phat',
    existingData: penalties,
    getUniqueKey: (item: any) => item.id
  }

  // Bulk print handlers
  const handleBulkPrint = React.useCallback((rows: Penalty[]) => {
    setItemsToPrint(rows);
    setPrintDialogOpen(true);
  }, []);

  const handlePrintConfirm = React.useCallback((options: SimplePrintOptionsResult) => {
    if (itemsToPrint.length === 0) return;
    
    const printItems = itemsToPrint.map(penalty => {
      const employee = employees.find(e => e.systemId === penalty.employeeSystemId);
      const selectedBranch = options.branchSystemId 
        ? branches.find(b => b.systemId === options.branchSystemId)
        : null;
      const storeSettings = selectedBranch 
        ? createStoreSettings(selectedBranch)
        : createStoreSettings(storeInfo);
      const penaltyData = convertPenaltyForPrint(penalty, { employee });
      
      return {
        data: mapPenaltyToPrintData(penaltyData, storeSettings),
        lineItems: [],
        paperSize: options.paperSize,
      };
    });

    printMultiple('penalty', printItems);
    toast.success(`Đang in ${itemsToPrint.length} phiếu phạt`);
    setItemsToPrint([]);
    setPrintDialogOpen(false);
  }, [itemsToPrint, employees, branches, storeInfo, printMultiple]);

  const bulkActions: BulkAction<Penalty>[] = [
    {
      label: "In phiếu",
      icon: Printer,
      onSelect: handleBulkPrint,
    },
    {
      label: "Đánh dấu đã thanh toán",
      onSelect: (selectedRows: Penalty[]) => {
        selectedRows.forEach(p => {
          update(p.systemId, { ...p, status: "Đã thanh toán" as PenaltyStatus });
        });
        toast.success("Đã cập nhật trạng thái", {
          description: `${selectedRows.length} phiếu phạt đã chuyển sang "Đã thanh toán"`,
        });
        setRowSelection({});
      }
    },
    {
      label: "Hủy phiếu phạt",
      onSelect: (selectedRows: Penalty[]) => {
        selectedRows.forEach(p => {
          update(p.systemId, { ...p, status: "Đã hủy" as PenaltyStatus });
        });
        toast.success("Đã cập nhật trạng thái", {
          description: `${selectedRows.length} phiếu phạt đã hủy`,
        });
        setRowSelection({});
      }
    }
  ];

  const handleRowClick = (row: Penalty) => {
    navigate(`/penalties/${row.systemId}`);
  };

  // Mobile Penalty Card Component
  const MobilePenaltyCard = ({ penalty }: { penalty: Penalty }) => {
    const getStatusVariant = (status: PenaltyStatus): "warning" | "success" | "secondary" => {
      const map: Record<PenaltyStatus, "warning" | "success" | "secondary"> = {
        'Chưa thanh toán': 'warning',
        'Đã thanh toán': 'success',
        'Đã hủy': 'secondary'
      };
      return map[status] || 'secondary';
    };

    return (
      <Card 
        className="hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => handleRowClick(penalty)}
      >
        <CardContent className="p-4">
          {/* Header: ID + Status + Menu */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0" />
              <span className="font-semibold text-sm font-mono">{penalty.id}</span>
              <Badge variant={getStatusVariant(penalty.status)} className="text-xs ml-auto">
                {penalty.status}
              </Badge>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <TouchButton
                  variant="ghost"
                  size="sm"
                  className="h-9 w-10 p-0 flex-shrink-0 ml-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </TouchButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/penalties/${penalty.systemId}/edit`); }}>
                  Chỉnh sửa
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Employee Info */}
          <div className="flex items-center text-sm mb-2">
            <User className="h-3.5 w-3.5 mr-1.5 text-muted-foreground flex-shrink-0" />
            <span className="font-medium truncate">{penalty.employeeName}</span>
          </div>

          {/* Reason */}
          <div className="text-xs text-muted-foreground mb-3 line-clamp-2">
            <FileText className="h-3 w-3 mr-1.5 inline-flex flex-shrink-0" />
            {penalty.reason}
          </div>

          {/* Divider */}
          <div className="border-t mb-3" />

          {/* Amount + Date + Category */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold text-destructive text-sm">
                {formatCurrency(penalty.amount)} đ
              </span>
              {penalty.category && (
                <Badge variant="outline" className="text-xs">
                  {penaltyCategoryLabels[penalty.category]}
                </Badge>
              )}
            </div>
            <div className="flex items-center text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(penalty.issueDate)}
            </div>
          </div>

          {/* Issuer */}
          <div className="text-xs text-muted-foreground mt-2 pt-2 border-t">
            Người lập: {penalty.issuerName}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* ===== TOOLBAR - Import/Export/Column Customizer (Desktop only) ===== */}
      {!isMobile && (
        <PageToolbar
          leftActions={
            <>
              <DataTableImportDialog config={importConfig} />
              <DataTableExportDialog 
                allData={penalties} 
                filteredData={sortedData} 
                pageData={paginatedData} 
                config={exportConfig} 
              />
            </>
          }
          rightActions={
            <DataTableColumnCustomizer
              columns={columns}
              columnVisibility={columnVisibility}
              setColumnVisibility={setColumnVisibility}
              columnOrder={columnOrder}
              setColumnOrder={setColumnOrder}
              pinnedColumns={pinnedColumns}
              setPinnedColumns={setPinnedColumns}
              onResetToDefault={resetColumnLayout}
            />
          }
        />
      )}

      {/* ===== FILTERS - Search & Custom Filters ===== */}
      <PageFilters
        searchValue={globalFilter}
        onSearchChange={setGlobalFilter}
        searchPlaceholder="Tìm kiếm phiếu phạt (mã, tên NV, lý do)..."
      >
        {/* Employee Filter */}
        <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
          <SelectTrigger className="w-full sm:w-[180px] h-9">
            <SelectValue placeholder="Tất cả nhân viên" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả nhân viên</SelectItem>
            {employeeOptions.map(e => (
              <SelectItem key={e.value} value={e.value}>
                {e.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <DataTableFacetedFilter
          title="Trạng thái"
          options={statusOptions}
          selectedValues={statusFilter}
          onSelectedValuesChange={setStatusFilter}
        />

        {/* Category Filter */}
        <DataTableFacetedFilter
          title="Phân loại"
          options={categoryOptions}
          selectedValues={categoryFilter}
          onSelectedValuesChange={setCategoryFilter}
        />
      </PageFilters>

      <div className="w-full py-4">
        <ResponsiveDataTable
          columns={columns}
          data={paginatedData}
          renderMobileCard={(penalty) => (
            <MobilePenaltyCard penalty={penalty} />
          )}
          pageCount={pageCount}
          pagination={pagination}
          setPagination={setPagination}
          rowCount={filteredData.length}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          bulkActions={bulkActions}
          allSelectedRows={allSelectedRows}
          expanded={expanded}
          setExpanded={setExpanded}
          sorting={sorting}
          setSorting={setSorting as React.Dispatch<React.SetStateAction<{ id: string; desc: boolean; }>>}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
          columnOrder={columnOrder}
          setColumnOrder={setColumnOrder}
          pinnedColumns={pinnedColumns}
          setPinnedColumns={setPinnedColumns}
          onRowClick={handleRowClick}
          emptyTitle="Chưa có phiếu phạt"
          emptyDescription="Tạo phiếu phạt để ghi nhận vi phạm"
        />
      </div>

      {/* Print Options Dialog */}
      <SimplePrintOptionsDialog
        open={printDialogOpen}
        onOpenChange={setPrintDialogOpen}
        onConfirm={handlePrintConfirm}
        selectedCount={itemsToPrint.length}
        title="In phiếu phạt"
      />
    </div>
  );
}
