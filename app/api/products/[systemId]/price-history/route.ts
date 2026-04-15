import { prisma } from '@/lib/prisma';
import { apiHandler } from '@/lib/api-handler';
import { apiSuccess, apiError, parsePagination } from '@/lib/api-utils';
import { Prisma } from '@/generated/prisma/client';

/**
 * GET /api/products/[systemId]/price-history
 * Fetch price history for a product with server-side pagination and filtering
 * 
 * Query params:
 * - page: Page number (default 1)
 * - limit: Items per page (default 20)
 * - branchId: Filter by branch (optional)
 * - fromDate: Filter from date (optional)
 * - toDate: Filter to date (optional)
 */
export const GET = apiHandler(async (request, { params }) => {
    const { systemId: productSystemId } = await params;
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePagination(searchParams);
    const branchId = searchParams.get('branchId');
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');

    // Get product
    const product = await prisma.product.findUnique({
      where: { systemId: productSystemId },
      select: { systemId: true, pkgxId: true, createdAt: true, unit: true },
    });

    if (!product) {
      return apiError('Sản phẩm không tồn tại', 404);
    }

    // Build where clause for inventory receipts
    // Any receipt containing this product is relevant for price history
    const receiptWhere: Prisma.InventoryReceiptWhereInput = {
      items: {
        some: { productId: productSystemId },
      },
    };

    if (branchId && branchId !== 'all') {
      receiptWhere.branchSystemId = branchId;
    }

    // Date filter - use receiptDate (non-nullable)
    if (fromDate || toDate) {
      const dateFilter: Prisma.DateTimeFilter = {};
      if (fromDate) dateFilter.gte = new Date(fromDate);
      if (toDate) dateFilter.lte = new Date(toDate);
      receiptWhere.receiptDate = dateFilter;
    }

    // Get total count
    const total = await prisma.inventoryReceipt.count({ where: receiptWhere });

    // Get receipts with pagination
    // Order by receiptDate desc (non-nullable) to ensure newest first
    // Fall back to id desc for consistent ordering
    const receipts = await prisma.inventoryReceipt.findMany({
      where: receiptWhere,
      select: {
        id: true,
        systemId: true,
        receivedDate: true,
        receiptDate: true,
        supplierName: true,
        branchSystemId: true,
        branchName: true,
        notes: true,
        createdBy: true,
        receiverName: true,
        purchaseOrderId: true,
        items: {
          where: { productId: productSystemId },
          select: {
            unitCost: true,
            quantity: true,
          },
        },
      },
      orderBy: [
        { receiptDate: 'desc' },
        { id: 'desc' },
      ],
      skip,
      take: limit,
    });

    // Lookup employee names for createdBy
    const creatorIds = receipts
      .map(r => r.createdBy)
      .filter((id): id is string => !!id);
    
    const employees = creatorIds.length > 0
      ? await prisma.employee.findMany({
          where: { systemId: { in: creatorIds } },
          select: { systemId: true, fullName: true },
        })
      : [];
    
    const employeeMap = new Map(employees.map(e => [e.systemId, e.fullName]));

    // Transform to price history entries
    const data = receipts.map(receipt => {
      const item = receipt.items[0]; // Should only have one item per product after filter
      const createdByName = receipt.createdBy ? employeeMap.get(receipt.createdBy) : null;
      
      return {
        systemId: `receipt-${receipt.id}`,
        id: `receipt-${receipt.id}`,
        date: (receipt.receivedDate || receipt.receiptDate)?.toISOString() || '',
        price: item ? Number(item.unitCost) || 0 : 0,
        supplierName: receipt.supplierName || '-',
        reference: receipt.id,
        referenceSystemId: receipt.systemId,
        purchaseOrderId: receipt.purchaseOrderId,
        type: 'receipt',
        note: receipt.notes || `Nhập ${item?.quantity || 0} ${product.unit || ''}`,
        createdByName: createdByName || receipt.receiverName || '-',
        branchSystemId: receipt.branchSystemId,
        branchName: receipt.branchName || '-',
      };
    });

    return apiSuccess({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
})
