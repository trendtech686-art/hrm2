/**
 * PKGX Sync Service
 * Core logic for syncing HRM data → PKGX (used by manual sync API + cron)
 */

import { prisma } from '@/lib/prisma'
import { logError } from '@/lib/logger'
import {
  updateProduct as updatePkgxProduct,
} from '@/lib/pkgx/api-service'
import type { PkgxSettings, PkgxPriceMapping } from '@/lib/types/prisma-extended'

const SETTINGS_KEY = 'settings'
const SETTINGS_GROUP = 'pkgx'
const CONCURRENCY = 3
const MAX_DURATION_MS = 4 * 60 * 1000 // 4 minutes

// ——————————————————————————————————————
// Helpers
// ——————————————————————————————————————

export async function getPkgxSettingsFromDb(): Promise<PkgxSettings | null> {
  const setting = await prisma.setting.findFirst({
    where: { key: SETTINGS_KEY, group: SETTINGS_GROUP },
  })
  if (!setting?.value) return null
  return setting.value as unknown as PkgxSettings
}

async function updateSettingsSection(section: string, data: unknown) {
  const existing = await prisma.setting.findFirst({
    where: { key: SETTINGS_KEY, group: SETTINGS_GROUP },
  })
  const currentValue = (existing?.value as Record<string, unknown>) || {}
  const updatedValue = JSON.parse(JSON.stringify({ ...currentValue, [section]: data }))
  await prisma.setting.upsert({
    where: { key_group: { key: SETTINGS_KEY, group: SETTINGS_GROUP } },
    create: { key: SETTINGS_KEY, group: SETTINGS_GROUP, type: 'json', category: 'integration', value: updatedValue },
    update: { value: updatedValue },
  })
}

interface LinkedProduct {
  pkgxId: number
  systemId: string
  name: string
  totalInventory: number
  seoKeywords: string | null
  seoDescription: string | null
  ktitle: string | null
  prices: { pricingPolicyId: string; price: number }[]
}

async function getLinkedProducts(): Promise<LinkedProduct[]> {
  const products = await prisma.product.findMany({
    where: {
      isDeleted: false,
      pkgxId: { not: null },
    },
    select: {
      systemId: true,
      pkgxId: true,
      name: true,
      totalInventory: true,
      seoKeywords: true,
      seoDescription: true,
      ktitle: true,
      prices: {
        select: { pricingPolicyId: true, price: true },
      },
    },
  })

  return products
    .filter((p) => p.pkgxId != null)
    .map((p) => ({
      pkgxId: p.pkgxId!,
      systemId: p.systemId,
      name: p.name,
      totalInventory: p.totalInventory,
      seoKeywords: p.seoKeywords,
      seoDescription: p.seoDescription,
      ktitle: p.ktitle,
      prices: p.prices.map((pp) => ({
        pricingPolicyId: pp.pricingPolicyId,
        price: Number(pp.price),
      })),
    }))
}

function buildPushPayload(
  product: LinkedProduct,
  settings: PkgxSettings,
  options: { syncInventory: boolean; syncPrice: boolean; syncSeo: boolean },
) {
  const payload: Record<string, unknown> = {}

  if (options.syncInventory) {
    payload.goods_number = product.totalInventory
  }

  if (options.syncPrice) {
    const pm: PkgxPriceMapping = settings.priceMapping ?? {} as PkgxPriceMapping
    const findPrice = (policyId: string | null) => {
      if (!policyId) return undefined
      return product.prices.find((p) => p.pricingPolicyId === policyId)?.price
    }
    const shopPrice = findPrice(pm.shopPrice)
    const partnerPrice = findPrice(pm.partnerPrice)
    const price5Vat = findPrice(pm.price5Vat)
    const price12Novat = findPrice(pm.price12Novat)
    const price5Novat = findPrice(pm.price5Novat)

    if (shopPrice !== undefined) payload.shop_price = shopPrice
    if (partnerPrice !== undefined) payload.partner_price = partnerPrice
    if (price5Vat !== undefined) payload.price_5vat = price5Vat
    if (price12Novat !== undefined) payload.price_12novat = price12Novat
    if (price5Novat !== undefined) payload.price_5novat = price5Novat
  }

  if (options.syncSeo) {
    payload.keywords = product.seoKeywords || ''
    payload.meta_title = product.ktitle || product.name || ''
    payload.meta_desc = product.seoDescription || ''
  }

  return payload
}

// ——————————————————————————————————————
// Core sync logic (batch all linked products)
// ——————————————————————————————————————

export async function runPkgxSync(
  triggeredBy: 'cron' | 'manual',
  userId?: string,
  userName?: string,
) {
  const startTime = Date.now()
  const settings = await getPkgxSettingsFromDb()

  if (!settings || !settings.enabled) {
    return { success: false, error: 'PKGX chưa được bật', duration: 0 }
  }

  const syncSettings = settings.syncSettings ?? {
    autoSyncEnabled: false,
    intervalMinutes: 60,
    syncInventory: true,
    syncPrice: true,
    syncSeo: true,
    syncOnProductUpdate: false,
    notifyOnError: true,
  }

  // For cron: check if auto sync is enabled and interval has elapsed
  if (triggeredBy === 'cron') {
    if (!syncSettings.autoSyncEnabled) {
      return { success: false, error: 'Auto sync chưa được bật', duration: 0 }
    }
    if (settings.lastSyncAt) {
      const lastSync = new Date(settings.lastSyncAt).getTime()
      const intervalMs = (syncSettings.intervalMinutes || 60) * 60 * 1000
      if (Date.now() - lastSync < intervalMs) {
        return { success: false, error: 'Chưa đến thời gian sync tiếp theo', duration: 0 }
      }
    }
  }

  const syncInventory = syncSettings.syncInventory !== false
  const syncPrice = syncSettings.syncPrice !== false
  const syncSeo = syncSettings.syncSeo !== false

  if (!syncInventory && !syncPrice && !syncSeo) {
    return { success: false, error: 'Không có loại dữ liệu nào được chọn để sync', duration: 0 }
  }

  // Get all linked products
  const linkedProducts = await getLinkedProducts()
  if (linkedProducts.length === 0) {
    return {
      success: true,
      total: 0,
      successCount: 0,
      failedCount: 0,
      duration: Date.now() - startTime,
      message: 'Không có sản phẩm liên kết nào',
    }
  }

  const results = { total: linkedProducts.length, successCount: 0, failedCount: 0, errors: [] as string[] }
  const isTimedOut = () => Date.now() - startTime > MAX_DURATION_MS

  // Process with concurrency control
  let index = 0
  async function worker() {
    while (index < linkedProducts.length && !isTimedOut()) {
      const currentIndex = index++
      const product = linkedProducts[currentIndex]
      const payload = buildPushPayload(product, settings!, { syncInventory, syncPrice, syncSeo })

      if (Object.keys(payload).length === 0) {
        results.successCount++
        continue
      }

      try {
        const response = await updatePkgxProduct(product.pkgxId, payload, settings!)
        if (response.success) {
          results.successCount++
          // Update pkgxSyncedAt
          await prisma.product.update({
            where: { systemId: product.systemId },
            data: { pkgxSyncedAt: new Date() },
          }).catch(() => {})
        } else {
          results.failedCount++
          if (results.errors.length < 20) {
            results.errors.push(`${product.name} (PKGX#${product.pkgxId}): ${response.error}`)
          }
        }
      } catch (err) {
        results.failedCount++
        if (results.errors.length < 20) {
          results.errors.push(`${product.name}: ${err instanceof Error ? err.message : 'Unknown error'}`)
        }
      }
    }
  }

  const workers = Array.from({ length: Math.min(CONCURRENCY, linkedProducts.length) }, () => worker())
  await Promise.all(workers)

  const duration = Date.now() - startTime
  const status = results.failedCount === 0 ? 'success' : results.successCount > 0 ? 'partial' : 'error'

  const syncTypes: string[] = []
  if (syncInventory) syncTypes.push('tồn kho')
  if (syncPrice) syncTypes.push('giá')
  if (syncSeo) syncTypes.push('SEO')

  // Save sync log
  try {
    await prisma.pkgxSyncLog.create({
      data: {
        syncType: 'products',
        action: 'sync',
        status,
        itemsTotal: results.total,
        itemsSuccess: results.successCount,
        itemsFailed: results.failedCount,
        errorMessage: results.errors.length > 0 ? results.errors.join('\n') : null,
        details: { triggeredBy, syncTypes, duration, errors: results.errors },
        syncedBy: userId,
        syncedByName: userName || (triggeredBy === 'cron' ? 'Hệ thống (Auto Sync)' : undefined),
      },
    })
  } catch (err) {
    logError('[PKGX Sync] Failed to create sync log', err)
  }

  // Update lastSyncAt and lastSyncResult
  try {
    await updateSettingsSection('lastSyncAt', new Date().toISOString())
    await updateSettingsSection('lastSyncResult', {
      status,
      total: results.total,
      success: results.successCount,
      failed: results.failedCount,
      errors: results.errors.slice(0, 10),
    })
  } catch (err) {
    logError('[PKGX Sync] Failed to update sync status', err)
  }

  return {
    success: true,
    status,
    total: results.total,
    successCount: results.successCount,
    failedCount: results.failedCount,
    syncTypes,
    duration,
    errors: results.errors.slice(0, 10),
    message: `Sync ${syncTypes.join(', ')}: ${results.successCount}/${results.total} SP thành công (${(duration / 1000).toFixed(1)}s)`,
  }
}

// ——————————————————————————————————————
// Single product sync (for real-time sync on product update)
// ——————————————————————————————————————

export async function syncSingleProductToPkgx(productSystemId: string) {
  const settings = await getPkgxSettingsFromDb()
  if (!settings?.enabled) return

  const syncSettings = settings.syncSettings
  if (!syncSettings?.syncOnProductUpdate) return

  const product = await prisma.product.findUnique({
    where: { systemId: productSystemId },
    select: {
      systemId: true,
      pkgxId: true,
      name: true,
      totalInventory: true,
      seoKeywords: true,
      seoDescription: true,
      ktitle: true,
      prices: {
        select: { pricingPolicyId: true, price: true },
      },
    },
  })

  if (!product?.pkgxId) return

  const linkedProduct: LinkedProduct = {
    pkgxId: product.pkgxId,
    systemId: product.systemId,
    name: product.name,
    totalInventory: product.totalInventory,
    seoKeywords: product.seoKeywords,
    seoDescription: product.seoDescription,
    ktitle: product.ktitle,
    prices: product.prices.map((pp) => ({
      pricingPolicyId: pp.pricingPolicyId,
      price: Number(pp.price),
    })),
  }

  const syncInventory = syncSettings.syncInventory !== false
  const syncPrice = syncSettings.syncPrice !== false
  const syncSeo = syncSettings.syncSeo !== false

  const payload = buildPushPayload(linkedProduct, settings, { syncInventory, syncPrice, syncSeo })
  if (Object.keys(payload).length === 0) return

  try {
    const response = await updatePkgxProduct(product.pkgxId, payload, settings)
    if (response.success) {
      // Update pkgxSyncedAt on product
      await prisma.product.update({
        where: { systemId: productSystemId },
        data: { pkgxSyncedAt: new Date() },
      })
      // Fire-and-forget activity log
      prisma.activityLog.create({
        data: {
          entityType: 'product',
          entityId: productSystemId,
          action: 'synced',
          actionType: 'update',
          note: `Đồng bộ PKGX tự động (PKGX#${product.pkgxId})`,
          metadata: { syncType: 'real-time', pkgxId: product.pkgxId },
          createdBy: 'Hệ thống',
        },
      }).catch(() => {})
    } else {
      logError(`[PKGX Real-time Sync] Failed for ${product.name}`, response.error)
    }
  } catch (err) {
    logError(`[PKGX Real-time Sync] Error for ${product.name}`, err)
  }
}

// ——————————————————————————————————————
// Get sync logs
// ——————————————————————————————————————

export async function getPkgxSyncLogs(limit = 20) {
  return prisma.pkgxSyncLog.findMany({
    orderBy: { syncedAt: 'desc' },
    take: limit,
  })
}
