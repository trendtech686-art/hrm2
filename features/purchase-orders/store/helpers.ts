/**
 * Purchase Orders Store - Helpers
 * Utility functions for purchase order operations
 * 
 * @module features/purchase-orders/store/helpers
 */

import type { HistoryEntry } from '../../../components/ActivityHistory';

/**
 * Create a history entry for activity tracking
 */
export const createHistoryEntry = (
    action: HistoryEntry['action'],
    description: string,
    user: { systemId: string; name: string },
    metadata?: HistoryEntry['metadata']
): HistoryEntry => ({
    id: crypto.randomUUID(),
    action,
    timestamp: new Date(),
    user: { systemId: user.systemId, name: user.name },
    description,
    metadata,
});
