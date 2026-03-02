/**
 * Shipments Data Fetcher (Server-side with caching)
 */

import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { CACHE_TTL, CACHE_TAGS } from '@/lib/cache';
import type { PaginatedResult } from './orders';

export interface ShipmentFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  branchId?: string;
  carrierId?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ShipmentListItem {
  systemId: string;
  id: string;
  orderId: string;
  recipientName: string | null;
  recipientPhone: string | null;
  recipientAddress: string | null;
  status: string;
  carrier: string;
  trackingCode: string | null;
  createdAt: Date;
  pickedAt: Date | null;
  deliveredAt: Date | null;
}

import type { Prisma } from '@/generated/prisma/client';

function buildShipmentWhereClause(filters: ShipmentFilters): Prisma.ShipmentWhereInput {
  const where: Prisma.ShipmentWhereInput = {};

  if (filters.search) {
    where.OR = [
      { id: { contains: filters.search, mode: 'insensitive' } },
      { trackingCode: { contains: filters.search, mode: 'insensitive' } },
      { recipientName: { contains: filters.search, mode: 'insensitive' } },
      { recipientPhone: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.status) where.status = filters.status as Prisma.ShipmentWhereInput['status'];
  if (filters.carrierId) where.carrier = filters.carrierId;

  if (filters.startDate || filters.endDate) {
    where.createdAt = {};
    if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
    if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
  }

  return where;
}

async function fetchShipments(filters: ShipmentFilters): Promise<PaginatedResult<ShipmentListItem>> {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const where = buildShipmentWhereClause(filters);
  const orderBy: Prisma.ShipmentOrderByWithRelationInput = {
    [filters.sortBy || 'createdAt']: filters.sortOrder || 'desc'
  };

  const [data, total] = await Promise.all([
    prisma.shipment.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        systemId: true,
        id: true,
        orderId: true,
        recipientName: true,
        recipientPhone: true,
        recipientAddress: true,
        status: true,
        carrier: true,
        trackingCode: true,
        createdAt: true,
        pickedAt: true,
        deliveredAt: true,
      },
    }),
    prisma.shipment.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: data.map(s => ({
      systemId: s.systemId,
      id: s.id,
      orderId: s.orderId,
      recipientName: s.recipientName,
      recipientPhone: s.recipientPhone,
      recipientAddress: s.recipientAddress,
      status: s.status,
      carrier: s.carrier,
      trackingCode: s.trackingCode,
      createdAt: s.createdAt,
      pickedAt: s.pickedAt,
      deliveredAt: s.deliveredAt,
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

export const getShipments = cache(async (filters: ShipmentFilters = {}) => {
  const cacheKey = `shipments-${JSON.stringify(filters)}`;
  
  return unstable_cache(
    () => fetchShipments(filters),
    [cacheKey],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.SHIPMENTS] }
  )();
});

export const getShipmentById = cache(async (id: string) => {
  return unstable_cache(
    async () => {
      return prisma.shipment.findUnique({
        where: { systemId: id },
        include: {
          order: true,
          packaging: true,
        },
      });
    },
    [`shipment-${id}`],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.SHIPMENTS] }
  )();
});

export const getShipmentStats = cache(async (branchId?: string) => {
  return unstable_cache(
    async () => {
      const where: Prisma.ShipmentWhereInput = {};
      if (branchId) where.order = { branchId };

      const [pending, inTransit, delivered, returned] = await Promise.all([
        prisma.shipment.count({ where: { ...where, status: 'PENDING' } }),
        prisma.shipment.count({ where: { ...where, status: 'IN_TRANSIT' } }),
        prisma.shipment.count({ where: { ...where, status: 'DELIVERED' } }),
        prisma.shipment.count({ where: { ...where, status: 'RETURNED' } }),
      ]);

      return { pending, inTransit, shipped: inTransit, delivered, returned };
    },
    [`shipment-stats-${branchId || 'all'}`],
    { revalidate: CACHE_TTL.SHORT, tags: [CACHE_TAGS.SHIPMENTS] }
  )();
});
