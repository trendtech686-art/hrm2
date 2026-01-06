import { z } from 'zod';

// =============================================================================
// REPORTS VALIDATION SCHEMAS
// =============================================================================

/**
 * Common Date Range Schema
 * Used across all report types
 */
export const dateRangeSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
}).refine(
  (data) => {
    if (data.startDate && data.endDate) {
      return new Date(data.startDate) <= new Date(data.endDate);
    }
    return true;
  },
  { message: 'Ngày bắt đầu phải trước ngày kết thúc' }
);

export type DateRangeInput = z.infer<typeof dateRangeSchema>;

/**
 * Report Period Schema
 */
export const reportPeriodSchema = z.enum([
  'today',
  'yesterday',
  'this_week',
  'last_week',
  'this_month',
  'last_month',
  'this_quarter',
  'last_quarter',
  'this_year',
  'last_year',
  'custom',
]);

export type ReportPeriod = z.infer<typeof reportPeriodSchema>;

/**
 * Sales Report Query Schema
 */
export const salesReportQuerySchema = z.object({
  period: reportPeriodSchema.default('this_month'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  branchSystemId: z.string().optional(),
  groupBy: z.enum(['day', 'week', 'month', 'quarter', 'year']).default('day'),
  includeDetails: z.boolean().default(false),
});

export type SalesReportQuery = z.infer<typeof salesReportQuerySchema>;

/**
 * Inventory Report Query Schema
 */
export const inventoryReportQuerySchema = z.object({
  branchSystemId: z.string().optional(),
  categorySystemId: z.string().optional(),
  brandSystemId: z.string().optional(),
  stockStatus: z.enum(['all', 'low', 'out', 'overstock']).default('all'),
  sortBy: z.enum(['name', 'quantity', 'value']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export type InventoryReportQuery = z.infer<typeof inventoryReportQuerySchema>;

/**
 * Customer SLA Report Query Schema
 */
export const customerSlaReportQuerySchema = z.object({
  period: reportPeriodSchema.default('this_month'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  branchSystemId: z.string().optional(),
  customerType: z.string().optional(),
  slaStatus: z.enum(['all', 'breached', 'warning', 'on_track']).default('all'),
});

export type CustomerSlaReportQuery = z.infer<typeof customerSlaReportQuerySchema>;

/**
 * Product SLA Report Query Schema
 */
export const productSlaReportQuerySchema = z.object({
  period: reportPeriodSchema.default('this_month'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  branchSystemId: z.string().optional(),
  categorySystemId: z.string().optional(),
});

export type ProductSlaReportQuery = z.infer<typeof productSlaReportQuerySchema>;

/**
 * Business Activity Report Query Schema
 */
export const businessActivityReportQuerySchema = z.object({
  period: reportPeriodSchema.default('this_month'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  branchSystemId: z.string().optional(),
  activityType: z.enum(['all', 'sales', 'purchases', 'inventory', 'finance']).default('all'),
});

export type BusinessActivityReportQuery = z.infer<typeof businessActivityReportQuerySchema>;

/**
 * Export Report Schema
 */
export const exportReportSchema = z.object({
  format: z.enum(['xlsx', 'csv', 'pdf']).default('xlsx'),
  includeCharts: z.boolean().default(false),
  filename: z.string().max(100).optional(),
});

export type ExportReportInput = z.infer<typeof exportReportSchema>;
