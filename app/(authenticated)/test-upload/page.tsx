import type { Metadata } from 'next'
import { TestUploadPageContent } from './test-upload-content'

export const metadata: Metadata = {
  title: '[DEV] Test Upload',
  description: 'Development page for testing file upload',
}

export default function Page() {
  return <TestUploadPageContent />
}

