'use client'

import type { InventoryCheck } from "@/lib/types/prisma-extended";
import type { SystemId } from "@/lib/id-types";
import { asSystemId } from "@/lib/id-types";
import { useQueryClient } from '@tanstack/react-query';
import * as React from "react";
import { fetchInventoryChecks } from '../api/inventory-checks-api';
import { fetchAllPages } from '@/lib/fetch-all-pages';
import { inventoryCheckKeys } from "./use-inventory-checks";

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

async function createInventoryCheck(data: Partial<InventoryCheck>) {
  const res = await fetch('/api/inventory-checks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create inventory check');
  }
  return res.json();
}

async function updateInventoryCheck(systemId: string, data: Partial<InventoryCheck>) {
  const res = await fetch(`/api/inventory-checks/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to update inventory check');
  }
  return res.json();
}

// ═══════════════════════════════════════════════════════════════
// Import Handler - Uses API directly
// ═══════════════════════════════════════════════════════════════

async function executeImport(
  data: Partial<InventoryCheck>[],
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
    // Fetch ALL existing inventory checks to check for duplicates
    const existingChecks = await fetchAllPages((p) => fetchInventoryChecks(p));

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      try {
        // Check if inventory check exists (by id)
        const existing = existingChecks.find((check: InventoryCheck) =>
          (item.id && check.id.toLowerCase() === item.id.toLowerCase())
        );

        if (existing) {
          // Check exists
          if (mode === 'insert-only') {
            results.skipped++;
            continue;
          }

          // Update existing inventory check
          const updatedFields: Record<string, unknown> = {
            ...item,
          };
          delete updatedFields.systemId;
          delete updatedFields.createdAt;
          delete updatedFields.createdBy;

          await updateInventoryCheck(existing.systemId, updatedFields as Partial<InventoryCheck>);
          results.updated++;
          results.success++;
        } else {
          // Check does not exist
          if (mode === 'update-only') {
            results.skipped++;
            continue;
          }

          // Insert new inventory check
          const newCheck = {
            ...item,
            status: item.status || 'draft',
            createdAt: new Date().toISOString(),
            createdBy: currentEmployeeSystemId,
          };

          await createInventoryCheck(newCheck);
          results.inserted++;
          results.success++;
        }
      } catch (rowError) {
        results.failed++;
        results.errors.push({
          row: i + 2,
          message: rowError instanceof Error ? rowError.message : 'Lỗi không xác định',
        });
      }
    }

    return results;
  } catch (error) {
    console.error('[InventoryChecks Importer] Lỗi nhập phiếu kiểm hàng', error);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════
// Hook for creating import handler
// ═══════════════════════════════════════════════════════════════

interface UseInventoryCheckImportHandlerParams {
  authEmployeeSystemId?: SystemId;
}

export function useInventoryCheckImportHandler({
  authEmployeeSystemId,
}: UseInventoryCheckImportHandlerParams = {}) {
  const queryClient = useQueryClient();
  
  const currentEmployeeSystemId = authEmployeeSystemId ?? asSystemId('SYSTEM');

  const handleImport = React.useCallback(
    async (data: Partial<InventoryCheck>[], mode: 'insert-only' | 'update-only' | 'upsert', _branchId?: string) => {
      const results = await executeImport(data, mode, currentEmployeeSystemId);
      
      // Invalidate query cache to refresh list
      if (results.success > 0) {
        queryClient.invalidateQueries({ queryKey: inventoryCheckKeys.lists() });
      }
      
      return results;
    },
    [queryClient, currentEmployeeSystemId]
  );

  return handleImport;
}
