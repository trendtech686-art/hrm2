/**
 * Business Activity Reports Components
 * 
 * Export tất cả components
 */

export { ReportChart } from './report-chart';
export { ReportFilters } from './report-filters';
export { ReportSummaryCards, SummaryCard } from './report-summary-cards';
export { 
  ReportHeaderActions, 
  SALES_REPORT_GLOSSARY,
  DELIVERY_REPORT_GLOSSARY,
  PAYMENT_REPORT_GLOSSARY,
} from './report-header-actions';

// Utility functions for formatting
export const formatCurrency = (value?: number) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return '0';
  return new Intl.NumberFormat('vi-VN').format(value);
};

export const formatPercent = (value?: number) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return '0%';
  return `${value.toFixed(1)}%`;
};

export const formatNumber = (value?: number) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return '0';
  return new Intl.NumberFormat('vi-VN').format(value);
};
