/**
 * Task Templates Helper Hooks
 * Provides derived data and utility functions for task templates
 */

import * as React from 'react';
import { useTaskTemplates } from './use-task-templates';

/**
 * Returns all task templates with helper functions
 * Compatible with legacy store pattern
 */
export function useAllTaskTemplates() {
  const query = useTaskTemplates();
  
  // Memoize data to prevent callback deps warnings
  const data = React.useMemo(() => query.data || [], [query.data]);
  
  // Get templates by category
  const getByCategory = React.useCallback((category: string) => {
    return data.filter(t => t.category === category && t.isActive);
  }, [data]);
  
  // Get most used templates
  const getMostUsed = React.useCallback((limit: number = 5) => {
    return [...data]
      .filter(t => t.isActive)
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  }, [data]);
  
  // Search templates
  const search = React.useCallback((query: string) => {
    const lowerQuery = query.toLowerCase();
    return data.filter(t => 
      t.isActive && (
        t.name.toLowerCase().includes(lowerQuery) ||
        t.description.toLowerCase().includes(lowerQuery)
      )
    );
  }, [data]);
  
  // Find template by ID
  const findById = React.useCallback((systemId: string | undefined) => {
    if (!systemId) return undefined;
    return data.find(t => t.systemId === systemId);
  }, [data]);
  
  return {
    data,
    getByCategory,
    getMostUsed,
    search,
    findById,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
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
