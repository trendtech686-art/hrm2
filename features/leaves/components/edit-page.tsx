'use client'

import * as React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useLeaveById, useLeaveMutations } from '../hooks/use-leaves'
import { usePageHeader } from '@/contexts/page-header-context'
import { LeaveForm } from './leave-form'
import { MobileSectionCard, MobileSectionHeader, MobileSectionTitle } from '@/components/layout/page-section'
import { toast } from 'sonner'
import type { LeaveRequest } from '@/lib/types/prisma-extended'

export function LeaveEditPage() {
  const { systemId } = useParams<{ systemId: string }>()
  const router = useRouter()
  const { data: request, isLoading } = useLeaveById(systemId)
  const mutations = useLeaveMutations()

  usePageHeader({
    title: request ? `Sửa đơn ${request.id}` : 'Chỉnh sửa đơn nghỉ phép',
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Nghỉ phép', href: '/leaves', isCurrent: false },
      { label: request?.id || 'Chi tiết', href: `/leaves/${systemId}`, isCurrent: false },
      { label: 'Chỉnh sửa', href: '', isCurrent: true },
    ],
  })

  const handleSubmit = React.useCallback(
    (values: Omit<LeaveRequest, 'systemId'>) => {
      if (!systemId) return
      mutations.update.mutate(
        { systemId, data: values },
        {
          onSuccess: () => {
            toast.success('Đã cập nhật đơn nghỉ phép')
            router.push(`/leaves/${systemId}`)
          },
          onError: (err) => toast.error('Lỗi', { description: err.message }),
        },
      )
    },
    [systemId, mutations.update, router],
  )

  const handleCancel = React.useCallback(() => {
    router.push(`/leaves/${systemId}`)
  }, [router, systemId])

  if (isLoading) {
    return (
      <MobileSectionCard className="p-8 text-center text-muted-foreground">
        Đang tải...
      </MobileSectionCard>
    )
  }

  if (!request) {
    return (
      <MobileSectionCard className="p-8 text-center text-muted-foreground">
        Không tìm thấy đơn nghỉ phép
      </MobileSectionCard>
    )
  }

  if (request.status !== 'Chờ duyệt') {
    router.push(`/leaves/${systemId}`)
    return null
  }

  return (
    <MobileSectionCard>
      <MobileSectionHeader>
        <MobileSectionTitle>Chỉnh sửa đơn nghỉ phép</MobileSectionTitle>
      </MobileSectionHeader>
      <LeaveForm
        initialData={request}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={mutations.update.isPending}
      />
    </MobileSectionCard>
  )
}
