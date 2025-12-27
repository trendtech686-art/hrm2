'use client'

import * as React from "react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PlusCircle, Trash2, MoreVertical, Phone, Mail, Building2, Clock, UserX, CreditCard, HeartPulse, X, FileSpreadsheet, Download } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner";
import Fuse from 'fuse.js';

import { useCustomerStore } from "./store";
import { useCustomerTypeStore } from "../settings/customers/customer-types-store";
import { useBranchStore } from "../settings/branches/store";
import { type Customer } from "@/lib/types/prisma-extended";
import { getColumns } from "./columns";
import { BulkActionConfirmDialog } from "./components/bulk-action-confirm-dialog";
import { DEFAULT_CUSTOMER_SORT, type CustomerQueryParams, type CustomerSortKey } from "./customer-service";
import { usePersistentState } from "../../hooks/use-persistent-state";
import { asSystemId, asBusinessId, type SystemId } from "../../lib/id-types";
import { usePageHeader } from "../../contexts/page-header-context";
import { useMediaQuery } from "../../lib/use-media-query";
import { useDebounce } from "../../hooks/use-debounce";
import { isDateAfter, isDateBefore } from "../../lib/date-utils";
import {
  customerImportExportConfig,
} from "../../lib/import-export/configs/customer.config";

import { ResponsiveDataTable } from "../../components/data-table/responsive-data-table";
import { GenericImportDialogV2 } from "../../components/shared/generic-import-dialog-v2";
import { GenericExportDialogV2 } from "../../components/shared/generic-export-dialog-v2";
import { DataTableColumnCustomizer } from "../../components/data-table/data-table-column-toggle";
import { DataTableDateFilter } from "../../components/data-table/data-table-date-filter";
import { PageFilters } from "../../components/layout/page-filters";
import { MobileSearchBar } from "../../components/mobile/mobile-search-bar";
import { TouchButton } from "../../components/mobile/touch-button";
import { useCustomerSlaEvaluation } from "./sla/hooks";
import { useCustomersQuery } from "./hooks/use-customers-query";
import { useCustomersWithComputedDebt } from "./hooks/use-computed-debt";

import {
  Card,
  CardContent,
} from "../../components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

const TABLE_STATE_STORAGE_KEY = "customers-table-state";
const MOBILE_ROW_HEIGHT = 190;
const MOBILE_LIST_HEIGHT = 520;

type PendingBulkAction =
  | { kind: "delete"; customers: Customer[] }
  | { kind: "restore"; customers: Customer[] }
  | { kind: "status"; status: Customer["status"]; customers: Customer[] }
  | null;

const defaultTableState: CustomerQueryParams = {
  search: "",
  statusFilter: "all",
  typeFilter: "all",
  dateRange: undefined,
  showDeleted: false,
  slaFilter: "all",
  debtFilter: "all",
  pagination: { pageIndex: 0, pageSize: 10 },
  sorting: DEFAULT_CUSTOMER_SORT,
};

function resolveStateAction<T>(current: T, action: React.SetStateAction<T>): T {
  return typeof action === "function" ? (action as (prev: T) => T)(current) : action;
}

export function CustomersPage() {
  const {
    data: customers,
    remove,
    removeMany,
    restore,
    restoreMany,
    addMultiple,
    updateManyStatus,
    update,
  } = useCustomerStore(
    useShallow((state) => ({
      data: state.data,
      remove: state.remove,
      removeMany: state.removeMany,
      restore: state.restore,
      restoreMany: state.restoreMany,
      addMultiple: state.addMultiple,
      updateManyStatus: state.updateManyStatus,
      update: state.update,
    }))
  );
  const customerTypes = useCustomerTypeStore();
  const { data: branches } = useBranchStore();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Use computed debt from orders/receipts instead of static currentDebt field
  const customersWithDebt = useCustomersWithComputedDebt(customers);

  const deletedCount = React.useMemo(
    () => customers.filter((customer) => customer.isDeleted).length,
    [customers]
  );

  const headerActions = React.useMemo(
    () => [
      <Button key="trash" variant="outline" size="sm" className="h-9" asChild>
        <Link href="/customers/trash">
          <Trash2 className="mr-2 h-4 w-4" />
          Thùng rác ({deletedCount})
        </Link>
      </Button>,
      <Button key="add" size="sm" className="h-9" asChild>
        <Link href="/customers/new">
          <PlusCircle className="mr-2 h-4 w-4" />
          Thêm khách hàng
        </Link>
      </Button>,
    ],
    [deletedCount]
  );

  usePageHeader({
    title: 'Danh sách khách hàng',
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Khách hàng', href: '/customers', isCurrent: true },
    ],
    showBackButton: false,
    actions: headerActions,
  });

  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [idToDelete, setIdToDelete] = React.useState<string | null>(null);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const [pendingAction, setPendingAction] = React.useState<PendingBulkAction>(null);
  const [showImportDialog, setShowImportDialog] = React.useState(false);
  const [showExportDialog, setShowExportDialog] = React.useState(false);
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") {
      return {};
    }
    const storageKey = "customers-column-visibility";
    const stored = window.localStorage.getItem(storageKey);
    const cols = getColumns(() => {}, () => {}, router);
    const allColumnIds = cols.map((column) => column.id).filter(Boolean) as string[];
    if (stored) {
      try {
        const parsedData = JSON.parse(stored) as Record<string, boolean>;
        if (allColumnIds.every((id) => id in parsedData)) {
          return parsedData;
        }
      } catch (error) {
        console.warn("[customers-page] Failed to parse column visibility", error);
      }
    }
    const initial: Record<string, boolean> = {};
    allColumnIds.forEach((id) => {
      initial[id] = true;
    });
    return initial;
  });
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>([]);
  const [tableState, setTableState] = usePersistentState<CustomerQueryParams>(TABLE_STATE_STORAGE_KEY, defaultTableState);

  const queryParams = React.useMemo<CustomerQueryParams>(() => ({
    ...tableState,
    showDeleted: false,
  }), [tableState]);

  useCustomersQuery(queryParams);

  React.useEffect(() => {
    if (tableState.showDeleted) {
      setTableState((prev) => ({ ...prev, showDeleted: false }));
    }
  }, [tableState.showDeleted, setTableState]);

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem("customers-column-visibility", JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  const handleDelete = React.useCallback((systemId: string) => {
    setIdToDelete(systemId);
    setIsAlertOpen(true);
  }, []);

  const handleRestore = React.useCallback(
    (systemId: string) => {
      restore(asSystemId(systemId));
    },
    [restore]
  );

  const slaEngine = useCustomerSlaEvaluation();
  const slaIndex = slaEngine.index;
  const slaSummary = slaEngine.summary;
  const columns = React.useMemo(
    () => getColumns(handleDelete, handleRestore, router, { slaIndex }),
    [handleDelete, handleRestore, router, slaIndex]
  );

  React.useEffect(() => {
    if (columnOrder.length) {
      return;
    }
    const defaultVisibleColumns = ["id", "name", "email", "phone", "shippingAddress", "status", "slaStatus", "accountManagerName"];
    const initialVisibility: Record<string, boolean> = {};
    columns.forEach((column) => {
      if (!column.id) return;
      const alwaysVisible = column.id === "select" || column.id === "actions";
      initialVisibility[column.id] = alwaysVisible || defaultVisibleColumns.includes(column.id);
    });
    setColumnVisibility((prev) => (Object.keys(prev).length ? prev : initialVisibility));
    setColumnOrder(columns.map((column) => column.id).filter(Boolean) as string[]);
  }, [columns, columnOrder.length]);

  const updateTableState = React.useCallback(
    (updater: (prev: CustomerQueryParams) => CustomerQueryParams) => {
      setTableState((prev) => updater(prev));
    },
    [setTableState]
  );

  const handleSearchChange = React.useCallback(
    (value: string) => {
      updateTableState((prev) => ({
        ...prev,
        search: value,
        pagination: { ...prev.pagination, pageIndex: 0 },
      }));
    },
    [updateTableState]
  );

  const handleStatusFilterChange = React.useCallback(
    (value: string) => {
      updateTableState((prev) => ({
        ...prev,
        statusFilter: value,
        pagination: { ...prev.pagination, pageIndex: 0 },
      }));
    },
    [updateTableState]
  );

  const handleTypeFilterChange = React.useCallback(
    (value: string) => {
      updateTableState((prev) => ({
        ...prev,
        typeFilter: value,
        pagination: { ...prev.pagination, pageIndex: 0 },
      }));
    },
    [updateTableState]
  );

  const handleDateRangeChange = React.useCallback(
    (value: [string | undefined, string | undefined] | undefined) => {
      updateTableState((prev) => ({
        ...prev,
        dateRange: value,
        pagination: { ...prev.pagination, pageIndex: 0 },
      }));
    },
    [updateTableState]
  );

  const handlePaginationChange = React.useCallback(
    (action: React.SetStateAction<{ pageIndex: number; pageSize: number }>) => {
      updateTableState((prev) => ({
        ...prev,
        pagination: resolveStateAction(prev.pagination, action),
      }));
    },
    [updateTableState]
  );

  const handleSortingChange = React.useCallback(
    (action: React.SetStateAction<{ id: string; desc: boolean }>) => {
      updateTableState((prev) => {
        const nextSortingSource =
          typeof action === "function"
            ? (action as (value: { id: string; desc: boolean }) => { id: string; desc: boolean })({
                ...prev.sorting,
              })
            : action;

        return {
          ...prev,
          sorting: {
            id: (nextSortingSource.id as CustomerQueryParams["sorting"]["id"]) ?? prev.sorting.id,
            desc: nextSortingSource.desc,
          },
        };
      });
    },
    [updateTableState]
  );

  // Debounce search for performance
  const debouncedSearch = useDebounce(tableState.search, 300);

  // Fuse instance for search - use customersWithDebt to include computed debt
  const fuseInstance = React.useMemo(() => {
    return new Fuse(customersWithDebt, {
      keys: ['name', 'email', 'phone', 'company', 'taxCode', 'id'],
      threshold: 0.3,
      ignoreLocation: true,
    });
  }, [customersWithDebt]);

  // Filter data using useMemo - reactive to store changes
  // Use customersWithDebt instead of static customers data
  const filteredData = React.useMemo(() => {
    // Start with non-deleted customers
    let dataset = customersWithDebt.filter(customer => !customer.isDeleted);

    // Apply status filter
    if (tableState.statusFilter !== 'all') {
      dataset = dataset.filter(customer => customer.status === tableState.statusFilter);
    }

    // Apply type filter
    if (tableState.typeFilter !== 'all') {
      dataset = dataset.filter(customer => customer.type === tableState.typeFilter);
    }

    // Apply date range filter
    if (tableState.dateRange && (tableState.dateRange[0] || tableState.dateRange[1])) {
      dataset = dataset.filter(customer => {
        if (!customer.createdAt) return false;
        const createdDate = new Date(customer.createdAt);
        const fromDate = tableState.dateRange![0] ? new Date(tableState.dateRange![0]) : null;
        const toDate = tableState.dateRange![1] ? new Date(tableState.dateRange![1]) : null;
        if (fromDate && isDateBefore(createdDate, fromDate)) return false;
        if (toDate && isDateAfter(createdDate, toDate)) return false;
        return true;
      });
    }

    // Apply SLA filter
    if (tableState.slaFilter !== 'all') {
      const relevantSystemIds = new Set<string>();
      
      if (tableState.slaFilter === 'followUp') {
        slaEngine.index?.followUpAlerts.forEach(alert => relevantSystemIds.add(alert.systemId));
      } else if (tableState.slaFilter === 'reengage') {
        slaEngine.index?.reEngagementAlerts.forEach(alert => relevantSystemIds.add(alert.systemId));
      } else if (tableState.slaFilter === 'debt') {
        slaEngine.index?.debtAlerts.forEach(alert => relevantSystemIds.add(alert.systemId));
      } else if (tableState.slaFilter === 'health') {
        slaEngine.index?.healthAlerts.forEach(alert => relevantSystemIds.add(alert.systemId));
      }
      
      dataset = dataset.filter(customer => relevantSystemIds.has(customer.systemId));
    }

    // Apply Debt filter
    if (tableState.debtFilter !== 'all') {
      if (tableState.debtFilter === 'totalOverdue' || tableState.debtFilter === 'overdue') {
        dataset = dataset.filter(customer => {
          if (!customer.debtReminders || customer.debtReminders.length === 0) return false;
          const now = new Date();
          return customer.debtReminders.some(reminder => {
            if (!reminder.dueDate) {
              return false;
            }
            const dueDate = new Date(reminder.dueDate);
            const amountDue = reminder.amountDue ?? 0;
            return dueDate < now && amountDue > 0;
          });
        });
      } else if (tableState.debtFilter === 'dueSoon') {
        dataset = dataset.filter(customer => {
          if (!customer.debtReminders || customer.debtReminders.length === 0) return false;
          const now = new Date();
          const threeDaysLater = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
          return customer.debtReminders.some(reminder => {
            if (!reminder.dueDate) {
              return false;
            }
            const dueDate = new Date(reminder.dueDate);
            const amountDue = reminder.amountDue ?? 0;
            return dueDate >= now && dueDate <= threeDaysLater && amountDue > 0;
          });
        });
      } else if (tableState.debtFilter === 'hasDebt') {
        dataset = dataset.filter(customer => (customer.currentDebt || 0) > 0);
      }
    }

    // Apply search filter
    if (debouncedSearch.trim()) {
      fuseInstance.setCollection(dataset);
      dataset = fuseInstance.search(debouncedSearch.trim()).map(result => result.item);
    }

    return dataset;
  }, [customersWithDebt, tableState.statusFilter, tableState.typeFilter, tableState.dateRange, tableState.slaFilter, tableState.debtFilter, debouncedSearch, fuseInstance, slaEngine.index]);

  // Sort data
  const sortedData = React.useMemo(() => {
    const sorted = [...filteredData];
    const sortKey = tableState.sorting.id;
    
    sorted.sort((a, b) => {
      const aValue = (a as any)[sortKey] ?? '';
      const bValue = (b as any)[sortKey] ?? '';
      // Special handling for date columns
      if (sortKey === 'createdAt') {
        const aTime = aValue ? new Date(aValue).getTime() : 0;
        const bTime = bValue ? new Date(bValue).getTime() : 0;
        // Nếu thời gian bằng nhau, sort theo systemId (ID mới hơn = số lớn hơn)
        if (aTime === bTime) {
          const aNum = parseInt(a.systemId.replace(/\D/g, '')) || 0;
          const bNum = parseInt(b.systemId.replace(/\D/g, '')) || 0;
          return tableState.sorting.desc ? bNum - aNum : aNum - bNum;
        }
        return tableState.sorting.desc ? bTime - aTime : aTime - bTime;
      }
      if (aValue < bValue) return tableState.sorting.desc ? 1 : -1;
      if (aValue > bValue) return tableState.sorting.desc ? -1 : 1;
      return 0;
    });
    
    return sorted;
  }, [filteredData, tableState.sorting]);

  // Pagination
  const totalRows = sortedData.length;
  const pageCount = Math.max(1, Math.ceil(totalRows / tableState.pagination.pageSize));
  
  const pageData = React.useMemo(() => {
    const start = tableState.pagination.pageIndex * tableState.pagination.pageSize;
    const end = start + tableState.pagination.pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, tableState.pagination]);

  const selectedCustomers = React.useMemo(
    () => customers.filter((customer) => rowSelection[customer.systemId]),
    [customers, rowSelection]
  );

  const confirmDelete = React.useCallback(() => {
    if (idToDelete) {
      remove(asSystemId(idToDelete));
      toast.success("Đã chuyển khách hàng vào thùng rác");
    }
    setIsAlertOpen(false);
    setIdToDelete(null);
  }, [idToDelete, remove]);

  const handleRowClick = React.useCallback(
    (customer: Customer) => {
      router.push(`/customers/${customer.systemId}`);
    },
    [router]
  );

  // Active customers (non-deleted) for import/export operations
  const activeCustomers = React.useMemo(
    () => customers.filter(c => !c.isDeleted),
    [customers]
  );

  // ===== IMPORT/EXPORT V2 =====
  // V2 Import handler with upsert support (like employees)
  const handleImportV2 = React.useCallback(async (
    data: Partial<Customer>[],
    mode: 'insert-only' | 'update-only' | 'upsert',
    _branchId?: string
  ) => {
    let inserted = 0;
    let updated = 0;
    let skipped = 0;
    let failed = 0;
    const errors: Array<{ row: number; message: string }> = [];

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      try {
        // Find existing by business ID (id field like KH000001)
        const existingCustomer = item.id 
          ? activeCustomers.find(c => c.id === item.id)
          : null;

        if (existingCustomer) {
          if (mode === 'insert-only') {
            skipped++;
            continue;
          }
          // Update existing
          update(existingCustomer.systemId, { ...existingCustomer, ...item } as Customer);
          updated++;
        } else {
          if (mode === 'update-only') {
            errors.push({ row: i + 2, message: `Không tìm thấy khách hàng với mã ${item.id}` });
            failed++;
            continue;
          }
          // Insert new - remove systemId if present
          const { systemId, ...newData } = item as any;
          const dataWithEmptyId = {
            ...newData,
            id: asBusinessId(""),
            status: newData.status || "Đang giao dịch",
          } as Omit<Customer, "systemId">;
          addMultiple([dataWithEmptyId]);
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
  }, [activeCustomers, addMultiple, update]);

  // Current user for logging (mock - replace with actual auth)
  const currentUser = React.useMemo(() => ({
    name: 'Admin',
    systemId: 'USR000001' as SystemId,
  }), []);

  const bulkActions = React.useMemo(() => {
    // Main list only shows non-deleted customers
    return [
      {
        label: "Chuyển vào thùng rác",
        onSelect: (rows: Customer[]) => setPendingAction({ kind: "delete", customers: rows }),
      },
      {
        label: "Đang giao dịch",
        onSelect: (rows: Customer[]) => setPendingAction({ kind: "status", status: "Đang giao dịch", customers: rows }),
      },
      {
        label: "Ngừng giao dịch",
        onSelect: (rows: Customer[]) => setPendingAction({ kind: "status", status: "Ngừng Giao Dịch", customers: rows }),
      },
    ];
  }, []);

  const bulkDialogCopy = React.useMemo(() => {
    if (!pendingAction) return null;
    switch (pendingAction.kind) {
      case "delete":
        return {
          title: "Chuyển vào thùng rác",
          description: `Xác nhận chuyển ${pendingAction.customers.length} khách hàng vào thùng rác?`,
          confirmLabel: "Chuyển vào thùng rác",
        };
      case "restore":
        return {
          title: "Khôi phục khách hàng",
          description: `Khôi phục ${pendingAction.customers.length} khách hàng đã chọn?`,
          confirmLabel: "Khôi phục",
        };
      case "status":
        return {
          title: "Cập nhật trạng thái",
          description: `Xác nhận cập nhật ${pendingAction.customers.length} khách hàng sang trạng thái "${pendingAction.status}"?`,
          confirmLabel: "Cập nhật",
        };
      default:
        return null;
    }
  }, [pendingAction]);

  const handleConfirmBulkAction = React.useCallback(() => {
    if (!pendingAction) return;
    const systemIds = pendingAction.customers.map((customer) => asSystemId(customer.systemId));
    if (pendingAction.kind === "delete") {
      removeMany(systemIds);
      toast.success(`Đã chuyển ${pendingAction.customers.length} khách hàng vào thùng rác`);
    } else if (pendingAction.kind === "restore") {
      restoreMany(systemIds);
      toast.success(`Đã khôi phục ${pendingAction.customers.length} khách hàng`);
    } else if (pendingAction.kind === "status") {
      updateManyStatus(systemIds, pendingAction.status);
      toast.success(`Đã cập nhật trạng thái cho ${pendingAction.customers.length} khách hàng`);
    }
    setRowSelection((prev) => {
      const next = { ...prev };
      pendingAction.customers.forEach((customer) => {
        delete next[customer.systemId];
      });
      return next;
    });
    setPendingAction(null);
  }, [pendingAction, removeMany, restoreMany, updateManyStatus]);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Đang giao dịch":
        return "default";
      case "Ngừng giao dịch":
      case "Ngừng Giao Dịch":
        return "secondary";
      case "Nợ xấu":
        return "destructive";
      default:
        return "default";
    }
  };

  const MobileCustomerCard = ({ customer }: { customer: Customer }) => (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleRowClick(customer)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12 flex-shrink-0">
            <AvatarImage src="" alt={customer.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {customer.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <div className="flex-1">
                <h3 className="font-semibold text-body-sm truncate">{customer.name}</h3>
                <p className="text-body-xs text-muted-foreground">{customer.id}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <TouchButton variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(event) => event.stopPropagation()}>
                    <MoreVertical className="h-4 w-4" />
                  </TouchButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(event) => {
                      event.stopPropagation();
                      router.push(`/customers/${customer.systemId}/edit`);
                    }}
                  >
                    Chỉnh sửa
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDelete(customer.systemId);
                    }}
                  >
                    Chuyển vào thùng rác
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="space-y-1.5 mt-2">
              {customer.company && (
                <div className="flex items-center text-body-xs text-muted-foreground">
                  <Building2 className="h-3 w-3 mr-1.5" />
                  <span className="truncate">{customer.company}</span>
                </div>
              )}
              {customer.email && (
                <div className="flex items-center text-body-xs text-muted-foreground">
                  <Mail className="h-3 w-3 mr-1.5" />
                  <span className="truncate">{customer.email}</span>
                </div>
              )}
              {customer.phone && (
                <div className="flex items-center text-body-xs text-muted-foreground">
                  <Phone className="h-3 w-3 mr-1.5" />
                  <span>{customer.phone}</span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between mt-3 pt-2 border-t">
              <Badge variant={getStatusVariant(customer.status)} className="text-body-xs">
                {customer.status}
              </Badge>
              {customer.accountManagerName && (
                <span className="text-body-xs text-muted-foreground">NV: {customer.accountManagerName}</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col gap-4">
        <div className="flex-shrink-0 space-y-4">
          {isMobile ? (
            <div className="space-y-3">
              <TouchButton onClick={() => router.push("/customers/new")} size="default" className="w-full min-h-touch">
                <PlusCircle className="mr-2 h-4 w-4" />
                Thêm khách hàng
              </TouchButton>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowImportDialog(true)}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Nhập
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowExportDialog(true)}>
                  <Download className="mr-2 h-4 w-4" />
                  Xuất
                </Button>
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

          {/* Desktop Actions Row */}
          {!isMobile && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowImportDialog(true)}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Nhập file
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowExportDialog(true)}>
                <Download className="mr-2 h-4 w-4" />
                Xuất Excel
              </Button>
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
          )}

          {isMobile ? (
            <div className="space-y-3">
              <MobileSearchBar value={tableState.search} onChange={handleSearchChange} placeholder="Tìm kiếm khách hàng..." />
              <div className="grid grid-cols-2 gap-2">
                <Select value={tableState.debtFilter} onValueChange={(value) => {
                  updateTableState((prev) => ({
                    ...prev,
                    debtFilter: value as typeof prev.debtFilter,
                    pagination: { ...prev.pagination, pageIndex: 0 },
                  }));
                }}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Công nợ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả công nợ</SelectItem>
                    <SelectItem value="totalOverdue">Tổng quá hạn</SelectItem>
                    <SelectItem value="overdue">Quá hạn</SelectItem>
                    <SelectItem value="dueSoon">Sắp đến hạn</SelectItem>
                    <SelectItem value="hasDebt">Có công nợ</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={tableState.slaFilter} onValueChange={(value) => {
                  updateTableState((prev) => ({
                    ...prev,
                    slaFilter: value as typeof prev.slaFilter,
                    pagination: { ...prev.pagination, pageIndex: 0 },
                  }));
                }}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Cảnh báo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả cảnh báo</SelectItem>
                    <SelectItem value="followUp">Cần liên hệ</SelectItem>
                    <SelectItem value="reengage">Lâu không mua hàng</SelectItem>
                    <SelectItem value="debt">Cảnh báo công nợ</SelectItem>
                    <SelectItem value="health">Nguy cơ mất khách</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={tableState.statusFilter} onValueChange={handleStatusFilterChange}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="Đang giao dịch">Đang giao dịch</SelectItem>
                    <SelectItem value="Ngừng Giao Dịch">Ngừng giao dịch</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={tableState.typeFilter} onValueChange={handleTypeFilterChange}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Loại KH" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả loại KH</SelectItem>
                    {customerTypes.getActive().map((type) => (
                      <SelectItem key={type.systemId} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <p className="text-body-sm text-muted-foreground">{sortedData.length} khách hàng</p>
              </div>
            </div>
          ) : (
            <PageFilters searchValue={tableState.search} onSearchChange={handleSearchChange} searchPlaceholder="Tìm kiếm khách hàng...">
              <DataTableDateFilter value={tableState.dateRange} onChange={handleDateRangeChange} title="Ngày tạo" />
              
              {/* Debt Filter */}
              <Select value={tableState.debtFilter} onValueChange={(value) => {
                updateTableState((prev) => ({
                  ...prev,
                  debtFilter: value as typeof prev.debtFilter,
                  pagination: { ...prev.pagination, pageIndex: 0 },
                }));
              }}>
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder="Công nợ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả công nợ</SelectItem>
                  <SelectItem value="totalOverdue">Tổng công nợ quá hạn</SelectItem>
                  <SelectItem value="overdue">Quá hạn thanh toán</SelectItem>
                  <SelectItem value="dueSoon">Sắp đến hạn</SelectItem>
                  <SelectItem value="hasDebt">Có công nợ</SelectItem>
                </SelectContent>
              </Select>

              {/* SLA Filter */}
              {slaSummary && (
                <Select value={tableState.slaFilter} onValueChange={(value) => {
                  updateTableState((prev) => ({
                    ...prev,
                    slaFilter: value as typeof prev.slaFilter,
                    pagination: { ...prev.pagination, pageIndex: 0 },
                  }));
                }}>
                  <SelectTrigger className="w-[180px] h-9">
                    <SelectValue placeholder="Cảnh báo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả cảnh báo</SelectItem>
                    <SelectItem value="followUp">Cần liên hệ ({slaSummary.followUpAlerts})</SelectItem>
                    <SelectItem value="reengage">Lâu không mua hàng ({slaSummary.reEngagementAlerts})</SelectItem>
                    <SelectItem value="debt">Cảnh báo công nợ ({slaSummary.debtAlerts})</SelectItem>
                    <SelectItem value="health">Nguy cơ mất khách ({slaSummary.healthAlerts})</SelectItem>
                  </SelectContent>
                </Select>
              )}

              {/* Status Filter */}
              <Select value={tableState.statusFilter} onValueChange={handleStatusFilterChange}>
                <SelectTrigger className="w-[160px] h-9">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="Đang giao dịch">Đang giao dịch</SelectItem>
                  <SelectItem value="Ngừng Giao Dịch">Ngừng giao dịch</SelectItem>
                </SelectContent>
              </Select>

              {/* Type Filter */}
              <Select value={tableState.typeFilter} onValueChange={handleTypeFilterChange}>
                <SelectTrigger className="w-[160px] h-9">
                  <SelectValue placeholder="Loại KH" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  {customerTypes.getActive().map((type) => (
                    <SelectItem key={type.systemId} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </PageFilters>
          )}
        </div>

        <div className="w-full py-4">
          <ResponsiveDataTable
            columns={columns}
            data={pageData}
            renderMobileCard={(customer) => <MobileCustomerCard customer={customer} />}
            pageCount={pageCount}
            pagination={tableState.pagination}
            setPagination={handlePaginationChange}
            rowCount={totalRows}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            bulkActions={bulkActions}
            allSelectedRows={selectedCustomers}
            sorting={tableState.sorting}
            setSorting={handleSortingChange}
            expanded={expanded}
            setExpanded={setExpanded}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
            columnOrder={columnOrder}
            setColumnOrder={setColumnOrder}
            pinnedColumns={pinnedColumns}
            setPinnedColumns={setPinnedColumns}
            onRowClick={handleRowClick}
            mobileVirtualized
            mobileRowHeight={MOBILE_ROW_HEIGHT}
            mobileListHeight={MOBILE_LIST_HEIGHT}
          />
        </div>
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

      {pendingAction && bulkDialogCopy && (
        <BulkActionConfirmDialog
          open
          title={bulkDialogCopy.title}
          description={bulkDialogCopy.description}
          confirmLabel={bulkDialogCopy.confirmLabel}
          customers={pendingAction.customers}
          onConfirm={handleConfirmBulkAction}
          onCancel={() => setPendingAction(null)}
        />
      )}

      {/* V2 Import Dialog with Preview */}
      <GenericImportDialogV2<Customer>
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        config={customerImportExportConfig}
        branches={branches.map(b => ({ systemId: b.systemId, name: b.name }))}
        existingData={activeCustomers}
        onImport={handleImportV2}
        currentUser={currentUser}
      />

      {/* V2 Export Dialog with Column Selection */}
      <GenericExportDialogV2<Customer>
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        config={customerImportExportConfig}
        allData={activeCustomers}
        filteredData={sortedData}
        currentPageData={pageData}
        selectedData={selectedCustomers}
        currentUser={currentUser}
      />
    </div>
  );
}
