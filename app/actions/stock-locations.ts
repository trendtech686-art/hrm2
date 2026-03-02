'use server'

/**
 * Server Actions for Stock Location Management (Vị trí kho)
 * 
 * Schema: StockLocation (simple flat model, no hierarchy)
 * Fields: systemId, id, name, branchId, branchSystemId, description, 
 *         isDefault, isActive, address, code
 */

import { prisma } from '@/lib/prisma'
import { revalidatePath } from '@/lib/revalidation'
import { generateIdWithPrefix } from '@/lib/id-generator'
import { auth } from '@/auth'
import type { ActionResult } from '@/types/action-result'
import { createStockLocationSchema, updateStockLocationSchema } from '@/features/stock-locations/validation'

// Types
type StockLocation = NonNullable<Awaited<ReturnType<typeof prisma.stockLocation.findFirst>>>

export type CreateStockLocationInput = {
  name: string
  code?: string
  branchId: string
  branchSystemId?: string
  description?: string
  address?: string
  isDefault?: boolean
  isActive?: boolean
  createdBy?: string
}

export type UpdateStockLocationInput = {
  systemId: string
  name?: string
  code?: string
  description?: string
  address?: string
  isDefault?: boolean
  isActive?: boolean
  updatedBy?: string
}

// ====================================
// ACTIONS
// ====================================

export async function createStockLocationAction(
  input: CreateStockLocationInput
): Promise<ActionResult<StockLocation>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  const validated = createStockLocationSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const systemId = await generateIdWithPrefix('VTK', prisma)

    // If setting as default, unset other defaults in the same branch
    if (input.isDefault) {
      await prisma.stockLocation.updateMany({
        where: {
          branchId: input.branchId,
          isDefault: true,
        },
        data: { isDefault: false },
      })
    }

    const stockLocation = await prisma.stockLocation.create({
      data: {
        systemId,
        id: systemId,
        name: input.name,
        code: input.code ?? systemId,
        branchId: input.branchId,
        branchSystemId: input.branchSystemId,
        description: input.description,
        address: input.address,
        isDefault: input.isDefault ?? false,
        isActive: input.isActive ?? true,
        createdBy: input.createdBy,
      },
    })

    revalidatePath('/stock-locations')
    return { success: true, data: stockLocation }
  } catch (error) {
    console.error('Error creating stock location:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể tạo vị trí kho',
    }
  }
}

export async function updateStockLocationAction(
  input: UpdateStockLocationInput
): Promise<ActionResult<StockLocation>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  const validated = updateStockLocationSchema.safeParse(input)
  if (!validated.success) {
    return { success: false, error: validated.error.issues[0]?.message || 'Dữ liệu không hợp lệ' }
  }

  try {
    const { systemId, ...data } = input

    const existing = await prisma.stockLocation.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy vị trí kho' }
    }

    // If setting as default, unset other defaults in the same branch
    if (data.isDefault && existing.branchId) {
      await prisma.stockLocation.updateMany({
        where: {
          branchId: existing.branchId,
          isDefault: true,
          systemId: { not: systemId },
        },
        data: { isDefault: false },
      })
    }

    const updateData: Record<string, unknown> = {}
    
    if (data.name !== undefined) updateData.name = data.name
    if (data.code !== undefined) updateData.code = data.code
    if (data.description !== undefined) updateData.description = data.description
    if (data.address !== undefined) updateData.address = data.address
    if (data.isDefault !== undefined) updateData.isDefault = data.isDefault
    if (data.isActive !== undefined) updateData.isActive = data.isActive
    if (data.updatedBy !== undefined) updateData.updatedBy = data.updatedBy

    const stockLocation = await prisma.stockLocation.update({
      where: { systemId },
      data: updateData,
    })

    revalidatePath('/stock-locations')
    revalidatePath(`/stock-locations/${systemId}`)
    return { success: true, data: stockLocation }
  } catch (error) {
    console.error('Error updating stock location:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể cập nhật vị trí kho',
    }
  }
}

export async function deleteStockLocationAction(
  systemId: string
): Promise<ActionResult<StockLocation>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  try {
    const existing = await prisma.stockLocation.findUnique({
      where: { systemId },
      include: { inventoryRecords: true },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy vị trí kho' }
    }

    // Check for inventory items
    if (existing.inventoryRecords.length > 0) {
      return {
        success: false,
        error: 'Không thể xóa vị trí kho đang có hàng tồn',
      }
    }

    // Soft delete by setting isActive = false
    const stockLocation = await prisma.stockLocation.update({
      where: { systemId },
      data: { isActive: false },
    })

    revalidatePath('/stock-locations')
    return { success: true, data: stockLocation }
  } catch (error) {
    console.error('Error deleting stock location:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể xóa vị trí kho',
    }
  }
}

export async function restoreStockLocationAction(
  systemId: string
): Promise<ActionResult<StockLocation>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  try {
    const existing = await prisma.stockLocation.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy vị trí kho' }
    }

    const stockLocation = await prisma.stockLocation.update({
      where: { systemId },
      data: { isActive: true },
    })

    revalidatePath('/stock-locations')
    revalidatePath(`/stock-locations/${systemId}`)
    return { success: true, data: stockLocation }
  } catch (error) {
    console.error('Error restoring stock location:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể khôi phục vị trí kho',
    }
  }
}

export async function getStockLocationAction(
  systemId: string
): Promise<ActionResult<StockLocation & { inventoryRecords: unknown[] }>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  try {
    const stockLocation = await prisma.stockLocation.findUnique({
      where: { systemId },
      include: {
        inventoryRecords: true,
      },
    })

    if (!stockLocation) {
      return { success: false, error: 'Không tìm thấy vị trí kho' }
    }

    return { success: true, data: stockLocation }
  } catch (error) {
    console.error('Error getting stock location:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể lấy thông tin vị trí kho',
    }
  }
}

export async function setDefaultStockLocationAction(
  systemId: string
): Promise<ActionResult<StockLocation>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  try {
    const existing = await prisma.stockLocation.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return { success: false, error: 'Không tìm thấy vị trí kho' }
    }

    if (!existing.branchId) {
      return { success: false, error: 'Vị trí kho chưa gán chi nhánh' }
    }

    // Unset current default
    await prisma.stockLocation.updateMany({
      where: {
        branchId: existing.branchId,
        isDefault: true,
      },
      data: { isDefault: false },
    })

    // Set new default
    const stockLocation = await prisma.stockLocation.update({
      where: { systemId },
      data: { isDefault: true },
    })

    revalidatePath('/stock-locations')
    revalidatePath(`/stock-locations/${systemId}`)
    return { success: true, data: stockLocation }
  } catch (error) {
    console.error('Error setting default stock location:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể đặt vị trí kho mặc định',
    }
  }
}

export async function getStockLocationsByBranchAction(
  branchId: string
): Promise<ActionResult<StockLocation[]>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  try {
    const stockLocations = await prisma.stockLocation.findMany({
      where: {
        branchId,
        isActive: true,
      },
      orderBy: { name: 'asc' },
    })

    return { success: true, data: stockLocations }
  } catch (error) {
    console.error('Error getting stock locations by branch:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể lấy danh sách vị trí kho',
    }
  }
}

export async function getAllStockLocationsAction(): Promise<ActionResult<StockLocation[]>> {
  const session = await auth()
  if (!session?.user) {
    return { success: false, error: 'Chưa đăng nhập' }
  }

  try {
    const stockLocations = await prisma.stockLocation.findMany({
      where: { isActive: true },
      orderBy: [
        { branchId: 'asc' },
        { name: 'asc' },
      ],
    })

    return { success: true, data: stockLocations }
  } catch (error) {
    console.error('Error getting all stock locations:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Không thể lấy danh sách vị trí kho',
    }
  }
}
