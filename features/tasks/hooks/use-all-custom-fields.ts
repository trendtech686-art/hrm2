/**
 * Custom Fields Helper Hooks
 * Provides derived data and utility functions for custom fields
 */

import * as React from 'react';
import { useCustomFields } from './use-custom-fields';
import type { CustomFieldDefinition } from '../custom-fields-types';

/**
 * Returns all custom fields with helper functions
 * Compatible with legacy store pattern
 */
export function useAllCustomFields() {
  const query = useCustomFields();
  
  // Memoize data to prevent callback deps warnings
  const data = React.useMemo(() => query.data || [], [query.data]);
  
  // Get active fields
  const getActive = React.useCallback(() => {
    return data.filter(f => f.isActive).sort((a, b) => a.order - b.order);
  }, [data]);
  
  // Get fields by category
  const getByCategory = React.useCallback((category: string) => {
    return data
      .filter(f => f.isActive && f.category === category)
      .sort((a, b) => a.order - b.order);
  }, [data]);
  
  // Get all categories
  const getCategories = React.useCallback(() => {
    const categories = new Set(data.filter(f => f.isActive).map(f => f.category));
    return Array.from(categories).filter(Boolean) as string[];
  }, [data]);
  
  // Check if user can view field
  const canView = React.useCallback((field: CustomFieldDefinition, userRole: string): boolean => {
    if (!field.visibleToRoles || field.visibleToRoles.length === 0) {
      return true; // Visible to all
    }
    return field.visibleToRoles.includes(userRole);
  }, []);
  
  // Check if user can edit field
  const canEdit = React.useCallback((field: CustomFieldDefinition, userRole: string): boolean => {
    if (!field.editableByRoles || field.editableByRoles.length === 0) {
      return true; // Editable by all
    }
    return field.editableByRoles.includes(userRole);
  }, []);
  
  // Find field by ID
  const findById = React.useCallback((systemId: string | undefined) => {
    if (!systemId) return undefined;
    return data.find(f => f.systemId === systemId);
  }, [data]);
  
  return {
    data,
    getActive,
    getByCategory,
    getCategories,
    canView,
    canEdit,
    findById,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Returns custom fields formatted as options for Select/Combobox
 */
export function useCustomFieldOptions(category?: string) {
  const { data, isLoading } = useAllCustomFields();
  
  const options = React.useMemo(() => {
    let fields = data.filter(f => f.isActive);
    
    if (category) {
      fields = fields.filter(f => f.category === category);
    }
    
    return fields
      .sort((a, b) => a.order - b.order)
      .map(f => ({
        value: f.systemId,
        label: f.name,
        type: f.type,
      }));
  }, [data, category]);
  
  return { options, isLoading };
}
