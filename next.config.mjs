/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // 修复跨域警告
  experimental: {
    allowedDevOrigins: ['192.168.0.202', 'localhost'],
    // 优化路由滚动行为，减少fixed元素相关警告
    scrollRestoration: true,
  },
  // 生产环境禁用控制台日志
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development'
    }
  },
  // 优化编译配置
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // 开发模式优化
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            enforce: true,
          },
        },
      }
    }
    return config
  },
  async rewrites() {
    return [
      {
        source: '/admin-api/:path*',
        destination: 'https://wxapp.agrochainhub.com/admin-api/:path*',
      },
    ]
  },
}

export default nextConfig;
