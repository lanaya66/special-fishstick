import '../styles/globals.css'
import '../src/i18n/i18n'

//-------------- 全局应用组件 --------------
export default function App({ Component, pageProps }) {
  return (
    <div className="relative min-h-screen">
      {/* 中文注释: 主要页面内容 */}
      <Component {...pageProps} />
    </div>
  )
} 