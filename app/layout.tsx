import type { Metadata, Viewport } from "next"
import { Inter, Source_Serif_4, Geist_Mono } from "next/font/google"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"
import { Providers } from "./providers"
// preloadSettings moved to (authenticated)/layout.tsx — only needed for auth pages

const inter = Inter({ 
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  display: "swap",
})

const sourceSerif4 = Source_Serif_4({
  subsets: ["latin", "vietnamese"],
  variable: "--font-serif",
  axes: ["opsz"],
  display: "swap",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  // theme-color: cập nhật động từ --background (component ThemeColorMeta trong app/providers)
}

export const metadata: Metadata = {
  title: {
    default: "ERP - Hệ thống quản lý doanh nghiệp",
    template: "%s | ERP",
  },
  description: "Enterprise Resource Planning System - Quản lý nhân sự, kho hàng, đơn hàng, bảo hành, tài chính và vận hành doanh nghiệp.",
  manifest: "/manifest.json",
  applicationName: "ERP",
  appleWebApp: {
    capable: true,
    title: "ERP",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "ERP - Hệ thống quản lý doanh nghiệp",
    title: "ERP - Hệ thống quản lý doanh nghiệp",
    description: "Enterprise Resource Planning System - Quản lý nhân sự, kho hàng, đơn hàng, bảo hành, tài chính và vận hành doanh nghiệp.",
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className="font-size-base" suppressHydrationWarning>
      <head>
        {/* Fonts are self-hosted via next/font — no external requests */}
      </head>
      <body className={`${inter.variable} ${sourceSerif4.variable} ${geistMono.variable} bg-background text-foreground antialiased`}>
        <Providers>
          {children}
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  )
}
