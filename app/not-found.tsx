import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileQuestion, Home, LayoutDashboard } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-full bg-muted p-6">
          <FileQuestion className="h-16 w-16 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-xl font-semibold">Không tìm thấy trang</h2>
          <p className="max-w-md text-muted-foreground">
            Trang bạn đang tìm kiếm không tồn tại, đã bị xóa hoặc đường dẫn không chính xác.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Button asChild className="gap-2">
          <Link href="/dashboard">
            <LayoutDashboard className="h-4 w-4" />
            Về Dashboard
          </Link>
        </Button>
        <Button variant="outline" asChild className="gap-2">
          <Link href="/">
            <Home className="h-4 w-4" />
            Trang chủ
          </Link>
        </Button>
      </div>
    </div>
  )
}
