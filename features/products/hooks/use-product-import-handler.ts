'use client'

import type { Product } from "@/lib/types/prisma-extended";
import type { SystemId } from "@/lib/id-types";
import { asSystemId } from "@/lib/id-types";

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

export interface HandleImportParams {
  products: Product[];
  add: (product: Omit<Product, 'systemId'>) => void;
  update: (id: SystemId, data: Partial<Product>) => void;
  invalidateQueries: () => void;
  currentEmployeeSystemId: SystemId;
}

// ═══════════════════════════════════════════════════════════════
// Import Handler Factory
// ═══════════════════════════════════════════════════════════════

export function createImportHandler({
  products,
  add,
  update,
  invalidateQueries,
  currentEmployeeSystemId,
}: HandleImportParams) {
  return async (
    data: Partial<Product>[],
    mode: 'insert-only' | 'update-only' | 'upsert',
    _branchId?: string
  ): Promise<ImportResults> => {
    const results: ImportResults = {
      success: 0,
      failed: 0,
      inserted: 0,
      updated: 0,
      skipped: 0,
      errors: [],
    };

    try {
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        try {
          // Check if product exists (by id or barcode)
          // NOTE: Product uses 'id' (BusinessId) not 'code'
          const existingProduct = products.find(p =>
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

            update(existingProduct.systemId, updatedFields);
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
            } as Omit<Product, 'systemId'>;

            add(newProduct);
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

      // Invalidate query cache để refresh danh sách sản phẩm
      if (results.success > 0) {
        invalidateQueries();
      }

      return results;
    } catch (error) {
      console.error('[Products Importer] Lỗi nhập sản phẩm', error);
      throw error;
    }
  };
}

// ═══════════════════════════════════════════════════════════════
// Hook for creating import handler
// ═══════════════════════════════════════════════════════════════

import { useQueryClient } from '@tanstack/react-query';
import * as React from "react";

interface UseProductImportHandlerParams {
  products: Product[];
  add: (product: Omit<Product, 'systemId'>) => void;
  update: (id: SystemId, data: Partial<Product>) => void;
  authEmployeeSystemId?: SystemId;
}

export function useProductImportHandler({
  products,
  add,
  update,
  authEmployeeSystemId,
}: UseProductImportHandlerParams) {
  const queryClient = useQueryClient();
  
  const currentEmployeeSystemId = authEmployeeSystemId ?? asSystemId('SYSTEM');
  
  const invalidateQueries = React.useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
  }, [queryClient]);

  const handleImport = React.useCallback(
    (data: Partial<Product>[], mode: 'insert-only' | 'update-only' | 'upsert', branchId?: string) => {
      const handler = createImportHandler({
        products,
        add,
        update,
        invalidateQueries,
        currentEmployeeSystemId,
      });
      return handler(data, mode, branchId);
    },
    [products, add, update, invalidateQueries, currentEmployeeSystemId]
  );

  return handleImport;
}
