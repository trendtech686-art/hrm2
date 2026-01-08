/**
 * @deprecated Use React Query hooks instead:
 * - `useAuditLogs()` for list
 * 
 * Import from: `@/features/audit-log/hooks/use-audit-log`
 * 
 * This store will be removed in a future version.
 */
import { create } from 'zustand';
import type { LogEntry } from '@/lib/types/prisma-extended';
import { parseDate, getCurrentDate, getDaysDiff } from '@/lib/date-utils';

type AuditLogState = {
  logs: LogEntry[];
  addLog: (log: Omit<LogEntry, 'systemId' | 'id' | 'timestamp'>) => void;
  getLogsForEntity: (entityId: string) => LogEntry[];
};

export const useAuditLogStore = create<AuditLogState>()(
    (set, get) => ({
      logs: [],
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
    })
);
