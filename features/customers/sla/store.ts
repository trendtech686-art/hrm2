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
};

type SlaStore = SlaStoreState & SlaStoreActions;

const getPersistedIndex = (): CustomerSlaIndex | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(SLA_EVALUATION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn('[customer-sla] Failed to load cached index', error);
    return null;
  }
};

const getLastRun = () => {
  if (typeof window === 'undefined') return undefined;
  return window.localStorage.getItem(SLA_LAST_RUN_KEY) || undefined;
};

const persistedIndex = getPersistedIndex();

// Store reference for re-evaluation
let lastCustomers: Customer[] = [];
let lastSettings: CustomerSlaSetting[] = [];

export const useCustomerSlaEngineStore = create<SlaStore>((set, get) => {
  const initialState: SlaStoreState = {
    index: persistedIndex,
    summary: persistedIndex ? summarizeIndex(persistedIndex) : null,
    isLoading: false,
  };
  const initialLastRun = getLastRun();
  if (initialLastRun !== undefined) {
    initialState.lastEvaluatedAt = initialLastRun;
  }

  return {
    ...initialState,

    evaluate(customers, settings) {
      // Store for re-evaluation
      lastCustomers = customers;
      lastSettings = settings;
      
      set({ isLoading: true });
      const nextIndex = buildSlaIndex(customers, settings);
      const nextSummary = summarizeIndex(nextIndex);
      const timestamp = new Date().toISOString();

      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem(SLA_EVALUATION_KEY, JSON.stringify(nextIndex));
          window.localStorage.setItem(SLA_LAST_RUN_KEY, timestamp);
        } catch (error) {
          console.warn('[customer-sla] Failed to cache index', error);
        }
      }

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
      if (freshCustomers.length && lastSettings.length) {
        get().evaluate(freshCustomers, lastSettings);
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
