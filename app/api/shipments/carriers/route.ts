/**
 * GET /api/shipments/carriers - Get unique carrier names
 * Lightweight endpoint for filter dropdown
 */

import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils';

export async function GET() {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const results = await prisma.shipment.findMany({
      select: { carrier: true },
      distinct: ['carrier'],
      where: { carrier: { not: '' } },
      orderBy: { carrier: 'asc' },
    });

    const carriers = results.map(r => r.carrier).filter(Boolean);
    return apiSuccess(carriers);
  } catch (error) {
    console.error('Error fetching carriers:', error);
    return apiError('Failed to fetch carriers', 500);
  }
}
