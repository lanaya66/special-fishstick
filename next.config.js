/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['www.notion.so', 'images.unsplash.com'], // 中文注释: 配置允许的图像域
  },
};

module.exports = nextConfig; // 中文注释: 导出 Next.js 配置 