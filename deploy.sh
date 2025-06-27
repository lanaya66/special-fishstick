#!/bin/bash

# 🚀 个人网站快速部署脚本

echo "🎯 开始部署个人网站..."

# 检查是否已初始化 git
if [ ! -d ".git" ]; then
    echo "📦 初始化 Git 仓库..."
    git init
    git add .
    git commit -m "✨ 初始版本：个人作品集网站"
fi

# 构建项目
echo "🔨 构建项目..."
npm run build

echo "✅ 构建完成！"
echo ""
echo "🌐 部署选项："
echo "1. Vercel (推荐)："
echo "   - 访问 https://vercel.com"
echo "   - 导入此项目到 GitHub"
echo "   - 连接 Vercel 自动部署"
echo ""
echo "2. Netlify："
echo "   - 访问 https://netlify.com" 
echo "   - 拖拽 out 文件夹到页面"
echo ""
echo "📱 部署后记得分享链接给招聘方！"
echo "🔑 密码：lanaya2024" 