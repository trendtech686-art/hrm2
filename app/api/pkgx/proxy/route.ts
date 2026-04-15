import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiError } from '@/lib/api-utils'

/**
 * PKGX Proxy — forwards requests to phukiengiaxuong.com.vn server-side
 * to avoid CORS issues when calling from browser.
 *
 * GET /api/pkgx/proxy?url=<encodedUrl>
 * Headers forwarded: X-API-KEY
 */
export const GET = apiHandler(
  async (req) => {
    const { searchParams } = new URL(req.url)
    const targetUrl = searchParams.get('url')

    if (!targetUrl) {
      return apiError('Missing url parameter', 400)
    }

    // Validate URL to prevent SSRF — only allow phukiengiaxuong.com.vn
    let parsed: URL
    try {
      parsed = new URL(targetUrl)
    } catch {
      return apiError('Invalid URL', 400)
    }

    if (parsed.hostname !== 'phukiengiaxuong.com.vn') {
      return apiError('Only phukiengiaxuong.com.vn is allowed', 403)
    }

    if (parsed.protocol !== 'https:') {
      return apiError('Only HTTPS is allowed', 403)
    }

    // Forward request
    const headers: Record<string, string> = {}
    const apiKey = req.headers.get('x-api-key')
    if (apiKey) {
      headers['X-API-KEY'] = apiKey
    }

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers,
      signal: AbortSignal.timeout(30_000),
    })

    const text = await response.text()

    // Try to parse as JSON and forward
    try {
      const data = JSON.parse(text)
      return apiSuccess(data)
    } catch {
      // Return raw text as error context
      return apiError(text.substring(0, 500), response.status || 502)
    }
  },
  { permission: 'edit_settings' },
)
