import { EmployeeRole } from "./roles.ts";
import { type SystemId } from "../../lib/id-config.ts";

export type Employee = {
  systemId: SystemId; // System-generated, immutable
  id: string; // User-facing, editable, e.g., "NV001".
  
  // Personal Info
  fullName: string;
  dob: string;
  placeOfBirth?: string;
  gender: "Nam" | "Nữ" | "Khác";
  nationalId?: string;
  nationalIdIssueDate?: string;
  nationalIdIssuePlace?: string;
  permanentAddress: string;
  temporaryAddress?: string;
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
  
  // Login Info
  password?: string; // Hashed password for login
  
  // Employment Info
  jobTitle: string;
  department: "Kỹ thuật" | "Nhân sự" | "Kinh doanh" | "Marketing";
  branchSystemId?: string; // ✅ Branch systemId (optional)
  hireDate: string;
  employeeType?: "Chính thức" | "Thử việc" | "Thực tập sinh" | "Bán thời gian";
  employmentStatus: "Đang làm việc" | "Tạm nghỉ" | "Đã nghỉ việc";
  terminationDate?: string;
  reasonForLeaving?: string;
  role: EmployeeRole;
  
  // Salary & Contract
  baseSalary: number;
  socialInsuranceSalary?: number;
  positionAllowance?: number;
  mealAllowance?: number;
  otherAllowances?: number;
  
  // Contract Information
  probationEndDate?: string;         // Ngày hết thử việc
  contractStartDate?: string;        // Ngày bắt đầu hợp đồng hiện tại
  contractEndDate?: string;          // Ngày hết hạn hợp đồng
  contractType?: "Không xác định" | "Thử việc" | "1 năm" | "2 năm" | "3 năm" | "Vô thời hạn";
  contractNumber?: string;           // Số hợp đồng
  
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
  
  // Organization Chart
  managerId?: string; // ID of the manager (for org chart hierarchy)
  positionX?: number; // X position in org chart
  positionY?: number; // Y position in org chart
  
  // Audit fields
  createdAt?: string; // ISO timestamp
  updatedAt?: string; // ISO timestamp
  deletedAt?: string | null; // ISO timestamp when soft-deleted
  isDeleted?: boolean; // Soft delete flag
  createdBy?: string; // Employee systemId who created this
  updatedBy?: string; // Employee systemId who last updated this
};
