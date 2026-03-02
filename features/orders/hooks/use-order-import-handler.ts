'use client'

import type { Order } from "@/lib/types/prisma-extended";
import type { SystemId } from "@/lib/id-types";
import { asSystemId } from "@/lib/id-types";
import { useQueryClient } from '@tanstack/react-query';
import * as React from "react";
import { createOrder, updateOrder, fetchOrders } from "../api/orders-api";
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { orderKeys } from "./use-orders";

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
// Import Handler - Uses API directly
// ═══════════════════════════════════════════════════════════════

async function executeImport(
  data: Partial<Order>[],
  mode: 'insert-only' | 'update-only' | 'upsert',
  currentEmployeeSystemId: SystemId,
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
    // Fetch ALL existing orders to check for duplicates
    const existingOrders = await fetchAllPages((p) => fetchOrders(p));

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      try {
        // Check if order exists (by id)
        const existingOrder = existingOrders.find(o =>
          (item.id && o.id === item.id)
        );

        if (existingOrder) {
          // Order exists
          if (mode === 'insert-only') {
            // Skip in insert-only mode
            results.skipped++;
            continue;
          }

          // Update existing order
          const updatedFields: Partial<Order> = {
            ...item,
            updatedAt: new Date().toISOString(),
            updatedBy: currentEmployeeSystemId,
          };
          // Remove fields that shouldn't be overwritten
          delete (updatedFields as { systemId?: string }).systemId;
          delete (updatedFields as { createdAt?: string }).createdAt;
          delete (updatedFields as { createdBy?: string }).createdBy;

          await updateOrder({ id: existingOrder.systemId, data: updatedFields });
          results.updated++;
          results.success++;
        } else {
          // Order does not exist
          if (mode === 'update-only') {
            // Skip in update-only mode
            results.skipped++;
            continue;
          }

          // Insert new order
          const newOrder = {
            ...item,
            createdAt: new Date().toISOString(),
            createdBy: currentEmployeeSystemId,
            updatedAt: new Date().toISOString(),
            updatedBy: currentEmployeeSystemId,
          };

          await createOrder(newOrder as Parameters<typeof createOrder>[0]);
          results.inserted++;
          results.success++;
        }
      } catch (rowError) {
        results.failed++;
        results.errors.push({
          row: i + 2, // Excel row (1-indexed + header)
          message: rowError instanceof Error ? rowError.message : 'Lỗi không xác định',
        });
      }
    }

    return results;
  } catch (error) {
    console.error('[Orders Importer] Lỗi nhập đơn hàng', error);
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
    async (data: Partial<Order>[], mode: 'insert-only' | 'update-only' | 'upsert', _branchId?: string) => {
      const results = await executeImport(data, mode, currentEmployeeSystemId);
      
      // Invalidate query cache to refresh order list
      if (results.success > 0) {
        queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
        queryClient.invalidateQueries({ queryKey: orderKeys.stats() });
      }
      
      return results;
    },
    [queryClient, currentEmployeeSystemId]
  );

  return handleImport;
}
