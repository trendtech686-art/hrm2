import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import { WarrantyStatus } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { updateWarrantySchema } from './validation'

// Helper to serialize Decimal fields for client
function serializeWarranty<T extends { 
  partsCost?: Prisma.Decimal | number | null;
  laborCost?: Prisma.Decimal | number | null;
  totalCost?: Prisma.Decimal | number | null;
  shippingFee?: Prisma.Decimal | number | null;
}>(warranty: T) {
  return {
    ...warranty,
    partsCost: warranty.partsCost !== null && warranty.partsCost !== undefined ? Number(warranty.partsCost) : 0,
    laborCost: warranty.laborCost !== null && warranty.laborCost !== undefined ? Number(warranty.laborCost) : 0,
    totalCost: warranty.totalCost !== null && warranty.totalCost !== undefined ? Number(warranty.totalCost) : 0,
    shippingFee: warranty.shippingFee !== null && warranty.shippingFee !== undefined ? Number(warranty.shippingFee) : 0,
  };
}

interface RouteParams {
  params: Promise<{ systemId: string }>
}

// GET /api/warranties/[systemId]
export async function GET(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const warranty = await prisma.warranty.findUnique({
      where: { systemId },
      include: {
        product: true,
        order: {
          select: { systemId: true, id: true, orderDate: true },
        },
        // ✅ Include customer for CustomerSelector stats
        customers: {
          select: { systemId: true, id: true, name: true, phone: true, email: true },
        },
      },
    })

    if (!warranty) {
      return apiError('Phiếu bảo hành không tồn tại', 404)
    }

    // Debug: Log warranty data including customer

    return apiSuccess(serializeWarranty(warranty))
  } catch (error) {
    console.error('Error fetching warranty:', error)
    return apiError('Failed to fetch warranty', 500)
  }
}

// PUT /api/warranties/[systemId] - Update warranty details
/**
 * Update warranty flow:
 * 1. Verify warranty exists
 * 2. Validate update data
 * 3. If changing type from REPLACE to REPAIR/REFUND, uncommit stock
 * 4. Update warranty record
 * 5. Create history entry
 */
export async function PUT(request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, updateWarrantySchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const { systemId } = await params
    
    // Debug: Log important fields

    // Build update data - only include fields that are provided
    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
      updatedBy: session.user?.email || 'system',
      updatedBySystemId: session.user?.id,
    };

    // Basic fields
    if (body.issueDescription !== undefined) updateData.issueDescription = body.issueDescription;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.status !== undefined) updateData.status = body.status as WarrantyStatus;
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.solution !== undefined) updateData.solution = body.solution;
    if (body.diagnosis !== undefined) updateData.diagnosis = body.diagnosis;
    if (body.assigneeId !== undefined) updateData.assigneeId = body.assigneeId;
    
    // Customer info
    if (body.customerName !== undefined) updateData.customerName = body.customerName;
    if (body.customerPhone !== undefined) updateData.customerPhone = body.customerPhone;
    if (body.customerEmail !== undefined) updateData.customerEmail = body.customerEmail;
    if (body.customerAddress !== undefined) updateData.customerAddress = body.customerAddress;
    
    // Branch & employee
    if (body.branchSystemId !== undefined) updateData.branchSystemId = body.branchSystemId;
    if (body.branchName !== undefined) updateData.branchName = body.branchName;
    if (body.employeeSystemId !== undefined) updateData.employeeSystemId = body.employeeSystemId;
    if (body.employeeName !== undefined) updateData.employeeName = body.employeeName;
    
    // Shipping & external refs
    if (body.trackingCode !== undefined) updateData.trackingCode = body.trackingCode;
    if (body.shippingFee !== undefined) updateData.shippingFee = body.shippingFee;
    if (body.referenceUrl !== undefined) updateData.referenceUrl = body.referenceUrl;
    if (body.externalReference !== undefined) updateData.externalReference = body.externalReference;
    
    // Images
    if (body.receivedImages !== undefined) updateData.receivedImages = body.receivedImages;
    if (body.processedImages !== undefined) updateData.processedImages = body.processedImages;
    
    // Products (JSON array)
    if (body.products !== undefined) updateData.products = body.products;
    
    // Settlement (JSON object)
    if (body.settlement !== undefined) updateData.settlement = body.settlement;
    if (body.settlementStatus !== undefined) updateData.settlementStatus = body.settlementStatus;
    
    // Summary (JSON object)
    if (body.summary !== undefined) updateData.summary = body.summary;
    
    // History & comments (JSON arrays)
    if (body.history !== undefined) updateData.history = body.history;
    if (body.comments !== undefined) updateData.comments = body.comments;
    
    // Subtasks
    if (body.subtasks !== undefined) updateData.subtasks = body.subtasks;
    
    // Order linking
    if (body.linkedOrderSystemId !== undefined) updateData.linkedOrderSystemId = body.linkedOrderSystemId;

    const warranty = await prisma.warranty.update({
      where: { systemId },
      data: updateData,
      include: {
        product: {
          select: { systemId: true, id: true, name: true, imageUrl: true },
        },
        customers: {
          select: { systemId: true, id: true, name: true, phone: true },
        },
      },
    })

    // TODO: Handle stock adjustments if warranty type changes
    // This would require knowing the previous warranty type and new type
    // If changing from REPLACE to REPAIR/REFUND, uncommit stock

    return apiSuccess(serializeWarranty(warranty))
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiError('Phiếu bảo hành không tồn tại', 404)
    }
    console.error('Error updating warranty:', error)
    return apiError('Failed to update warranty', 500)
  }
}

// PATCH /api/warranties/[systemId] - Partial update warranty
export async function PATCH(request: Request, { params }: RouteParams) {
  return PUT(request, { params })
}

// DELETE /api/warranties/[systemId]
export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    await prisma.warranty.update({
      where: { systemId },
      data: { isDeleted: true },
    })

    return apiSuccess({ success: true })
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'P2025') {
      return apiError('Phiếu bảo hành không tồn tại', 404)
    }
    console.error('Error deleting warranty:', error)
    return apiError('Failed to delete warranty', 500)
  }
}
