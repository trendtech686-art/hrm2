/**
 * Local State Hook for Attendance Page
 * Manages client-side state for locked months and attendance data
 * 
 * Note: This is a temporary solution until backend persistence is implemented
 */
import { useState, useCallback } from 'react';
import type { AttendanceDataRow } from '../types';

interface AttendanceLocalState {
  lockedMonths: Record<string, boolean>;
  attendanceData: Record<string, AttendanceDataRow[]>;
}

const STORAGE_KEY = 'attendance-local-state';

const getInitialState = (): AttendanceLocalState => {
  if (typeof window === 'undefined') {
    return { lockedMonths: {}, attendanceData: {} };
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load attendance local state:', error);
  }
  return { lockedMonths: {}, attendanceData: {} };
};

const saveToStorage = (state: AttendanceLocalState) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save attendance local state:', error);
  }
};

export function useAttendanceLocalState() {
  const [state, setState] = useState<AttendanceLocalState>(getInitialState);

  const toggleLock = useCallback((monthKey: string) => {
    setState(prev => {
      const isLocked = Boolean(prev.lockedMonths[monthKey]);
      const newLockedMonths = { ...prev.lockedMonths };
      
      if (isLocked) {
        delete newLockedMonths[monthKey];
      } else {
        newLockedMonths[monthKey] = true;
      }
      
      const newState = {
        ...prev,
        lockedMonths: newLockedMonths,
      };
      
      saveToStorage(newState);
      return newState;
    });
  }, []);

  const saveAttendanceData = useCallback((monthKey: string, data: AttendanceDataRow[]) => {
    setState(prev => {
      const newState = {
        ...prev,
        attendanceData: {
          ...prev.attendanceData,
          [monthKey]: data,
        },
      };
      
      saveToStorage(newState);
      return newState;
    });
  }, []);

  const getAttendanceData = useCallback((monthKey: string): AttendanceDataRow[] | null => {
    return state.attendanceData[monthKey] || null;
  }, [state.attendanceData]);

  return {
    lockedMonths: state.lockedMonths,
    toggleLock,
    saveAttendanceData,
    getAttendanceData,
  };
}
