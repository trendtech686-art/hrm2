import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Prisma } from '@/generated/prisma/client'

const SETTING_KEY = 'employee-payroll-profiles'
const SETTING_GROUP = 'hrm'

interface PayrollProfile {
  employeeSystemId: string
  [key: string]: unknown
}

// GET /api/employee-payroll-profiles - Get all employee payroll profiles
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const employeeSystemId = searchParams.get('employeeSystemId')

    const setting = await prisma.setting.findFirst({
      where: {
        key: SETTING_KEY,
        group: SETTING_GROUP,
      },
    })

    if (!setting || !setting.value) {
      return NextResponse.json({ data: [] })
    }

    let profiles = setting.value as PayrollProfile[]
    
    if (employeeSystemId) {
      profiles = profiles.filter((p) => p.employeeSystemId === employeeSystemId)
    }

    return NextResponse.json({ data: profiles })
  } catch (error) {
    console.error('Error fetching payroll profiles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payroll profiles' },
      { status: 500 }
    )
  }
}

// POST /api/employee-payroll-profiles - Create profile
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Get existing profiles
    const setting = await prisma.setting.findFirst({
      where: {
        key: SETTING_KEY,
        group: SETTING_GROUP,
      },
    })

    const profiles = (setting?.value as PayrollProfile[]) || []
    
    // Update or add profile
    const existingIndex = profiles.findIndex((p) => p.employeeSystemId === body.employeeSystemId)
    if (existingIndex >= 0) {
      profiles[existingIndex] = body
    } else {
      profiles.push(body)
    }

    await prisma.setting.upsert({
      where: {
        key_group: {
          key: SETTING_KEY,
          group: SETTING_GROUP,
        },
      },
      update: {
        value: profiles as unknown as Prisma.InputJsonValue,
        updatedAt: new Date(),
      },
      create: {
        systemId: `SET_PAYPROF_${Date.now()}`,
        key: SETTING_KEY,
        group: SETTING_GROUP,
        type: 'json',
        category: 'hrm',
        value: profiles as unknown as Prisma.InputJsonValue,
        description: 'Employee payroll profiles',
      },
    })

    return NextResponse.json({ data: body })
  } catch (error) {
    console.error('Error creating payroll profile:', error)
    return NextResponse.json(
      { error: 'Failed to create payroll profile' },
      { status: 500 }
    )
  }
}
