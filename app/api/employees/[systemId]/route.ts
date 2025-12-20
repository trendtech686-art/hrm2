import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/employees/[systemId] - Get single employee
export async function GET(
  request: Request,
  { params }: { params: Promise<{ systemId: string }> }
) {
  try {
    const { systemId } = await params

    const employee = await prisma.employee.findUnique({
      where: { systemId },
      include: {
        department: true,
        branch: true,
        jobTitle: true,
        manager: {
          select: {
            systemId: true,
            id: true,
            fullName: true,
          },
        },
        subordinates: {
          select: {
            systemId: true,
            id: true,
            fullName: true,
          },
        },
      },
    })

    if (!employee || employee.isDeleted) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(employee)
  } catch (error) {
    console.error('Error fetching employee:', error)
    return NextResponse.json(
      { error: 'Failed to fetch employee' },
      { status: 500 }
    )
  }
}

// PUT /api/employees/[systemId] - Update employee
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ systemId: string }> }
) {
  try {
    const { systemId } = await params
    const body = await request.json()

    // Check if employee exists
    const existing = await prisma.employee.findUnique({
      where: { systemId },
    })

    if (!existing || existing.isDeleted) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    const employee = await prisma.employee.update({
      where: { systemId },
      data: {
        fullName: body.fullName,
        dob: body.dob ? new Date(body.dob) : null,
        placeOfBirth: body.placeOfBirth,
        gender: body.gender,
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
        endDate: body.endDate ? new Date(body.endDate) : null,
        terminationDate: body.terminationDate ? new Date(body.terminationDate) : null,
        reasonForLeaving: body.reasonForLeaving,
        employeeType: body.employeeType,
        employmentStatus: body.employmentStatus,
        role: body.role,
        baseSalary: body.baseSalary,
        socialInsuranceSalary: body.socialInsuranceSalary,
        positionAllowance: body.positionAllowance,
        mealAllowance: body.mealAllowance,
        otherAllowances: body.otherAllowances,
        numberOfDependents: body.numberOfDependents,
        contractNumber: body.contractNumber,
        contractStartDate: body.contractStartDate ? new Date(body.contractStartDate) : null,
        contractEndDate: body.contractEndDate ? new Date(body.contractEndDate) : null,
        contractType: body.contractType,
        probationEndDate: body.probationEndDate ? new Date(body.probationEndDate) : null,
        bankAccountNumber: body.bankAccountNumber,
        bankName: body.bankName,
        bankBranch: body.bankBranch,
        personalTaxId: body.personalTaxId,
        socialInsuranceNumber: body.socialInsuranceNumber,
        annualLeaveBalance: body.annualLeaveBalance,
        notes: body.notes,
        updatedBy: body.updatedBy,
      },
      include: {
        department: true,
        branch: true,
        jobTitle: true,
      },
    })

    return NextResponse.json(employee)
  } catch (error: any) {
    console.error('Error updating employee:', error)

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update employee' },
      { status: 500 }
    )
  }
}

// DELETE /api/employees/[systemId] - Soft delete employee
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ systemId: string }> }
) {
  try {
    const { systemId } = await params

    const employee = await prisma.employee.update({
      where: { systemId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true, systemId: employee.systemId })
  } catch (error) {
    console.error('Error deleting employee:', error)
    return NextResponse.json(
      { error: 'Failed to delete employee' },
      { status: 500 }
    )
  }
}
