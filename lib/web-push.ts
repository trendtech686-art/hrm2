import webpush, { type PushSubscription as WebPushSubscription, type SendResult } from 'web-push'
import { logError } from '@/lib/logger'

/**
 * Configures `web-push` once per server process, on demand. We intentionally
 * don't throw at module-load time so missing VAPID env vars never break unrelated
 * imports (e.g. server actions that don't send push).
 */
let configured = false
function configure(): boolean {
  if (configured) return true
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY
  const subject = process.env.VAPID_SUBJECT ?? 'mailto:admin@example.com'
  if (!publicKey || !privateKey) return false
  webpush.setVapidDetails(subject, publicKey, privateKey)
  configured = true
  return true
}

export type PushPayload = {
  title: string
  body: string
  /** Absolute or app-relative URL opened when the user clicks the notification. */
  url?: string
  icon?: string
  badge?: string
  /** Grouping tag — later notifications with the same tag replace earlier ones. */
  tag?: string
  /** Arbitrary metadata forwarded to the SW; useful for analytics. */
  data?: Record<string, unknown>
}

export type PushTarget = {
  endpoint: string
  p256dh: string
  auth: string
}

/** Stable shape returned for each delivery attempt so callers can retry / prune. */
export type PushDeliveryOutcome = {
  endpoint: string
  ok: boolean
  /** HTTP status returned by the push service, if any. */
  statusCode?: number
  /** Set when `statusCode` is 404/410 — we should delete the subscription. */
  gone?: boolean
  error?: string
}

function toSubscription(target: PushTarget): WebPushSubscription {
  return {
    endpoint: target.endpoint,
    keys: { p256dh: target.p256dh, auth: target.auth },
  }
}

/**
 * Deliver a single push. Never throws — returns a typed outcome so the caller
 * can batch-prune dead endpoints.
 */
export async function sendPush(target: PushTarget, payload: PushPayload): Promise<PushDeliveryOutcome> {
  if (!configure()) {
    return { endpoint: target.endpoint, ok: false, error: 'VAPID keys not configured' }
  }

  try {
    const result: SendResult = await webpush.sendNotification(
      toSubscription(target),
      JSON.stringify(payload),
      { TTL: 60 * 60 * 24 }, // 24h — drop if user offline longer than that
    )
    return { endpoint: target.endpoint, ok: true, statusCode: result.statusCode }
  } catch (err) {
    const e = err as { statusCode?: number; body?: string; message?: string }
    const statusCode = e.statusCode
    // 404 = endpoint never existed, 410 = gone — both mean we should unregister.
    const gone = statusCode === 404 || statusCode === 410
    logError(`[web-push] sendPush failed (${statusCode ?? 'unknown'}): ${e.message ?? ''}`, err)
    return { endpoint: target.endpoint, ok: false, statusCode, gone, error: e.message }
  }
}

/** Deliver the same payload to N targets in parallel. */
export async function sendPushMany(targets: PushTarget[], payload: PushPayload): Promise<PushDeliveryOutcome[]> {
  if (targets.length === 0) return []
  return Promise.all(targets.map((t) => sendPush(t, payload)))
}

export function isWebPushConfigured(): boolean {
  return configure()
}
