import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, apiSuccess, apiError, apiPaginated, validateBody } from '@/lib/api-utils'
import { parsePagination } from '@/lib/api-utils'
import { API_MAX_PAGE_LIMIT } from '@/lib/pagination-constants'
import { randomUUID } from 'crypto'
import { logError } from '@/lib/logger'
import { createActivityLog } from '@/lib/services/activity-log-service'
import type { ActivityLogEntityType } from '@/lib/types/prisma-extended'
import { z } from 'zod'

// Validation schema for import job POST
const createImportJobSchema = z.object({
  entityType: z.string().min(1, 'entityType is required'),
  data: z.array(z.any()).min(1, 'data must be a non-empty array'),
  mode: z.enum(['insert-only', 'update-only', 'upsert']).optional().default('upsert'),
  branchId: z.string().optional(),
  fileName: z.string().optional(),
  fileSize: z.number().optional(),
})

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
    // Try to extract the key part
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
 * POST /api/import-jobs
 * 
 * Create a new background import job
 * Returns immediately with job ID, processing happens in background
 * 
 * Body: {
 *   entityType: 'customers' | 'products' | 'employees' | etc.
 *   data: any[]  - Array of records to import
 *   mode: 'insert-only' | 'update-only' | 'upsert'
 *   branchId?: string
 *   fileName?: string
 *   fileSize?: number
 * }
 */
export async function POST(request: Request) {
  try {
    const session = await requireAuth()
    if (!session) return apiError('Unauthorized', 401)

    const validation = await validateBody(request, createImportJobSchema)
    if (!validation.success) return apiError(validation.error, 400)
    const { entityType, data, mode, branchId, fileName, fileSize } = validation.data

    // Limit to 20k records per import
    if (data.length > 20000) {
      return apiError('Maximum 20,000 records per import', 400)
    }

    // Calculate chunks (500 records per chunk)
    const CHUNK_SIZE = 500
    const totalChunks = Math.ceil(data.length / CHUNK_SIZE)

    // Create import job record
    const job = await prisma.importExportLog.create({
      data: {
        type: 'import',
        entityType,
        status: 'pending',
        totalRecords: data.length,
        successCount: 0,
        errorCount: 0,
        skippedCount: 0,
        insertedCount: 0,
        updatedCount: 0,
        progress: 0,
        processedRecords: 0,
        currentChunk: 0,
        totalChunks,
        importData: JSON.stringify(data),
        importMode: mode,
        branchId: branchId || null,
        fileName: fileName || null,
        fileSize: fileSize || 0,
        performedBy: session.user.name || 'System',
        userId: session.user.id,
        performedAt: new Date(),
      },
    })

    // Start background processing (non-blocking)
    processImportJob(job.id).catch(err => {
      logError(`Import job ${job.id} failed`, err)
    })

    createActivityLog({
      entityType: 'order' as ActivityLogEntityType,
      entityId: job.id,
      action: `Tạo job import ${entityType}`,
      actionType: 'create',
      metadata: {
        entityType,
        totalRecords: data.length,
        mode,
        fileName,
      },
      createdBy: session.user.name || 'System',
    }).catch(e => logError('[import-jobs] activity log failed', e))

    return apiSuccess({
      jobId: job.id,
      status: 'pending',
      totalRecords: data.length,
      totalChunks,
      message: 'Import job created. Check /settings/import-export-logs for progress.',
    })
  } catch (error) {
    logError('Error creating import job', error)
    return apiError(
      error instanceof Error ? error.message : 'Failed to create import job',
      500
    )
  }
}

/**
 * GET /api/import-jobs
 * 
 * List recent import jobs for current user
 */
export async function GET(request: Request) {
  try {
    const session = await requireAuth()
    if (!session) return apiError('Unauthorized', 401)

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const entityType = searchParams.get('entityType')
    const { page, limit, skip } = parsePagination(searchParams)
    const safeLimit = Math.min(limit, API_MAX_PAGE_LIMIT)

    const [jobs, total] = await Promise.all([
      prisma.importExportLog.findMany({
        where: {
          type: 'import',
          ...(status && { status }),
          ...(entityType && { entityType }),
        },
        orderBy: { performedAt: 'desc' },
        skip,
        take: safeLimit,
        select: {
          id: true,
          entityType: true,
          status: true,
          totalRecords: true,
          successCount: true,
          errorCount: true,
          skippedCount: true,
          insertedCount: true,
          updatedCount: true,
          progress: true,
          processedRecords: true,
          currentChunk: true,
          totalChunks: true,
          fileName: true,
          performedAt: true,
          startedAt: true,
          completedAt: true,
          performedBy: true,
        },
      }),
      prisma.importExportLog.count({
        where: {
          type: 'import',
          ...(status && { status }),
          ...(entityType && { entityType }),
        },
      }),
    ])

    return apiPaginated(jobs, { page, limit, total })
  } catch (error) {
    logError('Error listing import jobs', error)
    return apiError('Failed to list import jobs', 500)
  }
}

/**
 * Background processor for import jobs
 * This runs async after the API returns
 */
async function processImportJob(jobId: string) {
  const CHUNK_SIZE = 500

  try {
    // Get job data
    const job = await prisma.importExportLog.findUnique({
      where: { id: jobId },
    })

    if (!job || !job.importData) {
      throw new Error('Job not found or no data')
    }

    // Update status to processing
    await prisma.importExportLog.update({
      where: { id: jobId },
      data: {
        status: 'processing',
        startedAt: new Date(),
      },
    })

    let data: Record<string, unknown>[]
    try {
      data = JSON.parse(job.importData) as Record<string, unknown>[]
    } catch {
      return apiError('Import data is corrupted', 400)
    }
    const entityType = job.entityType
    const mode = job.importMode as 'insert-only' | 'update-only' | 'upsert'
    
    let totalInserted = 0
    let totalUpdated = 0
    let totalSkipped = 0
    let totalFailed = 0
    const allErrors: Array<{ row: number; message: string }> = []

    // Process in chunks
    const totalChunks = Math.ceil(data.length / CHUNK_SIZE)
    
    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const chunkStart = chunkIndex * CHUNK_SIZE
      const chunk = data.slice(chunkStart, chunkStart + CHUNK_SIZE)
      
      try {
        // Call the appropriate batch import API based on entityType
        const result = await processBatchImport(entityType, chunk, mode, job.branchId || undefined)
        
        totalInserted += result.inserted
        totalUpdated += result.updated
        totalSkipped += result.skipped
        totalFailed += result.failed
        
        // Adjust row numbers for errors
        if (result.errors?.length) {
          allErrors.push(
            ...result.errors.map(err => ({
              row: err.row + chunkStart,
              message: err.message,
            }))
          )
        }
      } catch (err) {
        // Mark entire chunk as failed with user-friendly error message
        totalFailed += chunk.length
        const friendlyMessage = parsePrismaError(err)
        allErrors.push({
          row: chunkStart + 2,
          message: `Lỗi chunk ${chunkIndex + 1}: ${friendlyMessage}`,
        })
      }

      // Update progress
      const processedRecords = Math.min((chunkIndex + 1) * CHUNK_SIZE, data.length)
      const progress = Math.round((processedRecords / data.length) * 100)
      
      await prisma.importExportLog.update({
        where: { id: jobId },
        data: {
          currentChunk: chunkIndex + 1,
          processedRecords,
          progress,
          successCount: totalInserted + totalUpdated,
          insertedCount: totalInserted,
          updatedCount: totalUpdated,
          skippedCount: totalSkipped,
          errorCount: totalFailed,
          errors: allErrors.length > 0 ? JSON.stringify(allErrors.slice(0, 100)) : null,
        },
      })
    }

    // Mark as completed
    const finalStatus = totalFailed === 0 ? 'completed' : (totalInserted + totalUpdated) > 0 ? 'partial' : 'failed'
    
    await prisma.importExportLog.update({
      where: { id: jobId },
      data: {
        status: finalStatus,
        progress: 100,
        completedAt: new Date(),
        // Clear import data to save space
        importData: null,
      },
    })

  } catch (error) {
    logError(`Import job ${jobId} error`, error)
    
    await prisma.importExportLog.update({
      where: { id: jobId },
      data: {
        status: 'failed',
        completedAt: new Date(),
        errors: JSON.stringify([{ row: 0, message: error instanceof Error ? error.message : 'Unknown error' }]),
        importData: null,
      },
    })
  }
}

/**
 * Process batch import for specific entity type
 */
async function processBatchImport(
  entityType: string,
  data: Record<string, unknown>[],
  mode: 'insert-only' | 'update-only' | 'upsert',
  branchId?: string
): Promise<{
  inserted: number
  updated: number
  skipped: number
  failed: number
  errors: Array<{ row: number; message: string }>
}> {
  // Import directly using Prisma based on entity type
  switch (entityType) {
    case 'customers':
      return await importCustomersBatch(data, mode)
    case 'products':
      return await importProductsBatch(data, mode, branchId)
    case 'employees':
      return await importEmployeesBatch(data, mode)
    default:
      throw new Error(`Unsupported entity type: ${entityType}`)
  }
}

/**
 * Import customers batch
 */
async function importCustomersBatch(
  data: Record<string, unknown>[],
  mode: 'insert-only' | 'update-only' | 'upsert'
) {
  const result = {
    inserted: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
    errors: [] as Array<{ row: number; message: string }>,
  }

  // Get existing customers
  const existingIds = data.map(d => d.id).filter(Boolean) as string[]
  const existingCustomers = existingIds.length > 0
    ? await prisma.customer.findMany({
        where: { id: { in: existingIds } },
        select: { id: true, systemId: true },
      })
    : []
  
  const existingMap = new Map(existingCustomers.map(c => [c.id, c.systemId]))

  // Get next business ID (KH00001)
  const lastCustomer = await prisma.customer.findFirst({
    orderBy: { id: 'desc' },
    where: { id: { startsWith: 'KH' } },
    select: { id: true },
  })
  let nextIdNum = lastCustomer?.id
    ? parseInt(lastCustomer.id.replace('KH', '')) + 1
    : 1

  // Get next systemId counter (CUSTOMER000001)
  const lastSystemId = await prisma.customer.findFirst({
    orderBy: { systemId: 'desc' },
    where: { systemId: { startsWith: 'CUSTOMER' } },
    select: { systemId: true },
  })
  let nextSystemIdNum = lastSystemId?.systemId
    ? parseInt(lastSystemId.systemId.replace('CUSTOMER', '')) + 1
    : 1

  // Separate into insert and update batches
  const toInsert: Prisma.CustomerCreateManyInput[] = []
  const toUpdate: Array<{ systemId: string; data: Prisma.CustomerUpdateInput }> = []

  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    const rowNum = i + 2

    try {
      if (!row.name || String(row.name).trim() === '') {
        result.errors.push({ row: rowNum, message: 'Tên khách hàng là bắt buộc' })
        result.failed++
        continue
      }

      const existingSystemId = row.id ? existingMap.get(row.id as string) : null

      if (existingSystemId) {
        if (mode === 'insert-only') {
          result.skipped++
          continue
        }
        toUpdate.push({
          systemId: existingSystemId,
          data: mapCustomerUpdate(row),
        })
      } else {
        if (mode === 'update-only') {
          result.errors.push({ row: rowNum, message: `Không tìm thấy KH mã ${row.id}` })
          result.failed++
          continue
        }
        const customerId = (row.id as string) || `KH${String(nextIdNum++).padStart(5, '0')}`
        const systemId = `CUSTOMER${String(nextSystemIdNum++).padStart(6, '0')}`
        toInsert.push(mapCustomerCreate(row, customerId, systemId))
      }
    } catch (err) {
      result.errors.push({
        row: rowNum,
        message: err instanceof Error ? err.message : 'Lỗi không xác định',
      })
      result.failed++
    }
  }

  // Execute batch insert
  if (toInsert.length > 0) {
    await prisma.customer.createMany({
      data: toInsert,
      skipDuplicates: true,
    })
    result.inserted = toInsert.length
  }

  // Execute updates
  if (toUpdate.length > 0) {
    for (const { systemId, data: updateData } of toUpdate) {
      await prisma.customer.update({
        where: { systemId },
        data: updateData,
      })
    }
    result.updated = toUpdate.length
  }

  return result
}

/**
 * Remove undefined values from object - Prisma createMany doesn't accept undefined
 */
function removeUndefined<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as T
}

function mapCustomerCreate(row: Record<string, unknown>, customerId: string, systemId: string): Prisma.CustomerCreateManyInput {
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
      street: row.address ? String(row.address) : '',
      ward: row.ward ? String(row.ward) : '',
      district: row.district ? String(row.district) : '',
      province: row.province ? String(row.province) : '',
      isDefaultShipping: true,
      isDefaultBilling: true,
    });
  }

  // Build object and remove undefined values - Prisma createMany doesn't accept undefined
  const data = removeUndefined({
    systemId,
    id: customerId,
    name: String(row.name).trim(),
    customerGroup: row.customerGroup ? String(row.customerGroup) : undefined,
    phone: row.phone ? String(row.phone) : undefined,
    gender: row.gender ? String(row.gender) : undefined,
    dateOfBirth: row.dateOfBirth ? new Date(row.dateOfBirth as string) : undefined,
    taxCode: row.taxCode ? String(row.taxCode) : undefined,
    address: row.address ? String(row.address) : undefined,
    province: row.province ? String(row.province) : undefined,
    district: row.district ? String(row.district) : undefined,
    ward: row.ward ? String(row.ward) : undefined,
    addresses: addresses.length > 0 ? addresses : undefined,
    status: mapCustomerStatus(row.status as string),
    currentDebt: row.currentDebt ? Number(row.currentDebt) : 0,
    totalSpent: row.totalSpent ? Number(row.totalSpent) : 0,
    totalOrders: row.totalOrders ? Number(row.totalOrders) : 0,
    totalProductsBought: row.totalProductsBought ? Number(row.totalProductsBought) : 0,
    maxDebt: row.maxDebt ? Number(row.maxDebt) : undefined,
    allowCredit: row.allowCredit !== undefined ? Boolean(row.allowCredit) : true,
    type: row.type ? String(row.type) : undefined,
    source: row.source ? String(row.source) : undefined,
    pricingLevel: mapPricingLevel(row.pricingLevel as string),
    createdAt: row.createdAt ? new Date(row.createdAt as string) : new Date(),
    // New fields added
    company: row.company ? String(row.company) : undefined,
    companyName: row.companyName ? String(row.companyName) : undefined,
    representative: row.representative ? String(row.representative) : undefined,
    position: row.position ? String(row.position) : undefined,
    zaloPhone: row.zaloPhone ? String(row.zaloPhone) : undefined,
    paymentTerms: row.paymentTerms ? String(row.paymentTerms) : undefined,
    creditRating: row.creditRating ? String(row.creditRating) : undefined,
    defaultDiscount: row.defaultDiscount ? Number(row.defaultDiscount) : undefined,
    campaign: row.campaign ? String(row.campaign) : undefined,
    referredBy: row.referredBy ? String(row.referredBy) : undefined,
    lastContactDate: row.lastContactDate ? new Date(row.lastContactDate as string) : undefined,
    nextFollowUpDate: row.nextFollowUpDate ? new Date(row.nextFollowUpDate as string) : undefined,
    followUpReason: row.followUpReason ? String(row.followUpReason) : undefined,
    // Note: failedDeliveries is not in Prisma schema - it's a computed field
    lastPurchaseDate: row.lastPurchaseDate ? new Date(row.lastPurchaseDate as string) : undefined,
    notes: row.notes ? String(row.notes) : undefined,
    tags: row.tags ? (Array.isArray(row.tags) ? row.tags : String(row.tags).split(',').map(t => t.trim()).filter(Boolean)) : undefined,
  })

  return data as Prisma.CustomerCreateManyInput
}

function mapCustomerUpdate(row: Record<string, unknown>) {
  const update: Prisma.CustomerUpdateInput = { updatedAt: new Date() }
  
  if (row.name) update.name = String(row.name).trim()
  if (row.customerGroup !== undefined) update.customerGroup = row.customerGroup || null
  if (row.phone !== undefined) update.phone = row.phone || null
  if (row.gender !== undefined) update.gender = row.gender || null
  if (row.dateOfBirth !== undefined) update.dateOfBirth = row.dateOfBirth ? new Date(row.dateOfBirth as string) : null
  if (row.taxCode !== undefined) update.taxCode = row.taxCode || null
  if (row.address !== undefined) update.address = row.address || null
  if (row.province !== undefined) update.province = row.province || null
  if (row.district !== undefined) update.district = row.district || null
  if (row.ward !== undefined) update.ward = row.ward || null
  if (row.status) update.status = mapCustomerStatus(row.status as string)
  if (row.currentDebt !== undefined) update.currentDebt = Number(row.currentDebt)
  if (row.totalSpent !== undefined) update.totalSpent = Number(row.totalSpent)
  if (row.totalOrders !== undefined) update.totalOrders = Number(row.totalOrders)
  if (row.totalProductsBought !== undefined) update.totalProductsBought = Number(row.totalProductsBought)
  if (row.maxDebt !== undefined) update.maxDebt = row.maxDebt ? Number(row.maxDebt) : null
  if (row.allowCredit !== undefined) update.allowCredit = Boolean(row.allowCredit)
  if (row.type !== undefined) update.type = row.type || null
  if (row.source !== undefined) update.source = row.source || null
  if (row.pricingLevel !== undefined) update.pricingLevel = mapPricingLevel(row.pricingLevel as string) || null
  // New fields added
  if (row.company !== undefined) update.company = row.company || null
  if (row.companyName !== undefined) update.companyName = row.companyName || null
  if (row.representative !== undefined) update.representative = row.representative || null
  if (row.position !== undefined) update.position = row.position || null
  if (row.zaloPhone !== undefined) update.zaloPhone = row.zaloPhone || null
  if (row.paymentTerms !== undefined) update.paymentTerms = row.paymentTerms || null
  if (row.creditRating !== undefined) update.creditRating = row.creditRating || null
  if (row.defaultDiscount !== undefined) update.defaultDiscount = row.defaultDiscount ? Number(row.defaultDiscount) : null
  if (row.campaign !== undefined) update.campaign = row.campaign || null
  if (row.referredBy !== undefined) update.referredBy = row.referredBy || null
  if (row.lastContactDate !== undefined) update.lastContactDate = row.lastContactDate ? new Date(row.lastContactDate as string) : null
  if (row.nextFollowUpDate !== undefined) update.nextFollowUpDate = row.nextFollowUpDate ? new Date(row.nextFollowUpDate as string) : null
  if (row.followUpReason !== undefined) update.followUpReason = row.followUpReason || null
  // Note: failedDeliveries is not in Prisma schema - it's a computed field in TypeScript types
  if (row.lastPurchaseDate !== undefined) update.lastPurchaseDate = row.lastPurchaseDate ? new Date(row.lastPurchaseDate as string) : null
  if (row.notes !== undefined) update.notes = row.notes || null
  if (row.tags !== undefined) update.tags = row.tags ? (Array.isArray(row.tags) ? row.tags : String(row.tags).split(',').map(t => t.trim()).filter(Boolean)) : []
  
  return update
}

function mapCustomerStatus(status?: string): 'ACTIVE' | 'INACTIVE' {
  if (!status) return 'ACTIVE'
  const normalized = status.toLowerCase().trim()
  if (normalized.includes('ngừng') || normalized.includes('inactive')) {
    return 'INACTIVE'
  }
  return 'ACTIVE'
}

function mapPricingLevel(level?: string): 'RETAIL' | 'WHOLESALE' | 'VIP' | 'PARTNER' | undefined {
  if (!level) return undefined
  const normalized = level.toUpperCase().trim()
  if (normalized === 'RETAIL' || normalized.includes('LẺ')) return 'RETAIL'
  if (normalized === 'WHOLESALE' || normalized.includes('SỈ')) return 'WHOLESALE'
  if (normalized === 'VIP') return 'VIP'
  if (normalized === 'PARTNER' || normalized.includes('ĐỐI TÁC')) return 'PARTNER'
  return 'RETAIL' // Default
}

/**
 * Import products batch - basic implementation for Excel import
 * NOTE: For full feature parity, consider using /api/products/bulk-import
 */
async function importProductsBatch(
  data: Record<string, unknown>[],
  mode: 'insert-only' | 'update-only' | 'upsert',
  _branchId?: string
): Promise<{ inserted: number; updated: number; skipped: number; failed: number; errors: Array<{ row: number; message: string }> }> {
  const result = {
    inserted: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
    errors: [] as Array<{ row: number; message: string }>,
  }

  // Get existing products by id or barcode
  const ids = data.map(d => d.id).filter(Boolean) as string[]
  const barcodes = data.map(d => d.barcode).filter(Boolean) as string[]
  
  const existingProducts = await prisma.product.findMany({
    where: {
      isDeleted: false,
      OR: [
        ...(ids.length > 0 ? [{ id: { in: ids } }] : []),
        ...(barcodes.length > 0 ? [{ barcode: { in: barcodes } }] : []),
      ],
    },
    select: { id: true, barcode: true, systemId: true },
  })
  
  const existingById = new Map(existingProducts.map(p => [p.id, p]))
  const existingByBarcode = new Map(
    existingProducts.filter(p => p.barcode).map(p => [p.barcode!, p])
  )

  // Get default product type
  const defaultProductType = await prisma.settingsData.findFirst({
    where: { type: 'product-type', isActive: true, isDeleted: false, isDefault: true },
    select: { systemId: true },
  })

  // Process each row
  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    const rowNum = i + 2

    try {
      if (!row.name || String(row.name).trim() === '') {
        result.errors.push({ row: rowNum, message: 'Tên sản phẩm là bắt buộc' })
        result.failed++
        continue
      }

      // Find existing product
      let existing = row.id ? existingById.get(row.id as string) : null
      if (!existing && row.barcode) {
        existing = existingByBarcode.get(row.barcode as string)
      }

      if (existing) {
        if (mode === 'insert-only') {
          result.skipped++
          continue
        }
        
        // Update existing product
        await prisma.product.update({
          where: { systemId: existing.systemId },
          data: {
            name: String(row.name).trim(),
            barcode: row.barcode ? String(row.barcode) : undefined,
            unit: row.unit ? String(row.unit) : 'Cái',
            costPrice: row.costPrice ? Number(row.costPrice) : 0,
            status: mapProductStatus(row.status as string),
            ...(defaultProductType?.systemId && { 
              productTypeSystemId: defaultProductType.systemId 
            }),
          },
        })
        result.updated++
      } else {
        if (mode === 'update-only') {
          result.errors.push({ row: rowNum, message: `Không tìm thấy SP mã ${row.id || row.barcode}` })
          result.failed++
          continue
        }

        // Create new product
        const systemId = `PRODUCT${String(Date.now()).slice(-6)}${String(i).padStart(4, '0')}`
        const productId = (row.id as string) || `SP${String(i + 1).padStart(5, '0')}`
        
        await prisma.product.create({
          data: {
            systemId,
            id: productId,
            name: String(row.name).trim(),
            barcode: row.barcode ? String(row.barcode) : undefined,
            unit: row.unit ? String(row.unit) : 'Cái',
            costPrice: row.costPrice ? Number(row.costPrice) : 0,
            status: mapProductStatus(row.status as string),
            productTypeSystemId: defaultProductType?.systemId,
            prices: {},
            inventoryByBranch: {},
            committedByBranch: {},
            inTransitByBranch: {},
          },
        })
        result.inserted++
      }
    } catch (err) {
      result.errors.push({
        row: rowNum,
        message: err instanceof Error ? err.message : 'Lỗi không xác định',
      })
      result.failed++
    }
  }

  return result
}

function mapProductStatus(status?: string): 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED' {
  if (!status) return 'ACTIVE'
  const normalized = status.toLowerCase().trim()
  if (normalized.includes('ngừng kinh doanh') || normalized === 'inactive') return 'INACTIVE'
  if (normalized.includes('ngừng nhập') || normalized === 'discontinued') return 'DISCONTINUED'
  return 'ACTIVE'
}

/**
 * Import employees batch - basic implementation for Excel import
 */
async function importEmployeesBatch(
  data: Record<string, unknown>[],
  mode: 'insert-only' | 'update-only' | 'upsert'
): Promise<{ inserted: number; updated: number; skipped: number; failed: number; errors: Array<{ row: number; message: string }> }> {
  const result = {
    inserted: 0,
    updated: 0,
    skipped: 0,
    failed: 0,
    errors: [] as Array<{ row: number; message: string }>,
  }

  // Get existing employees by id, phone, or nationalId
  const ids = data.map(d => d.id).filter(Boolean) as string[]
  const phones = data.map(d => d.phone).filter(Boolean) as string[]
  const nationalIds = data.map(d => d.nationalId).filter(Boolean) as string[]
  
  const existingEmployees = await prisma.employee.findMany({
    where: {
      OR: [
        ...(ids.length > 0 ? [{ id: { in: ids } }] : []),
        ...(phones.length > 0 ? [{ phone: { in: phones } }] : []),
        ...(nationalIds.length > 0 ? [{ nationalId: { in: nationalIds } }] : []),
      ],
    },
    select: { id: true, phone: true, nationalId: true, systemId: true },
  })
  
  const existingById = new Map(existingEmployees.map(e => [e.id, e]))
  const existingByPhone = new Map(
    existingEmployees.filter(e => e.phone).map(e => [e.phone!, e])
  )
  const existingByNationalId = new Map(
    existingEmployees.filter(e => e.nationalId).map(e => [e.nationalId!, e])
  )

  // Process each row
  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    const rowNum = i + 2

    try {
      if (!row.fullName || String(row.fullName).trim() === '') {
        result.errors.push({ row: rowNum, message: 'Họ tên nhân viên là bắt buộc' })
        result.failed++
        continue
      }

      // Find existing employee
      let existing = row.id ? existingById.get(row.id as string) : null
      if (!existing && row.phone) {
        existing = existingByPhone.get(row.phone as string)
      }
      if (!existing && row.nationalId) {
        existing = existingByNationalId.get(row.nationalId as string)
      }

      if (existing) {
        if (mode === 'insert-only') {
          result.skipped++
          continue
        }
        
        // Update existing employee
        await prisma.employee.update({
          where: { systemId: existing.systemId },
          data: {
            fullName: String(row.fullName).trim(),
            dob: row.dob ? new Date(row.dob as string) : undefined,
            gender: row.gender ? mapGender(row.gender as string) : undefined,
            phone: row.phone ? String(row.phone) : undefined,
            personalEmail: row.personalEmail ? String(row.personalEmail) : undefined,
            workEmail: row.workEmail ? String(row.workEmail) : undefined,
            nationalId: row.nationalId ? String(row.nationalId) : undefined,
          },
        })
        result.updated++
      } else {
        if (mode === 'update-only') {
          result.errors.push({ 
            row: rowNum, 
            message: `Không tìm thấy NV mã ${row.id || row.phone || row.nationalId}` 
          })
          result.failed++
          continue
        }

        // Create new employee
        const systemId = `EMP${String(Date.now()).slice(-6)}${String(i).padStart(4, '0')}`
        const employeeId = (row.id as string) || `NV${String(i + 1).padStart(5, '0')}`
        
        await prisma.employee.create({
          data: {
            systemId,
            id: employeeId,
            fullName: String(row.fullName).trim(),
            dob: row.dob ? new Date(row.dob as string) : undefined,
            gender: row.gender ? mapGender(row.gender as string) : 'OTHER',
            phone: row.phone ? String(row.phone) : undefined,
            personalEmail: row.personalEmail ? String(row.personalEmail) : undefined,
            workEmail: row.workEmail ? String(row.workEmail) : undefined,
            nationalId: row.nationalId ? String(row.nationalId) : undefined,
            nationalIdIssueDate: row.nationalIdIssueDate 
              ? new Date(row.nationalIdIssueDate as string) 
              : undefined,
            nationalIdIssuePlace: row.nationalIdIssuePlace 
              ? String(row.nationalIdIssuePlace) 
              : undefined,
          },
        })
        result.inserted++
      }
    } catch (err) {
      result.errors.push({
        row: rowNum,
        message: err instanceof Error ? err.message : 'Lỗi không xác định',
      })
      result.failed++
    }
  }

  return result
}

function mapGender(gender?: string): 'MALE' | 'FEMALE' | 'OTHER' {
  if (!gender) return 'OTHER'
  const normalized = gender.toLowerCase().trim()
  if (normalized === 'nam' || normalized === 'male' || normalized === 'm') return 'MALE'
  if (normalized === 'nữ' || normalized === 'nu' || normalized === 'female' || normalized === 'f') return 'FEMALE'
  return 'OTHER'
}
