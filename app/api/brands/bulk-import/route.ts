import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiError, validateBody } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { generateNextIds } from '@/lib/id-system'
import { cache } from '@/lib/cache'
import { healOrphanBrandMapping } from '@/lib/pkgx/orphan-helpers'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'

export const dynamic = 'force-dynamic'

const brandItemSchema = z.object({
  pkgxId: z.number(),
  id: z.string().optional(),
  name: z.string().min(1),
  description: z.string().optional(),
  logo: z.string().optional(),
  website: z.string().optional(),
  seoTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  websiteSeo: z.any().optional(),
})

const bulkImportSchema = z.object({
  brands: z.array(brandItemSchema).min(1).max(200),
})

/**
 * POST /api/brands/bulk-import
 * Import nhiều thương hiệu PKGX → HRM cùng lúc
 */
export const POST = apiHandler(async (request, { session }) => {
  const result = await validateBody(request, bulkImportSchema)
  if (!result.success) return apiError(result.error, 400)

  const { brands } = result.data

  // Pre-load existing brands by name to detect duplicates
  const existingBrands = await prisma.brand.findMany({
    where: {
      name: { in: brands.map(b => b.name) },
      isDeleted: false,
    },
    select: { systemId: true, name: true },
  })
  const existingByName = new Map(existingBrands.map(b => [b.name.toLowerCase(), b]))

  const results: { pkgxId: number; success: boolean; error?: string; systemId?: string }[] = []

  /**
   * Helper: tạo mapping, tự heal orphan nếu trùng pkgxBrandId.
   * Return `true` nếu mapping đã được tạo/đã tồn tại với brand sống tương ứng.
   */
  const createMappingWithHeal = async (
    hrmBrandId: string,
    hrmBrandName: string,
    pkgxBrandId: number,
    pkgxBrandName: string,
  ): Promise<boolean> => {
    try {
      await prisma.pkgxBrandMapping.create({
        data: {
          systemId: uuidv4(),
          hrmBrandId,
          hrmBrandName,
          pkgxBrandId,
          pkgxBrandName,
          createdBy: session?.user?.id,
        },
      })
      return true
    } catch (e) {
      if (!(e instanceof Prisma.PrismaClientKnownRequestError) || e.code !== 'P2002') {
        logError(`[Bulk Brand] Mapping error: ${hrmBrandName}`, e)
        return false
      }
      // P2002: trùng unique (hrmBrandId hoặc pkgxBrandId).
      // Nếu là orphan (mapping cũ trỏ brand đã xoá) ⇒ xoá rồi tạo lại.
      const healed = await healOrphanBrandMapping(pkgxBrandId)
      if (healed === 'orphan_deleted') {
        await prisma.pkgxBrandMapping.create({
          data: {
            systemId: uuidv4(),
            hrmBrandId,
            hrmBrandName,
            pkgxBrandId,
            pkgxBrandName,
            createdBy: session?.user?.id,
          },
        }).catch(err => logError(`[Bulk Brand] Mapping retry failed: ${hrmBrandName}`, err))
        return true
      }
      return true
    }
  }

  // Process sequentially to avoid systemId race condition
  for (const item of brands) {
    try {
      // Check if brand with same name exists
      const existing = existingByName.get(item.name.toLowerCase())

      if (existing) {
        await createMappingWithHeal(
          existing.systemId,
          existing.name,
          item.pkgxId,
          item.name,
        )
        results.push({ pkgxId: item.pkgxId, success: true, systemId: existing.systemId })
        continue
      }

      // Create new brand
      const customId = item.id || `PKGX-${item.pkgxId}`
      const { systemId } = await generateNextIds('brands')

      const brand = await prisma.brand.create({
        data: {
          systemId,
          id: customId,
          name: item.name,
          description: item.description,
          logo: item.logo,
          website: item.website,
          seoTitle: item.seoTitle,
          metaDescription: item.metaDescription,
          seoKeywords: item.seoKeywords,
          shortDescription: item.shortDescription,
          longDescription: item.longDescription,
          websiteSeo: item.websiteSeo as Prisma.InputJsonValue || Prisma.JsonNull,
        },
      })

      await createMappingWithHeal(brand.systemId, brand.name, item.pkgxId, item.name)

      results.push({ pkgxId: item.pkgxId, success: true, systemId: brand.systemId })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        const existingBrand = await prisma.brand.findFirst({
          where: { name: item.name, isDeleted: false },
          select: { systemId: true },
        })
        if (existingBrand) {
          await createMappingWithHeal(
            existingBrand.systemId,
            item.name,
            item.pkgxId,
            item.name,
          )
          results.push({ pkgxId: item.pkgxId, success: true, systemId: existingBrand.systemId })
          continue
        }
      }
      const msg = error instanceof Error ? error.message : String(error)
      logError(`[Bulk Brand] Failed: ${item.name}`, error)
      results.push({ pkgxId: item.pkgxId, success: false, error: msg })
    }
  }

  // Invalidate cache
  cache.deletePattern('^brands:')

  const successCount = results.filter(r => r.success).length
  const errorCount = results.filter(r => !r.success).length

  return apiSuccess({
    total: brands.length,
    success: successCount,
    errors: errorCount,
    results,
  })
}, { permission: 'edit_settings', rateLimit: { max: 50, windowMs: 60_000 } })
