import { SLA_ACKNOWLEDGEMENTS_KEY } from './constants';
import type { CustomerSlaAckMap, CustomerSlaAcknowledgement, CustomerSlaType, SlaActivityLog, SlaActionType } from './types';
import type { SystemId } from '@/lib/id-types';

const SLA_ACTIVITY_LOG_KEY = 'customer-sla-activity-log';

function loadAckMap(): CustomerSlaAckMap {
  if (typeof window === 'undefined') {
    return {};
  }
  try {
    const raw = window.localStorage.getItem(SLA_ACKNOWLEDGEMENTS_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (error) {
    console.warn('[customer-sla] Failed to load ack map', error);
    return {};
  }
}

function saveAckMap(map: CustomerSlaAckMap) {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(SLA_ACKNOWLEDGEMENTS_KEY, JSON.stringify(map));
  } catch (error) {
    console.warn('[customer-sla] Failed to persist ack map', error);
  }
}

let cachedMap: CustomerSlaAckMap | null = null;

function ensureCache(): CustomerSlaAckMap {
  if (!cachedMap) {
    cachedMap = loadAckMap();
  }
  return cachedMap;
}

export function getAcknowledgement(customerId: SystemId, slaType: CustomerSlaType): CustomerSlaAcknowledgement | undefined {
  const map = ensureCache();
  const ack = map[customerId]?.[slaType];
  
  // Check if snooze has expired
  if (ack?.snoozeUntil) {
    const snoozeEnd = new Date(ack.snoozeUntil);
    if (snoozeEnd < new Date()) {
      // Snooze expired, remove the acknowledgement
      clearAcknowledgement(customerId, slaType);
      return undefined;
    }
  }
  
  return ack;
}

export function setAcknowledgement(customerId: SystemId, ack: CustomerSlaAcknowledgement, performedBy?: string) {
  const map = ensureCache();
  map[customerId] = map[customerId] || {};
  map[customerId][ack.slaType] = ack;
  saveAckMap(map);
  
  // Log activity
  addActivityLog({
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    customerId,
    slaType: ack.slaType,
    actionType: ack.actionType,
    performedAt: ack.acknowledgedAt,
    performedBy,
    notes: ack.notes,
  });
}

export function clearAcknowledgement(customerId: SystemId, slaType?: CustomerSlaType) {
  const map = ensureCache();
  if (!map[customerId]) return;
  if (slaType) {
    delete map[customerId][slaType];
  } else {
    delete map[customerId];
  }
  saveAckMap(map);
}

// Activity Log functions
function loadActivityLog(): SlaActivityLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(SLA_ACTIVITY_LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveActivityLog(logs: SlaActivityLog[]) {
  if (typeof window === 'undefined') return;
  try {
    // Keep only last 500 entries
    const trimmed = logs.slice(-500);
    window.localStorage.setItem(SLA_ACTIVITY_LOG_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.warn('[customer-sla] Failed to save activity log', error);
  }
}

export const SLA_LOG_UPDATED_EVENT = 'sla-log-updated';

export function addActivityLog(log: SlaActivityLog) {
  const logs = loadActivityLog();
  logs.push(log);
  saveActivityLog(logs);
  
  // Dispatch event to notify listeners
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SLA_LOG_UPDATED_EVENT, { detail: { customerId: log.customerId } }));
  }
}

export function getActivityLogs(customerId?: SystemId, limit = 50): SlaActivityLog[] {
  const logs = loadActivityLog();
  const filtered = customerId 
    ? logs.filter(l => l.customerId === customerId)
    : logs;
  return filtered.slice(-limit).reverse();
}

export function isAlertSnoozed(customerId: SystemId, slaType: CustomerSlaType): boolean {
  const ack = getAcknowledgement(customerId, slaType);
  if (!ack?.snoozeUntil) return false;
  return new Date(ack.snoozeUntil) > new Date();
}

export function getSnoozeRemaining(customerId: SystemId, slaType: CustomerSlaType): number {
  const ack = getAcknowledgement(customerId, slaType);
  if (!ack?.snoozeUntil) return 0;
  const remaining = new Date(ack.snoozeUntil).getTime() - Date.now();
  return Math.max(0, Math.ceil(remaining / (1000 * 60 * 60 * 24))); // Days remaining
}
