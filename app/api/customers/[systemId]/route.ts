import { prisma } from '@/lib/prisma'
import { validateBody, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'
import { updateCustomerSchema } from '../validation'
import { serializeCustomer } from '../serialize'
import { getUserNameFromDb } from '@/lib/get-user-name'
import { logError } from '@/lib/logger'

// Treats null, undefined, "", [], {} as equivalent "empty"
function isEmptyValue(val: unknown): boolean {
  if (val == null) return true
  if (typeof val === 'string' && val.trim() === '') return true
  if (Array.isArray(val) && val.length === 0) return true
  if (typeof val === 'object' && val !== null && !('toNumber' in val) && !(val instanceof Date) && Object.keys(val).length === 0) return true
  return false
}

// Helper to compare values for change detection
function hasValueChanged(oldVal: unknown, newVal: unknown): boolean {
  // Both empty → no change
  if (isEmptyValue(oldVal) && isEmptyValue(newVal)) return false
  // One empty, one not → changed
  if (isEmptyValue(oldVal) || isEmptyValue(newVal)) return true
  
  // Handle Decimal (convert to number for comparison)
  const normalizedOld = typeof oldVal === 'object' && oldVal !== null && 'toNumber' in oldVal
    ? (oldVal as { toNumber: () => number }).toNumber()
    : oldVal
  const normalizedNew = typeof newVal === 'object' && newVal !== null && 'toNumber' in newVal
    ? (newVal as { toNumber: () => number }).toNumber()
    : newVal
    
  // Handle Date comparison
  if (normalizedOld instanceof Date && normalizedNew instanceof Date) {
    return normalizedOld.getTime() !== normalizedNew.getTime()
  }
  if (normalizedOld instanceof Date || normalizedNew instanceof Date) {
    const oldTime = normalizedOld instanceof Date ? normalizedOld.getTime() : new Date(normalizedOld as string).getTime()
    const newTime = normalizedNew instanceof Date ? normalizedNew.getTime() : new Date(normalizedNew as string).getTime()
    return oldTime !== newTime
  }
  
  // Handle arrays/objects
  if (typeof normalizedOld === 'object' && typeof normalizedNew === 'object') {
    return JSON.stringify(normalizedOld) !== JSON.stringify(normalizedNew)
  }
  
  return normalizedOld !== normalizedNew
}

// Helper to compute changes between old and new data
function computeChanges(
  existing: Record<string, unknown>,
  updateData: Record<string, unknown>
): Record<string, { from: unknown; to: unknown }> | null {
  const changes: Record<string, { from: unknown; to: unknown }> = {}
  
  // Fields to ignore in change tracking
  const ignoreFields = ['updatedAt', 'updatedBy']
  
  for (const [key, newValue] of Object.entries(updateData)) {
    if (ignoreFields.includes(key)) continue
    
    const oldValue = existing[key]
    if (hasValueChanged(oldValue, newValue)) {
      // Serialize Decimal to number for storage
      const serializedOld = typeof oldValue === 'object' && oldValue !== null && 'toNumber' in oldValue
        ? (oldValue as { toNumber: () => number }).toNumber()
        : oldValue
      const serializedNew = typeof newValue === 'object' && newValue !== null && 'toNumber' in newValue
        ? (newValue as { toNumber: () => number }).toNumber()
        : newValue
        
      changes[key] = { from: serializedOld, to: serializedNew }
    }
  }
  
  return Object.keys(changes).length > 0 ? changes : null
}

// GET /api/customers/[systemId]
export const GET = apiHandler(async (
  request,
  { params }
) => {
    const { systemId } = await params

    const customer = await prisma.customer.findUnique({
      where: { systemId },
    })

    if (!customer || customer.isDeleted) {
      return apiNotFound('Customer')
    }

    // Resolve employee names for createdBy/accountManagerId
    const employeeIds = [customer.createdBy, customer.accountManagerId].filter(Boolean) as string[]
    let createdByName: string | null = null
    let accountManagerName: string | null = null
    if (employeeIds.length > 0) {
      // Look up by employee systemId first
      const employees = await prisma.employee.findMany({
        where: { systemId: { in: employeeIds } },
        select: { systemId: true, fullName: true },
      })
      const empMap = new Map(employees.map(e => [e.systemId, e.fullName]))
      
      // Also look up from User table (createdBy may store User.systemId)
      const unresolvedIds = employeeIds.filter(id => !empMap.has(id))
      if (unresolvedIds.length > 0) {
        const users = await prisma.user.findMany({
          where: { systemId: { in: unresolvedIds } },
          select: { systemId: true, employee: { select: { fullName: true } } },
        })
        for (const u of users) {
          if (u.employee?.fullName) empMap.set(u.systemId, u.employee.fullName)
        }
      }
      
      createdByName = customer.createdBy ? empMap.get(customer.createdBy) || null : null
      accountManagerName = customer.accountManagerId ? empMap.get(customer.accountManagerId) || null : null
    }

    // Resolve referredBy customer name
    let referredByName: string | null = null
    if (customer.referredBy) {
      const referrer = await prisma.customer.findFirst({
        where: { systemId: customer.referredBy, isDeleted: false },
        select: { name: true },
      })
      referredByName = referrer?.name || null
    }

    return apiSuccess({ ...serializeCustomer(customer), createdByName, accountManagerName, referredByName })
})

// PUT /api/customers/[systemId]
export const PUT = apiHandler(async (
  request,
  { session, params }
) => {
    const { systemId } = await params

    // Validate body with Zod schema
    const result = await validateBody(request, updateCustomerSchema)
    if (!result.success) return apiError(result.error, 400)
    const body = result.data

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
    
    // Financial — currentDebt is server-computed only, block client override
    if (body.maxDebt !== undefined || body.creditLimit !== undefined) {
      updateData.maxDebt = body.maxDebt || body.creditLimit
    }
    
    // Classification
    // lifecycleStage is a settings concept, not a Customer schema field — skip
    if (body.status !== undefined) updateData.status = body.status
    if (body.type !== undefined) updateData.type = body.type
    if (body.customerGroup !== undefined) updateData.customerGroup = body.customerGroup
    // pricingLevel is enum (RETAIL, WHOLESALE, VIP, PARTNER) - legacy field
    // pricingPolicyId is the new field for linking to PricingPolicy table
    if (body.pricingLevel !== undefined) {
      const validPricingLevels = ['RETAIL', 'WHOLESALE', 'VIP', 'PARTNER'];
      if (body.pricingLevel && validPricingLevels.includes(body.pricingLevel)) {
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
    
    // Contact
    if (body.zaloPhone !== undefined) updateData.zaloPhone = body.zaloPhone
    
    // Payment terms
    if (body.paymentTerms !== undefined) updateData.paymentTerms = body.paymentTerms
    if (body.creditRating !== undefined) updateData.creditRating = body.creditRating
    if (body.allowCredit !== undefined) updateData.allowCredit = body.allowCredit
    
    // Multiple contacts
    if (body.contacts !== undefined) updateData.contacts = body.contacts
    
    // Contract
    if (body.contract !== undefined) updateData.contract = body.contract
    
    // Business Profiles
    if (body.businessProfiles !== undefined) updateData.businessProfiles = body.businessProfiles
    
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
    updateData.updatedAt = new Date()

    // Compute changes for activity log
    const changes = computeChanges(existing as unknown as Record<string, unknown>, updateData)

    const customer = await prisma.customer.update({
      where: { systemId },
      data: updateData,
    })

    // Fire-and-forget activity log
    if (changes) {
      // Convert boolean values to human-readable text
      const booleanLabels: Record<string, [string, string]> = {
        allowCredit: ['Không', 'Có'],
      }
      const displayChanges = { ...changes }
      for (const [key, labels] of Object.entries(booleanLabels)) {
        if (displayChanges[key]) {
          displayChanges[key] = {
            from: typeof displayChanges[key].from === 'boolean' ? labels[displayChanges[key].from ? 1 : 0] : displayChanges[key].from,
            to: typeof displayChanges[key].to === 'boolean' ? labels[displayChanges[key].to ? 1 : 0] : displayChanges[key].to,
          }
        }
      }

      const fieldLabels: Record<string, string> = {
        name: 'Tên khách hàng', email: 'Email', phone: 'Số điện thoại',
        zaloPhone: 'Zalo', company: 'Công ty', companyName: 'Tên công ty',
        taxCode: 'Mã số thuế', representative: 'Người đại diện', position: 'Chức vụ',
        gender: 'Giới tính', dateOfBirth: 'Ngày sinh', address: 'Địa chỉ',
        province: 'Tỉnh/TP', district: 'Quận/Huyện', ward: 'Phường/Xã',
        currentDebt: 'Công nợ', maxDebt: 'Hạn mức nợ', status: 'Trạng thái',
        type: 'Loại KH', customerGroup: 'Nhóm KH', source: 'Nguồn',
        campaign: 'Chiến dịch', notes: 'Ghi chú', tags: 'Thẻ',
        accountManagerId: 'NV phụ trách', social: 'Mạng xã hội',
        allowCredit: 'Cho phép công nợ', paymentTerms: 'Điều khoản thanh toán',
        creditRating: 'Xếp hạng tín dụng', referredBy: 'Người giới thiệu',
        pricingPolicyId: 'Chính sách giá', defaultDiscount: 'Chiết khấu mặc định',
      }
      const changedFieldNames = Object.keys(changes)
        .map(k => fieldLabels[k] || k)
        .slice(0, 5)
      const suffix = Object.keys(changes).length > 5 ? ` và ${Object.keys(changes).length - 5} trường khác` : ''
      const note = `Cập nhật khách hàng: ${changedFieldNames.join(', ')}${suffix}`

      getUserNameFromDb(session!.user?.id).then(userName =>
        prisma.activityLog.create({
          data: {
            entityType: 'customer',
            entityId: systemId,
            action: 'updated',
            actionType: 'update',
            changes: JSON.parse(JSON.stringify(displayChanges)),
            note,
            metadata: { userName },
            createdBy: userName,
          }
        })
      ).catch(logErr => logError('Error logging customer activity', logErr))
    }

    return apiSuccess(serializeCustomer(customer))
}, { permission: 'edit_customers' })

// PATCH /api/customers/[systemId] - alias for PUT
export { PUT as PATCH }

// DELETE /api/customers/[systemId]
export const DELETE = apiHandler(async (
  request,
  { session, params }
) => {
    const { systemId } = await params

    const customer = await prisma.customer.update({
      where: { systemId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    // Fire-and-forget activity log
    getUserNameFromDb(session!.user?.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'customer',
          entityId: systemId,
          action: 'deleted',
          actionType: 'delete',
          metadata: { userName, customerName: customer.name },
          createdBy: userName,
        }
      })
    ).catch(logErr => logError('Error logging customer delete activity', logErr))

    return apiSuccess({ success: true, systemId: customer.systemId })
}, { permission: 'delete_customers' })
