'use server'

/**
 * Server Actions for Authentication
 * 
 * These are server-side functions that can be called directly from Client Components.
 * They run on the server and can access databases, secrets, etc.
 * 
 * @see https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
 */

import { signIn, signOut } from '@/auth'
import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'

export type LoginState = {
  error?: string
  success?: boolean
}

/**
 * Server Action: Login with credentials
 * Can be used with useActionState or called directly
 */
export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const redirectTo = formData.get('redirectTo') as string || '/dashboard'

  if (!email || !password) {
    return { error: 'Email và mật khẩu là bắt buộc' }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    
    // If we get here, login was successful
    // We need to redirect manually since redirect: false
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Email hoặc mật khẩu không đúng' }
        case 'AccessDenied':
          return { error: 'Tài khoản đã bị vô hiệu hóa' }
        default:
          return { error: 'Đã xảy ra lỗi. Vui lòng thử lại.' }
      }
    }
    throw error
  }

  // Redirect after successful login
  redirect(redirectTo)
}

/**
 * Server Action: Logout
 */
export async function logoutAction() {
  await signOut({ redirectTo: '/login' })
}

/**
 * Server Action: Login directly (without form)
 * Useful for programmatic login
 */
export async function loginDirect(
  email: string,
  password: string,
  redirectTo: string = '/dashboard'
): Promise<LoginState> {
  if (!email || !password) {
    return { error: 'Email và mật khẩu là bắt buộc' }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Email hoặc mật khẩu không đúng' }
        case 'AccessDenied':
          return { error: 'Tài khoản đã bị vô hiệu hóa' }
        default:
          return { error: 'Đã xảy ra lỗi. Vui lòng thử lại.' }
      }
    }
    throw error
  }

  redirect(redirectTo)
}
