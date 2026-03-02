import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, parsePagination } from '@/lib/api-utils';
import { generateNextIds } from '@/lib/id-system';

// GET /api/stock-history - List stock history entries
// Query params: productId, branchId, page, limit
// 
// ✅ IMPORTANT: newStockLevel is CALCULATED from running sum of quantityChange
// NOT read from database. This ensures single source of truth:
// - ProductInventory.onHand = current stock (source of truth)
// - StockHistory.quantityChange = historical changes
// - newStockLevel = derived value (calculated on-the-fly)
export async function GET(request: Request) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

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

    // ✅ Get ALL entries for this product-branch to calculate running totals
    // Then paginate the result
    const [allEntries, total] = await Promise.all([
      prisma.stockHistory.findMany({
        where,
        include: {
          branch: { select: { name: true } },
          product: { select: { name: true, id: true } },
        },
        orderBy: { createdAt: 'asc' }, // Oldest first for running total calculation
      }),
      prisma.stockHistory.count({ where }),
    ]);

    // ✅ Calculate running total for each entry (grouped by product-branch)
    const runningTotals = new Map<string, number>();
    const entriesWithCalculatedStock = allEntries.map(entry => {
      const key = `${entry.productId}:${entry.branchId}`;
      const currentRunning = runningTotals.get(key) || 0;
      const newRunning = currentRunning + entry.quantityChange;
      runningTotals.set(key, newRunning);
      
      return {
        ...entry,
        calculatedStockLevel: newRunning, // ✅ Calculated, not from DB
      };
    });

    // ✅ Reverse to show newest first, then paginate
    const reversedEntries = entriesWithCalculatedStock.reverse();
    const paginatedEntries = reversedEntries.slice(skip, skip + limit);

    // Transform to match frontend expected format
    const data = paginatedEntries.map(entry => ({
      systemId: entry.systemId,
      productId: entry.productId,
      date: entry.createdAt.toISOString(),
      employeeName: entry.employeeName || '-',
      action: entry.action,
      source: entry.source,
      quantityChange: entry.quantityChange,
      newStockLevel: entry.calculatedStockLevel, // ✅ Use calculated value
      documentId: entry.documentId || '-',
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
    console.error('Error fetching stock history:', error);
    return apiError('Failed to fetch stock history', 500);
  }
}

// POST /api/stock-history - Create a new stock history entry
// ✅ NOTE: newStockLevel is stored for backwards compatibility but NOT used.
// The GET endpoint calculates running totals from quantityChange instead.
// ProductInventory.onHand is the single source of truth for current stock.
export async function POST(request: Request) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

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
      include: {
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
    console.error('Error creating stock history:', error);
    return apiError('Failed to create stock history entry', 500);
  }
}
