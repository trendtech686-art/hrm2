'use server'

/**
 * Server Actions for Customers Management (Khách hàng)
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { auth } from '@/auth'
import type { ActionResult } from '@/types/action-result'
import { customerFormSchema } from '@/features/customers/validation'

// Types
type Customer = NonNullable<Awaited<ReturnType<typeof prisma.customer.findFirst>>>

export type CreateCustomerInput = {
  name: string
  email?: string
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
  contract?: unknown
  images?: string[]
  social?: unknown
  createdBy?: string
}

export type UpdateCustomerInput = {
  systemId: string
  name?: string
  email?: string
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
  maxDebt?: number
  pricingLevel?: string
  pricingPolicyId?: string
  defaultDiscount?: number
  accountManagerId?: string
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
  contract?: unknown
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
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
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
        email: input.email,
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
        pricingLevel: input.pricingLevel as never,
        pricingPolicyId: input.pricingPolicyId,
        defaultDiscount: input.defaultDiscount,
        tags: input.tags ?? [],
        notes: input.notes,
        zaloPhone: input.zaloPhone,
        bankName: input.bankName,
        bankAccount: input.bankAccount,
        type: input.type,
        customerGroup: input.customerGroup,
        source: input.source,
        campaign: input.campaign,
        referredBy: input.referredBy,
        contacts: input.contacts as never,
        paymentTerms: input.paymentTerms,
        creditRating: input.creditRating,
        allowCredit: input.allowCredit,
        contract: input.contract as never,
        images: input.images ?? [],
        social: input.social as never,
        createdBy: input.createdBy,
      },
    })

    revalidatePath('/customers')
    return { success: true, data: customer }
  } catch (error) {
    console.error('Error creating customer:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tạo khách hàng',
    }
  }
}

export async function updateCustomerAction(
  input: UpdateCustomerInput
): Promise<ActionResult<Customer>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
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
    if (data.email !== undefined) updateData.email = data.email
    if (data.phone !== undefined) updateData.phone = data.phone
    if (data.company !== undefined) updateData.company = data.company
    if (data.companyName !== undefined) updateData.companyName = data.companyName
    if (data.status !== undefined) updateData.status = data.status
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
    if (data.maxDebt !== undefined) updateData.maxDebt = data.maxDebt
    if (data.pricingLevel !== undefined) updateData.pricingLevel = data.pricingLevel
    if (data.pricingPolicyId !== undefined) updateData.pricingPolicyId = data.pricingPolicyId
    if (data.defaultDiscount !== undefined) updateData.defaultDiscount = data.defaultDiscount
    if (data.accountManagerId !== undefined) updateData.accountManagerId = data.accountManagerId
    if (data.tags !== undefined) updateData.tags = data.tags
    if (data.notes !== undefined) updateData.notes = data.notes
    if (data.zaloPhone !== undefined) updateData.zaloPhone = data.zaloPhone
    if (data.bankName !== undefined) updateData.bankName = data.bankName
    if (data.bankAccount !== undefined) updateData.bankAccount = data.bankAccount
    if (data.type !== undefined) updateData.type = data.type
    if (data.customerGroup !== undefined) updateData.customerGroup = data.customerGroup
    if (data.source !== undefined) updateData.source = data.source
    if (data.campaign !== undefined) updateData.campaign = data.campaign
    if (data.referredBy !== undefined) updateData.referredBy = data.referredBy
    if (data.contacts !== undefined) updateData.contacts = data.contacts
    if (data.paymentTerms !== undefined) updateData.paymentTerms = data.paymentTerms
    if (data.creditRating !== undefined) updateData.creditRating = data.creditRating
    if (data.allowCredit !== undefined) updateData.allowCredit = data.allowCredit
    if (data.contract !== undefined) updateData.contract = data.contract
    if (data.images !== undefined) updateData.images = data.images
    if (data.social !== undefined) updateData.social = data.social
    if (data.updatedBy !== undefined) updateData.updatedBy = data.updatedBy

    const customer = await prisma.customer.update({
      where: { systemId },
      data: updateData,
    })

    revalidatePath('/customers')
    revalidatePath(`/customers/${systemId}`)
    return { success: true, data: customer }
  } catch (error) {
    console.error('Error updating customer:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật khách hàng',
    }
  }
}

export async function deleteCustomerAction(
  systemId: string
): Promise<ActionResult<Customer>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const customer = await prisma.customer.update({
      where: { systemId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    revalidatePath('/customers')
    return { success: true, data: customer }
  } catch (error) {
    console.error('Error deleting customer:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xóa khách hàng',
    }
  }
}

export async function restoreCustomerAction(
  systemId: string
): Promise<ActionResult<Customer>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const customer = await prisma.customer.update({
      where: { systemId },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    })

    revalidatePath('/customers')
    return { success: true, data: customer }
  } catch (error) {
    console.error('Error restoring customer:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể khôi phục khách hàng',
    }
  }
}

export async function getCustomerAction(
  systemId: string
): Promise<ActionResult<Customer>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const customer = await prisma.customer.findUnique({
      where: { systemId },
    })

    if (!customer) {
      return { success: false, error: 'Không tìm thấy khách hàng' }
    }

    return { success: true, data: customer }
  } catch (error) {
    console.error('Error getting customer:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể lấy thông tin khách hàng',
    }
  }
}

export async function updateCustomerDebtAction(
  systemId: string,
  amount: number,
  operation: 'add' | 'subtract'
): Promise<ActionResult<Customer>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }
  try {
    const customer = await prisma.customer.findUnique({
      where: { systemId },
    })

    if (!customer) {
      return { success: false, error: 'Không tìm thấy khách hàng' }
    }

    const currentDebt = Number(customer.currentDebt ?? 0)
    const newDebt = operation === 'add' 
      ? currentDebt + amount 
      : currentDebt - amount

    const updated = await prisma.customer.update({
      where: { systemId },
      data: { currentDebt: newDebt },
    })

    revalidatePath('/customers')
    revalidatePath(`/customers/${systemId}`)
    return { success: true, data: updated }
  } catch (error) {
    console.error('Error updating customer debt:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật công nợ khách hàng',
    }
  }
}
