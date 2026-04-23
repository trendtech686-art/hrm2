/**
 * Push subscription endpoint.
 *
 * POST /api/push/subscribe    — upsert current browser's PushSubscription
 * DELETE /api/push/subscribe  — delete by endpoint (body: { endpoint })
 */
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'
import { logError } from '@/lib/logger'

const subscribeSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string().min(10),
    auth: z.string().min(10),
  }),
  userAgent: z.string().optional(),
})

export async function POST(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)
  const employeeId = session.user.employeeId
  if (!employeeId) return apiError('Employee not found', 400)

  try {
    const body = await request.json()
    const parsed = subscribeSchema.safeParse(body)
    if (!parsed.success) {
      return apiError(parsed.error.issues.map((i) => i.message).join(', '), 400)
    }

    const { endpoint, keys, userAgent } = parsed.data

    const sub = await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: {
        p256dh: keys.p256dh,
        auth: keys.auth,
        userAgent: userAgent ?? null,
        employeeId,
        lastUsedAt: new Date(),
        failedCount: 0,
        disabledAt: null,
      },
      create: {
        endpoint,
        p256dh: keys.p256dh,
        auth: keys.auth,
        userAgent: userAgent ?? null,
        employeeId,
      },
    })

    return apiSuccess({ id: sub.id, endpoint: sub.endpoint }, 201)
  } catch (error) {
    logError('[API] push/subscribe failed', error)
    return apiError('Failed to register push subscription', 500)
  }
}

const unsubscribeSchema = z.object({ endpoint: z.string().url() })

export async function DELETE(request: NextRequest) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const body = await request.json()
    const parsed = unsubscribeSchema.safeParse(body)
    if (!parsed.success) return apiError('Invalid payload', 400)

    await prisma.pushSubscription
      .delete({ where: { endpoint: parsed.data.endpoint } })
      .catch(() => null) // Idempotent: already gone is fine.
    return apiSuccess({ ok: true })
  } catch (error) {
    logError('[API] push/unsubscribe failed', error)
    return apiError('Failed to unsubscribe', 500)
  }
}
