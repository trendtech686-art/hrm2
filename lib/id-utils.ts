/**
 * ID Utilities
 * Helpers for generating and validating IDs (systemId & business id)
 */

import { getPrefix, type EntityType } from './smart-prefix';
import { ID_CONFIG } from './id-config';

// Re-export EntityType for convenience
export type { EntityType } from './smart-prefix';

/**
 * Generate SystemId (6 digits, immutable, internal use only)
 * Format: SYSTEMID_PREFIX + 6 digits (e.g., "EMP000001", "CUSTOMER000001", "ORDER000001")
 * Uses systemIdPrefix from ID_CONFIG (English full words)
 */
export function generateSystemId(entityType: EntityType, counter: number): string {
  const config = ID_CONFIG[entityType];
  if (!config) {
    throw new Error(`No configuration found for entity type: ${entityType}`);
  }
  const prefix = config.systemIdPrefix;
  const digitCount = config.digitCount || 6;
  return `${prefix}${String(counter).padStart(digitCount, '0')}`;
}

/**
 * Generate Business ID (6 digits, user-facing, editable)
 * Format: PREFIX + 6 digits (e.g., "NV000001", "KH000001", "CTV000001")
 * All entities use same 6-digit format for consistency
 * 
 * @param entityType - Entity type from smart-prefix
 * @param counter - Current counter value
 * @param customId - Optional custom ID from user input
 * @returns Generated ID or validated custom ID
 */
export function generateBusinessId(
  entityType: EntityType, 
  counter: number,
  customId?: string
): string {
  // If user provided custom ID, validate and return it
  if (customId && customId.trim()) {
    const sanitized = sanitizeBusinessId(customId);
    if (!sanitized) {
      throw new Error('Mã không hợp lệ! Chỉ được phép sử dụng chữ cái và số.');
    }
    return sanitized;
  }
  
  // Otherwise, auto-generate
  const prefix = getPrefix(entityType);
  return `${prefix}${String(counter).padStart(6, '0')}`;
}

/**
 * Sanitize business ID
 * - Remove special characters (keep only letters and numbers)
 * - Convert to uppercase
 * - Trim whitespace
 * 
 * @param id - Raw user input
 * @returns Sanitized ID or null if invalid
 */
export function sanitizeBusinessId(id: string): string | null {
  if (!id || typeof id !== 'string') return null;
  
  // Remove all special characters, keep only alphanumeric
  const cleaned = id.trim().replace(/[^a-zA-Z0-9]/g, '');
  
  if (!cleaned) return null;
  
  // Convert to uppercase for consistency
  return cleaned.toUpperCase();
}

/**
 * Validate business ID uniqueness (case-insensitive)
 * 
 * @param id - ID to check
 * @param existingIds - Array of existing IDs in the system
 * @param currentId - Current ID (for edit mode, to exclude self)
 * @returns true if unique, false if duplicate
 */
export function isBusinessIdUnique(
  id: string,
  existingIds: string[],
  currentId?: string
): boolean {
  if (!id) return false;
  
  const normalizedId = id.toUpperCase();
  const normalizedCurrentId = currentId?.toUpperCase();
  
  return !existingIds.some(existingId => {
    // ✅ Filter out empty/undefined IDs
    if (!existingId || existingId.trim() === '') return false;
    
    const normalizedExisting = existingId.toUpperCase();
    // Skip self-comparison in edit mode
    if (normalizedCurrentId && normalizedExisting === normalizedCurrentId) {
      return false;
    }
    return normalizedExisting === normalizedId;
  });
}

/**
 * Extract counter from system ID
 * Used to initialize counter when loading from localStorage
 * Supports both 6, 7 and 8 digits
 * 
 * @param systemId - System ID to parse (e.g., "EMP000001", "CUSTOMER000001", "WARRANTY0000001")
 * @param prefix - Expected systemIdPrefix (e.g., "EMP", "CUSTOMER", "WARRANTY")
 * @returns Counter value or 0 if invalid
 */
export function extractCounterFromSystemId(systemId: string, prefix: string): number {
  if (!systemId || typeof systemId !== 'string') return 0;
  
  // Try different digit counts (most entities use 6 digits, some use 7-8)
  const regex8 = new RegExp(`^${prefix}(\\d{8})$`);
  const regex7 = new RegExp(`^${prefix}(\\d{7})$`);
  const regex6 = new RegExp(`^${prefix}(\\d{6})$`);
  
  const match8 = systemId.match(regex8);
  if (match8) return parseInt(match8[1], 10);
  
  const match7 = systemId.match(regex7);
  if (match7) return parseInt(match7[1], 10);
  
  const match6 = systemId.match(regex6);
  if (match6) return parseInt(match6[1], 10);
  
  return 0;
}

/**
 * Extract counter from business ID
 * Used to initialize counter when loading from localStorage
 * 
 * @param businessId - Business ID to parse (e.g., "NV000001")
 * @param prefix - Expected prefix (e.g., "NV")
 * @returns Counter value or 0 if invalid
 */
export function extractCounterFromBusinessId(businessId: string, prefix: string): number {
  if (!businessId || typeof businessId !== 'string') return 0;
  const regex = new RegExp(`^${prefix}(\\d+)$`);
  const match = businessId.match(regex);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Get max counter from array of items (for systemId)
 * 
 * @param items - Array of items with systemId
 * @param prefix - Prefix to match
 * @returns Maximum counter value
 */
export function getMaxSystemIdCounter<T extends { systemId: string }>(
  items: T[],
  prefix: string
): number {
  if (!items || !Array.isArray(items)) return 0;
  
  let maxCounter = 0;
  
  items.forEach(item => {
    if (!item || !item.systemId) return;
    const counter = extractCounterFromSystemId(item.systemId, prefix);
    if (counter > maxCounter) {
      maxCounter = counter;
    }
  });
  
  return maxCounter;
}

/**
 * Get max counter from array of items (for business id)
 * Only counts auto-generated IDs (PREFIX + digits)
 * 
 * @param items - Array of items with id
 * @param prefix - Prefix to match
 * @returns Maximum counter value
 */
export function getMaxBusinessIdCounter<T extends { id: string }>(
  items: T[],
  prefix: string
): number {
  if (!items || !Array.isArray(items)) return 0;
  
  let maxCounter = 0;
  
  items.forEach(item => {
    if (!item || !item.id) return;
    const counter = extractCounterFromBusinessId(item.id, prefix);
    if (counter > maxCounter) {
      maxCounter = counter;
    }
  });
  
  return maxCounter;
}

/**
 * Format ID for display
 * Adds spacing for readability
 * 
 * @param id - ID to format
 * @returns Formatted ID (e.g., "NV-000001", "KH-000123")
 */
export function formatIdForDisplay(id: string): string {
  // Match pattern: PREFIX followed by numbers
  const match = id.match(/^([A-Z]+)(\d+)$/);
  if (!match) return id;
  
  const [, prefix, numbers] = match;
  return `${prefix}-${numbers}`;
}

/**
 * Validate ID format
 * Check if ID follows valid pattern (letters + numbers only)
 * 
 * @param id - ID to validate
 * @returns true if valid format
 */
export function isValidIdFormat(id: string): boolean {
  if (!id || typeof id !== 'string') return false;
  
  // Only alphanumeric characters allowed
  const regex = /^[A-Z0-9]+$/i;
  return regex.test(id);
}

/**
 * Generate suggested IDs based on entity type
 * Useful for autocomplete or placeholder text
 * 
 * @param entityType - Entity type
 * @param counter - Current counter
 * @param count - Number of suggestions
 * @returns Array of suggested IDs
 */
export function generateSuggestedIds(
  entityType: EntityType,
  counter: number,
  count: number = 3
): string[] {
  const suggestions: string[] = [];
  const prefix = getPrefix(entityType);
  
  for (let i = 0; i < count; i++) {
    suggestions.push(`${prefix}${String(counter + i + 1).padStart(6, '0')}`);
  }
  
  return suggestions;
}

/**
 * ✨ Find next available business ID
 * Checks existing IDs and increments counter until finding a unique ID
 * 
 * @param prefix - ID prefix (e.g., 'PT', 'PC', 'NV')
 * @param existingIds - Array of existing business IDs
 * @param startCounter - Starting counter value
 * @param digitCount - Number of digits (default: 6)
 * @returns Object with nextId and updatedCounter
 */
export function findNextAvailableBusinessId(
  prefix: string,
  existingIds: string[],
  startCounter: number,
  digitCount: number = 6
): { nextId: string; updatedCounter: number } {
  let counter = startCounter;
  let nextId: string;
  
  // Keep incrementing until we find a unique ID
  do {
    counter++;
    nextId = `${prefix}${String(counter).padStart(digitCount, '0')}`;
  } while (existingIds.some(id => id === nextId));
  
  return {
    nextId,
    updatedCounter: counter
  };
}
