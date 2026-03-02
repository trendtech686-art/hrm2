/**
 * Inventory Check Balance API Route
 * 
 * POST /api/inventory-checks/[systemId]/balance - Balance inventory (cập nhật tồn kho theo thực tế)
 * 
 * Thực hiện:
 * 1. Gọi API /api/products/[systemId]/inventory để cập nhật tồn kho và tạo lịch sử
 * 2. Cập nhật trạng thái phiếu kiểm kê thành COMPLETED
 */

import { prisma } from '@/lib/prisma';
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils';

type RouteParams = {
  params: Promise<{ systemId: string }>;
};

// Helper function to get base URL for internal API calls
function getBaseUrl(request: Request): string {
  const url = new URL(request.url);
  return `${url.protocol}//${url.host}`;
}

// POST - Balance inventory check (cập nhật tồn kho theo số thực tế)
export async function POST(request: Request, { params }: RouteParams) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { systemId } = await params;
    const body = await request.json().catch(() => ({}));
    const { balancedBy } = body;


    // Get the inventory check with items
    const inventoryCheck = await prisma.inventoryCheck.findUnique({
      where: { systemId },
      include: {
        items: true,
      },
    });

    if (!inventoryCheck) {
      return apiNotFound('Inventory check');
    }


    // Validate status - only DRAFT or PENDING can be balanced
    const currentStatus = String(inventoryCheck.status).toUpperCase();
    if (currentStatus !== 'DRAFT' && currentStatus !== 'PENDING') {
      return apiError(`Không thể cân bằng phiếu ở trạng thái ${inventoryCheck.status}`, 400);
    }

    // Check if there are items to balance
    if (!inventoryCheck.items || inventoryCheck.items.length === 0) {
      return apiError('Phiếu kiểm không có sản phẩm nào để cân bằng', 400);
    }

    // Get branch system ID from inventory check
    const branchId = inventoryCheck.branchSystemId || inventoryCheck.branchId;
    if (!branchId) {
      return apiError('Không tìm thấy chi nhánh để cân bằng', 400);
    }


    // Get employee info from user - balancedBy should be employee systemId
    const userId = balancedBy || session.user?.id || null;
    let employeeSystemId: string | null = null;
    let employeeName = session.user?.name || 'Hệ thống';
    
    // Lookup user to get linked employee
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { systemId: userId },
        select: { 
          employeeId: true,
          employee: {
            select: { systemId: true, fullName: true, id: true }
          }
        },
      });
      if (user?.employee) {
        employeeSystemId = user.employee.systemId;
        employeeName = user.employee.fullName || user.employee.id || employeeName;
      } else {
        // Fallback: maybe balancedBy is already an employee systemId
        const employee = await prisma.employee.findUnique({
          where: { systemId: userId },
          select: { systemId: true, fullName: true, id: true },
        });
        if (employee) {
          employeeSystemId = employee.systemId;
          employeeName = employee.fullName || employee.id || employeeName;
        }
      }
    }
    
    const now = new Date();
    const baseUrl = getBaseUrl(request);

    // Get cookies from request to forward to internal API calls
    const cookies = request.headers.get('cookie') || '';

    // Process each item - call the existing inventory update API
    const updateResults: { productId: string; productName: string; success: boolean; error?: string }[] = [];

    for (const item of inventoryCheck.items) {
      const difference = item.difference || 0;
      
      // Skip items with no difference
      if (difference === 0) {
        continue;
      }

      // productId in InventoryCheckItem is the product's systemId
      const productId = item.productId;
      if (!productId) {
        continue;
      }


      try {
        // Call existing inventory update API
        const inventoryUpdateResponse = await fetch(`${baseUrl}/api/products/${productId}/inventory`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': cookies,
          },
          body: JSON.stringify({
            branchSystemId: branchId,
            quantityChange: difference, // The difference (can be + or -)
            reason: `Cân bằng từ phiếu kiểm kê ${inventoryCheck.id}. Hệ thống: ${item.systemQty}, Thực tế: ${item.actualQty}`,
            source: 'inventory_check',
            referenceId: inventoryCheck.id, // Business ID (e.g., INVCHECK000004) for document link
            userId: employeeSystemId,
            userName: employeeName,
          }),
        });

        if (!inventoryUpdateResponse.ok) {
          const errorData = await inventoryUpdateResponse.json().catch(() => ({}));
          console.error(`[Balance API] Failed to update inventory for ${item.productName}:`, errorData);
          updateResults.push({ 
            productId, 
            productName: item.productName || productId, 
            success: false, 
            error: errorData.error || 'Unknown error' 
          });
        } else {
          updateResults.push({ 
            productId, 
            productName: item.productName || productId, 
            success: true 
          });
        }
      } catch (err) {
        console.error(`[Balance API] Error updating inventory for ${item.productName}:`, err);
        updateResults.push({ 
          productId, 
          productName: item.productName || productId, 
          success: false, 
          error: err instanceof Error ? err.message : 'Unknown error' 
        });
      }
    }

    // Check if any updates failed
    const failedUpdates = updateResults.filter(r => !r.success);
    if (failedUpdates.length > 0) {
      console.warn('[Balance API] Some items failed to update:', failedUpdates);
      // Continue anyway - partial update is better than no update
    }

    // Update inventory check status
    await prisma.$executeRaw`
      UPDATE inventory_checks 
      SET status = 'COMPLETED', 
          "balancedAt" = ${now}, 
          "balancedBy" = ${employeeSystemId},
          "updatedAt" = ${now}
      WHERE "systemId" = ${systemId}
    `;

    // Fetch the updated record
    const updatedCheck = await prisma.inventoryCheck.findUnique({
      where: { systemId },
      include: { items: true },
    });


    return apiSuccess({
      ...updatedCheck,
      updateResults,
      failedCount: failedUpdates.length,
      successCount: updateResults.filter(r => r.success).length,
    });
  } catch (error) {
    console.error('[Inventory Checks API] Balance error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return apiError(`Failed to balance inventory check: ${errorMessage}`, 500);
  }
}
