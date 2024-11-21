/** @type {import('next').NextConfig} */
const nextConfig = {
  // 启用静态页面生成
  output: 'standalone',
  
  // 图片优化配置
  images: {
    domains: ['res.cloudinary.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // 启用增量静态再生成
  experimental: {
    // 启用服务器组件
    serverComponents: true,
    // 启用并发特性
    concurrentFeatures: true,
    // 启用服务器操作
    serverActions: true,
  },

  // 页面缓存配置
  onDemandEntries: {
    // 页面在开发中保持活动的时间（毫秒）
    maxInactiveAge: 60 * 1000,
    // 同时保持活动的页面数
    pagesBufferLength: 5,
  },

  // 压缩配置
  compress: true,

  // 启用webpack优化
  webpack: (config, { dev, isServer }) => {
    // 生产环境优化
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          cacheGroups: {
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10,
              reuseExistingChunk: true,
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
  },
};

module.exports = nextConfig;
