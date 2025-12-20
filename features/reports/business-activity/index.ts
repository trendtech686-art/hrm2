/**
 * Business Activity Reports Module
 * 
 * Module báo cáo hoạt động kinh doanh
 */

// Types (export selectively to avoid naming conflicts)
export type {
  ReportType,
  GroupByOption,
  TimeGrouping,
  ChartType,
  ReportDateRange,
  ReportFilters as ReportFiltersType,
  SalesTimeReportRow,
  SalesEmployeeReportRow,
  SalesProductReportRow,
  SalesBranchReportRow,
  SalesCustomerReportRow,
  SalesReportSummary,
  ChartDataPoint,
  ComboChartConfig,
} from './types.ts';

// Components
export * from './components/index.ts';

// Hooks
export * from './hooks/index.ts';

// Pages
export * from './pages/index.ts';
