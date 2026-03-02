import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'

// GET /api/attendance/locks - Get all locked months
export async function GET() {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const locks = await prisma.attendanceLock.findMany({
      where: { isLocked: true },
      orderBy: { monthKey: 'desc' },
    })

    // Convert to Record<string, boolean> format for compatibility
    const lockedMonths: Record<string, boolean> = {}
    locks.forEach(lock => {
      lockedMonths[lock.monthKey] = true
    })

    return apiSuccess({ locks, lockedMonths })
  } catch (error) {
    console.error('Error fetching attendance locks:', error)
    return apiError('Failed to fetch attendance locks', 500)
  }
}

// POST /api/attendance/locks - Lock a month
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const body = await request.json()
    const { monthKey } = body

    if (!monthKey || !/^\d{4}-\d{2}$/.test(monthKey)) {
      return apiError('Invalid monthKey format. Expected: YYYY-MM', 400)
    }

    // Upsert - create or update
    const lock = await prisma.attendanceLock.upsert({
      where: { monthKey },
      create: {
        monthKey,
        isLocked: true,
        lockedBy: session.user?.email || undefined,
      },
      update: {
        isLocked: true,
        lockedAt: new Date(),
        lockedBy: session.user?.email || undefined,
        unlockedAt: null,
        unlockedBy: null,
      },
    })

    return apiSuccess(lock, 201)
  } catch (error) {
    console.error('Error locking month:', error)
    return apiError('Failed to lock month', 500)
  }
}

// DELETE /api/attendance/locks - Unlock a month
export async function DELETE(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const monthKeyParam = searchParams.get('monthKey')

    if (!monthKeyParam || !/^\d{4}-\d{2}$/.test(monthKeyParam)) {
      return apiError('Invalid monthKey format. Expected: YYYY-MM', 400)
    }

    // Update to unlocked
    const lock = await prisma.attendanceLock.update({
      where: { monthKey: monthKeyParam },
      data: {
        isLocked: false,
        unlockedAt: new Date(),
        unlockedBy: session.user?.email || undefined,
      },
    })

    return apiSuccess(lock)
  } catch (error) {
    // If not found, that's fine - it wasn't locked
    console.error('Error unlocking month:', error)
    return apiSuccess({ isLocked: false })
  }
}
