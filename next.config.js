/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 中文注释: 使用现代的 remotePatterns 配置替代已弃用的 domains 配置
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.notion.so',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https', 
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

module.exports = nextConfig; // 中文注释: 导出 Next.js 配置 