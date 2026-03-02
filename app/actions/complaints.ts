'use server'

/**
 * Server Actions for Complaints Management (Khiếu nại)
 * 
 * SIMPLIFIED VERSION - Basic CRUD operations
 */

import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { generateSubEntityId } from '@/lib/id-utils'
import { auth } from '@/auth'
import type { ActionResult } from '@/types/action-result'
import { createComplaintSchema, updateComplaintSchema } from '@/features/complaints/validation'

// Complaint type from Prisma (auto-inferred)
type Complaint = Awaited<ReturnType<typeof prisma.complaint.findFirst>>

// ====================================
// TYPES
// ====================================

// Image type for complaint
export type ComplaintImageInput = {
  id: string
  url: string
  uploadedBy?: string
  uploadedAt?: Date | string
  type?: 'initial' | 'evidence'
}

// Employee image type
export type EmployeeImageInput = {
  id: string
  url: string
  uploadedBy?: string
  uploadedAt?: Date | string
}

export type CreateComplaintInput = {
  orderId?: string
  orderSystemId?: string
  customerId?: string
  customerSystemId?: string
  customerName?: string
  customerPhone?: string
  type: string
  priority?: string
  description?: string
  subject?: string
  title?: string
  branchId?: string
  branchSystemId?: string
  branchName?: string
  assigneeId?: string
  assigneeSystemId?: string
  assigneeName?: string
  dueDate?: string | Date
  createdBy?: string
  // ⭐ NEW: Image fields
  images?: ComplaintImageInput[]
  employeeImages?: EmployeeImageInput[]
  affectedProducts?: unknown[]
  orderCode?: string
  orderValue?: number
  assignedTo?: string
  assignedAt?: Date | string
}

export type UpdateComplaintInput = {
  systemId: string
  type?: string
  priority?: string
  description?: string
  subject?: string
  title?: string
  status?: string
  assigneeId?: string
  assigneeSystemId?: string
  assigneeName?: string
  dueDate?: string | Date | null
  resolution?: string
  resolvedAt?: string | Date | null
  endedAt?: string | Date | null
  updatedBy?: string
  // ⭐ NEW: Image fields
  images?: ComplaintImageInput[]
  employeeImages?: EmployeeImageInput[]
  affectedProducts?: unknown[]
  orderCode?: string
  orderValue?: number
  // ⭐ NEW: Verification fields
  verification?: string | null
  isVerifiedCorrect?: boolean | null
  timeline?: unknown[]
}

// ====================================
// ACTIONS
// ====================================

/**
 * Map legacy status values to Prisma ComplaintStatus enum
 * Frontend uses: pending, investigating, resolved, cancelled, ended
 * Prisma uses: OPEN, IN_PROGRESS, RESOLVED, CLOSED
 */
function mapStatusToPrisma(status: string | undefined): 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | undefined {
  if (!status) return undefined;
  
  const statusMap: Record<string, 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'> = {
    // Legacy lowercase
    'pending': 'OPEN',
    'open': 'OPEN',
    'investigating': 'IN_PROGRESS',
    'in_progress': 'IN_PROGRESS',
    'resolved': 'RESOLVED',
    'cancelled': 'CLOSED',
    'ended': 'CLOSED',
    'closed': 'CLOSED',
    // Prisma uppercase (pass through)
    'OPEN': 'OPEN',
    'IN_PROGRESS': 'IN_PROGRESS',
    'RESOLVED': 'RESOLVED',
    'CLOSED': 'CLOSED',
  };
  
  return statusMap[status] || 'OPEN';
}

/**
 * Helper to serialize Prisma complaint for client (convert Decimal to Number)
 */
function mapStatusFromPrisma(status: string, complaint: { cancelledAt?: Date | null; endedAt?: Date | null }): string {
  switch (status) {
    case 'OPEN': return 'pending';
    case 'IN_PROGRESS': return 'investigating';
    case 'RESOLVED': return 'resolved';
    case 'CLOSED':
      if (complaint.cancelledAt) return 'cancelled';
      if (complaint.endedAt) return 'ended';
      return 'cancelled'; // default fallback for CLOSED
    default: return status; // pass through unknown values
  }
}

function serializeComplaint(complaint: NonNullable<Complaint>) {
  return {
    ...complaint,
    status: mapStatusFromPrisma(complaint.status as string, complaint),
    orderValue: complaint.orderValue ? Number(complaint.orderValue) : null,
    assignedTo: complaint.assigneeId, // Map for frontend compatibility
    // ⭐ Map DB orderId to frontend orderSystemId for consistency
    orderSystemId: complaint.orderId,
    timeline: complaint.timeline || [],
    subtasks: complaint.subtasks ?? undefined,
  } as unknown as Complaint;
}

/**
 * Create a new complaint
 */
export async function createComplaintAction(
  input: CreateComplaintInput
): Promise<ActionResult<Complaint>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  const validated = createComplaintSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const systemId = await generateIdWithPrefix('KN', tx)
      
      // Generate tracking code  
      const trackingCode = generateSubEntityId('TK')

      // ⭐ Extract image URLs for database storage
      const imageUrls = (input.images || [])
        .filter(img => img && img.url)
        .map(img => img.url)

      const complaint = await tx.complaint.create({
        data: {
          systemId,
          id: systemId,
          orderId: input.orderId || input.orderSystemId,
          customerId: input.customerId || input.customerSystemId,
          customerName: input.customerName,
          customerPhone: input.customerPhone,
          type: input.type,
          priority: (input.priority || 'MEDIUM') as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
          description: input.description,
          title: input.subject || input.title || 'Khiếu nại',
          branchId: input.branchId,
          branchSystemId: input.branchSystemId,
          branchName: input.branchName,
          assigneeId: input.assigneeId || input.assignedTo,
          assigneeName: input.assigneeName,
          assignedAt: input.assignedAt ? new Date(input.assignedAt as string) : undefined,
          status: 'OPEN',
          publicTrackingCode: trackingCode,
          createdBy: input.createdBy,
          // ⭐ NEW: Save images
          images: imageUrls,
          employeeImages: input.employeeImages && input.employeeImages.length > 0 
            ? input.employeeImages 
            : undefined,
          orderCode: input.orderCode,
          orderValue: input.orderValue ? input.orderValue : undefined,
          affectedProducts: input.affectedProducts && input.affectedProducts.length > 0
            ? (input.affectedProducts as Prisma.InputJsonValue)
            : undefined,
        },
      })

      return complaint
    })

    revalidatePath('/complaints')
    return { success: true, data: serializeComplaint(result) }
  } catch (error) {
    console.error('Error creating complaint:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tạo khiếu nại',
    }
  }
}

/**
 * Update a complaint
 */
export async function updateComplaintAction(
  input: UpdateComplaintInput
): Promise<ActionResult<Complaint>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  const validated = updateComplaintSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const { systemId, ...data } = input

    const existing = await prisma.complaint.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy khiếu nại' }
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.type !== undefined) updateData.type = data.type
    if (data.priority !== undefined) updateData.priority = data.priority
    if (data.description !== undefined) updateData.description = data.description
    if (data.subject !== undefined) updateData.title = data.subject
    if (data.status !== undefined) updateData.status = mapStatusToPrisma(data.status)
    if (data.assigneeId !== undefined) updateData.assigneeId = data.assigneeId
    if (data.assigneeName !== undefined) updateData.assigneeName = data.assigneeName
    if (data.resolution !== undefined) updateData.resolution = data.resolution
    if (data.resolvedAt !== undefined) {
      updateData.resolvedAt = data.resolvedAt ? new Date(data.resolvedAt) : null
    }
    if (data.endedAt !== undefined) {
      updateData.endedAt = data.endedAt ? new Date(data.endedAt) : null
    }
    if (data.updatedBy !== undefined) updateData.updatedBy = data.updatedBy
    
    // ⭐ NEW: Handle images
    if (data.images !== undefined) {
      updateData.images = (data.images || [])
        .filter(img => img && img.url)
        .map(img => img.url)
    }
    if (data.employeeImages !== undefined) {
      updateData.employeeImages = data.employeeImages && data.employeeImages.length > 0 
        ? data.employeeImages 
        : null
    }
    if (data.affectedProducts !== undefined) {
      updateData.affectedProducts = data.affectedProducts && data.affectedProducts.length > 0
        ? data.affectedProducts
        : null
    }
    if (data.orderCode !== undefined) updateData.orderCode = data.orderCode
    if (data.orderValue !== undefined) updateData.orderValue = data.orderValue
    
    // ⭐ NEW: Handle verification fields
    if (data.verification !== undefined) updateData.verification = data.verification
    if (data.isVerifiedCorrect !== undefined) updateData.isVerifiedCorrect = data.isVerifiedCorrect
    if (data.timeline !== undefined) updateData.timeline = data.timeline

    const complaint = await prisma.complaint.update({
      where: { systemId },
      data: updateData,
    })

    revalidatePath('/complaints')
    revalidatePath(`/complaints/${systemId}`)
    return { success: true, data: serializeComplaint(complaint) }
  } catch (error) {
    console.error('Error updating complaint:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật khiếu nại',
    }
  }
}

/**
 * Delete a complaint
 */
export async function deleteComplaintAction(
  systemId: string
): Promise<ActionResult<Complaint>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  try {
    const existing = await prisma.complaint.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy khiếu nại' }
    }

    const complaint = await prisma.complaint.delete({
      where: { systemId },
    })

    revalidatePath('/complaints')
    return { success: true, data: serializeComplaint(complaint) }
  } catch (error) {
    console.error('Error deleting complaint:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xóa khiếu nại',
    }
  }
}

/**
 * Resolve a complaint
 */
export async function resolveComplaintAction(
  systemId: string,
  resolution: string,
  resolvedBy?: string
): Promise<ActionResult<Complaint>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  try {
    const existing = await prisma.complaint.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy khiếu nại' }
    }

    const complaint = await prisma.complaint.update({
      where: { systemId },
      data: {
        status: 'RESOLVED',
        resolution,
        resolvedAt: new Date(),
        resolvedBy,
      },
    })

    revalidatePath('/complaints')
    revalidatePath(`/complaints/${systemId}`)
    return { success: true, data: serializeComplaint(complaint) }
  } catch (error) {
    console.error('Error resolving complaint:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể giải quyết khiếu nại',
    }
  }
}

/**
 * Close a complaint
 */
export async function closeComplaintAction(
  systemId: string,
  closedBy?: string
): Promise<ActionResult<Complaint>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  try {
    const existing = await prisma.complaint.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy khiếu nại' }
    }

    const complaint = await prisma.complaint.update({
      where: { systemId },
      data: {
        status: 'CLOSED',
        endedAt: new Date(),
        endedBy: closedBy,
      },
    })

    revalidatePath('/complaints')
    revalidatePath(`/complaints/${systemId}`)
    return { success: true, data: serializeComplaint(complaint) }
  } catch (error) {
    console.error('Error closing complaint:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể đóng khiếu nại',
    }
  }
}
