import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/employees - List all employees
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status')
    const departmentId = searchParams.get('departmentId')
    const branchId = searchParams.get('branchId')

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      isDeleted: false,
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search } },
        { workEmail: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (status) {
      where.employmentStatus = status
    }

    if (departmentId) {
      where.departmentId = departmentId
    }

    if (branchId) {
      where.branchId = branchId
    }

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          department: true,
          branch: true,
          jobTitle: true,
        },
      }),
      prisma.employee.count({ where }),
    ])

    return NextResponse.json({
      data: employees,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching employees:', error)
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    )
  }
}

// POST /api/employees - Create new employee
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Generate business ID if not provided
    if (!body.id) {
      const lastEmployee = await prisma.employee.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { id: true },
      })
      const lastNum = lastEmployee?.id 
        ? parseInt(lastEmployee.id.replace('NV', '')) 
        : 0
      body.id = `NV${String(lastNum + 1).padStart(3, '0')}`
    }

    const employee = await prisma.employee.create({
      data: {
        id: body.id,
        fullName: body.fullName,
        dob: body.dob ? new Date(body.dob) : null,
        placeOfBirth: body.placeOfBirth,
        gender: body.gender || 'OTHER',
        phone: body.phone,
        personalEmail: body.personalEmail,
        workEmail: body.workEmail,
        nationalId: body.nationalId,
        avatarUrl: body.avatarUrl,
        permanentAddress: body.permanentAddress,
        temporaryAddress: body.temporaryAddress,
        departmentId: body.departmentId,
        jobTitleId: body.jobTitleId,
        branchId: body.branchId,
        managerId: body.managerId,
        hireDate: body.hireDate ? new Date(body.hireDate) : null,
        startDate: body.startDate ? new Date(body.startDate) : null,
        employeeType: body.employeeType || 'FULLTIME',
        employmentStatus: body.employmentStatus || 'ACTIVE',
        role: body.role || 'Nhân viên',
        baseSalary: body.baseSalary,
        contractNumber: body.contractNumber,
        contractType: body.contractType,
        notes: body.notes,
        createdBy: body.createdBy,
      },
      include: {
        department: true,
        branch: true,
        jobTitle: true,
      },
    })

    return NextResponse.json(employee, { status: 201 })
  } catch (error: any) {
    console.error('Error creating employee:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Employee ID or email already exists' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    )
  }
}
