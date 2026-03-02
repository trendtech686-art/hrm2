/**
 * Reconciliation List API Route
 * 
 * GET /api/reconciliation - List packaging items pending COD reconciliation
 * 
 * Filters: deliveryStatus = DELIVERED, codAmount > 0, reconciliationStatus != 'Đã đối soát'
 * Returns items with order info (orderId, orderSystemId, customerName)
 * 
 * This replaces the pattern of loading ALL orders just to extract
 * packaging items needing reconciliation.
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@/generated/prisma/client';
import { requireAuth, apiPaginated, apiError, parsePagination } from '@/lib/api-utils';
import {
  deliveryStatusLabels,
  printStatusLabels,
} from '@/lib/constants/order-status-labels';

export async function GET(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip } = parsePagination(searchParams);
    const search = searchParams.get('search') || '';
    const carrier = searchParams.get('carrier');
    const branchSystemId = searchParams.get('branchSystemId');

    const where: Prisma.PackagingWhereInput = {
      // Core reconciliation conditions:
      // 1. Delivered
      deliveryStatus: 'DELIVERED',
      // 2. Has COD amount > 0
      codAmount: { gt: 0 },
      // 3. Not yet reconciled
      NOT: { reconciliationStatus: 'Đã đối soát' },
    };

    // Carrier filter
    if (carrier) {
      where.carrier = carrier;
    }

    // Branch filter
    if (branchSystemId) {
      where.branchId = branchSystemId;
    }

    // Search filter
    if (search) {
      where.AND = [
        {
          OR: [
            { trackingCode: { contains: search, mode: 'insensitive' } },
            { order: { id: { contains: search, mode: 'insensitive' } } },
            { order: { customerName: { contains: search, mode: 'insensitive' } } },
            { carrier: { contains: search, mode: 'insensitive' } },
          ],
        },
      ];
    }

    const [rawData, total] = await Promise.all([
      prisma.packaging.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          order: {
            select: {
              systemId: true,
              id: true,
              customerName: true,
            },
          },
        },
      }),
      prisma.packaging.count({ where }),
    ]);

    // Transform to ReconciliationItem format (includes fields for export)
    const data = rawData.map(pkg => ({
      systemId: pkg.systemId,
      id: pkg.id,
      orderId: pkg.order.id,
      orderSystemId: pkg.order.systemId,
      customerName: pkg.order.customerName || '',
      trackingCode: pkg.trackingCode || '',
      carrier: pkg.carrier || '',
      service: pkg.service || '',
      codAmount: pkg.codAmount ? Number(pkg.codAmount) : 0,
      shippingFeeToPartner: pkg.shippingFeeToPartner ? Number(pkg.shippingFeeToPartner) : 0,
      payer: pkg.payer || '',
      reconciliationStatus: pkg.reconciliationStatus || 'Chưa đối soát',
      deliveryStatus: pkg.deliveryStatus ? (deliveryStatusLabels[pkg.deliveryStatus] || pkg.deliveryStatus) : '',
      deliveredDate: pkg.deliveredDate?.toISOString() || '',
      status: pkg.status || '',
      printStatus: pkg.printStatus ? (printStatusLabels[pkg.printStatus] || pkg.printStatus) : 'Chưa in',
      requestDate: pkg.requestDate?.toISOString() || '',
      confirmDate: pkg.confirmDate?.toISOString() || '',
      requestingEmployeeName: pkg.requestingEmployeeName || '',
      confirmingEmployeeName: pkg.confirmingEmployeeName || '',
      createdAt: pkg.createdAt?.toISOString() || '',
    }));

    return apiPaginated(data, { page, limit, total });
  } catch (error) {
    console.error('Error fetching reconciliation items:', error);
    return apiError('Failed to fetch reconciliation items', 500);
  }
}
