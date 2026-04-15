'use client'
import { FeatureError } from '@/components/shared/feature-error'
export default function TasksError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <FeatureError error={error} reset={reset} featureName="Công việc" backHref="/tasks" backLabel="DS Công việc" />
}
