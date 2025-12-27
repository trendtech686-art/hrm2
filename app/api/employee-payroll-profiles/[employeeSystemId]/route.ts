import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { NextRequest } from 'next/server'

const SETTING_KEY = 'employee-payroll-profiles'
const SETTING_GROUP = 'hrm'

type RouteParams = { params: Promise<{ employeeSystemId: string }> }

// PATCH /api/employee-payroll-profiles/[employeeSystemId]
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { employeeSystemId } = await params
    const body = await request.json()

    // Get existing profiles
    const setting = await prisma.setting.findFirst({
      where: {
        key: SETTING_KEY,
        group: SETTING_GROUP,
      },
    })

    const profiles = (setting?.value as any[]) || []
    const existingIndex = profiles.findIndex((p: any) => p.employeeSystemId === employeeSystemId)
    
    if (existingIndex >= 0) {
      profiles[existingIndex] = { ...profiles[existingIndex], ...body }
    } else {
      profiles.push({ employeeSystemId, ...body })
    }

    await prisma.setting.upsert({
      where: {
        key_group: {
          key: SETTING_KEY,
          group: SETTING_GROUP,
        },
      },
      update: {
        value: profiles,
        updatedAt: new Date(),
      },
      create: {
        systemId: `SET_PAYPROF_${Date.now()}`,
        key: SETTING_KEY,
        group: SETTING_GROUP,
        type: 'json',
        category: 'hrm',
        value: profiles,
        description: 'Employee payroll profiles',
      },
    })

    return NextResponse.json({ data: profiles.find((p: any) => p.employeeSystemId === employeeSystemId) })
  } catch (error) {
    console.error('Error updating payroll profile:', error)
    return NextResponse.json(
      { error: 'Failed to update payroll profile' },
      { status: 500 }
    )
  }
}

// DELETE /api/employee-payroll-profiles/[employeeSystemId]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { employeeSystemId } = await params

    // Get existing profiles
    const setting = await prisma.setting.findFirst({
      where: {
        key: SETTING_KEY,
        group: SETTING_GROUP,
      },
    })

    const profiles = (setting?.value as any[]) || []
    const filteredProfiles = profiles.filter((p: any) => p.employeeSystemId !== employeeSystemId)

    await prisma.setting.update({
      where: {
        key_group: {
          key: SETTING_KEY,
          group: SETTING_GROUP,
        },
      },
      data: {
        value: filteredProfiles,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting payroll profile:', error)
    return NextResponse.json(
      { error: 'Failed to delete payroll profile' },
      { status: 500 }
    )
  }
}
