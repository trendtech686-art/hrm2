'use client'

import type { Order } from "@/lib/types/prisma-extended";
import type { SystemId } from "@/lib/id-types";
import { asSystemId } from "@/lib/id-types";
import { useQueryClient } from '@tanstack/react-query';
import { invalidateRelated } from '@/lib/query-invalidation-map';
import * as React from "react";
import { batchImportOrders } from "../api/orders-api";
import { orderKeys } from "./use-orders";
import { logError } from '@/lib/logger'

// ═══════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════

export interface ImportResults {
  success: number;
  failed: number;
  inserted: number;
  updated: number;
  skipped: number;
  errors: Array<{ row: number; message: string }>;
}

// ═══════════════════════════════════════════════════════════════
// Import Handler - Uses batch API for speed
// ═══════════════════════════════════════════════════════════════

async function executeImport(
  data: Partial<Order>[],
  mode: 'insert-only' | 'update-only' | 'upsert',
  _currentEmployeeSystemId: SystemId,
  onProgress?: (percent: number) => void,
): Promise<ImportResults> {
  const results: ImportResults = {
    success: 0,
    failed: 0,
    inserted: 0,
    updated: 0,
    skipped: 0,
    errors: [],
  };

  try {
    // Send orders in chunks to the batch API (server processes them sequentially — no ID race conditions)
    const CHUNK_SIZE = 500;
    const total = data.length;
    const chunks: Partial<Order>[][] = [];
    for (let i = 0; i < total; i += CHUNK_SIZE) {
      chunks.push(data.slice(i, i + CHUNK_SIZE));
    }

    for (let ci = 0; ci < chunks.length; ci++) {
      const chunk = chunks[ci];
      const batchResult = await batchImportOrders(
        chunk as unknown as Record<string, unknown>[],
        mode,
      );

      results.success += batchResult.success;
      results.failed += batchResult.failed;
      results.inserted += batchResult.inserted;
      results.updated += batchResult.updated;
      results.skipped += batchResult.skipped;

      // Map batch errors to row numbers
      for (const err of batchResult.errors) {
        results.errors.push({
          row: ci * CHUNK_SIZE + err.index + 2, // Excel row offset
          message: err.message,
        });
      }

      if (onProgress) {
        const percent = Math.min(100, Math.round(((ci + 1) / chunks.length) * 100));
        onProgress(percent);
      }
    }

    return results;
  } catch (error) {
    logError('[Orders Importer] Lỗi nhập đơn hàng', error);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════
// Hook for creating import handler (uses API, no store)
// ═══════════════════════════════════════════════════════════════

interface UseOrderImportHandlerParams {
  authEmployeeSystemId?: SystemId;
}

export function useOrderImportHandler({
  authEmployeeSystemId,
}: UseOrderImportHandlerParams = {}) {
  const queryClient = useQueryClient();
  
  const currentEmployeeSystemId = authEmployeeSystemId ?? asSystemId('SYSTEM');

  const handleImport = React.useCallback(
    async (data: Partial<Order>[], mode: 'insert-only' | 'update-only' | 'upsert', _branchId?: string, onProgress?: (percent: number) => void) => {
      const results = await executeImport(data, mode, currentEmployeeSystemId, onProgress);
      
      // Invalidate query cache to refresh order list
      if (results.success > 0) {
        invalidateRelated(queryClient, 'orders');
        // Not a useMutation — MutationCache won't fire, so invalidate activity-logs manually
        queryClient.invalidateQueries({ queryKey: ['activity-logs'] });
      }
      
      return results;
    },
    [queryClient, currentEmployeeSystemId]
  );

  return handleImport;
}
