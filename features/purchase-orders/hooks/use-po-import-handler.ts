'use client'

import type { PurchaseOrder } from "@/lib/types/prisma-extended";
import type { SystemId } from "@/lib/id-types";
import { asSystemId } from "@/lib/id-types";
import { useQueryClient } from '@tanstack/react-query';
import { invalidateRelated } from '@/lib/query-invalidation-map';
import * as React from "react";
import { batchImportPurchaseOrders } from '../api/purchase-orders-api';
import { purchaseOrderKeys } from "./use-purchase-orders";
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
  newProducts?: number;
  newSuppliers?: number;
  errors: Array<{ row: number; message: string }>;
}

// ═══════════════════════════════════════════════════════════════
// Import Handler - Uses batch API for speed
// ═══════════════════════════════════════════════════════════════

async function executeImport(
  data: Partial<PurchaseOrder>[],
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
    // Send POs in chunks to the batch API
    const CHUNK_SIZE = 500;
    const total = data.length;
    const chunks: Partial<PurchaseOrder>[][] = [];
    for (let i = 0; i < total; i += CHUNK_SIZE) {
      chunks.push(data.slice(i, i + CHUNK_SIZE));
    }

    for (let ci = 0; ci < chunks.length; ci++) {
      const chunk = chunks[ci];
      const batchResult = await batchImportPurchaseOrders(
        chunk as unknown as Record<string, unknown>[],
        mode,
      );

      results.success += batchResult.success;
      results.failed += batchResult.failed;
      results.inserted += batchResult.inserted;
      results.updated += batchResult.updated;
      results.skipped += batchResult.skipped;
      results.newProducts = (results.newProducts || 0) + (batchResult.newProducts || 0);
      results.newSuppliers = (results.newSuppliers || 0) + (batchResult.newSuppliers || 0);

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
    logError('[PurchaseOrders Importer] Lỗi nhập đơn nhập hàng', error);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════
// Hook for creating import handler
// ═══════════════════════════════════════════════════════════════

interface UsePOImportHandlerParams {
  authEmployeeSystemId?: SystemId;
}

export function usePurchaseOrderImportHandler({
  authEmployeeSystemId,
}: UsePOImportHandlerParams = {}) {
  const queryClient = useQueryClient();
  
  const currentEmployeeSystemId = authEmployeeSystemId ?? asSystemId('SYSTEM');

  const handleImport = React.useCallback(
    async (data: Partial<PurchaseOrder>[], mode: 'insert-only' | 'update-only' | 'upsert', _branchId?: string, onProgress?: (percent: number) => void) => {
      const results = await executeImport(data, mode, currentEmployeeSystemId, onProgress);
      
      // Invalidate query cache to refresh list
      if (results.success > 0) {
        invalidateRelated(queryClient, 'purchase-orders');
      }
      
      return results;
    },
    [queryClient, currentEmployeeSystemId]
  );

  return handleImport;
}
