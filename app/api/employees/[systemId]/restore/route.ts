import { prisma } from '@/lib/prisma'
import { requireAuth, apiSuccess, apiError, apiNotFound } from '@/lib/api-utils'

// POST /api/employees/[systemId]/restore - Restore deleted employee
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ systemId: string }> }
) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { systemId } = await params

    // Check if employee exists and is deleted
    const existing = await prisma.employee.findUnique({
      where: { systemId },
    })

    if (!existing) {
      return apiNotFound('Employee')
    }

    if (!existing.isDeleted) {
      return apiError('Employee is not deleted', 400)
    }

    const employee = await prisma.employee.update({
      where: { systemId },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
      include: {
        department: true,
        branch: true,
        jobTitle: true,
      },
    })

    return apiSuccess(employee)
  } catch (error) {
    console.error('Error restoring employee:', error)
    return apiError('Failed to restore employee', 500)
  }
}
