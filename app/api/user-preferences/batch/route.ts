import { prisma } from '@/lib/prisma'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { z } from 'zod'

const batchGetSchema = z.object({
  userId: z.string(),
  keys: z.array(z.string()).min(1).max(20),
})

/**
 * POST /api/user-preferences/batch - Get multiple preferences in one request
 * 
 * Request body:
 * {
 *   "userId": "USER-ADMIN",
 *   "keys": ["column-visibility", "column-order", "column-pinned"]
 * }
 * 
 * Response:
 * {
 *   "column-visibility": { ... },
 *   "column-order": [...],
 *   "column-pinned": { ... }
 * }
 */
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, batchGetSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  
  const { userId, keys } = validation.data

  try {
    const preferences = await prisma.userPreference.findMany({
      where: {
        userId,
        key: { in: keys },
      },
    })

    // Return as key-value map
    const map: Record<string, unknown> = {}
    for (const pref of preferences) {
      map[pref.key] = pref.value
    }

    // Fill missing keys with null
    for (const key of keys) {
      if (!(key in map)) {
        map[key] = null
      }
    }

    return apiSuccess(map)
  } catch (error) {
    console.error('Error fetching batch user preferences:', error)
    return apiError('Failed to fetch user preferences', 500)
  }
}
