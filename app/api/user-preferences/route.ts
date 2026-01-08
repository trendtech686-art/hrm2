import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { createUserPreferenceSchema, bulkUpdatePreferencesSchema } from './validation'

// GET /api/user-preferences?userId=xxx or ?userId=xxx&key=xxx
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const key = searchParams.get('key')
    const category = searchParams.get('category')

    console.log('[user-preferences] GET request:', { userId, key, category })

    if (!userId) {
      return apiError('userId là bắt buộc', 400)
    }

    const where: Prisma.UserPreferenceWhereInput = { userId }

    if (key) {
      where.key = key
    }

    if (category) {
      where.category = category
    }

    const preferences = await prisma.userPreference.findMany({
      where,
      orderBy: { key: 'asc' },
    })

    console.log('[user-preferences] Found:', preferences.length, 'preferences')

    // If single key requested, return just the value
    if (key && preferences.length === 1) {
      console.log('[user-preferences] Returning single preference:', preferences[0])
      return apiSuccess(preferences[0])
    }

    // Return as key-value map for easy frontend use
    const prefMap = preferences.reduce((acc: Record<string, unknown>, pref) => {
      acc[pref.key] = pref.value
      return acc
    }, {})

    return apiSuccess({ data: preferences, map: prefMap })
  } catch (error) {
    console.error('Error fetching user preferences:', error)
    return apiError('Failed to fetch user preferences', 500)
  }
}

// POST /api/user-preferences - Create or update preference
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, createUserPreferenceSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const preference = await prisma.userPreference.upsert({
      where: {
        userId_key: {
          userId: body.userId,
          key: body.key,
        },
      },
      update: {
        value: body.value,
        category: body.category,
        updatedAt: new Date(),
      },
      create: {
        userId: body.userId,
        key: body.key,
        value: body.value ?? {},
        category: body.category,
      },
    })

    return apiSuccess(preference)
  } catch (error) {
    console.error('Error saving user preference:', error)
    return apiError('Failed to save user preference', 500)
  }
}

// PUT /api/user-preferences - Bulk update
export async function PUT(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, bulkUpdatePreferencesSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    const results = await Promise.all(
      body.preferences.map((pref: { key: string; value?: unknown; category?: string }) =>
        prisma.userPreference.upsert({
          where: {
            userId_key: {
              userId: body.userId,
              key: pref.key,
            },
          },
          update: {
            value: pref.value as Prisma.InputJsonValue,
            category: pref.category,
            updatedAt: new Date(),
          },
          create: {
            userId: body.userId,
            key: pref.key,
            value: (pref.value ?? {}) as Prisma.InputJsonValue,
            category: pref.category,
          },
        })
      )
    )

    return apiSuccess({ success: true, count: results.length })
  } catch (error) {
    console.error('Error bulk updating preferences:', error)
    return apiError('Failed to bulk update preferences', 500)
  }
}

// DELETE /api/user-preferences?userId=xxx&key=xxx
export async function DELETE(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const key = searchParams.get('key')

    if (!userId || !key) {
      return apiError('userId và key là bắt buộc', 400)
    }

    await prisma.userPreference.delete({
      where: {
        userId_key: {
          userId,
          key,
        },
      },
    })

    return apiSuccess({ success: true })
  } catch (error) {
    console.error('Error deleting user preference:', error)
    return apiError('Failed to delete user preference', 500)
  }
}