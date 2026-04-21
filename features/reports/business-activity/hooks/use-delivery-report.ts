/**
 * Delivery Report Hooks — dữ liệu từ GET /api/reports/delivery-aggregate
 */

import { useQuery } from '@tanstack/react-query';
import {
  fetchDeliveryReport,
  fetchDeliveryTimeSeries,
} from '@/features/reports/api/reports-api';
import type {
  ReportDateRange,
  TimeGrouping,
  DeliveryTimeReportRow,
  DeliveryEmployeeReportRow,
  DeliveryShipmentReportRow,
  DeliveryCarrierReportRow,
  DeliveryBranchReportRow,
  DeliveryCustomerReportRow,
  DeliveryChannelReportRow,
  DeliverySourceReportRow,
  DeliveryReportSummary,
} from '../types';
import type { SystemId } from '@/lib/id-types';
import { REPORTS_QUERY_GC_MS, REPORTS_QUERY_STALE_MS } from '../lib/reports-query-config';

const EMPTY_TIME_SUMMARY = {
  totalShipments: 0,
  deliveredCount: 0,
  pendingCount: 0,
  failedCount: 0,
  returnedCount: 0,
  totalAmount: 0,
  codAmount: 0,
  shippingFee: 0,
  deliveryRate: 0,
};

const EMPTY_SHIPMENT_SUMMARY: DeliveryReportSummary = {
  totalShipments: 0,
  deliveredCount: 0,
  pendingCount: 0,
  failedCount: 0,
  returnedCount: 0,
  deliveryRate: 0,
  totalAmount: 0,
  codAmount: 0,
  shippingFee: 0,
};

export function useDeliveryTimeReport(
  dateRange: ReportDateRange,
  timeGrouping: TimeGrouping = 'day',
  _filters?: { branchIds?: SystemId[]; carrierIds?: string[] },
) {
  const query = useQuery({
    queryKey: [
      'reports',
      'delivery-aggregate',
      'time-series',
      dateRange.from,
      dateRange.to,
      timeGrouping,
      _filters?.branchIds,
      _filters?.carrierIds,
    ],
    queryFn: () =>
      fetchDeliveryTimeSeries({
        dateRange,
        grouping: timeGrouping,
        branchIds: _filters?.branchIds,
        carrierIds: _filters?.carrierIds,
      }),
    enabled: Boolean(dateRange.from && dateRange.to),
    staleTime: REPORTS_QUERY_STALE_MS,
    gcTime: REPORTS_QUERY_GC_MS,
  });

  const payload = query.data;
  return {
    data: (payload?.data ?? []) as DeliveryTimeReportRow[],
    summary: (payload?.summary ?? EMPTY_TIME_SUMMARY) as typeof EMPTY_TIME_SUMMARY,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

export function useDeliveryEmployeeReport(
  dateRange: ReportDateRange,
  _filters?: { branchIds?: SystemId[]; carrierIds?: string[] },
) {
  const query = useQuery({
    queryKey: [
      'reports',
      'delivery-aggregate',
      'employee',
      dateRange.from,
      dateRange.to,
      _filters?.branchIds,
      _filters?.carrierIds,
    ],
    queryFn: () =>
      fetchDeliveryReport({
        view: 'employee',
        dateRange,
        branchIds: _filters?.branchIds,
        carrierIds: _filters?.carrierIds,
      }),
    enabled: Boolean(dateRange.from && dateRange.to),
    staleTime: REPORTS_QUERY_STALE_MS,
    gcTime: REPORTS_QUERY_GC_MS,
  });

  return {
    data: (query.data?.data ?? []) as DeliveryEmployeeReportRow[],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

export function useDeliveryShipmentReport(
  dateRange: ReportDateRange,
  filters?: { branchIds?: SystemId[]; carrierIds?: string[] },
  pagination?: { page: number; pageSize: number },
) {
  const page = pagination?.page ?? 1;
  const limit = pagination?.pageSize ?? 20;

  const query = useQuery({
    queryKey: [
      'reports',
      'delivery-aggregate',
      'shipment-list',
      dateRange.from,
      dateRange.to,
      filters?.branchIds,
      filters?.carrierIds,
      page,
      limit,
    ],
    queryFn: () =>
      fetchDeliveryReport({
        view: 'shipment-list',
        dateRange,
        branchIds: filters?.branchIds,
        carrierIds: filters?.carrierIds,
        page,
        limit,
      }),
    enabled: Boolean(dateRange.from && dateRange.to),
    staleTime: REPORTS_QUERY_STALE_MS,
    gcTime: REPORTS_QUERY_GC_MS,
  });

  return {
    data: (query.data?.data ?? []) as DeliveryShipmentReportRow[],
    summary: query.data?.summary ?? EMPTY_SHIPMENT_SUMMARY,
    pagination: query.data?.pagination,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

export function useDeliveryCarrierReport(
  dateRange: ReportDateRange,
  _filters?: { branchIds?: SystemId[]; carrierIds?: string[] },
) {
  const query = useQuery({
    queryKey: [
      'reports',
      'delivery-aggregate',
      'carrier',
      dateRange.from,
      dateRange.to,
      _filters?.branchIds,
      _filters?.carrierIds,
    ],
    queryFn: () =>
      fetchDeliveryReport({
        view: 'carrier',
        dateRange,
        branchIds: _filters?.branchIds,
        carrierIds: _filters?.carrierIds,
      }),
    enabled: Boolean(dateRange.from && dateRange.to),
    staleTime: REPORTS_QUERY_STALE_MS,
    gcTime: REPORTS_QUERY_GC_MS,
  });

  return {
    data: (query.data?.data ?? []) as DeliveryCarrierReportRow[],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

export function useDeliveryBranchReport(dateRange: ReportDateRange) {
  const query = useQuery({
    queryKey: ['reports', 'delivery-aggregate', 'branch', dateRange.from, dateRange.to],
    queryFn: () =>
      fetchDeliveryReport({
        view: 'branch',
        dateRange,
      }),
    enabled: Boolean(dateRange.from && dateRange.to),
    staleTime: REPORTS_QUERY_STALE_MS,
    gcTime: REPORTS_QUERY_GC_MS,
  });

  return {
    data: (query.data?.data ?? []) as DeliveryBranchReportRow[],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

export function useDeliveryCustomerReport(
  dateRange: ReportDateRange,
  _filters?: { branchIds?: SystemId[]; carrierIds?: string[] },
) {
  const query = useQuery({
    queryKey: [
      'reports',
      'delivery-aggregate',
      'customer',
      dateRange.from,
      dateRange.to,
      _filters?.branchIds,
      _filters?.carrierIds,
    ],
    queryFn: () =>
      fetchDeliveryReport({
        view: 'customer',
        dateRange,
        branchIds: _filters?.branchIds,
        carrierIds: _filters?.carrierIds,
      }),
    enabled: Boolean(dateRange.from && dateRange.to),
    staleTime: REPORTS_QUERY_STALE_MS,
    gcTime: REPORTS_QUERY_GC_MS,
  });

  return {
    data: (query.data?.data ?? []) as DeliveryCustomerReportRow[],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

export function useDeliveryChannelReport(dateRange: ReportDateRange) {
  const query = useQuery({
    queryKey: ['reports', 'delivery-aggregate', 'channel', dateRange.from, dateRange.to],
    queryFn: () =>
      fetchDeliveryReport({
        view: 'channel',
        dateRange,
      }),
    enabled: Boolean(dateRange.from && dateRange.to),
    staleTime: REPORTS_QUERY_STALE_MS,
    gcTime: REPORTS_QUERY_GC_MS,
  });

  return {
    data: (query.data?.data ?? []) as DeliveryChannelReportRow[],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

export function useDeliverySourceReport(dateRange: ReportDateRange) {
  const query = useQuery({
    queryKey: ['reports', 'delivery-aggregate', 'source', dateRange.from, dateRange.to],
    queryFn: () =>
      fetchDeliveryReport({
        view: 'source',
        dateRange,
      }),
    enabled: Boolean(dateRange.from && dateRange.to),
    staleTime: REPORTS_QUERY_STALE_MS,
    gcTime: REPORTS_QUERY_GC_MS,
  });

  return {
    data: (query.data?.data ?? []) as DeliverySourceReportRow[],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
