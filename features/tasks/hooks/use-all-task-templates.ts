/**
 * Task Templates Helper Hooks
 * Provides derived data and utility functions for task templates
 */

import * as React from 'react';
import { useTaskTemplates } from './use-task-templates';
import type { TaskTemplatesParams } from '../api/templates-api';

/**
 * Hook to fetch task templates with server-side search and filter
 * ✅ API Filter pattern - no client-side filtering needed
 */
export function useAllTaskTemplates(params: TaskTemplatesParams = {}) {
  const query = useTaskTemplates(params);

  // Memoize data - already filtered server-side
  const data = React.useMemo(() => query.data?.data || [], [query.data?.data]);

  // Client-side group by category (needed for UI display)
  const getByCategory = React.useCallback((category: string) => {
    return data.filter(t => t.category === category && t.isActive);
  }, [data]);

  // No longer needed - search is now server-side
  // Keep for backward compatibility but mark as deprecated
  /** @deprecated Search is now server-side via params.search */
  const search = React.useCallback((query: string) => {
    return data.filter(t => t.isActive && (
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.description?.toLowerCase().includes(query.toLowerCase())
    ));
  }, [data]);

  // Find template by ID
  const findById = React.useCallback((systemId: string | undefined) => {
    if (!systemId) return undefined;
    return data.find(t => t.systemId === systemId);
  }, [data]);

  return {
    data,
    getByCategory,
    search,
    findById,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    pagination: query.data?.pagination,
  };
}

/**
 * Returns task templates formatted as options for Select/Combobox
 */
export function useTaskTemplateOptions(category?: string) {
  const { data, isLoading } = useAllTaskTemplates();

  const options = React.useMemo(() => {
    let templates = data.filter(t => t.isActive);

    if (category) {
      templates = templates.filter(t => t.category === category);
    }

    return templates.map(t => ({
      value: t.systemId,
      label: t.name,
      category: t.category,
      usageCount: t.usageCount,
    }));
  }, [data, category]);

  return { options, isLoading };
}

/**
 * Returns categories with template counts
 */
export function useTemplateCategoriesWithCounts() {
  const { data, isLoading } = useAllTaskTemplates();

  const categories = React.useMemo(() => {
    const categoryMap = new Map<string, number>();

    data.filter(t => t.isActive).forEach(t => {
      const count = categoryMap.get(t.category) || 0;
      categoryMap.set(t.category, count + 1);
    });

    return Array.from(categoryMap.entries()).map(([category, count]) => ({
      category,
      count,
    }));
  }, [data]);

  return { categories, isLoading };
}
