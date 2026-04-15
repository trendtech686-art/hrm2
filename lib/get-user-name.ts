import { prisma } from '@/lib/prisma'

/**
 * Resolve display name for a user given their userId (systemId).
 * Used in activity logging across API routes.
 *
 * Lookup order: User.employee.fullName → User.email → throw
 */
export async function getUserNameFromDb(userId: string | null | undefined): Promise<string> {
  if (!userId) {
    throw new Error('User ID is required for activity logging')
  }

  const user = await prisma.user.findFirst({
    where: { systemId: userId },
    select: {
      email: true,
      employee: { select: { fullName: true } },
    },
  })

  if (user?.employee?.fullName) {
    return user.employee.fullName
  }

  if (user?.email) {
    return user.email
  }

  throw new Error(`Cannot find user name for ID: ${userId}`)
}

/**
 * Resolve display name from session object (no DB query needed).
 * Use this in server actions where session is already available.
 * Falls back to userId if no name info is available.
 */
export function getSessionUserName(session: {
  user?: { id?: string; name?: string; employee?: { fullName?: string; name?: string } | null }
} | null): string {
  return session?.user?.employee?.fullName
    || session?.user?.employee?.name
    || session?.user?.name
    || session?.user?.id
    || 'Hệ thống'
}
