/**
 * Verify Appearance Preferences (read-only).
 *
 * Mục đích:
 * - Kiểm tra DB xem record `user_preferences[key='appearance'].value` có hợp lệ
 *   so với schema client (THEME_SLUGS, COLOR_MODES, FONT_SIZE_SLUGS, FONT_SLUGS).
 * - Phát hiện `customThemeConfig` thiếu key mới (vd. --success/--warning/--info)
 *   để biết user cũ có cần backfill không.
 *
 * Cách chạy (KHÔNG chạy tự động, em chỉ tạo file):
 *   npx tsx scripts/db/check-appearance-preferences.ts
 *
 * Output: tiếng Việt, UTF-8. Script chỉ READ, không UPDATE.
 */

import { prisma } from '../../lib/prisma'
import {
  COLOR_MODES,
  FONT_SIZE_SLUGS,
  FONT_SLUGS,
  THEME_SLUGS,
} from '../../lib/appearance-constants'

// Phải đồng bộ với defaultCustomTheme.keys() — đây là các key tối thiểu sau khi merge.
const REQUIRED_THEME_KEYS = [
  '--background',
  '--foreground',
  '--primary',
  '--primary-foreground',
  '--success',
  '--success-foreground',
  '--warning',
  '--warning-foreground',
  '--info',
  '--info-foreground',
  '--destructive',
  '--destructive-foreground',
  '--border',
  '--ring',
  '--radius',
] as const

type AppearanceValue = {
  theme?: string
  colorMode?: string
  font?: string
  fontSize?: string
  customThemeConfig?: Record<string, string>
}

function ensureUtf8Stdout() {
  // Trên Windows console mặc định cp1258/cp936; ép UTF-8 để in tiếng Việt không lỗi.
  if (process.stdout.setDefaultEncoding) {
    try {
      process.stdout.setDefaultEncoding('utf8')
    } catch {
      /* ignore */
    }
  }
}

function isValid<T extends string>(allowed: readonly T[], value: unknown): value is T {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value)
}

async function main() {
  ensureUtf8Stdout()

  const records = await prisma.userPreference.findMany({
    where: { key: 'appearance' },
    select: { systemId: true, userId: true, value: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
  })

  console.log(`\nTổng số bản ghi appearance: ${records.length}\n`)

  let invalidTheme = 0
  let invalidColorMode = 0
  let invalidFont = 0
  let invalidFontSize = 0
  let missingCustomVars = 0
  const missingKeySummary = new Map<string, number>()

  for (const rec of records) {
    const value = (rec.value ?? {}) as AppearanceValue
    const issues: string[] = []

    if (value.theme !== undefined && !isValid(THEME_SLUGS, value.theme)) {
      issues.push(`theme="${value.theme}" (không thuộc ${THEME_SLUGS.join('|')})`)
      invalidTheme++
    }
    if (value.colorMode !== undefined && !isValid(COLOR_MODES, value.colorMode)) {
      issues.push(`colorMode="${value.colorMode}"`)
      invalidColorMode++
    }
    if (value.font !== undefined && !isValid(FONT_SLUGS, value.font)) {
      issues.push(`font="${value.font}"`)
      invalidFont++
    }
    if (value.fontSize !== undefined && !isValid(FONT_SIZE_SLUGS, value.fontSize)) {
      issues.push(`fontSize="${value.fontSize}"`)
      invalidFontSize++
    }

    const cfg = value.customThemeConfig
    if (cfg && typeof cfg === 'object') {
      const missing = REQUIRED_THEME_KEYS.filter((k) => !cfg[k])
      if (missing.length > 0) {
        missingCustomVars++
        for (const k of missing) {
          missingKeySummary.set(k, (missingKeySummary.get(k) ?? 0) + 1)
        }
        issues.push(`customThemeConfig thiếu ${missing.length} key: ${missing.slice(0, 4).join(', ')}${missing.length > 4 ? '…' : ''}`)
      }
    } else if (cfg !== undefined) {
      issues.push('customThemeConfig không phải object')
    }

    if (issues.length > 0) {
      console.log(`- userId=${rec.userId} | updated=${rec.updatedAt?.toISOString() ?? 'n/a'}`)
      for (const i of issues) console.log(`    • ${i}`)
    }
  }

  console.log('\n=== TỔNG KẾT ===')
  console.log(`theme không hợp lệ:      ${invalidTheme}`)
  console.log(`colorMode không hợp lệ:  ${invalidColorMode}`)
  console.log(`font không hợp lệ:       ${invalidFont}`)
  console.log(`fontSize không hợp lệ:   ${invalidFontSize}`)
  console.log(`customThemeConfig thiếu key: ${missingCustomVars} bản ghi`)

  if (missingKeySummary.size > 0) {
    console.log('\nTop key bị thiếu (key → số bản ghi):')
    const sorted = [...missingKeySummary.entries()].sort((a, b) => b[1] - a[1])
    for (const [k, n] of sorted) console.log(`  ${k.padEnd(28)} ${n}`)
  }

  if (invalidTheme + invalidColorMode + invalidFont + invalidFontSize === 0 && missingCustomVars === 0) {
    console.log('\nDB sạch, không cần backfill.')
  } else {
    console.log('\nLưu ý: các bản ghi cũ thiếu key sẽ được merge với defaultCustomTheme khi load (an toàn).')
    console.log('Chỉ cần backfill nếu muốn tránh merge runtime ở mọi lần load.')
  }
}

main()
  .catch((err) => {
    console.error('Lỗi:', err)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
