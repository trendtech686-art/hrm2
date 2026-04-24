/**
 * Employee Phone Uniqueness Check API
 *
 * GET /api/employees/check-phone?phone=xxx&exclude=yyy
 * Normalizes phone input and checks uniqueness.
 * Used by employee-form.tsx to warn when phone is already taken.
 */

import { prisma } from '@/lib/prisma'
import { apiSuccess } from '@/lib/api-utils'
import { normalizePhone, buildPhoneLookupVariants } from '@/lib/phone-normalize'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const raw = searchParams.get('phone')
  const exclude = searchParams.get('exclude')

  if (!raw || !raw.trim()) {
    return apiSuccess({ exists: false, normalizedPhone: null })
  }

  const normalized = normalizePhone(raw)
  if (!normalized) {
    return apiSuccess({ exists: false, normalizedPhone: null })
  }

  const variants = buildPhoneLookupVariants(normalized)

  const where: { phone: { in: string[] }; NOT?: { systemId: string } } = {
    phone: { in: variants },
  }
  if (exclude) {
    where.NOT = { systemId: exclude }
  }

  const count = await prisma.employee.count({ where })

  return apiSuccess({
    exists: count > 0,
    normalizedPhone: normalized,
  })
}
