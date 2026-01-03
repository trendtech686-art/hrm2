/**
 * Employee Detail Components
 * 
 * This barrel file exports all components related to employee detail page
 */

// Types and utilities
export * from './types';

// Dialog components
export { PayslipDetailDialog } from './PayslipDetailDialog';
export { AttendanceDetailDialog } from './AttendanceDetailDialog';

// Note: PayrollTabContent was considered but not extracted due to tight coupling
// with component state (columns depend on callbacks like onPrintSingle, etc.)
