import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AttendanceDataRow, AttendanceDayKey, DailyRecord } from './types';
import type { SystemId } from '../../lib/id-types';

type AttendanceStoreState = {
  lockedMonths: Record<string, boolean>; // key: "YYYY-MM"
  toggleLock: (monthYear: string) => void;
  lockMonth: (monthYear: string) => void;
  unlockMonth: (monthYear: string) => void;
  
  // Data storage
  attendanceData: Record<string, AttendanceDataRow[]>; // key: "YYYY-MM"
  saveAttendanceData: (monthKey: string, data: AttendanceDataRow[]) => void;
  getAttendanceData: (monthKey: string) => AttendanceDataRow[] | null;
  updateEmployeeRecord: (
    monthKey: string,
    employeeSystemId: SystemId,
    dayKey: AttendanceDayKey,
    record: DailyRecord
  ) => void;
};

export const useAttendanceStore = create<AttendanceStoreState>()(
  persist(
    (set, get) => ({
      lockedMonths: {},
      lockMonth: (monthYear) =>
        set((state) => ({
          lockedMonths: {
            ...state.lockedMonths,
            [monthYear]: true,
          },
        })),
      unlockMonth: (monthYear) =>
        set((state) => {
          if (!state.lockedMonths[monthYear]) {
            return state;
          }
          const nextLocked = { ...state.lockedMonths };
          delete nextLocked[monthYear];
          return { lockedMonths: nextLocked };
        }),
      toggleLock: (monthYear) =>
        set((state) => {
          const isLocked = Boolean(state.lockedMonths[monthYear]);
          if (isLocked) {
            const nextLocked = { ...state.lockedMonths };
            delete nextLocked[monthYear];
            return { lockedMonths: nextLocked };
          }
          return {
            lockedMonths: {
              ...state.lockedMonths,
              [monthYear]: true,
            },
          };
        }),
      
      // Data management
      attendanceData: {},
      saveAttendanceData: (monthKey, data) =>
        set((state) => ({
          attendanceData: {
            ...state.attendanceData,
            [monthKey]: data,
          },
        })),
      getAttendanceData: (monthKey) => {
        return get().attendanceData[monthKey] || null;
      },
      updateEmployeeRecord: (monthKey, employeeSystemId, dayKey, record) =>
        set((state) => {
          const monthData = state.attendanceData[monthKey];
          if (!monthData) return state;
          
          const updatedData = monthData.map(emp => {
            if (emp.employeeSystemId === employeeSystemId) {
              return { ...emp, [dayKey]: record };
            }
            return emp;
          });
          
          return {
            attendanceData: {
              ...state.attendanceData,
              [monthKey]: updatedData,
            },
          };
        }),
    }),
    {
      name: 'hrm-attendance-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
