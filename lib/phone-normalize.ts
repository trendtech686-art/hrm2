/**
 * Phone number normalization utilities.
 *
 * Chuẩn hoá SĐT về format nội địa VN: 0xxxxxxxxx (10 chữ số).
 * Dùng cho:
 * - Login identifier matching (resolve-login-identifier.ts)
 * - Import/seed data
 * - Validation
 */

/**
 * Normalize raw phone input to standard VN format.
 *
 * Rules:
 * - Strip all non-digit characters
 * - If starts with "84" and length 11-12 → strip "84", prepend "0"
 * - If starts with "0" and length 10-11 → take first 10 digits
 * - If other format → return digits-only (may be invalid)
 * - Empty/null → return null
 */
export function normalizePhone(raw: string | null | undefined): string | null {
  if (!raw) return null
  const trimmed = raw.trim()
  if (!trimmed) return null

  const digits = trimmed.replace(/\D+/g, '')
  if (!digits) return null

  // +84xxxxxxxxx → 0xxxxxxxxx
  if (digits.startsWith('84') && digits.length >= 10) {
    return '0' + digits.slice(2, 12)
  }

  // 0xxxxxxxxx (already normalized)
  if (digits.startsWith('0') && digits.length >= 10) {
    return digits.slice(0, 10)
  }

  // Fallback: just digits, pad/truncate to 10
  return digits.slice(0, 10)
}

/**
 * Build all phone variants for DB lookup.
 * Returns the normalized number plus all common format variations.
 */
export function buildPhoneLookupVariants(normalized: string | null): string[] {
  if (!normalized) return []
  const set = new Set<string>()
  set.add(normalized)

  // +84 format
  set.add('+84' + normalized.slice(1))
  // 84 format (no +)
  set.add('84' + normalized.slice(1))
  // Raw digits
  set.add(normalized.replace(/\D+/g, ''))

  return [...set]
}

/**
 * Check if a string looks like a valid VN phone number.
 */
export function isValidVNPhone(raw: string | null | undefined): boolean {
  const normalized = normalizePhone(raw)
  if (!normalized) return false
  return /^(0[2-9]\d{8})$/.test(normalized)
}

/**
 * Format phone for display: show as 0xxx xxx xxxx
 */
export function formatPhoneDisplay(raw: string | null | undefined): string {
  const normalized = normalizePhone(raw)
  if (!normalized || normalized.length !== 10) return raw ?? ''
  return `${normalized.slice(0, 4)} ${normalized.slice(4, 7)} ${normalized.slice(7)}`
}
