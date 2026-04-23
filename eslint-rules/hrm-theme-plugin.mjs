/**
 * Cảnh báo khi dùng palette Tailwind thô (white/gray/zinc) thay vì design token
 * (bg-background, text-muted-foreground, …) trong app/features.
 */
const RAW_PALETTE = /\b(?:bg-white|text-gray-\d+|bg-gray-\d+|text-zinc-\d+|bg-zinc-\d+|text-slate-\d+|bg-slate-\d+)\b/

function shouldIgnoreFile(filename) {
  if (!filename) return true
  return (
    filename.includes('tailwind-color-picker') ||
    filename.includes('color-picker') ||
    filename.includes('eslint-rules')
  )
}

function checkValue(value, context, node) {
  if (typeof value !== 'string' || !RAW_PALETTE.test(value)) return
  context.report({
    node,
    message:
      'Ưu tiên design token (bg-background, bg-card, bg-muted, text-foreground, text-muted-foreground, border-border) để theme Cài đặt > Giao diện áp dụng đúng. Trừ: color picker, mã in, hoặc màu nghiệp vụ có chủ ý.',
  })
}

export default {
  rules: {
    'no-raw-palette-class': {
      meta: { type: 'suggestion', docs: { description: 'Avoid raw gray/white/slate utility classes' } },
      create(context) {
        const filename = context.filename || context.getFilename?.() || ''
        if (shouldIgnoreFile(filename)) {
          return {}
        }
        return {
          Literal(node) {
            if (typeof node.value === 'string') checkValue(node.value, context, node)
          },
          JSXAttribute(node) {
            const n = node.value
            if (n?.type === 'Literal' && typeof n.value === 'string') {
              checkValue(n.value, context, n)
            }
            if (n?.type === 'JSXExpressionContainer' && n.expression.type === 'Literal') {
              const v = n.expression
              if (typeof v.value === 'string') checkValue(v.value, context, n.expression)
            }
          },
        }
      },
    },
  },
}
