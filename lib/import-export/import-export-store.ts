/**
 * Import/Export Store
 * 
 * Lưu lịch sử import/export với Zustand persist (localStorage)
 * Khi migrate sang Next.js, sẽ chuyển sang API
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ImportLogEntry, ExportLogEntry } from './types';

const MAX_LOGS = 200;  // Giới hạn để tránh localStorage quá tải

// Generate simple ID
const generateLogId = (prefix: string): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}`;
};

interface ImportExportState {
  importLogs: ImportLogEntry[];
  exportLogs: ExportLogEntry[];
  
  // Actions
  addImportLog: (log: Omit<ImportLogEntry, 'id'>) => string;
  addExportLog: (log: Omit<ExportLogEntry, 'id'>) => string;
  
  // Queries
  getLogsByEntity: (entityType: string) => {
    imports: ImportLogEntry[];
    exports: ExportLogEntry[];
  };
  getRecentLogs: (limit?: number) => Array<(ImportLogEntry | ExportLogEntry) & { _type: 'import' | 'export' }>;
  getImportLogById: (id: string) => ImportLogEntry | undefined;
  getExportLogById: (id: string) => ExportLogEntry | undefined;
  
  // Management
  deleteLog: (id: string, type: 'import' | 'export') => void;
  clearLogs: (entityType?: string) => void;
}

export const useImportExportStore = create<ImportExportState>()(
  persist(
    (set, get) => ({
      importLogs: [],
      exportLogs: [],
      
      addImportLog: (log) => {
        const id = generateLogId('IMP');
        const newLog: ImportLogEntry = { ...log, id };
        
        set((state) => ({
          importLogs: [newLog, ...state.importLogs].slice(0, MAX_LOGS),
        }));
        
        return id;
      },
      
      addExportLog: (log) => {
        const id = generateLogId('EXP');
        const newLog: ExportLogEntry = { ...log, id };
        
        set((state) => ({
          exportLogs: [newLog, ...state.exportLogs].slice(0, MAX_LOGS),
        }));
        
        return id;
      },
      
      getLogsByEntity: (entityType) => ({
        imports: get().importLogs.filter((l) => l.entityType === entityType),
        exports: get().exportLogs.filter((l) => l.entityType === entityType),
      }),
      
      getRecentLogs: (limit = 50) => {
        const all = [
          ...get().importLogs.map((l) => ({ ...l, _type: 'import' as const })),
          ...get().exportLogs.map((l) => ({ ...l, _type: 'export' as const })),
        ];
        return all
          .sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime())
          .slice(0, limit);
      },
      
      getImportLogById: (id) => {
        return get().importLogs.find((l) => l.id === id);
      },
      
      getExportLogById: (id) => {
        return get().exportLogs.find((l) => l.id === id);
      },
      
      deleteLog: (id, type) => {
        if (type === 'import') {
          set((state) => ({
            importLogs: state.importLogs.filter((l) => l.id !== id),
          }));
        } else {
          set((state) => ({
            exportLogs: state.exportLogs.filter((l) => l.id !== id),
          }));
        }
      },
      
      clearLogs: (entityType) => {
        if (entityType) {
          set((state) => ({
            importLogs: state.importLogs.filter((l) => l.entityType !== entityType),
            exportLogs: state.exportLogs.filter((l) => l.entityType !== entityType),
          }));
        } else {
          set({ importLogs: [], exportLogs: [] });
        }
      },
    }),
    {
      name: 'hrm-import-export-logs',
      version: 1,
    }
  )
);

// ============================================
// SELECTORS (for optimization)
// ============================================

export const selectImportLogs = (state: ImportExportState) => state.importLogs;
export const selectExportLogs = (state: ImportExportState) => state.exportLogs;

export const selectImportLogsByEntity = (entityType: string) => (state: ImportExportState) =>
  state.importLogs.filter((l) => l.entityType === entityType);

export const selectExportLogsByEntity = (entityType: string) => (state: ImportExportState) =>
  state.exportLogs.filter((l) => l.entityType === entityType);

// ============================================
// FUTURE: API Service (Next.js migration)
// ============================================
// 
// export async function saveImportLog(log: Omit<ImportLogEntry, 'id'>) {
//   return fetch('/api/import-export/logs', {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({ type: 'import', ...log }),
//   }).then(r => r.json());
// }
// 
// export async function getImportExportLogs(params: {
//   entityType?: string;
//   type?: 'import' | 'export';
//   limit?: number;
// }) {
//   const query = new URLSearchParams(params as Record<string, string>);
//   return fetch(`/api/import-export/logs?${query}`).then(r => r.json());
// }
