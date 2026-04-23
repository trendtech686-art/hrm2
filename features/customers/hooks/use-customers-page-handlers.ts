/**
 * Hooks for customers page handlers
 * Extracted to reduce page.tsx size
 */
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { usePersistentState } from '@/hooks/use-persistent-state';
import type { Customer } from '@/lib/types/prisma-extended';
import { type SystemId } from '@/lib/id-types';
import { DEFAULT_CUSTOMER_SORT, type CustomerQueryParams, type CustomerSortKey } from '../customer-service';
import { useCustomerMutations, useBulkCustomerMutations, useTrashMutations } from './use-customers';
import { useDefaultPageSize } from '@/features/settings/global/hooks/use-global-settings';

const TABLE_STATE_STORAGE_KEY = 'customers-table-state';

type DebtFilterValue = CustomerQueryParams['debtFilter'];

const defaultTableState: CustomerQueryParams = {
  search: '',
  statusFilter: 'all',
  typeFilter: 'all',
  dateRange: undefined,
  showDeleted: false,
  debtFilter: 'all',
  pagination: { pageIndex: 0, pageSize: 20 },
  sorting: DEFAULT_CUSTOMER_SORT,
};

type PendingBulkAction =
  | { kind: 'delete'; customers: Customer[] }
  | { kind: 'restore'; customers: Customer[] }
  | { kind: 'status'; status: Customer['status']; customers: Customer[] }
  | null;

function resolveStateAction<T>(current: T, action: React.SetStateAction<T>): T {
  return typeof action === 'function' ? (action as (prev: T) => T)(current) : action;
}

/**
 * Hook for customer table state management (filters, pagination, sorting)
 */
export function useCustomerTableState() {
  const [tableState, setTableState] = usePersistentState<CustomerQueryParams>(
    TABLE_STATE_STORAGE_KEY,
    defaultTableState
  );

  // Derived setters for individual filter properties
  const setSearch = React.useCallback(
    (value: React.SetStateAction<string>) =>
      setTableState((prev) => ({
        ...prev,
        search: resolveStateAction(prev.search, value),
      })),
    [setTableState]
  );

  const setStatusFilter = React.useCallback(
    (value: React.SetStateAction<string>) =>
      setTableState((prev) => ({
        ...prev,
        statusFilter: resolveStateAction(prev.statusFilter, value),
      })),
    [setTableState]
  );

  const setTypeFilter = React.useCallback(
    (value: React.SetStateAction<string>) =>
      setTableState((prev) => ({
        ...prev,
        typeFilter: resolveStateAction(prev.typeFilter, value),
      })),
    [setTableState]
  );

  const setDebtFilter = React.useCallback(
    (value: React.SetStateAction<DebtFilterValue>) =>
      setTableState((prev) => ({
        ...prev,
        debtFilter: resolveStateAction(prev.debtFilter, value),
      })),
    [setTableState]
  );

  const setDateRange = React.useCallback(
    (value: React.SetStateAction<[string | undefined, string | undefined] | undefined>) =>
      setTableState((prev) => ({
        ...prev,
        dateRange: resolveStateAction(prev.dateRange, value),
      })),
    [setTableState]
  );

  const setPagination = React.useCallback(
    (value: React.SetStateAction<{ pageIndex: number; pageSize: number }>) =>
      setTableState((prev) => ({
        ...prev,
        pagination: resolveStateAction(prev.pagination, value),
      })),
    [setTableState]
  );

  const setSorting = React.useCallback(
    (value: React.SetStateAction<{ id: CustomerSortKey; desc: boolean }>) =>
      setTableState((prev) => ({
        ...prev,
        sorting: resolveStateAction(prev.sorting, value),
      })),
    [setTableState]
  );

  const resetFilters = React.useCallback(() => {
    setTableState(defaultTableState);
  }, [setTableState]);

  return {
    tableState,
    setTableState,
    setSearch,
    setStatusFilter,
    setTypeFilter,
    setDebtFilter,
    setDateRange,
    setPagination,
    setSorting,
    resetFilters,
  };
}

/**
 * Hook for row selection state
 */
export function useCustomerRowSelection() {
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});

  const selectedIds = React.useMemo(
    () => Object.keys(rowSelection).filter((id) => rowSelection[id]),
    [rowSelection]
  );

  const clearSelection = React.useCallback(() => {
    setRowSelection({});
  }, []);

  return {
    rowSelection,
    setRowSelection,
    selectedIds,
    clearSelection,
  };
}

/**
 * Hook for customer bulk actions
 */
export function useCustomerBulkActions(selectedIds: string[], clearSelection: () => void) {
  const { bulkDelete, bulkRestore, bulkUpdateStatus } = useBulkCustomerMutations({
    onSuccess: () => {
      clearSelection();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [pendingBulkAction, setPendingBulkAction] = React.useState<PendingBulkAction>(null);

  const confirmBulkAction = React.useCallback(() => {
    if (!pendingBulkAction) return;

    const customerIds = pendingBulkAction.customers.map((c) => c.systemId);

    switch (pendingBulkAction.kind) {
      case 'delete':
        bulkDelete.mutate(customerIds, {
          onSuccess: () => {
            toast.success(`Đã xóa ${customerIds.length} khách hàng`);
            setPendingBulkAction(null);
          },
        });
        break;
      case 'restore':
        bulkRestore.mutate(customerIds, {
          onSuccess: () => {
            toast.success(`Đã khôi phục ${customerIds.length} khách hàng`);
            setPendingBulkAction(null);
          },
        });
        break;
      case 'status':
        bulkUpdateStatus.mutate({ systemIds: customerIds, status: pendingBulkAction.status }, {
          onSuccess: () => {
            toast.success(`Đã cập nhật trạng thái ${customerIds.length} khách hàng`);
            setPendingBulkAction(null);
          },
        });
        break;
    }
  }, [pendingBulkAction, bulkDelete, bulkRestore, bulkUpdateStatus]);

  const cancelBulkAction = React.useCallback(() => {
    setPendingBulkAction(null);
  }, []);

  const requestBulkDelete = React.useCallback((customers: Customer[]) => {
    setPendingBulkAction({ kind: 'delete', customers });
  }, []);

  const requestBulkRestore = React.useCallback((customers: Customer[]) => {
    setPendingBulkAction({ kind: 'restore', customers });
  }, []);

  const requestBulkStatusChange = React.useCallback((customers: Customer[], status: Customer['status']) => {
    setPendingBulkAction({ kind: 'status', status, customers });
  }, []);

  return {
    pendingBulkAction,
    confirmBulkAction,
    cancelBulkAction,
    requestBulkDelete,
    requestBulkRestore,
    requestBulkStatusChange,
  };
}

/**
 * Hook for single customer actions
 */
export function useCustomerActions() {
  const router = useRouter();
  const { update, remove } = useCustomerMutations({
    onUpdateSuccess: () => {
      // Success is handled by individual calls
    },
    onDeleteSuccess: () => {
      // Success is handled by individual calls
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  
  const { restore } = useTrashMutations();

  const [deleteConfirmId, setDeleteConfirmId] = React.useState<SystemId | null>(null);

  const handleView = React.useCallback(
    (customer: Customer) => {
      router.push(`/customers/${customer.systemId}`);
    },
    [router]
  );

  const handleEdit = React.useCallback(
    (customer: Customer) => {
      router.push(`/customers/${customer.systemId}/edit`);
    },
    [router]
  );

  const handleDeleteRequest = React.useCallback((customerId: SystemId) => {
    setDeleteConfirmId(customerId);
  }, []);

  const handleDeleteConfirm = React.useCallback(() => {
    if (deleteConfirmId) {
      remove.mutate(deleteConfirmId, {
        onSuccess: () => {
          toast.success('Đã xóa khách hàng');
          setDeleteConfirmId(null);
        },
      });
    }
  }, [deleteConfirmId, remove]);

  const handleDeleteCancel = React.useCallback(() => {
    setDeleteConfirmId(null);
  }, []);

  const handleRestore = React.useCallback(
    (customerId: SystemId) => {
      restore.mutate(customerId, {
        onSuccess: () => {
          toast.success('Đã khôi phục khách hàng');
        },
      });
    },
    [restore]
  );

  const handleStatusChange = React.useCallback(
    (customer: Customer, newStatus: Customer['status']) => {
      update.mutate({ systemId: customer.systemId, status: newStatus }, {
        onSuccess: () => {
          toast.success(`Đã cập nhật trạng thái khách hàng`);
        },
      });
    },
    [update]
  );

  return {
    deleteConfirmId,
    handleView,
    handleEdit,
    handleDeleteRequest,
    handleDeleteConfirm,
    handleDeleteCancel,
    handleRestore,
    handleStatusChange,
  };
}

/**
 * Hook for import/export dialogs
 */
export function useCustomerImportExport() {
  const [showImportDialog, setShowImportDialog] = React.useState(false);
  const [showExportDialog, setShowExportDialog] = React.useState(false);

  const handleImportComplete = React.useCallback(
    (importedCustomers: Customer[]) => {
      // Import is handled by the import dialog component which calls the API
      // This is just for UI state management
      toast.success(`Đã nhập ${importedCustomers.length} khách hàng`);
      setShowImportDialog(false);
    },
    []
  );

  return {
    showImportDialog,
    setShowImportDialog,
    showExportDialog,
    setShowExportDialog,
    handleImportComplete,
  };
}

/**
 * Hook for column customization
 */
export function useCustomerColumnState() {
  const [columnOrder, setColumnOrder] = React.useState<string[]>([]);
  const [pinnedColumns, setPinnedColumns] = React.useState<string[]>(['select', 'name']);

  return {
    columnOrder,
    setColumnOrder,
    pinnedColumns,
    setPinnedColumns,
  };
}
