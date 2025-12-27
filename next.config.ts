import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Cho phép import từ các folder bên ngoài src/app
  transpilePackages: [],
  
  // Tắt strict mode tạm thời trong quá trình migration
  reactStrictMode: false,
  
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
      'date-fns',
      'zod',
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
  },

  // Images config
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
}

export default nextConfig
