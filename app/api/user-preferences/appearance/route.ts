import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { auth } from '@/auth'
import { requireAuth, validateBody, apiSuccess, apiError } from '@/lib/api-utils'
import { updateAppearanceSchema } from './validation'

const PREFERENCE_KEY = 'appearance'
const PREFERENCE_CATEGORY = 'ui'

// GET /api/user-preferences/appearance
export async function GET() {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const session = await auth()
    if (!session?.user?.id) {
      return apiSuccess({ data: null })
    }

    const preference = await prisma.userPreference.findUnique({
      where: {
        userId_key: {
          userId: session.user.id,
          key: PREFERENCE_KEY,
        },
      },
    })

    if (!preference) {
      return apiSuccess({ data: null })
    }

    return apiSuccess({ data: preference.value })
  } catch (error) {
    console.error('Error fetching appearance preferences:', error)
    return apiError('Failed to fetch appearance preferences', 500)
  }
}

// PUT /api/user-preferences/appearance
export async function PUT(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, updateAppearanceSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const settings = validation.data

  try {
    const session = await auth()
    if (!session?.user?.id) {
      return apiError('Unauthorized', 401)
    }

    // Get existing preference to merge
    const existing = await prisma.userPreference.findUnique({
      where: {
        userId_key: {
          userId: session.user.id,
          key: PREFERENCE_KEY,
        },
      },
    })

    const mergedValue = {
      ...((existing?.value as object) || {}),
      ...settings,
    }

    const preference = await prisma.userPreference.upsert({
      where: {
        userId_key: {
          userId: session.user.id,
          key: PREFERENCE_KEY,
        },
      },
      update: {
        value: mergedValue as Prisma.InputJsonValue,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        key: PREFERENCE_KEY,
        category: PREFERENCE_CATEGORY,
        value: mergedValue as Prisma.InputJsonValue,
      },
    })

    return apiSuccess({ data: preference.value })
  } catch (error) {
    console.error('Error saving appearance preferences:', error)
    return apiError('Failed to save appearance preferences', 500)
  }
}
