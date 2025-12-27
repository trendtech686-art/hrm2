/**
 * Store API Integration Helper
 * 
 * Helper functions to wrap Zustand store methods with API calls.
 * This ensures data is persisted to PostgreSQL when modified.
 * 
 * Pattern:
 * 1. Store method is called
 * 2. Local Zustand state is updated (immediate UI feedback)
 * 3. API call is made in background
 * 4. If API fails, error is logged (could add rollback in future)
 */

import type { SystemId } from '@/lib/id-types';

type ApiConfig = {
  endpoint: string;
  entityName: string;
};

/**
 * Creates API-backed CRUD methods for a store
 */
export function createApiBackedMethods<T extends { systemId: SystemId }>(
  config: ApiConfig
) {
  const { endpoint, entityName } = config;

  /**
   * POST - Create new item
   */
  const createViaApi = async (item: Omit<T, 'systemId'>): Promise<T | null> => {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.error(`[API] Create ${entityName} failed:`, error);
        return null;
      }

      const result = await response.json();
      console.log(`[API] Created ${entityName}:`, result.systemId || result.id);
      return result.data || result;
    } catch (error) {
      console.error(`[API] Create ${entityName} error:`, error);
      return null;
    }
  };

  /**
   * PUT/PATCH - Update existing item
   */
  const updateViaApi = async (
    systemId: SystemId | string,
    updates: Partial<T>
  ): Promise<boolean> => {
    try {
      const response = await fetch(`${endpoint}/${systemId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.error(`[API] Update ${entityName} failed:`, error);
        return false;
      }

      console.log(`[API] Updated ${entityName}:`, systemId);
      return true;
    } catch (error) {
      console.error(`[API] Update ${entityName} error:`, error);
      return false;
    }
  };

  /**
   * DELETE - Soft delete (mark as deleted)
   */
  const softDeleteViaApi = async (systemId: SystemId | string): Promise<boolean> => {
    try {
      const response = await fetch(`${endpoint}/${systemId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hard: false }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.error(`[API] Soft delete ${entityName} failed:`, error);
        return false;
      }

      console.log(`[API] Soft deleted ${entityName}:`, systemId);
      return true;
    } catch (error) {
      console.error(`[API] Soft delete ${entityName} error:`, error);
      return false;
    }
  };

  /**
   * DELETE - Hard delete (permanent removal)
   */
  const hardDeleteViaApi = async (systemId: SystemId | string): Promise<boolean> => {
    try {
      const response = await fetch(`${endpoint}/${systemId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hard: true }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.error(`[API] Hard delete ${entityName} failed:`, error);
        return false;
      }

      console.log(`[API] Hard deleted ${entityName}:`, systemId);
      return true;
    } catch (error) {
      console.error(`[API] Hard delete ${entityName} error:`, error);
      return false;
    }
  };

  /**
   * POST - Restore soft-deleted item
   */
  const restoreViaApi = async (systemId: SystemId | string): Promise<boolean> => {
    try {
      const response = await fetch(`${endpoint}/${systemId}/restore`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.error(`[API] Restore ${entityName} failed:`, error);
        return false;
      }

      console.log(`[API] Restored ${entityName}:`, systemId);
      return true;
    } catch (error) {
      console.error(`[API] Restore ${entityName} error:`, error);
      return false;
    }
  };

  return {
    createViaApi,
    updateViaApi,
    softDeleteViaApi,
    hardDeleteViaApi,
    restoreViaApi,
  };
}

/**
 * Wraps a store method to also call API
 * Original method runs first (sync), then API call runs in background (async)
 */
export function wrapWithApiCall<TArgs extends any[], TResult>(
  originalMethod: (...args: TArgs) => TResult,
  apiMethod: (...args: TArgs) => Promise<any>,
  methodName: string
): (...args: TArgs) => TResult {
  return (...args: TArgs): TResult => {
    // Run original method synchronously for immediate UI update
    const result = originalMethod(...args);

    // Call API in background
    apiMethod(...args).catch(error => {
      console.error(`[API] ${methodName} background sync failed:`, error);
    });

    return result;
  };
}
