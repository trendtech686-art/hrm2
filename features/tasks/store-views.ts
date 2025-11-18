/**
 * Saved Views Store
 * Manage saved filter configurations with localStorage persistence
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SavedView, FilterGroup } from './types-filter';

interface SavedViewsState {
  views: SavedView[];
  currentViewId?: string;

  // Actions
  addView: (view: Omit<SavedView, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateView: (id: string, updates: Partial<SavedView>) => void;
  deleteView: (id: string) => void;
  duplicateView: (id: string) => string;
  setDefaultView: (id: string) => void;
  setCurrentView: (id?: string) => void;
  getViewById: (id: string) => SavedView | undefined;
}

export const useSavedViewsStore = create<SavedViewsState>()(
  persist(
    (set, get) => ({
      views: [],
      currentViewId: undefined,

      addView: (viewData) => {
        const now = new Date().toISOString();
        const newView: SavedView = {
          ...viewData,
          id: `view_${Date.now()}`,
          createdAt: now,
          updatedAt: now,
        };

        set(state => ({
          views: [...state.views, newView],
        }));

        return newView.id;
      },

      updateView: (id, updates) => {
        set(state => ({
          views: state.views.map(view =>
            view.id === id
              ? { ...view, ...updates, updatedAt: new Date().toISOString() }
              : view
          ),
        }));
      },

      deleteView: (id) => {
        set(state => {
          const newViews = state.views.filter(v => v.id !== id);
          const newCurrentViewId = state.currentViewId === id ? undefined : state.currentViewId;
          
          return {
            views: newViews,
            currentViewId: newCurrentViewId,
          };
        });
      },

      duplicateView: (id) => {
        const view = get().views.find(v => v.id === id);
        if (!view) return '';

        const now = new Date().toISOString();
        const duplicatedView: SavedView = {
          ...view,
          id: `view_${Date.now()}`,
          name: `${view.name} (Copy)`,
          isDefault: false,
          createdAt: now,
          updatedAt: now,
        };

        set(state => ({
          views: [...state.views, duplicatedView],
        }));

        return duplicatedView.id;
      },

      setDefaultView: (id) => {
        set(state => ({
          views: state.views.map(view => ({
            ...view,
            isDefault: view.id === id,
          })),
        }));
      },

      setCurrentView: (id) => {
        set({ currentViewId: id });
      },

      getViewById: (id) => {
        return get().views.find(v => v.id === id);
      },
    }),
    {
      name: 'task-saved-views',
      version: 1,
    }
  )
);

/**
 * Hook to apply filters from a saved view
 */
export function useApplyView(view: SavedView | undefined, tasks: any[]) {
  return React.useMemo(() => {
    if (!view || !view.filterGroups.length) return tasks;

    return tasks.filter(task => {
      // Evaluate each filter group
      const groupResults = view.filterGroups.map(group => {
        // Evaluate conditions within group
        const conditionResults = group.conditions.map(condition => {
          return evaluateCondition(task, condition);
        });

        // Apply group logic (AND/OR within group)
        return group.logic === 'AND'
          ? conditionResults.every(Boolean)
          : conditionResults.some(Boolean);
      });

      // Apply top-level logic (AND/OR between groups)
      return view.groupLogic === 'AND'
        ? groupResults.every(Boolean)
        : groupResults.some(Boolean);
    });
  }, [view, tasks]);
}

/**
 * Evaluate a single filter condition
 */
function evaluateCondition(task: any, condition: any): boolean {
  const { field, operator, value } = condition;
  const taskValue = task[field];

  switch (operator) {
    case 'equals':
      return taskValue === value;
    
    case 'not_equals':
      return taskValue !== value;
    
    case 'contains':
      return String(taskValue).toLowerCase().includes(String(value).toLowerCase());
    
    case 'not_contains':
      return !String(taskValue).toLowerCase().includes(String(value).toLowerCase());
    
    case 'in':
      return Array.isArray(value) && value.includes(taskValue);
    
    case 'not_in':
      return Array.isArray(value) && !value.includes(taskValue);
    
    case 'greater_than':
      return Number(taskValue) > Number(value);
    
    case 'less_than':
      return Number(taskValue) < Number(value);
    
    case 'is_empty':
      return !taskValue || taskValue === '' || taskValue === null || taskValue === undefined;
    
    case 'is_not_empty':
      return !!taskValue && taskValue !== '' && taskValue !== null && taskValue !== undefined;
    
    case 'before':
      return new Date(taskValue) < new Date(value);
    
    case 'after':
      return new Date(taskValue) > new Date(value);
    
    case 'between':
      if (!Array.isArray(value) || value.length !== 2) return false;
      const dateValue = new Date(taskValue);
      return dateValue >= new Date(value[0]) && dateValue <= new Date(value[1]);
    
    default:
      return true;
  }
}

// Export for use in other components
import * as React from 'react';
