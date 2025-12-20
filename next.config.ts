import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Cho phép import từ các folder bên ngoài src/app
  transpilePackages: [],
  
  // Tắt strict mode tạm thời trong quá trình migration
  reactStrictMode: false,
  
  // Output standalone cho Docker deployment
  output: 'standalone',
  
  // Server external packages - Prisma 7 với driver adapter cần opt-out bundling
  serverExternalPackages: [
    '@prisma/client',
    'prisma',
    '@prisma/adapter-pg',
    'pg',
  ],
  
  // Experimental features
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons', 'recharts'],
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
