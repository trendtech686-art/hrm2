import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  PayrollBatch,
  PayrollBatchStatus,
  PayrollAuditLog,
  PayrollAuditAction,
  Payslip,
  PayrollComponentEntry,
  PayrollTotals,
  PayrollPeriod,
} from '../../lib/payroll-types.ts';
import { generateSystemId, findNextAvailableBusinessId } from '../../lib/id-utils.ts';
import { getPrefix, type EntityType } from '../../lib/smart-prefix.ts';
import { getCurrentUserSystemId } from '../../contexts/auth-context.tsx';
import { useAttendanceStore } from '../attendance/store.ts';
import { asBusinessId, asSystemId, type BusinessId, type SystemId } from '../../lib/id-types.ts';

const AUDIT_ACTION_FOR_STATUS: Record<PayrollBatchStatus, PayrollAuditAction> = {
  draft: 'run',
  reviewed: 'review',
  locked: 'lock',
};

const resolveActorSystemId = () => asSystemId(getCurrentUserSystemId() || 'SYSTEM00000000');

type CounterState = {
  systemId: number;
  businessId: number;
};

type CounterMap = {
  payroll: CounterState;
  payslips: CounterState;
  'payroll-audit-log': CounterState;
};

type CreateBatchInput = {
  title: string;
  templateSystemId?: SystemId;
  payPeriod: PayrollPeriod;
  payrollDate: string;
  referenceAttendanceMonthKeys?: string[];
  notes?: string;
};

type CreatePayslipInput = {
  employeeSystemId: SystemId;
  employeeId: BusinessId;
  departmentSystemId?: SystemId;
  periodMonthKey: string;
  components: PayrollComponentEntry[];
  totals: PayrollTotals;
  attendanceSnapshotSystemId?: SystemId;
};

export type GeneratedPayslipPayload = {
  employeeSystemId: SystemId;
  employeeId: BusinessId;
  departmentSystemId?: SystemId;
  periodMonthKey: string;
  components: PayrollComponentEntry[];
  totals: PayrollTotals;
  attendanceSnapshotSystemId?: SystemId;
};

type LogActionInput = {
  batchSystemId: SystemId;
  action: PayrollAuditAction;
  payload?: Record<string, unknown>;
  actorSystemId?: SystemId;
  actorDisplayName?: string;
};

type PayrollBatchStoreState = {
  batches: PayrollBatch[];
  payslips: Payslip[];
  auditLogs: PayrollAuditLog[];
  counters: CounterMap;
  createBatch: (input: CreateBatchInput) => PayrollBatch;
  createBatchWithResults: (input: CreateBatchInput, payslips: GeneratedPayslipPayload[]) => PayrollBatch;
  updateBatchStatus: (systemId: SystemId, status: PayrollBatchStatus, note?: string) => void;
  addPayslips: (batchSystemId: SystemId, inputs: CreatePayslipInput[]) => void;
  logAction: (input: LogActionInput) => PayrollAuditLog;
  getBatchBySystemId: (systemId: SystemId) => PayrollBatch | undefined;
  getPayslipsByBatch: (batchSystemId: SystemId) => Payslip[];
};

const initialCounters: CounterMap = {
  payroll: { systemId: 0, businessId: 0 },
  payslips: { systemId: 0, businessId: 0 },
  'payroll-audit-log': { systemId: 0, businessId: 0 },
};

const collectBusinessIds = (items: { id: string }[]) =>
  items.map((item) => item.id?.toUpperCase()).filter((id): id is string => Boolean(id));

const buildDualIds = (
  entityType: EntityType,
  counter: CounterState,
  existingIds: string[]
) => {
  const nextSystemCounter = counter.systemId + 1;
  const systemId = asSystemId(generateSystemId(entityType, nextSystemCounter));
  const { nextId, updatedCounter } = findNextAvailableBusinessId(
    getPrefix(entityType),
    existingIds,
    counter.businessId
  );

  return {
    systemId,
    id: asBusinessId(nextId),
    counter: {
      systemId: nextSystemCounter,
      businessId: updatedCounter,
    },
  };
};

export const usePayrollBatchStore = create<PayrollBatchStoreState>()(
  persist(
    (set, get) => ({
      batches: [],
      payslips: [],
      auditLogs: [],
      counters: initialCounters,
      getBatchBySystemId: (systemId) => get().batches.find((batch) => batch.systemId === systemId),
      getPayslipsByBatch: (batchSystemId) => get().payslips.filter((payslip) => payslip.batchSystemId === batchSystemId),
      createBatch: (input) => {
        set((state) => {
          const actor = resolveActorSystemId();
          const now = new Date().toISOString();
          const dualIds = buildDualIds('payroll', state.counters.payroll, collectBusinessIds(state.batches));
          const batch: PayrollBatch = {
            systemId: dualIds.systemId,
            id: dualIds.id,
            title: input.title,
            status: 'draft',
            templateSystemId: input.templateSystemId,
            payPeriod: input.payPeriod,
            payrollDate: input.payrollDate,
            referenceAttendanceMonthKeys:
              input.referenceAttendanceMonthKeys?.length
                ? input.referenceAttendanceMonthKeys
                : [input.payPeriod.monthKey],
            payslipSystemIds: [],
            totalGross: 0,
            totalNet: 0,
            notes: input.notes,
            createdAt: now,
            updatedAt: now,
            createdBy: actor,
            updatedBy: actor,
          };

          const countersAfterBatch: CounterMap = {
            ...state.counters,
            payroll: dualIds.counter,
          };

          const auditResult = createAuditLogEntry({
            batchSystemId: batch.systemId,
            action: 'run',
            payload: { title: batch.title },
            actorSystemId: actor,
          })({ ...state, counters: countersAfterBatch });

          return {
            ...state,
            batches: [...state.batches, batch],
            auditLogs: auditResult.auditLogs,
            counters: auditResult.counters,
          };
        });

        const createdBatch = get().batches.at(-1);
        if (!createdBatch) {
          throw new Error('Không thể tạo batch lương mới.');
        }
        return createdBatch;
      },
      createBatchWithResults: (input, generatedPayslips) => {
        const batch = get().createBatch(input);
        if (generatedPayslips.length) {
          get().addPayslips(
            batch.systemId,
            generatedPayslips.map((payload) => ({
              employeeSystemId: payload.employeeSystemId,
              employeeId: payload.employeeId,
              departmentSystemId: payload.departmentSystemId,
              periodMonthKey: payload.periodMonthKey,
              components: payload.components,
              totals: payload.totals,
              attendanceSnapshotSystemId: payload.attendanceSnapshotSystemId,
            }))
          );
        }
        return get().getBatchBySystemId(batch.systemId) ?? batch;
      },
      updateBatchStatus: (systemId, status, note) => {
        const actor = resolveActorSystemId();
        const now = new Date().toISOString();
        let monthsToLock: string[] = [];
        set((state) => {
          const batches = state.batches.map((batch) => {
            if (batch.systemId !== systemId) return batch;
            if (status === 'locked') {
              monthsToLock = batch.referenceAttendanceMonthKeys;
            }
            return {
              ...batch,
              status,
              reviewedAt: status === 'reviewed' ? now : batch.reviewedAt,
              reviewedBy: status === 'reviewed' ? actor : batch.reviewedBy,
              lockedAt: status === 'locked' ? now : batch.lockedAt,
              lockedBy: status === 'locked' ? actor : batch.lockedBy,
              updatedAt: now,
              updatedBy: actor,
              notes: note ?? batch.notes,
            };
          });

          const { auditLogs, counters } = createAuditLogEntry({
            batchSystemId: systemId,
            action: AUDIT_ACTION_FOR_STATUS[status],
            payload: note ? { note } : undefined,
            actorSystemId: actor,
          })(state);

          return {
            ...state,
            batches,
            auditLogs,
            counters,
          };
        });

        if (status === 'locked' && monthsToLock.length) {
          const attendanceStore = useAttendanceStore.getState();
          monthsToLock.forEach((monthKey) => attendanceStore.lockMonth(monthKey));
        }
      },
      addPayslips: (batchSystemId, inputs) => {
        if (!inputs.length) return;
        set((state) => {
          const actor = resolveActorSystemId();
          const now = new Date().toISOString();
          const batch = state.batches.find((b) => b.systemId === batchSystemId);
          if (!batch) {
            throw new Error('Không tìm thấy batch lương.');
          }

          let nextCounters = { ...state.counters };
          const existingPayslipIds = collectBusinessIds(state.payslips);
          const newPayslips: Payslip[] = inputs.map((payload) => {
            const ids = buildDualIds('payslips', nextCounters.payslips, existingPayslipIds);
            nextCounters = { ...nextCounters, payslips: ids.counter };
            existingPayslipIds.push(ids.id);
            return {
              systemId: ids.systemId,
              id: ids.id,
              batchSystemId,
              employeeSystemId: payload.employeeSystemId,
              employeeId: payload.employeeId,
              departmentSystemId: payload.departmentSystemId,
              periodMonthKey: payload.periodMonthKey,
              attendanceSnapshotSystemId: payload.attendanceSnapshotSystemId,
              components: payload.components,
              totals: payload.totals,
              createdAt: now,
              updatedAt: now,
              createdBy: actor,
              updatedBy: actor,
            };
          });

          const payslips = [...state.payslips, ...newPayslips];
          const payslipSystemIds = [...new Set([...batch.payslipSystemIds, ...newPayslips.map((p) => p.systemId)])];
          const batchPayslips = payslips.filter((slip) => payslipSystemIds.includes(slip.systemId));
          const totalGross = batchPayslips.reduce((sum, slip) => sum + slip.totals.earnings, 0);
          const totalNet = batchPayslips.reduce((sum, slip) => sum + slip.totals.netPay, 0);

          const batches = state.batches.map((b) =>
            b.systemId === batchSystemId
              ? {
                  ...b,
                  payslipSystemIds,
                  totalGross,
                  totalNet,
                  updatedAt: now,
                  updatedBy: actor,
                }
              : b
          );

          const { auditLogs, counters } = createAuditLogEntry({
            batchSystemId,
            action: 'recalculate',
            payload: { added: newPayslips.length },
            actorSystemId: actor,
          })({ ...state, counters: nextCounters });

          return {
            ...state,
            batches,
            payslips,
            auditLogs,
            counters,
          };
        });
      },
      logAction: (input) => {
        let createdLog: PayrollAuditLog | undefined;
        set((state) => {
          const { auditLogs, counters } = createAuditLogEntry(input)(state);
          createdLog = auditLogs[auditLogs.length - 1];
          return {
            ...state,
            auditLogs,
            counters,
          };
        });
        if (!createdLog) {
          throw new Error('Không thể ghi nhật ký payroll.');
        }
        return createdLog;
      },
    }),
    {
      name: 'hrm-payroll-batch-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      migrate: (persistedState) => {
        if (!persistedState) {
          return {
            batches: [],
            payslips: [],
            auditLogs: [],
            counters: initialCounters,
          } satisfies Partial<PayrollBatchStoreState>;
        }
        const state = persistedState as Partial<PayrollBatchStoreState>;
        return {
          batches: state.batches ?? [],
          payslips: state.payslips ?? [],
          auditLogs: state.auditLogs ?? [],
          counters: {
            ...initialCounters,
            ...(state.counters ?? {}),
          },
        } satisfies Partial<PayrollBatchStoreState>;
      },
    }
  )
);

const createAuditLogEntry = (input: LogActionInput) => (state: PayrollBatchStoreState) => {
  const actor = input.actorSystemId ?? resolveActorSystemId();
  const now = new Date().toISOString();
  const ids = buildDualIds(
    'payroll-audit-log',
    state.counters['payroll-audit-log'],
    collectBusinessIds(state.auditLogs)
  );

  const entry: PayrollAuditLog = {
    systemId: ids.systemId,
    id: ids.id,
    batchSystemId: input.batchSystemId,
    action: input.action,
    actorSystemId: actor ?? asSystemId('SYSTEM00000000'),
    actorDisplayName: input.actorDisplayName,
    payload: input.payload,
    createdAt: now,
  };

  return {
    auditLogs: [...state.auditLogs, entry],
    counters: {
      ...state.counters,
      'payroll-audit-log': ids.counter,
    },
  };
};
