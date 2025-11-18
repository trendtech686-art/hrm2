export type LeaveStatus = "Chờ duyệt" | "Đã duyệt" | "Đã từ chối";

export type LeaveRequest = {
  // FIX: Added missing systemId
  systemId: string;
  id: string; // LP001
  employeeSystemId: string; // System ID for data relationships
  employeeId: string; // Display ID (e.g., "NV001") for UI
  employeeName: string;
  leaveTypeName: string; // e.g., "Phép năm", "Nghỉ ốm"
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  numberOfDays: number;
  reason: string;
  status: LeaveStatus;
  requestDate: string; // YYYY-MM-DD
};
