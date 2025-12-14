import * as React from "react"
// FIX: Use named imports for react-router-dom to fix module export errors.
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../lib/router';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, getCurrentDate, isDateSame, isDateBetween, isDateAfter, isDateBefore, isValidDate, getStartOfDay, getEndOfDay } from '../../lib/date-utils.ts'
import { useEmployeeStore } from "./store.ts"
import { useBranchStore } from "../settings/branches/store.ts";
import { useDefaultPageSize } from "../settings/global-settings-store.ts";
import { asSystemId, type SystemId } from '@/lib/id-types';
import { getColumns } from "./columns.tsx"
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
import { PlusCircle, Phone, Mail, Building2, Calendar, MoreHorizontal, Trash2, Upload, Download } from "lucide-react"
import type { Employee } from "./types.ts"
import { DataTableExportDialog } from "../../components/data-table/data-table-export-dialog.tsx";
import { DataTableImportDialog, type ImportConfig } from "../../components/data-table/data-table-import-dialog.tsx";
import { GenericImportDialogV2 } from "../../components/shared/generic-import-dialog-v2.tsx";
import { GenericExportDialogV2 } from "../../components/shared/generic-export-dialog-v2.tsx";
import { employeeImportExportConfig } from "../../lib/import-export/configs/employee.config.ts";
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

const COLUMN_LAYOUT_STORAGE_KEY = 'employees-column-layout';

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
    console.warn('Failed to parse employees column layout from storage:', error);
  }

  try {
    const legacy = window.localStorage.getItem('employees-column-visibility');
    if (legacy) {
      return { visibility: JSON.parse(legacy) };
    }
  } catch (error) {
    console.warn('Failed to parse legacy employees column visibility:', error);
  }

  return null;
};
export function EmployeesPage() {
  const storedLayoutRef = React.useRef(readStoredColumnLayout());

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
    <Button key="trash" variant="outline" size="sm" className="h-9" onClick={() => navigate('/employees/trash')}>
      <Trash2 className="mr-2 h-4 w-4" />
      Thùng rác ({deletedCount})
    </Button>,
    <Button key="add" size="sm" className="h-9" onClick={() => navigate('/employees/new')}>
      <PlusCircle className="mr-2 h-4 w-4" />
      Thêm nhân viên
    </Button>
  ], [navigate, deletedCount]);
  
  // Set page header with actions
  usePageHeader({
    title: 'Danh sách nhân viên',
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Nhân viên', href: '/employees', isCurrent: true },
    ],
    actions: headerActions,
    showBackButton: false,
  });
  
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})
  const [isAlertOpen, setIsAlertOpen] = React.useState(false)
  const [idToDelete, setIdToDelete] = React.useState<string | null>(null)
  const [isBulkDeleteAlertOpen, setIsBulkDeleteAlertOpen] = React.useState(false)
  
  // V2 Import/Export Dialog states
  const [isImportV2Open, setIsImportV2Open] = React.useState(false)
  const [isExportV2Open, setIsExportV2Open] = React.useState(false)
  
  // Table state
  // ✅ Use global default page size from settings
  const defaultPageSize = useDefaultPageSize();
  
  // FIX: Cast `setSorting` to the correct type to allow functional updates and prevent stale state issues when sorting columns.
  const [sorting, setSorting] = React.useState<{ id: string, desc: boolean }>({ id: 'createdAt', desc: true });
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [debouncedGlobalFilter, setDebouncedGlobalFilter] = React.useState('');
  const [branchFilter, setBranchFilter] = React.useState('all');
  const [dateFilter, setDateFilter] = React.useState<[string | undefined, string | undefined] | undefined>();
  const [departmentFilter, setDepartmentFilter] = React.useState<Set<string>>(new Set());
  const [jobTitleFilter, setJobTitleFilter] = React.useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = React.useState<Set<string>>(new Set());
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: defaultPageSize });
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  
  // Debounce search input for better performance
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

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const payload = {
      visibility: columnVisibility,
      order: columnOrder,
      pinned: pinnedColumns,
    };
    window.localStorage.setItem(COLUMN_LAYOUT_STORAGE_KEY, JSON.stringify(payload));
  }, [columnVisibility, columnOrder, pinnedColumns]);

  const handleDelete = React.useCallback((systemId: string) => {
    setIdToDelete(systemId)
    setIsAlertOpen(true)
  }, [])
  
  const handleRestore = React.useCallback((systemId: string) => {
    restore(asSystemId(systemId));
    toast.success("Đã khôi phục nhân viên");
  }, [restore]);
  
  const columns = React.useMemo(() => getColumns(handleDelete, handleRestore, navigate, branches), [handleDelete, handleRestore, navigate, branches]);

  const buildDefaultVisibility = React.useCallback(() => {
    const defaultVisibleColumns = new Set([
      'id', 'fullName', 'workEmail', 'phone', 'branch', 'department',
      'jobTitle', 'hireDate', 'employmentStatus', 'dob', 'gender',
      'nationalId', 'permanentAddress', 'bankName', 'bankAccountNumber', 'baseSalary',
      'contractType', 'annualLeaveBalance', 'sickLeaveBalance'
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

    // Ensure pinned array initialized
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
  
  const confirmDelete = () => {
    if (idToDelete) {
      const employee = employees.find(e => e.systemId === idToDelete);
      remove(asSystemId(idToDelete));
      toast.success("Đã xóa nhân viên vào thùng rác", {
        description: `Nhân viên ${employee?.fullName || ''} đã được chuyển vào thùng rác.`,
      });
    }
    setIsAlertOpen(false)
    setIdToDelete(null)
  }

  const confirmBulkDelete = () => {
    const idsToDelete = Object.keys(rowSelection);
    idsToDelete.forEach(systemId => remove(asSystemId(systemId)));
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
        // Special handling for date columns
        if (sorting.id === 'createdAt' || sorting.id === 'hireDate') {
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
    employees.filter(emp => rowSelection[emp.systemId]),
  [employees, rowSelection]);

  const isMobile = !useMediaQuery("(min-width: 768px)");

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
    { label: 'Đang làm việc', value: 'Đang làm việc' },
    { label: 'Đã nghỉ việc', value: 'Đã nghỉ việc' },
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

  // V2 Import handler with upsert support
  const handleImportV2 = React.useCallback(async (
    data: Partial<Employee>[],
    mode: 'insert-only' | 'update-only' | 'upsert',
    branchId?: string
  ) => {
    let inserted = 0;
    let updated = 0;
    let skipped = 0;
    let failed = 0;
    const errors: Array<{ row: number; message: string }> = [];

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      try {
        // Find existing by business ID (id field like NV000001)
        const existingEmployee = item.id 
          ? activeEmployees.find(e => e.id === item.id)
          : null;

        if (existingEmployee) {
          if (mode === 'insert-only') {
            skipped++;
            continue;
          }
          // Update existing
          update(existingEmployee.systemId, { ...existingEmployee, ...item } as Employee);
          updated++;
        } else {
          if (mode === 'update-only') {
            errors.push({ row: i + 2, message: `Không tìm thấy nhân viên với mã ${item.id}` });
            failed++;
            continue;
          }
          // Insert new - remove systemId if present
          const { systemId, ...newEmployeeData } = item as any;
          addMultiple([newEmployeeData as Omit<Employee, 'systemId'>]);
          inserted++;
        }
      } catch (error) {
        errors.push({ row: i + 2, message: String(error) });
        failed++;
      }
    }

    return {
      success: inserted + updated,
      failed,
      inserted,
      updated,
      skipped,
      errors,
    };
  }, [activeEmployees, update, addMultiple]);

  // Current user for logging (mock - replace with actual auth)
  const currentUser = React.useMemo(() => ({
    name: 'Admin',
    systemId: 'USR000001' as SystemId,
  }), []);

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
                <AvatarFallback className="text-body-xs">{getInitials(employee.fullName)}</AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <h3 className="font-semibold text-body-medium truncate">{employee.fullName}</h3>
                <span className="text-body-xs text-muted-foreground">•</span>
                <span className="text-body-xs text-muted-foreground font-mono">{employee.id}</span>
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
          <div className="text-body-xs text-muted-foreground mb-3 flex items-center">
            <Building2 className="h-3 w-3 mr-1.5 flex-shrink-0" />
            <span className="truncate">{employee.jobTitle} • {employee.department}</span>
          </div>

          {/* Divider */}
          <div className="border-t mb-3" />

          {/* Contact Info */}
          <div className="space-y-2">
            {employee.workEmail && (
              <div className="flex items-center text-body-xs text-muted-foreground">
                <Mail className="h-3 w-3 mr-1.5 flex-shrink-0" />
                <span className="truncate">{employee.workEmail}</span>
              </div>
            )}
            {employee.phone && (
              <div className="flex items-center text-body-xs text-muted-foreground">
                <Phone className="h-3 w-3 mr-1.5 flex-shrink-0" />
                <span>{employee.phone}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-body-xs pt-1">
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1.5" />
                <span>{formatDate(employee.hireDate)}</span>
              </div>
              <Badge variant={getStatusVariant(employee.employmentStatus)} className="text-body-xs">
                {employee.employmentStatus}
              </Badge>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex gap-2 mt-3 pt-3 border-t">
            {employee.phone && (
              <TouchButton 
                variant="outline" 
                size="sm" 
                className="flex-1 h-8 text-body-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `tel:${employee.phone}`;
                }}
              >
                <Phone className="h-3 w-3 mr-1.5" />
                Gọi
              </TouchButton>
            )}
            {employee.workEmail && (
              <TouchButton 
                variant="outline" 
                size="sm" 
                className="flex-1 h-8 text-body-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.href = `mailto:${employee.workEmail}`;
                }}
              >
                <Mail className="h-3 w-3 mr-1.5" />
                Email
              </TouchButton>
            )}
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
              {/* V2 Import/Export with preview & logging */}
              <Button variant="outline" size="sm" className="h-9" onClick={() => setIsImportV2Open(true)}>
                <Upload className="mr-2 h-4 w-4" />
                Nhập Excel
              </Button>
              <Button variant="outline" size="sm" className="h-9" onClick={() => setIsExportV2Open(true)}>
                <Download className="mr-2 h-4 w-4" />
                Xuất Excel
              </Button>
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

      {/* ===== HÀNG 3: FILTERS - Search & Custom Filters (1 hàng) ===== */}
      <PageFilters
        searchValue={globalFilter}
        onSearchChange={setGlobalFilter}
        searchPlaceholder="Tìm kiếm nhân viên (tên, mã, email, SĐT)..."
      >
        {/* Branch Filter */}
        <Select value={branchFilter} onValueChange={setBranchFilter}>
          <SelectTrigger className="w-full sm:w-[180px] h-9">
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
            <AlertDialogCancel className="h-9">Hủy</AlertDialogCancel>
            <AlertDialogAction className="h-9" onClick={confirmDelete}>Tiếp tục</AlertDialogAction>
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
            <AlertDialogCancel className="h-9">Hủy</AlertDialogCancel>
            <AlertDialogAction className="h-9" onClick={confirmBulkDelete}>Tiếp tục</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* V2 Import Dialog with Preview */}
      <GenericImportDialogV2<Employee>
        open={isImportV2Open}
        onOpenChange={setIsImportV2Open}
        config={employeeImportExportConfig}
        branches={branches.map(b => ({ systemId: b.systemId, name: b.name }))}
        requireBranch={true}
        defaultBranchId={branches[0]?.systemId}
        existingData={activeEmployees}
        onImport={handleImportV2}
        currentUser={currentUser}
      />

      {/* V2 Export Dialog with Column Selection */}
      <GenericExportDialogV2<Employee>
        open={isExportV2Open}
        onOpenChange={setIsExportV2Open}
        config={employeeImportExportConfig}
        allData={activeEmployees}
        filteredData={sortedData}
        currentPageData={paginatedData}
        selectedData={allSelectedRows}
        appliedFilters={{
          branch: branchFilter !== 'all' ? branchFilter : undefined,
          department: departmentFilter.size > 0 ? Array.from(departmentFilter) : undefined,
          jobTitle: jobTitleFilter.size > 0 ? Array.from(jobTitleFilter) : undefined,
          status: statusFilter.size > 0 ? Array.from(statusFilter) : undefined,
          search: debouncedGlobalFilter || undefined,
        }}
        currentUser={currentUser}
      />
    </div>
  )
}
