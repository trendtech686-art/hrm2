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

// Tab components (for lazy-loading via dynamic())
export { PenaltiesTab } from './PenaltiesTab';
export { LeavesTab } from './LeavesTab';
export { TasksTab, useTaskStats } from './TasksTab';
export { PayrollAttendanceTab } from './PayrollAttendanceTab';

// Column definitions (extracted to reduce detail-page.tsx size)
export * from './columns';
