'use client'

import type { CostAdjustment } from "@/lib/types/prisma-extended";
import type { SystemId } from "@/lib/id-types";
import { asSystemId } from "@/lib/id-types";
import { useQueryClient } from '@tanstack/react-query';
import { invalidateRelated } from '@/lib/query-invalidation-map';
import * as React from "react";
import { fetchCostAdjustments } from '../api/cost-adjustments-api';
import { costAdjustmentKeys } from "./use-cost-adjustments";
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
// API Functions
// ═══════════════════════════════════════════════════════════════

async function createCostAdjustment(data: Partial<CostAdjustment>) {
  const res = await fetch('/api/cost-adjustments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create cost adjustment');
  }
  return res.json();
}

async function updateCostAdjustment(systemId: string, data: Partial<CostAdjustment>) {
  const res = await fetch(`/api/cost-adjustments/${systemId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to update cost adjustment');
  }
  return res.json();
}

// ═══════════════════════════════════════════════════════════════
// Import Handler - Uses API directly
// ═══════════════════════════════════════════════════════════════

async function executeImport(
  data: Partial<CostAdjustment>[],
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
    // Fetch ALL existing cost adjustments to check for duplicates
    const existingRes = await fetchCostAdjustments();
    const existingAdjustments = existingRes.data;

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      try {
        // Check if cost adjustment exists (by id)
        const existing = existingAdjustments.find((adj: CostAdjustment) =>
          (item.id && adj.id.toLowerCase() === item.id.toLowerCase())
        );

        if (existing) {
          // Adjustment exists
          if (mode === 'insert-only') {
            results.skipped++;
            continue;
          }

          // Update existing cost adjustment
          const updatedFields: Partial<CostAdjustment> = {
            ...item,
            updatedAt: new Date().toISOString(),
            updatedBy: currentEmployeeSystemId,
          };
          delete (updatedFields as { systemId?: string }).systemId;
          delete (updatedFields as { createdAt?: string }).createdAt;
          delete (updatedFields as { createdBy?: string }).createdBy;

          await updateCostAdjustment(existing.systemId, updatedFields);
          results.updated++;
          results.success++;
        } else {
          // Adjustment does not exist
          if (mode === 'update-only') {
            results.skipped++;
            continue;
          }

          // Insert new cost adjustment
          const newAdjustment = {
            ...item,
            status: item.status || 'draft',
            createdAt: new Date().toISOString(),
            createdBy: currentEmployeeSystemId,
            updatedAt: new Date().toISOString(),
            updatedBy: currentEmployeeSystemId,
          };

          await createCostAdjustment(newAdjustment);
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
    logError('[CostAdjustments Importer] Lỗi nhập phiếu điều chỉnh giá vốn', error);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════
// Hook for creating import handler
// ═══════════════════════════════════════════════════════════════

interface UseCostAdjustmentImportHandlerParams {
  authEmployeeSystemId?: SystemId;
}

export function useCostAdjustmentImportHandler({
  authEmployeeSystemId,
}: UseCostAdjustmentImportHandlerParams = {}) {
  const queryClient = useQueryClient();
  
  const currentEmployeeSystemId = authEmployeeSystemId ?? asSystemId('SYSTEM');

  const handleImport = React.useCallback(
    async (data: Partial<CostAdjustment>[], mode: 'insert-only' | 'update-only' | 'upsert', _branchId?: string) => {
      const results = await executeImport(data, mode, currentEmployeeSystemId);
      
      // Invalidate query cache to refresh list
      if (results.success > 0) {
        invalidateRelated(queryClient, 'cost-adjustments');
      }
      
      return results;
    },
    [queryClient, currentEmployeeSystemId]
  );

  return handleImport;
}
