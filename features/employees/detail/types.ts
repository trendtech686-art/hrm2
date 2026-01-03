'use client'

import type { Employee, EmployeeAddress } from '@/lib/types/prisma-extended';
import type { Payslip, PayrollBatch } from '@/lib/payroll-types';
import type { PenaltyStatus } from '@/features/settings/penalties/types';
import type { LeaveStatus } from '@/features/leaves/types';
import { formatDateCustom } from '@/lib/date-utils';

// ============ Helper Functions ============

export const formatCurrency = (value?: number) => {
    if (typeof value !== 'number') return '-';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

export const formatMonthLabel = (monthKey?: string) => {
    if (!monthKey) return '—';
    const [year, month] = monthKey.split('-');
    return `Tháng ${month}/${year}`;
};

export const formatDateDisplay = (dateString?: string) => {
    if (!dateString) return '-';
    return formatDateCustom(new Date(dateString), "dd/MM/yyyy");
};

/**
 * Format EmployeeAddress thành chuỗi hiển thị
 * - 3-cấp: "123 ABC, Quận 7, Phường Tân Phú, TP.HCM" (đầy đủ District + Ward)
 * - 2-cấp: "123 ABC, Phường Tân Phú, TP.HCM" (chỉ Ward, bỏ District)
 */
export const formatAddressDisplay = (addr: EmployeeAddress | null | undefined): string => {
    if (!addr) return '-';
    
    const { street, ward, district, province, inputLevel } = addr;
    
    if (inputLevel === '3-level') {
        // 3-cấp: Hiển thị District + Ward
        return [street, district, ward, province].filter(Boolean).join(', ') || '-';
    } else {
        // 2-cấp: Chỉ hiển thị Ward (bỏ District)
        return [street, ward, province].filter(Boolean).join(', ') || '-';
    }
};

// ============ Badge Variants ============

export const penaltyStatusVariants: Record<PenaltyStatus, "warning" | "success" | "secondary"> = {
    "Chưa thanh toán": "warning", 
    "Đã thanh toán": "success", 
    "Đã hủy": "secondary",
};

export const leaveStatusVariants: Record<LeaveStatus, "success" | "warning" | "destructive"> = {
    "Chờ duyệt": "warning",
    "Đã duyệt": "success",
    "Đã từ chối": "destructive",
};

export const employmentStatusBadgeVariants: Record<Employee["employmentStatus"], "default" | "secondary" | "destructive"> = {
    "Đang làm việc": "default",
    "Tạm nghỉ": "secondary",
    "Đã nghỉ việc": "destructive",
};

// ============ Types ============

export interface PayrollHistoryRow {
    systemId: string;
    batchId: string;
    monthLabel: string;
    payDate: string;
    status: 'draft' | 'reviewed' | 'locked' | 'cancelled';
    grossEarnings: number;
    totalInsurance: number;
    personalIncomeTax: number;
    otherDeductions: number;
    totalDeductions: number;
    netPay: number;
    batchSystemId?: string;
    payslipSystemId: string;
    // For print functionality
    slip: Payslip;
    batch?: PayrollBatch;
}

export interface AttendanceHistoryRow {
    systemId: string;
    monthKey: string;
    monthLabel: string;
    workDays: number;
    leaveDays: number;
    absentDays: number;
    lateArrivals: number;
    earlyDepartures: number;
    otHours: number;
    locked: boolean;
}

export interface TaskRow {
    systemId: string;
    title: string;
    type: string;
    dueDate?: string;
    statusVariant: 'default' | 'secondary' | 'warning' | 'success' | 'destructive';
    statusName: string;
    link: string;
}
