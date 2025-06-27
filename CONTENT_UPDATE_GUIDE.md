# 📝 个人网站内容更新指南

## 🌐 修改中英文文案

### 文件位置
```
src/i18n/i18n.js
```

### 文案结构
```javascript
const resources = {
  en: {
    translation: {
      // 英文文案在这里
      aboutPara1: "您的英文About段落1...",
      zoomDescription: "Zoom工作经历英文描述...",
      // 更多英文文案...
    }
  },
  zh: {
    translation: {
      // 中文文案在这里  
      aboutPara1: "您的中文About段落1...",
      zoomDescription: "Zoom工作经历中文描述...",
      // 更多中文文案...
    }
  }
};
```

### 主要可修改的文案项目

#### About 段落内容
- `aboutPara1` - About第一段
- `aboutPara2` - About第二段  
- `aboutPara3` - About第三段
- `aboutPara4` - About第四段

#### 工作经历描述
- `zoomDescription` - Zoom工作描述
- `shimoDescription` - Shimo工作描述
- `seiueDescription` - Seiue工作描述
- `actionDescription` - Action工作描述

#### 密码弹窗相关
- `passwordHint1` - 密码提示文字
- `wechatContact` - 微信联系方式
- `emailContact` - 邮箱联系方式

## 🔗 修改 Notion 链接

### 文件位置
```
src/HomeAiCoding.js
```

### 查找并修改
搜索文件中的这一行：
```javascript
const notionUrl = 'https://www.notion.so/20258f61591a80a8bd47d569527b70ef?v=21d58f61591a80198a7b000c497dba0f&source=copy_link';
```

替换为您的新 Notion 链接：
```javascript
const notionUrl = '您的新Notion链接';
```

### 如果需要中英文不同链接
可以这样修改：
```javascript
const notionUrl = i18n.language === 'zh' 
  ? '中文Notion链接' 
  : '英文Notion链接';
```

## 🎨 修改项目图片

### 图片位置
```
public/ 目录下
```

### 替换图片
1. 将新的项目图片放入 `public/` 目录
2. 图片建议尺寸：185×124px 或等比例
3. 在 `src/HomeAiCoding.js` 中修改图片路径：

```javascript
//-------------- 图片资源常量 --------------
const imgFrame63 = "/您的新图片1.png"; // Frame 63
const imgFrame62 = "/您的新图片2.png"; // Frame 62  
// ... 其他图片
```

## 💾 保存和测试

### 开发环境测试
```bash
cd /Users/lanaya/Documents/工作/personal-web
npm run dev
```
访问 http://localhost:3001 查看效果

### 修改后需要重启
修改文案后，浏览器会自动刷新。如果没有，可以：
1. 按 Ctrl+C 停止开发服务器
2. 重新运行 `npm run dev`

## 🚀 部署到线上

### 方法1：Vercel (推荐，免费)

1. **准备代码**
```bash
# 在项目目录下
git init
git add .
git commit -m "初始版本"
```

2. **上传到 GitHub**
- 在 GitHub 创建新仓库
- 按照 GitHub 提示推送代码

3. **部署到 Vercel**
- 访问 https://vercel.com
- 用 GitHub 账号登录
- 点击 "Import Project"
- 选择您的仓库
- 点击 "Deploy"

### 方法2：Netlify (免费)

1. **打包项目**
```bash
npm run build
npm run export
```

2. **部署**
- 访问 https://netlify.com
- 将 `out` 文件夹拖拽到 Netlify
- 获得线上链接

### 方法3：GitHub Pages (免费)

1. **修改 next.config.js**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/personal-web', // 改为您的仓库名
  assetPrefix: '/personal-web/',
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
```

2. **部署**
```bash
npm run build
# 将 out 文件夹内容推送到 gh-pages 分支
```

## 📱 分享给招聘方

部署完成后，您会获得一个线上链接，例如：
- Vercel: `https://your-project.vercel.app`
- Netlify: `https://amazing-site-123.netlify.app`

### 建议的分享方式
1. **简历中添加作品集链接**
2. **邮件模板**：
   ```
   您好！
   
   这是我的在线作品集：[链接]
   密码：lanaya2024
   
   期待您的反馈！
   ```

## 🔧 常见问题

### Q: 修改文案后没有生效？
A: 检查语法是否正确，特别注意引号和逗号

### Q: 图片不显示？
A: 确保图片在 public 目录下，路径以 "/" 开头

### Q: 部署后样式有问题？
A: 可能需要调整 next.config.js 中的 basePath 设置

### Q: 想添加新的工作经历？
A: 在 HomeAiCoding.js 的 experiences 数组中添加新对象

---

🎉 **恭喜！您现在可以完全自主维护这个作品集网站了！** 