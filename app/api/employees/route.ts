import { prisma } from '@/lib/prisma'
import { Prisma, EmploymentStatus, Gender, EmployeeType, ContractType, UserRole } from '@/generated/prisma/client'
import { validateBody, apiSuccess, apiPaginated, apiError, parsePagination } from '@/lib/api-utils'
import { apiHandler } from '@/lib/api-handler'
import { createEmployeeSchema } from './validation'
import { generateNextIdsWithTx, generateNextIds } from '@/lib/id-system'
import { serializeEmployee } from './serialize'
import bcrypt from 'bcryptjs'
import { logError } from '@/lib/logger'
import { getUserNameFromDb } from '@/lib/get-user-name'
import { createNotification } from '@/lib/notifications'
import { getPasswordRules, validatePassword } from '@/lib/password-rules'
import { buildSearchWhere } from '@/lib/search/build-search-where'

// Route segment config - force dynamic since we use auth and query params
export const dynamic = 'force-dynamic'

// GET /api/employees - List all employees
export const GET = apiHandler(async (request) => {
    const { searchParams } = new URL(request.url)

    // ✅ PERFORMANCE: Lightweight mentions endpoint for @mention in comments
    // Usage: GET /api/employees?select=mentions&search=abc (returns max 10 results)
    if (searchParams.get('select') === 'mentions') {
      const search = searchParams.get('search') || ''
      const where: Prisma.EmployeeWhereInput = { isDeleted: false }
      const mentionsSearch = buildSearchWhere<Prisma.EmployeeWhereInput>(search, ['fullName', 'id'])
      if (mentionsSearch) Object.assign(where, mentionsSearch)
      const mentions = await prisma.employee.findMany({
        where,
        select: { systemId: true, fullName: true, avatarUrl: true },
        orderBy: { fullName: 'asc' },
        take: 10,
      })
      return apiSuccess(mentions.map(e => ({
        id: e.systemId,
        label: e.fullName,
        avatar: e.avatarUrl ?? undefined,
      })))
    }

    // ✅ PERFORMANCE: Lightweight combobox endpoint for employee selectors
    // Usage: GET /api/employees?select=combobox&search=abc&page=1&limit=30
    if (searchParams.get('select') === 'combobox') {
      const search = searchParams.get('search') || ''
      const cbPage = parseInt(searchParams.get('page') || '1', 10)
      const cbLimit = parseInt(searchParams.get('limit') || '30', 10)
      const cbSkip = (cbPage - 1) * cbLimit
      const where: Prisma.EmployeeWhereInput = { isDeleted: false }
      const comboboxSearch = buildSearchWhere<Prisma.EmployeeWhereInput>(search, [
        'fullName',
        { key: 'phone', caseSensitive: true },
      ])
      if (comboboxSearch) Object.assign(where, comboboxSearch)
      const [items, total] = await Promise.all([
        prisma.employee.findMany({
          where,
          select: { systemId: true, fullName: true },
          orderBy: { fullName: 'asc' },
          skip: cbSkip,
          take: cbLimit,
        }),
        prisma.employee.count({ where }),
      ])
      return apiSuccess({
        items: items.map(e => ({ value: e.systemId, label: e.fullName })),
        hasNextPage: cbSkip + items.length < total,
      })
    }

    const { page, limit, skip } = parsePagination(searchParams)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'
    // Support both naming conventions, prefer *SystemId
    const departmentSystemId = searchParams.get('departmentSystemId') || searchParams.get('departmentId')
    const branchSystemId = searchParams.get('branchSystemId') || searchParams.get('branchId')
    const jobTitle = searchParams.get('jobTitle')
    const department = searchParams.get('department')

    // Build where clause
    const where: Prisma.EmployeeWhereInput = {
      isDeleted: false,
    }

    const searchWhere = buildSearchWhere<Prisma.EmployeeWhereInput>(search, [
      'fullName',
      'id',
      { key: 'phone', caseSensitive: true },
      'workEmail',
    ])
    if (searchWhere) Object.assign(where, searchWhere)

    if (status) {
      where.employmentStatus = status as EmploymentStatus
    }

    if (departmentSystemId) {
      where.departmentId = departmentSystemId // Prisma field is departmentId but value is systemId
    }

    if (branchSystemId) {
      where.branchId = branchSystemId // Prisma field is branchId but value is systemId
    }

    // Filter by department name
    if (department) {
      where.department = { name: { equals: department, mode: 'insensitive' } }
    }

    // Filter by job title name
    if (jobTitle) {
      where.jobTitle = { name: { equals: jobTitle, mode: 'insensitive' } }
    }

    // Build orderBy - handle nested relations
    const orderByField = sortBy === 'department' ? { department: { name: sortOrder } }
      : sortBy === 'branch' ? { branch: { name: sortOrder } }
      : sortBy === 'jobTitle' ? { jobTitle: { name: sortOrder } }
      : { [sortBy]: sortOrder }

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip,
        take: limit,
        orderBy: orderByField as Prisma.EmployeeOrderByWithRelationInput,
        include: {
          department: true,
          branch: true,
          jobTitle: true,
          manager: {
            select: {
              systemId: true,
              fullName: true,
            }
          },
        },
      }),
      prisma.employee.count({ where }),
    ])

    const serializedEmployees = employees.map(emp => serializeEmployee(emp))

    return apiPaginated(serializedEmployees, { page, limit, total })
})

// POST /api/employees - Create new employee
export const POST = apiHandler(async (request, { session }) => {
  const result = await validateBody(request, createEmployeeSchema)
  if (!result.success) return apiError(result.error, 400)

  try {
    const body = result.data

    const employee = await prisma.$transaction(async (tx) => {
      // Generate IDs using unified ID system
      const { systemId, businessId } = await generateNextIdsWithTx(
        tx,
        'employees',
        body.id?.trim() || undefined
      );

      return tx.employee.create({
        data: {
          systemId,
          id: businessId,
        fullName: body.fullName,
        dob: body.dob ? new Date(body.dob) : null,
        placeOfBirth: body.placeOfBirth,
        gender: (body.gender || 'OTHER') as Gender,
        phone: body.phone,
        personalEmail: body.personalEmail,
        workEmail: body.workEmail,
        nationalId: body.nationalId,
        nationalIdIssueDate: body.nationalIdIssueDate ? new Date(body.nationalIdIssueDate) : null,
        nationalIdIssuePlace: body.nationalIdIssuePlace,
        avatarUrl: body.avatarUrl,
        permanentAddress: body.permanentAddress === null ? Prisma.JsonNull : body.permanentAddress,
        temporaryAddress: body.temporaryAddress === null ? Prisma.JsonNull : body.temporaryAddress,
        // Use *Id fields which contain systemId values
        department: (body.departmentId || body.department) ? { connect: { systemId: body.departmentId || body.department } } : undefined,
        jobTitle: (body.jobTitleId || body.jobTitle) ? { connect: { systemId: body.jobTitleId || body.jobTitle } } : undefined,
        branch: (body.branchId || body.branchSystemId) ? { connect: { systemId: body.branchId || body.branchSystemId } } : undefined,
        manager: body.managerId ? { connect: { systemId: body.managerId } } : undefined,
        hireDate: body.hireDate ? new Date(body.hireDate) : null,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        terminationDate: body.terminationDate ? new Date(body.terminationDate) : null,
        reasonForLeaving: body.reasonForLeaving,
        employeeType: (body.employeeType || 'FULLTIME') as EmployeeType,
        employmentStatus: (body.employmentStatus || 'ACTIVE') as EmploymentStatus,
        role: body.role || 'Nhân viên',
        // Salary & Allowances
        baseSalary: body.baseSalary,
        socialInsuranceSalary: body.socialInsuranceSalary,
        positionAllowance: body.positionAllowance,
        mealAllowance: body.mealAllowance,
        otherAllowances: body.otherAllowances,
        numberOfDependents: body.numberOfDependents,
        // Contract
        contractNumber: body.contractNumber,
        contractType: body.contractType as ContractType | undefined,
        contractStartDate: body.contractStartDate ? new Date(body.contractStartDate) : null,
        contractEndDate: body.contractEndDate ? new Date(body.contractEndDate) : null,
        probationEndDate: body.probationEndDate ? new Date(body.probationEndDate) : null,
        // Bank info
        bankAccountNumber: body.bankAccountNumber,
        bankName: body.bankName,
        bankBranch: body.bankBranch,
        // Tax & Insurance
        personalTaxId: body.personalTaxId,
        socialInsuranceNumber: body.socialInsuranceNumber,
        // Personal info
        maritalStatus: body.maritalStatus,
        emergencyContactName: body.emergencyContactName,
        emergencyContactPhone: body.emergencyContactPhone,
        // Leave
        annualLeaveBalance: body.annualLeaveBalance,
        // Other
        notes: body.notes,
        createdBy: body.createdBy,
      },
      include: {
        department: true,
        branch: true,
        jobTitle: true,
        user: true,
      },
      });
    });

    // If password is provided, create User account for login
    if (body.password && body.workEmail) {
      const rules = await getPasswordRules()
      const validationError = validatePassword(body.password, rules)
      if (validationError) {
        return apiError(validationError, 400)
      }
      const hashedPassword = await bcrypt.hash(body.password, 10)
      const { systemId: userSystemId } = await generateNextIds('users')
      await prisma.user.create({
        data: {
          systemId: userSystemId,
          email: body.workEmail,
          password: hashedPassword,
          role: 'STAFF' as UserRole,
          isActive: true,
          employeeId: employee.systemId,
        },
      })
    }

    // Log activity with field tracking
    const fieldLabels = {
      fullName: 'Họ tên',
      phone: 'SĐT',
      personalEmail: 'Email cá nhân',
      workEmail: 'Email công việc',
      gender: 'Giới tính',
      employeeType: 'Loại nhân viên',
      employmentStatus: 'Trạng thái',
      role: 'Vai trò',
      departmentId: 'Phòng ban',
      jobTitleId: 'Chức vụ',
      branchId: 'Chi nhánh',
      managerId: 'Quản lý',
      baseSalary: 'Lương cơ bản',
      contractType: 'Loại hợp đồng',
      bankAccountNumber: 'Số tài khoản',
      bankName: 'Ngân hàng',
      notes: 'Ghi chú',
    }
    getUserNameFromDb(session!.user.id).then(userName =>
      prisma.activityLog.create({
        data: {
          entityType: 'employee',
          entityId: employee.systemId,
          action: 'created',
          actionType: 'create',
          note: `Tạo nhân viên: ${employee.fullName}`,
          metadata: { userName, fieldLabels },
          createdBy: userName,
        }
      })
    ).catch(e => logError('[ActivityLog] employee created failed', e))

    // Notify manager if assigned
    if (employee.managerId && employee.managerId !== session!.user?.employeeId) {
      createNotification({
        type: 'employee',
        settingsKey: 'employee:created',
        title: 'Nhân viên mới được giao quản lý',
        message: `Nhân viên mới: ${employee.fullName} (${employee.id})`,
        link: `/employees/${employee.systemId}`,
        recipientId: employee.managerId,
        senderId: session!.user?.employeeId,
        senderName: session!.user?.name,
      }).catch(e => logError('[Employee POST] notification failed', e))
    }

    return apiSuccess(employee, 201)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return apiError('Employee ID or email already exists', 400)
    }
    throw error
  }
}, { permission: 'edit_employees' })
