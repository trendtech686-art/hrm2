/**
 * Attendance Data Fetcher (Server-side with caching)
 */

import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { CACHE_TTL, CACHE_TAGS } from '@/lib/cache';
import type { PaginatedResult } from './orders';

export interface AttendanceFilters {
  page?: number;
  limit?: number;
  employeeId?: string;
  branchId?: string;
  departmentId?: string;
  status?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AttendanceListItem {
  systemId: string;
  employeeName: string;
  employeeId: string;
  departmentName: string | null;
  date: Date;
  checkIn: Date | null;
  checkOut: Date | null;
  status: string;
  workHours: number | null;
  otHours: number | null;
  notes: string | null;
}

function buildAttendanceWhereClause(filters: AttendanceFilters) {
  const where: Record<string, unknown> = {};

  if (filters.employeeId) where.employeeId = filters.employeeId;
  // Filter by branch/department via employee relation
  if (filters.branchId || filters.departmentId) {
    const employeeFilter: Record<string, unknown> = {};
    if (filters.branchId) employeeFilter.branchId = filters.branchId;
    if (filters.departmentId) employeeFilter.departmentId = filters.departmentId;
    where.employee = employeeFilter;
  }
  if (filters.status) where.status = filters.status;

  if (filters.startDate || filters.endDate) {
    const dateFilter: Record<string, Date> = {};
    if (filters.startDate) dateFilter.gte = new Date(filters.startDate);
    if (filters.endDate) dateFilter.lte = new Date(filters.endDate);
    where.date = dateFilter;
  }

  return where;
}

async function fetchAttendance(filters: AttendanceFilters): Promise<PaginatedResult<AttendanceListItem>> {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const where = buildAttendanceWhereClause(filters);
  const orderBy: Record<string, 'asc' | 'desc'> = {};
  orderBy[filters.sortBy || 'date'] = filters.sortOrder || 'desc';

  const [data, total] = await Promise.all([
    prisma.attendanceRecord.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        systemId: true,
        date: true,
        checkIn: true,
        checkOut: true,
        status: true,
        workHours: true,
        otHours: true,
        notes: true,
        fullName: true,
        department: true,
        employee: {
          select: {
            systemId: true,
            fullName: true,
            department: { select: { name: true } },
          },
        },
      },
    }),
    prisma.attendanceRecord.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: data.map(a => ({
      systemId: a.systemId,
      employeeName: a.fullName || a.employee?.fullName || 'Unknown',
      employeeId: a.employee?.systemId || '',
      departmentName: a.department || a.employee?.department?.name || null,
      date: a.date,
      checkIn: a.checkIn,
      checkOut: a.checkOut,
      status: a.status,
      workHours: a.workHours?.toNumber() || null,
      otHours: a.otHours?.toNumber() || null,
      notes: a.notes,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

export const getAttendance = cache(async (filters: AttendanceFilters = {}) => {
  const cacheKey = `attendance:${JSON.stringify(filters)}`;
  
  return unstable_cache(
    () => fetchAttendance(filters),
    [cacheKey],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.ATTENDANCE] }
  )();
});

export const getTodayAttendance = cache(async (branchId?: string) => {
  return unstable_cache(
    async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const where: Record<string, unknown> = {
        date: { gte: today, lt: tomorrow },
      };
      if (branchId) where.employee = { branchId };

      const [present, absent, late, halfDay] = await Promise.all([
        prisma.attendanceRecord.count({ where: { ...where, status: 'PRESENT' } }),
        prisma.attendanceRecord.count({ where: { ...where, status: 'ABSENT' } }),
        prisma.attendanceRecord.count({ where: { ...where, status: 'LATE' } }),
        prisma.attendanceRecord.count({ where: { ...where, status: 'HALF_DAY' } }),
      ]);

      return { present, absent, late, halfDay, total: present + absent + late + halfDay };
    },
    [`today-attendance-${branchId || 'all'}`],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.ATTENDANCE] }
  )();
});

export const getAttendanceSummary = cache(async (employeeId: string, month: number, year: number) => {
  return unstable_cache(
    async () => {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const records = await prisma.attendanceRecord.findMany({
        where: {
          employeeId,
          date: { gte: startDate, lte: endDate },
        },
        select: {
          date: true,
          status: true,
          workHours: true,
          otHours: true,
        },
      });

      const summary = {
        totalDays: records.length,
        presentDays: records.filter(r => r.status === 'PRESENT').length,
        absentDays: records.filter(r => r.status === 'ABSENT').length,
        lateDays: records.filter(r => r.status === 'LATE').length,
        totalWorkHours: records.reduce((sum, r) => sum + (r.workHours?.toNumber() || 0), 0),
        totalOvertime: records.reduce((sum, r) => sum + (r.otHours?.toNumber() || 0), 0),
      };

      return summary;
    },
    [`attendance-summary-${employeeId}-${month}-${year}`],
    { revalidate: CACHE_TTL.MEDIUM, tags: [CACHE_TAGS.ATTENDANCE] }
  )();
});
