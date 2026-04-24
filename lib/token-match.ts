/**
 * Client-safe token matching utilities for FE search/filter.
 *
 * Dùng thay thế `.toLowerCase().includes()` không nhất quán trên FE.
 *
 * @example
 * // Simple substring match
 * tokenMatch("Nguyễn Văn An", "van") // true
 *
 * // Token match (AND) - all tokens must match
 * tokenMatch("Nguyễn Văn An", "nguyen an") // true
 * tokenMatch("Nguyễn Văn An", "nguyen minh") // false (missing "minh")
 */

/**
 * Strip Vietnamese diacritics and lowercase for accent-insensitive comparison.
 * "Nguyễn" → "nguyen"
 */
export function normalizeVietnamese(text: string): string {
  return text
    .toLowerCase()
    .replace(/[àáảãạâầấậẩẫăắặẳẵ]/g, 'a')
    .replace(/[đ]/g, 'd')
    .replace(/[èéẻẽẹêềếểễệ]/g, 'e')
    .replace(/[ìíỉĩị]/g, 'i')
    .replace(/[òóỏõọôồốổỗộơởỡớợ]/g, 'o')
    .replace(/[ùúủũụưừứửữự]/g, 'u')
    .replace(/[ỳýỷỹỵ]/g, 'y')
}

/**
 * Simple substring match, accent + case insensitive.
 * Returns true if `query` appears anywhere in `text`.
 *
 * @example
 * simpleMatch("Nguyễn Văn An", "van")  // true
 * simpleMatch("Nguyễn Văn An", "minh")  // false
 */
export function simpleMatch(text: string, query: string): boolean {
  if (!query) return true
  if (!text) return false
  const normalizedText = normalizeVietnamese(text)
  const normalizedQuery = normalizeVietnamese(query)
  return normalizedText.includes(normalizedQuery)
}

/**
 * Tokenize: split text/query into non-empty tokens (split by whitespace).
 */
export function tokenize(text: string | null | undefined): string[] {
  if (!text) return []
  return text
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean)
}

/**
 * Token match (AND): every token in `query` must appear (accent + case insensitive).
 * "wtp 009 sam" matches text containing all 3 tokens.
 *
 * @example
 * tokenMatch("Bình thường", "binh")      // true
 * tokenMatch("Bình thường", "xanh binh")  // true (both tokens found)
 * tokenMatch("Bình thường", "xanh")      // false (only 1 of 2 tokens)
 */
export function tokenMatch(text: string | null | undefined, query: string | null | undefined): boolean {
  if (!query) return true
  if (!text) return false

  const normalizedText = normalizeVietnamese(text)
  const tokens = tokenize(query)

  if (tokens.length === 0) return true

  return tokens.every((token) => {
    const normalizedToken = normalizeVietnamese(token)
    return normalizedText.includes(normalizedToken)
  })
}

/**
 * Token match with per-token AND logic, returning match details.
 * Useful for highlighting matched tokens.
 */
export function tokenMatchDetails(
  text: string | null | undefined,
  query: string | null | undefined,
): { matched: boolean; matchedTokens: string[]; missingTokens: string[] } {
  if (!query) return { matched: true, matchedTokens: [], missingTokens: [] }
  if (!text) return { matched: false, matchedTokens: [], missingTokens: tokenize(query) }

  const normalizedText = normalizeVietnamese(text)
  const tokens = tokenize(query)

  if (tokens.length === 0) return { matched: true, matchedTokens: [], missingTokens: [] }

  const matched: string[] = []
  const missing: string[] = []

  for (const token of tokens) {
    const normalizedToken = normalizeVietnamese(token)
    if (normalizedText.includes(normalizedToken)) {
      matched.push(token)
    } else {
      missing.push(token)
    }
  }

  return {
    matched: missing.length === 0,
    matchedTokens: matched,
    missingTokens: missing,
  }
}
