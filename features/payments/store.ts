import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Payment } from './types.ts';
import { data as initialData } from './data.ts';
import {
  extractCounterFromBusinessId,
  findNextAvailableBusinessId,
  generateSystemId,
  getMaxBusinessIdCounter,
  getMaxSystemIdCounter,
  type EntityType,
} from '../../lib/id-utils.ts';
import { asBusinessId, asSystemId, type BusinessId, type SystemId } from '../../lib/id-types.ts';

export type PaymentInput = Omit<Payment, 'systemId' | 'id'> & { id?: BusinessId | string };

interface PaymentStore {
  data: Payment[];
  businessIdCounter: number;
  systemIdCounter: number;
  add: (item: PaymentInput) => Payment;
  addMultiple: (items: PaymentInput[]) => void;
  update: (systemId: SystemId, item: Payment) => void;
  remove: (systemId: SystemId) => void;
  findById: (systemId: SystemId) => Payment | undefined;
  getActive: () => Payment[];
  cancel: (systemId: SystemId) => void;
}

const PAYMENT_ENTITY: EntityType = 'payments';
const SYSTEM_ID_PREFIX = 'PAYMENT';
const BUSINESS_ID_PREFIX = 'PC';
const BUSINESS_ID_DIGITS = 6;
const PURCHASE_ORDER_SYSTEM_PREFIX = 'PURCHASE';
const PURCHASE_ORDER_BUSINESS_PREFIX = 'PO';

const normalizePaymentStatus = (status?: Payment['status']): Payment['status'] =>
  status === 'cancelled' ? 'cancelled' : 'completed';

const normalizePayment = (payment: Payment): Payment => ({
  ...payment,
  status: normalizePaymentStatus(payment.status),
});

const initialPayments = initialData.map(normalizePayment);

let systemIdCounter = getMaxSystemIdCounter(initialPayments, SYSTEM_ID_PREFIX);
let businessIdCounter = getMaxBusinessIdCounter(initialPayments, BUSINESS_ID_PREFIX);

const getNextSystemId = (): SystemId => {
  systemIdCounter += 1;
  return asSystemId(generateSystemId(PAYMENT_ENTITY, systemIdCounter));
};

const ensurePaymentBusinessId = (payments: Payment[], provided?: BusinessId | string): BusinessId => {
  if (provided && `${provided}`.trim().length > 0) {
    const normalized = `${provided}`.trim().toUpperCase();
    const parsedCounter = extractCounterFromBusinessId(normalized, BUSINESS_ID_PREFIX);
    if (parsedCounter > businessIdCounter) {
      businessIdCounter = parsedCounter;
    }
    return asBusinessId(normalized);
  }

  const existingIds = payments.map(payment => payment.id as string).filter(Boolean);
  const { nextId, updatedCounter } = findNextAvailableBusinessId(
    BUSINESS_ID_PREFIX,
    existingIds,
    businessIdCounter,
    BUSINESS_ID_DIGITS
  );
  businessIdCounter = updatedCounter;
  return asBusinessId(nextId);
};

const reconcileLinkedDocuments = (payment: Payment): Payment => {
  if (!payment.originalDocumentId) {
    return payment;
  }

  const normalizedDocId = payment.originalDocumentId.toUpperCase();
  const nextPayment = { ...payment };

  if (!nextPayment.purchaseOrderSystemId && normalizedDocId.startsWith(PURCHASE_ORDER_SYSTEM_PREFIX)) {
    nextPayment.purchaseOrderSystemId = asSystemId(payment.originalDocumentId);
  }

  if (!nextPayment.purchaseOrderId && normalizedDocId.startsWith(PURCHASE_ORDER_BUSINESS_PREFIX)) {
    nextPayment.purchaseOrderId = asBusinessId(payment.originalDocumentId);
  }

  return nextPayment;
};

const buildPayment = (input: PaymentInput, existingPayments: Payment[]): Payment => {
  const systemId = getNextSystemId();
  const id = ensurePaymentBusinessId(existingPayments, input.id);
  const basePayment: Payment = {
    ...input,
    systemId,
    id,
    createdAt: input.createdAt || new Date().toISOString(),
    status: normalizePaymentStatus(input.status),
  };

  return reconcileLinkedDocuments(basePayment);
};

export const usePaymentStore = create<PaymentStore>()(
  persist(
    (set, get) => ({
      data: initialPayments,
      businessIdCounter,
      systemIdCounter,
      add: (item) => {
        let createdPayment: Payment | null = null;
        set(state => {
          const newPayment = buildPayment(item, state.data);
          createdPayment = newPayment;
          return {
            data: [...state.data, newPayment],
            businessIdCounter,
            systemIdCounter,
          };
        });
        return createdPayment!;
      },
      addMultiple: (items) => {
        set(state => {
          const created: Payment[] = [];

          items.forEach(item => {
            const context = [...state.data, ...created];
            const payment = buildPayment(item, context);
            created.push(payment);
          });

          return {
            data: [...state.data, ...created],
            businessIdCounter,
            systemIdCounter,
          };
        });
      },
      update: (systemId, item) => {
        set(state => ({
          data: state.data.map(payment =>
            payment.systemId === systemId
              ? reconcileLinkedDocuments({
                  ...item,
                  systemId,
                  status: normalizePaymentStatus(item.status),
                  updatedAt: new Date().toISOString(),
                })
              : payment
          ),
          businessIdCounter,
          systemIdCounter,
        }));
      },
      remove: (systemId) => {
        set(state => ({
          data: state.data.filter(payment => payment.systemId !== systemId),
          businessIdCounter,
          systemIdCounter,
        }));
      },
      findById: (systemId) => {
        return get().data.find(payment => payment.systemId === systemId);
      },
      getActive: () => {
        return get().data.filter(payment => payment.status !== 'cancelled');
      },
      cancel: (systemId) => {
        const payment = get().findById(systemId);
        if (payment) {
          get().update(systemId, {
            ...payment,
            status: 'cancelled',
            cancelledAt: new Date().toISOString(),
          });
        }
      },
    }),
    {
      name: 'payment-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.data) {
          const normalized = state.data.map(normalizePayment);
          const nextSystemCounter = getMaxSystemIdCounter(normalized, SYSTEM_ID_PREFIX);
          const nextBusinessCounter = getMaxBusinessIdCounter(normalized, BUSINESS_ID_PREFIX);
          systemIdCounter = nextSystemCounter;
          businessIdCounter = nextBusinessCounter;

          state.data = normalized;
          state.systemIdCounter = systemIdCounter;
          state.businessIdCounter = businessIdCounter;
        }
      },
    }
  )
);
