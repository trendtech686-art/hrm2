import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError } from '@/lib/api-utils'

// GET /api/employees/deleted - List all deleted employees
export async function GET() {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const employees = await prisma.employee.findMany({
      where: {
        isDeleted: true,
      },
      orderBy: { deletedAt: 'desc' },
      include: {
        department: true,
        branch: true,
        jobTitle: true,
      },
    })

    return apiSuccess(employees)
  } catch (error) {
    console.error('Error fetching deleted employees:', error)
    return apiError('Failed to fetch deleted employees', 500)
  }
}
