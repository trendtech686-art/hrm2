import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'
import bundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  // Cho phép import từ các folder bên ngoài src/app
  transpilePackages: [],
  
  // React Strict Mode - enabled to catch potential issues
  reactStrictMode: true,
  
  // Output standalone cho Docker deployment
  // Note: Tạm tắt standalone vì Turbopack có bug với symlink trên Windows
  // output: 'standalone',
  
  // Server external packages - Prisma 7 với driver adapter cần opt-out bundling
  serverExternalPackages: [
    '@prisma/client',
    'prisma',
    '@prisma/adapter-pg',
    'pg',
  ],
  
  // Experimental features
  experimental: {
    // Optimize package imports - thêm các internal barrels để tránh load toàn bộ module
    optimizePackageImports: [
      // External packages
      'lucide-react', 
      '@radix-ui/react-icons', 
      'recharts',
      '@tanstack/react-query',
      '@tanstack/react-virtual',
      '@tanstack/react-table',
      '@dnd-kit/core',
      '@dnd-kit/sortable',
      'date-fns',
      'zod',
      'sonner',
      // Internal barrels - giúp tree-shake tốt hơn
      '@/hooks/api',
      '@/lib/print-mappers',
      '@/lib/trendtech',
      '@/lib/pkgx',
      // Feature modules - CRITICAL for compile time
      '@/features/warranty/components',
      '@/features/warranty/store',
      '@/features/settings/printer',
      '@/features/orders',
      '@/features/orders/hooks',
      '@/features/customers', 
      '@/features/customers/hooks',
      '@/features/employees',
      '@/features/employees/hooks',
      '@/features/products',
      '@/features/products/hooks',
      '@/features/stock-transfers',
      '@/features/stock-transfers/hooks',
      '@/features/complaints',
      '@/features/complaints/hooks',
      '@/features/leaves',
      '@/features/tasks',
      '@/features/reports',
      '@/features/settings',
      // Components barrels
      '@/components/ui',
      '@/components/shared',
      '@/components/data-table',
    ],
    // Bật cache persistent cho Turbopack trong dev mode
    turbopackFileSystemCacheForDev: true,
    // Tăng body size limit cho Server Actions (upload file lớn lên đến 50MB)
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },

  // Security Headers
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            // Content Security Policy (Report-Only mode for safe rollout)
            // Monitor violations before enforcing. Switch to 'Content-Security-Policy' when stable.
            key: 'Content-Security-Policy-Report-Only',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://phukiengiaxuong.com.vn https://img.vietqr.io",
              "font-src 'self'",
              "connect-src 'self' https://*.sentry.io",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ]
  },

  // Images config
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'phukiengiaxuong.com.vn',
      },
      {
        protocol: 'https',
        hostname: 'img.vietqr.io',
      },
    ],
  },
}

// Sentry configuration options
const sentryWebpackPluginOptions = {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Automatically annotate React components to show their full name in breadcrumbs and session replay
  reactComponentAnnotation: {
    enabled: true,
  },

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
}

// Wrap config with Sentry only if SENTRY_DSN is set
const sentryConfig = process.env.SENTRY_DSN 
  ? withSentryConfig(nextConfig, sentryWebpackPluginOptions)
  : nextConfig

// Wrap with bundle analyzer
export default withBundleAnalyzer(sentryConfig)
