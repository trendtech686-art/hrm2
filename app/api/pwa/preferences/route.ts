/**
 * API: GET/PUT /api/pwa/preferences
 * Stores PWA dismiss states in DB (UserPreference) so they persist across devices.
 *
 * Keys used:
 * - "pwa:notif-prompt:dismissed-at"  — timestamp when user dismissed notification prompt
 * - "pwa:install-prompt:dismissed-at" — timestamp when user dismissed install prompt
 */
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, apiError } from '@/lib/api-utils'
import { logError } from '@/lib/logger'

export const dynamic = 'force-dynamic'

const PWA_KEYS = {
  NOTIF_DISMISS: 'pwa:notif-prompt:dismissed-at',
  INSTALL_DISMISS: 'pwa:install-prompt:dismissed-at',
} as const

type PwaPrefKey = (typeof PWA_KEYS)[keyof typeof PWA_KEYS]

// GET /api/pwa/preferences?key=pwa:notif-prompt:dismissed-at
// Returns { dismissedAt: number | null }
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const userId = session.user?.id
  if (!userId) return apiError('userId not found', 400)

  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key') as PwaPrefKey | null

    if (key) {
      // Return single preference
      if (!Object.values(PWA_KEYS).includes(key)) {
        return apiError('Invalid PWA preference key', 400)
      }
      const pref = await prisma.userPreference.findUnique({
        where: { userId_key: { userId, key } },
      })
      const value = pref?.value as { dismissedAt?: number } | null
      return NextResponse.json({ data: { key, dismissedAt: value?.dismissedAt ?? null } })
    }

    // Return all PWA preferences
    const prefs = await prisma.userPreference.findMany({
      where: { userId, key: { in: Object.values(PWA_KEYS) } },
    })
    const map: Record<string, number | null> = {}
    for (const pref of prefs) {
      const v = pref.value as { dismissedAt?: number }
      map[pref.key] = v?.dismissedAt ?? null
    }
    return NextResponse.json({ data: map })
  } catch (error) {
    logError('Error fetching PWA preferences', error)
    return apiError('Failed to fetch PWA preferences', 500)
  }
}

// PUT /api/pwa/preferences  body: { key: string, dismissedAt: number }
export async function PUT(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const userId = session.user?.id
  if (!userId) return apiError('userId not found', 400)

  try {
    const body = await request.json()
    const { key } = body as { key: string; dismissedAt?: number }

    if (!key || !Object.values(PWA_KEYS).includes(key as PwaPrefKey)) {
      return apiError('Invalid PWA preference key', 400)
    }

    const value = { dismissedAt: body.dismissedAt ?? Date.now() }

    const pref = await prisma.userPreference.upsert({
      where: { userId_key: { userId, key } },
      update: { value, updatedAt: new Date() },
      create: {
        userId,
        key,
        value,
        category: 'pwa',
      },
    })

    return NextResponse.json({ data: pref })
  } catch (error) {
    logError('Error saving PWA preference', error)
    return apiError('Failed to save PWA preference', 500)
  }
}

// DELETE /api/pwa/preferences  body: { key: string }
export async function DELETE(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const userId = session.user?.id
  if (!userId) return apiError('userId not found', 400)

  try {
    const body = await request.json()
    const { key } = body as { key: string }

    if (!key || !Object.values(PWA_KEYS).includes(key as PwaPrefKey)) {
      return apiError('Invalid PWA preference key', 400)
    }

    await prisma.userPreference.deleteMany({
      where: { userId, key },
    })

    return NextResponse.json({ data: { success: true } })
  } catch (error) {
    logError('Error deleting PWA preference', error)
    return apiError('Failed to delete PWA preference', 500)
  }
}
