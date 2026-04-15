'use client'
import { FeatureError } from '@/components/shared/feature-error'
export default function EmployeesError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <FeatureError error={error} reset={reset} featureName="Nhân viên" backHref="/employees" backLabel="DS Nhân viên" />
}
