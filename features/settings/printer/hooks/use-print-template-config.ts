/**
 * Print Template Config - React Query Hook
 * 
 * Replaces usePrintTemplateStore (Zustand + localStorage) with server-backed
 * React Query. Data is fetched from `/api/settings/print-template-config`
 * and cached client-side with optimistic updates for instant UX.
 * 
 * Provides the SAME interface as the old Zustand store:
 * - getTemplate(type, size, branchId?)
 * - getDefaultSize(type)
 * - updateTemplate(type, size, content, branchId?)
 * - updateTemplateAllBranches(type, size, content)
 * - resetTemplate(type, size, branchId?)
 * - setDefaultSize(type, size)
 */

import { useCallback, useMemo, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PrintTemplate, PrintMargins, TemplateType, PaperSize } from '../types';
import { getDefaultTemplate } from '../default-templates';
import { logError } from '@/lib/logger';

// ── API client ──────────────────────────────────────────────────────────
const API_URL = '/api/settings/print-template-config';

export interface PrintTemplateConfigData {
  templates: Record<string, PrintTemplate>;
  defaultSizes: Record<string, string>; // TemplateType -> PaperSize
}

async function fetchConfig(): Promise<PrintTemplateConfigData> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch print template config');
  const json = await res.json();
  // Handle both { data: { templates, defaultSizes } } and { templates, defaultSizes }
  const raw = json.data ?? json;
  return {
    templates: raw?.templates || {},
    defaultSizes: raw?.defaultSizes || {},
  };
}

async function saveConfig(data: PrintTemplateConfigData): Promise<PrintTemplateConfigData> {
  const res = await fetch(API_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save print template config');
  const json = await res.json();
  // Handle both { data: { templates, defaultSizes } } and { templates, defaultSizes }
  return json.data || json || data;
}

// ── Query key ───────────────────────────────────────────────────────────
export const printTemplateConfigKey = ['print-template-config'] as const;

// ── Helper ──────────────────────────────────────────────────────────────
function getTemplateKey(type: TemplateType, size: PaperSize, branchId?: string): string {
  return branchId ? `${type}-${size}-${branchId}` : `${type}-${size}`;
}

/** Detect stale payroll templates with old syntax → fallback to default */
function needsAutoReset(type: TemplateType, content: string): boolean {
  if (type !== 'payroll' && type !== 'payslip') return false;
  return content.includes('{{#line_items}}') || content.includes('{line_index}');
}

function resolveTemplate(
  templates: Record<string, PrintTemplate>,
  type: TemplateType,
  size: PaperSize,
  branchId?: string,
): PrintTemplate {
  const key = getTemplateKey(type, size, branchId);

  // 1) Try branch-specific template
  const branchTpl = templates[key];
  if (branchTpl?.content?.trim()) {
    if (needsAutoReset(type, branchTpl.content)) {
      return makeDefault(type, size, key);
    }
    return branchTpl;
  }

  // 2) Try general (no-branch) template
  if (branchId) {
    const generalKey = getTemplateKey(type, size);
    const generalTpl = templates[generalKey];
    if (generalTpl?.content?.trim()) {
      if (needsAutoReset(type, generalTpl.content)) {
        return makeDefault(type, size, key);
      }
      return generalTpl;
    }
  }

  // 3) Try any other saved template for this type (different size)
  //    e.g. user saved product-label-A4 but we're requesting product-label-50x30
  const prefix = `${type}-`;
  const fallbackEntry = Object.entries(templates).find(
    ([k, tpl]) => k.startsWith(prefix) && tpl?.content?.trim() && !needsAutoReset(type, tpl.content),
  );
  if (fallbackEntry) {
    const [, fallbackTpl] = fallbackEntry;
    return { ...fallbackTpl, paperSize: size };
  }

  // 4) Fallback to hardcoded default
  return makeDefault(type, size, key);
}

function makeDefault(type: TemplateType, size: PaperSize, key: string): PrintTemplate {
  return {
    id: `template-${key}`,
    type,
    name: type === 'order' ? 'Mẫu hóa đơn bán hàng' : 'Mẫu in',
    content: getDefaultTemplate(type),
    paperSize: size,
    isActive: true,
    updatedAt: new Date().toISOString(),
  };
}

// ── Migrate from old localStorage Zustand store ─────────────────────────
const LS_KEY = 'print-template-store';
const MIGRATED_FLAG = 'print-template-config-migrated';

function readLocalStorageData(): PrintTemplateConfigData | null {
  try {
    if (typeof window === 'undefined') return null;
    if (localStorage.getItem(MIGRATED_FLAG)) return null;

    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    const state = parsed?.state;
    if (!state?.templates || Object.keys(state.templates).length === 0) return null;

    return {
      templates: state.templates,
      defaultSizes: state.defaultSizes || {},
    };
  } catch {
    return null;
  }
}

// ── Main hook ───────────────────────────────────────────────────────────
export function usePrintTemplateConfig(options?: { enabled?: boolean }) {
  const queryClient = useQueryClient();
  const migrationDone = useRef(false);
  const enabled = options?.enabled !== false;

  const { data, isLoading } = useQuery({
    queryKey: printTemplateConfigKey,
    queryFn: fetchConfig,
    staleTime: 1000 * 60 * 30,  // 30 min
    gcTime: 1000 * 60 * 60,     // 1 hour
    enabled,
  });

  // One-time migration from localStorage → server
  useEffect(() => {
    if (migrationDone.current || isLoading) return;
    migrationDone.current = true;

    const localData = readLocalStorageData();
    if (!localData) return;

    // Server has no data yet → push localStorage data
    const serverEmpty =
      !data?.templates || Object.keys(data.templates).length === 0;

    if (serverEmpty) {
      saveConfig(localData)
        .then(() => {
          localStorage.setItem(MIGRATED_FLAG, '1');
          localStorage.removeItem(LS_KEY);
          queryClient.setQueryData(printTemplateConfigKey, localData);
        })
        .catch((err) => logError('[PrintTemplateConfig] migration failed', err));
    } else {
      // Server already has data → skip, mark migrated
      localStorage.setItem(MIGRATED_FLAG, '1');
      localStorage.removeItem(LS_KEY);
    }
  }, [data, isLoading, queryClient]);

  // ── Current snapshot (never undefined – fallback to stable empty) ──
  const EMPTY_CONFIG: PrintTemplateConfigData = useMemo(
    () => ({ templates: {}, defaultSizes: {} }),
    [],
  );
  const current = data || EMPTY_CONFIG;

  // Stable references for dependency arrays
  const templates = current.templates;
  const defaultSizes = current.defaultSizes;

  // ── Optimistic mutation helper ──
  const saveMutation = useMutation({
    mutationFn: saveConfig,
    // NOTE: Do NOT invalidateQueries here. The optimistic update in applyUpdate
    // already sets the cache to the correct value. Invalidating triggers a
    // refetch → new `data` → new `templates` ref → `getTemplate` recreated →
    // the content-loading useEffect in print-templates-page re-fires and
    // OVERWRITES the editor with the refetched data (bug: barcode reappears).
  });

  /** Optimistically update cache, then persist to server. Returns a Promise. */
  const applyUpdate = useCallback(
    (updater: (prev: PrintTemplateConfigData) => PrintTemplateConfigData): Promise<void> => {
      const prev = queryClient.getQueryData<PrintTemplateConfigData>(printTemplateConfigKey)
        || { templates: {}, defaultSizes: {} };
      const next = updater(prev);
      // Optimistic update
      queryClient.setQueryData(printTemplateConfigKey, next);

      return new Promise<void>((resolve, reject) => {
        saveMutation.mutate(next, {
          onSuccess: () => resolve(),
          onError: (err) => {
            // Rollback optimistic cache
            queryClient.setQueryData(printTemplateConfigKey, prev);
            logError('[PrintTemplateConfig] Save failed', err);
            reject(err);
          },
        });
      });
    },
    [queryClient, saveMutation],
  );

  // ── READ ──────────────────────────────────────────────────────────────

  const getTemplate = useCallback(
    (type: TemplateType, size: PaperSize, branchId?: string): PrintTemplate => {
      return resolveTemplate(templates, type, size, branchId);
    },
    [templates],
  );

  const getDefaultSize = useCallback(
    (type: TemplateType): PaperSize => {
      const saved = defaultSizes[type] as PaperSize | undefined;
      if (saved) return saved;
      // Label types default to 50x30mm (HPRT N41), everything else to A4
      return (type === 'product-label' || type === 'customer-mark-label') ? '50x30' : 'A4';
    },
    [defaultSizes],
  );

  // ── WRITE ─────────────────────────────────────────────────────────────

  const updateTemplate = useCallback(
    (type: TemplateType, size: PaperSize, content: string, branchId?: string, margins?: PrintMargins): Promise<void> => {
      return applyUpdate((prev) => {
        const key = getTemplateKey(type, size, branchId);
        const existing = prev.templates[key];
        return {
          ...prev,
          templates: {
            ...prev.templates,
            [key]: {
              id: existing?.id || `template-${key}`,
              type,
              name: existing?.name || 'Mẫu in',
              content,
              paperSize: size,
              margins: margins ?? existing?.margins,
              isActive: true,
              updatedAt: new Date().toISOString(),
            },
          },
        };
      });
    },
    [applyUpdate],
  );

  const updateTemplateAllBranches = useCallback(
    (type: TemplateType, size: PaperSize, content: string, margins?: PrintMargins): Promise<void> => {
      return applyUpdate((prev) => {
        const key = getTemplateKey(type, size);
        const newTemplates = { ...prev.templates };
        // Remove all branch-specific entries for this type+size
        Object.keys(newTemplates).forEach((k) => {
          if (k.startsWith(`${type}-${size}-`)) {
            delete newTemplates[k];
          }
        });
        newTemplates[key] = {
          id: `template-${key}`,
          type,
          name: 'Mẫu in',
          content,
          paperSize: size,
          margins,
          isActive: true,
          updatedAt: new Date().toISOString(),
        };
        return { ...prev, templates: newTemplates };
      });
    },
    [applyUpdate],
  );

  const resetTemplate = useCallback(
    (type: TemplateType, size: PaperSize, branchId?: string): Promise<void> => {
      return applyUpdate((prev) => {
        const key = getTemplateKey(type, size, branchId);
        return {
          ...prev,
          templates: {
            ...prev.templates,
            [key]: {
              id: `template-${key}`,
              type,
              name: 'Mẫu mặc định',
              content: getDefaultTemplate(type),
              paperSize: size,
              isActive: true,
              updatedAt: new Date().toISOString(),
            },
          },
        };
      });
    },
    [applyUpdate],
  );

  const setDefaultSize = useCallback(
    (type: TemplateType, size: PaperSize): Promise<void> => {
      return applyUpdate((prev) => ({
        ...prev,
        defaultSizes: { ...prev.defaultSizes, [type]: size },
      }));
    },
    [applyUpdate],
  );

  return {
    getTemplate,
    getDefaultSize,
    updateTemplate,
    updateTemplateAllBranches,
    resetTemplate,
    setDefaultSize,
    isLoading,
    /** Raw data – rarely needed outside this hook */
    _data: current,
  };
}

// ── Static accessor for non-hook contexts (print-service.ts) ────────────
// Uses the QueryClient singleton from the providers

let _queryClientRef: ReturnType<typeof useQueryClient> | null = null;

/** Must be called from a component to capture the QueryClient reference */
export function useCaptureQueryClient() {
  const qc = useQueryClient();
  _queryClientRef = qc;
}

/**
 * Synchronous accessor for use outside React (print-service.ts).
 * Reads from the React Query cache. Falls back to default templates
 * if cache is empty (data not yet fetched).
 */
export function getPrintTemplateConfigSync(): {
  getTemplate: (type: TemplateType, size: PaperSize, branchId?: string) => PrintTemplate;
  getDefaultSize: (type: TemplateType) => PaperSize;
} {
  const cached = _queryClientRef?.getQueryData<PrintTemplateConfigData>(printTemplateConfigKey);
  const templates = cached?.templates || {};
  const defaultSizes = cached?.defaultSizes || {};

  return {
    getTemplate: (type, size, branchId?) => resolveTemplate(templates, type, size, branchId),
    getDefaultSize: (type) => {
      const saved = defaultSizes[type] as PaperSize | undefined;
      if (saved) return saved;
      return (type === 'product-label' || type === 'customer-mark-label') ? '50x30' : 'A4';
    },
  };
}
