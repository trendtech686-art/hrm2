import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { LogEntry } from './types.ts';
import { formatDate, formatDateTime, formatDateTimeSeconds, formatDateCustom, parseDate, getCurrentDate, subtractDays, getDaysDiff } from '@/lib/date-utils';
type AuditLogState = {
  logs: LogEntry[];
  addLog: (log: Omit<LogEntry, 'systemId' | 'id' | 'timestamp'>) => void;
  getLogsForEntity: (entityId: string) => LogEntry[];
};

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number' || isNaN(value)) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const initialLogs: LogEntry[] = [
    {
        systemId: 'LOG00000002',
        id: 'LOG002',
        timestamp: (subtractDays(getCurrentDate(), 7) ?? getCurrentDate()).toISOString(),
        entityType: 'PurchaseOrder',
        entityId: 'PO00000003',
        userId: 'NV00000006',
        userName: 'Vũ Thị Giang',
        action: 'CREATE',
        changes: [{
            field: 'purchaseOrder',
            oldValue: null,
            newValue: 'created',
            description: 'Tạo mới đơn nhập hàng PO000003'
        }]
    },
    {
        systemId: 'LOG00000001',
        id: 'LOG001',
        timestamp: (subtractDays(getCurrentDate(), 3) ?? getCurrentDate()).toISOString(),
        entityType: 'PurchaseOrder',
        entityId: 'PO00000003',
        userId: 'NV00000006',
        userName: 'Vũ Thị Giang',
        action: 'UPDATE',
        changes: [{
            field: 'payment',
            oldValue: 'Chưa thanh toán',
            newValue: 'Thanh toán một phần',
            description: `Thanh toán ${formatCurrency(20000000)} qua Chuyển khoản (PC000002).`
        }]
    }
];

export const useAuditLogStore = create<AuditLogState>()(
  persist(
    (set, get) => ({
      logs: initialLogs,
      addLog: (log) =>
        set((state) => ({
          logs: [
            { 
              ...log, 
              systemId: `LOG${String(state.logs.length + 1).padStart(8, '0')}`,
              id: `LOG${String(state.logs.length + 1).padStart(3, '0')}`,
              timestamp: getCurrentDate().toISOString() 
            },
            ...state.logs,
          ],
        })),
      getLogsForEntity: (entityId: string) =>
        get().logs.filter((log) => log.entityId === entityId).sort((a, b) => getDaysDiff(parseDate(b.timestamp), parseDate(a.timestamp))),
    }),
    {
      name: 'hrm-audit-log-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
