import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: 'Tra cứu bảo hành',
  description: 'Theo dõi tiến độ xử lý bảo hành sản phẩm. Nhập mã phiếu bảo hành để kiểm tra trạng thái.',
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

export default function WarrantyTrackingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
