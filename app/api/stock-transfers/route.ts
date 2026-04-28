/**
 * Stock Transfers API Route
 * 
 * GET    /api/stock-transfers       - List all stock transfers with pagination
 * POST   /api/stock-transfers       - Create new stock transfer
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@/generated/prisma/client';
import { StockTransferStatus } from '@/generated/prisma/client';
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils';
import { createStockTransferSchema } from './validation';
import { generateNextIdsWithTx } from '@/lib/id-system';
import { logError } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { getUserNameFromDb } from '@/lib/get-user-name'
import { buildSearchWhere } from '@/lib/search/build-search-where'

// Interface for stock transfer item input
interface StockTransferItemInput {
  productSystemId: string;
  productId: string;
  productName?: string;
  productSku?: string;
  quantity?: number;
  note?: string;
  notes?: string;
}

// GET - List stock transfers
export async function GET(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const searchParams = request.nextUrl.searchParams;
    const { page, limit, skip } = parsePagination(searchParams);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const fromBranchId = searchParams.get('fromBranchId');
    const toBranchId = searchParams.get('toBranchId');
    const productSystemId = searchParams.get('productSystemId');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';
    const _includeDeleted = searchParams.get('includeDeleted') === 'true';

    const where: Prisma.StockTransferWhereInput = {};
    
    // Note: StockTransfer model doesn't have isDeleted field
    // Filter by status instead if needed
    
    const searchWhere = buildSearchWhere<Prisma.StockTransferWhereInput>(search, ['id', 'notes'])
    if (searchWhere) Object.assign(where, searchWhere)

    if (status && status !== 'all') {
      where.status = status as StockTransferStatus;
    }

    if (fromBranchId && fromBranchId !== 'all') {
      where.fromBranchSystemId = fromBranchId;
    }

    if (toBranchId && toBranchId !== 'all') {
      where.toBranchSystemId = toBranchId;
    }

    // ⚡ Filter by product - stock transfers containing items for this product
    if (productSystemId) {
      where.items = { some: { productId: productSystemId } };
    }

    // Build orderBy
    const orderBy: Prisma.StockTransferOrderByWithRelationInput = { [sortBy]: sortOrder };

    const [data, total] = await Promise.all([
      prisma.stockTransfer.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          systemId: true,
          id: true,
          fromBranchId: true,
          toBranchId: true,
          employeeId: true,
          transferDate: true,
          receivedDate: true,
          status: true,
          notes: true,
          createdAt: true,
          updatedAt: true,
          createdBy: true,
          updatedBy: true,
          referenceCode: true,
          fromBranchSystemId: true,
          fromBranchName: true,
          toBranchSystemId: true,
          toBranchName: true,
          createdDate: true,
          createdBySystemId: true,
          createdByName: true,
          transferredDate: true,
          transferredBySystemId: true,
          transferredByName: true,
          receivedBySystemId: true,
          receivedByName: true,
          cancelledDate: true,
          cancelledBySystemId: true,
          cancelledByName: true,
          cancelReason: true,
          items: {
            select: {
              systemId: true,
              transferId: true,
              productId: true,
              productName: true,
              productSku: true,
              quantity: true,
              receivedQty: true,
            },
          },
        },
      }),
      prisma.stockTransfer.count({ where }),
    ]);

    // Get all product IDs from items to fetch costPrices
    const productIds = [...new Set(data.flatMap(t => t.items.map(i => i.productId).filter(Boolean)))];
    const products = productIds.length > 0 
      ? await prisma.product.findMany({
          where: { systemId: { in: productIds as string[] } },
          select: { systemId: true, costPrice: true },
        })
      : [];
    const productPriceMap = new Map(products.map(p => [p.systemId, p.costPrice]));

    // Transform data with calculated totalValue
    const transformedData = data.map(transfer => {
      const totalValue = transfer.items.reduce((sum, item) => {
        const costPrice = item.productId ? (productPriceMap.get(item.productId) || 0) : 0;
        return sum + (Number(costPrice) * item.quantity);
      }, 0);
      
      return {
        ...transfer,
        status: transfer.status.toLowerCase(),
        totalValue,
      };
    });

    return apiPaginated(transformedData, { page, limit, total });
  } catch (error) {
    logError('[Stock Transfers API] GET error', error);
    return apiError('Lỗi khi lấy danh sách phiếu chuyển kho', 500);
  }
}

// POST - Create new stock transfer
export async function POST(request: NextRequest) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  const result = await validateBody(request, createStockTransferSchema);
  if (!result.success) {
    logError('[Stock Transfers API] Validation error', result.error);
    return apiError(result.error, 400);
  }

  try {
    const data = result.data;
    
    // Normalize branch IDs - support both old format (fromBranchId) and new format (fromBranchSystemId)
    const fromBranchId = data.fromBranchSystemId || data.fromBranchId || '';
    const toBranchId = data.toBranchSystemId || data.toBranchId || '';
    
    if (!fromBranchId || !toBranchId) {
      return apiError('Chi nhánh nguồn và chi nhánh đích là bắt buộc', 400);
    }

    const stockTransfer = await prisma.$transaction(async (tx) => {
      // Generate IDs
      const { systemId, businessId } = await generateNextIdsWithTx(
        tx,
        'stock-transfers',
        data.id?.trim() || undefined
      );
      
      // Generate item systemIds
      const itemsWithIds = data.items?.map((item: StockTransferItemInput, index: number) => ({
        systemId: `${systemId}-ITEM${String(index + 1).padStart(3, '0')}`,
        productId: item.productSystemId || item.productId, // Support both formats
        productName: item.productName || '',
        productSku: item.productSku || item.productId || '', // Use productId as SKU fallback
        quantity: item.quantity || 1,
      })) || [];
      
      return tx.stockTransfer.create({
        data: {
          systemId,
          id: businessId,
          fromBranchId,
          toBranchId,
          fromBranchSystemId: data.fromBranchSystemId || fromBranchId,
          fromBranchName: data.fromBranchName || null,
          toBranchSystemId: data.toBranchSystemId || toBranchId,
          toBranchName: data.toBranchName || null,
          referenceCode: data.referenceCode || null,
          employeeId: data.employeeId || null,
          transferDate: data.transferDate ? new Date(data.transferDate) : new Date(),
          receivedDate: data.receivedDate ? new Date(data.receivedDate) : null,
          status: ((data.status || 'draft').toUpperCase()) as StockTransferStatus,
          notes: data.notes || data.note || null,
          note: data.note || data.notes || null,
          createdBy: data.createdBy || null,
          createdBySystemId: data.createdBySystemId || null,
          createdByName: data.createdByName || null,
          updatedBy: data.updatedBy || null,
          items: itemsWithIds.length ? {
            create: itemsWithIds,
          } : undefined,
        },
        select: {
          systemId: true,
          id: true,
          fromBranchId: true,
          toBranchId: true,
          employeeId: true,
          transferDate: true,
          receivedDate: true,
          status: true,
          notes: true,
          createdAt: true,
          updatedAt: true,
          createdBy: true,
          updatedBy: true,
          referenceCode: true,
          fromBranchSystemId: true,
          fromBranchName: true,
          toBranchSystemId: true,
          toBranchName: true,
          createdDate: true,
          createdBySystemId: true,
          createdByName: true,
          transferredDate: true,
          transferredBySystemId: true,
          transferredByName: true,
          receivedBySystemId: true,
          receivedByName: true,
          cancelledDate: true,
          cancelledBySystemId: true,
          cancelledByName: true,
          cancelReason: true,
          items: {
            select: {
              systemId: true,
              transferId: true,
              productId: true,
              productName: true,
              productSku: true,
              quantity: true,
              receivedQty: true,
            },
          },
        },
      });
    });

    // Transform status to lowercase for frontend compatibility
    const transformedResult = {
      ...stockTransfer,
      status: stockTransfer.status.toLowerCase(),
    };

    // ✅ Notify employee assigned to the transfer
    if (stockTransfer.employeeId && stockTransfer.employeeId !== session.user?.employeeId) {
      createNotification({
        type: 'stock_transfer',
        settingsKey: 'stock-transfer:updated',
        title: 'Chuyển kho mới',
        message: `Phiếu chuyển kho ${stockTransfer.id || stockTransfer.systemId} từ ${data.fromBranchName || fromBranchId} đến ${data.toBranchName || toBranchId}`,
        link: `/stock-transfers/${stockTransfer.systemId}`,
        recipientId: stockTransfer.employeeId,
        senderId: session.user?.employeeId,
        senderName: session.user?.name,
      }).catch(e => logError('[Stock Transfers POST] notification failed', e))
    }

    // Log activity
    getUserNameFromDb(session.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'stock_transfer',
          entityId: transformedResult.systemId,
          action: 'created',
          actionType: 'create',
          note: `Tạo phiếu chuyển kho`,
          metadata: { userName },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] stock_transfer create failed', e))
    return apiSuccess(transformedResult, 201);
  } catch (error) {
    logError('[Stock Transfers API] POST error', error);
    return apiError('Lỗi khi tạo phiếu chuyển kho', 500);
  }
}