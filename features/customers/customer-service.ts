import { simpleSearch } from '../../lib/simple-search';
import { isDateAfter, isDateBefore } from '../../lib/date-utils';
import type { Customer } from '@/lib/types/prisma-extended';

export type CustomerSortKey = 'name' | 'id' | 'createdAt' | 'status' | 'type';

export const DEFAULT_CUSTOMER_SORT: { id: CustomerSortKey; desc: boolean } = {
  id: 'createdAt',
  desc: true,
};

export interface CustomerQueryParams {
  search: string;
  statusFilter: string;
  typeFilter: string;
  dateRange?: [string | undefined, string | undefined] | undefined;
  showDeleted: boolean;
  debtFilter: 'all' | 'totalOverdue' | 'overdue' | 'dueSoon' | 'hasDebt' | 'noDebt' | 'customerOwes' | 'weOwe';
  pagination: { pageIndex: number; pageSize: number };
  sorting: { id: CustomerSortKey; desc: boolean };
}

export interface CustomerQueryResult {
  items: Customer[];
  total: number;
  pageCount: number;
  pageIndex: number;
}

interface PipelineResult {
  filtered: Customer[];
}

// Search keys for customers
const CUSTOMER_SEARCH_KEYS: (keyof Customer)[] = ['name', 'email', 'phone', 'company', 'taxCode', 'id'];

function applyFilters(customers: Customer[], params: CustomerQueryParams): PipelineResult {
  const {
    search,
    statusFilter,
    typeFilter,
    dateRange,
    showDeleted,
    sorting,
    debtFilter,
  } = params;

  let dataset = customers.filter(customer =>
    showDeleted ? !!customer.isDeleted : !customer.isDeleted
  );

  if (statusFilter !== 'all') {
    dataset = dataset.filter(customer => customer.status === statusFilter);
  }

  if (typeFilter !== 'all') {
    dataset = dataset.filter(customer => customer.type === typeFilter);
  }

  if (dateRange && (dateRange[0] || dateRange[1])) {
    dataset = dataset.filter(customer => {
      if (!customer.createdAt) return false;
      const createdDate = new Date(customer.createdAt);
      const fromDate = dateRange[0] ? new Date(dateRange[0]) : null;
      const toDate = dateRange[1] ? new Date(dateRange[1]) : null;
      if (fromDate && isDateBefore(createdDate, fromDate)) return false;
      if (toDate && isDateAfter(createdDate, toDate)) return false;
      return true;
    });
  }

  // Apply Debt filter
  if (debtFilter !== 'all') {
    if (debtFilter === 'totalOverdue' || debtFilter === 'overdue') {
      // Filter customers with overdue debt
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
    } else if (debtFilter === 'dueSoon') {
      // Filter customers with debt due in 1-3 days
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
    } else if (debtFilter === 'hasDebt') {
      // Filter customers with any debt (non-zero, including negative)
      dataset = dataset.filter(customer => (customer.currentDebt || 0) !== 0);
    }
  }

  if (search.trim()) {
    // Use simple search instead of Fuse.js
    dataset = simpleSearch(dataset, search.trim(), {
      keys: CUSTOMER_SEARCH_KEYS,
    });
  }

  const sorter = sorting.id as keyof Customer;
  dataset = [...dataset].sort((a, b) => {
    const valueA = a[sorter] ?? '';
    const valueB = b[sorter] ?? '';
    if (valueA < valueB) return sorting.desc ? 1 : -1;
    if (valueA > valueB) return sorting.desc ? -1 : 1;
    return 0;
  });

  return { filtered: dataset };
}

export async function fetchCustomersPage(params: CustomerQueryParams, data: Customer[]): Promise<CustomerQueryResult> {
  const { filtered } = applyFilters(data, params);

  const { pageIndex, pageSize } = params.pagination;
  const start = pageIndex * pageSize;
  const end = start + pageSize;
  const pagedItems = filtered.slice(start, end);

  return {
    items: pagedItems,
    total: filtered.length,
    pageCount: Math.max(1, Math.ceil(filtered.length / pageSize)),
    pageIndex,
  };
}


