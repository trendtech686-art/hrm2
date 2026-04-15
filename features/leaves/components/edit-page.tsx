'use client'

import * as React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useLeaveById, useLeaveMutations } from '../hooks/use-leaves'
import { usePageHeader } from '@/contexts/page-header-context'
import { LeaveForm } from './leave-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          Đang tải...
        </CardContent>
      </Card>
    )
  }

  if (!request) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          Không tìm thấy đơn nghỉ phép
        </CardContent>
      </Card>
    )
  }

  if (request.status !== 'Chờ duyệt') {
    router.push(`/leaves/${systemId}`)
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chỉnh sửa đơn nghỉ phép</CardTitle>
      </CardHeader>
      <CardContent>
        <LeaveForm
          initialData={request}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={mutations.update.isPending}
        />
      </CardContent>
    </Card>
  )
}
