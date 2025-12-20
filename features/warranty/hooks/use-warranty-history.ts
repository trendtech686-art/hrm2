import * as React from 'react';
import type { HistoryEntry } from '../../../components/ActivityHistory';
import type { WarrantyHistory, WarrantyTicket } from '../types';

const ACTION_MAP: Record<string, HistoryEntry['action']> = {
  created: 'created',
  create_ticket: 'created',
  updated: 'updated',
  update_ticket: 'updated',
  deleted: 'deleted',
  remove_ticket: 'deleted',
  status_changed: 'status_changed',
  assigned: 'assigned',
  add_product: 'product_added',
  update_product: 'product_updated',
  remove_product: 'product_removed',
  payment_added: 'payment_made',
  payment_updated: 'payment_made',
  comment_added: 'comment_added',
  comment_updated: 'commented',
  comment_deleted: 'commented',
  attachment_added: 'attachment_added',
  verified: 'verified',
  resolved: 'resolved',
  cancelled: 'cancelled',
  reopened: 'reopened',
};

function mapWarrantyHistoryAction(action?: string): HistoryEntry['action'] {
  if (!action) {
    return 'custom';
  }
  return ACTION_MAP[action] || 'custom';
}

function mapHistoryEntries(items: WarrantyHistory[] = []): HistoryEntry[] {
  return items.map((entry) => ({
    id: entry.systemId,
    action: mapWarrantyHistoryAction(entry.action),
    timestamp: new Date(entry.performedAt),
    user: {
      systemId: entry.metadata?.performedBySystemId || entry.performedBy || 'SYSTEM',
      name: entry.performedBy || 'Hệ thống',
    },
    description: entry.actionLabel || entry.action || 'Hoạt động',
    metadata: entry.note
      ? { ...entry.metadata, note: entry.note }
      : entry.metadata,
  }));
}

interface UseWarrantyHistoryParams {
  ticket: WarrantyTicket | null;
}

export function useWarrantyHistory({ ticket }: UseWarrantyHistoryParams) {
  const historyEntries = React.useMemo(() => mapHistoryEntries(ticket?.history), [ticket?.history]);

  const filterableActions = React.useMemo(() => {
    const uniqueActions = new Set<string>();
    historyEntries.forEach((entry) => uniqueActions.add(entry.action));
    return Array.from(uniqueActions).sort();
  }, [historyEntries]);

  const filterableUsers = React.useMemo(() => {
    const uniqueUsers = new Map<string, { systemId: string; name: string }>();
    historyEntries.forEach((entry) => {
      uniqueUsers.set(entry.user.systemId, entry.user);
    });
    return Array.from(uniqueUsers.values());
  }, [historyEntries]);

  return {
    historyEntries,
    filterableActions,
    filterableUsers,
    totalEntries: historyEntries.length,
  };
}
