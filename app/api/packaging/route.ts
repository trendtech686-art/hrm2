/**
 * Packaging List API Route
 * 
 * GET /api/packaging - List all packaging slips with pagination and filtering
 * 
 * Returns PackagingSlip[] with order info (customerName, branchName, orderId)
 * This replaces the pattern of loading ALL orders just to extract packagings.
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@/generated/prisma/client';
import { requireAuth, apiPaginated, apiError, parsePagination } from '@/lib/api-utils';
import { logError } from '@/lib/logger'
import { buildSearchWhere } from '@/lib/search/build-search-where'
import {
  packagingStatusLabels,
  printStatusLabels,
} from '@/lib/constants/order-status-labels';

export async function GET(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip } = parsePagination(searchParams);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const branchSystemId = searchParams.get('branchSystemId');

    const where: Prisma.PackagingWhereInput = {};

    // Status filter — accept both enum and Vietnamese labels
    if (status) {
      // Map Vietnamese label back to enum if needed
      const reverseStatusMap: Record<string, string> = {
        'Chờ đóng gói': 'PENDING',
        'Đang đóng gói': 'IN_PROGRESS',
        'Đã đóng gói': 'COMPLETED',
        'Hủy đóng gói': 'CANCELLED',
        'Đã hủy': 'CANCELLED',
      };
      const enumStatus = reverseStatusMap[status] || status;
      where.status = enumStatus as Prisma.EnumPackagingStatusFilter;
    }

    // Branch filter — Packaging has branchId directly
    if (branchSystemId) {
      where.branchId = branchSystemId;
    }

    const searchWhere = buildSearchWhere<Prisma.PackagingWhereInput>(search, [
      'id',
      'order.id',
      'order.customerName',
      'assignedEmployeeName',
    ])
    if (searchWhere) Object.assign(where, searchWhere)

    const [rawData, total] = await Promise.all([
      prisma.packaging.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          order: {
            select: {
              systemId: true,
              id: true,
              customerName: true,
              branchName: true,
            },
          },
        },
      }),
      prisma.packaging.count({ where }),
    ]);

    // Transform to PackagingSlip format
    const data = rawData.map(pkg => ({
      systemId: pkg.systemId,
      id: pkg.id,
      orderId: pkg.order?.id || '',
      orderSystemId: pkg.order?.systemId || '',
      customerName: pkg.order?.customerName || '',
      branchName: pkg.order?.branchName || '',
      requestDate: pkg.requestDate?.toISOString() || '',
      confirmDate: pkg.confirmDate?.toISOString() || undefined,
      cancelDate: pkg.cancelDate?.toISOString() || undefined,
      requestingEmployeeName: pkg.requestingEmployeeName || '',
      confirmingEmployeeName: pkg.confirmingEmployeeName || undefined,
      cancelingEmployeeName: pkg.cancelingEmployeeName || undefined,
      assignedEmployeeName: pkg.assignedEmployeeName || undefined,
      status: packagingStatusLabels[pkg.status] || pkg.status,
      printStatus: pkg.printStatus ? (printStatusLabels[pkg.printStatus] || pkg.printStatus) : 'Chưa in',
      cancelReason: pkg.cancelReason || undefined,
    }));

    return apiPaginated(data, { page, limit, total });
  } catch (error) {
    logError('Error fetching packaging slips', error);
    return apiError('Không thể tải danh sách đóng gói', 500);
  }
}
