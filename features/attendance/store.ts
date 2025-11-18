import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AttendanceDataRow } from './types.ts';

type AttendanceStoreState = {
  lockedMonths: Record<string, boolean>; // key: "YYYY-MM"
  toggleLock: (monthYear: string) => void;
  
  // Data storage
  attendanceData: Record<string, AttendanceDataRow[]>; // key: "YYYY-MM"
  saveAttendanceData: (monthKey: string, data: AttendanceDataRow[]) => void;
  getAttendanceData: (monthKey: string) => AttendanceDataRow[] | null;
  updateEmployeeRecord: (monthKey: string, employeeId: string, dayKey: string, record: any) => void;
};

export const useAttendanceStore = create<AttendanceStoreState>()(
  persist(
    (set, get) => ({
      lockedMonths: {},
      toggleLock: (monthYear) =>
        set((state) => {
          const newLockedMonths = { ...state.lockedMonths };
          if (newLockedMonths[monthYear]) {
            delete newLockedMonths[monthYear];
          } else {
            newLockedMonths[monthYear] = true;
          }
          return { lockedMonths: newLockedMonths };
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
      updateEmployeeRecord: (monthKey, employeeId, dayKey, record) =>
        set((state) => {
          const monthData = state.attendanceData[monthKey];
          if (!monthData) return state;
          
          const updatedData = monthData.map(emp => {
            if (emp.id === employeeId) {
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
