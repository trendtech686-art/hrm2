import { apiHandler } from '@/lib/api-handler'
import { apiSuccess, apiError } from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'
import { generateNextIds } from '@/lib/id-system'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const setupSchema = z.object({
  fullName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
})

async function hasAdminUser(): Promise<boolean> {
  const count = await prisma.user.count({
    where: { role: 'ADMIN', isActive: true },
  })
  return count > 0
}

// GET /api/setup — Check if initial setup is needed
export const GET = apiHandler(async () => {
  const hasAdmin = await hasAdminUser()
  return apiSuccess({ needsSetup: !hasAdmin })
}, { auth: false })

// POST /api/setup — Create first admin account
export const POST = apiHandler(async (req) => {
  // Only allow if no admin exists
  const hasAdmin = await hasAdminUser()
  if (hasAdmin) {
    return apiError('Hệ thống đã được khởi tạo. Không thể tạo thêm tài khoản qua setup.', 403)
  }

  const body = await req.json()
  const parsed = setupSchema.safeParse(body)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || 'Dữ liệu không hợp lệ'
    return apiError(firstError, 400)
  }

  const { fullName, email, password } = parsed.data

  // Check email uniqueness
  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return apiError('Email đã được sử dụng', 400)
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  // Generate IDs for both Employee and User
  const { systemId: empSystemId, businessId: empBusinessId } = await generateNextIds('employees')
  const { systemId: userSystemId } = await generateNextIds('users')

  // Create Employee + User in a transaction
  const result = await prisma.$transaction(async (tx) => {
    const employee = await tx.employee.create({
      data: {
        systemId: empSystemId,
        id: empBusinessId,
        fullName,
        workEmail: email,
        role: 'Admin',
        employeeType: 'FULLTIME',
        employmentStatus: 'ACTIVE',
        hireDate: new Date(),
      },
    })

    const user = await tx.user.create({
      data: {
        systemId: userSystemId,
        email,
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true,
        employeeId: employee.systemId,
      },
    })

    return { userId: user.systemId, employeeId: employee.systemId, email: user.email }
  })

  return apiSuccess(result, 201)
}, { auth: false })
