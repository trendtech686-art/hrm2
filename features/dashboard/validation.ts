/**
 * Zod validation schemas for dashboard module
 * Dashboard chủ yếu là hiển thị dữ liệu, nhưng vẫn cần schemas cho filters và widgets config
 */
import { z } from 'zod';

// Dashboard date range filter
export const dashboardDateRangeSchema = z.object({
  preset: z.enum([
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
    'custom'
  ]).default('today'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// Widget configuration
export const dashboardWidgetSchema = z.object({
  id: z.string(),
  type: z.enum([
    'stat_card',
    'chart_bar',
    'chart_line',
    'chart_pie',
    'table',
    'alert_list',
    'quick_actions'
  ]),
  title: z.string(),
  position: z.object({
    x: z.number().int().min(0),
    y: z.number().int().min(0),
    width: z.number().int().min(1).max(12),
    height: z.number().int().min(1),
  }),
  dataSource: z.string().optional(),
  refreshInterval: z.number().int().min(0).optional(),
  isVisible: z.boolean().default(true),
});

// Dashboard layout configuration
export const dashboardLayoutSchema = z.object({
  name: z.string().min(1, 'Tên layout không được để trống'),
  description: z.string().optional(),
  isDefault: z.boolean().default(false),
  widgets: z.array(dashboardWidgetSchema),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Dashboard filters
export const dashboardFiltersSchema = z.object({
  branchSystemId: z.string().optional(),
  dateRange: dashboardDateRangeSchema.optional(),
  departmentSystemId: z.string().optional(),
  employeeSystemId: z.string().optional(),
});

// Quick stat configuration
export const quickStatConfigSchema = z.object({
  id: z.string(),
  label: z.string(),
  metric: z.enum([
    'revenue_today',
    'orders_today',
    'new_customers',
    'pending_packaging',
    'active_shipping',
    'low_stock_items',
    'pending_payments',
    'overdue_orders',
    'active_employees',
    'contracts_expiring',
  ]),
  icon: z.string().optional(),
  color: z.string().optional(),
  format: z.enum(['currency', 'number', 'percentage']).default('number'),
});

// Alert widget configuration
export const alertConfigSchema = z.object({
  type: z.enum([
    'debt_alert',
    'inventory_alert',
    'contract_expiry',
    'order_overdue',
    'payment_pending'
  ]),
  threshold: z.number().optional(),
  maxItems: z.number().int().min(1).max(20).default(5),
  severity: z.enum(['info', 'warning', 'error']).optional(),
});

// Types
export type DashboardDateRange = z.infer<typeof dashboardDateRangeSchema>;
export type DashboardWidget = z.infer<typeof dashboardWidgetSchema>;
export type DashboardLayout = z.infer<typeof dashboardLayoutSchema>;
export type DashboardFilters = z.infer<typeof dashboardFiltersSchema>;
export type QuickStatConfig = z.infer<typeof quickStatConfigSchema>;
export type AlertConfig = z.infer<typeof alertConfigSchema>;
