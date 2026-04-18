import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { getSessionUserName } from '@/lib/get-user-name'
import { deleteFromIndex } from '@/lib/meilisearch-sync'

/**
 * DELETE /api/products/[systemId]/permanent - Lưu trữ vĩnh viễn sản phẩm
 *
 * KHÔNG xóa cứng (hard-delete) record khỏi DB.
 * Thay vào đó:
 * 1. Xóa dữ liệu nhạy cảm/nội bộ — SEO, PKGX, notes, tem phụ, combo, variant...
 * 2. Giữ lại: systemId, id, name, type, brandId, costPrice, unit, images
 *    → Đơn hàng, phiếu nhập, bảo hành vẫn hiển thị đúng tên & ảnh sản phẩm.
 * 3. Set permanentlyDeletedAt — để phân biệt "thùng rác" vs "đã lưu trữ".
 *
 * Lý do: Product có FK từ OrderLineItem, InventoryReceiptItem, Warranty, StockHistory, v.v.
 * Hard-delete gỡ liên kết và mất thông tin trên tất cả dữ liệu liên quan.
 */
export const DELETE = apiHandler(async (
  _request, { session, params }
) => {
  try {
    const { systemId } = await params

    const existing = await prisma.product.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return apiNotFound('Sản phẩm')
    }

    if (!existing.isDeleted) {
      return apiError('Sản phẩm phải ở trong thùng rác trước khi lưu trữ vĩnh viễn', 400)
    }

    if (existing.permanentlyDeletedAt) {
      return apiError('Sản phẩm đã được lưu trữ vĩnh viễn', 400)
    }

    await prisma.$transaction(async (tx) => {
      // Lưu trữ: xóa dữ liệu nhạy cảm/nội bộ, giữ lại tên + mã + loại + ảnh
      await tx.product.update({
        where: { systemId },
        data: {
          permanentlyDeletedAt: new Date(),
          // Xóa SEO & Content
          description: null,
          shortDescription: null,
          seoDescription: null,
          seoKeywords: null,
          ktitle: null,
          slug: null,
          videoLinks: [],
          seoPkgx: Prisma.JsonNull,
          seoTrendtech: Prisma.JsonNull,
          // Xóa PKGX/external IDs
          pkgxId: null,
          trendtechId: null,
          // Xóa notes & tem phụ
          sellerNote: null,
          nameVat: null,
          origin: null,
          usageGuide: null,
          importerSystemId: null,
          importerName: null,
          importerAddress: null,
          // Xóa combo data
          comboItems: Prisma.JsonNull,
          comboPricingType: null,
          comboDiscount: null,
          // Xóa variant data
          hasVariants: false,
          variantAttributes: Prisma.JsonNull,
          variants: Prisma.JsonNull,
          // Xóa inventory cache
          inventoryByBranch: Prisma.JsonNull,
          committedByBranch: Prisma.JsonNull,
          inTransitByBranch: Prisma.JsonNull,
          inDeliveryByBranch: Prisma.JsonNull,
          totalInventory: 0,
          totalCommitted: 0,
          totalAvailable: 0,
          // Xóa dimensions & misc
          dimensions: Prisma.JsonNull,
          barcode: null,
          // Xóa e-commerce flags
          isPublished: false,
          isFeatured: false,
          isNewArrival: false,
          isBestSeller: false,
          isOnSale: false,
          publishedAt: null,
          // GIỮ LẠI: systemId, id, name, type, brandId, costPrice, unit,
          //           thumbnailImage, imageUrl, galleryImages, status, weight, weightUnit
          // → Đơn hàng, phiếu nhập, bảo hành vẫn hiển thị đúng tên & hình sản phẩm
        },
      });
    });

    // Fire-and-forget activity log
    prisma.activityLog.create({
      data: {
        entityType: 'product',
        entityId: systemId,
        action: 'permanently_archived',
        actionType: 'delete',
        note: `Lưu trữ vĩnh viễn sản phẩm: ${existing.name} (${existing.id})`,
        createdBy: getSessionUserName(session),
      },
    }).catch(e => logError('Activity log failed', e))

    // Fire-and-forget: remove from Meilisearch
    deleteFromIndex('products', systemId).catch(e => logError('[Meilisearch] Product permanent delete failed', e))

    return apiSuccess({ success: true, systemId })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        return apiError('Không thể lưu trữ sản phẩm vì có lỗi dữ liệu liên quan.', 400)
      }
    }
    throw error
  }
}, { permission: 'delete_products' })
