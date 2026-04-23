/**
 * Returns the VAPID public key so the browser can register a PushSubscription.
 * Safe to expose — public keys are intentionally public.
 */
import { apiSuccess, apiError } from '@/lib/api-utils'

export async function GET() {
  const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  if (!key) return apiError('Push not configured', 503)
  return apiSuccess({ publicKey: key })
}
