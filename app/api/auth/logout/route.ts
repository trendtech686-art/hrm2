import { NextResponse } from 'next/server'

const TOKEN_COOKIE_NAME = 'auth_token'

// POST /api/auth/logout - Clear auth cookie
export async function POST() {
  const response = NextResponse.json({ success: true })
  
  // Clear auth cookie
  response.cookies.set({
    name: TOKEN_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0, // Expire immediately
    path: '/',
  })
  
  return response
}

// GET for convenience
export async function GET() {
  return POST()
}
