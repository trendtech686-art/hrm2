import * as React from "react"
// FIX: Use named imports for react-router-dom to fix module export errors.
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../lib/router';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, getCurrentDate, isDateSame, isDateBetween, isDateAfter, isDateBefore, isValidDate, getStartOfDay, getEndOfDay } from '../../lib/date-utils.ts'
import { useEmployeeStore } from "./store.ts"
import { useBranchStore } from "../settings/branches/store.ts";
import { getColumns } from "./columns.tsx"
import { DataTable } from "../../components/data-table/data-table.tsx"
import { ResponsiveDataTable } from "../../components/data-table/responsive-data-table.tsx"
import { DataTableToolbar } from "../../components/data-table/data-table-toolbar.tsx"
import { DataTableFacetedFilter } from "../../components/data-table/data-table-faceted-filter.tsx"
import { toast } from "sonner"
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
import { Button } from "../../components/ui/button.tsx"
import { PlusCircle, Phone, Mail, Building2, Calendar, MoreHorizontal, Trash2 } from "lucide-react"
import type { Employee } from "./types.ts"
import { DataTableExportDialog } from "../../components/data-table/data-table-export-dialog.tsx";
import { DataTableImportDialog, type ImportConfig } from "../../components/data-table/data-table-import-dialog.tsx";
import Fuse from "fuse.js"
import { usePageHeader } from "../../contexts/page-header-context.tsx";
import { DataTableColumnCustomizer } from "../../components/data-table/data-table-column-toggle.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select.tsx";
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
import { PageToolbar } from "../../components/layout/page-toolbar.tsx";
import { PageFilters } from "../../components/layout/page-filters.tsx";
import { cn } from "../../lib/utils.ts";
export function EmployeesPage() {
  const { data: employees, remove, restore, getActive, getDeleted, addMultiple, update } = useEmployeeStore();
  const { data: branchesRaw } = useBranchStore();
  const navigate = useNavigate();
  
  // ✅ Memoize branches to prevent re-renders
  const branches = React.useMemo(() => branchesRaw, [branchesRaw]);
  
  // Calculate deleted count reactively
  const deletedCount = React.useMemo(() => 
    employees.filter((e: any) => e.isDeleted).length, 
    [employees]
  );
  
  // ✅ Memoize actions to prevent infinite loop
  const headerActions = React.useMemo(() => [
    <Button key="trash" variant="outline" size="sm" onClick={() => navigate('/employees/trash')}>
      <Trash2 className="mr-2 h-4 w-4" />
      Thùng rác ({deletedCount})
    </Button>,
    <Button key="add" size="sm" onClick={() => navigate('/employees/new')}>
      <PlusCircle className="mr-2 h-4 w-4" />
      Thêm nhân viên
    </Button>
  ], [navigate, deletedCount]);
  
  // Set page header with actions
  usePageHeader({
    actions: headerActions
  });
  
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})
  const [isAlertOpen, setIsAlertOpen] = React.useState(false)
  const [idToDelete, setIdToDelete] = React.useState<string | null>(null)
  const [isBulkDeleteAlertOpen, setIsBulkDeleteAlertOpen] = React.useState(false)
  
  // Table state
  // FIX: Cast `setSorting` to the correct type to allow functional updates and prevent stale state issues when sorting columns.
  const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'fullName', desc: false });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = React.useState('');
  const [branchFilter, setBranchFilter] = React.useState('all');
  const [dateFilter, setDateFilter] = React.useState<[string | undefined, string | undefined] | undefined>();
  const [departmentFilter, setDepartmentFilter] = React.useState<Set<string>>(new Set());
  const [jobTitleFilter, setJobTitleFilter] = React.useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = React.useState<Set<string>>(new Set());
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 40 });
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  
  // Debounce search input for better performance
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedGlobalFilter(globalFilter);
    }, 300);
    return () => clearTimeout(timer);
  }, [globalFilter]);
  
  // Column customization state
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>(() => {
    const storageKey = 'employees-column-visibility';
    const stored = localStorage.getItem(storageKey);
    const cols = getColumns(() => {}, () => {}, navigate, branches);
    const allColumnIds = cols.map((c: any) => c.id).filter(Boolean);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (allColumnIds.every((id: string) => id in parsed)) return parsed;
      } catch (e) {}
    }
    const initial: Record<string, boolean> = {};
    cols.forEach((c: any) => { if (c.id) initial[c.id] = true; });
    return initial;
  });
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);
  
  React.useEffect(() => {
    localStorage.setItem('employees-column-visibility', JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  // Mobile infinite scroll state
  const [mobilePageSize, setMobilePageSize] = React.useState(20);
  const [mobileLoadedCount, setMobileLoadedCount] = React.useState(20);
  const mobileScrollRef = React.useRef<HTMLDivElement>(null);

  const handleDelete = React.useCallback((systemId: string) => {
    setIdToDelete(systemId)
    setIsAlertOpen(true)
  }, [])
  
  const handleRestore = React.useCallback((systemId: string) => {
    restore(systemId);
    toast.success("Đã khôi phục nhân viên");
  }, [restore]);
  
  const columns = React.useMemo(() => getColumns(handleDelete, handleRestore, navigate, branches), [handleDelete, handleRestore, navigate, branches]);
  
  // Set default visibility and order on mount ONLY
  React.useEffect(() => {
    const defaultVisibleColumns = [
      'id', 'fullName', 'workEmail', 'phone', 'branch', 'department', 
      'jobTitle', 'hireDate', 'employmentStatus', 'dateOfBirth', 'gender',
      'nationalId', 'address', 'bankName', 'bankAccountNumber', 'basicSalary',
      'contractType', 'annualLeaveBalance', 'sickLeaveBalance'
    ];
    
    const initialVisibility: Record<string, boolean> = {};
    columns.forEach(c => {
      // 'select' and 'actions' are always visible and not in the customizer
      if (c.id === 'select' || c.id === 'actions') {
        initialVisibility[c.id!] = true;
      } else {
        initialVisibility[c.id!] = defaultVisibleColumns.includes(c.id!);
      }
    });

    setColumnVisibility(initialVisibility);
    setColumnOrder(columns.map(c => c.id).filter(Boolean) as string[]);
  }, []); // ✅ Run once on mount only
  
  const confirmDelete = () => {
    if (idToDelete) {
      const employee = employees.find(e => e.systemId === idToDelete);
      remove(idToDelete);
      toast.success("Đã xóa nhân viên vào thùng rác", {
        description: `Nhân viên ${employee?.fullName || ''} đã được chuyển vào thùng rác.`,
      });
    }
    setIsAlertOpen(false)
    setIdToDelete(null)
  }

  const confirmBulkDelete = () => {
    const idsToDelete = Object.keys(rowSelection);
    idsToDelete.forEach(systemId => remove(systemId));
    toast.success("Đã xóa nhân viên vào thùng rác", {
      description: `Đã chuyển ${idsToDelete.length} nhân viên vào thùng rác.`,
    });
    setRowSelection({});
    setIsBulkDeleteAlertOpen(false);
  }
  
  // ✅ Cache active/deleted lists to prevent infinite loops
  const activeEmployees = React.useMemo(() => getActive(), [employees]);
  const deletedEmployees = React.useMemo(() => getDeleted(), [employees]);
  
  // ✅ PERFORMANCE: Create Fuse instance once for active employees only
  const fuseInstance = React.useMemo(() => {
    return new Fuse(activeEmployees, { 
      keys: ["id", "fullName", "workEmail", "phone", "personalEmail", "department", "jobTitle"],
      threshold: 0.3,
      ignoreLocation: true,
      useExtendedSearch: false
    });
  }, [activeEmployees]);
  
  const filteredData = React.useMemo(() => {
    // ✅ Only work with active employees
    let filtered = activeEmployees;

    if (branchFilter !== 'all') {
      filtered = filtered.filter(emp => emp.branchSystemId === branchFilter);
    }
    
    if (departmentFilter.size > 0) {
      filtered = filtered.filter(emp => emp.department && departmentFilter.has(emp.department));
    }
    
    if (jobTitleFilter.size > 0) {
      filtered = filtered.filter(emp => emp.jobTitle && jobTitleFilter.has(emp.jobTitle));
    }
    
    if (statusFilter.size > 0) {
      filtered = filtered.filter(emp => emp.employmentStatus && statusFilter.has(emp.employmentStatus));
    }
    
    // ✅ FIX: Apply search using pre-built Fuse instance
    if (debouncedGlobalFilter && debouncedGlobalFilter.trim()) {
      // Update Fuse data if needed and search
      fuseInstance.setCollection(filtered);
      filtered = fuseInstance.search(debouncedGlobalFilter.trim()).map(result => result.item);
    }
    
    if (dateFilter && (dateFilter[0] || dateFilter[1])) {
      const [start, end] = dateFilter;
      const startDate = start ? getStartOfDay(start) : null;
      const endDate = end ? getEndOfDay(end) : null;

      filtered = filtered.filter(employee => {
        const rowDate = new Date(employee.hireDate);
        if (!isValidDate(rowDate)) return false;
        
        if (startDate && !endDate) return isDateAfter(rowDate, startDate) || isDateSame(rowDate, startDate);
        if (!startDate && endDate) return isDateBefore(rowDate, endDate) || isDateSame(rowDate, endDate);
        if (startDate && endDate) return isDateBetween(rowDate, startDate, endDate);
        return true;
      });
    }

    return filtered;
  }, [activeEmployees, debouncedGlobalFilter, dateFilter, fuseInstance, branchFilter, departmentFilter, jobTitleFilter, statusFilter]);
  
  // Reset pagination when filters change
  React.useEffect(() => {
    setPagination(p => ({ ...p, pageIndex: 0 }));
  }, [debouncedGlobalFilter, branchFilter, departmentFilter, jobTitleFilter, statusFilter, dateFilter]);
  
  const sortedData = React.useMemo(() => {
    const sorted = [...filteredData];
    if (sorting.id) {
      sorted.sort((a, b) => {
        const aValue = (a as any)[sorting.id];
        const bValue = (b as any)[sorting.id];
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
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
    employees.filter(emp => rowSelection[emp.systemId]),
  [employees, rowSelection]);

  const isMobile = !useMediaQuery("(min-width: 768px)");

  // Mobile infinite scroll - detect scroll and load more with throttle
  React.useEffect(() => {
    if (!isMobile) return;
    
    let throttleTimer: NodeJS.Timeout | null = null;
    
    const handleScroll = () => {
      if (throttleTimer) return;
      
      throttleTimer = setTimeout(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = window.innerHeight;
        
        // When scroll to 80% of page → load more
        if (scrollTop + clientHeight >= scrollHeight * 0.8) {
          if (mobileLoadedCount < sortedData.length) {
            setMobileLoadedCount(prev => Math.min(prev + 20, sortedData.length));
          }
        }
        
        throttleTimer = null;
      }, 200); // Throttle 200ms
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (throttleTimer) clearTimeout(throttleTimer);
    };
  }, [isMobile, mobileLoadedCount, sortedData.length]);
  
  // Reset mobile loaded count when filters change
  React.useEffect(() => {
    setMobileLoadedCount(20);
  }, [debouncedGlobalFilter, branchFilter, departmentFilter, jobTitleFilter, statusFilter, dateFilter]);

  // Filter options - Only recalculate when employees change
  const departmentOptions = React.useMemo(() => {
    const departments = new Set<string>();
    activeEmployees.forEach(emp => {
      if (emp.department) departments.add(emp.department);
    });
    return Array.from(departments).sort().map(d => ({ label: d, value: d }));
  }, [activeEmployees]);

  const jobTitleOptions = React.useMemo(() => {
    const jobTitles = new Set<string>();
    activeEmployees.forEach(emp => {
      if (emp.jobTitle) jobTitles.add(emp.jobTitle);
    });
    return Array.from(jobTitles).sort().map(j => ({ label: j, value: j }));
  }, [activeEmployees]);

  const statusOptions = React.useMemo(() => [
    { label: 'Đang làm', value: 'Đang làm' },
    { label: 'Đã nghỉ', value: 'Đã nghỉ' },
    { label: 'Thử việc', value: 'Thử việc' },
    { label: 'Tạm nghỉ', value: 'Tạm nghỉ' },
  ], []);


  const exportConfig = {
    fileName: 'Danh_sach_Nhan_vien',
    columns,
  }

  const importConfig: ImportConfig<Employee> = {
    importer: (items) => {
      // Convert from Omit<Employee, 'id'> to Omit<Employee, 'systemId'>
      const itemsWithoutSystemId = items.map(item => {
        const { systemId, ...rest } = item as any;
        return rest as Omit<Employee, 'systemId'>;
      });
      addMultiple(itemsWithoutSystemId);
    },
    fileName: 'Mau_Nhap_Nhan_vien',
    existingData: employees,
    getUniqueKey: (item: any) => item.id || item.nationalId || item.workEmail
  }

  const bulkActions = [
    {
      label: "Chuyển vào thùng rác",
      onSelect: (selectedRows: Employee[]) => {
        setIsBulkDeleteAlertOpen(true);
      }
    },
    {
      label: "Đang làm việc",
      onSelect: (selectedRows: Employee[]) => {
        selectedRows.forEach(emp => {
          update(emp.systemId, { ...emp, employmentStatus: "Đang làm việc" });
        });
        toast.success("Đã cập nhật trạng thái", {
          description: `${selectedRows.length} nhân viên đã chuyển sang "Đang làm việc"`,
        });
        setRowSelection({});
      }
    },
    {
      label: "Nghỉ việc",
      onSelect: (selectedRows: Employee[]) => {
        selectedRows.forEach(emp => {
          update(emp.systemId, { ...emp, employmentStatus: "Đã nghỉ việc" });
        });
        toast.success("Đã cập nhật trạng thái", {
          description: `${selectedRows.length} nhân viên đã chuyển sang "Đã nghỉ việc"`,
        });
        setRowSelection({});
      }
    }
  ];

  const handleRowClick = (row: Employee) => {
    navigate(ROUTES.HRM.EMPLOYEE_VIEW.replace(':systemId', row.systemId));
  };

  // Mobile Employee Card Component
  const MobileEmployeeCard = ({ employee }: { employee: Employee }) => {
    const getInitials = (name: string) => {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
      const map: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        'Đang làm việc': 'default',
        'Tạm nghỉ': 'secondary',
        'Đã nghỉ việc': 'destructive'
      };
      return map[status] || 'default';
    };

    return (
      <Card 
        className="hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => handleRowClick(employee)}
      >
        <CardContent className="p-4">
          {/* Header: Avatar + Name + Code + Menu */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Avatar className="h-9 w-10 flex-shrink-0">
                <AvatarImage src={employee.avatarUrl} alt={employee.fullName} />
                <AvatarFallback className="text-xs">{getInitials(employee.fullName)}</AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <h3 className="font-semibold text-sm truncate">{employee.fullName}</h3>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground font-mono">{employee.id}</span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <TouchButton
                  variant="ghost"
                  size="sm"
                  className="h-9 w-10 p-0 flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </TouchButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/employees/${employee.systemId}/edit`); }}>
                  Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDelete(employee.systemId); }}>
                  Chuyển vào thùng rác
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Job Title + Department */}
          <div className="text-xs text-muted-foreground mb-3 flex items-center">
            <Building2 className="h-3 w-3 mr-1.5 flex-shrink-0" />
            <span className="truncate">{employee.jobTitle} • {employee.department}</span>
          </div>

          {/* Divider */}
          <div className="border-t mb-3" />

          {/* Contact Info */}
          <div className="space-y-2">
            {employee.workEmail && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Mail className="h-3 w-3 mr-1.5 flex-shrink-0" />
                <span className="truncate">{employee.workEmail}</span>
              </div>
            )}
            {employee.phone && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Phone className="h-3 w-3 mr-1.5 flex-shrink-0" />
                <span>{employee.phone}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-xs pt-1">
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1.5" />
                <span>{formatDate(employee.hireDate)}</span>
              </div>
              <Badge variant={getStatusVariant(employee.employmentStatus)} className="text-xs">
                {employee.employmentStatus}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex flex-col w-full h-full">
      {/* ===== HÀNG 2: TOOLBAR - Common Actions (Desktop only) ===== */}
      {!isMobile && (
        <PageToolbar
          leftActions={
            <>
              <DataTableImportDialog config={importConfig} />
              <DataTableExportDialog 
                allData={employees} 
                filteredData={sortedData} 
                pageData={paginatedData} 
                config={exportConfig} 
              />
            </>
          }
          rightActions={
            <>
              <DataTableColumnCustomizer
                columns={columns}
                columnVisibility={columnVisibility}
                setColumnVisibility={setColumnVisibility}
                columnOrder={columnOrder}
                setColumnOrder={setColumnOrder}
                pinnedColumns={pinnedColumns}
                setPinnedColumns={setPinnedColumns}
              />
            </>
          }
        />
      )}

      {/* ===== HÀNG 3: FILTERS - Search & Custom Filters (1 hàng) ===== */}
      <PageFilters
        searchValue={globalFilter}
        onSearchChange={setGlobalFilter}
        searchPlaceholder="Tìm kiếm nhân viên (tên, mã, email, SĐT)..."
      >
        {/* Branch Filter */}
        <Select value={branchFilter} onValueChange={setBranchFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Tất cả chi nhánh" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả chi nhánh</SelectItem>
            {branches.map(b => (
              <SelectItem key={b.systemId} value={b.systemId}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Department Filter */}
        {departmentOptions.length > 0 && (
          <DataTableFacetedFilter
            title="Phòng ban"
            options={departmentOptions}
            selectedValues={departmentFilter}
            onSelectedValuesChange={setDepartmentFilter}
          />
        )}

        {/* Job Title Filter */}
        {jobTitleOptions.length > 0 && (
          <DataTableFacetedFilter
            title="Chức danh"
            options={jobTitleOptions}
            selectedValues={jobTitleFilter}
            onSelectedValuesChange={setJobTitleFilter}
          />
        )}

        {/* Status Filter */}
        <DataTableFacetedFilter
          title="Trạng thái"
          options={statusOptions}
          selectedValues={statusFilter}
          onSelectedValuesChange={setStatusFilter}
        />
      </PageFilters>

      {/* ===== TABLE CONTENT - Tự do cao, scroll toàn page ===== */}
      {/* Mobile View - Infinite Scroll Cards */}
      {isMobile ? (
        <div ref={mobileScrollRef} className="space-y-3 pb-4">
          {sortedData.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Không tìm thấy nhân viên</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {sortedData.slice(0, mobileLoadedCount).map(employee => (
                <MobileEmployeeCard key={employee.systemId} employee={employee} />
              ))}
              
              {/* Loading more indicator */}
              {mobileLoadedCount < sortedData.length && (
                <Card className="border-dashed">
                  <CardContent className="py-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                      <span className="text-sm text-muted-foreground">Đang tải thêm...</span>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* End message */}
              {mobileLoadedCount >= sortedData.length && sortedData.length > 20 && (
                <Card className="border-dashed">
                  <CardContent className="py-4 text-center">
                    <span className="text-sm text-muted-foreground">
                      Đã hiển thị tất cả {sortedData.length} nhân viên
                    </span>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      ) : (
        /* Desktop View - Table tự do cao */
        <div className="w-full py-4">
          <ResponsiveDataTable
              columns={columns}
              data={paginatedData}
              renderMobileCard={(employee) => (
                <MobileEmployeeCard employee={employee} />
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
          />
        </div>
      )}

      {/* Delete Confirmation Dialogs */}
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa nhân viên</AlertDialogTitle>
            <AlertDialogDescription>
              Nhân viên sẽ được chuyển vào thùng rác. Bạn có thể khôi phục lại sau nếu cần.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Tiếp tục</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={isBulkDeleteAlertOpen} onOpenChange={setIsBulkDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa {numSelected} nhân viên</AlertDialogTitle>
            <AlertDialogDescription>
              Các nhân viên sẽ được chuyển vào thùng rác. Bạn có thể khôi phục lại sau nếu cần.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkDelete}>Tiếp tục</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
