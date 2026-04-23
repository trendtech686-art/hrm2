/**
 * ThemeBootScript — chạy *trước* khi React hydrate để tránh FOUC (flash nhấp nháy
 * từ light/light-default → dark/primary-user trong ~200ms đầu).
 *
 * Nguồn dữ liệu: `localStorage['hrm-theme-boot-v1']` do `features/settings/appearance/store.ts`
 * ghi lại mỗi khi store đổi. Script chỉ áp các giá trị "rẻ" và quan trọng nhất để khớp
 * background/foreground/primary + colorMode + fontSize. Sau đó `ThemeProvider` sẽ áp đầy đủ.
 *
 * Lưu ý:
 * - Script phải là IIFE chạy đồng bộ ngay trong <head>, TRƯỚC khi body paint.
 * - Phải bọc try/catch để không bao giờ chặn render nếu localStorage lỗi (SSR, privacy mode...).
 * - Không import ngoài: toàn bộ code tĩnh nên string hoá inline.
 */

export const THEME_BOOT_STORAGE_KEY = 'hrm-theme-boot-v1'

/** Các CSS var được cache để tô màu sớm (không cần full bộ var). */
export const THEME_BOOT_VAR_KEYS = [
  '--background',
  '--foreground',
  '--card',
  '--card-foreground',
  '--primary',
  '--primary-foreground',
  '--sidebar',
  '--sidebar-foreground',
  '--border',
] as const

const bootScript = `(() => {
  try {
    const el = document.documentElement;
    const raw = localStorage.getItem(${JSON.stringify(THEME_BOOT_STORAGE_KEY)});
    if (!raw) return;
    const s = JSON.parse(raw);
    if (!s || typeof s !== 'object') return;
    if (s.colorMode === 'dark' || s.colorMode === 'light') {
      el.classList.remove('light','dark');
      el.classList.add(s.colorMode);
    }
    if (s.fontSize === 'sm' || s.fontSize === 'base' || s.fontSize === 'lg') {
      el.classList.remove('font-size-sm','font-size-base','font-size-lg');
      el.classList.add('font-size-' + s.fontSize);
    }
    if (s.vars && typeof s.vars === 'object') {
      for (const k in s.vars) {
        if (Object.prototype.hasOwnProperty.call(s.vars, k)) {
          const v = s.vars[k];
          if (typeof v === 'string' && v) el.style.setProperty(k, v);
        }
      }
    }
  } catch (_err) {
    // Bỏ qua: FOUC nhẹ tốt hơn là chặn render.
  }
})();`

export function ThemeBootScript() {
  return (
    <script
      // eslint-disable-next-line react/no-danger -- inline script chạy trước hydrate để tránh FOUC
      dangerouslySetInnerHTML={{ __html: bootScript }}
    />
  )
}
