import type { Metadata, Viewport } from "next"
import { Inter, Source_Serif_4, Geist_Mono } from "next/font/google"
import { cookies } from "next/headers"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"
import { Providers } from "./providers"
import {
  THEME_COOKIE_NAME,
  buildHtmlThemeClassName,
  parseThemeCookie,
} from "@/lib/theme-cookie"
import { getServerTheme, generateThemeCSS } from "@/lib/theme-server"
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
  // Đọc cookie ở RSC để render `<html class="dark font-size-...">` ngay trong markup,
  // tránh FOUC class. CSS vars được inject từ DB.
  const cookieStore = await cookies()
  const themeCookie = parseThemeCookie(cookieStore.get(THEME_COOKIE_NAME)?.value)
  const htmlClassName = buildHtmlThemeClassName(themeCookie)

  // Lấy theme từ DB server-side
  const serverTheme = await getServerTheme()
  const themeCSS = serverTheme ? generateThemeCSS(serverTheme.customThemeConfig) : ''

  return (
    <html lang="vi" className={htmlClassName} suppressHydrationWarning>
      <head>
        {/* Fonts are self-hosted via next/font — no external requests */}
        {/* Server-injected theme CSS vars - prevents FOUC */}
        {themeCSS && <style dangerouslySetInnerHTML={{ __html: `:root { ${themeCSS} }` }} />}
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
