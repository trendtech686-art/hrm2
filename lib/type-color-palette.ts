/**
 * Type Color Palette — single source cho các nhóm "phân loại nhiều màu"
 * (notification type, complaint type, activity type, …) mà ngữ nghĩa KHÔNG phải là
 * status (success/warning/info/destructive), nhưng vẫn cần phân biệt nhau bằng màu.
 *
 * Tại sao tách file:
 * - Trước đây mỗi component tự hardcode `bg-sky-100 text-sky-600`, dẫn tới khi muốn
 *   đổi tone (vd. dark mode đậm hơn, hay đổi sang token theme dynamic) phải sửa N chỗ.
 * - Giờ chỉ cần sửa file này; các consumer import `TYPE_PALETTE[slug]`.
 *
 * Lưu ý:
 * - Vẫn dùng palette Tailwind thô vì đặc thù: cần phân biệt 10+ loại bằng hue khác nhau,
 *   không thể gói vào 4 token semantic. Đây là design-intent.
 * - `dark` field tách riêng để consumer chọn merge khi cần (vd. activity timeline trong sidebar
 *   tối). Mặc định `bg`/`fg` đã đủ tương phản trên cả light & dark.
 */

export type TypeColorSlug =
  | 'sky'
  | 'cyan'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'pink'
  | 'fuchsia'
  | 'rose'
  | 'amber'
  | 'yellow'
  | 'orange'
  | 'lime'
  | 'emerald'
  | 'teal'
  | 'blue'
  | 'green'
  | 'red'
  | 'neutral'

export type TypeColorClasses = {
  /** Nền nhạt (light) cho icon/badge container. */
  bg: string
  /** Chữ/icon đậm tương phản trên `bg`. */
  fg: string
  /** Viền optional, dùng cho card outline. */
  border: string
}

/**
 * Bảng palette 100/600/200 — bậc hue xuyên Tailwind. Dùng cho icon-pill + label.
 * Khi muốn dark mode đậm hơn: consumer thêm `dark:bg-${slug}-900/40 dark:text-${slug}-300`
 * (hoặc gọi `withDarkMode(slug)` bên dưới).
 */
export const TYPE_PALETTE: Record<TypeColorSlug, TypeColorClasses> = {
  sky:     { bg: 'bg-sky-100',     fg: 'text-sky-600',     border: 'border-sky-200' },
  cyan:    { bg: 'bg-cyan-100',    fg: 'text-cyan-600',    border: 'border-cyan-200' },
  indigo:  { bg: 'bg-indigo-100',  fg: 'text-indigo-600',  border: 'border-indigo-200' },
  violet:  { bg: 'bg-violet-100',  fg: 'text-violet-600',  border: 'border-violet-200' },
  purple:  { bg: 'bg-purple-100',  fg: 'text-purple-600',  border: 'border-purple-200' },
  pink:    { bg: 'bg-pink-100',    fg: 'text-pink-600',    border: 'border-pink-200' },
  fuchsia: { bg: 'bg-fuchsia-100', fg: 'text-fuchsia-600', border: 'border-fuchsia-200' },
  rose:    { bg: 'bg-rose-100',    fg: 'text-rose-600',    border: 'border-rose-200' },
  amber:   { bg: 'bg-amber-100',   fg: 'text-amber-600',   border: 'border-amber-200' },
  yellow:  { bg: 'bg-yellow-100',  fg: 'text-yellow-600',  border: 'border-yellow-200' },
  orange:  { bg: 'bg-orange-100',  fg: 'text-orange-600',  border: 'border-orange-200' },
  lime:    { bg: 'bg-lime-100',    fg: 'text-lime-600',    border: 'border-lime-200' },
  emerald: { bg: 'bg-emerald-100', fg: 'text-emerald-600', border: 'border-emerald-200' },
  teal:    { bg: 'bg-teal-100',    fg: 'text-teal-600',    border: 'border-teal-200' },
  blue:    { bg: 'bg-blue-100',    fg: 'text-blue-600',    border: 'border-blue-200' },
  green:   { bg: 'bg-green-100',   fg: 'text-green-600',   border: 'border-green-200' },
  red:     { bg: 'bg-red-100',     fg: 'text-red-600',     border: 'border-red-200' },
  neutral: { bg: 'bg-muted',       fg: 'text-muted-foreground', border: 'border-border' },
}

/** Helper an toàn: nếu slug không nằm trong bảng, fallback về `neutral`. */
export function getTypePalette(slug: string | undefined | null): TypeColorClasses {
  if (!slug) return TYPE_PALETTE.neutral
  return (TYPE_PALETTE as Record<string, TypeColorClasses>)[slug] ?? TYPE_PALETTE.neutral
}
