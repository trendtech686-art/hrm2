'use client'

import * as React from 'react'
import { useReportErrorToast } from '../hooks/use-report-error-toast'
import { AlertCircle, Inbox } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

/** Skeleton for summary + chart + table (dùng phía dưới ReportFilters khi đang tải). */
export function ReportBelowFiltersSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[280px] w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

/** Toàn trang (filter + nội dung) — dùng khi không tách ReportFilters. */
export function ReportPageSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap gap-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-40" />
      </div>
      <ReportBelowFiltersSkeleton />
    </div>
  )
}

export function ReportErrorAlert({ message }: { message: string }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Không tải được báo cáo</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}

export function ReportEmptyState({
  title = 'Không có dữ liệu',
  description = 'Thử đổi khoảng thời gian hoặc bộ lọc.',
}: {
  title?: string
  description?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-12 text-center text-muted-foreground">
      <Inbox className="h-10 w-10 opacity-50" />
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-sm">{description}</p>
    </div>
  )
}

/**
 * Template chung: skeleton khi loading, banner + toast khi lỗi, children khi thành công.
 * Đặt ngay dưới ReportFilters (hoặc đầu nội dung nếu không có filter).
 */
export function ReportQueryBoundary({
  isLoading,
  isError,
  error,
  children,
}: {
  isLoading: boolean
  isError: boolean
  error: unknown
  children: React.ReactNode
}) {
  useReportErrorToast(isError, error)
  const errMessage =
    error instanceof Error ? error.message : 'Không tải được báo cáo'
  return (
    <>
      {isLoading && <ReportBelowFiltersSkeleton />}
      {!isLoading && isError && <ReportErrorAlert message={errMessage} />}
      {!isLoading && !isError && children}
    </>
  )
}
