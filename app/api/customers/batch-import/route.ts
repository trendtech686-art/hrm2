import { prisma } from '@/lib/prisma'
import { Prisma, CustomerStatus, CustomerLifecycle } from '@/generated/prisma/client'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { randomUUID } from 'crypto'

/**
 * Parse Prisma errors into user-friendly messages
 */
function parsePrismaError(error: unknown): string {
  if (!(error instanceof Error)) {
    return 'Lỗi không xác định'
  }

  const message = error.message

  // Parse enum validation errors
  const enumMatch = message.match(/Invalid value for argument `(\w+)`\. Expected (\w+)/)
  if (enumMatch) {
    const [, field, enumType] = enumMatch
    const enumValues: Record<string, string[]> = {
      PricingLevel: ['RETAIL (Bán lẻ)', 'WHOLESALE (Bán sỉ)', 'VIP', 'PARTNER (Đối tác)'],
      CustomerStatus: ['ACTIVE (Hoạt động)', 'INACTIVE (Ngừng hoạt động)'],
      CustomerLifecycle: ['LEAD', 'NEW', 'REPEAT', 'LOYAL', 'VIP', 'DORMANT', 'CHURNED'],
    }
    const values = enumValues[enumType] || [enumType]
    return `Trường "${field}" không hợp lệ. Giá trị cho phép: ${values.join(', ')}`
  }

  // Parse unique constraint violation
  if (message.includes('Unique constraint failed') || message.includes('P2002')) {
    const fieldMatch = message.match(/fields: \(`(\w+)`\)/) || message.match(/on the constraint `(\w+)`/)
    const field = fieldMatch ? fieldMatch[1] : 'unknown'
    return `Giá trị "${field}" đã tồn tại trong hệ thống (trùng lặp)`
  }

  // Parse foreign key constraint
  if (message.includes('Foreign key constraint failed') || message.includes('P2003')) {
    return 'Dữ liệu tham chiếu không hợp lệ (mã không tồn tại trong hệ thống)'
  }

  // Parse required field missing
  if (message.includes('Argument') && message.includes('is missing')) {
    const fieldMatch = message.match(/Argument `(\w+)` is missing/)
    const field = fieldMatch ? fieldMatch[1] : 'unknown'
    return `Thiếu trường bắt buộc: "${field}"`
  }

  // Parse null constraint violation
  if (message.includes('null constraint') || message.includes('P2011')) {
    const fieldMatch = message.match(/column `(\w+)`/) || message.match(/field `(\w+)`/)
    const field = fieldMatch ? fieldMatch[1] : 'unknown'
    return `Trường "${field}" không được để trống`
  }

  // Parse invalid date
  if (message.includes('Invalid date') || message.includes('DateTime')) {
    return 'Ngày tháng không hợp lệ. Định dạng đúng: YYYY-MM-DD hoặc DD/MM/YYYY'
  }

  // Parse invalid number
  if (message.includes('Expected a number') || message.includes('Int')) {
    return 'Giá trị số không hợp lệ'
  }

  // Generic Prisma error - extract useful part
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const errorCodes: Record<string, string> = {
      P2000: 'Giá trị quá dài cho trường',
      P2001: 'Bản ghi không tồn tại',
      P2002: 'Giá trị đã tồn tại (trùng lặp)',
      P2003: 'Dữ liệu tham chiếu không hợp lệ',
      P2004: 'Ràng buộc dữ liệu không thỏa mãn',
      P2005: 'Giá trị không hợp lệ cho trường',
      P2006: 'Giá trị không hợp lệ',
      P2007: 'Lỗi xác thực dữ liệu',
      P2011: 'Trường bắt buộc bị để trống',
      P2012: 'Thiếu giá trị bắt buộc',
      P2025: 'Bản ghi không tồn tại',
    }
    return errorCodes[error.code] || `Lỗi database (${error.code})`
  }

  // Truncate long messages
  if (message.length > 200) {
    const keyPart = message.match(/Invalid.*?Expected \w+/) || 
                    message.match(/Argument.*?is missing/) ||
                    message.match(/constraint.*?failed/)
    if (keyPart) {
      return keyPart[0]
    }
    return message.substring(0, 150) + '...'
  }

  return message
}

/**
 * POST /api/customers/batch-import
 * 
 * Batch import customers - process ALL records in a single API call
 * Uses Prisma transactions for atomicity and performance
 * 
 * Body: {
 *   data: Customer[]  - Array of customer data to import
 *   mode: 'insert-only' | 'update-only' | 'upsert'
 * }
 */

interface ImportCustomerData {
  id?: string
  name: string
  customerGroup?: string
  phone?: string
  email?: string
  gender?: string
  dateOfBirth?: string | Date
  taxCode?: string
  address?: string
  province?: string
  district?: string
  ward?: string
  createdAt?: string | Date
  status?: string
  currentDebt?: number
  totalSpent?: number
  totalOrders?: number
  totalProductsBought?: number
  company?: string
  notes?: string
  type?: string
  lifecycleStage?: string
  source?: string
  // ... other fields
  [key: string]: unknown
}

interface BatchImportRequest {
  data: ImportCustomerData[]
  mode: 'insert-only' | 'update-only' | 'upsert'
}

interface BatchImportResult {
  success: number
  failed: number
  inserted: number
  updated: number
  skipped: number
  errors: Array<{ row: number; message: string }>
}

export async function POST(request: Request) {
  try {
    // Auth check
    const session = await requireAuth()
    if (!session) return apiError('Unauthorized', 401)

    const body: BatchImportRequest = await request.json()
    const { data, mode = 'upsert' } = body

    if (!data || !Array.isArray(data) || data.length === 0) {
      return apiError('No data provided', 400)
    }

    // Limit batch size to prevent memory issues
    if (data.length > 10000) {
      return apiError('Maximum 10,000 records per batch', 400)
    }

    const result: BatchImportResult = {
      success: 0,
      failed: 0,
      inserted: 0,
      updated: 0,
      skipped: 0,
      errors: [],
    }

    // Get existing customers by business ID for upsert logic
    const existingIds = data.map(d => d.id).filter(Boolean) as string[]
    const existingCustomers = existingIds.length > 0 
      ? await prisma.customer.findMany({
          where: { id: { in: existingIds } },
          select: { id: true, systemId: true },
        })
      : []
    
    const existingMap = new Map(existingCustomers.map(c => [c.id, c.systemId]))

    // Get last customer ID for auto-generation
    const lastCustomer = await prisma.customer.findFirst({
      orderBy: { id: 'desc' },
      where: { id: { startsWith: 'KH' } },
      select: { id: true },
    })
    let nextIdNum = lastCustomer?.id 
      ? parseInt(lastCustomer.id.replace('KH', '')) + 1
      : 1

    // Get last systemId counter for auto-generation
    const lastSystemId = await prisma.customer.findFirst({
      orderBy: { systemId: 'desc' },
      where: { systemId: { startsWith: 'CUSTOMER' } },
      select: { systemId: true },
    })
    let nextSystemIdNum = lastSystemId?.systemId
      ? parseInt(lastSystemId.systemId.replace('CUSTOMER', '')) + 1
      : 1

    // Prepare insert and update batches
    const toInsert: Prisma.CustomerCreateManyInput[] = []
    const toUpdate: Array<{ systemId: string; data: Prisma.CustomerUpdateInput }> = []

    for (let i = 0; i < data.length; i++) {
      const row = data[i]
      const rowNum = i + 2 // Excel row (1-indexed + header)

      try {
        // Validate required fields
        if (!row.name?.trim()) {
          result.errors.push({ row: rowNum, message: 'Tên khách hàng là bắt buộc' })
          result.failed++
          continue
        }

        const existingSystemId = row.id ? existingMap.get(row.id) : null

        if (existingSystemId) {
          // Record exists
          if (mode === 'insert-only') {
            result.skipped++
            continue
          }
          // Update existing
          toUpdate.push({
            systemId: existingSystemId,
            data: mapToCustomerUpdate(row),
          })
        } else {
          // New record
          if (mode === 'update-only') {
            result.errors.push({ row: rowNum, message: `Không tìm thấy KH mã ${row.id}` })
            result.failed++
            continue
          }
          
          // Generate ID if not provided
          const customerId = row.id || `KH${String(nextIdNum++).padStart(5, '0')}`
          const systemId = `CUSTOMER${String(nextSystemIdNum++).padStart(6, '0')}`
          
          toInsert.push(mapToCustomerCreate(row, customerId, systemId, session.user.id))
        }
      } catch (err) {
        result.errors.push({ 
          row: rowNum, 
          message: err instanceof Error ? err.message : 'Lỗi không xác định' 
        })
        result.failed++
      }
    }

    // Execute batch operations
    // Use transaction for insert (fast), but process updates outside transaction
    // to avoid timeout with large number of updates
    
    // Batch insert - fast with createMany in transaction
    if (toInsert.length > 0) {
      await prisma.customer.createMany({
        data: toInsert,
        skipDuplicates: true,
      })
      result.inserted = toInsert.length
    }

    // Batch update - process outside transaction to avoid timeout
    // Each update is atomic, so we don't need transaction wrapping
    if (toUpdate.length > 0) {
      const CHUNK_SIZE = 20 // Small chunks for parallel updates
      for (let i = 0; i < toUpdate.length; i += CHUNK_SIZE) {
        const chunk = toUpdate.slice(i, i + CHUNK_SIZE)
        // Parallel updates within chunk
        await Promise.all(
          chunk.map(({ systemId, data: updateData }) =>
            prisma.customer.update({
              where: { systemId },
              data: updateData,
            })
          )
        )
      }
      result.updated = toUpdate.length
    }

    result.success = result.inserted + result.updated

    return apiSuccess(result)
  } catch (error) {
    console.error('Error batch importing customers:', error)
    
    // Use friendly error message
    const friendlyMessage = parsePrismaError(error)

    return apiError(friendlyMessage, 500)
  }
}

/**
 * Remove undefined values from object - Prisma createMany doesn't accept undefined
 */
function removeUndefined<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as T
}

/**
 * Map import data to Prisma create input
 */
function mapToCustomerCreate(
  row: ImportCustomerData,
  customerId: string,
  systemId: string,
  createdBy: string
): Prisma.CustomerCreateManyInput {
  // Build addresses array from flat fields if they exist
  const addresses: Array<{
    id: string;
    label: string;
    street: string;
    ward: string;
    district: string;
    province: string;
    isDefaultShipping: boolean;
    isDefaultBilling: boolean;
  }> = [];
  
  if (row.address || row.province || row.district || row.ward) {
    addresses.push({
      id: randomUUID(),
      label: 'Địa chỉ chính',
      street: row.address || '',
      ward: row.ward || '',
      district: row.district || '',
      province: row.province || '',
      isDefaultShipping: true,
      isDefaultBilling: true,
    });
  }

  // Build object and remove undefined values - Prisma createMany doesn't accept undefined
  const data = removeUndefined({
    systemId,
    id: customerId,
    name: row.name.trim(),
    customerGroup: row.customerGroup || undefined,
    phone: row.phone || undefined,
    email: row.email || undefined,
    gender: row.gender || undefined,
    dateOfBirth: row.dateOfBirth ? new Date(row.dateOfBirth as string) : undefined,
    taxCode: row.taxCode || undefined,
    address: row.address || undefined,
    province: row.province || undefined,
    district: row.district || undefined,
    ward: row.ward || undefined,
    addresses: addresses.length > 0 ? addresses : undefined,
    status: mapStatus(row.status),
    currentDebt: row.currentDebt ? Number(row.currentDebt) : 0,
    totalSpent: row.totalSpent ? Number(row.totalSpent) : 0,
    totalOrders: row.totalOrders ? Number(row.totalOrders) : 0,
    totalProductsBought: row.totalProductsBought ? Number(row.totalProductsBought) : 0,
    maxDebt: row.maxDebt ? Number(row.maxDebt) : undefined,
    allowCredit: row.allowCredit !== undefined ? Boolean(row.allowCredit) : true,
    pricingLevel: mapPricingLevel(row.pricingLevel as string),
    company: row.company || undefined,
    companyName: row.company || undefined,
    notes: row.notes || undefined,
    type: row.type || undefined,
    lifecycleStage: mapLifecycle(row.lifecycleStage),
    source: row.source || undefined,
    createdBy,
    createdAt: row.createdAt ? new Date(row.createdAt as string) : new Date(),
  })

  return data as Prisma.CustomerCreateManyInput
}

/**
 * Map import data to Prisma update input
 */
function mapToCustomerUpdate(row: ImportCustomerData): Prisma.CustomerUpdateInput {
  const update: Prisma.CustomerUpdateInput = {}
  
  if (row.name) update.name = row.name.trim()
  if (row.customerGroup !== undefined) update.customerGroup = row.customerGroup || null
  if (row.phone !== undefined) update.phone = row.phone || null
  if (row.email !== undefined) update.email = row.email || null
  if (row.gender !== undefined) update.gender = row.gender || null
  if (row.dateOfBirth !== undefined) update.dateOfBirth = row.dateOfBirth ? new Date(row.dateOfBirth as string) : null
  if (row.taxCode !== undefined) update.taxCode = row.taxCode || null
  if (row.address !== undefined) update.address = row.address || null
  if (row.province !== undefined) update.province = row.province || null
  if (row.district !== undefined) update.district = row.district || null
  if (row.ward !== undefined) update.ward = row.ward || null
  if (row.status) update.status = mapStatus(row.status)
  if (row.currentDebt !== undefined) update.currentDebt = Number(row.currentDebt)
  if (row.totalSpent !== undefined) update.totalSpent = Number(row.totalSpent)
  if (row.totalOrders !== undefined) update.totalOrders = Number(row.totalOrders)
  if (row.totalProductsBought !== undefined) update.totalProductsBought = Number(row.totalProductsBought)
  if (row.maxDebt !== undefined) update.maxDebt = row.maxDebt ? Number(row.maxDebt) : null
  if (row.allowCredit !== undefined) update.allowCredit = Boolean(row.allowCredit)
  if (row.pricingLevel !== undefined) update.pricingLevel = mapPricingLevel(row.pricingLevel as string) || null
  if (row.company !== undefined) {
    update.company = row.company || null
    update.companyName = row.company || null
  }
  if (row.notes !== undefined) update.notes = row.notes || null
  if (row.type !== undefined) update.type = row.type || null
  if (row.lifecycleStage !== undefined) update.lifecycleStage = mapLifecycle(row.lifecycleStage)
  if (row.source !== undefined) update.source = row.source || null
  
  update.updatedAt = new Date()
  
  return update
}

/**
 * Map status string to enum
 */
function mapStatus(status?: string): CustomerStatus {
  if (!status) return 'ACTIVE'
  
  const normalized = status.toLowerCase().trim()
  if (normalized.includes('ngừng') || normalized.includes('inactive')) {
    return 'INACTIVE'
  }
  return 'ACTIVE'
}

/**
 * Map lifecycle string to enum
 * Valid values: LEAD, NEW, REPEAT, LOYAL, VIP, DORMANT, CHURNED
 */
function mapLifecycle(stage?: string): CustomerLifecycle | undefined {
  if (!stage) return undefined
  
  const normalized = stage.toLowerCase().trim()
  if (normalized.includes('lead') || normalized.includes('tiềm năng')) return 'LEAD'
  if (normalized.includes('new') || normalized.includes('mới')) return 'NEW'
  if (normalized.includes('repeat') || normalized.includes('quay lại')) return 'REPEAT'
  if (normalized.includes('loyal') || normalized.includes('trung thành')) return 'LOYAL'
  if (normalized.includes('vip')) return 'VIP'
  if (normalized.includes('dormant') || normalized.includes('không hoạt động')) return 'DORMANT'
  if (normalized.includes('churned') || normalized.includes('mất')) return 'CHURNED'
  
  return undefined
}

/**
 * Map pricing level string to enum
 * Valid values: RETAIL, WHOLESALE, VIP, PARTNER
 */
function mapPricingLevel(level?: string): 'RETAIL' | 'WHOLESALE' | 'VIP' | 'PARTNER' | undefined {
  if (!level) return undefined
  const normalized = level.toUpperCase().trim()
  if (normalized === 'RETAIL' || normalized.includes('LẺ')) return 'RETAIL'
  if (normalized === 'WHOLESALE' || normalized.includes('SỈ')) return 'WHOLESALE'
  if (normalized === 'VIP') return 'VIP'
  if (normalized === 'PARTNER' || normalized.includes('ĐỐI TÁC')) return 'PARTNER'
  return 'RETAIL' // Default
}
