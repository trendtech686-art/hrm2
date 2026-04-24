import { prisma } from '@/lib/prisma'

/**
 * Xử lý input "email hoặc SĐT" người dùng nhập ở màn login.
 *
 * Luồng:
 * 1. Nếu chuỗi chứa '@' → coi là email, tìm `User.findUnique({ email })`.
 * 2. Ngược lại → coi là SĐT:
 *    - Chuẩn hoá về nhiều biến thể (digits-only, 0-prefix, +84, 84...) rồi
 *      `Employee.findFirst` theo OR để match đúng bản ghi đầu tiên.
 *    - Lấy employee đó, rồi `User.findUnique({ employeeId: employee.systemId })`.
 * 3. Trả về object User đầy đủ quan hệ `employee` (dùng cho NextAuth + API OTP).
 *
 * Hàm có flag `debug` để mapping log sang `authorize()` (không đổi hành vi).
 */

type IncludeEmployee = {
  employee: {
    select: {
      systemId: true
      fullName: true
      workEmail: true
      role: true
      department: { select: { systemId: true; name: true } }
      branch: { select: { systemId: true; name: true } }
      jobTitle: { select: { systemId: true; name: true } }
    }
  }
}

const userInclude: IncludeEmployee = {
  employee: {
    select: {
      systemId: true,
      fullName: true,
      workEmail: true,
      role: true,
      department: { select: { systemId: true, name: true } },
      branch: { select: { systemId: true, name: true } },
      jobTitle: { select: { systemId: true, name: true } },
    },
  },
}

export type LoginUser = NonNullable<
  Awaited<ReturnType<typeof findUserByEmail>>
>

function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: userInclude,
  })
}

function findUserByEmployeeSystemId(employeeSystemId: string) {
  return prisma.user.findUnique({
    where: { employeeId: employeeSystemId },
    include: userInclude,
  })
}

export function buildPhoneVariants(raw: string): string[] {
  const trimmed = raw.trim()
  if (!trimmed) return []
  const digits = trimmed.replace(/\D+/g, '')
  const set = new Set<string>()
  set.add(trimmed)
  if (digits) set.add(digits)

  if (digits.startsWith('84') && digits.length > 2) {
    const local = '0' + digits.slice(2)
    set.add(local)
    set.add('+' + digits)
  } else if (digits.startsWith('0') && digits.length > 1) {
    set.add('84' + digits.slice(1))
    set.add('+84' + digits.slice(1))
  }
  return [...set].filter(Boolean)
}

export function looksLikeEmail(identifier: string): boolean {
  return identifier.includes('@')
}

export async function resolveLoginUser(
  identifier: string,
): Promise<LoginUser | null> {
  const value = identifier.trim()
  if (!value) return null

  if (looksLikeEmail(value)) {
    return findUserByEmail(value)
  }

  const variants = buildPhoneVariants(value)
  if (variants.length === 0) return null

  const employee = await prisma.employee.findFirst({
    where: { phone: { in: variants } },
    select: { systemId: true },
  })
  if (!employee) return null

  return findUserByEmployeeSystemId(employee.systemId)
}
