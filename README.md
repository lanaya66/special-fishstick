# 🎨 Lanaya 个人作品集网站

一个精美的个人产品设计师作品集网站，支持中英文切换，包含密码保护的项目详情入口。

## ✨ 功能特点

- 🌐 中英文双语支持
- 🔒 密码保护的项目详情
- 📱 响应式设计
- 🎭 精美的动画效果
- 🖼️ 项目图片展示
- ⚡ 基于 Next.js 构建

## 🚀 快速开始

### 开发环境运行
```bash
npm run dev
```
访问 http://localhost:3001

### 构建和部署
```bash
npm run deploy
```

## 📝 自定义内容

### 修改文案
编辑 `src/i18n/i18n.js` 文件中的文案内容

### 修改 Notion 链接
在 `src/HomeAiCoding.js` 中搜索并修改：
```javascript
const notionUrl = '您的Notion链接';
```

### 替换项目图片
1. 将图片放入 `public/` 目录
2. 在 `src/HomeAiCoding.js` 中更新图片路径

## 🌐 部署到线上

### 推荐：Vercel (免费)
1. 将代码推送到 GitHub
2. 在 https://vercel.com 导入项目
3. 自动部署完成

### 备选：Netlify (免费)
1. 运行 `npm run deploy`
2. 将 `out` 文件夹拖拽到 https://netlify.com

## 📱 分享作品集

部署完成后，您可以：
- 在简历中添加网站链接
- 分享给招聘方：密码 `lanaya2024`
- 发送给朋友查看

## 📋 目录结构

```
personal-web/
├── public/              # 静态资源（图片等）
├── src/
│   ├── HomeAiCoding.js  # 主要组件
│   └── i18n/
│       └── i18n.js      # 中英文文案
├── pages/               # Next.js 页面
├── styles/              # 样式文件
├── CONTENT_UPDATE_GUIDE.md  # 详细更新指南
└── deploy.sh            # 部署脚本
```

## 💡 更新内容的步骤

1. **修改文案**：编辑 `src/i18n/i18n.js`
2. **测试效果**：运行 `npm run dev`
3. **满意后部署**：运行 `npm run deploy`
4. **上传到平台**：拖拽到 Netlify 或推送到 Vercel

## 🆘 需要帮助？

查看 `CONTENT_UPDATE_GUIDE.md` 获取详细的更新指南，包括：
- 如何修改每个文案项目
- 如何添加新的工作经历
- 常见问题解决方案

---

🎉 **恭喜！您现在拥有了一个完全可自定义的专业作品集网站！** 