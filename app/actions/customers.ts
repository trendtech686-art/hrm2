'use server'

/**
 * Server Actions for Customers Management (Khách hàng)
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { requireActionPermission, type ApiSession } from '@/lib/api-utils'
import type { ActionResult } from '@/types/action-result'
import { customerFormSchema } from '@/features/customers/validation'
import { logError } from '@/lib/logger'
import { syncSingleCustomer, deleteFromIndex } from '@/lib/meilisearch-sync'

// Types
type Customer = NonNullable<Awaited<ReturnType<typeof prisma.customer.findFirst>>>

// Helper to get user name from session (required for activity logging)
async function getUserNameFromSession(session: ApiSession): Promise<string> {
  // Try session.user.employee.fullName first (available if employee is linked)
  if (session.user.employee?.fullName) {
    return session.user.employee.fullName
  }
  
  // Try session.user.name (might be email or employee name from auth)
  if (session.user.name && session.user.name !== session.user.email) {
    return session.user.name
  }
  
  // Lookup from database using employeeId
  if (session.user.employeeId) {
    const employee = await prisma.employee.findUnique({
      where: { systemId: session.user.employeeId },
      select: { fullName: true },
    })
    if (employee?.fullName) {
      return employee.fullName
    }
  }
  
  // Lookup from User table using user ID
  if (session.user.id) {
    const user = await prisma.user.findFirst({
      where: { systemId: session.user.id },
      select: { employee: { select: { fullName: true } } }
    })
    if (user?.employee?.fullName) {
      return user.employee.fullName
    }
  }
  
  // Return email as last resort (not null, always have some identifier)
  return session.user.email || session.user.id
}

// Serialize Decimal fields to numbers for client components
function serializeCustomer<T extends Record<string, unknown>>(customer: T): T {
  return {
    ...customer,
    currentDebt: customer.currentDebt != null ? Number(customer.currentDebt) : customer.currentDebt,
    maxDebt: customer.maxDebt != null ? Number(customer.maxDebt) : customer.maxDebt,
    defaultDiscount: customer.defaultDiscount != null ? Number(customer.defaultDiscount) : customer.defaultDiscount,
    totalSpent: customer.totalSpent != null ? Number(customer.totalSpent) : customer.totalSpent,
  } as T;
}

export type CreateCustomerInput = {
  name: string
  phone?: string
  company?: string
  companyName?: string
  taxCode?: string
  representative?: string
  position?: string
  addresses?: unknown
  gender?: string
  dateOfBirth?: string | Date
  address?: string
  province?: string
  district?: string
  ward?: string
  pricingLevel?: string
  pricingPolicyId?: string
  defaultDiscount?: number
  tags?: string[]
  notes?: string
  zaloPhone?: string
  bankName?: string
  bankAccount?: string
  type?: string
  customerGroup?: string
  source?: string
  campaign?: string
  referredBy?: string
  contacts?: unknown
  paymentTerms?: string
  creditRating?: string
  allowCredit?: boolean
  businessProfiles?: unknown
  lifecycleStage?: string
  images?: string[]
  social?: unknown
  createdBy?: string
}

export type UpdateCustomerInput = {
  systemId: string
  name?: string
  phone?: string
  company?: string
  companyName?: string
  status?: string
  taxCode?: string
  representative?: string
  position?: string
  addresses?: unknown
  gender?: string
  dateOfBirth?: string | Date | null
  address?: string
  province?: string
  district?: string
  ward?: string
  currentDebt?: number
  maxDebt?: number
  pricingLevel?: string
  pricingPolicyId?: string
  defaultDiscount?: number
  accountManagerId?: string
  tags?: string[]
  notes?: string
  zaloPhone?: string
  type?: string
  customerGroup?: string
  source?: string
  campaign?: string
  referredBy?: string
  contacts?: unknown
  paymentTerms?: string
  creditRating?: string
  allowCredit?: boolean
  businessProfiles?: unknown
  lifecycleStage?: string
  images?: string[]
  social?: unknown
  updatedBy?: string
}

// ====================================
// ACTIONS
// ====================================

export async function createCustomerAction(
  input: CreateCustomerInput
): Promise<ActionResult<Customer>> {
  const authResult = await requireActionPermission('create_customers')
  if (!authResult.success) return authResult
  
  const { session } = authResult
  const validated = customerFormSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }
  try {
    const systemId = await generateIdWithPrefix('KH', prisma)

    const customer = await prisma.customer.create({
      data: {
        systemId,
        id: systemId,
        name: input.name,
        phone: input.phone,
        company: input.company,
        companyName: input.companyName,
        taxCode: input.taxCode,
        representative: input.representative,
        position: input.position,
        addresses: input.addresses as never,
        gender: input.gender,
        dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : null,
        address: input.address,
        province: input.province,
        district: input.district,
        ward: input.ward,
        pricingLevel: (['RETAIL', 'WHOLESALE', 'VIP', 'PARTNER'].includes(input.pricingLevel || '') ? input.pricingLevel : undefined) as never,
        pricingPolicyId: input.pricingPolicyId || (!['RETAIL', 'WHOLESALE', 'VIP', 'PARTNER'].includes(input.pricingLevel || '') ? input.pricingLevel : undefined),
        defaultDiscount: input.defaultDiscount,
        tags: input.tags ?? [],
        notes: input.notes,
        zaloPhone: input.zaloPhone,
        type: input.type,
        customerGroup: input.customerGroup,
        source: input.source,
        campaign: input.campaign,
        referredBy: input.referredBy,
        contacts: input.contacts as never,
        paymentTerms: input.paymentTerms,
        creditRating: input.creditRating,
        allowCredit: input.allowCredit,
        businessProfiles: input.businessProfiles as never,
        images: input.images ?? [],
        social: input.social as never,
        createdBy: session.user.id,
      },
    })

    // Log activity for creation (fire-and-forget)
    getUserNameFromSession(session).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'customer',
          entityId: systemId,
          action: 'created',
          actionType: 'create',
          note: `Tạo khách hàng mới: ${customer.name || ''} (${customer.id})`,
          metadata: { userName },
          createdBy: userName,
        },
      })
    ).catch(e => logError('Activity log failed', e))

    revalidatePath('/customers')

    // Fire-and-forget: sync to Meilisearch
    syncSingleCustomer(customer.systemId).catch(e => logError('[Meilisearch] Customer create sync failed', e))

    return { success: true, data: serializeCustomer(customer) }
  } catch (error) {
    logError('Error creating customer', error)
    return {
      success: false,
      error: 'Không thể tạo khách hàng. Vui lòng thử lại.',
    }
  }
}

export async function updateCustomerAction(
  input: UpdateCustomerInput
): Promise<ActionResult<Customer>> {
  const authResult = await requireActionPermission('edit_customers')
  if (!authResult.success) return authResult
  const session = authResult.session
  const validated = customerFormSchema.partial().safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }
  try {
    const { systemId, ...data } = input

    const existing = await prisma.customer.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy khách hàng' }
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.name !== undefined) updateData.name = data.name
    if (data.phone !== undefined) updateData.phone = data.phone
    if (data.company !== undefined) updateData.company = data.company
    if (data.companyName !== undefined) updateData.companyName = data.companyName
    if (data.status !== undefined) {
      const statusMap: Record<string, string> = { 'Đang giao dịch': 'ACTIVE', 'Ngừng Giao Dịch': 'INACTIVE', 'active': 'ACTIVE', 'inactive': 'INACTIVE' }
      updateData.status = statusMap[data.status] || data.status
    }
    if (data.taxCode !== undefined) updateData.taxCode = data.taxCode
    if (data.representative !== undefined) updateData.representative = data.representative
    if (data.position !== undefined) updateData.position = data.position
    if (data.addresses !== undefined) updateData.addresses = data.addresses
    if (data.gender !== undefined) updateData.gender = data.gender
    if (data.dateOfBirth !== undefined) {
      updateData.dateOfBirth = data.dateOfBirth ? new Date(data.dateOfBirth) : null
    }
    if (data.address !== undefined) updateData.address = data.address
    if (data.province !== undefined) updateData.province = data.province
    if (data.district !== undefined) updateData.district = data.district
    if (data.ward !== undefined) updateData.ward = data.ward
    if (data.currentDebt !== undefined) updateData.currentDebt = data.currentDebt
    if (data.maxDebt !== undefined) updateData.maxDebt = data.maxDebt
    if (data.pricingLevel !== undefined) {
      const pricingLevelEnums = ['RETAIL', 'WHOLESALE', 'VIP', 'PARTNER']
      if (pricingLevelEnums.includes(data.pricingLevel)) {
        updateData.pricingLevel = data.pricingLevel
      } else {
        // Form sends pricingPolicy ID in pricingLevel field - save to pricingPolicyId
        updateData.pricingPolicyId = data.pricingLevel
      }
    }
    if (data.pricingPolicyId !== undefined) updateData.pricingPolicyId = data.pricingPolicyId
    if (data.defaultDiscount !== undefined) updateData.defaultDiscount = data.defaultDiscount
    if (data.accountManagerId !== undefined) updateData.accountManagerId = data.accountManagerId
    if (data.tags !== undefined) updateData.tags = data.tags
    if (data.notes !== undefined) updateData.notes = data.notes
    if (data.zaloPhone !== undefined) updateData.zaloPhone = data.zaloPhone
    if (data.type !== undefined) updateData.type = data.type
    if (data.customerGroup !== undefined) updateData.customerGroup = data.customerGroup
    if (data.source !== undefined) updateData.source = data.source
    if (data.campaign !== undefined) updateData.campaign = data.campaign
    if (data.referredBy !== undefined) updateData.referredBy = data.referredBy
    if (data.contacts !== undefined) updateData.contacts = data.contacts
    if (data.paymentTerms !== undefined) updateData.paymentTerms = data.paymentTerms
    if (data.creditRating !== undefined) updateData.creditRating = data.creditRating
    if (data.allowCredit !== undefined) updateData.allowCredit = data.allowCredit
    if (data.businessProfiles !== undefined) updateData.businessProfiles = data.businessProfiles
    // lifecycleStage is a settings concept, not a Customer schema field — skip
    if (data.images !== undefined) updateData.images = data.images
    if (data.social !== undefined) updateData.social = data.social
    if (data.updatedBy !== undefined) updateData.updatedBy = data.updatedBy

    const customer = await prisma.customer.update({
      where: { systemId },
      data: updateData,
    })

    // Log activity: compute changed fields
    try {
      // Helper to normalize values for comparison
      // Treats null, undefined, "", [], {} as equivalent "empty" to avoid false changes
      const isEmptyValue = (val: unknown): boolean => {
        if (val === null || val === undefined) return true;
        if (typeof val === 'string' && val.trim() === '') return true;
        if (Array.isArray(val) && val.length === 0) return true;
        if (typeof val === 'object' && val !== null && !('toNumber' in val) && !(val instanceof Date) && Object.keys(val).length === 0) return true;
        return false;
      };
      const normalizeForCompare = (val: unknown): string => {
        if (isEmptyValue(val)) return 'null';
        if (val instanceof Date) {
          return val.toISOString().split('T')[0];
        }
        if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(val)) {
          return val.split('T')[0];
        }
        // Handle Decimal types from Prisma
        if (typeof val === 'object' && val !== null && 'toNumber' in val) {
          return String((val as { toNumber: () => number }).toNumber());
        }
        // Normalize numbers: 0 and "0" should match
        if (typeof val === 'number') return String(val);
        return JSON.stringify(val);
      };
      
      const changes: Record<string, { from: unknown; to: unknown }> = {}
      for (const key of Object.keys(updateData)) {
        if (key === 'updatedAt' || key === 'updatedBy') continue;
        const oldVal = (existing as Record<string, unknown>)[key]
        const newVal = (customer as Record<string, unknown>)[key]
        if (normalizeForCompare(oldVal) !== normalizeForCompare(newVal)) {
          // Convert Decimal to number for storage
          const serializedOld = typeof oldVal === 'object' && oldVal !== null && 'toNumber' in oldVal
            ? (oldVal as { toNumber: () => number }).toNumber()
            : oldVal ?? null;
          const serializedNew = typeof newVal === 'object' && newVal !== null && 'toNumber' in newVal
            ? (newVal as { toNumber: () => number }).toNumber()
            : newVal ?? null;
          changes[key] = { from: serializedOld, to: serializedNew }
        }
      }
      if (Object.keys(changes).length > 0) {
        const fieldLabels: Record<string, string> = {
          name: 'Tên', email: 'Email', phone: 'Số điện thoại',
          company: 'Công ty', companyName: 'Tên công ty', status: 'Trạng thái',
          taxCode: 'Mã số thuế', representative: 'Người đại diện', position: 'Chức vụ',
          addresses: 'Địa chỉ', gender: 'Giới tính', dateOfBirth: 'Ngày sinh',
          address: 'Địa chỉ', province: 'Tỉnh/Thành phố', district: 'Quận/Huyện', ward: 'Phường/Xã',
          maxDebt: 'Hạn mức công nợ', currentDebt: 'Công nợ hiện tại',
          pricingLevel: 'Cấp giá', pricingPolicyId: 'Bảng giá áp dụng',
          defaultDiscount: 'Chiết khấu mặc định', accountManagerId: 'Người quản lý',
          tags: 'Thẻ', notes: 'Ghi chú', zaloPhone: 'Zalo',
          bankName: 'Ngân hàng', bankAccount: 'Số tài khoản',
          type: 'Loại khách hàng', customerGroup: 'Nhóm khách hàng',
          source: 'Nguồn', campaign: 'Chiến dịch', referredBy: 'Người giới thiệu',
          contacts: 'Người liên hệ', paymentTerms: 'Điều khoản thanh toán',
          creditRating: 'Xếp hạng tín dụng', allowCredit: 'Cho phép công nợ',
          businessProfiles: 'Thông tin doanh nghiệp', lifecycleStage: 'Giai đoạn vòng đời',
          images: 'Hình ảnh', social: 'Mạng xã hội',
        };
        const changedFieldNames = Object.keys(changes)
          .map(k => fieldLabels[k] || k)
          .slice(0, 5);
        const suffix = Object.keys(changes).length > 5 ? ` và ${Object.keys(changes).length - 5} trường khác` : '';
        const note = `Cập nhật khách hàng: ${changedFieldNames.join(', ')}${suffix}`;
        
        // Fire-and-forget activity log
        getUserNameFromSession(session).then(userName =>
          prisma.activityLog.create({
            data: {
              entityType: 'customer',
              entityId: systemId,
              action: 'updated',
              actionType: 'update',
              changes: JSON.parse(JSON.stringify(changes)),
              note,
              metadata: { userName },
              createdBy: userName,
            },
          })
        ).catch(e => logError('Activity log failed', e))
      }
    } catch {
      // Don't fail the update if logging fails
    }

    revalidatePath('/customers')
    revalidatePath(`/customers/${systemId}`)

    // Fire-and-forget: sync to Meilisearch
    syncSingleCustomer(systemId).catch(e => logError('[Meilisearch] Customer update sync failed', e))

    return { success: true, data: serializeCustomer(customer) }
  } catch (error) {
    logError('Error updating customer', error)
    return {
      success: false,
      error: 'Không thể cập nhật khách hàng. Vui lòng thử lại.',
    }
  }
}

export async function deleteCustomerAction(
  systemId: string
): Promise<ActionResult<Customer>> {
  const authResult = await requireActionPermission('delete_customers')
  if (!authResult.success) return authResult
  const session = authResult.session
  try {
    const existing = await prisma.customer.findUnique({ where: { systemId }, select: { name: true, id: true } });
    const customer = await prisma.customer.update({
      where: { systemId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    // Log activity for deletion (fire-and-forget)
    getUserNameFromSession(session).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'customer',
          entityId: systemId,
          action: 'deleted',
          actionType: 'delete',
          note: `Xóa khách hàng: ${existing?.name || ''} (${existing?.id || systemId})`,
          metadata: { userName },
          createdBy: userName,
        },
      })
    ).catch(e => logError('Activity log failed', e))

    revalidatePath('/customers')

    // Fire-and-forget: remove from Meilisearch
    deleteFromIndex('customers', systemId).catch(e => logError('[Meilisearch] Customer delete sync failed', e))

    return { success: true, data: serializeCustomer(customer) }
  } catch (error) {
    logError('Error deleting customer', error)
    return {
      success: false,
      error: 'Không thể xóa khách hàng. Vui lòng thử lại.',
    }
  }
}

export async function restoreCustomerAction(
  systemId: string
): Promise<ActionResult<Customer>> {
  const authResult = await requireActionPermission('edit_customers')
  if (!authResult.success) return authResult
  const session = authResult.session
  try {
    const customer = await prisma.customer.update({
      where: { systemId },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    })

    // Log activity for restore (fire-and-forget)
    getUserNameFromSession(session).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'customer',
          entityId: systemId,
          action: 'restored',
          actionType: 'update',
          note: `Khôi phục khách hàng: ${customer.name || ''} (${customer.id || systemId})`,
          metadata: { userName },
          createdBy: userName,
        },
      })
    ).catch(e => logError('Activity log failed', e))

    revalidatePath('/customers')

    // Fire-and-forget: sync restored customer to Meilisearch
    syncSingleCustomer(systemId).catch(e => logError('[Meilisearch] Customer restore sync failed', e))

    return { success: true, data: serializeCustomer(customer) }
  } catch (error) {
    logError('Error restoring customer', error)
    return {
      success: false,
      error: 'Không thể khôi phục khách hàng. Vui lòng thử lại.',
    }
  }
}

export async function getCustomerAction(
  systemId: string
): Promise<ActionResult<Customer>> {
  const authResult = await requireActionPermission('view_customers')
  if (!authResult.success) return authResult
  try {
    const customer = await prisma.customer.findUnique({
      where: { systemId },
    })

    if (!customer) {
      return { success: false, error: 'Không tìm thấy khách hàng' }
    }

    return { success: true, data: serializeCustomer(customer) }
  } catch (error) {
    logError('Error getting customer', error)
    return {
      success: false,
      error: 'Không thể lấy thông tin khách hàng. Vui lòng thử lại.',
    }
  }
}

import { z } from 'zod'

const updateDebtSchema = z.object({
  systemId: z.string().min(1, 'ID khách hàng là bắt buộc'),
  amount: z.number().positive('Số tiền phải lớn hơn 0'),
  operation: z.enum(['add', 'subtract'], { message: 'Thao tác không hợp lệ' }),
})

export async function updateCustomerDebtAction(
  systemId: string,
  amount: number,
  operation: 'add' | 'subtract'
): Promise<ActionResult<Customer>> {
  const authResult = await requireActionPermission('edit_customers')
  if (!authResult.success) return authResult
  const { session } = authResult

  const validated = updateDebtSchema.safeParse({ systemId, amount, operation })
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    // Use atomic transaction with increment to prevent race condition
    let oldDebt: number
    let customerName: string

    const updated = await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.findUnique({
        where: { systemId },
      })

      if (!customer) {
        throw new Error('CUSTOMER_NOT_FOUND')
      }

      oldDebt = Number(customer.currentDebt ?? 0)
      customerName = customer.name

      const newDebt = operation === 'add'
        ? oldDebt + amount
        : oldDebt - amount

      return tx.customer.update({
        where: { systemId },
        data: { currentDebt: newDebt },
      })
    })

    // Activity log (fire-and-forget)
    getUserNameFromSession(session).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'customer',
          entityId: systemId,
          action: 'debt_updated',
          actionType: 'update',
          changes: { currentDebt: { from: oldDebt, to: updated.currentDebt } },
          note: `${operation === 'add' ? 'Tăng' : 'Giảm'} công nợ khách hàng: ${customerName} — ${operation === 'add' ? '+' : '-'}${amount.toLocaleString('vi-VN')} đ`,
          metadata: { userName, amount, operation },
          createdBy: userName,
        },
      })
    ).catch(e => logError('Activity log failed', e))

    revalidatePath('/customers')
    revalidatePath(`/customers/${systemId}`)
    return { success: true, data: serializeCustomer(updated) }
  } catch (error) {
    logError('Error updating customer debt', error)

    if (error instanceof Error && error.message === 'CUSTOMER_NOT_FOUND') {
      return { success: false, error: 'Không tìm thấy khách hàng' }
    }

    return {
      success: false,
      error: 'Không thể cập nhật công nợ khách hàng. Vui lòng thử lại.',
    }
  }
}
