/**
 * Customer SLA Acknowledgement Storage
 * 
 * @migrated localStorage → /api/user-preferences
 * @see docs/LOCALSTORAGE-TO-DATABASE-MIGRATION.md
 */

import { SLA_ACKNOWLEDGEMENTS_KEY } from './constants';
import type { CustomerSlaAckMap, CustomerSlaAcknowledgement, CustomerSlaType, SlaActivityLog } from './types';
import type { SystemId } from '@/lib/id-types';

const SLA_ACTIVITY_LOG_KEY = 'customer-sla-activity-log';
const PREFERENCE_CATEGORY = 'customer-sla';

// In-memory cache
let cachedMap: CustomerSlaAckMap | null = null;
let cachedActivityLog: SlaActivityLog[] | null = null;
let saveTimeout: NodeJS.Timeout | null = null;
let activityLogSaveTimeout: NodeJS.Timeout | null = null;

// ============================================================================
// API-backed storage functions with debounce
// ============================================================================

async function loadAckMapFromAPI(): Promise<CustomerSlaAckMap> {
  try {
    const response = await fetch(`/api/user-preferences?category=${PREFERENCE_CATEGORY}&key=${SLA_ACKNOWLEDGEMENTS_KEY}`);
    if (response.ok) {
      const data = await response.json();
      return data.value || {};
    }
  } catch (error) {
    console.warn('[customer-sla] Failed to load ack map from API:', error);
  }
  return {};
}

async function saveAckMapToAPI(map: CustomerSlaAckMap): Promise<void> {
  try {
    await fetch('/api/user-preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: PREFERENCE_CATEGORY,
        key: SLA_ACKNOWLEDGEMENTS_KEY,
        value: map,
      }),
    });
  } catch (error) {
    console.warn('[customer-sla] Failed to save ack map to API:', error);
  }
}

async function loadActivityLogFromAPI(): Promise<SlaActivityLog[]> {
  try {
    const response = await fetch(`/api/user-preferences?category=${PREFERENCE_CATEGORY}&key=${SLA_ACTIVITY_LOG_KEY}`);
    if (response.ok) {
      const data = await response.json();
      return data.value || [];
    }
  } catch (error) {
    console.warn('[customer-sla] Failed to load activity log from API:', error);
  }
  return [];
}

async function saveActivityLogToAPI(logs: SlaActivityLog[]): Promise<void> {
  try {
    // Keep only last 500 entries
    const trimmed = logs.slice(-500);
    await fetch('/api/user-preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: PREFERENCE_CATEGORY,
        key: SLA_ACTIVITY_LOG_KEY,
        value: trimmed,
      }),
    });
  } catch (error) {
    console.warn('[customer-sla] Failed to save activity log to API:', error);
  }
}

// ============================================================================
// Debounced save functions
// ============================================================================

function debouncedSaveAckMap(map: CustomerSlaAckMap) {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveAckMapToAPI(map);
  }, 1000);
}

function debouncedSaveActivityLog(logs: SlaActivityLog[]) {
  if (activityLogSaveTimeout) clearTimeout(activityLogSaveTimeout);
  activityLogSaveTimeout = setTimeout(() => {
    saveActivityLogToAPI(logs);
  }, 1000);
}

// ============================================================================
// Initialize cache on first use
// ============================================================================

async function _ensureCache(): Promise<CustomerSlaAckMap> {
  if (!cachedMap) {
    cachedMap = await loadAckMapFromAPI();
  }
  return cachedMap;
}

async function ensureActivityLogCache(): Promise<SlaActivityLog[]> {
  if (!cachedActivityLog) {
    cachedActivityLog = await loadActivityLogFromAPI();
  }
  return cachedActivityLog;
}

// Sync version for immediate reads (uses cached data)
function ensureCacheSync(): CustomerSlaAckMap {
  if (!cachedMap) {
    // Trigger async load but return empty for now
    loadAckMapFromAPI().then(map => { cachedMap = map; });
    return {};
  }
  return cachedMap;
}

// ============================================================================
// Public API
// ============================================================================

export function getAcknowledgement(customerId: SystemId, slaType: CustomerSlaType): CustomerSlaAcknowledgement | undefined {
  const map = ensureCacheSync();
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
  const map = ensureCacheSync();
  map[customerId] = map[customerId] || {};
  map[customerId][ack.slaType] = ack;
  cachedMap = map;
  debouncedSaveAckMap(map);
  
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
  const map = ensureCacheSync();
  if (!map[customerId]) return;
  if (slaType) {
    delete map[customerId][slaType];
  } else {
    delete map[customerId];
  }
  cachedMap = map;
  debouncedSaveAckMap(map);
}

// Activity Log functions
export const SLA_LOG_UPDATED_EVENT = 'sla-log-updated';

export function addActivityLog(log: SlaActivityLog) {
  // Get current cache or initialize empty
  if (!cachedActivityLog) {
    cachedActivityLog = [];
    // Also trigger async load to get existing logs
    ensureActivityLogCache();
  }
  cachedActivityLog.push(log);
  debouncedSaveActivityLog(cachedActivityLog);
  
  // Dispatch event to notify listeners
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SLA_LOG_UPDATED_EVENT, { detail: { customerId: log.customerId } }));
  }
}

export function getActivityLogs(customerId?: SystemId, limit = 50): SlaActivityLog[] {
  const logs = cachedActivityLog || [];
  const filtered = customerId 
    ? logs.filter(l => l.customerId === customerId)
    : logs;
  return filtered.slice(-limit).reverse();
}

// Async version to ensure data is loaded
export async function getActivityLogsAsync(customerId?: SystemId, limit = 50): Promise<SlaActivityLog[]> {
  const logs = await ensureActivityLogCache();
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
