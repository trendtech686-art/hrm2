import { prisma } from '@/lib/prisma'
import type { Prisma } from '@prisma/client'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

// Helper to serialize Decimal fields for client
function serializeCustomer<T extends { 
  currentDebt?: Prisma.Decimal | number | null;
  maxDebt?: Prisma.Decimal | number | null;
  defaultDiscount?: Prisma.Decimal | number | null;
  totalSpent?: Prisma.Decimal | number | null;
  orders?: { grandTotal?: Prisma.Decimal | number | null }[];
}>(customer: T) {
  return {
    ...customer,
    currentDebt: customer.currentDebt !== null && customer.currentDebt !== undefined ? Number(customer.currentDebt) : null,
    maxDebt: customer.maxDebt !== null && customer.maxDebt !== undefined ? Number(customer.maxDebt) : null,
    defaultDiscount: customer.defaultDiscount !== null && customer.defaultDiscount !== undefined ? Number(customer.defaultDiscount) : null,
    totalSpent: customer.totalSpent !== null && customer.totalSpent !== undefined ? Number(customer.totalSpent) : null,
    orders: customer.orders?.map(o => ({
      ...o,
      grandTotal: o.grandTotal !== null && o.grandTotal !== undefined ? Number(o.grandTotal) : 0,
    })),
  };
}

// GET /api/customers/[systemId]
export async function GET(
  request: Request,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const customer = await prisma.customer.findUnique({
      where: { systemId },
      include: {
        orders: {
          take: 10,
          orderBy: { orderDate: 'desc' },
          select: {
            systemId: true,
            id: true,
            orderDate: true,
            status: true,
            grandTotal: true,
          },
        },
      },
    })

    if (!customer || customer.isDeleted) {
      return apiNotFound('Customer')
    }

    return apiSuccess(serializeCustomer(customer))
  } catch (error) {
    console.error('Error fetching customer:', error)
    return apiError('Failed to fetch customer', 500)
  }
}

// PUT /api/customers/[systemId]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params
    const body = await request.json()

    const existing = await prisma.customer.findUnique({
      where: { systemId },
    })

    if (!existing || existing.isDeleted) {
      return apiNotFound('Customer')
    }

    // Build update data object - only include fields that are provided
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: Record<string, any> = {}
    
    // Basic info
    if (body.name !== undefined) updateData.name = body.name
    if (body.email !== undefined) updateData.email = body.email
    if (body.phone !== undefined) updateData.phone = body.phone
    if (body.company !== undefined || body.companyName !== undefined) {
      updateData.companyName = body.company || body.companyName
      updateData.company = body.company || body.companyName
    }
    if (body.taxCode !== undefined) updateData.taxCode = body.taxCode
    if (body.representative !== undefined || body.contactPerson !== undefined) {
      updateData.representative = body.representative || body.contactPerson
    }
    if (body.position !== undefined) updateData.position = body.position
    if (body.addresses !== undefined) updateData.addresses = body.addresses
    
    // Personal info
    if (body.gender !== undefined) updateData.gender = body.gender
    if (body.dateOfBirth !== undefined) updateData.dateOfBirth = body.dateOfBirth ? new Date(body.dateOfBirth) : null
    
    // Flat address fields
    if (body.address !== undefined) updateData.address = body.address
    if (body.province !== undefined) updateData.province = body.province
    if (body.district !== undefined) updateData.district = body.district
    if (body.ward !== undefined) updateData.ward = body.ward
    
    // Financial
    if (body.currentDebt !== undefined) updateData.currentDebt = body.currentDebt
    if (body.maxDebt !== undefined || body.creditLimit !== undefined) {
      updateData.maxDebt = body.maxDebt || body.creditLimit
    }
    
    // Classification
    if (body.lifecycleStage !== undefined || body.customerType !== undefined) {
      updateData.lifecycleStage = body.lifecycleStage || body.customerType
    }
    if (body.status !== undefined) updateData.status = body.status
    if (body.type !== undefined) updateData.type = body.type
    if (body.customerGroup !== undefined) updateData.customerGroup = body.customerGroup
    // pricingLevel is enum (RETAIL, WHOLESALE, VIP, PARTNER) - legacy field
    // pricingPolicyId is the new field for linking to PricingPolicy table
    if (body.pricingLevel !== undefined) {
      const validPricingLevels = ['RETAIL', 'WHOLESALE', 'VIP', 'PARTNER'];
      if (validPricingLevels.includes(body.pricingLevel)) {
        updateData.pricingLevel = body.pricingLevel;
      } else {
        // Form sends pricingPolicy ID, save to pricingPolicyId field
        updateData.pricingPolicyId = body.pricingLevel;
      }
    }
    if (body.pricingPolicyId !== undefined) updateData.pricingPolicyId = body.pricingPolicyId
    if (body.defaultDiscount !== undefined) updateData.defaultDiscount = body.defaultDiscount
    
    // Source & Campaign
    if (body.source !== undefined) updateData.source = body.source
    if (body.campaign !== undefined) updateData.campaign = body.campaign
    if (body.referredBy !== undefined) updateData.referredBy = body.referredBy
    
    // Contact & Banking
    if (body.zaloPhone !== undefined) updateData.zaloPhone = body.zaloPhone
    if (body.bankName !== undefined) updateData.bankName = body.bankName
    if (body.bankAccount !== undefined) updateData.bankAccount = body.bankAccount
    
    // Payment terms
    if (body.paymentTerms !== undefined) updateData.paymentTerms = body.paymentTerms
    if (body.creditRating !== undefined) updateData.creditRating = body.creditRating
    if (body.allowCredit !== undefined) updateData.allowCredit = body.allowCredit
    
    // Multiple contacts
    if (body.contacts !== undefined) updateData.contacts = body.contacts
    
    // Contract
    if (body.contract !== undefined) updateData.contract = body.contract
    
    // Images & Social
    if (body.images !== undefined) updateData.images = body.images
    if (body.social !== undefined) updateData.social = body.social
    
    // Follow-up tracking
    if (body.lastContactDate !== undefined) updateData.lastContactDate = body.lastContactDate ? new Date(body.lastContactDate) : null
    if (body.nextFollowUpDate !== undefined) updateData.nextFollowUpDate = body.nextFollowUpDate ? new Date(body.nextFollowUpDate) : null
    if (body.followUpReason !== undefined) updateData.followUpReason = body.followUpReason
    if (body.followUpAssigneeId !== undefined) updateData.followUpAssigneeId = body.followUpAssigneeId
    
    // Other
    if (body.notes !== undefined) updateData.notes = body.notes
    if (body.tags !== undefined) updateData.tags = body.tags
    if (body.accountManagerId !== undefined) updateData.accountManagerId = body.accountManagerId
    
    // Audit
    if (body.updatedBy !== undefined) updateData.updatedBy = body.updatedBy
    updateData.updatedAt = new Date()

    const customer = await prisma.customer.update({
      where: { systemId },
      data: updateData,
    })

    return apiSuccess(serializeCustomer(customer))
  } catch (error) {
    console.error('Error updating customer:', error)
    return apiError('Failed to update customer', 500)
  }
}

// PATCH /api/customers/[systemId] - alias for PUT
export { PUT as PATCH }

// DELETE /api/customers/[systemId]
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    const customer = await prisma.customer.update({
      where: { systemId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    return apiSuccess({ success: true, systemId: customer.systemId })
  } catch (error) {
    console.error('Error deleting customer:', error)
    return apiError('Failed to delete customer', 500)
  }
}
