import { prisma } from '@/lib/prisma'
import { cache, CACHE_TTL } from '@/lib/cache'

export interface PasswordRules {
  minLength: number
  requireUppercase: boolean
  requireNumbers: boolean
  requireSpecialChars: boolean
}

const DEFAULT_PASSWORD_RULES: PasswordRules = {
  minLength: 8,
  requireUppercase: true,
  requireNumbers: true,
  requireSpecialChars: false,
}

const CACHE_KEY = 'settings:security:password_rules'

export async function getPasswordRules(): Promise<PasswordRules> {
  const cached = cache.get(CACHE_KEY) as PasswordRules | undefined
  if (cached) return cached

  try {
    const setting = await prisma.setting.findUnique({
      where: { key_group: { key: 'password_rules', group: 'security' } },
    })

    if (setting?.value) {
      const rules = { ...DEFAULT_PASSWORD_RULES, ...(setting.value as object) }
      cache.set(CACHE_KEY, rules, CACHE_TTL.LONG * 1000)
      return rules
    }
  } catch {
    // Fallback to defaults on error
  }

  return DEFAULT_PASSWORD_RULES
}

export function validatePassword(password: string, rules: PasswordRules): string | null {
  if (password.length < rules.minLength) {
    return `Mật khẩu phải có ít nhất ${rules.minLength} ký tự`
  }
  if (rules.requireUppercase && !/[A-Z]/.test(password)) {
    return 'Mật khẩu phải chứa ít nhất 1 chữ in hoa'
  }
  if (rules.requireNumbers && !/\d/.test(password)) {
    return 'Mật khẩu phải chứa ít nhất 1 chữ số'
  }
  if (rules.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt'
  }
  return null
}
