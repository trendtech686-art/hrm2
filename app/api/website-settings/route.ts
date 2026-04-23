/**
 * Website Settings API
 * Stores website domain settings and 301 redirects
 */

import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { logError } from '@/lib/logger'
import { cache } from '@/lib/cache'
import { createActivityLog } from '@/lib/services/activity-log-service'

type WebsiteSettingType = 'settings' | 'redirects'

const SETTING_KEYS: Record<WebsiteSettingType, string> = {
  'settings': 'website_settings',
  'redirects': 'website_redirects_301',
}

const GROUP = 'website'

// Default website settings
const DEFAULT_SETTINGS = {
  primaryDomain: '',
  additionalDomains: [],
  wwwRedirect: 'www-to-non-www',
  trailingSlash: 'remove',
  forceHttps: true,
  sslCertExpiry: '',
  sslAutoRenew: true,
  custom404Enabled: false,
  custom404Title: 'Trang không tồn tại',
  custom404Content: '<p>Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>',
  custom404RedirectUrl: '',
  custom404RedirectDelay: 5,
}

// Sample redirects
const DEFAULT_REDIRECTS = [
  { id: '1', fromUrl: '/old-page', toUrl: '/new-page', isActive: true, hitCount: 156, createdAt: '2024-12-01', updatedAt: '2024-12-15' },
  { id: '2', fromUrl: '/products/old-category', toUrl: '/san-pham/danh-muc-moi', isActive: true, hitCount: 89, createdAt: '2024-11-15', updatedAt: '2024-12-10' },
  { id: '3', fromUrl: '/about-us', toUrl: '/gioi-thieu', isActive: true, hitCount: 234, createdAt: '2024-10-20', updatedAt: '2024-11-05' },
  { id: '4', fromUrl: '/blog/old-post', toUrl: '/tin-tuc/bai-viet-moi', isActive: false, hitCount: 12, createdAt: '2024-09-10', updatedAt: '2024-09-10' },
]

// GET /api/website-settings?type=settings|redirects
export async function GET(request: Request) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const url = new URL(request.url)
    const type = url.searchParams.get('type') as WebsiteSettingType
    
    if (!type || !SETTING_KEYS[type]) {
      return apiError('Invalid type parameter', 400)
    }

    const setting = await prisma.setting.findUnique({
      where: {
        key_group: {
          key: SETTING_KEYS[type],
          group: GROUP,
        }
      }
    })

    if (!setting) {
      // Return defaults
      if (type === 'settings') return apiSuccess(DEFAULT_SETTINGS)
      if (type === 'redirects') return apiSuccess(DEFAULT_REDIRECTS)
    }

    return apiSuccess(setting!.value)
  } catch (error) {
    logError('[WEBSITE-SETTINGS] GET error', error)
    return apiError('Internal server error', 500)
  }
}

// POST /api/website-settings
export async function POST(request: Request) {
  const session = await requireAuth();
  if (!session) return apiError('Unauthorized', 401);

  try {
    const { type, data } = (await request.json()) as {
      type?: WebsiteSettingType
      data?: unknown
    }

    if (!type || !SETTING_KEYS[type]) {
      return apiError('Invalid type parameter', 400)
    }

    if (!data) {
      return apiError('Data is required', 400)
    }

    // Read old value for change tracking
    const oldSetting = await prisma.setting.findUnique({
      where: { key_group: { key: SETTING_KEYS[type], group: GROUP } },
    })
    const oldValue = oldSetting?.value

    await prisma.setting.upsert({
      where: {
        key_group: {
          key: SETTING_KEYS[type],
          group: GROUP,
        }
      },
      update: {
        value: data,
        updatedAt: new Date(),
      },
      create: {
        key: SETTING_KEYS[type],
        value: data,
        type: 'website',
        group: GROUP,
        category: 'system',
        description: type === 'settings' ? 'Website domain and SSL settings' : 'Website 301 redirects',
      }
    })

    // Log changes
    if (JSON.stringify(oldValue) !== JSON.stringify(data)) {
      await createActivityLog({
        entityType: 'website_settings',
        entityId: `website-${type}`,
        action: `Cập nhật cài đặt website: ${type}`,
        actionType: oldSetting ? 'update' : 'create',
        changes: { [type]: { from: oldValue ?? null, to: data } },
        metadata: { userName: session?.user.name || session?.user.email },
        createdBy: session?.user.id ?? '',
      }).catch(e => logError('[website-settings] activity log failed', e))
    }

    // Invalidate server-side settings cache
    cache.deletePattern('^settings:')

    return apiSuccess({ success: true })
  } catch (error) {
    logError('[WEBSITE-SETTINGS] POST error', error)
    return apiError('Internal server error', 500)
  }
}
