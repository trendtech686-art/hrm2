import * as React from "react"
// FIX: Use named imports for react-router-dom to fix module export errors.
import { useNavigate } from 'react-router-dom';
import { useCustomerStore } from "./store.ts"
import { useCustomerTypeStore } from "../settings/customers/customer-types-store.ts"
import { asSystemId, asBusinessId } from '../../lib/id-types';
import { getColumns } from "./columns.tsx"
import { ResponsiveDataTable } from "../../components/data-table/responsive-data-table.tsx"
import { DataTableToolbar } from "../../components/data-table/data-table-toolbar.tsx"
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card.tsx"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog.tsx"
import type { Customer } from "./types.ts"
import { Button } from "../../components/ui/button.tsx"
import { PlusCircle } from "lucide-react"
import { DataTableExportDialog } from "../../components/data-table/data-table-export-dialog.tsx";
import { DataTableImportDialog } from "../../components/data-table/data-table-import-dialog.tsx";
import { DataTableColumnCustomizer } from "../../components/data-table/data-table-column-toggle.tsx";
import { DataTableDateFilter } from "../../components/data-table/data-table-date-filter.tsx";
import { PageFilters } from "../../components/layout/page-filters.tsx";
import Fuse from "fuse.js"
import { usePageHeader } from "../../contexts/page-header-context.tsx";
import { ResponsiveContainer } from "../../components/ui/responsive-container.tsx";
import { MobileSearchBar } from "../../components/mobile/mobile-search-bar.tsx";
import { TouchButton } from "../../components/mobile/touch-button.tsx";
import { Badge } from "../../components/ui/badge.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar.tsx";
import { useMediaQuery } from "../../lib/use-media-query.ts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select.tsx";
import { MoreVertical, Phone, Mail, Building2, MapPin, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, getCurrentDate, isDateSame, isDateBetween, isDateAfter, isDateBefore, isValidDate } from '../../lib/date-utils.ts';
import { cn } from "../../lib/utils.ts";
import { DebtOverviewWidget } from "./debt-overview-widget.tsx";
export function CustomersPage() {
  const { data: customersRaw, remove, restore, getActive, getDeleted, addMultiple, update } = useCustomerStore();
  const customerTypes = useCustomerTypeStore();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  // ✅ Memoize customers để tránh unstable reference
  const customers = React.useMemo(() => customersRaw, [customersRaw]);
  
  // ✅ Get deleted count - always recalculate when customers change
  const deletedCount = React.useMemo(() => {
    return customers.filter(c => c.isDeleted).length;
  }, [customers]);
  
  // ✅ State để toggle giữa Active và Deleted
  const [showDeleted, setShowDeleted] = React.useState(false);
  
  // ✅ Memoize headerActions để tránh infinite loop
  const headerActions = React.useMemo(() => [
    <Button key="trash" variant="outline" size="sm" onClick={() => navigate('/customers/trash')}>
      <Trash2 className="mr-2 h-4 w-4" />
      Thùng rác ({deletedCount})
    </Button>,
    <Button key="add" size="sm" onClick={() => navigate('/customers/new')}>
      <PlusCircle className="mr-2 h-4 w-4" />
      Thêm khách hàng
    </Button>
  ], [deletedCount, navigate]);
  
  usePageHeader({
    actions: headerActions
  });
  
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})
  const [isAlertOpen, setIsAlertOpen] = React.useState(false)
  const [idToDelete, setIdToDelete] = React.useState<string | null>(null)
  const [isBulkDeleteAlertOpen, setIsBulkDeleteAlertOpen] = React.useState(false)

  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({})
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>(() => {
    const storageKey = 'customers-column-visibility';
    const stored = localStorage.getItem(storageKey);
    const cols = getColumns(() => {}, () => {}, navigate);
    const allColumnIds = cols.map((c: any) => c.id).filter(Boolean);
    if (stored) {
      try {
        const parsedData = JSON.parse(stored);
        if (allColumnIds.every((id: string) => id in parsedData)) return parsedData;
      } catch (e) {}
    }
    const initial: Record<string, boolean> = {};
    cols.forEach((c: any) => { if (c.id) initial[c.id] = true; });
    return initial;
  })
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);
  
  React.useEffect(() => {
    localStorage.setItem('customers-column-visibility', JSON.stringify(columnVisibility));
  }, [columnVisibility]);
  
  // Table state
  const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'name', desc: false });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
  
  // Mobile infinite scroll state
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);
  
  // Filters state
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [typeFilter, setTypeFilter] = React.useState<string>('all');
  const [dateRangeFilter, setDateRangeFilter] = React.useState<[string | undefined, string | undefined] | undefined>();

  const handleDelete = React.useCallback((systemId: string) => {
    setIdToDelete(systemId)
    setIsAlertOpen(true)
  }, [])
  
  // ✅ Handle restore cho soft delete
  const handleRestore = React.useCallback((systemId: string) => {
    restore(asSystemId(systemId));
  }, [restore]);

  const columns = React.useMemo(() => getColumns(handleDelete, handleRestore, navigate), [handleDelete, handleRestore, navigate]);

  // ✅ Run once on mount only
  React.useEffect(() => {
    const defaultVisibleColumns = [
      'id', 'name', 'email', 'phone', 'shippingAddress', 'status', 'accountManagerName'
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
  }, []);
  
  // ✅ Cache active and deleted customers
  const activeCustomers = React.useMemo(() => getActive(), [customers]);
  const deletedCustomers = React.useMemo(() => getDeleted(), [customers]);
  
  const fuse = React.useMemo(() => new Fuse(showDeleted ? deletedCustomers : activeCustomers, { keys: ["name", "email", "phone", "company", "taxCode"] }), [activeCustomers, deletedCustomers, showDeleted]);
  
  const confirmDelete = () => {
    if (idToDelete) {
      remove(asSystemId(idToDelete));
      toast.success('Đã chuyển khách hàng vào thùng rác');
    }
    setIsAlertOpen(false)
    setIdToDelete(null)
  }

  const confirmBulkDelete = () => {
    const idsToDelete = Object.keys(rowSelection);
    idsToDelete.forEach(systemId => remove(asSystemId(systemId)));
    setRowSelection({});
    setIsBulkDeleteAlertOpen(false);
  }

  const handleAddNew = () => {
    navigate('/customers/new');
  }
  
  const filteredData = React.useMemo(() => {
    let sourceData = showDeleted ? deletedCustomers : activeCustomers;
    
    // Apply status filter
    if (statusFilter !== 'all') {
      sourceData = sourceData.filter(c => c.status === statusFilter);
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      sourceData = sourceData.filter(c => c.type === typeFilter);
    }
    
    // Apply date range filter
    if (dateRangeFilter && (dateRangeFilter[0] || dateRangeFilter[1])) {
      sourceData = sourceData.filter(c => {
        if (!c.createdAt) return false;
        const createdDate = new Date(c.createdAt);
        const fromDate = dateRangeFilter[0] ? new Date(dateRangeFilter[0]) : null;
        const toDate = dateRangeFilter[1] ? new Date(dateRangeFilter[1]) : null;
        
        if (fromDate && isDateBefore(createdDate, fromDate)) return false;
        if (toDate && isDateAfter(createdDate, toDate)) return false;
        return true;
      });
    }
    
    // Apply search filter
    if (globalFilter) {
      return fuse.search(globalFilter).map(result => result.item).filter(item => {
        // Reapply other filters to search results
        let pass = true;
        if (statusFilter !== 'all') pass = pass && item.status === statusFilter;
        if (typeFilter !== 'all') pass = pass && item.type === typeFilter;
        return pass;
      });
    }
    
    return sourceData;
  }, [activeCustomers, deletedCustomers, showDeleted, globalFilter, fuse, statusFilter, typeFilter, dateRangeFilter]);
  
  const sortedData = React.useMemo(() => {
    const sorted = [...filteredData];
    if (sorting.id) {
      sorted.sort((a, b) => {
        const aValue = (a as any)[sorting.id];
        const bValue = (b as any)[sorting.id];
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
  const allSelectedRows = React.useMemo(() => {
    const sourceData = showDeleted ? deletedCustomers : activeCustomers;
    return sourceData.filter(cust => rowSelection[cust.systemId]);
  }, [activeCustomers, deletedCustomers, showDeleted, rowSelection]);

  // Mobile infinite scroll - detect scroll and load more
  React.useEffect(() => {
    if (!isMobile) return;
    
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;
      
      if (scrollTop + clientHeight >= scrollHeight * 0.8) {
        if (mobileLoadedCount < sortedData.length) {
          setMobileLoadedCount(prev => Math.min(prev + 20, sortedData.length));
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, mobileLoadedCount, sortedData.length]);
  
  // Reset mobile loaded count when filters change
  React.useEffect(() => {
    setMobileLoadedCount(20);
  }, [globalFilter, statusFilter, typeFilter, dateRangeFilter, showDeleted]);

  const exportConfig = {
    fileName: 'Danh_sach_Khach_hang',
    columns,
  }

  const importConfig = {
    importer: (data: Omit<Customer, "id">[]) => {
      // Không cần generate manual ID, để store tự động generate theo format chuẩn
      // Store sẽ tạo systemId: CUSTOMER000XXX và id: KH000XXX
      const dataWithEmptyId = data.map(item => ({
        ...item,
        id: asBusinessId('')
      })) as Omit<Customer, "systemId">[];
      addMultiple(dataWithEmptyId);
    },
    fileName: 'Mau_Nhap_Khach_hang'
  }

  const bulkActions = [
    {
      label: "Chuyển vào thùng rác",
      onSelect: (selectedRows: Customer[]) => {
        const systemIds = selectedRows.map(c => c.systemId);
        systemIds.forEach(id => remove(asSystemId(id)));
        setRowSelection({});
        toast.success(`Đã chuyển ${selectedRows.length} khách hàng vào thùng rác`);
      }
    },
    {
      label: "Đang giao dịch",
      onSelect: (selectedRows: Customer[]) => {
        selectedRows.forEach(customer => {
          update(asSystemId(customer.systemId), { ...customer, status: 'Đang giao dịch' });
        });
        setRowSelection({});
        toast.success(`Đã cập nhật ${selectedRows.length} khách hàng sang trạng thái "Đang giao dịch"`);
      }
    },
    {
      label: "Ngừng giao dịch",
      onSelect: (selectedRows: Customer[]) => {
        selectedRows.forEach(customer => {
          update(asSystemId(customer.systemId), { ...customer, status: 'Ngừng Giao Dịch' });
        });
        setRowSelection({});
        toast.success(`Đã cập nhật ${selectedRows.length} khách hàng sang trạng thái "Ngừng giao dịch"`);
      }
    }
  ];

  const handleRowClick = (customer: Customer) => {
    navigate(`/customers/${customer.systemId}`);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Đang giao dịch': return 'default';
      case 'Ngừng giao dịch': return 'secondary';
      case 'Nợ xấu': return 'destructive';
      default: return 'default';
    }
  };

  const MobileCustomerCard = ({ customer }: { customer: Customer }) => {
    return (
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleRowClick(customer)}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <Avatar className="h-12 w-12 flex-shrink-0">
              <AvatarImage src="" alt={customer.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-1">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm truncate">{customer.name}</h3>
                  <p className="text-xs text-muted-foreground">{customer.id}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <TouchButton
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </TouchButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/customers/${customer.systemId}/edit`); }}>
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDelete(customer.systemId); }}>
                      Chuyển vào thùng rác
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Details */}
              <div className="space-y-1.5 mt-2">
                {customer.company && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Building2 className="h-3 w-3 mr-1.5" />
                    <span className="truncate">{customer.company}</span>
                  </div>
                )}
                {customer.email && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Mail className="h-3 w-3 mr-1.5" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                )}
                {customer.phone && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Phone className="h-3 w-3 mr-1.5" />
                    <span>{customer.phone}</span>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-3 pt-2 border-t">
                <Badge variant={getStatusVariant(customer.status)} className="text-xs">
                  {customer.status}
                </Badge>
                {customer.accountManagerName && (
                  <span className="text-xs text-muted-foreground">
                    NV: {customer.accountManagerName}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col gap-4">
        <div className="flex-shrink-0 space-y-4">
          {/* Header Actions */}
          {isMobile ? (
            <div className="space-y-3">
              {/* Primary Action Button */}
              <TouchButton 
                onClick={() => navigate('/customers/new')} 
                size="default"
                className="w-full min-h-touch"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Thêm khách hàng
              </TouchButton>
              
              {/* Second Row - Action Buttons */}
              <div className="flex gap-2">
                <DataTableImportDialog config={importConfig} />
                <DataTableExportDialog allData={customers} filteredData={sortedData} pageData={paginatedData} config={exportConfig} />
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
          ) : null}
          
          {/* Debt Overview Widget */}
          <DebtOverviewWidget />
          
          {/* Search and Filters */}
          {isMobile ? (
            <div className="space-y-3">
              <MobileSearchBar
                value={globalFilter}
                onChange={setGlobalFilter}
                placeholder="Tìm kiếm khách hàng..."
              />
              
              {/* Mobile Filters */}
              <div className="grid grid-cols-2 gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Tất cả trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="Đang giao dịch">Đang giao dịch</SelectItem>
                    <SelectItem value="Ngừng Giao Dịch">Ngừng giao dịch</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Tất cả loại KH" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả loại KH</SelectItem>
                    {customerTypes.getActive().map(type => (
                      <SelectItem key={type.systemId} value={type.id}>{type.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-between items-center pt-2 border-t">
                <p className="text-sm text-muted-foreground">{filteredData.length} khách hàng</p>
              </div>
            </div>
          ) : (
            <>
              <PageFilters
                searchValue={globalFilter}
                onSearchChange={setGlobalFilter}
                searchPlaceholder="Tìm kiếm khách hàng..."
              >
                {/* Left side - Import/Export buttons */}
                <div className="flex items-center gap-2 mr-auto">
                  <DataTableImportDialog config={importConfig} />
                  <DataTableExportDialog allData={customers} filteredData={sortedData} pageData={paginatedData} config={exportConfig} />
                </div>
                
                {/* Right side - Filters */}
                <DataTableDateFilter
                  value={dateRangeFilter}
                  onChange={setDateRangeFilter}
                  title="Ngày tạo"
                />
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px] h-9">
                    <SelectValue placeholder="Tất cả trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="Đang giao dịch">Đang giao dịch</SelectItem>
                    <SelectItem value="Ngừng Giao Dịch">Ngừng giao dịch</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-[180px] h-9">
                    <SelectValue placeholder="Loại khách hàng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả loại</SelectItem>
                    {customerTypes.getActive().map(type => (
                      <SelectItem key={type.systemId} value={type.id}>{type.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <DataTableColumnCustomizer
                  columns={columns}
                  columnVisibility={columnVisibility}
                  setColumnVisibility={setColumnVisibility}
                  columnOrder={columnOrder}
                  setColumnOrder={setColumnOrder}
                  pinnedColumns={pinnedColumns}
                  setPinnedColumns={setPinnedColumns}
                />
              </PageFilters>
            </>
          )}
        </div>
        
        {/* Content - Mobile Cards or Desktop Table */}
        {isMobile ? (
          <div className="space-y-3 pb-4">
            {sortedData.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Không tìm thấy khách hàng</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {sortedData.slice(0, mobileLoadedCount).map(customer => (
                  <div key={customer.systemId}>
                    <MobileCustomerCard customer={customer} />
                  </div>
                ))}
                {/* Loading Indicator */}
                {mobileLoadedCount < sortedData.length && (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        <p className="text-sm text-muted-foreground">Đang tải thêm...</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {/* End Message */}
                {mobileLoadedCount >= sortedData.length && sortedData.length > 20 && (
                  <Card>
                    <CardContent className="py-6 text-center">
                      <p className="text-sm text-muted-foreground">
                        Đã hiển thị tất cả {sortedData.length} khách hàng
                      </p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="w-full py-4">
            <ResponsiveDataTable
              columns={columns}
              data={paginatedData}
              renderMobileCard={(customer) => (
                <MobileCustomerCard customer={customer} />
              )}
              pageCount={pageCount}
              pagination={pagination}
              setPagination={setPagination}
              rowCount={filteredData.length}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              onBulkDelete={() => setIsBulkDeleteAlertOpen(true)}
              bulkActions={bulkActions}
              allSelectedRows={allSelectedRows}
              sorting={sorting}
              setSorting={setSorting}
              expanded={expanded}
              setExpanded={setExpanded}
              columnVisibility={columnVisibility}
              setColumnVisibility={setColumnVisibility}
              columnOrder={columnOrder}
              setColumnOrder={setColumnOrder}
              pinnedColumns={pinnedColumns}
              setPinnedColumns={setPinnedColumns}
              onRowClick={handleRowClick}
            />
          </div>
        )}
      </div>
      
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Khách hàng sẽ được chuyển vào thùng rác. Bạn có thể khôi phục lại sau.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isBulkDeleteAlertOpen} onOpenChange={setIsBulkDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              {numSelected} khách hàng sẽ được chuyển vào thùng rác. Bạn có thể khôi phục lại sau.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
