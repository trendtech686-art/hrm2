import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, parsePagination } from '@/lib/api-utils';
import { requirePermission } from '@/lib/api-utils';
import { generateNextIds } from '@/lib/id-system';
import { logError } from '@/lib/logger'

// GET /api/stock-history - List stock history entries
// Query params: productId, branchId, page, limit
// 
// ✅ IMPORTANT: newStockLevel is read directly from database
// Each StockHistory entry stores the actual stock level at that point in time
export async function GET(request: Request) {
  const result = await requirePermission('view_products')
  if (result instanceof Response) return result

  try {
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = parsePagination(searchParams);
    const productId = searchParams.get('productId');
    const branchId = searchParams.get('branchId');

    // Build where clause
    const where: {
      productId?: string;
      branchId?: string;
    } = {};

    if (productId) {
      where.productId = productId;
    }
    if (branchId && branchId !== 'all') {
      where.branchId = branchId;
    }

    // ✅ Get entries with pagination
    const [entries, total] = await Promise.all([
      prisma.stockHistory.findMany({
        where,
      select: {
        systemId: true,
        productId: true,
        branchId: true,
        action: true,
        source: true,
        quantityChange: true,
        newStockLevel: true,
        documentId: true,
        documentType: true,
        employeeId: true,
        employeeName: true,
        note: true,
        createdAt: true,
        branch: { select: { name: true } },
        product: { select: { name: true, id: true } },
      },
        orderBy: { createdAt: 'desc' }, // Newest first
        skip,
        take: limit,
      }),
      prisma.stockHistory.count({ where }),
    ]);

    // ✅ Batch resolve documentId → documentSystemId for clickable links
    // Groups document IDs by prefix, queries each table for {id, systemId}
    const documentIds = entries
      .map(e => e.documentId)
      .filter((id): id is string => !!id && id !== '-');

    const poIds: string[] = [];
    const receiptIds: string[] = [];
    const orderIds: string[] = [];
    const warrantyIds: string[] = [];
    const checkIds: string[] = [];
    const transferIds: string[] = [];
    const salesReturnIds: string[] = [];

    for (const id of documentIds) {
      if (id.startsWith('PO')) poIds.push(id);
      else if (id.startsWith('PNK') || id.startsWith('NK')) receiptIds.push(id);
      else if (id.startsWith('DH') || id.startsWith('SON')) orderIds.push(id);
      else if (id.startsWith('BH')) warrantyIds.push(id);
      else if (id.startsWith('PKK') || id.startsWith('INVCHECK')) checkIds.push(id);
      else if (id.startsWith('PCK')) transferIds.push(id);
      else if (id.startsWith('TH')) salesReturnIds.push(id);
    }

    const [pos, recs, ords, warrs, chks, trns, srets] = await Promise.all([
      poIds.length > 0 ? prisma.purchaseOrder.findMany({ where: { id: { in: poIds } }, select: { id: true, systemId: true } }) : [],
      receiptIds.length > 0 ? prisma.inventoryReceipt.findMany({ where: { id: { in: receiptIds } }, select: { id: true, systemId: true } }) : [],
      orderIds.length > 0 ? prisma.order.findMany({ where: { id: { in: orderIds } }, select: { id: true, systemId: true } }) : [],
      warrantyIds.length > 0 ? prisma.warranty.findMany({ where: { id: { in: warrantyIds } }, select: { id: true, systemId: true } }) : [],
      // ✅ Query by both id (PKK000001) and systemId (INVCHECK000001) since documentId might be either
      checkIds.length > 0 ? prisma.inventoryCheck.findMany({ where: { OR: [{ id: { in: checkIds } }, { systemId: { in: checkIds } }] }, select: { id: true, systemId: true } }) : [],
      transferIds.length > 0 ? prisma.stockTransfer.findMany({ where: { id: { in: transferIds } }, select: { id: true, systemId: true } }) : [],
      salesReturnIds.length > 0 ? prisma.salesReturn.findMany({ where: { id: { in: salesReturnIds } }, select: { id: true, systemId: true } }) : [],
    ]);

    const docSystemIdMap = new Map<string, string>();
    for (const p of [...pos, ...recs, ...ords, ...warrs, ...chks, ...trns, ...srets]) {
      docSystemIdMap.set(p.id, p.systemId);
      // ✅ Also map systemId -> systemId for cases where documentId is already a systemId
      if (p.systemId !== p.id) {
        docSystemIdMap.set(p.systemId, p.systemId);
      }
    }

    // Resolve employee systemIds (EMP-*) to actual names
    const empIds = [...new Set(entries
      .map(e => e.employeeName)
      .filter((n): n is string => !!n && n.startsWith('EMP'))
    )];
    const empNameMap = new Map<string, string>();
    if (empIds.length > 0) {
      const employees = await prisma.employee.findMany({
        where: { systemId: { in: empIds } },
        select: { systemId: true, fullName: true },
      });
      for (const emp of employees) {
        empNameMap.set(emp.systemId, emp.fullName);
      }
    }

    // Transform to match frontend expected format
    const data = entries.map(entry => ({
      systemId: entry.systemId,
      productId: entry.productId,
      date: entry.createdAt.toISOString(),
      employeeName: (entry.employeeName && empNameMap.get(entry.employeeName)) || entry.employeeName || '-',
      action: entry.action,
      source: entry.source,
      quantityChange: entry.quantityChange,
      newStockLevel: entry.newStockLevel, // ✅ Use actual DB value
      documentId: entry.documentId || '-',
      documentSystemId: entry.documentId ? (docSystemIdMap.get(entry.documentId) || null) : null,
      documentType: entry.documentType,
      branchSystemId: entry.branchId,
      branch: entry.branch?.name || '-',
      note: entry.note,
      createdAt: entry.createdAt.toISOString(),
    }));

    return apiSuccess({
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logError('Error fetching stock history', error);
    return apiError('Failed to fetch stock history', 500);
  }
}

// POST /api/stock-history - Create a new stock history entry
// ✅ NOTE: newStockLevel is stored for backwards compatibility but NOT used.
// The GET endpoint calculates running totals from quantityChange instead.
// ProductInventory.onHand is the single source of truth for current stock.
export async function POST(request: Request) {
  const result = await requirePermission('view_products')
  if (result instanceof Response) return result

  try {
    const body = await request.json();
    
    const {
      productId,
      branchId,
      action,
      source,
      quantityChange,
      newStockLevel, // ✅ Kept for backwards compatibility but ignored in GET
      documentId,
      documentType,
      employeeName,
      note,
    } = body;

    if (!productId || !branchId || !action) {
      return apiError('Missing required fields: productId, branchId, action', 400);
    }

    // ✅ Get current stock from ProductInventory (source of truth)
    // to store as newStockLevel for reference/debugging
    const inventory = await prisma.productInventory.findUnique({
      where: {
        productId_branchId: { productId, branchId },
      },
      select: { onHand: true },
    });
    const currentStock = inventory?.onHand || 0;
    const calculatedNewStock = currentStock + (quantityChange || 0);

    const { systemId } = await generateNextIds('stock-history');
    
    const entry = await prisma.stockHistory.create({
      data: {
        systemId,
        productId,
        branchId,
        action,
        source: source || null,
        quantityChange: quantityChange || 0,
        // ✅ Use provided value or calculate from ProductInventory
        newStockLevel: newStockLevel ?? calculatedNewStock,
        documentId: documentId || null,
        documentType: documentType || null,
        employeeName: employeeName || session.user?.name || '-',
        note: note || null,
      },
      select: {
        systemId: true,
        productId: true,
        branchId: true,
        action: true,
        source: true,
        quantityChange: true,
        newStockLevel: true,
        documentId: true,
        documentType: true,
        employeeId: true,
        employeeName: true,
        note: true,
        createdAt: true,
        branch: { select: { name: true } },
        product: { select: { name: true, id: true } },
      },
    });

    return apiSuccess({
      systemId: entry.systemId,
      productId: entry.productId,
      date: entry.createdAt.toISOString(),
      employeeName: entry.employeeName || '-',
      action: entry.action,
      source: entry.source,
      quantityChange: entry.quantityChange,
      newStockLevel: entry.newStockLevel,
      documentId: entry.documentId || '-',
      documentType: entry.documentType,
      branchSystemId: entry.branchId,
      branch: entry.branch?.name || '-',
      note: entry.note,
      createdAt: entry.createdAt.toISOString(),
    }, 201);
  } catch (error) {
    logError('Error creating stock history', error);
    return apiError('Failed to create stock history entry', 500);
  }
}
