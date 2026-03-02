import type { Metadata } from "next"
import { Inter, Source_Serif_4, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { preloadSettings } from "@/lib/data/settings"

const inter = Inter({ 
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
})

const sourceSerif4 = Source_Serif_4({
  subsets: ["latin", "vietnamese"],
  variable: "--font-serif",
  axes: ["opsz"],
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "ERP - Hệ thống quản lý doanh nghiệp",
  description: "Enterprise Resource Planning System",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Preload common settings for faster page loads
  // This runs on server during initial load
  await preloadSettings()
  
  return (
    <html lang="vi" className="font-size-base" suppressHydrationWarning>
      <head>
        {/* Fonts are self-hosted via next/font — no external requests */}
      </head>
      <body className={`${inter.variable} ${sourceSerif4.variable} ${geistMono.variable} bg-background text-foreground antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
