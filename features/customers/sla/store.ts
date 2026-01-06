/**
 * Customer SLA Engine Store
 * 
 * @migrated localStorage → /api/user-preferences for cache
 * @see docs/LOCALSTORAGE-TO-DATABASE-MIGRATION.md
 */

import { create } from 'zustand';
import type { Customer } from '../types';
import type { CustomerSlaSetting } from '../../settings/customers/types';
import type { CustomerSlaIndex, ReportSummary, CustomerSlaAlert, SlaActionType } from './types';
import { buildSlaIndex, summarizeIndex } from './evaluator';
import { SLA_EVALUATION_KEY, SLA_LAST_RUN_KEY } from './constants';
import { setAcknowledgement, getAcknowledgement, isAlertSnoozed, getSnoozeRemaining } from './ack-storage';
import type { CustomerSlaType, CustomerSlaAcknowledgement } from './types';
import type { SystemId } from '@/lib/id-types';
import { getCurrentUserName } from '@/contexts/auth-context';
import { useCustomerStore } from '../store';

const PREFERENCE_CATEGORY = 'customer-sla';

type SlaStoreState = {
  lastEvaluatedAt?: string;
  index: CustomerSlaIndex | null;
  summary: ReportSummary | null;
  isLoading: boolean;
};

type AcknowledgeOptions = {
  actionType?: SlaActionType;
  snoozeDays?: number;
  notes?: string;
};

type SlaStoreActions = {
  evaluate: (customers: Customer[], settings: CustomerSlaSetting[]) => void;
  acknowledge: (customerId: SystemId, alert: CustomerSlaAlert, options?: AcknowledgeOptions) => void;
  snooze: (customerId: SystemId, alert: CustomerSlaAlert, days: number, notes?: string) => void;
  getAck: (customerId: SystemId, slaType: CustomerSlaType) => CustomerSlaAcknowledgement | undefined;
  isSnoozed: (customerId: SystemId, slaType: CustomerSlaType) => boolean;
  getSnoozeRemaining: (customerId: SystemId, slaType: CustomerSlaType) => number;
  triggerReevaluation: () => void;
  loadCachedIndex: () => Promise<void>;
};

type SlaStore = SlaStoreState & SlaStoreActions;

// API-backed cache functions
async function loadIndexFromAPI(): Promise<CustomerSlaIndex | null> {
  try {
    const response = await fetch(`/api/user-preferences?category=${PREFERENCE_CATEGORY}&key=${SLA_EVALUATION_KEY}`);
    if (response.ok) {
      const data = await response.json();
      return data.value || null;
    }
  } catch (_error) {
    // Silently fail - return null
  }
  return null;
}

async function loadLastRunFromAPI(): Promise<string | undefined> {
  try {
    const response = await fetch(`/api/user-preferences?category=${PREFERENCE_CATEGORY}&key=${SLA_LAST_RUN_KEY}`);
    if (response.ok) {
      const data = await response.json();
      return data.value || undefined;
    }
  } catch (_error) {
    // Silently fail - return undefined
  }
  return undefined;
}

let saveTimeout: NodeJS.Timeout | null = null;

async function saveIndexToAPI(index: CustomerSlaIndex, timestamp: string): Promise<void> {
  // Cancel any pending save
  if (saveTimeout) clearTimeout(saveTimeout);
  
  // Debounce save to avoid too many API calls
  saveTimeout = setTimeout(async () => {
    try {
      await Promise.all([
        fetch('/api/user-preferences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: PREFERENCE_CATEGORY,
            key: SLA_EVALUATION_KEY,
            value: index,
          }),
        }),
        fetch('/api/user-preferences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: PREFERENCE_CATEGORY,
            key: SLA_LAST_RUN_KEY,
            value: timestamp,
          }),
        }),
      ]);
    } catch (_error) {
      // Silently fail - save is not critical
    }
  }, 1000);
}

// Store reference for re-evaluation
let _lastCustomers: Customer[] = [];
let _lastSettings: CustomerSlaSetting[] = [];

export const useCustomerSlaEngineStore = create<SlaStore>((set, get) => {
  // Start with empty state, load from API async
  const initialState: SlaStoreState = {
    index: null,
    summary: null,
    isLoading: true,
    lastEvaluatedAt: undefined,
  };

  return {
    ...initialState,

    // Load cached index from API (called on mount)
    async loadCachedIndex() {
      const [cachedIndex, lastRun] = await Promise.all([
        loadIndexFromAPI(),
        loadLastRunFromAPI(),
      ]);
      
      if (cachedIndex) {
        set({
          index: cachedIndex,
          summary: summarizeIndex(cachedIndex),
          lastEvaluatedAt: lastRun,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    },

    evaluate(customers, settings) {
      // Store for re-evaluation
      _lastCustomers = customers;
      _lastSettings = settings;
      
      set({ isLoading: true });
      const nextIndex = buildSlaIndex(customers, settings);
      const nextSummary = summarizeIndex(nextIndex);
      const timestamp = new Date().toISOString();

      // Save to API (debounced)
      saveIndexToAPI(nextIndex, timestamp);

      set({
        index: nextIndex,
        summary: nextSummary,
        lastEvaluatedAt: timestamp,
        isLoading: false,
      });
    },

    triggerReevaluation() {
      // Get fresh customer data from the customer store
      const freshCustomers = useCustomerStore.getState().data;
      if (freshCustomers.length && _lastSettings.length) {
        get().evaluate(freshCustomers, _lastSettings);
      }
    },

    acknowledge(customerId, alert, options = {}) {
      const { actionType = 'acknowledged', snoozeDays, notes } = options;
      const now = new Date();
      const performedBy = getCurrentUserName() || 'Hệ thống';
      
      const ack: CustomerSlaAcknowledgement = {
        slaType: alert.slaType,
        targetDate: alert.targetDate,
        acknowledgedAt: now.toISOString(),
        actionType,
        notes,
      };
      
      if (snoozeDays && snoozeDays > 0) {
        const snoozeEnd = new Date(now.getTime() + snoozeDays * 24 * 60 * 60 * 1000);
        ack.snoozeUntil = snoozeEnd.toISOString();
        ack.actionType = 'snoozed';
      }
      
      setAcknowledgement(customerId, ack, performedBy);

      const currentIndex = get().index;
      if (!currentIndex) return;

      // For follow-up SLA, we remove from index because the cycle will be reset
      // (lastContactDate updated -> re-evaluation will create new alert with new targetDate)
      // For other SLA types, we keep the alert visible with "acknowledged" badge
      if (alert.slaType === 'follow-up') {
        const nextEntries = { ...currentIndex.entries };
        const entry = nextEntries[customerId];
        if (entry) {
          entry.alerts = entry.alerts.filter(a => !(a.slaType === alert.slaType && a.targetDate === alert.targetDate));
        }

        const nextIndex = {
          ...currentIndex,
          entries: nextEntries,
          followUpAlerts: currentIndex.followUpAlerts.filter(a => !(a.systemId === customerId && a.slaType === alert.slaType && a.targetDate === alert.targetDate)),
        };

        const nextSummary = summarizeIndex(nextIndex);
        set({ index: nextIndex, summary: nextSummary });
      } else {
        // For re-engagement, debt-payment - just trigger a re-render
        // Alert stays visible with "acknowledged" badge
        // Create new summary object to ensure reference change
        const newSummary = { ...summarizeIndex(currentIndex), _lastAckAt: now.toISOString() };
        set({ summary: newSummary });
      }
    },

    snooze(customerId, alert, days, notes) {
      get().acknowledge(customerId, alert, {
        actionType: 'snoozed',
        snoozeDays: days,
        notes: notes || `Tạm ẩn ${days} ngày`,
      });
    },

    getAck(customerId, slaType) {
      return getAcknowledgement(customerId, slaType);
    },

    isSnoozed(customerId, slaType) {
      return isAlertSnoozed(customerId, slaType);
    },

    getSnoozeRemaining(customerId, slaType) {
      return getSnoozeRemaining(customerId, slaType);
    },
  };
});
