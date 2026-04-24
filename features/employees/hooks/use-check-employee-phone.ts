/**
 * useCheckEmployeePhone - Server-side employee phone uniqueness check
 *
 * Normalizes phone input before checking uniqueness.
 * Used in employee-form.tsx to warn when phone is already taken.
 */

import { useQuery } from '@tanstack/react-query'
import { normalizePhone } from '@/lib/phone-normalize'

async function checkEmployeePhone(
  phone: string,
  exclude?: string,
): Promise<{ exists: boolean; normalizedPhone: string | null }> {
  const params = new URLSearchParams({ phone })
  if (exclude) params.set('exclude', exclude)

  const response = await fetch(`/api/employees/check-phone?${params}`)
  if (!response.ok) return { exists: false, normalizedPhone: null }

  const result = await response.json()
  return result.data ?? { exists: false, normalizedPhone: null }
}

export function useCheckEmployeePhone(
  phone: string | undefined,
  exclude?: string,
) {
  const normalized = phone ? normalizePhone(phone) : undefined

  const query = useQuery({
    queryKey: ['employees', 'check-phone', normalized, exclude],
    queryFn: () => checkEmployeePhone(phone!, exclude),
    enabled: !!normalized && normalized.length >= 10,
    staleTime: 10_000,
    gcTime: 30_000,
  })

  return {
    exists: query.data?.exists ?? false,
    normalizedPhone: query.data?.normalizedPhone ?? null,
    isChecking: query.isLoading,
  }
}
