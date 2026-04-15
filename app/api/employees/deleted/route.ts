import { prisma } from '@/lib/prisma'
import { apiSuccess } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'

// GET /api/employees/deleted - List employees in trash (excludes permanently archived)
export const GET = apiHandler(async () => {
  const employees = await prisma.employee.findMany({
    where: {
      isDeleted: true,
      permanentlyDeletedAt: null, // Chỉ hiện thùng rác, không hiện đã lưu trữ vĩnh viễn
    },
    orderBy: { deletedAt: 'desc' },
    include: {
      department: true,
      branch: true,
      jobTitle: true,
    },
  })

  return apiSuccess(employees)
})
