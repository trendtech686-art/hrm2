/**
 * Services Index
 * 
 * Re-export all business logic services
 * 
 * @example
 * import { orderService, inventoryService } from '@/lib/services';
 */

export { orderService } from './order.service';
export { inventoryService } from './inventory.service';

// Re-export existing services
export { activityLogService } from './activity-log-service';
export { customerDebtService } from './customer-debt-service';
