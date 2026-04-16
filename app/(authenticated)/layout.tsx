import { MainLayout } from '@/components/layout/main-layout'
import { getSessionFromCookie } from '@/lib/api-utils'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { preloadSettings } from '@/lib/data/settings'

// All authenticated pages require cookies/session — never prerender
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: {
    template: '%s | ERP',
    default: 'ERP',
  },
  description: 'Hệ thống quản lý doanh nghiệp',
}

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Server-side auth check - middleware handles redirect but this is a safety net
  const session = await getSessionFromCookie()
  
  if (!session?.user) {
    redirect('/login')
  }

  // Preload common settings (branches, categories, brands, etc.) into cache
  await preloadSettings()

  return <MainLayout>{children}</MainLayout>
}
