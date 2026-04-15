/**
 * Recurring Tasks Helper Hooks
 * Provides derived data and utility functions for recurring tasks
 */

import * as React from 'react';
import { useRecurringTasks } from './use-recurring-tasks';
import type { RecurrenceFrequency, RecurrencePattern } from '../recurring-types';
import { calculateNextOccurrence, shouldContinueRecurrence } from '../recurring-types';

/**
 * Returns all recurring tasks with helper functions
 * Compatible with legacy store pattern
 */
export function useAllRecurringTasks() {
  const query = useRecurringTasks();
  
  // Memoize data to prevent callback deps warnings
  const data = React.useMemo(() => query.data || [], [query.data]);
  
  // Get active recurring tasks
  const getActive = React.useCallback(() => {
    return data.filter(rt => rt.isActive && !rt.isPaused);
  }, [data]);
  
  // Get paused recurring tasks
  const getPaused = React.useCallback(() => {
    return data.filter(rt => rt.isActive && rt.isPaused);
  }, [data]);
  
  // Get tasks that need processing
  const getReadyToProcess = React.useCallback(() => {
    const now = new Date();
    return data.filter(rt => {
      if (!rt.isActive || rt.isPaused) return false;
      
      const pattern = (rt.recurrencePattern || rt.pattern) as unknown as RecurrencePattern;
      if (!pattern) return false;
      const nextOccurrence = calculateNextOccurrence(pattern, now);
      if (!nextOccurrence) return false;
      
      return nextOccurrence <= now && shouldContinueRecurrence(pattern, 0, now);
    });
  }, [data]);
  
  // Get tasks by frequency
  const getByFrequency = React.useCallback((frequency: RecurrenceFrequency) => {
    return data.filter(rt => {
      if (!rt.isActive) return false;
      const pattern = (rt.recurrencePattern || rt.pattern) as unknown as RecurrencePattern;
      if (!pattern) return false;
      return pattern.frequency === frequency;
    });
  }, [data]);
  
  // Find recurring task by ID
  const findById = React.useCallback((systemId: string | undefined) => {
    if (!systemId) return undefined;
    return data.find(rt => rt.systemId === systemId);
  }, [data]);
  
  // Get statistics
  const stats = React.useMemo(() => {
    const active = data.filter(rt => rt.isActive && !rt.isPaused).length;
    const paused = data.filter(rt => rt.isActive && rt.isPaused).length;
    const inactive = data.filter(rt => !rt.isActive).length;
    
    return {
      total: data.length,
      active,
      paused,
      inactive,
    };
  }, [data]);
  
  return {
    data,
    getActive,
    getPaused,
    getReadyToProcess,
    getByFrequency,
    findById,
    stats,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}

/**
 * Returns recurring tasks formatted as options for Select/Combobox
 */
export function useRecurringTaskOptions() {
  const { data, isLoading } = useAllRecurringTasks();
  
  const options = React.useMemo(() => {
    return data
      .filter(rt => rt.isActive && !rt.isPaused)
      .map(rt => {
        const pattern = (rt.recurrencePattern || rt.pattern) as unknown as RecurrencePattern;
        return {
          value: rt.systemId,
          label: rt.title,
          frequency: pattern?.frequency,
        };
      });
  }, [data]);
  
  return { options, isLoading };
}
