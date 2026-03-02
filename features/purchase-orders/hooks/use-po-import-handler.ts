'use client'

import type { PurchaseOrder } from "@/lib/types/prisma-extended";
import type { SystemId } from "@/lib/id-types";
import { asSystemId } from "@/lib/id-types";
import { useQueryClient } from '@tanstack/react-query';
import * as React from "react";
import { fetchPurchaseOrders } from '../api/purchase-orders-api';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { purchaseOrderKeys } from "./use-purchase-orders";

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
// API Functions
// ═══════════════════════════════════════════════════════════════

async function createPurchaseOrder(data: Partial<PurchaseOrder>) {
  const res = await fetch('/api/purchase-orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create purchase order');
  }
  return res.json();
}

async function updatePurchaseOrder(systemId: string, data: Partial<PurchaseOrder>) {
  const res = await fetch(`/api/purchase-orders/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to update purchase order');
  }
  return res.json();
}

// ═══════════════════════════════════════════════════════════════
// Import Handler - Uses API directly
// ═══════════════════════════════════════════════════════════════

async function executeImport(
  data: Partial<PurchaseOrder>[],
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
    // Fetch ALL existing purchase orders to check for duplicates
    const existingPOs = await fetchAllPages((p) => fetchPurchaseOrders(p));

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      try {
        // Check if purchase order exists (by id)
        const existingPO = existingPOs.find((po: PurchaseOrder) =>
          (item.id && po.id.toLowerCase() === item.id.toLowerCase())
        );

        if (existingPO) {
          // PO exists
          if (mode === 'insert-only') {
            // Skip in insert-only mode
            results.skipped++;
            continue;
          }

          // Update existing purchase order
          const updatedFields: Partial<PurchaseOrder> = {
            ...item,
            updatedAt: new Date().toISOString(),
            updatedBy: currentEmployeeSystemId,
          };
          // Remove fields that shouldn't be overwritten
          delete (updatedFields as { systemId?: string }).systemId;
          delete (updatedFields as { createdAt?: string }).createdAt;
          delete (updatedFields as { createdBy?: string }).createdBy;

          await updatePurchaseOrder(existingPO.systemId, updatedFields);
          results.updated++;
          results.success++;
        } else {
          // PO does not exist
          if (mode === 'update-only') {
            // Skip in update-only mode
            results.skipped++;
            continue;
          }

          // Insert new purchase order
          const newPO = {
            ...item,
            status: item.status || 'Đặt hàng',
            paymentStatus: item.paymentStatus || 'Chưa thanh toán',
            createdAt: new Date().toISOString(),
            createdBy: currentEmployeeSystemId,
            updatedAt: new Date().toISOString(),
            updatedBy: currentEmployeeSystemId,
          };

          await createPurchaseOrder(newPO);
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
    console.error('[PurchaseOrders Importer] Lỗi nhập đơn nhập hàng', error);
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
    async (data: Partial<PurchaseOrder>[], mode: 'insert-only' | 'update-only' | 'upsert', _branchId?: string) => {
      const results = await executeImport(data, mode, currentEmployeeSystemId);
      
      // Invalidate query cache to refresh list
      if (results.success > 0) {
        queryClient.invalidateQueries({ queryKey: purchaseOrderKeys.lists() });
      }
      
      return results;
    },
    [queryClient, currentEmployeeSystemId]
  );

  return handleImport;
}
