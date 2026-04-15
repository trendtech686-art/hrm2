import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiError, validateBody } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { generateNextIds } from '@/lib/id-system'
import type { EntityType } from '@/lib/id-system'
import { cache } from '@/lib/cache'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'

export const dynamic = 'force-dynamic'

const categoryItemSchema = z.object({
  pkgxId: z.number(),
  id: z.string().optional(),
  name: z.string().min(1),
  parentPkgxId: z.number().nullable().optional(),
  hrmParentId: z.string().nullable().optional(),
  sortOrder: z.number().optional(),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  seoTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  slug: z.string().optional(),
  websiteSeo: z.any().optional(),
  existingMappingHrmId: z.string().nullable().optional(),
})

const bulkImportSchema = z.object({
  categories: z.array(categoryItemSchema).min(1).max(200),
})

// Compute path + level from parent
async function computePathAndLevel(name: string, parentId?: string | null) {
  if (!parentId) return { path: name, level: 0 }
  const parent = await prisma.category.findUnique({
    where: { systemId: parentId },
    select: { path: true, level: true, name: true },
  })
  if (!parent) return { path: name, level: 0 }
  return {
    path: `${parent.path || parent.name} > ${name}`,
    level: (parent.level ?? 0) + 1,
  }
}

/**
 * POST /api/categories/bulk-import
 * Import nhiều danh mục PKGX → HRM cùng lúc
 * Client gửi batch, server xử lý từng item (cần tuần tự vì parent-child)
 */
export const POST = apiHandler(async (request, { session }) => {
  const result = await validateBody(request, bulkImportSchema)
  if (!result.success) return apiError(result.error, 400)

  const { categories } = result.data
  const results: { pkgxId: number; success: boolean; error?: string; systemId?: string }[] = []

  for (const item of categories) {
    try {
      const isUpdate = !!item.existingMappingHrmId

      const { path, level } = await computePathAndLevel(item.name, item.hrmParentId)

      if (isUpdate) {
        // Update existing category
        await prisma.category.update({
          where: { systemId: item.existingMappingHrmId! },
          data: {
            name: item.name,
            sortOrder: item.sortOrder || 0,
            ...(item.hrmParentId ? { parentId: item.hrmParentId } : {}),
            shortDescription: item.shortDescription,
            longDescription: item.longDescription,
            seoTitle: item.seoTitle,
            metaDescription: item.metaDescription,
            seoKeywords: item.seoKeywords,
            slug: item.slug,
            websiteSeo: item.websiteSeo as Prisma.InputJsonValue | undefined,
            path,
            level,
          },
        })
        results.push({ pkgxId: item.pkgxId, success: true, systemId: item.existingMappingHrmId! })
      } else {
        // Create new category
        const customId = item.id || `PKGX-${item.pkgxId}`
        const { systemId, businessId } = await generateNextIds('categories' as EntityType, customId)

        const category = await prisma.category.create({
          data: {
            systemId,
            id: businessId,
            name: item.name,
            parentId: item.hrmParentId || null,
            sortOrder: item.sortOrder || 0,
            shortDescription: item.shortDescription,
            longDescription: item.longDescription,
            seoTitle: item.seoTitle,
            metaDescription: item.metaDescription,
            seoKeywords: item.seoKeywords,
            slug: item.slug,
            websiteSeo: item.websiteSeo as Prisma.InputJsonValue | undefined,
            path,
            level,
            isActive: true,
          },
        })

        // Also create mapping
        await prisma.pkgxCategoryMapping.create({
          data: {
            systemId: uuidv4(),
            hrmCategoryId: category.systemId,
            hrmCategoryName: category.name,
            pkgxCategoryId: item.pkgxId,
            pkgxCategoryName: item.name,
            createdBy: session?.user?.id,
          },
        }).catch(e => {
          // Duplicate mapping is OK
          if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') return
          logError(`[Bulk Category] Mapping error: ${item.name}`, e)
        })

        results.push({ pkgxId: item.pkgxId, success: true, systemId: category.systemId })
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        // Duplicate — find existing
        const existing = await prisma.category.findFirst({
          where: { name: item.name, isDeleted: false },
          select: { systemId: true },
        })
        if (existing) {
          // Create mapping for it
          await prisma.pkgxCategoryMapping.create({
            data: {
              systemId: uuidv4(),
              hrmCategoryId: existing.systemId,
              hrmCategoryName: item.name,
              pkgxCategoryId: item.pkgxId,
              pkgxCategoryName: item.name,
              createdBy: session?.user?.id,
            },
          }).catch(() => {})
          results.push({ pkgxId: item.pkgxId, success: true, systemId: existing.systemId })
          continue
        }
      }
      const msg = error instanceof Error ? error.message : String(error)
      logError(`[Bulk Category] Failed: ${item.name}`, error)
      results.push({ pkgxId: item.pkgxId, success: false, error: msg })
    }
  }

  // Invalidate cache
  cache.deletePattern('^categories:')

  const successCount = results.filter(r => r.success).length
  const errorCount = results.filter(r => !r.success).length

  return apiSuccess({
    total: categories.length,
    success: successCount,
    errors: errorCount,
    results,
  })
}, { permission: 'edit_settings', rateLimit: { max: 50, windowMs: 60_000 } })
