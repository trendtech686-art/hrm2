import { prisma } from '@/lib/prisma'
import { Prisma, UserRole } from '@/generated/prisma/client'
import bcrypt from 'bcryptjs'
import { requireAuth, validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { createUserSchema } from './validation'
import { generateNextIds } from '@/lib/id-system'

// GET /api/users - List all users
export async function GET(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  try {
    const { searchParams } = new URL(request.url)
    const { page, limit, skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role')

    const where: Prisma.UserWhereInput = {}

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { employee: { fullName: { contains: search, mode: 'insensitive' } } },
      ]
    }

    if (role) {
      where.role = role as UserRole
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          systemId: true,
          email: true,
          role: true,
          isActive: true,
          lastLogin: true,
          createdAt: true,
          employee: {
            select: {
              id: true,
              fullName: true,
              avatar: true,
              department: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ])

    return apiPaginated(users, { page, limit, total })
  } catch (error) {
    console.error('Error fetching users:', error)
    return apiError('Failed to fetch users', 500)
  }
}

// POST /api/users - Create new user
export async function POST(request: Request) {
  const session = await requireAuth()
  if (!session) return apiError('Unauthorized', 401)

  const validation = await validateBody(request, createUserSchema)
  if (!validation.success) {
    return apiError(validation.error, 400)
  }
  const body = validation.data

  try {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    })

    if (existingUser) {
      return apiError('Email đã được sử dụng', 400)
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10)
    
    // Generate user ID
    const { systemId } = await generateNextIds('users')

    const user = await prisma.user.create({
      data: {
        systemId,
        email: body.email,
        password: hashedPassword,
        role: (body.role || 'USER') as UserRole,
        isActive: body.isActive ?? true,
        employee: body.employeeId ? { connect: { systemId: body.employeeId } } : undefined,
      },
      select: {
        systemId: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        employee: true,
      },
    })

    return apiSuccess(user, 201)
  } catch (error) {
    console.error('Error creating user:', error)
    return apiError('Failed to create user', 500)
  }
}
