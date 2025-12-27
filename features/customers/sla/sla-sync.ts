/**
 * Customer SLA Sync Utilities
 * NOTE: localStorage has been removed - uses in-memory cache + database sync
 */

import type { 
  CustomerSlaAckMap, 
  SlaActivityLog,
  CustomerSlaIndex 
} from '@/lib/types/prisma-extended';

// In-memory caches
let ackMapCache: CustomerSlaAckMap | null = null;
let activityLogCache: SlaActivityLog[] | null = null;
let evaluationCache: CustomerSlaIndex | null = null;

// ============= ACKNOWLEDGEMENTS =============

async function fetchAckMap(): Promise<CustomerSlaAckMap> {
  try {
    const response = await fetch('/api/customer-sla?type=ack');
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (error) {
    console.error('[CustomerSLA] Failed to fetch ack map:', error);
    throw error;
  }
}

async function saveAckMapToDb(map: CustomerSlaAckMap): Promise<void> {
  try {
    const response = await fetch('/api/customer-sla', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'ack', data: map }),
    });
    if (!response.ok) throw new Error('Failed to save');
  } catch (error) {
    console.error('[CustomerSLA] Failed to save ack map:', error);
    throw error;
  }
}

/**
 * Load ack map from database
 */
export async function loadAckMapAsync(): Promise<CustomerSlaAckMap> {
  try {
    const data = await fetchAckMap();
    ackMapCache = data;
    return data;
  } catch {
    return ackMapCache ?? {};
  }
}

/**
 * Get ack map synchronously (from cache)
 */
export function getAckMapSync(): CustomerSlaAckMap {
  return ackMapCache ?? {};
}

/**
 * Save ack map to database
 */
export async function saveAckMapAsync(map: CustomerSlaAckMap): Promise<void> {
  await saveAckMapToDb(map);
  ackMapCache = map;
}

// ============= ACTIVITY LOG =============

async function fetchActivityLog(): Promise<SlaActivityLog[]> {
  try {
    const response = await fetch('/api/customer-sla?type=log');
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (error) {
    console.error('[CustomerSLA] Failed to fetch activity log:', error);
    throw error;
  }
}

async function saveActivityLogToDb(logs: SlaActivityLog[]): Promise<void> {
  try {
    const response = await fetch('/api/customer-sla', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'log', data: logs }),
    });
    if (!response.ok) throw new Error('Failed to save');
  } catch (error) {
    console.error('[CustomerSLA] Failed to save activity log:', error);
    throw error;
  }
}

/**
 * Load activity log from database
 */
export async function loadActivityLogAsync(): Promise<SlaActivityLog[]> {
  try {
    const data = await fetchActivityLog();
    activityLogCache = data;
    return data;
  } catch {
    return activityLogCache ?? [];
  }
}

/**
 * Get activity log synchronously
 */
export function getActivityLogSync(): SlaActivityLog[] {
  return activityLogCache ?? [];
}

/**
 * Add to activity log and save to database
 */
export async function addActivityLogAsync(log: SlaActivityLog): Promise<void> {
  const logs = getActivityLogSync();
  logs.push(log);
  // Keep only last 500 entries
  const trimmed = logs.slice(-500);
  await saveActivityLogToDb(trimmed);
  activityLogCache = trimmed;
}

// ============= EVALUATION DATA =============

async function fetchEvaluation(): Promise<CustomerSlaIndex | null> {
  try {
    const response = await fetch('/api/customer-sla?type=evaluation');
    if (!response.ok) throw new Error('Failed to fetch');
    return await response.json();
  } catch (error) {
    console.error('[CustomerSLA] Failed to fetch evaluation:', error);
    throw error;
  }
}

async function saveEvaluationToDb(data: CustomerSlaIndex, timestamp: string): Promise<void> {
  try {
    await fetch('/api/customer-sla', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'evaluation', data }),
    });
  } catch (error) {
    console.error('[CustomerSLA] Failed to save evaluation:', error);
    throw error;
  }
}

/**
 * Load evaluation data from database
 */
export async function loadEvaluationAsync(): Promise<CustomerSlaIndex | null> {
  try {
    const data = await fetchEvaluation();
    evaluationCache = data;
    return data;
  } catch {
    return evaluationCache;
  }
}

/**
 * Get evaluation data synchronously
 */
export function getEvaluationSync(): CustomerSlaIndex | null {
  return evaluationCache;
}

/**
 * Save evaluation data to database
 */
export async function saveEvaluationAsync(data: CustomerSlaIndex, timestamp: string): Promise<void> {
  await saveEvaluationToDb(data, timestamp);
  evaluationCache = data;
}

// ============= INITIALIZATION =============

/**
 * Initialize all customer SLA data from database
 */
export async function initCustomerSlaData(): Promise<void> {
  await Promise.all([
    loadAckMapAsync(),
    loadActivityLogAsync(),
    loadEvaluationAsync(),
  ]);
}
