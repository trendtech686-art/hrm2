import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Tra cứu khiếu nại',
  description: 'Theo dõi tiến độ xử lý khiếu nại. Nhập mã khiếu nại để kiểm tra trạng thái.',
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#ffffff',
};

export default function ComplaintTrackingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
