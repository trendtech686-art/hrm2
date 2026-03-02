import { auth } from '@/auth'
import { NextResponse } from 'next/server'

// Debug endpoint to check session
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
    
    return NextResponse.json({
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
        employeeId: session.user.employeeId,
        employee: session.user.employee,
      },
      message: 'Session is valid. If employeeId is missing, please logout and login again.',
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
