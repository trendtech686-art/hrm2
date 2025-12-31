import { MainLayout } from '@/components/layout/main-layout'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | ERP System',
    default: 'ERP System',
  },
  description: 'Hệ thống quản lý doanh nghiệp',
}

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Server-side auth check - middleware handles redirect but this is a safety net
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  return <MainLayout>{children}</MainLayout>
}
