'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useLeaveMutations } from '../hooks/use-leaves'
import { usePageHeader } from '@/contexts/page-header-context'
import { LeaveForm } from './leave-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import type { LeaveRequest } from '@/lib/types/prisma-extended'
import type { LeaveCreateInput } from '../api/leaves-api'

export function LeaveCreatePage() {
  const router = useRouter()
  const mutations = useLeaveMutations()

  usePageHeader({
    title: 'Tạo đơn nghỉ phép mới',
    breadcrumb: [
      { label: 'Trang chủ', href: '/', isCurrent: false },
      { label: 'Nghỉ phép', href: '/leaves', isCurrent: false },
      { label: 'Tạo đơn', href: '', isCurrent: true },
    ],
  })

  const handleSubmit = React.useCallback(
    (values: Omit<LeaveRequest, 'systemId'>) => {
      const createData: LeaveCreateInput = {
        employeeId: values.employeeSystemId,
        employeeSystemId: values.employeeSystemId,
        employeeName: values.employeeName,
        leaveType: values.leaveTypeName || values.leaveTypeId || 'ANNUAL',
        leaveTypeName: values.leaveTypeName,
        leaveTypeSystemId: values.leaveTypeSystemId,
        leaveTypeIsPaid: values.leaveTypeIsPaid,
        leaveTypeRequiresAttachment: values.leaveTypeRequiresAttachment,
        startDate: values.startDate,
        endDate: values.endDate,
        reason: values.reason,
        status: 'Chờ duyệt',
        numberOfDays: values.numberOfDays,
        totalDays: values.numberOfDays,
      }
      mutations.create.mutate(createData, {
        onSuccess: () => {
          toast.success('Đã tạo đơn nghỉ phép mới')
          router.push('/leaves')
        },
        onError: (err) => toast.error('Lỗi', { description: err.message }),
      })
    },
    [mutations.create, router],
  )

  const handleCancel = React.useCallback(() => {
    router.push('/leaves')
  }, [router])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tạo đơn nghỉ phép mới</CardTitle>
      </CardHeader>
      <CardContent>
        <LeaveForm
          initialData={null}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={mutations.create.isPending}
        />
      </CardContent>
    </Card>
  )
}
