import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../lib/router';
import { useInventoryCheckStore } from './store.ts';
import { getColumns } from './columns.tsx';
import { InventoryCheckCard } from './card.tsx';
import { ResponsiveDataTable } from '../../components/data-table/responsive-data-table.tsx';
import { DataTableFacetedFilter } from '../../components/data-table/data-table-faceted-filter.tsx';
import { DataTableColumnCustomizer } from '../../components/data-table/data-table-column-toggle.tsx';
import { DataTableExportDialog } from '../../components/data-table/data-table-export-dialog.tsx';
import { Button } from '../../components/ui/button.tsx';
import { Input } from '../../components/ui/input.tsx';
import { usePageHeader } from '../../contexts/page-header-context.tsx';
import { useBreakpoint } from '../../contexts/breakpoint-context.tsx';
import { Plus, Download } from 'lucide-react';
import { toast } from 'sonner';
import Fuse from 'fuse.js';
import { createSystemId } from '../../lib/id-config.ts';
import type { InventoryCheck } from './types.ts';

export function InventoryChecksPage() {
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint();
  const { data, remove, balanceCheck } = useInventoryCheckStore();

  // States
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = React.useState({ id: 'createdAt', desc: true });
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({});
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>(['select', 'id']);
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);

  // Handlers
  const handleEdit = React.useCallback((item: InventoryCheck) => {
    navigate(`/inventory-checks/${item.systemId}/edit`);
  }, [navigate]);

  const handleDelete = React.useCallback((systemId: string) => {
    if (!confirm('Bạn có chắc muốn xóa phiếu kiểm hàng này?')) return;
    remove(createSystemId(systemId));
    toast.success('Đã xóa phiếu kiểm hàng');
  }, [remove]);

  const handleBalance = React.useCallback((systemId: string) => {
    if (!confirm('Bạn có chắc muốn cân bằng phiếu kiểm hàng này? Hành động này không thể hoàn tác.')) return;
    balanceCheck(createSystemId(systemId));
    toast.success('Đã cân bằng phiếu kiểm hàng');
  }, [balanceCheck]);

  // Columns
  const columns = React.useMemo(() => 
    getColumns(handleEdit, handleDelete, handleBalance, navigate),
    [handleEdit, handleDelete, handleBalance, navigate]
  );

  // Default column visibility - 15 columns for sticky scrollbar
  React.useEffect(() => {
    if (!columns || columns.length === 0) return;
    
    const defaultVisibleColumns = [
      'id', 'branch', 'status', 'createdAt', 'createdBy', 
      'balancedAt', 'itemsCount', 'systemQty', 'actualQty', 
      'difference', 'itemPreview', 'note'
    ];
    
    const initialVisibility: Record<string, boolean> = {};
    columns.forEach(c => {
      if (c.id === 'select' || c.id === 'actions') {
        initialVisibility[c.id!] = true;
      } else {
        initialVisibility[c.id!] = defaultVisibleColumns.includes(c.id!);
      }
    });
    
    setColumnVisibility(initialVisibility);
    setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
  }, [columns]);

  // Search & Filter with Fuse.js
  const fuse = React.useMemo(() => new Fuse(data, { 
    keys: ['id', 'branchName', 'createdBy', 'note'],
    threshold: 0.3,
  }), [data]);

  const filteredData = React.useMemo(() => {
    let result = data;
    
    // Search
    if (searchQuery) {
      result = fuse.search(searchQuery).map(r => r.item);
    }
    
    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(item => item.status === statusFilter);
    }
    
    // Sorting
    if (sorting) {
      result = [...result].sort((a, b) => {
        const aValue = (a as any)[sorting.id];
        const bValue = (b as any)[sorting.id];
        
        if (aValue < bValue) return sorting.desc ? 1 : -1;
        if (aValue > bValue) return sorting.desc ? -1 : 1;
        return 0;
      });
    }
    
    return result;
  }, [data, searchQuery, statusFilter, sorting, fuse]);

  // Pagination
  const pageCount = Math.ceil(filteredData.length / pagination.pageSize);
  const paginatedData = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    return filteredData.slice(start, start + pagination.pageSize);
  }, [filteredData, pagination]);

  // Mobile infinite scroll
  React.useEffect(() => {
    setMobileLoadedCount(20);
  }, [searchQuery, statusFilter]);

  React.useEffect(() => {
    if (!isMobile) return;
    
    const handleScroll = () => {
      const scrollPercentage = ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100;
      if (scrollPercentage > 80 && mobileLoadedCount < filteredData.length) {
        setMobileLoadedCount(prev => Math.min(prev + 20, filteredData.length));
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, mobileLoadedCount, filteredData.length]);

  const displayData = isMobile ? filteredData.slice(0, mobileLoadedCount) : paginatedData;

  // Selected rows
  const allSelectedRows = React.useMemo(() => 
    Object.keys(rowSelection)
      .filter(key => rowSelection[key])
      .map(systemId => filteredData.find(item => item.systemId === systemId))
      .filter(Boolean) as InventoryCheck[],
    [rowSelection, filteredData]
  );

  const handleBulkDelete = React.useCallback(() => {
    if (allSelectedRows.length === 0) return;
    if (!confirm(`Bạn có chắc muốn xóa ${allSelectedRows.length} phiếu đã chọn?`)) return;
    
    allSelectedRows.forEach(row => remove(createSystemId(row.systemId)));
    setRowSelection({});
    toast.success(`Đã xóa ${allSelectedRows.length} phiếu kiểm hàng`);
  }, [allSelectedRows, remove]);

  // Header actions
  const actions = React.useMemo(() => {
    const acts = [
      <DataTableExportDialog 
        key="export"
        allData={data}
        filteredData={filteredData}
        pageData={paginatedData}
        config={{
          fileName: 'danh-sach-kiem-hang',
          columns: columns || []
        }}
      />,
      <Button key="add" onClick={() => navigate('/inventory-checks/new')}>
        <Plus className="mr-2 h-4 w-4" />
        Tạo phiếu kiểm hàng
      </Button>
    ];
    
    // Only add column customizer if columns are loaded
    if (columns && columns.length > 0) {
      acts.splice(1, 0,
        <DataTableColumnCustomizer 
          key="columns"
          columns={columns}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
          columnOrder={columnOrder}
          setColumnOrder={setColumnOrder}
          pinnedColumns={pinnedColumns}
          setPinnedColumns={setPinnedColumns}
        />
      );
    }
    
    return acts;
  }, [data, filteredData, paginatedData, columns, columnVisibility, columnOrder, pinnedColumns, navigate]);

  usePageHeader({ actions });

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="flex gap-2">
        <Input 
          placeholder="Tìm kiếm theo mã, chi nhánh, người tạo..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <DataTableFacetedFilter
          title="Trạng thái"
          selectedValues={new Set(statusFilter === 'all' ? [] : [statusFilter])}
          onSelectedValuesChange={(values) => setStatusFilter(values.size === 0 ? 'all' : Array.from(values)[0] as string)}
          options={[
            { label: 'Nháp', value: 'draft' },
            { label: 'Đã cân bằng', value: 'balanced' },
            { label: 'Đã hủy', value: 'cancelled' },
          ]}
        />
      </div>

      {/* Data Table */}
      <ResponsiveDataTable
        columns={columns}
        data={displayData}
        renderMobileCard={(item) => (
          <InventoryCheckCard 
            item={item} 
            onEdit={handleEdit}
            onBalance={handleBalance}
          />
        )}
        pageCount={pageCount}
        pagination={pagination}
        setPagination={setPagination}
        rowCount={filteredData.length}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        allSelectedRows={allSelectedRows}
        onBulkDelete={handleBulkDelete}
        sorting={sorting}
        setSorting={setSorting}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        columnOrder={columnOrder}
        setColumnOrder={setColumnOrder}
        pinnedColumns={pinnedColumns}
        setPinnedColumns={setPinnedColumns}
        emptyTitle="Không có phiếu kiểm hàng"
        emptyDescription="Tạo phiếu kiểm hàng đầu tiên để bắt đầu"
      />

      {/* Mobile loading indicator */}
      {isMobile && mobileLoadedCount < filteredData.length && (
        <div className="py-6 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-sm">Đang tải thêm...</span>
          </div>
        </div>
      )}
      
      {isMobile && mobileLoadedCount >= filteredData.length && filteredData.length > 20 && (
        <div className="py-6 text-center">
          <p className="text-sm text-muted-foreground">
            Đã hiển thị tất cả {filteredData.length} kết quả
          </p>
        </div>
      )}
    </div>
  );
}
