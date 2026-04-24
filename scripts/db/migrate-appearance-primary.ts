/**
 * Migrate Appearance: Reset Old Preset Custom Theme Config
 *
 * VẤN ĐỀ:
 * - defaultCustomTheme (store.ts) và themes['slate'] đã được nâng L ở mỗi preset
 *   (primary sáng hơn, mobile không còn "sỉn").
 * - User cũ có `theme: 'slate'` + `customThemeConfig` trong DB với giá trị cũ
 *   (--primary bị đè bởi config cũ từ trước).
 * - Hậu quả: user cũ vẫn thấy primary sỉn cho tới khi click lại preset.
 *
 * GIẢI PHÁP:
 * - Reset `customThemeConfig` về null cho mọi user có `theme` là preset hợp lệ
 *   (slate|blue|green|amber|rose|purple|orange|teal).
 * - Sau khi reset, họ sẽ dùng preset mới (themes[name]) ngay lần tải kế tiếp.
 *
 * LƯU Ý:
 * - User đã có `theme: 'custom'` sẽ KHÔNG bị ảnh hưởng (giữ nguyên).
 * - NÊN chạy script check trước để xem có bao nhiêu user bị ảnh hưởng.
 *
 * Cách chạy (KHÔNG chạy tự động, em chỉ tạo file):
 *   npx tsx scripts/db/migrate-appearance-primary.ts
 *
 * ĐỂ ÁP DỤNG THAY ĐỔI, bỏ comment ở phần UPDATE phía dưới.
 */

import { prisma } from '../../lib/prisma'
import { THEME_SLUGS } from '../../lib/appearance-constants'

type AppearanceValue = {
  theme?: string
  colorMode?: string
  font?: string
  fontSize?: string
  customThemeConfig?: Record<string, string> | null
}

function ensureUtf8Stdout() {
  if (process.stdout.setDefaultEncoding) {
    try {
      process.stdout.setDefaultEncoding('utf8')
    } catch {
      /* ignore */
    }
  }
}

async function main() {
  ensureUtf8Stdout()
  console.log('=== MIGRATION: Reset Old Preset CustomThemeConfig ===\n')
  console.log('Chế độ: DRY-RUN (chỉ kiểm tra, không thay đổi dữ liệu)\n')

  const PRESET_THEMES = THEME_SLUGS.filter((t) => t !== 'custom') as string[]

  const records = await prisma.userPreference.findMany({
    where: { key: 'appearance' },
    select: { systemId: true, userId: true, value: true, updatedAt: true },
    orderBy: { updatedAt: 'desc' },
  })

  console.log(`Tổng appearance records: ${records.length}`)

  let affectedPreset = 0
  let affectedCustom = 0
  const presets = new Map<string, number>()

  for (const rec of records) {
    const value = (rec.value ?? {}) as AppearanceValue
    const theme = value.theme ?? ''

    if (PRESET_THEMES.includes(theme)) {
      const cfg = value.customThemeConfig
      if (cfg && Object.keys(cfg).length > 0) {
        affectedPreset++
        presets.set(theme, (presets.get(theme) ?? 0) + 1)
      }
    } else if (theme === 'custom' || theme === '') {
      affectedCustom++
    }
  }

  console.log(`\n--- KẾT QUẢ ---`)
  console.log(`Preset có customConfig (cần reset): ${affectedPreset}`)
  console.log(`Custom / undefined (không động):   ${affectedCustom}`)

  if (presets.size > 0) {
    console.log(`\nChi tiết theo preset:`)
    for (const [name, count] of presets) {
      console.log(`  ${name.padEnd(10)} ${count}`)
    }
  }

  if (affectedPreset === 0) {
    console.log(`\nKhông có user nào cần migrate.`)
    return
  }

  console.log(`\n=== HÀNH ĐỘNG CẦN THỰC HIỆN ===`)
  console.log(`Để apply migration, MỞ FILE này và bỏ comment đoạn:`)
  console.log(`  // === APPLY MIGRATION ===`)
  console.log(`  // await prisma.userPreference.updateMany({ ... })`)
  console.log(`\nHoặc chạy: npx tsx scripts/db/migrate-appearance-primary.ts --apply`)

  // ============================================================
  // === APPLY MIGRATION ===
  // Bỏ comment 2 dòng dưới để thực hiện migration
  // ============================================================
  // const presetsToReset = [...presets.keys()]
  // const result = await prisma.userPreference.updateMany({
  //   where: {
  //     key: 'appearance',
  //     theme: { in: presetsToReset },
  //     value: {
  //       path: ['customThemeConfig'],
  //       not: null,
  //     },
  //   },
  //   data: {
  //     value: {
  //       // Reset customThemeConfig về null → dùng preset mới
  //       // Giữ nguyên theme, colorMode, font, fontSize
  //       // CustomThemeConfig sẽ được merge với defaultCustomTheme trong store
  //     },
  //   },
  // })
  // console.log(`\nĐã reset ${result.count} bản ghi.`)
  // ============================================================
}

main()
  .catch((err) => {
    console.error('Lỗi:', err)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
