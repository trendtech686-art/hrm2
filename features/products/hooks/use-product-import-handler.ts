'use client'

import type { Product } from "@/lib/types/prisma-extended";
import type { SystemId } from "@/lib/id-types";
import { asSystemId } from "@/lib/id-types";
import { useQueryClient } from '@tanstack/react-query';
import { invalidateRelated } from '@/lib/query-invalidation-map';
import * as React from "react";
import { createProduct, updateProduct, fetchProducts } from "../api/products-api";
import { fetchAllPages } from '@/lib/fetch-all-pages';
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
// Import Handler - Uses API directly
// ═══════════════════════════════════════════════════════════════

async function executeImport(
  data: Partial<Product>[],
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
    // Fetch ALL existing products to check for duplicates
    const existingProducts = await fetchAllPages((p) => fetchProducts(p));

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      try {
        // Check if product exists (by id or barcode)
        const existingProduct = existingProducts.find(p =>
          (item.id && p.id === item.id) ||
          (item.barcode && p.barcode === item.barcode)
        );

        if (existingProduct) {
          // Product exists
          if (mode === 'insert-only') {
            // Skip in insert-only mode
            results.skipped++;
            continue;
          }

          // Update existing product
          const updatedFields: Partial<Product> = {
            ...item,
            updatedAt: new Date().toISOString(),
            updatedBy: currentEmployeeSystemId,
          };
          // Remove fields that shouldn't be overwritten
          delete (updatedFields as { systemId?: string }).systemId;
          delete (updatedFields as { createdAt?: string }).createdAt;
          delete (updatedFields as { createdBy?: string }).createdBy;

          await updateProduct({ systemId: existingProduct.systemId, ...updatedFields });
          results.updated++;
          results.success++;
        } else {
          // Product does not exist
          if (mode === 'update-only') {
            // Skip in update-only mode
            results.skipped++;
            continue;
          }

          // Insert new product
          const newProduct = {
            ...item,
            inventoryByBranch: item.inventoryByBranch || {},
            committedByBranch: item.committedByBranch || {},
            inTransitByBranch: item.inTransitByBranch || {},
            prices: item.prices || {},
            createdAt: new Date().toISOString(),
            createdBy: currentEmployeeSystemId,
            updatedAt: new Date().toISOString(),
            updatedBy: currentEmployeeSystemId,
          };

          await createProduct(newProduct as Parameters<typeof createProduct>[0]);
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
    logError('[Products Importer] Lỗi nhập sản phẩm', error);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════
// Hook for creating import handler (uses API, no store)
// ═══════════════════════════════════════════════════════════════

interface UseProductImportHandlerParams {
  authEmployeeSystemId?: SystemId;
}

export function useProductImportHandler({
  authEmployeeSystemId,
}: UseProductImportHandlerParams = {}) {
  const queryClient = useQueryClient();
  
  const currentEmployeeSystemId = authEmployeeSystemId ?? asSystemId('SYSTEM');

  const handleImport = React.useCallback(
    async (data: Partial<Product>[], mode: 'insert-only' | 'update-only' | 'upsert', _branchId?: string) => {
      const results = await executeImport(data, mode, currentEmployeeSystemId);
      
      // Invalidate query cache để refresh danh sách sản phẩm
      if (results.success > 0) {
        invalidateRelated(queryClient, 'products');
      }
      
      return results;
    },
    [queryClient, currentEmployeeSystemId]
  );

  return handleImport;
}
