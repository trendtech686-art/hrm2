import { prisma } from '@/lib/prisma'
import { Prisma } from '@/generated/prisma/client'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createEmployeeTypeSchema } from './validation'
import { generateNextIds } from '@/lib/id-system'

// GET /api/employee-types - List all employee types
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || ''
    const all = searchParams.get('all') === 'true'

    const where: Prisma.EmployeeTypeSettingWhereInput = {
      isDeleted: false,
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (all) {
      const employeeTypes = await prisma.employeeTypeSetting.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      })
      return apiSuccess({ data: employeeTypes })
    }

    const [employeeTypes, total] = await Promise.all([
      prisma.employeeTypeSetting.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      }),
      prisma.employeeTypeSetting.count({ where }),
    ])

    return apiPaginated(employeeTypes, { page, limit, total })
  } catch (error) {
    console.error('Error fetching employee types:', error)
    return apiError('Failed to fetch employee types', 500)
  }
}

// POST /api/employee-types - Create new employee type
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, createEmployeeTypeSchema)
  if (!validation.success) {
    console.error('Validation failed:', validation.error)
    return apiError(validation.error, 400)
  }
  const body = validation.data
  console.log('Creating employee type with body:', body)

  try {
    // If this is set as default, unset other defaults
    if (body.isDefault) {
      await prisma.employeeTypeSetting.updateMany({
        where: { isDefault: true },
        data: { isDefault: false },
      })
    }

    // Generate ID
    const { systemId } = await generateNextIds('employee-types')
    
    const dataToCreate = {
      systemId,
      id: body.id,
      name: body.name,
      description: body.description,
      isDefault: body.isDefault ?? false,
      sortOrder: body.sortOrder ?? 0,
    }
    console.log('Data to create:', dataToCreate)

    const employeeType = await prisma.employeeTypeSetting.create({
      data: dataToCreate,
    })

    console.log('Created employee type:', employeeType)
    return apiSuccess(employeeType, 201)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return apiError('Mã loại nhân viên đã tồn tại', 400)
    }
    console.error('Error creating employee type:', error)
    return apiError('Failed to create employee type', 500)
  }
}
