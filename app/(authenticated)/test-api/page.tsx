import type { Metadata } from 'next'
import { TestApiPageContent } from './test-api-content'

export const metadata: Metadata = {
  title: '[DEV] Test API',
  description: 'Development page for testing API connections',
}

export default function Page() {
  return <TestApiPageContent />
}

