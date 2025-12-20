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
} from './types';

// Components
export * from './components/index';

// Hooks
export * from './hooks/index';

// Pages
export * from './pages/index';
