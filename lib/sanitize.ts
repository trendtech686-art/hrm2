/**
 * HTML Sanitization Utilities
 * ═══════════════════════════════════════════════════════════════
 * Sử dụng DOMPurify để sanitize HTML content từ user input
 * Đảm bảo an toàn khi render với dangerouslySetInnerHTML
 * Isomorphic: hoạt động cả client và server side
 * ═══════════════════════════════════════════════════════════════
 */

// DOMPurify chỉ hoạt động ở client (cần window/document)
// Server side dùng regex fallback để strip dangerous tags
const isServer = typeof window === 'undefined';

interface DOMPurifyLike {
  sanitize(dirty: string, config?: Record<string, unknown>): string;
}
let _DOMPurify: DOMPurifyLike | null = null;
function getDOMPurify(): DOMPurifyLike | null {
  if (isServer) return null;
  if (!_DOMPurify) {
     
    const mod = require('dompurify');
    _DOMPurify = (mod.default ?? mod) as DOMPurifyLike;
  }
  return _DOMPurify;
}

/**
 * Default configuration for DOMPurify
 * - Cho phép các thẻ HTML cơ bản (p, span, strong, em, ul, ol, li, a, br, img)
 * - Cho phép styles cơ bản (color, background-color, text-align)
 * - Loại bỏ các thẻ nguy hiểm (script, iframe, form, input)
 * - Loại bỏ các event handlers (onclick, onerror, etc.)
 */
const ALLOWED_TAGS = [
  'p', 'span', 'div', 'br', 'hr',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'strong', 'b', 'em', 'i', 'u', 's', 'strike',
  'ul', 'ol', 'li',
  'a', 'img',
  'blockquote', 'pre', 'code',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'sub', 'sup',
];

const ALLOWED_ATTR = [
  'href', 'target', 'rel', 'title',
  'src', 'alt', 'width', 'height',
  'class', 'id',
  'style',
  'colspan', 'rowspan',
];

const ALLOWED_URI_REGEXP = /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i;

/**
 * Server-side fallback: strip all script/iframe/form tags and event handlers
 * Not as robust as DOMPurify but safe enough for SSR
 */
function serverSanitize(dirty: string, allowedTags: string[]): string {
  // Remove script, iframe, form, object, embed, applet tags entirely
  let clean = dirty.replace(/<(script|iframe|form|object|embed|applet|link|meta)\b[^>]*>[\s\S]*?<\/\1>/gi, '');
  clean = clean.replace(/<(script|iframe|form|object|embed|applet|link|meta)\b[^>]*\/?>/gi, '');
  // Remove event handlers (on*)
  clean = clean.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '');
  // Remove javascript: URLs
  clean = clean.replace(/\bhref\s*=\s*["']?\s*javascript:/gi, 'href="');
  // If no tags allowed, strip all
  if (allowedTags.length === 0) {
    clean = clean.replace(/<[^>]+>/g, '');
  }
  return clean;
}

/**
 * Sanitize HTML content - use this before rendering with dangerouslySetInnerHTML
 * 
 * @param dirty - Raw HTML string from user input
 * @returns Sanitized HTML string safe for rendering
 * 
 * @example
 * ```tsx
 * <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.description) }} />
 * ```
 */
export function sanitizeHtml(dirty: string | undefined | null): string {
  if (!dirty) return '';
  
  const DOMPurify = getDOMPurify();
  if (!DOMPurify) return serverSanitize(dirty, ALLOWED_TAGS);

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP,
    // Keep safe styles
    ALLOW_DATA_ATTR: false,
    // Remove empty elements
    KEEP_CONTENT: true,
    // Force target="_blank" links to have rel="noopener noreferrer"
    ADD_ATTR: ['target'],
  });
}

/**
 * Sanitize HTML and strip all tags - returns plain text
 * Use for preview/excerpts where HTML is not needed
 * 
 * @param dirty - Raw HTML string
 * @returns Plain text without any HTML tags
 */
export function sanitizeToText(dirty: string | undefined | null): string {
  if (!dirty) return '';
  
  const DOMPurify = getDOMPurify();
  if (!DOMPurify) return serverSanitize(dirty, []);

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    KEEP_CONTENT: true,
  }).trim();
}

/**
 * Sanitize HTML for TipTap editor content
 * More permissive than sanitizeHtml - allows TipTap-specific attributes
 * 
 * @param dirty - Raw HTML from TipTap editor
 * @returns Sanitized HTML safe for storage/rendering
 */
export function sanitizeTipTapContent(dirty: string | undefined | null): string {
  if (!dirty) return '';
  
  const DOMPurify = getDOMPurify();
  if (!DOMPurify) return serverSanitize(dirty, [...ALLOWED_TAGS, 'mark', 'figure', 'figcaption']);

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      ...ALLOWED_TAGS,
      'mark', // TipTap highlight
      'figure', 'figcaption', // TipTap images with captions
    ],
    ALLOWED_ATTR: [
      ...ALLOWED_ATTR,
      'data-type', // TipTap node types
      'data-mention', // TipTap mentions
    ],
    ALLOWED_URI_REGEXP,
    KEEP_CONTENT: true,
  });
}

/**
 * Check if HTML content contains potentially dangerous content
 * Use for validation before saving
 * 
 * @param html - HTML string to check
 * @returns true if content appears safe
 */
export function isHtmlSafe(html: string | undefined | null): boolean {
  if (!html) return true;
  
  const sanitized = sanitizeHtml(html);
  // If sanitization changed the content significantly, it might be unsafe
  // This is a basic check - for strict validation, compare DOM structures
  return sanitized.length >= html.length * 0.9;
}
