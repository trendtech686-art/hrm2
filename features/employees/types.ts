import { EmployeeRole } from "./roles.ts";
import { type SystemId, type BusinessId } from "../../lib/id-types.ts";
import type { HistoryEntry } from "../../components/ActivityHistory.tsx";

/**
 * Address input level - Determines whether address uses 2-level or 3-level format
 * - 2-level: Province + Ward (Tỉnh/TP + Phường/Xã) - District auto-filled
 * - 3-level: Province + District + Ward (Tỉnh/TP + Quận/Huyện + Phường/Xã)
 */
export type AddressInputLevel = '2-level' | '3-level';

/**
 * Base address fields shared by both 2-level and 3-level formats
 */
interface BaseAddress {
  street: string;              // Số nhà, đường (e.g., "123 Nguyễn Văn Linh")
  province: string;            // Tỉnh/Thành phố (e.g., "TP Hồ Chí Minh")
  provinceId: string;          // Province ID (e.g., "79")
}

/**
 * 2-Level Address - Province + Ward (District auto-filled)
 * Simpler input for users who know their ward directly
 */
export interface TwoLevelAddress extends BaseAddress {
  inputLevel: '2-level';
  ward: string;                // Phường/Xã (e.g., "Phường Tân Phú")
  wardId: string;              // Ward ID (e.g., "27259")
  district: string;            // Auto-filled from ward data
  districtId: number;          // Auto-filled from ward data
}

/**
 * 3-Level Address - Province + District + Ward (Full hierarchy)
 * Traditional hierarchical input
 */
export interface ThreeLevelAddress extends BaseAddress {
  inputLevel: '3-level';
  district: string;            // Quận/Huyện (e.g., "Quận 7")
  districtId: number;          // District ID (e.g., 769)
  ward: string;                // Phường/Xã (e.g., "Phường Tân Phú")
  wardId: string;              // Ward ID (e.g., "27259")
}

/**
 * Structured address data - Union type supporting both formats
 * Chuẩn cho cả mock store và database thật
 * Supports seamless conversion between 2-level and 3-level formats without data loss
 */
export type EmployeeAddress = TwoLevelAddress | ThreeLevelAddress;

/**
 * Type guard to check if address is 2-level format
 */
export function isTwoLevelAddress(address: EmployeeAddress): address is TwoLevelAddress {
  return address.inputLevel === '2-level';
}

/**
 * Type guard to check if address is 3-level format
 */
export function isThreeLevelAddress(address: EmployeeAddress): address is ThreeLevelAddress {
  return address.inputLevel === '3-level';
}

/**
 * Helper to create empty address with specified level
 */
export function createEmptyAddress(level: AddressInputLevel): EmployeeAddress {
  const base = {
    street: '',
    province: '',
    provinceId: '',
    district: '',
    districtId: 0,
    ward: '',
    wardId: '',
  };
  return { ...base, inputLevel: level } as EmployeeAddress;
}

export type Employee = {
  systemId: SystemId; // System-generated, immutable
  id: BusinessId; // User-facing, editable, e.g., "NV001".
  
  // Personal Info
  fullName: string;
  dob: string;
  placeOfBirth?: string;
  gender: "Nam" | "Nữ" | "Khác";
  nationalId?: string;
  nationalIdIssueDate?: string;
  nationalIdIssuePlace?: string;
  
  // Địa chỉ nhân viên (hệ thống 2 cấp)
  permanentAddress?: EmployeeAddress | null; // Địa chỉ thường trú
  temporaryAddress?: EmployeeAddress | null; // Địa chỉ tạm trú
  
  phone: string;
  personalEmail: string;
  workEmail: string;
  maritalStatus?: "Độc thân" | "Đã kết hôn" | "Khác";
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  personalTaxId?: string;
  socialInsuranceNumber?: string;
  bankAccountNumber?: string;
  bankName?: string;
  bankBranch?: string;
  avatarUrl?: string;
  avatar?: string;
  
  // Login Info
  password?: string; // Hashed password for login
  
  // Employment Info
  jobTitle: string;
  department?: "Kỹ thuật" | "Nhân sự" | "Kinh doanh" | "Marketing" | undefined;
  departmentId?: SystemId | undefined;
  departmentName?: string;
  branchSystemId?: SystemId | undefined; // ✅ Branch systemId (optional)
  hireDate: string;
  startDate?: string;
  endDate?: string;
  employeeType?: "Chính thức" | "Thử việc" | "Thực tập sinh" | "Bán thời gian";
  employmentStatus: "Đang làm việc" | "Tạm nghỉ" | "Đã nghỉ việc";
  status?: "active" | "resigned" | "inactive" | "terminated";
  terminationDate?: string;
  reasonForLeaving?: string;
  role: EmployeeRole;
  
  // Salary & Contract
  baseSalary: number;
  socialInsuranceSalary?: number;
  positionAllowance?: number;
  mealAllowance?: number;
  otherAllowances?: number;
  numberOfDependents?: number;  // Số người phụ thuộc (giảm trừ gia cảnh)
  contractNumber?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  
  // Contract Information
  probationEndDate?: string;         // Ngày hết thử việc
  contractType?: "Không xác định" | "Thử việc" | "1 năm" | "2 năm" | "3 năm" | "Vô thời hạn";
  
  // Work Schedule
  workingHoursPerDay?: number;       // Giờ làm mặc định (8h)
  workingDaysPerWeek?: number;       // Ngày làm/tuần (5 hoặc 6)
  shiftType?: "Hành chính" | "Ca sáng" | "Ca chiều" | "Ca đêm" | "Luân ca";
  
  // Performance & Review
  performanceRating?: "Xuất sắc" | "Tốt" | "Đạt yêu cầu" | "Cần cải thiện";
  lastReviewDate?: string;           // Lần đánh giá gần nhất
  nextReviewDate?: string;           // Lần đánh giá tiếp theo
  
  // Skills & Certifications
  skills?: string[];                 // Kỹ năng (JSON array)
  certifications?: string[];         // Chứng chỉ (JSON array)
  
  // Notes
  notes?: string;                    // Ghi chú nội bộ
  
  // Leave
  // FIX: Added missing `leaveTaken` property to satisfy the Employee type.
  leaveTaken: number;
  paidLeaveTaken?: number;
  unpaidLeaveTaken?: number;
  annualLeaveTaken?: number;
  annualLeaveBalance?: number;
  
  // Organization Chart
  managerId?: SystemId | undefined; // SystemId of the manager (for org chart hierarchy)
  positionX?: number; // X position in org chart
  positionY?: number; // Y position in org chart
  positionId?: SystemId | undefined;
  positionName?: string;
  
  // Audit fields
  createdAt?: string; // ISO timestamp
  updatedAt?: string; // ISO timestamp
  deletedAt?: string | null; // ISO timestamp when soft-deleted
  isDeleted?: boolean; // Soft delete flag
  createdBy?: SystemId; // Employee systemId who created this
  updatedBy?: SystemId; // Employee systemId who last updated this
  
  // Activity History
  activityHistory?: HistoryEntry[];
};
