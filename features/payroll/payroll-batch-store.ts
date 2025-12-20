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
} from '../../lib/payroll-types';
import { generateSystemId, findNextAvailableBusinessId } from '../../lib/id-utils';
import { getPrefix, type EntityType } from '../../lib/smart-prefix';
import { getCurrentUserSystemId } from '../../contexts/auth-context';
import { useAttendanceStore } from '../attendance/store';
import { asBusinessId, asSystemId, type BusinessId, type SystemId } from '../../lib/id-types';

// Type for payslip updates
export type PayslipUpdatePayload = {
  components?: PayrollComponentEntry[];
  totals?: PayrollTotals;
};

const AUDIT_ACTION_FOR_STATUS: Record<PayrollBatchStatus, PayrollAuditAction> = {
  draft: 'run',
  reviewed: 'review',
  locked: 'lock',
  cancelled: 'run', // cancelled uses same action as draft
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
  templateSystemId?: SystemId | undefined;
  payPeriod: PayrollPeriod;
  payrollDate: string;
  referenceAttendanceMonthKeys?: string[] | undefined;
  notes?: string | undefined;
};

type CreatePayslipInput = {
  employeeSystemId: SystemId;
  employeeId: BusinessId;
  departmentSystemId?: SystemId | undefined;
  periodMonthKey: string;
  components: PayrollComponentEntry[];
  totals: PayrollTotals;
  attendanceSnapshotSystemId?: SystemId | undefined;
  deductedPenaltySystemIds?: SystemId[] | undefined;
};

export type GeneratedPayslipPayload = {
  employeeSystemId: SystemId;
  employeeId: BusinessId;
  departmentSystemId?: SystemId | undefined;
  periodMonthKey: string;
  components: PayrollComponentEntry[];
  totals: PayrollTotals;
  attendanceSnapshotSystemId?: SystemId | undefined;
  deductedPenaltySystemIds?: SystemId[] | undefined;
};

type LogActionInput = {
  batchSystemId: SystemId;
  action: PayrollAuditAction;
  payload?: Record<string, unknown> | undefined;
  actorSystemId?: SystemId | undefined;
  actorDisplayName?: string | undefined;
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
  updatePayslip: (payslipSystemId: SystemId, updates: PayslipUpdatePayload) => { success: boolean; error?: string };
  removePayslipFromBatch: (payslipSystemId: SystemId) => { success: boolean; error?: string };
  cancelBatch: (systemId: SystemId, reason?: string) => { success: boolean; error?: string };
  logAction: (input: LogActionInput) => PayrollAuditLog;
  getBatchBySystemId: (systemId: SystemId) => PayrollBatch | undefined;
  getPayslipsByBatch: (batchSystemId: SystemId) => Payslip[];
  getPayslipBySystemId: (systemId: SystemId) => Payslip | undefined;
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
      getPayslipBySystemId: (systemId) => get().payslips.find((payslip) => payslip.systemId === systemId),
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
              deductedPenaltySystemIds: payload.deductedPenaltySystemIds,
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
              deductedPenaltySystemIds: payload.deductedPenaltySystemIds,
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
      updatePayslip: (payslipSystemId, updates) => {
        const state = get();
        const payslip = state.payslips.find((p) => p.systemId === payslipSystemId);
        
        if (!payslip) {
          return { success: false, error: 'Không tìm thấy phiếu lương.' };
        }

        const batch = state.batches.find((b) => b.systemId === payslip.batchSystemId);
        if (!batch) {
          return { success: false, error: 'Không tìm thấy bảng lương.' };
        }

        if (batch.status === 'locked') {
          return { success: false, error: 'Bảng lương đã khóa, không thể sửa.' };
        }

        const actor = resolveActorSystemId();
        const now = new Date().toISOString();

        set((state) => {
          // Update the payslip
          const updatedPayslips = state.payslips.map((p) =>
            p.systemId === payslipSystemId
              ? {
                  ...p,
                  components: updates.components ?? p.components,
                  totals: updates.totals ?? p.totals,
                  updatedAt: now,
                  updatedBy: actor,
                }
              : p
          );

          // Recalculate batch totals
          const batchPayslipIds = batch.payslipSystemIds;
          const batchPayslips = updatedPayslips.filter((p) => batchPayslipIds.includes(p.systemId));
          const totalGross = batchPayslips.reduce((sum, p) => sum + p.totals.earnings, 0);
          const totalNet = batchPayslips.reduce((sum, p) => sum + p.totals.netPay, 0);

          const updatedBatches = state.batches.map((b) =>
            b.systemId === batch.systemId
              ? { ...b, totalGross, totalNet, updatedAt: now, updatedBy: actor }
              : b
          );

          // Log the action
          const { auditLogs, counters } = createAuditLogEntry({
            batchSystemId: batch.systemId,
            action: 'recalculate',
            payload: { 
              payslipSystemId, 
              employeeId: payslip.employeeId,
              previousNet: payslip.totals.netPay,
              newNet: updates.totals?.netPay ?? payslip.totals.netPay,
            },
            actorSystemId: actor,
          })(state);

          return {
            ...state,
            payslips: updatedPayslips,
            batches: updatedBatches,
            auditLogs,
            counters,
          };
        });

        return { success: true };
      },
      removePayslipFromBatch: (payslipSystemId) => {
        const state = get();
        const payslip = state.payslips.find((p) => p.systemId === payslipSystemId);
        
        if (!payslip) {
          return { success: false, error: 'Không tìm thấy phiếu lương.' };
        }

        const batch = state.batches.find((b) => b.systemId === payslip.batchSystemId);
        if (!batch) {
          return { success: false, error: 'Không tìm thấy bảng lương.' };
        }

        if (batch.status === 'locked') {
          return { success: false, error: 'Bảng lương đã khóa, không thể xóa phiếu lương.' };
        }

        const actor = resolveActorSystemId();
        const now = new Date().toISOString();

        set((state) => {
          // Remove from payslips
          const updatedPayslips = state.payslips.filter((p) => p.systemId !== payslipSystemId);

          // Update batch
          const newPayslipIds = batch.payslipSystemIds.filter((id) => id !== payslipSystemId);
          const batchPayslips = updatedPayslips.filter((p) => newPayslipIds.includes(p.systemId));
          const totalGross = batchPayslips.reduce((sum, p) => sum + p.totals.earnings, 0);
          const totalNet = batchPayslips.reduce((sum, p) => sum + p.totals.netPay, 0);

          const updatedBatches = state.batches.map((b) =>
            b.systemId === batch.systemId
              ? { 
                  ...b, 
                  payslipSystemIds: newPayslipIds,
                  totalGross, 
                  totalNet, 
                  updatedAt: now, 
                  updatedBy: actor 
                }
              : b
          );

          // Log the action
          const { auditLogs, counters } = createAuditLogEntry({
            batchSystemId: batch.systemId,
            action: 'recalculate',
            payload: { 
              removed: payslipSystemId, 
              employeeId: payslip.employeeId,
            },
            actorSystemId: actor,
          })(state);

          return {
            ...state,
            payslips: updatedPayslips,
            batches: updatedBatches,
            auditLogs,
            counters,
          };
        });

        return { success: true };
      },
      cancelBatch: (systemId, reason) => {
        const state = get();
        const batch = state.batches.find((b) => b.systemId === systemId);

        if (!batch) {
          return { success: false, error: 'Không tìm thấy bảng lương.' };
        }

        if (batch.status === 'locked') {
          return { success: false, error: 'Bảng lương đã khóa, không thể hủy.' };
        }

        if (batch.status === 'cancelled') {
          return { success: false, error: 'Bảng lương đã được hủy trước đó.' };
        }

        const actor = resolveActorSystemId();
        const now = new Date().toISOString();

        set((state) => {
          // Update batch status to cancelled
          const updatedBatches = state.batches.map((b) =>
            b.systemId === systemId
              ? {
                  ...b,
                  status: 'cancelled' as const,
                  notes: reason ? `[Hủy] ${reason}` : b.notes,
                  updatedAt: now,
                  updatedBy: actor,
                }
              : b
          );

          // Log the action
          const { auditLogs, counters } = createAuditLogEntry({
            batchSystemId: systemId,
            action: 'recalculate', // Using recalculate as closest action type for cancel
            payload: {
              cancelled: true,
              reason: reason,
              title: batch.title,
              payslipCount: batch.payslipSystemIds.length,
            },
            actorSystemId: actor,
          })(state);

          return {
            ...state,
            batches: updatedBatches,
            auditLogs,
            counters,
          };
        });

        return { success: true };
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
