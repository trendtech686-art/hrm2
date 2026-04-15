'use client'
import { FeatureError } from '@/components/shared/feature-error'
export default function SettingsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <FeatureError error={error} reset={reset} featureName="Cài đặt" backHref="/settings" backLabel="Cài đặt" />
}
