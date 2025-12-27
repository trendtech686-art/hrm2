import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/active-timer?userId=xxx - Get active timer for user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId là bắt buộc' },
        { status: 400 }
      )
    }

    const timer = await prisma.activeTimer.findUnique({
      where: { userId },
    })

    if (!timer) {
      return NextResponse.json(null)
    }

    return NextResponse.json(timer)
  } catch (error) {
    console.error('Error fetching active timer:', error)
    return NextResponse.json(
      { error: 'Failed to fetch active timer' },
      { status: 500 }
    )
  }
}

// POST /api/active-timer - Start new timer (replaces any existing)
export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.userId || !body.taskId) {
      return NextResponse.json(
        { error: 'userId và taskId là bắt buộc' },
        { status: 400 }
      )
    }

    // Upsert - replace existing timer if any
    const timer = await prisma.activeTimer.upsert({
      where: { userId: body.userId },
      update: {
        taskId: body.taskId,
        startTime: body.startTime ? new Date(body.startTime) : new Date(),
        description: body.description,
        updatedAt: new Date(),
      },
      create: {
        userId: body.userId,
        taskId: body.taskId,
        startTime: body.startTime ? new Date(body.startTime) : new Date(),
        description: body.description,
      },
    })

    return NextResponse.json(timer, { status: 201 })
  } catch (error) {
    console.error('Error creating active timer:', error)
    return NextResponse.json(
      { error: 'Failed to create active timer' },
      { status: 500 }
    )
  }
}

// DELETE /api/active-timer?userId=xxx - Stop/delete timer
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId là bắt buộc' },
        { status: 400 }
      )
    }

    try {
      await prisma.activeTimer.delete({
        where: { userId },
      })
    } catch (e: any) {
      // If not found, that's okay
      if (e.code !== 'P2025') {
        throw e
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting active timer:', error)
    return NextResponse.json(
      { error: 'Failed to delete active timer' },
      { status: 500 }
    )
  }
}
