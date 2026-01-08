// Re-export all attendance types from central prisma-extended
export type {
  AttendanceStatus,
  DailyRecord,
  DepartmentName,
  AttendanceDayKey,
  AttendanceDayRecords,
  AttendanceSummaryFields,
  AttendanceDataRow,
  AnyAttendanceDataRow,
  ImportPreviewRow,
} from '@/lib/types/prisma-extended';
