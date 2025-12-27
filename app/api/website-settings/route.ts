/**
 * Website Settings API
 * Stores website domain settings and 301 redirects
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const type = request.nextUrl.searchParams.get('type') as WebsiteSettingType
    
    if (!type || !SETTING_KEYS[type]) {
      return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
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
      if (type === 'settings') return NextResponse.json(DEFAULT_SETTINGS)
      if (type === 'redirects') return NextResponse.json(DEFAULT_REDIRECTS)
    }

    return NextResponse.json(setting!.value)
  } catch (error) {
    console.error('[WEBSITE-SETTINGS] GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/website-settings
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type, data } = await request.json()
    
    if (!type || !SETTING_KEYS[type]) {
      return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Data is required' }, { status: 400 })
    }

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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[WEBSITE-SETTINGS] POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
