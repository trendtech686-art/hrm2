import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/settings/payment-methods - Get all payment methods
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '100')

    const methods = await prisma.paymentMethod.findMany({
      take: limit,
      orderBy: { createdAt: 'asc' },
    })

    // Map to frontend format
    const data = methods.map((m) => ({
      systemId: m.systemId,
      id: m.id,
      name: m.name,
      code: m.code,
      type: m.type,
      isActive: m.isActive,
      isDefault: false, // Will be set by frontend or add a column
    }))

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error fetching payment methods:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment methods' },
      { status: 500 }
    )
  }
}

// POST /api/settings/payment-methods - Create payment method
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const method = await prisma.paymentMethod.create({
      data: {
        systemId: body.systemId || `PM_${Date.now()}`,
        id: body.id || `PM${Date.now()}`,
        name: body.name,
        code: body.code || 'UNKNOWN',
        type: body.type || 'other',
        isActive: body.isActive ?? true,
      },
    })

    return NextResponse.json({ data: method })
  } catch (error) {
    console.error('Error creating payment method:', error)
    return NextResponse.json(
      { error: 'Failed to create payment method' },
      { status: 500 }
    )
  }
}
