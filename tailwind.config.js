module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          800: 'rgba(50, 51, 53, 0.85)',
        },
      },
    }, // 中文注释: 扩展默认主题
  },
  plugins: [], // 中文注释: 插件配置
}; 