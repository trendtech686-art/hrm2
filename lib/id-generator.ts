/**
 * ID Generator Utilities
 * 
 * Simple utilities for generating sequential IDs with custom prefixes.
 * Used primarily for returns, adjustments, and other documents.
 */

import type { PrismaClient as _PrismaClient } from '@/generated/prisma/client';
import { prisma } from '@/lib/prisma';

/**
 * Generate a sequential ID with a custom prefix
 * 
 * @param prefix - The prefix for the ID (e.g., 'TH' for trả hàng)
 * @param tx - Optional Prisma transaction client
 * @returns Promise<string> - The generated ID (e.g., 'TH000001')
 * 
 * @example
 * const id = await generateIdWithPrefix('TH'); // 'TH000001'
 * 
 * // Within a transaction
 * await prisma.$transaction(async (tx) => {
 *   const id = await generateIdWithPrefix('TH', tx);
 *   // ... use id
 * });
 */
// Transaction client type extracted from Prisma
type TransactionClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

export async function generateIdWithPrefix(
  prefix: string,
  tx?: TransactionClient
): Promise<string> {
  const client = tx || prisma;
  
  // Use a special entity type for custom prefixes
  const entityType = `custom_${prefix.toLowerCase()}`;
  
  // Atomic increment using upsert
  const counter = await client.idCounter.upsert({
    where: { entityType },
    update: { currentValue: { increment: 1 } },
    create: {
      entityType,
      prefix,
      systemPrefix: prefix,
      businessPrefix: prefix,
      currentValue: 1,
      padding: 6, // Default 6 digits
    },
  });

  // Format ID with prefix and padded counter
  const paddedCounter = String(counter.currentValue).padStart(6, '0');
  return `${prefix}${paddedCounter}`;
}

/**
 * Get the current counter value for a prefix without incrementing
 * 
 * @param prefix - The prefix to check
 * @returns Promise<number> - The current counter value
 */
export async function getCurrentCounterForPrefix(prefix: string): Promise<number> {
  const entityType = `custom_${prefix.toLowerCase()}`;
  
  const counter = await prisma.idCounter.findUnique({
    where: { entityType },
  });
  
  return counter?.currentValue ?? 0;
}

/**
 * Preview the next ID for a prefix without incrementing
 * 
 * @param prefix - The prefix to preview
 * @returns Promise<string> - The next ID that would be generated
 */
export async function previewNextIdWithPrefix(prefix: string): Promise<string> {
  const currentCounter = await getCurrentCounterForPrefix(prefix);
  const nextCounter = currentCounter + 1;
  const paddedCounter = String(nextCounter).padStart(6, '0');
  return `${prefix}${paddedCounter}`;
}

/**
 * Sync counter with actual max ID in a table
 * Call this if the counter gets out of sync
 * 
 * @param prefix - The prefix to sync
 * @param tableName - The table to check for max ID
 * @param idColumn - The column containing the ID (default: 'id')
 */
export async function syncCounterWithTable(
  prefix: string,
  tableName: string,
  idColumn: string = 'id'
): Promise<void> {
  const entityType = `custom_${prefix.toLowerCase()}`;
  
  // Find max ID matching the prefix pattern
  const result = await prisma.$queryRawUnsafe<Array<{ maxId: string | null }>>(
    `SELECT MAX("${idColumn}") as "maxId" FROM "${tableName}" WHERE "${idColumn}" LIKE '${prefix}%'`
  );
  
  const maxId = result[0]?.maxId;
  if (!maxId) return;
  
  // Extract the number part
  const numericPart = maxId.replace(prefix, '');
  const maxNumber = parseInt(numericPart, 10);
  
  if (isNaN(maxNumber)) return;
  
  // Get current counter value
  const currentCounter = await prisma.idCounter.findUnique({
    where: { entityType },
  });
  
  // Only update if max in table is higher than counter
  if (!currentCounter || currentCounter.currentValue < maxNumber) {
    await prisma.idCounter.upsert({
      where: { entityType },
      update: { currentValue: maxNumber },
      create: {
        entityType,
        prefix,
        systemPrefix: prefix,
        businessPrefix: prefix,
        currentValue: maxNumber,
        padding: 6,
      },
    });
  }
}
